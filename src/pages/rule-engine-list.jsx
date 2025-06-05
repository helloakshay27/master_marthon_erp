import React, { useState, useEffect } from "react";
import "../styles/mor.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";

const RuleEngineList = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    axios
      .get(
        `${baseURL}rule_engine/rules.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )

      .then((res) => {
        setRules(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function toTitleCaseFromSnake(str) {
    if (!str) return "";
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\s+/g, " ") // Remove extra spaces
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ); // Capitalize each word
  }

  // Add these states at the top of your component
  const [masterRewardOptions, setMasterRewardOptions] = useState({});
  const [subRewardMapping, setSubRewardMapping] = useState({});

  // Add this useEffect to fetch and store the mappings
  useEffect(() => {
    // Fetch master reward options
    axios
      .get(
        `${baseURL}rule_engine/available_functions.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        // Create mapping of id to display_name
        const mapping = {};
        response.data.forEach((item) => {
          mapping[item.id] = {
            name: item.display_name,
            subOptions: {},
          };
          // Fetch sub-options for each master option
          axios
            .get(
              `${baseURL}rule_engine/available_functions.json?q[available_model_id]=${item.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((subResponse) => {
              const subMapping = {};
              subResponse.data.forEach((subItem) => {
                subMapping[subItem.id] = subItem.display_name;
              });
              setSubRewardMapping((prev) => ({
                ...prev,
                [item.id]: subMapping,
              }));
            });
        });
        setMasterRewardOptions(mapping);
      })
      .catch((error) => {
        console.error("Error fetching reward mappings:", error);
      });
  }, []);

   // Add this above your component (or in a utils file)
const masterOperators = [
  {
    id: "0",
    name: "Common Operatives",
    subOptions: [
      { id: "1", name: "Greater than", value: "greater_than" },
      { id: "2", name: "Less than (<)", value: "less_than" },
      { id: "3", name: "Equals (=)", value: "equals" },
      { id: "4", name: "Not equals (!=)", value: "not_equals" },
      { id: "5", name: "Contains", value: "contains" },
      { id: "6", name: "Does not contain", value: "does_not_contain" },
    ],
  },
  {
    id: "1",
    name: "Logical Operatives",
    subOptions: [
      { id: "1", name: "AND", value: "and" },
      { id: "2", name: "OR", value: "or" },
      { id: "3", name: "NOT", value: "not" },
    ],
  },
  {
    id: "2",
    name: "Date/Time Operatives",
    subOptions: [
      { id: "1", name: "Before", value: "before" },
      { id: "2", name: "After", value: "after" },
      { id: "3", name: "Between", value: "between" },
      { id: "4", name: "Within", value: "within" },
    ],
  },
//   {
//     id: "3",
//     name: "Tier Operatives",
//     subOptions: [
//       { id: "1", name: "Is in tier", value: "is_in_tier" },
//       { id: "2", name: "Upgrade", value: "upgrade" },
//       { id: "3", name: "Downgrade", value: "downgrade" },
//     ],
//   },
];
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4 pb-5">
          <a href="">
            <a href="">Rule Engine &gt; Rule List </a>
          </a>
          <h5 class="mt-4">Rule List</h5>
          <div className="card mt-3 pb-">
            <div className="d-flex justify-content-between align-items-center me-2 mt-4">
              {/* Search Input */}
              <div className="col-md-4">
                <form>
                  <div className="input-group ms-3">
                    <input
                      type="search"
                      id="searchInput"
                      // value={searchKeyword}
                      // onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
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
                  </div>
                </form>
              </div>

              {/* Buttons & Filter Section */}
              <div className="col-md-6">
                <div className="d-flex justify-content-end align-items-center gap-3">
                  {/* Filter Icon */}
                  {/* <button className="btn btn-md btn-default"
                                onClick={() => {
                  setShowModal(true);
                }}
                              >
                                <svg
                                  width={28}
                                  height={28}
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.66604 5.64722C6.39997 5.64722 6.15555 5.7938 6.03024 6.02851C5.90494 6.26322 5.91914 6.54788 6.06718 6.76895L13.7378 18.2238V29.0346C13.7378 29.2945 13.8778 29.5343 14.1041 29.6622C14.3305 29.79 14.6081 29.786 14.8307 29.6518L17.9136 27.7927C18.13 27.6622 18.2622 27.4281 18.2622 27.1755V18.225L25.9316 6.76888C26.0796 6.5478 26.0938 6.26316 25.9685 6.02847C25.8432 5.79378 25.5987 5.64722 25.3327 5.64722H6.66604ZM15.0574 17.6037L8.01605 7.08866H23.9829L16.9426 17.6051C16.8631 17.7237 16.8207 17.8633 16.8207 18.006V26.7685L15.1792 27.7584V18.0048C15.1792 17.862 15.1368 17.7224 15.0574 17.6037Z"
                                    fill="#8B0203"
                                  />
                                </svg>
                              </button> */}

                  {/* Create BOQ Button */}
                  <button
                    className="purple-btn2"
                    onClick={() => navigate("/rule-engine-create")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="white"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span> Create Rule</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-3 mb-5 mt-3">
              <div
                className="tbl-container mt-1"
                style={{ maxHeight: "410px", overflowY: "auto" }}
              >
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="text-start">Sr.No.</th>
                      <th className="text-start">Rule Name</th>
                      <th className="text-start">Attribute</th>
                      <th className="text-start">Sub-Attribute</th>
                      <th className="text-start">Operatives</th>
                      <th className="text-start">Sub Operatives</th>
                      <th className="text-start">Reward Outcome</th>
                      <th className="text-start">Sub Reward Outcome</th>
                      {/* <th className="text-start">Toggle</th> */}
                      <th className="text-start">View</th>
                      <th className="text-start">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      rules.flatMap((rule, ruleIdx) =>
                        rule.conditions.map((condition, condIdx) => {
                          const action =
                            rule.actions?.[condIdx] || rule.actions?.[0] || {};
                          return (
                            <tr key={`${rule.id}-${condition.id}`}>
                              {/* Only show rule name and Sr.No. for the first condition, with rowspan */}
                              {condIdx === 0 && (
                                <>
                                  <td
                                    className="text-start"
                                    rowSpan={rule.conditions.length}
                                  >
                                    {ruleIdx + 1}
                                  </td>
                                  <td
                                    className="text-start"
                                    rowSpan={rule.conditions.length}
                                  >
                                    {rule.name}
                                  </td>
                                </>
                              )}
                              {/* For subsequent rows, skip these cells */}
                              {/* Attribute */}
                              <td className="text-start">{condition.model_name || "-"}</td>
                              <td className="text-start">
                                {toTitleCaseFromSnake(
                                  condition.condition_attribute
                                ) || "-"}
                              </td>
                              <td className="text-start">
                                {/* {condition.master_operator || ""} */}
                                {
    masterOperators.find(op => op.id === String(condition.master_operator))?.name || ""
  }
                              </td>
                              <td className="text-start">
                                {toTitleCaseFromSnake(condition.operator) ||
                                  "-"}
                              </td>
                              <td className="text-start">
                                {toTitleCaseFromSnake(action.action_method) ||
                                  "-"}
                              </td>

                              <td className="text-start">
                                {(action.action_selected_model &&
                                  subRewardMapping[
                                    action.rule_engine_available_function_id
                                  ]?.[action.action_selected_model]) ||
                                  action.action_selected_model}
                              </td>
                              {/* Only show toggle, edit, view for the first condition */}
                              {condIdx === 0 && (
                                <>
                                  {/* <td
                                    className="text-start"
                                    rowSpan={rule.conditions.length}
                                  ></td> */}
                                  <td
                                    className="text-center"
                                    rowSpan={rule.conditions.length}
                                  >
                                    {/* <button className="btn btn-sm btn-secondary">View</button> */}
                                    <Link
                                      to={`/rule-engine-details/${rule.id}`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="black"
                                        class="bi bi-eye"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                      </svg>
                                    </Link>
                                  </td>
                                  <td
                                    className="text-center"
                                    rowSpan={rule.conditions.length}
                                  >
                                    {/* <button className="btn btn-sm btn-primary">Edit</button> */}
                                    <Link to={`/rule-engine-edit/${rule.id}`}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="black"
                                        class="bi bi-pencil-square"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                        <path
                                          fill-rule="evenodd"
                                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                        ></path>
                                      </svg>
                                    </Link>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loader-container">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p>Loading...</p>
        </div>
      )}

      {/* Filter Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter By</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <p
              className="title"
              style={{ fontSize: "14px", fontWeight: "400" }}
            >
              Attributes
            </p>
            <div className="row ms-2">
              <fieldset className="border col-md-5 m-2 col-sm-11">
                <legend
                  className="float-none"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  Master Attribute<span>*</span>
                </legend>
                <select
                  // @ts-ignore
                  required=""
                  className="mt-1 mb-1"
                  style={{ fontSize: "12px", fontWeight: "400" }}
                  // onChange={handleMasterAttributeChange}
                  // value={selectedMasterAttribute}
                >
                  <option value="" disabled selected hidden>
                    Select Master Attribute
                  </option>
                  {/* {masterAttributes.map((attr) => (
                    <option key={attr.id} value={attr.id}>
                      {attr.display_name}
                    </option>
                  ))} */}
                </select>
              </fieldset>
              <fieldset className="border col-md-5 m-2 col-sm-11">
                <legend
                  className="float-none"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  Sub Attribute<span>*</span>
                </legend>
                <select
                  required=""
                  className="mt-1 mb-1"
                  style={{ fontSize: "12px", fontWeight: "400" }}
                  // onChange={handleSubAttributeChange}
                  // value={selectedSubAttribute}
                  // disabled={!selectedMasterAttribute}
                >
                  <option value="" disabled selected hidden>
                    Select Sub Attribute
                  </option>

                  {/* {subAttributes.map((subAttr) => (
                    <option key={subAttr.id} value={subAttr.attribute_name}>
                      {subAttr.display_name}
                    </option>
                  ))} */}
                </select>
              </fieldset>
            </div>
          </div>

          <div className="row mt-2 justify-content-center mt-5">
            <div className="col-md-4">
              <button className="purple-btn1 w-100">Submit</button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn2 w-100" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RuleEngineList;
