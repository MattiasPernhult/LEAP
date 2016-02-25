// npm and core node packages

// project packages
var mongoService = require('../services/mongo_service');

// variables
var controller = {};

controller.upload = function(req, res) {

  var file = {
    code: req.body.fileContent,
    adminName: req.user.google.name,
    adminEmail: req.user.google.email,
    languageID: req.body.languageID,
    courseCode: req.body.courseCode,
    assignmentID: req.body.assignmentID,
  };
  mongoService.insertTestfile(file, function(err, result)  {
    if (err) {
      console.log('ERROR');
      return res.status(500).send(err);
    }
    console.log('Testfile added: ' + result);
    return res.send(result);
  });
};

module.exports = controller;
