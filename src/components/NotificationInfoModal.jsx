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
                className="d-flex align-items-center justify-content-between mt-3"
                key={index}
              >
                <p>MAHESH TIMBER AND ASSOCIATES LLP</p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#8b0203"
                    class="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
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
                className="mt-3 d-flex align-items-center justify-content-between"
                key={index}
              >
                <p>
                  DELIVERED NOTIFICATION {index + 1}
                </p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#8b0203"
                    class="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
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
                className="mt-3 d-flex align-items-center justify-content-between"
                key={index}
              >
                  <p>
                    SEEN NOTIFICATION {index + 1}
                  </p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#8b0203"
                    class="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div></div>
        <div class="modal-footer justify-content-center">
          <button class="purple-btn1" onClick={handleClose}>
            Cancel
          </button>
          <button class="purple-btn2" onClick={handleClose}>
            Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NotificationInfoModal;
