var mongoose = require('mongoose');

var QuizSchema = new mongoose.Schema({
  quizId: String,
  quiz: [{
    qid: String,
    graded: Boolean,
    type: Number,
    title: String,
    desc: String,
    code: String,
    lang: String,
    opts: [String],
    correct: [String],
  },],
  quizCreator: {
    name: String,
    email: String,
  },
});

module.exports = mongoose.model('Quizze', QuizSchema);
