export class Id {
    private static counter = 0;
    static get() {
        return `${Id.counter++}`;
    }
}