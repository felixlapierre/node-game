var canvasSpritesheet = document.getElementById("spritesheet");
var contextSpritesheet = canvasSpritesheet.getContext("2d");
var spriteSelectorImage = new Image();
spriteSelectorImage.src = "sprites/spritesheet1.png";

const selectionBoxWidth = 4;
const roundTo = 10;
const selectionBoxTileSize = 50;

var mouseIsDown = false;
selected = {
  x:0,
  y:0,
  width:50,
  height:50
}

//Top corner of canvas, for purposes of accurate drawing
var canvasTopCorner = {
  x:canvasSpritesheet.getBoundingClientRect().left,
  y:canvasSpritesheet.getBoundingClientRect().top
}

function setNewSpritesheet(filename) {
  spriteSelectorImage.src = filename;
}

function drawSpriteSheetSelector() {
  //Clear the canvas
  contextSpritesheet.clearRect(0, 0, canvasSpritesheet.width, canvasSpritesheet.height);

  //Draw the spritesheet onto it
  if(settings.placing == "textures") {
    contextSpritesheet.drawImage(spriteSelectorImage, 0, 0, 800, 600, 0, 0, 800, 600);
  } else {
    contextSpritesheet.drawImage(blocks, 0, 0, 800, 600, 0, 0, 800, 600);
  }
  //Draw the selection square
  contextSpritesheet.beginPath();

  contextSpritesheet.rect(selected.x + selectionBoxWidth / 2, selected.y + selectionBoxWidth / 2,
    selected.width - selectionBoxWidth / 2, selected.height - selectionBoxWidth / 2);
    contextSpritesheet.lineWidth = "" + selectionBoxWidth;
    contextSpritesheet.strokeStyle = "rgba(0, 255, 255, 0.7)";
    contextSpritesheet.stroke();
  }

  var update = setInterval(function() {
    drawSpriteSheetSelector();
  }, 1000/30);

  //Selecting which area of spritesheet to use
  canvasSpritesheet.onmousedown = function(event) {
    if(settings.placing == "blocks") {
      selectClosestSquare(event.x, event.y);
      return;
    }
    selected.x = round(event.x - canvasTopCorner.x, roundTo);
    selected.y = round(event.y - canvasTopCorner.y, roundTo);

    selected.width = 0;
    selected.height = 0;
    mouseIsDown = true;
  }

canvasSpritesheet.onmousemove = function(event) {
  if(settings.placing == "blocks") {
    return; //This option is not available when selecting blocks
  }
  var truePos = {
    x: round(event.x - canvasTopCorner.x, roundTo),
    y: round(event.y - canvasTopCorner.y, roundTo)
  }

  if(!mouseIsDown)
    return;

  if(truePos.x > selected.x) {
    selected.width = truePos.x - selected.x;
  } else {
    selected.width += selected.x - truePos.x;
    selected.x = truePos.x;
  }

  if(truePos.y > selected.y) {
    selected.height = truePos.y - selected.y;
  } else {
    selected.height += selected.y - truePos.y;
    selected.y = truePos.y;
  }

}

canvasSpritesheet.onmouseup = function(event) {
  mouseIsDown = false;
}

  canvasSpritesheet.addEventListener('dblclick', function(event) {
    selectClosestSquare(event.x, event.y);
  });

function selectClosestSquare(x, y) {
  selected.x = round((x - canvasTopCorner.x),selectionBoxTileSize);
  selected.y = round((y - canvasTopCorner.y),selectionBoxTileSize);
  selected.width = selectionBoxTileSize;
  selected.height = selectionBoxTileSize;
}

function round(number, to) {
  return number -= number % to;
}
