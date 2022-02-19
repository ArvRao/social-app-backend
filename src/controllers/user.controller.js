const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailvalidator = require("email-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
const {
    cloudinary
} = require('../config')
const sendgridTransport = require("nodemailer-sendgrid-transport");
const {
    vars,
} = require("../config");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: vars.emailConfig.api_key
    }
}))
// getUsers, getUser, updateUser, VerifyEmail, forgotPassword, updatePassword, 

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

                user.save()
                    .then((savedUser) => {
                        transporter.sendMail({
                            to: savedUser.email,
                            from: "arvindrao.759@gmail.com",
                            subject: "SignUp successful. Welcome aboard",
                            html: `<h1>Hey ${savedUser.name}, welcome to my social app. Hope you enjoy it!!</h1>`
                        })
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

const resetPassword = (req, res) => {
    crypto.randomBytes(32, (err, buff) => {
        if (err) {
            console.log(err);
        }
        // convert hexacode to string
        const token = buff.toString("hex")
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    res.status(422).json({
                        error: 'User doesnt exit with that email.'
                    })
                }

                user.resetToken = token

                console.log(user.resetToken);

                // active for 1 hour
                user.expireToken = Date.now() + 3600000


                // active for 1 hour
                // ********************** 
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: vars.emailConfig.from,
                        subject: "Password Reset",
                        html: `
                    <p>Password reset</p>
                    <h5>
                    Click on this link to reset your password
                    <a href = "http://localhost:3000/reset-password/${token}">Click here</a>
                    </h5>
                    `
                    })

                    res.status(200).json({
                        message: 'Check your email'
                    })
                })

            })
    })
}

const newbie = (req, res) => {
    res.send(req.params.num)
}

const ResetPasswordToken = (req, res) => {
    // const {
    //     token
    // } = req.params.token

    const {
        Existingpassword,
        newPassword,
        confirmPassword,
        sentToken
    } = req.body
    console.log(req.user.password);
    bcrypt.compare(Existingpassword, req.user.password)
        .then((match) => {
            if (match) {
                if (newPassword !== confirmPassword) {
                    return res.status(422).json({
                        message: "Passwords don't match",
                    })
                } else {
                    // check if token is valid
                    // console.log(`Token is: ${req.user.resetToken}`);
                    User.findOne({
                            resetToken: sentToken,
                            expireToken: {
                                $gt: Date.now()
                            }
                        })
                        .then(user => {
                            console.log(user);
                            if (!user) {
                                return res.status(422).json({
                                    message: 'Session has expired.'
                                })
                            }
                            bcrypt.hash(newPassword, 12)
                                .then(hashedPassword => {

                                    user.password = hashedPassword
                                    user.resetToken = undefined
                                    user.expireToken = undefined

                                    user.save().then((savedUser) => {
                                        res.status(201).json({
                                            message: "Password has been updated successfully!"
                                        })
                                    })
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        })

                }

            } else {
                return res.status(422).json({
                    message: 'Your password is incorrect.',
                })
            }
        })
        .catch(err => {
            console.log(err);
        })

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

const getBlockedUsers = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);
        const user = await User.findById(req.userId)
            .populate({
                path: "blockedUsers",
                model: User,
                select: "name email profilePic city",
            })
            .slice("blockedUsers", [skip, limit]);

        res.status(200).json({
            success: true,
            message: "Blocked users list access successful",
            data: user.blockedUsers,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};

const blockUser = async (req, res) => {
    try {
        const blockUserId = req.params.blockUserId;
        const userId = req.userId;

        let blockUser = await User.findById(blockUserId);
        // check if blockUserId is valid
        if (!blockUser)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid User id"
                });

        let user = await User.findById(userId);

        user.friends = user.friends.filter((id) => id.toString() !== blockUserId);
        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== blockUserId
        );
        user.friendRequestsSent = user.friendRequestsSent.filter(
            (id) => id.toString() !== blockUserId
        );

        if (!user.blockedUsers.includes(mongoose.Types.ObjectId(blockUserId)))
            user.blockedUsers.unshift(blockUserId);

        blockUser.friends = blockUser.friends.filter(
            (id) => id.toString() !== userId
        );
        blockUser.friendRequests = blockUser.friendRequests.filter(
            (id) => id.toString() !== userId
        );
        blockUser.friendRequestsSent = blockUser.friendRequestsSent.filter(
            (id) => id.toString() !== userId
        );

        await User.findByIdAndUpdate(userId, user);
        await User.findByIdAndUpdate(blockUserId, blockUser);

        res
            .status(200)
            .json({
                success: true,
                message: `User ${blockUser.name} has been blocked successfully`
            });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Something Went Wrong..."
            });
    }
};


const followUser = async (req, res) => {

    const {
        followId
    } = req.body

    // user account
    const user = await User.findById(req.userId)

    // user to be followed
    let followUser = await User.findById(followId)

    const following = user.following
    const foundUser = following.includes(followId);

    if (foundUser) {
        return res.status(400).json({
            success: false,
            message: `You already follow ${followUser.name}`
        })
    }

    await user.following.push(followId);

    await followUser.followers.push(req.userId)

    await user.save()
    await followUser.save()

    return res.status(200).json({
        success: true,
        message: `You started following ${followUser.name}`,
        user
    })
}



const unfollowUser = async (req, res) => {
    const {
        unfollowId
    } = req.body;

    // user account
    const user = await User.findById(req.userId)

    // user to be unfollowed
    let unfollowUser = await User.findById(unfollowId)

    const following = user.following
    const foundUser = following.includes(unfollowId);

    if (!foundUser) {
        return res.status(400).json({
            success: false,
            message: `You don't follow ${unfollowUser.name}`
        })
    }

    await user.following.pull(unfollowId);
    await unfollowUser.followers.pull(req.userId)

    await user.save()
    await unfollowUser.save()

    return res.status(200).json({
        success: true,
        message: `You have successfully unfollowed ${unfollowUser.name}`,
        user
    })
}


module.exports = {
    signup,
    signout,
    allUsers,
    deleteUser,
    followUser,
    unfollowUser,
    resetPassword,
    ResetPasswordToken,
    newbie,
    getBlockedUsers,
    blockUser
}