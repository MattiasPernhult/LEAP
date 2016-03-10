angular.module('sandboxApp', [])

.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
})

.service('Service', function() {
  var assignmentID;

  var setAssignmentID = function(id) {
    assignmentID = id;
  };

  var getAssignmentID = function() {
    return assignmentID;
  };

  return {
    setAssignmentID: setAssignmentID,
    getAssignmentID: getAssignmentID,
  };
})

.service('fileUpload', ['$http', function($http) {
  this.uploadFileToUrl = function(file, body, uploadUrl, done) {
    var fd = new FormData();
    fd.append('file', file);
    // TODO: ta bort hårdkodningen
    fd.append('languageID', 0);
    fd.append('assignmentID', body.assignmentID);
    if (body.courseCode) {
      fd.append('courseCode', body.courseCode);
    }
    fd.append('quiz', JSON.stringify(body.quiz));
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
        },
      })
      .success(function(data) {
        console.log(data);
        done(null, data);
      })
      .error(function(err) {
        console.log(err);
        done(err, null);
      });
  };
}, ])

.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    },
  };
}, ])

.controller('DashController', function($scope, $http) {
  console.log('dashController');
})

.controller('SubmitIDController', function($scope, Service) {

  $scope.$watch('assignmentID', function(newValue, oldValue) {
    console.log(newValue);
    Service.setAssignmentID(newValue);
    console.log(Service.getAssignmentID());
  });
})

.controller('SubmitController', function($scope, fileUpload, Service) {
  $scope.uploadURL = 'http://localhost:3000/compilers/compile';
  $scope.body = {
    languageID: 'Java',
  };
  $scope.showResult = false;
  $scope.showError = false;

  $scope.submitAssignment = function() {
    var file = $scope.myFile;

    fileUpload.uploadFileToUrl(file, $scope.body, $scope.uploadURL, function(err, data) {
      if (err) {
        $scope.error = err.message;
        $scope.showResult = false;
        $scope.showError = true;
      } else {
        $scope.result = data;
        $scope.showResult = true;
        $scope.showError = false;
      }
    });
  };

})

.controller('UploadController', ['$scope', 'fileUpload', function($scope, fileUpload) {
  $scope.uploadURL = 'http://localhost:3000/admins/upload';

  $scope.quiz = {
    show: false,
    questions: [],
    numberOfQuestions: 5,
    time: 10,
    percentage: 50,
  };

  $scope.question = {
    type: '0 - One correct answer',
    answers: {},
    opts: [],
    correct: [],
    correctAnswers: {},
    correctAnswer: '0',
  };

  $scope.validateQuestion = function() {
    var errors = [];
    var questionNumber = $scope.quiz.questions.length + 1;
    var question = $scope.question;
    if (question.type > 1) {
      errors.push({
        message: 'Type cannot be greater than 1 for question ' + questionNumber,
      });
    }
    if (!question.title) {
      errors.push({
        message: 'You must provide a question for question ' + questionNumber,
      });
    }
    if (question.opts.length < 2)  {
      errors.push({
        message: 'Question ' + questionNumber + ' must have atleast 2 answers',
      });
    }
    if (question.correct.length <= 0) {
      errors.push({
        message: 'Question ' + questionNumber + ' must have atleast 1 correct answers',
      });
    }
    for (var j = 0; j < question.correct.length; j++)  {
      var correctAnswer = question.correct[j];
      if (correctAnswer > question.opts.length - 1) {
        errors.push({
          message: 'The correct answer ' + correctAnswer + ' is not a possible answer ' +
            'for question ' + questionNumber,
        });
      }
    }
    return errors;
  };

  $scope.nextQuestion = function() {
    $scope.question.qid = $scope.quiz.questions.length;
    $scope.question.graded = true;
    $scope.question.desc = null;
    if (!$scope.question.code) {
      $scope.question.code = null;
    }
    $scope.question.lang = null;
    if ($scope.question.type === '0 - One correct answer') {
      $scope.question.correct.push(Number($scope.question.correctAnswer));
      $scope.question.type = 0;
    } else {
      for (var index in $scope.question.correctAnswers) {
        console.log(index);
        if ($scope.question.correctAnswers[index]) {
          if (index === 'answerOne') {
            $scope.question.correct.push(0);
          } else if (index === 'answerTwo') {
            $scope.question.correct.push(1);
          } else if (index === 'answerThree') {
            $scope.question.correct.push(2);
          } else if (index === 'answerFour') {
            $scope.question.correct.push(3);
          }
        }
      }
      $scope.question.type = 1;
    }
    for (var iterator in $scope.question.answers) {
      $scope.question.opts.push($scope.question.answers[iterator]);
    }
    var errors = $scope.validateQuestion();
    if (errors.length > 0) {
      var errorMessage = '';
      for (var i = 0; i < errors.length; i++)  {
        var message = errors[i].message;
        errorMessage += message + '\n';
      }
      $scope.error = errorMessage;
      $scope.showResult = false;
      $scope.showError = true;
      $scope.question.type = '0 - One correct answer';
      return;
    }
    $scope.quiz.questions.push($scope.question);
    $scope.question = {
      type: '0 - One correct answer',
      answers: {},
      opts: [],
      correct: [],
      correctAnswers: {},
      title: '',
      code: '',
    };
    $scope.showError = false;
    return;
  };

  $scope.body = {
    languageID: 'Java',
    courseCodes: undefined,
  };
  $scope.showResult = false;
  $scope.showError = false;

  $scope.validateQuiz = function() {
    if ($scope.quiz.numberOfQuestions > $scope.quiz.questions.length) {
      $scope.error = 'Number of questions/quiz can\'t be greater than number of questions that ' +
        'you have provided.';
      $scope.showResult = false;
      $scope.showError = true;
      return false;
    }
    return true;
  };

  $scope.uploadFile = function() {
    var file = $scope.myFile;
    $scope.body.quiz = $scope.quiz;

    if (!$scope.validateQuiz($scope.body.quiz)) {
      return;
    }

    $scope.showError = false;

    var uploadUrl = 'http://localhost:3000/admins/upload';
    fileUpload.uploadFileToUrl(file, $scope.body, uploadUrl, function(err, data) {
      if (err) {
        var errorMessage = '';
        if (angular.isArray(err)) {
          console.log('array');
          for (var i = 0; i < err.length; i++)  {
            var message = err[i].message;
            errorMessage += message + '\n';
          }
        } else {
          errorMessage = err.message;
        }
        $scope.error = errorMessage;
        $scope.showResult = false;
        $scope.showError = true;
      } else {
        $scope.result = data;
        $scope.showResult = true;
        $scope.showError = false;
      }
    });
  };

}, ])

.controller('ReviewController', function($scope, $http) {
  console.log('i reviewcontroller');
  console.log($scope.pass);
  // $scope.tryAgain = function() {
  //   console.log('tryAgain metoden');
  //   var url = 'http://localhost:3000/quiz?count=3&time=5&percentage=50';
  //   $http.get(url)
  //   .success(function(data) {
  //     console.log(data);
  //   })
  //   .error(function(err) {
  //     console.log(err);
  //   })
  // };
  // $scope.proceed = function() {
  //   console.log('proceed metoden');
  //   var url = 'http://localhost:3000/users/testfiles/submission';
  //   $http.get(url);
  // };
})

.controller('TestfilesController', function($scope, $http) {

  var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
      var t = '';
      var n, r, i, s, o, u, a;
      var f = 0;
      e = Base64._utf8_encode(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64
        } else if (isNaN(i)) {
          a = 64
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
      }
      return t
    },
    decode: function(e) {
      var t = "";
      var n, r, i;
      var s, o, u, a;
      var f = 0;
      e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = s << 2 | o >> 4;
        r = (o & 15) << 4 | u >> 2;
        i = (u & 3) << 6 | a;
        t = t + String.fromCharCode(n);
        if (u != 64) {
          t = t + String.fromCharCode(r)
        }
        if (a != 64) {
          t = t + String.fromCharCode(i)
        }
      }
      t = Base64._utf8_decode(t);
      return t
    },
    _utf8_encode: function(e) {
      e = e.replace(/\r\n/g, "\n");
      var t = "";
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r)
        } else if (r > 127 && r < 2048) {
          t += String.fromCharCode(r >> 6 | 192);
          t += String.fromCharCode(r & 63 | 128)
        } else {
          t += String.fromCharCode(r >> 12 | 224);
          t += String.fromCharCode(r >> 6 & 63 | 128);
          t += String.fromCharCode(r & 63 | 128)
        }
      }
      return t
    },
    _utf8_decode: function(e) {
      var t = "";
      var n = 0;
      var r = c1 = c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode((r & 31) << 6 | c2 & 63);
          n += 2
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          n += 3
        }
      }
      return t
    }
  }

  $scope.detail = false;
  $http.get('/admins/assignments')
    .success(function(assignments) {
      $scope.assignments = assignments.result;
    })
    .error(function(error, status) {
      console.log(error);
    });

  $scope.getDetails = function(assignment) {
    $scope.detail = true;
    $scope.code = Base64.decode(assignment.testfile);
  };
});
