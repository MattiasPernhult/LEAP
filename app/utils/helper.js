var crypto = require('crypto');
var exec = require('child_process').exec;
var fs = require('fs');

var mongoService = require('../services/mongo_service');
var CustomStream = require('../models/custom_stream');
var compilers = require('./compilers');

var helper = {};

helper.getRandomFolder = function() {
  return crypto.randomBytes(10).toString('hex');
};

helper.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

helper.prepareBody = function(req, res, next) {
  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val) {
    req.body[fieldname] = val;
  });

  req.busboy.on('file', function(fieldname, file, filename) {
    var stream = new CustomStream('utf-8');
    file.pipe(stream);
    stream.on('finish', function(err) {
      if (err) {
        // TODO: Handle the error
      }
      req.body.fileContent = this.fileContent;
      next();
    });
  });
};

helper.validteAdminUploadParameters = function(req, res, next) {
  // Kolla så att submission id finns med och language id och att en fil är vald
  var parameters = ['fileContent', 'languageID', 'assignmentID', 'courseCode'];
  var errors = checkParametersExists(req.body, parameters);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  var correctId = Number(req.body.languageID) < compilers.length;
  if (!correctId) {
    return res.status(400).send({message: 'The language does not exist'});
  }
};

helper.validateSubmissionParameters = function(req, res, next) {
  // Kolla så att submission id finns med och language id och att en fil är vald
  var errors = checkParametersExists(req.body, ['fileContent', 'languageID', 'assignmentID']);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  checkParametersCorrectness(req.body, function(err) {
    if (err) {
      return res.status(400).send(err);
    }
    next();
  });
};

helper.createFolder = function(tempFolder, path, done) {
  var command = 'mkdir ' + path + tempFolder + '&& chmod 777 ' + path + tempFolder;
  exec(command, function(err, stdout, stderr) {
    if (err) {
      return done(stderr);
    }
    return done(null);
  });
};

var checkTestFileCorrectness = function(body, done) {
  // gör om testfilen till vanlig text
  // skapa en unik mapp och lägga i testfilen där
  // kopiera rnner-scriptet till den unika mappen
  // skapa docker-kommandot, kör den och fånga upp stderr och skicka tillbaka

  var testfile = new Buffer(body.fileContent.toString(), 'base64').toString('ascii');

  // setting up folders and path
  var tempFolder = helper.getRandomFolder();
  var path = path.join(__dirname, '../../');

  createFolder(tempFolder, path, function(err) {
    if (err) {
      return done(err);
    }
    fs.writeFile(path + tempFolder + '/MainTest.java', testfile,
      function(err) {
        if (err) {
          return done(err);
        }
      };
  });
};

var checkParametersExists = function(body, parameters) {
  var errors = [];
  for (var index in parameters) {
    var parameter = parameters[index];
    if (!body[parameter]) {
      errors.push({message: 'You must provide ' + parameter});
    }
  }
  return errors;
};

var checkParametersCorrectness = function(body, done) {
  mongoService.getTestfileById(body.assignmentID, function(err, testfile) {
    if (!testfile) {
      return done({message: 'There are no testfile with this assignment id'});
    }
    console.log(typeof body.languageID);
    if (Number(body.languageID) !== testfile[0].languageID) {
      return done({message: 'The assignment id has a different language id'});
    }
    return done(null);
  });
};

helper.isAdmin = function(req, callback) {
  if (req.user.admin) {
    if (req.user.admin === 'yes') {
      return callback('/admins/profile');
    }
    return callback('/users/submission');
  }
  mongoService.isAdmin(req.user.google.email, function(err, admin) {
    if (err)  {
      return callback('/');
    }
    if (admin) {
      req.user.admin = 'yes';
      return callback('/admins/profile');
    }
    req.user.admin = 'no';
    return callback('/users/submission');
  });
};

module.exports = helper;
