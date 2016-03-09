var url = require('url');
var quizzer = require('node-quizzer');
var _ = require('underscore-node');
var fs = require('fs');
var path = require('path');

// project packages
var mongoService = require('../services/mongo_service');

// variables and packages
var controller = {};

controller.getQuiz = function(req, res) {
  var quiz = quizzer['generate']({
    uname: req.user.google.name,
    uemail: req.user.google.email,
    name: 'nodejs',
    count: parseInt(req.query.count),
    time: parseInt(req.query.time),
    perc: parseInt(req.query.percentage),
  });

  var p = path.join(__dirname, '../views/user/quiz.ejs');
  fs.readFile(p, function(err, data) {
    if (err) {
      console.log(err);
    }
    var compiled = _.template(data.toString());
    res.send(compiled({
      quiz: quiz,
    }));
  });
};

controller.getReview = function(req, res) {
  var results = getResult(req);
  var vm = {
    user: req.user,
    active: 'submission',
    results: results,
  };

  if (results.pass) {
    mongoService.addCompletedQuizResultToUser(req.user.google.email, results.quizId,
    function(err, result) {
      if (err) {
        return res.status(500).send({
          message: 'Something went wrong when inserting the quizresult',
        });
      }
      return res.render('user/quiz_review', vm);
    });
  }
  return res.render('user/quiz_review', vm);
};

var getResult = function(req) {
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var quizResults = quizzer.evaluate(query);

  var results = {
    correct: quizResults.stats.correct,
    total: quizResults.stats.total,
    percentage: quizResults.stats.perc,
    pass: quizResults.stats.pass,
    quizId: quizResults.stats.quiz.name,
  };

  return results;
};

module.exports = controller;
