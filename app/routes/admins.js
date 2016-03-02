// npm and core node packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/admin_controller');
var helper = require('../utils/base_helper');
var loginHelper = require('../utils/login_helper');

router.post('/upload', loginHelper.isLoggedIn, helper.prepareUniqueFolder, helper.prepareBody,
helper.validateAdminUploadParameters, function(req, res) {
  controller.upload(req, res);
});

router.get('/upload', loginHelper.isLoggedIn, function(req, res) {
  controller.getCourseCodes(req, function(err, admin) {
    if (err) {
      return res.redirect('/');
    }
    var vm = {
      user: req.user,
      active: 'upload',
      courseCodes: admin.courseCodes,
    };
    res.render('admin/upload', vm);
  });
});

router.get('/dashboard', loginHelper.isLoggedIn, function(req, res) {
  var vm = {
    user: req.user,
    active: 'dashboard',
  };
  res.render('admin/dashboard', vm);
});

router.get('/render/testfiles', loginHelper.isLoggedIn, function(req, res) {
  var vm = {
    user: req.user,
    active: 'testfiles',
  };
  res.render('admin/testfiles', vm);
});

router.get('/testfiles', loginHelper.isLoggedIn, function(req, res) {
  controller.getTestfiles(req, res);
});

module.exports = router;
