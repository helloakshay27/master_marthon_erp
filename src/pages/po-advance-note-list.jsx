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

const PoAdvanceNoteList = () => {
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
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
      let url = `${baseURL}advance_notes?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

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
      setCreditNotes(data);

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

    if (selectedIds.length === 0) {
      alert("Please select at least one advance note");
      return;
    }

    if (!toStatus) {
      alert("Please select a target status");
      return;
    }

    try {
      const response = await axios.patch(
        `${baseURL}advance_notes/update_bulk_status?token=2e86c08136922760d29d4fee6b8ccfccd5f4547d2868ed31`,
        {
          advance_note_ids: selectedIds,
          to_status: toStatus,
          comments: remark,
        }
      );

      console.log("API Response:", response.data); // Debugging: Log the response

      // Check for success based on the presence of a success field or other indicators
      if (response.data.success || response.status === 200) {
        // Refresh the table data
        fetchTableData();
        // Reset form
        setSelectedIds([]);
        setToStatus("");
        setFromStatus("");
        setRemark("");
        alert(response.data.message || "Bulk status update successful"); // Use default message if undefined
      } else {
        alert(response.data.message || "Failed to update status"); // Use default error message if undefined
      }
    } catch (error) {
      console.error("Error updating bulk status:", error);
      alert("Error updating status. Please try again.");
    }
  };
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
              <div className="tbl-container mx-3 mt-3" style={{ width: "98%" }}>
                <table
                  style={{
                    width: "max-content",
                    maxHeight: "max-content",
                    height: "auto",
                  }}
                >
                  <thead>
                    <tr>
                      <th className="text-start">
                        <input
                          type="checkbox"
                          checked={selectAll} // Bind to "select all" state
                          onChange={handleSelectAllChange} // Handle "select all" change
                        />
                      </th>
                      <th className="text-start">Sr.No.</th>
                      <th className="text-start">Company</th>
                      <th className="text-start">Project</th>
                      {/* <th className="text-start">Sub-Project</th> */}
                      <th className="text-start">Debit Note No.</th>
                      <th className="text-start">Date</th>
                      <th className="text-start">Credit Note Type</th>
                      <th className="text-start">Created On</th>
                      <th className="text-start">PO No.</th>
                      <th className="text-start">PO Date</th>
                      <th className="text-start">PO Value</th>
                      <th className="text-start">Supplier Name</th>
                      <th className="text-start">GSTIN No.</th>
                      <th className="text-start">PAN No.</th>
                      <th className="text-start">Debit Note Amount</th>
                      <th className="text-start">Deduction Tax</th>
                      <th className="text-start">Addition Tax</th>
                      <th className="text-start">Total Amount</th>
                      <th className="text-start">Status</th>
                      <th className="text-start">Due Date</th>
                      <th className="text-start">Overdue</th>
                      <th className="text-start">Due At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="23" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="23" className="text-center text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : paginatedData.length > 0 ? (
                      paginatedData.map((note, index) => (
                        <tr key={note.id}>
                          <td className="text-start">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(note.id)}
                              onChange={() => handleCheckboxChange(note.id)}
                            />
                          </td>
                          <td className="text-start">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="text-start">{note.company_name}</td>
                          <td className="text-start">{note.project_name}</td>
                          {/* <td className="text-start">-</td> */}
                          {/* <td className="text-start">
                            {note.advance_number || "-"}
                          </td> */}

                          <td className="text-start">
                            <Link to={`/po-advance-note-details/${note.id}`}>
                              {note.advance_number || "-"}
                            </Link>
                          </td>
                          <td className="text-start">
                            {note.invoice_date
                              ? new Date(note.invoice_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">
                            {note.payment_mode || ""}
                          </td>
                          <td className="text-start">
                            {note.created_at
                              ? new Date(note.created_at).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">
                            {note.po_number || "-"}
                          </td>
                          <td className="text-start">
                            {note.po_date
                              ? new Date(note.po_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">{note.po_value || "-"}</td>
                          <td className="text-start">
                            {note.supplier_name || "-"}
                          </td>
                          <td className="text-start">{note.gstin || "-"}</td>
                          <td className="text-start">{note.pan_no || "-"}</td>
                          <td className="text-start">
                            {note.advance_amount || "-"}
                          </td>
                          <td className="text-start">-</td>
                          <td className="text-start">-</td>
                          <td className="text-start">
                            {note.net_payable || "-"}
                          </td>
                          <td className="text-start">{note.status || "-"}</td>
                          <td className="text-start">
                            {note.expected_payment_date
                              ? new Date(
                                  note.expected_payment_date
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">-</td>
                          <td className="text-start">-</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="23" className="text-center">
                          No advance notes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                <ul className="pagination justify-content-center d-flex">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(index + 1)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
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
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </li>
                </ul>
                <div>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}
                  {totalEntries} entries
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal
        centered
        size="lg"
        show={filterModal}
        onHide={closeFilterModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add</Modal.Title>
        </Modal.Header>
        <div
          className="modal-body"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Company</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Project</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Sub Project</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Debit Note No.</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Date From 7 to</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Created on From &amp; To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Dabit Note Type</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Created on From &amp; To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>PO No.</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>PO Date</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>PO Value</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>GSTIN No.</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>PAN No.</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Debit Note Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Deduction Tax</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Payable Amount</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Addition Tax </label>
                <div className="">
                  <input
                    className="form-control"
                    type="text"
                    placeholder=""
                    fdprocessedid="qv9ju9"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Total Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Status</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Due Date From &amp; To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Overdue</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Due At</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
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
      </Modal> */}

      <Modal
        centered
        size="sm"
        show={layoutModal}
        onHide={closeLayoutModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-between align-items-center">
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
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
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
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
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
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
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
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
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
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PoAdvanceNoteList;
