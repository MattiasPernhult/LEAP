var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
  type: Number,
  opts: [String],
  correct: [String],
  title: String,
  qid: String,
  graded: Boolean,
  desc: String,
  code: String,
  lang: String,
});

var QuizSchema = new mongoose.Schema({
  quizId: String,
  questions: [QuestionSchema],
  quizCreator: {
    name: String,
    email: String,
  },
  numberOfQuestions: Number,
  quizTime: Number,
  quizPercentage: Number,
});

module.exports = {
  Quiz: mongoose.model('Quizze', QuizSchema),
  Question: mongoose.model('Question', QuestionSchema),
};
