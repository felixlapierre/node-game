import { Health } from "./Health";
import { Weapon } from "../Items/Weapon";
import { Entity, EntityArgs } from "./Entity";
import { Shape } from "../Utils/Geometry";
import { Mover } from "./Movers/Mover";
import { Behaviour } from "./Behaviours/Behaviour";

export class Creature extends Entity {
    Health: Health
    Weapon: Weapon

    constructor(args: CreatureArgs) {
        super(args);
        this.Health = args.Health;
        this.Weapon = args.Weapon;
    }
}

export interface CreatureArgs extends EntityArgs {
    Health: Health,
    Weapon: Weapon
}