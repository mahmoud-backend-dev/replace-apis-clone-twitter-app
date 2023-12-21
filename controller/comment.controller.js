import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import  BadRequest  from '../errors/badRequest.js';
import Comment from '../models/Comment.js';


export const createComment = asyncHandler(async (req, res) => {
  const { text, post } = req.body;
  const comment = await Comment.create({ text, post, user: req.user._id });
  const io = req.app.get('IO');;
  io.to(post).emit('comment', comment);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    comment,
  });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id });
  res.status(StatusCodes.OK).json({
    status: 'success',
    comments,
  });
});

export const getSpecificComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    comment,
  });
});

export const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const io = req.app.get('IO');
  const comment = await Comment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { text },
    { new: true }
  );
  io.to(comment.post).emit('updatedComment', comment);
  res.status(StatusCodes.OK).json({
    status: 'success',
    comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const io = req.app.get('IO');
  const comment = await Comment.findOneAndDelete(
    { _id: req.params.id, user: req.user._id },
  );
  io.to(comment.post).emit('deletedComment', comment);
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Comment deleted successfully',
  });
});

