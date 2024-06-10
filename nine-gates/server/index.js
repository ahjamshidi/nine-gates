const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const routes = require('./routes/routes');

// Connect to the MongoDB database
connectDB();

const app = express();

app.use(cors());
app.use('/', routes)

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));