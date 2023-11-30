import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Route, useParams, Routes } from "react-router-dom";


export default function Image(props) {
    
  const [mediaResult, setMediaResult] = useState("");

useEffect(() => {
            loadNewMedia();
            console.log(props.media);
    }, []);
    
    const loadNewMedia = () => {
            let mediaResult = "https://nftstorage.link/ipfs/";
            setMediaResult(mediaResult);
    };
  
  return (
            <Card.Img variant="top" src={ props.media.includes("cloudflare") ? 
                mediaResult + props.media.split('/').slice(4, 6).join('/') : props.media } />
  )
}
