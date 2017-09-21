require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Movie } = require('./models/movie');
var { authenticate } = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// =================================USERs===============================
// ADD USER
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password', 'age']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// FETCH ALL USERS
// app.get('/users', (req, res) => {
//     User.find().then((users) => {
//         res.send({ users })
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });


// GET USER WITH AUTH TOKEN
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


// USER LOGIN
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});


// USER LOGOUT
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


// =============================MOVIEs=============================
// FETCH ALL MOVIES
app.get('/movies', (req, res) => {
    Movie.find().then((movies) => {
        res.send({ movies })
    }, (e) => {
        res.status(400).send(e);
    })
});

// ADD MOVIE
app.post('/movies', (req, res) => {
    var body = _.pick(req.body, ['title', 'year', 'language', 'rate', 'runtime', 'description', 'imageurl' ,'trailer']);
    var movie = new Movie(body);

    movie.save().then((mov) => {
        res.send(mov);
    }).catch((e) => {
        res.status(400).send();
    });
});


//FETCH MOVIE BY ID
app.get('/movies/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Movie.findById(id).then((movie) => {
        if (!movie) {
            return res.status(404).send();
        }
        res.send({ movie });
    }).catch((e) => {
        res.status(400).send();
    });
});


// UPDATE MOVIE
app.put('/movies/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['title', 'year', 'language', 'rate', 'runtime', 'description', 'imageurl' ,'trailer','updated']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    if (_.isBoolean(body.updated) && body.updated) {
        body.updatedAt = new Date().getTime();
    } else {
        body.updated = false;
        body.updatedAt = null;
    }

    Movie.findByIdAndUpdate(id, {$set: body}, {new: true}).then((movie) => {
        if (!movie) {
            return res.status(404).send();
        }
        res.send({ movie });
    }).catch((e) => {
        res.status(404).send();
    })
});


// DELETE MOVIE BY ID
app.delete('/movies/:id', (req, res) => {
    var id = req.params.id; // get the id

    if (!ObjectID.isValid(id)){   // validate the id --> not valid? return 404
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((movie) => { // remove todo by Id
      if (!movie){
       return res.status(404).send(); // if no doc , send 404
      }
        res.status(200).send(movie); // if doc , send doc and 200
    }).catch((e) => {
    res.status(400).send();
    }); // error  400 with empty body
});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };