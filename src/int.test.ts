import * as int from "./int";

test('basic', () => {
    const zero = new int.Integer();
    expect(zero.toNumber()).toBe(0);

    const one = new int.Integer(1);
    const two = new int.Integer(2);
    const minusOne = new int.Integer(-1);
    const minusTwo = new int.Integer(-2);

    expect(int.add(one, two).toNumber()).toBe(3);
    expect(int.add(one, minusOne).toNumber()).toBe(0);
    expect(int.add(two, minusOne).toNumber()).toBe(1);
    expect(int.add(one, minusTwo).toNumber()).toBe(-1);
    expect(int.add(minusOne, minusTwo).toNumber()).toBe(-3);

    expect(int.sub(two, one).toNumber()).toBe(1);
    expect(int.sub(one, two).toNumber()).toBe(-1);

    expect(int.signedLessThan(minusOne, one)).toBe(true);
    expect(int.signedGreaterEqual(minusOne, one)).toBe(false);
    expect(int.unsignedLessThan(minusOne, one)).toBe(false);
    expect(int.unsignedGreaterEqual(minusOne, one)).toBe(true);
});
