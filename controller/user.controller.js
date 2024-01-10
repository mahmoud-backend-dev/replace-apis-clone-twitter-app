import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const getFollowing = async (model,id) => {
  return await model.findById(id).populate({
    path: 'following',
    select: '_id firstName lastName image',
  });
};

const getFollowers = async (model,id) => { 
  return await model.findById(id).populate({
    path: 'followers',
    select: '_id firstName lastName image',
  });
}

export const addFollowers = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.body.follow,
    { $addToSet: { followers: req.user._id } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { following: req.body.follow } }
  );
  res.status(StatusCodes.OK).json({
    success: "success",
    following: {
      _id: user._id,
      following: user.followers,
    },
  });
});

export const removeFollowers = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.body.follow,
    { $pull: { followers: req.user._id } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { following: req.body.follow }, }
  );
  res.status(StatusCodes.OK).json({
    success: "success",
    following: {
      _id: user._id,
      following: user.followers,
    },
  });
});

export const getFollowingUserById = asyncHandler(async (req, res) => {
  const user = await getFollowing(User,req.params.id);
  res.status(StatusCodes.OK).json({
    success: "success",
    count: user.following.length,
    following: user.following,
  });
});

export const getFollowersUserById = asyncHandler(async (req, res) => {
  const user = await getFollowers(User, req.params.id);
  res.status(StatusCodes.OK).json({
    success: "success",
    count: user.followers.length,
    followers: user.followers,
  });
});

export const getFollowingMe = asyncHandler(async (req, res) => {
  const user = await getFollowing(User,req.user._id);
  res.status(StatusCodes.OK).json({
    success: "success",
    count: user.following.length,
    following: user.following,
  });
});

export const getFollowersMe = asyncHandler(async (req, res) => {
  const user = await getFollowers(User, req.user._id);
  res.status(StatusCodes.OK).json({
    success: "success",
    count: user.followers.length,
    followers: user.followers,
  });
})

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.password = req.body.newPassword;
  await user.hashedPass();
  await user.save();
  res.status(StatusCodes.OK).json({
    success: "success",
    message: 'Password changed successfully',
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(StatusCodes.OK).json({
    success: "success",
    count: users.length,
    users,
  });
})