import { Shape } from "../Utils/Geometry";

export abstract class Enemy {
    public ID: string
    private static nextID = 0;

    constructor(protected hitbox: Shape) { 
        this.ID = `${Enemy.nextID++}`;
    }

    public IsHitBy(shape: Shape) {
        return this.hitbox.Overlaps(shape);
    }

    abstract Update(elapsedTime: number);

    abstract getDisplayInfo(): any
}