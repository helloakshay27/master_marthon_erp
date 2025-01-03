import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";
import {
  LayoutModal,
  Table,
} from "../components"

const BOQApprovalDetails = () => {
  const [detailsDetails, setdetailsDetails] = useState(false);
  const [subItemDetails, setsubItemDetails] = useState(false);
  const [subItemDetails2, setsubItemDetails2] = useState(false);
  const [openTRDetails, setopenTRDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the row's expanded state

  const detailsDropdown = () => {
    setdetailsDetails(!detailsDetails);
  };

  const subItemDropdown = () => {
    setsubItemDetails(!subItemDetails);
  };
  const subItemDropdown2 = () => {
    setsubItemDetails2(!subItemDetails2);
  };
  const openTRDropdown = () => {
    setopenTRDetails(!openTRDetails);
  };

  return (
    <>

      <div className="website-content overflow-auto">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">
              Setup &gt; Engineering Setup &gt; BOQ &gt; Approval Details
            </a>
            {/* <h5 class="mt-4">BOQ Approval Details</h5> */}
            <div className="tab-content1 active" id="total-content">
              {/* Total Content Here */}
              <CollapsibleCard title="BOQ Details">
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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
                              Update Status
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
              </CollapsibleCard>

              <CollapsibleCard title="BOQ Sub-Item">
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
                            <button
                              className="btn btn-link p-0"
                              onClick={openTRDropdown}
                              aria-label="Toggle row visibility"
                            >
                              {openTRDetails ? 
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
                        {openTRDetails && (
                          <>
                            <tr>
                              <td>
                                <button
                                  className="btn btn-link p-0"
                                  onClick={subItemDropdown}
                                  aria-label="Toggle row visibility"
                                >
                                  {subItemDetails ?
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
                              <td>MS Fabrication</td>
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
                            
                            <tr>
                              <td colSpan={10}>
                                {subItemDetails && (
                                  <div
                                    className=" "
                                    id="collapsetableExample"
                                  >
                                    <CollapsibleCard title="Material Type">
                                      <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                      >
                                        <div className="tbl-container mx-3 mt-1">
                                          <table className="w-100">
                                            <thead>
                                              <tr>
                                                <th rowSpan={2}>
                                                  Material Type
                                                </th>
                                                <th rowSpan={2}>
                                                  Material Sub-Type
                                                </th>
                                                <th rowSpan={2}>Material</th>
                                                <th rowSpan={2}>
                                                  Generic Specification
                                                </th>
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
                                                <th colSpan={2}>
                                                  Estimated Qty
                                                </th>
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

                                    <CollapsibleCard title="Assests Type">
                                      <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                      >
                                        <div className="tbl-container mx-3 mt-1">
                                          <table className="w-100">
                                            <thead>
                                              <tr>
                                                <th rowSpan={2}>
                                                  Assest Type
                                                </th>
                                                <th rowSpan={2}>
                                                  Assest Sub-Type
                                                </th>
                                                <th rowSpan={2}>Assest</th>
                                                <th rowSpan={2}>UOM</th>
                                                <th colSpan={2}>Cost</th>
                                              </tr>
                                              <tr>
                                                <th>Co-Efficient Factor</th>
                                                <th colSpan={2}>
                                                  Estimated Qty
                                                </th>
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

                            <tr>
                              <td>
                                <button
                                  className="btn btn-link p-0"
                                  onClick={subItemDropdown2}
                                  aria-label="Toggle row visibility"
                                >
                                  {subItemDetails2 ? 
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
                              <td>MS Fabrication</td>
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
                            <tr>
                              <td colSpan={10}>
                                {subItemDetails2 && (
                                  <div
                                    className=" "
                                    id="collapsetableExample"
                                  >
                                    <CollapsibleCard title="Material Type">
                                      <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                      >
                                        <div className="tbl-container mx-3 mt-1">
                                          <table className="w-100">
                                            <thead>
                                              <tr>
                                                <th rowSpan={2}>
                                                  Material Type
                                                </th>
                                                <th rowSpan={2}>
                                                  Material Sub-Type
                                                </th>
                                                <th rowSpan={2}>Material</th>
                                                <th rowSpan={2}>
                                                  Generic Specification
                                                </th>
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
                                                <th colSpan={2}>
                                                  Estimated Qty
                                                </th>
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

                                    <CollapsibleCard title="Assests Type">
                                      <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                      >
                                        <div className="tbl-container mx-3 mt-1">
                                          <table className="w-100">
                                            <thead>
                                              <tr>
                                                <th rowSpan={2}>
                                                  Assest Type
                                                </th>
                                                <th rowSpan={2}>
                                                  Assest Sub-Type
                                                </th>
                                                <th rowSpan={2}>Assest</th>
                                                <th rowSpan={2}>UOM</th>
                                                <th colSpan={2}>Cost</th>
                                              </tr>
                                              <tr>
                                                <th>Co-Efficient Factor</th>
                                                <th colSpan={2}>
                                                  Estimated Qty
                                                </th>
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
                          </>



                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CollapsibleCard>
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
              <div className="row mx-2">
                <h5>Audit Log</h5>
                <div className="">
                  <Table columns={auditLogColumns} data={auditLogData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default BOQApprovalDetails;
