// npm packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/compiler_controller');

router.post('/compile', function(req, res) {
    controller.compile(req, res);
});

module.exports = router;
