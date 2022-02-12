const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");
const User = require("../models/user");
const {
    cloudinary
} = require('../config')


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

const signout = async (req, res) => {
    try {
        // req.logout();
        // console.log(req.user);
        req.token = '';
        await console.log(req.token);
        // res.cookie('token')
        return res.status(200).json({
            success: true,
            message: 'Token has been deleted successfully',
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const allUsers = async (req, res) => {
    try {
        let users = await User.find()
        res.status(200).json({
            success: true,
            total: users.length,
            users
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        // find user by id
        const user = await User.findById(req.params.id);
        // delete image from cloudinary
        if (user.cloudinaryId) {
            await cloudinary.uploader.destroy(user.cloudinaryId);
        }

        // delete user from database
        await user.remove();
        return res.status(200).json({
            message: 'User deleted successfully',
            user
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    signup,
    signout,
    allUsers,
    deleteUser
}