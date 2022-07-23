import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Form, Button, Card } from "react-bootstrap";

function ModalAuction(props) {
    const [startPrice, setStartPrice] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [token, setToken] = useState("NEAR");
			
	//states for marketplace funtions
	const [auctionVisible, setAuctionVisible] = useState(false);
	const [currentToken, setCurrentToken] = useState(null);

    function handleOk() {
        props.handleOk(token, startPrice, Date.parse(startTime) , Date.parse(endTime) );
        console.log(token, startPrice, Date.parse(startTime) , Date.parse(endTime) )
    }

    function handleTokenChange(e) {
        setToken(e.target.value);
    }


    function handleAuctionToken(token) {
        setCurrentToken(token);

        setAuctionVisible(true);
    }



    async function submitOnAuction(token, startPrice, startTime, endTime) {
        try {
            if (startPrice && currentToken.token_id) {

                let auction_conditions = token === "NEAR" ? 
                        {
                            is_native: true,
                            contract_id: "near",
                            decimals: "24",
                            start_price: utils.format.parseNearAmount(startPrice.toString()),
                            start_time: startTime.toString(),
                            end_time: endTime.toString(),
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

                // Submit auction
                if (storageAccount > 0) {
                    console.log("Data: ", storageAccount, utils.format.parseNearAmount("0.1"), nearConfig.contractName);
                    await window.contractNFT.nft_auction_approve({
                        token_id: currentToken.token_id,
                        account_id: nearConfig.contractName,
                        msg: JSON.stringify({auction_conditions})
                    },
                    30000000000000, utils.format.parseNearAmount("0.01"));
                    setAuctionVisible(false);
                } else {
                    notification["warning"]({
                        message: 'Not enough Storage Balance',
                        description:
                          'Your Storage Balance is not enough to sell on a new NFT. Please refill!',
                      });
                }
            }

        } catch (e) {
            console.log("Transfer error: ", e);
            setTransferVisible(false);
        } finally {
            setTransferVisible(false);
        }
    }

	
	    async function handleDeposit() {
        if (window.walletConnection.isSignedIn()) {
            await window.contract.storage_deposit(
                {
                    account_id: window.accountId,
                },
                30000000000000,
                utils.format.parseNearAmount("1")
            )
        } else {
            login();
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
	<Button variant="outline-primary" onClick={() => handleAuctionToken(props.nft.token_id)} style={{ marginTop: "1vh" }}>
        Auction
    </Button>
        <Modal title="Auction NFT" show={auctionVisible} onHide={() => setAuctionVisible(false) }>
            <Form style={{marginBottom: 30}} value={token}>
                <Modal.Header closeButton>
					<Modal.Title id="auction-modal">
						Select token ({token}):
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
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
				<span style={{marginBottom: "1vh",  display: "block"}}>Input Start Price ({token}):</span>
                <input className="full-width" type={"number"} onChange={(e) => setStartPrice(e.target.value)} placeholder={"ex: 1000 ..."} size="large" />
				<div>
					<div class="form-group">
					<label for="start-time">Start Time</label><br />
						<input className="full-width" style={{ marginTop: "1vh", marginBottom: "1vh" }} type="datetime-local" onChange={(e) => setStartTime(e.target.value)} id="start-time" placeholder="Start Time" />
						{console.log(Date.parse(startTime) / 1000)}
					</div>
					<div class="form-group">
						<label for="end-time">End Time</label><br />
						<input className="full-width" style={{ marginTop: "1vh", marginBottom: "1vh"}} type="datetime-local" onChange={(e) => setEndTime(e.target.value)} id="end-time" placeholder="End Time"/>
					</div>
				</div>
				<Button variant="outline-primary" style={{ marginTop: "3vh" }} onClick={() => submitOnAuction(props.nft.token_id, startPrice, startTime, endTime)}>
					Start Auction
				</Button>
				</Modal.Body>
            </Form>
        </Modal>
		</>
    )
}

export default ModalAuction