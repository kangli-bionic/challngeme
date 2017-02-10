const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

let app = express();
const port = process.env.PORT || 3000;

app.use(express.static('app'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.listen(port);

console.log("Server running on port " + port);