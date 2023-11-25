import express from "express";
import dotenv from "dotenv";
dotenv.config({path:"config.env"});
import connectDB from "./db/connectDB.js";
// import all the middleware
import productsRouter from "./routes/productRoutes.js";
import notFoundMiddleware from "./middleware/notFound.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
// import insertvalues from "./populate.js";

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send(`<h1>Store API</h1><a href="/api/v1/products">products route</a>`);
})

app.use("/api/v1/products",productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT||5000;

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`the server is running at port ${port} ....`);
        });
        // insertvalues();
    }
    catch(error){
        console.log(error);
    }
}

start();