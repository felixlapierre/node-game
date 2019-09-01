import { Bag } from '../inventory';
import { Sword } from '../Items/items';
import { Point } from '../Utils/Geometry';
import { Sprite } from '../Sprite';

export interface Intent {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    click: boolean
}
export class Player {
    private x: number;
    private y: number;
    angle: number;
    intent: Intent;
    textures: any;
    bag: Bag;

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
        this.textures.self = new Sprite(0, 0, 0, 'Player', 'standing');
        this.bag = new Bag();
        this.bag.contents[0] = new Sword();
    }

    update(elapsedTime) {
        for (var i in this.bag.contents) {
            this.bag.contents[i].update(parseInt(i) == this.bag.selected, this.intent.click, elapsedTime, this.textures);
        }
        if(this.intent.left || this.intent.right || this.intent.up || this.intent.down) {
            this.textures.self.animation = 'walking';
        } else {
            this.textures.self.animation = 'standing';
        }
    }

    getCenter() {
        return new Point(this.x, this.y);
    }

    setCenter(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }

    GetDisplayInfo() {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            sprites: this.textures
        }
    }
}