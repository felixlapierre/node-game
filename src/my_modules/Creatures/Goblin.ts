import { Enemy } from "./Enemy";
import { BasicMover } from "./Movers/Mover";
import { Rectangle, Point } from "../Utils/Geometry";
import { FiniteHealth } from "./Health";
import { Weapon } from "../Items/Weapon";
import { StraightRunBehaviour } from "./Behaviours/StraightRunBehaviour";
import { Player } from "./Player";
import { Id } from "../Id";
import { LooperBehaviour } from "./Behaviours/LooperBehaviour";

export class Goblin implements Enemy {
    ID: string;
    getDisplayInfo() {
        return {
            x: this.Hitbox.GetCenter().x,
            y: this.Hitbox.GetCenter().y,
            angle: this.Behaviour.GetAngle(),
            sprites: this.Textures
        }
    }
    Mover: BasicMover;
    Hitbox: Rectangle;
    Health: FiniteHealth;
    Weapon: Weapon;
    Behaviour: LooperBehaviour;
    Textures: any;

    constructor(location: Point, players: Map<string, Player>) {
        this.Hitbox = new Rectangle(location, new Point(50, 50));
        this.Mover = new BasicMover(this.Hitbox);
        this.Health = new FiniteHealth(100);
        this.Textures = {};
        this.Behaviour = new LooperBehaviour(players, this.Hitbox, this.Mover, this.Textures);
        this.ID = Id.get();
    }
}