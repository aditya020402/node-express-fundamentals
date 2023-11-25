import express from "express";
const app = express ();
// import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
dotenv.config({path:"config.env"});

const port = process.env.PORT || 5000;

import "express-async-errors";
import notFoundMiddleware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import mainRouter from "./routes/main.js";

app.use(express.static("./public"));
app.use(express.json());

app.use("/api/v1",mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async() => {
    // await connectDB();
    try{
        app.listen(port,()=>{
            console.log(`the server is listening to port no ${port}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();