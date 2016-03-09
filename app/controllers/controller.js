var url = require('url');
var quizzer = require('node-quizzer');

// project packages
var mongoService = require('../services/mongo_service');

// variables and packages
var controller = {};

controller.get = function(req, res) {
  var results = getResult(req);

  if (results.pass) {
    
  }

  var vm = {
    user: req.user,
    active: 'submission',
    results: results,
  };
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
  };

  return results;
};

module.exports = controller;
