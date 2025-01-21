import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  CheckBoxList,
  ClockIcon,
  DownloadIcon,
  DynamicModalBox,
  FilterIcon,
  FilterModal,
  MultiDateSelector,
  SelectBox,
} from "../components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/mor.css";

const Events = () => {
  const [activeTab, setActiveTab] = useState("live"); // Track the active tab
  const [exportModal, setExportModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [isSelectCheckboxes, setIsSelectCheckboxes] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [allEventsData, setAllEventsData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [liveResponse, historyResponse, allResponse] = await Promise.all([
          axios.get(
            "https://vendors.lockated.com/rfq/events/live_events?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ),

          axios.get(
            "https://vendors.lockated.com/rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_in]=9970804349%2Cmahendra.lungare%40lockated.com"
          ),

          axios.get(
            "https://vendors.lockated.com/rfq/events?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ), // New API call for all events
        ]);

        console.log("Live Events:", liveResponse.data?.events || []);

        console.log("History Events:", historyResponse.data?.events || []);

        console.log("All Events:", allResponse.data?.events || []); // Log the all events response

        setLiveEvents(
          Array.isArray(liveResponse.data.events)
            ? liveResponse.data.events
            : []
        );
        setHistoryEvents(
          Array.isArray(historyResponse.data.events)
            ? historyResponse.data.events
            : []
        );

        setAllEventsData(
          Array.isArray(allResponse.data.events) ? allResponse.data.events : []
        ); //
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setIsCustomSelected(selectedValue === "Custom");
  };

  const handleExportModal = () => {
    setExportModal(true);
  };
  const handleCloseExportModal = () => {
    setExportModal(false);
  };
  const handleFilterModal = () => {
    setFilterModal(true);
  };
  const handleCloseFilterModal = () => {
    setFilterModal(false);
  };
  // const handleTabChange = (tabId) => {
  //   setActiveTab(tabId); // Update the active tab
  // };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId); // Update active tab state
    navigate(`?tab=${tabId}`); // Update the URL with the selected tab
  };

  const handleSwitchChange = () => {
    setIsSelectCheckboxes((prev) => !prev); // Toggle switch state
  };

  const handleSelectedItems = (selectedItems) => {
    console.log("Selected Items: ", selectedItems);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loader while data is being fetched
  }

  const filteredLiveData = isSelectCheckboxes
    ? liveEvents.filter((event) => event.endsIn)
    : liveEvents;

  const allEvents = [...liveEvents, ...historyEvents]; // Combine live and history events

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "all"; // Get the tab param to determine if live events should be displayed

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div
          className="w-100"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 100px)",
          }}
        >
          <div className="event-parent p-4 mb-0">
            <h4>Events</h4>
            <div className="d-flex justify-content-between m-0 p-0">
              <ul
                className="nav nav-tabs border-0 m-0 p-0"
                id="eventTabs"
                role="tablist"
              >
                {[
                  { id: "all", label: "All" },
                  { id: "live", label: "Live" },
                  { id: "history", label: "History" },
                ].map((tab) => (
                  <li
                    className="nav-item m-0 p-0"
                    role="presentation"
                    key={tab.id}
                  >
                    <button
                      className={`nav-link setting-link ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      id={`${tab.id}-tab`}
                      data-bs-toggle="tab"
                      data-bs-target={`#${tab.id}`}
                      type="button"
                      role="tab"
                      aria-controls={tab.id}
                      aria-selected={activeTab === tab.id}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex align-items-center">
                <div className="row justify-content-end px-3">
                  <div className="col-md-4">
                    <button
                      style={{ color: "#de7008" }}
                      className="btn btn-md"
                      onClick={handleFilterModal}
                    >
                      <FilterIcon />
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      style={{ color: "#de7008" }}
                      id="downloadButton"
                      type="submit"
                      className="btn btn-md"
                      onClick={handleExportModal}
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                </div>
                <button
                  className="purple-btn2"
                  onClick={() => {
                    navigate("/create-event");
                  }}
                >
                  <span className="material-symbols-outlined align-text-top">
                    add
                  </span>
                  New Event
                </button>
              </div>
            </div>
          </div>
          <div className="tab-content m-2">
            {/* All Events */}

            <div
              className={`tab-pane fade ${
                activeTab === "all" ? "show active" : ""
              } eventList-parent p-4 pt-0`}
              id="all"
              role="tabpanel"
              tabIndex={0}
            >
              {allEventsData.length > 0 ? (
                allEventsData.map((event, index) => (
                  <div
                    className="eventList-main"
                    key={index}
                    onClick={() => navigate(`/event/${event.event_no}`)}
                  >
                    <div className="d-flex flex-row-reverse">
                      <div className="eventList-child1 d-flex align-items-center gap-2 py-3">
                        {event.endsIn ? (
                          <div className="d-flex align-items-center gap-2">
                            <ClockIcon />
                            <p className="mb-0 eventList-p1">Ends In</p>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-hourglass-split"></i>
                            <p className="mb-0 eventList-p1">Bid Approves In</p>
                          </div>
                        )}
                        <span>{event.timeRemaining}</span>
                      </div>
                    </div>

                    <div className="eventList-child2">
                      <div className="d-flex justify-content-between  p-3 w-100 position-relative">
                        <div>
                          <h6 style={{ color: "#6c757d", fontSize: "0.75rem" }}>
                            {event.created_by}
                          </h6>
                          <p className="mb-0 eventList-p2">
                            {event.event_title}
                          </p>
                          <p className="mb-0 eventList-p2">{event.event_no}</p>
                          {/* <p className="mb-0 eventList-p2">
                            {event.delivary_location}
                          </p> */}

                          <div className="d-flex align-items-center mt-3">
                            <p className="mb-0 eventList-p3 me-2">
                              {event.event_type_detail.event_type}
                            </p>
                            <p className="mb-0 eventList-p1">
                              {event.productsCount}
                            </p>
                          </div>
                        </div>
                        {event.delivary_location && (
                          <div className="w-25">
                            <div className="d-flex align-items-start gap-2">
                              <i className="bi bi-truck"></i>
                              <p>Delivery at</p>
                            </div>
                            <p className="mb-0 eventList-p2">
                              {event.delivary_location}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No events available.</p>
              )}
            </div>

            {/* Live Events */}
            <div
              className={`tab-pane fade ${
                activeTab === "live" ? "show active" : ""
              } eventList-parent p-4 pt-0`}
              id="live"
              role="tabpanel"
              tabIndex={0}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4>Team Events</h4>
                <div className="rounded-3 bg-light p-2 gap-3 d-flex align-items-end justify-content-around shadow-sm">
                  <p>All</p>
                  <div className="form-check form-switch mb-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      checked={isSelectCheckboxes}
                      onChange={handleSwitchChange}
                    />
                  </div>
                  <p>Not Bids</p>
                </div>
              </div>

              {filteredLiveData.length > 0 ? (
                filteredLiveData.map((event, index) => (
                  <div
                    className="eventList-main"
                    key={index}
                    onClick={() => navigate("/erp-rfq-detail-price-trends4h")}
                  >
                    <div className="d-flex flex-row-reverse">
                      <div className="eventList-child1 d-flex align-items-center gap-2 py-3">
                        {event.endsIn ? (
                          <div className="d-flex align-items-center gap-2">
                            <ClockIcon />
                            <p className="mb-0 eventList-p1">Ends In</p>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-hourglass-split"></i>
                            <p className="mb-0 eventList-p1">Bid Approves In</p>
                          </div>
                        )}
                        <span>{event.timeRemaining}</span>
                      </div>
                    </div>
                    <div className="eventList-child2 p-0">
                      <div className="d-flex justify-content-between p-3 w-100 position-relative">
                        <div>
                          <h6 style={{ color: "#6c757d", fontSize: "0.75rem" }}>
                            {event.created_by}
                          </h6>
                          <p className="mb-0 eventList-p2">
                            {event.event_title}
                          </p>
                          <p className="mb-0 eventList-p2">{event.event_no}</p>
                          <div className="d-flex align-items-center justify-content-between mt-3">
                            {/* <p className="mb-0 eventList-p3 me-2">
                              [ {event.event_no}]
                            </p> */}
                            <p className="mb-0 eventList-p3 me-2">
                              {event.event_type_detail.event_type}
                            </p>
                            <p className="mb-0 eventList-p1">
                              {event.productsCount}
                            </p>
                          </div>
                        </div>
                        {event.delivary_location && (
                          <div className="w-25">
                            <div className="d-flex align-items-start gap-2">
                              <i className="bi bi-truck"></i>
                              <p>Delivery at</p>
                            </div>
                            <p className="mb-0 eventList-p2">
                              {event.delivary_location}
                            </p>
                          </div>
                        )}
                        {/* )} */}
                        {/* {event.endsIn && ( */}
                        {/* <button
                          className="purple-btn2 position-absolute"
                          style={{ bottom: 10, right: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            navigate("/create-bid", {
                              state: { eventId: event.id },
                            });
                          }}
                        > */}
                        <button
                          className="purple-btn2 position-absolute"
                          style={{ bottom: 10, right: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/create-bid/${event.id}`);
                          }}
                        >
                          <span className="material-symbols-outlined align-text-top">
                            add
                          </span>
                          New Bid
                        </button>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No live events available.</p>
              )}
            </div>

            {/* History Events */}
            <div
              className={`tab-pane fade ${
                activeTab === "history" ? "show active" : ""
              } eventList-parent p-4 pt-0`}
              id="history"
              role="tabpanel"
              tabIndex={0}
            >
              {historyEvents.length > 0 ? (
                historyEvents.map((data, index) => (
                  <div key={index} className="mb-5">
                    <div
                      className="eventList-child1"
                      style={{ maxWidth: "200px" }}
                    >
                      <p>{data.date}</p>
                    </div>
                    {data.entries.map((event, eventIndex) => (
                      <div
                        className="eventList-main mt-0 mb-2 rounded-top-0"
                        key={eventIndex}
                        onClick={() => navigate(`/event/${event.event_no}`)}
                      >
                        <div className="eventList-child2">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6>{event.name}</h6>
                              <p className="mb-0 eventList-p2">
                                {event.description}
                              </p>
                              <p className="mb-0 eventList-p2">
                                {event.location}
                              </p>
                              <div className="d-flex align-items-center mt-3">
                                <p className="mb-0 eventList-p3 me-2">
                                  {event.status}
                                </p>
                                <p className="mb-0 eventList-p1">
                                  {event.productsCount}
                                </p>
                              </div>
                            </div>
                            {event.deliveryLocation && (
                              <div className="w-25">
                                <div className="d-flex align-items-start gap-2">
                                  <i className="bi bi-truck"></i>
                                  <p>Delivery at</p>
                                </div>
                                <p className="mb-0 eventList-p2">
                                  {event.deliveryLocation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No history events available.</p>
              )}
            </div>
          </div>
          <DynamicModalBox
            title="Download Report"
            show={exportModal}
            onHide={handleCloseExportModal}
            size="xl"
            footerButtons={[
              {
                label: "Cancel",
                onClick: handleCloseExportModal,
                props: {
                  className: "purple-btn1",
                },
              },
              {
                label: "Download Excel",
                onClick: handleCloseExportModal,
                props: {
                  className: "purple-btn2",
                },
              },
            ]}
            modalType={true}
            children={
              <div>
                <div className="d-flex">
                  <i className="bi bi-info-circle pe-3 pt-1"></i>
                  <p>
                    You have not chosen any duration for your procurement
                    history. Report will be generated for duration of 03 Sep
                    2024 to 03 Dec 2024.
                  </p>
                </div>
                <MultiDateSelector />
                <SelectBox
                  className="mb-4"
                  label={"Choose Report Type"}
                  defaultValue={"Event Detailed Report"}
                  onChange={(e) => e.target.value}
                  options={undefined}
                />
                <SelectBox
                  className="mb-4"
                  label={"Choose Report Format"}
                  options={[
                    {
                      value: "Default report Format",
                      label: "Default report Format",
                    },
                    { value: "Custom", label: "Custom" },
                  ]}
                  defaultValue={"Default report Format"}
                  onChange={handleSelectChange}
                />

                <div className="d-flex align-items-end justify-content-between bg-light mx-0 mb-3">
                  <div className="d-flex align-items-start">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <p>Select All</p>
                  </div>
                  <div className="d-flex align-items-end">
                    <p>Include Revised Bids</p>
                    <span className="form-switch ps-5">
                      <input
                        className="on-off-toggler form-check-input my-2"
                        type="checkbox"
                        onChange={handleCheckboxChange}
                      />
                    </span>
                  </div>
                </div>
                <CheckBoxList
                  title="Basic Details"
                  onChange={handleSelectedItems}
                  isAllSelected={isChecked} items={undefined}                />
                <CheckBoxList
                  title="Bid Details"
                  onChange={handleSelectedItems}
                  isAllSelected={isChecked}
                  items={undefined}  
                />
                <CheckBoxList
                  title="Product Details"
                  onChange={handleSelectedItems}
                  isAllSelected={isChecked}
                  items={undefined}  
                  style={{ paddingBottom: "50px" }}
                />

                {isCustomSelected && (
                  <div
                    className="position-fixed bg-light p-2"
                    style={{
                      width: "80%",
                      bottom: "calc(0% + 100px)",
                      right: "0",
                      transform: "translate(50%, 50%)",
                    }}
                  >
                    <p>Report Format Name</p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Report Format Name"
                    />
                  </div>
                )}
              </div>
            }
          />
          <FilterModal
            show={filterModal}
            handleClose={handleCloseFilterModal}
          />
        </div>
      </div>
    </>
  );
};

export default Events;
