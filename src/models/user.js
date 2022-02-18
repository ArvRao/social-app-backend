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
    resetToken: String,
    expireToken: Date,
    desc: {
        type: String,
        max: 50
    },
    profilePic: {
        type: String,
        default: null
    },
    friends: [{
        type: ObjectId,
        ref: "User"
    }],
    friendRequestsSent: [{
        type: ObjectId,
        ref: "User"
    }],
    friendRequests: [{
        type: ObjectId,
        ref: "User"
    }],
    blockedUsers: [{
        type: ObjectId,
        ref: "User"
    }],
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
    }],
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
}, )

const User = mongoose.model('User', userSchema)

module.exports = User