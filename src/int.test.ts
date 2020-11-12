import { Int } from "./int";

test('initial value', () => {
    const zero = new Int();
    expect(zero.toInt32()).toBe(0);
});
