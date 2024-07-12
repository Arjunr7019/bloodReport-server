const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const jsonErrors = require('express-json-errors');
const cors = require('cors');
const nodemailer = require("nodemailer");

const mongoose = require('mongoose');
const Users = require('./Model/userModel');

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.CON_STR, {
    useNewUrlParser: true
}).then((conn)=>{
    // console.log(conn);
    console.log("DB connected successful");
}).catch((error)=>{
    console.log(error);
})

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASS
    },
  });

app.get("/api", (req, res)=>{
    res.json("working");
})

app.post("/api/mail", async (req, res)=>{
    const info = await transporter.sendMail({
        from: {
            name:"BLOOD REPORT",
            address:process.env.USER
        },
        to: req.body.email, // list of receivers
        subject: "Password Reset OTP for Your Account", // Subject line
        text: "", // plain text body
        html: `Dear user,<br/><br/>
        We have received a request to reset the password for your account. To ensure the security of your account, please use the following One-Time Password (OTP) to complete the password reset process:<br/><br/>
        OTP: 45665 <br/><br/>
        Please note that this OTP is valid for a limited time period only. If you did not request this password reset, please disregard this email.<br/><br/>
        Thank you for your attention to this matter.<br/><br/>
        Best regards,<br/>
        Weather Forecasting Team`
    });

    console.log("Message sent:", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    res.json(info.messageId);
})

app.post("/api/register", async (req, res) => {
    const ESR = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "DOB": req.body.DOB,
        "gender": req.body.gender,
        "joinedDate": req.body.joinedDate,
        "lastUpdateDate": req.body.joinedDate,
        "parameters":{
            "ESR":[{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }]
        }
    }
    const CRP = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "DOB": req.body.DOB,
        "gender": req.body.gender,
        "joinedDate": req.body.joinedDate,
        "lastUpdateDate": req.body.joinedDate,
        "parameters":{
            "CRP":[{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }]
        }
    }
    try{
        if(req.body.parameterType === "ESR"){
            const ESRuser = await Users.create(ESR);
            res.status(201).json({
                status: "Success",
                data: {
                    ESRuser
                }
            })
        }else if(req.body.parameterType === "CRP"){
            const CRPuser = await Users.create(CRP);
            res.status(201).json({
                status: "Success",
                data: {
                    CRPuser
                }
            })
        }
        // const user = await Users.create(ESR);
    
        // res.status(201).json({
        //     status: "Success",
        //     data: {
        //         user
        //     }
        // })
    }catch(err){
        res.status(409).json({
            status: "fail",
            message: err.message
        })
    }

})

app.post("/api/test", (req, res)=>{
    const ESR = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "DOB": req.body.DOB,
        "gender": req.body.gender,
        "joinedDate": req.body.joinedDate,
        "lastUpdateDate": req.body.joinedDate,
        "parameters":{
            "ESR":[{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }]
        }
    }
    const CRP = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "DOB": req.body.DOB,
        "gender": req.body.gender,
        "joinedDate": req.body.joinedDate,
        "lastUpdateDate": req.body.joinedDate,
        "parameters":{
            "CRP":[{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }]
        }
    }
    if(req.body.parameterType === "ESR"){
        res.json(ESR)
    }else if(req.body.parameterType === "CRP"){
        res.json(CRP)
    }
})


app.listen(5000, ()=>{console.log("server started on port 5000")})