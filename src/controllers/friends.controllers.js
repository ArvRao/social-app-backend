const bcrypt = require("bcrypt");
const User = require("../models/user")
const requireLogin = require("../middlewares/requireLogin")


const getFriends = async (req, res) => {
    try {
        const page = req.params.page ? req.params.page : 1;
        const limit = req.params.perPage ? req.params.perPage : 20;
        const skip = limit * (page - 1);
        const user = await User.findById(req.userId)
            .populate({
                path: "friends",
                model: User,
                select: "name username",
            })
            .slice("friends", [skip, limit]);

        res.status(200).json({
            success: true,
            message: "Friends list access successful",
            data: user.friends,
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

module.exports = {
    getFriends
}