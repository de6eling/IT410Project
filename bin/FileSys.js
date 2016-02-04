// uncomment the code below to see a test pass

var fs = require('fs');
var Path = require('path');

exports.getPathType = function ( path ) {
    return new Promise(function (resolve, reject) {
        if (typeof path != 'string') reject('not a string');
        var stats = fs.stat(path, function (err, stats) {
            if (err) {
                return resolve('nothing');
            } else if (stats.isDirectory()) {
                return resolve('directory');
            } else if (stats.isFile()) {
                return resolve('file');
            } else {
                return resolve('other');
            }
        });

    })
}

exports.readdir = function(path) {
    return exports.getPathType(path)
        .then(function(type) {
            if (type !== 'directory') throw Error('Not a directory');
            return new Promise(function(resolve, reject) {
                fs.readdir(path, function(err, files) {
                    if (err) return reject(err);
                    return resolve(files);
                });
            });
        });
};

exports.getDirectoryTypes = function(path, depth, filter) {
    var result = {};

    if (arguments.length < 2) depth = -1;
    if (typeof depth != 'number') return Promise.reject('depth is not a number');
    if (arguments.length < 3) filter = function() { return true };

    return exports.readdir(path)
        .then(function(files) {
            var promises = [];
            files.forEach(function(file) {
                var fullPath = Path.resolve(path, file);
                var promise = exports.getPathType(fullPath)
                    .then(function(type) {
                        if (filter(fullPath, type)) result[fullPath] = type;
                        if (type === 'directory' && depth !== 0) {
                            return exports.getDirectoryTypes(fullPath, depth - 1, filter)
                                .then(function(map) {
                                    Object.assign(result, map);
                                });
                        }
                    });
                promises.push(promise);
            });
            return Promise.all(promises)
                .then(function() {
                    return result;
                });
        });
}

exports.exists = function (path) {
    return exports.getPathType(path)
        .then(function(resolution){
            if (resolution == "nothing") return false;
            else return true;
        })
};

exports.getFilePaths = function (path, depth) {
    var results = [];
    if (arguments.length < 2) depth = -1;

    return exports.getDirectoryTypes (path, depth, function(path, type) {
        return type == 'file';
    }).then(function(resolution){
        return Object.keys(resolution);
    })

};

exports.readFile = function (path) {
    return new Promise(function (resolve, reject){
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        })
    })
};

exports.readFiles = function (paths) {

    if( !Array.isArray(paths))
        return Promise.reject("not an array");

    var promises = [];

    paths.forEach(function(path){
        promises.push(exports.readFile(path));
    });

    return Promise.all(promises)
        .then(function(resolution) {
            var map = {};
            paths.forEach(function(path, index){
                map[path] = resolution[index];
            })
            return map;
        });

};