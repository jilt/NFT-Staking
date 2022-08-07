import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import { login, logout } from "./utils";

// React and custom Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom-styles.css";

// React Bootstraps imports
import { Nav, Navbar, Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';


// Custom Components
import MintingTool from "./Components/MintingTool";
import Collection from "./Components/Collection";
import Profile from "./Components/Profile";
import MarketPlace from "./Components/MarketPlace";


// assets
import Logo from "./assets/logo-white.svg";

// near config
import getConfig from "./config";
const { nearConfig } = getConfig(process.env.NODE_ENV || "development");
import * as nearApi from 'near-api-js';

		
export default function App() {
// state for minting allowance

const [userHasNFT, setuserHasNFT] = useState(false);

// state to get storage data
  
const[stfetchUrl, setUploads] = useState ([])

// state to get storage db
  
const[straw, setDb] = useState([])
const[dbUnlock, setdbUnlock] = useState([])

//state to get NFT gallery
const [totalNFTs, setTotalNFTs] = useState([]);
const [nfts, setNFTs] = useState([]);
const [marketdata, setMarketData] = useState([]);


  useEffect(() => {
    const allowList = async () => {
	  const listAllow = ['jilt.testnet', 'khbuilder.testnet', 'helpme.testnet'];
	  {listAllow.filter( allowed => {
          if (allowed === window.accountId ) {
            setuserHasNFT(true)
          }
		    setuserHasNFT(false)
        }
	  )
	  }
    };
    allowList();
	
	listDbUploads();
	
   }, []);
   
  useEffect(async () => {
        if (window.accountId) {
            let data  = await window.contract.nft_tokens_for_owner({"account_id": window.accountId, "from_index": "0", "limit": 100});
            setNFTs(data);
        }
  }, []);

	useEffect(() => {

		const getSales = async () => {
		let sales = await walletConnection
			.account()
			.viewFunction(
				nearConfig.marketContractName,
				"get_sales_by_nft_contract_id",
				{
					nft_contract_id: nearConfig.marketContractName,
					from_index: "0",
					limit: 64,
				}
			);
			console.log(sales);
		};

		getSales();

	}, []);

	
	// get list of minted NFTs

useEffect(async () => {
    let totalNFTs  = await window.contract.nft_total_supply();
    setTotalNFTs(totalNFTs);
}, []);



  
  //set vault's web3.storage API token
  
const relay = 'https://Varda-vault-relay-server.jilt1.repl.co/locked/'


 // add unlockable
 
	const addUnlock = async (lockable) => {
		const res = await fetch(relay, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body:JSON.stringify(lockable)
		})
		
		const data = res.json()
		
		setDb([...straw, data])
		
		const blob = new Blob([JSON.stringify(straw)], {type : 'application/json'})
	
		const files = [
		new File( [blob], 'db.json')
		]

	
	}

// get storage files for unlockables
  

		const listDbUploads = async () => {
			const fetchUploads = await fetch(relay)
			const data = await fetchUploads.json()
			const stdatastr = JSON.stringify(data)
			const straw = JSON.parse(stdatastr)
			setDb(straw)
			console.log(straw)
			return straw
			

		}

// get unlockable to owned NFT

function getUnlock(){
	const dbUnlock = straw
	setdbUnlock(dbUnlock)
}



  return (
  
    <React.Fragment>
      {" "}
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>
            <img
              alt=''
              src={Logo}
              width='35'
              height='35'
              className='d-inline-block align-top'
            />{" "}
            Varda NFT Art
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav>
              <Nav.Link
                onClick={window.walletConnection.isSignedIn() ? logout : login}
              >
                {window.walletConnection.isSignedIn()
                  ? window.accountId
                  : "Login"}
              </Nav.Link>{" "}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: "3vh" }}>
        {" "}
        <Row xs={1} md={4} className="g-4">
		  <Col className="card-w">
		  <Card className="card inset">
			<Card.Img variant="top" src="./panda.jpg" />
			<Card.Body>
				<Card.Title>Wild Pinups</Card.Title>
				<Card.Text>
					This collection was Created by Jilt and Valeriia Derrick and 50% forever royalties will support the wild animals of an Ukranian Zoo.
				</Card.Text>
				<Collection cfa="Check it Out" collection="Wild Pinups"/>
			</Card.Body>
			</Card>
			</Col>
			<Col className="card-w">
				<Card className="card inset">
			<Card.Img variant="top" src="./aegishjalmur-new.jpg" />
			<Card.Body>
				<Card.Title>Galdrastafir</Card.Title>
				<Card.Text>
					The collection of each galdrastafur created by <a href="https://discord.gg/FvuY84TyTt" title="Varda Discord Server" target="_blank">our community</a> on the <a href="https://galdrastafir.varda.vision" title="html5 p2e game for Varda" target="_blank">Varda game</a>, our tools against fear.
				</Card.Text>
				<Button variant="outline-primary" disabled>Coming soon!</Button>
			</Card.Body>
			</Card>
			</Col>
			<Col className="card-w">
		  <Card className="card inset">
			<Card.Img variant="top" src="./genesis.jpg" />
			<Card.Body>
				<Card.Title>Genesis Collection</Card.Title>
				<Card.Text>
					Varda Genesis collection, the art that supported our project, soon our collectors will be able to sell Varda genesis for stNEAR and stake on NEAR protocol!.
				</Card.Text>
				<Button variant="outline-primary"><a href="https://paras.id/collection/varda-by-jiltnear" target="_blank" title="genesis NFT collection on Paras">Check it out!</a></Button>
			</Card.Body>
			</Card>
		  </Col>
		  <Col className="card-w">
		  <Card className="card inset">
			<Card.Img variant="top" src="./github-preview.jpg" />
			<Card.Body>
				<Card.Title>ElvenLand</Card.Title>
				<Card.Text>
					A collection of voxelart by <a href="https://twitter.com/TritzChristophe" title="artist twitter" target="_blank">Christophe Tritz</a> unlocking ElvenLand plots and so much more funny features for the NEAR community!.
				</Card.Text>
				<Button variant="outline-primary" disabled>Coming this summer!</Button>
			</Card.Body>
			</Card>
			</Col>
        </Row>
		<Row style={{ marginTop: "3vh" }}>
			<Accordion flush defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>On Sale</Accordion.Header>
					<Accordion.Body>
						<MarketPlace/>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header onClick={() => getUnlock()}>Your NFTs</Accordion.Header>
					<Accordion.Body>
						<h5>You can put your NFTs on sale here, remember to choose stNEAR if you wanna stake them</h5>
						<Profile nfts={nfts} dbUnlock={dbUnlock}/>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header>Mint</Accordion.Header>
					<Accordion.Body>
						<MintingTool userNFTStatus={userHasNFT} db={straw} onAdd={addUnlock}/>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</Row>
      </Container>
	  <Row style={{ marginTop: "3vh" }}>
		<Card bg='dark' text='light'>
		<Card.Img src="./footer.jpg" alt="Card image" />
		<Card.ImgOverlay>
			<Card.Body className="footer-link">
				<Card.Link href="https://www.varda.vision">Project</Card.Link>
				<Card.Link href="https://discord.gg/FvuY84TyTt">Discord</Card.Link>
				<Card.Link href="https://twitter.com/jeeltcraft">Twitter</Card.Link>
				<Card.Link href="https://instagram.com/varda.vision">Instagram</Card.Link>
			</Card.Body>
		</Card.ImgOverlay>
		<Card.Footer className="text-muted text-center">Thanks to HumanGuild and Jeeltcraft.com, the Varda marketplace unlocks the value of NFTs on the NEAR blockchain</Card.Footer>
		</Card>
	  </Row>
    </React.Fragment>
  );

}
