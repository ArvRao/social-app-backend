const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
    app,
    mongoose,
    vars
} = require("../config");


const login = async (req, res) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) {
        return res.status(422).json({
            message: 'Please enter your email or password fields'
        })
    }

    User.findOne({
        email: email
    }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({
                error: 'Invalid email or password'
            })
        }

        bcrypt.compare(password, savedUser.password)
            .then((matchedPassword) => {
                if (matchedPassword) {
                    const {
                        _id,
                        name,
                        email
                    } = savedUser

                    //* create a token
                    const token = jwt.sign({
                        id: savedUser._id,
                        name: savedUser.name
                    }, vars.jwtSecret, {
                        expiresIn: vars.jwtExpirationInterval,
                    })

                    res.status(200).json({
                        token,
                        user: {
                            _id,
                            name,
                            email
                        }
                    })
                } else {
                    return res.status(422).json({
                        message: 'Invalid email or password!'
                    })
                }
            })
            .catch(err => {
                // produced from our end, not client side
                console.log(err);
            })
    })
}


module.exports = {
    login
}