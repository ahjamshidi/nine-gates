import express from 'express';
import cors from 'cors';
import connectDB from './db';
import router from './routes/routes';

// Connect to the MongoDB database
connectDB();

const app = express();

app.use(cors());
app.use('/', router);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
