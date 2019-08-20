import { SpriteTable } from "./SpriteTable";
import { ClientStorage } from "./ClientStorage";
import { Input } from "./Input";
const tileSize = 50;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let timeOfLastDraw = new Date().getTime();
let timeSinceLastDraw = 0;

const itemBar = new Image();
itemBar.src = "static/ItemBar.png";

export interface Html5Canvas extends HTMLElement {
  width: number;
  height: number;
  getContext(type: string): CanvasContext;
}

interface CanvasContext {
  clearRect(x: number, y: number, width: number, height: number): void;
  fillStyle: string;
  drawImage(
    image: HTMLImageElement,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destX: number,
    destY: number,
    destWidth: number,
    destHeight: number
  ): void;
  save(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  restore(): void;
}

interface Sprite {
  x: number;
  y: number;
  angle: number;
  id: string;
  animation: string;
  time?: number;
}

export class Drawing {
  canvasContext: CanvasContext;
  constructor(private input: Input, private clientStorage: ClientStorage, private canvas: Html5Canvas) {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.clientStorage.canvas = this.canvas;
    this.canvasContext = this.canvas.getContext("2d");
  }

  StartDrawingLoop() {
    setInterval(this.Draw.bind(this), 1000 / 60);
  }

  Draw() {
    const now = new Date().getTime();
    timeSinceLastDraw = now - timeOfLastDraw;
    timeOfLastDraw = now;

    this.canvasContext.clearRect(0, 0, 800, 600);
    this.canvasContext.fillStyle = "green";

    if (
      this.clientStorage.map != undefined &&
      this.clientStorage.spritesheet.src != undefined
    ) {
      for (var i = 0; i < this.clientStorage.map.tiles.length; i++) {
        var tile = this.clientStorage.map.tiles[i];
        for (var x = tile.destX0; x <= tile.destX1; x += tileSize) {
          for (var y = tile.destY0; y <= tile.destY1; y += tileSize) {
            this.canvasContext.drawImage(
              this.clientStorage.spritesheet,
              tile.sourceX,
              tile.sourceY,
              50,
              50,
              x - this.clientStorage.topleft.x,
              y - this.clientStorage.topleft.y,
              50,
              50
            );
          }
        }
      }
    }

    this.clientStorage.creatures.forEach(player => {
      this.drawCreature(player);
    });

    //Determine the location at which the bag will be drawn
    var left = this.canvas.clientWidth / 2 - tileSize * 4.5;
    var top = this.canvas.clientHeight - tileSize;
    this.drawBag(this.canvasContext, left, top, itemBar);
  }

  drawBag(context, x, y, sprite) {
    var width = sprite.width / 2;
    var height = sprite.height;
    for (var i = 0; i < 9; i++) {
      var sourceX = this.input.selected == i ? 50 : 0;
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
      if (this.clientStorage.bag.contents[i] != undefined) {
        //TODO: Draw the contents of that item slot
      }
    }
  }

  drawCreature(player) {
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
      this.drawSpriteRelativeToPlayer(player, sprite);
    }
  }

  drawSpriteRelativeToPlayer(player, sprite: Sprite) {
    this.canvasContext.save();
    this.canvasContext.translate(
      player.creature.x - this.clientStorage.topleft.x,
      player.creature.y - this.clientStorage.topleft.y
    );
    this.canvasContext.rotate(player.creature.angle + Math.PI / 2);
    this.drawSprite(sprite);
    this.canvasContext.restore();
  }

  drawSprite(sprite: Sprite) {
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
  
    this.canvasContext.translate(sprite.x, sprite.y);
    this.canvasContext.rotate(sprite.angle);
    this.canvasContext.drawImage(
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
  
}