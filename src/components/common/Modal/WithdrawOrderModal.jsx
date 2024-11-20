import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const WithdrawOrderModal = ({ show, handleClose }) => {
  return (
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        title="Withdrawing Order..."
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
      </DynamicModalBox>
  );
};

export default WithdrawOrderModal;
