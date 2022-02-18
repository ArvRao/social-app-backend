const {
    vars
} = require("../config");
const express = require("express");
const router = express.Router()
const requireLogin = require("../middlewares/requireLogin")

const {
    fetchAllComments,
    createComment,
    fetchComment,
    updateComment,
    deleteComment,
    replyToComment,
} = require("../controllers/comment.controller");

const {
    createPost,
    postsAll,
    // myPosts,
    deletePost,
    getPost,
    likePost,
    sharePost,
    fetchPosts,
    updatePost,
} = require("../controllers/posts.controllers");
const {
    route
} = require("../config/express");
router.get('/', requireLogin, fetchPosts)

router.patch("/:id", requireLogin, updatePost)
router.get('/:id', requireLogin, getPost)
router.post('/create', requireLogin, createPost)
// router.get('/myposts', requireLogin, myPosts)
router.delete('/:id', requireLogin, deletePost)
router.patch('/:id/likes', requireLogin, likePost)
router.patch('/:id/share', requireLogin, sharePost)

// comment routes
router.get("/:postId/comments", requireLogin, fetchAllComments);
router.post("/:postId/comments", requireLogin, createComment);
router.get("/:postId/comments/:commentId", requireLogin, fetchComment);
router.patch("/:postId/comments/:commentId", requireLogin, updateComment);
router.delete("/:postId/comments/:commentId", requireLogin, deleteComment);
router.post("/:postId/comments/:commentId/reply", requireLogin, replyToComment);

module.exports = router