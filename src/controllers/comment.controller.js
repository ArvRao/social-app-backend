const mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");

const fetchAllComments = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);
        const {
            postId
        } = req.params;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        // fetch comments
        const {
            comments
        } = await Post.findById(postId)
            .populate("comments")
            .slice("comments", [skip, limit]);

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: comments,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const createComment = async (req, res) => {
    try {
        const {
            postId
        } = req.params;
        const {
            content
        } = req.body;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        if (!content)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Comment cannot be empty"
                });

        let post = await Post.findById(postId);

        // if no post found
        if (!post)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No post with given id"
                });

        // create new comment
        const newComment = new Comment({
            content,
            author: req.userId
        });

        await newComment.save();

        // add comment id in post
        post.comments.unshift(newComment._id);

        // update the post
        await Post.findByIdAndUpdate(postId, post);

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const fetchComment = async (req, res) => {
    try {
        const {
            postId,
            commentId
        } = req.params;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        // validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid comment id"
                });

        // fetch the comment
        const comment = await Comment.findById(commentId).populate("replies");

        res.status(200).json({
            success: true,
            message: "Comment fetched successfully",
            data: comment,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const updateComment = async (req, res) => {
    try {
        const {
            postId,
            commentId
        } = req.params;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        // validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid comment id"
                });

        const post = await Post.findById(postId);

        // check if post contains comment with id commentId
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId)))
            return res.status(404).json({
                success: false,
                message: "Comment with given id not found in that post",
            });

        const comment = await Comment.findById(commentId);

        // check if current user is the author of that comment
        if (comment.author.toString() !== req.userId)
            return res.status(401).json({
                success: false,
                message: "Cannot update that comment",
            });

        const {
            content
        } = req.body;

        if (!content)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Comment cannot be empty"
                });

        // update the comment
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId, {
                content
            }, {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: updatedComment,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const deleteComment = async (req, res) => {
    try {
        const {
            postId,
            commentId
        } = req.params;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        // validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid comment id"
                });

        const post = await Post.findById(postId);

        // check if post contains comment with id commentId
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId)))
            return res.status(404).json({
                success: false,
                message: "Comment with given id not found in that post",
            });

        const comment = await Comment.findById(commentId);

        // check if current user is the author of that comment
        if (comment.author.toString() !== req.userId)
            return res.status(401).json({
                success: false,
                message: "Cannot delete that comment",
            });

        // delete the comment
        await Comment.findByIdAndDelete(commentId);

        // remove the commentId from post comments list
        post.comments = post.comments.filter((id) => id.toString() !== commentId);

        await Post.findByIdAndUpdate(postId, post);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const replyToComment = async (req, res) => {
    try {
        const {
            postId,
            commentId
        } = req.params;

        // validate postId
        if (!mongoose.Types.ObjectId.isValid(postId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid post id"
                });

        // validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid comment id"
                });

        const post = await Post.findById(postId);

        // check if post contains comment with id commentId
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId)))
            return res.status(404).json({
                success: false,
                message: "Comment with given id not found in that post",
            });

        const {
            content
        } = req.body;

        if (!content)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Comment cannot be empty"
                });

        const newReply = new Comment({
            content,
            author: req.userId
        });
        await newReply.save();

        const comment = await Comment.findById(commentId);
        comment.replies.unshift(newReply._id);

        // update the comment
        await Comment.findByIdAndUpdate(commentId, comment);

        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            data: newReply,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};


module.exports = {
    fetchAllComments,
    createComment,
    fetchComment,
    updateComment,
    deleteComment,
    replyToComment,
};