const express = require('express');
const { createUser, loginUser, getUsers, getSingleUser, logout } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isResourceAccessible } = require('../middleware/resourceAccessibleMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', isAuthenticated, getSingleUser);
router.post('/logout', isAuthenticated, logout);

module.exports = router;