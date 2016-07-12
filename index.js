'use strict'

// MODULES

const express       = require('express');
const app           = express();
const http          = require('http').Server(app);
const path          = require('path');
const fs            = require('fs');
const db            = require('./db.js');
const bodyParser    = require('body-parser');
const lodash        = require('lodash');

// --------------------------------------------------------
// ENABLE JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const DB_URL = 'mongodb://localhost:27017/d1';
const PORT = process.env.PORT || 3005;

const getCollection = (db, collection) => {
    return db.get().collection(collection);
}

const connectionsDB = (db) => {
    return getCollection(db, 'connections');
}

const stateDB = (db) => {
    return getCollection(db, 'state');
}

const decksDB = (db) => {
    return getCollection(db, 'decks');
}

const questionsDB = (db) => {
    return getCollection(db, 'questions');
}

const answersDB = (db) => {
    return getCollection(db, 'answers');
}

db.connect(DB_URL, (err) => {
    if (err) {
        console.log('could not connect to DB');
    } else {
        console.log('connected to DB');
    }
});

app.get('/',
    (req, res) => {
        connectionsDB(db)
            .insert({ message: "A user connected" }, (err) => {
            if (err) console.log('something went wrong adding to the db');
            console.log('a user connected');
        })
        res.send("You've reached the server for d1");
});

app.post('/api/state',
    (req, res) => {
        let state = JSON.parse(req.body.data);
        stateDB().insert({ data: state })
});

app.get('/api/hello',
(req, res) => {
    res.json({"content": "hello world!"})
});


app.get('/api/decks',
(req, res) => {
    console.log('I recieved a get request');

    decksDB(db).find({}).toArray((err, decks) => {
        questionsDB(db).find({}).toArray((err, questions) => {
                answersDB(db).find({}).toArray((err, answers) => {
                    res.json({
                            decks: decks,
                            questions: questions,
                            answers: answers
                     })
                })
        })
    })

});


// INSERT deck
app.post('/api/decks',
(req, res) => {
    decksDB(db).insert(req.body.decks, (error) => {
        questionsDB(db).insert(req.body.questions, (error) => {
            answersDB(db).insert(req.body.questions, (error) => {
                if (error) res.json({"result": "failure"})
                res.json({"result": "success"})
            })
        })
    })
});

http.listen( PORT, function () {
    console.log('listening on: ', PORT);
});
