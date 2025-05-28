import React, { useState, useEffect } from "react";
import "../styles/mor.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from "react-router-dom";


const RuleEngineList = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    axios
      .get("https://marathon.lockated.com/rule_engine/rules.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414")
      .then((res) => setRules(res.data))
      .catch((err) => console.error(err));
  }, []);



  const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
  ];

  function toTitleCaseFromSnake(str) {
    if (!str) return "";
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\s+/g, " ") // Remove extra spaces
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); // Capitalize each word
  }
  return (
    <>

      <div className="website-content overflow-auto">
        <div className="module-data-section p-4 pb-5">
          <a href="">
            <a href="">Rule Engine  &gt; Rule List </a>
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
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                      >
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

            <div className="mx-3 mb-5">
              <div className="tbl-container mt-1" style={{ maxHeight: "410px", overflowY: "auto" }}>
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
                      <th className="text-start">Toggle</th>
                      <th className="text-start">Edit

                      </th>
                      <th className="text-start">View

                      </th>


                    </tr>
                  </thead>
                  <tbody>

                    {rules.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center">No data found</td>
                      </tr>
                    ) : (
                      rules.flatMap((rule, ruleIdx) =>
                        rule.conditions.map((condition, condIdx) => {
                          const action = rule.actions?.[condIdx] || rule.actions?.[0] || {};
                          return (
                            <tr key={`${rule.id}-${condition.id}`}>
                              {/* Only show rule name and Sr.No. for the first condition, with rowspan */}
                              {condIdx === 0 && (
                                <>
                                  <td className="text-start" rowSpan={rule.conditions.length}>{ruleIdx + 1}</td>
                                  <td className="text-start" rowSpan={rule.conditions.length}>{rule.name}</td>
                                </>
                              )}
                              {/* For subsequent rows, skip these cells */}
                              {/* Attribute */}
                              <td className="text-start">{"-"}</td>
                              <td className="text-start">{toTitleCaseFromSnake(condition.condition_attribute) || "-"}</td>
                              <td className="text-start">{condition.master_operator || ""}</td>
                              <td className="text-start">{toTitleCaseFromSnake(condition.operator) || "-"}</td>
                              <td className="text-start">{toTitleCaseFromSnake(action.action_method) || "-"}</td>
                              <td className="text-start">{/* Sub Reward Outcome if available */}{"-"}</td>
                              {/* Only show toggle, edit, view for the first condition */}
                              {condIdx === 0 && (
                                <>
                                  <td className="text-start" rowSpan={rule.conditions.length}>
                                    {/* <input type="checkbox" checked={rule.active} readOnly /> */}
                                  </td>
                                  <td className="text-start" rowSpan={rule.conditions.length}>
                                    {/* <button className="btn btn-sm btn-primary">Edit</button> */}
                                  </td>
                                  <td className="text-start" rowSpan={rule.conditions.length}>
                                    {/* <button className="btn btn-sm btn-secondary">View</button> */}
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
              <button className="purple-btn1 w-100" >
                Submit
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={handleCloseModal}
              >
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
