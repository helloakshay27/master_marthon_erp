import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { baseURL } from "../../../confi/apiDomain";

const ConvertToAuctionModal = ({ show, handleClose }) => {
  const [useRFQQuotes, setUseRFQQuotes] = useState(false);
  const [allInvited, setAllInvited] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const { eventId } = useParams();
  const navigate = useNavigate();

  console.log("Event ID from Params:", eventId);

  const handleSave = async () => {
    setLoading(true);

    const apiUrl = `${baseURL}rfq/events/${eventId}/convert_to_auction?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    const payload = {
      include_bid: useRFQQuotes ? "true" : "false",
      include_all: allInvited ? "true" : "false",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("Converted to auction successfully!");

      handleClose(); // Close the modal

      // Extract new event ID from response
      const newEventId = data?.id || eventId; // Use eventId as fallback if no ID is returned

      console.log("Navigating to edit event:", newEventId);

      // Redirect to Edit Event page with new event ID
      navigate(`/edit-event/${newEventId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to convert RFQ to auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Convert to Auction"
      footerButtons={[
        {
          label: "Cancel",
          onClick: handleClose,
          props: { className: "purple-btn1" },
        },
        {
          label: loading ? "Saving..." : "Save",
          onClick: handleSave,
          props: { className: "purple-btn2", disabled: loading },
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
