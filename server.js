var express = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var app = express();
var models = require('./db/connection.js');

var dashboard = express.Router;

var port = process.env.PORT || 3000;

app.use(express.static('app'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/signUp',
    (req, res) => {
        models.User.create({ email: req.body.email}, function(err) {
            if (err){
                console.log(err);
                res.status(500).send('error');
            }
        });
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
            from: 'jalissa2403@gmail.com',
            to: 'jali_ssa@hotmail.com',
            subject: 'hello',
            text: 'hello world!'
        }, function (err, response) {
            console.log(err || response);
        });

    });

app.use('/dash', dashboard);

app.listen(port);

console.log("Server running on port " + port);