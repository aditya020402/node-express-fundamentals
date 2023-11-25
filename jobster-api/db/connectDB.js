import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect(url
        // ,{
        //     newUrlParser:true,
        //     newUnifiedTopology:true,
        // }
        ).then((data)=>console.log(`the mongodb server is running at ${data.connection.host}`))
}
export default connectDB;