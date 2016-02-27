var express = require('express');
var router = express.Router();

var helper = require('../utils/helper');

router.get('/submission', helper.isLoggedIn, function(req, res, next) {
  console.log(req.user);
  res.render('user/submission');
});

module.exports = router;
