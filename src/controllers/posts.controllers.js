const {
    mongoose,
    vars,
    app
} = require("../config");
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require("../models/comment");

const fetchPosts = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);

        const posts = await Post.find()
            .sort({
                createdAt: -1
            })
            .limit(limit)
            .skip(skip);

        return res.status(200).json({
            total: posts.length,
            success: true,
            message: "Posts fetched successfully",
            data: posts,
        });
        // console.log('hello');
    } catch (error) {
        console.log(error);
    }
}


//? Create a new post
const createPost = async (req, res) => {
    try {
        const {
            title,
            body
        } = req.body

        if (!title || !body) {
            return res.status(422).json({
                error: "Please add all the fields"
            })
        }

        // remove user's password field in posts
        req.user.password = undefined

        const post = await new Post({
            title,
            body,
            postedBy: req.user
        })
        await post.save().then((result) => {
            res.status(201).json({
                message: 'success',
                post: result
            })
        })
    } catch (err) {
        console.log(err);
    }
}

const updatePost = async (req, res) => {
    try {
        const {
            id
        } = req.params;


        let post = await Post.findById(id);

        // if no post found
        if (!post)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No post with given id"
                });

        if (post.postedBy.toString() !== req.userId)
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Cannot update this post"
                });

        const {
            body
        } = req.body;

        if (!body)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "No data given for post"
                });

        // add body if provided
        if (body) post.body = body;

        // update the post
        const updatedPost = await Post.findByIdAndUpdate(id, post, {
            new: true
        });

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
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

//? delete particular post by _id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        await post.remove();

        return res.status(200).json({
            success: true,
            message: 'Post has been deleted successfully.',
            post
        })
    } catch (error) {
        console.log(error);
    }
}

//? get all the posts
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        console.log(error);
    }
}

//? like a post
const likePost = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        // find post by Id
        let post = await Post.findById(id);

        // if no post found
        if (!post)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No post with given id"
                });
        let message = "Post liked successfully";

        const index = post.likes.findIndex(
            (id) => id.toString() === String(req.user._id)
        );
        if (index === -1) {
            // Like the post
            post.likes.unshift(req.user._id);
        } else {
            // Dislike the post
            post.likes = post.likes.filter(
                (id) => id.toString() !== String(req.user._id)
            );
            message = "Post unliked successfully";
        }

        // update the post
        await Post.findByIdAndUpdate(id, post);

        res.status(200).json({
            success: true,
            message,
            post
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

//? share the post
const sharePost = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const post = await Post.findById(id);

        // if no post found
        if (!post)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No post with given id"
                });

        let user = await User.findById(req.userId)

        // add the postId
        user.sharedPosts.unshift(id);

        // update the user
        await User.findByIdAndUpdate(req.userId, user);

        return res
            .status(200)
            .json({
                success: true,
                message: "Post shared successfully"
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
    createPost,
    // myPosts,
    updatePost,
    deletePost,
    getPost,
    likePost,
    sharePost,
    fetchPosts,
}