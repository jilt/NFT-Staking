import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Route, useParams, Routes } from "react-router-dom";


export default function Image(props) {
    
  const [mediaResult, setMediaResult] = useState("");

useEffect(() => {
            loadNewMedia();
    }, []);
    
    const loadNewMedia = async (props.media) => {
        console.log(`${props.media}`);
        let cond = await props.media;
            let delimiter = '/';
            let start = 6;
            let tokens = await cond.split(delimiter).slice(4, start);
            let resulting = await tokens.join(delimiter);
            let mediaResult = await "https://nftstorage.link/ipfs/"+ resulting;
            setMediaResult(mediaResult);
            console.log(mediaResult);
    };
  
  return (
            <Card.Img variant="top" src={ props.media.includes("cloudflare") ? 
                mediaResult : props.media } />
  )
}
