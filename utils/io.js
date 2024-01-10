import asyncHandler from 'express-async-handler';
import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import User from '../models/User.js';
import { removeDuplicatedRoom } from '../controller/chat.controller.js';

const checkString = (number) => {
  if (typeof number !== 'string')
    return false
  return true;
}

const checkUserExist = async (id) => {
  const user = await User.findById(id)
  if (!user)
    return false
  return true;
}

const validationMessage = async (message) => {
  if (!message || typeof message !== 'object') {
    return false
  }
  if (!message.sender || !message.recipient || !message.message) {
    return false
  }
  if (typeof message.sender !== 'string') {
    return false
  }
  if (typeof message.recipient !== 'string') {
    return false
  }
  if (typeof message.message !== 'string') {
    return false
  }
  if (!await checkUserExist(message.sender) && !await checkUserExist(message.recipient))
    return false
  return message;
}

const getAllRooms = async (id) => {
  const chat = await Chat.find({ $or: [{ sender: id }, { recipient: id }]});
  const rooms = removeDuplicatedRoom(chat);
  return rooms.map((room) => room.room);
}

export const socketConnection = asyncHandler(async (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('connected', socket.id);
    let room_id;
    socket.on('join_room', async (number_id) => {
      console.log('join_room', number_id);
      if (checkString(number_id)) {
        room_id = number_id;
        socket.join(number_id);
      }
    })
    socket.on('message', async (message) => {
      console.log({ message });
      message = await validationMessage(message);
      io.to(socket.id).emit('my_message', message);
      socket.to(room_id).emit('message', message);
      if (message !== false && checkString(room_id)) {
        await Chat.create({...message, room: room_id});
      }
    })
    socket.on('get_rooms', async (id) => {
      console.log('get_rooms', id);
      if (checkString(id)) {
        const rooms = await getAllRooms(id);
        io.to(socket.id).emit('get_rooms', rooms);
      }
    })
    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
    });
  });
  io.on('error', (error) => {
    console.error('Socket.IO error:', error.message);
  });
  return io;
});