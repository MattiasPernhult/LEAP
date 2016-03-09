// project packages
var mongoService = require('../services/mongo_service');
var baseHelper = require('../utils/base_helper');

// variables and packages
var controller = {};

controller.get = function(req, res) {
  // kolla i mongo i vilket läge som användaren är i, quiz eller test
  // om användaren inte har klarat quiz, då ska vi skapa quiz och skicka till användaren

  // kolla om id finns med
  var parameters = ['id'];
  var errors = baseHelper.checkIfParametersExists(req.query, parameters);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  // kolla att det finns en assignment med ID:et
  mongoService.getTestfileById(req.query.id, function(err, testfile) {
    if (err) {
      return res.status(500).send({message: 'I need a break and so do you!'});
    }
    if (!testfile) {
      return res.status(400).send({
        message: 'There are no assignment with the provided id',
      });
    }
    var assignmentQuizId = testfile[0].quiz;
    mongoService.findUserByEmail(req.user.google.email, function(err, user) {
      if (err) {
        return res.status(500).send({message: 'I need a break and so do you!'});
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
      var vm = {
        user: req.user,
        active: 'submission',
        passed: true,
      };
      return res.render('user/submission_id', vm);
    });
  });
};

module.exports = controller;
