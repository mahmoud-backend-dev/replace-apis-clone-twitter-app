import { Server } from "socket.io";

export const socketConnection = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('connected', socket.id);
    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
    });
  });
  return io;
};