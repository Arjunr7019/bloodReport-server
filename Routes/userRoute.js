const express = require("express");
const {registerUser, loginUser, loggedInUserData} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/LoggedInUserData", loggedInUserData);

module.exports = router;