import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApprovalMatrics = () => {
  const [filterOptions, setFilterOptions] = useState({
    event_titles: [],
    event_numbers: [],
    statuses: [],
    creaters: [],
    material_name: [],
    material_type: [],
    locations: [],
  });

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/invoice_approval");
  };

  const data = [
    {
      id: 1,
      function: "Finance",
      company: "ABC Corp",
      site: "New York",
      department: "Accounts",
      category: "Expense",
      template: "Template A",
      subCategory: "Travel",
      createdOn: "2023-12-25",
      createdBy: "John Doe",
    },
    {
      id: 2,
      function: "HR",
      company: "XYZ Ltd",
      site: "Los Angeles",
      department: "Recruitment",
      category: "Hiring",
      template: "Template B",
      subCategory: "Onboarding",
      createdOn: "2023-11-20",
      createdBy: "Jane Smith",
    },
    {
      id: 3,
      function: "IT",
      company: "Tech Solutions",
      site: "Chicago",
      department: "Support",
      category: "Software",
      template: "Template C",
      subCategory: "System Upgrade",
      createdOn: "2023-10-15",
      createdBy: "Michael Brown",
    },
  ];

  const handleEditClick = () => {
    navigate("/approval_edit");
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
                <form>
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
                      <Select
                        id="event-title-select"
                        options={filterOptions.event_titles}
                        // onChange={(option) =>
                        //   handleFilterChange(
                        //     "title_in",
                        //     option?.value || ""
                        //   )
                        // }
                        // value={
                        //   filters.title_in
                        //     ? filterOptions.event_titles.find(
                        //         (opt) => opt.value === filters.title_in
                        //       )
                        //     : null
                        // }
                        placeholder="Select Company "
                        isClearable
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-2">
                      <label htmlFor="event-no-select">Site</label>
                      <Select
                        id="event-no-select"
                        options={filterOptions.event_numbers}
                        // onChange={(option) =>
                        //   handleFilterChange(
                        //     "event_no_cont",
                        //     option?.value || ""
                        //   )
                        // }
                        // value={
                        //   filters.event_no_cont
                        //     ? filterOptions.event_numbers.find(
                        //         (opt) => opt.value === filters.event_no_cont
                        //       )
                        //     : null
                        // }
                        placeholder="Select Site"
                        isClearable
                      />
                    </div>

                    {/* Status */}
                    <div className="col-md-2">
                      <label htmlFor="status-select">Department</label>
                      <Select
                        id="status-select"
                        options={filterOptions.statuses}
                        // onChange={(option) =>
                        //   handleFilterChange(
                        //     "status_in",
                        //     option?.value || ""
                        //   )
                        // }
                        // value={
                        //   filters.status_in
                        //     ? filterOptions.statuses.find(
                        //         (opt) => opt.value === filters.status_in
                        //       )
                        //     : null
                        // }
                        placeholder="Select Department"
                        isClearable
                      />
                    </div>

                    {/* Created By */}
                    <div className="col-md-2">
                      <label htmlFor="created-by-select">Category</label>
                      <Select
                        id="created-by-select"
                        options={filterOptions.creaters}
                        // onChange={(option) =>
                        //   handleFilterChange(
                        //     "created_by_id_in",
                        //     option?.value || ""
                        //   )
                        // }
                        // value={
                        //   filters.created_by_id_in
                        //     ? filterOptions.creaters.find(
                        //         (opt) =>
                        //           opt.value === filters.created_by_id_in
                        //       )
                        //     : null
                        // }
                        placeholder="Select Category"
                        isClearable
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="created-by-select"> Sub Category</label>
                      <Select
                        id="created-by-select"
                        options={filterOptions.creaters}
                        // onChange={(option) =>
                        //   handleFilterChange(
                        //     "created_by_id_in",
                        //     option?.value || ""
                        //   )
                        // }
                        // value={
                        //   filters.created_by_id_in
                        //     ? filterOptions.creaters.find(
                        //         (opt) =>
                        //           opt.value === filters.created_by_id_in
                        //       )
                        //     : null
                        // }
                        placeholder="Select  Sub Category"
                        isClearable
                      />
                    </div>
                    <button type="submit" className="col-md-1 purple-btn2">
                      Go{" "}
                    </button>
                  </div>
                </form>
              </CollapsibleCard>
            </div>

            <div className="tbl-container h-auto">
              <table className="w-100" style={{ width: "100% !important" }}>
                <thead>
                  <tr>
                    <th>Edit</th>
                    <th>Id</th>
                    <th>Function</th>
                    <th>Company</th>
                    <th>Site</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Template</th>
                    <th>Sub Category</th>
                    <th>Created On</th>
                    <th>Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          className="material-symbols-outlined"
                          onClick={handleEditClick}
                        >
                          edit
                        </span>
                      </td>
                      <td>{record.id}</td>
                      <td>{record.function}</td>
                      <td>{record.company}</td>
                      <td>{record.site}</td>
                      <td>{record.department}</td>
                      <td>{record.category}</td>
                      <td>{record.template}</td>
                      <td>{record.subCategory}</td>
                      <td>{record.createdOn}</td>
                      <td>{record.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between px-3 pagination-section">
            <nav className="pagination" role="navigation" aria-label="pager">
              <span className="page current">1</span>
              <span className="page">
                <a rel="next" href="/pms/admin/invoice_approvals?page=2">
                  2
                </a>
              </span>
              <span className="page">
                <a href="/pms/admin/invoice_approvals?page=3">3</a>
              </span>
              <span className="page">
                <a href="/pms/admin/invoice_approvals?page=4">4</a>
              </span>
              <span className="page">
                <a href="/pms/admin/invoice_approvals?page=5">5</a>
              </span>
              <span className="page gap">…</span>
              <span className="next">
                <a rel="next" href="/pms/admin/invoice_approvals?page=2">
                  Next ›
                </a>
              </span>
              <span className="last">
                <a href="/pms/admin/invoice_approvals?page=265">Last »</a>
              </span>
            </nav>
            <p> Showing 1 to 10 of 2650 entries </p>
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
                <form
                  encType="multipart/form-data"
                  action="/pms/admin/invoice_approvals/import"
                  acceptCharset="UTF-8"
                  method="post"
                >
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
                </form>
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
