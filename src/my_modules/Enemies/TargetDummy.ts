import { Enemy } from './Enemy';
import { Rectangle, Point } from './../Utils/Geometry';

const size = new Point(50, 50);

export class TargetDummy extends Enemy {
    private health: number
    constructor(location: Point) {
        super(new Rectangle(location, size))
        this.health = 100;
    }

    Update(elapsedTime: number) {
        // The target dummy doesn't do a lot.
    }
}