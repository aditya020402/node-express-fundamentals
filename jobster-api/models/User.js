import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        maxlength:50,
        minlength:3,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide a valid email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6,
    },
    lastName:{
        type:String,
        trim:true,
        maxlength:20,
        default:'lastname',
    },
    location:{
        type:String,
        trim:true,
        maxlength:20,
        default:"my city",
    },
});


schema.pre('save',async function(){
    // console.log(this);
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

schema.methods.createJWT = function(){
    // console.log(this);
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME,
    })
}

schema.methods.comparePassword  = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
return isMatch;
}

const User = mongoose.model("User",schema);
export default User;