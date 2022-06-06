import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Card, Container, Row, Alert, Col } from "react-bootstrap";
import { keys } from "regenerator-runtime";
const BN = require("bn.js");
import getConfig from "../config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");
import * as nearApi from 'near-api-js';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { useFilePicker } from "use-file-picker";
import Accordion from 'react-bootstrap/Accordion';

// import Unlockable from './Unlockable';

const MintingTool = (props) => {
	
	//states for minting form
	const [loading, update] = useState (false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [media, setMedia] = useState('');
	const [extra, setExtra] = useState('');
	const [validMedia, setValidMedia] = useState('');
	const [royalties, setRoyalties] = useState({});
	const [royalty, setRoyalty] = useState([]);
	const [receiver, setReceiver] = useState([]);
	const [files, setFiles] = useState(null);
	const [unlock, setUnlock] = useState('');
	const [link, setLink] = useState('');
	

//method to handle state form change when value is added
	const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEM3MjJiZjA0MDA2MkYwOGJjNThCNWZmMGI1MjVGNjk5NkYzOGI1NmIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQwODg3MzA1ODcsIm5hbWUiOiJNYXJrZXRwbGFjZS10ZXN0aW5nIn0.cR9NH6X2SLmr9B_3aW2cMyq3xvgtMAcuwOhdVEr1apE' });
	const handleChange = (event) => {
		
		setValues((values) => ({
			...values,
		[event.target.name]: event.target.value,
		}));
	};
	
//check account existence for royalties
	
	const isAccountTaken = async (accountId) => {
		const account = new nearApi.Account(near.connection, accountId)
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
	
	const [openFileSelector, { filesContent, errors, plainFiles, clear }] = useFilePicker({
     multiple: true,
     readAs: 'DataURL',
	 readFilesContent: false,
     });
	 if (errors.length) {
		return (
			<div>
				<button onClick={() => openFileSelector()}>Something went wrong, retry! </button>
			</div>
		);
	}
	
	const handleChangeFile = (e) => {
		const files = e.target.files;
		setFiles(files);
	}
  
  const mintNFT = async () => {
		if (!media.length || !validMedia) {
			alert('Please enter a valid Image Link. You should see a preview below!');
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
			media,
			extra,
			issued_at: Date.now(),
		};
		
		await window.contract.nft_mint(
      {
        token_id: `${window.accountId}-varda`+ Date.now(),
        metadata,
        receiver_id: window.accountId,
		perpetual_royalties,
      },
      300000000000000, // attached GAS (optional)
      new BN("1000000000000000000000000")
    );
	update('loading', false);
	setMetadata('');
	handleChangeFile();
	handleChangeImg();
  };

  return (
      <Container style={{ marginTop: "2vh" }}>
        <Row className='d-flex justify-content-center'>
        </Row>
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
		<h4>Mint Your Art</h4>
		<input style={{ margin: "1vh" }} className="full-width" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
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
		<Button variant="outline-primary" onClick={async () => {
			const exists = await isAccountTaken(receiver);
			if (!exists) return alert(`Account: ${receiver} does not exist on ${networkId ==='default' ? 'testnet' : 'mainnet'}.`);
			setRoyalties(Object.assign({}, royalties, {
				[receiver]: royalty
			}));
		}}>Add Royalty</Button>
		
		<h4 style={{ marginTop: "2vh" }}>Unlockable secret content</h4>
		
		<Accordion flush>
			<Accordion.Item eventKey="0">
				<Accordion.Header>File</Accordion.Header>
				<Accordion.Body>
					<p className="highlight">
						<Button variant="outline-primary">
							<label htmlFor="file-input" type="button" className="inputFile">
							Select file
							</label>
						</Button>
						<input id="file-input" type="file" placeholder="Select file" onChange={handleChangeFile} hidden={true} required={true}/>
						<br/>
						Number of selected files:
						{files?.length > 0 ? " " + files.length : " " + 0}
						{/* If readAs is set to DataURL, You can display an image */}
						{!!filesContent.length && <img src={filesContent[0].content} />}
						<br/>
						{plainFiles.map(file => (
						<div key={file.name}>{file.name}</div>
						))}
					</p>
					<Button variant="outline-primary" onClick={() => clear()}>Clear</Button>
					<Button variant="outline-primary" onClick={() => client.put(files).then(async (rootCid) => {
					setUnlock( rootCid );
					},
					).catch(console.error)}>
					Upload
					</Button>
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header>Link</Accordion.Header>
				<Accordion.Body>
					<input style={{ margin: "1vh" }}className="full-width" placeholder="Custom Unlockable Link" value={link} onChange={(e) => setLink(e.target.value)} />
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
		
		</Col>
		<Button variant="outline-primary" style={{ marginTop: "2vh" }} onClick={() => mintNFT()}>Mint</Button>
	</>
		  )}
        </Row>
      </Container>
  );
};

MintingTool.propTypes = {};

export default MintingTool;
