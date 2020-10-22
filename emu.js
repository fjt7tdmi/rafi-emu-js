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
        return `lui ${IntRegNames[rd]},${imm}`;
    }
}

function AUIPC(rd, imm) {
    this.rd = rd;
    this.imm = imm;
    this.toString = function() {
        return `auipc ${IntRegNames[rd]},${imm}`;
    }
}

function JAL(rd, imm) {
    this.rd = rd;
    this.imm = imm;
    this.toString = function() {
        if (rd == 0) {
            return `j #${imm}`
        } else {
            return `jal ${IntRegNames[rd]},${imm}`;
        }
    }
}

function JALR(rd, rs1, imm) {
    this.rd = rd;
    this.rs1 = rs1;
    this.imm = imm;
    this.toString = function() {
        if (rd == 0) {
            return `jr ${IntRegNames[rs1]},${imm}`;
        } else {
            return `jalr ${IntRegNames[rd]},${IntRegNames[rs1]},${imm}`;
        }
    }
}

function UnknownOp() {
    this.toString = function() {
        return "UnknownOp";
    }
}

//
// Decode
//
function pick(insn, lsb, width = 1) {
    return (insn >> lsb) & ((1 << width) - 1);
}

function sign_extend(width, value) {
    const sign = (value >> (width - 1)) & 1;
    const mask = (1 << width) - 1;

    if (sign == 0)
    {
        return value & mask;
    }
    else
    {
        return value | (~mask);
    }
}

function decode(insn) {
    const opcode = insn & 0x7f;
    const rd = (insn >> 7) & 0x1f;
    const funct3 = (insn >> 12) & 0x7;
    const rs1 = (insn >> 15) & 0x1f;

    switch (opcode) {
    case 0b0110111:
        return new LUI(rd, insn & 0xfffff000);
    case 0b0010111:
        return new AUIPC(rd, insn & 0xfffff000);
    case 0b1101111:
        return new JAL(rd, sign_extend(21,
            pick(insn, 31) << 20 |
            pick(insn, 21, 10) << 1 |
            pick(insn, 20) << 11 |
            pick(insn, 12, 8) << 12));
    case 0b1100111:
        if (funct3 == 0b000) {
            return new JALR(rd, rs1, sign_extend(12,
                pick(insn, 20, 12)));    
        }
        else {
            return new UnknownOp();
        }
    default:
        return new UnknownOp();
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
