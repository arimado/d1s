'use strict'

const MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

exports.connect = function (url, done) {
    if (state.db) return done();
    MongoClient.connect(url, function(err, db) {
        state.db = db;
        done(db);
    });
}

exports.get = function () {
    return state.db;
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function( err, result) {
            state.db = null;
            state.mode = null;
        })
    }
}
