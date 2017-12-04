// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
ioClient = require('socket.io-client')
var socket2 = ioClient.connect("http://159.203.130.94:8080");
var display;
var prevDisplay;
// var other_server = require("socket.io-client")('http://localhost:4000');


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'joystick')));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  console.log( 'Server: Incoming connection.' );

  // other_server.emit('add user', "testes")
  var addedUser = false;
  console.log('a user connected');
  // when the client emits 'new message', this listens and executes
  socket.on('add user', function (username) {
    // we tell the client to execute 'new message'
    console.log('user is: ' + username);
    socket.emit('set user', username)
  });
  socket.on('move', function (data) {
    // we tell the client to execute 'new message'
    console.log(data);
    emitMessage(socket2, 'move', data);
  });
  socket.on('cursor display', function (data) {
    // we tell the client to execute 'new message'
    // other_server.emit('add user', "testes")
    console.log(data);
    // emitMessage(socket2);
    emitMessage(socket2, 'cursor display', data);

  });


  // when the client emits 'add user', this listens and executes
  // socket.on('add user', function (username) {
  //   if (addedUser) return;

  //   // we store the username in the socket session for this client
  //   socket.username = username;
  //   ++numUsers;
  //   addedUser = true;
  //   socket.emit('login', {
  //     numUsers: numUsers
  //   });
  //   // echo globally (all clients) that a person has connected
  //   socket.broadcast.emit('user joined', {
  //     username: socket.username,
  //     numUsers: numUsers
  //   });
  // });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

function emitMessage( socket,evnt, data ){
    socket.emit(evnt, data);
    // setTimeout(function(){emitMessage(socket)}, 1000);

}
