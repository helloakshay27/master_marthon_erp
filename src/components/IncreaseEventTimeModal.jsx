import React, { useState } from 'react';  
import { Modal, Button } from 'react-bootstrap';  

const IncreaseEventTimeModal = ({ show, handleClose }) => {  
  const [timeIncrease, setTimeIncrease] = useState('10');  

  return (  
    <>
    <Modal show={show} onHide={handleClose}>  
      <Modal.Header closeButton>  
      <h4
          className="modal-title text-center w-100"
          id="exampleModalLabel"
          style={{ fontWeight: 500 }}
        >
          Increase Event Time
        </h4>
      </Modal.Header>  
      <Modal.Body>  
      <div className="row  justify-content-between align-items-center">
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">10 Minutes</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">30 Minutes</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">7 Days</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">Custom</label>
              </div>
            </div>
          </div>
          <div className="col-md-3 mt-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">Fixed Time</label>
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
  id="Extend"
  tabIndex={-1}
  aria-labelledby="exampleModal2Label"
  style={{ display: "none" }}
  aria-hidden="true"
>
  <div className="modal-dialog  modal-dialog-scrollable" style={{ width: 700 }}>
    <div className="modal-content">
      <div className="modal-header modal-header-k">
        
      </div>
      <div className="modal-body my-3">
        <div className="row  justify-content-between align-items-center">
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">10 Minutes</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">30 Minutes</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">7 Days</label>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">Custom</label>
              </div>
            </div>
          </div>
          <div className="col-md-3 mt-3">
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contentSelector"
                  defaultValue="content1"
                  defaultChecked=""
                />
                <label className="form-check-label">Fixed Time</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer justify-content-center">
        <button className="purple-btn1">Cancel</button>
        <button className="purple-btn2">Save</button>
      </div>
    </div>
  </div>
</div>

    </>
    
    
  );  
};  

export default IncreaseEventTimeModal;