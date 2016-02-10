var mongoose = require('mongoose');

var TestfileSchema = new mongoose.Schema({
    code: String,
    teacher: String,
    course: String
});

module.exports = mongoose.model('TestfileSchema', TestfileSchema);
