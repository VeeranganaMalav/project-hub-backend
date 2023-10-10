const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  role: {
    type: String,
    enum: ['Admin', 'Project Manager', 'Team Member'],
    required: true
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;