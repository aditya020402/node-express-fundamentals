import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type:String,
        reqired:[true,'product name must be provided'],
    },
    price:{
        type:Number,
        required:[true,'product price must be provided'],
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Date,
        default:Date.now(),
    },
    company:{
        type:String,
        enum:{
            values:['ikea','liddy','caressa','marcos'],
            message:'{VALUE} is not supported',
        }
    }
})

const  Product = mongoose.model("products",schema);

export default Product;