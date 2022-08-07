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
    const [price, setPrice] = useState('');
    const [token, setToken] = useState("NEAR");
    const [saleConditions, setSaleConditions] = useState({});
    const [minimum, setMinimum] = useState('');


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
        e.preventDefault();
        setToken(e.target.value);
    }
    function handlePriceChange(e) {
        let newSaleConditions = (e.target.value);
        setPrice(newSaleConditions);
        console.log(price);
        let sale_conditions = {sale_conditions: newSaleConditions };
        setSaleConditions(sale_conditions);
    }
	
    async function submitOnSale(token, newSaleConditions) {
        sendStorageDeposit();
        let sale_conditions = {
            sale_conditions: utils.format.parseNearAmount(price),
        };
        await window.contractNFT.nft_approve({
            token_id: currentToken.token_id,
            account_id: nearConfig.marketContractName,
            msg: JSON.stringify({ sale_conditions })
        },
            30000000000000, utils.format.parseNearAmount("0.01"));
        setSaleVisible(false);
    };

    const sendStorageDeposit = async () => {
        getMinimumStorage();
        await walletConnection.account().functionCall({
            contractId: window.contractMarket,
            methodName: "storage_deposit",
            args: {},
            attachedDeposit: minimum,
        })
    }

    const getMinimumStorage = async () => {
        let minimum_balance = await walletConnection
            .account()
            .viewFunction(nearConfig.marketContractName, "storage_minimum_balance")
        setMinimum(minimum_balance);
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
                    <Form style={{ marginBottom: 30 }} >
				<Form.Check 
				type="switch"
				id="near-switch"
				value="NEAR"
                label="NEAR"
                disabled
                onChange={handleTokenChange}
				/>
				<Form.Check 
				type="switch"
				id="stnear-switch"
				value="STNEAR"
                label="stNEAR"
                disabled
                onChange={handleTokenChange}
				/>
				<span style={{marginBottom: 10,  display: "block"}}>Input price ({token}):</span>
                        <input className="full-width" type="number" placeholder={"ex: 1000 ..."} onChange={handlePriceChange} size="large" /><br />
                        <Button variant="outline-primary" style={{ marginTop: "3vh" }} onClick={submitOnSale}>Sell this NFT for { price } NEAR</Button>
            </Form>
            </Modal.Body>
        </Modal>
	</>
    )
}

export default ModalSale