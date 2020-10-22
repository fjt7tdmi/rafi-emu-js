const fs = require('fs')

const IntRegNames = [
    "zero", "ra", "sp", "gp", "tp", "t0", "t1", "t2",
    "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5",
    "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7",
    "s8", "s9", "s10","s11", "t3", "t4","t5", "t6",
];

//
// Ops
//
function LUI(rd, imm) {
    this.rd = rd;
    this.imm = imm;
    this.toString = function() {
        return "lui " + IntRegNames[rd] + "," + imm;
    }
}

function AUIPC(rd, imm) {
    this.rd = rd;
    this.imm = imm;
    this.toString = function() {
        return "auipc " + IntRegNames[rd] + "," + imm;
    }
}

//
// Decode
//
function decode(insn) {
    const opcode = insn & 0x3f;
    const rd = (insn >> 7) & 0x1f;

    switch (opcode) {
    case 0b0110111:
        return new LUI(rd, insn & 0xfffff000);
    case 0b0010111:
        return new AUIPC(rd, insn & 0xfffff000);
    default:
        return "UNKNOWN";
    }
}

//
// Emulator
//
let buffer = fs.readFileSync("rafi-prebuilt-binary/riscv-tests/isa/rv32ui-p-add.bin");

for (var offset = 0; offset < 128; offset += 4)
{
    // Fetch (read binary file)
    const insn = buffer.readUInt32LE(offset);
    // console.log(insn.toString(16));

    // Decode
    const op = decode(insn);
    console.log(op.toString());
}
