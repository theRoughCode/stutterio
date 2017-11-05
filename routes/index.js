const routes = require('express').Router();
const fs = require('fs');
const words = require('../helpers/words');
const db = require('../helpers/db_helper');
const save = require('save-file');

routes.get('/', function(req, res){
  res.render('auth');
});

routes.get('/text', function(req, res) {
  words.getDefaultText(text => res.render('index', { text }));
});

routes.get('/3', function(req, res) {
  res.render('three');
});

routes.post('/createUser', function(req,res) {
  db.writeUserData(req.body.id, req.body.name, success => {
    if (success) res.send();
    else {
      res.status(500);
      res.send('ERROR: Could not create user profile.');
    }
  })
});

routes.post('/firstSyllable', function(req, res){
  words.findStutterSyllables(req.uid, req.body.words);
});

routes.post('/uploadMp3', function(req, res){
  console.log(req);
  // db.storeMp3(req.body.uid, req.body.blob, success => {
  //   if(success) res.send();
  //   else {
  //     res.status(500);
  //     res.send('ERROR: Failed to upload mp3 blob.');
  //   }
  // });
});

routes.post('/highlightStutters', function(req, res){
  words.listOfStutterWords(req.body.user, req.body.text, result => {
    res.send(result);
  });
});

module.exports = routes;
