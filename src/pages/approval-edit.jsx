import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState } from "react";
import { MultiSelector } from "../components";

const ApprovalEdit = () => {
  const [filters, setFilters] = useState({
    created_by_id_in: "",
    event_type_detail_award_scheme_in: "",
    status_in: "",
    title_in: "",
    event_materials_inventory_id_in: "",
    event_materials_pms_inventory_inventory_type_id_in: "",
    event_materials_id_in: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    event_titles: [],
    event_numbers: [],
    statuses: [],
    creaters: [],
    material_name: [],
    material_type: [],
    locations: [],
  });

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] },
  ]);

  const handleAddLevel = () => {
    setApprovalLevels([
      ...approvalLevels,
      { order: "", name: "", users: [] }, // Add a new empty level
    ]);
  };

  const handleRemoveLevel = (index) => {
    const updatedLevels = approvalLevels.filter((_, i) => i !== index);
    setApprovalLevels(updatedLevels);
  };

  const handleInputChange = (index, field, value) => {
    const updatedLevels = approvalLevels.map((level, i) =>
      i === index ? { ...level, [field]: value } : level
    );
    setApprovalLevels(updatedLevels);
  };

  const userOptions = [
    { value: "user1", label: "User 1" },
    { value: "user2", label: "User 2" },
    { value: "user3", label: "User 3" },
  ]; // Replace with dynamic data

  return (
    <div>
      <div
        className="website-content"
        data-select2-id="select2-data-192-0lua"
        style={{ overflowY: "auto" }}
      >
        <footer className="footer"></footer>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {/* Dynamic tabs will be inserted here */}
        </ul>
        <div
          className="tab-content"
          id="myTabContent"
          data-select2-id="select2-data-myTabContent"
        >
          <link
            rel="stylesheet"
            href="/assets/mail_room.debug-e60240217d99fc10e84cb08195762eaefdebfa65453cfc4907927bd997f6f9e5.css"
          />
          <div className="ms-3 mt-3" data-select2-id="select2-data-191-fles">
            <p>Setup &gt; Invoice Approvals</p>
            <h5 className="mt-2">INVOICE APPROVAL</h5>
            <div
              className="container-fluid p-3"
              data-select2-id="select2-data-190-iiua"
            >
              <div className="row" data-select2-id="select2-data-189-k5fb">
                <form
                  className="new_invoice_approval"
                  id="new_invoice_approval"
                  action="/pms/admin/invoice_approvals"
                  acceptCharset="UTF-8"
                  method="post"
                  data-select2-id="select2-data-new_invoice_approval"
                >
                  <input
                    type="hidden"
                    name="authenticity_token"
                    defaultValue="M7lSHxX9HuyNx5l_jkvdgnhAmhQ7gh3Vnv_wr6fKS30l24vqwHbNTnaUsp_NJu9LeGEhKm1hyNeP7XjH6dt6pA"
                    autoComplete="off"
                  />
                  <input
                    type="hidden"
                    name="subaction"
                    id="subaction"
                    autoComplete="off"
                  />
                  <div
                    className="row my-4 align-items-center"
                    data-select2-id="select2-data-188-ekbm"
                  >
                    <div
                      className="col-md-12 "
                      data-select2-id="select2-data-187-y2ya"
                    >
                      <div className="card mt-3 pb-4">
                        <CollapsibleCard title="Configure Details">
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
                              <div className="col-md-3">
                                <label htmlFor="event-title-select">
                                  Company
                                </label>
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
                              <div className="col-md-3">
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
                              <div className="col-md-3">
                                <label htmlFor="status-select">
                                  Department
                                </label>
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
                              <div className="col-md-3">
                                <label htmlFor="created-by-select">
                                  Category
                                </label>
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
                              <div className="col-md-3">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Templates
                                </label>
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

                              <div className="col-md-3">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Sub Category
                                </label>
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
                            </div>
                          </form>
                        </CollapsibleCard>
                        <div className="card mt-3 pb-4 ms-3 ">
                          <div className="card-header mb-3 ">
                            <h3 className="card-title">Approval Levels</h3>
                          </div>
                          {/* <div className="invoice-approval-level-fields nested-fields col-sm-11 bg-white ms-2"> */}
                          {/* <div>
                            <div
                              className="px-4"
                              style={{
                                alignItems: "center",
                                display: "flex",
                                columnGap: 20,
                              }}
                            >
                              <fieldset className="border">
                                <legend className="float-none">
                                  Order{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group order"
                                  placeholder="Enter Order"
                                  required
                                />
                              </fieldset>
                              <fieldset className="border">
                                <legend className="float-none">
                                  Name of Level{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group name"
                                  placeholder="Enter Name of Level"
                                  required
                                  type="text"
                                />
                              </fieldset>
                              <fieldset className="user-list">
                                <legend className="float-none mb-2">
                                  Users{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <MultiSelector
                                  options={userOptions}
                                  value={selectedUsers}
                                  onChange={setSelectedUsers}
                                  placeholder="Select Users"
                                />
                              </fieldset>
                              <div>
                                <input
                                  defaultValue="false"
                                  autoComplete="off"
                                  type="hidden"
                                  name="invoice_approval[invoice_approval_levels_attributes][0][_destroy]"
                                  id="invoice_approval_invoice_approval_levels_attributes_0__destroy"
                                />
                                <a
                                  className="remove-item ms-3 px-2 rounded purple-btn1 remove_fields dynamic"
                                  style={{ padding: "1px 3px" }}
                                  href="#"
                                >
                                  x
                                </a>
                              </div>
                            </div>
                          </div> */}

                          {approvalLevels.map((level, index) => (
                            <div
                              key={index}
                              className="px-4"
                              style={{
                                display: "flex",
                                columnGap: 20,
                                alignItems: "center",
                              }}
                            >
                              <fieldset className="border">
                                <legend className="float-none">
                                  Order{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group order"
                                  placeholder="Enter Order"
                                  value={level.order}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "order",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </fieldset>
                              <fieldset className="border ms-4">
                                <legend className="float-none">
                                  Name of Level{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group name"
                                  placeholder="Enter Name of Level"
                                  value={level.name}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  required
                                  type="text"
                                />
                              </fieldset>
                              <fieldset
                                className="user-list ms-3 mb-3"
                                style={{ width: "15%" }} //
                              >
                                <legend className="float-none mb-2">
                                  Users{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <MultiSelector
                                  options={userOptions}
                                  value={level.users}
                                  onChange={(selected) =>
                                    handleInputChange(index, "users", selected)
                                  }
                                  placeholder="Select Users"
                                />
                              </fieldset>
                              <button
                                className="remove-item ms-4 mb-3 px-2 rounded purple-btn1"
                                style={{ padding: "1px 3px" }}
                                onClick={() => handleRemoveLevel(index)}
                              >
                                x
                              </button>
                            </div>
                          ))}
                          <div className="ms-3 mt-2">
                            <button
                              className=" purple-btn1 submit-btn"
                              onClick={handleAddLevel}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div></div>
                      </div>

                      {/* </div> */}
                      <div style={{ textAlign: "center" }}>
                        <button
                          name="subaction"
                          type="submit"
                          className=" purple-btn1 submit-btn"
                          value="save"
                          fdprocessedid="4ksxs"
                        >
                          Update
                        </button>
                        {/* <button
                          name="subaction"
                          type="submit"
                          className=" purple-btn2 submit-btn"
                          value="save_and_new"
                          fdprocessedid="khpujm"
                        >
                        
                        </button> */}
                      </div>
                    </div>
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

export default ApprovalEdit;
