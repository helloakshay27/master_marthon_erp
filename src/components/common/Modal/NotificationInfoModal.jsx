import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const NotificationRow = ({ content }) => (
  <div className="d-flex align-items-center justify-content-between mt-3">
    <p>{content}</p>
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#8b0203"
        className="bi bi-bell-fill"
        viewBox="0 0 16 16"
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
      </svg>
    </div>
  </div>
);

const NotificationInfoModal = ({ show, handleClose }) => {
  const [activeTab, setActiveTab] = useState("sent");

  const tabs = [
    { id: "sent", label: "Sent", content: "MAHESH TIMBER AND ASSOCIATES LLP" },
    { id: "delivered", label: "Delivered", content: "DELIVERED NOTIFICATION" },
    { id: "seen", label: "Seen", content: "SEEN NOTIFICATION" },
  ];

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Notification Information"
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
      <nav className="mt-4">
        <div className="nav nav-tabs d-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? "active" : ""} setting-link`}
              onClick={() => setActiveTab(tab.id)} // Set active tab on click
            >
              {tab.label}
            </button>
          ))}
          <div className="ms-auto purple-btn1">Send Again</div>
        </div>
      </nav>

      <div className="tab-content mt-3">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? "show active" : ""}`}
          >
            {[...Array(6)].map((_, i) => (
              <NotificationRow
                key={i}
                content={`${tab.content} ${tab.id === "sent" ? "" : i + 1}`}
              />
            ))}
          </div>
        ))}
      </div>
    </DynamicModalBox>
  );
};

export default NotificationInfoModal;
