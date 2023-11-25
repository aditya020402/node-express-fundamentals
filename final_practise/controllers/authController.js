import User from "../models/User.js";
import Token from "../models/Token.js";
import StatusCodes from "http-status-codes";
import {BadRequestError,UnauthenticatedError} from "../errors/index.js";
import {attachCookieToResponse,createTokenUser,createHash,sendVerificationEmail,sendResetPasswordEmail} from "../utils/index.js";
import crypto from "crypto";

export const register = async(req,res) => {
    const {email,name,password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists){
        throw new BadRequestError('Email already exists please enter different email');
    }
    const isFirstAccount = await User.countDocuments({}) === 0;
    // the first account would be the admin account
    const role = isFirstAccount?'admin':'user';
    const verificationToken = crypto.randomBytes(40).toString("hex");
    
    const user = await User.create({
        name,email,password,role,verificationToken,
    });

    const origin = 'http://localhost:3000';

    await sendVerificationEmail({
        name:user.name,
        email:user.email,
        verificationToken:user.verificationToken,
        origin,
    });
    res.status(StatusCodes.CREATED).json({
        msg:"Success! Please check your email to verify account",
    });
};

export const verifyEmail = async(req,res) => {
    const {verificationToken,email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Verification failed');
    }
    if(user.verificationToken !== verificationToken){
        throw new UnauthenticatedError('Verification failed');
    }
    user.isVerified=true;
    user.verified=new Date(Date.now());
    user.verificationToken="";
    await user.save();
    res.status(StatusCodes.OK).json({msg:`Email is verified`});
};

export const login = async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials');
    }
    if(!user.isVerified){
        throw new UnauthenticatedError('Please verify your email');
    }
    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await Token.findOne({user:user._id});
    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new UnauthenticatedError('Invalid credentials');
        }
    refreshToken = existingToken.refreshToken;
    attachCookieToResponse({res,user:tokenUser,refreshToken});
    res.status(StatusCodes.OK).json({user:tokenUser});
    return;
    }
    refreshToken = crypto.randomBytes(40).toString9('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = {refreshToken,ip,userAgent,user:user._id};
    await Token.create(userToken);
    attachCookieToResponse({res,user:tokenUser,refreshToken});
    res.status(StatusCodes.OK).json({user:tokenUser});
};

export const logout = async(req,res) => {
    await Token.findOneAndDelete({user:req.user.userId});
    res.cookie('accessToken','logout',{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.cookie('refreshToken','logout',{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg:'User logged out'});
};


export const forgotPassword = async(req,res) => {
    const {email} = req.body;
    if(!email){
        throw new BadRequestError('Please provide valid email');
    }
    const user = await User.findOne({email});
    if(user){
        const passwordToken = crypto.randomBytes(40).toString('hex');
        const origin = 'http://localhost:3000';
        await sendResetPasswordEmail({
            name:user.name,
            email:user.email,
            token:passwordToken,
            origin,
        });
        const tenMinutes = 1000*60*10;
        const passwordTokenExpirationDate = new Date(Date.now()+tenMinutes);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate=passwordTokenExpirationDate;
        await user.save();
    }
    res.status(StatusCodes.OK).json({msg:`Please check your email for reset password link`});
};

export const resetPassword = async(req,res) => {
    const {token,email,password} = req.body;
    if(!token || !email || !password){
        throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({email});
    if(user){
        const currentDate = new Date();
        if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate>currentDate){
            user.password=password;
            user.passwordToken=null;
            user.passwordTokenExpirationDate=null;
            await user.save();
        }
        res.send('reset password');
    }
}




