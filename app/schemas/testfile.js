var mongoose = require('mongoose');

var TestfileSchema = new mongoose.Schema({
  code: String,
  adminName: String,
  adminEmail: String,
  languageID: Number,
  courseCode: String,
  assignmentID: String,
  failures: {type: Number, default: 0},
  success: {type: Number, default: 0},
});

module.exports = mongoose.model('Testfile', TestfileSchema);
