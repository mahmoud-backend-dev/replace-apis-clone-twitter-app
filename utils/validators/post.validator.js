import { body, param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

export const createPostValidator = [
  body('text').notEmpty().withMessage('text required'),
  validatorMiddleware,
];

export const updatePostValidator = [
  param('id').custom(async (id, { req }) => {
    const post = await Post.findOne({ _id: id, user: req.user._id });
    if (!post) throw new BadRequest('Post not found or you are not the owner of this post');
    return true;
  }),
  validatorMiddleware,
];

export const addLikeValidator = [
  param('id').custom(async (id, { req }) => {
    const post = await Post.findOne({ _id: id, user: req.user._id });
    if (!post) throw new BadRequest('Post not found or you are not the owner of this post');
    return true;
  }),
  body('user').isMongoId().withMessage('user required and must be mongoId')
    .custom(async (id) => {
      const user = await User.findById(id);
      if (!user) throw new BadRequest('User not found');
      return true;
    }),
  validatorMiddleware,
];

export const deletedLikeValidator = [
  param('id').custom(async (id, { req }) => {
    const post = await Post.findOne({ _id: id, user: req.user._id });
    if (!post) throw new BadRequest('Post not found or you are not the owner of this post');
    return true;
  }),
  body('user').isMongoId().withMessage('user required and must be mongoId')
    .custom(async (id,{req}) => {
      const user = await User.findById(id);
      if (!user) throw new BadRequest('User not found');
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(id)) throw new BadRequest('User not liked this post');
      return true;
    }),
  validatorMiddleware,
]

