var express = require('express');
var router = express.Router();

var loginHelper = require('../utils/login_helper');

router.get('/submission', loginHelper.isLoggedIn, function(req, res, next) {
  res.render('user/submission');
});

module.exports = router;
