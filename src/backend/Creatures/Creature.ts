import { Health } from "./Health";
import { Weapon } from "../Items/Weapon";
import { Entity } from "./Entity";
import { Shape } from "../Utils/Geometry";
import { Mover } from "./Movers/Mover";
import { Behaviour } from "./Behaviours/Behaviour";

export class Creature extends Entity {
    Health: Health
    Weapon: Weapon

    constructor(args: CreatureArgs) {
        super(args.Mover, args.Hitbox, args.Behaviour, args.Textures);
        this.Health = args.Health;
        this.Weapon = args.Weapon;
    }
}

export interface CreatureArgs {
    Mover: Mover
    Hitbox: Shape
    Behaviour: Behaviour,
    Health: Health,
    Weapon: Weapon,
    Textures: any
}