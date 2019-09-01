import { Point, Rectangle, Shape } from '../Utils/Geometry';
import { Creature } from './Creature';
import { Mover } from './Movers/Mover';
import { FiniteHealth, Health } from './Health';
import { Weapon, InventoryWeapon } from '../Items/Weapon';
import { Bag } from '../inventory';
import { PlayerInputBehaviour } from './Behaviours/PlayerInputBehaviour';

export class Player implements Creature {
    public Hitbox: Shape
    public Mover: Mover
    public Health: Health
    public Weapon: Weapon;
    public Textures: any;
    public Behaviour: PlayerInputBehaviour;
    public Bag: Bag;

    constructor(x: number, y: number) {
        this.Hitbox = new Rectangle(new Point(x, y), new Point(50, 50));
        this.Mover = new Mover(this.Hitbox);
        this.Health = new FiniteHealth(100);
        this.Bag = new Bag();
        this.Weapon = new InventoryWeapon(this.Bag);
        this.Textures = {};
        this.Behaviour = new PlayerInputBehaviour(this.Bag, this.Textures, this.Mover, this.Weapon);
    }

    GetDisplayInfo() {
        return {
            x: this.Hitbox.GetCenter().x,
            y: this.Hitbox.GetCenter().y,
            angle: this.Behaviour.intent.angle,
            sprites: this.Textures
        }
    }
}