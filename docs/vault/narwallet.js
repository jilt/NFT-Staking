"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundRequest = exports.addOnDisconnectListener = exports.addOnConnectListener = exports.addGeneralListener = exports.addNarwalletsListeners = exports.narwallets = exports.Narwallet = void 0;
const batch_transaction_1 = require("./batch-transaction");
const util_1 = require("./util");
//-------------------------------
// WalletInterface implementation
// for Narwallet-chrome-extension
//-------------------------------
//-----------------------------
//-- SINGLETON WALLET class  --
//-----------------------------
class Narwallet {
    constructor() {
        this._isConnected = false;
        this._accountId = "";
        this._network = "mainnet"; //default required network. Users will be required to connect accounts from mainnet
        this._requiredVersion = new util_1.SemVer(2, 0, 0); //what wallet version this webapp requires (depends on the wallet-interface and be changed by the DApp)
        this.version = new util_1.SemVer(0, 0, 0); //chrome-extension wallet version, 0 until wallet connects
    }
    getAccountId() {
        return this._accountId;
    }
    async getAccountBalance(accountId) {
        const requestPayload = { dest: "ext", code: "get-account-balance", accountId: accountId || this._accountId };
        return backgroundRequest(requestPayload);
    }
    getNetwork() { return this._network; }
    setNetwork(value) { this._network = value; }
    setRequiredVersion(semver) { this._requiredVersion = semver; }
    // Note: Connection is started from the chrome-extension, so web pages don't get any info before the user decides to "connect"
    // Also pages don't need to create buttons/options to connect to different wallets, as long all wallets connect with Dapp-pages by using this API
    // potentially, a single DApp can be used to operate on multiple chains, since all requests are high-level and go thru the chrome-extension
    isConnected() { return this._isConnected; }
    disconnect() {
        //console.log("wallet.disconnect") 
        document.dispatchEvent(new CustomEvent("wallet-disconnected"));
        if (this._isConnected)
            window.postMessage({ dest: "ext", code: "disconnect" }, "*"); //inform the extension
        this._isConnected = false;
        this._accountId = "";
        this.version = new util_1.SemVer(0, 0, 0);
    }
    connectionHelp() {
        window.open("http://www.narwallets.com/help/connect-to-web-app");
    }
    /**
     * isConnected or throws "wallet not connected"
     */
    checkConnected() {
        if (!this._isConnected) {
            throw Error("Wallet is not connected. Open the wallet extension and click 'Connect to Web Page'");
        }
    }
    /**
     * Just a single contract "view" call
     */
    async view(contract, method, args) {
        //ask the extension to make the view-call
        const requestPayload = { dest: "ext", code: "view", contract: contract, method: method, args: args };
        return backgroundRequest(requestPayload);
    }
    /**
     * A single contract "payable" fn call
     */
    async call(contract, method, args, gas, attachedYoctos) {
        const bt = new batch_transaction_1.BatchTransaction(contract);
        bt.addItem(new batch_transaction_1.FunctionCall(method, args, gas, attachedYoctos));
        return this.apply(bt);
    }
    /**
     * ASYNC. sends a BatchTransaction to the blockchain
     */
    async apply(bt) {
        //ask the extension to broadcast the transaction
        //register request. Promise will be resolved when the response arrives
        const requestPayload = { dest: "ext", code: "apply", tx: bt };
        return backgroundRequest(requestPayload);
    }
    /**
     * ASYNC, low level generic access
     */
    async queryChain(method, args) {
        const requestPayload = { dest: "ext", code: "json-rpc", method: method, args: args };
        return backgroundRequest(requestPayload);
    }
}
exports.Narwallet = Narwallet;
//-----------------
// SINGLETON EXPORT
//-----------------
exports.narwallets = new Narwallet();
//----------------------------------------
//-- Init, add all listeners
//----------------------------------------
function addNarwalletsListeners(onConnect, OnDisconnect) {
    addGeneralListener();
    addOnConnectListener(onConnect);
    addOnDisconnectListener(OnDisconnect);
}
exports.addNarwalletsListeners = addNarwalletsListeners;
//----------------------------------------------------
//-- LISTEN to "message" from injected content script
//-- msg path is ext-> content-script-> here-> dispatchEvent("wallet-connected"|"wallet-disconnected"|"wallet-event")
//-- process by raising 'wallet-event'  
//----------------------------------------------------
function addGeneralListener() {
    window.addEventListener("message", function (event) {
        //console.log("wallet-ts message-listener",event.data.dest, event.data);
        if (event.source != window)
            return; //only internal messages (from the injected content script)
        if (event.data.dest != "page")
            return; //only messages destined to this web page (DApp) 
        msgReceivedFromContentScript(event.data);
    }, false);
}
exports.addGeneralListener = addGeneralListener;
//to add connect event listener
function addOnConnectListener(handler) {
    document.addEventListener("wallet-connected", handler);
}
exports.addOnConnectListener = addOnConnectListener;
//to add disconnect event listener
function addOnDisconnectListener(handler) {
    document.addEventListener("wallet-disconnected", handler);
}
exports.addOnDisconnectListener = addOnDisconnectListener;
//process message from ext/page
function msgReceivedFromContentScript(msg) {
    //console.log("msg ext->page: " + JSON.stringify(msg));
    //handle connect and disconnect
    if (msg.code == "connect") {
        //prepare response
        const walletNetwork = exports.narwallets.getNetwork();
        const response = { dest: "ext", code: "connected", relayer: "wallet-api", version: "0.1", network: walletNetwork, err: "" };
        //capture wallet version, default 1.0.2
        if (msg.data?.version) {
            exports.narwallets.version = util_1.SemVer.fromNumber(msg.data?.version);
        }
        else {
            exports.narwallets.version = new util_1.SemVer(1, 0, 2);
        }
        //check required version
        if (exports.narwallets.version.toNumber() < exports.narwallets._requiredVersion.toNumber()) {
            //respond back what network we require
            response.err = "The web page requires Narwallets v" + exports.narwallets._requiredVersion.toString();
            window.postMessage(response, "*");
            return;
        }
        if (walletNetwork && (!msg.data || msg.data.network != walletNetwork)) {
            //respond back what network we require
            response.err = "The web page requires a " + walletNetwork + " account";
            window.postMessage(response, "*");
            return;
        }
        //turn on connected flags
        exports.narwallets._isConnected = true;
        exports.narwallets._accountId = msg.data.accountId;
        //respond back so the the chrome-extension knows we're listening
        window.postMessage(response, "*");
    }
    else if (msg.code == "disconnect") {
        if (exports.narwallets.isConnected()) {
            exports.narwallets.disconnect(); //dispatches event, does it all
        }
        return;
    }
    else if (msg.code == "request-resolved") {
        //chrome-extension completed a request
        //find & resolve the request by requestId 
        processRequestResolved(msg);
    }
    //Also dispatchEvent to the DApp can react to extension-wallet events
    //like "wallet-connected"|"wallet-disconnected"
    let eventKey = eventFromCode(msg.code);
    const eventInfo = new CustomEvent(eventKey, { detail: {
            source: 'ext',
            code: msg.code,
            err: msg.err,
            data: msg.data,
        }
    });
    //console.log("document.dispatchEvent "+ eventInfo.type) 
    document.dispatchEvent(eventInfo);
}
function eventFromCode(code) {
    switch (code) {
        case "connect": return "wallet-connected";
        case "disconnect": return "wallet-disconnected";
        default: return 'wallet-event';
    }
}
//called when the resolved msg comes back
function processRequestResolved(msg) {
    let inx = requests.findIndex(req => req.requestId == msg.requestId);
    if (inx >= 0) {
        //remove it from the array
        let r = requests.splice(inx, 1)[0];
        //reject or resolve promise
        if (msg.err) {
            return r.reject(Error(msg.err));
        }
        else {
            return r.resolve(msg.data);
        }
    }
    else {
        console.error("requestId NOT FOUND ", msg);
    }
}
const requests = [];
let requestId = 0; //incremental request-id
//queue a request, send to the extension via window.postMessage, return a Promise
function backgroundRequest(requestPayload) {
    return new Promise((resolve, reject) => {
        const request = { requestId: ++requestId, payload: requestPayload, reject: reject, resolve: resolve };
        requests.push(request);
        requestPayload.requestId = requestId; //add requestId to payload
        if (!requestPayload.dest)
            requestPayload.dest = "ext";
        //broadcast (injected content script will process it and forward to the chrome-extension)
        window.postMessage(requestPayload, "*");
    });
}
exports.backgroundRequest = backgroundRequest;
