import { body } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import User from '../../models/User.js';

export const addFollowingValidator = [
  body('follow').isMongoId().withMessage('following required and must be ObjectId')
    .custom(async (val, { req }) => {
      const userExist = await User.findById(val);
      if (val === req.user._id.toString()) {
        throw new BadRequest('You can\'t follow yourself');
      }
      if (!userExist) {
        throw new BadRequest('User not found');
      }
      if (userExist.followers.includes(req.user._id)) {
        throw new BadRequest('You already follow this user');
      }
      return true;
    }),
  validatorMiddleware,
];

export const removeFollowingValidator = [
  body('follow').isMongoId().withMessage('following required and must be ObjectId')
    .custom(async (val, { req }) => {
      const userExist = await User.findById(val);
      if (val === req.user._id.toString()) {
        throw new BadRequest('You can\'t unfollow yourself');
      }
      if (!userExist) {
        throw new BadRequest('User not found');
      }
      if (!userExist.followers.includes(req.user._id)) {
        throw new BadRequest('You not follow this user');
      }
      return true;
    }),
  validatorMiddleware,
];

export const changePasswordValidator = [
  body('oldPassword').isString().withMessage('oldPassword required')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (!await user.comparePass(val)) {
        throw new BadRequest('Old password is incorrect');
      }
      return true;
    }),
  body('newPassword').notEmpty().withMessage('newPassword required')
    .isLength({ min: 8 }).withMessage('newPassword must be at least 8 characters long'),
  validatorMiddleware,
];
