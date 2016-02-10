// npm packages
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var grid = require('gridfs-stream');
var busboy = require('connect-busboy');

// project packages
var teacher = require('./app/routes/teacher');
var compiler = require('./app/routes/compiler')

// variables
var app = express();

// mongoose and gridfs configuration
mongoose.connect('mongodb://localhost/sandbox');
grid.mongo = mongoose.mongo;

app.use(express.static('public'));

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(busboy());

app.use('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use('/', teacher);
app.use('/', compiler);

app.listen(4000, function() {
    console.log("listen on port 4000");
});
