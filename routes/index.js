const routes = require('express').Router();
const fs = require('fs');
const words = require('../helpers/words');
const db_helper = require('../helpers/db_helper');
const save = require('save-file');

routes.get('/', function(req, res){
  res.render('auth');
});

routes.get('/text', function(req, res) {
  words.getDefaultText(text => res.render('index', { text }));
})

routes.get('/3', function(req, res) {
  res.render('three');
})

routes.post('/firstSyllable', function(req, res){
  words.findStutterSyllables('amr', req.body.word);
});

routes.post('/audio', function(req, res) {
  res.send(req.body);

  save(req.body.url, 'test.mp3', (err, data) => {
    if (err) throw err;
  });
});

module.exports = routes;
