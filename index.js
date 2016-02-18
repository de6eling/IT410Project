/**
 * Created by debeling on 2/5/16.
 */

var express = require('express');
var expressValidator = require('express-validator');
var path = require('path'); //path.resolve
var app = express();
var ums = require('./bin/ums.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var session = require('express-session');

app.use(express.favicon());
app.use(express.methodOverride());
app.use(expressValidator());
app.use(app.router);

var listener = app.listen(process.env.PORT || 3001, function() {
    console.log('Listening on port ' + listener.address().port);
});

var argument = process.argv;

if (argument[2]){
    var fullPath = path.resolve(process.cwd(), argument[2]);
    app.use(express.static(fullPath));
    console.log(fullPath);
}
else {
    app.use(express.static(process.cwd() + '/'));
    console.log(argument);
}


// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    if (ums.authenticate(username, password) === 'pass') return done(null, { username: username });
    return done(null, false);
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'thisIsSomethingSecret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/services/user', function(req, res){
    if(req.user)return res.send(req.user.username);
    req.send('not user');
});

app.post('/services/user', function(req, res){
    if (req.body.email){
        if (req.body.username){
            if (req.body.password) {
                ums.createUser(req.body.email, req.body.username, req.body.password)
                    .then(function (result){
                        if (result === 'exists') {
                            req.send('SOME JSON STRING');
                        } else {
                            req.send('user created');
                        }
                    })
            } else {
                req.send('needs password');
            }
        } else {
            req.send('needs username');
        }

    } else {
        req.send('needs email')
    }
});

app.put('/services/user', function(req, res) {
    if (req.body.email){
        if (req.body.username){
            if (req.body.password) {
                ums.createUser(req.body.email, req.body.username, req.body.password)
                    .then(function(resolve){
                        if (resolve === 'exists'){
                            ums.updatePassword(req.body.username, req.body.password)
                                .then (function (updateResult) {
                                    if (updateResult === 'updated'){
                                        req.send(updateResult);
                                    } else {
                                        req.send('some JSON STRING')
                                    }
                                })
                        } else {
                            req.send('user created and some JSON STRING');
                        }
                    });
            } else {
                req.send('needs password');
            }
        } else {
            req.send('needs username');
        }
    } else {
        req.send('needs email')
    }
});

app.put('/services/login',
    passport.authenticate('local'),
    function(req, res) {
        res.send('You are authenticated, ' + req.user.username);
    });

app.put('/services/logout', function(req, res) {
        req.logout();
        res.send('You are out!');
    });

