'use strict'

// MODULES

const express   = require('express');
const app       = express();
const http      = require('http').Server(app);
const path      = require('path');
const fs        = require('fs');
const db        = require('./db.js')
// --------------------------------------------------------

const DB_URL = 'mongodb://localhost:27017/d1';

db.connect(DB_URL, (err) => {
    if (err) {
        console.log('could not connect to DB');
    } else {
        console.log('connected to DB');
    }
});

app.get('/', (req, res) => {
    let connectionsDB = db.get().collection('connections');
    connectionsDB.insert({ message: "A user connected" }, (err) => {
        if (err) console.log('something went wrong adding to the db');
        console.log('a user connected');
    })
    res.send("You've reached the server for d1");
});

http.listen(process.env.PORT || 3005, function () {
    let port = process.env.PORT || 3005;
    console.log('listening on: ', port);
});
