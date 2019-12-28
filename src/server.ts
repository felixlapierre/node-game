//
// Dependencies
//
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as socketIO from 'socket.io';

//My module Dependencies
import * as World from './backend/World';

//
// Set Up Server
//

var app = express();
var server = new http.Server(app);
var io = socketIO(server);

var portNumber = 5000;

app.set('port', portNumber);
app.use('/static', express.static(__dirname + '/static'));
app.use('/src/static', express.static(__dirname + '/../src/static'));

//Routing
app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

//Starts the server
server.listen(portNumber, function () {
	console.log('Starting server on port ' + portNumber);
});

//
// Websocket handlers
//
io.on('connection', function (socket) {

	socket.on('new player', function () {
		newPlayer(socket);
	});

	socket.on('movement', function (data) {
		try {
			World.onPlayerIntentChanged(data, socket.id);
		} catch (e) {
			newPlayer(socket);
		}
	});

	socket.on('disconnect', function () {
		World.removePlayer(socket.id);
		console.log("Disconnected socket  " + socket.id);
	});

});

function newPlayer(socket) {
	World.moveSocketTo(socket, 'default', function (socketID) {
		//Send the player the map data
		if (io.sockets.connected[socket.id]) {
			io.sockets.connected[socket.id].emit('mapdata', World.getAreaOfSocketID(socketID).textureMap);
			io.sockets.connected[socket.id].emit('identity', socket.id);
			console.log("New player on socket " + socket.id);
		}
	});
}

//
// Update lööp
//
var lastUpdateTime = (new Date()).getTime();
setInterval(function () {
	//Calculate how much time has elapsed
	var currentTime = (new Date()).getTime();
	var timeElapsedMilliseconds = (currentTime - lastUpdateTime);
	lastUpdateTime = currentTime;

	//Limit elapsed milliseconds 
	if(timeElapsedMilliseconds > 10) {
		timeElapsedMilliseconds = 10;
	}

	//Update every player in every area
	World.updateAllAreas(timeElapsedMilliseconds, io);
}, 1000 / 60);