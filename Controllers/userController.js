const Users = require("../Model/userModel");

const loginUser = async (req , res)=>{
    const user = await Users.findOne({ email: req.body.email, password: req.body.password }).select("-password -_id -otpToken");

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
}

const registerUser = async (req , res)=>{
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
            }]
        }
    }
    const withoutParameters = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "DOB": req.body.DOB,
        "gender": req.body.gender,
        "joinedDate": req.body.joinedDate,
        "lastUpdateDate": req.body.joinedDate,
        "otpToken": "0",
        "parameters": {
            "date": new Date()
        }
    }
    try {
        if (req.body.parametersType === "ESR") {
            const user = await Users.create(ESR).select("-password -_id -otpToken");
            res.status(201).json({
                status: "Success",
                data: {
                    user
                }
            })
        } else if (req.body.parametersType === "CRP") {
            const user = await Users.create(CRP).select("-password -_id -otpToken");
            res.status(201).json({
                status: "Success",
                data: {
                    user
                }
            })
        } else {
            const user = await Users.create(withoutParameters);
            res.status(201).json({
                status: "Success",
                data: {
                    user
                }
            })
        }
    } catch (err) {
        res.status(409).json({
            status: "fail",
            message: err.message
        })
    }
}

const loggedInUserData = async (req , res)=>{
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
}

const updateUserDetails = async(req, res)=>{
    const { email,name,DOB,gender } = req.body;

    let user = await Users.findOne({ email });

    if (!user) return res.status(404).json({ message: "user not fount check your email and try again later" });

    try {
        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (DOB) fieldsToUpdate.DOB = DOB;
        if (gender) fieldsToUpdate.gender = gender;

        const updatedUser = await Users.findOneAndUpdate(
            { email: email },
            { $set: fieldsToUpdate },
            { new: true }
        );

        if (!updatedUser) return res.status(400).json("Error updating user details");

        res.status(200).json("details updated successfully.");
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(400).json('Error updating details:', err);
    }
}

module.exports = { registerUser, loginUser, loggedInUserData, updateUserDetails }