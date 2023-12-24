import { body, param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import Post from '../../models/Post.js';
import Repost from '../../models/Repost.js';

export const createRepostValidator = [
  body('post').isMongoId().withMessage('post required and must be mongoId')
    .custom(async (id) => {
      const post = await Post.findById(id);
      if (!post) throw new BadRequest('post not found');
      return true;
    }),
  validatorMiddleware
];

export const updateRepostValidator = [
  param('id').custom(async (id, { req }) => {
    const repost = await Repost.findOne({ _id: id, user: req.user._id });
    if (!repost) throw new BadRequest('post not found or you are not the owner of this repost');
    return true;
  }),
  validatorMiddleware
];

export const addLikeToRepostValidator = [
  param('id').custom(async (id) => {
    const repost = await Repost.findById(id);
    if (!repost) throw new BadRequest('repost not found');
    return true;
  }),
  validatorMiddleware
];

export const removeLikeFromRepostValidator = [
  param('id').custom(async (id, { req }) => {
    const repost = await Repost.findById(id);
    if (!repost) throw new BadRequest('repost not found');
    if (!repost.likes.includes(req.user._id)) throw new BadRequest('You have not liked this repost');
    return true;
  }),
  validatorMiddleware
];