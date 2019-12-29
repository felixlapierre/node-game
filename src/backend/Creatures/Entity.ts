import { Mover } from "./Movers/Mover";
import { Shape } from "../Utils/Geometry";
import { Behaviour } from "./Behaviours/Behaviour";
import { Id } from "../Id";
import { Team } from "./Team";

export class Entity {
    public Mover: Mover
    public Hitbox: Shape
    public Behaviour: Behaviour
    public Textures: any
    public Team: Team
    public ID: string

    constructor(args: EntityArgs)
    {
        this.Mover = args.Mover;
        this.Hitbox = args.Hitbox;
        this.Behaviour = args.Behaviour;
        this.Textures = args.Textures;
        this.Team = args.Team;
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

export interface EntityArgs {
    Mover: Mover,
    Hitbox: Shape,
    Behaviour: Behaviour,
    Textures: any,
    Team: Team
}

export interface EntityDisplayInfo {
    x: number,
    y: number,
    angle: number,
    sprites: any
}