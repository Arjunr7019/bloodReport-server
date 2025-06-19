const Users = require("../Model/userModel");

const addNewParamaeter = async (req , res)=>{
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
        const userHavingParameter = await Users.find({ email: req.body.email, [`parameters.${req.body.parametersType}`]: { $exists: true, $ne: [] } }).exec();
        if (userHavingParameter) {
            const updatedCRPUser = await Users.findByIdAndUpdate(userInfo._id, { $set: { lastUpdateDate: userLastUpdate }, $addToSet: { [`parameters.${req.body.parametersType}`]: { "value": req.body.parameterValue, "date": req.body.bloodParameterDate } } }, { new: true, runValidators: true })
            let user = await Users.findOne({ email: req.body.email }).select("-password -_id -otpToken");
            res.status(200).json({
                status: "Success",
                data: {
                    user
                }
            })
        } else {
            const otherParameter = await Users.findByIdAndUpdate(userInfo._id, { $set: { lastUpdateDate: userLastUpdate, [`parameters.${req.body.parametersType}`]: newParameterValue } }, { new: true, runValidators: true })
            let user = await Users.findOne({ email: req.body.email }).select("-password -_id -otpToken");
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
}

const deleteParameterData = async (req , res)=>{
    try {
        const update = {};
        const email = req.body.email
        update[`parameters.${req.body.type}`] = { value: req.body.value, date: req.body.date };

        const user = await Users.findOneAndUpdate(
            { email }, // Find the user by email
            { $pull: update }, // Remove the specified value from the array
            { new: true } // Return the updated document
        ).select("-password -_id -otpToken");

        if (user) {
            res.status(200).json({
                status: "Success",
                data: {
                    user
                }
            })
        } else {
            res.status(404).json({
                status: "No user found with the given email.",
                data: req.body
            })
        }
    } catch (err) {
        res.status(404).json({
            status: "Error updating user",
            data: err
        })
    }
}

module.exports = { addNewParamaeter,deleteParameterData }