var socket = io();

var movement = {
	up: false,
	down: false,
	left: false,
	right: false,
	mouseX: 0,
	mouseY: 0
}

//Keyboard event listeners
document.addEventListener('keydown', function(event) {
	switch(event.keyCode) {
		case 65: //A
			movement.left = true;
			break;
		case 87: //W
			movement.up = true;
			break;
		case 68: //D
			movement.right = true;
			break;
		case 83: //S
			movement.down = true;
			break;
	}
});

document.addEventListener('keyup', function(event) {
	switch(event.keyCode) {
		case 65: //A
			movement.left = false;
			break;
		case 87: //W
			movement.up = false;
			break;
		case 68: //D
			movement.right = false;
			break;
		case 83: //S
			movement.down = false;
			break;
	}
});

document.addEventListener('mousemove', function(event) {
	movement.mouseX = event.clientX - canvas.offsetLeft;
	movement.mouseY = event.clientY - canvas.offsetTop;
}, false);

var map = undefined;
socket.emit('new player');

setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');

canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

var playerImage = new Image();
playerImage.src = "static/playerSprite1.png";

var tileStone1 = new Image();
tileStone1.src = "static/TileStone1.png";

socket.on('state', function(players) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';

	for(var id in players) {
		var player = players[id];
		context.save();
		context.translate(player.x, player.y);
		context.rotate(player.angle + Math.PI / 2);
		context.drawImage(playerImage, 0, 0, 50, 50, -50/2, -50/2, 50, 50);
		context.restore();
	}

	if(map != undefined) {
		for(var i = 0; i < map.length; i++) {
			var obj = map[i];
			context.drawImage(tileStone1, 0, 0, 50, 50, obj[0], obj[1], 50, 50)
		}
	}
});

socket.on('mapdata', function(data) {
	map = data;
});
