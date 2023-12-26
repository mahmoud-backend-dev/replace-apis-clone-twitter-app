import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import { allowTo } from '../controller/auth.controller.js'

import {
  addFollowingValidator,
  removeFollowingValidator,
  changePasswordValidator,
} from '../utils/validators/user.validator.js';

import { 
  addFollowers,
  removeFollowers,
  changePassword,
  getFollowersMe,
  getFollowersUserById,
  getFollowingMe,
  getFollowingUserById,
} from "../controller/user.controller.js";

router.patch(
  '/add-follower',
  protectRoutes,
  allowTo('user'),
  addFollowingValidator,
  addFollowers
);

router.patch(
  '/remove-follower',
  protectRoutes,
  allowTo('user'),
  removeFollowingValidator,
  removeFollowers
);

router.get(
  '/following/:id',
  protectRoutes,
  allowTo('user'),
  getFollowingUserById
);

router.get(
  '/followers/:id',
  protectRoutes,
  allowTo('user'),
  getFollowersUserById
);

router.get(
  '/following-me',
  protectRoutes,
  allowTo('user'),
  getFollowingMe
);

router.get(
  '/followers-me',
  protectRoutes,
  allowTo('user'),
  getFollowersMe
);

router.patch(
  '/change-password',
  protectRoutes,
  allowTo('user'),
  changePasswordValidator,
  changePassword
);

export default router;