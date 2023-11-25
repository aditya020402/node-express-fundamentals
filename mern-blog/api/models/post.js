import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    cover:String,
    author:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }
})


const Post = mongoose.model("Post",schema);

export default Post;