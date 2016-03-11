var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var mongoService = require('../services/mongo_service');

var ioHelper = {};

ioHelper.createFolder = function(tempFolder, path, done) {
  var command = 'mkdir ' + path + tempFolder + '&& chmod 777 ' + path + tempFolder;
  exec(command, function(err, stdout, stderr) {
    if (err) {
      return done(stderr);
    }
    return done(null);
  });
};

ioHelper.removeTempFolderAndContainer = function(req, res, next) {
  res.on('finish', function() {
    exec('rm -rf ' + req.body.tempFolder);
    exec('docker rm -v ' + req.body.tempFolder);
  });
  next();
};

// TODO: add error handling for the streams and arguments to callback
ioHelper.copyFile = function(source, target, done) {
  var readStream = fs.createReadStream(source);
  var writeStream = fs.createWriteStream(target);

  readStream.pipe(writeStream);

  readStream.on('end', function() {
    done();
  });
};

ioHelper.updateQuizzes = function(done) {
  mongoService.getAllQuizzes(function(err, quizzes) {
    var quizObject = {
      email: '',
      quizzes: {},
    };
    console.log(quizzes);
    for (var i = 0; i < quizzes.length; i++) {
      var quiz = quizzes[i];
      quizObject.quizzes[quiz.quizId] = quiz.questions;
    }
    fs.writeFile(path.join(__dirname, '../quizzer/data/quizzes.json'),
    JSON.stringify(quizObject), function(err) {
      console.log('UPDATE QUIZZES: ERROR?');
      console.log(err);
      done();
    });
  });
};

module.exports = ioHelper;
