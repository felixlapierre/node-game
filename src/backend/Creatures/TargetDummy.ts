import { Enemy } from './Enemy';
import { Rectangle, Point, Shape } from '../Utils/Geometry';
import { Sprite } from '../Sprite';
import { Mover } from './Movers/Mover';
import { NoopMover } from './Movers/NoopMover';
import { InfiniteHealth } from './Health';
import { NoopBehaviour } from './Behaviours/NoopBehaviour';
import { NoopWeapon } from '../Items/NoopWeapon';
import { Id } from '../Id';

const size = new Point(50, 50);

export class TargetDummy implements Enemy {
    public Hitbox: Shape
    public Mover: Mover
    public Health: InfiniteHealth
    public Weapon: NoopWeapon;
    public Textures: any;
    public Behaviour: NoopBehaviour;

    public ID: string;

    constructor(location: Point) {
        this.Hitbox = new Rectangle(new Point(0, 0), new Point(50, 50));
        this.Hitbox.SetCenter(location);
        this.Mover = new NoopMover();
        this.Health = new InfiniteHealth();
        this.Weapon = new NoopWeapon();
        this.Textures = {};
        this.Textures.self = new Sprite(0, 0, 0, "TargetDummy", "standing");
        this.Behaviour = new NoopBehaviour();

        this.ID = Id.get();
    }

    getDisplayInfo() {
        return {
            x: this.Hitbox.GetCenter().x,
            y: this.Hitbox.GetCenter().y,
            angle: this.Behaviour.GetAngle(),
            sprites: this.Textures
        }
    }
}