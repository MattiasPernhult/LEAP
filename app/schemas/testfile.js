var mongoose = require('mongoose');

var TestfileSchema = new mongoose.Schema({
    code: String,
    adminName: String,
    adminEmail: String,
    languageID: Number,
    courseCode: String,
    assignmentID: String
});

module.exports = mongoose.model('Testfile', TestfileSchema);
