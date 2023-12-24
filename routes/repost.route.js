import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import { allowTo } from "../controller/auth.controller.js";
import {
  createRepostValidator,
  updateRepostValidator,
  addLikeToRepostValidator,
  removeLikeFromRepostValidator,
} from "../utils/validators/repost.validator.js";
import {
  createRepost,
  deleteRepost,
  getSpecificRepost,
  updateRepost,
  addLikeToRepost,
  removeLikeFromRepost,
  getAllLikesFromRepost,
} from "../controller/repost.controller.js";

router.post(
  '/add',
  protectRoutes,
  allowTo('user'),
  createRepostValidator,
  createRepost
);

router.get(
  '/one/:id',
  protectRoutes,
  allowTo('user'),
  updateRepostValidator,
  getSpecificRepost
);

router.patch(
  '/update/:id',
  protectRoutes,
  allowTo('user'),
  updateRepostValidator,
  updateRepost
);

router.delete(
  '/delete/:id',
  protectRoutes,
  allowTo('user'),
  updateRepostValidator,
  deleteRepost
);

router.post(
  '/:id/like',
  protectRoutes,
  allowTo('user'),
  addLikeToRepostValidator,
  addLikeToRepost
);

router.delete(
  '/:id/like',
  protectRoutes,
  allowTo('user'),
  removeLikeFromRepostValidator,
  removeLikeFromRepost
);

router.get(
  '/:id/all-like',
  protectRoutes,
  allowTo('user'),
  getAllLikesFromRepost
);
export default router;