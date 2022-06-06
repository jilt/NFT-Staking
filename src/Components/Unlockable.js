import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { useFilePicker } from "use-file-picker";

export default function Unlockable({ onSubmit, currentUser, handleChangeFile, files }) {
	 const [openFileSelector, { filesContent, loading, errors, plainFiles, clear }] = useFilePicker({
     multiple: true,
     readAs: 'DataURL',
	 readFilesContent: false,
     });
	 if (errors.length) {
		return (
			<div>
				<button onClick={() => openFileSelector()}>Something went wrong, retry! </button>
			</div>
		);
	}
	if (loading) {
    return <div>Loading...</div>;
	}
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
          <p className="highlight">
          <label htmlFor="upload">Upload unlockable secret content for your NFT:</label><br/>
          <label htmlFor="file-input" type="button" className="inputFile">
            Select file
          </label>
          <input id="file-input" type="file"  onChange={handleChangeFile} hidden={true} required={true}/>
		  <button onClick={() => clear()}>Clear</button>
		  <br/>
		  Number of selected files:
		  {files?.length > 0 ? " " + files.length : " " + 0}
		  <br/>
		  {/* If readAs is set to DataURL, You can display an image */}
		  {!!filesContent.length && <img src={filesContent[0].content} />}
		  <br/>
		  {plainFiles.map(file => (
		  <div key={file.name}>{file.name}</div>
		  ))}
		  </p>
        </p>
        <button type="submit">
          Upload
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
