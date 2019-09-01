import { Bag } from "../../inventory";
import { Sprite } from "../../Sprite";
import { Weapon } from "../../Items/Weapon";
import { Sword } from "../../Items/items";
import { Mover } from "../Movers/Mover";
import { Vector } from "../../Utils/Geometry";
import { WallMap } from "../../map";

//NOTE: Not sure if this was designed for s or ms
const pixelsTraveledPerSecond = 500;

export interface Behaviour {
    Update(elapsedSeconds: number, wallMap: WallMap): void
}

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

    constructor(private bag: Bag, private Textures: any, private Mover: Mover, private Weapon: Weapon) {
        this.Textures.self = new Sprite(0, 0, 0, 'Player', 'standing');
        this.bag.contents[0] = new Sword();
    }

    Update(elapsedMilliseconds: number, wallMap: WallMap) {
        const elapsedSeconds = elapsedMilliseconds;
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

        for (var i in this.bag.contents) {
            this.bag.contents[i].update(parseInt(i) == this.bag.selected, this.intent.click, elapsedMilliseconds * 1000, this.Textures);
        }
        if (this.intent.left || this.intent.right || this.intent.up || this.intent.down) {
            this.Textures.self.animation = 'walking';
        } else {
            this.Textures.self.animation = 'standing';
        }
    }

    SetIntent(intent: Intent) {
        this.intent = intent;
        this.bag.selected = intent.selected;
    }
}