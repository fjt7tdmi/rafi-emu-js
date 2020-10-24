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
function UnknownOp() {
    this.toString = function() {
        return "UnknownOp";
    }
}

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

function BEQ(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        if (rs1 == 0) {
            return `beqz ${IntRegNames[rs2]}, #${imm}`;
        } else if (rs2 == 0) {
            return `beqz ${IntRegNames[rs1]}, #${imm}`;
        } else {
            return `beq ${IntRegNames[rs1]},${IntRegNames[rs2]},#${imm}`;
        }
    }
}

function BNE(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        if (rs1 == 0) {
            return `bnez ${IntRegNames[rs2]}, #${imm}`;
        } else if (rs2 == 0) {
            return `bnez ${IntRegNames[rs1]}, #${imm}`;
        } else {
            return `bne ${IntRegNames[rs1]},${IntRegNames[rs2]},#${imm}`;
        }
    }
}

function BLT(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        if (rs1 == 0) {
            return `bltz ${IntRegNames[rs2]}, #${imm}`;
        } else if (rs2 == 0) {
            return `bltz ${IntRegNames[rs1]}, #${imm}`;
        } else {
            return `blt ${IntRegNames[rs1]},${IntRegNames[rs2]},#${imm}`;
        }
    }
}

function BGE(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        if (rs1 == 0) {
            return `bgez ${IntRegNames[rs2]}, #${imm}`;
        } else if (rs2 == 0) {
            return `bgez ${IntRegNames[rs1]}, #${imm}`;
        } else {
            return `bge ${IntRegNames[rs1]},${IntRegNames[rs2]},#${imm}`;
        }
    }
}

function BLTU(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        return `bltu ${IntRegNames[rs1]},${IntRegNames[rs2]},${imm}`;
    }
}

function BGEU(rs1, rs2, imm) {
    this.rs1 = rs1;
    this.rs2 = rs2;
    this.imm = imm;
    this.toString = function() {
        return `bgeu ${IntRegNames[rs1]},${IntRegNames[rs2]},${imm}`;
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
