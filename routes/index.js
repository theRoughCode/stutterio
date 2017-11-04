const routes = require('express').Router();
const fs = require('fs');
const words = require('../helpers/words');
const save = require('save-file');

routes.get('/', function(req, res){
  words.getDefaultText(text => res.render('index', { text }));
});

routes.post('/firstSyllable', function(req, res){
  words.firstSyllable(req.body.word, syllable => res.send(syllable));
});

routes.post('/audio', function(req, res) {
  res.send(req.body);

  save(req.body.url, 'test.mp3', (err, data) => {
    if (err) throw err;
    console.log(data);
    //file is saved at this point, data is arrayBuffer with actual saved data
  });
});

module.exports = routes;
