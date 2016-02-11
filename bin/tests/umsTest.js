/**
 * Created by debeling on 2/8/16.
 */
"use strict";
var expect = require('chai').expect;
var ums = require('../ums.js');

describe('ums', function() {

    describe('createUser', function(){
        it('returns a promise', function () {
            expect(ums.createUser('daniel', 'password')).to.be.instanceof(Promise);
        });

        it('Test that two users with the same name cannot be created.', function () {
            return ums.createUser('dan@the.man', 'daniel', 'password')
                .then(function(result) {
                    expect(result).to.be.equal('you made a new user bra');
                });
        });

        it('Test that a user can be created.', function () {
            return ums.createUser('dan@the.man', 'daniel', 'password')
                .then(function(result) {
                    expect(result).to.be.equal('username already exists bra');
                });
        });
    });

    describe('authenticate', function(){
        it('returns a promise', function () {
            expect(ums.authenticate('daniel', 'password')).to.be.instanceof(Promise);
        });

        it('Test that a correct username and password passes the authentication check.', function () {
            return ums.authenticate('daniel', 'password')
                .then(function(result) {
                    expect(result).to.be.equal('Authenticated successfully!');
                })
        });

        it('Test that an incorrect username and password does not pass the authentication check.', function () {
            return ums.authenticate('bla', 'bloo')
                .then(function(result) {
                    expect(result).to.be.equal('you have failed me Luke');
                })
        });
    });

    describe('updatePassword', function(){
        it('returns a promise', function () {
            expect(ums.updatePassword('daniel', 'password')).to.be.instanceof(Promise);
        });

        it('Test that a user can change their password.', function () {
            return ums.updatePassword('dan@the.man', 'daniel', 'password')
                .then(function(result) {
                    expect(result).to.be.equal('You changed your password');
                });
        });

    });

});