import express from "express";
import log4js from "log4js";
import bunyan from "bunyan";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  dirname(__filename);
const path_name = path.join(__dirname,"logs","bunyan.log");
import winston from "winston";

const app = express();

const port = 3000;

//logging using log4js 

// (first create a logger)

log4js.configure({
    appenders:{
        fileAppender:{type:'file',filename:'./logs/log4.log'},
        console:{type:'console'},
    },
    categories:{
        default:{appenders:['fileAppender','console'],level:'all'}
    }
});


const logger = log4js.getLogger();

logger.trace('trace','log4js');
logger.debug('debug','log4js');
logger.info('hello','log4js');
logger.warn('heads up','log4js');


// using bunyan to do logging
// console.log(path_name);
var bunyanOpts = {
    name:"myapp",
    streams:[
        {
            level:'debug',
            stream:process.stdout
        },
        {
            level:'info',
            path:path_name
        }
    ]
};


const log = bunyan.createLogger(bunyanOpts);
log.info("using bunyan logger");
log.warn("warning this might cause future issues please resolve this");
log.fatal("this is a fatal error");
log.trace("this is general tracing");


//logging using morgan
const file_path_morgan = path.join(__dirname,"logs","morgan.log");
const accessLogStream = fs.createWriteStream(file_path_morgan,{flags:'a'});
app.use(morgan('combined',{stream:accessLogStream}));





// setting up winston logger (winston allows logging to a database as well)

const winston_file = path.join(__dirname,'logs','winston.log');
const logConfiguration = {
    'transports':[
        new winston.transports.Console(),
        new winston.transports.File({
            filename:winston_file,
        })
    ],
    format:winston.format.combine(
        winston.format.label({
            label:`Label`
        }),
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf((info)=>`${info.level}: ${info.label} : ${[info.timestamp]}: ${info.message}`),
    )
};

const logger_winston = winston.createLogger(logConfiguration);




app.get("/",(req,res)=>{
    logger_winston.info("server was hit on this api");
    res.status(200).send("api hit");
});

app.use((req,res)=>
{
    logger_winston.error("the following route does not exists");
    res.status(404).send("the following route does not exists.")
})

app.use((err,req,res,next)=>{
    res.status(500).send('could not perform the cal');
    logger_winston.error(`${err.status||500} - ${err.message}`);
})


app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
});





