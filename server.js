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

app.get("/api", (req, res) => {
    res.json("working");
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