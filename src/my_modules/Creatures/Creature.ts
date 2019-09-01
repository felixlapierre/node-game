import { Shape } from "../Utils/Geometry";
import { Mover } from "./Movers/Mover";
import { Health } from "./Health";
import { Weapon } from "../Items/items";

export interface Creature {
    Mover: Mover
    Hitbox: Shape
    Health: Health
    Weapon: Weapon
}