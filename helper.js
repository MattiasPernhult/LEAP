var crypto = require('crypto');

var helper = {};

helper.getRandomFolder = function() {
    return crypto.randomBytes(10).toString('hex');
};

module.exports = helper;
