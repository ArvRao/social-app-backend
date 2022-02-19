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
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequestsSent,
    removeFriend
} = require('../controllers/friends.controllers')

// FRIENDS MODULE
router.get("/friends", requireLogin, getFriends);
router.get("/friends/requests/sent", requireLogin, getFriendRequestsSent);
router.get("/friends/requests", requireLogin, getFriendRequests);
router.post("/friends/request/:friendId", requireLogin, sendFriendRequest);
router.post("/friends/request/accept/:friendId", requireLogin, acceptFriendRequest);
router.post("/friends/request/reject/:friendId", requireLogin, rejectFriendRequest);
router.post("/friends/remove/:friendId", requireLogin, removeFriend);


// USERS MODULE
router.get('/all', allUsers)
router.delete('/delete/:id', deleteUser)
router.put('/follow', followUser)
router.put('/unfollow', unfollowUser)

// PASSWORD RESET
router.post('/reset-password', requireLogin, resetPassword)
router.post('/resetPassword', requireLogin, ResetPasswordToken)

module.exports = router;