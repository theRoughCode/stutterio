// grab the packages we need
const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const routes = require('./routes');
const fs = require('fs');
const sockio = require('socket.io');
const ss = require('socket.io-stream');

var server = http.createServer(app);

// Create Socket.IO Server
var io = sockio.listen(server);

//  Connect all our routes to our application
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use('/', routes);

// Turn on that server!
server.listen(port, () =>
          console.log('Server started! At http://localhost:' + port));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));
app.set('view engine', 'hbs');

io.sockets.on('connection', function (socket) {
	console.log('client connected');
  ss(socket).on('mp3Ready', function (stream, data) {
    console.log('mp3 received');
    var fileName = path.basename(data.name);
    stream.pipe(fs.createWriteStream(fileName));
  });
});

// io.of('/user').on('connection', function(socket) {
//   // ss(socket).on('profile-image', function(stream, data) {
//   //   var filename = path.basename(data.name);
//   //   stream.pipe(fs.createWriteStream(filename));
//   // });
// });
