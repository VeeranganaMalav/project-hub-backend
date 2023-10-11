const Project = require('../models/project');
const User = require("../models/user");
const Task = require("../models/task");

// ---------------------------- CREATE TASK ---------------------------
module.exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, assignedTeamMembers, subTasks, project } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            res.status(404).send({ message: 'Project not found' });
            return;
        }

        // Filter out invalid team member IDs
        const validTeamMembers = await Promise.all(
            assignedTeamMembers.map(async (teamMemberId) => {
                const user = await User.findById(teamMemberId);
                return user ? user._id : null;
            })
        );

        // Remove null values (invalid IDs)
        const filteredTeamMembers = validTeamMembers.filter((id) => id);

        const newTask = await Task.create({
            title,
            description,
            dueDate,
            priority,
            status,
            assignedTeamMembers: filteredTeamMembers,
            subTasks,
            project
        });

        console.log("User project manager - ", req.user);

        
        const projectManager = await User.findById(req.user._id);
        // console.log(projectManager);
        projectManager.tasks.push(newTask._id);
        await projectManager.save();


        // Add the project to each valid team member's list of tasks
        for (const memberId of filteredTeamMembers) {
            const member = await User.findById(memberId);
            if (member) {
                member.tasks.push(newTask._id);
                await member.save();
            }
        }

        existingProject.tasks.push(newTask._id);
        await existingProject.save();



        res.status(201).json({ message: 'Task created successfully.', task: newTask });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while creating the task.' });
    }
};


// ---------------------------- RETRIEVING TASKS ---------------------------
module.exports.getTasks = async (req, res) => {
    try {
        // Fetch all tasks from the database
        const tasks = await Task.find();

        res.status(200).json({ message: 'Tasks retrieved successfully.', tasks: tasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving in tasks.' });
    }
};


// ---------------------------- RETRIEVING SINGLE TASK ---------------------------

module.exports.getSingleTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Fetch the task by ID from the database
        const task = await Task.findById(taskId);

        // Check if the task exists
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Return the task object in the response
        res.status(200).json({ message: 'Task retrieved successfully.', task: task });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving the task.' });
    }
};

// ---------------------------- UPDATE TASK ---------------------------
module.exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find the task by ID
        const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

        // Check if the task exists
        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found.' });
            return;
        }

        res.status(200).send({ message: 'Task updated successfully', task: updatedTask });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while updating the task.' });
    }
};

// ---------------------------- DELETE TASK ---------------------------
module.exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find the task by ID
        const deletedTask = await Task.findByIdAndDelete(taskId);

        // Check if the task exists
        if (!deletedTask) {
            res.status(404).json({ error: 'Task not found.' });
            return;
        }

        // Remove the task ID from the projects' tasks array
        const project = await Project.findById(deletedTask.project);
        if (project) {
            project.tasks.pull(deletedTask._id);
            await project.save();
        }

        // Remove the task ID from the assigned team members' tasks' array
        for (const teamMemberId of deletedTask.assignedTeamMembers) {
            const teamMember = await User.findById(teamMemberId);
            if (teamMember) {
                teamMember.tasks.pull(deletedTask._id);
                await teamMember.save();
            }
        }

        const projectManager = await User.findById(req.user._id);
        // console.log(projectManager);
        projectManager.tasks.pull(deletedTask._id);
        await projectManager.save();

        // Return the deleted task object in the response
        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the task.');
    }
};

// ---------------------------- POPULATE TASK DETAILS OF PROJECT AND ASSIGNED TEAM MEMBERS ---------------------------
module.exports.populateAssignedTeamMembers = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find the task by ID
        const existingTask = await Task.findById(taskId).populate('project assignedTeamMembers');

        // Check if the task exists
        if (!existingTask) {
            res.status(404).json({ error: 'Task not found.' });
            return;
        }

        // Return the existing task object in the response
        res.status(200).json({ message: 'Assigned Task Members retrieved successfully', task: existingTask });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the task.');
    }
};