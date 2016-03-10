// npm packages
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var busboy = require('connect-busboy');
var passport = require('passport');
var session = require('express-session');
var fsExtra = require('fs-extra');

// project packages
var admins = require('./app/routes/admins');
var compilers = require('./app/routes/compilers');
var index = require('./app/routes/index');
var users = require('./app/routes/users');

var passportConfig = require('./app/config/passport');
passportConfig();

mongoose.connect('mongodb://localhost/sandbox');

// variables
var app = express();

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(__dirname + '/app/public'));
app.use(busboy());

app.use('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.use(session({
  secret: 'ilovoddddasldkalsdkalsalsjdsaksdkojijk',
  saveUninitialized: false,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/admins', admins);
app.use('/compilers', compilers);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// TODO: Change interval to one hour for production
setInterval(function emptyQuizResultsFolder() {
  fsExtra.emptyDir('./results', function(err) {
    if (err) {
      console.log('Could not empty /results folder');
    } else {
      console.log('Successfully emptied the /result folder');
    }
  });
}, 15 * 1000);

module.exports = app;
