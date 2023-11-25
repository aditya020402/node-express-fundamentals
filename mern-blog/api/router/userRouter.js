import express from "express";
const router = express.Router();

import {register,login,profile,logout} from "../controllers/user.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").post(profile);
router.route("/logout").post(logout);


export default router;