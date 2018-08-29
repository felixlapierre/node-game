//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

//My module Dependencies
var map = require('./my_modules/my_map.js');
const collision = require('./my_modules/my_collision.js');

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

var players = {};

//Testing map module
var textureMap;
var wallMap;

map.loadTextureMap("./maps/map1.txt", function(data) {
	textureMap = data;
	addWebSocketHandlers();
});

map.loadWallMap("./maps/map1_walls.txt", function(data) {
	wallMap = data;
});

//Add the WebSocket handlers
function addWebSocketHandlers() {
	io.on('connection', function(socket) {
		socket.on('new player', function() {
			players[socket.id] = {
				x: 300,
				y: 300,
				angle: 0
			};

			//Send the player the map data
			io.sockets.connected[socket.id].emit('mapdata', textureMap);
			console.log("Sending map data to " + socket.id);
		});

		socket.on('movement', function(data) {
			var player = players[socket.id] || {};
			if(data.left) {player.x -= 5;}
			if(data.up) {player.y -= 5;}
			if(data.right) {player.x += 5;}
			if(data.down) {player.y += 5;}

		// collision checks
			var updatedCoord= collision.boundsCheck(player.x, player.y, wallMap.bounds);
			player.x = updatedCoord.x;
			player.y = updatedCoord.y;
			updatedCoord = collision.wallCheck(player.x, player.y, wallMap);
			player.x = updatedCoord.x;
			player.y = updatedCoord.y;


			player.angle = data.angle;

			io.sockets.connected[socket.id].emit('updateCenter', {x:player.x, y:player.y});
		});

		socket.on('disconnect', function() {
			delete players[socket.id];
		});
	});
};

setInterval(function() {
	io.sockets.emit('state', players);
}, 1000 / 60);
