import { Behaviour } from "./Behaviour";
import { Sprite } from "../../Sprite";
import { Mover } from "../Movers/Mover";
import { Shape, Distance, Vector } from "../../Utils/Geometry";
import { Creature } from "../Creature";
import { Team } from "../Team";
import { Health } from "../Health";
import { BasicCreatureMover } from "../Movers/CreatureMover";

export class LooperBehaviour implements Behaviour {
    private angle: number = 0;

    constructor(private creatures: Map<string, Creature>, private hitbox: Shape, private mover: BasicCreatureMover, private health: Health, private Textures: any, private Team: Team) {
        this.Textures.self = new Sprite(0, 0, 0, 'Player', 'standing');
    }

    Update(elapsedMilliseconds: number, wallMap: import("../../map").WallMap): void {
        if(this.health.getCurrentHealth() <= 0) {
            this.Textures.self.animation = "dead";
            return;
        }
        const elapsedSeconds = elapsedMilliseconds / 1000;
        // Get closest player
        let closest: Creature;
        let closestDistance: number;

        this.creatures.forEach((player) => {
            if(player.Team == this.Team)
                return;
            const distance = Distance(this.hitbox.GetCenter(), player.Hitbox.GetCenter());
            if (closest === undefined || distance < closestDistance) {
                closest = player;
                closestDistance = distance;
            }
        });

        let direction = new Vector(0, 0);
        if (closest) {
            // Get vector towards closest player.
            const deltaX = closest.Hitbox.GetCenter().x - this.hitbox.GetCenter().x;
            const deltaY = closest.Hitbox.GetCenter().y - this.hitbox.GetCenter().y;
            direction = new Vector(deltaX, deltaY);

            // Set magnitude to pixelsTraveledPerSecond.
            if (direction.GetLength() != 0) {
                this.angle = Math.atan2(direction.x, direction.y);
            }

            //Loop if close
            if(closestDistance < 50) {
                // Rotate direction by 90 degrees
                const temp = direction.x;
                direction.x = direction.y;
                direction.y = temp * -1;
            }
        }

        this.mover.SetCreatureIntendedDirection(direction);
        this.mover.Update(elapsedSeconds, wallMap);

        if (direction.GetLength() != 0) {
            this.Textures.self.animation = 'walking';
        } else {
            this.Textures.self.animation = 'standing';
        }
    }
    GetAngle(): number {
        return this.angle;
    }
}