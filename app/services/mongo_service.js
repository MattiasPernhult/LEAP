// project packages
var TestfileSchema = require('../schemas/assignment');
var UserSchema = require('../schemas/user');
var AdminSchema = require('../schemas/admin');
var QuizSchema = require('../schemas/quiz');

var mongoService = function() {

  var insertAssignment = function(file, callback) {
    var testfile = new TestfileSchema(file);
    testfile.save(function(err, response) {
      if (err)  {
        return callback(err, null);
      }
      var r = {
        id: response._id,
      };
      return callback(null, r);
    });
  };

  var getAssignmentById = function(id, callback)  {
    TestfileSchema.findById(id, function(err, testfile) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, testfile);
    });
  };

  var findUserByEmail = function(userEmail, callback) {
    UserSchema.findOne({
      'google.email': userEmail,
    }, function(err, user) {
      return callback(err, user);
    });
  };

  var findUserById = function(id, callback) {
    UserSchema.findById(id, function(err, user) {
      callback(err, user);
    });
  };

  var findOne = function(query, callback) {
    UserSchema.findOne(query, function(err, result) {
      callback(err, result);
    });
  };

  var saveGoogleUser = function(profile, token, callback) {
    var newUser = new UserSchema();
    newUser.google.id = profile.id;
    newUser.google.token = token;
    newUser.google.name = profile.displayName;
    newUser.google.email = profile.emails[0].value;

    newUser.save(function(err) {
      callback(err, newUser);
    });
  };

  var getAdmin = function(adminEmail, callback) {
    AdminSchema.findOne({
      email: adminEmail,
    }, function(err, admin) {
      return callback(err, admin);
    });
  };

  var getAssignmentsForAdmin = function(email, callback) {
    TestfileSchema.find({
      adminEmail: email,
    }, function(err, assignments) {
      return callback(err, assignments);
    });
  };

  var incrementCounterForAssignment = function(assignmentID, userEmail, success) {
    var incrementObject = {
      $inc: {},
    };
    if (success) {
      incrementObject.$inc.success = 1;
    } else {
      incrementObject.$inc.failures = 1;
    }
    TestfileSchema.findByIdAndUpdate(assignmentID, incrementObject);
  };

  var addCompletedQuizResultToUser = function(userEmail, quizId, callback) {
    UserSchema.findOneAndUpdate({
        'google.email': userEmail,
      }, {
        $push: {
          completedQuizzes: quizId,
        },
      },
      function(err, result) {
        callback(err, result);
      });
  };

  var addCompletedTestfileResultToUser = function(userEmail, testfileId) {
    UserSchema.findOneAndUpdate({
      'google.email': userEmail,
    }, {
      $push: {
        completedTestfiles: testfileId,
      },
    }, function(err, testfile) {
      console.log(err);
      console.log(testfile);
    });
  };

  var insertQuiz = function(quiz, quizId, user, done) {
    var quiz = new QuizSchema();
    quiz.quizId = quizId;
    quiz.quiz = quiz;
    quiz.quizCreator.name = user.name;
    quiz.quizCreator.email = user.email;
    quiz.save(function(err, quiz) {
      console.log(err);
      console.log(quiz);
    });
  };

  return {
    insertAssignment: insertAssignment,
    getAssignmentById: getAssignmentById,
    findUserById: findUserById,
    findOne: findOne,
    saveGoogleUser: saveGoogleUser,
    getAdmin: getAdmin,
    getAssignmentsForAdmin: getAssignmentsForAdmin,
    incrementCounterForAssignment: incrementCounterForAssignment,
    findUserByEmail: findUserByEmail,
    addCompletedQuizResultToUser: addCompletedQuizResultToUser,
    addCompletedTestfileResultToUser: addCompletedTestfileResultToUser,
  };
};

module.exports = mongoService();
