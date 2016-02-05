var express = require('express');
var bodyParser = require('body-parser');

var compilers = require('./compilers');
var Sandbox = require('./sandbox');
var helper = require('./helper');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

// app.use('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//
//     next();
// });

// app.get('/', function(req, res) {
//     res.sendFile("./index.html");
// });

app.post('/compile', function(req, res) {
    var body = req.body;
    var languageID = body.languageID;
    var codeBody = body.codeBody;

    var tempFolder = helper.getRandomFolder();
    var currentPath = __dirname + '/';
    var dockerImage = 'compile_sandbox';

    var compilersInformation = compilers[languageID];
    var compilerCommand = compilersInformation.command;
    var fileName = compilersInformation.file;
    var languageName = compilersInformation.name;

    var sandbox = new Sandbox(currentPath, tempFolder, dockerImage,
        compilerCommand, fileName, codeBody, languageID, languageName);

    sandbox.compile(function(result) {
        res.send({"result": result});
    });

});

app.listen(4000, function() {
    console.log("listen on port 4000");
});
