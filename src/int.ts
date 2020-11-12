export class Integer {
    private value: number = 0;

    constructor(value: number = 0) {
        this.value = value & 0xffffffff;
    }

    toNumber() {
        return this.value;
    }

    toUnsignedNumber() {
        if (this.value < 0) {
            return this.value + 0x100000000;
        }
        else {
            return this.value;
        }
    }
}

export function add(x: Integer, y: Integer) {
    return new Integer(x.toNumber() + y.toNumber());
}

export function sub(x: Integer, y: Integer) {
    return new Integer(x.toNumber() - y.toNumber());
}

export function equal(x: Integer, y: Integer) {
    return x.toNumber() == y.toNumber();
}

export function signedLessThan(x: Integer, y: Integer) {
    return x.toNumber() < y.toNumber();
}

export function unsignedLessThan(x: Integer, y: Integer) {
    return x.toUnsignedNumber() < y.toUnsignedNumber();
}

export function signedGreaterEqual(x: Integer, y: Integer) {
    return x.toNumber() >= y.toNumber();
}

export function unsignedGreaterEqual(x: Integer, y: Integer) {
    return x.toUnsignedNumber() >= y.toUnsignedNumber();
}
