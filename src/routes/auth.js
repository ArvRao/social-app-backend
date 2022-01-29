const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = mongoose.model("User")

router.get('/route', (req, res) => {
    res.send('router route')
})

router.post('/signup', (req, res) => {
    const {
        name,
        email,
        password
    } = req.body
    if (!name || !password || !email) {
        return res.status(422).json({
            err: 'Please enter all credentials'
        })
    }

    // check if email already exists
    User.findOne({
            email: email
        })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    err: 'User with that email already exists'
                })
            }

            // hash the password
            bcrypt.hash(password, 12).then(hashedPassword => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    name
                })

                user.save().then((savedUser) => {
                    res.json({
                        message: `New user ${savedUser.name} is successfully saved to the database`
                    })
                }).catch(err => {
                    console.log(err);
                })
            })

        }).catch((err) => {
            console.log(err);
        })
})

module.exports = router