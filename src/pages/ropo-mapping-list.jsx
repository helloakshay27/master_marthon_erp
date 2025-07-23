import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed

const RopoMappingList = () => {
  // Quick Filter states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Table data states
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Settings modal
  const [settingShow, setSettingShow] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    company: true,
    project: true,
    subProject: true,
    ropoNo: true,
    ropoDate: true,
    materialType: true,
    materialSubType: true,
    material: true,
    status: true,
    morNo: true,
    supplier: true,
    dueDate: true,
    overdue: true,
    stage: true,
    dueAt: true,
  });

  // Table columns
  const allColumns = [
    { field: "company", headerName: "Company", width: 150 },
    { field: "project", headerName: "Project", width: 150 },
    { field: "subProject", headerName: "Sub Project", width: 150 },
    { field: "ropoNo", headerName: "ROPO No.", width: 120 },
    { field: "ropoDate", headerName: "ROPO Date From & To", width: 180 },
    { field: "materialType", headerName: "Material Type", width: 150 },
    { field: "materialSubType", headerName: "Material Sub Type", width: 150 },
    { field: "material", headerName: "Material", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "morNo", headerName: "MOR No.", width: 120 },
    { field: "supplier", headerName: "Supplier / Vendor", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 120 },
    { field: "overdue", headerName: "Overdue", width: 100 },
    { field: "stage", headerName: "Stage", width: 120 },
    { field: "dueAt", headerName: "Due At", width: 120 },
  ];

  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  // Fetch companies on mount
  useEffect(() => {
    axios
      .get(`${baseURL}pms/company_setups.json`)
      .then((response) => setCompanies(response.data.companies))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  // Handle company selection
  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setSelectedCompany(value);
    setSelectedProject("");
    setSelectedSite("");
    const company = companies.find((c) => c.id === Number(value));
    setProjects(company?.projects || []);
    setSiteOptions([]);
  };

  // Handle project selection
  const handleProjectChange = (e) => {
    const value = e.target.value;
    setSelectedProject(value);
    setSelectedSite("");
    const project = projects.find((p) => p.id === Number(value));
    setSiteOptions(project?.pms_sites || []);
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
  };

  // Fetch ROPO mapping data (replace with your real API)
  const fetchRopoData = () => {
    setLoading(true);
    // Example: Replace with your real API and params
    axios
      .get(`${baseURL}your-ropo-api-endpoint`, {
        params: {
          company_id: selectedCompany,
          project_id: selectedProject,
          site_id: selectedSite,
        },
      })
      .then((res) => {
        setRows(res.data.data); // Adjust as per your API response
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

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

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; ROPO Mapping List
          </a>
          <h5 className="mt-4">ROPO Mapping List</h5>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                  <div className="content-box">
                    <h4 className="content-box-title">Total</h4>
                    <p className="content-box-sub">50</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Mapped</h4>
                    <p className="content-box-sub">35</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Pending</h4>
                    <p className="content-box-sub">15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-3 pb-4">
            {/* Quick Filter */}
            <div className="card mx-3 mt-3 collapsed-card">
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool">
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={16} cy={16} r={16} fill="#8B0203" />
                      <path
                        d="M16 24L9.0718 12L22.9282 12L16 24Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="card-body pt-0 mt-0">
                <div className="row align-items-end">
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-control form-select"
                        value={selectedCompany || ""}
                        onChange={handleCompanyChange}
                      >
                        <option value="">Select Company</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>{c.company_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Project</label>
                      <select
                        className="form-control form-select"
                        value={selectedProject || ""}
                        onChange={handleProjectChange}
                        disabled={!selectedCompany}
                      >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      <select
                        className="form-control form-select"
                        value={selectedSite || ""}
                        onChange={handleSiteChange}
                        disabled={!selectedProject}
                      >
                        <option value="">Select Sub-Project</option>
                        {siteOptions.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn2 m-0" onClick={fetchRopoData}>Go</button>
                  </div>
                </div>
              </div>
            </div>

            {/* DataGrid Table with Settings */}
          <div className="card mx-3 collapsed-card">
              <div className="card-header3">
                <h3 className="card-title">Bulk Action</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    // data-card-widget="collapse"
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
                        d="M16 24L9.0718 12L22.9282 12L16 24Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
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
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
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
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <div className="row justify-content-end px-3">
                      <div className="col-md-3">
                        <button
                          className="btn btn-md"
                          data-bs-toggle="modal"
                          data-bs-target="#sidebarModal"
                        >
                          <svg
                            width={28}
                            height={28}
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.66604 5.64722C6.39997 5.64722 6.15555 5.7938 6.03024 6.02851C5.90494 6.26322 5.91914 6.54788 6.06718 6.76895L13.7378 18.2238V29.0346C13.7378 29.2945 13.8778 29.5343 14.1041 29.6622C14.3305 29.79 14.6081 29.786 14.8307 29.6518L17.9136 27.7927C18.13 27.6622 18.2622 27.4281 18.2622 27.1755V18.225L25.9316 6.76888C26.0796 6.5478 26.0938 6.26316 25.9685 6.02847C25.8432 5.79378 25.5987 5.64722 25.3327 5.64722H6.66604ZM15.0574 17.6037L8.01605 7.08866H23.9829L16.9426 17.6051C16.8631 17.7237 16.8207 17.8633 16.8207 18.006V26.7685L15.1792 27.7584V18.0048C15.1792 17.862 15.1368 17.7224 15.0574 17.6037Z"
                              fill="#8B0203"
                            />
                          </svg>
                        </button>
                      </div>
                     
                    
                      <div className="col-md-3">
                        <button
                          type="submit"
                          className="btn btn-md"
                          data-bs-toggle="modal"
                          data-bs-target="#settings"
                        >
                          <svg
                            width={22}
                            height={24}
                            viewBox="0 0 22 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.9985 7.45532C8.64565 7.45532 6.73828 9.36269 6.73828 11.7155C6.73828 14.0684 8.64565 15.9757 10.9985 15.9757C13.3514 15.9757 15.2587 14.0684 15.2587 11.7155C15.2587 9.36269 13.3514 7.45532 10.9985 7.45532ZM8.86838 11.7155C8.86838 10.5391 9.82208 9.58544 10.9985 9.58544C12.1749 9.58544 13.1286 10.5391 13.1286 11.7155C13.1286 12.892 12.1749 13.8457 10.9985 13.8457C9.82208 13.8457 8.86838 12.892 8.86838 11.7155Z"
                              fill="#8B0203"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.3416 2.97635C13.8887 -0.992103 8.10872 -0.992127 7.65577 2.97635L7.56116 3.80528C7.46818 4.61997 6.60664 5.12268 5.84081 4.79072L5.07295 4.45788C1.43655 2.88166 -1.52087 7.83752 1.73283 10.2351L2.40609 10.7312C3.07122 11.2213 3.07122 12.2099 2.40609 12.7L1.73283 13.1961C-1.52085 15.5936 1.43653 20.5496 5.07295 18.9733L5.84081 18.6405C6.60664 18.3085 7.46818 18.8113 7.56116 19.6259L7.65577 20.4549C8.10872 24.4233 13.8887 24.4233 14.3416 20.4549L14.4362 19.6259C14.5292 18.8113 15.3908 18.3085 16.1565 18.6405L16.9244 18.9733C20.5609 20.5495 23.5183 15.5936 20.2645 13.1961L19.5913 12.7C18.9262 12.2099 18.9262 11.2213 19.5913 10.7312L20.2645 10.2351C23.5183 7.83753 20.5609 2.88164 16.9244 4.45788L16.1566 4.79072C15.3908 5.12268 14.5292 4.61997 14.4362 3.8053L14.3416 2.97635ZM9.77214 3.2179C9.93768 1.76752 12.0597 1.7675 12.2252 3.2179L12.3198 4.04684C12.5762 6.29253 14.9347 7.64199 17.0037 6.74512L17.7716 6.41228C19.1548 5.81273 20.1484 7.67469 19.001 8.52023L18.3278 9.01632C16.5072 10.3578 16.5072 13.0734 18.3278 14.4149L19.001 14.911C20.1484 15.7566 19.1548 17.6185 17.7716 17.019L17.0037 16.686C14.9347 15.7891 12.5762 17.1386 12.3198 19.3843L12.2252 20.2133C12.0597 21.6636 9.93768 21.6638 9.77214 20.2133L9.67753 19.3843C9.42121 17.1386 7.06273 15.7891 4.99366 16.686L4.22578 17.019C2.84258 17.6185 1.84896 15.7566 2.99644 14.911L3.66969 14.4149C5.49017 13.0734 5.49015 10.3578 3.66969 9.01632L2.99642 8.52021C1.84898 7.67471 2.84256 5.81271 4.2258 6.4123L4.99366 6.74512C7.06273 7.64199 9.42121 6.29253 9.67753 4.04684L9.77214 3.2179Z"
                              fill="#8B0203"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button type="button" className="purple-btn2">
                      
                        Create MOR
                     
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

            {/* Settings Modal */}
            <Modal show={settingShow} onHide={handleSettingClose} dialogClassName="modal-right" className="setting-modal" backdrop={true}>
              <Modal.Header>
                <div className="container-fluid p-0">
                  <div className="border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <button type="button" className="btn" aria-label="Close" onClick={handleSettingClose}>
                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <Button style={{ textDecoration: "underline" }} variant="alert" onClick={handleResetColumns}>
                      Reset
                    </Button>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
                {allColumns.map((column) => (
                  <div className="row justify-content-between align-items-center mt-2" key={column.field}>
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
                <button className="purple-btn2" onClick={handleShowAll}>Show All</button>
                <button className="purple-btn1" onClick={handleHideAll}>Hide All</button>
              </Modal.Footer>
            </Modal>
           
          
          </div>
        </div>
      </div>

      {/* filter modal */}
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
      {/* filter modal end */}
      {/* Setting modal */}
    </>
  );
};

export default RopoMappingList;
