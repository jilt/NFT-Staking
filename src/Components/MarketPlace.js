import React, { useEffect, useState } from 'react'
import {Button, Card, PageHeader, notification} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import { utils, transactions } from "near-api-js";
import {login, parseTokenWithDecimals} from "../utils";
import { functionCall } from 'near-api-js/lib/transaction';
import getConfig from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')


const MarketPlace = (props) => {

    const [data, setData] = useState([]);
    const [tokenList, setTokenList] = useState([]);

    async function handleBuy(item) {
        try {

        console.log(item);

            await window.contract.offer(
                {
                    nft_contract_id: item.nft_contract_id,
                    token_id: item.token_id
                },
                300000000000000,
                item.sale_conditions.amount
            )

               // Handle storage deposit
               let message = {
                   nft_contract_id: window.contract.contractId,
                   token_id: item.token_id
               }
               const result = await window.account.signAndSendTransaction({
                   receiverId: window.contractMarket.contractId,
                   actions: [
                       transactions.functionCall(
                           'storage_deposit', 
                           {account_id: item.owner_id},
                           10000000000000, 
                           utils.format.parseNearAmount("0.01")
                        ),
                       transactions.functionCall(
                           'ft_transfer_call', 
                           { receiver_id: window.contractMarket.contractId, amount: item.sale_conditions.amount, msg: JSON.stringify(message) },
                           250000000000000,
                           "1"
                        )
                   ]
               });

               console.log("Result: ", result);
           } catch (e) {
            console.log("Error: ", e);
        }
    }

 //   let nftTokens = await walletConnection
 //       .account()
 //       .viewFunction(nearConfig.contractName, "nft_tokens", {
 //           from_index: "0",
 //           limit: 64,
 //       });

 //   let sales = [];

    return (
        <div>
            <h1>MArketplace NFTs</h1>
        </div>
    )
}

export default MarketPlace;