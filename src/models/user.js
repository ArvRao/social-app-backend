const mongoose = require('mongoose')
const {
    ObjectId
} = mongoose.Types

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
    sharedPosts: [{
        type: ObjectId,
        ref: "Post"
    }]
}, {
    timestamps: true
}, )

const User = mongoose.model('User', userSchema)

module.exports = User