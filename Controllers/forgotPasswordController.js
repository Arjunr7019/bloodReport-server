const forgotPassword = require("../Model/forgotPasswordModel");
const userModel = require("../Model/userModel");
const nodemailer = require("nodemailer");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const SendOtp = async (req, res) => {
    const email = req.params.email;

    await forgotPassword.deleteMany({ email });

    const otp = generateOtp();

    const newOtp = new forgotPassword({ email, otp });
    await newOtp.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: {
            name: "BLOOD REPORT Suport Team",
            address: process.env.EMAIL_USER
        },
        to: email, // list of receivers
        subject: "Password Reset OTP for Your Account", // Subject line
        text: "", // plain text body
        html: `Dear user,<br/><br/>
            We have received a request to reset the password for your account. To ensure the security of your account, please use the following One-Time Password (OTP) to complete the password reset process:<br/><br/>
            OTP: ${otp} <br/><br/>
            Please note that this OTP is valid for a limited time period only(5 mins). If you did not request this password reset, please disregard this email.<br/><br/>
            Thank you for your attention to this matter.<br/><br/>
            Best regards,<br/>
            BLOOD REPORT Suport Team`
    });
    console.log("Message sent:", info.messageId);
    res.status(200).json("OTP Send Successfully");
}

module.exports = { SendOtp }