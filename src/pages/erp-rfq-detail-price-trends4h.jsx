import React, { useState, useEffect } from "react";
import { useParams, useNavigation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/event.css";
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
  OverviewTab,
  ParticipantsTab,
  TabsList,
  PriceTrendsTab,
  ResponseTab,
  ParicipantsRemarksTab,
} from "../components";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BulkCounterOfferModalTwo from "../components/common/Modal/BulkCounterOfferModalTwo";
import AllocationTab from "../components/common/Tab/AllocationsTab";
import PurchasedOrdersTab from "../components/common/Tab/PurchasedOrdersTab";
import { baseURL } from "../confi/apiDomain";

export default function ErpRfqDetailPriceTrends4h() {
  const { eventId } = useParams(); // Get the id from the URL params
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [participantsOpen, setParticipantsOpen] = useState(true);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [termAndCond, setTermAndCond] = useState(false);
  const [orderConf, setOrderConf] = useState(false);
  const [orderDetails, setOrderDetails] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // Initial time in seconds
  const [response, setResponse] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [bidding, setBidding] = useState([]);
  const [participantsTabData, setParticipantsTabData] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [documentData , setDocumentData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCounter, setIsCounter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (overviewData?.event_schedule?.end_time) {      
      const endTime = new Date(overviewData.event_schedule.end_time).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = Math.floor((endTime - currentTime) / 1000);
      setRemainingTime(timeDiff > 0 ? timeDiff : 0);
    }
  }, [overviewData]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}H:${mins}M:${secs}s`;
  };

  const [counterOfferData, setCounterOfferData] = useState(null);

  useEffect(() => {
    const fetchCounterOfferData = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_materials?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const data = await response.json();
        if (data) {
          setCounterOfferData(data); // Set the fetched data
        }

      } catch (error) {
        console.error("Failed to fetch counter offer data", error);
      }
    };

    fetchCounterOfferData();
  }, []); // Run the effect once when the component is mounted

  const participantsAccordion = () => {
    setParticipantsOpen(!participantsOpen);
  };
  const documentAccordion = () => {
    setDocumentsOpen(!documentsOpen);
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
  const termsAccordion = () => {
    setTermAndCond(!termAndCond);
  };
  const orderConfAccordion = () => {
    setOrderConf(!orderConf);
  };
  const orderDetailsAccordion = () => {
    setOrderDetails(!orderDetails);
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
      // case "Shared":
      //   return (
      //     <NotificationInfoModal
      //       show={showModal}
      //       handleClose={handleCloseModal}
      //     />
      //   );
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
      // case "Order":
      //   return (
      //     <ActivityModal show={showModal} handleClose={handleCloseModal} />
      //   );
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
          <BulkCounterOfferModalTwo
            show={showModal}
            handleClose={handleCloseModal}
            bidCounterData={counterOfferData}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Data      attachment", data.attachments);
        
        setOverviewData(data);
        setDocumentData(data.attachments);
        if (data.state == "expired") {
          setIsCounter(true);
        } else {
          setIsCounter(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId]);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/bidding_summary?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1h`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBidding(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId]);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_overview?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1h`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setParticipantsTabData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId]);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_vendors/event_vendor_remarks?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRemarks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_vendors?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setParticipants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-0 ">
          <div className="event-order-page">
            <div className=" event-tabs">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="ant-btn styles_headerCtaLink__2kCN6 ant-btn-link"
                  onClick={() =>
                    navigate(
                      "/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
                    )
                  }
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    className="pro-icon"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.707 4.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
                <div>
                  <h4 className="event-head px-2 pt-2 ms-2">Events</h4>
                </div>
              </div>
              <div className="d-flex flex-row-reverse ">
                <div
                  className="eventList-child1 event-participant-time py-3"
                  style={{ width: "250px" }}
                >
                  <div className="eventList-time d-flex align-items-center gap-2">
                    <ClockIcon />
                    <span>{formatTime(remainingTime)}</span>
                    <span>{remainingTime > 0 ? "Upcoming" : "Expired"}</span>
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
                    ''Event No: {overviewData?.event_no} |{" "}
                    {overviewData?.event_title}
                  </p>
                </div>
                <div className="d-flex align-items-center flex-column justify-content-center text-center">
                  {isCounter && remainingTime <= 0 ? (
                    <>
                      <button
                        className="event-participant-cardBtn d-flex align-items-center justify-content-between"
                        style={{
                          width: "80px",
                          backgroundColor: "#8b020366",
                          padding: "5px 15px",
                          color: "#000",
                          border: "1px solid #8b0203",
                        }}
                      >
                       Expired
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="event-participant-cardBtn d-flex align-items-center justify-content-between"
                        style={{
                          width: "80px",
                          backgroundColor: "#8b020366",
                          padding: "5px 15px",
                          color: "#000",
                          border: "1px solid #8b0203",
                        }}
                      >
                        <samp>
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            fill="#fff"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx={6} cy={6} r={6} fill="#8b0203" />
                          </svg>
                        </samp>{" "}
                        Live
                      </button>
                    </>
                  )}
                </div>
              </div>
              <TabsList
                handleShowModal={handleShowModal}
                renderModal={renderModal}
              />
              <div className="tab-content mt-3 main-scroll-div">
                <ResponseTab isCounterOffer={isCounter} reminderData={participants} />
                <OverviewTab
                  materialData={counterOfferData}
                  overviewData={overviewData}
                  participantsOpen={participantsOpen}
                  participantsData={participantsTabData}
                  documentsOpen={documentsOpen}
                  documentsData={documentData}
                  savingsOpen={savingsOpen}
                  biddingOpen={biddingOpen}
                  biddingData={bidding}
                  productOpen={productOpen}
                  handleDocuments={documentAccordion}
                  handleParticipants={participantsAccordion}
                  handleSavings={savingsAccordion}
                  handleBiddings={biddingsAccordion}
                  handleProducts={productAccordion}
                  handleTerms={termsAccordion}
                  handleOrderConf={orderConfAccordion}
                  handleOrderDetails={orderDetailsAccordion}
                  termsOpen={termAndCond}
                  orderConfOpen={orderConf}
                  orderDetails={orderDetails}
                />
                <ParticipantsTab id={eventId} />
                <AnalyticsTab eventId={eventId} />
                <AllocationTab isCounterOffer={isCounter} />
                <ParicipantsRemarksTab data={remarks} />
                <PurchasedOrdersTab />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
