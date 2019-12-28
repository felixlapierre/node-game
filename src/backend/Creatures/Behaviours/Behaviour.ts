import { WallMap } from "../../map";

//NOTE: Not sure if this was designed for s or ms

export interface Behaviour {
    Update(elapsedMilliseconds: number, wallMap: WallMap): void
    GetAngle(): number
}