use crate::*;
use std::collections::HashMap;
use near_sdk::promise_result_as_success;

//GAS constants to attach to calls
const GAS_FOR_ROYALTIES: Gas = 115_000_000_000_000;
const GAS_FOR_NFT_TRANSFER: Gas = 15_000_000_000_000;

//constant used to attach 0 NEAR to a call
const NO_DEPOSIT: Balance = 0;

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Payout {
    pub payout: HashMap<AccountId, U128>,
} 

#[ext_contract(ext_nft_contract)]
pub trait NFTContract {
    fn nft_transfer_payout(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: u64,
        memo: String,
        balance: U128,
        max_len_payout: u32,
    ) -> Payout;
}

#[ext_contract(ext_self)]
pub trait MarketContract {
    fn resolve_auction_purchase(&mut self, buyer_id: AccountId, price: U128) -> Promise;
    fn ft_resolve_purchase(&mut self, buyer_id: AccountId, price: SalePrice) -> Promise;
}


#[near_bindgen]
impl Contract {

    #[payable]
    pub fn remove_auction(&mut self, nft_contract_id: AccountId, token_id: TokenId) {
        assert_one_yocto();

        // Xoá auction
        let auction = self.internal_remove_auction(nft_contract_id, token_id);
        
        assert_eq!(env::predecessor_account_id(), auction.owner_id, "Must be owner of auction");
    }

    // #[payable]
    // pub fn update_price(&mut self, nft_contract_id: AccountId, token_id: TokenId, price: SalePrice) {
    //     assert_one_yocto();

    //     let contract_and_token_id = format!("{}{}{}", nft_contract_id.clone(), ".", token_id.clone());

    //     let mut sale = self.sales.get(&contract_and_token_id).expect("Not found sale");
    //     assert_eq!(env::predecessor_account_id(), sale.owner_id, "Must be sale owner");
    //     sale.sale_conditions = price;

    //     self.sales.insert(&contract_and_token_id, &sale);
    // }
    

    // luu y: buyer_id chinh la nguoi ra gia dau gia
    #[payable]
    pub fn offer_auction(&mut self, nft_contract_id: AccountId, token_id: TokenId) {
        let deposit = env::attached_deposit();
        assert!(deposit > 0, "Attached deposit must be greater than 0");

        let contract_and_token_id = format!("{}{}{}", nft_contract_id.clone(), ".", token_id.clone());

        let mut auction = self.auctions.get(&contract_and_token_id).expect("Not found auction");

        let buyer_id = env::predecessor_account_id();
        assert_ne!(buyer_id, auction.owner_id, "Can not bid on your own auction");

        let price = auction.current_price.0;
        assert!(deposit > price, "Attached deposit must be greater than current price: {}", price);

        // Check auction conditions
        assert!(auction.auction_conditions.is_native, "Only accept payout with NEAR");

        assert_eq!(
            env::block_timestamp() / 1_000_000  > auction.auction_conditions.start_time.0 ,
            true,
            "This auction has not started"
        );

        assert_eq!(
            env::block_timestamp() / 1_000_000  < auction.auction_conditions.end_time.0 ,
            true,
            "This auction has already done"
        );

        // chuyen lai $ cho old winner
        if !(auction.winner == String::new()) {
           Promise::new(auction.winner).transfer(auction.current_price.0);
        }

        auction.winner = env::predecessor_account_id();
        auction.current_price = U128(deposit);
        self.auctions.insert(&contract_and_token_id, &auction);

        // self.process_purchase(
        //     nft_contract_id,
        //     token_id,
        //     U128(deposit),
        //     buyer_id
        // );
    }

    #[payable]
    pub fn claim_nft(&mut self, nft_contract_id: AccountId, token_id: TokenId) {
        let contract_and_token_id = format!{"{}{}{}", nft_contract_id.clone(), ".", token_id.clone()};

        let mut auction = self.auctions.get(&contract_and_token_id).expect("Not found auction");

        assert!(env::block_timestamp() / 1_000_000 > auction.auction_conditions.end_time.0, "The auction is not over yet");

        assert_eq!(
            env::predecessor_account_id(),
            auction.winner,
            "You are not the winner"
        );
        assert_eq!(
            auction.is_nft_claimed,
            false,
            "You has already claimed NFT"
        );

        // chuyen 10% $ cho chu aution
        self.process_auction_purchase(
            nft_contract_id.clone(),
            token_id.clone(),
            U128((u128::from(auction.current_price))/100*10),
            env::predecessor_account_id()
        );

        // chuyen 90% $ cho zoo' contract wallet
        Promise::new("zoo-wallet-auction.louiskate.testnet".to_owned()).transfer(auction.current_price.0/100*90);


        auction.is_nft_claimed = true;
        // Xoá auction
        //self.internal_remove_auction(nft_contract_id, token_id);
        
        //assert_eq!(env::predecessor_account_id(), auction.owner_id, "Must be owner of auction");
    }

    #[private]
    pub fn process_auction_purchase(&mut self, nft_contract_id: AccountId, token_id: TokenId, price: U128, buyer_id: AccountId) -> Promise {
        let auction = self.internal_remove_auction(nft_contract_id.clone(), token_id.clone());

        // Cross contract call
        ext_nft_contract::nft_transfer_payout(
            buyer_id.clone(), 
            token_id, 
            auction.approval_id, 
            "Payout from market contract".to_string(), 
            price, 
            10, 
            &nft_contract_id, 
            1, 
            GAS_FOR_NFT_TRANSFER
        ).then(ext_self::resolve_auction_purchase(
            buyer_id, 
            price, 
            &env::current_account_id(), 
            NO_DEPOSIT, 
            GAS_FOR_ROYALTIES
        ))
    }

    pub fn resolve_auction_purchase(&mut self, buyer_id: AccountId, price: U128) -> U128 {
        let payout_option = promise_result_as_success().and_then(| value | {
            let payout_object: Payout = near_sdk::serde_json::from_slice::<Payout>(&value).expect("Invalid payout object");

            if payout_object.payout.len() > 10 || payout_object.payout.is_empty() {
                env::log("Cannot have more than 10 royalities".as_bytes());
                None
            } else {
                let mut remainder = price.0;

                for &value in payout_object.payout.values() {
                    remainder = remainder.checked_sub(value.0)?;
                }

                if remainder == 0 || remainder == 1 {
                    Some(payout_object.payout)
                } else {
                    None
                }
            }
        });

        let payout = if let Some(payout_option) = payout_option {
            payout_option
        } else {
            Promise::new(buyer_id).transfer(u128::from(price));
            return price;
        };

        for (reciver_id, amount) in payout {
            Promise::new(reciver_id).transfer(u128::from(amount));
        }
        price
    }
}