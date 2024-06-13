// db.js
const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect('mongodb://root:123@localhost:27017/jobSkillsDB?authSource=admin')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error: ', err));
}

module.exports = connectDB;