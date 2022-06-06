import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import { login, logout } from "./utils";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

// React and custom Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom-styles.css";

// React Bootstraps imports
import { Nav, Navbar, Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';



// Custom Components
import MintingTool from "./Components/MintingTool";
import InfoBubble from "./Components/InfoBubble";

// assets
import Logo from "./assets/logo-white.svg";

// near config
import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

		
export default function App() {
// state for minting allowance

const [userHasNFT, setuserHasNFT] = useState(false);

// state to get storage data
  
const[stfetchUrl, setUploads] = useState ([])

// state to get storage db
  
const[straw, setDb] = useState([])


  useEffect(() => {
    const allowList = async () => {
//      console.log(
//        await window.contract.check_token({
//          id: `${window.accountId}-varda-nft`,
//        })
//      );
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
  }, []);
  
  //set vault's web3.storage API token
  
const web3Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEM4QTI5REE2YTUzN2UwMWM0OUQxMzdkQTNEOTUzYUVCNTkwRWJGYjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQxODgyOTM5NDgsIm5hbWUiOiJtYXJrZXRwbGFjZSJ9.qTmEyJCEuPly9ltzfRlt-xG7GUGF9GP_BVnWj-ucZKI'

// Create default storage client
  
function makeStorageClient() {
	return new Web3Storage({ token: web3Token })
}

 // add unlockable
 
const addUnlock = (lockable) => {
	straw.push(lockable)
	const blob = new Blob([JSON.stringify(straw)], {type : 'application/json'})
	
	const files = [
    new File( [blob], 'root.json')
	]
	const client = makeStorageClient()
	return client.put(files)
	
}

// get storage files for unlockables
  
const listUploads = async () => {
	
	const client = makeStorageClient()
	const uploadNames = []
			
	for await (const upload of client.list()){
		const uploadObject = {}
		uploadObject.name = upload.name
		uploadObject.id = upload.cid
		uploadNames.push(uploadObject)
	}
	const lastUpdate = uploadNames[0].id
	const stfetchUrl = "https://" + lastUpdate + ".ipfs.dweb.link/root.json"
	setUploads(stfetchUrl)
	console.log(stfetchUrl)
						
	// web3 storage file/system variable call
	

	const fetchFilecoin = async () => {
		
		const stres = await fetch(stfetchUrl);
		const stdata = await stres.json();
		const stdatastr = JSON.stringify(stdata);
		const straw = JSON.parse(stdatastr);
		return straw
	}
			
	// get db files for unlockables
		
	const getDb = async () => {
		const straw = await fetchFilecoin()
		setDb(straw)
	}
	
	getDb()
	
}


//navigation tabs
  
  function ControlledTabs() {

  return (
	<Tabs defaultActiveKey={1} id="main-content">
		<Tab eventKey={1} title="Last NFTs">
			<h5 style={{ marginTop: "3vh" }}>Last NFTs minted on our platform</h5>
		</Tab>
		<Tab eventKey={2} title="Your NFTs">
			<h5 style={{ marginTop: "3vh" }}>These are your Varda NFTs, you can put them on sale here</h5>
		</Tab>
		<Tab eventKey={3} onSelect={() =>listUploads()} title="Mint">
			<MintingTool userNFTStatus={userHasNFT} db={straw} onAdd={addUnlock}/>
		</Tab>
	</Tabs>
  );
}


	return (
		<>
      <table >
        <tr>
          <td>Titles</td>
          <td>Button Size</td>
          <td>Button variations</td>
          <td>Checkbox variations</td>
          <td>Square Button variations</td>
        </tr>
        <tr>
          <td>
            <Title hL={1}>Title Variations</Title>
            <br />
            <Title hL={2}>Title Variations</Title>
            <br />
            <Title hL={3}>Title Variations</Title>
            <br />
            <Title hL={4}>Title Variations</Title>
            <br />
            <Title hL={5}>Title Variations</Title>
            <br />
            <Title hL={6}>Title Variations</Title>
            <br />
          </td>
          <td>
            <ButtonSM href={'hamiberkayaktas.tk'}>This is Button</ButtonSM>
            <br />
            <Button href={'hamiberkayaktas.tk'}>This is Button</Button>
            <br />
            <ButtonLG href={'hamiberkayaktas.tk'}>This is Button</ButtonLG>
            <br />
          </td>
          <td>
            <Button href={'hamiberkayaktas.tk'}>This is Button</Button>
            <ButtonPressed>Pressed Button</ButtonPressed>
            <br />

            <ButtonIL icon='fas fa-user-plus'>
              Button with Left side icon 
            </ButtonIL>
            <br />
            <ButtonIR icon='fas fa-user-plus'>
              Button with Right side icon 
            </ButtonIR>
            <br />
            <ButtonwIcon icon='fas fa-arrow-right' />
            <ButtonwIcon icon='fas fa-arrow-left' />
            <br />

            <ButtonSmallL icon='fas fa-share-alt'> Share</ButtonSmallL>
            <br />
            <ButtonSmallR icon='fas fa-map-marker-alt'> Label</ButtonSmallR>
          </td>
          <td>
            <RegularCheckboxIOS>Ios Checkbox</RegularCheckboxIOS>
            <br />
            <RegularCheckboxIOS checked={true}>Ios Checkbox</RegularCheckboxIOS>
            <br />
            <RegularCheckbox>Regular Checkbox</RegularCheckbox>
            <br />
            <RegularCheckbox checked={true}>Regular Checkbox</RegularCheckbox>
          </td>
          <td>
            <ButtonSq>Aa</ButtonSq>
            <br />
          </td>
        </tr>
        <tr>
          <td>Form Component</td>
          <td>Chart Component</td>
          <td>Progress Component</td>
          <td>Text Component</td>
          <td>Other Component</td>
        </tr>
        <tr>
          <td>
            <Input placeholder='Search For ...' />
            <ButtonIconRounded icon='fas fa-search' />
            <br />
            <Select name='cars' id='cars'>
              <option value='volvo'>Volvo</option>
              <option value='saab'>Saab</option>
              <option value='mercedes'>Mercedes</option>
              <option value='audi'>Audi</option>
            </Select>
            <br />
            <Radio>Radio form component</Radio><br/>
            <Radio checked={true}>Radio form component</Radio><br/>
            <Textarea placeholder='Textarea Component ......'></Textarea>
          </td>
          <td>
            <Chart
              degerler={[50, 20, 75, 30, 85, 10, 99, 5]}
              w={'200px'}
              h={'200px'}
            />
          </td>
          <td>
            <Progress value={38} w={'250px'} h={'10px'} />
            <CircleProgress value={77} w={'200px'} h={'200px'} />
            <CircleProgress value={32} w={'100px'} h={'100px'} />
            <Loading w={'50px'} h={'50px'} />
          </td>
          <td>
          <Title hL={2}>Title Variations</Title><br/>
          <Text>Text Component</Text>
          <TextMuted>Text Muted Component</TextMuted>
          </td>
          <td>
            Grid Component<br/>
  
            <Grid col={5} rows={3} w={'100%'} key={1}>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
            </Grid>
          </td>
        </tr>
        <tr>
          <td>
            <Dropdown>{[{link:'www.twitter.com',content:'Twitter'},{link:'www.facebook.com',content:'Facebook'},{link:'www.youtube.com',content:'Youtube'}]}</Dropdown>
            <Dropdown>{[{link:'www.twitter.com',content:'Twitter'},{link:'www.facebook.com',content:'Facebook'},{link:'www.youtube.com',content:'Youtube'}]}</Dropdown>
          </td>
          <td>
            <ButtonGroup>
              <ButtonG href={'/1'}>1</ButtonG>
              <ButtonG href={'/2'}>2</ButtonG>
              <ButtonG href={'/3'}>3</ButtonG>
            </ButtonGroup>
          </td>
        </tr>
      </table>
      <Grid col={3} rows={3} key={2}>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
              <Box style={{background:'Red'}}>.</Box>
            </Grid>
      <Box>div denemesi</Box>
      <BoxMorph style={{ width: '500px' }}>
        <Title hL={3}>Title Variations</Title>
        <br></br>div denemesi
        <br />
        asdasddasas
      </BoxMorph>
      <Grid col={3} row={6} w={'100%'} key={4}>
        <ButtonSq><i className='fas fa-share-alt'></i></ButtonSq>
        <Loading w={'50px'} h={'50px'} />
        <RegularCheckboxIOS>oldumu</RegularCheckboxIOS>
        <RegularCheckboxIOS checked={true}>oldumu</RegularCheckboxIOS>
        <Button href={'hamiberkayaktas.tk'}>This is Button</Button>
        <ButtonPressed>Pressed Button</ButtonPressed>

        <ButtonIL icon='fas fa-user-plus'>Bu bir Soldan iconlu Buton</ButtonIL>
        <ButtonIR icon='fas fa-user-plus'>Bu bir Sağdan iconlu Buton</ButtonIR>
        <ButtonwIcon icon='fas fa-arrow-right' />
        <ButtonwIcon icon='fas fa-arrow-left' />

        <ButtonSmallL icon='fas fa-share-alt'> Share</ButtonSmallL>
        <ButtonSmallR icon='fas fa-map-marker-alt'> Label</ButtonSmallR>
        <Input placeholder='merhaba' />
        <ButtonIconRounded icon='fas fa-search' />
        {/* <Checkbox >Açıklama</Checkbox>
      <Checkbox checked={true}>Açıklama</Checkbox>  */}
        <Select name='cars' id='cars'>
          <option value='volvo'>Volvo</option>
          <option value='saab'>Saab</option>
          <option value='mercedes'>Mercedes</option>
          <option value='audi'>Audi</option>
        </Select>
        <Radio>deneme</Radio>
        <Radio checked={true}>deneme</Radio>

        <Chart
          degerler={[50, 20, 75, 30, 85, 10, 99, 5]}
          w={'200px'}
          h={'200px'}
        />
        <Progress value={38} w={'250px'} h={'10px'} />
        <CircleProgress value={77} w={'200px'} h={'200px'} />
        <RegularCheckbox>One</RegularCheckbox>
        <RegularCheckbox checked={true}>Deneme</RegularCheckbox>
      </Grid>
      <ExampleComponent text='Create React Library Example 😄' />

      <ButtonSq>AI</ButtonSq>
      <Loading w={'50px'} h={'50px'} />
      <RegularCheckboxIOS>oldumu</RegularCheckboxIOS>
      <RegularCheckboxIOS checked={true}>oldumu</RegularCheckboxIOS>
      <Button href={'hamiberkayaktas.tk'}>This is Button</Button>
      <ButtonPressed>Pressed Button</ButtonPressed>

      <ButtonIL icon='fas fa-user-plus'>Bu bir Soldan iconlu Buton</ButtonIL>
      <ButtonIR icon='fas fa-user-plus'>Bu bir Sağdan iconlu Buton</ButtonIR>
      <ButtonwIcon icon='fas fa-arrow-right' />
      <ButtonwIcon icon='fas fa-arrow-left' />

      <ButtonSmallL icon='fas fa-share-alt'> Share</ButtonSmallL>
      <ButtonSmallR icon='fas fa-map-marker-alt'> Label</ButtonSmallR>
      <Input placeholder='merhaba' />
      <ButtonIconRounded icon='fas fa-search' />
      {/* <Checkbox >Açıklama</Checkbox>
      <Checkbox checked={true}>Açıklama</Checkbox>  */}
      <Select name='cars' id='cars'>
        <option value='volvo'>Volvo</option>
        <option value='saab'>Saab</option>
        <option value='mercedes'>Mercedes</option>
        <option value='audi'>Audi</option>
      </Select>
      <Radio>deneme</Radio>
      <Radio checked={true}>deneme</Radio>

      <Chart
        degerler={[50, 20, 75, 30, 85, 10, 99, 5]}
        w={'200px'}
        h={'200px'}
      />
      <Progress value={38} w={'250px'} h={'10px'} />
      <CircleProgress value={77} w={'200px'} h={'200px'} />
      <RegularCheckbox>One</RegularCheckbox>
      <RegularCheckbox checked={true}>Deneme</RegularCheckbox>
      <Dropdown>{[{link:'www.twitter.com',content:'Twitter'},{link:'www.facebook.com',content:'Facebook'},{link:'www.youtube.com',content:'Youtube'}]}</Dropdown>

    </>
	)
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
		  <Col>
		  <Card>
			<Card.Img variant="top" src="./panda.jpg" />
			<Card.Body>
				<Card.Title>Wild Pinups</Card.Title>
				<Card.Text>
					This collection was Created by Jilt and Valeriia Derrick and 50% forever royalties will support the wild animals of an Ukranian Zoo.
				</Card.Text>
				<Button variant="outline-primary">Check it out!</Button>
			</Card.Body>
			</Card>
			</Col>
			<Col>
		  <Card>
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
			<Col>
		  <Card>
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
		  <Col>
		  <Card>
			<Card.Img variant="top" src="./christophe.jpg" />
			<Card.Body>
				<Card.Title>NearVerse</Card.Title>
				<Card.Text>
					A collection of voxelart by <a href="https://twitter.com/TritzChristophe" title="artist twitter" target="_blank">Christophe Tritz</a> unlocking NEARverse plots and so much more funny features for the near community!.
				</Card.Text>
				<Button variant="outline-primary" disabled>Coming this summer!</Button>
			</Card.Body>
			</Card>
			</Col>
        </Row>
		<Row style={{ marginTop: "3vh" }}>
		<ControlledTabs />
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
