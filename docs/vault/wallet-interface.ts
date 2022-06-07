import {BatchTransaction, FunctionCall, Transfer} from "./batch-transaction"
import {U64String,U128String} from "./util"

export type EventHandler = (this:Document,ev:any)=>any;

//-----------------------
//-- WALLET Interface  --
//-----------------------
export interface WalletInterface {
    
    getAccountId():string;
    
    getAccountBalance(accountId?:string):Promise<U128String>;

    getNetwork():string;
    setNetwork(value:string):void;

    isConnected():boolean;
   
    disconnect():void;

    /**
     * isConnected or throws "wallet not connected"
     */
    checkConnected():void;

    /**
     * Just a single contract "view" call
     */
    view (contract:string, method:string, args:Record<string,any>):Promise<any>;

    /**
     * A single contract "payable" fn call
     */
    call(contract:string, method:string, args:Record<string,any>, gas?:U64String, attachedYoctos?:U128String):Promise<any>;

    /**
     * ASYNC. sends a BatchTransaction to the blockchain
     */
    apply (bt:BatchTransaction):Promise<any>;

    /**
     * ASYNC, low level generic access
     */
    queryChain(method: string, args: object): Promise<any>;
}
