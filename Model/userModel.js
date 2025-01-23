const mongoose = require('mongoose');
const nestedSchema = require('./nestedModel');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required field!'],
        unique: true,
        trim: true
    },
    DOB: {
        type: String,
        required: [true, 'DOB is required field!'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'gender is required field!'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required field!'],
        trim: true
    },
    joinedDate: {
        type: String,
        required: [true, 'date is required field!'],
        trim: true
    },
    lastUpdateDate: {
        type: String,
        trim: true
    },
    otpToken: {
        type: Number,
        default: undefined
    },
    parameters: {
        date: {
            type: Date,
            unique: true,
            sparse: true // Allows multiple null values if that's desired
        },
        ESR: {
            type: Object
        },
        CRP: {
            type: Object
        },
        BP:{
            type: Object
        },
        Glc:{
            type: Object
        }
    }
})

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;