import React from "react";
import { Modal } from "react-bootstrap";

const NotificationInfoModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h4 className="modal-title text-center w-100" id="exampleModalLabel">
          Notification Information
        </h4>
      </Modal.Header>
      <Modal.Body>
        <nav>
          <div
            className="nav nav-tabs mt-4 d-flex align-items-center"
            id="nav-tab"
            role="tablist"
          >
            <button
              className="nav-link active setting-link"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              Sent
            </button>
            <button
              className="nav-link setting-link"
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              Delivered
            </button>
            <button
              className="nav-link setting-link"
              id="nav-seen-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-sent"
              type="button"
              role="tab"
              aria-controls="nav-sent"
              aria-selected="false"
            >
              Seen
            </button>
            <div className="purple-btn1 m-0">Sent Again</div>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabIndex={0}
          >
            {[...Array(6)].map((_, index) => (
              <div
                className="event-setting-trMain mt-3 d-flex align-items-center"
                key={index}
              >
                <div className="event-setting-child d-flex align-items-center event-setting-child-main">
                  <p className="event-setting-p1">
                    MAHESH TIMBER AND ASSOCIATES LLP
                  </p>
                </div>
                <div className="event-setting-child event-setting-child-icon">
                  <i
                    className="fa-solid fa-bell"
                    style={{ color: "var(--red)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabIndex={0}
          >
            {/* Content for Delivered notifications */}
            {[...Array(6)].map((_, index) => (
              <div
                className="event-setting-trMain mt-3 d-flex align-items-center"
                key={index}
              >
                <div className="event-setting-child d-flex align-items-center event-setting-child-main">
                  <p className="event-setting-p1">
                    DELIVERED NOTIFICATION {index + 1}
                  </p>
                </div>
                <div className="event-setting-child event-setting-child-icon">
                  <i
                    className="fa-solid fa-check"
                    style={{ color: "var(--green)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="tab-pane fade"
            id="nav-sent"
            role="tabpanel"
            aria-labelledby="nav-sent-tab"
            tabIndex={0}
          >
            {/* Content for Seen notifications */}
            {[...Array(6)].map((_, index) => (
              <div
                className="event-setting-trMain mt-3 d-flex align-items-center"
                key={index}
              >
                <div className="event-setting-child d-flex align-items-center event-setting-child-main">
                  <p className="event-setting-p1">
                    SEEN NOTIFICATION {index + 1}
                  </p>
                </div>
                <div className="event-setting-child event-setting-child-icon">
                  <i
                    className="fa-solid fa-eye"
                    style={{ color: "var(--blue)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div></div>
        <div class="modal-footer justify-content-center">
          <button class="purple-btn1" onClick={handleClose} >Cancel</button>
          <button class="purple-btn2" onClick={handleClose} >Save</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NotificationInfoModal;
