import { Int, add, sub } from "./int";

test('initial value', () => {
    const zero = new Int();
    expect(zero.toNumber()).toBe(0);

    const one = new Int(1);
    const two = new Int(2);
    const minusOne = new Int(-1);
    const minusTwo = new Int(-2);

    expect(add(one, two).toNumber()).toBe(3);
    expect(add(one, minusOne).toNumber()).toBe(0);
    expect(add(two, minusOne).toNumber()).toBe(1);
    expect(add(one, minusTwo).toNumber()).toBe(-1);
    expect(add(minusOne, minusTwo).toNumber()).toBe(-3);

    expect(sub(two, one).toNumber()).toBe(1);
    expect(sub(one, two).toNumber()).toBe(-1);
});
