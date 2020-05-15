var express = require('express');
var router = express.Router();
const fs = require('fs');
const path=require('path');

/* GET users listing. */
router.get('/:quiz_id', function (req, res, next) {
    try {
        if(typeof req.params.quiz_id === "number" && req.params.quiz_id === parseInt(req.params.quiz_id, 10)){
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
            if(quiz.id == req.params.quiz_id){
                body.errorCode=200;
                body.data.name = quiz.name;
                body.data.description = quiz.description;
                body.data.questions = quiz.questions;
            }
        });
        return res.status(body.errorCode).json(body.data);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

module.exports = router;