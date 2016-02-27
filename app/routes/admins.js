// npm and core node packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/admin_controller');
var helper = require('../utils/base_helper');

router.post('/upload', helper.prepareUniqueFolder, helper.prepareBody,
helper.validateAdminUploadParameters, function(req, res) {
  controller.upload(req, res);
});

router.get('/profile', function(req, res) {
  res.render('admin/profile');
});

module.exports = router;
