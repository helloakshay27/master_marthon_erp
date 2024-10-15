import React from 'react';  
import { Modal, Button } from 'react-bootstrap';  

const RejectedBidsModal = ({ show, handleClose }) => {  
  return (  
    <>
    <Modal show={show} onHide={handleClose}>  
      <Modal.Header closeButton>  
      <h4
          className="modal-title text-center w-100"
          id="exampleModalLabel"
          style={{ fontWeight: 500 }}
        >
          Rejected Bids
        </h4> 
      </Modal.Header>  
      <Modal.Body>  
      <div className="row justify-content-between align-items-center">
          <div className="col-md-12 text-center">
            <div className="form-group">
              <div className="form-check">
                <label className="form-check-label">
                  No bids rejected for this event
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>  
      <div className="modal-footer justify-content-center">
        <button className="purple-btn1" onClick={handleClose}>Cancel</button>
        <button className="purple-btn2" onClick={handleClose}>Save</button>
      </div>
    </Modal> 

    <div
  className="modal fade"
  id="Rejected"
  tabIndex={-1}
  aria-labelledby="exampleModal2Label"
  style={{ display: "none" }}
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-scrollable" style={{ width: 700 }}>
    <div className="modal-content">
      <div className="modal-header modal-header-k">
        
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div className="modal-body my-3">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-12 text-center">
            <div className="form-group">
              <div className="form-check">
                <label className="form-check-label">
                  No bids rejected for this event
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer justify-content-center">
        <button className="purple-btn1" data-bs-dismiss="modal">Cancel</button>
        <button className="purple-btn2">Save</button>
      </div>
    </div>
  </div>
</div>

    </> 
  );  
};  

export default RejectedBidsModal;