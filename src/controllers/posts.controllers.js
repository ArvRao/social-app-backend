const {
    mongoose,
    vars,
    app
} = require("../config");
const Post = require('../models/post')
const User = require('../models/user')

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

//? Get all posts by pagination
const allPosts = async (req, res) => {
    try {
        const {
            //? Default values that are modified by params
            page = 1, limit = 5
        } = req.query
        Post.find()
            .limit(limit * 1).skip((page - 1) * limit)
            .populate("postedBy", "_id name")
            .then(posts => {
                res.status(200).json({
                    total: posts.length,
                    posts
                })
            })
    } catch (err) {
        console.log(err);
    }
}

//? get all posts of the particular user
const myPosts = async (req, res) => {
    try {
        Post.find({
                //* Compare the user id's
                postedBy: req.user._id
            })
            .populate("postedBy", "_id name")
            .then(myposts => {
                res.json({
                    total: myposts.length,
                    myposts
                })
            })
    } catch (err) {
        console.log(err);
    }
}

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

        res
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
    allPosts,
    myPosts,
    deletePost,
    getPost,
    likePost,
    sharePost
}