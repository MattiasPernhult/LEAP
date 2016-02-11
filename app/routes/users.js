var express = require('express');
var router = express.Router();
var passport = require('passport');

var helper = require('../utils/helper');

router.get('/submission', helper.isLoggedIn, function(req, res, next) {
    var vm = {
        user: req.user.google.name,
        email: req.user.google.email
    }
    res.render('submission', vm);
});

module.exports = router;
