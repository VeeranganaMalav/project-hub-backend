const express = require('express');
const { createProject, getProjects, getSingleProject, updateProject, deleteProject, populateProjectManager } = require('../controller/projectController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminCheckMiddleware');
const { isProjectManager } = require('../middleware/projectManagerCheckMiddleware');
const { isResourceAccessible } = require('../middleware/resourceAccessibleMiddleware');
const router = express.Router();

router.post('/create', isAuthenticated, isAdmin, createProject);
router.get('/', isAuthenticated, getProjects);
router.get('/:id', isAuthenticated, isResourceAccessible, getSingleProject);
router.patch('/:id/update', isAuthenticated, isAdmin, updateProject);
router.delete('/:id/delete', isAuthenticated, isAdmin, deleteProject);
router.get('/:id/populate', populateProjectManager);

module.exports = router;