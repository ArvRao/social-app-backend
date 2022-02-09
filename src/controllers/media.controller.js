const {
    app,
    mongoose,
    vars,
    cloudinary
} = require("../config");
const User = require("../models/user")
const path = require("path")
const express = require('express');
app.use(express.json());

const uploadMedia = async (req, res) => {
    const {
        userId
    } = req.body

    try {
        if (!req.file)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "No file is selected"
                });


        const result = await cloudinary.uploader.upload(req.file.path)

        await User.findById(userId, (err, userData) => {
            if (userData) {
                userData.profilePic = result.secure_url;
                userData.cloudinaryId = result.public_id;
            }
            userData.save();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong.."
        })
    }

}

module.exports = {
    uploadMedia
}