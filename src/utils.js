import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  Account,
  utils,
} from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  window.near = near;
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Making Config Info Public
  window.configInfo = nearConfig;

  //making utils public
  window.utils = utils;

  // Creating new account object for NFT minting/unlockables
  window.account = new Account(near, window.accountId);
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
	  viewMethods: [ 
					'check_token',
					'nft_tokens_for_owner', 
                    "nft_token",
                    'nft_tokens',
					"nft_total_supply",
					'ft_metadata',
					'ft_balance_of',
                  ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["nft_mint", "nft_transfer", "nft_approve", "nft_auction_approve", 'ft_transfer_call',],
    }
    );
  // Initializing our market contract APIs by contract name and config 
    window.contractMarket = await new Contract(window.walletConnection.account(), nearConfig.marketContractName, {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: [
            'storage_balance_of',
            'storage_minimum_balance',
            'get_sales_by_contract_id',
            'get_auctions',
            'get_auctions_by_contract_id',
            'get_auction_contract_and_token_id',
        ],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ['storage_deposit', 'storate_deposit', "offer", "offer_auction", "claim_nft"],
    });
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export function parseTokenWithDecimals(amount, decimals) {
  let amountD = amount / Math.pow(10, decimals);
  return Math.floor(amountD * 100 / 100);
}

export function parseTokenAmount(amount, decimals) {
  return amount * Math.pow(10, decimals);
}