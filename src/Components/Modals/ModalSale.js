import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from "react-bootstrap";
import {default as PublicKey, transactions, utils} from "near-api-js"
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import {login, parseTokenAmount} from "../../utils";
import BN from "bn.js";
import {baseDecode} from "borsh";
import getConfig from '../../config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')


function ModalSale(props) {
    const [saleVisible, setSaleVisible] = useState(false);
    const [currentToken, setCurrentToken] = useState(null);
    const [price, setPrice] = useState(0);
    const [token, setToken] = useState("NEAR");
    const [saleConditions, setSaleConditions] = useState([]);

    async function createSale(token_id, newSaleConditions) {
    await account.functionCall(contractId, 'nft_approve', {
        token_id,
        account_id: marketId,
        msg: JSON.stringify({ sale_conditions: newSaleConditions })
    }, GAS, parseNearAmount('0.01'));
}


	function  getGas(gas) {
        return gas ? new BN(gas) : new BN('100000000000000');
    }
    function getAmount(amount) {
        return amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');
    }

    function handleSaleToken(token) {
        setCurrentToken(props.nft.token_id);

        setSaleVisible(true);
    }

    function handleTokenChange(e) {
        setToken(e.target.value);
    }
	
	// create transaction
	
	async function createTransactionA({
        receiverId,
        actions,
        nonceOffset = 1,
    }) {
        const localKey = await this.connection.signer.getPublicKey(
            this.accountId,
            this.connection.networkId
        );
        let accessKey = await this.accessKeyForTransaction(
            receiverId,
            actions,
            localKey
        );
        if (!accessKey) {
            throw new Error(
                `Cannot find matching key for transaction sent to ${receiverId}`
            );
        }

        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = baseDecode(block.header.hash);

        const publicKey = PublicKey.from(accessKey.public_key);
        const nonce = accessKey.access_key.nonce + nonceOffset;

        return createTransaction(
            this.accountId,
            publicKey,
            receiverId,
            nonce,
            actions,
            blockHash
        );
    }

    async function executeMultiTransactions(transactions, callbackUrl) {
        const nearTransactions = await Promise.all(
            transactions.map((t, i) => {
                return createTransactionA({
                    receiverId: t.receiverId,
                    nonceOffset: i + 1,
                    actions: t.functionCalls.map((fc) =>
                        functionCall(
                            fc.methodName,
                            fc.args,
                            getGas(fc.gas),
                            getAmount(fc.amount)
                        )
                    ),
                });
            })
        );

        return window.walletConnection.requestSignTransactions(nearTransactions);
    }
	
	    async function submitOnSale (token, price) {
        try {
                console.log(token);
                let sale_conditions = token === "NEAR" ? 
                        {
                            is_native: true,
                            contract_id: "near",
                            decimals: "24",
                            amount: utils.format.parseNearAmount(price.toString())
                        } : {
                            is_native: false,
                            contract_id: window.contract.contractId,
                            decimals: "18",
                            amount: parseTokenAmount(price, 18).toLocaleString('fullwide', {useGrouping:false})
                        };

                // Check storage balance
                let storageAccount = await window.contract.storage_balance_of({
                    account_id: window.accountId
                });

                // Submit sale
                if (storageAccount > 0) {
                    console.log("StorageAmount: ", storageAccount, utils.format.parseNearAmount("0.1"), nearConfig.contractName);
                    await window.contract.nft_approve({
                        token_id: props.nft.token_id,
                        account_id: nearConfig.contractName,
                        msg: JSON.stringify({sale_conditions})
                    },
                    30000000000000, utils.format.parseNearAmount("0.01"));
                    setSaleVisible(false);
                } else {
                    alert('Not enough Storage Balance');
                }

        } catch (e) {
            console.log("Transfer error: ", e);
            setSaleVisible(false);
        } finally {
            setSaleVisible(false);
        }
    }

    async function handleRegisToken() {
        if (window.walletConnection.isSignedIn()) {
            await window.contract.storage_deposit(
                {
                    account_id: window.accountId,
                },
                30000000000000,
                utils.format.parseNearAmount("0.01")
            )
        } else {
            login();
        }
    }
	
	
    return (
	
	<>
	<Button variant="outline-primary" onClick={() => handleSaleToken(props.nft.token_id)} style={{ marginTop: "1vh" }}>
        Sell
    </Button>
        <Modal title="Sell NFT" show={saleVisible} onHide={() => setSaleVisible(false)}>
			<Modal.Header closeButton>
				<Modal.Title id="sale-modal">
				Select token ({token}):
				</Modal.Title>
			</Modal.Header>
                <Modal.Body>
            <Form style={{marginBottom: 30}} >
				<Form.Check 
				type="switch"
				id="near-switch"
				value="NEAR"
				label="NEAR"
                            onChange={handleTokenChange}
				/>
				<Form.Check 
				type="switch"
				id="stnear-switch"
				value="STNEAR"
				label="stNEAR"
                            onChange={handleTokenChange}
				/>
				<span style={{marginBottom: 10,  display: "block"}}>Input price ({token}):</span>
                <input type={"number"} className="full-width" name="price" onChange={(e) => setPrice(e.target.value)} placeholder={"ex: 1000 ..."} size="large" /><br />
                        <Button variant="outline-primary" style={{ marginTop: "3vh" }} onClick={submitOnSale}>Sell this NFT</Button>
            </Form>
            </Modal.Body>
        </Modal>
	</>
    )
}

export default ModalSale