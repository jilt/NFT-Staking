import React, { useState } from "react";
import { Modal, Button, Container, Row, Form } from "react-bootstrap";

const initialValues = {
    assetBid: ""
};

function ModalBuy(props) {

    const [values, setValues] = useState(initialValues);

    // state for modals

    const [buyVisible, setBuyVisible] = useState(false);

    const buyClose = () => setBuyVisible(false);
    const buyShow = () => setBuyVisible(true);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    // function to buy NFT

    const OfferPrice = async (token_id) => {
        await props.walletConnection.account().functionCall({
            contractId: props.nearConfig.marketContractName,
            methodName: "offer",
            args: {
                nft_contract_id: props.nearConfig.contractName,
                token_id,
            },
            attachedDeposit: props.parseNearAmount(props.sale_conditions),
            gas: props.nearConfig.GAS,
        })
    }

    return (
        <><Button variant="outline-primary" onClick={buyShow} >Buy</Button>
            <Modal show={buyVisible} size="lg" onHide={buyClose}>
                <Modal.Header closeButton>Buy this NFT</ Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <form>
                                <div className="form-in-wrapper">
                                    <p>For {props.sale_conditions} NEAR or more</p>
                                    <div className="box-wrapper">
                                        <div className="box-in-wrapper">
                                            <div className="input-wrapper">
                                                <input
                                                    className="full-width"
                                                    placeholder={props.sale_conditions}
                                                    name="assetBid"
                                                    type="text"
                                                    value={values.assetBid}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-btn-wrapper">
                                        <Button variant="outline-primary" onClick={(e) => {
                                            e.preventDefault();
                                            OfferPrice(props.token_id);
                                        }} >Buy now</Button>
                                    </div>
                                </div>
                            </form>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={buyClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> 
        </>
    );
}

export default ModalBuy;