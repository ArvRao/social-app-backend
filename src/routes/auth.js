const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const {
    login
} = require('../controllers/login.controller')

const {
    signup,
    signout
} = require('../controllers/user.controller')

// all routes
router.post('/register', signup)

router.get('/logout', requireLogin, signout)

router.post('/login', login)

module.exports = router