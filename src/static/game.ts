var socket = io();
const tileSize = 50;
var topleft = {
	x: 0,
	y: 0
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
	angle: 0,
	click: false,
	selected: bag.selected
}

var mouse = {
	x: 0,
	y: 0
}

interface Creature {
	x: number,
	y: number,
	angle: number,
	sprites: any
}

const players = new Map<string, Creature>();
const enemies = new Map<string, Creature>();

//Keyboard event listeners
document.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
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
	if (event.keyCode >= 49 && event.keyCode <= 57) {
		bag.selected = event.keyCode - 49;
		console.log(bag.selected);
	}
});

document.addEventListener('keyup', function (event) {
	switch (event.keyCode) {
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

document.addEventListener('mousedown', function (event) {
	playerState.click = true;
});

document.addEventListener('mouseup', function (event) {
	playerState.click = false;
});

document.addEventListener('mousemove', function (event) {
	mouse.x = event.clientX - canvas.offsetLeft;
	mouse.y = event.clientY - canvas.offsetTop;
}, false);

document.addEventListener('wheel', function (event) {
	bag.selected = (bag.selected + (event.deltaY / 100)) % 9;
	if (bag.selected < 0) {
		bag.selected += 9;
	}
	return;
});

var map = undefined;
socket.emit('new player');

setInterval(function () {
	calculateAngle();
	socket.emit('movement', playerState);
}, 1000 / 60);

function calculateAngle() {
	var deltaX = mouse.x - canvas.width / 2;
	var deltaY = mouse.y - canvas.height / 2;

	playerState.angle = Math.atan(deltaY / deltaX);
	if (deltaX < 0) {
		playerState.angle += Math.PI;
	}
}

interface Html5Canvas extends HTMLElement {
	width: number;
	height: number;
	getContext(type: string): any;
}

var canvas = document.getElementById('canvas') as Html5Canvas;

canvas.width = 800;
canvas.height = 600;
var canvasContext = canvas.getContext('2d');

var playerImage = new Image();
playerImage.src = "static/playerSprite1.png";

var tileStone1 = new Image();
tileStone1.src = "static/TileStone1.png";

var spritesheet = new Image();

var itemBar = new Image();
itemBar.src = "static/ItemBar.png";

var targetDummy = new Image();
targetDummy.src = "static/TargetDummy.png";

var slash = new Image();
slash.src = "static/Slash.png";

socket.on('areaState', function (state) {
	for (var id in state.players) {
		players.set(id, state.players[id]);
	}

	for (var id in state.enemies) {
		enemies.set(id, state.enemies[id]);
	}

	if(myPlayerId && players.has(myPlayerId)) {
		topleft.x = players.get(myPlayerId).x - canvas.width / 2;
		topleft.y = players.get(myPlayerId).y - canvas.height / 2;
	}
});

setInterval(Draw, 1000 / 60);

let timeOfLastDraw = new Date().getTime();
let timeSinceLastDraw = 0;

function Draw() {
	const now = new Date().getTime();
	timeSinceLastDraw = now - timeOfLastDraw;
	timeOfLastDraw = now;

	canvasContext.clearRect(0, 0, 800, 600);
	canvasContext.fillStyle = 'green';

	if (map != undefined && spritesheet.src != undefined) {
		for (var i = 0; i < map.tiles.length; i++) {
			var tile = map.tiles[i];
			for (var x = tile.destX0; x <= tile.destX1; x += tileSize) {
				for (var y = tile.destY0; y <= tile.destY1; y += tileSize) {
					canvasContext.drawImage(spritesheet, tile.sourceX, tile.sourceY, 50, 50,
						x - topleft.x, y - topleft.y, 50, 50);
				}
			}
		}
	}

	players.forEach((player) => {
		drawPlayer(player);
	})

	enemies.forEach((enemy) => {
		drawPlayer(enemy);
	})

	//Determine the location at which the bag will be drawn
	var left = canvas.clientWidth / 2 - (tileSize * 4.5);
	var top = canvas.clientHeight - tileSize;
	drawBag(canvasContext, left, top, itemBar)
}

socket.on('mapdata', function (data) {
	map = data;
	spritesheet.src = "static/" + data.spritesheet;
});

let myPlayerId; 

socket.on('identity', function(id) {
	myPlayerId = id;
})

socket.on('returnPlayerState', function (data) {
	bag.contents = data.bag.contents;
});

function drawBag(context, x, y, sprite) {
	var width = sprite.width / 2;
	var height = sprite.height;
	for (var i = 0; i < 9; i++) {
		var sourceX = (bag.selected == i) ? 50 : 0;
		context.drawImage(sprite, sourceX, 0, width, height,
			x + i * width, y, width, height);
		if (bag.contents[i] != undefined) {
			//TODO: Draw the contents of that item slot
		}
	}
}

function drawPlayer(player) {
	for (var id in player.sprites) {
		var sprite = player.sprites[id];
		drawSpriteRelativeToPlayer(player, sprite);
	}
}

interface Sprite {
	x: number,
	y: number,
	angle: number,
	id: string,
	animation: string
}

function drawSpriteRelativeToPlayer(player, sprite: Sprite) {
	canvasContext.save();
	canvasContext.translate(player.x - topleft.x, player.y - topleft.y);
	canvasContext.rotate(player.angle + Math.PI / 2);
	drawSprite(sprite);
	canvasContext.restore();
}

function drawSprite(sprite: Sprite) {
	const info = spriteTable[sprite.id];
	const image = info.image;
	const animation = info.animations[sprite.animation];
	if (animation === undefined) {
		console.log(`Animation ${sprite.animation} not found for sprite ${sprite.id}`);
		return;
	}
	const sourceFrame = animation.frames[0];

	canvasContext.translate(sprite.x, sprite.y);
	canvasContext.rotate(sprite.angle);
	canvasContext.drawImage(image, sourceFrame.x, sourceFrame.y, info.size.x, info.size.y,
		-info.size.x / 2, -info.size.y / 2, info.size.x, info.size.y);
}

const spriteTable = {
	Player: {
		image: playerImage,
		size: { x: 50, y: 50 },
		animations: {
			standing: {
				delay: -1,
				frames: [{ x: 0, y: 0 }]
			},
			walking: {
				delay: 100,
				frames: [
					{ x: 50, y: 0 },
					{ x: 100, y: 0 },
					{ x: 150, y: 0 },
					{ x: 200, y: 0 }
				]
			}
		}
	},
	TargetDummy: {
		image: targetDummy,
		size: { x: 50, y: 50 },
		animations: {
			standing: {
				delay: -1,
				frames: [{ x: 0, y: 0 }]
			},
			hurt: {
				delay: -1,
				frames: [{ x: 50, y: 0 }]
			}
		}
	},
	Slash: {
		image: slash,
		size: { x: 56, y: 66 },
		animations: {
			swinging: {
				delay: 100,
				frames: [{ x: 0, y: 0 },
				{ x: 56 * 1, y: 0 },
				{ x: 56 * 2, y: 0 },
				{ x: 56 * 3, y: 0 },
				{ x: 56 * 4, y: 0 }]
			}
		}
	}
}
