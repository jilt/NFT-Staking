import React, { useEffect, useState } from "react";
// React and custom Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MintingTool from "./MintingTool";
import useModal from "./useModal";
import Modal from "./Modal";
import nearLogo from "./assets/logo-white.svg";
// near config
import getConfig from "./config";
const { nearConfig } = getConfig(process.env.NODE_ENV || "development");
import * as nearAPI from "near-api-js";

// React Bootstraps imports
import { Nav, Navbar, Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';


const initialValues = {
    assetTitle: "",
    assetDescription: "",
    assetUrl: "",
    assetPrice: "",
    assetBid: "",
};

const App = ({ currentUser, nearConfig, walletConnection }) => {
    const {
        utils: {
            format: { parseNearAmount },
        },
    } = nearAPI;
    const [showLoader, setShowLoader] = useState(false);
    const [values, setValues] = useState(initialValues);
    // state for minting allowance
    const [userHasNFT, setuserHasNFT] = useState(false);
    // state to get storage data
    const [stfetchUrl, setUploads] = useState([])
    // state to get storage db
    const [straw, setDb] = useState([])
    const [dbUnlock, setdbUnlock] = useState([])


    const {
        isVisible,
        isVisibleSale,
        isVisibleBid,
        toggleModal,
        toggleSaleModal,
        toggleBidModal,
    } = useModal();

    const [nftResults, setNftResults] = useState([]);

    const [nftMarketResults, setNftMarketResults] = useState([]);
    const [minimum, setMinimum] = useState("");

    const signIn = () => {
        walletConnection.requestSignIn(
            nearConfig.contractName,
            "", // title. Optional, by the way
            "", // successUrl. Optional, by the way
            "" // failureUrl. Optional, by the way
        );
        sendMeta();
    };

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

    useEffect(() => {
        const allowList = async () => {
            const listAllow = ['jilt.testnet', 'khbuilder.testnet', 'helpme.testnet'];
            {
                listAllow.filter(allowed => {
                    if (allowed === window.accountId) {
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

    //set vault's web3.storage API token

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

    // get unlockable to owned NFT

    function getUnlock() {
        const dbUnlock = straw
        setdbUnlock(dbUnlock)
    }

    const loadSaleItems = async () => {
        let nftTokens = await walletConnection
            .account()
            .viewFunction(nearConfig.contractName, "nft_tokens", {
                from_index: "0",
                limit: 64,
            });

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
    const getMinimumStorage = async () => {
        let minimum_balance = await walletConnection
            .account()
            .viewFunction(nearConfig.marketContractName, "storage_minimum_balance");
        setMinimum(minimum_balance);

    };

    const sendStorageDeposit = async () => {
        getMinimumStorage();
        await walletConnection.account().functionCall({
            contractId: nearConfig.marketContractName,
            methodName: "storage_deposit",
            args: {},

            attachedDeposit: minimum,
        });
    };

    const sendMeta = async () => {
        let functionCallResult = await walletConnection.account().functionCall({
            contractId: nearConfig.contractName,
            methodName: "new_default_meta",
            args: {
                owner_id: nearConfig.contractName,
            },
            attachedDeposit: 0,
            walletMeta: "",
            wallerCallbackUrl: "",
        });

        if (functionCallResult) {
            console.log("new meta data created: ");
        } else {
            console.log("meta data not created");
        }
    };

    const mintAssetToNft = async () => {
        toggleModal();
        let functionCallResult = await walletConnection.account().functionCall({
            contractId: nearConfig.contractName,
            methodName: "nft_mint",
            args: {
                token_id: `${values.assetTitle}`,
                metadata: {
                    title: `${values.assetTitle}`,
                    description: `${values.assetDescription}`,
                    media: `${values.assetUrl}`,
                },
                gas: nearConfig.GAS,
                receiver_id: currentUser,
            },
            attachedDeposit: parseNearAmount("1"),
        });

        if (functionCallResult) {
            console.log("nft created: ");
        } else {
            console.log("nft not created");
        }
    };

    const approveNFTForSale = async (token_id) => {
        sendStorageDeposit();
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
                nft_contract_id: nearConfig.marketContractName,
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

    const signOut = () => {
        walletConnection.signOut();
        window.location.replace(window.location.origin + window.location.pathname);
    };

    return (
        <div>
            <header className="top-header">
                <div className="menu">
                    <div className="navbar-left">
                        <h3> NFT MARKET</h3>
                    </div>
                    <nav className="navbar">
                        <ul className="navbar-ul">
                            <li className="navbar-li pt-3 pr-2">
                                {currentUser ? (
                                    <button href="#" className="log-link" onClick={signOut}>
                                        Log out
                                    </button>
                                ) : (
                                    <button href="#" className="log-link" onClick={signIn}>
                                        Log In
                                    </button>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="main-wrapper">
                <div className="wrapper">
                    <MintingTool userNFTStatus={userHasNFT} user={currentUser} db={straw} onAdd={addUnlock} />
                </div>
            </main>

            <div className="gallery-wrapper">
                {nftResults
                    ? nftResults.map((nft, index) => (
                        <div className="outter-wrapper" key={index}>
                            <Modal
                                isVisibleSale={isVisibleSale}
                                hideModal={toggleSaleModal}
                            >
                                <div className="outform-wrapper">
                                    <div className="form-wrapper">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                approveNFTForSale(nft.metadata.title);
                                            }}
                                        >
                                            <div className="form-in-wrapper">
                                                <h3 className="text-center pb-1">SELL NFT</h3>

                                                <div className="box-wrapper">
                                                    <div className="box-in-wrapper">
                                                        <div className="input-wrapper">
                                                            <input
                                                                className="input-box"
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
                                                    <button className="form-btn">Sell now</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Modal>
                            <article className="card-wrapper">
                                <a className="asset-anchor" href="#">
                                    <div className="asset-anchor-wrapper">
                                        <div className="asset-anchor-wrapper-inner">
                                            <div className="asset-anchor-wrapper-inner-2">
                                                <img
                                                    src={nft.metadata.media}
                                                    className="img-wrapper"
                                                    alt="NFT Token"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="details-wrapper">
                                        <div className="details-title-wrapper">
                                            <div className="details-title-left-wrapper">
                                                <div className="details-title-left-wrapper-inner-1">
                                                    {nft.metadata.title}
                                                </div>
                                                <div className="details-title-left-wrapper-inner-2">
                                                    {nft.owner_id}
                                                </div>
                                            </div>
                                            <div className="details-title-right-wrapper">
                                                <div className="details-assets-right-wrapper-inner-1">
                                                    <span className="span-price">Price</span>
                                                    <div className="price-wrapper">
                                                        <div className="near-symbol">
                                                            <img
                                                                className="near-logo"
                                                                src={nearLogo}
                                                                alt="near logo"
                                                            />
                                                        </div>
                                                        <div className="price">-</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sell-wrapper">
                                        <button className="form-btn" onClick={toggleSaleModal}>
                                            Sell now
                                        </button>
                                    </div>
                                </a>
                            </article>
                        </div>
                    ))
                    : "NFTs not found"}
            </div>

            <div className="market-wrapper">
                <div className="market-inner-wrapper">
                    {nftMarketResults.length !== 0 ? (
                        <div className="market-header">
                            <h3>Market Place</h3>
                        </div>
                    ) : null}

                    <div className="market-result-wrapper">
                        {nftMarketResults
                            ? nftMarketResults.map((nft, index) => (
                                <div className="outter-wrapper" key={index}>
                                    <Modal
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
                                                        <h3 className="text-center pb-1">BID</h3>

                                                        <div className="box-wrapper">
                                                            <div className="box-in-wrapper">
                                                                <div className="input-wrapper">
                                                                    <input
                                                                        className="input-box"
                                                                        placeholder="Add bid price"
                                                                        name="assetBid"
                                                                        type="text"
                                                                        value={values.assetBid}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-btn-wrapper">
                                                            <button className="form-btn">Enter Bid</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Modal>
                                    <article className="card-wrapper">
                                        <a className="asset-anchor" href="#">
                                            <div className="asset-anchor-wrapper">
                                                <div className="asset-anchor-wrapper-inner">
                                                    <div className="asset-anchor-wrapper-inner-2">
                                                        <img
                                                            src={nft.metadata.media}
                                                            className="img-wrapper"
                                                            alt="NFT Token"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="details-wrapper">
                                                <div className="details-title-wrapper">
                                                    <div className="details-title-left-wrapper">
                                                        <div className="details-title-left-wrapper-inner-1">
                                                            {nft.token_id}
                                                        </div>
                                                        <div className="details-title-left-wrapper-inner-2">
                                                            {nft.owner_id}
                                                        </div>
                                                    </div>
                                                    <div className="details-title-right-wrapper">
                                                        <div className="details-assets-right-wrapper-inner-1">
                                                            <span className="span-price">Price</span>
                                                            <div className="price-wrapper">
                                                                <div className="near-symbol">
                                                                    <img
                                                                        className="near-logo"
                                                                        src={nearLogo}
                                                                        alt="near logo"
                                                                    />
                                                                </div>
                                                                <div className="price">
                                                                    {nft.sale_conditions}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>

                                        <div className="sell-wrapper">
                                            {currentUser !== nft.owner_id ? (
                                                <button className="form-btn" onClick={toggleBidModal}>
                                                    Bid
                                                </button>
                                            ) : null}
                                        </div>
                                    </article>
                                </div>
                            ))
                            : "Market NFTs not found"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
