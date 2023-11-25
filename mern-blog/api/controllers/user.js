import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomError from "../customError.js";

export const register = async(req,res) => {
    const {username,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const userDoc = await User.create({username,password:hashedPassword});
    if(!userDoc){
        throw new CustomError("User not created due to some error.");
    }
    res.status(404).json(userDoc);
}

export const login = async(req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    if(!userDoc){
        throw new CustomError("Invalid credentials enter correct credentials.");
    }
    const passOK = await bcrypt.compare(password,userDoc.password);
    if(!passOK){
        throw new CustomError("Invalid credentials enter correct credentials.");
    }
    const token = await jwt.sign({username,id:userDoc._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});

    if(!token){
        throw new CustomError("Some error in generating the token please try again.");
    }

    res.cookie('token',token).json({
        id:userDoc._id,
        username,
    })

}

export const profile = async(req,res) => {
    const {token} = req.cookies;
    const val = jwt.verify(token,process.env.JWT_SECRET);
    if(!val){
        throw new CustomError("Please login again to view your profile");
    }
    const userId = val.id;
    const userDetails = await User.findById(userId);
    if(!userDetails){
        throw new CustomError("The user details cannot be fetched.");
    }
    res.status(404).json(userDetails)
}

export const logout = async(req,res) => {
    res.cookie('token','').json('ok');
}