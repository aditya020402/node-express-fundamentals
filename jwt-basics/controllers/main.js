import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad-request.js";


export const login = async(req,res) => {
    const {username,password} = req.body;
    if(!username || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const id = new Date().getDate();
    const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'30d'});
    console.log(token);
    res.status(200).json({msg:"user created",token})
}

export const dashboard = async(req,res) => {
    const luckyNumber = Math.floor(Math.random()*100);
    res.status(200).json({
        msg:`hello , ${req.user.username}`,
        secret:`here is your authorized data, your lucky number is ${luckyNumber}`,
    });
}
