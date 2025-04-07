import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";

import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SelectBox,
  SettingIcon,
  StarIcon,
} from "../components";

import ButtonChnageIcon from "../components/common/Icon/ButtonChnageIcon";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import FormatDate from "../components/FormatDate";
import { useNavigate } from "react-router-dom";

const MaterialRejctionSlip = () => {
  const [tableData, setTableData] = useState([]); // Store API Data
  const [loading, setLoading] = useState(true); // Loading State
  const [error, setError] = useState(null); // Error Handling
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);

  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    company: true,
    project: true,
    subProject: true,
    rejectionSlipNo: true,
    poNo: true,
    challanNo: true,
    grnNo: true,
    grnDate: true,
    rejectionSlipDate: true,
    createdOn: true,
    morNo: true,
    materialType: true,
    subType: true,
    material: true,
    supplierName: true,
    defectiveQty: true,
    Remark: true,
    store: true,
    status: true,
    dueDate: true,
    overdue: true,
    dueAt: true,
  });

  const resetColumnVisibility = () => {
    setColumnVisibility({
      srNo: true,
      company: true,
      project: true,
      subProject: true,
      rejectionSlipNo: true,
      poNo: true,
      challanNo: true,
      grnNo: true,
      grnDate: true,
      rejectionSlipDate: true,
      createdOn: true,
      morNo: true,
      materialType: true,
      subType: true,
      material: true,
      supplierName: true,
      defectiveQty: true,
      Remark: true,
      store: true,
      status: true,
      dueDate: true,
      overdue: true,
      dueAt: true,
    });
  };

  const handleToggleChange = (colKey) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [colKey]: !prev[colKey],
    }));
  };

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);
  // Fetch Data from API

  const [activeTab, setActiveTab] = useState("rejection_slip"); // Default selection

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${baseURL}/mor_rejection_slips.json`);
  //       setTableData(response.data);
  //     } catch (error) {
  //       setError("Failed to fetch data!");
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const [counts, setCounts] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    draft: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_entries: 0,
  });
  const pageSize = 10; // Adjust as needed

  const fetchData = async (
    status = "",
    filters = {},
    page = 1,
    search = ""
  ) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${baseURL}/mor_rejection_slips.json`;
      const queryParams = [
        `token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
      ]; // Always include token

      // Apply filters dynamically
      if (filters.company) {
        queryParams.push(
          `q[good_receive_note_company_id_eq]=${filters.company}`
        );
      }
      if (filters.project) {
        queryParams.push(
          `q[good_receive_note_project_id_eq]=${filters.project}`
        );
      }
      if (filters.site) {
        queryParams.push(`q[good_receive_note_pms_site_id_eq]=${filters.site}`);
      }
      if (status) {
        queryParams.push(`q[status_eq]=${status}`);
      }
      if (page) {
        queryParams.push(`page=${page}`);
      }

      if (search) {
        queryParams.push(`search=${search}`);
      }

      // Append query parameters if any
      if (queryParams.length) {
        url += `?${queryParams.join("&")}`;
      }

      console.log("Fetching Data from URL:", url);

      const response = await axios.get(url);
      console.log("API Response:", response.data);

      setTableData(response.data.slips || []);
      setCounts({
        total: response.data.total_count || 0,
        accepted: response.data.accepted_count || 0,
        rejected: response.data.rejected_count || 0,
        draft: response.data.draft_count || 0, // Add draft count
      });

      setPagination({
        current_page: response.data.pagination.current_page,
        total_pages: response.data.pagination.total_pages,
        total_entries: response.data.pagination.total_count,
      });
    } catch (error) {
      setError("Failed to fetch data!");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rejection slips by default on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle tab selection
  const handleTabClick = (tab, status = "") => {
    setActiveTab(tab);
    fetchData(status);
  };

  const [filters, setFilters] = useState({
    company: null,
    project: null,
    site: null,
  });

  // Handle Company Change
  const handleCompanyChange = (selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      company: selectedOption ? selectedOption.value : null,
      project: null, // Reset project when company changes
      site: null, // Reset site when company changes
    }));

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

      setSiteOptions([]); // Reset sites when company changes
    }
  };

  // Handle Project Change
  const handleProjectChange = (selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      project: selectedOption ? selectedOption.value : null,
      site: null, // Reset site when project changes
    }));

    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === filters.company
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

  // Handle Site Change
  const handleSiteChange = (selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      site: selectedOption ? selectedOption.value : null,
    }));

    setSelectedSite(selectedOption);
  };

  const handleFilterSubmit = () => {
    // Set the active tab to "rejection_slip"
    setActiveTab("rejection_slip");
    fetchData("", filters);
  };

  const handleResetFilters = () => {
    setFilters({
      company: null,
      project: null,
      site: null,
    });

    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);

    fetchData(); // Fetch all data without filters
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchData("", filters, newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pagination.total_pages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const [searchTerm, setSearchTerm] = useState("");

  // const handleSearchChange = (event) => {
  //   const searchValue = event.target.value;
  //   setSearchTerm(searchValue);

  //   // Trigger the fetchData function with the search term
  //   fetchData(activeTab, filters, pagination.current_page, searchValue);
  // };
  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      // If the search bar is empty, reset the table
      fetchData();
    } else {
      // Otherwise, fetch data with the search term
      fetchData(activeTab, filters, pagination.current_page, searchValue);
    }
  };

  // const filteredData = tableData.filter((item) =>
  //   Object.values(item).some((value) =>
  //     value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  // );

  const navigate = useNavigate();

  return (
    <main className="h-100 w-100">
      <div className="main-content">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <a href="">
              Home &gt; Store &gt; Store Operations &gt; Material Rejection Slip
            </a>
            <h5 className="mt-3">Material Rejection Slip</h5>
            {/* <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row justify-content-center gap-4">
                  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                    <div className="content-box">
                      <h4 className="content-box-title">Rejection Slip List</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Accepted</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Rejected</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row justify-content-center gap-4">
                  {/* Rejection Slip List (Default Selected) */}
                  <div
                    className="col-md-2 text-center"
                    style={{
                      backgroundColor:
                        activeTab === "rejection_slip"
                          ? "#8b0203"
                          : "transparent",
                      color: activeTab === "rejection_slip" ? "#fff" : "#000",
                      cursor: "pointer",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    onClick={() => handleTabClick("rejection_slip")}
                  >
                    <div className="content-box">
                      <h4 className="content-box-title">Rejection Slip List</h4>
                      <p className="content-box-sub">{counts.total}</p>
                    </div>
                  </div>

                  <div
                    className="col-md-2 text-center"
                    style={{
                      backgroundColor:
                        activeTab === "draft" ? "#8b0203" : "transparent",
                      color: activeTab === "draft" ? "#fff" : "#000",
                      cursor: "pointer",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    onClick={() => handleTabClick("draft", "draft")}
                  >
                    <div className="content-box">
                      <h4 className="content-box-title">Draft</h4>
                      <p className="content-box-sub">{counts.draft}</p>
                    </div>
                  </div>

                  {/* Accepted */}
                  <div
                    className="col-md-2 text-center"
                    style={{
                      backgroundColor:
                        activeTab === "accepted" ? "#8b0203" : "transparent",
                      color: activeTab === "accepted" ? "#fff" : "#000",
                      cursor: "pointer",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    onClick={() => handleTabClick("accepted", "accepted")}
                  >
                    <div className="content-box">
                      <h4 className="content-box-title">Accepted</h4>
                      <p className="content-box-sub ">{counts.accepted}</p>
                    </div>
                  </div>

                  {/* Rejected */}
                  <div
                    className="col-md-2 text-center"
                    style={{
                      backgroundColor:
                        activeTab === "rejected" ? "#8b0203" : "transparent",
                      color: activeTab === "rejected" ? "#fff" : "#000",
                      cursor: "pointer",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    onClick={() => handleTabClick("rejected", "rejected")}
                  >
                    <div className="content-box">
                      <h4 className="content-box-title">Rejected</h4>
                      <p className="content-box-sub ">{counts.rejected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3 pb-4">
              <div className="card-body  mt-2">
                <CollapsibleCard title="Quick Filter">
                  <div>
                    <div className="row my-2 align-items-end">
                      {/* Event Title */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="event-title-select">Company</label>

                          <SingleSelector
                            options={companyOptions}
                            // onChange={(selectedOption) =>
                            //   handleFilterChange("company", selectedOption?.value)
                            // }
                            // value={
                            //   filters.company
                            //     ? companyOptions.find(
                            //         (opt) => opt.value === filters.company
                            //       )
                            //     : null
                            // }
                            onChange={handleCompanyChange}
                            value={selectedCompany}
                            placeholder="Select Company"
                            isSearchable={true}
                          />
                        </div>
                      </div>

                      {/* Event Number */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="event-no-select">Project</label>

                          <SingleSelector
                            options={projects}
                            // onChange={(selectedOption) =>
                            //   handleFilterChange("project", selectedOption?.value)
                            // }
                            // value={
                            //   filters.project
                            //     ? projects.find(
                            //         (opt) => opt.value === filters.project
                            //       )
                            //     : null
                            // }
                            onChange={handleProjectChange}
                            value={selectedProject}
                            placeholder="Select Project"
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="event-no-select"> Sub Project</label>

                          <SingleSelector
                            options={siteOptions}
                            // onChange={(selectedOption) =>
                            //   handleFilterChange("site", selectedOption?.value)
                            // }
                            // value={
                            //   filters.site
                            //     ? siteOptions.find(
                            //         (opt) => opt.value === filters.site
                            //       )
                            //     : null
                            // }
                            onChange={(option) => setSelectedSite(option)}
                            value={selectedSite}
                            placeholder="Select Sub-project"
                          />
                        </div>
                      </div>

                      {/* Status */}

                      <button
                        type="submit"
                        className="col-md-1 purple-btn2 ms-4 mt-5"
                        onClick={handleFilterSubmit}
                      >
                        Go{" "}
                      </button>

                      <button
                        className="col-md-1 purple-btn2 ms-2 mt-4"
                        onClick={handleResetFilters}
                      >
                        Reset
                      </button>
                    </div>
                    {/* </form> */}
                  </div>
                </CollapsibleCard>
                {/* <div className="card mx-3 collapsed-card"> */}
                <CollapsibleCard
                  title="Bulk Action"
                  isInitiallyCollapsed={true}
                >
                  <div className="card-body mt-0 pt-0">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>From Status</label>
                          <SingleSelector
                            name="from_status"
                            id="from_status"
                            className="form-control from"
                            options={[
                              { value: "", label: "Select Status" },
                              { value: "draft", label: "Draft" },
                              {
                                value: "send_for_approval",
                                label: "Sent For Approval",
                              },
                            ]}
                            onChange={(selectedOption) =>
                              console.log("From Status:", selectedOption)
                            }
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label>To Status</label>
                          <SingleSelector
                            name="to_status"
                            id="to_status"
                            className="form-control to"
                            options={[
                              { value: "", label: "Select Status" },
                              { value: "draft", label: "Draft" },
                              {
                                value: "send_for_approval",
                                label: "Sent For Approval",
                              },
                            ]}
                            onChange={(selectedOption) =>
                              console.log("To Status:", selectedOption)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Remark</label>
                          <textarea
                            className="form-control remark"
                            rows={4}
                            placeholder="Enter ..."
                          />
                        </div>
                      </div>
                      <div className="offset-md-1 col-md-2">
                        <button className="purple-btn2 m-0 status">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </CollapsibleCard>

                <div className="d-flex mt-3 align-items-end px-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        id="searchInput"
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoComplete="off" // Disable browser's default cross button
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-md btn-default"
                          onClick={() =>
                            fetchData(
                              activeTab,
                              filters,
                              pagination.current_page,
                              searchTerm
                            )
                          }
                        >
                          <SearchIcon />
                        </button>
                        {searchTerm && (
                          <button
                            type="button"
                            className="btn btn-md btn-default"
                            onClick={() => {
                              setSearchTerm(""); // Clear the search term
                              fetchData();
                              // activeTab,
                              // filters,
                              // pagination.current_page,
                              // "" // Fetch data without search
                            }}
                          >
                            ✕ {/* Cross icon */}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row justify-content-end">
                      <div className="col-md-5">
                        <div className="row justify-content-end px-3">
                          <div className="col-md-3">
                            <button
                              type="submit"
                              className="btn btn-md"
                              data-bs-toggle="modal"
                              data-bs-target="#settings"
                            >
                              <SettingIcon></SettingIcon>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                  </div>
                </div>
                <div
                  className="tbl-container mt-3
              
              "
                >
                  <table className="w-100 table  ">
                    {loading ? (
                      <p>Loading data...</p>
                    ) : error ? (
                      <p className="text-danger">{error}</p>
                    ) : (
                      <>
                        <thead
                          // style={{
                          //   maxWidth: "100%",
                          //   overflowX: "auto",
                          //   paddingRight: "20px",
                          // }}
                          style={{
                            position: "sticky",
                            top: "0",
                            zIndex: 1020, // Keeps the header above the table body but below modal
                            background: "#fff", // Ensures readability
                            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)", // Adds slight shadow for distinction
                          }}
                        >
                          <tr>
                            {columnVisibility.srNo && <th>Sr. No.</th>}
                            {columnVisibility.company && <th>Company</th>}
                            {columnVisibility.project && <th>Project</th>}
                            {columnVisibility.subProject && (
                              <th>Sub Project</th>
                            )}
                            {columnVisibility.rejectionSlipNo && (
                              <th>Rejection Slip No.</th>
                            )}
                            {columnVisibility.poNo && <th>PO No.</th>}
                            {columnVisibility.challanNo && <th>Challan No.</th>}
                            {columnVisibility.grnNo && <th>GRN No.</th>}
                            {columnVisibility.grnDate && <th>GRN Date</th>}
                            {columnVisibility.rejectionSlipDate && (
                              <th>Rejection Date</th>
                            )}
                            {columnVisibility.createdOn && <th>Created On</th>}
                            {columnVisibility.morNo && <th>MOR No.</th>}
                            {columnVisibility.materialType && (
                              <th>Material Type</th>
                            )}
                            {columnVisibility.subType && <th>Sub Type</th>}
                            {columnVisibility.material && <th>Material</th>}
                            {columnVisibility.supplierName && (
                              <th>Supplier Name</th>
                            )}
                            {columnVisibility.defectiveQty && (
                              <th>Defective Qty</th>
                            )}
                            {columnVisibility.Remark && <th> Remark</th>}
                            {columnVisibility.store && <th>Store</th>}
                            {columnVisibility.status && <th>Status</th>}
                            {columnVisibility.dueDate && <th>Due Date</th>}
                            {columnVisibility.overdue && <th>Overdue</th>}
                            {columnVisibility.dueAt && <th>Due At</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.length > 0 ? (
                            tableData.map((item, index) => (
                              <tr key={item.id}>
                                {/* {columnVisibility.srNo && <td>{index + 1}</td>} */}
                                <td>
                                  {(pagination.current_page - 1) * pageSize +
                                    index +
                                    1}
                                </td>
                                {columnVisibility.company && (
                                  <td>{item.company}</td>
                                )}
                                {columnVisibility.project && (
                                  <td>{item.project}</td>
                                )}
                                {columnVisibility.subProject && (
                                  <td>{item.sub_project}</td>
                                )}
                                {/* {columnVisibility.rejectionSlipNo && (
                                <td>{item.rejection_slip_number}</td>
                              )} */}

                                {columnVisibility.rejectionSlipNo && (
                                  <td
                                    style={{
                                      cursor: "pointer",
                                      color: "#8b0203",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/material-rejection-slip-create/${item.id}`
                                      )
                                    }
                                  >
                                    {item.rejection_slip_number}
                                  </td>
                                )}

                                {columnVisibility.poNo && (
                                  <td>{item.po_number}</td>
                                )}
                                {columnVisibility.challanNo && (
                                  <td>{item.challan_number}</td>
                                )}
                                {columnVisibility.grnNo && (
                                  <td>{item.grn_number}</td>
                                )}
                                {columnVisibility.grnDate && (
                                  // <td>{item.grn_date}</td>
                                  <td>
                                    <FormatDate timestamp={item.grn_date} />
                                  </td>
                                )}
                                {columnVisibility.rejectionSlipDate && (
                                  // <td>{item.rejection_slip_date}</td>
                                  <td>
                                    <FormatDate
                                      timestamp={item.rejection_slip_date}
                                    />
                                  </td>
                                )}
                                {columnVisibility.createdOn && (
                                  // <td>
                                  //   {new Date(
                                  //     item.created_on
                                  //   ).toLocaleDateString()}
                                  // </td>
                                  <td>
                                    <FormatDate timestamp={item.created_on} />
                                  </td>
                                )}
                                {columnVisibility.morNo && (
                                  <td
                                  // style={{
                                  //   cursor: "pointer",
                                  //   color: "#8b0203",
                                  //   textDecoration: "underline",
                                  // }}
                                  // onClick={() =>
                                  //   navigate(
                                  //     `/material-rejection-slip-create/${item.id}`
                                  //   )
                                  // }
                                  >
                                    {item.mor_number}
                                  </td>
                                )}
                                {columnVisibility.materialType && (
                                  <td>{item.material_type}</td>
                                )}
                                {columnVisibility.subType && (
                                  <td>{item.sub_type}</td>
                                )}
                                {columnVisibility.material && (
                                  <td>{item.material}</td>
                                )}
                                {columnVisibility.supplierName && (
                                  <td>{item.supplier_name}</td>
                                )}
                                {columnVisibility.defectiveQty && (
                                  <td>{item.defective_qty}</td>
                                )}
                                {columnVisibility.Remark && (
                                  <td>{item.defective_remark}</td>
                                )}
                                {columnVisibility.store && (
                                  <td>{item.store || "N/A"}</td>
                                )}
                                {/* {columnVisibility.status && (
                                <td>{item.status}</td>
                              )} */}
                                {columnVisibility.status && (
                                  <td>
                                    {item.status.charAt(0).toUpperCase() +
                                      item.status.slice(1)}
                                  </td>
                                )}

                                {columnVisibility.dueDate && (
                                  // <td>{item.due_date || "N/A"}</td>
                                  <td>
                                    <FormatDate timestamp={item.due_at} />
                                  </td>
                                )}
                                {columnVisibility.overdue && (
                                  <td>{item.overdue || "N/A"}</td>
                                )}
                                {columnVisibility.dueAt && (
                                  <td>{item.due_at || "N/A"}</td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="23" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </>
                    )}
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                  <ul className="pagination justify-content-center d-flex">
                    {/* First Page */}
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                      >
                        First
                      </button>
                    </li>

                    {/* Previous Page */}
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                      >
                        Prev
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          pagination.current_page === pageNumber ? "active" : ""
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

                    {/* Next Page */}
                    <li
                      className={`page-item ${
                        pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                      >
                        Next
                      </button>
                    </li>

                    {/* Last Page */}
                    <li
                      className={`page-item ${
                        pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.total_pages)}
                      >
                        Last
                      </button>
                    </li>
                  </ul>

                  {/* Showing Entries Info */}
                  <div>
                    <p>
                      Showing{" "}
                      {Math.min(
                        (pagination.current_page - 1) * pageSize + 1,
                        pagination.total_entries
                      )}{" "}
                      to{" "}
                      {Math.min(
                        pagination.current_page * pageSize,
                        pagination.total_entries
                      )}{" "}
                      of {pagination.total_entries} entries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          s{/* filter modal */}
        </div>
      </div>
      <div className="modal fade" id="settings" tabIndex="1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header d-flex justify-content-between">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <h4 className="modal-title text-center flex-grow-1">Layout</h4>

              <button
                className="btn btn-link text-danger"
                onClick={resetColumnVisibility}
              >
                Reset
              </button>
            </div>

            {/* Modal Body with Inline Scrolling */}
            <div
              className="modal-body"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {Object.keys(columnVisibility).map((colKey, index) => {
                // Format column names for readability
                const formattedLabel =
                  colKey === "srNo"
                    ? "Sr. No."
                    : colKey
                        .replace(/([A-Z])/g, " $1") // Add space before capital letters
                        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                        .trim();

                return (
                  <div
                    className="row justify-content-between align-items-center mt-2"
                    key={index}
                  >
                    <div className="col-md-8">
                      <label className="ms-2">{formattedLabel}</label>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check form-switch mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={columnVisibility[colKey]}
                          onChange={() => handleToggleChange(colKey)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MaterialRejctionSlip;
