import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

const BOQApprovalList = () => {
  const [viewApprovalDetails, setviewApprovalDetails] = useState(true);
  const [viewBulkDetails, setviewBulkDetails] = useState(true);
  const [materialDetails, setmaterialDetails] = useState(false);
  const [labourDetails, setlabourDetails] = useState(false);
  const [assestDetails, setassestDetails] = useState(false);
  const [mainTypeDetails, setmainTypeDetails] = useState(false);

  const viewApprovalDropdown = () => {
    setviewApprovalDetails(!viewApprovalDetails);
  };

  const viewBulkDropdown = () => {
    setviewBulkDetails(!viewBulkDetails);
  };

  const materialDropdown = () => {
    setmaterialDetails(!materialDetails);
  };
  const labourDropdown = () => {
    setlabourDetails(!labourDetails);
  };
  const assestDropdown = () => {
    setassestDetails(!assestDetails);
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

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
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
                          width={32}
                          height={32}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={16} cy={16} r={16} fill="#8B0203" />
                          <path
                            d="M16 24L9.0718 12L22.9282 12L16 24Z"
                            fill="white"
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
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Project 1</option>
                              <option>Project 2</option>
                              <option>Project 3</option>
                              <option>Project 4</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Sub Project</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Sub Project 1</option>
                              <option>Sub Project 2</option>
                              <option>Sub Project 3</option>
                              <option>Sub Project 4</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Wing</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Wing 1</option>
                              <option>Wing 2</option>
                              <option>Wing 3</option>
                              <option>Wing 4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Main Category</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 2</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 3</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 4</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 5</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
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
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Alaska</option>
                              <option>California</option>
                              <option>Delaware</option>
                              <option>Tennessee</option>
                              <option>Texas</option>
                              <option>Washington</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 mt-2 pt-2">
                          <button className="purple-btn2">Go</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="card mx-3 mt-3 collapsed-card">
                    <div className="card-header3">
                      <h3 className="card-title">Bulk Action</h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-card-widget="collapse"
                          onClick={viewBulkDropdown}
                        >
                          <svg
                            width={32}
                            height={32}
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx={16} cy={16} r={16} fill="#8B0203" />
                            <path
                              d="M16 24L9.0718 12L22.9282 12L16 24Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {viewBulkDetails && (
                      <div
                        className="card-body mt-0 pt-0"
                        style={{ display: "block" }}
                      >
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>From Status</label>
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">
                                  Select an option
                                </option>
                                <option>Alaska</option>
                                <option>California</option>
                                <option>Delaware</option>
                                <option>Tennessee</option>
                                <option>Texas</option>
                                <option>Washington</option>
                              </select>
                            </div>
                            <div className="form-group mt-3">
                              <label>To Status</label>
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">
                                  Select an option
                                </option>
                                <option>Alaska</option>
                                <option>California</option>
                                <option>Delaware</option>
                                <option>Tennessee</option>
                                <option>Texas</option>
                                <option>Washington</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Remark</label>
                              <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Enter ..."
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="offset-md-1 col-md-2">
                            <button className="purple-btn2 m-0">
                              <a
                                style={{ color: "white" }}
                                href="./erp-material-order-request-create.html"
                              >
                                Submit
                              </a>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                            data-bs-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                            onClick={mainTypeDropdown}
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                          </svg>
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
                    </tbody>
                  </table>
                </div>
                {mainTypeDetails && (
                  <div>
                    <div className="card mx-3 mt-2">
                      <div className="card-header3">
                        <h3 className="card-title">Material Type</h3>
                        <div className="card-tools">
                          <button
                            type="button"
                            className="btn btn-tool"
                            data-card-widget="collapse"
                            onClick={materialDropdown}
                          >
                            <svg
                              className={`collapse-arrow-trans ${
                                isUp ? "up" : ""
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
                      {materialDetails && (
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
                      )}
                    </div>
                    <div className="card mx-3 mt-2  ">
                      <div className="card-header3">
                        <h3 className="card-title">Labour Type</h3>
                        <div className="card-tools">
                          <button
                            type="button"
                            className="btn btn-tool"
                            data-card-widget="collapse"
                            onClick={labourDropdown}
                          >
                            <svg
                              width={32}
                              height={32}
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx={16} cy={16} r={16} fill="#8B0203" />
                              <path
                                d="M16 24L9.0718 12L22.9282 12L16 24Z"
                                fill="white"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {labourDetails && (
                        <div
                          className="card-body mt-0 pt-0"
                          //   style={{ display: "none" }}
                        >
                          <div className="tbl-container mx-3 mt-1">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th rowSpan={2}>Labour Type</th>
                                  <th rowSpan={2}>Labour Sub-Type</th>
                                  <th rowSpan={2}>Labour</th>
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
                      )}
                    </div>
                    <div className="card mx-3 mt-2">
                      <div className="card-header3">
                        <h3 className="card-title">Assest Type</h3>
                        <div className="card-tools">
                          <button
                            type="button"
                            className="btn btn-tool"
                            data-card-widget="collapse"
                            onClick={assestDropdown}
                          >
                            <svg
                              width={32}
                              height={32}
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx={16} cy={16} r={16} fill="#8B0203" />
                              <path
                                d="M16 24L9.0718 12L22.9282 12L16 24Z"
                                fill="white"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {assestDetails && (
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BOQApprovalList;
