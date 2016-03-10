var crypto = require('crypto');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var mongoService = require('../services/mongo_service');
var compilers = require('./compilers');
var ioHelper = require('./io_helper');

var helper = {};

helper.getRandomFolder = function() {
  return crypto.randomBytes(10).toString('hex');
};

helper.getViewModel = function(user, active, passed, error, errorMessage) {
  return {
    user: user,
    active: active,
    passed: passed,
    error: error,
    errorMessage: errorMessage,
  };
};

helper.loopThroughCollectionWithControl = function(collection, control)  {
  for (var i = 0; i < collection.length; i++) {
    var item = collection[i];
    if (item === control) {
      return true;
    }
  }
  return false;
};

helper.prepareUniqueFolder = function(req, res, next) {
  console.log('i prepare unique folder');
  var tempFolder = helper.getRandomFolder();
  req.body.tempFolder = tempFolder;
  var currentPath = path.join(__dirname, '../../');
  req.body.currentPath = currentPath;

  ioHelper.createFolder(tempFolder, currentPath, function(err) {
    if (err) {
      console.log(err);
    }
    next();
  });
};

helper.prepareBody = function(req, res, next) {
  console.log('i prepareBody');
  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val) {
    req.body[fieldname] = val;
  });

  req.busboy.on('file', function(fieldname, file, filename) {
    var userFolder = filename.substring(0, filename.indexOf('.'));
    req.body.userFolder = userFolder;
    var writeStream = fs.createWriteStream(req.body.tempFolder + '/src.zip');
    file.pipe(writeStream);

    writeStream.on('close', function(ex) {
      exec('unzip ' + req.body.tempFolder + '/src.zip -d ' + req.body.tempFolder,
        function(err, stdout, stderr) {
          if (err) {
            return res.status(400).send({
              message: 'You must provide a zip file',
            });
          }
          console.log('klara prepareBody');
          next();
        });
    });
  });
};

helper.checkIfParametersExists = function(body, parameters) {
  var errors = [];
  for (var index in parameters) {
    var parameter = parameters[index];
    if (!body[parameter]) {
      errors.push({
        message: 'You must provide ' + parameter,
      });
    }
  }
  return errors;
};

var checkParametersCorrectness = function(body, done) {
  mongoService.getAssignmentById(body.assignmentID, function(err, assignment) {
    if (!assignment) {
      return done({
        message: 'There are no assignment with this assignment id',
      });
    }
    if (Number(body.languageID) !== assignment.languageID) {
      return done({
        message: 'The assignment id has a different language id',
      });
    }
    return done(null);
  });
};

helper.validateSubmissionParameters = function(req, res, next) {
  var errors = helper.checkIfParametersExists(req.body, ['languageID', 'assignmentID']);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  checkParametersCorrectness(req.body, function(err) {
    if (err) {
      return res.status(400).send(err);
    }
    next();
  });
};

helper.validateAdminUploadParameters = function(req, res, next) {
  var parameters = ['languageID', 'assignmentID', 'courseCode'];
  var errors = helper.checkIfParametersExists(req.body, parameters);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  var correctId = Number(req.body.languageID) < compilers.length;
  if (!correctId) {
    return res.status(400).send({
      message: 'The language does not exist',
    });
  }
  checkTestFileCorrectness(req.body, function(err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result.length > 0) {
      return res.status(400).send({
        message: result,
      });
    }
    checkIfAssignmentIDExistsForAdmin(req, res, function(exists) {
      if (exists) {
        var message = 'You already have assignment with id ' + req.body.assignmentID +
          ' for course ' + req.body.courseCode;
        return res.status(400).send({
          message: message,
        });
      }
      if (req.body.quiz) {
        var errors = validateQuiz(req.body.quiz)
        if (errors.length > 0) {
          return res.status(400).send(errors);
        }
        next();
      }
    });
  });
};

var validateQuiz = function(quiz) {
  var errors = [];
  var questionNumber = 1;
  if (quiz.constructor !== Array) {
    errors.push({message: 'The quiz must be an array'});
    return errors;
  }
  for (var i = 0; i < quiz.length; i++) {
    var question = quiz[i];
    if (question.type > 1) {
      errors.push({message: 'Type cannot be greater than 1 for question ' + questionNumber});
    }
    if (!question.title) {
      errors.push({message: 'You must provide a question for question ' + questionNumber});
    }
    if (question.opts.length < 2) {
      errors.push({message: 'Question ' + questionNumber + ' must have atleast 2 answers'});
    }
    if (question.correct.length <= 0) {
      errors.push({message: 'Question ' + questionNumber + ' must have atleast 1 correct answers'});
    }
    for (var j = 0; j < question.correct.length; j++) {
      var correctAnswer = question.correct[j];
      if (correctAnswer > question.opts.length - 1) {
        errors.push({
          message: 'The correct answer ' + correctAnswer + ' is not a possible answer ' +
        'for question ' + questionNumber,
        });
      }
    }
    questionNumber++;
  }
  return errors;
};

var checkIfAssignmentIDExistsForAdmin = function(req, res, done) {
  mongoService.getAssignmentsForAdmin(req.user.google.email, function(err, assignments) {
    if (err) {
      return res.status(500).send({
        message: 'Need a break from the mongo',
      });
    }
    var assignmentID = req.user.google.email + ':' + req.body.courseCode + ':' +
      req.body.assignmentID;
    for (var i = 0; i < assignments.length; i++) {
      var assignment = assignments[i];
      if (assignment.assignmentID === assignmentID) {
        return done(true);
      }
    }
    return done(false);
  });
};

var checkTestFileCorrectness = function(body, done) {
  var tempFolder = body.tempFolder;
  var currentPath = path.join(__dirname, '../../');
  var userFolder = body.userFolder;

  var joinedPath = currentPath + tempFolder;

  var dockerCommand = 'docker run -v ' + joinedPath + ':/' + tempFolder +
    ' --name ' + tempFolder + ' -e tempfolder=./' + tempFolder + '/' + userFolder +
    ' compile_sandbox_admin_upload';

  exec(dockerCommand);
  var intervalId = setInterval(function() {
    fs.readFile(currentPath + tempFolder + '/' + userFolder + '/error.txt', 'utf8',
      function(err, data) {
        if (err) {
          return;
        }
        clearInterval(intervalId);
        return done(null, data);
      });
  }, 2000);
};

module.exports = helper;
