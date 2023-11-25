import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please enter a username"],
        min:4,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

const User = mongoose.model("User",schema);

export default User;