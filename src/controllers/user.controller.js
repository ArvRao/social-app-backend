const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const {
    jwtSecret
} = require("../config/vars");

// getUsers, signup, getUser, updateUser, VerifyEmail, forgotPassword, updatePassword, friends module