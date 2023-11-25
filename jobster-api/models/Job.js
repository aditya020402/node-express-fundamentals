import mongoose from "mongoose";

const schema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,"please provide company name"],
        maxlength:50,
    },
    position:{
        type:String,
        required:[true,"please provide position"],
        maxlength:50,
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:[true,"please provide user"],
    },
    jobType:{
        type:String,
        enum:['full-time','part-time','remote','internship'],
        default:"full-time",
    },
    jobLocation:{
        type:String,
        default:'my-city',
        required:true,
    },
},
    {timestamps:true}
)

const Job = mongoose.model("Job",schema);

export default Job;