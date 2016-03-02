var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
  email: String,
  courseCodes: [String],
});

module.exports = mongoose.model('Admin', adminSchema);
