const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
require("dotenv").config();

const register = async(req, res) => {
    const user = User.create({...req.body });
    const token = User.createJWT();
    res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please Provide email and password");
    }

    const user = User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("invalid credentials");
    }

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ name: user.name, token });
};

module.exports = {
    register,
    login,
};