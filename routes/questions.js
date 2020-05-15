var express = require('express');
var router = express.Router();
const fs = require('fs');
const path= require('path');

router.post('/', async function (req, res, next) {
  try {
    if (!(req.body.name && typeof req.body.name === "string" && req.body.options && typeof req.body.options === "string" && req.body.correct_option && typeof req.body.correct_option === "number" && !(req.params.correct_option === parseInt(req.params.correct_option, 10))
      && req.body.quiz && typeof req.body.quiz === "number" && !(req.params.quiz === parseInt(req.params.quiz, 10))&& req.body.points && typeof req.body.points === "number" && !(req.params.points === parseInt(req.params.points, 10)))) {
        return res.status(400).json({ status: "failure", reason: "payload not support" });
    }
    if (!fs.existsSync(path.join(__dirname,'quiz.json'))) {
      return res.status(404).json({});
    }
    const newQuestion = {
      id: 1,
      name: req.body.name,
      options: req.body.options,
      correct_option: req.body.correct_option,
      quiz: req.body.quiz,
      points: req.body.points
    }
    const allQuiz = JSON.parse(fs.readFileSync(path.join(__dirname,'quiz.json')));
    let isQuiz = false;
    let count = 0;
    allQuiz.data.forEach(quiz => {
      if (quiz.questions.length > 0) {
        count = count + quiz.questions.length;
      }
    });
    allQuiz.data.forEach(quiz => {
      if (quiz.id == req.body.quiz) {
        newQuestion.id = count + 1;
        quiz.questions.push(newQuestion);
        isQuiz = true;
      }
    });
    if (isQuiz) {
      fs.writeFileSync(path.join(__dirname,'quiz.json'), JSON.stringify(allQuiz));
      return res.status(201).json(newQuestion);
    } else {
      return res.status(400).json({ status: "failure", reason: "error" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get('/:question_id', async function (req, res, next) {
  try {
    if(typeof req.params.question_id === "number" && req.params.question_id === parseInt(req.params.question_id, 10)){
      throw new Error();
  }
    if (!fs.existsSync(path.join(__dirname,'quiz.json'))) {
      return res.status(404).json({});
    }
    const allQuiz = JSON.parse(fs.readFileSync(path.join(__dirname,'quiz.json')));
    let body = {
      errorCode: 404,
      data: {}
    };
    allQuiz.data.forEach(quiz => {
      if (quiz.questions.length > 0) {
        quiz.questions.forEach(question => {
          if (question.id == req.params.question_id) {
            body.errorCode = 200;
            body.data.id = question.id;
            body.data.name = question.name;
            body.data.options = question.options;
            body.data.correct_option = question.correct_option;
            body.data.quiz = question.quiz;
            body.data.points = question.points;
          }
        })
      }
    });
    return res.status(body.errorCode).json(body.data);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = router;
