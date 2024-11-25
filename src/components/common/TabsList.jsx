import React from "react";
import { Dropdown } from "react-bootstrap";
import SettingIcon from "./Icon/SettingIcon";

const TabsList = ({ handleShowModal, renderModal }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Tabs Section */}
      <ul
        className="nav nav-tabs border-0"
        id="eventTabs"
        role="tablist"
      >
        {[
          { id: "responses", label: "Responses" },
          { id: "comparison", label: "Comparison" },
          { id: "overview", label: "Overview" },
          { id: "participants", label: "Participants" },
          { id: "analytics", label: "Analytics" },
          { id: "priceTrends", label: "Price Trends" },
          { id: "participantRemarks", label: "Participant Remarks" },
        ].map((tab) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link setting-link ${
                tab.id === "responses" ? "active" : ""
              }`}
              id={`${tab.id}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#${tab.id}`}
              type="button"
              role="tab"
              aria-controls={tab.id}
              aria-selected={tab.id === "responses"}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Dropdown Menu */}
      <div className="dropdown pe-4">
        <Dropdown>
          <Dropdown.Toggle
            variant="outline"
            className="btn dropdown-toggle purple-btn2"
            id="dropdownMenuButton"
          >
            <SettingIcon color={undefined} /> Setting
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {[
              { label: "Recreate Order", modalType: "Recreate" },
              { label: "Shared With", modalType: "Shared" },
              { label: "Extend Submission Time", modalType: "Extend" },
              { label: "Withdraw", modalType: "Withdraw" },
              { label: "Convert to Auction", modalType: "Convert" },
              { label: "Rejected Bids", modalType: "Rejected" },
              { label: "Order Activity", modalType: "Order" },
              { label: "Add Evaluation Time", modalType: "Evaluation" },
              { label: "Send Bulk Counter Offer", modalType: "Counter" },
            ].map((item) => (
              <Dropdown.Item
                key={item.modalType}
                onClick={() => handleShowModal(item.modalType)}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {renderModal()}
      </div>
    </div>
  );
};

export default TabsList;
