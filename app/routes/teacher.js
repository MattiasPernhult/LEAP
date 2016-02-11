// npm and core node packages
var express = require('express');
var router = express.Router();
var path = require('path');

// project packages
var controller = require('../controllers/teacher_controller');

router.post('/upload', function(req, res) {
    controller.upload(req, res);
});

module.exports = router;
