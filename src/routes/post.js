const {
    vars
} = require("../config");
const express = require("express");
const router = express.Router()
const requireLogin = require("../middlewares/requireLogin")

const {
    createPost,
    allPosts,
    myPosts,
    deletePost,
    getPost
} = require("../controllers/posts.controllers")

router.get('/:id', requireLogin, getPost)

router.post('/create', requireLogin, createPost)

router.get('/all', requireLogin, allPosts)

router.get('/myposts', requireLogin, myPosts)

router.delete('/:id', requireLogin, deletePost)

module.exports = router