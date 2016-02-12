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
                teacher: req.body.teacher,
                course: req.body.course
            };
            mongoService.insertTestfile(file, function(err, result) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(result);
            });
        });
    });
};

module.exports = controller;
