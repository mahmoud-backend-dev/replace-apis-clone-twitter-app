import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Repost from '../models/Repost.js';
import Comment from '../models/Comment.js';

export const createRepost = asyncHandler(async (req, res) => {
  const { post, text } = req.body;
  const repost = await Repost.create({ post, text, user: req.user._id });
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    repost,
  });
});

export const updateRepost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const repost = await Repost.findById(req.params.id);
  if (text) repost.text = text;
  await repost.save();
  res.status(StatusCodes.OK).json({
    status: 'success',
    repost,
  });
});

export const getSpecificRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findById(req.params.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    repost,
  });
})

export const deleteRepost = asyncHandler(async (req, res) => {
  await Repost.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ repost: req.params.id });
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Repost deleted successfully',
  });
});

export const addLikeToRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  const io = req.app.get('IO');
  io.to(req.params.id).emit('number_of_likes', repost.likes.length);
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: repost.likes,
  });
});

export const removeLikeFromRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  const io = req.app.get('IO');
  io.to(req.params.id).emit('number_of_likes', repost.likes.length);
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: repost.likes,
  });
});

export const getAllLikesFromRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findById(req.params.id).populate({
    path: 'likes',
    select: 'firstName lastName image',
  });
  if(!repost) throw new BadRequest('Repost not found');
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: repost.likes,
  });
})