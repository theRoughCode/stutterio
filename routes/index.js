const routes = require('express').Router();
const fs = require('fs');

routes.get('/', function(req, res){
  res.render('index');
})

module.exports = routes;
