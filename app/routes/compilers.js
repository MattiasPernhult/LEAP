// npm packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/compiler_controller');
var helper = require('../utils/base_helper');
var loginHelper = require('../utils/login_helper');
var ioHelper = require('../utils/io_helper');

router.post('/compile', loginHelper.isLoggedIn, ioHelper.removeTempFolderAndContainer,
helper.prepareUniqueFolder, helper.prepareBody, helper.validateSubmissionParameters,
function(req, res) {
  controller.compile(req, res);
});

module.exports = router;
