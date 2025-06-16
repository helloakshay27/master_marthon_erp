import React from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useEffect } from "react";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { SettingIcon } from "../components";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, Pagination, Typography } from "@mui/material";

const PoAdvanceNoteList = () => {

   const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [selectedValue, setSelectedValue] = useState(""); // Holds the selected value
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("total"); // Add this line to track selected tab
  const [selectedIds, setSelectedIds] = useState([]);
  const [settingShow, setSettingShow] = useState(false);

  // Static data for SingleSelector (this will be replaced by API data later)

  // Handle value change in SingleSelector
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const [bulkActionDetails, setbulkActionDetails] = useState(true);
  const [filterModal, setfilterModal] = useState(false);
  const [layoutModal, setlayoutModal] = useState(false);
  // Bootstrap collaps
  const bulkActionDropdown = () => {
    setbulkActionDetails(!bulkActionDetails);
  };
  //   Modal

  // const openFilterModal = () => setfilterModal(true);
  // const closeFilterModal = () => setfilterModal(false);

  const openLayoutModal = () => setlayoutModal(true);
  const closeLayoutModal = () => setlayoutModal(false);

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  // const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  // const [wingsOptions, setWingsOptions] = useState([]);

  // Fetch company data on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/company_setups.json?token=${token}`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }))
      );
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

    if (selectedOption) {
      // Find the selected project from the list of projects of the selected company
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      // Set site options based on selected project
      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Map companies to options for the dropdown
  // const companyOptions = companies.map((company) => ({
  //   value: company.id,
  //   label: company.company_name,
  // }));

  const [counts, setCounts] = useState({
    total_count: 0,
    draft_count: 0,
    approved_count: 0,
    submited_count: 0,
    proceed_count: 0,
  });
  const [originalCounts, setOriginalCounts] = useState({
    total_count: 0,
    draft_count: 0,
    approved_count: 0,
    submited_count: 0,
    proceed_count: 0,
  });

  const [searchInput, setSearchInput] = useState("");

  // Fetch advance notes data with filters
  const fetchTableData = async (filters = {}) => {
    setLoading(true);
    try {
      let url = `${baseURL}advance_notes?token=${token}`;

      // Add filters to URL if they exist
      if (filters.companyId) {
        url += `&q[company_id_eq]=${filters.companyId}`;
      }
      if (filters.projectId) {
        url += `&q[project_id_eq]=${filters.projectId}`;
      }
      if (filters.siteId) {
        url += `&q[site_id_eq]=${filters.siteId}`;
      }

      if (filters.status) {
        url += `&q[status_eq]=${filters.status}`;
      }

      if (filters.search && filters.search.trim() !== "") {
        url += `&q[company_id_or_project_id_or_purchase_order_id_or_advance_number_or_certificate_number_or_invoice_date_or_advance_percentage_or_advance_amount_or_net_payable_or_payment_
mode_or_payee_name_or_expected_payment_date_or_status_in]=${encodeURIComponent(
          filters.search.trim()
        )}`;
      }

      const response = await axios.get(url);
      const data = Array.isArray(response.data.advance_notes)
        ? response.data.advance_notes
        : [];

      const transformedData = data.map((entry, index) => {
        // Format created_at date
        let formattedCreatedAt = "-";
        if (entry.created_at) {
          try {
            formattedCreatedAt = new Date(entry.created_at)
              .toISOString()
              .slice(0, 10);
          } catch (e) {
            formattedCreatedAt = "-";
          }
        }

        // Format expected_payment_date
        let formattedExpectedPaymentDate = "-";
        if (entry.expected_payment_date) {
          try {
            formattedExpectedPaymentDate = new Date(entry.expected_payment_date)
              .toISOString()
              .slice(0, 10);
          } catch (e) {
            formattedExpectedPaymentDate = "-";
          }
        }

        return {
          id: entry.id,
          srNo: (currentPage - 1) * itemsPerPage + index + 1,
          ...entry,
          created_at: formattedCreatedAt,
          expected_payment_date: formattedExpectedPaymentDate,
        };
      });
      setCreditNotes(transformedData);

      // If no status filter is applied, update both counts and original counts
      if (!filters.status) {
        setOriginalCounts({
          total_count: response.data.meta?.total_count || 0,
          draft_count: response.data.meta?.draft_count || 0,
          approved_count: response.data.meta?.approved_count || 0,
          submited_count: response.data.meta?.submited_count || 0,
          proceed_count: response.data.meta?.proceed_count || 0,
        });
        setCounts({
          total_count: response.data.meta?.total_count || 0,
          draft_count: response.data.meta?.draft_count || 0,
          approved_count: response.data.meta?.approved_count || 0,
          submited_count: response.data.meta?.submited_count || 0,
          proceed_count: response.data.meta?.proceed_count || 0,
        });
      } else {
        // If status filter is applied, only update the filtered count
        const newCounts = { ...originalCounts };
        switch (filters.status) {
          case "draft":
            newCounts.draft_count = response.data.meta?.draft_count || 0;
            break;
          case "submited":
            newCounts.submited_count = response.data.meta?.submited_count || 0;
            break;
          case "approved":
            newCounts.approved_count = response.data.meta?.approved_count || 0;
            break;
          case "proceed":
            newCounts.proceed_count = response.data.meta?.proceed_count || 0;
            break;
        }
        setCounts(newCounts);
      }

      setTotalEntries(response.data.meta?.total_count || data.length);
      setTotalPages(
        response.data.meta?.total_pages || Math.ceil(data.length / itemsPerPage)
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setCreditNotes([]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
  const handleContentBoxClick = (status) => {
    setSelectedTab(status || "total"); // Update selected tab
    fetchTableData({ status });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTableData({
      companyId: selectedCompany?.value,
      projectId: selectedProject?.value,
      siteId: selectedSite?.value,
      status: selectedTab !== "total" ? selectedTab : undefined,
      search: searchInput,
    });
  };

  // Map companies to options for the dropdown
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calculate paginated data - add safety check
  const paginatedData = Array.isArray(creditNotes)
    ? creditNotes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const options = [
    {
      label: "Select Status",
      value: "",
    },
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Verified",
      value: "verified",
    },
    {
      label: "Submited",
      value: "submited",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
    {
      label: "Approved",
      value: "approved",
    },
  ];

  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  // const [boqList, setBoqList] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleStatusChange = (selectedOption) => {
    // const { name, value } = e.target;
    // if (name === "fromStatus") {
    //   setFromStatus(selectedOption.value);
    // } else if (name === "toStatus") {
    //   setToStatus(selectedOption.value);
    // }

    setFromStatus(selectedOption.value);
    fetchTableData({ status: selectedOption.value });
  };

  // Handle status change for 'To Status'
  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  // Handle checkbox selection
  // const handleCheckboxChange = (id) => {
  //   setSelectedIds((prev) => {
  //     if (prev.includes(id)) {
  //       return prev.filter((item) => item !== id);
  //     } else {
  //       return [...prev, id];
  //     }
  //   });
  // };
  const [selectAll, setSelectAll] = useState(false); // State to track "select all" checkbox
  // const [selectedIds, setSelectedIds] = useState([]); // State to track selected rows

  // Handle "select all" checkbox change
  const handleSelectAllChange = () => {
    if (selectAll) {
      // If already selected, deselect all
      setSelectedIds([]);
    } else {
      // Select all rows
      const allIds = creditNotes.map((note) => note.id);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll); // Toggle "select all" state
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Deselect the row
      } else {
        return [...prev, id]; // Select the row
      }
    });
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (e) => {
    e.preventDefault();
    console.log("Current selectedIds:", selectedIds); // Debug log

    if (selectedIds.length === 0) {
      alert("Please select at least one advance note");
      return;
    }

    if (!toStatus) {
      alert("Please select a target status");
      return;
    }
    const data = {
      advance_note_ids: selectedIds,
      to_status: toStatus,
      comments: remark,
    };
    console.log("data for bulk action", data);

    try {
      const response = await axios.patch(
        `${baseURL}advance_notes/update_bulk_status?token=${token}`,
        data
      );

      console.log("Success:", response.data);
      alert("Status updated successfully ....");

      // Refresh data and reset form
      await fetchTableData();
      setSelectedIds([]);
      setToStatus("");
      setFromStatus("");
      setRemark("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating status. Please try again.");
    }
  };

  // try {
  //   const response = await axios.patch(
  //     `${baseURL}advance_notes/update_bulk_status?token=2e86c08136922760d29d4fee6b8ccfccd5f4547d2868ed31`,
  //     {
  //       advance_note_ids: selectedIds,
  //       to_status: toStatus,
  //       comments: remark,
  //     }
  //   );

  //   console.log("API Response:", response.data); // Debugging: Log the response

  //   // Check for success based on the presence of a success field or other indicators
  //   if (response.data.success || response.status === 200) {
  //     // Refresh the table data
  //     fetchTableData();
  //     // Reset form
  //     setSelectedIds([]);
  //     setToStatus("");
  //     setFromStatus("");
  //     setRemark("");
  //     alert(response.data.message || "Bulk status update successful"); // Use default message if undefined
  //   } else {
  //     alert(response.data.message || "Failed to update status"); // Use default error message if undefined
  //   }
  // } catch (error) {
  //   console.error("Error updating bulk status:", error);
  //   alert("Error updating status. Please try again.");
  // }

  // Add column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    company_name: true,
    project_name: true,
    advance_number: true,
    invoice_date: true,
    payment_mode: true,
    created_at: true,
    po_number: true,
    po_date: true,
    po_value: true,
    supplier_name: true,
    gstin: true,
    pan_no: true,
    advance_amount: true,
    net_payable: true,
    status: true,
    expected_payment_date: true,
    overdue: true,
    due_at: true,
  });

  // Define all columns
  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 100,
    },
    {
      field: "company_name",
      headerName: "Company",
      width: 200,
    },
    {
      field: "project_name",
      headerName: "Project",
      width: 150,
    },
    {
      field: "advance_number",
      headerName: "Debit Note No.",
      width: 150,
      renderCell: (params) => (
        <Link
          to={`/po-advance-note-details/${params.row.id}?token=${token}`}
          // style={{ color: "#8b0203" }}
        >
          <span className="boq-id-link">{params.value}</span>
        </Link>
      ),
    },
    {
      field: "invoice_date",
      headerName: "Date",
      width: 150,
      // valueFormatter: (params) => {
      //   if (!params?.value) return "-";
      //   try {
      //     return new Date(params.value).toLocaleDateString();
      //   } catch (error) {
      //     return "-";
      //   }
      // },
    },
    {
      field: "payment_mode",
      headerName: "Credit Note Type",
      width: 150,
    },
    {
      field: "created_at",
      headerName: "Created On",
      width: 150,
      // valueFormatter: (params) => {
      //   if (!params?.value) return "-";
      //   try {
      //     return new Date(params.value).toLocaleDateString();
      //   } catch (error) {
      //     return "-";
      //   }
      // },
    },
    {
      field: "po_number",
      headerName: "PO No.",
      width: 150,
    },
    {
      field: "po_date",
      headerName: "PO Date",
      width: 150,
      // valueFormatter: (params) => {
      //   if (!params?.value) return "-";
      //   try {
      //     return new Date(params.value).toLocaleDateString();
      //   } catch (error) {
      //     return "-";
      //   }
      // },
    },
    {
      field: "po_value",
      headerName: "PO Value",
      width: 150,
    },
    {
      field: "supplier_name",
      headerName: "Supplier Name",
      width: 150,
    },
    {
      field: "gstin",
      headerName: "GSTIN No.",
      width: 150,
    },
    {
      field: "pan_no",
      headerName: "PAN No.",
      width: 150,
    },
    {
      field: "advance_amount",
      headerName: "Debit Note Amount",
      width: 150,
    },
    {
      field: "net_payable",
      headerName: "Total Amount",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "expected_payment_date",
      headerName: "Due Date",
      width: 150,
      // valueFormatter: (params) => {
      //   if (!params?.value) return "-";
      //   try {
      //     return new Date(params.value).toLocaleDateString();
      //   } catch (error) {
      //     return "-";
      //   }
      // },
    },
    {
      field: "overdue",
      headerName: "Overdue",
      width: 150,
    },
    {
      field: "due_at",
      headerName: "Due At",
      width: 150,
    },
  ];

  // Filter columns based on visibility
  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  // Column visibility handlers
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

  // Transform data for DataGrid
  const getTransformedRows = () => {
    return creditNotes.map((note, index) => ({
      id: note.id,
      srNo: index + 1 + (currentPage - 1) * itemsPerPage,
      ...note,
    }));
  };

  // Add setting modal handlers
  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Billing &amp; Accounts &gt; PO Advance</a>
          <h5 className="mt-4 fw-bold">PO Advance</h5>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto5 justify-content-start">
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      selectedTab === "total" ? "active" : ""
                    }`}
                    onClick={() => handleContentBoxClick("")} // Fetch all
                  >
                    <h4 className="content-box-title fw-semibold">Total</h4>
                    <p className="content-box-sub">{counts.total_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      selectedTab === "draft" ? "active" : ""
                    }`}
                    onClick={() => handleContentBoxClick("draft")} // Fetch drafts
                    data-tab="draft"
                  >
                    <h4 className="content-box-title fw-semibold">Draft</h4>
                    <p className="content-box-sub">{counts.draft_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      selectedTab === "submited" ? "active" : ""
                    }`}
                    onClick={() => handleContentBoxClick("submited")} // Fetch submitted
                  >
                    <h4 className="content-box-title fw-semibold">Submitted</h4>
                    <p className="content-box-sub">{counts.submited_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      selectedTab === "approved" ? "active" : ""
                    }`}
                    onClick={() => handleContentBoxClick("approved")} // Fetch approved
                  >
                    <h4 className="content-box-title fw-semibold">Approved</h4>
                    <p className="content-box-sub">{counts.approved_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      selectedTab === "proceed" ? "active" : ""
                    }`}
                    onClick={() => handleContentBoxClick("proceed")} // Fetch proceed
                  >
                    <h4 className="content-box-title fw-semibold">Processed</h4>
                    <p className="content-box-sub">{counts.proceed_count}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content1 active" id="total-content">
            {/* Total Content Here */}
            <div className="card mt-3 pb-4">
              <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Company</label>

                      <SingleSelector
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder={`Select Company`}
                      />
                      {/* {validationErrors.company && (
                        <span className="text-danger">{validationErrors.company}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Project</label>

                      <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`}
                      />
                      {/* {validationErrors.project && (
                        <span className="text-danger">{validationErrors.project}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      {/* Pass static data as options */}
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                      {/* {validationErrors.site && (
                        <span className="text-danger">{validationErrors.site}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button
                      className="purple-btn2"
                      onClick={() =>
                        fetchTableData({
                          companyId: selectedCompany?.value,
                          projectId: selectedProject?.value,
                          siteId: selectedSite?.value,
                        })
                      }
                    >
                      Go
                    </button>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button
                      className="purple-btn2"
                      onClick={() => {
                        setSelectedCompany(null);
                        setSelectedProject(null);
                        setSelectedSite(null);
                        fetchTableData();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </CollapsibleCard>
              <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
                <form onSubmit={handleBulkStatusUpdate}>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        {/* <select
                                      name="fromStatus"
                                      className="form-control form-select"
                                       classNamePrefix="react-select"
                                      value={fromStatus}
                                      onChange={handleStatusChange}
                                    // value={formValues.fromStatus}
                                    // onChange={handleChange}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="draft">Draft</option>
                                      <option value="submitted">Submitted</option>
                                      <option value="approved">Approved</option>
                                    </select> */}
                        {/* {errors.fromStatus && <div className="text-danger mt-2">{errors.fromStatus}</div>} */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          value={options.find(
                            (option) => option.value === fromStatus
                          )}
                          onChange={handleStatusChange}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                        {/* {console.log("options:", options.value)} */}
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        {/* <select
                                      name="toStatus"
                                      className="form-control form-select"
                                      value={toStatus}
                                      onChange={handleToStatusChange}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="draft">Draft</option>
                                      <option value="submitted">Submitted</option>
                                      <option value="approved">Approved</option>
                                    </select> */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          onChange={handleToStatusChange}
                          value={options.find(
                            (option) => option.value === toStatus
                          )}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          name="remark"
                          className="form-control"
                          rows={4}
                          placeholder="Enter ..."
                          value={remark}
                          onChange={handleRemarkChange}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button type="submit" className="purple-btn2 m-0">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </CollapsibleCard>

              <div className="row mt-2">
                <div className="col-md-5 ms-3">
                  <div className="input-group">
                    <input
                      type="search"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        type="submit"
                        className="btn btn-md btn-default"
                        onClick={handleSearchSubmit}
                      >
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                            fill="#8B0203"
                          />
                          <path
                            d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                            fill="#8B0203"
                          />
                        </svg>
                      </button>
                    </div>
                    {searchInput && (
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-md btn-default"
                          onClick={() => {
                            setSearchInput("");
                            fetchTableData(); // Reload data without search filter
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L1 13M1 1L13 13"
                              stroke="#8B0203"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-5 d-flex justify-content-end align-items-center gap-5 mt-1">
                  <button
                    type="button"
                    className="btn btn-md"
                    onClick={handleSettingModalShow}
                  >
                    <SettingIcon />
                  </button>
                </div>
              </div>
              {/* <div className="row mt-5 justify-content-center px-4">
                <div className="col-md-8 card mx-3">
                  <div className="card-header2">
                    <h3 className="card-title2">
                      <div className="form-group form-control">
                        Applied Fliter
                      </div>
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                          <label className="px-3">Company</label>
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                          <label className="px-3">Project</label>
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                          <p className="px-3">Sub-project</p>
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <button
                          className="purple-btn2 m-0"
                          style={{ color: "white" }}
                          onClick={() => (window.location.href = "#")}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="d-flex justify-content-end me-3">
                <button
                  className="purple-btn2 m-0 p-1 px-3"
                  // onClick={openFilterModal}
                >
                  <div style={{ color: "white" }}>
                    <span className="material-symbols-outlined align-text-top me-2">
                      add{" "}
                    </span>
                    Adds
                  </div>
                </button>
              </div> */}
              <div
                className="mx-3 mt-3"
                // style={{ width: "98%" }}
                style={{
                  //   width: "100%",
                  //   height: "430px",
                  //   boxShadow: "unset",
                  overflowY: "hidden",
                }}
              >
                {/* <DataGrid
                  rows={getTransformedRows()}
                  columns={columns}
                  pageSize={itemsPerPage}
                  autoHeight
                  getRowId={(row) => row.id}
                  loading={loading}
                  checkboxSelection
                  selectionModel={selectedIds}
                  // onSelectionModelChange={(ids) => {
                  //   setSelectedIds(ids);
                  //   console.log("Selected Row IDs:", ids);
                  // }}
                   onSelectionModelChange={(newSelectionModel) => {
    const selectedIdsArray = Array.from(newSelectionModel);
    console.log("Selected IDs:", selectedIdsArray);
    setSelectedIds(selectedIdsArray);
  }}
  disableSelectionOnClick={false}
                  components={{
                    ColumnMenu: () => null,
                  }}
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
                    // Red color for checked checkboxes
                    "& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
                      color: "#8b0203",
                    },
                    // Black for header (select all) checkbox, even when checked
                    "& .MuiDataGrid-columnHeader .MuiCheckbox-root .MuiSvgIcon-root":
                      {
                        color: "#fff",
                      },
                    // Make checkboxes smaller
                    "& .MuiCheckbox-root .MuiSvgIcon-root": {
                      fontSize: "1.1rem",
                    },
                  }}
                /> */}
                <DataGrid
                  rows={getTransformedRows()}
                  columns={columns}
                  pageSize={itemsPerPage}
                  autoHeight={false}
                  getRowId={(row) => {
                    return row.id;
                  }}
                  loading={loading}
                  disableSelectionOnClick
                  checkboxSelection
                  selectionModel={selectedIds}
                  onSelectionModelChange={(ids) => {
                    setSelectedIds(ids.map(String));
                    console.log("Selected Row IDs:", ids);
                  }}
                  onRowSelectionModelChange={(ids) => {
                    setSelectedIds(ids);
                    console.log("Selected Row IDs: 2", ids);
                  }}
                  components={{
                    ColumnMenu: () => null,
                  }}
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
                    "& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
                      color: "#8b0203",
                    },
                    "& .MuiDataGrid-columnHeader .MuiCheckbox-root .MuiSvgIcon-root":
                      {
                        color: "#fff",
                      },
                    "& .MuiCheckbox-root .MuiSvgIcon-root": {
                      fontSize: "1.1rem",
                    },
                  }}
                />
              </div>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={2}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => handlePageChange(value)}
                  siblingCount={1}
                  boundaryCount={1}
                  color="primary"
                  showFirstButton
                  showLastButton
                  disabled={totalPages <= 1}
                />

                <Typography variant="body2">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}
                  {totalEntries} entries
                </Typography>
              </Stack>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        show={settingShow}
        onHide={handleSettingClose}
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
                  onClick={handleSettingClose}
                >
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 16"
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
          {allColumns
            .filter((column) => column.field !== "srNo")
            .map((column) => (
              <div
                className="row justify-content-between align-items-center mt-2"
                key={column.field}
              >
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </button>
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
          <button className="purple-btn2" onClick={handleShowAll}>
            Show All
          </button>
          <button className="purple-btn1" onClick={handleHideAll}>
            Hide All
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PoAdvanceNoteList;
