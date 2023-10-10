const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');

require('dotenv').config();

let jwtSecretKey = process.env.JWT_SECRET_KEY;
let tokenExpiration = process.env.TOKEN_EXPIRATION;

// ---------------------------- REGISTER USER ---------------------------
module.exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, profilePicture } = req.body;

        console.log(name, email, password, role, profilePicture);
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: 'Email already registered.' });
            return;
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePicture,
            role
        });

        res.status(201).json({ message: "User created successfully.", user: newUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while registering the user.' });
    }
};


// ---------------------------- LOGGING IN USER ---------------------------
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if a user with the provided email exists
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JSON Web Token (JWT) for authentication
        const token = jwt.sign({ user: user }, jwtSecretKey, {
            expiresIn: tokenExpiration
        });

        res.status(200).json({ message: "User logged in successfully.", user: user, token: token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while logging in the user.' });
    }
};


// ---------------------------- GET LIST OF USERS ---------------------------
module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ message: "Users retrieved successfully", users: users });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving the users.' });
    }
};

// ---------------------------- GET SINGLE USER ---------------------------
module.exports.getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ message: "User retrieved successfully", user: user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving the user.' });
    }
};

// ---------------------------- LOGOUT USER ---------------------------
module.exports.logout = async (req, res) => {
    try {
        const token = req.body.token;

        const isTokenBlackListed = await TokenBlacklist.findOne({ token: token });

        if (isTokenBlackListed) {
            res.status(400).send({ message: 'User has been already logged out' });
            return;
        }

        const tokenBlacklist = new TokenBlacklist({ token: token });
        await tokenBlacklist.save();

        res.status(200).send({ message: "User logged out successfully" });
    }
    catch (err) {
        res.status(500).send("Failed to logout the user.");
    }
};