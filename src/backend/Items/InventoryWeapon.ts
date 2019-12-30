import {Weapon} from './Weapon';
import { Creature } from '../Creatures/Creature';
import { Bag } from '../inventory';
import { Sword } from './items';

export class InventoryWeapon implements Weapon {
    constructor(private bag: Bag) { }

    handleHit(creature: Creature) {
        //TODO: Implement
        const currentItem = this.bag.contents[this.bag.selected];
        if(currentItem instanceof Sword) {
            const sword = currentItem as Sword;
            if(sword.state == "swinging") {
                sword.handleHit(creature);
            }
        }
    }
}