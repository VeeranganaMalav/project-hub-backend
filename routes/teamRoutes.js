const express = require('express');
const { createTeam, getTeams, getSingleTeam, updateTeam, deleteTeam, populateTeamMembers } = require('../controller/teamController');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminCheckMiddleware');
const { isProjectManager } = require('../middleware/projectManagerCheckMiddleware');

router.post('/create', isAuthenticated, isProjectManager, createTeam);
router.get('/', getTeams);
router.get('/:id', getSingleTeam);
router.patch('/:id/update', isAuthenticated, isProjectManager, updateTeam);
router.delete('/:id/delete', isAuthenticated, isProjectManager, deleteTeam);
router.get('/:id/populate', populateTeamMembers);

module.exports = router;