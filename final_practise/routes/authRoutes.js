import express from "express";
const router = express.Router();

import {authenticateUser} from "../middleware/authentication.js";

import {register,login,logout,verifyEmail,forgotPassword,resetPassword} from "../controllers/authController.js";


router.route("/register").post(register);
router.route("/login").post(login)
router.route("/logout").delete(authenticateUser,logout);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(resetPassword);
router.route("/forgot-password").post(forgotPassword);

export default router;