const cloudinary = require("cloudinary").v2;

const {
    cloudinaryConfig
} = require("./vars");

cloudinary.config(cloudinaryConfig);

module.exports = cloudinary;