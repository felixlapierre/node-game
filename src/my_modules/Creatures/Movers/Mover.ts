import { Shape, Vector } from "../../Utils/Geometry";
import { boundsCheck, wallCheck } from "../../collision";
import { WallMap } from "../../map";

export class Mover {
    private velocity: Vector = new Vector(0, 0);
    private acceleration: Vector = new Vector(0, 0);

    constructor(private position: Shape, private friction: number = 10) {

    }

    /**
     * Update the position to reflect the passing of time.
     * @param elapsedSeconds The seconds elapsed since the last update.
     */
    Update(elapsedSeconds: number, wallMap: WallMap) {
        elapsedSeconds *= 1000;
        this.velocity.Add(this.acceleration);

        let center = this.position.GetCenter();

        center.x += this.velocity.x * elapsedSeconds;
        center.y += this.velocity.y * elapsedSeconds;

        // collision checks
        center = boundsCheck(center.x, center.y, wallMap.bounds);
        center = wallCheck(wallMap.tiles, center.x, center.y);

        this.position.SetCenter(center);

        console.log(this.velocity.x);

        const frictionLoss = new Vector(this.velocity.x, this.velocity.y);
        frictionLoss.Multiply(this.friction * elapsedSeconds);
        this.velocity.Subtract(frictionLoss)
    }

    /**
     * Add velocity to this mover.
     * @param amount The amount of velocity to add.
     */
    AddVelocity(amount: Vector) {
        this.velocity.Add(amount);
    }
}