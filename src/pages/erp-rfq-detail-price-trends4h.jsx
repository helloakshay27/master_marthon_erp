import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Dropdown, Collapse } from "react-bootstrap";
import { useState } from "react";
import RecreateOrderModal from "../components/RecreateOrderModal";
import NotificationInfoModal from "../components/NotificationInfoModal";
import IncreaseEventTimeModal from "../components/IncreaseEventTimeModal";
import WithdrawOrderModal from "../components/WithdrawOrderModal";
import ConvertToAuctionModal from "../components/ConvertToAuctionModal";
import RejectedBidsModal from "../components/RejectedBidsModal";
import ActivityModal from "../components/ActivityModal";
import AddEvaluationTimeModal from "../components/AddEvaluationTime";
import BulkCounterOfferModal from "../components/BulkCounterOfferModal";
import ScatterChart from "../components/ScatterChart";

export default function ErpRfqDetailPriceTrends4h() {
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(true);
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);

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
      case "Recreate":
        return (
          <>
            <RecreateOrderModal
              show={showModal}
              handleClose={handleCloseModal}
            />
          </>
        );
      case "Shared":
        return (
          <NotificationInfoModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      case "Extend":
        return (
          <IncreaseEventTimeModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      case "Withdraw":
        return (
          <WithdrawOrderModal show={showModal} handleClose={handleCloseModal} />
        );
      case "Convert":
        return (
          <ConvertToAuctionModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
      case "Rejected":
        return (
          <RejectedBidsModal show={showModal} handleClose={handleCloseModal} />
        );
      case "Order":
        return (
          <ActivityModal show={showModal} handleClose={handleCloseModal} />
        );
      case "Evaluation":
        return (
          <AddEvaluationTimeModal
            show={showModal}
            handleClose={handleCloseModal}
          />
        );
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
                          <svg
                            width={16}
                            height={18}
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.00034 5.5918C6.2357 5.5918 4.80518 7.02232 4.80518 8.78696C4.80518 10.5516 6.2357 11.9821 8.00034 11.9821C9.76498 11.9821 11.1955 10.5516 11.1955 8.78696C11.1955 7.02232 9.76498 5.5918 8.00034 5.5918ZM6.40275 8.78696C6.40275 7.90464 7.11802 7.18939 8.00034 7.18939C8.88265 7.18939 9.59792 7.90464 9.59792 8.78696C9.59792 9.66929 8.88265 10.3845 8.00034 10.3845C7.11802 10.3845 6.40275 9.66929 6.40275 8.78696Z"
                              fill="black"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.5072 2.23226C10.1675 -0.744078 5.83252 -0.744096 5.49281 2.23226L5.42185 2.85396C5.35211 3.46498 4.70596 3.84201 4.13158 3.59304L3.55569 3.34341C0.828386 2.16124 -1.38968 5.87814 1.0506 7.67629L1.55554 8.04836C2.05439 8.41596 2.05439 9.15745 1.55554 9.52503L1.0506 9.8971C-1.38966 11.6952 0.828374 15.4122 3.55569 14.23L4.13158 13.9804C4.70596 13.7314 5.35211 14.1085 5.42185 14.7194L5.49281 15.3412C5.83252 18.3175 10.1675 18.3175 10.5072 15.3412L10.5781 14.7194C10.6479 14.1085 11.2941 13.7314 11.8683 13.9804L12.4443 14.23C15.1716 15.4121 17.3897 11.6952 14.9494 9.8971L14.4444 9.52503C13.9456 9.15744 13.9456 8.41596 14.4444 8.04836L14.9494 7.67629C17.3897 5.87815 15.1716 2.16123 12.4443 3.34341L11.8685 3.59304C11.2941 3.84201 10.6479 3.46498 10.5781 2.85397L10.5072 2.23226ZM7.08008 2.41343C7.20424 1.32564 8.79575 1.32563 8.91991 2.41343L8.99086 3.03513C9.1831 4.7194 10.952 5.73149 12.5037 5.05884L13.0797 4.80921C14.1171 4.35954 14.8623 5.75602 14.0017 6.39017L13.4968 6.76224C12.1313 7.76832 12.1313 9.80508 13.4968 10.8112L14.0017 11.1832C14.8623 11.8174 14.1171 13.2139 13.0797 12.7642L12.5037 12.5145C10.952 11.8419 9.1831 12.854 8.99086 14.5383L8.91991 15.16C8.79575 16.2477 7.20424 16.2478 7.08008 15.16L7.00912 14.5383C6.81689 12.854 5.04803 11.8419 3.49622 12.5145L2.92031 12.7642C1.88291 13.2139 1.1377 11.8174 1.99831 11.1832L2.50325 10.8112C3.8686 9.80507 3.86859 7.76832 2.50325 6.76224L1.99829 6.39016C1.13771 5.75603 1.8829 4.35953 2.92032 4.80922L3.49622 5.05884C5.04803 5.73149 6.81689 4.7194 7.00912 3.03513L7.08008 2.41343Z"
                              fill="black"
                            />
                          </svg>{" "}
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
                    <div
                      className="tab-pane fade show active"
                      id="responses"
                      role="tabpanel"
                      aria-labelledby="responses-tab"
                      tabIndex={0}
                    >
                      <div className="viewBy-main">
                        <div className="viewBy-main-child1">
                          <div className="viewBy-header d-flex align-items-center ">
                            <select
                              name="language"
                              className=" viewBy-headerForm"
                              required=""
                            >
                              <option
                                value=""
                                disabled=""
                                selected=""
                                hidden=""
                              >
                                View by Product
                              </option>
                              <option value="indian">xxxxxxxx</option>
                              <option value="nepali">xxxxxxxx</option>
                              <option value="others">Others</option>
                            </select>
                            <select
                              name="language"
                              className="viewBy-headerForm"
                              required=""
                            >
                              <option
                                value=""
                                disabled=""
                                selected=""
                                hidden=""
                              >
                                Actions
                              </option>
                              <option value="indian">xxxxxxxx</option>
                              <option value="nepali">xxxxxxxx</option>
                              <option value="others">Others</option>
                            </select>
                            <div className="d-flex align-items-center">
                              <div className="">
                                <p className="viewBy-headerFormP">
                                  <span className="me-1">
                                    <svg
                                      width={14}
                                      height={15}
                                      viewBox="0 0 14 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                        fill="#3A3A3A"
                                      />
                                    </svg>
                                  </span>
                                  Show / Hide
                                </p>
                              </div>
                              <div className="me-2">
                                <p className="viewBy-headerFormP">
                                  <span className="me-1">
                                    <svg
                                      width={14}
                                      height={15}
                                      viewBox="0 0 14 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3.5313 2.94365L4.21723 2.25771C4.23376 2.24111 4.24529 2.2202 4.25051 2.19737C4.25574 2.17453 4.25446 2.15069 4.24681 2.12855C4.23916 2.10641 4.22545 2.08686 4.20724 2.07213C4.18902 2.0574 4.16704 2.04807 4.1438 2.04521L1.64067 1.7499C1.56098 1.74052 1.49223 1.80771 1.50161 1.88896L1.79692 4.39209C1.80942 4.49521 1.93598 4.53896 2.00942 4.46552L2.69223 3.78271L4.7813 5.87021C4.82973 5.91865 4.90942 5.91865 4.95786 5.87021L5.62036 5.20927C5.6688 5.16084 5.6688 5.08115 5.62036 5.03271L3.5313 2.94365ZM9.04223 5.87021C9.09067 5.91865 9.17036 5.91865 9.2188 5.87021L11.3079 3.78271L11.9907 4.46552C12.0073 4.48205 12.0282 4.49358 12.051 4.49881C12.0738 4.50403 12.0977 4.50275 12.1198 4.4951C12.142 4.48745 12.1615 4.47374 12.1763 4.45553C12.191 4.43732 12.2003 4.41534 12.2032 4.39209L12.4985 1.89052C12.5079 1.81084 12.4407 1.74209 12.3594 1.75146L9.8563 2.04677C9.75317 2.05927 9.70942 2.18584 9.78286 2.25927L10.4688 2.94521L8.37973 5.03115C8.35647 5.05464 8.34342 5.08637 8.34342 5.11943C8.34342 5.15249 8.35647 5.18422 8.37973 5.20771L9.04223 5.87021ZM12.2032 10.1077C12.1907 10.0046 12.0641 9.96084 11.9907 10.0343L11.3079 10.7171L9.2188 8.62959C9.1953 8.60632 9.16358 8.59327 9.13051 8.59327C9.09745 8.59327 9.06573 8.60632 9.04223 8.62959L8.37973 9.29052C8.35647 9.31402 8.34342 9.34574 8.34342 9.37881C8.34342 9.41187 8.35647 9.44359 8.37973 9.46709L10.4688 11.5561L9.78286 12.2421C9.76634 12.2587 9.7548 12.2796 9.74958 12.3024C9.74435 12.3253 9.74563 12.3491 9.75328 12.3712C9.76093 12.3934 9.77465 12.4129 9.79286 12.4277C9.81107 12.4424 9.83305 12.4517 9.8563 12.4546L12.3594 12.7499C12.4391 12.7593 12.5079 12.6921 12.4985 12.6108L12.2032 10.1077ZM4.95786 8.62959C4.93436 8.60632 4.90264 8.59327 4.86958 8.59327C4.83651 8.59327 4.80479 8.60632 4.7813 8.62959L2.69223 10.7171L2.00942 10.0343C1.99282 10.0178 1.97191 10.0062 1.94908 10.001C1.92624 9.99576 1.9024 9.99705 1.88026 10.0047C1.85812 10.0124 1.83857 10.0261 1.82384 10.0443C1.80911 10.0625 1.79978 10.0845 1.79692 10.1077L1.50161 12.6093C1.49223 12.689 1.55942 12.7577 1.64067 12.7483L4.1438 12.453C4.24692 12.4405 4.29067 12.314 4.21723 12.2405L3.5313 11.5561L5.62036 9.46865C5.6688 9.42021 5.6688 9.34052 5.62036 9.29209L4.95786 8.62959Z"
                                        fill="#3A3A3A"
                                      />
                                    </svg>
                                  </span>
                                  Fullscreen
                                </p>
                              </div>
                              <div>
                                <svg
                                  width={14}
                                  height={15}
                                  viewBox="0 0 14 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_105_956)">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.17301 0.583008H9.82801C10.364 0.583008 10.808 0.583008 11.168 0.613008C11.543 0.643008 11.888 0.709008 12.211 0.873008C12.713 1.13001 13.121 1.53801 13.376 2.03901C13.541 2.36301 13.606 2.70701 13.637 3.08201C13.667 3.44201 13.667 3.88601 13.667 4.42201V10.077C13.667 10.614 13.667 11.057 13.637 11.417C13.607 11.793 13.541 12.137 13.377 12.461C13.12 12.962 12.713 13.371 12.211 13.626C11.887 13.791 11.543 13.856 11.168 13.887C10.808 13.917 10.364 13.917 9.82801 13.917H4.17301C3.63601 13.917 3.19301 13.917 2.83301 13.887C2.45801 13.857 2.11301 13.791 1.79001 13.626C1.28793 13.3703 0.879745 12.9621 0.624008 12.46C0.459008 12.136 0.394008 11.792 0.363008 11.417C0.333008 11.056 0.333008 10.613 0.333008 10.077V4.42101C0.333008 3.88501 0.333008 3.44101 0.363008 3.08101C0.393008 2.70601 0.459008 2.36101 0.624008 2.03801C0.880008 1.53801 1.28801 1.13001 1.79001 0.874008C2.11301 0.709008 2.45801 0.644008 2.83201 0.613008C3.19301 0.583008 3.63701 0.583008 4.17301 0.583008ZM5.66701 12.583H9.80001C10.371 12.583 10.76 12.583 11.06 12.558C11.352 12.534 11.501 12.491 11.605 12.438C11.856 12.31 12.06 12.106 12.188 11.855C12.241 11.751 12.285 11.601 12.308 11.309C12.333 11.009 12.334 10.621 12.334 10.049V4.45001C12.334 3.88001 12.333 3.49201 12.309 3.19201C12.285 2.89901 12.241 2.75001 12.189 2.64601C12.0609 2.39484 11.8564 2.19073 11.605 2.06301C11.501 2.01001 11.352 1.96601 11.059 1.94301C10.759 1.91801 10.371 1.91801 9.80001 1.91801H5.66701V12.583ZM4.33401 1.91701V12.583H4.20001C3.63001 12.583 3.24001 12.583 2.94001 12.558C2.64901 12.534 2.50001 12.491 2.39501 12.438C2.14395 12.3102 1.93985 12.1061 1.81201 11.855C1.75901 11.751 1.71601 11.601 1.69201 11.309C1.66701 11.009 1.66701 10.621 1.66701 10.049V4.45001C1.66701 3.88001 1.66701 3.49201 1.69201 3.19201C1.71601 2.89901 1.75901 2.75001 1.81201 2.64601C1.94001 2.39501 2.14401 2.19101 2.39501 2.06301C2.49901 2.01001 2.64901 1.96601 2.94101 1.94301C3.24101 1.91801 3.62901 1.91801 4.20101 1.91801L4.33401 1.91701Z"
                                      fill="#3A3A3A"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_105_956">
                                      <rect
                                        width={14}
                                        height={14}
                                        fill="white"
                                        transform="translate(0 0.25)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                            <div className="viewBy-zoom">
                              <div className="viewBy-zoomIN">
                                <svg
                                  width={14}
                                  height={15}
                                  viewBox="0 0 14 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.41674 2.58341C5.74843 2.58333 5.09031 2.7473 4.50015 3.06091C3.90999 3.37452 3.40582 3.82819 3.0319 4.38211C2.65798 4.93603 2.42573 5.57326 2.35554 6.23787C2.28534 6.90249 2.37935 7.57418 2.62932 8.19398C2.87928 8.81379 3.27755 9.36277 3.78918 9.79275C4.30081 10.2227 4.91015 10.5205 5.56374 10.6601C6.21732 10.7996 6.89516 10.7766 7.53778 10.593C8.18039 10.4095 8.76813 10.071 9.24941 9.60733C9.28049 9.56677 9.31677 9.53049 9.35733 9.49941C9.91302 8.92246 10.2867 8.1948 10.432 7.40703C10.5772 6.61926 10.4875 5.80617 10.1741 5.06899C9.86063 4.33182 9.33729 3.70311 8.6692 3.26115C8.00111 2.81919 7.21779 2.58349 6.41674 2.58341ZM10.5187 9.94391C11.3563 8.89556 11.7606 7.56631 11.6487 6.22916C11.5368 4.89201 10.9172 3.64846 9.91703 2.7539C8.9169 1.85935 7.6122 1.38169 6.2709 1.41903C4.9296 1.45637 3.6535 2.00587 2.70468 2.95468C1.75587 3.9035 1.20637 5.1796 1.16903 6.5209C1.13169 7.8622 1.60935 9.1669 2.5039 10.167C3.39846 11.1672 4.64201 11.7868 5.97916 11.8987C7.31631 12.0106 8.64556 11.6063 9.69391 10.7687L11.8377 12.9125C11.9477 13.0188 12.095 13.0775 12.248 13.0762C12.4009 13.0749 12.5472 13.0135 12.6554 12.9054C12.7635 12.7972 12.8249 12.6509 12.8262 12.498C12.8275 12.345 12.7688 12.1977 12.6625 12.0877L10.5187 9.94391ZM6.41674 4.33341C6.57145 4.33341 6.71982 4.39487 6.82922 4.50426C6.93862 4.61366 7.00007 4.76203 7.00007 4.91674V6.08341H8.16674C8.32145 6.08341 8.46982 6.14487 8.57922 6.25426C8.68862 6.36366 8.75007 6.51203 8.75007 6.66674C8.75007 6.82145 8.68862 6.96982 8.57922 7.07922C8.46982 7.18862 8.32145 7.25007 8.16674 7.25007H7.00007V8.41674C7.00007 8.57145 6.93862 8.71982 6.82922 8.82922C6.71982 8.93862 6.57145 9.00007 6.41674 9.00007C6.26203 9.00007 6.11366 8.93862 6.00426 8.82922C5.89487 8.71982 5.83341 8.57145 5.83341 8.41674V7.25007H4.66674C4.51203 7.25007 4.36366 7.18862 4.25426 7.07922C4.14487 6.96982 4.08341 6.82145 4.08341 6.66674C4.08341 6.51203 4.14487 6.36366 4.25426 6.25426C4.36366 6.14487 4.51203 6.08341 4.66674 6.08341H5.83341V4.91674C5.83341 4.76203 5.89487 4.61366 6.00426 4.50426C6.11366 4.39487 6.26203 4.33341 6.41674 4.33341Z"
                                    fill="black"
                                    fillOpacity="0.25"
                                  />
                                </svg>
                              </div>
                              <div className="viewBy-zoomOUT">
                                <svg
                                  width={14}
                                  height={15}
                                  viewBox="0 0 14 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.41674 2.58341C5.74843 2.58333 5.09031 2.7473 4.50015 3.06091C3.90999 3.37452 3.40582 3.82819 3.0319 4.38211C2.65798 4.93603 2.42573 5.57326 2.35554 6.23787C2.28534 6.90249 2.37935 7.57418 2.62932 8.19398C2.87928 8.81379 3.27755 9.36277 3.78918 9.79275C4.30081 10.2227 4.91015 10.5205 5.56374 10.6601C6.21732 10.7996 6.89516 10.7766 7.53778 10.593C8.18039 10.4095 8.76813 10.071 9.24941 9.60733C9.28049 9.56677 9.31677 9.53049 9.35733 9.49941C9.91302 8.92246 10.2867 8.1948 10.432 7.40703C10.5772 6.61926 10.4875 5.80617 10.1741 5.06899C9.86063 4.33182 9.33729 3.70311 8.6692 3.26115C8.00111 2.81919 7.21779 2.58349 6.41674 2.58341ZM10.5187 9.94391C11.3563 8.89556 11.7606 7.56631 11.6487 6.22916C11.5368 4.89201 10.9172 3.64846 9.91703 2.7539C8.9169 1.85935 7.6122 1.38169 6.2709 1.41903C4.9296 1.45637 3.6535 2.00587 2.70468 2.95468C1.75587 3.9035 1.20637 5.1796 1.16903 6.5209C1.13169 7.8622 1.60935 9.1669 2.5039 10.167C3.39846 11.1672 4.64201 11.7868 5.97916 11.8987C7.31631 12.0106 8.64556 11.6063 9.69391 10.7687L11.8377 12.9125C11.9477 13.0188 12.095 13.0775 12.248 13.0762C12.4009 13.0749 12.5472 13.0135 12.6554 12.9054C12.7635 12.7972 12.8249 12.6509 12.8262 12.498C12.8275 12.345 12.7688 12.1977 12.6625 12.0877L10.5187 9.94391ZM4.08341 6.66674C4.08341 6.51203 4.14487 6.36366 4.25426 6.25426C4.36366 6.14487 4.51203 6.08341 4.66674 6.08341H8.16674C8.32145 6.08341 8.46982 6.14487 8.57922 6.25426C8.68862 6.36366 8.75007 6.51203 8.75007 6.66674C8.75007 6.82145 8.68862 6.96982 8.57922 7.07922C8.46982 7.18862 8.32145 7.25007 8.16674 7.25007H4.66674C4.51203 7.25007 4.36366 7.18862 4.25426 7.07922C4.14487 6.96982 4.08341 6.82145 4.08341 6.66674Z"
                                    fill="#334155"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="viewBy-main-child2">
                          <p className="viewBy-main-child2P">
                            <span>
                              <svg
                                width={14}
                                height={13}
                                viewBox="0 0 14 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.8782 9.42654C11.4871 9.03513 11.0301 8.71566 10.5282 8.48279C11.236 7.90935 11.6875 7.03435 11.6875 6.0531C11.6875 4.32185 10.2438 2.90154 8.51254 2.9281C6.80785 2.95466 5.43441 4.34373 5.43441 6.0531C5.43441 7.03435 5.88754 7.90935 6.59379 8.48279C6.09177 8.71549 5.63476 9.03498 5.24379 9.42654C4.39066 10.2812 3.90629 11.4094 3.87504 12.6125C3.87462 12.6292 3.87755 12.6457 3.88364 12.6613C3.88974 12.6768 3.89888 12.691 3.91053 12.7029C3.92218 12.7148 3.9361 12.7243 3.95147 12.7308C3.96684 12.7373 3.98336 12.7406 4.00004 12.7406H4.87504C4.94223 12.7406 4.99848 12.6875 5.00004 12.6203C5.02973 11.714 5.39691 10.8656 6.04223 10.2219C6.37245 9.88988 6.76523 9.62669 7.19784 9.44753C7.63045 9.26837 8.0943 9.1768 8.56254 9.1781C9.5141 9.1781 10.4094 9.54841 11.0829 10.2219C11.7266 10.8656 12.0938 11.714 12.125 12.6203C12.1266 12.6875 12.1829 12.7406 12.25 12.7406H13.125C13.1417 12.7406 13.1582 12.7373 13.1736 12.7308C13.189 12.7243 13.2029 12.7148 13.2146 12.7029C13.2262 12.691 13.2353 12.6768 13.2414 12.6613C13.2475 12.6457 13.2505 12.6292 13.25 12.6125C13.2188 11.4094 12.7344 10.2812 11.8782 9.42654ZM8.56254 8.0531C8.02816 8.0531 7.52504 7.84529 7.14848 7.46716C6.9595 7.27967 6.81022 7.05604 6.70955 6.8096C6.60888 6.56316 6.55888 6.29897 6.56254 6.03279C6.56723 5.52029 6.77191 5.02498 7.12973 4.65779C7.50473 4.27341 8.00629 4.05935 8.54223 4.0531C9.07191 4.04841 9.58598 4.25466 9.9641 4.62498C10.3516 5.00466 10.5641 5.51248 10.5641 6.0531C10.5641 6.58748 10.3563 7.08904 9.97816 7.46716C9.79265 7.65356 9.57202 7.80132 9.32903 7.9019C9.08604 8.00247 8.82552 8.05387 8.56254 8.0531ZM4.64848 6.4656C4.63441 6.32966 4.6266 6.19216 4.6266 6.0531C4.6266 5.80466 4.65004 5.56248 4.69379 5.32654C4.70473 5.27029 4.67504 5.21248 4.62348 5.18904C4.41098 5.09373 4.21566 4.96248 4.04691 4.79685C3.84807 4.60405 3.6916 4.37192 3.58748 4.11526C3.48337 3.85861 3.4339 3.58307 3.44223 3.30623C3.45629 2.80466 3.65785 2.3281 4.00941 1.96873C4.39535 1.57341 4.9141 1.35779 5.46566 1.36404C5.9641 1.36873 6.44535 1.56091 6.80941 1.90154C6.93285 2.01716 7.0391 2.14529 7.12816 2.28279C7.15941 2.33123 7.22035 2.35154 7.27348 2.33279C7.54848 2.23748 7.8391 2.17029 8.13754 2.13904C8.22504 2.12966 8.27504 2.03591 8.23598 1.95779C7.72816 0.953101 6.69066 0.259351 5.49066 0.240601C3.75785 0.214038 2.3141 1.63435 2.3141 3.36404C2.3141 4.34529 2.76566 5.22029 3.47348 5.79373C2.9766 6.02341 2.51879 6.3406 2.12191 6.73748C1.26566 7.59216 0.781289 8.72029 0.750039 9.92498C0.749622 9.94165 0.752547 9.95824 0.758642 9.97377C0.764737 9.9893 0.773878 10.0035 0.785527 10.0154C0.797176 10.0273 0.811098 10.0368 0.826471 10.0433C0.841844 10.0498 0.858358 10.0531 0.875039 10.0531H1.7516C1.81879 10.0531 1.87504 9.99998 1.8766 9.93279C1.90629 9.02654 2.27348 8.1781 2.91879 7.53435C3.37816 7.07498 3.94066 6.75623 4.55473 6.60154C4.61566 6.58591 4.65629 6.5281 4.64848 6.4656Z"
                                  fill="#334155"
                                />
                              </svg>
                            </span>
                            Participation :
                          </p>
                          <div className="d-flex align-items-center">
                            <div
                              className="viewBy-main-child2-child1 d-flex align-items-center justify-content-center gap-2"
                              id="viewBy-main-child2-child1"
                            >
                              <svg
                                width={12}
                                height={10}
                                viewBox="0 0 14 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.25 0.71875H12.1578C12.0047 0.71875 11.8594 0.789062 11.7656 0.909375L5.32345 9.07031L2.23438 5.15625C2.18765 5.09692 2.12809 5.04895 2.06017 5.01593C1.99224 4.98292 1.91772 4.96572 1.8422 4.96562H0.750009C0.645321 4.96562 0.587509 5.08594 0.651571 5.16719L4.93126 10.5891C5.13126 10.8422 5.51563 10.8422 5.7172 10.5891L13.3484 0.91875C13.4125 0.839063 13.3547 0.71875 13.25 0.71875Z"
                                  fill="white"
                                />
                              </svg>
                              4
                            </div>
                            <div
                              className="viewBy-main-child2-child2 d-flex align-items-center justify-content-center gap-2"
                              id="viewBy-main-child2-child2"
                            >
                              <svg
                                width={13}
                                height={12}
                                viewBox="0 0 14 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.5 0.25H0.5C0.223437 0.25 0 0.473437 0 0.75V10.75C0 11.0266 0.223437 11.25 0.5 11.25H13.5C13.7766 11.25 14 11.0266 14 10.75V0.75C14 0.473437 13.7766 0.25 13.5 0.25ZM12.875 1.98125V10.125H1.125V1.98125L0.69375 1.64531L1.30781 0.85625L1.97656 1.37656H12.025L12.6938 0.85625L13.3078 1.64531L12.875 1.98125ZM12.025 1.375L7 5.28125L1.975 1.375L1.30625 0.854687L0.692188 1.64375L1.12344 1.97969L6.46094 6.12969C6.61444 6.24894 6.80328 6.31367 6.99766 6.31367C7.19203 6.31367 7.38088 6.24894 7.53438 6.12969L12.875 1.98125L13.3062 1.64531L12.6922 0.85625L12.025 1.375Z"
                                  fill="#3A3A33"
                                />
                              </svg>
                              4
                            </div>
                            <div
                              className="viewBy-main-child2-child3 d-flex align-items-center justify-content-center gap-2"
                              id="viewBy-main-child2-child3"
                            >
                              <svg
                                width={14}
                                height={14}
                                viewBox="0 0 14 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.722 5.34688C12.2407 2.22656 10.0017 0.65625 7.00009 0.65625C3.99697 0.65625 1.75947 2.22656 0.278215 5.34844C0.218802 5.47425 0.187988 5.61165 0.187988 5.75078C0.187988 5.88991 0.218802 6.02732 0.278215 6.15312C1.75947 9.27344 3.99853 10.8438 7.00009 10.8438C10.0032 10.8438 12.2407 9.27344 13.722 6.15156C13.8423 5.89844 13.8423 5.60469 13.722 5.34688ZM7.00009 9.71875C4.47978 9.71875 2.63447 8.44063 1.3329 5.75C2.63447 3.05938 4.47978 1.78125 7.00009 1.78125C9.5204 1.78125 11.3657 3.05938 12.6673 5.75C11.3673 8.44063 9.52197 9.71875 7.00009 9.71875ZM6.93759 3C5.41884 3 4.18759 4.23125 4.18759 5.75C4.18759 7.26875 5.41884 8.5 6.93759 8.5C8.45634 8.5 9.68759 7.26875 9.68759 5.75C9.68759 4.23125 8.45634 3 6.93759 3ZM6.93759 7.5C5.9704 7.5 5.18759 6.71719 5.18759 5.75C5.18759 4.78281 5.9704 4 6.93759 4C7.90478 4 8.68759 4.78281 8.68759 5.75C8.68759 6.71719 7.90478 7.5 6.93759 7.5Z"
                                  fill="#334155"
                                />
                              </svg>
                              4
                            </div>
                            <div
                              className="viewBy-main-child2-child4 d-flex align-items-center justify-content-center gap-2"
                              id="viewBy-main-child2-child4"
                            >
                              <svg
                                width={13}
                                height={14}
                                viewBox="0 0 14 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.92183 5.26562H9.18902C9.02964 5.26562 8.87808 5.34219 8.78433 5.47344L6.32808 8.87969L5.21558 7.33594C5.12183 7.20625 4.97183 7.12813 4.81089 7.12813H4.07808C3.97652 7.12813 3.91714 7.24375 3.97652 7.32656L5.92339 10.0266C5.96938 10.0908 6.03001 10.1431 6.10026 10.1791C6.1705 10.2152 6.24833 10.2341 6.3273 10.2341C6.40627 10.2341 6.4841 10.2152 6.55434 10.1791C6.62458 10.1431 6.68521 10.0908 6.7312 10.0266L10.0218 5.46406C10.0828 5.38125 10.0234 5.26562 9.92183 5.26562Z"
                                  fill="white"
                                />
                                <path
                                  d="M7 0.75C3.13438 0.75 0 3.88438 0 7.75C0 11.6156 3.13438 14.75 7 14.75C10.8656 14.75 14 11.6156 14 7.75C14 3.88438 10.8656 0.75 7 0.75ZM7 13.5625C3.79063 13.5625 1.1875 10.9594 1.1875 7.75C1.1875 4.54063 3.79063 1.9375 7 1.9375C10.2094 1.9375 12.8125 4.54063 12.8125 7.75C12.8125 10.9594 10.2094 13.5625 7 13.5625Z"
                                  fill="white"
                                />
                              </svg>
                              4
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="viewBy-mainTable">
                        <table>
                          <tbody>
                            <tr>
                              <td className="viewBy-tHead" />
                              <td className="viewBy-tHead p-1 pb-2">
                                <div className="viewBy-tHead-heading">
                                  <div className="viewBy-tHead-heading-child">
                                    <span className="viewBy-tHead-heading-child-span">
                                      <svg
                                        width={16}
                                        height={23}
                                        viewBox="0 0 16 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12.237 2.67658V2.67521V2.66494V2.65468V2.65331V2.14471C12.237 1.98591 12.162 1.84079 12.0412 1.73675L12.0239 1.721C11.9054 1.62585 11.7459 1.56699 11.5699 1.56699H4.42539C4.24142 1.56699 4.07404 1.63133 3.95482 1.73538C3.83323 1.84079 3.75902 1.98522 3.75902 2.14471V2.65399V2.66494V2.67521V3.05032H12.237V2.67658ZM3.75902 3.84846V7.35864C3.79928 8.06163 3.97693 8.74067 4.27379 9.37179C4.28248 9.38684 4.28959 9.4019 4.2959 9.41765C4.3788 9.59015 4.47039 9.75854 4.57066 9.9235C5.0578 10.7237 5.74312 11.4253 6.58239 11.9729C6.80662 12.1194 7.05058 12.2276 7.30403 12.2967L7.30955 12.2981L7.31508 12.2994L7.32613 12.3029C7.54562 12.361 7.77222 12.3898 7.99882 12.3898C8.22541 12.3898 8.45201 12.361 8.6715 12.3029L8.68255 12.2994L8.68808 12.2981L8.69361 12.2967C8.94626 12.2276 9.19101 12.1194 9.41524 11.9729C10.2545 11.426 10.9406 10.7244 11.427 9.92419C11.5272 9.75922 11.6188 9.59083 11.7017 9.41833C11.708 9.40259 11.7152 9.38684 11.7238 9.37179C12.0215 8.73724 12.1999 8.0541 12.2386 7.34769L12.2378 3.84983H3.75981L3.75902 3.84846ZM13.1576 3.4316V3.44939V3.46719L13.1561 7.36411C13.1245 7.9747 13.0013 8.56885 12.796 9.13494C13.2492 9.09114 13.6598 8.92891 13.9835 8.68317C14.3664 8.39225 14.6309 7.98223 14.7035 7.5106L15.0572 5.19832C15.0999 4.91904 15.077 4.6514 14.9901 4.40155C14.9033 4.1517 14.7509 3.91828 14.5369 3.70609C14.323 3.49457 14.0759 3.33303 13.8027 3.22556C13.6037 3.14752 13.3874 3.09755 13.1568 3.07633V3.43228L13.1576 3.4316ZM3.89166 21.2323H12.1036C12.1399 21.2323 12.1739 21.2193 12.1976 21.1981C12.2212 21.1776 12.237 21.1481 12.237 21.1166V19.5758C12.237 19.5443 12.222 19.5156 12.1976 19.4943C12.1739 19.4738 12.1399 19.4601 12.1036 19.4601H10.924H10.9114H5.08307H5.06964H3.89087C3.85455 19.4601 3.82139 19.4731 3.79692 19.4943C3.77323 19.5149 3.75744 19.5443 3.75744 19.5758V21.1166C3.75744 21.1481 3.77244 21.1769 3.79692 21.1981C3.8206 21.2186 3.85534 21.2323 3.89166 21.2323ZM12.1036 22.0311H3.89166C3.6019 22.0311 3.33741 21.9278 3.14713 21.7628C2.95685 21.5978 2.83763 21.3685 2.83763 21.1173V19.5765C2.83763 19.3253 2.95685 19.096 3.14713 18.931C3.33741 18.766 3.6019 18.6627 3.89166 18.6627H4.07246C4.06931 18.6353 4.06773 18.6079 4.06773 18.5805V17.6017C4.06773 17.3593 4.18221 17.1389 4.36617 16.9794L4.39854 16.9541C4.58013 16.8097 4.82094 16.7207 5.08386 16.7207H5.62706C5.90655 16.1279 6.13552 15.5098 6.31395 14.8753C6.49002 14.2482 6.61555 13.6021 6.68977 12.9456C6.4608 12.8573 6.24052 12.7451 6.03209 12.6095C5.08149 11.9894 4.30617 11.1967 3.75744 10.2952C3.68796 10.1809 3.62164 10.0645 3.55927 9.94609H3.44952C2.67183 9.94609 1.95572 9.6983 1.40858 9.2828C0.862218 8.86798 0.484821 8.28478 0.382971 7.61464L0.0292602 5.30237C-0.0307443 4.90603 0.00162604 4.52681 0.125583 4.17155C0.24954 3.81629 0.465083 3.4843 0.769053 3.18312C1.07223 2.88262 1.42437 2.65399 1.81598 2.49998C2.13495 2.37471 2.47682 2.29941 2.83921 2.27546V2.14608C2.83921 1.76892 3.01765 1.42529 3.30504 1.17545C3.59558 0.924231 3.99193 0.769531 4.42775 0.769531H11.5722C11.9946 0.769531 12.3807 0.915332 12.6665 1.15149L12.6942 1.17339C12.9816 1.42256 13.1608 1.76686 13.1608 2.14608V2.27546C13.5232 2.29941 13.8658 2.37471 14.184 2.49998C14.5756 2.65399 14.9278 2.88262 15.2309 3.18312C15.5349 3.4843 15.7513 3.81629 15.8744 4.17155C15.9984 4.52681 16.0307 4.90603 15.9707 5.30237L15.617 7.61464C15.5144 8.28547 15.1378 8.86798 14.5914 9.2828C14.0443 9.6983 13.3282 9.94609 12.5505 9.94609H12.4407C12.3784 10.0645 12.312 10.1809 12.2426 10.2959C11.6938 11.1974 10.9185 11.99 9.96791 12.6102C9.75948 12.7464 9.53841 12.8587 9.31023 12.9463C9.38366 13.6027 9.50998 14.2489 9.68605 14.8759C9.86448 15.5105 10.0942 16.1286 10.3729 16.7214H10.9161C11.1941 16.7214 11.4483 16.8206 11.6323 16.9808C11.817 17.1389 11.9315 17.36 11.9315 17.6024V18.5812C11.9315 18.6093 11.9299 18.6366 11.9267 18.6633H12.1068C12.3965 18.6633 12.661 18.7667 12.8513 18.9317C13.0416 19.0966 13.1608 19.3259 13.1608 19.5772V21.118C13.1608 21.3692 13.0416 21.5985 12.8513 21.7635C12.661 21.9285 12.3965 22.0318 12.1068 22.0318L12.1036 22.0311ZM6.61239 16.7207H9.38366C9.1468 16.182 8.94862 15.6275 8.78993 15.0621C8.61465 14.4392 8.48754 13.8047 8.40779 13.1647C8.27199 13.1797 8.13461 13.1879 7.99803 13.1879C7.86144 13.1879 7.72406 13.1804 7.58826 13.1647C7.5093 13.8047 7.3814 14.4399 7.20612 15.0621C7.04743 15.6275 6.84925 16.182 6.61239 16.7207ZM10.9122 17.5195H5.08386C5.06175 17.5195 5.04201 17.5257 5.02701 17.5353L5.01754 17.5435C5.00017 17.5585 4.9899 17.5791 4.9899 17.6017V18.5805C4.9899 18.6031 5.00096 18.6236 5.01754 18.6387C5.03333 18.6524 5.05543 18.662 5.07912 18.6627H5.08386H10.9122H10.9161C10.9367 18.662 10.9548 18.6558 10.969 18.6462L10.9785 18.638C10.9959 18.623 11.0061 18.6024 11.0061 18.5798V17.601C11.0061 17.5784 10.9951 17.5579 10.9785 17.5428C10.9627 17.5277 10.939 17.5195 10.9122 17.5195ZM3.19924 9.13494C2.9987 8.57981 2.87553 7.9966 2.84079 7.39834L2.83684 7.347V3.46035V3.45008V3.43981V3.07633C2.6063 3.09755 2.39076 3.14752 2.19179 3.22556C1.9194 3.33303 1.67228 3.49457 1.45753 3.70609C1.24356 3.9176 1.09197 4.1517 1.00433 4.40155C0.917486 4.6514 0.894589 4.91904 0.937224 5.19832L1.29094 7.5106C1.36278 7.98223 1.62807 8.39225 2.01099 8.68317C2.3347 8.92891 2.74684 9.09114 3.19924 9.13494Z"
                                          fill="black"
                                        />
                                      </svg>
                                      1
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-start">
                                    <div className="me-3">
                                      <p
                                        className="viewBy-tHead-heading-p1"
                                        title="Manly ELECTRIC Product"
                                      >
                                        Vendor 1
                                      </p>
                                      <p className="viewBy-tHead-heading-p2">
                                        11:40 am, 24 Jan 2024
                                      </p>
                                    </div>
                                    <button className=" btn d-flex align-items-center">
                                      <svg
                                        width={4}
                                        height={13}
                                        viewBox="0 0 4 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.666504 1.46321C0.666504 0.726833 1.26346 0.129883 1.99984 0.129883C2.73622 0.129883 3.33317 0.726833 3.33317 1.46321C3.33317 2.19959 2.73622 2.79655 1.99984 2.79655C1.26346 2.79655 0.666504 2.19959 0.666504 1.46321ZM0.666504 6.12988C0.666504 5.3935 1.26346 4.79655 1.99984 4.79655C2.73622 4.79655 3.33317 5.3935 3.33317 6.12988C3.33317 6.86626 2.73622 7.46321 1.99984 7.46321C1.26346 7.46321 0.666504 6.86626 0.666504 6.12988ZM0.666504 10.7966C0.666504 10.0602 1.26346 9.46318 1.99984 9.46318C2.73622 9.46318 3.33317 10.0602 3.33317 10.7966C3.33317 11.5329 2.73622 12.1299 1.99984 12.1299C1.26346 12.1299 0.666504 11.5329 0.666504 10.7966Z"
                                          fill="#94A3B8"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">
                                  <button className="viewBy-tHead-btn">
                                    Counter Offer
                                  </button>
                                </div>
                              </td>
                              <td className="viewBy-tHead p-1 pb-2">
                                <div className="viewBy-tHead-heading">
                                  <div className="viewBy-tHead-heading-child">
                                    <span className="viewBy-tHead-heading-child-span">
                                      <svg
                                        width={16}
                                        height={23}
                                        viewBox="0 0 16 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12.237 2.67658V2.67521V2.66494V2.65468V2.65331V2.14471C12.237 1.98591 12.162 1.84079 12.0412 1.73675L12.0239 1.721C11.9054 1.62585 11.7459 1.56699 11.5699 1.56699H4.42539C4.24142 1.56699 4.07404 1.63133 3.95482 1.73538C3.83323 1.84079 3.75902 1.98522 3.75902 2.14471V2.65399V2.66494V2.67521V3.05032H12.237V2.67658ZM3.75902 3.84846V7.35864C3.79928 8.06163 3.97693 8.74067 4.27379 9.37179C4.28248 9.38684 4.28959 9.4019 4.2959 9.41765C4.3788 9.59015 4.47039 9.75854 4.57066 9.9235C5.0578 10.7237 5.74312 11.4253 6.58239 11.9729C6.80662 12.1194 7.05058 12.2276 7.30403 12.2967L7.30955 12.2981L7.31508 12.2994L7.32613 12.3029C7.54562 12.361 7.77222 12.3898 7.99882 12.3898C8.22541 12.3898 8.45201 12.361 8.6715 12.3029L8.68255 12.2994L8.68808 12.2981L8.69361 12.2967C8.94626 12.2276 9.19101 12.1194 9.41524 11.9729C10.2545 11.426 10.9406 10.7244 11.427 9.92419C11.5272 9.75922 11.6188 9.59083 11.7017 9.41833C11.708 9.40259 11.7152 9.38684 11.7238 9.37179C12.0215 8.73724 12.1999 8.0541 12.2386 7.34769L12.2378 3.84983H3.75981L3.75902 3.84846ZM13.1576 3.4316V3.44939V3.46719L13.1561 7.36411C13.1245 7.9747 13.0013 8.56885 12.796 9.13494C13.2492 9.09114 13.6598 8.92891 13.9835 8.68317C14.3664 8.39225 14.6309 7.98223 14.7035 7.5106L15.0572 5.19832C15.0999 4.91904 15.077 4.6514 14.9901 4.40155C14.9033 4.1517 14.7509 3.91828 14.5369 3.70609C14.323 3.49457 14.0759 3.33303 13.8027 3.22556C13.6037 3.14752 13.3874 3.09755 13.1568 3.07633V3.43228L13.1576 3.4316ZM3.89166 21.2323H12.1036C12.1399 21.2323 12.1739 21.2193 12.1976 21.1981C12.2212 21.1776 12.237 21.1481 12.237 21.1166V19.5758C12.237 19.5443 12.222 19.5156 12.1976 19.4943C12.1739 19.4738 12.1399 19.4601 12.1036 19.4601H10.924H10.9114H5.08307H5.06964H3.89087C3.85455 19.4601 3.82139 19.4731 3.79692 19.4943C3.77323 19.5149 3.75744 19.5443 3.75744 19.5758V21.1166C3.75744 21.1481 3.77244 21.1769 3.79692 21.1981C3.8206 21.2186 3.85534 21.2323 3.89166 21.2323ZM12.1036 22.0311H3.89166C3.6019 22.0311 3.33741 21.9278 3.14713 21.7628C2.95685 21.5978 2.83763 21.3685 2.83763 21.1173V19.5765C2.83763 19.3253 2.95685 19.096 3.14713 18.931C3.33741 18.766 3.6019 18.6627 3.89166 18.6627H4.07246C4.06931 18.6353 4.06773 18.6079 4.06773 18.5805V17.6017C4.06773 17.3593 4.18221 17.1389 4.36617 16.9794L4.39854 16.9541C4.58013 16.8097 4.82094 16.7207 5.08386 16.7207H5.62706C5.90655 16.1279 6.13552 15.5098 6.31395 14.8753C6.49002 14.2482 6.61555 13.6021 6.68977 12.9456C6.4608 12.8573 6.24052 12.7451 6.03209 12.6095C5.08149 11.9894 4.30617 11.1967 3.75744 10.2952C3.68796 10.1809 3.62164 10.0645 3.55927 9.94609H3.44952C2.67183 9.94609 1.95572 9.6983 1.40858 9.2828C0.862218 8.86798 0.484821 8.28478 0.382971 7.61464L0.0292602 5.30237C-0.0307443 4.90603 0.00162604 4.52681 0.125583 4.17155C0.24954 3.81629 0.465083 3.4843 0.769053 3.18312C1.07223 2.88262 1.42437 2.65399 1.81598 2.49998C2.13495 2.37471 2.47682 2.29941 2.83921 2.27546V2.14608C2.83921 1.76892 3.01765 1.42529 3.30504 1.17545C3.59558 0.924231 3.99193 0.769531 4.42775 0.769531H11.5722C11.9946 0.769531 12.3807 0.915332 12.6665 1.15149L12.6942 1.17339C12.9816 1.42256 13.1608 1.76686 13.1608 2.14608V2.27546C13.5232 2.29941 13.8658 2.37471 14.184 2.49998C14.5756 2.65399 14.9278 2.88262 15.2309 3.18312C15.5349 3.4843 15.7513 3.81629 15.8744 4.17155C15.9984 4.52681 16.0307 4.90603 15.9707 5.30237L15.617 7.61464C15.5144 8.28547 15.1378 8.86798 14.5914 9.2828C14.0443 9.6983 13.3282 9.94609 12.5505 9.94609H12.4407C12.3784 10.0645 12.312 10.1809 12.2426 10.2959C11.6938 11.1974 10.9185 11.99 9.96791 12.6102C9.75948 12.7464 9.53841 12.8587 9.31023 12.9463C9.38366 13.6027 9.50998 14.2489 9.68605 14.8759C9.86448 15.5105 10.0942 16.1286 10.3729 16.7214H10.9161C11.1941 16.7214 11.4483 16.8206 11.6323 16.9808C11.817 17.1389 11.9315 17.36 11.9315 17.6024V18.5812C11.9315 18.6093 11.9299 18.6366 11.9267 18.6633H12.1068C12.3965 18.6633 12.661 18.7667 12.8513 18.9317C13.0416 19.0966 13.1608 19.3259 13.1608 19.5772V21.118C13.1608 21.3692 13.0416 21.5985 12.8513 21.7635C12.661 21.9285 12.3965 22.0318 12.1068 22.0318L12.1036 22.0311ZM6.61239 16.7207H9.38366C9.1468 16.182 8.94862 15.6275 8.78993 15.0621C8.61465 14.4392 8.48754 13.8047 8.40779 13.1647C8.27199 13.1797 8.13461 13.1879 7.99803 13.1879C7.86144 13.1879 7.72406 13.1804 7.58826 13.1647C7.5093 13.8047 7.3814 14.4399 7.20612 15.0621C7.04743 15.6275 6.84925 16.182 6.61239 16.7207ZM10.9122 17.5195H5.08386C5.06175 17.5195 5.04201 17.5257 5.02701 17.5353L5.01754 17.5435C5.00017 17.5585 4.9899 17.5791 4.9899 17.6017V18.5805C4.9899 18.6031 5.00096 18.6236 5.01754 18.6387C5.03333 18.6524 5.05543 18.662 5.07912 18.6627H5.08386H10.9122H10.9161C10.9367 18.662 10.9548 18.6558 10.969 18.6462L10.9785 18.638C10.9959 18.623 11.0061 18.6024 11.0061 18.5798V17.601C11.0061 17.5784 10.9951 17.5579 10.9785 17.5428C10.9627 17.5277 10.939 17.5195 10.9122 17.5195ZM3.19924 9.13494C2.9987 8.57981 2.87553 7.9966 2.84079 7.39834L2.83684 7.347V3.46035V3.45008V3.43981V3.07633C2.6063 3.09755 2.39076 3.14752 2.19179 3.22556C1.9194 3.33303 1.67228 3.49457 1.45753 3.70609C1.24356 3.9176 1.09197 4.1517 1.00433 4.40155C0.917486 4.6514 0.894589 4.91904 0.937224 5.19832L1.29094 7.5106C1.36278 7.98223 1.62807 8.39225 2.01099 8.68317C2.3347 8.92891 2.74684 9.09114 3.19924 9.13494Z"
                                          fill="black"
                                        />
                                      </svg>
                                      1
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-start">
                                    <div className="me-3">
                                      <p
                                        className="viewBy-tHead-heading-p1"
                                        title="Manly ELECTRIC Product"
                                      >
                                        Vendor 2
                                      </p>
                                      <p className="viewBy-tHead-heading-p2">
                                        11:40 am, 24 Jan 2024
                                      </p>
                                    </div>
                                    <button className=" btn d-flex align-items-center">
                                      <svg
                                        width={4}
                                        height={13}
                                        viewBox="0 0 4 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.666504 1.46321C0.666504 0.726833 1.26346 0.129883 1.99984 0.129883C2.73622 0.129883 3.33317 0.726833 3.33317 1.46321C3.33317 2.19959 2.73622 2.79655 1.99984 2.79655C1.26346 2.79655 0.666504 2.19959 0.666504 1.46321ZM0.666504 6.12988C0.666504 5.3935 1.26346 4.79655 1.99984 4.79655C2.73622 4.79655 3.33317 5.3935 3.33317 6.12988C3.33317 6.86626 2.73622 7.46321 1.99984 7.46321C1.26346 7.46321 0.666504 6.86626 0.666504 6.12988ZM0.666504 10.7966C0.666504 10.0602 1.26346 9.46318 1.99984 9.46318C2.73622 9.46318 3.33317 10.0602 3.33317 10.7966C3.33317 11.5329 2.73622 12.1299 1.99984 12.1299C1.26346 12.1299 0.666504 11.5329 0.666504 10.7966Z"
                                          fill="#94A3B8"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div
                                  className=" d-flex align-items-center justify-content-center"
                                  style={{ flexDirection: "column" }}
                                >
                                  <div className="viewBy-bid-main">
                                    <button className="btn viewBy-bid-main-left">
                                      <svg
                                        width={9}
                                        height={13}
                                        viewBox="0 0 9 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.31252 1.83111V0.6233C8.31252 0.518612 8.19221 0.4608 8.11096 0.524862L1.06721 6.02642C1.00736 6.07297 0.958938 6.13256 0.925627 6.20066C0.892316 6.26877 0.875 6.34358 0.875 6.41939C0.875 6.49521 0.892316 6.57002 0.925627 6.63812C0.958938 6.70623 1.00736 6.76582 1.06721 6.81236L8.11096 12.3139C8.19377 12.378 8.31252 12.3202 8.31252 12.2155V11.0077C8.31252 10.9311 8.27659 10.8577 8.21721 10.8108L2.59221 6.42017L8.21721 2.02799C8.27659 1.98111 8.31252 1.90767 8.31252 1.83111Z"
                                          fill="black"
                                          fillOpacity="0.25"
                                        />
                                      </svg>
                                    </button>
                                    <p className="m-0 viewBy-bid-main-p">
                                      Current Bid 4
                                    </p>
                                    <button className=" btn viewBy-bid-main-right">
                                      <svg
                                        width={14}
                                        height={15}
                                        viewBox="0 0 14 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M10.9641 7.02629L3.92031 1.52473C3.90191 1.51024 3.87979 1.50124 3.8565 1.49875C3.8332 1.49626 3.80968 1.5004 3.78863 1.51068C3.76758 1.52096 3.74986 1.53697 3.7375 1.55686C3.72514 1.57676 3.71864 1.59974 3.71875 1.62317V2.83098C3.71875 2.90754 3.75469 2.98098 3.81406 3.02786L9.43906 7.42004L3.81406 11.8122C3.75313 11.8591 3.71875 11.9325 3.71875 12.0091V13.2169C3.71875 13.3216 3.83906 13.3794 3.92031 13.3154L10.9641 7.81379C11.0239 7.7671 11.0724 7.70736 11.1057 7.63913C11.139 7.5709 11.1563 7.49597 11.1563 7.42004C11.1563 7.34412 11.139 7.26919 11.1057 7.20096C11.0724 7.13273 11.0239 7.07299 10.9641 7.02629Z"
                                          fill="#334155"
                                        />
                                      </svg>
                                    </button>
                                    <svg
                                      width={18}
                                      height={19}
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g clipPath="url(#clip0_105_1053)">
                                        <path
                                          d="M6.25009 11.1455C6.25009 11.3444 6.32911 11.5352 6.46976 11.6758C6.61041 11.8165 6.80118 11.8955 7.00009 11.8955C7.199 11.8955 7.38977 11.8165 7.53042 11.6758C7.67107 11.5352 7.75009 11.3444 7.75009 11.1455C7.75009 10.9466 7.67107 10.7558 7.53042 10.6152C7.38977 10.4745 7.199 10.3955 7.00009 10.3955C6.80118 10.3955 6.61041 10.4745 6.46976 10.6152C6.32911 10.7558 6.25009 10.9466 6.25009 11.1455ZM9.37509 11.1455C9.37509 11.3444 9.45411 11.5352 9.59476 11.6758C9.73541 11.8165 9.92618 11.8955 10.1251 11.8955C10.324 11.8955 10.5148 11.8165 10.6554 11.6758C10.7961 11.5352 10.8751 11.3444 10.8751 11.1455C10.8751 10.9466 10.7961 10.7558 10.6554 10.6152C10.5148 10.4745 10.324 10.3955 10.1251 10.3955C9.92618 10.3955 9.73541 10.4745 9.59476 10.6152C9.45411 10.7558 9.37509 10.9466 9.37509 11.1455ZM3.12509 11.1455C3.12509 11.3444 3.20411 11.5352 3.34476 11.6758C3.48541 11.8165 3.67618 11.8955 3.87509 11.8955C4.074 11.8955 4.26477 11.8165 4.40542 11.6758C4.54607 11.5352 4.62509 11.3444 4.62509 11.1455C4.62509 10.9466 4.54607 10.7558 4.40542 10.6152C4.26477 10.4745 4.074 10.3955 3.87509 10.3955C3.67618 10.3955 3.48541 10.4745 3.34476 10.6152C3.20411 10.7558 3.12509 10.9466 3.12509 11.1455ZM13.4563 8.43301C13.1032 7.59395 12.597 6.84082 11.9517 6.19395C11.3109 5.55081 10.5501 5.0396 9.71259 4.68926C8.85321 4.32832 7.94071 4.14551 7.00009 4.14551H6.96884C6.02196 4.1502 5.10478 4.3377 4.24228 4.70645C3.4119 5.06038 2.65831 5.5725 2.02353 6.21426C1.38446 6.85957 0.882901 7.60957 0.536026 8.44551C0.176651 9.31113 -0.00459886 10.2314 8.86448e-05 11.1783C0.0053906 12.2634 0.262107 13.3325 0.750089 14.3018V16.6768C0.750089 16.8674 0.825814 17.0502 0.960606 17.185C1.0954 17.3198 1.27821 17.3955 1.46884 17.3955H3.8454C4.81461 17.8835 5.88373 18.1402 6.96884 18.1455H7.00165C7.93759 18.1455 8.8454 17.9643 9.70009 17.6096C10.5334 17.2634 11.2913 16.7581 11.9313 16.1221C12.5767 15.483 13.0845 14.7361 13.4392 13.9033C13.8079 13.0408 13.9954 12.1236 14.0001 11.1768C14.0048 10.2252 13.8204 9.30176 13.4563 8.43301ZM11.0954 15.2768C10.0001 16.3611 8.54696 16.958 7.00009 16.958H6.97353C6.03134 16.9533 5.0954 16.7189 4.26884 16.2783L4.13759 16.208H1.93759V14.008L1.86728 13.8768C1.42665 13.0502 1.19228 12.1143 1.18759 11.1721C1.18134 9.61426 1.77665 8.15176 2.86884 7.0502C3.95946 5.94863 5.41728 5.33926 6.97509 5.33301H7.00165C7.7829 5.33301 8.54071 5.48457 9.25478 5.78457C9.95165 6.07676 10.5767 6.49707 11.1142 7.03457C11.6501 7.57051 12.072 8.19707 12.3642 8.89395C12.6673 9.61582 12.8188 10.3814 12.8157 11.1721C12.8063 12.7283 12.1954 14.1861 11.0954 15.2768Z"
                                          fill="#1E293B"
                                        />
                                      </g>
                                      <g filter="url(#filter0_d_105_1053)">
                                        <rect
                                          x={11}
                                          y="1.14551"
                                          width={6}
                                          height={6}
                                          rx={3}
                                          fill="#3A3A33"
                                        />
                                      </g>
                                      <defs>
                                        <filter
                                          id="filter0_d_105_1053"
                                          x={10}
                                          y="0.145508"
                                          width={8}
                                          height={8}
                                          filterUnits="userSpaceOnUse"
                                          colorInterpolationFilters="sRGB"
                                        >
                                          <feFlood
                                            floodOpacity={0}
                                            result="BackgroundImageFix"
                                          />
                                          <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                          />
                                          <feMorphology
                                            radius={1}
                                            operator="dilate"
                                            in="SourceAlpha"
                                            result="effect1_dropShadow_105_1053"
                                          />
                                          <feOffset />
                                          <feComposite
                                            in2="hardAlpha"
                                            operator="out"
                                          />
                                          <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                                          />
                                          <feBlend
                                            mode="normal"
                                            in2="BackgroundImageFix"
                                            result="effect1_dropShadow_105_1053"
                                          />
                                          <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="effect1_dropShadow_105_1053"
                                            result="shape"
                                          />
                                        </filter>
                                        <clipPath id="clip0_105_1053">
                                          <rect
                                            width={14}
                                            height={14}
                                            fill="white"
                                            transform="translate(0 4.14551)"
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </div>
                                  <button className=" viewBy-tHead-btn viewBy-tHead-btn2">
                                    Counter Offer
                                  </button>
                                </div>
                              </td>
                              <td className="viewBy-tHead p-1 pb-2">
                                <div className="viewBy-tHead-heading">
                                  <div className="viewBy-tHead-heading-child">
                                    <span className="viewBy-tHead-heading-child-span">
                                      <svg
                                        width={16}
                                        height={23}
                                        viewBox="0 0 16 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12.237 2.67658V2.67521V2.66494V2.65468V2.65331V2.14471C12.237 1.98591 12.162 1.84079 12.0412 1.73675L12.0239 1.721C11.9054 1.62585 11.7459 1.56699 11.5699 1.56699H4.42539C4.24142 1.56699 4.07404 1.63133 3.95482 1.73538C3.83323 1.84079 3.75902 1.98522 3.75902 2.14471V2.65399V2.66494V2.67521V3.05032H12.237V2.67658ZM3.75902 3.84846V7.35864C3.79928 8.06163 3.97693 8.74067 4.27379 9.37179C4.28248 9.38684 4.28959 9.4019 4.2959 9.41765C4.3788 9.59015 4.47039 9.75854 4.57066 9.9235C5.0578 10.7237 5.74312 11.4253 6.58239 11.9729C6.80662 12.1194 7.05058 12.2276 7.30403 12.2967L7.30955 12.2981L7.31508 12.2994L7.32613 12.3029C7.54562 12.361 7.77222 12.3898 7.99882 12.3898C8.22541 12.3898 8.45201 12.361 8.6715 12.3029L8.68255 12.2994L8.68808 12.2981L8.69361 12.2967C8.94626 12.2276 9.19101 12.1194 9.41524 11.9729C10.2545 11.426 10.9406 10.7244 11.427 9.92419C11.5272 9.75922 11.6188 9.59083 11.7017 9.41833C11.708 9.40259 11.7152 9.38684 11.7238 9.37179C12.0215 8.73724 12.1999 8.0541 12.2386 7.34769L12.2378 3.84983H3.75981L3.75902 3.84846ZM13.1576 3.4316V3.44939V3.46719L13.1561 7.36411C13.1245 7.9747 13.0013 8.56885 12.796 9.13494C13.2492 9.09114 13.6598 8.92891 13.9835 8.68317C14.3664 8.39225 14.6309 7.98223 14.7035 7.5106L15.0572 5.19832C15.0999 4.91904 15.077 4.6514 14.9901 4.40155C14.9033 4.1517 14.7509 3.91828 14.5369 3.70609C14.323 3.49457 14.0759 3.33303 13.8027 3.22556C13.6037 3.14752 13.3874 3.09755 13.1568 3.07633V3.43228L13.1576 3.4316ZM3.89166 21.2323H12.1036C12.1399 21.2323 12.1739 21.2193 12.1976 21.1981C12.2212 21.1776 12.237 21.1481 12.237 21.1166V19.5758C12.237 19.5443 12.222 19.5156 12.1976 19.4943C12.1739 19.4738 12.1399 19.4601 12.1036 19.4601H10.924H10.9114H5.08307H5.06964H3.89087C3.85455 19.4601 3.82139 19.4731 3.79692 19.4943C3.77323 19.5149 3.75744 19.5443 3.75744 19.5758V21.1166C3.75744 21.1481 3.77244 21.1769 3.79692 21.1981C3.8206 21.2186 3.85534 21.2323 3.89166 21.2323ZM12.1036 22.0311H3.89166C3.6019 22.0311 3.33741 21.9278 3.14713 21.7628C2.95685 21.5978 2.83763 21.3685 2.83763 21.1173V19.5765C2.83763 19.3253 2.95685 19.096 3.14713 18.931C3.33741 18.766 3.6019 18.6627 3.89166 18.6627H4.07246C4.06931 18.6353 4.06773 18.6079 4.06773 18.5805V17.6017C4.06773 17.3593 4.18221 17.1389 4.36617 16.9794L4.39854 16.9541C4.58013 16.8097 4.82094 16.7207 5.08386 16.7207H5.62706C5.90655 16.1279 6.13552 15.5098 6.31395 14.8753C6.49002 14.2482 6.61555 13.6021 6.68977 12.9456C6.4608 12.8573 6.24052 12.7451 6.03209 12.6095C5.08149 11.9894 4.30617 11.1967 3.75744 10.2952C3.68796 10.1809 3.62164 10.0645 3.55927 9.94609H3.44952C2.67183 9.94609 1.95572 9.6983 1.40858 9.2828C0.862218 8.86798 0.484821 8.28478 0.382971 7.61464L0.0292602 5.30237C-0.0307443 4.90603 0.00162604 4.52681 0.125583 4.17155C0.24954 3.81629 0.465083 3.4843 0.769053 3.18312C1.07223 2.88262 1.42437 2.65399 1.81598 2.49998C2.13495 2.37471 2.47682 2.29941 2.83921 2.27546V2.14608C2.83921 1.76892 3.01765 1.42529 3.30504 1.17545C3.59558 0.924231 3.99193 0.769531 4.42775 0.769531H11.5722C11.9946 0.769531 12.3807 0.915332 12.6665 1.15149L12.6942 1.17339C12.9816 1.42256 13.1608 1.76686 13.1608 2.14608V2.27546C13.5232 2.29941 13.8658 2.37471 14.184 2.49998C14.5756 2.65399 14.9278 2.88262 15.2309 3.18312C15.5349 3.4843 15.7513 3.81629 15.8744 4.17155C15.9984 4.52681 16.0307 4.90603 15.9707 5.30237L15.617 7.61464C15.5144 8.28547 15.1378 8.86798 14.5914 9.2828C14.0443 9.6983 13.3282 9.94609 12.5505 9.94609H12.4407C12.3784 10.0645 12.312 10.1809 12.2426 10.2959C11.6938 11.1974 10.9185 11.99 9.96791 12.6102C9.75948 12.7464 9.53841 12.8587 9.31023 12.9463C9.38366 13.6027 9.50998 14.2489 9.68605 14.8759C9.86448 15.5105 10.0942 16.1286 10.3729 16.7214H10.9161C11.1941 16.7214 11.4483 16.8206 11.6323 16.9808C11.817 17.1389 11.9315 17.36 11.9315 17.6024V18.5812C11.9315 18.6093 11.9299 18.6366 11.9267 18.6633H12.1068C12.3965 18.6633 12.661 18.7667 12.8513 18.9317C13.0416 19.0966 13.1608 19.3259 13.1608 19.5772V21.118C13.1608 21.3692 13.0416 21.5985 12.8513 21.7635C12.661 21.9285 12.3965 22.0318 12.1068 22.0318L12.1036 22.0311ZM6.61239 16.7207H9.38366C9.1468 16.182 8.94862 15.6275 8.78993 15.0621C8.61465 14.4392 8.48754 13.8047 8.40779 13.1647C8.27199 13.1797 8.13461 13.1879 7.99803 13.1879C7.86144 13.1879 7.72406 13.1804 7.58826 13.1647C7.5093 13.8047 7.3814 14.4399 7.20612 15.0621C7.04743 15.6275 6.84925 16.182 6.61239 16.7207ZM10.9122 17.5195H5.08386C5.06175 17.5195 5.04201 17.5257 5.02701 17.5353L5.01754 17.5435C5.00017 17.5585 4.9899 17.5791 4.9899 17.6017V18.5805C4.9899 18.6031 5.00096 18.6236 5.01754 18.6387C5.03333 18.6524 5.05543 18.662 5.07912 18.6627H5.08386H10.9122H10.9161C10.9367 18.662 10.9548 18.6558 10.969 18.6462L10.9785 18.638C10.9959 18.623 11.0061 18.6024 11.0061 18.5798V17.601C11.0061 17.5784 10.9951 17.5579 10.9785 17.5428C10.9627 17.5277 10.939 17.5195 10.9122 17.5195ZM3.19924 9.13494C2.9987 8.57981 2.87553 7.9966 2.84079 7.39834L2.83684 7.347V3.46035V3.45008V3.43981V3.07633C2.6063 3.09755 2.39076 3.14752 2.19179 3.22556C1.9194 3.33303 1.67228 3.49457 1.45753 3.70609C1.24356 3.9176 1.09197 4.1517 1.00433 4.40155C0.917486 4.6514 0.894589 4.91904 0.937224 5.19832L1.29094 7.5106C1.36278 7.98223 1.62807 8.39225 2.01099 8.68317C2.3347 8.92891 2.74684 9.09114 3.19924 9.13494Z"
                                          fill="black"
                                        />
                                      </svg>
                                      1
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-start">
                                    <div className="me-3">
                                      <p
                                        className="viewBy-tHead-heading-p1"
                                        title="Manly ELECTRIC Product"
                                      >
                                        Vendor3
                                      </p>
                                      <p className="viewBy-tHead-heading-p2">
                                        11:40 am, 24 Jan 2024
                                      </p>
                                    </div>
                                    <button className=" btn d-flex align-items-center">
                                      <svg
                                        width={4}
                                        height={13}
                                        viewBox="0 0 4 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.666504 1.46321C0.666504 0.726833 1.26346 0.129883 1.99984 0.129883C2.73622 0.129883 3.33317 0.726833 3.33317 1.46321C3.33317 2.19959 2.73622 2.79655 1.99984 2.79655C1.26346 2.79655 0.666504 2.19959 0.666504 1.46321ZM0.666504 6.12988C0.666504 5.3935 1.26346 4.79655 1.99984 4.79655C2.73622 4.79655 3.33317 5.3935 3.33317 6.12988C3.33317 6.86626 2.73622 7.46321 1.99984 7.46321C1.26346 7.46321 0.666504 6.86626 0.666504 6.12988ZM0.666504 10.7966C0.666504 10.0602 1.26346 9.46318 1.99984 9.46318C2.73622 9.46318 3.33317 10.0602 3.33317 10.7966C3.33317 11.5329 2.73622 12.1299 1.99984 12.1299C1.26346 12.1299 0.666504 11.5329 0.666504 10.7966Z"
                                          fill="#94A3B8"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div
                                  className=" d-flex align-items-center justify-content-center"
                                  style={{ flexDirection: "column" }}
                                >
                                  <div className="viewBy-bid-main">
                                    <button className="btn viewBy-bid-main-left">
                                      <svg
                                        width={9}
                                        height={13}
                                        viewBox="0 0 9 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.31252 1.83111V0.6233C8.31252 0.518612 8.19221 0.4608 8.11096 0.524862L1.06721 6.02642C1.00736 6.07297 0.958938 6.13256 0.925627 6.20066C0.892316 6.26877 0.875 6.34358 0.875 6.41939C0.875 6.49521 0.892316 6.57002 0.925627 6.63812C0.958938 6.70623 1.00736 6.76582 1.06721 6.81236L8.11096 12.3139C8.19377 12.378 8.31252 12.3202 8.31252 12.2155V11.0077C8.31252 10.9311 8.27659 10.8577 8.21721 10.8108L2.59221 6.42017L8.21721 2.02799C8.27659 1.98111 8.31252 1.90767 8.31252 1.83111Z"
                                          fill="black"
                                          fillOpacity="0.25"
                                        />
                                      </svg>
                                    </button>
                                    <p className="m-0 viewBy-bid-main-p">
                                      Current Bid 4
                                    </p>
                                    <button className=" btn viewBy-bid-main-right">
                                      <svg
                                        width={14}
                                        height={15}
                                        viewBox="0 0 14 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M10.9641 7.02629L3.92031 1.52473C3.90191 1.51024 3.87979 1.50124 3.8565 1.49875C3.8332 1.49626 3.80968 1.5004 3.78863 1.51068C3.76758 1.52096 3.74986 1.53697 3.7375 1.55686C3.72514 1.57676 3.71864 1.59974 3.71875 1.62317V2.83098C3.71875 2.90754 3.75469 2.98098 3.81406 3.02786L9.43906 7.42004L3.81406 11.8122C3.75313 11.8591 3.71875 11.9325 3.71875 12.0091V13.2169C3.71875 13.3216 3.83906 13.3794 3.92031 13.3154L10.9641 7.81379C11.0239 7.7671 11.0724 7.70736 11.1057 7.63913C11.139 7.5709 11.1563 7.49597 11.1563 7.42004C11.1563 7.34412 11.139 7.26919 11.1057 7.20096C11.0724 7.13273 11.0239 7.07299 10.9641 7.02629Z"
                                          fill="#334155"
                                        />
                                      </svg>
                                    </button>
                                    <svg
                                      width={18}
                                      height={19}
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g clipPath="url(#clip0_105_1053)">
                                        <path
                                          d="M6.25009 11.1455C6.25009 11.3444 6.32911 11.5352 6.46976 11.6758C6.61041 11.8165 6.80118 11.8955 7.00009 11.8955C7.199 11.8955 7.38977 11.8165 7.53042 11.6758C7.67107 11.5352 7.75009 11.3444 7.75009 11.1455C7.75009 10.9466 7.67107 10.7558 7.53042 10.6152C7.38977 10.4745 7.199 10.3955 7.00009 10.3955C6.80118 10.3955 6.61041 10.4745 6.46976 10.6152C6.32911 10.7558 6.25009 10.9466 6.25009 11.1455ZM9.37509 11.1455C9.37509 11.3444 9.45411 11.5352 9.59476 11.6758C9.73541 11.8165 9.92618 11.8955 10.1251 11.8955C10.324 11.8955 10.5148 11.8165 10.6554 11.6758C10.7961 11.5352 10.8751 11.3444 10.8751 11.1455C10.8751 10.9466 10.7961 10.7558 10.6554 10.6152C10.5148 10.4745 10.324 10.3955 10.1251 10.3955C9.92618 10.3955 9.73541 10.4745 9.59476 10.6152C9.45411 10.7558 9.37509 10.9466 9.37509 11.1455ZM3.12509 11.1455C3.12509 11.3444 3.20411 11.5352 3.34476 11.6758C3.48541 11.8165 3.67618 11.8955 3.87509 11.8955C4.074 11.8955 4.26477 11.8165 4.40542 11.6758C4.54607 11.5352 4.62509 11.3444 4.62509 11.1455C4.62509 10.9466 4.54607 10.7558 4.40542 10.6152C4.26477 10.4745 4.074 10.3955 3.87509 10.3955C3.67618 10.3955 3.48541 10.4745 3.34476 10.6152C3.20411 10.7558 3.12509 10.9466 3.12509 11.1455ZM13.4563 8.43301C13.1032 7.59395 12.597 6.84082 11.9517 6.19395C11.3109 5.55081 10.5501 5.0396 9.71259 4.68926C8.85321 4.32832 7.94071 4.14551 7.00009 4.14551H6.96884C6.02196 4.1502 5.10478 4.3377 4.24228 4.70645C3.4119 5.06038 2.65831 5.5725 2.02353 6.21426C1.38446 6.85957 0.882901 7.60957 0.536026 8.44551C0.176651 9.31113 -0.00459886 10.2314 8.86448e-05 11.1783C0.0053906 12.2634 0.262107 13.3325 0.750089 14.3018V16.6768C0.750089 16.8674 0.825814 17.0502 0.960606 17.185C1.0954 17.3198 1.27821 17.3955 1.46884 17.3955H3.8454C4.81461 17.8835 5.88373 18.1402 6.96884 18.1455H7.00165C7.93759 18.1455 8.8454 17.9643 9.70009 17.6096C10.5334 17.2634 11.2913 16.7581 11.9313 16.1221C12.5767 15.483 13.0845 14.7361 13.4392 13.9033C13.8079 13.0408 13.9954 12.1236 14.0001 11.1768C14.0048 10.2252 13.8204 9.30176 13.4563 8.43301ZM11.0954 15.2768C10.0001 16.3611 8.54696 16.958 7.00009 16.958H6.97353C6.03134 16.9533 5.0954 16.7189 4.26884 16.2783L4.13759 16.208H1.93759V14.008L1.86728 13.8768C1.42665 13.0502 1.19228 12.1143 1.18759 11.1721C1.18134 9.61426 1.77665 8.15176 2.86884 7.0502C3.95946 5.94863 5.41728 5.33926 6.97509 5.33301H7.00165C7.7829 5.33301 8.54071 5.48457 9.25478 5.78457C9.95165 6.07676 10.5767 6.49707 11.1142 7.03457C11.6501 7.57051 12.072 8.19707 12.3642 8.89395C12.6673 9.61582 12.8188 10.3814 12.8157 11.1721C12.8063 12.7283 12.1954 14.1861 11.0954 15.2768Z"
                                          fill="#1E293B"
                                        />
                                      </g>
                                      <g filter="url(#filter0_d_105_1053)">
                                        <rect
                                          x={11}
                                          y="1.14551"
                                          width={6}
                                          height={6}
                                          rx={3}
                                          fill="#3A3A33"
                                        />
                                      </g>
                                      <defs>
                                        <filter
                                          id="filter0_d_105_1053"
                                          x={10}
                                          y="0.145508"
                                          width={8}
                                          height={8}
                                          filterUnits="userSpaceOnUse"
                                          colorInterpolationFilters="sRGB"
                                        >
                                          <feFlood
                                            floodOpacity={0}
                                            result="BackgroundImageFix"
                                          />
                                          <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                          />
                                          <feMorphology
                                            radius={1}
                                            operator="dilate"
                                            in="SourceAlpha"
                                            result="effect1_dropShadow_105_1053"
                                          />
                                          <feOffset />
                                          <feComposite
                                            in2="hardAlpha"
                                            operator="out"
                                          />
                                          <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                                          />
                                          <feBlend
                                            mode="normal"
                                            in2="BackgroundImageFix"
                                            result="effect1_dropShadow_105_1053"
                                          />
                                          <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="effect1_dropShadow_105_1053"
                                            result="shape"
                                          />
                                        </filter>
                                        <clipPath id="clip0_105_1053">
                                          <rect
                                            width={14}
                                            height={14}
                                            fill="white"
                                            transform="translate(0 4.14551)"
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </div>
                                  <button className=" viewBy-tHead-btn viewBy-tHead-btn2">
                                    Counter Offer
                                  </button>
                                </div>
                              </td>
                              <td className="viewBy-tHead">
                                <div className="viewBy-tHead-heading"></div>
                              </td>
                            </tr>
                            <tr>
                              <td className="viewBy-tBody1-p">Gross Total</td>
                              <td className="viewBy-tBody1-1">
                                <span className="viewBy-tBody1-R">₹</span>
                                15883962.3
                              </td>
                              <td className="viewBy-tBody1-2">
                                <span className="viewBy-tBody1-R">₹</span>
                                7681656.04
                              </td>
                              <td className="viewBy-tBody1-3">
                                <span className="viewBy-tBody1-R">₹</span>
                                14058103.00
                              </td>
                              <td className="viewBy-tBody1-3">
                                <span className="viewBy-tBody1-R" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="accordion" id="accordionExample1">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                              <button
                                className="accordion-button viewBy-collapT1"
                                type="button"
                                onClick={toggleAccordion}
                                aria-expanded={isOpen}
                                aria-controls="collapseOne"
                              >
                                <span className="pe-3">
                                  <svg
                                    width={24}
                                    height={27}
                                    viewBox="0 0 24 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      transform: isOpen
                                        ? "rotate(0deg)"
                                        : "rotate(300deg)",
                                      transition: "transform 0.3s",
                                    }}
                                  >
                                    <g filter="url(#filter0_d_105_1158)">
                                      <rect
                                        y="0.5"
                                        width={24}
                                        height={24}
                                        rx={12}
                                        fill="white"
                                        shapeRendering="crispEdges"
                                      />
                                      <rect
                                        x="0.5"
                                        y={1}
                                        width={23}
                                        height={23}
                                        rx="11.5"
                                        stroke="#E2E8F0"
                                        shapeRendering="crispEdges"
                                      />
                                      <path
                                        d="M16.49 9.10156H7.51035C7.24102 9.10156 7.09063 9.38594 7.25742 9.58008L11.7473 14.7863C11.8758 14.9354 12.1232 14.9354 12.2531 14.7863L16.743 9.58008C16.9098 9.38594 16.7594 9.10156 16.49 9.10156Z"
                                        fill="#334155"
                                      />
                                    </g>
                                    <defs>
                                      <filter
                                        id="filter0_d_105_1158"
                                        x={0}
                                        y="0.5"
                                        width={24}
                                        height={26}
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                      >
                                        <feFlood
                                          floodOpacity={0}
                                          result="BackgroundImageFix"
                                        />
                                        <feColorMatrix
                                          in="SourceAlpha"
                                          type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                          result="hardAlpha"
                                        />
                                        <feOffset dy={2} />
                                        <feComposite
                                          in2="hardAlpha"
                                          operator="out"
                                        />
                                        <feColorMatrix
                                          type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.016 0"
                                        />
                                        <feBlend
                                          mode="normal"
                                          in2="BackgroundImageFix"
                                          result="effect1_dropShadow_105_1158"
                                        />
                                        <feBlend
                                          mode="normal"
                                          in="SourceGraphic"
                                          in2="effect1_dropShadow_105_1158"
                                          result="shape"
                                        />
                                      </filter>
                                    </defs>
                                  </svg>
                                </span>
                                <span
                                  style={{ color: isOpen ? "#e95420" : "" }}
                                >
                                  Wooden Frd Door{" "}
                                </span>
                                <span
                                  style={{ color: isOpen ? "#e95420" : "" }}
                                >
                                  (WOODEN DOOR SHUTTER 2 HRS FIRE RATED (MAIN
                                  DOOR))
                                </span>
                                <span
                                  style={{ color: isOpen ? "#e95420" : "" }}
                                >
                                  1 257 Nos Requested at Sanvo Resorts Pvt. Ltd.
                                </span>
                                <span className="ms-auto">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="56"
                                    height="56"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="thin"
                                    style={{
                                      transform: isOpen
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      transition: "transform 0.3s",
                                    }}
                                  >
                                    <polyline points="6 9 8 11 10 9"></polyline>
                                  </svg>
                                </span>
                              </button>
                            </h2>
                            <div
                              id="collapseOne"
                              className={`accordion-collapse collapse ${
                                isOpen ? "show" : ""
                              }`}
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample1"
                            >
                              <div className="accordion-body">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td
                                        className="viewBy-tBody2-p"
                                        style={{ width: "16%" }}
                                      >
                                        Best Total Amount
                                      </td>
                                      <td
                                        className="viewBy-tBody1-1"
                                        style={{ width: "20%" }}
                                      >
                                        1
                                        <span className="viewBy-tBody1-R">
                                          Lumpsum
                                        </span>
                                      </td>
                                      <td
                                        className="viewBy-tBody1-1"
                                        style={{ width: "20%" }}
                                      >
                                        1
                                        <span className="viewBy-tBody1-R">
                                          Lumpsum
                                        </span>
                                      </td>
                                      <td
                                        className="viewBy-tBody1-1"
                                        style={{ width: "20%" }}
                                      >
                                        1
                                        <span className="viewBy-tBody1-R">
                                          Lumpsum
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="viewBy-tBody2-p">
                                        Quantity Available
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        6850692.71
                                        <span className="viewBy-tBody1-R">
                                          /Lumpsum
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1-active">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        65,09,878
                                        <span className="viewBy-tBody1-R">
                                          /Lumpsum
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        1,40,58,103
                                        <span className="viewBy-tBody1-R">
                                          /Lumpsum
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R" />
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="viewBy-tBody2-p">Price</td>
                                      <td className="viewBy-tBody1-1">
                                        18
                                        <span className="viewBy-tBody1-R">
                                          %
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        18
                                        <span className="viewBy-tBody1-R">
                                          %
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R">
                                          -
                                        </span>
                                      </td>
                                      <td className="viewBy-tBody1-1">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="viewBy-tBody2-p">
                                        Realised Discount
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        68,50,692.71
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        76,81,656.04
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        1,40,58,103
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="viewBy-tBody2-p">GST</td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        68,50,692.71
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        76,81,656.04
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        1,40,58,103
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="viewBy-tBody2-p">
                                        Realised GST
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        68,50,692.71
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        76,81,656.04
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        1,40,58,103
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="default-val">
                                  <div className="col-md-2">
                                    <p className="d-flex gap-1 align-items-center">
                                      Default:{" "}
                                      <span className="viewBy-tBody1-R">₹</span>
                                      68{" "}
                                      <select name="" className="">
                                        {" "}
                                      </select>{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion" id="accordionExample2">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button
                                className="accordion-button viewBy-collapT1"
                                type="button"
                                onClick={toggleOthersAccordion}
                                aria-expanded={isOthersOpen}
                                aria-controls="collapseOne"
                              >
                                <span className="pe-3">
                                  <svg
                                    width={24}
                                    height={27}
                                    viewBox="0 0 24 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      transform: isOthersOpen
                                        ? "rotate(0deg)"
                                        : "rotate(300deg)",
                                      transition: "transform 0.3s",
                                    }}
                                  >
                                    <g filter="url(#filter0_d_105_1158)">
                                      <rect
                                        y="0.5"
                                        width={24}
                                        height={24}
                                        rx={12}
                                        fill="white"
                                        shapeRendering="crispEdges"
                                      />
                                      <rect
                                        x="0.5"
                                        y={1}
                                        width={23}
                                        height={23}
                                        rx="11.5"
                                        stroke="#E2E8F0"
                                        shapeRendering="crispEdges"
                                      />
                                      <path
                                        d="M16.49 9.10156H7.51035C7.24102 9.10156 7.09063 9.38594 7.25742 9.58008L11.7473 14.7863C11.8758 14.9354 12.1232 14.9354 12.2531 14.7863L16.743 9.58008C16.9098 9.38594 16.7594 9.10156 16.49 9.10156Z"
                                        fill="#334155"
                                      />
                                    </g>
                                    <defs>
                                      <filter
                                        id="filter0_d_105_1158"
                                        x={0}
                                        y="0.5"
                                        width={24}
                                        height={26}
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                      >
                                        <feFlood
                                          floodOpacity={0}
                                          result="BackgroundImageFix"
                                        />
                                        <feColorMatrix
                                          in="SourceAlpha"
                                          type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                          result="hardAlpha"
                                        />
                                        <feOffset dy={2} />
                                        <feComposite
                                          in2="hardAlpha"
                                          operator="out"
                                        />
                                        <feColorMatrix
                                          type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.016 0"
                                        />
                                        <feBlend
                                          mode="normal"
                                          in2="BackgroundImageFix"
                                          result="effect1_dropShadow_105_1158"
                                        />
                                        <feBlend
                                          mode="normal"
                                          in="SourceGraphic"
                                          in2="effect1_dropShadow_105_1158"
                                          result="shape"
                                        />
                                      </filter>
                                    </defs>
                                  </svg>
                                </span>{" "}
                                <span
                                  style={{
                                    color: isOthersOpen ? "#e95420" : "",
                                  }}
                                >
                                  Other Charges
                                </span>
                                <span className="ms-auto">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="56"
                                    height="56"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="thin"
                                    style={{
                                      transform: isOthersOpen
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      transition: "transform 0.3s",
                                    }}
                                  >
                                    <polyline points="6 9 8 11 10 9"></polyline>
                                  </svg>
                                </span>
                              </button>
                            </h2>
                            <div
                              id="collapseTwo"
                              aria-labelledby="headingTwo"
                              className={`accordion-collapse collapse ${
                                isOthersOpen ? "show" : ""
                              }`}
                              data-bs-parent="#accordionExample2"
                            >
                              <div className="accordion-body">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td
                                        className="viewBy-tBody2-p"
                                        style={{ width: "17%" }}
                                      >
                                        Sum Total
                                      </td>
                                      <td
                                        className="viewBy-tBody1-3"
                                        style={{ width: "20%" }}
                                      >
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        68,50,692.71
                                      </td>
                                      <td
                                        className="viewBy-tBody1-3"
                                        style={{ width: "20%" }}
                                      >
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        76,81,656.04
                                      </td>
                                      <td
                                        className="viewBy-tBody1-3"
                                        style={{ width: "20%" }}
                                      >
                                        <span className="viewBy-tBody1-R">
                                          ₹
                                        </span>
                                        1,40,58,103
                                      </td>
                                      <td className="viewBy-tBody1-3">
                                        <span className="viewBy-tBody1-R" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade show "
                      id="Comaprison"
                      role="tabpanel"
                      aria-labelledby="responses-tab"
                      tabIndex={0}
                    >
                      <h5 className="mt-3">Comparison Summary</h5>
                      <div className="tbl-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th
                                style={{ verticalAlign: "middle" }}
                                rowSpan={2}
                              >
                                Material
                              </th>
                              <th className="text-center" colSpan={4}>
                                Budget
                              </th>
                              <th colSpan={1}></th>
                              <th
                                style={{ verticalAlign: "middle" }}
                                rowSpan={2}
                              >
                                Order Qty
                              </th>
                              <th className="text-center" colSpan={5}>
                                Vendor 1
                              </th>
                              <th className="text-center" colSpan={5}>
                                {" "}
                                Vendor 2
                              </th>
                              <th className="text-center" colSpan={5}>
                                Vendor 3
                              </th>
                              <th
                                style={{ verticalAlign: "middle" }}
                                rowSpan={2}
                              >
                                Total Awarded Qty
                              </th>
                              <th
                                style={{ verticalAlign: "middle" }}
                                rowSpan={2}
                              >
                                Pending to Award Qty
                              </th>
                            </tr>
                            <tr>
                              <th>Rate</th>
                              <th>Qty</th>
                              <th>Remaining Qty</th>
                              <th>Cost</th>
                              <th>Remaining Cost</th>
                              <th>Available Qty</th>
                              <th>Rate</th>
                              <th>Discount %</th>
                              <th>Discounted Rate</th>
                              <th>Bid Amount</th>
                              <th>Available Qty</th>
                              <th>Rate</th>
                              <th>Discount %</th>
                              <th>Discounted Rate</th>
                              <th>Bid Amount</th>
                              <th>Available Qty</th>
                              <th>Rate</th>
                              <th>Discount %</th>
                              <th>Discounted Rate</th>
                              <th>Bid Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Material 1</td>
                              <td>35.00</td>
                              <td>100000</td>
                              <td>50000</td>
                              <td>3500000.00</td>
                              <td>1750000.00</td>
                              <td>10000</td>
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>{" "}
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>{" "}
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>
                              <td>10000</td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>Material 2</td>
                              <td>35.00</td>
                              <td>100000</td>
                              <td>50000</td>
                              <td>3500000.00</td>
                              <td>1750000.00</td>
                              <td>10000</td>
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>{" "}
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>{" "}
                              <td>10000</td>
                              <td>30.00</td>
                              <td>05.00 %</td>
                              <td>28.50</td>
                              <td
                                data-bs-toggle="modal"
                                data-bs-target="#award"
                                style={{
                                  color: "var(--red)",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                300000.00
                              </td>
                              <td>10000</td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <th>Total Quoted</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th>22000</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th>22000</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th>22000</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Total Discount %</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Quoted Average Rate</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Quoted Rate Difference</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Level Against Quoted Rate</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Discounted Average Rate</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Discounted Rate Difference</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Level Against Discounted Rate</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Other Charges</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Sub Total</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>GST</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Grand Total</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <th>Payment Terms</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th />
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <th />
                              <td></td>
                              <td></td>
                              <td></td>
                              <th>22000</th>
                              <td />
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h5>Awarded Material summary</h5>
                      <div className="tbl-container">
                        <table className="table w-100">
                          <thead>
                            <tr>
                              <th>Material</th>
                              <th>Vendor Name</th>
                              <th>Awarded Qty</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Material 1</td>
                              <td />
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <td>Material 2</td>
                              <td />
                              <td />
                              <td />
                            </tr>
                            <tr>
                              <td>Total</td>
                              <td />
                              <td />
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="overview"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                      tabIndex={0}
                    >
                      <section className="Erp-overview overflow-auto">
                        <div className="row my-2">
                          <div
                            className="viewBy-main"
                          >
                            <div className="viewBy-main-child2">
                              <p className="viewBy-main-child2P">
                                <span>
                                  <svg
                                    width={14}
                                    height={13}
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.8782 9.42654C11.4871 9.03513 11.0301 8.71566 10.5282 8.48279C11.236 7.90935 11.6875 7.03435 11.6875 6.0531C11.6875 4.32185 10.2438 2.90154 8.51254 2.9281C6.80785 2.95466 5.43441 4.34373 5.43441 6.0531C5.43441 7.03435 5.88754 7.90935 6.59379 8.48279C6.09177 8.71549 5.63476 9.03498 5.24379 9.42654C4.39066 10.2812 3.90629 11.4094 3.87504 12.6125C3.87462 12.6292 3.87755 12.6457 3.88364 12.6613C3.88974 12.6768 3.89888 12.691 3.91053 12.7029C3.92218 12.7148 3.9361 12.7243 3.95147 12.7308C3.96684 12.7373 3.98336 12.7406 4.00004 12.7406H4.87504C4.94223 12.7406 4.99848 12.6875 5.00004 12.6203C5.02973 11.714 5.39691 10.8656 6.04223 10.2219C6.37245 9.88988 6.76523 9.62669 7.19784 9.44753C7.63045 9.26837 8.0943 9.1768 8.56254 9.1781C9.5141 9.1781 10.4094 9.54841 11.0829 10.2219C11.7266 10.8656 12.0938 11.714 12.125 12.6203C12.1266 12.6875 12.1829 12.7406 12.25 12.7406H13.125C13.1417 12.7406 13.1582 12.7373 13.1736 12.7308C13.189 12.7243 13.2029 12.7148 13.2146 12.7029C13.2262 12.691 13.2353 12.6768 13.2414 12.6613C13.2475 12.6457 13.2505 12.6292 13.25 12.6125C13.2188 11.4094 12.7344 10.2812 11.8782 9.42654ZM8.56254 8.0531C8.02816 8.0531 7.52504 7.84529 7.14848 7.46716C6.9595 7.27967 6.81022 7.05604 6.70955 6.8096C6.60888 6.56316 6.55888 6.29897 6.56254 6.03279C6.56723 5.52029 6.77191 5.02498 7.12973 4.65779C7.50473 4.27341 8.00629 4.05935 8.54223 4.0531C9.07191 4.04841 9.58598 4.25466 9.9641 4.62498C10.3516 5.00466 10.5641 5.51248 10.5641 6.0531C10.5641 6.58748 10.3563 7.08904 9.97816 7.46716C9.79265 7.65356 9.57202 7.80132 9.32903 7.9019C9.08604 8.00247 8.82552 8.05387 8.56254 8.0531ZM4.64848 6.4656C4.63441 6.32966 4.6266 6.19216 4.6266 6.0531C4.6266 5.80466 4.65004 5.56248 4.69379 5.32654C4.70473 5.27029 4.67504 5.21248 4.62348 5.18904C4.41098 5.09373 4.21566 4.96248 4.04691 4.79685C3.84807 4.60405 3.6916 4.37192 3.58748 4.11526C3.48337 3.85861 3.4339 3.58307 3.44223 3.30623C3.45629 2.80466 3.65785 2.3281 4.00941 1.96873C4.39535 1.57341 4.9141 1.35779 5.46566 1.36404C5.9641 1.36873 6.44535 1.56091 6.80941 1.90154C6.93285 2.01716 7.0391 2.14529 7.12816 2.28279C7.15941 2.33123 7.22035 2.35154 7.27348 2.33279C7.54848 2.23748 7.8391 2.17029 8.13754 2.13904C8.22504 2.12966 8.27504 2.03591 8.23598 1.95779C7.72816 0.953101 6.69066 0.259351 5.49066 0.240601C3.75785 0.214038 2.3141 1.63435 2.3141 3.36404C2.3141 4.34529 2.76566 5.22029 3.47348 5.79373C2.9766 6.02341 2.51879 6.3406 2.12191 6.73748C1.26566 7.59216 0.781289 8.72029 0.750039 9.92498C0.749622 9.94165 0.752547 9.95824 0.758642 9.97377C0.764737 9.9893 0.773878 10.0035 0.785527 10.0154C0.797176 10.0273 0.811098 10.0368 0.826471 10.0433C0.841844 10.0498 0.858358 10.0531 0.875039 10.0531H1.7516C1.81879 10.0531 1.87504 9.99998 1.8766 9.93279C1.90629 9.02654 2.27348 8.1781 2.91879 7.53435C3.37816 7.07498 3.94066 6.75623 4.55473 6.60154C4.61566 6.58591 4.65629 6.5281 4.64848 6.4656Z"
                                      fill="#334155"
                                    />
                                  </svg>
                                </span>
                                Participation :
                              </p>
                              <div className="d-flex align-items-center">
                                <div
                                  className="viewBy-main-child2-child1 d-flex align-items-center justify-content-center gap-2"
                                  id="viewBy-main-child2-child1"
                                >
                                  <svg
                                    width={12}
                                    height={10}
                                    viewBox="0 0 14 11"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.25 0.71875H12.1578C12.0047 0.71875 11.8594 0.789062 11.7656 0.909375L5.32345 9.07031L2.23438 5.15625C2.18765 5.09692 2.12809 5.04895 2.06017 5.01593C1.99224 4.98292 1.91772 4.96572 1.8422 4.96562H0.750009C0.645321 4.96562 0.587509 5.08594 0.651571 5.16719L4.93126 10.5891C5.13126 10.8422 5.51563 10.8422 5.7172 10.5891L13.3484 0.91875C13.4125 0.839063 13.3547 0.71875 13.25 0.71875Z"
                                      fill="white"
                                    />
                                  </svg>
                                  4
                                </div>
                                <div
                                  className="viewBy-main-child2-child2 d-flex align-items-center justify-content-center gap-2"
                                  id="viewBy-main-child2-child2"
                                >
                                  <svg
                                    width={13}
                                    height={12}
                                    viewBox="0 0 14 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.5 0.25H0.5C0.223437 0.25 0 0.473437 0 0.75V10.75C0 11.0266 0.223437 11.25 0.5 11.25H13.5C13.7766 11.25 14 11.0266 14 10.75V0.75C14 0.473437 13.7766 0.25 13.5 0.25ZM12.875 1.98125V10.125H1.125V1.98125L0.69375 1.64531L1.30781 0.85625L1.97656 1.37656H12.025L12.6938 0.85625L13.3078 1.64531L12.875 1.98125ZM12.025 1.375L7 5.28125L1.975 1.375L1.30625 0.854687L0.692188 1.64375L1.12344 1.97969L6.46094 6.12969C6.61444 6.24894 6.80328 6.31367 6.99766 6.31367C7.19203 6.31367 7.38088 6.24894 7.53438 6.12969L12.875 1.98125L13.3062 1.64531L12.6922 0.85625L12.025 1.375Z"
                                      fill="#3A3A33"
                                    />
                                  </svg>
                                  4
                                </div>
                                <div
                                  className="viewBy-main-child2-child3 d-flex align-items-center justify-content-center gap-2"
                                  id="viewBy-main-child2-child3"
                                >
                                  <svg
                                    width={14}
                                    height={14}
                                    viewBox="0 0 14 11"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.722 5.34688C12.2407 2.22656 10.0017 0.65625 7.00009 0.65625C3.99697 0.65625 1.75947 2.22656 0.278215 5.34844C0.218802 5.47425 0.187988 5.61165 0.187988 5.75078C0.187988 5.88991 0.218802 6.02732 0.278215 6.15312C1.75947 9.27344 3.99853 10.8438 7.00009 10.8438C10.0032 10.8438 12.2407 9.27344 13.722 6.15156C13.8423 5.89844 13.8423 5.60469 13.722 5.34688ZM7.00009 9.71875C4.47978 9.71875 2.63447 8.44063 1.3329 5.75C2.63447 3.05938 4.47978 1.78125 7.00009 1.78125C9.5204 1.78125 11.3657 3.05938 12.6673 5.75C11.3673 8.44063 9.52197 9.71875 7.00009 9.71875ZM6.93759 3C5.41884 3 4.18759 4.23125 4.18759 5.75C4.18759 7.26875 5.41884 8.5 6.93759 8.5C8.45634 8.5 9.68759 7.26875 9.68759 5.75C9.68759 4.23125 8.45634 3 6.93759 3ZM6.93759 7.5C5.9704 7.5 5.18759 6.71719 5.18759 5.75C5.18759 4.78281 5.9704 4 6.93759 4C7.90478 4 8.68759 4.78281 8.68759 5.75C8.68759 6.71719 7.90478 7.5 6.93759 7.5Z"
                                      fill="#334155"
                                    />
                                  </svg>
                                  4
                                </div>
                                <div
                                  className="viewBy-main-child2-child4 d-flex align-items-center justify-content-center gap-2"
                                  id="viewBy-main-child2-child4"
                                >
                                  <svg
                                    width={13}
                                    height={14}
                                    viewBox="0 0 14 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.92183 5.26562H9.18902C9.02964 5.26562 8.87808 5.34219 8.78433 5.47344L6.32808 8.87969L5.21558 7.33594C5.12183 7.20625 4.97183 7.12813 4.81089 7.12813H4.07808C3.97652 7.12813 3.91714 7.24375 3.97652 7.32656L5.92339 10.0266C5.96938 10.0908 6.03001 10.1431 6.10026 10.1791C6.1705 10.2152 6.24833 10.2341 6.3273 10.2341C6.40627 10.2341 6.4841 10.2152 6.55434 10.1791C6.62458 10.1431 6.68521 10.0908 6.7312 10.0266L10.0218 5.46406C10.0828 5.38125 10.0234 5.26562 9.92183 5.26562Z"
                                      fill="white"
                                    />
                                    <path
                                      d="M7 0.75C3.13438 0.75 0 3.88438 0 7.75C0 11.6156 3.13438 14.75 7 14.75C10.8656 14.75 14 11.6156 14 7.75C14 3.88438 10.8656 0.75 7 0.75ZM7 13.5625C3.79063 13.5625 1.1875 10.9594 1.1875 7.75C1.1875 4.54063 3.79063 1.9375 7 1.9375C10.2094 1.9375 12.8125 4.54063 12.8125 7.75C12.8125 10.9594 10.2094 13.5625 7 13.5625Z"
                                      fill="white"
                                    />
                                  </svg>
                                  4
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                          <div className="col-12 my-3">
                            <a
                              className="btn"
                              data-bs-toggle="collapse"
                              href="#participation-summary"
                              role="button"
                              aria-expanded={participantsOpen}
                              aria-controls="participation-summary"
                              onClick={() =>
                                setParticipantsOpen(!participantsOpen)
                              }
                              style={{fontSize:'16px', fontWeight: 'normal'}}
                            >
                              <span
                                id="participation-summary-icon"
                                className="icon-1"
                              >
                                {participantsOpen ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-dash" // Corrected from `class` to `className`
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-plus" // Corrected from `class` to `className`
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                  </svg>
                                )}
                              </span>
                              Participation Summary
                            </a>
                            {participantsOpen && (
                              <div id="participation-summary">
                                <div className="card card-body p-2">
                                  <div className="participate-sec">
                                    <div className="totals-activity d-flex align-items-center" style={{gap:'0'}}>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="total-participants">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="active-participants">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="total-bids">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="revised-bids">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="rejected-bids">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="counter-offers">3</p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="accepted-counter-offers">
                                          3
                                        </p>
                                      </div>
                                      <div className="total-activity">
                                        <p>Total Participants</p>
                                        <p id="dynamic-time-extended">
                                          3
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-12 my-3">
                            <a
                              className="btn"
                              data-bs-toggle="collapse"
                              href="#savings-summary"
                              role="button"
                              aria-expanded={savingsOpen}
                              aria-controls="savings-summary"
                              onClick={() => setSavingsOpen(!savingsOpen)}
                              style={{fontSize:'16px', fontWeight: 'normal'}}
                            >
                              <span
                                id="savings-summary-icon"
                                className="icon-1"
                              >
                                {savingsOpen ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-dash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-plus"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                  </svg>
                                )}
                              </span>
                              Savings Summary
                            </a>
                            {savingsOpen && (
                              <div id="savings-summary">
                                <div className="card card-body p-2">
                                  <div
                                    className="viewBy-main"
                                    style={{
                                      justifyContent: "end",
                                      margin: "0!important",
                                    }}
                                  >
                                    <div className="viewBy-main-child2">
                                      <div className="view">View</div>
                                    </div>
                                  </div>
                                  <div className="saving-ref">
                                    <div className="deafut-sec d-flex align-items-center">
                                      <div className="default d-flex gap-2">
                                        <svg
                                          width={13}
                                          height={14}
                                          viewBox="0 0 10 11"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M4.35725 0.572266H0.285819C0.167962 0.572266 0.0715332 0.668694 0.0715332 0.786551V4.85798C0.0715332 4.97584 0.167962 5.07227 0.285819 5.07227H4.35725C4.4751 5.07227 4.57153 4.97584 4.57153 4.85798V0.786551C4.57153 0.668694 4.4751 0.572266 4.35725 0.572266ZM3.66082 4.16155H0.982248V1.48298H3.66082V4.16155ZM9.71439 0.572266H5.64296C5.52511 0.572266 5.42868 0.668694 5.42868 0.786551V4.85798C5.42868 4.97584 5.52511 5.07227 5.64296 5.07227H9.71439C9.83225 5.07227 9.92868 4.97584 9.92868 4.85798V0.786551C9.92868 0.668694 9.83225 0.572266 9.71439 0.572266ZM9.01796 4.16155H6.33939V1.48298H9.01796V4.16155ZM4.35725 5.92941H0.285819C0.167962 5.92941 0.0715332 6.02584 0.0715332 6.14369V10.2151C0.0715332 10.333 0.167962 10.4294 0.285819 10.4294H4.35725C4.4751 10.4294 4.57153 10.333 4.57153 10.2151V6.14369C4.57153 6.02584 4.4751 5.92941 4.35725 5.92941ZM3.66082 9.51869H0.982248V6.84012H3.66082V9.51869ZM9.71439 5.92941H5.64296C5.52511 5.92941 5.42868 6.02584 5.42868 6.14369V10.2151C5.42868 10.333 5.52511 10.4294 5.64296 10.4294H9.71439C9.83225 10.4294 9.92868 10.333 9.92868 10.2151V6.14369C9.92868 6.02584 9.83225 5.92941 9.71439 5.92941ZM9.01796 9.51869H6.33939V6.84012H9.01796V9.51869Z"
                                            fill="#262626"
                                          />
                                        </svg>
                                        <span>Default</span>
                                      </div>
                                      <span>-</span>
                                    </div>
                                    <div className="saving-sec d-flex">
                                      <div className="saving-text">
                                        SAVINGS REFERENCE
                                      </div>
                                      <div className="default d-flex align-items-center gap-3">
                                        <span>-</span>
                                        <span className="saving-amount">
                                          {" "}
                                          ₹58,05,671.79
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tbl-container mt-3">
                                    <table className="w-100">
                                      <thead>
                                        <tr>
                                          <th>Product</th>
                                          <th>Variant</th>
                                          <th>Default Reference</th>
                                          <th>Default Savings</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                        <tr>
                                          <td>Wooden Frd Door</td>
                                          <td>
                                            WOODEN DOOR SHUTTER 2 HRS FIRE RATED
                                            (MAIN DOOR)
                                          </td>
                                          <td>₹ 12850 /Nos</td>
                                          <td>₹ 0/Nos </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-12 my-3">
                            <a
                              className="btn"
                              data-bs-toggle="collapse"
                              href="#bidding-summary"
                              role="button"
                              aria-expanded={biddingOpen}
                              aria-controls="bidding-summary"
                              onClick={() => setBiddingOpen(!biddingOpen)} 
                              style={{fontSize:'16px', fontWeight: 'normal'}}
                            >
                              <span
                                id="bidding-summary-icon"
                                className="icon-1"
                              >
                                {biddingOpen ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-dash" // Corrected className
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-plus" // Corrected className
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                  </svg>
                                )}
                              </span>
                              Bidding Summary
                            </a>
                            {biddingOpen && (
                              <div id="bidding-summary">
                                <div className="card card-body p-2">
                                  <div className="container table-responsive pb-5">
                                    <h5>Quotation / Bid Revision Details</h5>
                                    <div className="tbl-container">
                                      <table className="">
                                        <thead className="thead-dark">
                                          <tr>
                                            <th scope="col">Vendor Name</th>
                                            <th scope="col">Initial Rate </th>
                                            <th scope="col">Initial Amount </th>
                                            <th scope="col">Revised Rate</th>
                                            <th scope="col">Revised Amount</th>
                                            <th>Difference in Amount</th>
                                            <th>Difference in %</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>2</td>
                                            <td>2</td>
                                            <td>2</td>
                                          </tr>
                                          <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>2</td>
                                            <td>2</td>
                                            <td>2</td>
                                          </tr>
                                          <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>₹ 61,50,643.6</td>
                                            <td>2</td>
                                            <td>2</td>
                                            <td>2</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <h5>Line Item Wise</h5>
                                    <div className="tbl-container">
                                      <table>
                                        <thead>
                                          <tr>
                                            <th scope="row" />
                                            <th>Best Market Price</th>
                                            <th>Rank 2 Market Price</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <th
                                              colSpan={4}
                                              style={{ textAlign: "left" }}
                                            >
                                              SITC of Electrical w...(As per
                                              Tec...&nbsp;-&nbsp;1 Lumpsum)
                                            </th>
                                          </tr>
                                          <tr>
                                            <th scope="row">Vendor Name</th>
                                            <td>ELECTRIC PRIVATE LIM...</td>
                                            <td>
                                              AXIS ELECTRICAL COMPONENT...
                                            </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">Price Quoted</th>
                                            <td>₹ 52,12,409.83/Lumpsum</td>
                                            <td>Ampere Electrical Services</td>
                                          </tr>
                                          <tr>
                                            <th
                                              colSpan={4}
                                              style={{ textAlign: "left" }}
                                            >
                                              SITC of Electrical w...(As per
                                              Tec...&nbsp;-&nbsp;1 Lumpsum)
                                            </th>
                                          </tr>
                                          <tr>
                                            <th scope="row">Vendor Name</th>
                                            <td>ELECTRIC PRIVATE LIM...</td>
                                            <td>
                                              AXIS ELECTRICAL COMPONENT...
                                            </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">Price Quoted</th>
                                            <td>₹ 52,12,409.83/Lumpsum</td>
                                            <td>Ampere Electrical Services</td>
                                          </tr>
                                          <tr>
                                            <th
                                              colSpan={4}
                                              style={{ textAlign: "left" }}
                                            >
                                              SITC of Electrical w...(As per
                                              Tec...&nbsp;-&nbsp;1 Lumpsum)
                                            </th>
                                          </tr>
                                          <tr>
                                            <th scope="row">Vendor Name</th>
                                            <td>ELECTRIC PRIVATE LIM...</td>
                                            <td>
                                              AXIS ELECTRICAL COMPONENT...
                                            </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">Price Quoted</th>
                                            <td>₹ 52,12,409.83/Lumpsum</td>
                                            <td>Ampere Electrical Services</td>
                                          </tr>
                                          <tr>
                                            <th
                                              colSpan={4}
                                              style={{ textAlign: "left" }}
                                            >
                                              SITC of Electrical w...(As per
                                              Tec...&nbsp;-&nbsp;1 Lumpsum)
                                            </th>
                                          </tr>
                                          <tr>
                                            <th scope="row">Vendor Name</th>
                                            <td>ELECTRIC PRIVATE LIM...</td>
                                            <td>
                                              AXIS ELECTRICAL COMPONENT...
                                            </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">Price Quoted</th>
                                            <td>₹ 52,12,409.83/Lumpsum</td>
                                            <td>Ampere Electrical Services</td>
                                          </tr>
                                          <tr>
                                            <th
                                              colSpan={4}
                                              style={{ textAlign: "left" }}
                                            >
                                              SITC of Electrical w...(As per
                                              Tec...&nbsp;-&nbsp;1 Lumpsum)
                                            </th>
                                          </tr>
                                          <tr>
                                            <th scope="row">Vendor Name</th>
                                            <td>ELECTRIC PRIVATE LIM...</td>
                                            <td>
                                              AXIS ELECTRICAL COMPONENT...
                                            </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">Price Quoted</th>
                                            <td>₹ 52,12,409.83/Lumpsum</td>
                                            <td>Ampere Electrical Services</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-12 my-3">
                            <a
                              className="btn"
                              data-bs-toggle="collapse"
                              role="button"
                              href="#product-sheet"
                              aria-controls="product-sheet"
                              aria-expanded={productOpen}
                              onClick={() => setProductOpen(!productOpen)}
                              style={{fontSize:'16px', fontWeight: 'normal'}}
                            >
                              <span id="product-sheet-icon" className="icon-1">
                                {productOpen ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-dash" // Corrected from `class` to `className`
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-plus" // Corrected from `class` to `className`
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                  </svg>
                                )}
                              </span>
                              Product Sheet
                            </a>
                            {productOpen && (
                              <div id="product-sheet">
                                <div className="card card-body p-2">
                                  <div className="tbl-container">
                                    <table className="">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col">Product*</th>
                                          <th scope="col">Best Total Amount</th>
                                          <th scope="col">Product Variant*</th>
                                          <th scope="col">
                                            Quantity Requested*
                                          </th>
                                          <th scope="col">
                                            Delivery location*
                                          </th>
                                          <th scope="col">
                                            Creator Attachment
                                          </th>
                                          <th scope="col">AIDDITIONAL INFO</th>
                                          <th scope="col">
                                            Quantity Available
                                          </th>
                                          <th scope="col">Price*</th>
                                          <th scope="col">Discount</th>
                                          <th scope="col">
                                            Realised Discount*
                                          </th>
                                          <th scope="col">GST*</th>
                                          <th scope="col">Realised GST</th>
                                          <th scope="col">Landed Amount*</th>
                                          <th scope="col">
                                            Participant Attachment
                                          </th>
                                          <th scope="col">
                                            DOOR FRAME MATERIAL
                                          </th>
                                          <th>DENSITY OF WOOD</th>
                                          <th>MOISTURE OF WOOD</th>
                                          <th>Total Amount*</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <th scope="row">
                                            Wooden Frd Door{" "}
                                            <span
                                              style={{
                                                color: "var(--red)",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              Details
                                            </span>
                                          </th>
                                          <td />
                                          <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                                          <td>257 Nos</td>
                                          <td>Sanvo Resorts Pvt. Ltd. </td>
                                          <td />
                                          <td>Main door Outer size of ...</td>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                        <tr>
                                          <th scope="row">
                                            Wooden Frd Door{" "}
                                            <span
                                              style={{
                                                color: "var(--red)",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              Details
                                            </span>
                                          </th>
                                          <td />
                                          <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                                          <td>257 Nos</td>
                                          <td>Sanvo Resorts Pvt. Ltd. </td>
                                          <td />
                                          <td>Main door Outer size of ...</td>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                        <tr>
                                          <th scope="row">
                                            Wooden Frd Door{" "}
                                            <span
                                              style={{
                                                color: "var(--red)",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              Details
                                            </span>
                                          </th>
                                          <td />
                                          <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                                          <td>257 Nos</td>
                                          <td>Sanvo Resorts Pvt. Ltd. </td>
                                          <td />
                                          <td>Main door Outer size of ...</td>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                        <tr>
                                          <th scope="row">
                                            Wooden Frd Door{" "}
                                            <span
                                              style={{
                                                color: "var(--red)",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              Details
                                            </span>
                                          </th>
                                          <td />
                                          <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                                          <td>257 Nos</td>
                                          <td>Sanvo Resorts Pvt. Ltd. </td>
                                          <td />
                                          <td>Main door Outer size of ...</td>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                        <tr>
                                          <th scope="row">
                                            Wooden Frd Door{" "}
                                            <span
                                              style={{
                                                color: "var(--red)",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              Details
                                            </span>
                                          </th>
                                          <td />
                                          <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                                          <td>257 Nos</td>
                                          <td>Sanvo Resorts Pvt. Ltd. </td>
                                          <td />
                                          <td>Main door Outer size of ...</td>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                      </section>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="participants"
                      role="tabpanel"
                      aria-labelledby="participants-tab"
                      tabIndex={0}
                    >
                      <div>
                        <div className="d-flex justify-content-between mt-4 align-items-center">
                          <input
                            type="search"
                            placeholder="Search vendors"
                            className="event-participant-search-in"
                          />
                          <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                              <p className="eventList-p1 mb-0 pe-1">
                                Show only selected vendors
                              </p>
                              <div className="form-check form-switch mt-1">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                            <div>
                              <img
                                className="me-2"
                                src="../erp_event_module/img/Separator-dark.svg"
                                alt=""
                              />
                            </div>
                            <select
                              name="language"
                              className="event-participant-select eventD-forms buyEvent-forms"
                              required=""
                            >
                              <option
                                value=""
                                disabled=""
                                selected=""
                                hidden=""
                              >
                                Filter by city
                              </option>
                              <option value="indian">xxxxxxxx</option>
                              <option value="nepali">xxxxxxxx</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                        </div>
                        {/*  */}
                        <div className="tbl-container">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>
                                  <input type="checkbox" name="" id="" />
                                </th>
                                <th>Name</th>
                                <th>Bids Closed</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    AXIS ELECTRICAL COMPONENTS INDIA PRIVATE
                                    LIMITED
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#">
                                    View Price Cap
                                  </a>
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    AJAY ELECTRICALS
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#">
                                    {" "}
                                  </a>
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    Ampere Electrical Services
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#">
                                    View Price Cap
                                  </a>
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    A.R. ENTERPRISE
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#" />
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    BRAHMARI POWERTECH PRIVATE LIMITED
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#" />
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    CAPE ELECTRIC PRIVATE LIMITED
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#">
                                    View Price Cap
                                  </a>
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    ELECTRICAL SOLUTIONS
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#" />
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    IQRA ENTERPRISES
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#" />
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    MAC ELECTRICALS
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#">
                                    {" "}
                                  </a>
                                </td>
                              </tr>
                              <tr className="go-shadow-k">
                                <td>
                                  <input type="checkbox" name="" id="" />
                                </td>
                                <td className="text-start">
                                  <p className="participant-table mb-1">
                                    Moksh Infra
                                  </p>
                                </td>
                                <td className="text-start ">
                                  <a className="participant-table2" href="#" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade analytics"
                      id="analytics"
                      role="tabpanel"
                      aria-labelledby="analytics-tab"
                      tabIndex={0}
                    >
                      <div className="container">
                        <div className="details">
                          <label htmlFor="details">
                            Show the details according to
                          </label>
                          <select id="details">
                            <option value="productPrice">Product Price</option>
                          </select>
                          <span>for</span>
                          <select id="product">
                            <option value="woodenDoorFrame">
                              Wooden Door Frame (...
                            </option>
                          </select>
                        </div>
                        <div className="d-flex ">
                          <div className="quote">
                            <div>
                              <label>Initial Quote</label>
                              <p>₹10,800 / Nos</p>
                            </div>
                            <div className="ms-3">
                              <label>Final Best Price</label>
                              <p>₹10,800 / Nos</p>
                            </div>
                            <div className="ms-3">
                              <label>Realized Savings</label>
                              <p>₹0 - 0%</p>
                            </div>
                          </div>
                          <div className="time ms-5">
                            <div>
                              <label>Start Time</label>
                              <p>06:10 PM Apr 01, 24</p>
                            </div>
                            <div className="ms-3">
                              <label>End Time</label>
                              <p>03:35 PM Apr 06, 24</p>
                            </div>
                          </div>
                        </div>
                        <div id="container" >
                          <ScatterChart />
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="priceTrends"
                      role="tabpanel"
                      aria-labelledby="priceTrends-tab"
                      tabIndex={0}
                    >
                      <div className="priceTrends-list-main">
                        <div className="mt-2 ">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                        <div className="">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                        <div className="">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                        <div className="">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                        <div className="">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                        <div className="">
                          <div>A</div>
                          <div className="mt-0 priceTrends-list-child go-shadow-k">
                            <p className="eventList-p2 mb-0 fw-bold">
                              AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA
                              PRIVATE LIMITED
                            </p>
                            <p className="eventList-p1 mb-0">copper make</p>
                          </div>
                        </div>
                      </div>
                      <footer className="d-flex justify-content-end pageChange">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li className="page-item pagechange-child">
                              <a
                                className="page-link pagechange-child-a"
                                href="#"
                              >
                                <span>
                                  <img
                                    className="pageChangeIMG me-2"
                                    src="../erp_event_module/img/previous_arrow.svg"
                                    alt=""
                                  />
                                </span>
                                Previous Event
                              </a>
                            </li>
                            <li className="page-item pagechange-child">
                              <a
                                className="page-link pagechange-child-a"
                                href="#"
                              >
                                {" "}
                                Next Event
                                <span>
                                  <img
                                    className="pageChangeIMG ms-2"
                                    src="../erp_event_module/img/next_arrow.svg"
                                    alt=""
                                  />
                                </span>
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </footer>
                    </div>
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
