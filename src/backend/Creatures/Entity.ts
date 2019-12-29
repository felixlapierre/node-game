import { Mover } from "./Movers/Mover";
import { Shape } from "../Utils/Geometry";
import { Behaviour } from "./Behaviours/Behaviour";
import { Id } from "../Id";

export class Entity {
    ID: string

    constructor(public Mover: Mover, 
        public Hitbox: Shape, 
        public Behaviour: Behaviour,
        public Textures: any)
    {
        this.ID = Id.get();
    }

    GetDisplayInfo(): EntityDisplayInfo {
        return {
            x: this.Hitbox.GetCenter().x,
            y: this.Hitbox.GetCenter().y,
            angle: this.Behaviour.GetAngle(),
            sprites: this.Textures
        }
    }
}

export interface EntityDisplayInfo {
    x: number,
    y: number,
    angle: number,
    sprites: any
}