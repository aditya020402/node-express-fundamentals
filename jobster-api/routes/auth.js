import express from "express";
const router = express.Router();
import authenticatedUser from "../middleware/authentication.js";

import testUser from "../middleware/testUser.js";
import rateLimiter from "express-rate-limit";


const apiLimiter = rateLimiter({
    windowMs:15*60*1000,
    max:10,
    message:{
        msg:"Too many request from this IP, please try again after 15 minutes",
    }
});

import {register,login,updateUser} from "../controllers/auth.js";


router.route("/register").post(apiLimiter,register);
router.route("/login").post(apiLimiter,login);
router.route("/updateUser").patch(authenticatedUser,testUser,updateUser);

export default router;

