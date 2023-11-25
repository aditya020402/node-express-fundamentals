import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect(url
    //     ,{
    //     newUrlParser:true,
    //     newUnifiedTopology:true,
    // }
    );
}

export default connectDB;