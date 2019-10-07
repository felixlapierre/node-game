import { Shape, Point } from "./Geometry";

export class ToggleShape implements Shape {
    private enabled = true;
    constructor(private decorated: Shape) {

    }
    Disable() {
        this.enabled = false;
    }
    Enable() {
        this.enabled = true;
    }
    SetCenter(center: Point) {
        return this.decorated.SetCenter(center);
    }
    GetCenter(): Point {
        return this.decorated.GetCenter();
    }
    Overlaps(shape: Shape): boolean {
        if(this.enabled) {
            return this.decorated.Overlaps(shape);
        } else {
            return false;
        }
    }
}