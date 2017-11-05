// grab the packages we need
const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const routes = require('./routes');

//  Connect all our routes to our application
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use('/', routes);

// Turn on that server!
app.listen(port, () =>
          console.log('Server started! At http://localhost:' + port));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));
app.set('view engine', 'hbs');
