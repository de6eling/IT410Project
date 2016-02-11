/**
 * Created by debeling on 2/8/16.
 */

var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    server = new Server('localhost', 27017, {auto_reconnect: true}), // So is this working on its own server?
    db = new Db('it410Project', server, {safe: true}), // Am I using this same database everywhere in the project?
    users = 'user'; // creating a collection which is a table

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to it410Project mongo database");
        db.collection(users, {strict:true, safe:true}, function(errCol, collection) {
            if (errCol) {
                console.log("The "+ users +" collection doesn't exist");
                createCollection();
            }
        });
    } else {
        console.log("There is no it410Project database in MongoDB.");
        console.log(err);
    }
});

var createCollection = function() {
    db.createCollection("user", function(err, collection){}); // user vs users???

};

/*
*   Checks to see if the user exits in the collection (users)
*   returns user to home if they authenticate
*   otherwise resturns user to login to try again
 */
exports.authenticate = function(username, password){

    return new Promise( function(resolve, reject){
        db.collection(users, function(err, collection) {
            collection.findOne({'username':username, 'password':password}, function(err, result) {
                if (result) {
                    return resolve("Authenticated successfully!");
                } else {
                    return resolve('you have failed me Luke');
                }
            });
        });
    });

};

/*
*   Checks to see if user already exits by email
*   if not, inserts user into collection (users)
*   creates a session for new user
*   returns user to home
*
 */
exports.createUser = function(email, username, password){
    return new Promise(function(resolve, reject){
        db.collection(users, function (err, collection) {
            collection.findOne({'username':username}, function(err, result) {
                if (result) {
                    return resolve('username already exists bra');
                } else {
                    collection.insert({
                        email: email,
                        username: username,
                        password: password,
                        created: Date.now()
                    }, {safe:true}, function (err, result) { // safe:true what does that mean?
                        if (result) {
                            return resolve('you made a new user bra');
                        }
                    });
                }
            });
        });
    });
};

/*
*   pulls user id from url (params.id) and pulls the user from the body
*
*
 */

exports.updatePassword = function(username, password) {

    return new Promise(function(resolve, reject){
        db.collection(users, function(err, collection) {
            collection.findOne({username: username}, function(err, result){
                console.log(result);
                if(!err){
                    collection.update({'username': username}, { 'password': password  }, {safe:true}, function(err, resultUpdate) {
                        if (err) {
                            return resolve('You didn\'t change your password');
                        } else {
                            return resolve('You changed your password');
                        }
                    });
                } else {
                    return resolve('No user like that');
                }
            });

        });
    });

};