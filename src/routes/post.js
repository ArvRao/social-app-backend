const {
    vars
} = require("../config");
const express = require("express");
const router = express.Router()
const requireLogin = require("../middlewares/requireLogin")
const {
    createPost,
    allPosts
} = require("../controllers/posts.controllers")


router.post('/create', requireLogin, createPost)

router.get('/all', requireLogin, allPosts)

module.exports = router