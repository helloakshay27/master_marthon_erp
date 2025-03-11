import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, SelectBox, ShowIcon } from "../components";
import AddUsersModal from "../components/common/Modal/AddUserModel";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
const SubProject = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [tableData, setTableData] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/departments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDepartments(
            res.data.map((dept) => ({ value: dept.id, label: dept.name }))
          );
        } else {
          console.error("Unexpected department response format:", res.data);
          setDepartments([]);
        }
      })
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

 
 
  useEffect(() => {
    axios
      .get(`${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then((res) => {
        if (res.data?.companies) {
          const companyOptions = res.data.companies.map((company) => ({
            value: company.id,
            label: company.company_name,
          }));
          setCompanies(companyOptions);
        } else {
          console.error("Unexpected company response format:", res.data);
        }
      })
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  useEffect(() => {
    console.log("Selected Company:", selectedCompany);
  }, [selectedCompany]);
  


  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const pageSize = 10; // Items per page

  const [userGroups, setUserGroups] = useState([]);

  // Fetch groups when modal saves
  // const handleSaveGroup = (updatedGroups) => {
  //   setUserGroups(updatedGroups); // Update the list
  // };

  const handleSaveGroup = async () => {
    await fetchUserGroups(); // Fetch updated data after saving
  };
 
  

 
  
  const fetchUserGroups = (page = 1, companyId = null) => {
    let url = `${baseURL}/user_groups.json?page=${page}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
  
    // Apply company filter if selected
    if (companyId) {
      url += `&q[company_id_eq]=${companyId}`;
    }
  
    axios
      .get(url)
      .then((res) => {
        if (res.data?.user_groups && Array.isArray(res.data.user_groups)) {
          setTableData(res.data.user_groups);
          setPagination({
            current_page: res.data.current_page,
            total_pages: Math.ceil(res.data.total_entries / pageSize),
            total_count: res.data.total_entries,
          });
        } else {
          console.error("Unexpected response format:", res.data);
          setTableData([]);
        }
      })
      .catch((error) => console.error("Error fetching table data:", error));
  };
  

  useEffect(() => {
    if (!showModal) {
      fetchUserGroups(); // Refresh the data when modal closes
    }
  }, [showModal]);

  const handleFilterSubmit = () => {
    if (selectedCompany) {
      fetchUserGroups(1, selectedCompany.value); // Pass company ID & reset to page 1
    }
  };
  
  const handleResetFilters = () => {
    setSelectedCompany(null);
    setSearchTerm("");
    fetchUserGroups(1, null); // Reset filter and fetch all data
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter table data based on search term
  const filteredTableData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const paginatedData = tableData

 

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.total_pages) {
      fetchUserGroups(pageNumber, selectedCompany ? selectedCompany.value : null);
    }
  };
  
  

  const getPageNumbers = () => {
    const total = pagination.total_pages;
    const current = pagination.current_page;
    const maxVisiblePages = 5;

    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let pages = [];
    if (current <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (current >= total - 2) {
      pages = [total - 4, total - 3, total - 2, total - 1, total];
    } else {
      pages = [current - 2, current - 1, current, current + 1, current + 2];
    }

    return pages;
  };

  useEffect(() => {
    if (selectedCompany) {
      const departmentIds = selectedDepartments
        .map((dept) => dept.value)
        .join(",");
      const companyId = selectedCompany.value;

      let url = `${baseURL}/users.json?q[user_sites_pms_site_project_company_id_eq]=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      if (departmentIds) {
        url += `&q[department_id_in]=${departmentIds}`;
      }

      axios
        .get(url)
        .then((res) => {
          const mappedUsers = res.data.map((user) => ({
            id: user.id,
            name: user.full_name,
          }));
          setUsers(mappedUsers);
        })
        .catch((error) => console.error("Error fetching users:", error));
    } else {
      setUsers([]);
    }
  }, [selectedCompany, selectedDepartments]);

  const handleSaveUsers = (selectedUsers) => {
    console.log("Saved Users:", selectedUsers);
  };

  const [mode, setMode] = useState("edit");

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
    setMode("edit"); // Set mode to edit
  };

  const handleView = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
    setMode("view"); // Set mode to view (read-only)
  };

  const handleAdd = () => {
    setSelectedGroup(null);
    setMode("add"); // Set mode to 'add'
    setShowModal(true);
  };

  // const handleEdit = (group) => {
  //   setSelectedGroup(group);
  //   setShowModal(true);
  // };

  // const handleView = (group) => {
  //   setSelectedGroup(group);
  //   setShowModal(true);
  // };

  // **Filter & Paginate Data**

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Setup &gt; Purchase Setup &gt; User Group list</a>
          <h5 className="mt-4">User Group list</h5>

          <div className="d-flex justify-content-end">
            <button
              className="purple-btn2"
              // onClick={() => {
              //   setSelectedGroup(null);
              //   setShowModal(true);
              // }}
              onClick={handleAdd}
            >
              + Add Users
            </button>

            <AddUsersModal
              show={showModal}
              onClose={() => {
                setShowModal(false);
                setSelectedGroup(null);
                setSelectedCompany(null);
                setSelectedDepartments([]);
                setUsers([]);
                fetchUserGroups(); // Fetch updated data when modal closes
              }}
              selectedGroup={selectedGroup}
              companies={companies}
              departments={departments}
              users={users}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              // onSave={handleSaveUsers}
              // onSave={handleSaveGroup} //

              onSave={() => {
                fetchUserGroups(); // Refresh data after save
              }}
              // readOnly={selectedGroup !== null} // Modal is read-only when viewing a group

              mode={mode} // Use dynamic mode
            />
          </div>

          {/* Search Bar */}
          <div className="card mt-3 pb-4">
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
  options={companies}
  onChange={(selectedOption) => setSelectedCompany(selectedOption)}
  value={selectedCompany} // Ensure this is correctly bound
  placeholder="Select Company"
  isSearchable={true}
/>

                    </div>

                    {/* Event Number */}
                    
                  
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


            <div className="d-flex justify-content-end align-items-center px-3 py-2">
              <div className="col-md-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control tbl-search"
                    placeholder="Type your keywords here"
                    spellCheck="false"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-md btn-default">
                      <SearchIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Data */}
            <div className="tbl-container m-4 mt-4 ms-1">
              <table className="w-100">
                <thead>
                  <tr className="text-start">
                    <th style={{ width: "5%" }}>Sr No.</th>
                    <th>Group Name</th>
                    <th>Company</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {paginatedData.map((item, index) => ( */}
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((item, index) => (
                    
                    <tr key={item.id}>
                      <td>
                        {(pagination.current_page - 1) * pageSize + index + 1}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.company}</td>
                      {/* <td>
                        <span
                          className="material-symbols-outlined"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </span>
                      </td> */}

                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <ShowIcon
                          onClick={() => handleView(item)}
                          style={{
                            cursor: "pointer",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        <span
                          className="material-symbols-outlined"
                          onClick={() => handleEdit(item)}
                          style={{
                            cursor: "pointer",
                            fontSize: "20px", // Same size as ShowIcon
                            // color: "#0d6efd", // Optional: Match icon color
                          }}
                        >
                          edit
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}

                
                  {/* {filteredTableData.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No records found.
                      </td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center px-3 mt-2">
              <ul className="pagination justify-content-center d-flex">
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

                {pagination.current_page > 5 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {getPageNumbers().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      pagination.current_page === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

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
              <div>
    Showing {(pagination.current_page - 1) * pageSize + 1} to{" "}
    {Math.min(pagination.current_page * pageSize, pagination.total_count)} of{" "}
    {pagination.total_count} entries
  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProject;
