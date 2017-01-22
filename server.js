const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var models = require('./db/connection');

var dashboard = express.Router();

const port = process.env.PORT || 3000;

app.use(express.static('app'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/dash', dashboard);

app.post('/signUp', (req, res) => {
    models.User.create({ email: req.body.email}, (err, results) => {
        if (err){
            res.status(500).send(err.msg);
        }else{
            res.json({
                redirect: '/dash',
                newUser: true,
                email: results.email,
                id: results.id
            });
        }
    });
});

dashboard.get('/category', (req, res) => {
    models.Category.find({}, (err, categories) => {
        if(err){
            res.status(500).send(err.msg);
        }else{
            res.json(categories);
        }
    });
});

dashboard.post('/category', (req, res) => {
    models.User.get(req.body.userId, (error, user) => {
        if(error) {
            res.status(400).send(error.msg);
        }
        user.categories = req.body.selected;
        user.save((err) => {
           if(err){
               res.status(500).send(error.msg);
           }else{
               res.json({
                   newUser: false
               })
           }
        });
    });
});

dashboard.get('/getNextChallenge', (req, res) => {
    let userId = req.params.userId;
    models.getNextChallenge(userId)
        .then((data) => {
            res.json(data[Math.floor(Math.random() * data.length - 1)]);
        }, (err) => {
            res.status(500).send(err);
        });
});

dashboard.get('/challenge', (req, res) => {
    let challengeId = req.params.challengeId;
    models.Challenge.get(challengeId, (err, data) => {
        if(err){
            res.status(500).send(err.msg);
        }else{
            res.json(data);
        }
    })
});

dashboard.post('/completeChallenge', (req, res) => {
    models.User.get(req.body.userId, (error, user) => {
        if(error) {
            res.status(400).send(error.msg);
        }
        user.challenges = req.body.challenge;
        user.save((err, results) => {
            console.log(results);
            if(err){
                res.status(500).send(error.msg);
            }else{
                res.json({
                    points: 0
                })
            }
        });
    });
});

app.listen(port);

console.log("Server running on port " + port);