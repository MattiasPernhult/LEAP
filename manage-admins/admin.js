var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    email: { type: String, required: 'Email' },
    courseCode: { type: [String] },
});

module.exports = mongoose.model('Admin', adminSchema);
