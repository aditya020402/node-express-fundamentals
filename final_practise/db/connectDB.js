import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect(url
        // ,{
        //     useUnifiedTopology:true,
        //     useNewUrlParser:true,
        // }
        ).then((data)=>console.log(`connected to mongodb at ${data.connection.host}`))
        .catch((error)=>console.log(error));
};

export default connectDB;
