/**
 * Created by debeling on 2/5/16.
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 3000);
