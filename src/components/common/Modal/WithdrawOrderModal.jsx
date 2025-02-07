import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const WithdrawOrderModal = ({ show, handleClose }) => {
  const [withdrawReason, setWithdrawReason] = useState("");

  const { eventId } = useParams();

  const [eventData, setEventData] = useState(null); // To store fetched event data

  const [vendorId, setVendorId] = useState(() => {
    // Retrieve the vendorId from sessionStorage or default to an empty string
    return sessionStorage.getItem("vendorId") || "";
  });

  const handleSave = async () => {
    const payload = {
      withdraw_reason: withdrawReason,
    };

    try {
      const response = await fetch(
        `https://marathon.lockated.com/rfq/events/${eventId}/event_withdraw?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Handle success
        console.log("Event withdrawn successfully:", data);
        alert("Event withdrawn successfully");

        handleClose(); // Close the modal
      } else {
        // Handle error
        console.error("Error withdrawing event:", data);

        alert("Failed to withdraw event. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
          onClick: handleSave, // Call handleSave function on Save
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
            <input
              className="form-control"
              type="text"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
            />
          </div>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default WithdrawOrderModal;
