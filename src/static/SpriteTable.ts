var playerImage = new Image();
playerImage.src = "static/playerSprite1.png";

var targetDummy = new Image();
targetDummy.src = "static/TargetDummy.png";

var slash = new Image();
slash.src = "static/Slash.png";

export class SpriteTable {
    constructor() {
        return spriteTable;
    }
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
        loops: true,
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
        delay: 60,
        frames: [
          { x: 0, y: 0 },
          { x: 56 * 1, y: 0 },
          { x: 56 * 2, y: 0 },
          { x: 56 * 3, y: 0 },
          { x: 56 * 4, y: 0 }
        ]
      }
    }
  }
}
