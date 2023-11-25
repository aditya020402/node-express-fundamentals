import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import "express-async-errors";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  dirname(__filename);
const app = express();
import "express-async-errors";
//extra security packages
import helmet from "helmet";
import path from "path";
import xss from "xss-clean";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
// import populate from "./populate.js";
dotenv.config({path:"config.env"});
import notFoundMiddleware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import authenticatedUser from "./middleware/authentication.js";

import jobRouter from "./routes/jobs.js";
import authRouter from "./routes/auth.js";

app.set("trust proxy",1);
app.use(express.static(path.resolve(__dirname,"./client/build")))
app.use(express.json());
app.use(xss());
app.use(helmet());


app.use("/api/v1/auth",authRouter);
app.use("/api/v1/jobs",authenticatedUser,jobRouter);
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"./client/build",'index.html'));
})
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async() =>{
    await connectDB(process.env.MONGO_URI);
    app.listen(port,()=>{
        console.log(`the server is running at port ${port}`);
    })
    // populate();
}

start();