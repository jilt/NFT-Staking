import React, { useState } from "react";
import { Modal, Button, Container, Row, Form } from "react-bootstrap";

const initialValues = {
    assetPrice: "",
    assetToken: ""
};

function ModalSale(props) {

    const [values, setValues] = useState(initialValues);

    // state for modals

    const [sellVisible, setSellVisible] = useState(false);

    const sellClose = () => setSellVisible(false);
    const sellShow = () => setSellVisible(true);

    const sendStorageDeposit = async () => {

        await props.walletConnection.account().functionCall({
            contractId: props.nearConfig.marketContractName,
            methodName: "storage_deposit",
            args: {},

            attachedDeposit: '10000000000000000000000',
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const approveNFTForSale = async (token_id) => {
        let sale_conditions = {
            sale_conditions: values.assetPrice,
        };
        await props.walletConnection.account().functionCall({
            contractId: props.nearConfig.contractName,
            methodName: "nft_approve",
            args: {
                token_id: props.token_id,
                account_id: props.nearConfig.marketContractName,
                msg: JSON.stringify(sale_conditions),
            },
            attachedDeposit: props.parseNearAmount("0.01"),
        });
    };


    return (
        <><Button variant="outline-primary" onClick={sellShow} >Sell</Button>
            <Modal show={sellVisible} size="lg" onHide={sellClose}>
                <Modal.Header closeButton>Sell</ Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <form>
                                <div className="form-in-wrapper">
                                    <p><small>Please pay storage before putting your NFT on sale</small></p>
                                    <Button variant="outline-primary" onClick={() => sendStorageDeposit()} >Deposit Storage</Button>
                                    <br />
                                    <div className="box-wrapper">
                                        <div className="box-in-wrapper">
                                            <div className="input-wrapper">
                                                <Form.Check
                                                    type="switch"
                                                    disabled
                                                    id="stNEAR"
                                                    label="Use Liquid Staking Tokens"
                                                    name="assetToken"
                                                    value={values.assetToken}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-wrapper">
                                        <div className="box-in-wrapper">
                                            <div className="input-wrapper">
                                                <input
                                                    className="full-width"
                                                    placeholder="Add sale price"
                                                    name="assetPrice"
                                                    type="text"
                                                    value={values.assetPrice}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-btn-wrapper">
                                        <Button variant="outline-primary" onClick={(e) => {
                                            e.preventDefault();
                                            approveNFTForSale(props.token_id);
                                        }} >Sell now</Button>
                                    </div>
                                </div>
                            </form>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={sellClose}>
                        Close 
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        );
}

export default ModalSale;
