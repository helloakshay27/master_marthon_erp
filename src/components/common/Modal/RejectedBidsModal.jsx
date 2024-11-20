import React from "react";
import { Modal } from "react-bootstrap";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const RejectedBidsModal = ({ show, handleClose }) => {
  return (
    <>
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        title="Rejected Bids"
        footerButtons={[
          {
            label: "Cancel",
            onClick: handleClose,
            props: { className: "purple-btn1" },
          },
          {
            label: "Save",
            onClick: handleClose,
            props: { className: "purple-btn2" },
          },
        ]}
      >
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
      </DynamicModalBox>
    </>
  );
};

export default RejectedBidsModal;
