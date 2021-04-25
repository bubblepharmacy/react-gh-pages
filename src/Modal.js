import React, { useRef, useState } from 'react'


import ReactDOM from 'react-dom';

const Modal = ({ isShowing, hide, t, l , d, u }) => isShowing ? ReactDOM.createPortal(
  <React.Fragment>
    <div className="modal-overlay"/>
    <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
      <div className="modal modal-style">
        <div className="modal-header">
          <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <p>{t}</p>
        <p>{l}</p>
        <h1>{d}</h1>
        <a target="_blank" href={u}>View More</a>
      </div>
    </div>
  </React.Fragment>, document.body
) : null;

export default Modal;
