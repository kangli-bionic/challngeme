const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
let upload = multer({ dest: 'uploads/' });
let app = express();
let models = require('./db/connection');

var dashboard = express.Router();

const port = process.env.PORT || 3000;

app.use(express.static('app'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/dash', dashboard);

app.post('/signUp', (req, res) => {
    let email = req.body.email;
    let password = req.body.pass;
    models.claimAccount(email, password, (err, data, hashedPassword) => {
        if(err){
            res.status(500).send(err);
        }else{
            if(data){
                models.User.get(data.id, (err, user) => {
                    if (!data.verified || err){
                        let message = !data.verified ? 'Wrong email/password' : err.msg;
                        res.status(500).send(message);
                    }else{
                        res.json({
                            user: {
                                id: user.id,
                                name: user.fullName(),
                                photo: user.photo,
                                newUser: false
                            },
                            redirect: '/dash/challenge'
                        });
                    }
                });
            }else{
                models.User.create({ email: email, password: hashedPassword},
                (err, user) => {
                    if (err){
                        res.status(500).send(err.msg);
                    }else{
                        res.json({
                            redirect: '/dash/category',
                            user: {
                                id: user.id,
                                name: user.fullName(),
                                photo: user.photo,
                                newUser: true
                            }
                        });
                    }
                });
            }
        }
    });
});

dashboard.get('/category', (req, res) => {
    let userId = req.query.userId;
    models.getUserCategories(userId, (err, categories) => {
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
                   newUser: false,
                   redirect: 'dash/challenge'
               })
           }
        });
    });
});

dashboard.get('/getNextChallenge', (req, res) => {
    let userId = req.query.userId;

    models.getNextChallenge(userId, (err, data) => {
        if(err){
            res.status(500).send(err.msg);
        }
        models.User.get(userId, (err, user) => {
            models.getUserCurrentChallenge(user, (currentChallenge) => {
                if(currentChallenge.length > 0){
                    res.json(currentChallenge[0]);
                }else{
                    if(data){
                        let challengeId = data[Math.floor(Math.random() * (data.length - 1))].id;
                        models.Challenge.get(challengeId, (error, challenge) => {
                            user.addChallenges([challenge], {current: 1}, (err) => {
                                if(err){
                                    res.status(500).send(err.msg);
                                }else{
                                    res.json(challenge);
                                }
                            });
                        });
                    }
                }
            });

        });
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

dashboard.post('/completeChallenge', upload.single('file'), (req, res) => {
    console.log(req.file);
    models.User.get(req.body.userId, (error, user) => {
        if(error) {
            res.status(500).send(error.msg);
        }

        res.end();

    });
});

app.listen(port);

console.log("Server running on port " + port);