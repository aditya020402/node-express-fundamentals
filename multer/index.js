import express from "express";
import multer from "multer";
import Busboy from "busboy";
import fileUpload from "express-fileupload";
import path from "path";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  dirname(__filename);
const app = express();
import createJWT from "./jwt.js";

app.use(express.json());

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now()+".png")
    }
});

const upload = multer({storage});

app.post("/upload",upload.single('file'),(req,res)=>{
    const file = req.file;
    if(!file){
        const error = new Error('Please attach the file');
        throw error;
    }
    res.send('file uploaded successfully');
})

app.post("/upload1",(req,res)=>{
    const busboy = Busboy({headers:req.headers});
    busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        file.on('data',data=>{
            console.log(`File [${fieldname}] got ${data.length} bytes`);
        });
        file.on('end',()=>{
            console.log(`File [${fieldname}] Finished`);
        });
    });
    busboy.on('finish',()=>{
        console.log(`File uploaded successfully`);
        res.status(200).send(`File uploaded successfully`);
    });
    req.pipe(busboy);
})

app.use(fileUpload());

app.post("/upload2",(req,res)=>{
    if(!req.files || Object.keys(req.files).length=== 0){
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.myFile;
    // console.log(__dirname);
    // console.log(file);
    const path_name = (path.join(__dirname,"/uploads",file.name));
    // console.log(path_name);
    file.mv(path_name,(err)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send('file was uploaded successfully');
    })
})

app.get("/jsonwebtoken",(req,res)=>{
    const obj = {
        first_name:'a',
        second_name:'b',
    }
    // const obj1 = {
    //     first_name:'a',
    //     second_name:'b',
    //     third_name:'c',
    // }
    // console.log(obj);
    // console.log(obj1);
    createJWT({obj});
    // createJWT({obj1});
    return res.send("practising jsonwebtokens");
})

app.listen(3000,()=>console.log('server is started at port 3000'));
