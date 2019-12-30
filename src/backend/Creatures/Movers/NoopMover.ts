import { Point } from "../../Utils/Geometry";
import { CreatureMover } from "./CreatureMover";
import { Vector } from "../../Utils/Geometry";

export class NoopMover implements CreatureMover {
    SetCreatureIntendedDirection(direction: Vector): void { }
    AddVelocity(amount: Vector): void { }
    ReduceVelocity(amount: Vector): void { }
    Update() { }
    GetCenter() { return new Point(0, 0) }
    SetVelocity() { }
}