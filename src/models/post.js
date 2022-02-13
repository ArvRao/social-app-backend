const mongoose = require('mongoose');
const {
    ObjectId
} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: 'No photo',
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    comments: [{
        type: ObjectId,
        ref: "Comment"
    }],
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post