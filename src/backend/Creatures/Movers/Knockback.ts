import { Creature } from "../Creature";
import { Vector } from "../../Utils/Geometry";
import { TimeSubject, TimeObserver } from "../../Utils/TimeSubject";

export class Knockback implements TimeObserver {
    private durationRemaining: number
    constructor(private creature: Creature, private intensity: Vector, private duration: number) {
        this.creature.Mover.AddVelocity(this.intensity)
        this.durationRemaining = this.duration;
        TimeSubject.GetInstance().Register(this);
    }

    OnTimeElapsed(amount: number) {
        const ratio = amount / this.duration;
        const velocityReduction = new Vector(
            this.intensity.x * ratio,
            this.intensity.y * ratio
        )
        this.creature.Mover.ReduceVelocity(velocityReduction);
        this.durationRemaining -= amount;
        if(this.durationRemaining <= 0) {
            TimeSubject.GetInstance().Unregister(this);
        }
    }
}