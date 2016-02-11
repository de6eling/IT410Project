var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.text());

app.get('/', function (req, res) {
    res.send('GET');
});

app.post('/', function (req, res) {
    res.send(req.body.toUpperCase());
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});