"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = exports.FunctionCall = exports.BatchAction = exports.BatchTransaction = void 0;
const util_1 = require("./util");
//----------------------
//-- BatchTransaction --
//----------------------
// this classes exists to facilitate the creation of BatchTransactions
// a BatchTransaction is a series of actions *to be executed on a fixed receiver*
// by having this classes we can make typescript help with type-checking and code suggestions
//
class BatchTransaction {
    constructor(receiver) {
        this.receiver = receiver;
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
}
exports.BatchTransaction = BatchTransaction;
//generic batch-action
class BatchAction {
    constructor(action, attached = "0") {
        this.action = action;
        this.attached = attached;
    }
}
exports.BatchAction = BatchAction;
class FunctionCall extends BatchAction {
    constructor(method, args, gas, attached) {
        super("call", attached);
        this.method = method;
        this.args = args;
        this.gas = gas || util_1.DEFAULT_GAS;
    }
}
exports.FunctionCall = FunctionCall;
class Transfer extends BatchAction {
    constructor(attached) {
        super("transfer", attached);
    }
}
exports.Transfer = Transfer;
//TODO
//add create-account, delete-account, etc
