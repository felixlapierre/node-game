import { Shape, Vector } from "../../Utils/Geometry";
import { boundsCheck, wallCheck } from "../../collision";
import { WallMap } from "../../map";

export class Mover {
    private velocity: Vector = new Vector(0, 0);

    constructor(private position: Shape) {

    }

    /**
     * Update the position to reflect the passing of time.
     * @param elapsedSeconds The seconds elapsed since the last update.
     */
    Update(elapsedSeconds: number, wallMap: WallMap) {
        let center = this.position.GetCenter();

        center.x += this.velocity.x * elapsedSeconds;
        center.y += this.velocity.y * elapsedSeconds;

        // collision checks
        center = boundsCheck(center.x, center.y, wallMap.bounds);
        center = wallCheck(wallMap.tiles, center.x, center.y);

        this.position.SetCenter(center);
        console.log(`${center.x} ${center.y}`)
    }

    SetVelocity(amount: Vector) {
        this.velocity = amount;
    }
}