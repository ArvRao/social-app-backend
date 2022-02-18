const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')

const {
    allUsers,
    deleteUser,
    followUser,
    unfollowUser,
    resetPassword,
    ResetPasswordToken,
} = require('../controllers/user.controller')

const {
    getFriends
} = require('../controllers/friends.controllers')

router.get("/friends", getFriends);

router.get('/all', allUsers)
router.delete('/delete/:id', deleteUser)
router.put('/follow', followUser)
router.put('/unfollow', unfollowUser)

router.post('/reset-password', requireLogin, resetPassword)
router.post('/resetPassword', requireLogin, ResetPasswordToken)

module.exports = router;