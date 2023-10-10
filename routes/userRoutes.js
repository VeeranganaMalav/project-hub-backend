const express = require('express');
const { createUser, loginUser, getUsers, getSingleUser, logout } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getSingleUser);
router.post('/logout', logout);

module.exports = router;