// npm and core node packages
var fs = require('fs');
var path = require('path');

// project packages
var mongoService = require('../services/mongo_service');
var CustomStream = require('../models/custom_stream');

// variables
var controller = {};

controller.upload = function(req, res) {
    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val) {
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function(fieldname, file, filename) {
        var stream = new CustomStream("utf-8");

        file.pipe(stream);

        stream.on('finish', function(err) {

            var file = {
                code: this.fileContent,
                adminName: req.user.google.name,
                adminEmail: req.user.google.email,
                languageID: req.body.language,
                courseCode: req.body.course,
                assignmentID: req.body.assignmentId
            };
            mongoService.insertTestfile(file, function(err, result) {
                if (err) {
                    console.log('ERROR');
                    return res.status(500).send(err);
                }
                console.log('Testfile added: ' + result);
                return res.send(result);
            });
        });
    });
};

module.exports = controller;
