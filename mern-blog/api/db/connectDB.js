import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect(url
        // ,{
        //     newUrlParser:true,
        //     newUnifiedTopology:true,
        // }
        ).then((data)=>console.log(`connected to mongodb at ${data.connection.host}`));
};

export default connectDB;