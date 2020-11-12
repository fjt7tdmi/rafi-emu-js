export class Int {
    public value: number

    constructor() {
        this.value = 0;
    }

    toInt32() {
        return this.value & 0xffffffff;
    }
}
