import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Chat from '../models/Chat.js';

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