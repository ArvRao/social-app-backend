const {
    app,
    cloudinary
} = require("../config");
const express = require('express');
app.use(express.json());

const uploadMedia = async (req, res) => {
    try {
        if (!req.file)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "No file is selected"
                });

        const result = await cloudinary.uploader.upload(req.file.path)
        if (req.user) {
            req.user.profilePic = result.secure_url
            req.user.cloudinaryId = result.public_id;
            req.user.save();

            res.status(201).json({
                success: true,
                message: 'Profile picture was uploaded successfully'
            })
        }
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