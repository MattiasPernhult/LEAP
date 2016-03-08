var express = require('express');
var router = express.Router();

var loginHelper = require('../utils/login_helper');

router.get('/submission', loginHelper.isLoggedIn, function(req, res, next) {
  var vm = {
    user: req.user,
    active: 'submission',
  };
  res.render('user/submission', vm);
});

router.get('/dashboard', loginHelper.isLoggedIn, function(req, res, next) {
  var vm = {
    user: req.user,
    active: 'dashboard',
  };
  res.render('user/dashboard', vm);
});

router.get('/assignments', loginHelper.isLoggedIn, function(req, res, next) {
  
});

module.exports = router;
