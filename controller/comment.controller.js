import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import  BadRequest  from '../errors/badRequest.js';
import Comment from '../models/Comment.js';
import { setPagination } from '../utils/pagination.js';


export const createComment = asyncHandler(async (req, res) => {
  const { text, post, repost} = req.body;
  if (post && repost) throw new BadRequest('post or repost choose one');
  if (!post && !repost) throw new BadRequest('post or repost required');
  if (post) {
    const comment = await Comment.create({ text, post, user: req.user._id });
    const io = req.app.get('IO');
    io.to(post).emit('comment', comment);
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      comment,
    });
  }
  if (repost) { 
    const comment = await Comment.create({ text, repost, user: req.user._id });
    const io = req.app.get('IO');
    io.to(repost).emit('comment', comment);
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      comment,
    });
  }
});

export const getAllComments = asyncHandler(async (req, res) => {
  const { limit, pagination, skip } = await setPagination(Comment, req);
  if (req.query.post && req.query.repost) throw new BadRequest('post or repost query choose one ');
  if (!req.query.post && !req.query.repost) throw new BadRequest('post or repost query required');
  if (req.query.post) {
    const comments = await Comment.find({ post: req.query.post }).limit(limit).skip(skip);
    res.status(StatusCodes.OK).json({
      status: 'success',
      count: comments.length,
      pagination,
      comments,
    });
  }
  if (req.query.repost) {
    const comments = await Comment.find({ repost: req.query.repost }).limit(limit).skip(skip);
    res.status(StatusCodes.OK).json({
      status: 'success',
      count: comments.length,
      pagination,
      comments,
    });
  }
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

