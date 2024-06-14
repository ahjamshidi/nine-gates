import express from 'express';
import cors from 'cors';
import connectDB from './db';
import occupationRoutes from './routes/occupation.routes';

// Ensure models are imported
import './models/skill';
import './models/occupation';
import dotenv from 'dotenv';

dotenv.config();
// Connect to the MongoDB database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/occupations', occupationRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
