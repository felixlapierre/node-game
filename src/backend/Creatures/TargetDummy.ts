import { Rectangle, Point, Shape } from '../Utils/Geometry';
import { Sprite } from '../Sprite';
import { NoopMover } from './Movers/NoopMover';
import { InfiniteHealth } from './Health';
import { NoopBehaviour } from './Behaviours/NoopBehaviour';
import { NoopWeapon } from '../Items/NoopWeapon';
import { CreatureArgs, Creature } from './Creature';

const size = new Point(50, 50);

export class TargetDummyBuilder {
    static CreateTargetDummy(location: Point) {
        const textures: any = {};
        textures.self = new Sprite(0, 0, 0, "TargetDummy", "standing");

        const args: CreatureArgs = {
            Hitbox: new Rectangle(location, size),
            Mover: new NoopMover(),
            Textures: textures,
            Weapon: new NoopWeapon(),
            Health: new InfiniteHealth(),
            Behaviour: new NoopBehaviour()
        }

        return new Creature(args);
    }
}