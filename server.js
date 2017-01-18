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
    models.User.create({ email: req.body.email}, (err) => {
        if (err){
            console.log(err);
            res.status(500).send(err.msg);
        }
        res.redirect('/dash');

    });
});

dashboard.get('/category', (req, res) => {
    models.Category.find({}, (err, categories) => {
        if(err){
            console.log(err);
            res.status(500).send(err.message);
        }

        res.json(categories);
    })
});


app.listen(port);

console.log("Server running on port " + port);