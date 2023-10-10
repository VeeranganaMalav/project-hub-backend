const Project = require('../models/project');
const User = require("../models/user");

// ---------------------------- CREATE PROJECT ---------------------------
module.exports.createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, projectManager, teamMembers } = req.body;

        const projManager = await User.findById(projectManager);

        if (!projManager) {
            res.status(404).send({ message: 'Project Manager not found' });
            return;
        }

        // Filter out invalid team member IDs
        const validTeamMembers = await Promise.all(
            teamMembers.map(async (teamMemberId) => {
                const user = await User.findById(teamMemberId);
                return user ? user._id : null;
            })
        );

        // Remove null values (invalid IDs)
        const filteredTeamMembers = validTeamMembers.filter((id) => id);

        const newProject = await Project.create({
            name,
            description,
            startDate,
            endDate,
            projectManager,
            teamMembers: filteredTeamMembers
        });

        // Add the project to each valid team member's list of projects
        for (const memberId of filteredTeamMembers) {
            const member = await User.findById(memberId);
            if (member) {
                member.projects.push(newProject._id);
                await member.save();
            }
        }

        projManager.projects.push(newProject._id);
        await projManager.save();



        res.status(201).json({ message: 'Project created successfully.', project: newProject });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while creating the project.' });
    }
};


// ---------------------------- RETRIEVING PROJECTS ---------------------------
module.exports.getProjects = async (req, res) => {
    try {
        // Fetch all projects from the database
        const projects = await Project.find();

        res.status(200).json({ message: 'Projects retrieved successfully.', projects: projects });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving in projects.' });
    }
};


// ---------------------------- RETRIEVING SINGLE PROJECT ---------------------------

module.exports.getSingleProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Fetch the project by ID from the database
        const project = await Project.findById(projectId);

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Return the project object in the response
        res.status(200).json({ message: 'Project retrieved successfully.', project: project });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving the project.' });
    }
};

// ---------------------------- UPDATE PROJECT ---------------------------
module.exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Find the project by ID
        const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { new: true });

        // Check if the project exists
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        res.status(200).send({ message: 'Project updated successfully', project: updatedProject });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while updating the project.' });
    }
};

// ---------------------------- DELETE PROJECT ---------------------------
module.exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Find the project by ID
        const deletedProject = await Project.findByIdAndDelete(projectId);

        // Check if the project exists
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Remove the project ID from the project manager's projects array
        const projectManager = await User.findById(deletedProject.projectManager);
        if (projectManager) {
            projectManager.projects.pull(deletedProject._id);
            await projectManager.save();
        }

        // Remove the project ID from the team members' projects arrays
        for (const teamMemberId of deletedProject.teamMembers) {
            const teamMember = await User.findById(teamMemberId);
            if (teamMember) {
                teamMember.projects.pull(deletedProject._id);
                await teamMember.save();
            }
        }

        // Return the deleted project object in the response
        res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the project.');
    }
};

// ---------------------------- POPULATE PROJECT MANAGER AND TEAM MEMBERS ---------------------------
module.exports.populateProjectManager = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Find the project by ID
        const existingProject = await Project.findById(projectId).populate('projectManager teamMembers');

        // Check if the project exists
        if (!existingProject) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Return the existing project object in the response
        res.status(200).json({ message: 'Project details retrieved successfully', project: existingProject });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the project.');
    }
};