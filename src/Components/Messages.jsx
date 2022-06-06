import React from 'react';
import PropTypes from 'prop-types';

export default function Messages({ messages }) {
  return (
    <>
      <h2>Uploads</h2>
      {messages.map((message, i) =>
        // TODO: format as cards, add timestamp
        {
          const d = new Date(parseInt(message.datetime)/1000000)
          let date = d.getDate();
          let month = d.getMonth() + 1;
          let year = d.getFullYear();
          let hour = d.getHours();
          let minute = d.getMinutes();
          let second = d.getSeconds();
          const formattedDate = `${date}.${month}.${year} ${hour}:${minute}:${second}`
		  const url = `https://${message.text}.ipfs.dweb.link/`;

          return <p key={i} className={message.premium ? 'is-premium' : ''}>
            <strong>{message.sender}</strong>:
            <p className="message-info"><a href={url} title="immutable stored files" target="_blank">Uploaded files</a><small>Was Uploaded on: {formattedDate}</small></p>
          </p>
        }
      )}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
