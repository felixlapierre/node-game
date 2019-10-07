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

    TimeElapsed(time: number) {
        this.observers.forEach((observer) => {
            observer.OnTimeElapsed(time);
        })
    }
}