"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemVer = exports.DEFAULT_GAS = void 0;
exports.DEFAULT_GAS = "200" + "0".repeat(12);
//helper to check wallet version
class SemVer {
    constructor(major, minor, version) {
        this.major = major;
        this.minor = minor;
        this.version = version;
    }
    ;
    static fromNumber(num) {
        const str = num.toString().padStart(9, "0");
        return new SemVer(Number(str.slice(0, 3)), Number(str.slice(3, 3)), Number(str.slice(6, 3)));
    }
    toNumber() { return this.major * 1e6 + this.minor * 1e3 + this.version; }
    toString() { return `${this.major}.${this.minor}.${this.version}`; }
}
exports.SemVer = SemVer;
