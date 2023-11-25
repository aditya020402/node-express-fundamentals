import CustomError from "../errors/customError.js";

const errorHandler = (err,req,res,next) => {
    if(err instanceof CustomError){
       return  res.send(err.message);
    }
    return res.send("Something went wrong please try again after some time.");
}