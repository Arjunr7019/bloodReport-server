const express = require("express");
const { SendOtp,VerifyOtp,UpdateNewPassword } = require("../Controllers/forgotPasswordController");

const router = express.Router();

router.get("/:email", SendOtp);
router.post("/verifyOtp", VerifyOtp);
router.post("/updateNewPassword", UpdateNewPassword);

module.exports = router;