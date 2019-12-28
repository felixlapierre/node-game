import { Behaviour } from "./Behaviour";

/**
 * A behaviour that does nothing.
 */
export class NoopBehaviour implements Behaviour {
    Update() { }
    GetAngle() { return 0 }
}