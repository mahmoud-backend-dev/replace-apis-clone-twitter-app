import asyncHandler from 'express-async-handler';
import { Server } from "socket.io";
import Chat from "../models/Chat.js";

export const socketConnection = asyncHandler(async (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('connected', socket.id);
    let room_id;
    socket.on('join_room', (user_id) => {
      room_id = user_id;
      socket.join(user_id);
    })
    socket.on('message', async (message) => {
      io.to(socket.id).emit('my_message', message);
      socket.to(room_id).emit('message', message);
      await Chat.create(message);
    })
    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
    });
  });
  return io;
});