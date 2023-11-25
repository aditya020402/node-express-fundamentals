import mongoose from "mongoose";


const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"must provide a name"],
        trim:true,
        maxlength:[20,'name cannot be more than 20 characters'],
    },
    completed:{
        type:Boolean,
        default:false,
    },
})

const Task = mongoose.model("tasks",schema);

export default Task;


