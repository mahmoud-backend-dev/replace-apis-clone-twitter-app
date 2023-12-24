import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import { allowTo } from '../controller/auth.controller.js'

import {
  createCommentValidator,
  getAllCommentsValidator,
  updateCommentValidator
} from '../utils/validators/comment.validator.js';

import {
  createComment,
  deleteComment,
  getAllComments,
  getSpecificComment,
  updateComment
} from "../controller/comment.controller.js";

router.post(
  '/add',
  protectRoutes,
  allowTo('user'),
  createCommentValidator,
  createComment
);

router.get(
  '/all',
  protectRoutes,
  allowTo('user'),
  getAllCommentsValidator,
  getAllComments
);

router.get(
  '/one/:id',
  protectRoutes,
  allowTo('user'),
  updateCommentValidator,
  getSpecificComment
);

router.patch(
  '/update/:id',
  protectRoutes,
  allowTo('user'),
  updateCommentValidator,
  updateComment
);

router.delete(
  '/delete/:id',
  protectRoutes,
  allowTo('user'),
  updateCommentValidator,
  deleteComment
);

export default router;