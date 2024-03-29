// project packages
var Sandbox = require('../models/sandbox');
var compilers = require('../utils/compilers');

// variables and packages
var controller = {};

controller.compile = function(req, res) {
  var body = req.body;
  var languageID = body.languageID;
  var assignmentID = body.assignmentID;

  var tempFolder = body.tempFolder;
  var currentPath = body.currentPath;
  var compilersInformation = compilers[languageID];
  var languageName = compilersInformation.name;
  var compileCommand = compilersInformation.compileCommand;
  var userFile = compilersInformation.userFile;
  var testFile = compilersInformation.testFile;
  var testRunner = compilersInformation.testRunner;
  var dockerImage = compilersInformation.dockerImage;
  var testRunnerLocation = compilersInformation.testRunnerLocation;
  var userFileContent = body.fileContent;
  var javaRunner = compilersInformation.javaRunner;

  // creating a new sandbox
  var sandbox = new Sandbox(languageID, assignmentID, tempFolder, currentPath,
    languageName, compileCommand, userFile, testFile, testRunner, dockerImage,
    testRunnerLocation, userFileContent, javaRunner, req.body.userFolder);

  // starting the compiling of the source code
  sandbox.compile(function(err, result) {
    if (err) {
      return res.status(err.status).send(err);
    }
    return res.send(result);
  });
};

module.exports = controller;
