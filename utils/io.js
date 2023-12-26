import asyncHandler from 'express-async-handler';
import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import NotFound from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js';
import { Schema } from 'mongoose';

const checkUserExist = async (user_id, title) => {
  const userExist = await User.exists({ _id: user_id });
  if (!userExist) {
    throw new NotFound(`User not found ${title}`);
  }
  return;
}

const validationMessage = async (message) => {
  if(!message || typeof message !== 'object') {
    throw new BadRequest('Message is required and must be object');
  }
  if (!message.sender || !message.recipient || !message.message) {
    throw new BadRequest('Sender, recipient and message are required');
  }
  if (typeof message.sender !== Schema.Types.ObjectId) {
    throw new BadRequest('Sender must be ObjectId');
  }
  if (typeof message.recipient !== Schema.Types.ObjectId) {
    throw new BadRequest('Recipient must be ObjectId');
  }
  if (typeof message.message !== 'string') {
    throw new BadRequest('Message must be string');
  }
  await checkUserExist(message.sender, 'for sender');
  await checkUserExist(message.recipient, 'for recipient');
  return message;
}

export const socketConnection = asyncHandler(async (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('connected', socket.id);
    let room_id;
    socket.on('join_room', async (user_id) => {
      console.log('join_room', user_id);
      await checkUserExist(user_id, 'for join room');
      room_id = user_id;
      socket.join(user_id);
    })
    socket.on('message', async (message) => {
      console.log('message', message);
      message = await validationMessage(message);
      io.to(socket.id).emit('my_message', message);
      socket.to(room_id).emit('message', message);
      await Chat.create(message);
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