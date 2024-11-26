import React from "react";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  BulkCounterOfferModal,
  AddEvaluationTimeModal,
  ActivityModal,
  RejectedBidsModal,
  ConvertToAuctionModal,
  WithdrawOrderModal,
  IncreaseEventTimeModal,
  NotificationInfoModal,
  RecreateOrderModal,
  AnalyticsTab,
  ClockIcon,
  ComparisonTab,
  OverviewTab,
  ParticipantsTab,
  TabsList,
  PriceTrendsTab,
  ResponseTab,
} from "../components";

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
                <div className="d-flex flex-row-reverse ">
                  <div className="eventList-child1 event-participant-time py-3">
                    <div className="eventList-time d-flex align-items-center gap-2">
                      <ClockIcon />
                      <span>24H:05M:10s</span>
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
                      ''Event No: RFQ1233132 | Companies: MNRL, MRPL | Projects:
                      Nexttown, Nexzone | Material: Doors, Door Frames.
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
                <TabsList
                  handleShowModal={handleShowModal}
                  renderModal={renderModal}
                />
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
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
