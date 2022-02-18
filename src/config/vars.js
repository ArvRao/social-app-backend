const path = require('path')

require('dotenv').config({
    path: path.join(__dirname, '../../.env')
})

module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    mediaPort: process.env.MEDIA_PORT,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_INTERVAL,
    resetPasswordExpirationInterval: process.env.JWT_RESET_PASSWORD_EXPIRATION_INTERVAL,
    // MONGODB URL
    url: process.env.MONGODB_URL,

    emailConfig: {
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        api_key: process.env.API_KEY
    },
    cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
}