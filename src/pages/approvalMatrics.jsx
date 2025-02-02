import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { QuickFilter } from "../components";

const ApprovalMatrics = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    sites: [],
    departments: [],
    // categories: [],
    // sub_categories: [],
    // approval_types: [],
    // users: [],
    modules: [],
    material_types: [],
  });

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalRecords, setTotalRecords] = useState(0); // Total records state
  const [totalPages, setTotalPages] = useState(0); // T
  const pageSize = 8;

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/invoice_approval");
  };

  const modifiedFilterOptions = {
    companies: [
      { label: "Select Company", value: "" },
      ...filterOptions.companies, // Directly use the companies array from filterOptions
    ],
    // other fields
    sites: [{ label: "Select Site", value: "" }, ...filterOptions.sites],
    departments: [
      { label: "Select Department", value: "" },
      ...filterOptions.departments,
    ],
    modules: [{ label: "Select Module", value: "" }, ...filterOptions.modules],
    material_types: [
      { label: "Select Material Type", value: "" },
      ...filterOptions.material_types, // Map your material types here
    ],
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com/pms/admin/invoice_approvals.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("uiah", response.data);
        setApprovals(data.invoice_approvals || []);
        setTotalRecords(data.total_records || 0); // Set total records
        setTotalPages(data.total_pages || 0); // Set total pages
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [currentPage]);

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
            "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ),
          fetch(
            "https://marathon.lockated.com/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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
          companies: dropdownData.companies.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          sites: dropdownData.sites.map(([name, id, company_id]) => ({
            label: name,
            value: id,
            company_id,
          })),
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

  const handleCompanyChange = (selectedOption) => {
    console.log("Selected Option:", selectedOption.target.value);

    const companyId = selectedOption.target.value; // Directly use companyId here

    // Ensure valid selection
    if (!companyId) {
      console.warn("No valid company selected");
      setSelectedCompany(null); // Reset the selected company state
      setFilterOptions((prevState) => ({ ...prevState, sites: [] })); // Reset the sites
      return;
    }

    // Update selected company state
    setSelectedCompany(selectedOption);
    console.log("Selected Company ID:", companyId);

    // Construct API URL using the selected company ID
    const apiUrl = `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?company_id=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    // Fetch filtered sites
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);

        if (!data || !Array.isArray(data.sites)) {
          console.error("Invalid or missing site data:", data);
          setFilterOptions((prevState) => ({ ...prevState, sites: [] })); // Reset sites
          return;
        }

        // Map API response to match the select component's format
        const formattedSites = data.sites.map(([name, id]) => ({
          label: name,
          value: id,
        }));

        // Update filter options with the fetched sites
        setFilterOptions((prevState) => ({
          ...prevState,
          sites: formattedSites,
        }));
      })
      .catch((error) => {
        console.error("Error fetching sites:", error);
        setFilterOptions((prevState) => ({ ...prevState, sites: [] })); // Reset sites
      });
  };

  const handleCategoryChange = (selectedOption) => {
    const categoryId = selectedOption.target.value;
    setSelectedCategory(selectedOption);

    console.log("categoryId", categoryId);

    // Fetch subcategories based on the selected category
    const apiUrl = `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?category_id=${categoryId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !Array.isArray(data.subcategories)) {
          setFilterOptions((prevState) => ({
            ...prevState,
            sub_categories: [],
          }));
          return;
        }

        // Map API response to match the select component's format
        const formattedSubcategories = data.subcategories.map(([name, id]) => ({
          label: name,
          value: id,
        }));

        // Update filter options with the fetched subcategories
        setFilterOptions((prevState) => ({
          ...prevState,
          sub_categories: formattedSubcategories,
        }));
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
        setFilterOptions((prevState) => ({ ...prevState, sub_categories: [] }));
      });
  };

  const [filters, setFilters] = useState({
    company: null,
    site: null,
    department: null,
    category: null,
    modules: null,
    subCategory: null,
  });

  const handleFilterChange = (field, selectedOption) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: selectedOption ? selectedOption.target.value : null,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    let queryParams = new URLSearchParams();
    console.log("kjasjc", filters);

    if (filters.company) queryParams.append("company_id", filters.company);

    if (filters.site) queryParams.append("site_id", filters.site);

    if (filters.department)
      queryParams.append("department_id", filters.department);

    if (filters.modules) queryParams.append("module_id", filters.modules);

    if (filters.materialtypes)
      queryParams.append("pms_inventory_type_id", filters.materialTypes);
    console.log("hhhh", queryParams.toString());
    const apiUrl = `https://marathon.lockated.com/pms/admin/invoice_approvals.json?${queryParams.toString()}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch filtered data");

      const data = await response.json();
      setApprovals(data.invoice_approvals || []);
      setTotalRecords(data.total_records || 0);
      setTotalPages(data.total_pages || 0);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page changes
    setCurrentPage(page);
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
                <button
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
                </a>
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
                    <div className="col-md-2">
                      <label htmlFor="event-title-select">Company</label>
                      {/* <Select
                        id="company-select"
                        options={modifiedFilterOptions.companies} // Ensure you're using the correct filter options
                        onChange={(selectedOption) => {
                          setTimeout(() => {
                            handleCompanyChange(selectedOption); // Pass the selectedOption directly to the handler
                          }, 500); // Delay of 500ms (adjust as needed)
                        }}
                        value={selectedCompany} // Bind the selected company state to the value prop
                        placeholder="Select Company"
                        isClearable // Allow clearing the selection
                      /> */}
                      <Select
                        id="company-select"
                        options={modifiedFilterOptions.companies}
                        onChange={(selectedOption) => {
                          setTimeout(() => {
                            handleCompanyChange(selectedOption); // Keep this if it's needed for site filtering
                            handleFilterChange("company", selectedOption); // Update the filters state
                          }, 500);
                        }}
                        value={selectedCompany}
                        placeholder="Select Company"
                        isClearable
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-2">
                      <label htmlFor="event-no-select">Site</label>
                      {/* <Select
                        id="site-select"
                        // options={filterOptions.sites}
                        options={modifiedFilterOptions.sites}
                        placeholder="Select Site"
                        isClearable
                      /> */}
                      <Select
                        id="site-select"
                        options={modifiedFilterOptions.sites}
                        onChange={(selectedOption) =>
                          handleFilterChange("site", selectedOption)
                        }
                        placeholder="Select Site"
                        isClearable
                      />
                    </div>

                    {/* Status */}
                    <div className="col-md-2">
                      <label htmlFor="status-select">Department</label>
                      {/* <Select
                        id="status-select"
                        options={modifiedFilterOptions.departments}
                        placeholder="Select Department"
                        isClearable
                      /> */}
                      <Select
                        id="status-select"
                        options={modifiedFilterOptions.departments}
                        onChange={(selectedOption) =>
                          handleFilterChange("department", selectedOption)
                        }
                        placeholder="Select Department"
                        isClearable
                      />
                    </div>

                    {/* Created By */}
                    <div className="col-md-2">
                      <label htmlFor="created-by-select">Module</label>

                      <Select
                        id="created-by-select"
                        options={modifiedFilterOptions.modules}
                        onChange={(selectedOption) =>
                          handleFilterChange("modules", selectedOption)
                        }
                        isClearable
                        // onChange={handleSubCategoryChange}
                      />
                      {/* <Select
                        id="created-by-select"
                        options={modifiedFilterOptions.categories}
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        placeholder="Select Category"
                        isClearable
                      /> */}
                      {/* <Select
                        id="created-by-select"
                        options={modifiedFilterOptions.categories}
                        onChange={(selectedOption) =>
                          handleFilterChange("category", selectedOption)
                        }
                        value={selectedCategory}
                        placeholder="Select Category"
                        isClearable
                      /> */}
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="created-by-select"> Material type</label>
                      {/* <Select
                        id="created-by-select"
                        options={modifiedFilterOptions.sub_categories}
                        placeholder="Select  Sub Category"
                        isClearable
                      /> */}
                      {/* <Select
                        id="sub-category-select"
                        options={modifiedFilterOptions.sub_categories}
                        onChange={(selectedOption) =>
                          handleFilterChange("subCategory", selectedOption)
                        }
                        placeholder="Select Sub Category"
                        isClear
                        able

                      /> */}
                      <Select
                        id="material-type-select"
                        options={modifiedFilterOptions.material_types} // Use filterOptions directly
                        // value={selectedMaterialType}
                        // onChange={(option) => setSelectedMaterialType(option)} // Handle selection
                        isClearable
                      />
                    </div>
                    <button
                      type="submit"
                      className="col-md-1 purple-btn2"
                      onClick={handleFilterSubmit}
                    >
                      Go{" "}
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
                      <th>Site</th>
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
                      currentPage === 1 ? "disabled" : ""
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

                  {/* Dynamic Page Numbers */}
                  {pageNumbers.map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber ? "active" : ""
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

                  {/* Last Button */}
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

                {/* Showing entries count */}
                <div>
                  <p>
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * pageSize + 1 || 1,
                      totalRecords
                    )}{" "}
                    to {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                    {totalRecords} entries
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
