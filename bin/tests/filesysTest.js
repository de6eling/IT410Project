/**
 * Created by debeling on 1/25/16.
 */
"use strict";
var expect = require('chai').expect;
var FileSys = require('../FileSys.js');
//var Promise = require ('bluebird');

describe('FileSys', function() {

    describe('getPathType', function() {

        it('returns a promise', function () {
            expect(FileSys.getPathType('awef/test.js')).to.be.instanceof(Promise);
        });

        it('is a file', function() {
            var x = FileSys.getPathType('test.js')
                .then(function (resolution) {
                    expect(resolution).to.be.equal('file');
                });
            return x;
        });

        it('is a directory', function() {
            var x = FileSys.getPathType('./testDir')
                .then(function (resolution) {
                    expect(resolution).to.be.equal('directory');
                });
            return x;
        });

        it('is a nothing', function() {
            var x = FileSys.getPathType('./asdftest.js')
                .then(function (resolution) {
                    expect(resolution).to.be.equal('nothing');
                });
            return x;
        });

    });


    describe('getDirectoryTypes', function (){
        it('returns a promise', function () {
            expect(FileSys.getDirectoryTypes('test.js')).to.be.instanceof(Promise);
        });
    });

    describe('exists', function (){
        it('returns a promise', function () {
            expect(FileSys.exists('test.js')).to.be.instanceof(Promise);
        });
    });

    describe('getFilePaths', function (){
        it('returns a promise', function () {
            expect(FileSys.getFilePaths('test.js')).to.be.instanceof(Promise);
        });
    });

    describe('readFile', function (){
        it('returns a promise', function () {
            expect(FileSys.readFile('test.js')).to.be.instanceof(Promise);
        });
    });

    describe('readFiles', function (){
        it('returns a promise', function () {
            expect(FileSys.readFiles('test.js')).to.be.instanceof(Promise);
        });
    });



});

/*
 .then(function(resolution) {
 console.log(resolution);
 }).catch(function(error) {
 console.log(error);
 });*/