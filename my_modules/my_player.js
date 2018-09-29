var exports = module.exports = {};
const inventory = require('./my_inventory.js');
const items = require('./my_items');

function create() {
    return new Player(300, 300);
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.intent = {
            left: false,
            right: false,
            up: false,
            down: false,
            click: false
        };
        this.textures = {};
        this.bag = inventory.createBag();
        this.bag.contents[0] = items.createSword();
    }

    update(elapsedTime) {
        for(var i in this.bag.contents) {
            this.bag.contents[i].update(i == this.bag.selected, this.intent.click, elapsedTime, this.textures);
        }
    }
}

exports.create = create;