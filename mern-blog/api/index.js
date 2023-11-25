import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  dirname(__filename);
const app = express();
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";


// import all the middleware and mount them 

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static(__dirname+'/uploads'));


app.use("/",userRouter);
app.use("/post",postRouter);



dotenv.config({path:"config.env"});
const port = process.env.PORT || 5000;
const start = async() => {
    await connectDB(process.env.MONGO_URI);
    app.listen(port,()=>{
        console.log(`the server is running at port ${port}`);
    });
};

start();