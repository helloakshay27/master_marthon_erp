import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const BillBookingCreate = () => {
    const [actionDetails, setactionDetails] = useState(false);
    const [selectPOModal, setselectPOModal] = useState(false);
    const [selectGRNModal, setselectGRNModal] = useState(false);
    const [attachOneModal, setattachOneModal] = useState(false);
    const [attachTwoModal, setattachTwoModal] = useState(false);
    const [attachThreeModal, setattachThreeModal] = useState(false);

    // action dropdown
    const actionDropdown = () => {
        setactionDetails(!actionDetails);
      };
    //   modal
    const openSelectPOModal = () => setselectPOModal(true);
    const closeSelectPOModal = () => setselectPOModal(false);

    const openSelectGRNModal = () => setselectGRNModal(true);
    const closeSelectGRNModal = () => setselectGRNModal(false);

    const openAttachOneModal = () => setattachOneModal(true);
    const closeAttachOneModal = () => setattachOneModal(false);
    
    const openAttachTwoModal = () => setattachTwoModal(true);
    const closeAttachTwoModal = () => setattachTwoModal(false);
    
    const openAttachThreeModal = () => setattachThreeModal(true);
    const closeAttachThreeModal = () => setattachThreeModal(false);
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Bill Booking</a>
          <h5 className="mt-3">Bill Booking</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>ID</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={123}
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Alabama</option>
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
                      <label>Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Alabama</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Alabama</option>
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
                      <label>Supplier</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Vendor Name</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-1 pt-2 mt-2">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div>
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>PO Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-1 pt-4"
                    data-bs-toggle="modal"
                    data-bs-target="#selectModal"
                    onClick={openSelectPOModal}
                  >
                    <p className="mt-2 text-decoration-underline">Select</p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Type</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>E-Invoice</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Vendor Name</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Invoice Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Value</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>GSTIN</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-1 pt-4 mt-2">
                    <p className="mt-2 text-decoration-underline">Verify</p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PAN</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Type of Certificate</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Vendor Name</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount Payable</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount Paid</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount Pending</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Vendor Name</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">GRN Details</h5>
                  <div
                    className="card-tools d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#RevisionModal"
                  >
                    <button
                      className="purple-btn2 rounded-3"
                      data-bs-toggle="modal"
                      data-bs-target="#RevisionModal"
                      fdprocessedid="xn3e6n"
                      onClick={openSelectGRNModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Select GRN</span>
                    </button>
                  </div>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Material Name</th>
                        <th className="text-start">Material GRN Amount</th>
                        <th className="text-start">Certified Till Date</th>
                        <th className="text-start">Base Cost</th>
                        <th className="text-start">Net Taxes</th>
                        <th className="text-start">Net Charges</th>
                        <th className="text-start">Qty</th>
                        <th className="text-start">All Inclusive Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start"> 1</td>
                        <td className="text-start" />
                        <td className="text-start"> </td>
                        <td className="text-start" />
                        <td className="text-start text-decoration-underline" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td />
                        <td />
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
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Pending Advances (&gt; 60 days)</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project</th>
                        <th className="text-start">PO No.</th>
                        <th className="text-start">Paid Ammount</th>
                        <th className="text-start">Adjusted Amount</th>
                        <th className="text-start">Balance Amount</th>
                        <th className="text-start">
                          Current Adjustment Amount
                        </th>
                        <th className="text-start">Net Amount</th>
                        <th className="text-start">Add Certificate No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start"> 1</td>
                        <td className="text-start" />
                        <td className="text-start"> </td>
                        <td className="text-start" />
                        <td className="text-start text-decoration-underline" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td />
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
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Deduction:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th className="text-start" style={{ width: 200 }}>
                    Tax / Charge Type
                  </th>
                  <th className="text-start">Tax / Charges per UOM (INR)</th>
                  <th className="text-start">Inclusive / Exculsive</th>
                  <th className="text-start">Amount</th>
                  <th className="text-start">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="text-start">Taxable Amount</th>
                  <td className="text-start" />
                  <td className="text-start"> </td>
                  <td className="text-start" />
                  <td className="text-start" />
                </tr>
                <tr>
                  <th className="text-start">Deduction Tax</th>
                  <td className="text-start" />
                  <td className="text-start"> </td>
                  <td className="text-start"> </td>
                  <td>
                    <a
                      data-toggle="collapse"
                      href="#collapse1"
                      onClick={actionDropdown}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        className="bi bi-plus-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                      </svg>
                    </a>
                  </td>
                </tr>
                {actionDetails && (
                <tr>
                  <td colSpan={2}>
                    <div className="d-flex">
                      <input
                        className="me-2"
                        style={{ width: "61%" }}
                        type="text"
                      />
                      <input
                        className="me-5 ms-5"
                        style={{ width: "100%" }}
                        type="text"
                      />
                    </div>
                  </td>
                </tr>
                )}
                <tr>
                  <th className="text-start">Total Deduction</th>
                  <td className="text-start" />
                  <td className="text-start"> </td>
                  <td className="text-start" />
                  <td className="text-start" />
                </tr>
                <tr>
                  <th className="text-start">Payble Amount</th>
                  <td className="text-start" />
                  <td className="text-start"> </td>
                  <td className="text-start" />
                  <td className="text-start" />
                </tr>
              </tbody>
            </table>
          </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">Base Cost</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">Handling Charges</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">CGST</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">SGST</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax</th>
                        <th className="text-start">Tax Amount</th>
                        <th className="text-start">Tax Adjusted</th>
                        <th className="text-start">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start"> </td>
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project Name</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Advance Amount</th>
                        <th className="text-start">Advance Paid Till Date</th>
                        <th className="text-start">Debit Note for Advance</th>
                        <th className="text-start">Advance Outstanding</th>
                        <th className="text-start">
                          Current Advance Deduction
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start">Total</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Current advance deduction:</h5>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Total advance deduction amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Other Deduction</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={123}
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Other Deduction Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Addition</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={123}
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8 mt-2">
                    <div className="form-group">
                      <label>Other Addition Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Debit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Percentage</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="%"
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Amount Payable</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Round Off Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Favouring / Payee</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Due Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Certified Till Date</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8 mt-2">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Expected Payment Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Processed Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Status</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">ID</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Advance Amount (INR)</th>
                        <th className="text-start">
                          Debit Note For Advance (INR)
                        </th>
                        <th className="text-start">
                          Advance Adjusted Till Date (INR)
                        </th>
                        <th className="text-start">
                          Advance Outstanding till Certificate Date (INR)
                        </th>
                        <th className="text-start">
                          Advance Outstanding till current Date (INR)
                        </th>
                        <th className="text-start">This Recovery (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">1</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Payment Details</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Mode of Payment</th>
                        <th className="text-start">Instrument Date</th>
                        <th className="text-start">Instrument No.</th>
                        <th className="text-start">Bank / Cash Account</th>
                        <th className="text-start">Amount</th>
                        <th className="text-start">Created by</th>
                        <th className="text-start">Created On</th>
                        <th className="text-start">Status</th>
                        <th className="text-start">View Cheque Details</th>
                        <th className="text-start">Print</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">1</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Debit Note No.</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Debit Note Amount</th>
                        <th className="text-start">
                          Debit Note Recovery Till Date
                        </th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Debit Note Reason Type</th>
                        <th className="text-start">This Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">1</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Document Attachment</h5>
                  <div
                    className="card-tools d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <button
                      className="purple-btn2 rounded-3"
                      data-bs-toggle="modal"
                      data-bs-target="#viewDocumentModal"
                      fdprocessedid="xn3e6n"
                      onClick={openAttachOneModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Attach</span>
                    </button>
                  </div>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">File Name</th>
                        <th className="text-start">File Type</th>
                        <th className="text-start">Upload Date</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start">PO.pdf</td>
                        <td className="text-start">04-03-2024</td>
                        <td
                          className="text-decoration-underline cursor-pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openAttachTwoModal}                        >
                          View
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Remark</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Assigned To User</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Shamshik
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Status</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Received for Verification
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <h5 className=" mt-3">Audit Log</h5>
              <div className="px-3">
                <div className="tbl-container px-0">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>From Status</th>
                        <th>To Status</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Days</th>
                        <th>User</th>
                        <th>Remark</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>Draft</td>
                        <td>Received</td>
                        <td>01-01-24</td>
                        <td>01-02-24</td>
                        <td />
                        <td>User 1</td>
                        <td>
                          <i
                            className="fa-regular fa-eye"
                            data-bs-toggle="modal"
                            data-bs-target="#remark-modal"
                            style={{ fontSize: 18 }}
                          />
                        </td>
                        <td>
                          <i
                            className="fa-regular fa-eye"
                            data-bs-toggle="modal"
                            data-bs-target="#comments-modal"
                            style={{ fontSize: 18 }}
                          />
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

      {/* modal */}
      <Modal
        centered
        size="lg"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
  <div className="d-flex justify-content-between mt-3 me-2">
    <h5 className=" ">Category of PO</h5>
  </div>
  <div className="radio-buttons d-flex align-items-center gap-4">
    <div className="form-check">
      <button
        className="border-0 "
        data-bs-toggle="modal"
        data-bs-target="#exampleModal2"
      >
        <input className="form-check-input" type="radio" name="radio1" />
      </button>
      <label className="form-check-label" htmlFor="yesRadio">
        Material
      </label>
    </div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name="radio1"
        id="noRadio"
      />
      <label className="form-check-label" htmlFor="noRadio">
        Asset
      </label>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label>Project</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Sub Project</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>PO Number</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Supplier</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>PO Start Date</label>
        <input
          className="form-control"
          type="date"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>PO End Date</label>
        <input
          className="form-control"
          type="date"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Indent</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Work Order</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Work Catogery</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Contractor</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Search
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Select All
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn1 w-100" fdprocessedid="u33pye">
        Reset
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn1 w-100" fdprocessedid="u33pye">
        Close
      </button>
    </div>
  </div>
  <div className="d-flex justify-content-between mt-3 me-2">
    <h5 className=" ">Search Result</h5>
  </div>
  <div className="tbl-container mx-3 mt-3">
    <table className="w-100">
      <thead>
        <tr>
          <th className="text-start">Sr.No</th>
          <th className="text-start">PO Number</th>
          <th className="text-start">PO Date</th>
          <th className="text-start">Upload Date</th>
          <th className="text-start">Uploaded By</th>
          <th className="text-start">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-start">1</td>
          <td className="text-start">MTC</td>
          <td className="text-start">Material test Cert 1.pdf</td>
          <td className="text-start">01-04-2024</td>
          <td className="text-start">vendor user</td>
          <td>
            <i
              className="fa-regular fa-eye"
              data-bs-toggle="modal"
              data-bs-target="#remark-modal"
              style={{ fontSize: 18 }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

          <div className="row mt-2 justify-content-center">
  <div className="col-md-2">
    <button className="purple-btn1 w-100" fdprocessedid="u33pye">
      Close
    </button>
  </div>
</div>
        </Modal.Body>
         
      </Modal>

      {/*  */}
      <Modal
       centered
       size="lg"
       show={selectGRNModal}
       onHide={closeSelectGRNModal}
       backdrop="static"
       keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>PO Number</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>GRN Number</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Delivery Challan No</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Amount (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Certified Till Date (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>All Inclusive Cost (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
  </div>
  <div className=" mt-3 me-2">
    <h5 className=" ">GRN Details</h5>
  </div>
  <div className="tbl-container mx-3 mt-3">
    <table className="w-100">
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          <th>Material Name</th>
          <th>Material GRN Amount</th>
          <th>Certified Till Date</th>
          <th>Base cost</th>
          <th>Net Taxes</th>
          <th>Net Charges</th>
          <th>Qty</th>
          <th>All Inclusive Cost</th>
          <th>Taxes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="checkbox" />
          </td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td
            className="text-decoration-underline"
            data-bs-toggle="modal"
            data-bs-target="#taxesModal"
          >
            Taxes
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Submit
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
        Cancel
      </button>
    </div>
  </div>
        </Modal.Body>

      </Modal>

      {/*  */}
      <Modal
      centered
      size="lg"
      show={attachOneModal}
      onHide={closeAttachOneModal}
      backdrop="static"
      keyboard={false}
      >
      <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
  <div>
    <div className="d-flex justify-content-between mt-3 me-2">
      <h5 className=" ">Latest Documents</h5>
      <div
        className="card-tools d-flex"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <button
          className="purple-btn2 rounded-3"
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
          data-bs-target="#secModal"
          fdprocessedid="xn3e6n"
          onClick={openAttachTwoModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            fill="currentColor"
            className="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
          </svg>
          <span>Attach</span>
        </button>
      </div>
    </div>
    <div className="tbl-container px-0">
      <table className="w-100">
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Document Name</th>
            <th>Attachment Name</th>
            <th>Upload Date</th>
            <th>Uploaded By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td>MTC</td>
            <td>Material test Cert 1.pdf</td>
            <td>01-03-2024</td>
            <td>vendor user</td>
            <td>
              <i
                className="fa-regular fa-eye"
                data-bs-toggle="modal"
                data-bs-target="#comments-modal"
                style={{ fontSize: 18 }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className=" mt-3 me-2">
      <h5 className=" ">Document Attachment History</h5>
    </div>
    <div className="tbl-container px-0">
      <table className="w-100">
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Document Name</th>
            <th>Attachment Name</th>
            <th>Upload Date</th>
            <th>Uploaded By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td>MTC</td>
            <td>Material test Cert 1.pdf</td>
            <td>01-03-2024</td>
            <td>vendor user</td>
            <td>
              <i
                className="fa-regular fa-eye"
                data-bs-toggle="modal"
                data-bs-target="#comments-modal"
                style={{ fontSize: 18 }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-4">
      <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
        Close
      </button>
    </div>
  </div>
 

        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal
       centered
       size="lg"
       show={attachTwoModal}
       onHide={closeAttachTwoModal}
       backdrop="static"
       keyboard={false}
      >
      <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>PO Number</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>GRN Number</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Delivery Challan No</label>
        <input
          className="form-control"
          type="text"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Amount (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Certified Till Date (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>All Inclusive Cost (INR)</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
  </div>
  <div className=" mt-3 me-2">
    <h5 className=" ">GRN Details</h5>
  </div>
  <div className="tbl-container mx-3 mt-3">
    <table className="w-100">
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          <th>Material Name</th>
          <th>Material GRN Amount</th>
          <th>Certified Till Date</th>
          <th>Base cost</th>
          <th>Net Taxes</th>
          <th>Net Charges</th>
          <th>Qty</th>
          <th>All Inclusive Cost</th>
          <th>Taxes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="checkbox" />
          </td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td
            className="text-decoration-underline"
            data-bs-toggle="modal"
            data-bs-target="#taxesModal"
            data-bs-dismiss="modal"
            onClick={openAttachThreeModal}
          >
            Taxes
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-4">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Submit
      </button>
    </div>
    <div className="col-md-4">
      <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
        Cancel
      </button>
    </div>
  </div>
        </Modal.Body>
      </Modal>

       {/*  */}
       <Modal
        centered
        size="lg"
        show={attachThreeModal}
        onHide={closeAttachThreeModal}
        backdrop="static"
        keyboard={false}
       >
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="tbl-container mx-3 mt-3">
  <table className="w-100">
    <thead>
      <tr>
        <th>Tax / Charge Type</th>
        <th>Tax / Charges per UOM (INR)</th>
        <th>Inclusive / Exculsive</th>
        <th>Amount</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Total Base Cost</th>
        <td />
        <td />
        <td>3000</td>
        <td />
      </tr>
      <tr>
        <th>Addition Tax &amp; Charges</th>
        <td />
        <td />
        <td />
        <td className="row-1" data-group={1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-plus-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </td>
      </tr>
      <tr className="row-2" data-group={1}>
        <td>
          <select
            className="form-control form-select"
            style={{ width: "100%" }}
            fdprocessedid="3x7jfv"
          >
            <option selected="selected">Vendor Name</option>
            <option>Alaska</option>
            <option>California</option>
            <option>Delaware</option>
            <option>Tennessee</option>
            <option>Texas</option>
            <option>Washington</option>
          </select>
        </td>
        <td>
          <select
            className="form-control form-select"
            style={{ width: "100%" }}
            fdprocessedid="3x7jfv"
          >
            <option selected="selected">Vendor Name</option>
            <option>Alaska</option>
            <option>California</option>
            <option>Delaware</option>
            <option>Tennessee</option>
            <option>Texas</option>
            <option>Washington</option>
          </select>
        </td>
        <td>
          <input type="checkbox" />
        </td>
        <td>270</td>
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-dash-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
          </svg>{" "}
        </td>
      </tr>
      <tr className="row-2" data-group={1}>
        <td> Sub Total A (Addition)</td>
        <td />
        <td />
        <td />
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-dash-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
          </svg>
        </td>
      </tr>
      <tr>
        <th>Gross Amount</th>
        <td />
        <td />
        <td>3540</td>
        <td />
      </tr>
      <tr>
        <th className="row-1" data-group={2}>
          Deduction Tax
        </th>
        <td />
        <td />
        <td />
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-plus-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </td>
      </tr>
      <tr className="row-2" data-group={2}>
        <td>
          <select
            className="form-control form-select"
            style={{ width: "100%" }}
            fdprocessedid="3x7jfv"
          >
            <option selected="selected">Vendor Name</option>
            <option>Alaska</option>
            <option>California</option>
            <option>Delaware</option>
            <option>Tennessee</option>
            <option>Texas</option>
            <option>Washington</option>
          </select>
        </td>
        <td>
          <select
            className="form-control form-select"
            style={{ width: "100%" }}
            fdprocessedid="3x7jfv"
          >
            <option selected="selected">Vendor Name</option>
            <option>Alaska</option>
            <option>California</option>
            <option>Delaware</option>
            <option>Tennessee</option>
            <option>Texas</option>
            <option>Washington</option>
          </select>
        </td>
        <td>
          <input type="checkbox" />
        </td>
        <td>30</td>
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-dash-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
          </svg>{" "}
        </td>
      </tr>
      <tr className="row-2" data-group={2}>
        <td>Payble Amount</td>
        <td />
        <td />
        <td>3510</td>
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-dash-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
          </svg>
        </td>
      </tr>
    </tbody>
  </table>
</div>

        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillBookingCreate;