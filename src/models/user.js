const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 50
    },
    profilePic: {
        type: String,
        default: null
    },
    city: {
        type: String,
        max: 50
    },
    cloudinaryId: {
        type: String,
        default: null
    },
}, {
    timestamps: true
}, )

const User = mongoose.model('User', userSchema)

module.exports = User