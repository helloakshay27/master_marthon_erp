import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import NotificationIcon from "../Icon/NotificationIcon";

const NotificationRow = ({ content }) => (
  <div className="d-flex align-items-center justify-content-between mt-3">
    <p>{content}</p>
    <div>
      <NotificationIcon />
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
