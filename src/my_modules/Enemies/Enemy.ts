import { Shape } from "../Utils/Geometry";

export abstract class Enemy {

    constructor(protected hitbox: Shape) { }

    public IsHitBy(shape: Shape) {
        return this.hitbox.Overlaps(shape);
    }

    abstract Update(elapsedTime: number);

    abstract getDisplayInfo(): any
}