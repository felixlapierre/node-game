import { Bag } from "../../inventory";
import { Sprite } from "../../Sprite";
import { Weapon } from "../../Items/Weapon";
import { Sword } from "../../Items/items";
import { Mover } from "../Movers/Mover";
import { Vector } from "../../Utils/Geometry";
import { Behaviour } from "./Behaviour";
import { WallMap } from "../../map";

const pixelsTraveledPerSecond = 500;

export interface Intent {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    click: boolean,
    angle: number,
    selected: number
}

export class PlayerInputBehaviour implements Behaviour {
    public intent = {
        left: false,
        right: false,
        up: false,
        down: false,
        click: false,
        angle: 0,
        selected: 0
    }

    constructor(public Bag: Bag, private Textures: any, private Mover: Mover, private Weapon: Weapon) {
        this.Textures.self = new Sprite(0, 0, 0, 'Player', 'standing');
        this.Bag.contents[0] = new Sword();
    }

    Update(elapsedMilliseconds: number, wallMap: WallMap) {
        const elapsedSeconds = elapsedMilliseconds / 1000;
        const intentDirection = new Vector(0, 0);

        if (this.intent.left) { intentDirection.x -= 1 }
        if (this.intent.up) { intentDirection.y -= 1 }
        if (this.intent.right) { intentDirection.x += 1 }
        if (this.intent.down) { intentDirection.y += 1 }

        if(intentDirection.GetLength() != 0) {
            intentDirection.Normalize();
            intentDirection.Multiply(pixelsTraveledPerSecond)
        }
        this.Mover.SetVelocity(intentDirection);

        this.Mover.Update(elapsedSeconds, wallMap);

        const firstItem = this.Bag.contents[0];
        if(firstItem instanceof Sword) {
            const sword = firstItem as Sword;
            sword.updateHitbox(this.Mover.GetCenter(), this.GetAngle());
        }

        for (var i in this.Bag.contents) {
            this.Bag.contents[i].update(parseInt(i) == this.Bag.selected, this.intent.click, elapsedMilliseconds, this.Textures);
        }
        if (this.intent.left || this.intent.right || this.intent.up || this.intent.down) {
            this.Textures.self.animation = 'walking';
        } else {
            this.Textures.self.animation = 'standing';
        }
    }

    SetIntent(intent: Intent) {
        this.intent = intent;
        this.Bag.selected = intent.selected;
    }

    GetAngle() { return this.intent.angle }
}