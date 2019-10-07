/**
 * The Counter class calls the given callback function exactly once
 * after the total count has been reached.
 */
export class Counter {
    private sum: number = 0;
    constructor(private total: number, private onCountComplete: Function) { }

    Increment(amount: number) {
        if(this.sum < this.total) {
            this.sum += amount;
            if(this.sum >= this.total)
                this.onCountComplete();
        }
    }

    CountReached() {
        return this.sum >= this.total;
    }
}