const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  firstUri: String,
  essentialSkills: [String],
  essentialSkillsUris: [String]
});

module.exports = mongoose.model('Job', jobSchema);
