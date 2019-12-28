import { TimeObserver, TimeSubject } from "./TimeSubject";
import { Counter } from "./Counter";

export class TimeCounter implements TimeObserver {
    private counter: Counter;
    constructor(target: number, callback: Function) {
        this.counter = new Counter(target, callback);
        TimeSubject.GetInstance().Register(this);
    }

    OnTimeElapsed(amount: number) {
        this.counter.Increment(amount);
    }
}