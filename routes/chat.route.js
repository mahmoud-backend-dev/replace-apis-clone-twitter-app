import { Router } from "express";
const router = Router();

import protectRoutes from "../middleware/auth.middleware.js";
import { getChat } from "../controller/chat.controller.js";

router.get(
  '/one/:idOne/:idTwo',
  protectRoutes,
  getChat
)

export default router;