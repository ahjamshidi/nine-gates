import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});
