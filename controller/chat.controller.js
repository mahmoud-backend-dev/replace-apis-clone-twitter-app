import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Chat from '../models/Chat.js';





// Remove duplicates based on the "room" property
export const removeDuplicatedRoom = (arr) =>
  arr.filter(
    (object, index, self) =>
      index === self.findIndex((room) => room.room === object.room)
  );

export const getChat = asyncHandler(async (req, res) => {
  const { idOne, idTwo } = req.params;
  const chat = await Chat
    .find(
      {
        $or:
          [
            { sender: idOne, recipient: idTwo },
            { sender: idTwo, recipient: idOne },
          ]
      }
    )
    .sort({ createdAt: 1 });
  res.status(StatusCodes.OK).json({
    status: 'success',
    chat,
  });
});

export const getRoomsUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.find({ $or: [{ sender: id }, { recipient: id }] });
  const rooms = removeDuplicatedRoom(chat);
  res.status(StatusCodes.OK).json({
    status: 'success',
    rooms: rooms.map((room) => room.room),
  });
})