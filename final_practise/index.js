import dotenv from "dotenv";
dotenv.config({path:"config.env"});
// import Product from "./models/Product.js";
// import Order from "./models/Order.js";
// import ProductSample from "./mockData/products.js";
// import OrderSample from "./mockData/orders.js";

import express from "express";
const app = express();

//used to parse the value of the cookie 
// if the cookies is signed then the string needs to be provide d with which the cookie is signed to parse the value else it will not parse that signed cookie if the cookie is not signed then it can be parsed with the signature parameter eg app.use(cookieParser()) after this the user can use req.cookies or req.signedCookies
import cookieParser from "cookie-parser";
// the user can upload file using express fileupload and other alternative are bus boy and multer that can be used to perform file uploads
import fileUpload from "express-fileupload";
// used to limit the number of request the user can make it needs to be configured once in the index.js file
import rateLimiter from "express-rate-limit";
//automatically adds and remove http headers to improve the security of the application headers like x-powered-by mentions the library used to generate the response using helment we can ommit the response and not send this with the response that we are sending.
import helmet from "helmet";
// CORS in node.js helps to get resources from external servers.
// cors stand for cross origin resource sharing and is used for sharing data to external servers
import cors from "cors";

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./db/connectDB.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

import notFoundMiddleware from "./middleware/notFound.js";

import errorHandlerMiddleware from "./middleware/error-handler.js";


app.set('trust proxy',1);
app.use(
    rateLimiter({
        windowMs:15*60*1000,
        max:60,
    })
);

app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/reviews",reviewRouter);
app.use("/api/v1/ordres",orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`Server is listening on port ${port} ...`);
        });
        // await Order.deleteMany();
        // Order.create(OrderSample);
        // await Product.deleteMany();
        // Product.create(ProductSample);
    }
    catch(error){
        console.log(error);
    }
}


start();