import { Router } from "express";
const router = Router();

import {
  forgetPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  signupValidator,
  verifyForSignupValidator
} from "../utils/validators/auth.validator.js";

import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verifyForPassword,
  verifyForSignup
} from "../controller/auth.controller.js";




router.post('/signup', signupValidator, signup);
router.post('/verify-signup', verifyForSignupValidator, verifyForSignup);
router.post('/login', loginValidator, login);
router.post('/forget-password', forgetPasswordValidator, forgetPassword);
router.post('/verify-password', verifyForSignupValidator, verifyForPassword);
router.patch('/reset-password', resetPasswordValidator, resetPassword);


export default router;