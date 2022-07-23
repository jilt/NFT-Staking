import React, { useEffect, useState } from 'react'
import {Button, Card, PageHeader, notification} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import { utils, transactions } from "near-api-js";
import {login, parseTokenWithDecimals} from "../utils";
import { functionCall } from 'near-api-js/lib/transaction';
import getConfig from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')


function MarketPlace() {
    const [data, setData] = useState([]);
    const [tokenList, setTokenList] = useState([]);
    const [lvl, setLvl] = useState(null);
    const [totalTicket, setTotalTicket] =useState(0);
    const [fundRaised, setFundRaised] =useState(0);

    async function handleBuy(item) {
        console.log(item);
        try {
           if ( !window.walletConnection.isSignedIn() ) return login();

           if (item.sale_conditions.is_native) {
            let nearBalance = await window.account.getAccountBalance();
            if (nearBalance.available < parseInt(item.sale_conditions.amount)) {
                notification["warning"]({
                    message: 'Not enough NEAR',
                    description:
                      'Your account balance is not enough to buy this NFT!',
                  });

                  return;
            }

            await window.contract.offer(
                {
                    nft_contract_id: item.nft_contract_id,
                    token_id: item.token_id
                },
                300000000000000,
                item.sale_conditions.amount
            )
           } else {
               // Check balance
                let STNEARBalance = await window.contract.ft_balance_of({account_id: window.accountId})
                if (STNEARBalance < parseInt(item.sale_conditions.amount)) {
                    notification["warning"]({
                        message: 'Not enough stNEAR',
                        description:
                        'Your account balance is not enough to buy this NFT!',
                    });

                    return;
                }

               // Handle storage deposit
               let message = {
                   nft_contract_id: window.contract.contractId,
                   token_id: item.token_id
               }
               const result = await window.account.signAndSendTransaction({
                   receiverId: window.contract.contractId,
                   actions: [
                       transactions.functionCall(
                           'storage_deposit', 
                           {account_id: item.owner_id},
                           10000000000000, 
                           utils.format.parseNearAmount("0.01")
                        ),
                       transactions.functionCall(
                           'ft_transfer_call', 
                           { receiver_id: window.contract.contractId, amount: item.sale_conditions.amount, msg: JSON.stringify(message) },
                           250000000000000,
                           "1"
                        )
                   ]
               });

               console.log("Result: ", result);
           }

        } catch (e) {
            console.log("Error: ", e);
        }
    }

    useEffect(async () => {
        try {
            let data  = await window.contract.get_sales(
                {
                    from_index: "0",
                    limit: 10
                }
            );

            let mapItemData = data.map(async item => {
                let itemData =  await window.contract.nft_token({token_id: item.token_id});
                
                return {
                    ...item,
                    itemData
                }
            });
        
            let dataNew = await Promise.all(mapItemData);
            console.log("Data market: ", dataNew);
            setData(dataNew);
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(async () => {
        if (window.accountId) {
            // Get token list
            let tokenList = [];
            let nearBalance = await window.account.getAccountBalance();
            let UPDRABalance = await window.contract.ft_balance_of({account_id: window.accountId})

            tokenList.push({
                isNative: true,
                symbol: "NEAR",
                balance: nearBalance.available,
                decimals: 24,
                contractId: "near"
            });

            tokenList.push({
                isNative: false,
                symbol: "STNEAR",
                balance: STNEARBalance,
                decimals: 18,
                contractId: window.contract.contractId
            });

            setTokenList(tokenList);
        }
    }, []);

    return (
        <div>
            
            <div style={{ padding: 30, display: "flex" }}>
                {
                    data.map( nft => {
                        console.log("nft", nft);
                        return (
                            <Card
                                key={nft.token_id}
                                hoverable
                                style={{ width: 240, marginRight: 15 }}
                                cover={<img style={{height: 300, width: "100%", objectFit: "contain"}} alt="Media NFT" src={nft.itemData.metadata.media} />}
                                actions={[
                                    <Button onClick={() => handleBuy(nft)} icon={<ShoppingCartOutlined />}> Buy </Button>
                                ]}
                            >
                                <div style={{ fontSize: '20px' }}> <CrownFilled /> Planted Tree </div>
                                        
                                <Card>Rare: {stars[nft.itemData.metadata.quality-1]} </Card>

                                <h1>
                                    Sale Price: {nft.sale_conditions.is_native ? 
                                    utils.format.formatNearAmount(nft.sale_conditions.amount) + " Ⓝ":
                                    parseTokenWithDecimals(nft.sale_conditions.amount, nft.sale_conditions.decimals) + " UPDRA"
                                    }
                                </h1>
                                <h6>{"ID: " + nft.token_id}  description={nft.owner_id} </h6>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MarketPlace;