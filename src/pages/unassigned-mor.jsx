import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "../components/base/Select/Select";
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SelectBox,
  SettingIcon,
  StarIcon,
} from "../components";
import FormatDate from "../components/FormatDate";

const UnassignedMor = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedMORs, setSelectedMORs] = useState([]); //  Track selected MORs
  const [operators, setOperators] = useState([]); //  Store operators for "Assigned To" dropdown
  const [selectedOperator, setSelectedOperator] = useState(null); //
  // const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null); // Separate state

  const [searchTerm, setSearchTerm] = useState("");

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

    axios
      .get(
        `${baseURL}/users/site_users.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        console.log(response.data, "Response Users");

        const operatorsData = response.data || []; // Handle undefined case

        setOperators(
          operatorsData.map((op) => ({
            value: op.id, // Ensure ID is correctly assigned
            label: op.full_name, // Ensure full_name is correct
          }))
        );
      })
      .catch((error) => console.error("Error fetching operators:", error));
  }, []);

  const handleUpdate = async () => {
    if (
      selectedMORs.length === 0 ||
      !selectedOperator ||
      !selectedOperator.value
    ) {
      alert("Please select at least one MOR and an operator.");
      return;
    }

    const payload = {
      mor_ids: selectedMORs, // Array of selected MOR IDs
      operator_id: selectedOperator.value, // Ensure this is defined
    };

    console.log("Payload:", payload); // Debug before sending request

    try {
      const response = await axios.post(
        `${baseURL}/material_order_requests/update_operator.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      alert("MORs updated successfully!");
      setSelectedMORs([]); // Reset selection
      setSelectedOperator(null); // Reset operator
    } catch (error) {
      console.error("Error updating MORs:", error);
      alert("Failed to update MORs.");
    }
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options

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

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

    setSiteOptions([]); // Reset site options

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

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);

    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        site_id: selectedOption.value, // Update formData with site_id
      }));
    }
  };
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const [morList, setMorList] = useState([]); // State for storing table data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Unassigned MOR List
  const [pagination, setPagination] = useState({
    total_entries: 0,
    total_pages: 0,
    current_page: 1,
  });

  // const [morList, setMorList] = useState([]); // To store MOR data

  const fetchMORList = async (page = pagination.current_page) => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      queryParams.append("page", page);
      if (searchTerm) queryParams.append("q[name_cont]", searchTerm);

      const response = await axios.get(
        `${baseURL}/material_order_requests/unassigned_mor_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}`
      );
      const data = response.data;

      setMorList(data.material_order_requests || []);
      setPagination((prev) => ({
        ...prev,
        total_entries: data.total_entries,
        total_pages: data.total_pages,
      }));
    } catch (err) {
      console.error("Error fetching MOR list:", err);
      setError("Failed to load MOR data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMORList();
  }, [pagination.current_page]); // Fetch on current page change
  const [filters, setFilters] = useState({
    company: null,
    project: null,
    site: null,
  });

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));

    if (field === "company") {
      // Reset project and sub-project when company changes
      setFilters((prev) => ({ ...prev, project: null, site: null }));
      setSiteOptions([]); // Reset sub-projects

      const selectedCompanyData = companies.find(
        (company) => company.id === value
      );

      if (selectedCompanyData) {
        const filteredProjects = selectedCompanyData.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }));
        setProjects(filteredProjects);
      } else {
        setProjects([]); // No projects available
      }
    }

    if (field === "project") {
      // Reset sub-project when project changes
      setFilters((prev) => ({ ...prev, site: null }));

      const selectedCompanyData = companies.find(
        (company) => company.id === filters.company
      );
      if (selectedCompanyData) {
        const selectedProjectData = selectedCompanyData.projects.find(
          (prj) => prj.id === value
        );

        if (selectedProjectData) {
          const filteredSites = selectedProjectData.pms_sites.map((site) => ({
            value: site.id,
            label: site.name,
          }));
          setSiteOptions(filteredSites);
        } else {
          setSiteOptions([]); // No sub-projects available
        }
      }
    }
  };

  // Function to fetch filtered MOR List
  const fetchFilteredMORList = async () => {
    let queryParams = new URLSearchParams();

    if (filters.company)
      queryParams.append("q[company_id_eq]", filters.company);
    if (filters.project)
      queryParams.append("q[project_id_eq]", filters.project);
    if (filters.site) queryParams.append("q[pms_site_id_eq]", filters.site);
    if (selectedOperator)
      queryParams.append("q[operator_id_eq]", selectedOperator);

    const apiUrl = `${baseURL}/material_order_requests/unassigned_mor_list.json?${queryParams.toString()}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    try {
      const response = await axios.get(apiUrl);
      setMorList(response.data.material_order_requests || []);
      setPagination({
        ...pagination,
        total_entries: response.data.total_entries || 0,
      });
    } catch (error) {
      console.error("Error fetching filtered MOR data:", error);
    }
  };

  // Handle filter submit (Go Button)
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredMORList();
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: 1, // Reset to first page for new search
    }));
    fetchMORList(1);
  };

  const handleResetFilters = async () => {
    setFilters({
      company: null,
      project: null,
      site: null,
    });

    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedOperator(null); // ✅ Reset operator selection

    // Reset pagination to the first page
    setPagination((prev) => ({
      ...prev,
      current_page: 1, // Reset to first page
    }));

    // Fetch updated data
    await fetchMORList(1); // Pass page 1 explicitly
  };

  const pageSize = 10;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.total_pages) {
      setPagination((prev) => ({
        ...prev,
        current_page: pageNumber,
      }));
    }
  };

  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(1, pagination.current_page - 2);
    let end = Math.min(pagination.total_pages, pagination.current_page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleMORSelection = (morId) => {
    setSelectedMORs((prevSelected) =>
      prevSelected.includes(morId)
        ? prevSelected.filter((id) => id !== morId)
        : [...prevSelected, morId]
    );
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMORs([]); // Deselect all
    } else {
      const allIds = morList.map((mor) => mor.id);
      setSelectedMORs(allIds); // Select all MOR IDs
    }
    setSelectAll(!selectAll);
  };

  return (
    <div>
      <div className="main-content">
        <div className="website-content " style={{ overflowY: "auto" }}>
          <div className="module-data-section p-4">
            <a href="">
              Home &gt; Purchase &gt; Procurement &gt; Unassigned MOR
            </a>
            <h5 className="mt-4">Unassigned MOR</h5>
            <div className="material-boxes mt-3 separteinto5">
              <div className="container-fluid">
                <div className="row  justify-content-between">
                  <div className="col-md-2 text-center ">
                    <div
                      className="content-box tab-button active"
                      data-tab="total"
                    >
                      <h4 className="content-box-title">Unassigned MOR's</h4>
                      <p className="content-box-sub">
                        {pagination.total_entries}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Total Content Here */}
            <div className="card mt-3 pb-4" style={{ overflow: "hidden" }}>
              <CollapsibleCard title="Quick Filter">
                <div>
                  <div className="row my-2 align-items-end">
                    {/* Event Title */}
                    <div className="col-md-2">
                      <label htmlFor="event-title-select">Company</label>

                      {/* <SingleSelector
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder={`Select Company`} // Dynamic placeholder
                        isSearchable={true}
                      /> */}
                      <SingleSelector
                        options={companyOptions}
                        onChange={(selectedOption) =>
                          handleFilterChange("company", selectedOption?.value)
                        }
                        value={
                          filters.company
                            ? companyOptions.find(
                                (opt) => opt.value === filters.company
                              )
                            : null
                        }
                        placeholder="Select Company"
                        isSearchable={true}
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-2">
                      <label htmlFor="event-no-select">Project</label>

                      {/* <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      /> */}
                      <SingleSelector
                        options={projects}
                        onChange={(selectedOption) =>
                          handleFilterChange("project", selectedOption?.value)
                        }
                        value={
                          filters.project
                            ? projects.find(
                                (opt) => opt.value === filters.project
                              )
                            : null
                        }
                        placeholder="Select Project"
                      />
                    </div>

                    <div className="col-md-2">
                      <label htmlFor="event-no-select"> Sub Project</label>
                      {/* <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      /> */}
                      <SingleSelector
                        options={siteOptions}
                        onChange={(selectedOption) =>
                          handleFilterChange("site", selectedOption?.value)
                        }
                        value={
                          filters.site
                            ? siteOptions.find(
                                (opt) => opt.value === filters.site
                              )
                            : null
                        }
                        placeholder="Select Sub-project"
                      />
                    </div>

                    {/* Status */}
                    <div className="col-md-2">
                      <label htmlFor="status-select">Assigned to</label>

                      <SingleSelector
                        id="status-select"
                        options={operators}
                        // onChange={setSelectedOperator}
                        // value={selectedOperator}
                        onChange={(selectedOption) =>
                          setSelectedOperator(selectedOption?.value)
                        } // Update state
                        value={
                          operators.find(
                            (opt) => opt.value === selectedOperator
                          ) || null
                        }
                        placeholder="Select Sub-project"
                        isClearable
                      />
                    </div>

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

              <div className="d-flex mt-3 align-items-end px-3">
                <div className="col-md-6 mt-3">
                  {/* <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
                        <SearchIcon />
                      </button>
                    </div>
                  </div> */}

                  <div className="input-group">
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
                        type="button"
                        className="btn btn-md btn-default"
                        onClick={() => handleSearch()}
                      >
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 ">
                  <div className="row justify-content-end align-items-end">
                    <div className="col-md-3 me-2">
                      <div className="row justify-content-end px-3">
                        {/* <div className="col-md-3">
                          <button
                            className="btn btn-md"
                            data-bs-toggle="modal"
                            data-bs-target="#sidebarModal"
                          >
                            <FilterIcon />
                          </button>
                        </div> */}
                        {/* <div className="col-md-3">
                          <button type="submit" className="btn btn-md">
                            <StarIcon />
                          </button>
                        </div> */}
                        {/* <div className="col-md-3">
                          <button
                            id="downloadButton"
                            type="submit"
                            className="btn btn-md"
                          >
                            <DownloadIcon />
                          </button>
                        </div> */}
                        {/* <div className="col-md-3">
                          <button
                            type="submit"
                            className="btn btn-md"
                            data-bs-toggle="modal"
                            data-bs-target="#settings"
                          >
                            <SettingIcon />
                          </button>
                        </div> */}
                      </div>
                    </div>
                    <div className="col-md-5 d-flex align-items-center mb-1">
                      <label htmlFor="" className="me-3 mt-2 text-nowrap ">
                        Assigned To
                      </label>
                      <SingleSelector
                        options={operators}
                        onChange={setSelectedOperator}
                        // Separate handler
                        value={selectedOperator}
                        placeholder="Select Operator"
                        // styles={{
                        //   control: (provided) => ({
                        //     ...provided,
                        //     fontSize: "12px", // Reduce font size of selected value
                        //     minHeight: "30px", // Reduce height if needed
                        //   }),
                        //   singleValue: (provided) => ({
                        //     ...provided,
                        //     fontSize: "12px", // Reduce font size of the selected option
                        //   }),
                        //   menu: (provided) => ({
                        //     ...provided,
                        //     fontSize: "14px", // Keep dropdown options readable
                        //   }),
                        // }}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="purple-btn2 mt-3 "
                        style={{
                          height: "35px",
                          minWidth: "40x",
                          marginTop: "5px",
                        }} // Match height & width
                        onClick={handleUpdate} // Call handleUpdate on click
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tbl-container m-4   mt-4 ms-3">
                <div
                  style={{
                    maxWidth: "100%",
                    overflowX: "auto",
                    paddingRight: "20px",
                  }}
                >
                  <table className="w-100 table-bordered">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>Sr.No.</th>
                        <th>Company</th>
                        <th>Project</th>
                        <th>Sub-Project</th>
                        <th>MOR No.</th>
                        <th>Approved Date</th>
                        <th>Scheduled Date</th>
                        <th>Priority</th>
                        <th>Ageing</th>
                        <th>Sub-Type</th>
                        <th>Assigned to</th>
                        <th>Material</th>
                        <th>UOM</th>
                        <th> MOR Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="15" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="15" className="text-center text-danger">
                            {error}
                          </td>
                        </tr>
                      ) : morList.length > 0 ? (
                        morList.map((mor, index) => (
                          <tr key={mor.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedMORs.includes(mor.id)}
                                onChange={() => handleMORSelection(mor.id)}
                              />
                            </td>
                            {/* <td>{index + 1}</td> */}
                            <td>
                              {(pagination.current_page - 1) * pageSize +
                                index +
                                1}
                            </td>{" "}
                            {/* Adjust index based on page */}
                            <td>{mor.company}</td>
                            <td>{mor.project}</td>
                            <td>{mor.sub_project}</td>
                            <td>{mor.mor_number}</td>
                            <td>
                              <FormatDate timestamp={mor.created_at} />
                            </td>
                            <td>
                              <FormatDate timestamp={mor.updated_at} />
                            </td>
                            <td>{mor.priority || "Normal"}</td>
                            <td>{mor.ageing}</td>
                            <td>{mor.material_sub_type || "N/A"}</td>
                            <td>{mor.assigned_to || "Unassigned"}</td>
                            <td>{mor.material || "N/A"}</td>
                            <td>{mor.uom || "N/A"}</td>
                            <td>{mor.qty || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15" className="text-center">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                <ul className="pagination justify-content-center d-flex">
                  {/* First Button */}
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

                  {/* Previous Button */}
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
                      disabled={pagination.current_page === 1}
                    >
                      Prev
                    </button>
                  </li>

                  {/* Dynamic Page Numbers */}
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

                  {/* Next Button */}
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
                      disabled={
                        pagination.current_page === pagination.total_pages
                      }
                    >
                      Next
                    </button>
                  </li>

                  {/* Last Button */}
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
                      disabled={
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
                      (pagination.current_page - 1) * pageSize + 1 || 1,
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
        {/* </div> */}
        <div
          className="modal fade"
          id="exampleModal2"
          tabIndex={-1}
          aria-labelledby="exampleModal2Label"
          style={{ display: "none" }}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header modal-header-k">
                <h4
                  className="modal-title text-center w-100"
                  id="exampleModalLabel"
                  style={{ fontWeight: 500 }}
                >
                  Filters
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                      <label>Company </label>
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
                      <label>Project </label>
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
                      <label>Sub-project </label>
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
                  <div className="col-md-4">
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
              <div className="modal-header  border-0">
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button "
                    className="btn "
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
                  className="resetCSS "
                  style={{
                    fontSize: 14,
                    textDecoration: "underline !important",
                  }}
                  href="#"
                >
                  Reset
                </a>
              </div>
              <div className="modal-body" style={{ overflowY: "scroll" }}>
                <div className="row">
                  <div className="row mt-2  px-2 ">
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
        <div
          className="modal fade"
          id="settings"
          tabIndex={-1}
          aria-labelledby="exampleModal2Label"
          style={{ display: "none" }}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-sm">
            <div className="modal-content">
              <div className="modal-header modal-header-k">
                <h4
                  className="modal-title text-center w-100"
                  id="exampleModalLabel"
                  style={{ fontWeight: 500 }}
                >
                  Layout
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
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
              </div>
            </div>
          </div>
        </div>
        {/* Setting modal End*/}
      </div>
    </div>
  );
};

export default UnassignedMor;
