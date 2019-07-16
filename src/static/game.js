var socket = io();
const tileSize = 50;
var topleft = {
	x:0,
	y:0
}

var bag = {
	contents: [],
	selected: 0,
}

var playerState = {
	up: false,
	down: false,
	left: false,
	right: false,
	angle:0,
	click:false,
	selected:bag.selected
}

var mouse = {
	x:0,
	y:0
}

//Keyboard event listeners
document.addEventListener('keydown', function(event) {
	switch(event.keyCode) {
		case 65: //A
		playerState.left = true;
		break;
		case 87: //W
		playerState.up = true;
		break;
		case 68: //D
		playerState.right = true;
		break;
		case 83: //S
		playerState.down = true;
		break;
	}
	if(event.keyCode >= 49 && event.keyCode <= 57) {
		bag.selected = event.keyCode - 49;
		console.log(bag.selected);
	}
});

document.addEventListener('keyup', function(event) {
	switch(event.keyCode) {
		case 65: //A
		playerState.left = false;
		break;
		case 87: //W
		playerState.up = false;
		break;
		case 68: //D
		playerState.right = false;
		break;
		case 83: //S
		playerState.down = false;
		break;
	}
});

document.addEventListener('mousedown', function(event) {
	playerState.click = true;
});

document.addEventListener('mouseup', function(event) {
	playerState.click = false;
});

document.addEventListener('mousemove', function(event) {
	mouse.x = event.clientX - canvas.offsetLeft;
	mouse.y = event.clientY - canvas.offsetTop;
}, false);

document.addEventListener('wheel', function(event) {
	bag.selected = (bag.selected+(event.deltaY/100))%9;
	if(bag.selected < 0) {
		bag.selected += 9;
	}
	return;
});

var map = undefined;
socket.emit('new player');

setInterval(function() {
	calculateAngle();
	socket.emit('movement', playerState);
}, 1000 / 60);

function calculateAngle() {
	var deltaX = mouse.x - canvas.width / 2;
	var deltaY = mouse.y - canvas.height / 2;

	playerState.angle = Math.atan(deltaY/deltaX);
	if(deltaX < 0) {
		playerState.angle += Math.PI;
	}
}

var canvas = document.getElementById('canvas');

canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

var playerImage = new Image();
playerImage.src = "static/playerSprite1.png";

var tileStone1 = new Image();
tileStone1.src = "static/TileStone1.png";

var spritesheet = new Image();

var itemBar = new Image();
itemBar.src = "static/ItemBar.png";

var textures = {};

function getTexture(source) {
	var returned = textures[source];
	if(returned != undefined) {
		return returned;
	} else {
		var newTexture = new Image();
		newTexture.src = source;
		textures[source] = newTexture;
		return newTexture;
	}
}

socket.on('areaState', function(players) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';

	if(map != undefined && spritesheet.src != undefined) {
		for(var i = 0; i < map.tiles.length; i++) {
			var tile = map.tiles[i];
			for(var x = tile.destX0; x <= tile.destX1; x += tileSize) {
				for(var y = tile.destY0; y <= tile.destY1; y += tileSize) {
					context.drawImage(spritesheet, tile.sourceX, tile.sourceY, 50, 50,
						x - topleft.x, y - topleft.y, 50, 50);
					}
				}
			}
	}

	for(var id in players) {
		drawPlayer(players[id]);
	}

	//Determine the location at which the bag will be drawn
	var left = canvas.clientWidth / 2 - (tileSize * 4.5);
	var top = canvas.clientHeight - tileSize;
	drawBag(context, left, top, itemBar)
});

socket.on('mapdata', function(data) {
	map = data;
	spritesheet.src = "static/" + data.spritesheet;
});

socket.on('returnPlayerState', function(data) {
	topleft.x = data.x - canvas.width / 2;
	topleft.y = data.y - canvas.height / 2;
	bag.contents = data.bag.contents;
});

function drawBag(context, x, y, sprite) {
	var width = sprite.width / 2;
	var height = sprite.height;
	for(var i = 0; i < 9; i++) {
		var sourceX = (bag.selected == i) ? 50 : 0;
		context.drawImage(sprite, sourceX, 0, width, height,
		x + i * width, y, width, height);
		if(bag.contents[i] != undefined) {
		//TODO: Draw the contents of that item slot
		}
	}
}

function drawPlayer(player) {
	context.save();
	//TODO: Implement the screen offset
	context.translate(player.x - topleft.x, player.y - topleft.y);
	context.rotate(player.angle + Math.PI / 2);
	context.drawImage(playerImage, 0, 0, 50, 50, -50/2, -50/2, 50, 50);
	context.restore();

	console.log(player.textures);
	for(var jd in player.textures) {
		var img = player.textures[jd];
		context.save();
		context.translate(player.x - topleft.x, player.y - topleft.y);
		if(img.rotateWithPlayer) {
			context.rotate(player.angle + Math.PI / 2);
		}
		context.translate(img.dest.x, img.dest.y);
		context.rotate(img.angle);
		
		context.drawImage(getTexture(img.sprite), img.source.x, img.source.y, img.source.w, img.source.h, 
		0, 0, img.dest.w, img.dest.h);

		context.restore();
	}
}