var express = require('express');
var router = express.Router();
var passport = require('passport');
var helper = require('../utils/base_helper');

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
  helper.isLoggedIn,
  function(req, res) {
    helper.isAdmin(req, function(redirect) {
      res.redirect(redirect);
    });
  });

module.exports = router;
