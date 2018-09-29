var exports = module.exports = {};
const inventory = require('./my_inventory.js');

function create() {
    return new Player(300, 300);
}

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.intent = {
      left:false,
      right:false,
      up:false,
      down:false,
      click:false
    }
    this.bag = inventory.createBag();
  }

exports.create = create;