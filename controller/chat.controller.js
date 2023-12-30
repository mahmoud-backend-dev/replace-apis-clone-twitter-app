import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Chat from '../models/Chat.js';

export const getChat = asyncHandler(async (req, res) => {
  const chat = await Chat
    .find(
      {
        $or:
          [
            { sender: req.params.idOne, recipient: req.params.idTwo },
            { sender: req.params.idOne, recipient: req.params.idTwo },
          ]
      }
    )
    .sort({ createdAt: 1 });
  res.status(StatusCodes.OK).json({
    status: 'success',
    chat,
  });
});