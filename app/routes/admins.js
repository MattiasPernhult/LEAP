// npm and core node packages
var express = require('express');
var router = express.Router();
var path = require('path');

// project packages
var controller = require('../controllers/admin_controller');

router.post('/upload', function(req, res) {
    controller.upload(req, res);
});

router.get('/profile', function(req, res) {
    res.render('admin/profile');
});

module.exports = router;
