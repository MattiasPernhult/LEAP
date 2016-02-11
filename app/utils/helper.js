var crypto = require('crypto');

var helper = {};

helper.getRandomFolder = function() {
    return crypto.randomBytes(10).toString('hex');
};

helper.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = helper;
