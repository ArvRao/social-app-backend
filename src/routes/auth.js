const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = mongoose.model("User")
const requireLogin = require('../middlewares/requireLogin')
const vars = require('../config/vars')
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