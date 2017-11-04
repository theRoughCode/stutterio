const routes = require('express').Router();
const fs = require('fs');
const words = require('../helpers/words');

routes.get('/', function(req, res){
  words.getDefaultText(text => res.render('index', { text }));
})

module.exports = routes;
