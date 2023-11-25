import Post from "../models/post.js";
import CustomError from "../errors/customError.js";
import fs from "fs";
import jwt from "jsonwebtoken";

export const postBlog = async(req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    const {token} = req.cookies;
    const tokenver = jwt.verify(token,process.env.JWT_SECRET);
    if(!tokenver){
        throw new CustomError("Please login again token auth failed");
    }
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
        title,summary,content,cover:newPath,author:info.id,
    });
    if(!postDoc){
        throw new CustomError("Post new created some error.");
    }
    res.status(404).json(postDoc);
}

export const editPost = async(req,res) => {
     let newPath = null;
     if(req.file){
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path,newPath);
     }
     const {token} = req.cookies;
     const tokenval = jwt.verify(token,process.env.JWT_SECRET);
     if(!tokenval){
        throw new CustomError("Invalid Login Please try again");
     }
     const {id,title,summary,content} = req.body;
     const postDoc = await Post.findById(id);
     if(postDoc){
        throw new CustomError("The post with this id does not exist please enter corret id");
     }
     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(tokenval.id);

     if(!isAuthor){
        throw new CustomError("You are not the author , so you cannot make changes to this post")
     }
     const postsav = await postDoc.update({title,summary,content,cover:newPath?newPath:postDoc.cover});
     if(!postsav){
        throw new CustomError("The post was not saved please try again");
     }
     res.status(404).json(postsav);
}

export const getAllPost = async(req,res) => {
    const allPost = await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
    if(!allPost){
        throw new CustomError("The post could not be fetched please try again later");
    }
    res.status(404).json(allPost);
}

export const getPost = async(req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    if(postDoc){
        throw new CustomError("The post could not be found please try again.");
    }
    res.json(postDoc);
}