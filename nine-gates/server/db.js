// db.js
const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect('mongodb://localhost:27017/jobSkillsDB')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error: ', err));
}

module.exports = connectDB;
