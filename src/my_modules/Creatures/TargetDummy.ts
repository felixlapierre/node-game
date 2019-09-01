import { Enemy } from './Enemy';
import { Rectangle, Point } from '../Utils/Geometry';
import { Sprite } from '../Sprite';

const size = new Point(50, 50);

export class TargetDummy extends Enemy {
    x: number;
    y: number;
    angle: number;
    textures: any;

    constructor(location: Point) {
        super(new Rectangle(location, size))
        this.x = location.x;
        this.y = location.y;
        this.angle = 0;
        this.textures = {};
        this.textures.self = new Sprite(0, 0, 0, "TargetDummy", "standing");
    }

    Update(elapsedTime: number) {
        // The target dummy doesn't do a lot.
    }

    getDisplayInfo() {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            sprites: this.textures
        }
    }
}