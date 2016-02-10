// project packages
var Sandbox = require('../models/sandbox');
var helper = require('../utils/helper');

// variables and packages
var controller = {};

controller.compile = function(req, res) {
    // parameters from the request
    var body = req.body;
    var languageID = body.languageID;
    var codeBody = body.codeBody;

    // setting up folders and path
    var tempFolder = helper.getRandomFolder();
    var currentPath = __dirname + '/';
    var dockerImage = 'compile_sandbox';

    // Getting compiler information
    var compilersInformation = compilers[languageID];
    var compilerCommand = compilersInformation.command;
    var fileName = compilersInformation.file;
    var languageName = compilersInformation.name;

    // creating a new sandbox
    var sandbox = new Sandbox(currentPath, tempFolder, dockerImage,
        compilerCommand, fileName, codeBody, languageID, languageName);

    // starting the compiling of the source code
    sandbox.compile(function(result) {
        res.send({"result": result});
    });
};

module.exports = controller;
