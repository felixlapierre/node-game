//Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

//My module Dependencies
const collision = require('./my_modules/my_collision.js');
const areas = require('./my_modules/my_areas.js');

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
io.on('connection', function(socket) {
	socket.on('new player', function() {
		newPlayer(socket);
	});

	socket.on('movement', function(data) {
		var currentArea = areas.getAreaOfSocketID(socket.id);
		if(currentArea == undefined) {
			//Player is not registered as being in an area
			newPlayer(socket);
			return;
		}
		var player = currentArea.players[socket.id] || {};

		if(currentArea.loaded == false) {
			//NOTE: Debug statement
			console.log("Current area not loaded.");
			return;
		}

		if(data.left) {player.x -= 5;}
		if(data.up) {player.y -= 5;}
		if(data.right) {player.x += 5;}
		if(data.down) {player.y += 5;}

		// collision checks
		var updatedCoord= collision.boundsCheck(player.x, player.y, currentArea.wallMap.bounds);
		player.x = updatedCoord.x;
		player.y = updatedCoord.y;
		updatedCoord = collision.wallCheck(currentArea.wallMap.tiles,player.x, player.y);
		player.x = updatedCoord.x;
		player.y = updatedCoord.y;


		player.angle = data.angle;

		io.sockets.connected[socket.id].emit('updateCenter', {x:player.x, y:player.y});
	});

	socket.on('disconnect', function() {
		areas.removePlayer(socket.id);
	});
});

function newPlayer(socket) {
	areas.moveSocketTo(socket, 'default', function(socketID) {
		//Send the player the map data
		io.sockets.connected[socket.id].emit('mapdata', areas.getAreaOfSocketID(socketID).textureMap);
		console.log("Sent map data to " + socket.id);
	});
}

setInterval(function() {
	areas.forEachAreaID(function(areaID) {
		io.to(areaID).emit('state', areas.getAreaByID(areaID).players);
	});
}, 1000 / 60);
