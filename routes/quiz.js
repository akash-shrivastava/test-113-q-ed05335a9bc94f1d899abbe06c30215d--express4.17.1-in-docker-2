var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', async function (req, res, next) {
    try {
        if (!(req.body.name && typeof req.body.name === "string" && req.body.description && typeof req.body.description === "string")) {
            return res.status(400).json({ status: "failure", reason: "name and description is required and is string" });
        }
        var quiz = {
            data: []
        }
        const newQuiz = {
            id: 1,
            name: req.body.name,
            description: req.body.description,
            questions:[]
        }
        if (!fs.existsSync(path.join(__dirname,'quiz.json'))) {
            quiz.data.push(newQuiz);
            fs.writeFileSync(path.join(__dirname,'quiz.json'), JSON.stringify(quiz));
        } else {
            const allQuiz = JSON.parse(fs.readFileSync(path.join(__dirname,'quiz.json')));
            newQuiz.id = allQuiz.data.length + 1;
            allQuiz.data.push(newQuiz);
            fs.writeFileSync(path.join(__dirname,'quiz.json'), JSON.stringify(allQuiz));
        }
        const response = {
            id: newQuiz.id,
            name: newQuiz.name,
            description: newQuiz.description
        }
        return res.status(201).json(response);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});

router.get('/:quiz_id', async function (req, res, next) {
    try {
        if(typeof req.params.quiz_id === "number" && !(req.params.quiz_id === parseInt(req.params.quiz_id, 10))){
            throw new Error();
        }
        if (!fs.existsSync(path.join(__dirname,'quiz.json'))) {
            return res.status(404).json({});
        }
        const allQuiz = JSON.parse(fs.readFileSync(path.join(__dirname,'quiz.json')));
        let body = {
            errorCode: 404,
            data:{}
        };
        allQuiz.data.forEach(quiz => {
            if (quiz.id == req.params.quiz_id) {
                body.errorCode = 200;
                body.data.id = quiz.id;
                body.data.name = quiz.name;
                body.data.description = quiz.description; 
            }
        });
        return res.status(body.errorCode).json(body.data);

    } catch (err) {
        return res.status(400).json({ error: err });
    }
});

module.exports = router;
