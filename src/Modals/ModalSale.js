import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from "react-bootstrap";
import { default as PublicKey, transactions, utils } from "near-api-js"
import getConfig from '../config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')


function ModalSale(props) {
    const [saleVisible, setSaleVisible] = useState(false);
    const [currentToken, setCurrentToken] = useState(null);
    const [price, setPrice] = useState('');
    const [token, setToken] = useState("NEAR");
    const [saleConditions, setSaleConditions] = useState({});
    const [minimum, setMinimum] = useState('');


    function handleSaleToken(token) {
        setCurrentToken(props.nft.token_id);

        setSaleVisible(true);
    }


    async function handlePriceChange(e) {
        e.preventDefault();
        let newSaleConditions = (e.target.value);
        setPrice(newSaleConditions);
        console.log(price);
        let sale_conditions = { sale_conditions: newSaleConditions };
        setSaleConditions(sale_conditions);
    }

    async function submitOnSale(token, newSaleConditions) {
        sendStorageDeposit();
        let sale_conditions = {
            sale_conditions: utils.format.parseNearAmount(price),
        };
        await walletConnection.account().functionCall({
            contractId: nearConfig.contractName,
            methodName: "nft_approve",
            args: {
                token_id: currentToken.token_id,
                account_id: nearConfig.marketContractName,
                msg: JSON.stringify(sale_conditions),
            },
            attachedDeposit: parseNearAmount("0.01"),
        });
         // setSaleVisible(false);
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
                        Sell this NFT
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form style={{ marginBottom: 30 }} >
                        <input className="full-width" type="text" placeholder={"add sale price"} onChange={handlePriceChange} size="large" /><br />
                        <Button variant="outline-primary" style={{ marginTop: "3vh" }} onClick={submitOnSale}>Sell this NFT</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalSale