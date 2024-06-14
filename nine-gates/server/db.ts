import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
function connectDB(): void {
  mongoose
    .connect(
      process.env['DATABASE_URI'] ||
        'mongodb://root:root@localhost:27017/jobSkillsDB?authSource=admin'
    )
    .then(() => console.log('Database connected successfully'))
    .then(() => console.log('Database: ', process.env['DATABASE_URI']))
    .catch((err) => console.error('Database connection error: ', err));
}

export default connectDB;
