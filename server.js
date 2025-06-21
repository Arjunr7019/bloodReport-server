const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const jsonErrors = require('express-json-errors');
const cors = require('cors');
const nodemailer = require("nodemailer");
const userRoute = require("./Routes/userRoute");
const parameterDataRoute = require("./Routes/parameterDataRoute");
const forgotPasswordRoute = require("./Routes/forgotPasswordRoute")

const mongoose = require('mongoose');
const Users = require('./Model/userModel');

app.use(express.json());
app.use(cors());
app.use("/api", userRoute);
app.use("/api", parameterDataRoute);
app.use("/api/forgotPassword", forgotPasswordRoute);

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

app.post("/api/test", async (req, res) => {
    const user = await Users.findOne({ email: req.body.email }).select("-password -_id -otpToken");

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


app.listen(5000, () => { console.log("server started on port 5000") })