import { BasicMover } from "./Movers/Mover";
import { Rectangle, Point } from "../Utils/Geometry";
import { FiniteHealth } from "./Health";
import { LooperBehaviour } from "./Behaviours/LooperBehaviour";
import { NoopWeapon } from "../Items/NoopWeapon";
import { Creature, CreatureArgs } from "./Creature";
import { Team } from "./Team";
import { BasicCreatureMover } from "./Movers/CreatureMover";
const pixelsTraveledPerSecond = 350;

export class GoblinBuilder {

    public static CreateGoblin(location: Point, players: Map<string, Creature>) {        
        const hitbox = new Rectangle(location, new Point(50, 50));
        const mover = new BasicCreatureMover(hitbox, pixelsTraveledPerSecond);
        const health = new FiniteHealth(100);
        const textures = {};
        const team = Team.Enemies;

        const args: CreatureArgs = {
            Hitbox: hitbox,
            Mover: mover,
            Health: health,
            Weapon: new NoopWeapon(),
            Textures: textures,
            Behaviour: new LooperBehaviour(players, hitbox, mover, health, textures, team),
            Team: team
        }

        return new Creature(args);
    }
}