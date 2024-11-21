import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

const BOQApprovalDetails = () => {
   const [boqDetails, setboqDetails] = useState(true);
   const [detailsDetails, setdetailsDetails] = useState(true);
   const [subBoqDetails, setsubBoqDetails] = useState(true);
   const [subItemDetails, setsubItemDetails] = useState(false);
   const [materialDetails, setmaterialDetails] = useState(false);
   const [labourDetails, setlabourDetails] = useState(false);
   const [assestDetails, setassestDetails] = useState(false);

   const boqDetailsDropdown = () => {
      setboqDetails(!boqDetails);
    };
    const detailsDropdown = () => {
      setdetailsDetails(!detailsDetails);
    };
    const subBoqDetailsDropdown = () => {
      setsubBoqDetails(!subBoqDetails);
    };
    const subItemDropdown = () => {
      setsubItemDetails(!subItemDetails);
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
  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="website-content overflow-auto">
            <div className="module-data-section p-4">
              <a href="">
                Setup &gt; Engineering Setup &gt; BOQ &gt; Approval Details
              </a>
              {/* <h5 class="mt-4">BOQ Approval Details</h5> */}
              <div className="tab-content1 active" id="total-content">
                {/* Total Content Here */}
                <div className="card  mt-3 collapsed-card">
                  <div className="card-header3">
                    <h3 className="card-title">BOQ Details</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={boqDetailsDropdown}
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
{boqDetails && (
                  <div
                    className="card-body mt-0 pt-0"
                    style={{ display: "block" }}
                  >
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>BOQ ID</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder={56914}
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Project</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nexzone Phase II"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Sub-Project</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Cedar"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Wing</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Wing A"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>Main Category</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder=""
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>BOQ Item Name</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="BOQ Item Name"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label>BOQ Description</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder=""
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>UOM</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="MTR"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>BOQ Qty (Cost)</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder={0.0}
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>BOQ Rate (Cost)</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder={0.0}
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>BOQ Amount (Cost)</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="INR 0.00"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label>Notes</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder=""
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label>Remark</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder=""
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 mt-2">
                        <div className="form-group">
                          <label>Status</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Sumitted"
                            fdprocessedid="qv9ju9"
                            disabled=""
                          />
                          <p
                            className="text-decoration-underline mt-1"
                            data-bs-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                            onClick={detailsDropdown}
                          >
                            Change Status
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3 mt-4">
                        <div className="form-group">
                          <label className="me-4">Is Active</label>
                          <input
                            className=""
                            type="checkbox"
                            placeholder="Sumitted"
                            fdprocessedid="qv9ju9"
                          />
                        </div>
                      </div>
{detailsDetails && (
                      <div className=" " id="collapseExample">
                        <div className="row">
                          <div className="col-md-3 mt-5">
                            <div className="form-group">
                              {/* <label></label> */}
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">Select</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6 mt-1">
                            <div className="form-group">
                              <label>Remarks</label>
                              <textarea
                                className="form-control"
                                rows={2}
                                placeholder=""
                                defaultValue={""}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-2 justify-content-center">
                          <div className="col-md-2">
                            <button
                              className="purple-btn2 w-100"
                              fdprocessedid="u33pye"
                            >
                              Create
                            </button>
                          </div>
                          <div className="col-md-2">
                            <button
                              className="purple-btn1 w-100"
                              fdprocessedid="af5l5g"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
)}
                    </div>
                  </div>
)}
                </div>
                <div className="card mt-3 collapsed-card">
                  <div className="card-header3">
                    <h3 className="card-title">BOQ Sub-Item</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={subBoqDetailsDropdown}
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
{subBoqDetails && (
                  <div
                    className="card-body mt-0 pt-0"
                    style={{ display: "block" }}
                  >
                    {/*  */}
                    <div className="tbl-container mx-3 mt-1">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th rowSpan={2} />
                            <th rowSpan={2}>Sub Item Name </th>
                            <th rowSpan={2}>Description</th>
                            <th rowSpan={2}>Notes</th>
                            <th rowSpan={2}>Remarks</th>
                            <th rowSpan={2}>UOM</th>
                            <th colSpan={3}>Cost</th>
                            <th rowSpan={2}>Document</th>
                          </tr>
                          <tr>
                            <th>Quantity</th>
                            <th colSpan={1}>Rate</th>
                            <th colSpan={1}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-plus-circle"
                                viewBox="0 0 16 16"
                                data-bs-toggle="collapse"
                                href="#collapsetableExample"
                                role="button"
                                aria-expanded="false"
                                aria-controls="collapseExample"
                                onClick={subItemDropdown}
                              >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                              </svg>
                            </td>
                            <td>1"GI Pipe</td>
                            <td>
                              <input className="form-control" type="text" />
                            </td>
                            <td>
                              <input className="form-control" type="text" />
                            </td>
                            <td>
                              <input className="form-control" type="text" />
                            </td>
                            <td>FEET </td>
                            <td>410.00000</td>
                            <td>335.000</td>
                            <td>1.37,350</td>
                            <td>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={18}
                                height={18}
                                fill="currentColor"
                                className="bi bi-file-earmark-medical"
                                viewBox="0 0 16 16"
                              >
                                <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                              </svg>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {subItemDetails && (
                    <div className=" " id="collapsetableExample">
                      <div className="card mx-3 mt-2 collapsed-card">
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
                        {materialDetails && (
                        <div
                          className="card-body mt-0 pt-0"
                          style={{ display: "block" }}
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
                      <div className="card mx-3 mt-2 collapsed-card">
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
                          style={{ display: "block" }}
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
                      <div className="card mx-3 mt-2 collapsed-card">
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
                          style={{ display: "block" }}
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
)}
                </div>
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-2">
                    <button
                      className="purple-btn1 w-100"
                      fdprocessedid="u33pye"
                    >
                      Back
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 px-2">
                    <h5>Audit Log</h5>
                    <div className="tbl-container me-2 mt-3">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Pratham Shastri</td>
                            <td>15-02-2024</td>
                            <td>Verified</td>
                            <td>Verified &amp; Processed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BOQApprovalDetails;
