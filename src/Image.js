import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Route, useParams, Routes } from "react-router-dom";


export default function Image(props) {
    
  const [mediaResult, setMediaResult] = useState("");

    useEffect(() => {
            loadNewMedia();
    }, []);
    
    const loadNewMedia = async () => {
        let cond =  await props.media;
        let changing =  await cond.includes("cloudflare");
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
    };
  
  return (
            <Card.Img variant="top" src={ mediaResult } />
  )
}
