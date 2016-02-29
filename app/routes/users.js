var express = require('express');
var router = express.Router();

var loginHelper = require('../utils/login_helper');

router.get('/submission', loginHelper.isLoggedIn, function(req, res, next) {
  var vm = {
    user: req.user,
  };
  res.render('user/submission', vm);
});

module.exports = router;
