import { Enemy } from './Enemy';
import { Rectangle, Point } from './../Utils/Geometry';

const size = new Point(50, 50);

export class TargetDummy extends Enemy {
    private health: number

    x:number;
    y:number;
    angle:number;
    textures:any;

    constructor(location: Point) {
        super(new Rectangle(location, size))
        this.x = location.x;
        this.y = location.y;
        this.angle = 0;
        this.textures = {};
        this.health = 100;
    }

    Update(elapsedTime: number) {
        // The target dummy doesn't do a lot.
    }
}