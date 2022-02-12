const {
    mongoose,
    vars,
    app
} = require("../config");
const Post = require('../models/post')

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

module.exports = {
    createPost,
    allPosts,
    myPosts,
    deletePost,
    getPost,
}