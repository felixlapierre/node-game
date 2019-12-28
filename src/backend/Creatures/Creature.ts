import { Shape } from "../Utils/Geometry";
import { Mover } from "./Movers/Mover";
import { Health } from "./Health";
import { Weapon } from "../Items/Weapon";
import { Behaviour } from "./Behaviours/Behaviour";

export interface Creature {
    Mover: Mover
    Hitbox: Shape
    Health: Health
    Weapon: Weapon
    Behaviour: Behaviour
    Textures: any
}