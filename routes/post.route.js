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
  getAllMyPosts,
  getAllPosts,
  getSpecificPost,
  removeLike,
  updatePost
} from "../controller/post.controller.js";

router.post(
  '/add',
  protectRoutes,
  allowTo('user'),
  createPostValidator,
  createPost
);

router.patch(
  '/update/:id',
  protectRoutes,
  allowTo('user'),
  updatePostValidator,
  updatePost
);

router.delete(
  '/delete/:id',
  protectRoutes,
  allowTo('user'),
  updatePostValidator,
  deletePost
);

router.get(
  '/all/following',
  protectRoutes,
  allowTo('user'),
  getAllPosts
);

router.get(
  '/all/my-posts',
  protectRoutes,
  allowTo('user'),
  getAllMyPosts
);

router.get(
  '/one/:id',
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
  updatePostValidator,
  getAllLikes
);

export default router;