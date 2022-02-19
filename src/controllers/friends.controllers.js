const bcrypt = require("bcrypt");
const User = require("../models/user")
const requireLogin = require("../middlewares/requireLogin")
const mongoose = require("mongoose");

const getFriends = async (req, res) => {
    try {
        const page = req.params.page ? req.params.page : 1;
        const limit = req.params.perPage ? req.params.perPage : 20;
        const skip = limit * (page - 1);
        const user = await User.findById(req.userId)
            .populate({
                path: "friends",
                model: User,
                select: "name",
            })
            .slice("friends", [skip, limit]);

        // console.log(user);

        res.status(200).json({
            success: true,
            friends: user.friends.length,
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

const getFriendRequestsSent = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);
        const user = await User.findById(req.userId)
            .populate({
                path: "friendRequestsSent",
                model: User,
                select: "name email profilePic college city",
            })
            .slice("friendRequestsSent", [skip, limit]);

        res.status(200).json({
            success: true,
            message: "Friend requests sent list access successful",
            data: user.friendRequestsSent,
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

const getFriendRequests = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);
        const user = await User.findById(req.userId)
            .populate({
                path: "friendRequests",
                model: User,
                select: "name email profilePic college city",
            })
            .slice("friendRequests", [skip, limit]);

        res.status(200).json({
            success: true,
            message: "Friend requests list access successful",
            data: user.friendRequests,
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

const sendFriendRequest = async (req, res) => {
    try {
        const friendId = req.params.friendId;
        let friend = await User.findById(friendId);

        // check if friendId is valid
        if (!friend)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid User id"
                });

        let user = await User.findById(req.userId);

        // console.log(user);
        // 
        // check if that user is a friend already
        if (user.friends.includes(mongoose.Types.ObjectId(friendId)))
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User is already a friend"
                });

        // check if the user is not blocked
        if (
            user.blockedUsers.includes(mongoose.Types.ObjectId(friendId)) ||
            friend.blockedUsers.includes(mongoose.Types.ObjectId(req.userId))
        )
            return res.status(400).json({
                success: false,
                message: "Blocked user. Cannot send friend request",
            });




        // check if the friendId is already present in pending requests
        if (user.friendRequests.includes(mongoose.Types.ObjectId(friendId)))
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Friend request already present"
                });


        // check if friend request is sent already
        if (user.friendRequestsSent.includes(mongoose.Types.ObjectId(friendId)))
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Friend request already sent"
                });


        user.friendRequestsSent.unshift(friendId);
        friend.friendRequests.unshift(req.userId);

        await User.findByIdAndUpdate(req.userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res
            .status(200)
            .json({
                success: true,
                message: "Friend request sent successfully"
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

const acceptFriendRequest = async (req, res) => {
    try {
        const friendId = req.params.friendId;

        let user = await User.findById(req.userId);

        // check if friendId is present in pending requests
        if (!user.friendRequests.includes(mongoose.Types.ObjectId(friendId)))
            return res.status(404).json({
                success: false,
                message: "No friend request from that user found",
            });

        let friend = await User.findById(friendId);


        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== friendId
        );
        friend.friendRequestsSent = friend.friendRequestsSent.filter(
            (id) => id.toString() !== req.userId
        );


        if (!user.friends.includes(mongoose.Types.ObjectId(friendId)))
            user.friends.unshift(friendId);
        if (!friend.friends.includes(mongoose.Types.ObjectId(req.userId)))
            friend.friends.unshift(req.userId);

        await User.findByIdAndUpdate(req.userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        return res
            .status(200)
            .json({
                success: true,
                message: "Friend request has been accepted successfully"
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

const rejectFriendRequest = async (req, res) => {
    try {
        const friendId = req.params.friendId;

        let user = await User.findById(req.userId);

        // check if friendId is present in pending requests
        if (!user.friendRequests.includes(mongoose.Types.ObjectId(friendId)))
            return res.status(404).json({
                success: false,
                message: "No friend request from that user found",
            });

        let friend = await User.findById(friendId);

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== friendId
        );
        friend.friendRequestsSent = friend.friendRequestsSent.filter(
            (id) => id.toString() !== req.userId
        );

        await User.findByIdAndUpdate(req.userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res
            .status(200)
            .json({
                success: true,
                message: "Friend request rejected successfully"
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

const removeFriend = async (req, res) => {
    try {
        const friendId = req.params.friendId;

        let friend = await User.findById(friendId);
        // check if friendId is valid
        if (!friend)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid User id"
                });

        let user = await User.findById(req.userId);

        user.friends = user.friends.filter((id) => id.toString() !== friendId);

        friend.friends = friend.friends.filter((id) => id.toString() !== req.userId);

        await User.findByIdAndUpdate(req.userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res
            .status(200)
            .json({
                success: true,
                message: `${friend.name} is not your friend anymore!`
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
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequestsSent,
    removeFriend
}