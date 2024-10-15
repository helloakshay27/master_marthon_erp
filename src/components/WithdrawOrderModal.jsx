import React from "react";
import { Modal } from "react-bootstrap";

const WithdrawOrderModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h4 className="modal-title text-center w-100" id="exampleModalLabel" style={{ fontWeight: 500 }}>
          Withdrawing Order...
        </h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row justify-content-between align-items-center">
          <h5>Are you sure you want to withdraw this event?</h5>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="">
                Please enter a reason for withdrawing this event
              </label>
              <input className="form-control" type="text" />
            </div>
          </div>
        </div>
      </Modal.Body>
      <div className="modal-footer justify-content-center">
        <button className="purple-btn1" onClick={handleClose}>
          Cancel
        </button>
        <button className="purple-btn2" onClick={handleClose} >Save</button>
      </div>
    </Modal>
  );
};

export default WithdrawOrderModal;
