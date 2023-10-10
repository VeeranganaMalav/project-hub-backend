const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        required: true
    },
    assignedTeamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subTasks: {
        type: [String]
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;