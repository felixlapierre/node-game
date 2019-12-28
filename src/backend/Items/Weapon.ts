import { Creature } from "../Creatures/Creature";
import { Bag } from "../inventory";

export interface Weapon {
    handleHit(creature: Creature);
}

export class InventoryWeapon implements Weapon {
    constructor(private bag: Bag) { }

    handleHit(creature: Creature) {
        //TODO: Implement
    }
}