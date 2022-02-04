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
    city: {
        type: String,
        max: 50
    }
}, {
    timestamps: true
}, )

const User = mongoose.model('User', userSchema)

module.exports = User