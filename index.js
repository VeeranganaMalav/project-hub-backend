const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');

require('dotenv').config();

const PORT = process.env.PORT || 8081;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB.');
        })
        .catch((err) => {
            console.log('Cannot connect to MongoDB.');
        });


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/teams', teamRoutes);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})