// project packages
var mongoService = require('../services/mongo_service');
var baseHelper = require('../utils/base_helper');

// variables and packages
var controller = {};

var validateUserParameters = function(req, res, done) {
  var parameters = ['id'];
  var vm;
  var errors = baseHelper.checkIfParametersExists(req.query, parameters);
  if (errors.length > 0) {
    vm = baseHelper.getViewModel(req.user, 'submission', false, true, errors);
    return res.render('user/submission_id', vm);
  }
  mongoService.getAssignmentById(req.query.id, function(err, assignment) {
    if (err) {
      vm = baseHelper.getViewModel(req.user, 'submission', false, true, err);
      return res.render('user/submission_id', vm);
    }
    if (!assignment)  {
      vm = baseHelper.getViewModel(req.user, 'submission', false, true, errors,
        'No assignment exists for the specified id');
      return res.render('user/submission_id', vm);
    }
    done(req, res, assignment);
  });
};

var controllerWhichStateTheUserIsIn = function(req, res, assignment) {
  var vm;
  mongoService.findUserByEmail(req.user.google.email, function(err, user) {
    if (err)  {
      vm = baseHelper.getViewModel(req.user, 'submission', false, true, err);
      return res.render('user/submission_id', vm);
    }
    var completedQuizzes = user.completedQuizzes;
    var assignmentQuizId = assignment.quiz;
    var isQuizCompleted = baseHelper.loopThroughCollectionWithControl(completedQuizzes,
      assignmentQuizId);
    if (!isQuizCompleted) {
      return res.redirect('/quiz');
    }
    var completedTestfiles = user.completedTestfiles;
    var isTestfileCompleted = baseHelper.loopThroughCollectionWithControl(completedTestfiles,
      req.query.id);
    if (!isTestfileCompleted) {
      return res.redirect('/users/testfiles/submission');
    }
    vm = baseHelper.getViewModel(req.user, 'submission', true, false, null);
    return res.render('user/submission_id', vm);
  });
};

controller.get = function(req, res) {
  validateUserParameters(req, res, controllerWhichStateTheUserIsIn);
};

module.exports = controller;
