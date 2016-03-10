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
      var fileContentInBase64 = new Buffer(fileContent).toString('base64');
      var assignment = {
        testfile: fileContentInBase64,
        adminName: req.user.google.name,
        adminEmail: req.user.google.email,
        languageID: req.body.languageID,
        courseCode: req.body.courseCode,
        assignmentID: req.user.google.email + ':' + req.body.courseCode + ':' +
        req.body.assignmentID,
      };

      if (req.body.quiz) {
        assignment.quiz = req.user.google.email + ':' + req.body.courseCode + ':' +
        req.body.assignmentID;
      }

      mongoService.insertAssignment(assignment, function(err, assignment) {
        if (err) {
          return res.status(500).send(err);
        }
        if (req.body.quiz) {
          mongoService.insertQuiz(req.body, req.user.google.email + ':' + req.body.courseCode +
          ':' + req.body.assignmentID, req.user.google, function(err, quiz) {
            if (err) {
              return res.status(500).send(err);
            }
            console.log('Assignment added: ' + assignment);
            setInterval(function() {
              ioHelper.updateQuizzes();
            }, 5000);
            return res.send(assignment);
          });
        }
        return res.send(assignment);
      });
    });
};

controller.getCourseCodes = function(req, done) {
  mongoService.getAdmin(req.user.google.email, function(err, admin) {
    return done(err, admin);
  });
};

controller.getAssignments = function(req, res) {
  mongoService.getAssignmentsForAdmin(req.user.google.email, function(err, assignments) {
    if (err) {
      return res.status(500).send(err);
    }
    var response = {
      result: assignments,
    };
    res.send(response);
  });
};

module.exports = controller;
