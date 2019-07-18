var itemGUIDCounter = 0;
export abstract class Item {
  GUID: number
  constructor(public name: string, public quantity: number) {
    this.GUID = itemGUIDCounter++;
  }

  abstract update(selected, click, elapsedTime, textures);
}

export abstract class Weapon extends Item {
  state: string
  timeInState: number
  constructor(public name: string, public quantity: number, defaultState: string) {
    super(name, quantity);
    this.timeInState = 0;
    this.state = defaultState;
  }

  update(selected, click, elapsedTime, textures) {
    this.timeInState += elapsedTime;
    this.updateState(selected, click, elapsedTime); //Define this method in derived class
    textures[this.GUID] = this.createTextureFromState(); //Define this method in derived class
  }

  setState(newState: string) {
    this.timeInState = 0;
    this.state = newState;
  }

  abstract updateState(selected, click, elapsedTime);

  abstract createTextureFromState();
}

/*
  Using a Sword
  Left clicking& hold for a weapon should trigger PULL BACK state
  releasing too early will nullify damage
  relasing during an interval (tbd) with deal x amt of damage relative to timing (2 sec sweet spot??)
  Proper release triggers SWING state which deals damage to an area //TODO: define range of weapon and implement parrying
  After SWING, restore to SHEATHED state
*/
const lengthSwing = 300;
const minSwingBack = 0;
const perfectSwingBack = 1500;
export class Sword extends Weapon {
  maxdamage: number
  damageFactor: number
  constructor() {
    super('Sword', 1, "sheathed");
    this.timeInState = 0;
    this.maxdamage = 30;
    this.damageFactor = 1;
  }

  updateState(selected, click, elapsedTime) {
    //State machine for sword
    switch (this.state) {

      case "sheathed":
        if (selected == true && click == true) {
          this.setState("swingback");
          return;
        }
        break;

      case "swingback":
        if (selected == false || (click == false && this.timeInState < minSwingBack)) {
          this.setState("sheathed");
        } else if (click == false) {
          //Damage factor calculation
          if (this.timeInState < perfectSwingBack) {
            this.damageFactor = (this.timeInState - minSwingBack) / perfectSwingBack;
          } else {
            this.damageFactor = 0.7 + 0.3 * perfectSwingBack / this.timeInState;
          }
          this.setState("swinging");
        }
        break;

      case "swinging":
        if (this.timeInState > lengthSwing) {
          this.setState("sheathed");
        }
        break;
    }
  }

  createTextureFromState() {
    switch (this.state) {
      case "sheathed":
        return undefined;

      case "swingback":
        return undefined; //Placeholder

      case "swinging":
        return new PlayerLockedTexture("static/Slash.png",
          {
            x: Math.floor(this.timeInState / (lengthSwing / 5)) * 56,
            y: 0,
            w: 56,
            h: 66
          },
          {
            x: -56/2,
            y:-66,
            w:56,
            h:66
          },
          0, true);
    }
  }
}
interface Rectangle {
  x: number,
  y: number,
  w: number,
  h: number
}

export class PlayerLockedTexture {
  sprite: any
  source: Rectangle
  dest: Rectangle
  angle: number
  rotateWithPlayer: boolean
  constructor(sprite, source, dest, angle, rotateWithPlayer) {
    this.sprite = sprite;
    this.source = {
      x: source.x,
      y: source.y,
      w: source.w,
      h: source.h
    };
    this.source.x = source.x;
    this.source.y = source.y;
    this.source.w = source.w;
    this.source.h = source.h;
    this.dest = {
      x: dest.x,
      y: dest.y,
      w: dest.w,
      h: dest.h
    };
    this.dest.x = dest.x;
    this.dest.y = dest.y;
    this.dest.w = dest.w;
    this.dest.h = dest.h;
    this.angle = angle;
    this.rotateWithPlayer = rotateWithPlayer;
  }
}
/*
  TODO:
  Using an item
  Left clicking will cause a different effect depending on the TYPE of the item

  key     => will unlock interactable if within range (to open must use right click)
  potion  => will consume, increase HP & invoke removeOne()
*/