const express = require('express')
const router = express.Router()

const {
    allUsers,
    deleteUser,
} = require('../controllers/user.controller')

router.get('/all', allUsers)

router.delete('/delete/:id', deleteUser)

module.exports = router;