import { Shape, Point, Vector } from "../../Utils/Geometry";

export class Mover {
    private velocity: Vector = new Vector(0, 0);
    private acceleration: Vector = new Vector(0, 0);
    
    constructor(private position: Shape, private friction: number) {
        
    }

    /**
     * Update the position to reflect the passing of time.
     * @param elapsedSeconds The seconds elapsed since the last update.
     */
    Update(elapsedSeconds: number) {
        this.velocity.Add(this.acceleration);

        const frictionLoss = new Vector(this.velocity.x, this.velocity.y);
        frictionLoss.Multiply(this.friction * elapsedSeconds);
        this.velocity.Subtract(frictionLoss)

        const center = this.position.GetCenter();
        center.x += this.velocity.x * elapsedSeconds;
        center.y += this.velocity.y * elapsedSeconds;
        this.position.SetCenter(center);
    }

    /**
     * Add velocity to this mover.
     * @param amount The amount of velocity to add.
     */
    AddVelocity(amount: Vector) {
        this.velocity.Add(amount);
    }
}