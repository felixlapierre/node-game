import { Creature } from "./Creature";

export interface Enemy extends Creature {
    ID: string
    getDisplayInfo(): any;
}