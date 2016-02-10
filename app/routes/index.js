var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sandbox');
var conn = mongoose.connection;

var Schema = require('../TestSchema');

var grid = require('gridfs-stream');
grid.mongo = mongoose.mongo;

router.post('/upload', function(req, res) {

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = fs.createWriteStream(path.join(__dirname, '../uploads/', filename));
        file.pipe(fstream);
        fstream.on('close', function () {
            //res.redirect('back');
            fs.readFile(path.join(__dirname, '../uploads/main.go'), "utf8", function(err, data) {
                if (err) throw err;
                res.send("jejkejk");

                var s = new Schema({
                    id: Math.random(1000),
                    code: data
                });
                s.save(function(err, b) {
                    Schema.find({}, function (err, docs) {
                        var data = docs[docs.length - 1];
                        fs.writeFile(path.join(__dirname, '/write.go'), data.code, function(err) {
                            console.log(err);
                        });
                    });
                });

                // var gfs = grid(conn.db);
                //
                // var writeStream = gfs.createWriteStream({
                //     filename: "mongo_file.txt",
                //     metadata: "Rolf Axelsson",
                //     aliases: "DA245A"
                // });
                //
                // fs.createReadStream(path.join(__dirname, '../uploads/main.go')).pipe(writeStream);
                //
                // writeStream.on('close', function(file) {
                //     console.log(file);
                //     console.log(file.filename + ' written to db');
                // });
                //
                // var fs_write_stream = fs.createWriteStream(path.join(__dirname, '/write.txt'));
                //
                //
                // var readstream = gfs.createReadStream({
                //     filename: 'mongo_file.txt'
                // });
                //
                // readstream.pipe(fs_write_stream);
                // fs_write_stream.on('close', function() {
                //     console.log('file has been written fully!');
                // });
            });
        });
    });
});

router.get('/', function(req, res) {
    res.sendFile("./index.html");
});

module.exports = router;
