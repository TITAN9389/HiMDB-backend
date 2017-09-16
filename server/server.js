const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Movie } = require('./models/movie');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// ADD MOVIE
app.post('/movies', (req, res) => {
    var body = _.pick(req.body ,['title','language','rate','runtime','description','imageurl'])
    var movie = new Movie(body);

    movie.save().then((mov) => {
        res.send(mov);
    }).catch((e) => {
        res.status(400).send();
    });
});


// ADD USER
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['name','email','password','age']);
    var user = new User(body);

    user.save().then((usr) => {
        res.send(usr);
    }).catch((e) => {
        res.status(401).send(e);
    });
});


// FETCH ALL USERS
app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users })
    }, (e) => {
        res.status(400).send(e);
    });
});


// FETCH ALL MOVIES
app.get('/movies', (req, res) => {
   Movie.find().then((movies) => {
    res.send({ movies })
   },(e) => {
    res.status(400).send(e);
   })
});


//FETCH MOVIE BY ID
app.get('/movies/:id', (req, res) =>{
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