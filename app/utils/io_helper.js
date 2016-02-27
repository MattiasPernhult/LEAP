var fs = require('fs');
var exec = require('child_process').exec;

var ioHelper = {};

ioHelper.createFolder = function(tempFolder, path, done) {
  var command = 'mkdir ' + path + tempFolder + '&& chmod 777 ' + path + tempFolder;
  exec(command, function(err, stdout, stderr) {
    if (err) {
      return done(stderr);
    }
    return done(null);
  });
};

// TODO: add error handling for the streams and arguments to callback
ioHelper.copyFile = function(source, target, done) {
  var readStream = fs.createReadStream(source);
  var writeStream = fs.createWriteStream(target);

  readStream.pipe(writeStream);

  readStream.on('end', function() {
    done();
  });
};

module.exports = ioHelper;
