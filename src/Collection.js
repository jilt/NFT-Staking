import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Alert, Col } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import { useFilePicker } from "use-file-picker";

// Modal for collections

const Dialog = (props) => {
	// states for modal to open
	
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullscreen, setFullscreen] = useState(true);
  
  //states for unlockables
  
  	const [files, setFiles] = useState(null);
	const [unlock, setUnlock] = useState('');
	const [link, setLink] = useState('');

	const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEM3MjJiZjA0MDA2MkYwOGJjNThCNWZmMGI1MjVGNjk5NkYzOGI1NmIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQwODg3MzA1ODcsIm5hbWUiOiJNYXJrZXRwbGFjZS10ZXN0aW5nIn0.cR9NH6X2SLmr9B_3aW2cMyq3xvgtMAcuwOhdVEr1apE' });

//handle state form change when value is added
	const handleChange = (event) => {
		
		setValues((values) => ({
			...values,
		[event.target.name]: event.target.value,
		}));
	};
	
  	const [openFileSelector, { filesContent, errors, plainFiles, clear }] = useFilePicker({
     multiple: true,
     readAs: 'DataURL',
	 readFilesContent: false,
     });
	 if (errors.length) {
		return (
			<div>
				<Button variant="outline-primary" onClick={() => openFileSelector()}>Something went wrong, retry! </Button>
			</div>
		);
	}
	
	const handleChangeFile = (e) => {
		const files = e.target.files;
		setFiles(files);
	}
	
	const handleUnlock = async (token_id)=> {
		var id = props.token_id
		var CID = unlock
	  
		if (CID && link) {
			alert('you can add only a CID or a link')
			return
		}
		if (!CID && !link){
			alert('please add either a link or a CID to submit')
			return
		}
	  
	  	props.onAdd({id ,CID ,link})
		
	}
  

  return (
    <>
      
        {props.cfa ? ( <Button variant="outline-primary" style={{ margin: "1vh" }} onClick={handleShow}>{props.cfa}</Button> ) : ( <Button variant="outline-primary" onClick={handleShow}>Add Unlockable</Button> )}
      

      <Modal show={show} onHide={handleClose} fullscreen={fullscreen}>
        <Modal.Header closeButton>
		  {props.collection ? ( <Modal.Title>{props.collection}</Modal.Title> ) :( <Modal.Title>Set Unlockable</Modal.Title> )}
        </Modal.Header>
		{props.collection ? ( <Modal.Body>Woohoo, this is the NFT collection!</Modal.Body> ) : ( 
				<Modal.Body>
				<Accordion flush>
					<Accordion.Item eventKey="0">
						<Accordion.Header>File</Accordion.Header>
						<Accordion.Body>
							<p className="highlight">
								<Button variant="outline-primary">
									<label htmlFor="file-input" type="button" className="inputFile">
									Select file
									</label>
								</Button>
								<input id="file-input" type="file" placeholder="Select file" onChange={handleChangeFile} hidden={true} required={true}/>
							<br/>
							Number of selected files:
							{files?.length > 0 ? " " + files.length : " " + 0}
							{/* If readAs is set to DataURL, You can display an image */}
							{!!filesContent.length && <img src={filesContent[0].content} />}
							<br/>
							{plainFiles.map(file => (
							<div key={file.name}>{file.name}</div>
							))}
							</p>
							<Button variant="outline-primary" onClick={() => clear()}>Clear</Button>
							<Button variant="outline-primary" style={{ margin: "1vh" }} onClick={() => client.put(files).then(async (rootCid) => {
								setUnlock(rootCid);
								handleUnlock();
								handleClose();
							},
							).catch(console.error)}>
							Upload
							</Button>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Link</Accordion.Header>
						<Accordion.Body>
							<input style={{ margin: "1vh" }} className="full-width" placeholder="Custom Unlockable Link" value={link} onChange={(e) => setLink(e.target.value)} />
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
				</Modal.Body>
		)}
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleClose}>
            Close
          </Button>
				  <Button variant="outline-primary" onClick={() => { handleUnlock(); handleClose(); }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Dialog;