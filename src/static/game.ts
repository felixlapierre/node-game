var socket = io();
const tileSize = 50;
var topleft = {
  x: 0,
  y: 0
};

var bag = {
  contents: []
};

import { Input } from "./Input";
const input = new Input();

import { SpriteTable } from "./SpriteTable";

interface LocalCreatureInfo {
  creature: Creature;
  animations: Map<string, AnimationInfo>;
}

interface Creature {
  x: number;
  y: number;
  angle: number;
  sprites: any;
}

interface AnimationInfo {
  id: string;
  time: number;
}

const players = new Map<string, LocalCreatureInfo>();
const enemies = new Map<string, LocalCreatureInfo>();

var map = undefined;
socket.emit("new player");

setInterval(function() {
  calculateAngle();
  socket.emit("movement", input.getPlayerState());
}, 1000 / 60);

function calculateAngle() {
  var deltaX = input.mouse.x - canvas.width / 2 - canvas.offsetLeft;
  var deltaY = input.mouse.y - canvas.height / 2 - canvas.offsetTop;

  input.angle = Math.atan(deltaY / deltaX);
  if (deltaX < 0) {
    input.angle += Math.PI;
  }
}

interface Html5Canvas extends HTMLElement {
  width: number;
  height: number;
  getContext(type: string): any;
}

var canvas = document.getElementById("canvas") as Html5Canvas;

canvas.width = 800;
canvas.height = 600;
var canvasContext = canvas.getContext("2d");

var spritesheet = new Image();

var itemBar = new Image();
itemBar.src = "static/ItemBar.png";

socket.on("areaState", function(state) {
  for (var id in state.players) {
    if (players.has(id)) {
      players.get(id).creature = state.players[id];
    } else {
      players.set(id, {
        creature: state.players[id],
        animations: new Map<string, AnimationInfo>()
      });
    }
  }

  for (var id in state.enemies) {
    if (enemies.has(id)) {
      enemies.get(id).creature = state.enemies[id];
    } else {
      enemies.set(id, {
        creature: state.enemies[id],
        animations: new Map<string, AnimationInfo>()
      });
    }
  }

  if (myPlayerId && players.has(myPlayerId)) {
    topleft.x = players.get(myPlayerId).creature.x - canvas.width / 2;
    topleft.y = players.get(myPlayerId).creature.y - canvas.height / 2;
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
  canvasContext.fillStyle = "green";

  if (map != undefined && spritesheet.src != undefined) {
    for (var i = 0; i < map.tiles.length; i++) {
      var tile = map.tiles[i];
      for (var x = tile.destX0; x <= tile.destX1; x += tileSize) {
        for (var y = tile.destY0; y <= tile.destY1; y += tileSize) {
          canvasContext.drawImage(
            spritesheet,
            tile.sourceX,
            tile.sourceY,
            50,
            50,
            x - topleft.x,
            y - topleft.y,
            50,
            50
          );
        }
      }
    }
  }

  players.forEach(player => {
    drawPlayer(player);
  });

  enemies.forEach(enemy => {
    drawPlayer(enemy);
  });

  //Determine the location at which the bag will be drawn
  var left = canvas.clientWidth / 2 - tileSize * 4.5;
  var top = canvas.clientHeight - tileSize;
  drawBag(canvasContext, left, top, itemBar);
}

socket.on("mapdata", function(data) {
  map = data;
  spritesheet.src = "static/" + data.spritesheet;
});

let myPlayerId;

socket.on("identity", function(id) {
  myPlayerId = id;
});

socket.on("returnPlayerState", function(data) {
  bag.contents = data.bag.contents;
});

function drawBag(context, x, y, sprite) {
  var width = sprite.width / 2;
  var height = sprite.height;
  for (var i = 0; i < 9; i++) {
    var sourceX = input.selected == i ? 50 : 0;
    context.drawImage(
      sprite,
      sourceX,
      0,
      width,
      height,
      x + i * width,
      y,
      width,
      height
    );
    if (bag.contents[i] != undefined) {
      //TODO: Draw the contents of that item slot
    }
  }
}

function drawPlayer(player) {
  for (var id in player.creature.sprites) {
    const sprite = player.creature.sprites[id];
    if (player.animations.has(id)) {
      const animationInfo = player.animations.get(id);
      if (animationInfo.id == sprite.animation) {
        animationInfo.time += timeSinceLastDraw;
      } else {
        animationInfo.time = 0;
        animationInfo.id = sprite.animation;
      }
      sprite.time = animationInfo.time;
    } else {
      player.animations.set(id, {
        id: id,
        time: 0
      });
      sprite.time = 0;
    }
    drawSpriteRelativeToPlayer(player, sprite);
  }
}

interface Sprite {
  x: number;
  y: number;
  angle: number;
  id: string;
  animation: string;
  time?: number;
}

function drawSpriteRelativeToPlayer(player, sprite: Sprite) {
  canvasContext.save();
  canvasContext.translate(
    player.creature.x - topleft.x,
    player.creature.y - topleft.y
  );
  canvasContext.rotate(player.creature.angle + Math.PI / 2);
  drawSprite(sprite);
  canvasContext.restore();
}

function drawSprite(sprite: Sprite) {
  const info = SpriteTable[sprite.id];
  const image = info.image;
  const animation = info.animations[sprite.animation];
  if (animation === undefined) {
    console.log(
      `Animation ${sprite.animation} not found for sprite ${sprite.id}`
    );
    return;
  }
  const currentFrame =
    Math.floor(sprite.time / animation.delay) % animation.frames.length;

  const sourceFrame = animation.frames[currentFrame];

  canvasContext.translate(sprite.x, sprite.y);
  canvasContext.rotate(sprite.angle);
  canvasContext.drawImage(
    image,
    sourceFrame.x,
    sourceFrame.y,
    info.size.x,
    info.size.y,
    -info.size.x / 2,
    -info.size.y / 2,
    info.size.x,
    info.size.y
  );
}
