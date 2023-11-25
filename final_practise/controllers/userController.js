import User from "../models/User.js";
import StatusCodes from "http-status-codes";
import {BadRequestError,NotFoundError,UnauthenticatedError} from "../errors/index.js";
import {createTokenUser,attachCookieToResponse,checkPermissions} from "../utils/index.js";

export const getAllUsers = async(req,res) => {
    const users = await User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
};

export const getSingleUser = async(req,res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password');
    if(!user){
        throw new NotFoundError(`No User with id :${req.params.id}`);
    }
    checkPermissions(req.user,user._id);
    res.status(StatusCodes.OK).json({user});
};

export const showCurrentUser = async(req,res) => {
    res.status(StatusCodes.OK).json({user:req.user});
}


export const updateUser = async(req,res) => {
    const {email,name} = req.body;
    if(!email || !name) {
        throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({_id:req.user.userId});

    user.email = email;
    user.name = name;

    const tokenUser = createTokenUser(user);
    attachCookieToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user:tokenUser});
};


export const updateUserPassword = async(req,res) => {
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new BadRequestError('Please provide both values');
    }
    const user = User.findOne({_id:req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials');       
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:'Success password updated.'});
};

