import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon } from "../components";
import AddUsersModal from "../components/common/Modal/AddUserModel";
import { baseURL } from "../confi/apiDomain";

const SubProject = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

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

  const filteredTableData = tableData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((res) => setCompanies(res.data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const pageSize = 5; // Items per page

  useEffect(() => {
    axios
      .get(
        `${baseURL}/user_groups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((res) => {
        if (res.data?.user_groups && Array.isArray(res.data.user_groups)) {
          setTableData(res.data.user_groups);
          setPagination({
            current_page: 1,
            total_pages: Math.ceil(res.data.user_groups.length / pageSize),
            total_count: res.data.user_groups.length,
          });
        } else {
          console.error("Unexpected response format:", res.data);
          setTableData([]);
        }
      })
      .catch((error) => console.error("Error fetching table data:", error));
  }, []);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total_pages: Math.ceil(filteredTableData.length / pageSize),
      total_count: filteredTableData.length,
      current_page: 1, // Reset to first page after filtering
    }));
  }, [searchTerm, tableData]);

  const paginatedData = filteredTableData.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );

  // **Pagination Handling**
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.total_pages) {
      setPagination((prev) => ({
        ...prev,
        current_page: pageNumber,
      }));
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

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  // **Filter & Paginate Data**

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Setup &gt; Purchase Setup &gt; Sub Project List</a>
          <h5 className="mt-4">Sub Project List</h5>

          <div className="d-flex justify-content-end">
            <button
              className="purple-btn2"
              onClick={() => {
                setSelectedGroup(null);
                setShowModal(true);
              }}
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
              }}
              selectedGroup={selectedGroup}
              companies={companies}
              departments={departments}
              users={users}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              onSave={handleSaveUsers}
            />
          </div>

          {/* Search Bar */}
          <div className="card mt-3 pb-4">
            <div className="d-flex justify-content-end align-items-center px-3 py-2">
              <div className="col-md-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control tbl-search"
                    placeholder="Type your keywords here"
                    spellCheck="false"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <th>Sr No.</th>
                    <th>Group Name</th>
                    <th>Company</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        {(pagination.current_page - 1) * pageSize + index + 1}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.company}</td>
                      <td>
                        <span
                          className="material-symbols-outlined"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTableData.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No records found.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProject;
