var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var busboy = require('connect-busboy');

var compilers = require('./compilers');
var Sandbox = require('./sandbox');
var helper = require('./helper');
var index = require('./routes/index');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(busboy());

app.use('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use('/', index);

// app.post('/compile', function(req, res) {
//     var body = req.body;
//     var languageID = body.languageID;
//     var codeBody = body.codeBody;
//
//     var tempFolder = helper.getRandomFolder();
//     var currentPath = __dirname + '/';
//     var dockerImage = 'compile_sandbox';
//
//     var compilersInformation = compilers[languageID];
//     var compilerCommand = compilersInformation.command;
//     var fileName = compilersInformation.file;
//     var languageName = compilersInformation.name;
//
//     var sandbox = new Sandbox(currentPath, tempFolder, dockerImage,
//         compilerCommand, fileName, codeBody, languageID, languageName);
//
//     sandbox.compile(function(result) {
//         res.send({"result": result});
//     });
//
// });

app.listen(4000, function() {
    console.log("listen on port 4000");
});
