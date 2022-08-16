import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Alert, Col } from "react-bootstrap";
// near config
import getConfig from "./config";
const { nearConfig, networkId } = getConfig(process.env.NODE_ENV || "development");
import * as nearAPI from "near-api-js";

// parse near amount
const BN = require("bn.js");

// unlockable
import Collection from "./Collection";

const MintingTool = (props) => {
	
	//state for number parsing
	
	const {
		utils: {
			format: { parseNearAmount },
		},
	} = nearAPI;
  
	//states for minting form
	const [loading, update] = useState (false);
	const [title, setTitle] = useState('');
	const [NftId, setId] = useState('');
	const [description, setDescription] = useState('');
	const [media, setMedia] = useState('');
	const [extra, setExtra] = useState('');
	const [validMedia, setValidMedia] = useState('');
	const [royalties, setRoyalties] = useState({});
	const [royalty, setRoyalty] = useState([]);
	const [receiver, setReceiver] = useState([]);
	

//check account existence for royalties
	
	const isAccountTaken = async (accountId) => {
		const account = new nearAPI.Account(near.connection, accountId)
		try {
			await account.state();
			return true;
		} catch (e) {
			if (!/does not exist/.test(e.toString())) {
				throw e;
			}
		}
		return false;
	};
	
  const checkUnlock = async () => {
	  
	  	var token_id = `${props.user}-varda`+ NftId();
		return token_id;
  }

	
  const mintNFT = async () => {
		if (!media.length || !validMedia) {
			alert('Please enter a valid Image Link. You should see a preview below!');
			return;
		}
		if (!title.length) {
			alert('Please enter a valid Title for your NFT.');
			return;
		}
		if (!NftId.length) {
			alert('Please enter an unique ID for your NFT.');
			return;
		}
		if (!description.length) {
			alert('Please enter a Description for your NFT.');
			return;
		}
		if (!extra.length) {
			alert('Please enter a Collection name for your NFT.');
			return;
		}
		// shape royalties data for minting and check max is < 50%
		let perpetual_royalties = Object.entries(royalties).map(([receiver, royalty]) => ({
			[receiver]: royalty * 100
		})).reduce((acc, cur) => Object.assign(acc, cur), {});
		if (Object.values(perpetual_royalties).reduce((a, c) => a + c, 0) > 5000) {
			return alert('Cannot add more than 50% in perpetual NFT royalties when minting');
		}
	  
		update('loading', true);
		const metadata = { 
			title,
			description,
			media,
			extra,
			issued_at: Date.now(),
		};
		
	  await nearConfig.contractName.nft_mint(
      {
        token_id: `${props.user}-varda-`+ NftId,
        metadata,
        receiver_id: props.user,
		perpetual_royalties,
      },
       300000000000000, // attached GAS (optional)
       new BN("1000000000000000000000000")
    );
	
	update('loading', false);
	setMetadata('');
		
  };
   return (
      <Container style={{ marginTop: "2vh" }}>
        <Row className='d-flex justify-content-center'>
          {props.userNFTStatus ? (
			<Alert  variant='danger' style={{ marginTop: "2vh" }}>
			<p>
			If you are logged in and you don't see the minting form please apply as a creator for the Varda Marketplace! We currently accept requests for Galdrastafir and Ukrain related Art!
			</p>
			<Button style={{ marginTop: "3vh" }} variant="outline-primary"><a href="https://lauracamellini.typeform.com/to/EuDLb43R" title="Creator application form" target="_blank">Application Form</a></Button>
			</Alert>
          ) : (
			<>
		<Col>
							   <h4>{ props.user } Mint Your Art</h4>
		<input style={{ margin: "1vh" }} className="full-width" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
		<input style={{ margin: "1vh" }} className="full-width" placeholder="Unique ID, no spaces" value={NftId} onChange={(e) => setId(e.target.value)} /><br />
		<input style={{ margin: "1vh" }} className="full-width" type="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
		<input style={{ margin: "1vh" }} className="full-width" placeholder="Collection name" value={extra} onChange={(e) => setExtra(e.target.value)} />
		<input style={{ margin: "1vh" }}className="full-width" placeholder="Image Link" value={media} onChange={(e) => setMedia(e.target.value)} />
		<img src={media} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} />
		
		{ !validMedia && <p>Image link is invalid.</p> }
		<p>We strongly recommend using a free immutable storage service like <a href="https://nft.storage/" title="immutable storage" target="_blank">NFTstorage</a> or <a href="https://web3.storage/" title="immutable storage" target="_blank">web3.storage</a> for your images.</p>
		</Col>
		<Col>
		<h4>Royalties</h4>
		{
			Object.keys(royalties).length > 0 ? 
				Object.entries(royalties).map(([receiver, royalty]) => <div key={receiver}>
					{receiver} - {royalty} % <Button variant="outline-primary" onClick={() => {
						delete royalties[receiver];
						setRoyalties(Object.assign({}, royalties));
					}}>❌</Button>
				</div>)
				:
				<p>Max royalties 50%.</p>
		}
		<input style={{ margin: "1vh" }} className="full-width" placeholder="Account ID" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
		<input style={{ margin: "1vh" }} type="number" className="full-width" placeholder="Percentage" value={royalty} onChange={(e) => setRoyalty(e.target.value)} />
		<Button style={{ margin: "1vh" }} variant="outline-primary" onClick={async () => {
			const exists = await isAccountTaken(receiver);
			if (!exists) return alert(`Account: ${receiver} does not exist on ${networkId ==='default' ? 'testnet' : 'mainnet'}.`);
			setRoyalties(Object.assign({}, royalties, {
				[receiver]: royalty
			}));
		}}>Add Royalty</Button>
		{ NftId && <Collection token_id={`${props.user}-varda-`+ NftId} onAdd={props.onAdd}/> }
		</Col>
		<br />
		<Button variant="outline-primary" style={{ margin: "4vh" }} className="mintbutton" onClick={() => mintNFT()}>Mint</Button>
	</>
		  )}
        </Row>
      </Container>
  );
};

MintingTool.propTypes = {};

export default MintingTool;