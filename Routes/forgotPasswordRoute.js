const express = require("express");
const { SendOtp } = require("../Controllers/forgotPasswordController");

const router = express.Router();

router.get("/:email", SendOtp);
// router.post("/verifyOtp", VarifyOtp);
// router.post("/updateNewPassword", UpdateNewPassword);

module.exports = router;