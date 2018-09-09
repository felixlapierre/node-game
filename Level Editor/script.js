//
// Global Variables
//

var textureMap = {
  spritesheet: "sprites/spritesheet1.png",
  tiles: {}
};

var blockMap = {
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
spritesheet.src = "sprites/spritesheet1.png";
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

//Mouse position relative to canvas
var mouse = {
  x:0,
  y:0
}
//Mouse position relative to map
var mouseMapPosition = {
  x:0,
  y:0,
  recalculate : function() {
    this.x = mouse.x + topleft.x;
    this.y = mouse.y + topleft.y;
  }
}

var settings = {
  gridlock: false,
  adjustingTiling: false,
  textureTilingX:0,
  textureTilingY:0
}

//
// Event listeners
// Keyboard and Mouse
//

document.addEventListener('keydown', function(event) {
  //Adjust how much tiling is done
  if(settings.adjustingTiling == true) {
    switch(event.keyCode) {
      case 65: //A
      settings.textureTilingX -= (settings.textureTilingX == 0) ? 0 : 1;
      break;
      case 87: //W
      settings.textureTilingY -= (settings.textureTilingY == 0) ? 0 : 1;
      break;
      case 68: //D
      settings.textureTilingX += 1;
      break;
      case 83: //S
      settings.textureTilingY += 1;
      break;    }
  } else {
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
  }
  //Other keys
  switch(event.keyCode) {
    case 69: //E
    settings.gridlock = !settings.gridlock;
    movement = {
      up: false,
      down: false,
      left: false,
      right: false,
    }
    break;

    case 16: //Shift
    settings.adjustingTiling = true;
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

    case 16: //Shift
    settings.adjustingTiling = false;
    break;
  }
});

document.addEventListener('mousemove', function(event) {
  mouse.x = event.clientX - canvas.getBoundingClientRect().left - 5; //5 is the width of the border
  mouse.y = event.clientY - canvas.getBoundingClientRect().top - 5;
  mouseMapPosition.recalculate();
}, false);

canvas.addEventListener('click', function(event) {
  handleCanvasClick(mouseMapPosition.x, mouseMapPosition.y);
}, false)

function Tile(sourceX, sourceY, width, height, top, left, bottom, right, rotation) {
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

//
// Drawing
//

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawTiles();
  drawEditorElements();
}

function drawTiles() {
  var layer, obj;
  for(var i in textureMap.tiles) {
    if(textureMap.tiles.hasOwnProperty(i)) {
      layer = textureMap.tiles[i];
      for(var j = 0; j < layer.length; j++) {
        obj = layer[j];
        for(var x = obj.left; x <= obj.right; x += obj.width) {
          for(var y = obj.top; y <= obj.bottom; y += obj.height) {
            context.drawImage(spritesheet, obj.sourceX, obj.sourceY, obj.width, obj.height,
              x - topleft.x, y - topleft.y, obj.width, obj.height);
            }
          }
        }
      }
    }
  }

function drawEditorElements() {
  context.drawImage(origin, 0, 0, 100, 100, -50 - topleft.x, -50 - topleft.y, 100, 100);

  //Is the hovered location out of bounds?
  if (!(mouseMapPosition.x < 0 || mouseMapPosition.y < 0)) {
    //Apply gridlock to hovered location indicater
    var hoverX, hoverY;
    if(settings.gridlock == true) {
      hoverX = parseInt(mouseMapPosition.x / 50.0) * 50 - topleft.x;
      hoverY = parseInt(mouseMapPosition.y / 50.0) * 50 - topleft.y;
    } else {
      hoverX = mouse.x;
      hoverY = mouse.y;
    }

    //Draw hovered location indicator
    for(var i = 0; i <= settings.textureTilingX; i++) {
      for(var j = 0; j <= settings.textureTilingY; j++) {
        context.drawImage(hover, 0, 0, 50, 50, hoverX + 50 * i, hoverY + 50 * j, 50, 50);
      }
    }
  }

  //Draw mouse position
  context.font = "16px Arial";
  context.fillstyle = "#0095DD";
  context.fillText("(" + mouse.x + "," + mouse.y + ")", 0, 0);
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
  mouseMapPosition.recalculate();
}

//
// Editing Level
//

function handleCanvasClick(x, y) {
  var trueX = (settings.gridlock == false) ? x : round(x, 50);
  var trueY = (settings.gridlock == false) ? y : round(y, 50);

  //Get Layer
  var layer = parseInt(document.getElementById("layerButton").value);
  if(layer < 0)
    layer = 0;

  //Make sure that layer's array has been initialized
  if(textureMap.tiles[layer] == undefined)
    textureMap.tiles[layer] = [];

  //Add the tile
  var obj = new Tile(selected.x, selected.y, selected.width, selected.height,
    trueY, trueX, trueY + settings.textureTilingY * selected.height, trueX + settings.textureTilingX * selected.width, 0);

  console.log(obj);

  textureMap.tiles[layer].push(obj);
}

//
// Map operations
//

function newMap() {
  if(confirm("Are you sure? Current map will be discarded.")) {
    textureMap.spritesheet = "sprites/" + document.getElementById("spritesheetInput").value;
    blockMap.bounds.x = document.getElementById("xbounds").value;
    blockMap.bounds.y = document.getElementById("ybounds").value;

    spritesheet.src = textureMap.spritesheet;

    //Call this function in spriteSelector.js
    setNewSpritesheet(spritesheet.src);

    clearMap();
  }
}

function clearMap() {
  textureMap.tiles = {};
  blockMap.tiles = [];
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

function encodeblockMap() {

}

function decodeblockMap() {

}
