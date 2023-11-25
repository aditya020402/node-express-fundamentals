import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import sgMail from "@sendgrid/mail";

dotenv.config({path:"config.env"});

const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by'); // done to hide the tech stack that we are employing for our project

const port = process.env.PORT || 8080;

app.get("/",(req,res)=>{
    res.status(201).json("Health check pass");
})

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  }
});

const MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Test Email",
        link:'https://mailgen.js/',
    }
})

app.post('/send-email',(req,res)=>{
    const {to,name,message} = req.body;
    const email = {
        body:{
            name:name,
            intro:message || 'welcome to test email and excited to try how this work and if this works out fine or not',
            outro:'need help, or have questions just reply to this email and we would reach out'
        }
    }
    console.log(process.env.EMAIL);
    const emailBody = MailGenerator.generate(email);
    const mailOptions = {
        from: process.env.EMAIL,
        to:to,
        subject:'Test Email',
        html:emailBody,
    };
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
            res.status(500).send('error sending email');
        }
        else{
            console.log('email sent'+info.response);
            res.send('email sent successfully');
        }
    })
});


//sending custom mail with design templates


const msg = {
    to:"your-email@example.com",
    from:"test@example.com",
    subject:"test verification email",
    html:emailTemplate,
}

const email = {
  body: {
    name: 'Jon Doe',
    intro: 'Welcome to email verification',
    action: {
      instructions: 'Please click the button below to verify your account',
      button: {
        color: '#33b5e5',
        text: 'Verify account',
        link: 'http://example.com/verify_account',
      },
    },
  },
}

const emailTemplate = MailGenerator.generate(email)

const sendMail = async() => {
    try{
        sgMail.setApiKey();
        return sgMail.send(msg);
    }
    catch(error){
        throw new Error(error.message);
    }
}

app.post("/custom-email",async (req,res)=>{
    try{
        const sent = await sendMail();
        if(sent){
            res.send("email sent successfully");
        }
    }
    catch(error){
        throw new Error(error.message);
    }
})


app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
})