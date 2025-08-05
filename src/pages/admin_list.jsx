import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
DataTable.use(DT);
import { DataGrid } from "@mui/x-data-grid";
import ReactDOM from "react-dom";
import { Popper } from "@mui/material";
import { createPortal } from "react-dom";
import Tooltip from "../components/common/Tooltip/Tooltip";

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
import { baseURL } from "../confi/apiDomain";
import FormatDateTime from "../components/FormatDateTime";

export default function adminList() {
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

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
    event_no_cont: "",
    event_type_detail_event_type_eq: "",
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
  const [counts, setCounts] = useState("");
  const [isMyEvent, setIsMyEvent] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 10;
  const pageRange = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const InfoTooltip = ({ content, anchorEl }) => {
  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const style = {
    position: "fixed",
    top: rect.top + rect.height / 2,
    left: rect.right + 10,
    transform: "translateY(-50%)",
    background: "linear-gradient(to bottom, white, #f0f0f0)",
    border: "1px solid #f3f3f3",
    borderBottom: "4px solid #8b0203",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    padding: "10px",
    fontSize: "11px",
    zIndex: 9999,
    minWidth: "100px",
    maxWidth: "200px",
    color: "#000",
    whiteSpace: "pre-wrap",
  };

  return ReactDOM.createPortal(
    <div style={style}>
      {content}
    </div>,
    document.body
  );
};

  // 1. Column visibility state and helpers
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    event_title: true,
    event_no: true,
    bid_placed: true,
    start_time: true,
    end_time: true,
    created_at: true,
    created_by: true,
    event_type: true,
    status: true,
    action: true,
    edit: true,
  });

  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr.No.",
      width: 80,
      hide: !columnVisibility.srNo,
      sortable: true,
      // renderCell: (params, id) => {
      // return (
      //   <div display="flex" alignItems="center" gap={1}>
      //     {console.log('ID:', id, params)
      //     }
      //     <p variant="body2">
      //       {id + 1}
      //     </p>
      //   </div>
      // )
      // }
    },
    {
  field: "event_title",
  headerName: "Mor no",
  width: 180,
  sortable: true,
  renderCell: (params) => {
    console.log("Params:", params);
    
    const mors = params.row.event_title || [];
    const morNos =
      mors.length > 0
        ? mors.map((mor) => mor || "-").join(", ")
        : "No MOR Number";

    const [anchorEl, setAnchorEl] = useState(null);
    const iconRef = useRef();

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          position: "relative",
          marginTop: "15px",
        }}
        onMouseEnter={() => setAnchorEl(iconRef.current)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <svg
          ref={iconRef}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#8b0203"
          className="bi bi-info-circle"
          viewBox="0 0 16 16"
          style={{ cursor: "pointer" }}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
        </svg>

        <InfoTooltip content={morNos} anchorEl={anchorEl} />
      </div>
    );
  },
},
    { field: "event_no", headerName: "Event No", width: 120, sortable: true },
    {
      field: "bid_placed",
      headerName: "Bid Placed",
      width: 110,
      sortable: true,
      renderCell: (params) =>
  params.value ? (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>  
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ verticalAlign: "middle" }}
      >
        <circle cx="10" cy="10" r="9" stroke="#28a745" strokeWidth="2" fill="none" />
        <path d="M6 10.5l3 3 5-5" stroke="#28a745" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>  
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ verticalAlign: "middle" }}
      >
        <circle cx="10" cy="10" r="9" stroke="#dc3545" strokeWidth="2" fill="none" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="#dc3545" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  ),
    },
    {
      field: "start_time",
      headerName: "Start Date",
      width: 160,
      sortable: true,
      renderCell: (params) => (
        
        params.row.event_schedule?.start_time ? (
          <FormatDateTime timestamp={params.row.event_schedule.start_time} />
        ) : (
          "-"
        ))
    },
    {
      field: "end_time",
      headerName: "End Date",
      width: 160,
      sortable: true,
      renderCell: (params) =>
        params.row.event_schedule?.end_time ? (
          <FormatDateTime timestamp={params.row.event_schedule.end_time} />
        ) : (
          "-"
        ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 140,
      sortable: true,
      renderCell: (params) =>
        params.row.created_at ? (
          <FormatDate timestamp={params.row.created_at} />
        ) : (
          "-"
        ),
    },
    {
      field: "created_by",
      headerName: "Created By",
      width: 120,
      sortable: true,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "event_type",
      headerName: "Event Type",
      width: 120,
      sortable: true,
      renderCell: (params) =>
        params.row.event_type_with_configuration
          ? params.row.event_type_with_configuration
          : "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      sortable: true,
      renderCell: (params) =>
        params.row.status
          ? params.row.status.charAt(0).toUpperCase() +
            params.row.status.slice(1)
          : "-",
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          className="btn"
          onClick={() =>
            navigate(`/erp-rfq-detail-price-trends4h/${params.row.id}?token=${token}`)
          }
          title="View"
        >
          {/* ...existing SVG... */}
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
        </button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          className="btn"
          onClick={() => navigate(`/edit-event/${params.row.id}?token=${token}`)}
          title="Edit"
        >
          {/* ...existing SVG... */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
            />
          </svg>
        </button>
      ),
    },
  ];

  // Filter columns based on visibility
  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  // Column settings modal handlers
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


//   const fixedColumns = allColumns.filter(col => !col.hide && col.field).map(col => ({
//   ...col,
//   width: col.width || 200,  // Set default width if missing
// }));

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
    const colCount = visibleCols.length || 1;
    const equalWidth = containerWidth / colCount;

    return visibleCols.map((col) => ({
      ...col,
      width: equalWidth,
      flex: undefined, // disable flex to prevent it from overriding width
    }));
  }, [columns, containerWidth]);

  // Keep only one getFilteredData function
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

  console.log("Events to Display:", eventsToDisplay);

  const dataGridRows = eventsToDisplay.map((event, index) => ({
    id: event.id,
    srNo:
      ((Number.isInteger(pagination?.current_page) && pagination.current_page > 0
        ? pagination.current_page - 1
        : 0) * pageSize) + index + 1,
    event_no: event.event_no,
    bid_placed: event.bid_placed,
    event_schedule: event.event_schedule,
    created_at: event.created_at,
    created_by: event.created_by,
    event_type_detail: event.event_type_detail,
    event_title: event?.mors,
    status: event.status,
    event_type_with_configuration: event.event_type_with_configuration,
    // Add any other fields you need for columns
  }));

  // Add a recursive function to check if any value in the object matches the search term
function objectContainsValue(obj, searchTerm) {
  if (obj == null) return false;
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return String(obj).toLowerCase().includes(searchTerm);
  }
  if (Array.isArray(obj)) {
    return obj.some((el) => objectContainsValue(el, searchTerm));
  }
  if (typeof obj === "object") {
    return Object.values(obj).some((val) => objectContainsValue(val, searchTerm));
  }
  return false;
}

const getTransformedRows = () => {
  let rowsToShow = dataGridRows;

  const normalizedSearchTerm = searchQuery.trim().toLowerCase();
  if (!normalizedSearchTerm) return rowsToShow;

  // Helper to format date/time as shown in the table (e.g., "May 21, 2025 at 3:15 p.m.")
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date
        .toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "")
        .replace("AM", "a.m.")
        .replace("PM", "p.m.")
        .toLowerCase();
    } catch {
      return "";
    }
  };

  // Helper to get all possible date string representations for a date
  const getAllDateRepresentations = (dateStr) => {
    if (!dateStr) return [];
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const shortMonth = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
      const longMonth = date.toLocaleString("en-US", { month: "long" }).toLowerCase();

      return [
        formatDateTime(dateStr), // as shown in table
        `${day}/${month}/${year}`,
        `${year}-${month}-${day}`,
        `${month}/${day}/${year}`,
        `${day}/${month}`,
        `${month}/${year}`,
        `${day}`,
        `${shortMonth} ${day}, ${year}`,
        `${longMonth} ${day}, ${year}`,
        `${shortMonth} ${day}`,
        `${longMonth} ${day}`,
        `${year}`,
      ].map((s) => s.toLowerCase());
    } catch {
      return [];
    }
  };

  // Helper to get all formatted values for a row as shown in the table
  const getFormattedValues = (row) => {
    let formatted = [];
    if (row.created_at) formatted.push(...getAllDateRepresentations(row.created_at));
    if (row.event_schedule?.start_time) formatted.push(...getAllDateRepresentations(row.event_schedule.start_time));
    if (row.event_schedule?.end_time) formatted.push(...getAllDateRepresentations(row.event_schedule.end_time));
    return formatted.flatMap(val => val.split(/[\s,]+/));
  };

  // Enhanced search: check both raw, formatted, and all date representations
  rowsToShow = rowsToShow.filter((item) => {
    // Check raw values (deep search)
    if (objectContainsValue(item, normalizedSearchTerm)) return true;

    // Check all formatted date values and their representations
    const formattedValues = getFormattedValues(item);
    if (formattedValues.some((val) => val.includes(normalizedSearchTerm))) return true;

    return false;
  });

  return rowsToShow;
};

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
      event_no_cont: "",
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

    setSearchQuery(""); // Clear the search input
    setSuggestions([]); // Clear suggestions
    setIsSuggestionsVisible(false); // Hide suggestions dropdown
    setIsMyEvent(false);
  };

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
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
        `${baseURL}rfq/events/advance_filter_options?token=${token}`,
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
    setLoading(true); // Set loading to true at the start
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
        ...(filters.event_type_detail_event_type_eq && {
          "q[event_type_detail_event_type_eq]":
            filters.event_type_detail_event_type_eq,
        }),
      };

      let eventsUrl;

      switch (activeTab) {
        case "live":
          eventsUrl = `${baseURL}rfq/events/live_events`;
          break;
        case "history":
          eventsUrl = `${baseURL}rfq/events/past_events`;
          break;
        case "all":
          eventsUrl = `${baseURL}rfq/events`;
          break;
        default:
          eventsUrl = `${baseURL}rfq/events`;
      }

      const response = await axios.get(eventsUrl, {
        params: {
          token: token,
          page: page,
          ...queryFilters,
        },
      });

      // Update state based on activeTab
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
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(error.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false); // Set loading to false only after all API calls are complete
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts or activeTab changes
  }, [activeTab]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchEvents(newPage);
    }
  };

  // const getFilteredData = () => {
  //   switch (activeTab) {
  //     case "live":
  //       return { events: liveEvents.events, pagination: liveEvents.pagination };
  //     case "history":
  //       return {
  //         events: historyEvents.events,
  //         pagination: historyEvents.pagination,
  //       };
  //     case "all":
  //       return {
  //         events: allEventsData.events,
  //         pagination: allEventsData.pagination,
  //       };
  //     default:
  //       return { events: [], pagination: {} };
  //   }
  // };

  // const { events: eventsToDisplay, pagination } = getFilteredData(); // Destructure to get events and pagination

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

  const handleFilterChange = (key, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: name,
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

    setSuggestionLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${baseURL}rfq/events?token=${token}&q[event_title_or_event_no_or_status_or_created_at_or_event_schedule_start_time_or_event_schedule_end_time_cont]=${searchQuery}`
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
      setSuggestionLoading(false);
    }
  };

  // Debounced fetchSuggestions
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      debouncedFetchSuggestions(query); // Use debounced function
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
    // No need to call fetchSuggestions here, filtering is handled by getTransformedRows
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

  // const vendorDetails = async () => {
  //   try {
  //     const urlParams = new URLSearchParams(location.search);
  //     const token = urlParams.get("token");
  //     const response = await axios.get(
  //       `${baseURL}rfq/events/event_vendors_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078411&page=1`
  //     );

  //     const vendorData = response.data.list;

  //     const options = Array.from(
  //       new Map(vendorData.map((item) => [item[0], item])).values()
  //     ).map((item) => ({
  //       value: item[1],
  //       label: item[0],
  //     }));

  //     setVendorOptions(options);
  //   } catch (error) {
  //     console.error("Error fetching vendor details:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   vendorDetails();
  // }, []);

  const handleSelectChange = (selectedOption) => {
    const vendorValue = selectedOption ? selectedOption.value : "";
    setVendorId(vendorValue);
    sessionStorage.setItem("selectedId", vendorValue); // Store the new selection in session storage
  };

  const eventProjectColumns = [
    { label: "Sr.No.", key: "srNo" },
    // { label: "Event Title", key: "event_title" },
    { label: "Event No", key: "event_no" },
    // { label: "MOR No", key: "mor_no" },
    { label: "Bid Placed", key: "bid_placed" },
    { label: "Start Time", key: "start_time" },
    { label: "End Time", key: "end_time" },
    { label: "Created At", key: "created_at" },
    { label: "Created By", key: "created_by" },
    { label: "Event Type", key: "event_type" },
    { label: "Event Configuration", key: "event_configuration" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
    { label: "Edit", key: "edit" },
  ];

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
                    Admin List
                  </li>
                </ol>
              </nav>
              <h5 className="mt-3 ms-3">RFQ &amp; Auction Events</h5>
              <div style={{ width: "15%" }}></div>
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
                            activeTab === "all" ? "#8b0203" : "#fff",
                          color: activeTab === "all" ? "white" : "black", // Adjust text color for better contrast
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
                            activeTab === "live" ? "#8b0203" : "#fff",
                          color: activeTab === "live" ? "white" : "black", // Adjust text color for better contrast
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
                              ? "2px solid #007bff"
                              : "1px solid #ccc",
                          backgroundColor:
                            activeTab === "history" ? "#8b0203" : "#fff",
                          color: activeTab === "history" ? "white" : "black",
                        }}
                      >
                        <h4 className="content-box-title">History Events</h4>
                        <p className="content-box-sub">
                          {counts?.history_events || 0}
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
                          {/* <div className="col-md-2">
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
                              placeholder="Select title"
                              isClearable
                              menuPlacement="auto"
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div> */}

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

                          <div className="col-md-2">
                            <label htmlFor="event-type-select">
                              Event Type
                            </label>
                            <Select
                              id="event-type-select"
                              options={[
                                { value: "rfq", label: "RFQ" },
                                { value: "auction", label: "Auction" },
                                { value: "contract", label: "Contract" },
                              ]}
                              onChange={(option) =>
                                handleFilterChange(
                                  "event_type_detail_event_type_eq",
                                  option?.value || ""
                                )
                              }
                              value={
                                filters.event_type_detail_event_type_eq
                                  ? {
                                      value:
                                        filters.event_type_detail_event_type_eq,
                                      label:
                                        filters.event_type_detail_event_type_eq,
                                    }
                                  : null
                              }
                              placeholder="Select Type"
                              isClearable
                              menuPlacement="auto"
                              menuPortalTarget={document.body}
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
                              onBlur={() =>
                                setTimeout(
                                  () => setIsSuggestionsVisible(false),
                                  200
                                )
                              }
                            />

                            <div className="input-group-append">
                              <button
                                type="submit" // fixed typo here
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
                        <div className="row justify-content-end align-items-center">
                          <div className="col-md-5">
                            <div className="row justify-content-end align-items-center px-3">
                              <div className="col-md-2">
                                <button
                                  style={{ color: "#8b0203" }}
                                  className="btn btn-md"
                                  onClick={handleModalShow}
                                >
                                  <FilterIcon />
                                </button>
                              </div>
                              {/* Add settings button here */}
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
                              {/* <div className="col-md-3">
                                  <button
                                    style={{ color: "#8b0203" }}
                                    type="submit"
                                    className="btn btn-md"
                                  >
                                    <StarIcon />
                                  </button>
                                </div> */}
                              {/* <div className="col-md-3">
                                  <button
                                    style={{ color: "#8b0203" }}
                                    id="downloadButton"
                                    type="submit"
                                    className="btn btn-md"
                                  >
                                    <DownloadIcon />
                                  </button>
                                </div> */}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <button
                              className="purple-btn2"
                              onClick={() => navigate("/create-event")}
                            >
                              <span className="material-symbols-outlined align-text-top">
                                add
                              </span>
                              New Event
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px", display: "flex", flexDirection: "column", padding:'20px' }}
    >
      {/* Only show DataGrid when not loading */}
      {dataGridRows.length > 0 ? (
        <DataGrid
          rows={getTransformedRows()}
          columns={fixedColumns.map(col => ({ ...col, flex: 1, minWidth: 80, width: undefined, maxWidth: undefined }))}
          pageSize={pageSize}
          rowCount={Number.isInteger(pagination?.total_count) ? pagination.total_count : 0}
          paginationMode="server"
          page={Number.isInteger(pagination?.current_page) && pagination.current_page > 0 ? pagination.current_page - 1 : 0}
          onPageChange={(page) => handlePageChange(page + 1)}
          loading={loading}
          columnBuffer={0}
          getRowId={(row) => row.id}
          autoHeight
          disableColumnMenu
          sx={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            minHeight: 0,
            maxHeight: 'none',
            padding: 0,
            margin: 0,
            border: 'none',
            boxShadow: 'none',
            overflowX: 'hidden',
            "& .MuiDataGrid-main": {
              minHeight: 0,
              maxHeight: 'none',
              overflowX: 'hidden',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              color: "#000",
              fontWeight: "bold",
              position: "static",
              top: "unset",
              zIndex: 1,
            },
            "& .MuiDataGrid-cell": {
              borderColor: "#dee2e6",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            "& .MuiDataGrid-columnHeader": {
              borderColor: "#dee2e6",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: 'hidden',
              minHeight: 0,
              maxHeight: 'none',
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #dee2e6",
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                No events found.
              </div>
            ),
          }}
        />
      ) : (
        <div className="text-center mt-5">
          <p>No events found for the selected filters.</p>
        </div>
      )}
    </div>
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
                  </div>
                </div>
              )}

              {/* <LayoutModal show={settingShow} onHide={handleSettingClose} /> */}

              <React.Suspense fallback={<div>Loading...</div>}>
                <Modal
                  show={show}
                  onHide={handleClose}
                  dialogClassName="modal-right"
                  className="setting-modal"
                  backdrop={true}
                  style={{ height: "100vh", overflowY: "scroll" }}
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
                                stroke="#8b0203"
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
                  <form onSubmit={handleSubmit} key={JSON.stringify(filters)}>
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
                              handleFilterChange(
                                "title_in",
                                option?.value || ""
                              )
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
              </React.Suspense>

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
                      <Button
                        style={{ textDecoration: "underline" }}
                        variant="alert"
                        onClick={handleResetColumns}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Modal.Header>
                <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
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
                            onChange={() => handleToggleColumn(column.field)}
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
          </div>
        </div>
      </div>
    </>
  );
}
