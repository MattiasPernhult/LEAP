var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginHelper = require('../utils/login_helper');
var _ = require('underscore-node');
var fs = require('fs');
var path = require('path');


router.get('/quiz', loginHelper.isLoggedIn, function(req, res) {
  var quiz = quizzer['generate']({
    uname: req.user.google.name,
    uemail: req.user.google.email,
    name: 'nodejs',
    count: parseInt(req.query.count),
    time: parseInt(req.query.time),
    perc: parseInt(req.query.percentage),
  });

  var p = path.join(__dirname, '../views/user/quiz.ejs');
  fs.readFile(p, function(err, data) {
    if (err) {
      console.log(err);
    }
    var compiled = _.template(data.toString());
    res.send(compiled({
      quiz: quiz,
    }));
  });
});

router.get('/review', loginHelper.isLoggedIn, function(req, res) {





});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/auth/google/callback',
  passport.authenticate('google'),
  loginHelper.isLoggedIn,
  function(req, res) {
    loginHelper.isAdmin(req, function(redirect) {
      res.redirect(redirect);
    });
  });

module.exports = router;
