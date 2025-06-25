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

const GatePassList = () => {
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

  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "company_name",
      headerName: "Company",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "project_name",
      headerName: "Project",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "sub_project_name",
      headerName: "Subproject",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "gate_pass_no",
      headerName: "Gate Pass No",
      flex: 1,
      minWidth: 140,
      renderCell: (params) =>
        params.value && params.row.id ? (
          <Link to={`/gate-pass-details/${params.row.id}?token=${token}`}>
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },
    {
      field: "gate_pass_type_name",
      headerName: "Gate Pass Type",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "matarial_type_name",
      headerName: "Material Type",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "material_sub_type_name",
      headerName: " Material Sub Type",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "po_or_mto_no",
      headerName: "PO / MTO No.",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "gate_pass_date",
      headerName: "Gate Pass Date",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "created_by_name",
      headerName: "Issued By",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "approved_by_name",
      headerName: "Approved By",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "expected_return_date",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "overdue",
      headerName: "Overdue",
      flex: 1,
      minWidth: 100,
    },
    // {
    //   field: "due_at",
    //   headerName: "Due At",
    //   flex: 1,
    //   minWidth: 100,
    // },
  ];

  const [columnVisibility, setColumnVisibility] = useState(
    allColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
  );

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

  // Add state to store current filters
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
        let url = `${baseURL}gate_passes.json?token=${token}&page=${currentPage}&per_page=${pageSize}`;

        // Add filters
        if (currentFilters.companyId) {
          url += `&q[company_id_eq]=${currentFilters.companyId}`;
        }
        if (currentFilters.projectId) {
          url += `&q[project_id_eq]=${currentFilters.projectId}`;
        }
        if (currentFilters.siteId) {
          // Assuming siteId corresponds to sub_project_id
          url += `&q[sub_project_id_eq]=${currentFilters.siteId}`;
        }

        // Add search
        if (searchKeyword) {
          url += `&search=${searchKeyword}`;
        }
        const response = await axios.get(url);
        // The API returns gate_passes array
        const data = (response.data.gate_passes || []).map((entry, index) => ({
          id: entry.id,
          srNo: (currentPage - 1) * pageSize + index + 1,
          ...entry,
          due_date: formatDate(entry.due_date),
          gate_pass_date: formatDate(entry.gate_pass_date),
          expected_return_date: formatDate(entry.expected_return_date),
          created_at: formatDate(entry.created_at),
          updated_at: formatDate(entry.updated_at),
          due_at: formatDate(entry.due_at),
        }));
        setBillEntries(data);
        // Set pagination info if available
        setMeta(response.data.pagination || {});
        setTotalPages(response.data.pagination?.total_pages || 1);
        setTotalEntries(response.data.pagination?.total_count || data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchKeyword, currentFilters]);

  const columns = allColumns;

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

    // Reset to first page
    setCurrentPage(1);
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

  const getTransformedRows = () => {
    let rowsToShow = showOnlyPinned
      ? billEntries.filter((row) => pinnedRows.includes(row.id))
      : billEntries;

    return rowsToShow;
  };

  // Calculate displayed rows for the current page
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  return (
    <>
      {/* <style type="text/css">
        {`

.tbl-container {

height: 350px !important;

}
.css-5n0k77:last-child{
display:none !important;
}



`}
      </style> */}
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Store &gt; Store Operations &gt; Gate Pass</a>
          <h5 className="mt-4 fw-bold">Gate Pass List</h5>

          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto6 justify-content-center">
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button active">
                    <h4 className="content-box-title fw-semibold">Total</h4>
                    <p className="content-box-sub">25</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">
                      Returnable
                    </h4>
                    <p className="content-box-sub">25</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">
                      Non-Returnable
                    </h4>
                    <p className="content-box-sub">10</p>
                  </div>
                </div>
                {/* <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">
                      Pending to Return
                    </h4>
                    <p className="content-box-sub">5</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">Value</h4>
                    <p className="content-box-sub">100200 ₹</p>
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
                    <div className="col-md-2">
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
                    {searchInput && (
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                        // onClick={() => {
                        //   setSearchTerm(""); // Clear the search term
                        //   fetchData();
                        //   // activeTab,
                        //   // filters,
                        //   // pagination.current_page,
                        //   // "" // Fetch data without search
                        // }}
                        onClick={handleClearSearch}
                      >
                        ✕ {/* Cross icon */}
                      </button>
                    )}
                    {/* )} */}
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
              <div className="col-md-5 d-flex justify-content-end align-items-center gap-5 mt-4">
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleSettingModalShow}
                >
                  <SettingIcon />
                </button>
                <button
                  className="purple-btn2"
                  onClick={() => navigate(`/gate-pass-create?token=${token}`)}
                >
                  <span> + Add</span>
                </button>
              </div>
            </div>

            <div className="mx-1 mt-3" style={{ width: "100%" }}>
              <DataGrid
                rows={getTransformedRows()}
                columns={columns}
                pageSize={pageSize}
                autoHeight
                getRowId={(row) => row.id}
                loading={loading}
                disableSelectionOnClick
                columnVisibilityModel={columnVisibility}
                onColumnVisibilityModelChange={setColumnVisibility}
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
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                  },
                  "& .MuiDataGrid-virtualScrollerContent": {
                    minWidth: "100%",
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    position: "relative",
                  },
                  "& .MuiDataGrid-main": {
                    overflow: "visible",
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
            </Stack>
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

export default GatePassList;
