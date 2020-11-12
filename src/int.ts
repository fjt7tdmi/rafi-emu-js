export class Int {
    private value: number = 0;

    constructor(value: number = 0) {
        this.value = value & 0xffffffff;
    }

    toNumber() {
        return this.value;
    }
}

export function add(x: Int, y: Int) {
    return new Int(x.toNumber() + y.toNumber())
}

export function sub(x: Int, y: Int) {
    return new Int(x.toNumber() - y.toNumber())
}
