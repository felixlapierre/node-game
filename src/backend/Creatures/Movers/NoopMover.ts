import { Mover } from "./Mover";
import { Point } from "../../Utils/Geometry";

export class NoopMover implements Mover {
    Update() {}
    GetCenter() {return new Point(0, 0)}
    SetVelocity() {}
}