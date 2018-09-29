var exports = module.exports = {};

var itemGUIDCounter = 0;
class Item {
  constructor(quantity) {
    this.quantity = quantity;
    this.GUID = itemGUIDCounter++;
  }

  update(selected, click, elapsedTime, textures) {
    //Override this method to define item behaviour
   }
}

class Weapon extends Item {
  constructor(quantity, defaultState) {
    super(quantity);
    this.timeInState = 0;
    this.state = defaultState;
  }

  update(selected, click, elapsedTime, textures) {
    this.timeInState += elapsedTime;
    this.updateState(selected, click, elapsedTime); //Define this method in derived class
    textures[this.GUID] = this.createTextureFromState(); //Define this method in derived class
  }

  setState(newState) {
    this.timeInState = 0;
    this.state = newState;
  }
}

/*
  Using a Sword
  Left clicking& hold for a weapon should trigger PULL BACK state
  releasing too early will nullify damage
  relasing during an interval (tbd) with deal x amt of damage relative to timing (2 sec sweet spot??)
  Proper release triggers SWING state which deals damage to an area //TODO: define range of weapon and implement parrying
  After SWING, restore to SHEATHED state
*/
const lengthSwing = 500;
class Sword extends Weapon {
  constructor() {
    super(1, "sheathed");
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
        if (selected == false || (click == false && this.timeInState < 300)) {
          this.setState("sheathed");
        } else if (click == false) {
          //Damage factor calculation
          if(this.timeInState < 1500) {
            damageFactor = (this.timeInState - 300) / 1500;
          } else {
            damageFactor = 0.7 + 0.3 * 1500 / this.timeInState;
          }
          this.setState("swinging");
        }
        break;

      case "swinging":
        if(this.timeInState > 500) {
          this.setState("sheathed");
        }
        break;
    }
  }

  createTextureFromState() {
    switch(this.state) {
      case "sheathed":
        return undefined;

      case "swingback":
        return undefined; //Placeholder

      case "swinging":
      return {
        sprite:"static/Slash.png",
        sourceX: (int)(this.timeInState / lengthSwing * 5) * 45,
        sourceY: 0,
        sourceW: 45,
        sourceH: 66,
        destX: 0,
        destY: 0,
        destW: 45,
        destH: 66
      }
    }
  }
}
/*
  Using an item
  Left clicking will cause a different effect depending on the TYPE of the item

  key     => will unlock interactable if within range (to open must use right click)
  potion  => will consume, increase HP & invoke removeOne()
*/

exports.createSword = () => {return new Sword()};
