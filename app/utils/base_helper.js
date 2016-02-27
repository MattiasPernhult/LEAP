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

helper.prepareUniqueFolder = function(req, res, next) {
  var tempFolder = helper.getRandomFolder();
  req.body.tempFolder = tempFolder;
  var currentPath = path.join(__dirname, '../../');

  ioHelper.createFolder(tempFolder, currentPath, function(err) {
    if (err) {
      console.log(err);
    }
    next();
  });
};

helper.prepareBody = function(req, res, next) {
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
            return res.status(400).send({message: 'You must provide a zip file'});
          }
          next();
        });
    });
  });
};

var checkIfParametersExists = function(body, parameters) {
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
  mongoService.getTestfileById(body.assignmentID, function(err, testfile) {
    if (!testfile) {
      return done({
        message: 'There are no testfile with this assignment id',
      });
    }
    console.log(typeof body.languageID);
    if (Number(body.languageID) !== testfile[0].languageID) {
      return done({
        message: 'The assignment id has a different language id',
      });
    }
    return done(null);
  });
};

helper.validateSubmissionParameters = function(req, res, next) {
  var errors = checkIfParametersExists(req.body, ['languageID', 'assignmentID']);
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
  var errors = checkIfParametersExists(req.body, parameters);
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
    next();
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
