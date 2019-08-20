const tileSize = 50;

var bag = {
  contents: []
};

import { Input } from "./Input";
const input = new Input();

import { SpriteTable } from "./SpriteTable";
import {ClientStorage} from './ClientStorage';
const clientStorage = new ClientStorage();

import {Socket} from './Socket';
const socket = new Socket(input, clientStorage);
socket.setupSockets();

interface Html5Canvas extends HTMLElement {
  width: number;
  height: number;
  getContext(type: string): any;
}

var canvas = document.getElementById("canvas") as Html5Canvas;
clientStorage.canvas = canvas;
canvas.width = 800;
canvas.height = 600;
var canvasContext = canvas.getContext("2d");

var itemBar = new Image();
itemBar.src = "static/ItemBar.png";

setInterval(Draw, 1000 / 60);

let timeOfLastDraw = new Date().getTime();
let timeSinceLastDraw = 0;

function Draw() {
  const now = new Date().getTime();
  timeSinceLastDraw = now - timeOfLastDraw;
  timeOfLastDraw = now;

  canvasContext.clearRect(0, 0, 800, 600);
  canvasContext.fillStyle = "green";

  if (clientStorage.map != undefined && clientStorage.spritesheet.src != undefined) {
    for (var i = 0; i < clientStorage.map.tiles.length; i++) {
      var tile = clientStorage.map.tiles[i];
      for (var x = tile.destX0; x <= tile.destX1; x += tileSize) {
        for (var y = tile.destY0; y <= tile.destY1; y += tileSize) {
          canvasContext.drawImage(
            clientStorage.spritesheet,
            tile.sourceX,
            tile.sourceY,
            50,
            50,
            x - clientStorage.topleft.x,
            y - clientStorage.topleft.y,
            50,
            50
          );
        }
      }
    }
  }

  clientStorage.creatures.forEach(player => {
    drawCreature(player);
  });

  //Determine the location at which the bag will be drawn
  var left = canvas.clientWidth / 2 - tileSize * 4.5;
  var top = canvas.clientHeight - tileSize;
  drawBag(canvasContext, left, top, itemBar);
}

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

function drawCreature(player) {
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
    player.creature.x - clientStorage.topleft.x,
    player.creature.y - clientStorage.topleft.y
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
