import express from "express";
const router = express.Router();
import multer from "multer";
const uploadMiddleware = multer({dest:"uploads/"});

import {postBlog,editPost,getAllPost,getPost} from "../controllers/post.js";


router.route("/").post(uploadMiddleware.single('file'),postBlog).put(uploadMiddleware.single('file'),editPost).get(getAllPost);
router.route("/:id").get(getPost);

export default router;