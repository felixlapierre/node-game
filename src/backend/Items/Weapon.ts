import { Creature } from "../Creatures/Creature";

export interface Weapon {
    handleHit(creature: Creature);
}