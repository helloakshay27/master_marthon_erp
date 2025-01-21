import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
DataTable.use(DT);

import {
  LayoutModal,
  FilterModal,
  BulkAction,
  DownloadIcon,
  EventProjectTable,
  FilterIcon,
  QuickFilter,
  SearchIcon,
  SettingIcon,
  StarIcon,
  Table,
} from "../components";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { eventProjectColumns } from "../constant/data";
import FormatDate from "../components/FormatDate";

export default function VendorListPage() {
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("all");
  const [liveEvents, setLiveEvents] = useState({ events: [], pagination: {} });
  const [historyEvents, setHistoryEvents] = useState({
    events: [],
    pagination: {},
  });
  const [allEventsData, setAllEventsData] = useState({
    events: [],
    pagination: {},
  });

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    created_by_id_in: "",
    event_type_detail_award_scheme_in: "",
    status_in: "",
    title_in: "",
    event_materials_inventory_id_in: "",
    event_materials_pms_inventory_inventory_type_id_in: "",
    event_materials_id_in: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    event_titles: [],
    event_numbers: [],
    statuses: [],
    creaters: [],
    material_name: [],
    material_type: [],
    locations: [],
  });
  const [isMyEvent, setIsMyEvent] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 10;
  const pageRange = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorId, setVendorId] = useState(() => {
    // Retrieve the vendorId from sessionStorage or default to an empty string
    return sessionStorage.getItem('vendorId') || "";
  });

  useEffect(() => {
    // Save vendorId in session storage
    console.log("vendorId", vendorId);

    sessionStorage.setItem('vendorId', vendorId);
  }, [vendorId]);
  const [vendorList, setVendorList] = useState([]);

  const [vendorOptions, setVendorOptions] = useState([]);

  const navigate = useNavigate();

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  const handleReset = () => {
    setFilters({
      created_by_id_in: "",
      event_type_detail_award_scheme_in: "",
      status_in: "",
      title_in: "",
      event_materials_inventory_id_in: "",
      event_materials_pms_inventory_inventory_type_id_in: "",
      event_materials_id_in: "",
    });
    setFilterOptions({
      event_titles: [],
      event_numbers: [],
      statuses: [],
      creaters: [],
      material_name: [],
      material_type: [],
      locations: [],
    });
    setIsMyEvent(false);
  };

  const preprocessOptions = (array, isKeyValuePair = false) => {
    if (!array) return [];
    const uniqueMap = new Map();
    array
      .filter((item) => item.name && typeof item.name === "string")
      .forEach((item) => {
        uniqueMap.set(item.name, {
          value: item.value,
          label: item.name || `Unknown (${item.value})`,
        });
      });
    return Array.from(uniqueMap.values());
  };

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      const response = await axios.get(
        "https://vendors.lockated.com/rfq/events/advance_filter_options",
        {
          params: {
            token: token,
          },
        }
      );

      setFilterOptions({
        event_titles: preprocessOptions(response.data.event_titles),
        event_numbers: preprocessOptions(response.data.event_numbers),
        creaters: preprocessOptions(response.data.creaters, true),
        statuses: preprocessOptions(
          response.data.statuses.map((status) => ({
            name: status,
            value: status,
          }))
        ),
        material_name: preprocessOptions(response.data?.material_name || []),
        material_type: preprocessOptions(response.data?.material_type || []),
        locations: preprocessOptions(response.data?.locations || []),
      });
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError(
        err.response?.data?.message || "Failed to fetch filter options"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    fetchFilterOptions();
  }, []);

  const token = new URLSearchParams(window.location.search).get("token");


  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const queryFilters = {
        ...(filters.created_by_id_in && { "q[created_by_id_in]": filters.created_by_id_in }),
        ...(filters.event_type_detail_award_scheme_in && { "q[event_type_detail_award_scheme_in]": filters.event_type_detail_award_scheme_in }),
        ...(filters.status_in && { "q[status_in]": filters.status_in }),
        ...(filters.title_in && { "q[title_in]": filters.title_in }),
        ...(filters.event_materials_inventory_id_in && { "q[event_materials_inventory_id_in]": filters.event_materials_inventory_id_in }),
        ...(filters.event_materials_pms_inventory_inventory_type_id_in && { "q[event_materials_pms_inventory_inventory_type_id_in]": filters.event_materials_pms_inventory_inventory_type_id_in }),
        ...(filters.event_materials_id_in && { "q[event_materials_id_in]": filters.event_materials_id_in }),
        ...(filters.event_no_cont && { "q[event_no_cont]": filters.event_no_cont }),

      };

      const liveEventsUrl = "https://vendors.lockated.com/rfq/events/live_events";
      const pastEventsUrl = "https://vendors.lockated.com/rfq/events/past_events";
      const allEventsUrl = "https://vendors.lockated.com/rfq/events";

      const [liveResponse, historyResponse, allResponse] = await Promise.all([
        axios.get(liveEventsUrl, {
          params: {
            token: token,
            page: page,
            event_vendor_id: vendorId,
            ...queryFilters,
          },
        }),
        axios.get(pastEventsUrl, {
          params: {
            token: token,
            page: page,
            event_vendor_id: vendorId,
            ...queryFilters,
          },
        }),
        axios.get(allEventsUrl, {
          params: {
            token: token,
            page: page,
            event_vendor_id: vendorId,
            ...queryFilters,
          },
        }),
      ]);

      // Set state for live events with pagination
      setLiveEvents({
        events: liveResponse.data.events || [],
        pagination: liveResponse.data.pagination || {},
      });

      // Set state for history events with pagination
      setHistoryEvents({
        events: historyResponse.data.events || [],
        pagination: historyResponse.data.pagination || {},
      });

      // Set state for all events with pagination
      setAllEventsData({
        events: allResponse.data.events || [],
        pagination: allResponse.data.pagination || {},
      });
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(error.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

  }, [activeTab, vendorId]);



  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchEvents(newPage);
    }
  };
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const getFilteredData = () => {
    switch (activeTab) {
      case "live":
        return { events: liveEvents.events, pagination: liveEvents.pagination };
      case "history":
        return {
          events: historyEvents.events,
          pagination: historyEvents.pagination,
        };
      case "all":
        return {
          events: allEventsData.events,
          pagination: allEventsData.pagination,
        };
      default:
        return { events: [], pagination: {} };
    }
  };

  const { events: eventsToDisplay, pagination } = getFilteredData(); // Destructure to get events and pagination

  // Get the range of pages to display
  const getPageRange = () => {
    const totalPages = pagination.total_pages || 1; // Default to 1 if total_pages is undefined
    let startPage = Math.max(
      pagination.current_page - Math.floor(pageRange / 2),
      1
    );
    let endPage = startPage + pageRange - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageRange(); // Get the current page range for display



  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
    handleClose();
    // handleReset();
  };


  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://vendors.lockated.com/rfq/events?token=${token}&q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]=${searchQuery}`
      );

      // const { live_events, history_events, all_events } = response.data;

      // Set state for live events with pagination
      // Set state for live events with pagination
      setSuggestions(response.data?.events); // Populate suggestions with event data

      setLiveEvents({
        events: response.data?.events || [],
        pagination: response.data?.pagination || {},
      });

      // Set state for history events with pagination
      setHistoryEvents({
        events: response.data?.events || [],
        pagination: response.data?.pagination || {},
      });

      // Set state for all events with pagination
      setAllEventsData({
        events: response.data?.events || [],
        pagination: response.data?.pagination || {},
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Unable to fetch search results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   handleSearch();
  //   // handleResetSearch();
  // };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.event_title); // Assuming `event_title` is the property you want
    setIsSuggestionsVisible(false);
    // Perform any additional actions on suggestion click, like triggering search
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsVisible(false);
    // Trigger search logic with `searchQuery`
    console.log("Search submitted for:", searchQuery);
    fetchSuggestions(searchQuery);
  };

  const handleResetSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchEvents();
    } else {
      setSearchQuery("");
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      handleResetSearch();
    }
  }, [searchQuery]);

  const vendorDetails = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const response = await axios.get(
        "https://vendors.lockated.com/rfq/events/event_vendors_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078411&page=1"
      );

      const vendorData = response.data.list;

      const options = Array.from(
        new Map(vendorData.map((item) => [item[0], item])).values()
      ).map((item) => ({
        value: item[1],
        label: item[0],
      }));

      setVendorList(options);
    } catch (error) {
      console.error("Error fetching vendor details:", error.message);
    }
  };

  useEffect(() => {
    vendorDetails();
  }, []);



  const eventProjectColumns = [
    { label: "Sr.No.", key: "srNo" },
    { label: "Event Title", key: "event_title" },
    { label: "Event No", key: "event_no" },
    { label: "Start Time", key: "start_time" },

    { label: "End Time", key: "end_time" },

    { label: "Created At", key: "created_at" },
    { label: "Created By", key: "created_by" },
    { label: "Event Type", key: "event_type" },
    { label: "Event Configuration", key: "event_configuration" },
    { label: "Status", key: "status" },
    { label: "Action" },
  ];

  const selectedVendor = vendorList.find((option) => option.value === vendorId);

  const handleSelectChange = (event) => {
    const newVendorId = event.target.value || ""; // Get the selected value
    setVendorId(newVendorId);
  };

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-0">
            <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none text-primary">
                      RFQ
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Vendor List
                  </li>
                </ol>
              </nav>
              <h5 className="mt-3 ms-3">RFQ &amp; Auction Events</h5>
              <div style={{ width: "14%" }}>
                <select
                  id="vendorDropdown"
                  className="form-control form-select"
                  value={vendorId || ""}
                  onChange={handleSelectChange}
                >
                  <option value="">No Vendor Selected</option>
                  {vendorList.map((vendor) => (
                    <option key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </option>
                  ))}
                </select>



              </div>
            </div>

            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row separteinto5 justify-content-left">
                  <div className="col-md-2 text-center">
                    <div
                      className="content-box"
                      onClick={() => handleTabChange("all")}
                      style={{
                        cursor: "pointer",
                        border:
                          activeTab === "all"
                            ? "2px solid orange"
                            : "1px solid #ccc",
                        backgroundColor:
                          activeTab === "all" ? "#de7008" : "#fff",
                        color: activeTab === "all" ? "white" : "black", // Adjust text color for better contrast
                      }}
                    >
                      <h4 className="content-box-title">All Events</h4>
                      <p className="content-box-sub">
                        {allEventsData.pagination?.total_count || 0}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-2 text-center">
                    <div
                      className="content-box"
                      onClick={() => handleTabChange("live")}
                      style={{
                        cursor: "pointer",
                        border:
                          activeTab === "live"
                            ? "2px solid orange"
                            : "1px solid #ccc",
                        backgroundColor:
                          activeTab === "live" ? "#de7008" : "#fff",
                        color: activeTab === "live" ? "white" : "black", // Adjust text color for better contrast
                      }}
                    >
                      <h4 className="content-box-title">Live Events</h4>
                      <p className="content-box-sub">
                        {liveEvents.pagination?.total_count}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-2 text-center">
                    <div
                      className="content-box"
                      onClick={() => handleTabChange("history")}
                      style={{
                        cursor: "pointer",
                        border:
                          activeTab === "history"
                            ? "2px solid #007bff"
                            : "1px solid #ccc",
                        backgroundColor:
                          activeTab === "history" ? "#de7008" : "#fff",
                        color: "black",
                      }}
                    >
                      <h4 className="content-box-title">History Events</h4>
                      <p className="content-box-sub">
                        {historyEvents.pagination?.total_count}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card mt-4 pb-4">
                  <CollapsibleCard title="Quick Filter">
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      {loading && (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        ></div>
                      )}

                      <div className="row my-2 align-items-end">
                        {/* Event Title */}
                        <div className="col-md-2">
                          <label htmlFor="event-title-select">
                            Event Title
                          </label>
                          <Select
                            id="event-title-select"
                            options={filterOptions.event_titles}
                            onChange={(option) =>
                              handleFilterChange(
                                "title_in",
                                option?.value || ""
                              )
                            }
                            value={
                              filters.title_in
                                ? filterOptions.event_titles.find(
                                  (opt) => opt.value === filters.title_in
                                )
                                : null
                            }
                            placeholder="Select Event Title"
                            isClearable
                          />
                        </div>

                        {/* Event Number */}
                        <div className="col-md-2">
                          <label htmlFor="event-no-select">Event Number</label>
                          <Select
                            id="event-no-select"
                            options={filterOptions.event_numbers}
                            onChange={(option) =>
                              handleFilterChange(
                                "event_no_cont",
                                option?.value || ""
                              )
                            }
                            value={
                              filters.event_no_cont
                                ? filterOptions.event_numbers.find(
                                  (opt) => opt.value === filters.event_no_cont
                                )
                                : null
                            }
                            placeholder="Select Event Number"
                            isClearable
                          />
                        </div>

                        {/* Status */}
                        <div className="col-md-2">
                          <label htmlFor="status-select">Status</label>
                          <Select
                            id="status-select"
                            options={filterOptions.statuses}
                            onChange={(option) =>
                              handleFilterChange(
                                "status_in",
                                option?.value || ""
                              )
                            }
                            value={
                              filters.status_in
                                ? filterOptions.statuses.find(
                                  (opt) => opt.value === filters.status_in
                                )
                                : null
                            }
                            placeholder="Select Status"
                            isClearable
                          />
                        </div>

                        {/* Created By */}
                        <div className="col-md-2">
                          <label htmlFor="created-by-select">Created By</label>
                          <Select
                            id="created-by-select"
                            options={filterOptions.creaters}
                            onChange={(option) =>
                              handleFilterChange(
                                "created_by_id_in",
                                option?.value || ""
                              )
                            }
                            value={
                              filters.created_by_id_in
                                ? filterOptions.creaters.find(
                                  (opt) =>
                                    opt.value === filters.created_by_id_in
                                )
                                : null
                            }
                            placeholder="Select Creator"
                            isClearable
                          />
                        </div>
                        <button type="submit" className="col-md-1 purple-btn2">
                          Go{" "}
                        </button>
                      </div>
                    </form>
                  </CollapsibleCard>

                  <div className="d-flex mt-3 align-items-end px-3">
                    <div className="col-md-6 position-relative">
                      <form onSubmit={handleSearchSubmit}>
                        <div className="input-group">
                          <input
                            type="search"
                            id="searchInput"
                            className="tbl-search form-control"
                            placeholder="Type your keywords here"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => setIsSuggestionsVisible(true)}
                            onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)}
                          />

                          <div className="input-group-append">
                            <button type="sumbit"

                              className="btn btn-md btn-default"
                            >
                              <SearchIcon />
                            </button>

                          </div>


                        </div>


                      </form>
                      {isSuggestionsVisible && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                          {suggestions.map((suggestion) => (
                            <li
                              key={suggestion.id} // Use unique identifier if available
                              className="suggestion-item"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion.event_title} {/* Display event title */}
                            </li>
                          ))}
                        </ul>
                      )}
                      {loading && <p>Loading suggestions...</p>}
                      {error && <p className="error-message">{error}</p>}
                    </div>

                    <div className="col-md-6">
                      <div className="row justify-content-end">
                        <div className="col-md-5">
                          <div className="row justify-content-end px-3">
                            <div className="col-md-3">
                              <button
                                style={{ color: "#de7008" }}
                                className="btn btn-md"
                                onClick={handleModalShow}
                              >
                                <FilterIcon />
                              </button>
                            </div>
                            {/* <div className="col-md-3">
                                <button
                                  style={{ color: "#de7008" }}
                                  type="submit"
                                  className="btn btn-md"
                                >
                                  <StarIcon />
                                </button>
                              </div> */}
                            {/* <div className="col-md-3">
                                <button
                                  style={{ color: "#de7008" }}
                                  id="downloadButton"
                                  type="submit"
                                  className="btn btn-md"
                                >
                                  <DownloadIcon />
                                </button>
                              </div> */}
                            {/* <div className="col-md-3">
                                <button
                                  style={{ color: "#de7008" }}
                                  type="submit"
                                  className="btn btn-md"
                                  onClick={handleSettingModalShow}
                                >
                                  <SettingIcon
                                    color={"#de7008"}
                                    style={{ width: "23px", height: "23px" }}
                                  />
                                </button>
                              </div> */}
                          </div>
                        </div>
                        <div className="col-md-4">
                          {/* <button
                            className="purple-btn2"
                            onClick={() => navigate("/create-event")}
                          >
                            <span className="material-symbols-outlined align-text-top">
                              add
                            </span>
                            New Event
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tbl-container mt-3 px-3">
                    <table className="w-100">
                      <thead>
                        <tr>
                          {eventProjectColumns.map((column) => (
                            <th key={column.key}>{column.label}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {eventsToDisplay.length === 0 ? (
                          <tr>
                            <td colSpan="9">No events found.</td>
                          </tr>
                        ) : (
                          eventsToDisplay.map((event, index) => (
                            <tr key={index}>
                              <td>
                                {(pagination.current_page - 1) * 10 + index + 1}
                              </td>
                              <td>{event.event_title || "N/A"}</td>
                              <td>{event.event_no || "N/A"}</td>
                              <td>
                                {event.event_schedule?.start_time ? (
                                  <FormatDate timestamp={event.event_schedule?.start_time} />
                                ) : (
                                  "N/A"
                                )}
                              </td>

                              <td>
                                {event.event_schedule?.end_time ? (
                                  <FormatDate timestamp={event.event_schedule?.end_time} />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                {event.created_at ? (
                                  <FormatDate timestamp={event.created_at} />
                                ) : (
                                  "N/A"
                                )}

                              </td>
                              <td>{event.created_by || "N/A"}</td>
                              <td>
                                {event.event_type_detail?.event_type || "N/A"}
                              </td>
                              <td>
                                {event.event_type_detail?.event_configuration ||
                                  "N/A"}
                              </td>
                              <td>{event.status || "N/A"}</td>
                              <td>
                                <button
                                  className="btn "
                                  onClick={() =>
                                    navigate(`/user-list/${event.id}`)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-eye"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                  </svg>{" "}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                    <ul className="pagination justify-content-center d-flex">
                      {/* First Button */}
                      <li
                        className={`page-item ${pagination.current_page === 1 ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                        >
                          First
                        </button>
                      </li>

                      {/* Previous Button */}
                      <li
                        className={`page-item ${pagination.current_page === 1 ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                          }
                          disabled={pagination.current_page === 1}
                        >
                          Prev
                        </button>
                      </li>

                      {/* Dynamic Page Numbers */}
                      {pageNumbers.map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${pagination.current_page === pageNumber
                            ? "active"
                            : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}

                      {/* Next Button */}
                      <li
                        className={`page-item ${pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Next
                        </button>
                      </li>

                      {/* Last Button */}
                      <li
                        className={`page-item ${pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.total_pages)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Last
                        </button>
                      </li>
                    </ul>

                    {/* Showing entries count */}
                    <div>
                      <p>
                        Showing{" "}
                        {Math.min(
                          (pagination.current_page - 1) * pageSize + 1 || 1,
                          pagination.total_count
                        )}{" "}
                        to{" "}
                        {Math.min(
                          pagination.current_page * pageSize,
                          pagination.total_count
                        )}{" "}
                        of {pagination.total_count} entries
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <LayoutModal show={settingShow} onHide={handleSettingClose} />

              <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-right"
                className="setting-modal"
                backdrop={true}
              >
                <Modal.Header>
                  <div className="container-fluid p-0">
                    <div className="border-0 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="btn"
                          aria-label="Close"
                          onClick={handleClose}
                        >
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 1L1 9L9 17"
                              stroke="#de7008"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <h3
                          className="modal-title m-0"
                          style={{ fontWeight: 500 }}
                        >
                          Filter
                        </h3>
                      </div>
                      <Link
                        className="resetCSS"
                        style={{
                          fontSize: "14px",
                          textDecoration: "underline",
                        }}
                        to="#"
                        onClick={handleReset} // Attach the reset function
                      >
                        Reset
                      </Link>
                    </div>
                  </div>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body" style={{ overflowY: "scroll" }}>
                    <div className="form-group mb-4">
                      <div className="form-group">
                        <label htmlFor="mor-date-from">Enter Title </label>
                        <Select
                          options={filterOptions.event_titles}
                          placeholder="Select an Event Title"
                          isClearable
                          value={filterOptions.event_titles.find(
                            (opt) => opt.value === filters.title_in
                          )}
                          onChange={(option) =>
                            handleFilterChange("title_in", option?.value || "")
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="form-group">
                        <label htmlFor="mor-date-from">Product</label>
                        <Select
                          options={filterOptions.material_name}
                          placeholder="Select a Product"
                          isClearable
                          value={filterOptions.material_name.find(
                            (opt) =>
                              opt.value === filters.event_materials_inventory_id_in
                          )}
                          onChange={(option) =>
                            handleFilterChange(
                              "event_materials_inventory_id_in",
                              option?.value || ""
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="form-group">
                        <label htmlFor="mor-date-from">Product Category</label>
                        <Select
                          options={filterOptions.material_type}
                          placeholder="Select a Product Category"
                          isClearable
                          value={filterOptions.material_type.find(
                            (opt) =>
                              opt.value ===
                              filters.event_materials_pms_inventory_inventory_type_id_in
                          )}
                          onChange={(option) =>
                            handleFilterChange(
                              "event_materials_pms_inventory_inventory_type_id_in",
                              option?.value || ""
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="form-group">
                        <label htmlFor="mor-date-from">Location</label>
                        <Select
                          options={filterOptions.locations}
                          placeholder="Select a Location"
                          isClearable
                          value={filterOptions.locations.find(
                            (opt) => opt.value === filters.event_materials_id_in
                          )}
                          onChange={(option) =>
                            handleFilterChange(
                              "event_materials_id_in",
                              option?.value || ""
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="form-group">
                        <label htmlFor="mor-date-from">Created By</label>
                        <Select
                          options={filterOptions.creaters}
                          placeholder="Select a Creator"
                          isClearable
                          value={filterOptions.creaters.find(
                            (opt) => opt.value === filters.created_by_id_in
                          )}
                          onChange={(option) =>
                            handleFilterChange(
                              "created_by_id_in",
                              option?.value || ""
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="form-group d-flex align-items-start">
                        <label htmlFor="mor-date-from">My Event</label>
                        <div className="form-check form-switch ms-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            checked={isMyEvent}
                            onChange={(e) => setIsMyEvent(e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button type="submit" className="purple-btn2">
                      Go
                    </button>
                  </div>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
