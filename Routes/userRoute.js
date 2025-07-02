const express = require("express");
const {registerUser, loginUser, loggedInUserData, updateUserDetails} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/LoggedInUserData", loggedInUserData);
router.post("/updateUserDetails", updateUserDetails);

module.exports = router;