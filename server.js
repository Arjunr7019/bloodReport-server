const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const jsonErrors = require('express-json-errors');
const cors = require('cors');
const nodemailer = require("nodemailer");

const mongoose = require('mongoose');
const Users = require('./Model/userModel');

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.CON_STR, {
    useNewUrlParser: true
}).then((conn) => {
    // console.log(conn);
    console.log("DB connected successful");
}).catch((error) => {
    console.log(error);
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS
    },
});

app.get("/api", (req, res) => {
    res.json("working");
})

app.post("/api/mail", async (req, res) => {
    const info = await transporter.sendMail({
        from: {
            name: "BLOOD REPORT",
            address: process.env.USER
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

app.post("/api/login", async (req, res) => {
    const user = await Users.findOne({ email:req.body.email, password:req.body.password }).exec();
    
    if(user){
        res.status(200).json({
            status: "Success",
            data: {
                user
            }
        })
    }else{
        res.status(404).json({
            status: "fail",
            data: req.body
        })
    }
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
        "otpToken": "0",
        "parameters": {
            "date": new Date(),
            "ESR": [{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }],
            "CRP": [{
                "value": "0",
                "date": "0"
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
        "otpToken": "0",
        "parameters": {
            "date": new Date(),
            "CRP": [{
                "value": req.body.parameterValue,
                "date": req.body.bloodParameterDate
            }],
            "ESR": [{
                "value": "0",
                "date": "0"
            }]
        }
    }
    try {
        if (req.body.parametersType === "ESR") {
            const ESRuser = await Users.create(ESR);
            res.status(201).json({
                status: "Success",
                data: {
                    ESRuser
                }
            })
        } else if (req.body.parametersType === "CRP") {
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
    } catch (err) {
        res.status(409).json({
            status: "fail",
            message: err.message
        })
    }

})

app.post("/api/addNewParamaeter", async (req, res) => {
    const userInfo = await Users.findOne({ email: req.body.email }).exec();
    const newParameterValue = [
        {
            "value": req.body.parameterValue,
            "date": req.body.bloodParameterDate
        }]

    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const userLastUpdate = currentDate + " " + currentTime;

    if (userInfo) {
        if (req.body.parametersType === "ESR") {
            const mergeESR = [...newParameterValue, ...userInfo.parameters.ESR]
            const updatedESRUser = await Users.findByIdAndUpdate(userInfo._id, { $set: { lastUpdateDate:userLastUpdate, parameters: { ESR: mergeESR } } }, { new: true, runValidators: true })
            let user = await Users.findOne({ email: req.body.email }).exec();
            res.status(200).json({
                status: "Success",
                data: {
                    user
                }
            })
        } else if (req.body.parametersType === "CRP") {
            const mergeCRP = [...newParameterValue, ...userInfo.parameters.CRP]
            const updatedCRPUser = await Users.findByIdAndUpdate(userInfo._id, { $set: { lastUpdateDate:userLastUpdate, parameters: { CRP: mergeCRP } } }, { new: true, runValidators: true })
            let user = await Users.findOne({ email: req.body.email }).exec();
            res.status(200).json({
                status: "Success",
                data: {
                    user
                }
            })
        }
    } else {
        res.status(404).json({
            status: "fail",
            data: req.body
        })
    }
})

app.post("/api/LoggedInUserData", async (req, res) => {
    const user = await Users.findOne({ email: req.body.email }).exec();

    if (user) {
        res.status(200).json({
            status: "Success",
            data: {
                user
            }
        })
    } else {
        res.status(404).json({
            status: "fail",
            data: req.body
        })
    }
})

app.post("/api/test", async (req, res) => {
    const user = await Users.findOne({ email: req.body.email }).exec();

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            status: "fail",
            data: req.body
        })
    }
})


app.listen(5000, () => { console.log("server started on port 5000") })