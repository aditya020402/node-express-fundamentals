import Task from "../models/tasks.js";
import asyncWrapper from "../middleware/async.js";
import {createCustomError} from "../errors/custom-error.js";


export const getAllTasks = asyncWrapper(async(req,res)=>{
    const tasks = await Task.find({});
    res.status(200).json({tasks});
})

export const createTask = asyncWrapper(async(req,res)=>{
    const task = await Task.create(req.body)
    return res.status(200).json({task});
});

export const getTask = asyncWrapper(async(req,res,next)=>{
    const {id:taskId} = req.params;
    const task = await Task.findOne({_id:taskId});
    if(!task){
        return next(createCustomError(`No task was found with the ${taskId} id`,404));
    }
    return res.status(200).json({task});
})


export const deleteTask = asyncWrapper(async(req,res,next)=>{
    const {id:taskId} = req.params;
    const task = await Task.findOneAndDelete({_id:taskId});
    if(!task){
        return next(createCustomError(`No task was found with the ${id} id`,404));
    }
    res.status(200).json({task});
})


export const updateTask = asyncWrapper(async(req,res,next)=>{
    const {id:taskId} = req.params;
    const task = await Task.findOneAndUpdate({_id:taskId},req.body,{
        new:true,
        runValidators:true,
    });
    if(!task){
        return next(createCustomError(`No task with ${taskId} id`,404));
    }
    return res.status(200).json({task});
})

