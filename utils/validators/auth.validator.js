import { body } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'

export const signupValidator = [
  body('email')
    .isEmail().withMessage('Email required and E-mail must be valid format'),
  body('password').isString().withMessage('password required')
    .isLength({ min: 8 }).withMessage('Too short password'),
  body('confirmPassword').isString().withMessage('confirmPassword required')
    .custom((val, { req }) => {
      if (val !== req.body.password)
        throw new BadRequest('Password confirmation incorrect')
      return true
    }),
  body('firstName').isString().withMessage('firstName required'),
  body('lastName').isString().withMessage('lastName required'),
  body('dateOfBirth').isDate({ format: 'YYYY-MM-DD' }).withMessage('dateOfBirth required and must be valid format'),
  validatorMiddleware,
];

export const verifyForSignupValidator = [
  body('token').notEmpty().withMessage('token required'),
  validatorMiddleware,
];


export const loginValidator = [
  body('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('E-mail must be valid format'),
  body('password').notEmpty().withMessage('password required')
    .isLength({ min: 8 }).withMessage('Too short password'),
  validatorMiddleware,
];


export const forgetPasswordValidator = [
  body('email').notEmpty().withMessage('email required'),
  validatorMiddleware,
];

export const resetPasswordValidator = [
  body('email').notEmpty().withMessage('email required'),
  body('newPassword').notEmpty().withMessage('newPassword required'),
  validatorMiddleware,
];




