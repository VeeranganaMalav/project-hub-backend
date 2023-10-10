const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');

require('dotenv').config();

let jwtSecretKey = process.env.JWT_SECRET_KEY;
let tokenExpiration = process.env.TOKEN_EXPIRATION;

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];

        const isBlacklisted = await TokenBlacklist.exists({ token: token });

        if (isBlacklisted) {
            res.status(401).send({ error: 'Authentication failed.' });
            return;
        }

        let decoded = jwt.verify(token, jwtSecretKey);
        console.log(decoded);

        req.user = decoded.user;
        next();
    }
    catch (err) {
        console.log(err);
    }
};