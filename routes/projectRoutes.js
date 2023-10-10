const express = require('express');
const { createProject, getProjects, getSingleProject, updateProject, deleteProject, populateProjectManager } = require('../controller/projectController');
const router = express.Router();

router.post('/create', createProject);
router.get('/', getProjects);
router.get('/:id', getSingleProject);
router.patch('/:id/update', updateProject);
router.delete('/:id/delete', deleteProject);
router.get('/:id/populate', populateProjectManager);

module.exports = router;