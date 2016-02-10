var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    id: Number,
    code: String
});

module.exports = mongoose.model('Schema', Schema);
