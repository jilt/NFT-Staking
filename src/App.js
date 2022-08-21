import React, { useEffect, useState } from "react";
// React and custom Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// React Bootstraps imports
import { Nav, Navbar, Container, Row, Col, Card, Button, Modal, Accordion, Form } from "react-bootstrap";

// Modals
import useModal from "./useModal";
import ModalTransfer from "./ModalTransfer";
import Intro from './Collections';

// Assets
import Logo from "./assets/logo-white.svg";
import * as nearAPI from "near-api-js";

const initialValues = {
    assetTitle: "",
    assetID:"",
    assetDescription: "",
    assetUrl: "",
    assetCollection:"",
    assetPrice: "",
    assetBid: "",
    assetLockLink: "",
    assetPartner:"",
    assetRoyalty: 0,
    assetToken:""
};

const App = ({ currentUser, nearConfig, walletConnection }) => {
  const {
    utils: {
      format: { parseNearAmount },
    },
  } = nearAPI;
  const [showLoader, setShowLoader] = useState(false);
  const [values, setValues] = useState(initialValues);

    // state to get storage db

    const [straw, setDb] = useState([])
    const [dbUnlock, setdbUnlock] = useState([])

    // state for minting form
    const [minting, setMinting] = useState(false);


  const {
    isVisibleSale,
    isVisibleBid,
    toggleSaleModal,
    toggleBidModal,
  } = useModal();

  const [nftResults, setNftResults] = useState([]);
  const [collResult, setCollResult] = useState([]);
  const [nftMarketResults, setNftMarketResults] = useState([]);


  const signIn = () => {
    walletConnection.requestSignIn(
      nearConfig.contractName,
      "", // title. Optional, by the way
      "", // successUrl. Optional, by the way
      "" // failureUrl. Optional, by the way
    );
  };

    // allow access to minting form

    const allowList = async () => {
        const listAllow = ['jilt.testnet', 'khbuilder.testnet', 'helpme.testnet'];
        {
            listAllow.filter(allowed => allowed.match(new RegExp(currentUser, "i"))).map(artist => {
                if (artist == currentUser) {
                    setMinting(minting => !minting);
                }
            })
        }
    };

    useEffect(() => {

        allowList();

        listDbUploads();

    }, []);

  useEffect(() => {
    if (!showLoader) {
      displayAllNFT();
      loadSaleItems();
    }
  }, [showLoader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const loadSaleItems = async () => {
    let nftTokens = await walletConnection
      .account()
      .viewFunction(nearConfig.contractName, "nft_tokens", {
        from_index: "0",
        limit: 64,
      });
      setCollResult(nftTokens);

      let saleTokens = await walletConnection
          .account()
          .viewFunction(
              nearConfig.marketContractName,
              "get_sales_by_nft_contract_id",
              {
                  nft_contract_id: nearConfig.contractName,
                  from_index: "0",
                  limit: 64,
              }
      );
      let sales = [];

      for (let i = 0; i < nftTokens.length; i++) {
          const { token_id } = nftTokens[i];
          let saleToken = saleTokens.find(({ token_id: t }) => t === token_id);
          if (saleToken !== undefined) {
              sales[i] = Object.assign(nftTokens[i], saleToken);

          }
      }
      setNftMarketResults(sales);

  };

  const sendStorageDeposit = async () => {

      await walletConnection.account().functionCall({
          contractId: nearConfig.marketContractName,
          methodName: "storage_deposit",
          args: {},

          attachedDeposit: '10000000000000000000000',
      });
  };



    const mintAssetToNft = async () => {
        handleUnlock()
        let perpetual = new Object;
        var b = `${values.assetRoyalty}`;
        var a = `${values.assetPartner}`;
        perpetual[a] = b;
        let perpetual_royalties = Object.entries(perpetual).map(([partner, royalty]) => ({
            [partner]: royalty * 100
        })).reduce((acc, cur) => Object.assign(acc, cur), {});
        if (Object.values(perpetual_royalties).reduce((a, c) => a + c, 0) > 5000) {
            return alert('Cannot add more than 50% in perpetual NFT royalties when minting');
        }
        console.log(perpetual_royalties);
    let functionCallResult = await walletConnection.account().functionCall({
      contractId: nearConfig.contractName,
      methodName: "nft_mint",
      args: {
          token_id: `${currentUser}-varda-` + `${values.assetID}`,
        metadata: {
          title: `${values.assetTitle}`,
          description: `${values.assetDescription}`,
          media: `${values.assetUrl}`,
          extra: `${values.assetCollection}`,
        },
        gas: nearConfig.GAS,
          receiver_id: currentUser,
          perpetual_royalties,
      },
      attachedDeposit: parseNearAmount("1"),
    });

        async function handleUnlock(token_id) {
            var id = `${currentUser}-varda-` + `${values.assetID}`
            var CID = `${values.assetLock}`
            var link = `${values.assetLockLink}`

            if (CID && link) {
                alert('you can add only a CID or a link')
                return
            }
            if (!CID && !link) {
                alert('please add either a link or a CID to submit')
                return
            }
            let lockable = `{id:'${id}', CID:'${CID}', link:'${link}'}`

            addUnlock(lockable);
        };

    if (functionCallResult) {
      console.log("nft created: ");
    } else {
      console.log("nft not created");
    }
  };

    const checkStorage = async () => {
        // Check storage balance
        let storageAccount = await walletConnection.account().functionCall({
            contractId: nearConfig.marketContractName,
            methodName: "storage_balance_of",
            args: {
                account_id: currentUser,
            },
        });
        console.log(storageAccount);
     }

    const approveNFTForSale = async (token_id) => {
        let sale_conditions = {
            sale_conditions: values.assetPrice,
        };
        await walletConnection.account().functionCall({
            contractId: nearConfig.contractName,
            methodName: "nft_approve",
            args: {
                token_id: token_id,
                account_id: nearConfig.marketContractName,
                msg: JSON.stringify(sale_conditions),
            },
            attachedDeposit: parseNearAmount("0.01"),
        });
    };

  const OfferPrice = async (token_id) => {
    await walletConnection.account().functionCall({
      contractId: nearConfig.marketContractName,
      methodName: "offer",
      args: {
        nft_contract_id: nearConfig.contractName,
        token_id,
      },
      attachedDeposit: parseNearAmount(values.assetBid),
      gas: nearConfig.GAS,
    })
  }
  
  const displayAllNFT = async () => {
    let userNFTs = await walletConnection
      .account()
      .viewFunction(nearConfig.contractName, "nft_tokens_for_owner", {
        account_id: currentUser,
        from_index: "0",
        limit: 64,
      });
    setNftResults(userNFTs);
    setShowLoader(true);
  };

  // unlockable content

    const relay = 'https://Varda-vault-relay-server.jilt1.repl.co/locked/'


    // add unlockable

    const addUnlock = async (lockable) => {
        const res = await fetch(relay, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(lockable)
        })

        const data = res.json()

        setDb([...straw, data])

        const blob = new Blob([JSON.stringify(straw)], { type: 'application/json' })

        const files = [
            new File([blob], 'db.json')
        ]


    }

    // get storage files for unlockables


    const listDbUploads = async () => {
        const fetchUploads = await fetch(relay)
        const data = await fetchUploads.json()
        const stdatastr = JSON.stringify(data)
        const straw = JSON.parse(stdatastr)
        setDb(straw)
        return straw


    }

  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };


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
                              onClick={ currentUser ? signOut : signIn }
                          >
                              { currentUser ? currentUser
                                  : "Login" }
                          </Nav.Link>{" "}
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>
          <Intro user={currentUser} nearConfig={nearConfig} walletConnection={walletConnection} parseNearAmount={parseNearAmount} results={collResult} coll="Wild Pinups" desc="Created by Jilt and Valeriia Derrick, forever Royalties to Ukraine DAO" coll1="Galdrastafir" desc1="TAP to play game, mint your daily protection strategy in symbols, play to earn for Genesis NFT owners." coll2="Elvenland" desc2="NFT to unlock your Elvenland metaverse plot, that comes with built-in DeFi play to earn tools, collab with a great crypto artist." />
          <Container style={{ marginTop: "3vh" }}>
              <Accordion defaultActiveKey="0">
                  {nftMarketResults.length !== 0 ? (
                      <>
                          <Accordion.Item eventKey="0">
                              <Accordion.Header>Market</Accordion.Header>
                              <Accordion.Body>
                                  <Row md={3} xs={1} style={{ marginTop: "3vh" }}>
                                      {nftMarketResults
                                          ? nftMarketResults.map((nft, index) => (
                                              <Col className="card-w" key={index}>
                                                  <ModalTransfer
                                                      isVisibleBid={isVisibleBid}
                                                      hideModal={toggleBidModal}
                                                  >
                                                      <div className="outform-wrapper">
                                                          <div className="form-wrapper">
                                                              <form
                                                                  onSubmit={(e) => {
                                                                      e.preventDefault();
                                                                      OfferPrice(nft.token_id);
                                                                  }}
                                                              >
                                                                  <div className="form-in-wrapper">
                                                                      <h3 className="text-center pb-1">BUY</h3>

                                                                      <div className="box-wrapper">
                                                                          <div className="box-in-wrapper">
                                                                              <div className="input-wrapper">
                                                                                  <input
                                                                                      className="full-width"
                                                                                      placeholder="Sale price or more"
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
                                                                              OfferPrice(nft.token_id);
                                                                          }}>Buy</Button>
                                                                      </div>
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </ModalTransfer>
                                                  <Card className="card inset">
                                                      <a className="asset-anchor" href="#">
                                                          <Card.Img variant="top" src={nft.metadata.media} />
                                                      </a>
                                                      <Card.Body className="d-grid gap-2">
                                                          <Card.Title>{nft.metadata.title}</Card.Title>
                                                          <Card.Text><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}<br />
                                                              Royalties: <br />
                                                              {
                                                                  Object.keys(nft.royalty).length > 0 ?
                                                                      Object.entries(nft.royalty).map(([receiver, amount]) => <div key={receiver}>
                                                                          {receiver} - {amount / 100}%
                                                                      </div>)
                                                                      :
                                                                      <p>This token has no royalties.</p>
                                                              }
                                                          </Card.Text>
                                                          <span className="span-price">Price</span>
                                                          <div className="price-wrapper">
                                                              <div className="price">
                                                                  {nft.sale_conditions} - NEAR
                                                              </div>
                                                          </div>
                                                          <div className="sell-wrapper">
                                                              {currentUser !== nft.owner_id ? (
                                                                  <Button variant="outline-primary" onClick={toggleBidModal}>
                                                                      Buy
                                                                  </Button>
                                                              ) : null}
                                                          </div>
                                                      </Card.Body>
                                                  </Card>
                                              </Col>
                                          ))
                                          : "Market NFTs not found"}
                                  </Row>
                              </Accordion.Body>
                          </Accordion.Item>
                      </>) : null}
                  { nftResults.length !== 0 ? (
                      <>
                          <Accordion.Item eventKey="1">
                              <Accordion.Header>Your NFTs</Accordion.Header>
                              <Accordion.Body>
                                  <Row md={3} xs={1} style={{ marginTop: "3vh" }}>
                                      {nftResults
                                          ? nftResults.map((nft, index) => (
                                              <Col className="card-w" key={index}>
                                                  <ModalTransfer
                                                      isVisibleSale={isVisibleSale}
                                                      hideModal={toggleSaleModal}
                                                  >
                                                      <div className="outform-wrapper">
                                                          <div className="form-wrapper">
                                                              <form
                                                                  onSubmit={(e) => {
                                                                      e.preventDefault();
                                                                      approveNFTForSale(nft.token_id);
                                                                  }}
                                                              >
                                                                  <div className="form-in-wrapper">
                                                                      <h3 className="text-center pb-1">SELL NFT</h3>
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
                                                                              approveNFTForSale(nft.token_id);
                                                                          }} >Sell now</Button>
                                                                      </div>
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </ModalTransfer>
                                                  <Card className="card inset">
                                                      <a className="asset-anchor" href="#">
                                                          <Card.Img variant="top" src={nft.metadata.media} />
                                                      </a>
                                                      <Card.Body className="d-grid gap-2">
                                                          <Card.Title>{nft.metadata.title}</Card.Title>
                                                          { straw.filter(lock => lock.id.match(new RegExp(nft.token_id, "i"))).length == 0 ?
                                                              <p>No Unlockable</p>
                                                              : straw.filter(lock => lock.id.match(new RegExp(nft.token_id, "i"))).map(lockable =>
                                                                  <Button variant="outline-primary" key={ nft.token_id }>
                                                                      { lockable.CID.length > 0 ? <a href={`https://${lockable.CID}.ipfs.dweb.link`} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a>
                                                                          : <a href={lockable.link} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a> }
                                                                  </Button>
                                                                          )
                                                                  }
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
                                                              nft.approved_account_ids[nearConfig.marketContractName] >= 0 ? Object.entries(nft.approved_account_ids).map(([contract, id]) => <div key={id}><p><small>On sale on: {contract}</small></p></div>) : <Button variant="outline-primary" onClick={toggleSaleModal}>
                                                                  Sell now
                                                              </Button>
                                                          }


                                                      </Card.Body>

                                                  </Card>
                                              </Col>
                                          ))
                                          : "NFTs not found"}
                                  </Row>
                              </Accordion.Body>
                          </Accordion.Item>
                      </>) : null }
                  <Accordion.Item eventKey="2">
                      <Accordion.Header>Mint</Accordion.Header>
                      <Accordion.Body>
                          <Row>
                              <Col md={{ span: 8, offset: 2 }}>
                                  { minting ? <form
                                      onSubmit={(e) => {
                                          e.preventDefault();
                                          mintAssetToNft();
                                      }}
                                  >
                                      <Row>
                                          <h3 className="text-center pb-1">MINT NFT</h3>
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Title"
                                              name="assetTitle"
                                              type="text"
                                              value={values.assetTitle}
                                              onChange={handleInputChange}
                                          />
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Unique ID (no spaces)"
                                              name="assetID"
                                              type="text"
                                              value={values.assetID}
                                              onChange={handleInputChange}
                                          />
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Description"
                                              name="assetDescription"
                                              type="text"
                                              value={values.assetDescription}
                                              onChange={handleInputChange}
                                          />
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Collection Name"
                                              name="assetCollection"
                                              type="text"
                                              value={values.assetCollection}
                                              onChange={handleInputChange}
                                          />
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Image Url"
                                              name="assetUrl"
                                              type="text"
                                              value={values.assetUrl}
                                              onChange={handleInputChange}
                                          />
                                          <h3 className="text-center pb-1">Unlockable Content</h3>
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Unlockable Link"
                                              name="assetLockLink"
                                              type="text"
                                              value={values.assetLockLink}
                                              onChange={handleInputChange}
                                          />
                                          <h3 className="text-center pb-1">Royalties</h3>
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="ex: one.near, two.near"
                                              name="assetPartner"
                                              type="text"
                                              value={values.assetPartner}
                                              onChange={handleInputChange}
                                          />
                                          <input
                                              style={{ margin: "1vh" }}
                                              className="full-width"
                                              placeholder="Percentage"
                                              name="assetRoyalty"
                                              type="number"
                                              value={values.assetRoyalty}
                                              onChange={handleInputChange}
                                          />
                                          <div className="form-btn-wrapper">
                                              <Button variant="outline-primary" onClick={(e) => { e.preventDefault(); mintAssetToNft() }}>Mint NFT</Button>
                                          </div>
                                      </Row>
                                  </form> : <p>To mint with Varda submit your Art <Button variant="outline-primary"><a href="https://lauracamellini.typeform.com/to/EuDLb43R" target="_blank" title="Artist Application">Here</a></Button></p> }
                                  
                              </Col>
                          </Row>
                      </Accordion.Body>
                  </Accordion.Item>
              </Accordion>
              <Row className="footer">
                  <Navbar fixed="bottom" bg="dark" variant="dark" >
                      <Container>
                          <Navbar.Brand href="#">
                              <img
                                  alt=''
                                  src={Logo}
                                  width='85'
                                  height='85'
                                  className='d-inline-block align-top'
                              />{" "}
                          </Navbar.Brand>
                          <Nav className="me-auto">
                              <Nav.Link href="#" target="_blank" title="Main Project">Project</Nav.Link>
                              <Nav.Link href="#" target="_blank" title="Play to Earn">Game</Nav.Link>
                              <Nav.Link href="#" target="_blank" title="Instagram">Instagram</Nav.Link>
                              <Nav.Link href="#" target="_blank" title="Discord">Discord</Nav.Link>
                          </Nav>
                      </Container>
                  </Navbar>
              </Row>
          </Container>
      </React.Fragment>
  );
};

export default App;
