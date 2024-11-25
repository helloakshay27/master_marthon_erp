import React from "react";
import { useState } from "react";
import RecreateOrderModal from "../components/common/Modal/RecreateOrderModal";
import NotificationInfoModal from "../components/common/Modal/NotificationInfoModal";
import IncreaseEventTimeModal from "../components/common/Modal/IncreaseEventTimeModal";
import WithdrawOrderModal from "../components/common/Modal/WithdrawOrderModal";
import ConvertToAuctionModal from "../components/common/Modal/ConvertToAuctionModal";
import RejectedBidsModal from "../components/common/Modal/RejectedBidsModal";
import ActivityModal from "../components/common/Modal/ActivityModal";
import AddEvaluationTimeModal from "../components/common/Modal/AddEvaluationTime";
import BulkCounterOfferModal from "../components/common/Modal/BulkCounterOfferModal";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  AnalyticsTab,
  ClockIcon,
  ComparisonTab,
  OverviewTab,
  ParticipantsTab,
  TabsList,
} from "../components";
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
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_96_912)">
                            <g clipPath="url(#clip1_96_912)">
                              <path
                                d="M12 0.959961C14.928 0.959961 17.736 2.1231 19.8064 4.1935C21.8768 6.2639 23.04 9.07197 23.04 12C23.04 14.928 21.8768 17.736 19.8064 19.8064C17.736 21.8768 14.928 23.04 12 23.04C9.07197 23.04 6.2639 21.8768 4.1935 19.8064C2.1231 17.736 0.959961 14.928 0.959961 12C0.959961 9.07197 2.1231 6.2639 4.1935 4.1935C6.2639 2.1231 9.07197 0.959961 12 0.959961Z"
                                stroke="#F3F3F3"
                                strokeWidth="1.92"
                                strokeLinecap="round"
                                strokeDasharray="69.37 69.37"
                              />
                              <path
                                d="M12 0.959961C14.928 0.959961 17.736 2.1231 19.8064 4.1935C21.8768 6.2639 23.04 9.07197 23.04 12C23.04 14.928 21.8768 17.736 19.8064 19.8064C17.736 21.8768 14.928 23.04 12 23.04C9.07197 23.04 6.2639 21.8768 4.1935 19.8064C2.1231 17.736 0.959961 14.928 0.959961 12C0.959961 9.07197 2.1231 6.2639 4.1935 4.1935C6.2639 2.1231 9.07197 0.959961 12 0.959961Z"
                                stroke="white"
                                strokeWidth="1.92"
                                strokeLinecap="round"
                                strokeDasharray="69.37 69.37"
                              />
                            </g>
                            <g opacity="0.75" clipPath="url(#clip2_96_912)">
                              <path
                                d="M12 3C7.02991 3 3 7.02991 3 12C3 16.9701 7.02991 21 12 21C16.9701 21 21 16.9701 21 12C21 7.02991 16.9701 3 12 3ZM12 19.4732C7.87366 19.4732 4.52679 16.1263 4.52679 12C4.52679 7.87366 7.87366 4.52679 12 4.52679C16.1263 4.52679 19.4732 7.87366 19.4732 12C19.4732 16.1263 16.1263 19.4732 12 19.4732Z"
                                fill="white"
                              />
                              <path
                                d="M15.5096 14.5429L12.6449 12.4717V7.49958C12.6449 7.41119 12.5726 7.33887 12.4842 7.33887H11.5179C11.4295 7.33887 11.3572 7.41119 11.3572 7.49958V13.0322C11.3572 13.0844 11.3813 13.1326 11.4235 13.1628L14.7462 15.5855C14.8186 15.6378 14.919 15.6217 14.9712 15.5514L15.5458 14.7679C15.598 14.6936 15.582 14.5931 15.5096 14.5429Z"
                                fill="white"
                              />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_96_912">
                              <rect
                                width={24}
                                height={24}
                                rx={12}
                                fill="white"
                              />
                            </clipPath>
                            <clipPath id="clip1_96_912">
                              <rect width={24} height={24} fill="white" />
                            </clipPath>
                            <clipPath id="clip2_96_912">
                              <rect
                                width={18}
                                height={18}
                                fill="white"
                                transform="translate(3 3)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
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

                  <TabsList handleShowModal={handleShowModal} renderModal={renderModal} />
                  <div className="tab-content mt-3 main-scroll-div">
                    <ResponseTab
                      isOpen={isOpen}
                      isOthersOpen={isOthersOpen}
                      toggleAccordion={toggleAccordion}
                      toggleOthersAccordion={toggleOthersAccordion}
                    />
                    <ComparisonTab />
                    <OverviewTab
                      participantsOpen={participantsOpen}
                      savingsOpen={savingsOpen}
                      biddingOpen={biddingOpen}
                      productOpen={productOpen}
                      handleParticipants={participantsAccordion}
                      handleSavings={savingsAccordion}
                      handleBiddings={biddingsAccordion}
                      handleProducts={productAccordion}
                    />
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
    </>
  );
}
