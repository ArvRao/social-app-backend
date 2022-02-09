const {
    vars
} = require("../config");
const express = require("express");
const router = express.Router()

const {
    createPost,
    allPosts,
    myPosts
} = require("../controllers/posts.controllers")

router.post('/create', createPost)

router.get('/all', allPosts)

router.get('/myposts', myPosts)

module.exports = router