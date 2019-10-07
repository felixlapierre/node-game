export interface TimeObserver {
    OnTimeElapsed(amount: Number);
}

export class TimeSubject {
    private static instance: TimeSubject;
    
    static GetInstance() {
        if(!this.instance)
            this.instance = new TimeSubject();
        return this.instance;
    }

    private observers: TimeObserver[] = [];

    Register(observer: TimeObserver) {
        this.observers.push(observer);
    }

    Unregister(observer: TimeObserver) {
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
    }

    TimeElapsed(time: number) {
        this.observers.forEach((observer) => {
            observer.OnTimeElapsed(time);
        })
    }
}