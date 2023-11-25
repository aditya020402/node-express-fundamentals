import express from "express"
const app = express();
import tasks from "./routes/tasks.js";
import dotenv from "dotenv";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import connectDB from "./db/connectDB.js";

dotenv.config({path:"config.env"});

app.use(express.static("./public"));
app.use(express.json());

app.use("/api/v1/tasks",tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);


const port = process.env.PORT||5000;
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(process.env.PORT,()=>{
            console.log(`server is listening on port ${process.env.PORT} ... `);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();