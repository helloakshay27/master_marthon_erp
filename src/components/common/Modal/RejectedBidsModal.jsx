import React, { useState, useEffect } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const RejectedBidsModal = ({ show, handleClose }) => {
  const [rejectedBids, setRejectedBids] = useState([]);

  useEffect(() => {
    if (show) {
      fetchRejectedBids();
    }
  }, [show]);

  // Fetch the rejected bids data
  const fetchRejectedBids = async () => {
    try {
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events/8/rejected_bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=7397"
      );
      const data = await response.json();

      // Assuming the data structure is as shown in your example
      setRejectedBids(data.bids);
    } catch (error) {
      console.error("Error fetching rejected bids:", error);
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <DynamicModalBox show={show} onHide={handleClose} title="Rejected Bids">
      {/* <div
        id="participation-summary"
        className=""
        style={{ paddingLeft: "24px" }}
      > */}
      <div className="card card-body rounded-3 p-3">
        <div className="tbl-container ">
          <table className="w-100 table">
            <thead>
              <tr>
                <th className="text-start">Sr. No.</th>
                <th className="text-start">Event Title</th>
                <th className="text-start">Status</th>
                <th className="text-start">Created By</th>
                <th className="text-start"> Withdraw Reason</th>
              </tr>
            </thead>
            <tbody>
              {rejectedBids.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No rejected bids found for this event
                  </td>
                </tr>
              ) : (
                rejectedBids.map((bid, index) => (
                  <tr key={bid.id}>
                    <td className="text-start" style={{ color: "#777777" }}>
                      {index + 1}
                    </td>
                    <td className="text-start" style={{ color: "#777777" }}>
                      [{bid.event.event_no}] {bid.event.event_title}
                    </td>
                    <td className="text-start" style={{ color: "#777777" }}>
                      {bid.event.status}
                    </td>
                    <td className="text-start" style={{ color: "#777777" }}>
                      {bid.event.created_by}
                    </td>
                    <td className="text-start" style={{ color: "#777777" }}>
                      {bid.event.withdraw_reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* </div> */}
    </DynamicModalBox>
  );
};

export default RejectedBidsModal;
