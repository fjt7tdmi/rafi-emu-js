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
class UnknownOp {
    toString() {
        return "UnknownOp";
    }
}

class LUI {
    constructor(rd, imm) {
        this.rd = rd;
        this.imm = imm;
    }
    toString() {
        return `lui ${IntRegNames[this.rd]},${this.imm}`;
    }
}

class AUIPC {
    constructor(rd, imm) {
        this.rd = rd;
        this.imm = imm;
    }
    toString() {
        return `auipc ${IntRegNames[this.rd]},${this.imm}`;
    }
}

class JAL {
    constructor(rd, imm) {
        this.rd = rd;
        this.imm = imm;        
    }
    toString() {
        if (this.rd == 0) {
            return `j #${this.imm}`;
        } else {
            return `jal ${IntRegNames[this.rd]},${this.imm}`;
        }
    }
}

class JALR {
    constructor(rd, rs1, imm) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    toString() {
        if (this.rd == 0) {
            return `jr ${IntRegNames[this.rs1]},${this.imm}`;
        } else {
            return `jalr ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
        }
    };
}

class BEQ {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        if (this.rs1 == 0) {
            return `beqz ${IntRegNames[this.rs2]}, #${this.imm}`;
        } else if (this.rs2 == 0) {
            return `beqz ${IntRegNames[this.rs1]}, #${this.imm}`;
        } else {
            return `beq ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},#${this.imm}`;
        }
    }
}

class BNE {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        if (this.rs1 == 0) {
            return `bnez ${IntRegNames[this.rs2]}, #${this.imm}`;
        } else if (this.rs2 == 0) {
            return `bnez ${IntRegNames[this.rs1]}, #${this.imm}`;
        } else {
            return `bne ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},#${this.imm}`;
        }
    }
}

class BLT {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        if (this.rs1 == 0) {
            return `bltz ${IntRegNames[this.rs2]}, #${this.imm}`;
        } else if (this.rs2 == 0) {
            return `bltz ${IntRegNames[this.rs1]}, #${this.imm}`;
        } else {
            return `blt ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},#${this.imm}`;
        }
    }
}

class BGE {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        if (this.rs1 == 0) {
            return `bgez ${IntRegNames[this.rs2]}, #${this.imm}`;
        } else if (this.rs2 == 0) {
            return `bgez ${IntRegNames[this.rs1]}, #${this.imm}`;
        } else {
            return `bge ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},#${this.imm}`;
        }
    }
}

class BLTU {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        return `bltu ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},${this.imm}`;
    }
}

class BGEU {
    constructor(rs1, rs2, imm) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    toString() {
        return `bgeu ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},${this.imm}`;
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
    const rs2 = (insn >> 20) & 0x1f;

    const imm_jal = sign_extend(21,
        pick(insn, 31) << 20 |
        pick(insn, 21, 10) << 1 |
        pick(insn, 20) << 11 |
        pick(insn, 12, 8) << 12);
    const imm_branch = sign_extend(13,
        pick(insn, 31) << 12 |
        pick(insn, 7) << 11 |
        pick(insn, 25, 6) << 5 |
        pick(insn, 8, 4) << 1);

    switch (opcode) {
    case 0b0110111:
        return new LUI(rd, insn & 0xfffff000);
    case 0b0010111:
        return new AUIPC(rd, insn & 0xfffff000);
    case 0b1101111:
        return new JAL(rd, imm_jal);
    case 0b1100111:
        if (funct3 == 0b000) {
            return new JALR(rd, rs1, sign_extend(12,
                pick(insn, 20, 12)));    
        }
        else {
            return new UnknownOp();
        }
    case 0b1100011:
        if (funct3 == 0b000) {
            return new BEQ(rs1, rs2, imm_branch);
        } else if (funct3 == 0b001) {
            return new BNE(rs1, rs2, imm_branch);
        } else if (funct3 == 0b100) {
            return new BLT(rs1, rs2, imm_branch);
        } else if (funct3 == 0b101) {
            return new BGE(rs1, rs2, imm_branch);
        } else if (funct3 == 0b110) {
            return new BLTU(rs1, rs2, imm_branch);
        } else if (funct3 == 0b111) {
            return new BGEU(rs1, rs2, imm_branch);
        } else {
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
