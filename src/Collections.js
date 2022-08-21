import React, { useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import * as nearAPI from "near-api-js";

function Intro(props) {
    //state for collections modals
    const [collVisible, setCollVisible] = useState(false);
    const [coll1Visible, setColl1Visible] = useState(false);
    const [coll2Visible, setColl2Visible] = useState(false);
    const [coll3Visible, setColl3Visible] = useState(false);
    const [nftVisible, setNftVisible] = useState(false);

    // state for nft details
    const [nft, setNft] = useState({});
    const [meta, setMeta] = useState({});
    const [royalty, setRoyalty] = useState({});
    const [market, setMarket] = useState({});

    const handleClose = () => setCollVisible(false);
    const handleShow = () => setCollVisible(true);

    const oneClose = () => setColl1Visible(false);
    const oneShow = () => setColl1Visible(true);

    const twoClose = () => setColl2Visible(false);
    const twoShow = () => setColl2Visible(true);

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

    let collection = [];
    let reference = [];
    let collection1 = [];
    let reference1 = [];
    let collection2 = [];
    let reference2 = [];

    collection = props.results.map((nft, index) => (collection = nft.metadata));
    reference = props.coll;
    collection = collection.filter(i => reference.includes(i.extra));


    collection1 = props.results.map((nft, index) => (collection1 = nft.metadata));
    reference1 = props.coll1;
    collection1 = collection1.filter(i => reference1.includes(i.extra));


    collection2 = props.results.map((nft, index) => (collection2 = nft.metadata));
    reference2 = props.coll2;
    collection2 = collection2.filter(i => reference2.includes(i.extra));

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

    return (
        <>
        <Carousel fade>
            <Carousel.Item interval={7000}>
                <img
                    fluid
                    className="d-block w-100"
                    src="https://raw.githubusercontent.com/jilt/NFT-Staking/main/docs/images/slider-5.jpg"
                    alt="Wild-Pinups"
                />
                <Carousel.Caption>
                        <Button variant="outline-light" onClick={handleShow}>Wild Pinups</Button>
                    <br />
                    <p>Created by Jilt and Valeriia Derrick, forever Royalties to Ukraine DAO</p>
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
            <Modal show={collVisible} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ props.coll }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><small>{props.desc}</small></p>
                    <Container>
                        <Row>
                            { props.results
                                ? props.results.map((nft, index) => ( nft.metadata.extra === props.coll ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={ () => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}<br />Click image to see all details and buy.<br />
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
                            {props.results
                                ? props.results.map((nft, index) => (nft.metadata.extra === props.coll1 ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                            <a className="asset-anchor" href="#">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            </a>
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={() => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}<br />Click image to see all details and buy.<br />
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
                            {props.results
                                ? props.results.map((nft, index) => (nft.metadata.extra === props.coll2 ?
                                    <Col className="card-w" key={index}>
                                        <Card className="card inset">
                                            <a className="asset-anchor" href="#">
                                                <Card.Img variant="top" src={nft.metadata.media} />
                                            </a>
                                            <Card.Body className="d-grid gap-2">
                                                <Card.Title className="text-center">{nft.metadata.title}</Card.Title>
                                                <Button variant="outline-primary" onClick={() => singleVisible(nft)}>Details</Button>
                                                <Card.Text className="text-center"><b>{nft.metadata.extra}</b><br />Owner: {nft.owner_id}<br />Click image to see all details and buy.<br />
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
                                        <p><small><b>{meta.extra}</b></small></p>
                                        <Card.Text className="text-center">{meta.description}<br />Owned by: {nft.owner_id}<br />
                                            Royalties: <br />
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
                                        </>}
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