import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide a name"],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        unqiue:true,
        required:[true,'please provide email'],
        validate:{
            validator:validator.isEmail,
            message:'please provide valid email',
        },
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationToken:String,
    verified:Date,
    passwordToken:{
        type:String,
    },
    passwordTokenExpirationDate:{
        type:Date,
    }
})


schema.pre('save',async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

schema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

const User = mongoose.model('users',schema);
export default User;