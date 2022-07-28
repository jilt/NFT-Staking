import React, { useEffect, useState} from 'react'
import getConfig from '../config'
import { Form, Button, Card, Container, Row, Alert, Col } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import ModalTransferNFT from "./Modals/ModalTransferNFT";
import ModalSale from "./Modals/ModalSale";
import ModalAuction from "./Modals/ModalAuction";
import {default as PublicKey, transactions, utils} from "near-api-js"
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import {login, parseTokenAmount} from "../utils";
import BN from "bn.js";
import {baseDecode} from "borsh";

const nearConfig = getConfig(process.env.NODE_ENV || 'development')



const Profile = (props) => {
	
	//states for marketplace funtions
	const [auctionVisible, setAuctionVisible] = useState(false);
	const [currentToken, setCurrentToken] = useState(null);

	
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
<Row md={3} xs={1}style={{ marginTop: "3vh" }}>
                    {
                        props.nfts.map((nft) => {
                            if (nft.metadata !== null) {
                                return (
								<Col className="card-w" key={nft.token_id}>
                                    <Card
                                        className="card inset"
                                    >
                                        <Card.Img variant="top" src={nft.metadata.media} />
                                        
                                        <Card.Body className="d-grid gap-2">
											<Card.Title>{nft.metadata.title}</Card.Title>
											<div>
												{props.dbUnlock.filter(lock => lock.id.match(new RegExp(nft.token_id, "i"))).length == 0 ? 
													<p>No unlockable file here</p> 
													: 
													<div>{props.dbUnlock.filter(lock => lock.id.match(new RegExp(nft.token_id, "i")))
													.map(lockable =>
													<>
                                                            {lockable.CID.length > 0 ? <Card.Link href={`https://${lockable.CID}.ipfs.dweb.link`} target="_blank" title="your locked content" alt="your locked content">Get unlockable</Card.Link>
                                                                : <Card.Link href={lockable.link} target="_blank" title="your locked content" alt="your locked content">Get unlockable</Card.Link>}
													</>
													)
													}
												</div>}
											</div>
                                                <Card.Text><b>{nft.metadata.extra}</b><br /><b>{nft.metadata.description}</b><br />
                                                    Royalties<br />
                                                    {
                                                        Object.keys(nft.royalty).length > 0 ?
                                                            Object.entries(nft.royalty).map(([receiver, amount]) => <div key={receiver}>
                                                                {receiver} - {amount / 100}%
                                                            </div>)
                                                            :
                                                            <p>This token has no royalties.</p>
                                                    }
                                            </Card.Text>
										<ModalTransferNFT nft={nft}/>
										<ModalSale nft={nft}/>
										<ModalAuction nft={nft}/>
										</Card.Body>
                                    </Card>
									</Col>
                                )
                            }


                        })
                    }
						</Row>
			)
}

export default Profile;