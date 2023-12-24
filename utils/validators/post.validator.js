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
  param('id').custom(async (id) => {
    const post = await Post.findById(id);
    if (!post) throw new BadRequest('Post not found');
    return true;
  }),
  validatorMiddleware,
];

export const deletedLikeValidator = [
  param('id').custom(async (id, { req }) => {
    const post = await Post.findById(id);
    if (!post) throw new BadRequest('Post not found');
    if(!post.likes.includes(req.user._id)) throw new BadRequest('You have not liked this post');
    return true;
  }),
  validatorMiddleware,
]

