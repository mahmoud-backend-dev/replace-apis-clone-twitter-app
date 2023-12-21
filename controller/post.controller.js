import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import { setPagination } from '../utils/pagination.js';

export const createPost = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;
  const post = await Post.create({ text, image, video, user: req.user._id });
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    post,
  });
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const { limit, pagination, skip } = await setPagination(Post, req);
  const allPosts = await Post.aggregate([
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments',
      }
    }, {
      $project: {
        text: 1,
        image: 1,
        video: 1,
        likes: 1,
        user: 1,
        numberOfComments: { $size: '$comments' },
      }
    },
    { $limit: limit },
    { $skip: skip }
  ]);
  res.status(StatusCodes.OK).json({
    status: 'success',
    count: allPosts.length,
    pagination,
    allPosts,
  });
});

export const getSpecificPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  res.status(StatusCodes.OK).json({
    status: 'success',
    post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.postId, user: req.user._id },
    { text, video, image },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    status: 'success',
    post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.postId, user: req.user._id });
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Post deleted successfully',
  });
});

export const addLike = asyncHandler(async (req, res) => {
  const io = req.app.get('IO');
  console.log(io);
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  io.to(req.params.postId).emit('number_of_likes', post.likes.length);
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: post.likes,
  });
});

export const removeLike = asyncHandler(async (req, res) => {
  const io = req.app.get('IO');
  console.log(io);
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  io.to(req.params.postId).emit('number_of_likes', post.likes.length);
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: post.likes,
  });
});

export const getAllLikes = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate({
    path: 'likes',
    select: 'name image',
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    likes: post.likes,
  });
});