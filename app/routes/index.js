var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginHelper = require('../utils/login_helper');

var controller = require('../controllers/controller');

router.get('/quiz', loginHelper.isLoggedIn, function(req, res) {
  controller.getQuiz(req, res);
});

router.get('/review', loginHelper.isLoggedIn, function(req, res) {
  controller.getReview(req, res);
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
