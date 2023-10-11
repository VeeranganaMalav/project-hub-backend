const express = require('express');
const { createTask, getTasks, getSingleTask, updateTask, deleteTask, populateAssignedTeamMembers } = require('../controller/taskController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminCheckMiddleware');
const { isProjectManager } = require('../middleware/projectManagerCheckMiddleware');

const router = express.Router();

router.post('/create', isAuthenticated, isProjectManager, createTask);
router.get('/', getTasks);
router.get('/:id', getSingleTask);
router.patch('/:id/update', isAuthenticated, updateTask);
router.delete('/:id/delete', isAuthenticated, isProjectManager, deleteTask);
router.get('/:id/populate', populateAssignedTeamMembers);

module.exports = router;