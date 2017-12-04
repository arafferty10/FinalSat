// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 4000;
var other_server = require("socket.io-client")('http://localhost:3000');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'FinalSat')));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  console.log("connected")
  // other_server.emit('add user', "testes")
  // when the client emits 'add user', this listens and executes
  // socket.on('add user', function (username) {
  //   // if (addedUser) return;
  //   console.log(username)
  // });

  socket.on('move', function (data) {
    console.log(data);
  });

  // other_server.on('cursor display', function(data){
  //   console.log(data);
  // });

  // when the client emits 'typing', we broadcast it to others
  socket.on('cursor display', function (data) {
    console.log(data);
  });

  // when the client emits 'stop typing', we broadcast it to others
  // socket.on('stop typing', function () {
  //   socket.broadcast.emit('stop typing', {
  //     username: socket.username
  //   });
  // });

  // when the user disconnects.. perform this
  // socket.on('disconnect', function () {
    
  // });
});
