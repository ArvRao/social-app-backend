const express = require('express')
const router = express.Router()
const {
    login
} = require('../controllers/login.controller')

const {
    signup
} = require('../controllers/user.controller')

// all routes
router.post('/register', signup)

router.post('/login', login)

module.exports = router