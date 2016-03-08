// npm packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/compiler_controller');
var helper = require('../utils/base_helper');

router.post('/compile', helper.prepareUniqueFolder, helper.prepareBody,
  helper.validateSubmissionParameters,
  function(req, res) {
  console.log('klara middlewares');
  controller.compile(req, res);
});

module.exports = router;
