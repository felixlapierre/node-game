//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var portNumber = 5000;

app.set('port', portNumber);
app.use('/static', express.static(__dirname + '/static'));

//Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

//Starts the server 
server.listen(portNumber, function() {
	console.log('Starting server on port ' + portNumber);
});

//Add the WebSocket handlers
var players = {};
io.on('connection', function(socket) {
	socket.on('new player', function() {
		players[socket.id] = {
			x: 300,
			y: 300,
			angle: 0
		};
	});
	
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if(data.left) {player.x -= 5;}
		if(data.up) {player.y -= 5;}
		if(data.right) {player.x += 5;}
		if(data.down) {player.y += 5;}
		var deltaY = data.mouseY - player.y;
		var deltaX = data.mouseX - player.x;
		
		player.angle = Math.atan(deltaY/deltaX);
		if (deltaX < 0) {
			player.angle += Math.PI;
		}
	});
});

setInterval(function() {
	io.sockets.emit('state', players);
}, 1000 / 60);

