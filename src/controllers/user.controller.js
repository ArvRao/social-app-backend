const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");
const User = require("../models/user");

// getUsers, signup, getUser, updateUser, VerifyEmail, forgotPassword, updatePassword, friends module

const signup = async (req, res) => {
    const {
        name,
        email,
        password,
        desc,
        city
    } = req.body

    if (!name || !password || !email) {
        return res.status(422).json({
            err: 'Please enter all credentials'
        })
    }

    // check for valid email address
    if (!emailvalidator.validate(req.body.email)) {
        return res.status(400).json({
            err: 'Please enter a valid email address'
        })
    };

    // check if email already exists
    User.findOne({
            email: email
        })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    err: 'User with that email already exists'
                })
            };

            // hash the password
            bcrypt.hash(password, 12).then(hashedPassword => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    name,
                    desc,
                    city
                })

                user.save().then((savedUser) => {
                    res.status(201).json({
                        message: `New user ${savedUser.name} is successfully saved to the database`
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        }).catch((err) => {
            console.log(err);
        })
};

module.exports = {
    signup
}