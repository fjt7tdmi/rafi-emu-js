const fs = require('fs')

let buffer = fs.readFileSync("rafi-prebuilt-binary/riscv-tests/isa/rv32ui-p-add.bin");

for (var offset = 0; offset < 128; offset += 4)
{
    const value = buffer.readUInt32LE(offset);
    console.log(value.toString(16));
}
