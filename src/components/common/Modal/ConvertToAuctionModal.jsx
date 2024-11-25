import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const ConvertToAuctionModal = ({ show, handleClose }) => {
  const [useRFQQuotes, setUseRFQQuotes] = useState(false);
  const [allInvited, setAllInvited] = useState(false);

  // @ts-ignore
  const handleSave = () => {
    console.log({
      useRFQQuotes,
      allInvited,
    });
    handleClose();
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Convert to Auction"
      footerButtons={[
        // @ts-ignore
        {
          label: "Cancel",
          onClick: handleClose,
          props: { className: "purple-btn1" },
        },
        // @ts-ignore
        {
          label: "Save",
          onClick: handleClose,
          props: { className: "purple-btn2" },
        },
      ]}
    >
      <div className="row justify-content-between align-items-center">
        {/* Initial Bid Section */}
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
                checked={useRFQQuotes}
                onChange={(e) => setUseRFQQuotes(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="initialBid">
                Use RFQ quotes as initial bids
              </label>
            </div>
          </div>
        </div>
        {/* Participants Section */}
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
                checked={allInvited}
                onChange={(e) => setAllInvited(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="participants">
                All Invited
              </label>
            </div>
          </div>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default ConvertToAuctionModal;
