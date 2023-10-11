const Team = require('../models/team');
const User = require("../models/user");


// ---------------------------- CREATE TEAM ---------------------------
module.exports.createTeam = async (req, res) => {
    try {
        const { name, members } = req.body;

        // Filter out invalid team member IDs
        const validTeamMembers = await Promise.all(
            members.map(async (teamMemberId) => {
                const user = await User.findById(teamMemberId);
                return user ? user._id : null;
            })
        );

        // Remove null values (invalid IDs)
        const filteredTeamMembers = validTeamMembers.filter((id) => id);

        const newTeam = await Team.create({
            name,
            members: filteredTeamMembers
        });

        // Add the team to each valid team member's list of teams
        for (const memberId of filteredTeamMembers) {
            const member = await User.findById(memberId);
            if (member) {
                member.teams.push(newTeam._id);
                await member.save();
            }
        }

        console.log("User project manager - ", req.user);

        
        const projectManager = await User.findById(req.user._id);
        // console.log(projectManager);
        projectManager.teams.push(newTeam._id);
        await projectManager.save();

        res.status(201).json({ message: 'Team created successfully.', team: newTeam });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while creating the team.' });
    }
};


// ---------------------------- RETRIEVING TEAMS ---------------------------
module.exports.getTeams = async (req, res) => {
    try {
        // Fetch all teams from the database
        const teams = await Team.find();

        res.status(200).json({ message: 'Teams retrieved successfully.', teams: teams });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving in teams.' });
    }
};


// ---------------------------- RETRIEVING SINGLE TEAM ---------------------------

module.exports.getSingleTeam = async (req, res) => {
    try {
        const teamId = req.params.id;

        // Fetch the team by ID from the database
        const team = await Team.findById(teamId);

        // Check if the team exists
        if (!team) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }

        // Return the team object in the response
        res.status(200).json({ message: 'Team retrieved successfully.', team: team });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while retrieving the team.' });
    }
};

// ---------------------------- UPDATE TEAM ---------------------------
module.exports.updateTeam = async (req, res) => {
    try {
        const teamId = req.params.id;


        const projectManager = await User.findById(req.user._id);
        
        // if(projectManager.teams.includes(teamId)){
        //     // Find the team by ID
        //     const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, { new: true });
        // }



        // Find the team by ID
        const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, { new: true });

        // Check if the team exists
        if (!updatedTeam) {
            res.status(404).json({ error: 'Team not found.' });
            return;
        }

        res.status(200).send({ message: 'Team updated successfully', team: updatedTeam });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while updating the team.' });
    }
};

// ---------------------------- DELETE TEAM ---------------------------
module.exports.deleteTeam = async (req, res) => {
    try {
        const teamId = req.params.id;

        // Find the team by ID
        const deletedTeam = await Team.findByIdAndDelete(teamId);

        // Check if the team exists
        if (!deletedTeam) {
            res.status(404).json({ error: 'Team not found.' });
            return;
        }

        // Remove the teams ID from the assigned team members' teams' array
        for (const teamMemberId of deletedTeam.members) {
            const teamMember = await User.findById(teamMemberId);
            if (teamMember) {
                teamMember.teams.pull(deletedTeam._id);
                await teamMember.save();
            }
        }

        console.log("User project manager - ", req.user);

        
        const projectManager = await User.findById(req.user._id);
        // console.log(projectManager);
        projectManager.teams.pull(deletedTeam._id);
        await projectManager.save();

        // Return the deleted team object in the response
        res.status(200).json({ message: 'Team deleted successfully', team: deletedTeam });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the team.');
    }
};

// ---------------------------- POPULATE DETAILS OF TEAM MEMBERS ---------------------------
module.exports.populateTeamMembers = async (req, res) => {
    try {
        const teamId = req.params.id;

        // Find the team by ID
        const existingTeam = await Team.findById(teamId).populate('members');

        // Check if the team exists
        if (!existingTeam) {
            res.status(404).json({ error: 'Team not found.' });
            return;
        }

        // Return the existing team object in the response
        res.status(200).json({ message: 'Team Members retrieved successfully', team: existingTeam });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error while deleting the team.');
    }
};