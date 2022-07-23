import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Form, Button, Card } from "react-bootstrap";

function ModalTransferNFT(props) {
	const [transferVisible, setTransferVisible] = useState(false);
    const [accountId, setAccountId] = useState("");
	const [currentToken, setCurrentToken] = useState(null);


   
  function handleTransferToken(token) {
        setCurrentToken(token);

        setTransferVisible(true);
    }
	
    function handleOk() {
        props.handleOk(accountId);
    }


    async function submitTransfer(accountId, tokenId) {
        try {
            if (accountId && props.nft.token_id) {
                await window.contract.nft_transfer(
                    {
                        receiver_id: accountId,
                        token_id: props.nft.token_id,
                        approval_id: 0,
                        memo: "Transfer to " + accountId
                    },
                    30000000000000,
                    1
                );
                setTransferVisible(false);
            }
        } catch (e) {
            console.log("Transfer error: ", e);
            setTransferVisible(false);
        } finally {
            setTransferVisible(false);
        }
    }
	
    return (
	<>
	<Button variant="outline-primary" onClick={() => handleTransferToken(props.nft.token_id)}>
        Transfer
      </Button>
	  
	  <Modal title="Transfer NFT" show={transferVisible} onHide={() => setTransferVisible(false) } >
		<Modal.Header closeButton>
          <Modal.Title id="transfer-modal">
            Transfer your NFT to:
          </Modal.Title>
        </Modal.Header>
		<Modal.Body>
          <input className="full-width" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder={"ex: nearhack.near ..."} />
			<Button variant="outline-primary" style={{ marginTop: "3vh" }} onClick={() => submitTransfer(accountId, props.nft.token_id)}>
			Transfer
			</Button>
        </Modal.Body>
      </Modal>
	</>
    )
}

export default ModalTransferNFT