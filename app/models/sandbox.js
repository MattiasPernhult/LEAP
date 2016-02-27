var Sandbox = function(langID, assID, tempFold, currPath, langName, compComm,
  usFi, teFi, teRu, dockIm, teRuLo, usFiCon, jaRu) {
  this.languageID = langID;
  this.assignmentID = assID;
  this.languageName = langName;
  this.compileCommand = compComm;
  this.userFile = usFi;
  this.testFile = teFi;
  this.testRunner = teRu;
  this.dockerImage = dockIm;
  this.path = currPath + tempFold + '/';
  this.testRunnerLocation = teRuLo;
  this.userFileContent = new Buffer(usFiCon.toString(), 'base64').toString('ascii');
  this.javaRunner = jaRu;
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

    var locationForTestFile = self.path + self.testFile;
    var locationForTestRunner = self.path + self.testRunner;

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

  var executeStatement = 'docker run -v ' + this.currentPath + this.tempFolder +
    ':/' + this.tempFolder + ' --name ' + this.tempFolder + ' -e testfile=' +
    this.testFile + ' -e javafile=' + this.userFile + ' -e testrunner=' + this.testRunner +
    ' -e tempfolder=' + this.tempFolder + ' -e output=./output.txt' +
    ' -e go=TestRunner ' + this.dockerImage;

  console.log(executeStatement);

  exec(executeStatement, function(error, stdout, stderr) {
    console.log('ERROR');
    console.log('-------------');
    console.log(error);
    console.log('-------------');

    console.log('STDERR');
    console.log('-------------');
    console.log(stderr);
    console.log('-------------');
  });

  var intervalId = setInterval(function() {
    fs.readFile(self.currentPath + self.tempFolder + '/output.txt', 'utf8',
      function(err, data) {
        if (err) {
          return;
        }
        callback(data);
        clearInterval(intervalId);
        exec('rm -rf ' + self.tempFolder);
        exec('docker rm -v ' + self.tempFolder);
      });

  }, 2000);
};

module.exports = Sandbox;
