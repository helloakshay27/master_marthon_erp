import React from "react";
import { Modal } from "react-bootstrap";

const ActivityModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5 className="modal-title" id="activityModalLabel">
            Activity
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="activity">
            {[
              {
                text: "Asmita Salvi has extended the bidding time by 1 day.",
                time: "05 Apr 2024 at 03:56 pm",
                orderEnding: "15:29 → 15:55",
              },
              {
                text: "You edited the configurations.",
                time: "05 Apr 2024 at 11:29 am",
                change: "Show Best Price to Participants: Yes → No",
              },
              {
                text: "Asmita Salvi has extended the bidding time by 1 hour.",
                time: "05 Apr 2024 at 11:51 am",
                orderEnding: "14:55 → 15:55",
              },
              {
                text: "Asmita Salvi has extended the bidding time by 1 day 23 hours.",
                time: "04 Apr 2024 at 03:51 pm",
                orderEnding: "15:28 → 15:55",
              },
              {
                text: "Asmita Salvi has extended the bidding time by 3 hours.",
                time: "04 Apr 2024 at 10:56 am",
                orderEnding: "09:00 → 12:02",
              },
              {
                text: "LUCKY PLY AND LAMINATES has placed the bid.",
                time: "02 Apr 2024 at 09:08 pm",
              },
            ].map((activity, index) => (
              <div className="activity-item" key={index}>
                <p>{activity.text}</p>
                {activity.orderEnding && (
                  <small>
                    Order ending at <strong>{activity.orderEnding}</strong>
                  </small>
                )}
                {activity.change && <small>{activity.change}</small>}
                <small>{activity.time}</small>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActivityModal;
