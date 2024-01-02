import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import { getChat, getRoomsUser } from "../controller/chat.controller.js";

router.get(
  '/one/:idOne/:idTwo',
  protectRoutes,
  getChat
)

router.get(
  '/rooms/:id',
  protectRoutes,
  getRoomsUser
)

export default router;