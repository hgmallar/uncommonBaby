import React from "react";
import "./styles.css";

function Modal(props) {
  const showHideStyle = props.show ? "block" : "none";
  return (
    <div className="modal" role="dialog" style={{ display: showHideStyle }}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{props.title}</h5>
          <button
            type="button"
            className="close white"
            onClick={props.handleClose}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{props.message}</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={props.handleClose}
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
