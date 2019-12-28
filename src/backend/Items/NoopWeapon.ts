import { Weapon } from "./Weapon";

export class NoopWeapon implements Weapon {
    handleHit() {}
}