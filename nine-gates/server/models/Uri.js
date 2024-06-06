const mongoose = require('mongoose');

const uriSchema = new mongoose.Schema({
  name: String,
  uri: String
});

module.exports = mongoose.model('Uri', uriSchema);