//-----------------------------
//-- SINGLETON WALLET class  --
//-----------------------------
export class Wallet {
    
    _isConnected: boolean =false;
    _accountId: string="";
    _network="mainnet"; //default required network. Users will be required to connect accounts from mainnet
    
    get accountId():string{
        return this._accountId;
    }

    get network(){ return this._network }
    set network(value:string){ this._network = value;}

    // Note: Connection is started from the chrome-extension, so web pages don't get any info before the user decides to "connect"
    // Also pages don't need to create buttons/options to connect to different wallets, as long all wallets connect with web pages by using this API
    // potentially, a single web app can be used to operate on multiple chains, since all requests are high-level and go thru the chrome-extension

    get isConnected() {return this._isConnected}
   
    disconnect(){
        console.log("wallet.disconnect") 
        document.dispatchEvent(new CustomEvent("wallet-disconnected"));
        if (this._isConnected) window.postMessage({dest:"ext",code:"disconnect"},"*"); //inform the extension
        this._isConnected = false;
        this._accountId = "";
        
    }

    connectionHelp(){
        window.open("http://www.narwallets.com/help/connect-to-web-app")
    }

    /**
     * isConnected or throws "wallet not connected"
     */
    checkConnected() {
        if (!this._isConnected) {
            throw Error("Wallet is not connected. Open the wallet extension and click 'Connect to Web Page'")
        }
    }

    /**
     * Just a single contract "view" call
     */
    async view (contract:string, method:string, args:Record<string,any>):Promise<any>{

        wallet.checkConnected()
        //ask the extension to make the view-call
        const requestPayload={dest:"ext", code:"view", contract:contract, method:method, args:args}
        return backgroundRequest(requestPayload);
    }

    /**
     * A single contract "payable" fn call
     */
    async call(contract:string, method:string, args:Record<string,any>, TGas:number, attachedNEAR:number=0):Promise<any>{
        const bt=new BatchTransaction(contract)
        bt.addItem(new FunctionCall(method,args,TGas,attachedNEAR))
        return this.apply(bt)
    }

    /**
     * ASYNC. Applies/broadcasts a BatchTransaction to the blockchain
     */
    async apply (bt:BatchTransaction):Promise<any>{

        wallet.checkConnected()
        
        //ask the extension to broadcast the transaction
        //register request. Promise will be resolved when the response arrives
        const requestPayload={dest:"ext", code:"apply", tx:bt}
        return backgroundRequest(requestPayload);
    }

    //to add event listeners
    onConnect(handler:EventHandler){
        document.addEventListener<any>("wallet-connected",handler)
    }
    onDisconnect(handler:EventHandler){
        document.addEventListener<any>("wallet-disconnected",handler)
    }
}
//-----------------
// SINGLETON EXPORT
//-----------------
export let wallet = new Wallet();