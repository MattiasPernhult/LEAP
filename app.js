// npm packages
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var busboy = require('connect-busboy');
var passport = require('passport');
var session  = require('express-session');

// project packages
var teacher = require('./app/routes/teacher');
var compiler = require('./app/routes/compiler')
var index = require('./app/routes/index');
var passportConfig = require('./app/config/passport');
passportConfig();

mongoose.connect('mongodb://localhost/sandbox');

// variables
var app = express();

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(busboy());

// app.use('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//
//     next();
// });

app.use(session({
    secret: 'ilovescotcotc',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/admins', teacher);
app.use('/compilers', compiler);

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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
