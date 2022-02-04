const mongoose = require('mongoose');
const {
    ObjectId
} = mongoose.Types

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
    postedBy: {
        type: ObjectId, // Id of user who created the post
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post