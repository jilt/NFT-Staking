export const DEFAULT_GAS="200"+"0".repeat(12);

export type U64String = string;
export type U128String = string;


//helper to check wallet version
export class SemVer {
    
    constructor (public major:number, public minor:number, public version:number){};

    static fromNumber(num:number):SemVer{ 
        const str=num.toString().padStart(9,"0");
        return new SemVer(Number(str.slice(0,3)), Number(str.slice(3,3)), Number(str.slice(6,3)))
    }

    toNumber():number{return this.major*1e6 + this.minor*1e3 + this.version}

    toString(){return `${this.major}.${this.minor}.${this.version}`}
}
