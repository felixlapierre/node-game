import { Behaviour } from "./Behaviour";
import { Shape, Distance, Vector } from "../../Utils/Geometry";
import { Mover } from "../Movers/Mover";
import { Sprite } from "../../Sprite";
import { Creature } from "../Creature";
import { Team } from "../Team";

const pixelsTraveledPerSecond = 350;

export class StraightRunBehaviour implements Behaviour {
    private angle: number = 0;

    constructor(private players: Map<string, Creature>, private hitbox: Shape, private mover: Mover, private Textures: any, private Team: Team) {
        this.Textures.self = new Sprite(0, 0, 0, 'Player', 'standing');
    }

    Update(elapsedMilliseconds: number, wallMap: import("../../map").WallMap): void {
        const elapsedSeconds = elapsedMilliseconds / 1000;
        // Get closest player
        let closest: Creature;
        let closestDistance: number;

        this.players.forEach((player) => {
            if(player.Team == this.Team)
                return;
            const distance = Distance(this.hitbox.GetCenter(), player.Hitbox.GetCenter());
            if (closest === undefined || distance < closestDistance) {
                closest = player;
                closestDistance = distance;
            }
        });

        let direction = new Vector(0, 0);
        if (closest && closestDistance > 50) {
            // Get vector towards closest player.
            const deltaX = closest.Hitbox.GetCenter().x - this.hitbox.GetCenter().x;
            const deltaY = closest.Hitbox.GetCenter().y - this.hitbox.GetCenter().y;
            direction = new Vector(deltaX, deltaY);

            // Set magnitude to pixelsTraveledPerSecond.
            if (direction.GetLength() != 0) {
                direction.Normalize();
                direction.Multiply(pixelsTraveledPerSecond);
                this.angle = Math.atan2(direction.x, direction.y);
            }
        }

        this.mover.SetVelocity(direction);
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