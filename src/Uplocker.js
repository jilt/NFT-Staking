import React, { useEffect, useState } from 'react';
import { useFilePicker } from "use-file-picker";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

const Uplocker = (props) => {
	const [files, setFiles] = useState(null);
	const [unlock, setUnlock] = useState('');
	const [link, setLink] = useState('');
	
// filecoin file upload

	const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEM3MjJiZjA0MDA2MkYwOGJjNThCNWZmMGI1MjVGNjk5NkYzOGI1NmIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQwODg3MzA1ODcsIm5hbWUiOiJNYXJrZXRwbGFjZS10ZXN0aW5nIn0.cR9NH6X2SLmr9B_3aW2cMyq3xvgtMAcuwOhdVEr1apE' });
	
	const [openFileSelector, { filesContent, errors, plainFiles, clear }] = useFilePicker({
     multiple: true,
     readAs: 'DataURL',
	 readFilesContent: false,
     });
	 if (errors.length) {
		return (
			<div>
				<button className="form-btn" onClick={() => openFileSelector()}>Something went wrong, retry! </button>
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
		<button className="form-btn">
			<label htmlFor="file-input" type="button" className="inputFile">
			Select file
			</label>
		</button>
		<input id="file-input" className="input-box" type="file" name="file" placeholder="Select file" onChange={handleChangeFile} hidden={true} required={false}/>
		<br/>
		Number of selected files:
		{files?.length > 0 ? " " + files.length : " " + 0}
		{/* If readAs is set to DataURL, You can display an image */}
		{!!filesContent.length && <img src={filesContent[0].content} />}
		<br/>
		{plainFiles.map(file => (
		<div key={file.name}>{file.name}</div>
		))}
		<br />
		<button className="form-btn" onClick={() => clear()}>Clear</button>
		<br />
		<button className="form-btn" onClick={() => client.put(files).then(async (rootCid) => {
		setUnlock( rootCid );
		console.log(rootCid);
		},
		).catch(console.error)}>
		Upload
		</button>
		<div className="box-wrapper">
            <div className="box-in-wrapper">
                <div className="input-wrapper">
					<input className="input-box" placeholder="Custom Unlockable Link" value={link} onChange={(e) => setLink(e.target.value)} />
				</div>
			</div>
		</div>
		<button className="form-btn" onClick={() => { handleUnlock()}}>
            Save Unlockable
        </button>
	</>
  )
}

export default Uplocker