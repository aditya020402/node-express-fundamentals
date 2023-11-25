import Job from "../models/Job.js";
import StatusCodes from "http-status-codes";
import {BadRequestError,NotFoundError} from "../errors/index.js";
import mongoose from "mongoose";
import moment from "moment";


export const getAllJobs = async(req,res)=>{
    const {search,status,jobType,sort} = req.query;
    console.log(search);
    const queryObject = {
        // createdBy:req.user.userId,
    }
    if(search){
        queryObject.position={$regex:search,$options:"i"};
    }
    if(status && status !== 'all'){
        queryObject.status=status;
    }
    if(jobType && jobType !== 'all'){
        queryObject.jobType = jobType;
    }
    console.log(queryObject);
    let result = Job.find(queryObject);

    if(sort === 'latest'){
        result = result.sort('-createdAt');
    }
    if(sort === 'oldest'){
        result = result.sort('createdAt');
    }
    if(sort === 'a-z'){
        result = result.sort('position');
    }
    if(sort === 'z-a'){
        result=result.sort('-position');
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit;
    result = result.skip(skip).limit(limit);
    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs/limit);
    res.status(StatusCodes.OK).json({jobs,totalJobs,numOfPages});
}


export const getJob = async(req,res) => {
    const userId = req.userId;
    const jobId = req.params.id;
    const job = await Job.findOne({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};


export const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

export const updateJob = async(req,res) => {
    const {company,position} = req.body;
    const {userId} = req.user;
    const jobId = req.params.id;
    if(company === "" || position === "") {
        throw new BadRequestError(`Company or position fields cannot be empty`);
    }
    const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});
    if(!job){
        throw new NotFoundError(`No job with id ${id}`);
    }
    res.status(StatusCodes.OK).json({
        job
    });
}

export const deleteJob = async(req,res) => {
    const userId = req.user;
    const jobId = user.params;
    const job = await Job.findByIdAndRemove({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
}

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  console.log(stats);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  console.log(monthlyApplications);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};