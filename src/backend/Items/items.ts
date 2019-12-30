import { Rectangle, Point, Circle, Shape, Vector } from '../Utils/Geometry';
import { Sprite } from '../Sprite';
import { Creature } from '../Creatures/Creature';
import { Knockback } from '../Creatures/Movers/Knockback';

export abstract class Item {
  GUID: number
  private static GUIDCounter: number = 0;
  constructor(public name: string, public quantity: number) {
    this.GUID = Item.GUIDCounter++;
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

  update(selected: boolean, click: boolean, elapsedTime: number, textures) {
    this.timeInState += elapsedTime;
    this.updateState(selected, click, elapsedTime); //Define this method in derived class
    textures[this.GUID] = this.createTextureFromState(); //Define this method in derived class
  }

  setState(newState: string) {
    this.timeInState = 0;
    this.state = newState;
  }

  abstract updateState(selected, click, elapsedTime);

  abstract createTextureFromState(): Sprite;
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
  hitbox: Shape
  constructor() {
    super('Sword', 1, "sheathed");
    this.timeInState = 0;
    this.maxdamage = 30;
    this.damageFactor = 1;
    this.hitbox = new Circle(new Point(0, 0), 10);
  }

  updateState(selected, click) {
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
        return new Sprite(0, 0, 0, 'Slash', 'nothing');

      case "swingback":
        return undefined; //Placeholder

      case "swinging":
        return new Sprite(0, -30, 0, 'Slash', 'swinging');
    }
  }

  updateHitbox(creatureCenter: Point, creatureAngle: number) {
    const direction = new Vector(Math.cos(creatureAngle), Math.sin(creatureAngle));
    direction.Multiply(30);
    const newCenter = new Point(creatureCenter.x + direction.x,
        creatureCenter.y + direction.y);
    this.hitbox.SetCenter(newCenter);
  }

  handleHit(target: Creature) {
      // Placeholder
      if(target.Hitbox.Overlaps(this.hitbox)
        && target.Health.isVulnerable()) {
        target.Health.takeDamage(10);
        const targetCenter = target.Hitbox.GetCenter();
        const myCenter = this.hitbox.GetCenter();
        const knockDirection = new Vector(targetCenter.x - myCenter.x, targetCenter.y - myCenter.y);
        knockDirection.Normalize();
        knockDirection.Multiply(2000);
        new Knockback(target, knockDirection, 250);
      }
  }
}