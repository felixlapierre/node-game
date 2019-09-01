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