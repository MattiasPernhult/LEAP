// npm and core node packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/admin_controller');
var helper = require('../utils/base_helper');
var loginHelper = require('../utils/login_helper');
var ioHelper = require('../utils/io_helper');

router.post('/upload', loginHelper.isLoggedIn, ioHelper.removeTempFolderAndContainer,
helper.prepareUniqueFolder, helper.prepareBody, helper.validateAdminUploadParameters,
function(req, res) {
  console.log(req.body.quiz.questions);
  //controller.upload(req, res);
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

router.get('/render/assignments', loginHelper.isLoggedIn, function(req, res) {
  var vm = {
    user: req.user,
    active: 'assignments',
  };
  res.render('admin/assignments', vm);
});

router.get('/assignments', loginHelper.isLoggedIn, function(req, res) {
  controller.getAssignments(req, res);
});

module.exports = router;
