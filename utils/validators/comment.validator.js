import { body, param, query } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
import Repost from '../../models/Repost.js';

export const createCommentValidator = [
  body('post').optional().isMongoId().withMessage('post required and must be mongoId')
    .custom(async (id) => {
      const post = await Post.findById(id);
      if (!post) throw new BadRequest('post not found');
      return true;
    }),
  body('repost').optional().isMongoId().withMessage('repost required and must be mongoId')
    .custom(async (id) => {
      const repost = await Repost.findById(id);
      if (!repost) throw new BadRequest('repost not found');
      return true;
    }),
  body('text').isString().withMessage('text required'),
  validatorMiddleware
];

export const getAllCommentsValidator = [
  query('post').optional().custom(async (id) => {
    const post = await Post.findById(id);
    if (!post) throw new BadRequest('post not found');
    return true;
  }),
  query('repost').optional().custom(async (id) => { 
    const repost = await Repost.findById(id);
    if (!repost) throw new BadRequest('repost not found');
    return true;
  }),
  validatorMiddleware
];

export const updateCommentValidator = [
  param('id').custom(async (id, { req }) => {
    const comment = await Comment.findOne({ _id: id, user: req.user._id });
    if (!comment) throw new BadRequest('post not found or you are not the owner of this comment');
    return true;
  }),
  validatorMiddleware
]