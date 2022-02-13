const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
}, {
    timestamps: true,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;