var mongoService = require('../services/mongo_service');

var loginHelper = {};

loginHelper.isAdmin = function(req, callback) {
  if (req.user.admin) {
    if (req.user.admin === 'yes') {
      return callback('/admins/dashboard');
    }
    return callback('/users/submission');
  }
  mongoService.isAdmin(req.user.google.email, function(err, admin) {
    if (err)  {
      return callback('/');
    }
    if (admin) {
      req.user.admin = 'yes';
      return callback('/admins/dashboard');
    }
    req.user.admin = 'no';
    return callback('/users/submission');
  });
};

loginHelper.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('är inloggad');
    return next();
  }
  res.redirect('/');
};

module.exports = loginHelper;
