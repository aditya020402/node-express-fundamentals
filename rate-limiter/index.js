import express from "express";
import {customRedisRateLimiter} from "./rateLimiter.js";

const app = express();

app.use(customRedisRateLimiter);


app.get("/testing",(req,res)=>{
    return res.send("rate limiter is working file");
})

app.listen(3000,()=>{
    console.log("the server is running at port 3000");
});

