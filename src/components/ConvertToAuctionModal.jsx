import React, { useState } from 'react';  
import { Modal, Button, Form } from 'react-bootstrap';  

const ConvertToAuctionModal = ({ show, handleClose }) => {  
  const [initialBid, setInitialBid] = useState('');  

  return (  
    <>
    <Modal show={show} onHide={handleClose}>  
      <Modal.Header closeButton>  
      <h4
          className="modal-title text-center w-100"
          id="exampleModalLabel"
          style={{ fontWeight: 500 }}
        >
          Convert to Auction
        </h4>
      </Modal.Header>  
      <Modal.Body>  
      <div className="row justify-content-between align-items-center">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="initialBid" className="form-label">
                INITIAL BID
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="initialBid"
                  name="contentSelector"
                  defaultValue="content1"
                />
                <label className="form-check-label" htmlFor="initialBid">
                  Use RFQ quotes as initial bids
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <div className="form-group">
              <label htmlFor="participants" className="form-label">
                Participants
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="participants"
                  name="contentSelector"
                  defaultValue="content2"
                />
                <label className="form-check-label" htmlFor="participants">
                  All Invited
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
  id="Convert"
  tabIndex={-1}
  aria-labelledby="exampleModal2Label"
  style={{ display: "none" }}
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-scrollable" style={{ width: 400 }}>
    <div className="modal-content">
      <div className="modal-header modal-header-k">
        <h4
          className="modal-title text-center w-100"
          id="exampleModalLabel"
          style={{ fontWeight: 500 }}
        >
          Convert to Auction
        </h4>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div className="modal-body">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="initialBid" className="form-label">
                INITIAL BID
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="initialBid"
                  name="contentSelector"
                  defaultValue="content1"
                />
                <label className="form-check-label" htmlFor="initialBid">
                  Use RFQ quotes as initial bids
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <div className="form-group">
              <label htmlFor="participants" className="form-label">
                Participants
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="participants"
                  name="contentSelector"
                  defaultValue="content2"
                />
                <label className="form-check-label" htmlFor="participants">
                  All Invited
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

export default ConvertToAuctionModal;