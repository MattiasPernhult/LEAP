// project packages
var mongoService = require('../services/mongo_service');
var baseHelper = require('../utils/base_helper');

// variables and packages
var controller = {};

controller.get = function(req, res) {
  // kolla i mongo i vilket läge som användaren är i, quiz eller test
  // om användaren inte har klarat quiz, då ska vi skapa quiz och skicka till användaren
  var vm = {
    user: req.user,
    active: 'submission',
    passed: false,
    error: false,
    errorMessage: null,
  };
  // kolla om id finns med
  var parameters = ['id'];
  var errors = baseHelper.checkIfParametersExists(req.query, parameters);
  if (errors.length > 0) {
    vm.error = true;
    vm.errorMessage = errors;
    return res.render('user/submission_id', vm);
  }
  // kolla att det finns en assignment med ID:et
  mongoService.getAssignmentById(req.query.id, function(err, assignment) {
    console.log(err);
    console.log(assignment);
    if (err) {
      vm.error = true;
      vm.errorMessage = err;
      return res.render('user/submission_id', vm);
    }
    if (!assignment) {
      vm.error = true;
      vm.errorMessage = 'No assignment exists for the specified id';
      return res.render('user/submission_id', vm);
    }
    var assignmentQuizId = assignment.quiz;
    mongoService.findUserByEmail(req.user.google.email, function(err, user) {
      if (err) {
        vm.error = true;
        vm.errorMessage = err;
        return res.render('user/submission_id', vm);
      }
      var completedQuizzes = user.completedQuizzes;
      var completedTestfiles = user.completedTestfiles;
      var isQuizCompleted = false;
      var isTestfileCompleted = false;
      for (var i = 0; i < completedQuizzes.length; i++) {
        var quizId = completedQuizzes[i];
        if (quizId === assignmentQuizId) {
          // hittat den, dvs användaren har klarat quizen
          isQuizCompleted = true;
        }
      }
      if (!isQuizCompleted) {
        // quiz är inte klarade skicka quiz till användaren
        // skapa quizzen
        // skicka användaren till första frågan
        return res.redirect('/quiz');
      }

      // quiz är klarad kolla om testfilen är klarad
      for (var j = 0; j < completedTestfiles.length; j++) {
        var testfilesId = completedTestfiles[i];
        if (testfilesId === req.params.id) {
          // hittat den, dvs användaren har klarat testfilen
          isTestfileCompleted = true;
        }
      }
      if (!isTestfileCompleted) {
        // testfile är inte klarade skicka testfile till användaren
        return res.redirect('/users/testfiles/submission');
      }
      // assignment är redan klarad för denna student, meddela detta till studenten
      vm.passed = true;
      return res.render('user/submission_id', vm);
    });
  });
};

module.exports = controller;
