import React, { useEffect, useState} from 'react'
import getConfig from '../config'
import { Card, Row, Col } from "react-bootstrap";
import ModalTransferNFT from "./Modals/ModalTransferNFT";
import ModalSale from "./Modals/ModalSale";

const nearConfig = getConfig(process.env.NODE_ENV || 'development')



const Profile = (props) => {


	
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
                                                <Card.Text><b>{nft.metadata.extra}</b><br />{nft.metadata.description}<br />
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
                                        
                                                {
                                                    nft.approved_account_ids[nearConfig.marketContractName] >= 0 ? Object.entries(nft.approved_account_ids).map(([contract, id]) => <div key={id}><p>On sale on: {contract}</p></div>) : <><ModalTransferNFT nft={nft} />
                                                <ModalSale nft={nft} /></>
                                                }

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