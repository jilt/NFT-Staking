import React, { useEffect, useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { Modal, Button, Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

// Modals

import ModalSale from "./Modals/ModalSale";
import ModalBuy from "./Modals/ModalBuy";



function Intro(props) {

    const initialValues = {
        assetTitle: "",
        assetID: "",
        assetDescription: "",
        assetUrl: "",
        assetCollection: "",
        assetBid: "",
        assetLockLink: "",
        assetPartner: "",
        assetRoyalty: 0
    };
    const [values, setValues] = useState(initialValues);
    const [showLoader, setShowLoader] = useState(false);

    // state to get storage db

    const [straw, setDb] = useState([]);


    // state for minting form

    const [minting, setMinting] = useState(false);

    // states for displaying NFTs

    const [nftResults, setNftResults] = useState([]);
    const [results, setCollResult] = useState([]);
    const [nftMarketResults, setNftMarketResults] = useState([]);



    //state for collections modals
    const [collVisible, setCollVisible] = useState(false);
    const [coll1Visible, setColl1Visible] = useState(false);
    const [coll2Visible, setColl2Visible] = useState(false);
    const [coll3Visible, setColl3Visible] = useState(false);
    const [nftVisible, setNftVisible] = useState(false);


    const handleClose = () => setCollVisible(false);
    const handleShow = () => setCollVisible(true);

    const oneClose = () => setColl1Visible(false);
    const oneShow = () => setColl1Visible(true);

    const twoClose = () => setColl2Visible(false);
    const twoShow = () => setColl2Visible(true);

    // state for nft details modal
    const [nft, setNft] = useState({});
    const [meta, setMeta] = useState({});
    const [royalty, setRoyalty] = useState({});
    const [market, setMarket] = useState({});

    const nftClose = () => setNftVisible(false);
    const nftShow = () => setNftVisible(true);

    async function singleVisible(nft) {
        setCollVisible(false);
        setColl1Visible(false);
        setColl2Visible(false);
        setColl3Visible(false);
        setNft(nft);
        setMeta(nft.metadata);
        setRoyalty(nft.royalty);
        setMarket(nft.approval_id);
        setNftVisible(true);

    }

    async function shareNft(token_id) {
        let text = window.location.href + 'art/' + token_id;
        navigator.clipboard.writeText(text);
        alert("copied" + text );
    }

    let collection = [];
    let reference = [];
    let collection1 = [];
    let reference1 = [];
    let collection2 = [];
    let reference2 = [];
    let floor = [];
    let floor1 = [];
    let floor2 = [];

    // display collection items
    collection = results.map((nft, index) => (collection = nft));
    reference = props.coll;
    collection = collection.filter(i => reference.includes(i.metadata.extra));

    // create floor number
    floor = collection.map((nft, index) => (nft.sale_conditions));
    floor.sort(function (a, b) {
        return a - b;
    });
    let firstFloor = floor[0];

    collection1 = results.map((nft, index) => (collection1 = nft));
    reference1 = props.coll1;
    collection1 = collection1.filter(i => reference1.includes(i.metadata.extra));


    collection2 = results.map((nft, index) => (collection2 = nft));
    reference2 = props.coll2;
    collection2 = collection2.filter(i => reference2.includes(i.metadata.extra));


    // function to buy NFT

    const OfferPrice = async (token_id) => {
        await props.walletConnection.account().functionCall({
            contractId: props.nearConfig.marketContractName,
            methodName: "offer",
            args: {
                nft_contract_id: props.nearConfig.contractName,
                token_id,
            },
            attachedDeposit: props.parseNearAmount(nft.sale_conditions),
            gas: props.nearConfig.GAS,
        })
    }


    // allow access to minting form

    const allowList = async () => {
        const listAllow = ['jilt.near', 'jeeltcraft.near', 'nft-varda.near'];
        {
            listAllow.filter(allowed => allowed.match(new RegExp(props.user, "i"))).map(artist => {
                if (artist == props.user) {
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

    // manage minting form

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    // load marketplace

    const loadSaleItems = async () => {
        let results = await props.walletConnection
            .account()
            .viewFunction(props.nearConfig.contractName, "nft_tokens", {
                from_index: "0",
                limit: 64,
            });
        setCollResult(results);

        let saleTokens = await props.walletConnection
            .account()
            .viewFunction(
                props.nearConfig.marketContractName,
                "get_sales_by_nft_contract_id",
                {
                    nft_contract_id: props.nearConfig.contractName,
                    from_index: "0",
                    limit: 64,
                }
            );
        let sales = [];

        for (let i = 0; i < results.length; i++) {
            const { token_id } = results[i];
            let saleToken = saleTokens.find(({ token_id: t }) => t === token_id);
            if (saleToken !== undefined) {
                sales[i] = Object.assign(results[i], saleToken);

            }
        }
        let minted = sales.reverse();
        setNftMarketResults(minted);

    };

    // minting

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
        let functionCallResult = await props.walletConnection.account().functionCall({
            contractId: props.nearConfig.contractName,
            methodName: "nft_mint",
            args: {
                token_id: `${props.user}-varda-` + `${values.assetID}`,
                metadata: {
                    title: `${values.assetTitle}`,
                    description: `${values.assetDescription}`,
                    media: `${values.assetUrl}`,
                    extra: `${values.assetCollection}`,
                },
                gas: props.nearConfig.GAS,
                receiver_id: props.user,
                perpetual_royalties,
            },
            attachedDeposit: props.parseNearAmount("1"),
        });

        async function handleUnlock(token_id) {
            var id = `${props.user}-varda-` + `${values.assetID}`
            var link = `${values.assetLockLink}`


            if ( !link ) {
                alert('please add a link to submit')
                return
            }
            let lockable = {id, CID:'', link}

            addUnlock(lockable)
        };

        if (functionCallResult) {
            console.log("nft created: ");
        } else {
            console.log("nft not created");
        }

    };

    // all nfts

    const displayAllNFT = async () => {
        let userNFTs = await props.walletConnection
            .account()
            .viewFunction(props.nearConfig.contractName, "nft_tokens_for_owner", {
                account_id: props.user,
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
        console.log(straw)
        return straw
    }


    return (
        <>
        <Carousel fade>
            <Carousel.Item interval={7000}>
                <img
                    fluid
                    className="d-block w-100"
                    src="https://raw.githubusercontent.com/jilt/NFT-Staking/main/docs/images/slider-9.jpg"
                    alt="Wild-Pinups"
                />
                <Carousel.Caption>
                        <Button variant="outline-light" onClick={handleShow}>Wild Pinups</Button>
                    <br />
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={7000}>
                <img
                    fluid
                    className="d-block w-100"
                    src="https://raw.githubusercontent.com/jilt/NFT-Staking/main/docs/images/slider-6.jpg"
                    alt="Galdrastafir Game"
                />

                <Carousel.Caption>
                    <h3>Galdrastafir</h3>
                    <Button variant="outline-light" onClick={oneShow} >Collection</Button>{' '}<Button variant="outline-light"><a href="https://game.varda.vision" target="_blank" title="Varda Tap To Play HTML game">Game</a></Button>{' '}
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={7000}>
                <img
                    fluid
                    className="d-block w-100"
                    src="https://raw.githubusercontent.com/jilt/NFT-Staking/main/docs/images/slider-7.jpg"
                    alt="Elvenland Metaverse"
                />

                <Carousel.Caption>
                    <h3>Elvenland Metaverse</h3>
                        <Button variant="outline-light" onClick={twoShow}>Collection</Button>{' '}<Button variant="outline-light"><a href="https://elvenland.varda.vision" target="_blank" title="Voxel Elves Metaverse on the NEAR blockchain">Metaverse</a></Button>{' '}
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={7000}>
                <img
                    fluid
                    className="d-block w-100"
                    src="https://raw.githubusercontent.com/jilt/NFT-Staking/main/docs/images/slider-8.jpg"
                    alt="Genesis NFTs"
                />

                <Carousel.Caption>
                        <Button variant="outline-light"><a href="https://paras.id/jilt.near/creation" target="_blank" title="Genesis NFTs">Genesis NFTs</a></Button>{' '}
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
            <Container style={{ marginTop: "3vh" }} fluid="md">
                <Row>
                <Col>
                <Card className="bg-dark text-white">
                    <Card.Body>
                            <Card.Title>The future of art collecting</Card.Title>
                        <Card.Text>
                             Browse and build your collection of the most cutting-edge digital art.
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                    <Card className="bg-dark text-white">
                        <Card.Body>
                            <Card.Title>Royalties and longevity</Card.Title>
                            <Card.Text>
                                Artists forever royalties on secondary sales, all traceable on-chain.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="bg-dark text-white">
                        <Card.Body>
                            <Card.Title>Unlockable is a default</Card.Title>
                            <Card.Text>
                                To foster an exclusive relationship between anrtist and collector.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                </Row>
                <Accordion defaultActiveKey="0" style={{ marginTop: "3vh" }}>
                    {nftMarketResults.length !== 0 ? (
                        <>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Market</Accordion.Header>
                                <Accordion.Body>
                                    <Row md={3} xs={1} style={{ marginTop: "3vh" }}>
                                        {nftMarketResults
                                            ? nftMarketResults.map((nft, index) => (
                                                <Col className="card-w" key={index}>
                                                    <Card className="card inset">
                                                        <Link to={`/art/${nft.token_id}`}>
                                                            <Card.Img variant="top" src={nft.metadata.media} />
                                                        </Link>
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
                                                                {props.user !== nft.owner_id ? (
                                                                    <ModalBuy index={index} token_id={nft.token_id} sale_conditions={nft.sale_conditions} user={props.user} nearConfig={props.nearConfig} walletConnection={props.walletConnection} parseNearAmount={props.parseNearAmount} />
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
                    {nftResults.length !== 0 ? (
                        <>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Your NFTs</Accordion.Header>
                                <Accordion.Body>
                                    <Row md={3} xs={1} style={{ marginTop: "3vh" }}>
                                        {nftResults
                                            ? nftResults.map((nft, index) => (
                                                <Col className="card-w" key={index}>
                                                    <Card className="card inset">
                                                        <Link to={`/art/${nft.token_id}`}>
                                                            <Card.Img variant="top" src={nft.metadata.media} />
                                                        </Link>
                                                        <Card.Body className="d-grid gap-2">
                                                            <Card.Title>{nft.metadata.title}</Card.Title>
                                                            {straw.length > 0 ? straw.filter(lock => lock.id.match(new RegExp(nft.token_id, "i"))).length == 0 ?
                                                                <p>No Unlockable</p>
                                                                : straw.filter(lock => lock.id.match(new RegExp(nft.token_id, "i"))).map(lockable =>
                                                                    <Button variant="outline-primary" key={nft.token_id}>
                                                                        {lockable.CID.length > 0 ? <a href={`https://${lockable.CID}.ipfs.dweb.link`} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a>
                                                                            : <a href={lockable.link} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a>}
                                                                    </Button>
                                                                ) : <p>No Unlockable</p>
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
                                                                nft.approved_account_ids[props.nearConfig.marketContractName] >= 0 ? Object.entries(nft.approved_account_ids).map(([contract, id]) => <div key={id}><p><small>On sale on: {contract}</small></p><p>Upgrade price here</p><ModalSale index={index} token_id={nft.token_id} user={props.user} nearConfig={props.nearConfig} walletConnection={props.walletConnection} parseNearAmount={props.parseNearAmount} /></div>) : <ModalSale index={index} token_id={nft.token_id} user={props.user} nearConfig={props.nearConfig} walletConnection={props.walletConnection} parseNearAmount={props.parseNearAmount} />
                                                            }
                                                        </Card.Body>

                                                    </Card>

                                                </Col>
                                            ))
                                            : "NFTs not found"}
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </>) : null}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Mint</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col md={{ span: 8, offset: 2 }}>
                                    {minting ? <form
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
                                    </form> : <p>To mint with Varda submit your Art <Button variant="outline-primary"><a href="https://lauracamellini.typeform.com/to/EuDLb43R" target="_blank" title="Artist Application">Here</a></Button></p>}

                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
            <Modal show={collVisible} size="lg" onHide={handleClose}>
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title>{ props.coll }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center"><small>{props.desc}</small></p>
                    <p className="text-center">Floor <br />{firstFloor}</p>
                    <Container>
                        <Row>
                            { results
                                ? results.map((nft, index) => ( nft.metadata.extra === props.coll ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={ () => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}
                                                    <br />Royalties: <br />
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
                                            </Card.Body>
                                        </Card>
                                    </Col> : " " )) : " " }
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={coll1Visible} size="lg" onHide={oneClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.coll1}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><small>{props.desc1}</small></p>
                    <Container>
                        <Row>
                            {results
                                ? results.map((nft, index) => (nft.metadata.extra === props.coll1 ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                            <a className="asset-anchor" href="#">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            </a>
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={() => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}
                                                    <br />Royalties: <br />
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
                                            </Card.Body>
                                        </Card>
                                    </Col> : " ")) : " "}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={oneClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={coll2Visible} size="lg" onHide={twoClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.coll2}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><small>{props.desc2}</small></p>
                    <Container>
                        <Row>
                            {results
                                ? results.map((nft, index) => (nft.metadata.extra === props.coll2 ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                            <a className="asset-anchor" href="#">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            </a>
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={() => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}
                                                    <br />Royalties: <br />
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
                                            </Card.Body>
                                        </Card>
                                    </Col> : " ")) : " "}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={twoClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={nftVisible} size="lg" onHide={nftClose}>
                <Modal.Header closeButton>{meta.title}</ Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col className="card-w">
                                <Card className="card inset">
                                    <Card.Img variant="top" src={meta.media} />
                                    <Card.Body className="d-grid gap-2">
                                        <Card.Title className="text-center">{meta.title}</Card.Title>
                                        <p className="text-center"><small><b>{meta.extra}</b></small></p>
                                        <Button variant="outline-primary" onClick={() => shareNft(nft.token_id)}>Share</Button>
                                        <Card.Text className="text-center">{meta.description}<br />Owned by: {nft.owner_id}<br />
                                            <br />Royalties: <br />
                                            {
                                                Object.keys(royalty).length > 0 ?
                                                    Object.entries(royalty).map(([receiver, amount]) => <div key={receiver}>
                                                        {receiver} - {amount / 100}%
                                                    </div>)
                                                    :
                                                    <p>This token has no royalties.</p>
                                            }
                                        </Card.Text>
                                        {nft.sale_conditions && <> <span className="span-price">Price</span>
                                            <div className="price-wrapper">
                                                <div className="price">
                                                    {nft.sale_conditions} - NEAR
                                                </div>
                                            </div> {props.user !== nft.owner_id ? <Button variant="outline-primary" onClick={() => OfferPrice(nft.token_id, nft.sale_conditions) }>Buy</Button> : null}
                                        </> }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={nftClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> 
        </>
    );
}

export default Intro;
