const express = require('express');
const jobController = require('./controllers/jobController');
const cors = require('cors');
const connectDB = require('./db');

// Connect to the MongoDB database
connectDB();

const app = express();

app.use(cors());

// Routes set up
app.get('/currentJob/:jobTitle', jobController.getCurrentJob);
app.get('/desiredJob/:jobTitle', jobController.getDesiredJob);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));