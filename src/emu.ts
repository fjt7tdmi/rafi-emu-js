import * as fs from 'fs';
import * as int from './int';
//
// Utility
//
const IntRegNames = [
    "zero", "ra", "sp", "gp", "tp", "t0", "t1", "t2",
    "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5",
    "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7",
    "s8", "s9", "s10","s11", "t3", "t4","t5", "t6",
];

function getCsrName(index) {
    switch (index) {
        case 0x000: return "ustatus";
        case 0x001: return "fflags";
        case 0x002: return "frm";
        case 0x003: return "fcsr";
        case 0x004: return "uie";
        case 0x005: return "utvec";
        case 0x040: return "uscratch";
        case 0x041: return "uepc";
        case 0x042: return "ucause";
        case 0x043: return "utval";
        case 0x044: return "uip";

        case 0x100: return "sstatus";
        case 0x102: return "sedeleg";
        case 0x103: return "sideleg";
        case 0x104: return "sie";
        case 0x105: return "stvec";
        case 0x106: return "scounteren";
        case 0x140: return "sscratch";
        case 0x141: return "sepc";
        case 0x142: return "scause";
        case 0x143: return "stval";
        case 0x144: return "sip";
        case 0x180: return "satp";

        case 0x300: return "mstatus";
        case 0x301: return "misa";
        case 0x302: return "medeleg";
        case 0x303: return "mideleg";
        case 0x304: return "mie";
        case 0x305: return "mtvec";
        case 0x306: return "mcounteren";
        case 0x320: return "mhpmevent0";
        case 0x321: return "mhpmevent1";
        case 0x322: return "mhpmevent2";
        case 0x323: return "mhpmevent3";
        case 0x324: return "mhpmevent4";
        case 0x325: return "mhpmevent5";
        case 0x326: return "mhpmevent6";
        case 0x327: return "mhpmevent7";
        case 0x328: return "mhpmevent8";
        case 0x329: return "mhpmevent9";
        case 0x32a: return "mhpmevent10";
        case 0x32b: return "mhpmevent11";
        case 0x32c: return "mhpmevent12";
        case 0x32d: return "mhpmevent13";
        case 0x32e: return "mhpmevent14";
        case 0x32f: return "mhpmevent15";
        case 0x330: return "mhpmevent16";
        case 0x331: return "mhpmevent17";
        case 0x332: return "mhpmevent18";
        case 0x333: return "mhpmevent19";
        case 0x334: return "mhpmevent20";
        case 0x335: return "mhpmevent21";
        case 0x336: return "mhpmevent22";
        case 0x337: return "mhpmevent23";
        case 0x338: return "mhpmevent24";
        case 0x339: return "mhpmevent25";
        case 0x33a: return "mhpmevent26";
        case 0x33b: return "mhpmevent27";
        case 0x33c: return "mhpmevent28";
        case 0x33d: return "mhpmevent29";
        case 0x33e: return "mhpmevent30";
        case 0x33f: return "mhpmevent31";
        case 0x340: return "mscratch";
        case 0x341: return "mepc";
        case 0x342: return "mcause";
        case 0x343: return "mtval";
        case 0x344: return "mip";
        case 0x3a0: return "pmpcfg0";
        case 0x3a1: return "pmpcfg1";
        case 0x3a2: return "pmpcfg2";
        case 0x3a3: return "pmpcfg3";
        case 0x3b0: return "pmpaddr0";
        case 0x3b1: return "pmpaddr1";
        case 0x3b2: return "pmpaddr2";
        case 0x3b3: return "pmpaddr3";
        case 0x3b4: return "pmpaddr4";
        case 0x3b5: return "pmpaddr5";
        case 0x3b6: return "pmpaddr6";
        case 0x3b7: return "pmpaddr7";
        case 0x3b8: return "pmpaddr8";
        case 0x3b9: return "pmpaddr9";
        case 0x3ba: return "pmpaddr10";
        case 0x3bb: return "pmpaddr11";
        case 0x3bc: return "pmpaddr12";
        case 0x3bd: return "pmpaddr13";
        case 0x3be: return "pmpaddr14";
        case 0x3bf: return "pmpaddr15";

        case 0x7a0: return "tselect";
        case 0x7a1: return "tdata1";
        case 0x7a2: return "tdata2";
        case 0x7a3: return "tdata3";
        case 0x7b0: return "dcsr";
        case 0x7b1: return "dpc";
        case 0x7b2: return "dscratch";

        case 0xb00: return "mcycle";
        case 0xb01: return "mtime";
        case 0xb02: return "minstret";
        case 0xb03: return "mhpmcounter3";
        case 0xb04: return "mhpmcounter4";
        case 0xb05: return "mhpmcounter5";
        case 0xb06: return "mhpmcounter6";
        case 0xb07: return "mhpmcounter7";
        case 0xb08: return "mhpmcounter8";
        case 0xb09: return "mhpmcounter9";
        case 0xb0a: return "mhpmcounter10";
        case 0xb0b: return "mhpmcounter11";
        case 0xb0c: return "mhpmcounter12";
        case 0xb0d: return "mhpmcounter13";
        case 0xb0e: return "mhpmcounter14";
        case 0xb0f: return "mhpmcounter15";
        case 0xb10: return "mhpmcounter16";
        case 0xb11: return "mhpmcounter17";
        case 0xb12: return "mhpmcounter18";
        case 0xb13: return "mhpmcounter19";
        case 0xb14: return "mhpmcounter20";
        case 0xb15: return "mhpmcounter21";
        case 0xb16: return "mhpmcounter22";
        case 0xb17: return "mhpmcounter23";
        case 0xb18: return "mhpmcounter24";
        case 0xb19: return "mhpmcounter25";
        case 0xb1a: return "mhpmcounter26";
        case 0xb1b: return "mhpmcounter27";
        case 0xb1c: return "mhpmcounter28";
        case 0xb1d: return "mhpmcounter29";
        case 0xb1e: return "mhpmcounter30";
        case 0xb1f: return "mhpmcounter31";
        case 0xb80: return "mcycleh";
        case 0xb81: return "mtimeh";
        case 0xb82: return "minstreth";
        case 0xb83: return "mhpmcounter3h";
        case 0xb84: return "mhpmcounter4h";
        case 0xb85: return "mhpmcounter5h";
        case 0xb86: return "mhpmcounter6h";
        case 0xb87: return "mhpmcounter7h";
        case 0xb88: return "mhpmcounter8h";
        case 0xb89: return "mhpmcounter9h";
        case 0xb8a: return "mhpmcounter10h";
        case 0xb8b: return "mhpmcounter11h";
        case 0xb8c: return "mhpmcounter12h";
        case 0xb8d: return "mhpmcounter13h";
        case 0xb8e: return "mhpmcounter14h";
        case 0xb8f: return "mhpmcounter15h";
        case 0xb90: return "mhpmcounter16h";
        case 0xb91: return "mhpmcounter17h";
        case 0xb92: return "mhpmcounter18h";
        case 0xb93: return "mhpmcounter19h";
        case 0xb94: return "mhpmcounter20h";
        case 0xb95: return "mhpmcounter21h";
        case 0xb96: return "mhpmcounter22h";
        case 0xb97: return "mhpmcounter23h";
        case 0xb98: return "mhpmcounter24h";
        case 0xb99: return "mhpmcounter25h";
        case 0xb9a: return "mhpmcounter26h";
        case 0xb9b: return "mhpmcounter27h";
        case 0xb9c: return "mhpmcounter28h";
        case 0xb9d: return "mhpmcounter29h";
        case 0xb9e: return "mhpmcounter30h";
        case 0xb9f: return "mhpmcounter31h";

        case 0xc00: return "cycle";
        case 0xc01: return "time";
        case 0xc02: return "instret";
        case 0xc03: return "hpmcounter3";
        case 0xc04: return "hpmcounter4";
        case 0xc05: return "hpmcounter5";
        case 0xc06: return "hpmcounter6";
        case 0xc07: return "hpmcounter7";
        case 0xc08: return "hpmcounter8";
        case 0xc09: return "hpmcounter9";
        case 0xc0a: return "hpmcounter10";
        case 0xc0b: return "hpmcounter11";
        case 0xc0c: return "hpmcounter12";
        case 0xc0d: return "hpmcounter13";
        case 0xc0e: return "hpmcounter14";
        case 0xc0f: return "hpmcounter15";
        case 0xc10: return "hpmcounter16";
        case 0xc11: return "hpmcounter17";
        case 0xc12: return "hpmcounter18";
        case 0xc13: return "hpmcounter19";
        case 0xc14: return "hpmcounter20";
        case 0xc15: return "hpmcounter21";
        case 0xc16: return "hpmcounter22";
        case 0xc17: return "hpmcounter23";
        case 0xc18: return "hpmcounter24";
        case 0xc19: return "hpmcounter25";
        case 0xc1a: return "hpmcounter26";
        case 0xc1b: return "hpmcounter27";
        case 0xc1c: return "hpmcounter28";
        case 0xc1d: return "hpmcounter29";
        case 0xc1e: return "hpmcounter30";
        case 0xc1f: return "hpmcounter31";
        case 0xc80: return "cycleh";
        case 0xc81: return "timeh";
        case 0xc82: return "instreth";
        case 0xc83: return "hpmcounter3h";
        case 0xc84: return "hpmcounter4h";
        case 0xc85: return "hpmcounter5h";
        case 0xc86: return "hpmcounter6h";
        case 0xc87: return "hpmcounter7h";
        case 0xc88: return "hpmcounter8h";
        case 0xc89: return "hpmcounter9h";
        case 0xc8a: return "hpmcounter10h";
        case 0xc8b: return "hpmcounter11h";
        case 0xc8c: return "hpmcounter12h";
        case 0xc8d: return "hpmcounter13h";
        case 0xc8e: return "hpmcounter14h";
        case 0xc8f: return "hpmcounter15h";
        case 0xc90: return "hpmcounter16h";
        case 0xc91: return "hpmcounter17h";
        case 0xc92: return "hpmcounter18h";
        case 0xc93: return "hpmcounter19h";
        case 0xc94: return "hpmcounter20h";
        case 0xc95: return "hpmcounter21h";
        case 0xc96: return "hpmcounter22h";
        case 0xc97: return "hpmcounter23h";
        case 0xc98: return "hpmcounter24h";
        case 0xc99: return "hpmcounter25h";
        case 0xc9a: return "hpmcounter26h";
        case 0xc9b: return "hpmcounter27h";
        case 0xc9c: return "hpmcounter28h";
        case 0xc9d: return "hpmcounter29h";
        case 0xc9e: return "hpmcounter30h";
        case 0xc9f: return "hpmcounter31h";

        case 0xf11: return "mvendorid";
        case 0xf12: return "marchid";
        case 0xf13: return "mimpid";
        case 0xf14: return "mhartid";

        default: return "UNKNOWN_CSR";
    }
}

function pick(insn, lsb, width = 1) {
    return (insn >> lsb) & ((1 << width) - 1);
}

function signExtend(width, value) {
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

//
// Core
//
class Core {
    public pc: int.Integer
    public nextPc: int.Integer
    public intRegs: int.Integer[]
    public csr: int.Integer[]

    constructor() {
        this.intRegs = new Array(32);
        this.csr = new Array(0x1000);
    }
}

//
// Op
//
interface OpInterface {
    execute(core: Core): void;
    toString(): string;
}

class UNKNOWN_OP implements OpInterface {
    execute(core: Core){}
    toString() {
        return "UNKNOWN_OP";
    }
}

class LUI implements OpInterface {
    private rd: number;
    private imm: number;
    constructor(rd: number, imm: number) {
        this.rd = rd;
        this.imm = imm;
    }
    execute(core: Core){
        core.intRegs[this.rd] = new int.Integer(this.imm);
    }
    toString() {
        return `lui ${IntRegNames[this.rd]},${this.imm}`;
    }
}

class AUIPC implements OpInterface {
    private rd: number;
    private imm: number;

    constructor(rd: number, imm: number) {
        this.rd = rd;
        this.imm = imm;
    }
    execute(core: Core){
        core.intRegs[this.rd] = int.add(core.pc, new int.Integer(this.imm));
    }
    toString() {
        return `auipc ${IntRegNames[this.rd]},${this.imm}`;
    }
}

class JAL implements OpInterface {
    private rd: number;
    private imm: number;

    constructor(rd: number, imm: number) {
        this.rd = rd;
        this.imm = imm;        
    }
    execute(core: Core){
        core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        core.intRegs[this.rd] = core.nextPc;
    }
    toString() {
        if (this.rd == 0) {
            return `j #${this.imm}`;
        } else {
            return `jal ${IntRegNames[this.rd]},${this.imm}`;
        }
    }
}

class JALR implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        core.nextPc = int.add(core.intRegs[this.rs1], new int.Integer(this.imm));
        core.intRegs[this.rd] = core.nextPc;
    }
    toString() {
        if (this.rd == 0) {
            return `jr ${IntRegNames[this.rs1]},${this.imm}`;
        } else {
            return `jalr ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
        }
    };
}

class BEQ implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (int.equal(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
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

class BNE implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (!int.equal(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
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

class BLT implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (int.signedLessThan(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
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

class BGE implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (int.signedGreaterEqual(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
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

class BLTU implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (int.unsignedLessThan(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
    }
    toString() {
        return `bltu ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},${this.imm}`;
    }
}

class BGEU implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        if (int.unsignedGreaterEqual(src1, src2)) {
            core.nextPc = int.add(core.pc, new int.Integer(this.imm));
        }
    }
    toString() {
        return `bgeu ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]},${this.imm}`;
    }
}

class LB implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `lb ${IntRegNames[this.rd]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class LH implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `lh ${IntRegNames[this.rd]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class LW implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `lw ${IntRegNames[this.rd]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class LBU implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `lbu ${IntRegNames[this.rd]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class LHU implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `lhu ${IntRegNames[this.rd]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class SB implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `sb ${IntRegNames[this.rs2]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class SH implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `sh ${IntRegNames[this.rs2]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class SW implements OpInterface {
    private rs1: number;
    private rs2: number;
    private imm: number;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `sw ${IntRegNames[this.rs2]},${this.imm}(${IntRegNames[this.rs1]})`;
    }
}

class ADDI implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        core.intRegs[this.rd] = int.add(core.intRegs[this.rs1], new int.Integer(this.imm));
    }
    toString() {
        return `addi ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class SLTI implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const imm = new int.Integer(this.imm);

        core.intRegs[this.rd] = int.signedLessThan(src1, imm)
            ? new int.Integer(1)
            : new int.Integer(0);        
    }
    toString() {
        return `slti ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class SLTIU implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const imm = new int.Integer(this.imm);

        core.intRegs[this.rd] = int.unsignedLessThan(src1, imm)
            ? new int.Integer(1)
            : new int.Integer(0);        
    }
    toString() {
        return `sltiu ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class XORI implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const imm = new int.Integer(this.imm);

        core.intRegs[this.rd] = int.xor(src1, imm);
    }
    toString() {
        return `xori ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class ORI implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const imm = new int.Integer(this.imm);

        core.intRegs[this.rd] = int.or(src1, imm);
    }
    toString() {
        return `ori ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class ANDI implements OpInterface {
    private rd: number;
    private rs1: number;
    private imm: number;

    constructor(rd: number, rs1: number, imm: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.imm = imm;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const imm = new int.Integer(this.imm);

        core.intRegs[this.rd] = int.and(src1, imm);
    }
    toString() {
        return `andi ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.imm}`;
    }
}

class SLLI implements OpInterface {
    private rd: number;
    private rs1: number;
    private shamt: number;
    
    constructor(rd: number, rs1: number, shamt: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.shamt = shamt;
    }
    execute(core: Core){}
    toString() {
        return `slli ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.shamt}`;
    }
}

class SRLI implements OpInterface {
    private rd: number;
    private rs1: number;
    private shamt: number;

    constructor(rd: number, rs1: number, shamt: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.shamt = shamt;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const shamt = new int.Integer(this.shamt);

        core.intRegs[this.rd] = int.unsignedRightShift(src1, shamt);
    }
    toString() {
        return `srli ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.shamt}`;
    }
}

class SRAI implements OpInterface {
    private rd: number;
    private rs1: number;
    private shamt: number;

    constructor(rd: number, rs1: number, shamt: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.shamt = shamt;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const shamt = new int.Integer(this.shamt);

        core.intRegs[this.rd] = int.signedRightShift(src1, shamt);
    }
    toString() {
        return `srai ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${this.shamt}`;
    }
}

class ADD implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.and(src1, src2);
    }
    toString() {
        return `add ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SUB implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.sub(src1, src2);
    }
    toString() {
        return `add ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SLL implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.leftShift(src1, src2);
    }
    toString() {
        return `sll ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SLT implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.unsignedLessThan(src1, src2)
            ? new int.Integer(1)
            : new int.Integer(0);
    }
    toString() {
        return `slt ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SLTU {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.signedLessThan(src1, src2)
            ? new int.Integer(1)
            : new int.Integer(0);
    }
    toString() {
        return `sltu ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class XOR implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.xor(src1, src2);
    }
    toString() {
        return `xor ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SRL implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.unsignedRightShift(src1, src2);
    }
    toString() {
        return `srl ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class SRA implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.signedRightShift(src1, src2);
    }
    toString() {
        return `sra ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class OR implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.or(src1, src2);
    }
    toString() {
        return `or ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class AND implements OpInterface {
    private rd: number;
    private rs1: number;
    private rs2: number;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }
    execute(core: Core){
        const src1 = core.intRegs[this.rs1];
        const src2 = core.intRegs[this.rs2];

        core.intRegs[this.rd] = int.and(src1, src2);
    }
    toString() {
        return `and ${IntRegNames[this.rd]},${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class FENCE implements OpInterface {
    private fm: number;
    private pred: number;
    private succ: number;
    
    constructor(fm: number, pred: number, succ: number) {
        this.fm = fm;
        this.pred = pred;
        this.succ = succ;
    }
    execute(core: Core){}
    toString() {
        return `fence`;
    }
}

class FENCE_I implements OpInterface {
    private imm: number;

    constructor(imm: number) {
        this.imm = imm;
    }
    execute(core: Core){}
    toString() {
        return `fence.i`;
    }
}

class ECALL implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `ecall`;
    }
}

class EBREAK implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `ebreak`;
    }
}

class CSRRW implements OpInterface {
    private csr: number;
    private rd: number;
    private rs1: number;

    constructor(csr: number, rd: number, rs1: number) {
        this.csr = csr;
        this.rd = rd;
        this.rs1 = rs1;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const src1 = core.intRegs[this.rs1];

        core.csr[this.csr] = src1;
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rd == 0) {
            return `csrw ${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        } else {
            return `csrrw ${IntRegNames[this.rd]},${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        }
    }
}

class CSRRS implements OpInterface {
    private csr: number;
    private rd: number;
    private rs1: number;

    constructor(csr: number, rd: number, rs1: number) {
        this.csr = csr;
        this.rd = rd;
        this.rs1 = rs1;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const src1 = core.intRegs[this.rs1];

        core.csr[this.csr] = int.or(srcCsr, src1);
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rs1 == 0) {
            return `csrr ${IntRegNames[this.rd]},${getCsrName(this.csr)}`;
        } else if (this.rd == 0) {
            return `csrr ${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        } else {
            return `csrrs ${IntRegNames[this.rd]},${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        }
    }
}

class CSRRC implements OpInterface {
    private csr: number;
    private rd: number;
    private rs1: number;

    constructor(csr: number, rd: number, rs1: number) {
        this.csr = csr;
        this.rd = rd;
        this.rs1 = rs1;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const src1 = core.intRegs[this.rs1];

        core.csr[this.csr] = int.and(int.not(srcCsr), src1);
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rs1 == 0) {
            return `csrc ${IntRegNames[this.rd]},${getCsrName(this.csr)}`;
        } else if (this.rd == 0) {
            return `csrc ${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        } else {
            return `csrrc ${IntRegNames[this.rd]},${getCsrName(this.csr)},${IntRegNames[this.rs1]}`;
        }
    }
}

class CSRRWI implements OpInterface {
    private csr: number;
    private rd: number;
    private uimm: number;

    constructor(csr: number, rd: number, uimm: number) {
        this.csr = csr;
        this.rd = rd;
        this.uimm = uimm;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const uimm = new int.Integer(this.uimm);

        core.csr[this.csr] = uimm;
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rd == 0) {
            return `csrwi ${getCsrName(this.csr)},${this.uimm}`;
        } else {
            return `csrrwi ${IntRegNames[this.rd]},${getCsrName(this.csr)},${this.uimm}`;
        }
    }
}

class CSRRSI implements OpInterface {
    private csr: number;
    private rd: number;
    private uimm: number;

    constructor(csr: number, rd: number, uimm: number) {
        this.csr = csr;
        this.rd = rd;
        this.uimm = uimm;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const uimm = new int.Integer(this.uimm);

        core.csr[this.csr] = int.or(srcCsr, uimm);
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rd == 0) {
            return `csrsi ${getCsrName(this.csr)},${this.uimm}`;
        } else {
            return `csrrsi ${IntRegNames[this.rd]},${getCsrName(this.csr)},${this.uimm}`;
        }
    }
}

class CSRRCI implements OpInterface {
    private csr: number;
    private rd: number;
    private uimm: number;

    constructor(csr: number, rd: number, uimm: number) {
        this.csr = csr;
        this.rd = rd;
        this.uimm = uimm;
    }
    execute(core: Core){
        const srcCsr = core.csr[this.csr];
        const uimm = new int.Integer(this.uimm);

        core.csr[this.csr] = int.and(int.not(srcCsr), uimm);
        core.intRegs[this.rd] = srcCsr;
    }
    toString() {
        if (this.rd == 0) {
            return `csrci ${getCsrName(this.csr)},${this.uimm}`;
        } else {
            return `csrrci ${IntRegNames[this.rd]},${getCsrName(this.csr)},${this.uimm}`;
        }
    }
}

class URET implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `uret`;
    }
}

class SRET implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `sret`;
    }
}

class MRET implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `mret`;
    }
}

class WFI implements OpInterface {
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `wfi`;
    }
}

class SFENCE_VMA implements OpInterface {
    private rs1: number;
    private rs2: number;

    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `sfence.vma ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class HFENCE_BVMA implements OpInterface {
    private rs1: number;
    private rs2: number;

    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `hfence.bvma ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

class HFENCE_GVMA implements OpInterface {
    private rs1: number;
    private rs2: number;
    
    execute(core: Core){
        throw new Error("Not implemented.");
    }
    toString() {
        return `hfence.gvma ${IntRegNames[this.rs1]},${IntRegNames[this.rs2]}`;
    }
}

//
// Decode
//
function decode(insn) {
    const opcode = insn & 0x7f;
    const rd = (insn >> 7) & 0x1f;
    const funct3 = (insn >> 12) & 0x7;
    const rs1 = (insn >> 15) & 0x1f;
    const rs2 = (insn >> 20) & 0x1f;
    const shamt = (insn >> 20) & 0x1f;
    const funct7 = (insn >> 25) & 0x7f;
    const funct12 = (insn >> 20) & 0xfff;
    const csr = (insn >> 20) & 0xfff;
    const uimm = (insn >> 15) & 0x1f;

    const imm_jal = signExtend(21,
        pick(insn, 31) << 20 |
        pick(insn, 21, 10) << 1 |
        pick(insn, 20) << 11 |
        pick(insn, 12, 8) << 12);
    const imm_branch = signExtend(13,
        pick(insn, 31) << 12 |
        pick(insn, 7) << 11 |
        pick(insn, 25, 6) << 5 |
        pick(insn, 8, 4) << 1);
    const imm_store = signExtend(12,
        pick(insn, 25, 7) << 5 |
        pick(insn, 7, 5));
    switch (opcode) {
    case 0b0110111:
        return new LUI(rd, insn & 0xfffff000);
    case 0b0010111:
        return new AUIPC(rd, insn & 0xfffff000);
    case 0b1101111:
        return new JAL(rd, imm_jal);
    case 0b1100111:
        if (funct3 == 0b000) {
            return new JALR(rd, rs1, signExtend(12, pick(insn, 20, 12)));    
        } else {
            return new UNKNOWN_OP();
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
            return new UNKNOWN_OP();
        }
    case 0b0000011:
        if (funct3 == 0b000) {
            return new LB(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b001) {
            return new LH(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b010) {
            return new LW(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b100) {
            return new LBU(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b101) {
            return new LHU(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else {
            return new UNKNOWN_OP();
        }
    case 0b0100011:
        if (funct3 == 0b000) {
            return new SB(rs1, rs2, imm_store);
        } else if (funct3 == 0b001) {
            return new SH(rs1, rs2, imm_store);
        } else if (funct3 == 0b010) {
            return new SW(rs1, rs2, imm_store);
        } else {
            return new UNKNOWN_OP();
        }
    case 0b0010011:
        if (funct3 == 0b000) {
            return new ADDI(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b001 && funct7 == 0b0000000) {
            return new SLLI(rd, rs1, shamt);
        } else if (funct3 == 0b010) {
            return new SLTI(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b011) {
            return new SLTIU(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b100) {
            return new XORI(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b101 && funct7 == 0b0000000) {
            return new SRLI(rd, rs1, shamt);
        } else if (funct3 == 0b101 && funct7 == 0b0100000) {
            return new SRAI(rd, rs1, shamt);
        } else if (funct3 == 0b110) {
            return new ORI(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else if (funct3 == 0b111) {
            return new ANDI(rd, rs1, signExtend(12, pick(insn, 20, 12)));
        } else {
            return new UNKNOWN_OP();
        }
    case 0b0110011:
        if (funct3 == 0b000 && funct7 == 0b0000000) {
            return new ADD(rd, rs1, rs2);
        } else if (funct3 == 0b000 && funct7 == 0b0100000) {
            return new SUB(rd, rs1, rs2);
        } else if (funct3 == 0b001 && funct7 == 0b0000000) {
            return new SLL(rd, rs1, rs2);
        } else if (funct3 == 0b010 && funct7 == 0b0000000) {
            return new SLT(rd, rs1, rs2);
        } else if (funct3 == 0b011 && funct7 == 0b0000000) {
            return new SLTU(rd, rs1, rs2);
        } else if (funct3 == 0b100 && funct7 == 0b0000000) {
            return new XOR(rd, rs1, rs2);
        } else if (funct3 == 0b101 && funct7 == 0b0000000) {
            return new SRL(rd, rs1, rs2);
        } else if (funct3 == 0b101 && funct7 == 0b0100000) {
            return new SRA(rd, rs1, rs2);
        } else if (funct3 == 0b110 && funct7 == 0b0000000) {
            return new OR(rd, rs1, rs2);
        } else if (funct3 == 0b111 && funct7 == 0b0000000) {
            return new AND(rd, rs1, rs2);
        } else {
            return new UNKNOWN_OP();
        }
    case 0b0001111:
        if (funct3 == 0b000) {
            return new FENCE(pick(insn, 28, 4), pick(insn, 24, 4), pick(insn, 20, 4));
        } else if (funct3 == 0b001) {
            return new FENCE_I(pick(insn, 20, 12));
        } else {
            return new UNKNOWN_OP();
        }
    case 0b1110011:
        if (funct3 == 0b000 && funct12 == 0b0000_0000_0000 && rs1 == 0 && rd == 0) {
            return new ECALL();
        } else if (funct3 == 0b000 &&funct12 == 0b0000_0000_0001 && rs1 == 0 &&  rd == 0) {
            return new EBREAK();
        } else if (funct3 == 0b000 && funct7 == 0b0000000 && rs2 == 0b00010 && rs1 == 0 && rd == 0) {
            return new URET();
        } else if (funct3 == 0b000 && funct7 == 0b0001000 && rs2 == 0b00010 && rs1 == 0 && rd == 0) {
            return new SRET();
        } else if (funct3 == 0b000 && funct7 == 0b0011000 && rs2 == 0b00010 && rs1 == 0 && rd == 0) {
            return new MRET();
        } else if (funct3 == 0b000 && funct7 == 0b0001000 && rs2 == 0b00101 && rs1 == 0 && rd == 0) {
            return new WFI();
        } else if (funct3 == 0b000 && funct7 == 0b0001001 && rd == 0) {
            return new SFENCE_VMA();
        } else if (funct3 == 0b000 && funct7 == 0b0010001 && rd == 0) {
            return new HFENCE_BVMA();
        } else if (funct3 == 0b000 && funct7 == 0b1010001 && rd == 0) {
            return new HFENCE_GVMA();
        } else if (funct3 == 0b001) {
            return new CSRRW(csr, rd, rs1);
        } else if (funct3 == 0b010) {
            return new CSRRS(csr, rd, rs1);
        } else if (funct3 == 0b011) {
            return new CSRRC(csr, rd, rs1);
        } else if (funct3 == 0b101) {
            return new CSRRWI(csr, rd, uimm);
        } else if (funct3 == 0b110) {
            return new CSRRSI(csr, rd, uimm);
        } else if (funct3 == 0b111) {
            return new CSRRCI(csr, rd, uimm);
        } else {
            return new UNKNOWN_OP();
        }
    default:
        return new UNKNOWN_OP();
    }
}

//
// Emulator
//
let buffer = fs.readFileSync("rafi-prebuilt-binary/riscv-tests/isa/rv32ui-p-add.bin");
let core = new Core();

for (var offset = 0; offset < 0x400; offset += 4)
{
    // Fetch (read binary file)
    const insn = buffer.readUInt32LE(offset);
    // console.log(insn.toString(16));

    // Decode
    const op = decode(insn);
    console.log(op.toString());
}
