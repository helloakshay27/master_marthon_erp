import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from 'react-router-dom';
import {
  DownloadIcon,
  FilterIcon,
  StarIcon,
  SettingIcon,
  MultiSelector,
} from "../components";
import { Modal as BsModal } from "react-bootstrap";

const RopoMappingList = () => {
    const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
    const navigate = useNavigate();
  // Quick Filter states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
    const [bulkActionCollapsed, setBulkActionCollapsed] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalEntries, setTotalEntries] = useState(0);
const pageSize = 10; // Items per page4
const [statusFilter, setStatusFilter] = useState(null);





  // Table data states
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  // Advanced filter states (same pattern as PO List)
  const [filterShow, setFilterShow] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [poDateFrom, setPoDateFrom] = useState("");
  const [poDateTo, setPoDateTo] = useState("");
  const [morNoOptions, setMorNoOptions] = useState([]);
  const [selectedMorNo, setSelectedMorNo] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(null);
    const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      // Get day, month, and year (last two digits)
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(); // Only last two digits

      // Return in DD-MM-YY format
      return `${day}-${month}-${year}`;
    } catch (e) {
      return "-";
    }
  };



// Add new state for status counts
// Update the status counts state
const [statusCounts, setStatusCounts] = useState({
  draft: 0,
  approved: 0,
  rejected: 0,
  submitted: 0,
  total: 0
});

// Update the status boxes JSX

// Add searchKeyword state near other state declarations
const [searchKeyword, setSearchKeyword] = useState("");
const [searchInput, setSearchInput] = useState("");

// Add search handler
const handleSearch = () => {
  // const value = event.target.value;
  setSearchKeyword(searchInput);
  setCurrentPage(1); // Reset to first page when searching
};

// Update the search input in your JSX

// Update the fetchRopoData function
const fetchRopoData = async (overrideFilters = null) => {
  setLoading(true);
  try {
    // Build base URL with token and pagination
    let url = `${baseURL}ropo_mappings.json?token=${token}&page=${currentPage}&per_page=${pageSize}`;

    // Add status filter
    if (statusFilter) {
      url += `&q[status_eq]=${statusFilter}`;
    }

    // Add search if exists
    if (searchKeyword) {
      url += `&search=${searchKeyword}`;
    }

    // Add other filters
    if (selectedCompany?.value) {
      url += `&q[project_company_id_eq]=${selectedCompany.value}`;
    }
    if (selectedProject?.value) {
      url += `&q[project_id_eq]=${selectedProject.value}`;
    }
    if (selectedSite?.value) {
      url += `&q[pms_site_id_eq]=${selectedSite.value}`;
    }

    // Append any advanced q[...] params captured in currentFilters (or override)
    const adv = overrideFilters ?? currentFilters;
    Object.entries(adv || {}).forEach(([key, value]) => {
      if (key.startsWith("q[")) {
        if (value !== undefined && value !== null && value !== "") {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }
    });

    console.log("Fetching data from:", url);
    const response = await axios.get(url);

    // Update status counts from response
    setStatusCounts(response.data.status_counts || {
      draft: 0,
      approved: 0,
      rejected: 0,
      submitted: 0,
      total: 0
    });

    // Transform response data for table
    const ropoMappings = response.data?.ropo_mappings || [];
    const transformedData = ropoMappings.map((item, index) => ({
      id: item.id,
      srNo: (currentPage - 1) * pageSize + index + 1,
      ropoNo: item.ropo_number,
      ropoDate: formatDate(item.mapping_date),
      status: item.status,
      company: item.company_name,
      project: item.project_name,
      subProject: item.pms_site_name,
      createdBy: item.created_by_name,
      materialDescription: item.material_descriptions,
      remarks: item.remarks,
      morNo: item.mor_numbers,
      supplier: item.supplier_organization_names,
      createdBy: item.created_by_name

    }));

    setRows(transformedData);
    setTotalPages(response.data.pagination?.total_pages || 1);
    setTotalEntries(response.data.pagination?.total_count || 0);

  } catch (error) {
    console.error("Error fetching ROPO data:", error);
    setRows([]);
    setStatusCounts({
      draft: 0,
      approved: 0,
      rejected: 0,
      submitted: 0,
      total: 0
    });
  } finally {
    setLoading(false);
  }
};

// Update useEffect to call fetchRopoData when dependencies change
useEffect(() => {
  fetchRopoData();
}, [currentPage, pageSize, searchKeyword, statusFilter, token]);

// Add Go button handler
const handleGoClick = () => {
  setCurrentPage(1); // Reset to first page
  fetchRopoData();
};

// Add Reset button handler
const handleReset = () => {
  setSelectedCompany(null);
  setSelectedProject(null);
  setSelectedSite(null);
  setProjects([]);
  setSiteOptions([]);
  setSearchKeyword("");
  setSearchInput("");
  setStatusFilter(null);
  setCurrentPage(1);
    setCurrentFilters({});
  // Fetch initial (no filters)
  fetchRopoData({});
};





  

  // Settings modal
  const [settingShow, setSettingShow] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    company: true,
    // project: true,
    // subProject: true,
    materialDescription: true, // Add this line
    ropoNo: true,
    ropoDate: true,
     
   
    status: true,
    morNo: true,
    supplier: true,
    dueDate: true,
    overdue: true,
    stage: true,
    createdBy: true,
  });

  // Table columns
const allColumns = [
  { field: "srNo", headerName: "SR No.", width: 100, sortable: true },
  { field: "company", headerName: "Company", width: 150, sortable: true },
  // { field: "project", headerName: "Project", width: 150, sortable: true },
  // { field: "subProject", headerName: "Sub Project", width: 150, sortable: true },
  { field: "ropoNo", headerName: "ROPO No.", width: 120, sortable: true ,
     renderCell: (params) => (
        <div
          style={{ 
            cursor: 'pointer',
            color: '#8B0203',
            textDecoration: 'underline'
          }}
          onClick={() => navigate(`/ropo-mapping-detail/${params.row.id}?token=${token}`)}
        >
          {params.value}
        </div>
      )

  },
  { 
    field: "materialDescription", 
    headerName: "Material Description", 
    width: 200, 
    sortable: true,
    
  },
  { 
    field: "ropoDate", 
    headerName: "ROPO Date", 
    width: 180,
   
    sortable: true 
    
  },
  // { field: "material_descriptions", headerName: "Material Description", width: 150, sortable: true },

  { 
    field: "status", 
    headerName: "Status", 
    width: 120,
    renderCell: (params) => (
      <div className={`status-${params.value.toLowerCase()}`}>
        {params.value}
      </div>
    ),
    sortable: true
  },
  { field: "morNo", headerName: "MOR No.", width: 120, sortable: true },
  { field: "supplier", headerName: "Supplier / Vendor", width: 150, sortable: true },
  { 
    field: "dueDate", 
    headerName: "Due Date", 
    width: 120,
    // valueFormatter: (params) => {
    //   if (!params.value) return '';
    //   return new Date(params.value).toLocaleDateString();
    // },
    sortable: true
  },
  { 
    field: "overdue", 
    headerName: "Overdue", 
    width: 100,
    // valueFormatter: (params) => {
    //   if (!params.value) return '0';
    //   return `${params.value} days`;
    // },
    sortable: true
  },
  { field: "stage", headerName: "Stage", width: 120, sortable: true },
  { 
    field: "createdBy", 
    headerName: "Created By", 
    width: 120,
    // valueFormatter: (params) => {
    //   if (!params.value) return '';
    //   return new Date(params.value).toLocaleDateString();
    // },
    sortable: true
  },
];

  const columns = allColumns.filter((col) => columnVisibility[col.field]);
















  // Fetch companies on mount
// Update the useEffect for fetching companies
useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}pms/company_setups.json?token=${token}`);
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  };

  fetchCompanies();
}, [token]); // Add token to dependency array

  // Handle company selection
// 3. Update the company change handler
const handleCompanyChange = (selectedOption) => {
  setSelectedCompany(selectedOption);
  setSelectedProject(null);
  setSelectedSite(null);
  
  const selectedCompanyId = selectedOption?.value;
  const company = companies.find((c) => c.id === selectedCompanyId);
  setProjects(company?.projects || []);
  setSiteOptions([]);
};
  // Handle project selection
  const handleProjectChange = (selectedOption) => {
  setSelectedProject(selectedOption);
  setSelectedSite(null);
  
  const selectedProjectId = selectedOption?.value;
  const project = projects.find((p) => p.id === selectedProjectId);
  setSiteOptions(project?.pms_sites || []);
};

const handleSiteChange = (selectedOption) => {
  setSelectedSite(selectedOption);
};
  // Fetch ROPO mapping data (replace with your real API)


  // Settings modal handlers
  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleToggleColumn = (field) => {
    setColumnVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleShowAll = () => {
    const updated = {};
    allColumns.forEach((col) => (updated[col.field] = true));
    setColumnVisibility(updated);
  };
  const handleHideAll = () => {
    const updated = {};
    allColumns.forEach((col) => (updated[col.field] = false));
    setColumnVisibility(updated);
  };
  const handleResetColumns = () => handleShowAll();

  // Advanced Filter: option loaders (mirroring PO List, adapted to ROPO Mappings)
  useEffect(() => {
    if (!token) return;
    const loadFilterOptions = async () => {
      try {
        // Load MOR numbers
        try {
          const morResp = await axios.get(
            `${baseURL}material_order_requests/filter_mor_numbers.json?token=${token}`
          );
          const morList = Array.isArray(morResp?.data?.mor_numbers)
            ? morResp.data.mor_numbers
            : Array.isArray(morResp?.data)
            ? morResp.data
            : [];
          setMorNoOptions(morList.map((m) => ({ value: m, label: m })));
        } catch {
          setMorNoOptions([]);
        }

        // Load Status options for RopoMapping
        try {
          const statusResp = await axios.get(
            `${baseURL}unique_statuses?model=RopoMapping&token=${token}`
          );
          const statusList = Array.isArray(statusResp?.data) ? statusResp.data : [];
          setStatusOptions(
            statusList
              .filter((v) => typeof v === "string" && v.trim().length > 0)
              .map((v) => ({ value: v, label: v }))
          );
        } catch {
          setStatusOptions([]);
        }

        // Load Suppliers
        try {
          const supResp = await axios.get(`${baseURL}pms/suppliers.json?token=${token}`);
          const list = Array.isArray(supResp?.data) ? supResp.data : [];
          setSupplierOptions(
            list
              .map((s) => ({
                value: s.id,
                label: s.organization_name || s.full_name || `Supplier #${s.id}`,
              }))
              .filter((opt) => opt.label)
          );
        } catch {
          setSupplierOptions([]);
        }

        // Load Created By options for RopoMapping
        try {
          const createdByResp = await axios.get(
            `${baseURL}created_and_approved_users?model=RopoMapping&created_by=true&token=${token}`
          );
          const userList = Array.isArray(createdByResp?.data) ? createdByResp.data : [];
          setCreatedByOptions(
            userList
              .filter((u) => u && (u.name || u.label) && u.id !== undefined)
              .map((u) => ({ value: u.id, label: u.name || u.label }))
          );
        } catch {
          setCreatedByOptions([]);
        }
      } catch (e) {
        setMorNoOptions([]);
        setStatusOptions([]);
        setSupplierOptions([]);
        setCreatedByOptions([]);
      }
    };
    loadFilterOptions();
  }, [token]);

  // Advanced Filter: modal and handlers
  const handleFilterModalShow = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);
  const handlePoDateFromChange = (e) => setPoDateFrom(e.target.value);
  const handlePoDateToChange = (e) => setPoDateTo(e.target.value);
  const handleMorNoChange = (opt) => setSelectedMorNo(opt);
  const handleStatusChange = (opt) => setSelectedStatus(opt);
  const handleSupplierChange = (opt) => setSelectedSupplier(opt);
  const handleCreatedByChange = (opt) => setSelectedCreatedBy(opt);

  const handleFilterApply = () => {
    const filterParams = {};
    // Date range filters for PO Date
    if (poDateFrom) filterParams["q[po_date_gteq]"] = poDateFrom;
    if (poDateTo) filterParams["q[po_date_lteq]"] = poDateTo;
    // MOR No (if backend supports filtering by MOR number association in list)
    if (selectedMorNo) filterParams["q[mor_numbers][]"] = selectedMorNo.value;
    // Status (list supports multiple)
    if (selectedStatus) filterParams["q[list_status_in][]"] = selectedStatus.value;
    // Supplier
    if (selectedSupplier) filterParams["q[supplier_id_in][]"] = selectedSupplier.value;
    // Created By
    if (selectedCreatedBy) filterParams["q[created_by_id_in][]"] = selectedCreatedBy.value;

    setCurrentFilters((prev) => ({
      ...prev,
      ...filterParams,
    }));
    setCurrentPage(1);
    setFilterShow(false);
    // Fetch immediately with the latest filterParams
    fetchRopoData({ ...(currentFilters || {}), ...filterParams });
  };

  const handleFilterReset = () => {
    setPoDateFrom("");
    setPoDateTo("");
    setSelectedMorNo(null);
    setSelectedStatus(null);
    setSelectedSupplier(null);
    setSelectedCreatedBy(null);
    // Also clear quick filter dropdowns to return to initial state
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects([]);
    setSiteOptions([]);
    setSearchKeyword("");
    setSearchInput("");
    setStatusFilter(null);
    // Clear all query params
    setCurrentFilters({});
    setCurrentPage(1);
    setFilterShow(false);
    // Fetch initial (no filters)
    fetchRopoData({});
  };

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
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; ROPO Mapping List
          </a>
          <h5 className="mt-4">ROPO Mapping List</h5>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
           <div className="row justify-content-center">
  {/* Total */}
  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
    <div
      className={`content-box tab-button ${statusFilter === null ? "active" : ""}`}
      onClick={() => {
        setStatusFilter(null);
        setCurrentPage(1);
      }}
    >
      <h4 className="content-box-title">Total</h4>
      <p className="content-box-sub">{statusCounts.total}</p>
    </div>
  </div>

  {/* Draft/Pending */}
  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
    <div
      className={`content-box tab-button ${statusFilter === "draft" ? "active" : ""}`}
      onClick={() => {
        setStatusFilter("draft");
        setCurrentPage(1);
      }}
    >
      <h4 className="content-box-title">Pending</h4>
      <p className="content-box-sub">{statusCounts.draft}</p>
    </div>
  </div>

  {/* Approved/Mapped */}
  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
    <div
      className={`content-box tab-button ${statusFilter === "approved" ? "active" : ""}`}
      onClick={() => {
        setStatusFilter("approved");
        setCurrentPage(1);
      }}
    >
      <h4 className="content-box-title">Mapped</h4>
      <p className="content-box-sub">{statusCounts.approved}</p>
    </div>
  </div>

  {/* Submitted */}
  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
    <div
      className={`content-box tab-button ${statusFilter === "submitted" ? "active" : ""}`}
      onClick={() => {
        setStatusFilter("submitted");
        setCurrentPage(1);
      }}
    >
      <h4 className="content-box-title">Submitted</h4>
      <p className="content-box-sub">{statusCounts.submitted}</p>
    </div>
  </div>

  {/* Rejected */}
  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
    <div
      className={`content-box tab-button ${statusFilter === "rejected" ? "active" : ""}`}
      onClick={() => {
        setStatusFilter("rejected");
        setCurrentPage(1);
      }}
    >
      <h4 className="content-box-title">Rejected</h4>
      <p className="content-box-sub">{statusCounts.rejected}</p>
    </div>
  </div>
</div>
            </div>
          </div>
          <div className="card mt-3 pb-4">
            {/* Quick Filter */}
           
              
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
                                     options={Array.isArray(companies) ? companies.map((c) => ({
    value: c.id,
    label: c.company_name,
  })) : []}
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
      options={Array.isArray(projects) ? projects.map((p) => ({
        value: p.id,
        label: p.name,
      })) : []}
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
      options={Array.isArray(siteOptions) ? siteOptions.map((s) => ({
        value: s.id,
        label: s.name,
      })) : []}
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
                                 onClick={handleGoClick}
                                  >
                                    Go
                                  </button>
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

            {/* DataGrid Table with Settings */}
            <div className="card mx-3">
              <div className="card-header3">
                <h3 className="card-title">Bulk Action</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={() => setBulkActionCollapsed(!bulkActionCollapsed)}
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
                          bulkActionCollapsed
                            ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                            : "M16 8L22.9282 20L9.0718 20L16 8Z"
                        }
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {!bulkActionCollapsed && (
                <div className="card-body mt-0 pt-0">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        <select
                          name="from_status"
                          id="from_status"
                          className="form-control form-select from"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        <select
                          name="to_status"
                          id="to_status"
                          className="form-control form-select to"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          className="form-control remark"
                          rows={4}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button className="purple-btn2 m-0 status">
                        <a style={{ color: "white !important" }}> Submit </a>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
            <div className="d-flex mt-3 align-items-end px-3">
              <div className="col-md-6">
                <form>
                <div className="input-group">
  <input
    type="search"
    id="searchInput"
    className="form-control tbl-search"
    placeholder="Type your keywords here"
    value={searchInput}
   onChange={(e) => setSearchInput(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        fetchRopoData();
      }
    }}
  />
  <div className="input-group-append">
    <button 
      type="button" 
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
                </form>
              </div>
              <div className="col-md-6">
                <div className="row  d-flex justify-content-end">
                  <div className="col-md-5">
                    <div className="row  d-flex justify-content-end px-3">
                     


                      <div className="col-md-3 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-md"
                          onClick={handleFilterModalShow}
                        >
                          <FilterIcon />
                        </button>
                        <button
                                        type="button"
                                        className="btn btn-md ms-4"
                                        onClick={handleSettingModalShow}
                                      >
                                        <SettingIcon />
                                      </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mt-1 ">
                    <button type="button" className="purple-btn2"
                     onClick={() => navigate(`/ropo-mapping-create?token=${token}`)}>
                      
                        Add Ropo
                     
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-1 mt-3" style={{ overflowY: "auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                autoHeight={false}
                getRowId={(row) => row.id || row.ropoNo} // adjust as per your data
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
                }}
              />
            </div>

<div className="d-flex justify-content-between align-items-center px-3 py-2">
  <nav aria-label="Page navigation example">
    <ul className="pagination mb-0">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
      </li>
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </li>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
        )
        .map((page, idx, arr) => {
          if (idx > 0 && page - arr[idx - 1] > 1) {
            return [
              <li key={`ellipsis-${page}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>,
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>,
            ];
          }
          return (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            </li>
          );
        })}
      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </li>
    </ul>
  </nav>
  <div className="ms-3">
    <span>
      Showing {(currentPage - 1) * pageSize + 1} to{" "}
      {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
    </span>
  </div>
</div>
            {/* Settings Modal */}
           
           
          
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal (same style as PO List) */}
      <BsModal
        show={filterShow}
        onHide={handleFilterClose}
        dialogClassName="modal-right"
        className="setting-modal"
        backdrop={true}
      >
        <BsModal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn"
                  aria-label="Close"
                  onClick={handleFilterClose}
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
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <span
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                onClick={handleFilterReset}
                role="button"
              >
                Reset
              </span>
            </div>
          </div>
        </BsModal.Header>

        <div className="modal-body" style={{ overflowY: "scroll" }}>
          <div className="row">
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">ROPO Date From</label>
              <input
                type="date"
                className="form-control"
                value={poDateFrom}
                onChange={handlePoDateFromChange}
                placeholder="Select From Date"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">ROPO Date To</label>
              <input
                type="date"
                className="form-control"
                value={poDateTo}
                onChange={handlePoDateToChange}
                placeholder="Select To Date"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">MOR No.</label>
              <SingleSelector
                options={morNoOptions}
                value={selectedMorNo}
                onChange={handleMorNoChange}
                placeholder="Select MOR No."
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Company</label>
              <SingleSelector
                options={Array.isArray(companies) ? companies.map((c) => ({ value: c.id, label: c.company_name })) : []}
                value={selectedCompany}
                onChange={handleCompanyChange}
                placeholder="Select Company"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Project</label>
              <SingleSelector
                options={Array.isArray(projects) ? projects.map((p) => ({ value: p.id, label: p.name })) : []}
                value={selectedProject}
                onChange={handleProjectChange}
                placeholder="Select Project"
                isDisabled={!selectedCompany}
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Sub Project</label>
              <SingleSelector
                options={Array.isArray(siteOptions) ? siteOptions.map((s) => ({ value: s.id, label: s.name })) : []}
                value={selectedSite}
                onChange={handleSiteChange}
                placeholder="Select Sub Project"
                isDisabled={!selectedProject}
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Status</label>
              <SingleSelector
                options={statusOptions}
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Select Status"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Supplier/Vendor</label>
              <SingleSelector
                options={supplierOptions}
                value={selectedSupplier}
                onChange={handleSupplierChange}
                placeholder="Select Supplier"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Created By</label>
              <SingleSelector
                options={createdByOptions}
                value={selectedCreatedBy}
                onChange={handleCreatedByChange}
                placeholder="Select Created By"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleFilterApply}
          >
            Apply Filter
          </button>
        </div>
      </BsModal>
      {/* Advanced Filter Modal end */}
      <div
        className="modal fade right"
        id="sidebarModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ width: 500 }}>
          <div className="modal-content h-100" style={{ borderRadius: 0 }}>
            <div className="modal-header border-0">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button "
                  className="btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <svg
                    width={10}
                    height={16}
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <a
                className="resetCSS"
                style={{ fontSize: 14, textDecoration: "underline !important" }}
                href="#"
              >
                Reset
              </a>
            </div>
            <div className="modal-body" style={{ overflowY: "scroll" }}>
              <div className="row">
                <div className="row mt-2 px-2">
                  <div className="col-md-12 card mx-3">
                    <div className="card-header2">
                      <h3 className="card-title2">
                        <div className="form-group form-control">
                          Applied Fliter
                        </div>
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                            <label className="px-1">Company</label>
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                            <label className="px-1">Project</label>
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                            <p className="px-1">Sub-project</p>
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      MOR Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Approval Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 align-items-end">
                <div className="col-md-12">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Due Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Created On
                    </label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Default input"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material Type </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material Sub Tupe </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Activity </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Status </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>MOR No. </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Overdue </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Requisition Department </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected="selected">Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer modal-footer-k justify-content-center">
              <a
                className="purple-btn2"
                href="/pms/admin/task_managements/kanban_list?type="
              >
                Go
              </a>
            </div>
          </div>
        </div>
      </div>
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
                          (column) =>
                            column.field !== "srNo" && column.field !== "Star"
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
                      {/* <Button variant="primary" onClick={handleShowAll}>
                             Show All
                           </Button>
                           <Button variant="danger" onClick={handleHideAll}>
                             Hide All
                           </Button> */}
                      <button className="purple-btn2" onClick={handleShowAll}>
                        Show All
                      </button>
                      <button className="purple-btn1" onClick={handleHideAll}>
                        Hide All
                      </button>
                    </Modal.Footer>
                  </Modal>
      {/* filter modal end */}
      {/* Setting modal */}
    </>
  );
};

export default RopoMappingList;
