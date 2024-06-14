import mongoose from 'mongoose';

function connectDB(): void {
  mongoose
    .connect('mongodb://root:root@127.0.0.1:27017/jobSkillsDB?authSource=admin')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error: ', err));
}

export default connectDB;
