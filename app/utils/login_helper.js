var mongoService = require('../services/mongo_service');

var loginHelper = {};

loginHelper.isAdmin = function(req, callback) {
  mongoService.getAdmin(req.user.google.email, function(err, admin) {
    if (err)  {
      return callback('/');
    }
    if (admin) {
      return callback('/admins/dashboard');
    }
    return callback('/users/dashboard');
  });
};

loginHelper.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports = loginHelper;
