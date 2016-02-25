// npm packages
var express = require('express');
var router = express.Router();

// project packages
var controller = require('../controllers/compiler_controller');
var helper = require('../utils/helper');

router.post('/compile', helper.prepareBody, helper.validateSubmissionParameters, function(req, res) {
  console.log('KLARA DET');
  return res.send('Klarar det');
  // controller.compile(req, res);
});

module.exports = router;
