var crypto = require('crypto');

var mongoService = require('../services/mongo_service');

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

helper.isAdmin = function(req, callback) {
    if (req.user.admin) {
        if (req.user.admin == "yes") {
            return callback('/admins/profile');
        }
        return callback('/users/submission');
    }
    mongoService.isAdmin(req.user.google.email, function(err, admin) {
        if (err) {
            return callback('/');
        }
        if (admin) {
            req.user.admin = "yes";
            return callback('/admins/profile');
        }
        req.user.admin = "no";
        return callback('/users/submission');
    });
};

module.exports = helper;
