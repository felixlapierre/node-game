//
// Dependencies
//
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as socketIO from 'socket.io';

//My module Dependencies
const collision = require('./my_modules/collision');
const areas = require('./my_modules/areas');

//
// Set Up Server
//

var app = express();
var server = new http.Server(app);
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

//
// Websocket handlers
//
io.on('connection', function(socket) {

	socket.on('new player', function() {
		newPlayer(socket);
	});

	socket.on('movement', function(data) {
		try {
			areas.onPlayerIntentChanged(data, socket.id);
		} catch(e) {
			newPlayer(socket);
		}
	});

	socket.on('disconnect', function() {
		areas.removePlayer(socket.id);
		console.log("Disconnected socket  " + socket.id);
	});
	
});

function newPlayer(socket) {
	areas.moveSocketTo(socket, 'default', function(socketID) {
		//Send the player the map data
		io.sockets.connected[socket.id].emit('mapdata', areas.getAreaOfSocketID(socketID).textureMap);
		console.log("New player on socket " + socket.id);
	});
}

//
// Update lööp
//
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
	//Calculate how much time has elapsed
	var currentTime = (new Date()).getTime();
	var deltaT = (currentTime - lastUpdateTime) / 1000.0;
	var timeElapsedMilliseconds = deltaT * 1000;
	lastUpdateTime = currentTime;

	//Update every player in every area
	areas.updateAllAreas(timeElapsedMilliseconds, io);
}, 1000 / 60);
