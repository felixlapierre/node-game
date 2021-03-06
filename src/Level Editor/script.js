//
// Global Variables
//
var tileSize = 50;
const baseTileSize = 50;
const zoomFactor = 0.2;

var textureMap = {
  spritesheet: "sprites/spritesheet1.png",
  tiles: {}
};

var blockMap = {
  bounds: {
    x: 3000,
    y: 3000
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
var blocks = new Image();
blocks.src = "sprites/blocks.png"

var playerState = {
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
    this.x = mouse.x + (topleft.x * tileSize / baseTileSize);
    this.y = mouse.y + (topleft.y * tileSize / baseTileSize);
  }
}

var settings = {
  gridlock: false,
  adjustingTiling: false,
  textureTilingX:0,
  textureTilingY:0,
  layer:1,
  placing:"textures"
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
  }
  //Other keys
  switch(event.keyCode) {
    case 27: //Esc
    settings.textureTilingX = 0;
    settings.textureTilingY = 0;
    break;

    case 81: //Q
    var temp = settings.textureTilingX;
    settings.textureTilingX = settings.textureTilingY;
    settings.textureTilingY = temp;
    break;

    case 69: //E
    if(settings.placing == "textures") {
      settings.gridlock = !settings.gridlock;
    }
    playerState = {
      up: false,
      down: false,
      left: false,
      right: false,
    }
    break;

    case 16: //Shift
    settings.adjustingTiling = true;
    break;

    case 9: //tab
    toggleEditingMode();
    break;
  }

  //Adjusting layer
  if(event.keyCode >= 48 && event.keyCode <= 57) {
    settings.layer = event.keyCode - 48;
    document.getElementById("layerDisplay").innerHTML = "Layer: " + settings.layer;
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

canvas.addEventListener('wheel', function(event) {

  //Don't question this function too much, the math works out
  var centerAdjustFactor = zoomFactor / 2;
  var zoom = tileSize / baseTileSize;
  if(event.deltaY < 0) {
    tileSize *= (1 + zoomFactor);
    zoom = tileSize / baseTileSize;
    topleft.x += canvas.width / zoom * centerAdjustFactor;
    topleft.y += canvas.height / zoom * centerAdjustFactor;
  } else if (tileSize > 10) {
    tileSize /= (1 + zoomFactor);
    topleft.x -= canvas.width / zoom * centerAdjustFactor;
    topleft.y -= canvas.height / zoom * centerAdjustFactor;
  }
});

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
  if(settings.placing == "blocks") {
    drawBlocks();
  }
  drawEditorElements();
}

function drawTiles() {
  var layer, obj;
  var zoom = tileSize / baseTileSize;
  for(var i in textureMap.tiles) {
    if(textureMap.tiles.hasOwnProperty(i)) {
      layer = textureMap.tiles[i];
      for(var j = 0; j < layer.length; j++) {
        obj = layer[j];
        for(var x = obj.left; x <= obj.right; x += obj.width) {
          for(var y = obj.top; y <= obj.bottom; y += obj.height) {
            context.drawImage(spritesheet, obj.sourceX, obj.sourceY, obj.width, obj.height,
              (x - topleft.x) * zoom, (y - topleft.y) * zoom, obj.width * zoom, obj.height * zoom);
          }
        }
      }
    }
  }
}

function drawBlocks() {
  var zoom = tileSize / baseTileSize;
  //Dim textures to remove focus
  context.beginPath();
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();

  //Draw blocks
  var obj;
  for(var i = 0; i < blockMap.tiles.length; i++) {
    obj = blockMap.tiles[i];
    var sourceX = 0;
    if(obj.type == "teleporter") {
      sourceX = 50;
    }
    for(var x = obj.left; x <= obj.right; x += 50) {
      for(var y = obj.top; y <= obj.bottom; y += 50) {
        context.drawImage(blocks, sourceX, 0, 50, 50, (x - topleft.x) * zoom, (y - topleft.y) * zoom, tileSize, tileSize);
      }
    }
  }
}

function drawEditorElements() {
  var zoom = tileSize / baseTileSize;
  context.drawImage(origin, 0, 0, 100, 100, -tileSize - topleft.x * zoom, -tileSize - topleft.y * zoom, tileSize * 2, tileSize * 2);

  //Apply gridlock to hovered location indicater
  var hoverX, hoverY;
  if(settings.gridlock == true) {
    hoverX = round(mouseMapPosition.x, tileSize) - topleft.x * zoom;
    hoverY = round(mouseMapPosition.y, tileSize) - topleft.y * zoom;
  } else {
    hoverX = mouse.x;
    hoverY = mouse.y;
  }

  //Draw hovered location indicator
  for(var i = 0; i <= settings.textureTilingX; i++) {
    for(var j = 0; j <= settings.textureTilingY; j++) {
      context.drawImage(hover, 0, 0, 50, 50, hoverX + selected.width * i * zoom, hoverY + selected.height * j * zoom, selected.width * zoom, selected.height * zoom);
    }
  }

  //Draw mouse position
  context.font = "16px Arial";
  context.fillstyle = "#0095DD";
  context.fillText("(" + mouseMapPosition.x + "," + mouseMapPosition.y + ")", canvas.width - 90, canvas.height - 14);
}

var update = setInterval(function() {
  updateTopLeft();
  drawCanvas();
}, 1000/30);

function updateTopLeft() {
  var zoom = tileSize / baseTileSize;
  //We want to scroll faster when zoom factor is smaller
  if(playerState.left == true) {topleft.x -= 10 / zoom;}
  if(playerState.right == true) {topleft.x += 10 / zoom;}
  if(playerState.up == true) {topleft.y -= 10 / zoom;}
  if(playerState.down == true) {topleft.y += 10 / zoom;}
  mouseMapPosition.recalculate();
}

//
// Editing Level
//

function toggleEditingMode() {
  if(settings.placing == "textures") {
    settings.placing = "blocks";
    selected = {
      x:0,
      y:0,
      width:50,
      height:50
    }
    settings.gridlock = true;
    document.getElementById("textureSettings").style.visibility = "collapse";
    document.getElementById("blockSettings").style.visibility = "visible";
  } else {
    settings.placing = "textures";
    document.getElementById("textureSettings").style.visibility = "visible";
    document.getElementById("blockSettings").style.visibility = "collapse";

  }
}

function handleCanvasClick(x, y) {
  if(settings.placing == "textures") {
    addTileToMap(x, y);
  }
  else {
    addBlockToMap(x, y);
  }
}

function addTileToMap(x, y) {
  var zoom = tileSize / baseTileSize;

  var trueX = (settings.gridlock == false) ? x : round(x, tileSize);
  var trueY = (settings.gridlock == false) ? y : round(y, tileSize);
  trueX /= zoom;
  trueY /= zoom;
  //Get Layer
  var layer = settings.layer;
  if(layer < 0)
    layer = 0;

  //Make sure that layer's array has been initialized
  if(textureMap.tiles[layer] == undefined)
    textureMap.tiles[layer] = [];

  //Add the tile
  var obj = new Tile(selected.x, selected.y, selected.width, selected.height,
    trueY, trueX, trueY + settings.textureTilingY * selected.height, trueX + settings.textureTilingX * selected.width, 0);

  textureMap.tiles[layer].push(obj);}

function addBlockToMap(x, y) {
  var zoom = tileSize / baseTileSize;
  var trueX = round(x, tileSize) / zoom;
  var trueY = round(y, tileSize) / zoom;
  var blockType;
  if(selected.x == 0 && selected.y == 0)
    blockType = "wall";
  else if (selected.x == 50 && selected.y == 0)
    blockType = "teleporter";

  var block = {
    left:trueX,
    top:trueY,
    right:trueX + tileSize * settings.textureTilingX,
    bottom:trueY + tileSize * settings.textureTilingY,
    type:blockType
  }

  blockMap.tiles.push(block);
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
