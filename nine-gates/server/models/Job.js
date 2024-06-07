const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  firstUri: String,
  essentialSkills: [String]
});

module.exports = mongoose.model('Job', jobSchema);
