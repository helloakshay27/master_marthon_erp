import React, { useState } from "react";
import { SearchIcon } from "../components";

import AddUsersModal from "../components/common/Modal/AddUserModel";

const SubProject = () => {
  const [showModal, setShowModal] = useState(false);
  // const [selectedDepartment, setSelectedDepartment] = useState("");
  // const [inputValue, setInputValue] = useState("");
  // const [selectedUsers, setSelectedUsers] = useState([]);

  // Dummy data for users
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Brown" },
    { id: 4, name: "Emily Davis" },
  ];

  const companies = [
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" },
    { id: 3, name: "Company C" },
  ];

  const departments = [
    { id: 1, name: "Finance" },
    { id: 2, name: "HR" },
    { id: 3, name: "IT" },
  ];

  const handleSaveUsers = (selectedUsers) => {
    console.log("Saved Users:", selectedUsers);
  };

  return (
    <div>
      <div className="">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">Setup &gt; Purchase Setup &gt;Sub Project List</a>
            <h5 className="mt-4">Sub Project List</h5>

            {/* Add Users Button */}
            <div className="d-flex justify-content-end">
              <button
                className="purple-btn2"
                onClick={() => setShowModal(true)}
              >
                + Add Users
              </button>

              <AddUsersModal
                show={showModal}
                onClose={() => setShowModal(false)}
                companies={companies}
                departments={departments}
                users={users}
                onSave={handleSaveUsers}
              />
            </div>

            {/* Table Section */}
            {/* <div className="tab-content1 active" id="total-content"> */}
            <div
              className="card mt-3 pb-
          4"
            >
              <div className="d-flex justify-content-end align-items-center px-3 py-2">
                <div className="col-md-4">
                  {/* <form action="/pms/sites" method="get"> */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control tbl-search table_search"
                      placeholder="Type your keywords here"
                      spellCheck="false"
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                  {/* </form> */}
                </div>
              </div>

              {/* Table Data */}
              <div className="tbl-container m-4   mt-4 ms-1">
                <div
                // style={{
                //   maxWidth: "100%",
                //   overflowX: "auto",
                //   paddingRight: "15px",
                // }}
                >
                  {/* <div className="tbl-container mx-3 mt-1"> */}
                  <table className="w-100">
                    <thead>
                      <tr className="text-start">
                        <th>Sr No.</th>
                        <th>Sub Project</th>
                        <th>Certifying Company</th>
                        <th>Project Name</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Bodhi</td>
                        <td>Sanvo Resorts Pvt. Ltd.-II</td>
                        <td>Marathon Nexzone II</td>
                        <td>Bhandhup</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Aster</td>
                        <td>Sanvo Resorts Pvt. Ltd.-II</td>
                        <td>Marathon Nexzone II</td>
                        <td>Bhandhup</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* </div> */}
            {/* </div> */}

            {/* Add Users Modal */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProject;
