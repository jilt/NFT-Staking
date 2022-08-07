use crate::*;

#[near_bindgen]
impl Contract {
    pub(crate) fn internal_remove_sale(&mut self, nft_contract_id: AccountId, token_id: TokenId) -> Sale {
        let contract_and_token_id = format!("{}{}{}", nft_contract_id, ".", token_id);

        let sale = self.sales.remove(&contract_and_token_id).expect("Not found sale");

        let mut by_owner_id = self.by_owner_id.get(&sale.owner_id).expect("Not found sale by owner_id");
        by_owner_id.remove(&contract_and_token_id);
    
        if by_owner_id.is_empty() {
            self.by_owner_id.remove(&sale.owner_id);
        } else {
            self.by_owner_id.insert(&sale.owner_id, &by_owner_id);
        }

        let mut by_contract_id = self.by_contract_id.get(&nft_contract_id).expect("Not found sale by contract_id");
        by_contract_id.remove(&token_id);
        if by_contract_id.is_empty() {
            self.by_contract_id.remove(&nft_contract_id);
        } else {
            self.by_contract_id.insert(&nft_contract_id, &by_contract_id);
        }

        sale
    }


    pub(crate) fn internal_remove_auction(&mut self, nft_contract_id: AccountId, token_id: TokenId) -> Auction {
        let contract_and_token_id = format!("{}{}{}", nft_contract_id, ".", token_id);

        let auction = self.auctions.remove(&contract_and_token_id).expect("Not found auction");

        let mut by_owner_id = self.auctions_by_owner.get(&auction.owner_id).expect("Not found auction by owner_id");
        by_owner_id.remove(&contract_and_token_id);
    
        if by_owner_id.is_empty() {
            self.auctions_by_owner.remove(&auction.owner_id);
        } else {
            self.auctions_by_owner.insert(&auction.owner_id, &by_owner_id);
        }

        let mut by_contract_id = self.auction_by_contract_id.get(&nft_contract_id).expect("Not found auction by contract_id");
        by_contract_id.remove(&token_id);
        if by_contract_id.is_empty() {
            self.auction_by_contract_id.remove(&nft_contract_id);
        } else {
            self.auction_by_contract_id.insert(&nft_contract_id, &by_contract_id);
        }

        auction
    }
}