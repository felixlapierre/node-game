import { Point, Rectangle, Shape } from '../Utils/Geometry';
import { Creature, CreatureArgs } from './Creature';
import { BasicMover } from './Movers/Mover';
import { FiniteHealth } from './Health';
import { InventoryWeapon } from '../Items/Weapon';
import { Bag } from '../inventory';
import { PlayerInputBehaviour } from './Behaviours/PlayerInputBehaviour';

export class PlayerBuilder {
    private static playerSize = 50;

    static CreatePlayer(x: number, y: number): CreatePlayerReturnData {
        const hitbox = new Rectangle(new Point(x, y), new Point(this.playerSize, this.playerSize));
        const mover = new BasicMover(hitbox);
        const health = new FiniteHealth(100);
        const bag = new Bag();
        const weapon = new InventoryWeapon(bag);
        const textures = {};
        const behaviour = new PlayerInputBehaviour(bag, textures, mover, weapon);

        const args: CreatureArgs = {
            Hitbox: hitbox,
            Mover: mover,
            Health: health,
            Behaviour: behaviour,
            Weapon: weapon,
            Textures: textures
        }

        const player = new Creature(args);

        return {Player: player, Behaviour: behaviour};
    }
}

export interface CreatePlayerReturnData {
    Player: Creature,
    Behaviour: PlayerInputBehaviour
}