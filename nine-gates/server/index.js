
const express = require('express');
const mongoose = require('mongoose');
const jobController = require('./controllers/jobController');
const cors = require('cors');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/jobSkillsDB')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error: ', err));

const app = express();

app.use(cors());

// Set up your routes
// app.get('/search/:job', jobController.getJobSkills);

// Set up your routes
app.get('/currentJob/:jobTitle', jobController.getCurrentJob);
app.get('/desiredJob/:jobTitle', jobController.getDesiredJob);


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));