var fs = require('fs'),
  data,
  temp = fs.readFileSync(__dirname + '/data/quiz.html', 'utf8'),
  _ = require('underscore-node'),
  quizzes = {},
  genUid = function() {
    var uid = Math.random().toString(36).substring(6);
    if(quizzes[uid]) {
      return genUid();
    }

    return uid;
  },
  init = function(opts) {
    quizzes[opts.quid] = opts;
    // console.log(quizzes);
  },
  resultsTo = 'results/',
  doInit = function(opts) {
    if(typeof opts.name !== 'string') {
      throw new Error('The name of the quiz to generate must be a string.');
    }

    data = JSON.parse(fs.readFileSync(__dirname + '/data/quizzes.json', 'utf-8'));
    console.log(data);

    var quiz = data.quizzes[opts.name],
      opts = opts || {},
      count = opts.count || 20,
      time = opts.time || 30,
      passPerc = opts.perc || 50,
      len = count > quiz.length ? quiz.length : count,
      compiled,
      set;

    if(typeof count !== 'number') {
      throw new Error('The count argument must be a number.');
    }
    if(typeof time !== 'number') {
      throw new Error('The time argument must be a number.');
    }
    if(typeof passPerc !== 'number') {
      throw new Error('The pass percentage argument must be a number.');
    }
    if(!quiz) {
      var err = 'No ' + opts.name + ' quizzes available';
      throw new Error(err);
    }

    // shuffle the array
    quiz = _.shuffle(quiz);

    // get random set of questions for the quiz
    set = quiz.slice(0, len);


    // initialize quiz options
    opts.quid = genUid();
    opts.questions = set;
    opts.time = time;
    opts.count = len;
    opts.perc = passPerc;
    init(opts);

    return opts;
  };

exports.generate = function(opts) {
  var opts = doInit(opts);

  // template and return the html as a result
  compiled = _.template(temp);
  return compiled({questions: opts.questions, opts: opts});
};

exports.tokenize = function(opts) {
  return doInit(opts);
};

exports.fromToken = function(token) {
  // template and return the html as a result
  var quiz = quizzes[token],
    compiled = _.template(temp);

  if(quiz) {
    return compiled({questions: quiz.questions, opts: quiz});
  } else {
    return null;
  }
};

exports.evaluate = function(formData) {
  var q = {},
    opts = {},
    resp = {
      correct: [],
      stats: {}
    },
    quid;
  // map form data by question id
  // store selected question indexes in array
  _.each(formData, function(val, key) {
    if(key=='quid') {
      quid = val;
    } else {
      var entry = key.split('T'),
        freeText = key.split('F');
      if(entry.length > 1) {
        var qid = parseInt(entry[0]),
          optionIdx = parseInt(entry[1]);

        optionIdx = Number.isNaN(optionIdx) ? parseInt(val) : optionIdx;

        q[qid] = q[qid] || [];
        q[qid].push(optionIdx);
      }

      if(freeText.length > 1) {
        var qid = parseInt(freeText[0]);
        q[qid] = q[qid] || [];
        q[qid] = val;
      }
    }
  });

  // console.log(q);
  // generate quizMap for easy answer searching
  var quizMap = {},
    curQuiz = quizzes[quid],
    unevaluated = [];
    ungraded = 0;

  _.each(data.quizzes[curQuiz.name], function(val, key) {
    quizMap[val.qid] = val;
  });

  // evaluate question answers
  _.each(q, function(val, key) {
    if(!quizMap[key].graded) {
      ungraded++;
    }
    if(quizMap[key].correct && !_.difference(quizMap[key].correct, val).length) {
      if(quizMap[key].graded) {
        resp.correct.push(key);
      }
    } else {
      if(quizMap[key].type == "2") {
        var regEx = new RegExp(quizMap[key].rule, quizMap[key].ruleOpts || "gi");
        if(regEx.test(val)) {
          resp.correct.push(key);
        }
      }
      if(quizMap[key].type == "3") {
        unevaluated.push({qid: key, answer: val});
      }
    }
  });

  var passPerc = resp.correct.length*100/(curQuiz.count-ungraded);

  resp.stats = {
    quiz: curQuiz,
    correct: resp.correct.length,
    ungraded: ungraded,
    unevaluated: unevaluated,
    total: curQuiz.count,
    perc: parseInt(passPerc),
    pass: passPerc >= curQuiz.perc
  };
  
  return resp;
};

exports.getCategories = function() {
  var names = [];
  _.each(data.quizzes, function(val, key) {
    // if there are questions in the quiz store the category name
    if(val.length) {
      names.push(key);
    }
  });

  return names;
};
