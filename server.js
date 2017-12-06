// HTTP Portion
//not making any changes in the http portion
var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080); //this will be part of url when access our pages

var randSat = 0;
// Setup basic express server
var other_server = require("socket.io-client")('http://159.203.130.94:3000');

function requestHandler(req, res) {
	var parsedUrl = url.parse(req.url);
	// console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

/////////////////////////////
///////  WEB SOCKETS  ///////
/////////////////////////////

//global variable
var numClients = 0;


var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
		//this is where everything happens
		//this is where we listen for messages
		//this is also were we send messages
	
		console.log("We have a new client: " + socket.id);

		// numClients++;
		// console.log(numClients);

		
		///MY SOCKET EVENTS HERE
		//JSON to read in the server
		//run and counter 
		//modules base counter
		//clients - use the map function(width)

		// if(numClients==2){
		// 	socket.emit('start');
		// 	socket.broadcast.emit('start');
		// }

		socket.on('message', function(data){
			socket.broadcast.emit('object', data);
			//console.log("object sent by" + data.clientNum);
		});

		socket.on('ready',function(){
			numClients++;
			console.log(numClients);

			if(numClients==4){
				socket.emit('start');
				socket.broadcast.emit('start');
			}

		});

		socket.on('move', function (data) {
		    console.log(data);
		    socket.broadcast.emit('move', data);
		  });

		socket.on('cursor display', function (data) {
		    console.log(data);
		    // displayCursor(data.display);
		    if(data.display == "start"){
		    	randSat = Math.floor(Math.random() * (1458 - 0) + 0);
		    	socket.broadcast.emit('rand sat', randSat);
		    	socket.broadcast.emit('begin', data);
		    	console.log("start send");
		    }
		    if(data.display == "end"){
		    	socket.broadcast.emit('stop', data);
		    	console.log("end send");
		    }
			
			//console.log("broadcast emit");
			
		  });

		console.log( 'Server: Incoming connection.' );

		  // other_server.emit('add user', "testes")
		  var addedUser = false;
		  console.log('a user connected');
		  // when the client emits 'new message', this listens and executes
		  socket.on('add user', function (username) {
		    // we tell the client to execute 'new message'
		    console.log('user is: ' + username);
		    // socket.emit('set user', username)
		  });
		  // socket.on('move', function (data) {
		  //   // we tell the client to execute 'new message'
		  //   console.log(data);
		  //   emitMessage(socket2, 'move', data);
		  // });
		  // socket.on('cursor display', function (data) {
		  //   // we tell the client to execute 'new message'
		  //   // other_server.emit('add user', "testes")
		  //   console.log(data);
		  //   // emitMessage(socket2);
		  //   emitMessage(socket2, 'cursor display', data);

		  // });


		

		

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			numClients--;
		});

	}
);