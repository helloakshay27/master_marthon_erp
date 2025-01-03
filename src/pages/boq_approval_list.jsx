import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { BulkAction } from "../components";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";


const BOQApprovalList = () => {
  const [viewApprovalDetails, setviewApprovalDetails] = useState(true);
  const [mainTypeDetails, setmainTypeDetails] = useState(false);

  const viewApprovalDropdown = () => {
    setviewApprovalDetails(!viewApprovalDetails);
  };

  const mainTypeDropdown = () => {
    setmainTypeDetails(!mainTypeDetails);
  };
  // State to track whether the triangle is up or down
  const [isUp, setIsUp] = useState(false);

  // Function to toggle the state
  const toggleArrow = () => {
    setIsUp((prevState) => !prevState);
  };

  const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
  ];

  return (
    <>

      <div className="main-content">

        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">
              Setup &gt; Engineering Setup &gt; BOQ &gt; BOQ Approval List
            </a>
            <h5 className="mt-4">BOQ Approval List</h5>
            <div className="tab-content1 active" id="total-content">
              {/* Total Content Here */}
              <div className="card mt-4 pb-4 ">
                <div className="card mx-3 mt-3">
                  <div className="card-header3 pb-0">
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={viewApprovalDropdown}
                      >
                        <svg
                          className={`collapse-arrow-trans ${isUp ? "up" : ""
                            }`}
                          width={32}
                          height={32}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={toggleArrow}
                          style={{ cursor: "pointer" }}
                        >
                          <circle cx="16" cy="16" r="16" fill="#8B0203" />
                          <path
                            d="M16 24L9.0718 12L22.9282 12L16 24Z"
                            fill="white"
                            // Rotate the triangle depending on the state
                            style={{
                              transform: isUp
                                ? "rotate(180deg)"
                                : "rotate(0deg)", // Toggle rotation
                              transformOrigin: "center", // Rotate around the center of the triangle
                              transition: "transform 0.3s ease", // Smooth transition
                            }}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {viewApprovalDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Project</label>
                            {/* <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Project 1</option>
                              <option>Project 2</option>
                              <option>Project 3</option>
                              <option>Project 4</option>
                            </select> */}
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Project`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Sub Project</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Sub-Project`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Wing</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Wing`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Main Category</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Main Category`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 2</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Sub-Lvl 2`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 3</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Sub-Lvl 3`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 4</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Sub-Lvl 4`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 5</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Sub-Lvl 5`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              fdprocessedid="qv9ju9"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ ID</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              fdprocessedid="qv9ju9"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Description</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Enter ..."
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Status</label>
                            <SingleSelector
                              options={options}
                              // value={values[label]} // Pass current value
                              // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                              placeholder={`Select Status`} // Dynamic placeholder
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2 pt-2">
                          <button className="purple-btn2">Go</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <BulkAction />
                </div>
                <div className="tbl-container mx-3 mt-1">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">
                          <input type="checkbox" />{" "}
                        </th>
                        <th className="text-start"> </th>
                        <th className="text-start">
                          Project/Sub-Project/Wing{" "}
                        </th>
                        <th className="text-start">Category </th>
                        <th className="text-start">Description </th>
                        <th className="text-start">UOM </th>
                        <th className="text-start">Cost QTY </th>
                        <th className="text-start">Cost Rate </th>
                        <th className="text-start">Cost Value </th>
                        <th className="text-start">Status </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>

                          <button
                            className="btn btn-link p-0"

                            onClick={mainTypeDropdown}
                            aria-label="Toggle row visibility"
                          >
                            {mainTypeDetails ? 
                            (
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              >
                                  {/* Square */}
                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                  {/* Minus Icon */}
                                  <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                          ) : (
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              >
                                  {/* Square */}
                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                  {/* Plus Icon */}
                                  <line x1="12" y1="8" x2="12" y2="16" />
                                  <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                          )
                            }
                          </button>
                        </td>
                        <td className="text-start">
                          Nexzone Phase 2/Cedar/Wing A
                        </td>
                        <td className="text-start">
                          FlatFinishing/Tiling FF/Flooring/TT4/TT5
                        </td>
                        <td className="text-start">Tiling Acid Wash </td>
                        <td className="text-start">MTR</td>
                        <td className="text-start">0.0000000</td>
                        <td className="text-start">0.00</td>
                        <td className="text-start">0.00</td>
                        <td className="text-start">Submitted</td>
                      </tr>
                      <tr >
                        <td colSpan={10}>

                          {mainTypeDetails && (
                            <div>
                              <CollapsibleCard title="Material Type">
                                <div
                                  className="card-body mt-0 pt-0"
                                //   style={{ display: "none" }}
                                >
                                  <div className="tbl-container mx-3 mt-1">
                                    <table className="w-100">
                                      <thead>
                                        <tr>
                                          <th rowSpan={2}>Material Type</th>
                                          <th rowSpan={2}>Material Sub-Type</th>
                                          <th rowSpan={2}>Material</th>
                                          <th rowSpan={2}>Generic Specification</th>
                                          <th rowSpan={2}>Colour </th>
                                          <th rowSpan={2}>Brand </th>
                                          <th rowSpan={2}>UOM</th>
                                          <th rowSpan={2}>Cost QTY</th>
                                          <th colSpan={3}>Cost</th>
                                          <th rowSpan={2}>Wastage</th>
                                          <th rowSpan={2}>
                                            Total Estimated Qty Wastage
                                          </th>
                                        </tr>
                                        <tr>
                                          <th>Co-Efficient Factor</th>
                                          <th colSpan={2}>Estimated Qty</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>SAND</td>
                                          <td>SAND</td>
                                          <td>SAND River (BAG)</td>
                                          <td>SAND River (BAG)</td>
                                          <td>GOLD</td>
                                          <td />
                                          <td>Bags</td>
                                          <td />
                                          <td>2</td>
                                          <td>2</td>
                                          <td>4%</td>
                                          <td>2.08</td>
                                        </tr>


                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                              </CollapsibleCard>

                              <CollapsibleCard title="Assest Type">

                                <div
                                  className="card-body mt-0 pt-0"
                                //   style={{ display: "none" }}
                                >
                                  <div className="tbl-container mx-3 mt-1">
                                    <table className="w-100">
                                      <thead>
                                        <tr>
                                          <th rowSpan={2}>Assest Type</th>
                                          <th rowSpan={2}>Assest Sub-Type</th>
                                          <th rowSpan={2}>Assest</th>
                                          <th rowSpan={2}>UOM</th>
                                          <th colSpan={2}>Cost</th>
                                        </tr>
                                        <tr>
                                          <th>Co-Efficient Factor</th>
                                          <th colSpan={2}>Estimated Qty</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                          <td />
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                              </CollapsibleCard>

                            </div>
                          )}

                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default BOQApprovalList;
