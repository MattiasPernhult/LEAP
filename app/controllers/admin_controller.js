// npm and core node packages
var fs = require('fs');

// project packages
var mongoService = require('../services/mongo_service');
var ioHelper = require('../utils/io_helper');

// variables
var controller = {};

controller.upload = function(req, res) {

  fs.readFile(req.body.tempFolder + '/' + req.body.userFolder + '/MainTest.java', 'utf-8',
    function(err, fileContent) {
      if (err) {
        return res.status(400).send({
          message: err,
        });
      }

      console.log(req.body);
      var fileContentInBase64 = new Buffer(fileContent).toString('base64');
      var testFile = {
        code: fileContentInBase64,
        adminName: req.user.google.name,
        adminEmail: req.user.google.email,
        languageID: req.body.languageID,
        courseCode: req.body.courseCode,
        assignmentID: req.body.assignmentID,
      };

      mongoService.insertTestfile(testFile, function(err, result)  {
        if (err) {
          return res.status(500).send(err);
        }
        console.log('Testfile added: ' + result);
        ioHelper.removeTempFolder(req.body.tempFolder);
        ioHelper.removeTempContainer(req.body.tempFolder);
        return res.send(result);
      });
    });
};

controller.getTestfiles = function(req, res) {
  mongoService.getTestfilesForAdmin(req.user.google.email, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('Testfiles for admin: ' + result);
    res.send(result);
  });
};

module.exports = controller;
