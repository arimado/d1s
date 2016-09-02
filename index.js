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

// const DB_URL = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost:27017/d1';
const DB_URL = 'mongodb://localhost:27017/d1';

const PORT = process.env.PORT || 3005;

const getCollection = (db, collection) => {

    // if(db.get() === null) {
    //
    // }
    //
    return db.get().collection(collection);
}

const connectionsDB = (db) => {
    return getCollection(db, 'connections');
}

const stateDB = (db) => {
    return getCollection(db, 'state');
}

const usersDB = (db) => {
    return getCollection(db, 'users');
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

const matchesDB = (db) => {
    return getCollection(db, 'matches');
}

db.connect(DB_URL, (db) => {
    if (db) {
        console.log('Connected to database.');
    } else {
        console.log('could not connect to database');
    }
});

app.get('/',
    (req, res) => {
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
    console.log('GET /api/decks -------------------------- ');
    decksDB(db).find({}).toArray((err, decks) => {
        questionsDB(db).find({}).toArray((err, questions) => {
                answersDB(db).find({}).toArray((err, answers) => {
                    usersDB(db).find({}).toArray((err, users) => {
                        console.log('im giving back this: ')
                        console.log('decks: ', decks.length)
                        console.log('questions: ', questions.length)
                        console.log('answers: ', answers.length)
                        console.log('users: ', users.length)
                        console.log('SUCCESS -------------------------- ');
                        res.json({
                            decks: decks,
                            questions: questions,
                            answers: answers,
                            users: users
                        })
                    })
                })
        })
    })

});


// INSERT deck
app.post('/api/decks',
(req, res) => {
    console.log('inserting deck')
    decksDB(db).insert(req.body.decks, (error) => {
        questionsDB(db).insert(req.body.questions, (error) => {
            answersDB(db).insert(req.body.answers, (error) => {
                if (error) res.json({"result": "failure"})
                res.json({"result": "success"})
            })
        })
    })
});

// INSERT user
app.post('/api/users',
(req, res) => {
    console.log('POST: /api/users')
    console.log(req.body);
    usersDB(db).insert(req.body, (error) => {
        res.json({"result": "success"})
    })
});


// MATCHES

app.post('/api/matches',
(req, res) => {
    console.log('POST: /api/matches')
    console.log(req.body);
    matchesDB(db).insert(req.body, (error) => {
        res.json({"result": "success"})
    })
});








http.listen( PORT, function () {
    console.log('connecting to: ', DB_URL);
    console.log('listening on: ', PORT);
});
