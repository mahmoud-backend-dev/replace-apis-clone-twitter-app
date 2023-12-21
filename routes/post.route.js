import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import {allowTo} from '../controller/auth.controller.js'
import {
  addLikeValidator,
  createPostValidator,
  deletedLikeValidator,
  updatePostValidator,
} from "../utils/validators/post.validator.js";

import { 
  addLike,
  createPost,
  deletePost,
  getAllLikes,
  getAllPosts,
  getSpecificPost,
  removeLike,
  updatePost
} from "../controller/post.controller.js";

router.post(
  '/',
  protectRoutes,
  allowTo('user'),
  createPostValidator,
  createPost
);

router.patch(
  '/:id',
  protectRoutes,
  allowTo('user'),
  updatePostValidator,
  updatePost
);

router.delete(
  '/:id',
  protectRoutes,
  allowTo('user'),
  updatePostValidator,
  deletePost
);

router.get(
  '/',
  protectRoutes,
  allowTo('user'),
  getAllPosts
);

router.get(
  '/:id',
  protectRoutes,
  allowTo('user'),
  updatePostValidator,
  getSpecificPost
);

router.post(
  '/:id/like',
  protectRoutes,
  allowTo('user'),
  addLikeValidator,
  addLike
);

router.delete(
  '/:id/like',
  protectRoutes,
  allowTo('user'),
  deletedLikeValidator,
  removeLike
);

router.get(
  '/:id/all-like',
  protectRoutes,
  allowTo('user'),
  deletedLikeValidator,
  getAllLikes
);

export default router;