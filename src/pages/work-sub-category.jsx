import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, SelectBox, ShowIcon } from "../components";
import AddUsersModal from "../components/common/Modal/AddUserModel";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal } from "react-bootstrap"; // Ensure you have react-bootstrap installed
const WorkSubCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  // const [tableData, setTableData] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [tableData, setTableData] = useState([
    {
      id: 1,
      subCategoryName: "Excavation",
      level4: "Level 4 Example",
      level3: "Level 3 Example",
      level2: "Level 2 Example",
      parentWorkCategory: "Civil Work",
      description: "Excavation and backfilling work",
      benchmarkLeadTime: "10 days",
      sacCode: "123456",
    },
    {
      id: 2,
      subCategoryName: "Plastering",
      level4: "Level 4 Example",
      level3: "Level 3 Example",
      level2: "Level 2 Example",
      parentWorkCategory: "Finishing Work",
      description: "Internal and external plastering",
      benchmarkLeadTime: "15 days",
      sacCode: "654321",
    },
    {
      id: 3,
      subCategoryName: "Tiling",
      level4: "Level 4 Example",
      level3: "Level 3 Example",
      level2: "Level 2 Example",
      parentWorkCategory: "Finishing Work",
      description: "Floor and wall tiling",
      benchmarkLeadTime: "20 days",
      sacCode: "789012",
    },
  ]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const pageSize = 10; // Items per page

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // **Filter & Paginate Data**
  // const handleOpenAddUserModal = () => {
  //   setShowAddUserModal(true);
  // };

  const handleOpenAddUserModal = () => {
    setModalMode("add");
    setSelectedItem(null); // Clear selected item
    setShowAddUserModal(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item); // Set the item to edit
    setShowAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedItem, setSelectedItem] = useState(null); // Item to edit
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 5; // Number of items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Setup &gt; Engineering Setup &gt; Work Sub-Category Master
          </a>
          <h5 className="mt-4">Work Sub-Category Master</h5>

          {/* Search Bar */}
          <div className="card mt-4 pb-4">
            <div className="card-body">
              <div className="d-flex justify-content-end align-items-center px-3 py-2">
                {/* Search Bar */}
                <div className="d-flex align-items-center me-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      spellCheck="false"
                      // value={searchTerm}
                      // onChange={handleSearch}
                      style={{ width: "400px" }} // Inline CSS to increase width
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Users Button */}
                <div>
                  <button
                    className="purple-btn2"
                    onClick={handleOpenAddUserModal}
                  >
                    + Add
                  </button>
                </div>
              </div>
              {/* Table Data */}
              <div className="tbl-container m-4 mt-4 ms-1">
                <table className="w-100">
                  <thead>
                    <tr className="text-start">
                      <th style={{ width: "5%" }}>Sr No.</th>
                      <th>Sub category Name</th>
                      <th>Level 4</th>
                      <th>Level 3</th>
                      <th>Level 2</th>
                      <th>Parent Work Category</th>
                      <th>Description</th>
                      <th>Benchmark Lead Time</th>
                      <th>SAC Code</th>
                      <th style={{ width: "5%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData.length > 0 ? (
                      currentTableData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{item.subCategoryName}</td>
                          <td>{item.level4}</td>
                          <td>{item.level3}</td>
                          <td>{item.level2}</td>
                          <td>{item.parentWorkCategory}</td>
                          <td>{item.description}</td>
                          <td>{item.benchmarkLeadTime}</td>
                          <td>{item.sacCode}</td>
                          <td
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ShowIcon
                              onClick={() => handleView(item)}
                              style={{
                                cursor: "pointer",
                                width: "18px",
                                height: "18px",
                              }}
                            />

                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              style={{
                                cursor: "pointer",
                                width: "12px",
                                height: "12px",
                              }}
                            />
                            <span
                              className="material-symbols-outlined"
                              onClick={() => handleOpenEditModal(item)}
                              style={{
                                cursor: "pointer",
                                fontSize: "15px",
                              }}
                            >
                              edit
                            </span>

                            <span
                              className="material-symbols-outlined"
                              // onClick={() => handleDelete(item.id)}
                              style={{
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "red",
                              }}
                            >
                              delete
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
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
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Prev
                    </button>
                  </li>

                  {Array.from(
                    { length: Math.ceil(tableData.length / itemsPerPage) },
                    (_, index) => (
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
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(tableData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(tableData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          Math.ceil(tableData.length / itemsPerPage)
                        )
                      }
                    >
                      Last
                    </button>
                  </li>
                </ul>
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, tableData.length)} of{" "}
                  {tableData.length} entries
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddUserModal && (
          // <Modal
          //   centered
          //   size="lg"
          //   show={showAddUserModal}
          //   onHide={handleCloseAddUserModal}
          //   backdrop="static"
          //   keyboard={false}
          // >
          //   <Modal.Header closeButton>
          //     <Modal.Title>Add Work Subcategory</Modal.Title>
          //   </Modal.Header>
          //   <Modal.Body>
          //     <div>
          //       <div className="row">
          //         {/* Subcategory Name */}
          //         <div className="col-md-4">
          //           <div className="form-group">
          //             <label>
          //               Subcategory Name<span>*</span>
          //             </label>
          //             <input
          //               className="form-control"
          //               id="inv_name"
          //               autoComplete="off"
          //               required="required"
          //               type="text"
          //               name="work_sub_category[name]"
          //               spellCheck="false"
          //             />
          //           </div>
          //         </div>

          //         {/* Parent Work Category */}
          //         <div className="col-md-4">
          //           <div className="form-group">
          //             <label>
          //               Parent Work Category<span>*</span>
          //             </label>
          //             <select
          //               className="form-control form-select"
          //               required="required"
          //               name="work_sub_category[work_category_id]"
          //             >
          //               <option value="">Select Work Category</option>
          //               <option value={35}>EXCAVATION & BACKFILLING</option>
          //               <option value={36}>CIVIL WORK</option>
          //               {/* Add more options as needed */}
          //             </select>
          //           </div>
          //         </div>

          //         {/* Parent Work Sub Category */}
          //         <div className="col-md-4">
          //           <div className="form-group">
          //             <label>Parent Work Sub Category</label>
          //             <select
          //               className="form-control form-select"
          //               name="work_sub_category[parent_id]"
          //             >
          //               <option value="">
          //                 Select Parent Work Sub Category
          //               </option>
          //               <option value={30}>Sub structure</option>
          //               <option value={31}>Super structure</option>
          //               {/* Add more options as needed */}
          //             </select>
          //           </div>
          //         </div>

          //         {/* Description */}
          //         <div className="col-md-4">
          //           <div className="form-group">
          //             <label>Description</label>
          //             <textarea
          //               className="form-control"
          //               rows={1}
          //               name="work_sub_category[description]"
          //             />
          //           </div>
          //         </div>

          //         {/* Benchmark Lead Time */}
          //         <div className="col-md-4 mt-2">
          //           <div className="form-group">
          //             <label>
          //               Benchmark Lead Time<span>*</span>
          //             </label>
          //             <input
          //               className="form-control"
          //               required="required"
          //               type="number"
          //               name="work_sub_category[benchmark_lead_time]"
          //             />
          //           </div>
          //         </div>

          //         {/* SAC Code */}
          //         <div className="col-md-4 mt-2">
          //           <div className="form-group">
          //             <label>
          //               SAC Code<span>*</span>
          //             </label>
          //             <input
          //               placeholder="Sub-Category Code"
          //               className="form-control"
          //               required="required"
          //               type="text"
          //               name="work_sub_category[sac_code]"
          //             />
          //           </div>
          //         </div>
          //       </div>
          //       <div className="row mt-2 justify-content-center">
          //         <div className="col-md-4">
          //           <button
          //             type="submit"
          //             className="purple-btn2 w-100"
          //             onClick={handleCloseAddUserModal}
          //           >
          //             Create
          //           </button>
          //         </div>
          //         <div className="col-md-4">
          //           <button
          //             type="button"
          //             className="purple-btn1 w-100"
          //             onClick={handleCloseAddUserModal}
          //           >
          //             Cancel
          //           </button>
          //         </div>
          //       </div>
          //     </div>
          //   </Modal.Body>
          // </Modal>
          <Modal
            centered
            size="lg"
            show={showAddUserModal}
            onHide={handleCloseAddUserModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {modalMode === "add"
                  ? "Add Work Subcategory"
                  : "Edit Work Subcategory"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="row">
                  {/* Subcategory Name */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Subcategory Name<span>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="inv_name"
                        autoComplete="off"
                        required="required"
                        type="text"
                        name="work_sub_category[name]"
                        spellCheck="false"
                        defaultValue={
                          modalMode === "edit"
                            ? selectedItem?.subCategoryName
                            : ""
                        }
                      />
                    </div>
                  </div>

                  {/* Parent Work Category */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Parent Work Category<span>*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        required="required"
                        name="work_sub_category[work_category_id]"
                        defaultValue={
                          modalMode === "edit"
                            ? selectedItem?.parentWorkCategory
                            : ""
                        }
                      >
                        <option value="">Select Work Category</option>
                        <option value="Civil Work">Civil Work</option>
                        <option value="Finishing Work">Finishing Work</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Parent Work Sub Category<span>*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        required="required"
                        name="work_sub_category[work_category_id]"
                        defaultValue={
                          modalMode === "edit"
                            ? selectedItem?.parentWorkCategory
                            : ""
                        }
                      >
                        <option value="">Select Work Category</option>
                        <option value="Civil Work">Civil Work</option>
                        <option value="Finishing Work">Finishing Work</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        name="work_sub_category[description]"
                        defaultValue={
                          modalMode === "edit" ? selectedItem?.description : ""
                        }
                      />
                    </div>
                  </div>

                  {/* Benchmark Lead Time */}
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>
                        Benchmark Lead Time<span>*</span>
                      </label>
                      <input
                        className="form-control"
                        required="required"
                        type="number"
                        name="work_sub_category[benchmark_lead_time]"
                        defaultValue={
                          modalMode === "edit"
                            ? selectedItem?.benchmarkLeadTime
                            : ""
                        }
                      />
                    </div>
                  </div>

                  {/* SAC Code */}
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>
                        SAC Code<span>*</span>
                      </label>
                      <input
                        placeholder="Sub-Category Code"
                        className="form-control"
                        required="required"
                        type="text"
                        name="work_sub_category[sac_code]"
                        defaultValue={
                          modalMode === "edit" ? selectedItem?.sacCode : ""
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-4">
                    <button
                      type="submit"
                      className="purple-btn2 w-100"
                      onClick={handleCloseAddUserModal}
                    >
                      {modalMode === "add" ? "Create" : "Update"}
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="purple-btn1 w-100"
                      onClick={handleCloseAddUserModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default WorkSubCategory;
