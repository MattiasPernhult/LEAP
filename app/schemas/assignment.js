var mongoose = require('mongoose');

var AssignmentSchema = new mongoose.Schema({
  testfile: String,
  adminName: String,
  adminEmail: String,
  languageID: Number,
  courseCode: String,
  assignmentID: String,
  failures: {type: Number, default: 0},
  success: {type: Number, default: 0},
  quiz: {type: String, default: 'java'},
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
