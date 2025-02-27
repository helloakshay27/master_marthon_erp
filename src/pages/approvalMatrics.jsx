import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { QuickFilter } from "../components";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { SingleValue } from "react-select/animated";
import { baseURL } from "../confi/apiDomain";

const ApprovalMatrics = () => {
  const [approvals, setApprovals] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  // const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [wingsOptions, setWingsOptions] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  // const [selectedTemplates, setSelectedTemplates] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // Track selected module
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const [selectedDeparment, setSelectedDeparment] = useState(null);

  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    sites: [],
    departments: [],

    modules: [],
    material_types: [],
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
  });

  const pageSize = 8;

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/invoice_approval");
  };

  const modifiedFilterOptions = {
    departments: [
      { label: "Select Department", value: "" },
      ...(filterOptions.departments || []), // Safeguard against undefined or null departments
    ],
    subprojects: [
      { label: "Select Subproject", value: "" },
      ...(filterOptions.subprojects || []), // Safeguard against undefined or null subprojects
    ],
    modules: [
      { label: "Select Module", value: "" },
      ...(filterOptions.modules || []), // Safeguard against undefined or null modules
    ],
    material_types: [
      // Only add default if it's not already present
      ...(filterOptions.material_types?.some(
        (opt) => opt.label === "Select Material Type"
      )
        ? filterOptions.material_types
        : [
            { label: "Select Material Type", value: "" },
            ...(filterOptions.material_types || []),
          ]),
    ],
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch(
          `${baseURL}/pms/admin/invoice_approvals.json?q[approval_type_not_eq]=vendor_category&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${pagination.current_page}&page_size=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("uiah", response.data);
        setApprovals(data.invoice_approvals || []);
        // setTotalRecords(data.total_records || 0); // Set total records
        // setTotalPages(data.total_pages || 0); // Set total pages
        setPagination({
          current_page: data.current_page || 1,
          total_pages: data.total_pages || 1, // Ensure `total_pages` is always defined
          total_count: data.total_records || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [pagination.current_page]);

  // const handleEditClick = () => {
  //   navigate("/approval_edit");
  // };

  const handleEditClick = (id) => {
    navigate(`/approval_edit/${id}`);
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // const response = await fetch(
        //   "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        // );
        const [dropdownResponse, materialTypeResponse] = await Promise.all([
          fetch(
            `${baseURL}/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
          fetch(
            `${baseURL}/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
        ]);
        // if (!response.ok) throw new Error("Failed to fetch dropdown data");

        // const data = await response.json();
        if (!dropdownResponse.ok || !materialTypeResponse.ok) {
          throw new Error("Failed to fetch dropdown data or material types");
        }

        const dropdownData = await dropdownResponse.json();

        const materialTypesData = await materialTypeResponse.json();

        console.log("materialsss", materialTypesData);

        // Safeguard to check if material_types exists
        const materialTypes = materialTypesData.material_types || [];
        console.log("modifuiees", modifiedFilterOptions); // Check if material_types is correctly set
        setFilterOptions({
          departments: dropdownData.departments.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          modules: dropdownData.approval_types
            ? Object.entries(dropdownData.approval_types).map(
                ([key, value]) => ({
                  label: key.replace(/_/g, " "), // Format the label (e.g., "material_order_request" → "Material Order Request")
                  value: value, // Assign the corresponding value
                })
              )
            : [],

          material_types: [
            { label: "Select Material Type", value: "" },
            ...materialTypesData.map((material) => ({
              label: material.name,
              value: material.id,
            })),
          ],
          users: dropdownData.users.map(([name, id]) => ({
            label: name,
            value: id,
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

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

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection
    setSelectedWing(null); // Reset wing selection
    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

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
    setSelectedWing(null); // Reset wing selection
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

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
    setSelectedWing(null); // Reset wing selection
    // setWingsOptions([]); // Reset wings options

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

  const [filters, setFilters] = useState({
    company: null,
    site: null,
    project: null,
    department: null,
    modules: null,

    materialtypes: null,
  });

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value, // Dynamically update the correct filter field
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    let queryParams = new URLSearchParams();
    console.log("Filters:", filters);

    // Construct query parameters following the API format
    if (filters.company)
      queryParams.append("q[company_id_eq]", filters.company);
    if (filters.project)
      queryParams.append("q[project_id_eq]", filters.project);
    if (filters.site) queryParams.append("q[site_id_eq]", filters.site);
    if (filters.department)
      queryParams.append("q[department_id_eq]", filters.department);
    if (filters.modules) queryParams.append("q[module_id_eq]", filters.modules);
    if (filters.materialtypes)
      queryParams.append("q[pms_inventory_type_id_eq]", filters.materialtypes);

    // Ensure `approval_type` is correctly formatted
    queryParams.append("q[approval_type_eq]", "material_order_request");

    // Add pagination parameters (always fetch from page 1 when applying filters)
    queryParams.append("page", 1);
    queryParams.append("page_size", 8); // Adjust page size as needed

    // API URL with query params
    const apiUrl = `${baseURL}/pms/admin/invoice_approvals.json?${queryParams.toString()}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    console.log("API URL:", apiUrl); // Debugging

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch filtered data");

      const data = await response.json();
      setApprovals(data.invoice_approvals || []);

      // Update pagination state
      setPagination((prev) => ({
        ...prev,
        total_count: data.total_records || 0,
        total_pages: Math.ceil((data.total_records || 0) / 8), // Ensure correct page count
        current_page: 1, // Reset to page 1 when filtering
      }));
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleResetFilters = async () => {
    setFilters({
      company: null,
      site: null,
      project: null,
      department: null,
      materialtypes: null,
      modules: null, // Reset module selection
    });

    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedModule(null);
    setSelectedMaterialType(null);

    // Reset Pagination to Page 1
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));

    try {
      const response = await fetch(
        `${baseURL}/pms/admin/invoice_approvals.json?q[approval_type_not_eq]=vendor_category&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&page_size=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch initial data");

      const data = await response.json();
      setApprovals(data.invoice_approvals || []);

      setPagination({
        current_page: 1,
        total_pages: data.total_pages || 1,
        total_count: data.total_records || 0,
      });
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  };

  const handleCompanySelection = (selectedOption) => {
    handleCompanyChange(selectedOption); // Update selected company
    handleFilterChange("company", selectedOption?.value); // Update filters
  };

  const handleProjectSelection = (selectedOption) => {
    handleProjectChange(selectedOption); // Updates project state
    handleFilterChange("project", selectedOption?.value); // Updates filter
  };

  const handleSiteSelection = (selectedOption) => {
    handleSiteChange(selectedOption); // Updates site state
    handleFilterChange("site", selectedOption?.value); // Updates filter
  };

  const pageNumbers = [];
  for (let i = 1; i <= pagination.total_pages; i++) {
    pageNumbers.push(i);
  }

  const getPageNumbers = () => {
    const maxPagesToShow = 8;
    let startPage, endPage;

    if (pagination.total_pages <= maxPagesToShow) {
      // Case 1: If total pages are <= 8, show all
      startPage = 1;
      endPage = pagination.total_pages;
    } else if (pagination.current_page <= 4) {
      // Case 2: If current page is in the beginning (pages 1-4), show 1-8
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (pagination.current_page + 4 >= pagination.total_pages) {
      // Case 3: If current page is near the end, show last 8 pages
      startPage = pagination.total_pages - maxPagesToShow + 1;
      endPage = pagination.total_pages;
    } else {
      // Case 4: Show 4 pages before and after current page
      startPage = pagination.current_page - 4;
      endPage = pagination.current_page + 3;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.total_pages) return;
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  return (
    <div>
      <div className="website-content" style={{ overflowY: "auto" }}>
        <footer className="footer"></footer>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {/* Dynamic tabs will be inserted here */}
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="mt-2 p-2">
            <a href="#">Setup &gt; Configurations Setup </a>
            <h5 className="mt-2">INVOICE APPROVALS</h5>
            <div className="d-flex btn-search row me-1">
              <div className="col-lg-6 col-md-12 colsm-12 d-flex flex-wrap">
                <button
                  onClick={handleAddClick}
                  className="d-flex btn-sm purple-btn1 my-2"
                >
                  <span className="material-symbols-outlined"> add </span>
                  <span>Add</span>
                </button>
                {/* <button
                  className="purple-btn2"
                  fdprocessedid="xn3e6n"
                  data-bs-toggle="modal"
                  data-bs-target="#importModal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Import</span>
                </button>
                <a
                  className="d-flex btn-sm purple-btn1 my-2"
                  href="/pms/admin/invoice_approvals/export.xlsx"
                >
                  Export to Excel
                </a> */}
              </div>
            </div>
            <div className="card mt-4 pb-4">
              <CollapsibleCard title="Quick Filter">
                <div>
                  {/* {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      {loading && (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        ></div>
                      )} */}

                  <div className="row my-2 align-items-end">
                    {/* Event Title */}
                    <div className="col-md-3">
                      <label htmlFor="event-title-select">Company</label>

                      <SingleSelector
                        options={companyOptions}
                        onChange={(selectedOption) =>
                          handleCompanySelection(selectedOption)
                        }
                        value={selectedCompany}
                        placeholder={`Select Company`} // Dynamic placeholder
                        isSearchable={true}
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-3">
                      <label htmlFor="event-no-select">Project</label>

                      <SingleSelector
                        options={projects}
                        onChange={(selectedOption) =>
                          handleProjectSelection(selectedOption)
                        }
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="event-no-select"> Sub Project</label>
                      <SingleSelector
                        options={siteOptions}
                        onChange={(selectedOption) =>
                          handleSiteSelection(selectedOption)
                        }
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>

                    {/* Status */}
                    {/* <div className="col-md-3">
                      <label htmlFor="status-select">Department</label>

                      <SingleSelector
                        id="status-select"
                        options={modifiedFilterOptions.departments}
                        onChange={(selectedOption) =>
                          handleFilterChange(
                            "department",
                            selectedOption?.value
                          )
                        }
                        placeholder="Select Department"
                        isClearable
                      />
                    </div> */}

                    {/* Created By */}
                    <div className="col-md-3 mt-3">
                      <label htmlFor="created-by-select">Module</label>

                      <SingleSelector
                        id="created-by-select"
                        options={modifiedFilterOptions.modules || []} // Ensure it's not undefined
                        value={modifiedFilterOptions.modules?.find(
                          (option) => option.value === filters.modules
                        )} // Set selected val
                        onChange={(selectedOption) =>
                          handleFilterChange("modules", selectedOption?.value)
                        }
                        isClearable
                        placeholder="Select Module"
                      />
                    </div>
                    {filters.modules === "material_order_request" && (
                      <div className="col-md-3 mt-4">
                        <label htmlFor="created-by-select">
                          {" "}
                          Material type
                        </label>

                        <SingleSelector
                          id="material-type-select"
                          options={modifiedFilterOptions.material_types}
                          value={modifiedFilterOptions.material_types?.find(
                            (option) => option.value === filters.materialtypes
                          )} // Set selected value
                          onChange={(selectedOption) =>
                            handleFilterChange(
                              "materialtypes",
                              selectedOption?.value
                            )
                          }
                          // Use filterOptions directly
                          isClearable
                          placeholder="Select material"
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      className="col-md-1 purple-btn2 ms-2 mt-4"
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

              <div className="tbl-container mt-3 px-3">
                <table className="w-100" style={{ width: "100% !important" }}>
                  <thead>
                    <tr>
                      <th>Edit</th>
                      <th>Id</th>
                      <th>Function</th>
                      <th>Company</th>
                      <th>project</th>
                      <th>Department</th>
                      <th>Module</th>
                      <th>Material Type</th>
                      {/* <th>Category</th>
                      <th>Template</th>
                      <th>Sub Category</th> */}
                      <th>Created On</th>
                      <th>Created by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <span
                            className="material-symbols-outlined"
                            onClick={() => handleEditClick(record.id)}
                            style={{ cursor: "pointer" }}
                          >
                            edit
                          </span>
                        </td>
                        <td>{record.id}</td>
                        {/* <td>{record.site_id}</td> */}
                        <td>{record.approval_type}</td>
                        <td>{record.company_name}</td>
                        <td>{record.project_name}</td>
                        <td>{record.department_name}</td>
                        {/* <td>{record.category_name}</td> */}
                        <td>{record.approval_type}</td>
                        <td>{record.material_type}</td>
                        <td>{record.created_at}</td>

                        <td>{record.created_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

                  {/* Ellipsis before first page numbers if needed */}
                  {pagination.current_page > 5 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

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

                  {/* Ellipsis after last page numbers if needed */}
                  {pagination.current_page + 4 < pagination.total_pages && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

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
                      pagination.total_count
                    )}{" "}
                    to{" "}
                    {Math.min(
                      pagination.current_page * pageSize,
                      pagination.total_count
                    )}{" "}
                    of {pagination.total_count} entries
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="importModal"
            tabIndex={-1}
            aria-labelledby="importModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <b className="modal-title" id="importModalLabel">
                    Bulk Upload
                  </b>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div>
                  <input
                    type="hidden"
                    name="authenticity_token"
                    defaultValue="your_token_here"
                    autoComplete="off"
                  />
                  <div className="modal-body">
                    <section className="upload-div">
                      Drag & Drop or
                      <input
                        required="required"
                        name="invoice_approval[approval_file]"
                        type="file"
                        id="approval_file"
                      />
                    </section>
                  </div>
                  <div className="modal-footer">
                    <a
                      download="Approval Import.xlsx"
                      target="_blank"
                      className="purple-btn1"
                      href="/Approval Import.xlsx"
                    >
                      Download Sample Format
                    </a>
                    <input
                      type="submit"
                      name="commit"
                      defaultValue="Import"
                      className="purple-btn2"
                      data-disable-with="Import"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic tab content will be inserted here */}
        </div>
      </div>
    </div>
  );
};

export default ApprovalMatrics;
