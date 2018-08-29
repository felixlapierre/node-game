var textureMap = {
  spritesheet: undefined,
  tiles: []
};
var wallMap = {
  bounds: {
    x: undefined,
    y: undefined
  },
  tiles: []
};

var topleft = {
  x:0,
  y:0
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var spritesheet = new Image();
var origin = new Image();
origin.src = "sprites/origin.png";
var hover = new Image();
hover.src = "sprites/hover.png";

var movement = {
	up: false,
	down: false,
	left: false,
	right: false,
}

var mouse = {
  x:0,
  y:0
}

var mouseMapPosition = {
  x:0,
  y:0
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
	mouse.x = event.clientX - canvas.offsetLeft;
	mouse.y = event.clientY - canvas.offsetTop;
  mouseMapPosition.x = mouse.x + topleft.x;
  mouseMapPosition.y = mouse.y + topleft.y;
}, false);

canvas.addEventListener('click', function(event) {
  var x = event.pageX - canvas.offsetLeft + topleft.x;
  var y = event.pageY - canvas.offsetTop + topleft.y;
  handleCanvasClick(x, y);
}, false)

function Tile(sourceX, sourceY, top, left, bottom, right, width, height, rotation) {
  this.sourceX = sourceX,
  this.sourceY = sourceY,
  this.left = left,
  this.right = right,
  this.top = top,
  this.bottom = bottom,
  this.width = width,
  this.height = height,
  this.rotation = rotation
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawTiles();
  drawEditorElements();
}

function drawTiles() {
  var obj;
  for(var i = 0; i < textureMap.tiles.length; i++) {
    obj = textureMap.tiles[i];
    context.drawImage(spritesheet, obj.sourceX, obj.sourceY, width, height,
    x - topleft.x, y - topleft.y, width, height);
  }
}
function drawEditorElements() {
  context.drawImage(origin, 0, 0, 100, 100, -50 - topleft.x, -50 - topleft.y, 100, 100);
  var hoverTextureXOffset = ()
}

var update = setInterval(function() {
  updateTopLeft();
  drawCanvas();
}, 1000/30);

function updateTopLeft() {
  if(movement.left == true) {topleft.x -= 10;}
  if(movement.right == true) {topleft.x += 10;}
  if(movement.up == true) {topleft.y -= 10;}
  if(movement.down == true) {topleft.y += 10;}
}

function handleCanvasClick(x, y) {
  //x and y are the position of the click on the map

}

function newMap() {
  if(!confirm("Are you sure? Current map will be discarded.")) {
    textureMap.spritesheet = document.getElementById("spritesheet").value;
    wallMap.bounds.x = document.getElementById("xbounds").value;
    wallMap.bounds.y = document.getElementById("ybounds").value;

    spritesheet.src = "sprites/" + textureMap.spritesheet;
    clearMap();
  }
}

function clearMap() {
  textureMap.tiles = [];
  wallMap.tiles = [];
}

function saveMapToFile() {

}

function loadMapFromFile() {

}

function encodeTextureMap() {
  var file = "";
  file += textureMap.spritesheet + "\n";
  for(var i = 0; i < textureMap.tiles.length; i++) {
    var obj = textureMap.tiles[i];
    //TODO: Complete encoding
  }
}

function decodeTextureMap() {

}

function encodeWallMap() {

}

function decodeWallMap() {

}
