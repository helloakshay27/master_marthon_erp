import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import RecreateOrderModal from '../components/common/Modal/RecreateOrderModal'
import NotificationInfoModal from "../components/common/Modal/NotificationInfoModal";
import IncreaseEventTimeModal from "../components/common/Modal/IncreaseEventTimeModal";
import WithdrawOrderModal from "../components/common/Modal/WithdrawOrderModal";
import ConvertToAuctionModal from "../components/common/Modal/ConvertToAuctionModal";
import RejectedBidsModal from "../components/common/Modal/RejectedBidsModal";
import ActivityModal from "../components/common/Modal/ActivityModal";
import AddEvaluationTimeModal from "../components/common/Modal/AddEvaluationTime";
import BulkCounterOfferModal from "../components/common/Modal/BulkCounterOfferModal";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AnalyticsTab, ClockIcon, ComparisonTab, OverviewTab, ParticipantsTab, SettingIcon } from "../components";
import PriceTrendsTab from "../components/common/Tab/PriceTrendsTab";
import ResponseTab from "../components/common/Tab/ResponseTab";

export default function ErpRfqDetailPriceTrends4h() {
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(true);
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);

  const participantsAccordion = () => {
    setParticipantsOpen(!participantsOpen);
  };
  const savingsAccordion = () => {
    setSavingsOpen(!savingsOpen);
  };
  const biddingsAccordion = () => {
    setBiddingOpen(!biddingOpen);
  };
  const productAccordion = () => {
    setProductOpen(!productOpen);
  };
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const toggleOthersAccordion = () => {
    setIsOthersOpen(!isOthersOpen);
  };

  const handleShowModal = (modalType) => {
    setCurrentModal(modalType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentModal(null);
  };

  const renderModal = () => {
    switch (currentModal) {
      // @ts-ignore
      case "Recreate":
        return (
          <>
            <RecreateOrderModal
              show={showModal}
              handleClose={handleCloseModal}
            />
          </>
        );
      // @ts-ignore
      case "Shared":
        return (
          <NotificationInfoModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      // @ts-ignore
      case "Extend":
        return (
          <IncreaseEventTimeModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      // @ts-ignore
      case "Withdraw":
        return (
          <WithdrawOrderModal show={showModal} handleClose={handleCloseModal} />
        );
      // @ts-ignore
      case "Convert":
        return (
          <ConvertToAuctionModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      // @ts-ignore
      case "Rejected":
        return (
          <RejectedBidsModal show={showModal} handleClose={handleCloseModal} />
        );
      // @ts-ignore
      case "Order":
        return (
          <ActivityModal show={showModal} handleClose={handleCloseModal} />
        );
      // @ts-ignore
      case "Evaluation":
        return (
          <AddEvaluationTimeModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      // @ts-ignore
      case "Counter":
        return (
          <BulkCounterOfferModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <div className="event-order-page">
              <div className=" event-tabs">
                <div>
                  <h4 className="event-head px-2 ">Events</h4>
                </div>
                <div className="eventList-main">
                  <div className="d-flex flex-row-reverse ">
                    <div className="eventList-child1 event-participant-time">
                      <div className="eventList-time d-flex align-item-center gap-2 ">
                        <ClockIcon />
                        <p>24H:05M:10s</p>
                        <span>Upcoming </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center align-bottom">
                      <button className="buyEvent-mainBtn download-reportBtn">
                        Download Report
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between eventList-child2">
                    <div className="m-2">
                      <p className="event-participant-cardHead mb-1">
                        ''Event No: RFQ1233132 | Companies: MNRL, MRPL |
                        Projects: Nexttown, Nexzone | Material: Doors, Door
                        Frames.
                      </p>
                    </div>
                    <div className="d-flex align-items-center flex-column justify-content-center text-center">
                      <button className="event-participant-cardBtn">
                        <samp>
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            fill="#ffff"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx={6} cy={6} r={6} fill="black" />
                          </svg>
                        </samp>{" "}
                        Live
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <ul
                      className="nav nav-tabs border-0"
                      id="eventTabs"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active setting-link"
                          id="responses-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#responses"
                          type="button"
                          role="tab"
                          aria-controls="responses"
                          aria-selected="true"
                        >
                          Responses
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="responses-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#Comaprison"
                          type="button"
                          role="tab"
                          aria-controls="responses"
                          aria-selected="true"
                        >
                          Comaprison
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="overview-tab "
                          data-bs-toggle="tab"
                          data-bs-target="#overview"
                          type="button"
                          role="tab"
                          aria-controls="overview"
                          aria-selected="false"
                        >
                          Overview
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="participants-tab "
                          data-bs-toggle="tab"
                          data-bs-target="#participants"
                          type="button"
                          role="tab"
                          aria-controls="participants"
                          aria-selected="false"
                        >
                          Participants
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="analytics-tab "
                          data-bs-toggle="tab"
                          data-bs-target="#analytics"
                          type="button"
                          role="tab"
                          aria-controls="analytics"
                          aria-selected="false"
                        >
                          Analytics
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="priceTrends-tab "
                          data-bs-toggle="tab"
                          data-bs-target="#priceTrends"
                          type="button"
                          role="tab"
                          aria-controls="priceTrends"
                          aria-selected="false"
                        >
                          Price Trends
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link setting-link"
                          id="participantRemarks-tab "
                          data-bs-toggle="tab"
                          data-bs-target="#participantRemarks"
                          type="button"
                          role="tab"
                          aria-controls="participantRemarks"
                          aria-selected="false"
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            padding: "0 10px",
                          }}
                        >
                          Participant Remarks
                        </button>
                      </li>
                    </ul>
                    <div className="dropdown pe-4">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-dark"
                          className="btn dropdown-toggle no-hover"
                          id="dropdownMenuButton"
                        >
                          <SettingIcon color={undefined} />{" "}
                          Setting
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Recreate")}
                          >
                            Recreate Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Shared")}
                          >
                            Shared With
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Extend")}
                          >
                            Extend Submission Time
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Withdraw")}
                          >
                            Withdraw
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Convert")}
                          >
                            Convert to Auction
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Rejected")}
                          >
                            Rejected Bids
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Order")}
                          >
                            Order Activity
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Evaluation")}
                          >
                            Add Evaluation Time
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModal("Counter")}
                          >
                            Send Bulk Counter Offer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {renderModal()}
                    </div>
                  </div>
                  <div className="tab-content mt-3 main-scroll-div">
                    <ResponseTab isOpen={isOpen} isOthersOpen={isOthersOpen} toggleAccordion={toggleAccordion} toggleOthersAccordion={toggleOthersAccordion} />
                    <ComparisonTab />
                    <OverviewTab participantsOpen={participantsOpen} savingsOpen={savingsOpen} biddingOpen={biddingOpen} productOpen={productOpen} handleParticipants={participantsAccordion} handleSavings={savingsAccordion} handleBiddings={biddingsAccordion} handleProducts={productAccordion} />
                    <ParticipantsTab />
                    <AnalyticsTab />
                    <PriceTrendsTab />
                    <div
                      className="tab-pane fade"
                      id="participantRemarks"
                      role="tabpanel"
                      aria-labelledby="participantRemarks-tab"
                      tabIndex={0}
                    >
                      {/* Content for Participant Remarks tab */}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="settings"
                      role="tabpanel"
                      aria-labelledby="settings-tab"
                      tabIndex={0}
                    >
                      {/* Content for Settings tab */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
