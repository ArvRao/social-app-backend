const {
    mongoose,
    vars,
    app
} = require("../config");
const Post = require('../models/post')


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
                post: result
            })
        })
    } catch (err) {
        console.log(err);
    }
}

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

module.exports = {
    createPost,
    allPosts,
}