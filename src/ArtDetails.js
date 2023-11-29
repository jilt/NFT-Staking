import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Route, useParams, Routes } from "react-router-dom";
import {Helmet} from "react-helmet";

// Modals

import ModalSale from "./Modals/ModalSale";
import ModalBuy from "./Modals/ModalBuy";

export default function ArtDetails(props) {
    const { id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const [nft, setNFT] = useState({});
    const [meta, setMeta] = useState({});
    const [mediaResult, setMediaResult] = useState("");
    const [royalty, setRoyalty] = useState({});
    const [sales, setSales] = useState([]);

    useEffect(() => {
        if (!showLoader) {
            loadNFT();
        }
    }, [showLoader]);

    const loadNFT = async () => {
        let result = await props.walletConnection
            .account()
            .viewFunction(props.nearConfig.contractName, "nft_token", {
                token_id: id,
            });
        setNFT(result);
        setMeta(result.metadata);
        setRoyalty(result.royalty);
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
        setSales(saleTokens);
    };
    
    const loadNewMedia = async (cond) => {
        let changing = await cond.includes("cloudflare");
        if(changing){
            let delimiter = '/';
            let start = 6;
            let tokens = cond.split(delimiter).slice(4, start);
            let resulting = tokens.join(delimiter);
            let mediaResult = "https://nftstorage.link/ipfs/"+ resulting;
            setMediaResult(mediaResult);
            console.log(mediaResult);
        } else {
            let mediaResult = cond;
            setMediaResult(cond);
            console.log(cond);
        }
        return (
            <Card.Img variant="top" src={ mediaResult } />
        )
    };


    return (
        <Container style={{ marginTop: "3vh" }} fluid="md">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta.title}</title>
                <link rel="canonical" href="https://market.varda.vision" />
                <meta name="description" content={meta.description} />
            </Helmet>
          <Row>
              <Col className="card-w">
                  <Card className="card inset">
                    {loadNewMedia() => (meta.media)}
                      <Card.Body className="d-grid gap-2">
                          <Card.Title className="text-center">{meta.title}</Card.Title>
                          <Card.Text className="text-center"><b>{meta.extra}</b><br />Owner: {nft.owner_id}
                              <p>{ meta.description }</p>
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
                          { sales.filter(sale => sale.token_id.match(new RegExp(nft.token_id, "i"))).map(sellable =>
                              <><span className="span-price">Price</span>
                          <div className="price-wrapper">
                              <div className="price">
                                  { sellable.sale_conditions } - NEAR
                              </div>
                          </div>
                          <div className="sell-wrapper">
                               {props.user !== nft.owner_id ? (
                                          <ModalBuy token_id={nft.token_id} sale_conditions={sellable.sale_conditions} user={props.user} nearConfig={props.nearConfig} walletConnection={props.walletConnection} parseNearAmount={props.parseNearAmount} />
                                      ) : null}
                          </div>
                          </> )
                          }
                       </Card.Body>
                  </Card>
              </Col>
          </Row>
    </Container>
  )
}
