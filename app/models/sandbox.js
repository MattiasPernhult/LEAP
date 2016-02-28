var Sandbox = function(langID, assID, tempFold, currPath, langName, compComm,
  usFi, teFi, teRu, dockIm, teRuLo, usFiCon, jaRu, userFold) {
  this.languageID = langID;
  this.assignmentID = assID;
  this.languageName = langName;
  this.compileCommand = compComm;
  this.userFile = usFi;
  this.testFile = teFi;
  this.testRunner = teRu;
  this.dockerImage = dockIm;
  this.tempFolder = tempFold;
  this.joinedPath = currPath + tempFold + '/';
  this.testRunnerLocation = teRuLo;
  this.javaRunner = jaRu;
  this.userFolder = userFold;
};

Sandbox.prototype.compile = function(callback) {
  var self = this;

  this.setup(function() {
    self.execute(callback);
    // callback("hello", 20, {});
  });
};

Sandbox.prototype.setup = function(callback) {
  var fs = require('fs');
  var mongoService = require('../services/mongo_service');
  var ioHelper = require('../utils/io_helper');

  var self = this;

  mongoService.getTestfileById(this.assignmentID, function(err, testfile) {
    if (err) {
      console.log(err);
      // kunde inte hitta testfilen, rätt id?
    }
    var rawTestfileContent = new Buffer(testfile[0].code.toString(), 'base64').toString('ascii');
    console.log(self.testRunnerLocation);

    var locationForTestFile = self.joinedPath + '/' + self.userFolder + '/' + self.testFile;
    var locationForTestRunner = self.joinedPath + '/' + self.userFolder + '/' + self.testRunner;
    console.log(locationForTestFile);

    fs.writeFile(locationForTestFile, rawTestfileContent, function(err) {
      // TODO: error handling, no testrunner, probably 500 (Internal Server Error),
      // should send mail that problem exists
      if (err) {
        console.log(err);
      }
      ioHelper.copyFile(self.testRunnerLocation, locationForTestRunner, function() {
        callback();
      });
    });
  });
};

Sandbox.prototype.execute = function(callback) {
  var exec = require('child_process').exec;
  var fs = require('fs');

  var self = this;

  var executeStatement = 'docker run -v ' + this.joinedPath + this.userFolder + ':/' +
    this.tempFolder + '/' + this.userFolder + ' --name ' + this.tempFolder +
    ' -e testfile=' + this.testFile + ' -e javafile=' + this.userFile + ' -e testrunner=' +
    this.testRunner + ' -e tempfolder=' + this.tempFolder + '/' + this.userFolder +
    ' -e output=./output.txt' + ' -e go=TestRunner ' + this.dockerImage;

  console.log(executeStatement);

  exec(executeStatement, function(err, stdout, stderr) {
    if (stderr) {
      var error = {
        status: 400,
        message: stderr,
      };
      exec('rm -rf ' + self.tempFolder);
      exec('docker rm -v ' + self.tempFolder);
      return callback(error, null);
    }
    fs.readFile(self.joinedPath + self.userFolder + '/output.txt', 'utf8', function(err, data) {
      if (err) {
        var error = {
          status: 500,
          message: err,
        };
        callback(error, data);
      } else {
        callback(err, {result: data});
      }
      exec('rm -rf ' + self.tempFolder);
      exec('docker rm -v ' + self.tempFolder);
    });
  });
};

module.exports = Sandbox;
