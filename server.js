// HTTP Portion
//not making any changes in the http portion
var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080); //this will be part of url when access our pages

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
var numClients;



var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
		//this is where everything happens
		//this is where we listen for messages
		//this is also were we send messages
	
		console.log("We have a new client: " + socket.id);

		// numClients++;
		// if(numClients == 4){
		
		///MY SOCKET EVENTS HERE
		//JSON to read in the server
		//run and counter 
		//modules base counter
		//clients - use the map function(width)

		socket.on('message', function(data){
			socket.broadcast.emit('object', data);
			console.log("object sent by" + data.clientNum);
		});

		// }

		

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});

	}
);