use crate::*;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonAuction {
    pub owner_id: AccountId,
    pub token_id: TokenId,
    pub auction_conditions: AuctionPrice,
    pub current_price: U128,
    pub winner: AccountId,
    pub is_near_claimed: bool,
    pub is_nft_claimed: bool,
    pub time_stamp_now: U64
}

#[near_bindgen]
impl Contract {
    // Lấy tổng số auction trên market
    pub fn get_supply_auctions(&self) -> U128 {
        U128(self.auctions.len() as u128)
    }

    // Lấy tổng số auction theo owner_id
    pub fn get_supply_auctions_by_owner_id(&self, account_id: AccountId) -> U128 {
        let auctions_by_owner = self.auctions_by_owner.get(&account_id);
        if let Some(auctions_by_owner) = auctions_by_owner {
            U128(auctions_by_owner.len() as u128)
        } else {
            U128(0)
        }
    }

    // Lấy tổng số auction theo contract_id
    pub fn get_suppy_auctions_by_contract_id(&self, contract_id: NFTContractId) -> U128 {
        let tokens_by_contract_id = self.auction_by_contract_id.get(&contract_id);
        if let Some(tokens_by_contract_id) = tokens_by_contract_id {
            U128(tokens_by_contract_id.len() as u128)
        } else {
            U128(0)
        }
    }

    pub fn get_auctions(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<Auction> {
        let start = u128::from(from_index.unwrap_or(U128(0)));

         self.auctions.values()
         .skip(start as usize)
         .take(limit.unwrap_or(0) as usize)
         .collect()
    }

    pub fn get_auctions_by_owner_id(&self, account_id: AccountId, from_index: Option<U128>, limit: Option<u64>) -> Vec<Auction> {
        let by_owner_id = self.auctions_by_owner.get(&account_id);
        let contract_token_ids = if let Some(by_owner_id) = by_owner_id {
            by_owner_id
        } else {
            return vec![];
        };
        let start = u128::from(from_index.unwrap_or(U128(0)));

        contract_token_ids.as_vector()
        .iter()
        .skip(start as usize)
        .take(limit.unwrap_or(0) as usize)
        .map( | contract_token_id | self.auctions.get(&contract_token_id).unwrap() )
        .collect()
    }

    pub fn get_auctions_by_contract_id(&self, contract_id: NFTContractId, from_index: Option<U128>, limit: Option<u64>) -> Vec<Auction> {
        let tokens_by_contract_id = self.auction_by_contract_id.get(&contract_id);

        let token_ids = if let Some(tokens_by_contract_id) = tokens_by_contract_id {
            tokens_by_contract_id
        } else {
            return vec![];
        };

        let start = u128::from(from_index.unwrap_or(U128(0)));
        token_ids.iter()
        .skip(start as usize)
        .take(limit.unwrap_or(0) as usize)
        .map(|token_id| self.auctions.get(&format!("{}{}{}", contract_id, ".", token_id)).unwrap())
        .collect()
    }

    pub fn get_auction_contract_and_token_id(&self, nft_contract_id: NFTContractId, token_id: TokenId) -> Option<JsonAuction> {

        let contract_and_token_id = format!{"{}{}{}", nft_contract_id.clone(), ".", token_id.clone()};

        let auction = self.auctions.get(&contract_and_token_id);

        if let Some(auction) = auction {
            Some(JsonAuction {
                owner_id: auction.owner_id,
                token_id,
                auction_conditions: auction.auction_conditions,
                current_price: auction.current_price,
                winner: auction.winner,
                is_near_claimed: auction.is_near_claimed,
                is_nft_claimed: auction.is_nft_claimed,
                time_stamp_now: U64(env::block_timestamp() / 1_000_000)
           })
        } else {
            None
        }

    }
}