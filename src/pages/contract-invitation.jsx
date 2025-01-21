import React, { useState, useEffect } from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { SearchIcon, SelectBox, Table } from "../components";
import axios from "axios";
import Select from "react-select";

export default function ContractInvitation() {
  const [activeTab, setActiveTab] = useState("all");
  const [eventsData, setEventsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    event_numbers: [],
  });
  const [filters, setFilters] = useState({
    event_no_cont: "",
  });

  const fetchEventsData = async () => {
    try {
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events/eois?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
      );
      const data = await response.json();
      setEventsData(data.expression_of_interests);
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://vendors.lockated.com/rfq/events/advance_filter_options",
        {
          params: {
            token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
          },
        }
      );

      setFilterOptions({
        event_numbers: response.data.event_numbers.map((item) => ({
          value: item.value,
          label: item.name,
        })),
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://vendors.lockated.com/rfq/events?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]=${searchTerm}`
      );
      setEventsData(response.data.events);
      setSuggestions(response.data.events);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Unable to fetch search results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
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
        `https://vendors.lockated.com/rfq/events?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]=${query}`
      );
      setSuggestions(response.data.events);
      setIsSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Unable to fetch suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.event_title);
    setIsSuggestionsVisible(false);
    fetchEventsData();
  };

  const filteredEvents = eventsData.filter(
    (event) =>
      event.event &&
      event.event.event_title &&
      event.event.event_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { label: "Event Title", key: "event_title" },
    { label: "Event Number", key: "event_no" },
    { label: "Created On", key: "created_on" },
    { label: "Status", key: "status" },
    { label: "Material Title", key: "material_title" },
    { label: "Delivery Location", key: "delivary_location" },
    { label: "Start Time", key: "start_time" },
    { label: "End Time", key: "end_time" },
    { label: "Delivery Date", key: "delivery_date" },
  ];

  const data = filteredEvents.map((event) => ({
    event_title: event.event.event_title,
    event_no: event.event.event_no,
    created_on: event.event.created_on,
    status: event.event.status,
    material_title: event.event.material_title,
    delivary_location: event.event.delivary_location,
    start_time: event.event.start_time,
    end_time: event.event.end_time,
    delivery_date: event.event.delivery_date,
  }));

  return (
    <div className="website-content overflow-auto">
      <div className="module-data-section ">
        <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-primary">
                  RFQ
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contract Invitation
              </li>
            </ol>
          </nav>
          <h5 className="mt-3 ms-3">RFQ &amp; Auction Events</h5>
          <div style={{ width: "15%" }}></div>
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
                    backgroundColor: activeTab === "all" ? "#de7008" : "#fff",
                    color: activeTab === "all" ? "white" : "black",
                  }}
                >
                  <h4 className="content-box-title">Accepted</h4>
                  <p className="content-box-sub">4</p>
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
                    backgroundColor: activeTab === "live" ? "#de7008" : "#fff",
                    color: activeTab === "live" ? "white" : "black",
                  }}
                >
                  <h4 className="content-box-title">Not Interested</h4>
                  <p className="content-box-sub">4</p>
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
                  <h4 className="content-box-title">Pending</h4>
                  <p className="content-box-sub">2</p>
                </div>
              </div>
            </div>

            <div className="card mt-4 pb-4">
              <CollapsibleCard title="Quick Filter">
                <form onSubmit={handleSearchSubmit}>
                  <div className="row my-2 align-items-end justify-content-between">
                    <div className="col-md-4">
                      <Select
                        options={filterOptions.event_numbers}
                        placeholder="Select Event Number"
                        isClearable
                        value={filterOptions.event_numbers.find(
                          (opt) => opt.value === filters.event_no_cont
                        )}
                        onChange={(option) =>
                          handleFilterChange("event_no_cont", option?.value || "")
                        }
                      />
                    </div>

                    <button type="submit" className="col-md-1 purple-btn2">
                      Go{" "}
                    </button>
                  </div>
                </form>
              </CollapsibleCard>
              <div className="input-group w-50 position-relative ps-3 mt-3">
                <input
                  type="search"
                  id="searchInput"
                  className="tbl-search form-control"
                  placeholder="Search Vendors"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setIsSuggestionsVisible(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSuggestionsVisible(false), 200)
                  }
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-md btn-default"
                    onClick={handleSearchSubmit}
                  >
                    <SearchIcon />
                  </button>
                </div>
                {isSuggestionsVisible && suggestions.length > 0 && (
                  <ul
                    className="suggestions-list position-absolute bg-white border rounded w-100"
                    style={{ zIndex: 1000, top: "100%" }}
                  >
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 cursor-pointer"
                      >
                        {suggestion.event_title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-3">
                <Table
                  columns={columns}
                  data={data}
                  onRowSelect={undefined}
                  resetSelectedRows={undefined}
                  onResetComplete={undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
