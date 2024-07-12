const mongoose = require('mongoose');

const nestedModel = new mongoose.Schema({
    parameterType: {
        type: String,
        required: [true, 'parameterType is required field!'],
        trim: true
    },
    value: {
        type: String,
        required: [true, 'value is required field!'],
        trim: true
    },
    date: {
        type: String,
        unique: true,
        trim: true
    },
    lastUpdateDate: {
        type: String,
        trim: true
    },
})


module.exports = nestedModel;