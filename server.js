var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static('app'));

app.listen(port);
console.log("Server running on port " + port);