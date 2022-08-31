import React, { useEffect, useState } from "react";
// React and custom Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// packakages imports
import { Nav, Navbar, Container, Row } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from "react-helmet";

// pages
import Intro from './Collections';
import ArtDetails from './ArtDetails';

// Assets
import Logo from "./assets/logo-white.svg";
import * as nearAPI from "near-api-js";


const App = ({ currentUser, nearConfig, walletConnection }) => {
  const {
    utils: {
      format: { parseNearAmount },
    },
  } = nearAPI;



  const signIn = () => {
    walletConnection.requestSignIn(
      nearConfig.contractName,
      "", // title. Optional, by the way
      "", // successUrl. Optional, by the way
      "" // failureUrl. Optional, by the way
    );
  };

  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };


  return (
      <React.Fragment>
          {" "}
          <BrowserRouter>
              <Helmet>
                  <meta charSet="utf-8" />
                  <title>Varda NFT ART Market</title>
                  <link rel="canonical" href="https://market.varda.vision" />
                  <meta name="description" content="Varda Near Protocol NFT market, with unlockable content" />
                  <meta name="keywords" content="nft, marketplace, unlockable content, near protocol" />
              </Helmet>
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
              <Routes>
                  <Route
                      path="/"
                      element={<Intro user={currentUser} nearConfig={nearConfig} walletConnection={walletConnection} parseNearAmount={parseNearAmount} coll="Wild Pinups" desc="Created by Jilt and Valeriia Derrick, forever Royalties to Ukraine DAO" coll1="Galdrastafir" desc1="TAP to play game, mint your daily protection strategy in symbols, play to earn for Genesis NFT owners." coll2="Elvenland" desc2="NFT to unlock your Elvenland metaverse plot, that comes with built-in DeFi play to earn tools, collab with a great crypto artist." />}
                  />
                  <Route
                      path="/art/:id/*" element={<ArtDetails user={currentUser} nearConfig={nearConfig} walletConnection={walletConnection} parseNearAmount={parseNearAmount} /> } />
               </Routes>
              <Container style={{ marginTop: "3vh" }}>
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
                              <Nav.Link href="https://www.varda.vision" target="_blank" title="Main Project">Project</Nav.Link>
                                  <Nav.Link href="https://game.varda.vision" target="_blank" title="Play to Earn">Game</Nav.Link>
                                  <Nav.Link href="https://instagram.com/varda.vision" target="_blank" title="Instagram">Instagram</Nav.Link>
                                  <Nav.Link href="https://discord.gg/FvuY84TyTt" target="_blank" title="Discord">Discord</Nav.Link>
                          </Nav>
                      </Container>
                  </Navbar>
              </Row>
              </Container>
          </BrowserRouter>
      </React.Fragment>
  );
};

export default App;
