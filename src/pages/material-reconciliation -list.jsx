import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SettingIcon,
  StarIcon,
} from "../components";
import { useNavigate } from "react-router-dom";
import MaterialReconciliationCreate from "./material-reconciliation -create";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination, Stack, Typography } from "@mui/material";

const MaterialReconciliationList = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [selectedValue, setSelectedValue] = useState(""); // Holds the selected value
  const navigate = useNavigate(); // Initialize navigation
  const [bulkActionDetails, setbulkActionDetails] = useState(true);
  const [filterModal, setfilterModal] = useState(false);
  const [layoutModal, setlayoutModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [reconciliationData, setReconciliationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [settingShow, setSettingShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10; // Add itemsPerPage constant
  const [activeStatusTab, setActiveStatusTab] = useState(""); // "" means all

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
      label: "Submitted",
      value: "submitted",
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

  // Handle status change for 'From Status'
  const handleStatusChange = (selectedOption) => {
    setFromStatus(selectedOption.value);
    setCurrentPage(1);
    // Call fetchData with the selected status, resetting to page 1
    fetchData(1, {
      companyId: selectedCompany?.value,
      projectId: selectedProject?.value,
      siteId: selectedSite?.value,
      status: selectedOption.value,
    });
  };

  // Handle status change for 'To Status'
  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const validateAndFetchFilteredData = () => {
    setCurrentPage(1);
    fetchData(1);
  };

  const handleReset = () => {
    // Clear selected filters
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setFromStatus("");
    setSearchTerm("");
    setCurrentPage(1);
    setActiveStatusTab("");

    // Fetch unfiltered data by calling fetchData with default empty/null states
    fetchData(
      1,
      { companyId: null, projectId: null, siteId: null, status: "" },
      ""
    );
  };

  // Static data for SingleSelector (this will be replaced by API data later)

  // Handle value change in SingleSelector
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  // Bootstrap collaps
  const bulkActionDropdown = () => {
    setbulkActionDetails(!bulkActionDetails);
  };
  //   Modal

  const openFilterModal = () => setfilterModal(true);
  const closeFilterModal = () => setfilterModal(false);

  const openLayoutModal = () => setlayoutModal(true);
  const closeLayoutModal = () => setlayoutModal(false);

  // Fetch company data on component mount
  useEffect(() => {
    axios
      .get(`${baseURL}pms/company_setups.json?token=${token}`)
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  // Handle company selection
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
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  //get data
  const [data, setData] = useState([]);
  // Fetch data from the API
  const fetchData = (
    page,
    filters = {
      companyId: selectedCompany?.value,
      projectId: selectedProject?.value,
      siteId: selectedSite?.value,
      status: fromStatus,
    },
    search = searchTerm
  ) => {
    setLoading(true);

    let url = `${baseURL}material_reconciliations.json?page=${page}&token=${token}`;

    // Add filters to URL if they exist
    if (filters.companyId) {
      url += `&q[pms_company_setup_id_eq]=${filters.companyId}`;
    }
    if (filters.projectId) {
      url += `&q[pms_project_id_eq]=${filters.projectId}`;
    }
    if (filters.siteId) {
      url += `&q[sub_project_id_eq]=${filters.siteId}`;
    }
    if (filters.status) {
      url += `&q[status_eq]=${filters.status}`;
    }

    // Add search term if it exists
    if (search) {
      url += `&q[reco_number_or_list_status_or_reco_date_or_created_at_or_pms_company_setup_company_name_or_pms_project_name_or_sub_project_name_or_pms_store_name_or_created_by_full_name_cont]=${search}`;
    }

    axios
      .get(url)
      .then((response) => {
        if (response.data && response.data.data) {
          setReconciliationData(response.data.data);
          setData(response.data);

          // Safely access meta data with fallback values
          const totalPages = response.data.meta?.total_pages || 1;
          const totalCount = response.data.meta?.total_count || 0;

          setTotalPages(totalPages);
          setTotalEntries(totalCount);
        } else {
          // Handle empty response
          setReconciliationData([]);
          setTotalPages(1);
          setTotalEntries(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Set default values on error
        setReconciliationData([]);
        setTotalPages(1);
        setTotalEntries(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("Reconciliation Data:", reconciliationData);
  }, [reconciliationData]);

  // Fetch data on component mount and when the page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1);
  };

  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    reconciliation_id: true,
    company_name: true,
    project_name: true,
    site_name: true,
    store: true,
    reconciliation_date: true,
    status: true,
    // edit: true,
  });

  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
    },
    {
      field: "reconciliation_id",
      headerName: "Material Reco. No.",
      width: 200,
      renderCell: (params) =>
        params.value && params.row.id ? (
          <Link
            to={`/material-reconciliation-detail/${params.row.id}?token=${token}`}
          >
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },
    { field: "company_name", headerName: "Company", width: 250 },
    { field: "project_name", headerName: "Project", width: 200 },
    { field: "site_name", headerName: "Sub Project", width: 200 },
    { field: "store", headerName: "Store", width: 250 },
    {
      field: "reconciliation_date",
      headerName: "Reconciliation Date",
      width: 150,
    },
    { field: "status", headerName: "Status", width: 200 },

    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   width: 200,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => {
    //     // Only show edit button if status is draft (case insensitive comparison)
    //     return params.row.status.toLowerCase() === "draft" ? (
    //       <button
    //         className="btn"
    //         onClick={() =>
    //           navigate(
    //             `/material-reconciliation-edit/${params.row.id}?token=${token}`
    //           )
    //         }
    //         title="Edit"
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="16"
    //           height="16"
    //           fill="currentColor"
    //           className="bi bi-pencil-square"
    //           viewBox="0 0 16 16"
    //         >
    //           <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    //           <path
    //             fillRule="evenodd"
    //             d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
    //           />
    //         </svg>
    //       </button>
    //     ) : (
    //       // Return empty cell for non-draft status
    //       ""
    //     );
    //   },
    // },
  ];

  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);

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

  // Transform reconciliation data for DataGrid
  const getTransformedRows = () => {
    // Check if any filter is applied
    const isFiltered =
      selectedCompany || selectedProject || selectedSite || fromStatus;

    return reconciliationData.map((item, index) => ({
      id: item.id,
      srNo: isFiltered
        ? index + 1 // For filtered data, start from 1
        : (currentPage - 1) * itemsPerPage + index + 1, // For unfiltered data, use page-based numbering
      reconciliation_id: item.reco_number,
      company_name: item.company_name,
      project_name: item.project,
      site_name: item.sub_project,
      store: item.store,
      reconciliation_date: (() => {
        const [yyyy, mm, dd] = item.reco_date.split("-");
        return `${dd}-${mm}-${yyyy.slice(2)}`;
      })(),
      status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    }));
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (e) => {
    e.preventDefault();
    console.log("Current selectedIds:", selectedIds);

    if (selectedIds.length === 0) {
      alert("Please select at least one reconciliation");
      return;
    }

    if (!toStatus) {
      alert("Please select a target status");
      return;
    }

    const data = {
      reconciliation_ids: selectedIds,
      to_status: toStatus,
      comments: remark,
    };
    console.log("data for bulk action", data);

    try {
      const response = await axios.patch(
        `${baseURL}material_reconciliations/update_bulk_status?token=${token}`,
        data
      );

      console.log("Success:", response.data);
      alert("Status updated successfully");

      // Refresh data and reset form
      await fetchData(currentPage);
      setSelectedIds([]);
      setToStatus("");
      setFromStatus("");
      setRemark("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const handleTabClick = (status) => {
    setActiveStatusTab(status);
    setFromStatus(status);
    setCurrentPage(1);
    fetchData(1, {
      companyId: selectedCompany?.value,
      projectId: selectedProject?.value,
      siteId: selectedSite?.value,
      status: status,
    });
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          {/* <h5 className="mt-4 fw-bold">Bill Booking</h5> */}
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto7 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeStatusTab === "" ? "active" : ""
                    }`}
                    data-tab="total"
                    onClick={() => handleTabClick("")}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Reconciliation
                    </h4>
                    <p className="content-box-sub">
                      {data?.status_counts?.total}
                    </p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeStatusTab === "draft" ? "active" : ""
                    }`}
                    data-tab="draft"
                    onClick={() => handleTabClick("draft")}
                  >
                    <h4 className="content-box-title fw-semibold">Draft</h4>
                    <p className="content-box-sub">
                      {data?.status_counts?.draft}
                    </p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeStatusTab === "approved" ? "active" : ""
                    }`}
                    data-tab="approved"
                    onClick={() => handleTabClick("approved")}
                  >
                    <h4 className="content-box-title fw-semibold">Approved</h4>
                    <p className="content-box-sub">
                      {data?.status_counts?.approved}
                    </p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeStatusTab === "rejected" ? "active" : ""
                    }`}
                    data-tab="rejected"
                    onClick={() => handleTabClick("rejected")}
                  >
                    <h4 className="content-box-title fw-semibold">Rejected</h4>
                    <p className="content-box-sub">
                      {data?.status_counts?.rejected}
                    </p>
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
                        placeholder={`Select Company`} // Dynamic placeholder
                      />
                      {/* {validationErrors.company && (
                        <span className="text-danger">
                          {validationErrors.company}
                        </span>
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
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                      {/* {validationErrors.project && (
                        <span className="text-danger">
                          {validationErrors.project}
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Sub-Project
                        {/* <span>*</span> */}
                      </label>
                      {/* Pass static data as options */}
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                      {/* {validationErrors.site && (
                        <span className="text-danger">
                          {validationErrors.site}
                        </span>
                      )} */}
                    </div>
                  </div>

                  <div className="col-md-2 mt-4">
                    <button
                      className="purple-btn2 m-0 "
                      onClick={validateAndFetchFilteredData}
                    >
                      Go
                    </button>

                    {/* <div className="col-md-1 mt-4 d-flex justify-content-center"> */}
                    <button className="purple-btn2 ms-3" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                  {/* </div> */}
                </div>
              </CollapsibleCard>

              <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
                <form onSubmit={handleBulkStatusUpdate}>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        <SingleSelector
                          options={options}
                          value={options.find(
                            (option) => option.value === fromStatus
                          )}
                          onChange={handleStatusChange}
                          placeholder={`Select Status`}
                          classNamePrefix="react-select"
                        />
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        <SingleSelector
                          options={options}
                          onChange={handleToStatusChange}
                          value={options.find(
                            (option) => option.value === toStatus
                          )}
                          placeholder={`Select Status`}
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

              <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                {/* Search Input */}
                <div className="col-md-4">
                  <form onSubmit={handleSearch}>
                    <div className="input-group ms-3">
                      <input
                        type="search"
                        id="searchInput"
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-md btn-default"
                          onClick={() => {
                            setSearchTerm("");
                            setCurrentPage(1);
                            fetchData(1, undefined, "");
                          }}
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
                    </div>
                  </form>
                </div>

                {/* Buttons & Filter Section */}
                <div className="col-md-6">
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    {/* Column Visibility Setting Icon */}
                    <button
                      className="btn btn-md btn-default"
                      onClick={handleSettingModalShow}
                    >
                      <SettingIcon />
                    </button>

                    {/* Create Material Reconciliation Button */}
                    <button
                      className="purple-btn2"
                      onClick={() =>
                        navigate(
                          `/material-reconciliation-create?token=${token}`
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span> Add Material Reconciliation</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="mx-1 mt-3"
                style={{
                  overflowY: "auto",
                }}
              >
                <DataGrid
                  rows={getTransformedRows()}
                  columns={columns}
                  pageSize={itemsPerPage}
                  autoHeight={false}
                  getRowId={(row) => row.id}
                  loading={loading}
                  // checkboxSelection
                  checkboxSelection={!!fromStatus} //
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
                  onChange={(e, page) => handlePageChange(page)}
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
          <div className="tab-content1" id="draft-content"></div>
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
            .filter(
              (column) => column.field !== "srNo" && column.field !== "Star"
            )
            .map((column) => (
              <div
                className="row justify-content-between align-items-center mt-2"
                key={column.field}
              >
                <div className="col-md-6">
                  {/* <button type="submit" className="btn btn-md">
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
                  </button> */}

                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
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

export default MaterialReconciliationList;
