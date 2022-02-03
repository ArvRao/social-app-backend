const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const vars = require('../config/vars')
const User = require('../models/user')
// important to import model rather than the file

module.exports = (req, res, next) => {
    const {
        authorization
    } = req.headers

    // * Syntax: authorization === Bearer <token>
    if (!authorization) {
        return res.status(401).json({
            error: 'You are not authorized!'
        })
    }
    const token = authorization.replace('Bearer ', '')

    jwt.verify(token, vars.jwtSecret, (err, payload) => {
        if (err) {
            return res.status(401).json({
                error: 'You are be logged in!'
            })
        }

        const {
            _id
        } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
        })
        next()
    })
}