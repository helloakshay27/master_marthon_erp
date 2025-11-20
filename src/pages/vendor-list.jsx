import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import { baseURL } from "../confi/apiDomain";

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
import FormatDateTime from "../components/FormatDateTime";
import { DataGrid } from "@mui/x-data-grid";

export default function VendorListPage() {
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
  const [activeTab, setActiveTab] = useState("live");
  const [liveEvents, setLiveEvents] = useState({ events: [], pagination: {} });
  const [historyEvents, setHistoryEvents] = useState({
    events: [],
    pagination: {},
  });
  const [allEventsData, setAllEventsData] = useState({
    events: [],
    pagination: {},
  });

  const [eoiEvents, setEoiEvents] = useState({ events: [], pagination: {} });

  const [loading, setLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
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
    return sessionStorage.getItem("vendorId") || "";
  });

  useEffect(() => {
    // Save vendorId in session storage
    console.log("vendorId", vendorId);

    sessionStorage.setItem("vendorId", vendorId);
  }, [vendorId]);
  const [vendorList, setVendorList] = useState([]);

  const [vendorOptions, setVendorOptions] = useState([]);

  const navigate = useNavigate();

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  const handleReset = () => {
    // Reset filters
    setFilters({
      created_by_id_in: "",
      event_type_detail_award_scheme_in: "",
      status_in: "",
      title_in: "",
      event_materials_inventory_id_in: "",
      event_materials_pms_inventory_inventory_type_id_in: "",
      event_materials_id_in: "",
    });
    
    // Reset search query
    setSearchQuery("");
    
    // Reset my event toggle
    setIsMyEvent(false);
    
    // Refetch filter options to restore the original state
    fetchFilterOptions();
    
    // Refetch events with cleared filters
    fetchEvents(1);
  };

  // Memoize preprocessOptions to avoid recomputation
  const preprocessOptions = useCallback((array, isKeyValuePair = false) => {
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
  }, []);

  const fetchFilterOptions = async () => {
    setFilterLoading(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      const response = await axios.get(
        `${baseURL}/rfq/events/advance_filter_options`,
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
    name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    value: status,
  }))
),
        material_name: preprocessOptions(response.data?.material_name || []),
        material_type: preprocessOptions(response.data?.material_type || []),
        locations: preprocessOptions(response.data?.locations || []),
      });
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError(err.response?.data?.message || "Failed to fetch filter options");
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);
  const [counts, setCounts] = useState("");

  const fetchEventCounts = async () => {
    setLoading(true); // Start loader
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      const response = await axios.get(`${baseURL}rfq/events/event_counts`, {
        params: {
          page: 1,
          token: token,
        },
      });

      // Assuming the response contains counts for all, live, and history events
      setCounts(
        response?.data || {
          all: 0,
          live: 0,
          history: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching event counts:", error);
      setError("Failed to fetch event counts");
    }
  };

  useEffect(() => {
    fetchEventCounts();
  }, []);
  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const queryFilters = {
        ...(filters.created_by_id_in && {
          "q[created_by_id_in]": filters.created_by_id_in,
        }),
        ...(filters.event_type_detail_award_scheme_in && {
          "q[event_type_detail_award_scheme_in]":
            filters.event_type_detail_award_scheme_in,
        }),
        ...(filters.status_in && { "q[status_in]": filters.status_in }),
        ...(filters.title_in && { "q[title_in]": filters.title_in }),
        ...(filters.event_materials_inventory_id_in && {
          "q[event_materials_inventory_id_in]":
            filters.event_materials_inventory_id_in,
        }),
        ...(filters.event_materials_pms_inventory_inventory_type_id_in && {
          "q[event_materials_pms_inventory_inventory_type_id_in]":
            filters.event_materials_pms_inventory_inventory_type_id_in,
        }),
        ...(filters.event_materials_id_in && {
          "q[event_materials_id_in]": filters.event_materials_id_in,
        }),
        ...(filters.event_no_cont && {
          "q[event_no_cont]": filters.event_no_cont,
        }),
        // Add search query parameter for global search
        ...(searchQuery.trim() && {
          "q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]": searchQuery.trim(),
        }),
      };

      let eventsUrl;

      switch (activeTab) {
        case "live":
          eventsUrl = `${baseURL}/rfq/events/live_events`;
          break;
        case "history":
          eventsUrl = `${baseURL}/rfq/events/past_events`;
          break;
        case "all":
          eventsUrl = `${baseURL}/rfq/events`;
          break;
        case "eoi":
          eventsUrl = `${baseURL}/rfq/events/eois`;
          break;
        default:
          eventsUrl = `${baseURL}/rfq/events`;
      }

      const response = await axios.get(eventsUrl, {
        params: {
          token: token,
          page: page,
          event_vendor_id: vendorId,
          ...queryFilters,
        },
      });

      //  const mappedEoiEvents = response.data.expression_of_interests?.map(
      //   (eoi) => ({
      //     id: eoi.id,
      //     event_id: eoi.event.id,
      //     status: eoi.status,
      //     event_title: eoi.event.event_title,
      //     event_no: eoi.event.event_no,
      //     start_time: eoi.event.start_time,
      //     end_time: eoi.event.end_time,
      //     created_at: eoi.event.created_at,
      //     created_by: eoi.event.created_by,
      //     event_type: eoi.event.event_type_detail?.event_type || "N/A",
      //     event_configuration:
      //       eoi.event.event_type_detail?.event_configuration || "N/A",
      //     vendor_name: eoi.vendor?.full_name || "N/A",
      //     vendor_status: eoi.vendor?.status || "N/A",
      //   })
      // );

      switch (activeTab) {
        case "live":
          setLiveEvents({
            events: response.data.events || [],
            pagination: response.data.pagination || {},
          });
          break;
        case "history":
          setHistoryEvents({
            events: response.data.events || [],
            pagination: response.data.pagination || {},
          });
          break;
        case "all":
          setAllEventsData({
            events: response.data.events || [],
            pagination: response.data.pagination || {},
          });
          break;
        // case "eoi":
        //   setEoiEvents({
        //     events: mappedEoiEvents || [],
        //     pagination: response.data.pagination || {},
        //   });
        //   break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(error.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, vendorId]); // Remove searchQuery dependency to prevent API calls on every keystroke

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

      case "eoi": // Add this case for EOI data
        console.log("EOI events:", eoiEvents); // Debug o
        return {
          events: eoiEvents.events, // Ensure you have a state for EOI events
          pagination: eoiEvents.pagination,
        };
      default:
        return { events: [], pagination: {} };
    }
  };

  const { events: eventsToDisplay, pagination } = getFilteredData(); // Destructure to get events and pagination

  // Memoize getPageRange to avoid recomputation
  const getPageRange = useMemo(() => {
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
  }, [pagination, pageRange]);

  const pageNumbers = getPageRange; // Get the current page range for display

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

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    setSuggestionLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${baseURL}/rfq/events?token=${token}&q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]=${searchQuery}`
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

      setEoiEvents({
        events: response.data?.events || [],
        pagination: response.data?.pagination || {},
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Unable to fetch search results. Please try again later.");
    } finally {
      setSuggestionLoading(false);
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
    // Only store the input value - no automatic search or suggestions
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.event_title); // Assuming `event_title` is the property you want
    setIsSuggestionsVisible(false);
    // Perform any additional actions on suggestion click, like triggering search
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsVisible(false);
    
    // Trigger search with current searchQuery
    console.log("Search submitted for:", searchQuery);
    
    if (searchQuery.trim()) {
      fetchSuggestions(searchQuery); // Perform search only on button click
    } else {
      // Clear suggestions if search is empty
      setSuggestions([]);
      fetchEvents(1); // Reset to show all events
    }
  };

  const handleResetSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchEvents();
    } else {
      setSearchQuery("");
    }
  };
  
  const vendorDetails = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      
      const response = await axios.get(
        `${baseURL}rfq/events/event_vendors_list?token=${window.location.hostname === "localhost" ? 'bfa5004e7b0175622be8f7e69b37d01290b737f82e078411' : token}`
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

  // 1. Column visibility state and helpers (like admin_list)
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    event_no: true,
    start_time: true,
    end_time: true,
    created_at: true,
    event_type: true,
    status: true,
    action: true,
  });

  // 2. All columns definition (with ellipsis for each cell)
  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr.No.",
      width: 80,
      renderCell: (params) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.row.srNo}
        </div>
      ),
    },
    {
      field: "event_no",
      headerName: "Event No",
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.row.event_no || "N/A"}
        </div>
      ),
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 160,
      renderCell: (params) => {
        if (params.row.event_schedule?.start_time) {
          const dateStr = params.row.event_schedule.start_time;
          // Parse the UTC date manually to avoid timezone conversion
          const date = new Date(dateStr);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const year = date.getUTCFullYear();
          const hours = date.getUTCHours();
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          
          // Convert to 12-hour format
          const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const ampm = hours >= 12 ? 'PM' : 'AM';
          
          return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
        }
        return <span style={{ color: "#aaa" }}>N/A</span>;
      },
    },
    {
      field: "end_time",
      headerName: "End Time",
      width: 160,
      renderCell: (params) => {
        if (params.row.event_schedule?.end_time) {
          const dateStr = params.row.event_schedule.end_time;
          // Parse the UTC date manually to avoid timezone conversion
          const date = new Date(dateStr);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const year = date.getUTCFullYear();
          const hours = date.getUTCHours();
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          
          // Convert to 12-hour format
          const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const ampm = hours >= 12 ? 'PM' : 'AM';
          
          return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
        }
        return <span style={{ color: "#aaa" }}>N/A</span>;
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 140,
      renderCell: (params) =>
        params.row.created_at ? (
          <FormatDate timestamp={params.row.created_at} />
        ) : (
          <span style={{ color: "#aaa" }}>N/A</span>
        ),
    },
    {
      field: "event_type",
      headerName: "Event Type",
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.row.event_type_with_configuration || "N/A"}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <div
          style={{
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.row.status || "N/A"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        console.log("params.row:-",params.row)
        return(
        <button
          className="btn"
          onClick={() => navigate(`/user-list/${params.row.id}?token=${token}`)}
          title="View"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-eye"
            viewBox="0 0 16 16"
          >
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
          </svg>
        </button>)
    },
    },
  ];

  // 3. Filter columns based on visibility
  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  // 4. Settings modal handlers
  const handleToggleColumn = (field) => {
    setColumnVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleShowAll = () => {
    const updatedVisibility = allColumns.reduce((acc, column) => {
      acc[column.field] = true;
      return acc;
    }, {});
    setColumnVisibility(updatedVisibility);
  };
  const handleHideAll = () => {
    const updatedVisibility = allColumns.reduce((acc, column) => {
      acc[column.field] = false;
      return acc;
    }, {});
    setColumnVisibility(updatedVisibility);
  };
  const handleResetColumns = () => {
    const defaultVisibility = allColumns.reduce((acc, column) => {
      acc[column.field] = true;
      return acc;
    }, {});
    setColumnVisibility(defaultVisibility);
  };

  // 5. Prepare DataGrid rows
  const dataGridRows = eventsToDisplay.map((event, index) => ({
    ...event,
    id: event.id,
    srNo:
      (Number.isInteger(pagination?.current_page)
        ? pagination.current_page - 1
        : 0) *
        pageSize +
      index +
      1,
  }));

  console.log("dataGridRows:-",dataGridRows);
  

  // Add this function to fix the error
  const handleSelectChange = (event) => {
    const newVendorId = event.target.value || "";
    setVendorId(newVendorId);
  };

  useEffect(() => {
      if (!containerRef.current) return;
  
      const updateWidth = () => {
        setContainerWidth(containerRef.current.offsetWidth);
      };
  
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);
  
    // Calculate column widths evenly
   const fixedColumns = React.useMemo(() => {
  const visibleCols = columns.filter((col) => !col.hide && col.field);
  const srNoColumn = visibleCols.find((col) => col.field === "srNo");
  const otherColumns = visibleCols.filter((col) => col.field !== "srNo");
  
  const srNoWidth = 60; // Fixed width for srNo column
  const remainingWidth = containerWidth - srNoWidth;
  const otherColCount = otherColumns.length || 1;
  const equalWidth = remainingWidth / otherColCount;

  return visibleCols.map((col) => ({
    ...col,
    width: col.field === "srNo" ? srNoWidth : equalWidth,
    flex: undefined, // disable flex to prevent it from overriding width
  }));
}, [columns, containerWidth]);

  return (
    <>
      {/* Add global style for text ellipsis in DataGrid cells */}
      <style>
        {`
          .MuiDataGrid-cell {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
        `}
      </style>
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
              {loading || filterLoading || suggestionLoading ? (
                <div className="loader-container">
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>loading..</p>
                </div>
              ) : (
                <div className="container-fluid">
                  {/* <div className="row separteinto5 justify-content-left">
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
                  </div> */}
                  <div className="row separteinto5 justify-content-center">
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
                            activeTab === "all" ? " #8b0203" : "#fff",

                          color: activeTab === "all" ? "white" : "black",
                        }}
                      >
                        <h4 className="content-box-title">All Events</h4>
                        <p className="content-box-sub">
                          {counts?.all_events || 0}
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
                            activeTab === "live" ? " #8b0203" : "#fff",
                          color: activeTab === "live" ? "white" : "black",
                        }}
                      >
                        <h4 className="content-box-title">Live Events</h4>
                        <p className="content-box-sub">
                          {counts?.live_events || 0}
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
                              ? "2px solid orange"
                              : "1px solid #ccc",
                          backgroundColor:
                            activeTab === "history" ? " #8b0203" : "#fff",
                          color: activeTab === "history" ? "white" : "black",
                        }}
                      >
                        <h4 className="content-box-title">History Events</h4>
                        <p className="content-box-sub">
                          {counts?.history_events || 0}
                        </p>
                      </div>
                    </div>

                    {/* <div className="col-md-2 text-center">
                      <div
                        className="content-box"
                        onClick={() => handleTabChange("eoi")}
                        style={{
                          cursor: "pointer",
                          border:
                            activeTab === "eoi"
                              ? "2px solid orange"
                              : "1px solid #ccc",
                          backgroundColor:
                            activeTab === "eoi" ? " #8b0203" : "#fff",
                          color: activeTab === "eoi" ? "white" : "black",
                        }}
                      >
                        <h4 className="content-box-title">EOI Events</h4>
                        <p className="content-box-sub">
                          {eoiEvents.pagination?.total_count || 0}
                        </p>
                      </div>
                    </div> */}
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
                              placeholder="Select Title"
                              isClearable
                              classNamePrefix="select-dropdown" // This applies the CSS class
                              menuPlacement="auto"
                              menuPortalTarget={document.body} // Fixes overlapping issue
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>
                              {console.log("filrte",filters)}
                          {/* Event Number */}
                          <div className="col-md-2">
                            <label htmlFor="event-no-select">
                              Event Number
                            </label>
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
                                      (opt) =>
                                        opt.value === filters.event_no_cont
                                    )
                                  : null
                              }
                              placeholder="Select No"
                              isClearable
                              classNamePrefix="select-dropdown" // This applies the CSS class
                              menuPlacement="auto"
                              menuPortalTarget={document.body} // Fixes overlapping issue
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
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
                              classNamePrefix="select-dropdown" // This applies the CSS class
                              menuPlacement="auto"
                              menuPortalTarget={document.body} // Fixes overlapping issue
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>

                          {/* Created By */}
                          <div className="col-md-2">
                            <label htmlFor="created-by-select">
                              Created By
                            </label>
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
                              classNamePrefix="select-dropdown" // This applies the CSS class
                              menuPlacement="auto"
                              menuPortalTarget={document.body} // Fixes overlapping issue
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            className="col-md-1 purple-btn2"
                          >
                            Go{" "}
                          </button>
                        </div>
                      </form>
                    </CollapsibleCard>

                    <div className="d-flex mt-3 align-items-end px-3">
                      <div className="col-md-6 position-relative">
                          <div className="input-group">
                            <input
                              type="search"
                              id="searchInput"
                              className="tbl-search form-control"
                              placeholder="Type your keywords here"
                              value={searchQuery}
                              onChange={handleInputChange}
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
                          </div>
                        {isSuggestionsVisible && suggestions.length > 0 && (
                          <ul className="suggestions-list">
                            {suggestions.map((suggestion) => (
                              <li
                                key={suggestion.id} // Use unique identifier if available
                                className="suggestion-item"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion.event_title}{" "}
                                {/* Display event title */}
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
                                <div className="col-md-2">
                                <button
                                  style={{ color: " #8b0203" }}
                                  className="btn btn-md"
                                  onClick={handleModalShow}
                                >
                                  <FilterIcon />
                                </button>
                              </div>
                              <div className="col-md-2">
                                <button
                                  style={{ color: "#8b0203" }}
                                  type="button"
                                  className="btn btn-md"
                                  onClick={handleSettingModalShow}
                                >
                                  <SettingIcon
                                    color={"#8b0203"}
                                    style={{ width: "23px", height: "23px" }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-md-4"> */}
                            {/* <button
                              className="purple-btn2"
                              onClick={() => navigate("/create-event")}
                            >
                              <span className="material-symbols-outlined align-text-top">
                                add
                              </span>
                              New Event
                            </button> */}
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
              <div
      ref={containerRef}
      style={{ width: "100%", height: "600px", display: "flex", flexDirection: "column", padding:'20px' }}>
                      <DataGrid
                        rows={dataGridRows}
                        columns={fixedColumns}
                        pagination
                        pageSize={pageSize}
                        rowHeight={60}
                        rowCount={
                          Number.isInteger(pagination?.total_count)
                            ? pagination.total_count
                            : 0
                        }
                        paginationMode="server"
                        page={
                          Number.isInteger(pagination?.current_page) &&
                          pagination.current_page > 0
                            ? pagination.current_page - 1
                            : 0
                        }
                        onPageChange={(params) => handlePageChange(params + 1)}
                        loading={loading}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                        sx={{
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f8f9fa",
                            color: "#000",
                            fontWeight: "bold",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          },
                          "& .MuiDataGrid-cell": {
                            borderColor: "#dee2e6",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            borderColor: "#dee2e6",
                          },
                          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            minWidth: `${containerWidth}px !important`,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #dee2e6",
          },
                        }}
                        components={{
                          ColumnMenu: () => null,
                          NoRowsOverlay: () => (
                            <div
                              style={{ padding: "2rem", textAlign: "center" }}
                            >
                              No events found.
                            </div>
                          ),
                        }}
                      />
                    </div>
                    
                    {/* Custom Pagination UI */}
                    <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                      <ul className="pagination justify-content-center d-flex">
                        {/* First Button */}
                        <li
                          className={`page-item ${
                            Number.isInteger(pagination?.current_page) &&
                            pagination.current_page === 1
                              ? "disabled"
                              : ""
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
                          className={`page-item ${
                            Number.isInteger(pagination?.current_page) &&
                            pagination.current_page === 1
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(
                                (Number.isInteger(pagination?.current_page)
                                  ? pagination.current_page
                                  : 1) - 1
                              )
                            }
                            disabled={
                              Number.isInteger(pagination?.current_page) &&
                              pagination.current_page === 1
                            }
                          >
                            Prev
                          </button>
                        </li>

                        {/* Dynamic Page Numbers */}
                        {pageNumbers.map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              Number.isInteger(pagination?.current_page) &&
                              pagination.current_page === pageNumber
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
                          className={`page-item ${
                            Number.isInteger(pagination?.current_page) &&
                            Number.isInteger(pagination?.total_pages) &&
                            pagination.current_page === pagination.total_pages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(
                                (Number.isInteger(pagination?.current_page)
                                  ? pagination.current_page
                                  : 1) + 1
                              )
                            }
                            disabled={
                              Number.isInteger(pagination?.current_page) &&
                              Number.isInteger(pagination?.total_pages) &&
                              pagination.current_page === pagination.total_pages
                            }
                          >
                            Next
                          </button>
                        </li>

                        {/* Last Button */}
                        <li
                          className={`page-item ${
                            Number.isInteger(pagination?.current_page) &&
                            Number.isInteger(pagination?.total_pages) &&
                            pagination.current_page === pagination.total_pages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(
                                Number.isInteger(pagination?.total_pages)
                                  ? pagination.total_pages
                                  : 1
                              )
                            }
                            disabled={
                              Number.isInteger(pagination?.current_page) &&
                              Number.isInteger(pagination?.total_pages) &&
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
                            ((Number.isInteger(pagination?.current_page)
                              ? pagination.current_page
                              : 1) -
                              1) *
                              pageSize +
                              1 || 1,
                            Number.isInteger(pagination?.total_count)
                              ? pagination.total_count
                              : 0
                          )}{" "}
                          to{" "}
                          {Math.min(
                            (Number.isInteger(pagination?.current_page)
                              ? pagination.current_page
                              : 1) * pageSize,
                            Number.isInteger(pagination?.total_count)
                              ? pagination.total_count
                              : 0
                          )}{" "}
                          of{" "}
                          {Number.isInteger(pagination?.total_count)
                            ? pagination.total_count
                            : 0}{" "}
                          entries
                        </p>
                      </div>
                    </div>
                    {/* Settings Modal for column visibility */}
                    <Modal
                      show={settingShow}
                      onHide={handleSettingClose}
                      dialogClassName="modal-right"
                      className="setting-modal"
                      backdrop={true}
                      size="sm"
                    >
                      <Modal.Header>
                        <div className="container-fluid p-0">
                          <div className="border-0 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn"
                                aria-label="Close"
                                onClick={handleSettingClose}
                              >
                                <svg
                                  width="10"
                                  height="16"
                                  viewBox="0 0 10 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 2L2 8L8 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                            <button
                              style={{
                                textDecoration: "underline",
                                border: "none",
                                background: "none",
                                color: "#8b0203",
                              }}
                              onClick={handleResetColumns}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </Modal.Header>
                      <Modal.Body
                        style={{ height: "400px", overflowY: "auto" }}
                      >
                        {allColumns.map((column) => (
                          <div
                            className="row justify-content-between align-items-center mt-2"
                            key={column.field}
                          >
                            <div className="col-md-6">
                              <label>{column.headerName}</label>
                            </div>
                            <div className="col-md-4">
                              <div className="form-check form-switch mt-1">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={columnVisibility[column.field]}
                                  onChange={() =>
                                    handleToggleColumn(column.field)
                                  }
                                  role="switch"
                                  id={`flexSwitchCheckDefault-${column.field}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </Modal.Body>
                      <Modal.Footer>
                        <button className="purple-btn1" onClick={handleShowAll}>
                          Show All
                        </button>
                        <button className="purple-btn2" onClick={handleHideAll}>
                          Hide All
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
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
                                  stroke=" #8b0203"
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
                      <div
                        className="modal-body"
                        style={{ overflowY: "scroll" }}
                      >
                        {/* <div className="form-group mb-4">
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
                                handleFilterChange(
                                  "title_in",
                                  option?.value || ""
                                )
                              }
                            />
                          </div>
                        </div> */}
                        <div className="form-group mb-4">
                          <div className="form-group">
                            <label htmlFor="mor-date-from">Product</label>
                            <Select
                              options={filterOptions.material_name}
                              placeholder="Select a Product"
                              isClearable
                              value={filterOptions.material_name.find(
                                (opt) =>
                                  opt.value ===
                                  filters.event_materials_inventory_id_in
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
                            <label htmlFor="mor-date-from">
                              Product Category
                            </label>
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
                                (opt) =>
                                  opt.value === filters.event_materials_id_in
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
