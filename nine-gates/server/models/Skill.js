const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillTitle: String,
  uri: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;