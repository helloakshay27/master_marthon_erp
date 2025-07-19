import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, Typography, Pagination } from "@mui/material";
import SingleSelector from "../components/base/Select/SingleSelector";
import { DownloadIcon, FilterIcon, StarIcon, SettingIcon } from "../components";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BillEntryVendorList = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [selectedValue, setSelectedValue] = useState("");
  const [billEntries, setBillEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [pinnedRows, setPinnedRows] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);

  // Company, Project, Site states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const navigate = useNavigate();

  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    bill_id: true,
    mode_of_submission: true,
    company_name: true,
    project_name: true,
    site_name: true,
    supplier_name: true,
    uam_number: true,
    po_number: true,
    created_at: true,
    accepted_at: true,
    bill_no: true,
    bill_date: true,
    bill_amount: true,
    bill_copies: true,
    due: true,
    due_date: true,
   
    status: true,
   
    assign_to: true,
    tat: true,
  });

  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 100,
      // renderCell: (params) => {
      //   // params.api.getRowIndex(params.id) gives the index in the current page
      //   // currentPage is 1-based, pageSize is your page size
      //   return (
      //     (currentPage - 1) * pageSize + params.api.getRowIndex(params.id) + 1
      //   );
      // },
    },
    {
      field: "bill_id",
      headerName: "Bill Id",
      width: 150,
      renderCell: (params) =>
        params.value && params.row.id ? (
          <Link to={`/bill-entry-details/${params.row.id}?token=${token}`}>
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },

    {
      field: "mode_of_submission",
      headerName: "Mode of Submission",
      width: 150,
    },
    { field: "company_name", headerName: "Company", width: 180 },
    { field: "project_name", headerName: "Project", width: 150 },
    { field: "site_name", headerName: "Sub Project", width: 150 },
    { field: "supplier_name", headerName: "Vendor Name", width: 150 },
    { field: "uam_number", headerName: "UAM No.", width: 150 },
    { field: "po_number", headerName: "PO No.", width: 150 },
    {
      field: "created_at",
      headerName: "Created On",
      width: 200,
    },
    {
      field: "updated_at",
      headerName: "Accepted On",
      width: 150,
    },
    {
      field: "bill_no",
      headerName: "Invoice No.",
      width: 150,
      renderCell: (params) =>
        params.value && params.row.id ? (
          <Link to={`/bill-entry-details/${params.row.id}?token=${token}`}>
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },
    { field: "bill_date", headerName: "Invoice Date", width: 200 },
    { field: "bill_amount", headerName: "Invoice Amount", width: 150 },
    { field: "bill_copies", headerName: "Bill Copies", width: 150 },
    { field: "due", headerName: "Due", width: 150 },
    { field: "due_date", headerName: "Due Date", width: 200 },
  
    { field: "status", headerName: "Status", width: 200 },
   
    { field: "assign_to", headerName: "Assign to", width: 150 },
    { field: "tat", headerName: "TAT", width: 150 },
  ];

  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

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

  // Fetch companies on component mount
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
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        })) || []
      );
    }
  };

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
    }
  };

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  const [activeTab, setActiveTab] = useState("list");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // fetchTabData(tab, 1); // Always go to first page on tab change
    setCurrentPage(1); // R
  };
  const [allBillCount, setAllBillCount] = useState(0); // <-- Add this

  // Fetch total bill count only once, on mount
  // useEffect(() => {
  //   const fetchAllBillCount = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${baseURL}bill_entries?page=1&per_page=1&token=${token}`
  //       );
  //       setAllBillCount(response.data.meta.total_count || 0);
  //     } catch (error) {
  //       setAllBillCount(0);
  //     }
  //   };
  //   fetchAllBillCount();
  // }, []);

  // const fetchTabData = (tab, page) => {
  //   setLoading(true);
  //   let statusQuery = "";
  //   if (tab === "open") statusQuery = "&q[status_eq]=open";
  //   // if (tab === "online") statusQuery = "&q[status_eq]=online";
  //   if (tab === "requested for revision count")
  //     statusQuery = "&q[status_eq]=requested for revision count";

  //   axios
  //     .get(
  //       `${baseURL}bill_entries?page=${page}&per_page=${pageSize}&token=${token}${statusQuery}`
  //     )
  //     .then((response) => {
  //       const transformedData = response.data.bill_entries.map(
  //         (entry, index) => ({
  //           id: entry.id,
  //           srNo: (page - 1) * pageSize + index + 1,
  //           ...entry,
  //         })
  //       );
  //       setBillEntries(transformedData);
  //       setMeta(response.data.meta);
  //       setTotalPages(response.data.meta.total_pages);
  //       setTotalEntries(response.data.meta.total_count);
  //       setCurrentPage(page);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching tab data:", error);
  //     })
  //     .finally(() => setLoading(false));
  // };
  // useEffect(() => {
  //   fetchTabData(activeTab, currentPage);
  //   // eslint-disable-next-line
  // }, [activeTab, currentPage, pageSize]);

  // Fetch filtered data
  // const fetchFilteredData = () => {
  //   const companyId = selectedCompany?.value || "";
  //   const projectId = selectedProject?.value || "";
  //   const siteId = selectedSite?.value || "";
  //   const search = searchKeyword || "";

  //   const url = `${baseURL}bill_entries?page=1&per_page=${pageSize}&token=${token}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_in]=${companyId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_in]=${projectId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_site_id_cont]=${siteId}`;

  //   axios
  //     .get(url)
  //     .then((response) => {
  //       const transformedData = response.data.bill_entries.map(
  //         (entry, index) => ({
  //           id: entry.id,
  //           srNo: (currentPage - 1) * pageSize + index + 1, // Use currentPage here
  //           ...entry,
  //         })
  //       );
  //       setBillEntries(transformedData);
  //       setTotalPages(response.data.meta.total_pages);
  //       setTotalEntries(response.data.meta.total_count);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching filtered data:", error);
  //     });
  // };

  // Handle reset
  // const handleReset = () => {
  //   setSelectedCompany(null);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSearchKeyword("");

  //   axios
  //     .get(
  //       `${baseURL}bill_entries?page=1&per_page=${pageSize}&token=${token}`
  //     )
  //     .then((response) => {
  //       const transformedData = response.data.bill_entries.map(
  //         (entry, index) => ({
  //           id: entry.id,
  //           srNo: index + 1,
  //           ...entry,
  //         })
  //       );
  //       setBillEntries(transformedData);
  //       setMeta(response.data.meta);
  //       setTotalPages(response.data.meta.total_pages);
  //       setTotalEntries(response.data.meta.total_count);
  //     })
  //     .catch((error) => {
  //       console.error("Error resetting data:", error);
  //     });
  // };

  const [currentFilters, setCurrentFilters] = useState({
    companyId: "",
    projectId: "",
    siteId: "",
  });
  // Update the date formatting function
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build base URL
        let url = `${baseURL}bill_entries?page=${currentPage}&per_page=${pageSize}&token=${token}`;

        // Add filters
        if (
          currentFilters.companyId ||
          currentFilters.projectId ||
          currentFilters.siteId
        ) {
          url += `&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_in]=${currentFilters.companyId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_in]=${currentFilters.projectId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_site_id_cont]=${currentFilters.siteId}`;
        } else {
          // Add tab filters

          // if (tab === "open") statusQuery = "&q[status_eq]=open";
          //   // if (tab === "online") statusQuery = "&q[status_eq]=online";
          //   if (tab === "requested for revision count")
          //     statusQuery = "&q[status_eq]=requested for revision count";
          switch (activeTab) {
            case "open":
              url += "&q[status_eq]=open";
              break;
            case "online":
              url += "&q[mode_of_submission_eq]=online";
              break;
            case "requested for revision count":
              url += "&q[mode_of_submission_eq]=requested for revision count";
              break;
          }
        }

        // Add search
        if (searchKeyword) {
          url += `&q[bill_no_or_bill_date_or_mode_of_submission_or_bill_amount_or_status_or_vendor_remark_or_purchase_order_supplier_gstin_or_purchase_order_supplier_full_name_or_purchase_order_po_number_or_purchase_order_supplier_pan_number_or_purchase_order_company_company_name_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_cont]=${searchKeyword}`;
        }
        const response = await axios.get(url);
        const data = response.data.bill_entries.map((entry, index) => ({
          id: entry.id,
          srNo: (currentPage - 1) * pageSize + index + 1,
          ...entry,
          created_at: formatDate(entry.created_at),
          updated_at: formatDate(entry.updated_at),
          due_date: formatDate(entry.due_date),
          bill_date: formatDate(entry.bill_date),
        }));

        setBillEntries(data);
        setMeta(response.data.meta);
        setTotalPages(response.data.meta.total_pages);
        setTotalEntries(response.data.meta.total_count);
        // Update allBillCount when on list tab
        if (
          activeTab === "list" &&
          !currentFilters.companyId &&
          !currentFilters.projectId &&
          !currentFilters.siteId &&
          !searchKeyword
        ) {
          setAllBillCount(response.data.meta.total_count);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, currentFilters, activeTab, searchKeyword]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      // Get day, month, and year
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      // Return in DD-MM-YYYY format
      return `${day}-${month}-${year}`;
    } catch (e) {
      return "-";
    }
  };

  // Remove the duplicate handlePageChange and consolidate data fetching
  const handlePageChange = (event, value) => {
    setCurrentPage(value);

    // The useEffect will handle the data fetching with filters
  };

  const fetchFilteredData = () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";

    // Store current filters
    setCurrentFilters({
      companyId,
      projectId,
      siteId,
    });

    // Reset to first page when applying new filters
    setCurrentPage(1);
  };

  // Update the handleReset function
  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSearchKeyword("");
    setCurrentFilters({
      companyId: "",
      projectId: "",
      siteId: "",
    });

    // Reset to first page and fetch data
    setCurrentPage(1);
    fetchTabData(activeTab, 1);
  };
  const [searchInput, setSearchInput] = useState("");

  // Handle search button click
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle cross button click
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setCurrentPage(1); // Reset to first page
  };

  // Fetch bill entries
  //   const fetchData = async (page) => {
  //     const search = searchKeyword || "";
  //     try {
  //       setLoading(true);

  //       const response = await axios.get(
  //         `${baseURL}bill_entries?page=${page}&per_page=${pageSize}&token=${token}&q[bill_no_or_bill_date_or_mode_of_submission_or_bill_amount_or_status_or_vendor_remark_or_purchase_order_supplier_gstin_or_purchase_order_supplier_full_name_or_purchase_ord
  // er_po_number_or_purchase_order_supplier_pan_number_or_purchase_order_company_company_name_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_or_purchase_order_po_mor_inve
  // ntories_mor_inventory_material_order_request_company_id_cont]
  //         =${search}`
  //       );
  //       const transformedData = response.data.bill_entries.map(
  //         (entry, index) => ({
  //           id: entry.id,
  //           srNo: (page - 1) * pageSize + index + 1, // <-- This line is key!
  //           ...entry,
  //         })
  //       );

  //       setBillEntries(transformedData);
  //       setMeta(response.data.meta);
  //       setTotalPages(response.data.meta.total_pages);
  //       setTotalEntries(response.data.meta.total_count);
  //     } catch (error) {
  //       console.error("Error fetching bill entries:", error);
  //       setError("Failed to fetch bill entries");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchData(currentPage);
  //   }, [currentPage, searchKeyword]);

  const getTransformedRows = () => {
    let rowsToShow = showOnlyPinned
      ? billEntries.filter((row) => pinnedRows.includes(row.id))
      : billEntries;

    const normalizedSearchTerm = searchKeyword.trim().toLowerCase();
    if (normalizedSearchTerm) {
      rowsToShow = rowsToShow.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && String(value).toLowerCase().includes(normalizedSearchTerm)
        )
      );
    }

    return rowsToShow;
  };

  // Calculate displayed rows for the current page
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  return (
    <>
        <style type="text/css">
        {`.tbl-container {

height: auto !important;
max-height: 100% !important;

}
.css-5n0k77:last-child{
display:none !important;
}
.MuiDataGrid-cell, .MuiDataGrid-cell > div {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}
        `}
      </style>
    
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Billing &gt; MOR &gt; Bill Entry List</a>
          <h5 className="mt-4 fw-bold">Bill Entry List</h5>

          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto6 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeTab === "list" ? "active" : ""
                    }`}
                    data-tab="list"
                    onClick={() => handleTabChange("list")}
                  >
                    <h4 className="content-box-title fw-semibold">Bill List</h4>
                    <p className="content-box-sub">{allBillCount}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeTab === "open" ? "active" : ""
                    }`}
                    data-tab="open"
                    onClick={() => handleTabChange("open")}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Open Bills
                    </h4>
                    <p className="content-box-sub">{meta?.draft_count || 0}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeTab === "requested for revision count"
                        ? "active"
                        : ""
                    }`}
                    data-tab="requested for revision count"
                    onClick={() =>
                      handleTabChange("requested for revision count")
                    }
                  >
                    <h4 className="content-box-title fw-semibold" title="Request For Resubmission">
                      Request For Resubmission
                    </h4>
                    <p className="content-box-sub">
                      {meta?.requested_for_revision_count || 0}
                    </p>
                  </div>
                </div>
                {/* <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      activeTab === "offline" ? "active" : ""
                    }`}
                    data-tab="offline"
                    onClick={() => handleTabChange("offline")}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Offline Bills
                    </h4>
                    <p className="content-box-sub">
                      {meta?.offline_count || 0}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="card mt-3 pb-4">
            <div className="card mx-3 mt-3">
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={16} cy={16} r={16} fill="#8B0203" />
                      <path
                        d={
                          isCollapsed
                            ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                            : "M16 8L22.9282 20L9.0718 20L16 8Z"
                        }
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="card-body pt-0 mt-0">
                  <div className="row my-2 align-items-end">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Company</label>
                        <SingleSelector
                          options={companies.map((c) => ({
                            value: c.id,
                            label: c.company_name,
                          }))}
                          onChange={handleCompanyChange}
                          value={selectedCompany}
                          placeholder="Select Company"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project</label>
                        <SingleSelector
                          options={projects}
                          onChange={handleProjectChange}
                          value={selectedProject}
                          placeholder="Select Project"
                          isDisabled={!selectedCompany}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={siteOptions}
                          onChange={handleSiteChange}
                          value={selectedSite}
                          placeholder="Select Sub-project"
                          isDisabled={!selectedProject}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="purple-btn2 m-0"
                        onClick={fetchFilteredData}
                      >
                        Go
                      </button>

                      {/* <div className="col-md-2"> */}
                      <button
                        className="purple-btn2 ms-2"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex mt-3 align-items-end px-3">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control tbl-search"
                    placeholder="Type your keywords here"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <div className="input-group-append">
                    {/* {searchInput && (
                                 <button
                                   type="button"
                                   className="btn btn-md btn-default"
                                   onClick={handleClearSearch}
                                 >
                                    ✕ {/* Cross icon */}
                    {/* </button> */}
                 
                    <button
                      type="submit"
                      className="btn btn-md btn-default"
                      onClick={handleSearch}
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
              </div>
              <div className="col-md-6 d-flex justify-content-end align-items-center gap-4 mt-4">
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleSettingModalShow}
                >
                  <SettingIcon />
                </button>
                <button
                  className="purple-btn2"
                  onClick={() => navigate("/bill-entry-list-sub-page")}
                >
                  <span> + Add</span>
                </button>
              </div>
            </div>

            <div
              className="tbl-container px-3 mt-3"
              style={{
                width: "100%",
                height: "400px",
                boxShadow: "unset",
                overflow: "auto",
              }}
            >
              <DataGrid
                rows={getTransformedRows()}
                columns={columns}
                pageSize={pageSize}
                autoHeight={true}
                getRowId={(row) => row.id}
                loading={loading}
                disableSelectionOnClick
                components={{
                  ColumnMenu: () => null,
                }}
                 localeText={{
                    noRowsLabel: "No data available",
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
                  // "& .MuiDataGrid-virtualScroller": {
                  //   overflowX: "auto",
                  //   overflowY: "auto",
                  // },
                  // "& .MuiDataGrid-virtualScrollerContent": {
                  //   minWidth: "100%",
                  // },
                  // "& .MuiDataGrid-virtualScrollerRenderZone": {
                  //   position: "relative",
                  // },
                  // "& .MuiDataGrid-main": {
                  //   overflow: "visible",
                  // },
                }}
              />

              {/* Custom Pagination Bar */}
            <div className="d-flex justify-content-between align-items-center px-3 mt-2">
              <ul className="pagination justify-content-center d-flex">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(null, 1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(null, currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(null, index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(null, currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(null, totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </li>
              </ul>
              <div>
                Showing {startEntry} to {endEntry} of {totalEntries} entries
              </div>
            </div>
            </div>

            {/* <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                // onChange={(event, value) => setCurrentPage(value)}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
                color="primary"
                showFirstButton
                showLastButton
                disabled={totalPages <= 1}
              />

              <Typography variant="body2">
                Showing {startEntry} to {endEntry} of {totalEntries} entries
              </Typography>
            </Stack> */}
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
            .filter(
              (column) => column.field !== "srNo" && column.field !== "Star"
            )
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
          <Button variant="primary" onClick={handleShowAll}>
            Show All
          </Button>
          <Button variant="danger" onClick={handleHideAll}>
            Hide All
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BillEntryVendorList;
