import { Vector, Shape } from "../../Utils/Geometry";
import { Mover, BasicMover } from "./Mover";

export interface CreatureMover extends Mover {
    SetCreatureIntendedDirection(direction: Vector): void
    AddVelocity(amount: Vector): void
    ReduceVelocity(amount: Vector): void
}

export class BasicCreatureMover implements CreatureMover {
    private creatureIntendedDirection: Vector
    private externalForcesVelocity: Vector
    private wrappedMover: BasicMover

    constructor(hitbox: Shape, private creatureSpeed: number) {
        this.creatureIntendedDirection = new Vector(0, 0);
        this.externalForcesVelocity = new Vector(0, 0);
        this.wrappedMover = new BasicMover(hitbox);
    }

    SetCreatureIntendedDirection(direction: Vector) {
        this.creatureIntendedDirection = direction;
        if(direction.GetLength() != 0)
            direction.Normalize();
        direction.Multiply(this.creatureSpeed);
    }

    Update(elapsedSeconds: number, wallMap: import("../../map").WallMap): void {
        this.wrappedMover.SetVelocity(new Vector(
            this.creatureIntendedDirection.x + this.externalForcesVelocity.x,
            this.creatureIntendedDirection.y + this.externalForcesVelocity.y));
        
        this.wrappedMover.Update(elapsedSeconds, wallMap);
    }
    SetVelocity(amount: Vector): void {
        this.externalForcesVelocity = amount;
    }
    AddVelocity(amount: Vector): void {
        this.externalForcesVelocity.x += amount.x;
        this.externalForcesVelocity.y += amount.y;
    }
    ReduceVelocity(amount: Vector): void {
        this.externalForcesVelocity.x -= amount.x;
        this.externalForcesVelocity.y -= amount.y;
    }
    GetCenter(): import("../../Utils/Geometry").Point {
        return this.wrappedMover.GetCenter();
    }
}