import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";

const BillBookingDetails = () => {
  const [actionDetails, setactionDetails] = useState(false);
  const [attachOneModal, setattachOneModal] = useState(false);

  const openAttachOneModal = () => setattachOneModal(true);
  const closeAttachOneModal = () => setattachOneModal(false);

  const actionDropdown = () => {
    setactionDetails(!actionDetails);
  };

  // Function to add a new charge row
  const addCharge = () => {
    setCharges([
      ...charges,
      { id: Date.now(), type: "", amount: 0, inclusive: false },
    ]);
  };

  // Function to remove a charge row
  const removeCharge = (id) => {
    setCharges(charges.filter((charge) => charge.id !== id));
  };

  // Function to add a new deduction row
  const addDeduction = () => {
    setDeductions([...deductions, { id: Date.now(), type: "", amount: 0 }]);
  };

  // Function to remove a deduction row
  const removeDeduction = (id) => {
    setDeductions(deductions.filter((deduction) => deduction.id !== id));
  };

  const [rows, setRows] = useState([
    { id: 1, type: "TDS 1", charges: "100", inclusive: false, amount: 50.0 },
  ]);
  const [showRows, setShowRows] = useState(true);

  // Add New Row
  const handleAddRow = () => {
    const newRow = {
      id: new Date().getTime(), // Unique ID
      type: "New Type",
      charges: "0",
      inclusive: false,
      amount: 0.0,
    };
    setRows((prevRows) => [...prevRows, newRow]); // Ensure correct state update
  };

  // Delete Row
  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Toggle Rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid px-3">
          <a href="">
            Home &gt; Billing &amp; Accounts &gt; Bill Booking Details
          </a>
          <h5 className="mt-3">Bill Booking Details</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="details_page">
                  <div className="row px-3">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>ID</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Aakash Infra Ltd.
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Company</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Aakash Infra Ltd.
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Aakash Project
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Sub Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Aakash sub project
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Supplier</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Infra Ltd.
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          989898
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Type</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Ltd type
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          00009
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>E-Invoice</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Invoice
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          12/5/24
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          6000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Value</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Demo value
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>GSTIN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          GSTIN989877
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PAN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          BAFPN5656
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Type of Certificate</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          demo certificate
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Payable</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          20000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Paid</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          4000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Pending</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          3000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Department</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Demo Department
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">GRN Details</h5>
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
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">
                          Tax / Charges per UOM (INR)
                        </th>
                        <th className="text-start">Inclusive / Exclusive</th>
                        <th className="text-start">Amount</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-start">Taxable Amount</th>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start">3000</td>
                        <td />
                      </tr>
                      <tr>
                        <th className="text-start">Deduction Tax</th>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td>
                          {/* Add Row Using Plus Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                            style={{ cursor: "pointer" }}
                            onClick={handleAddRow} // Add Row on Click
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                          </svg>
                        </td>
                      </tr>

                      {/* Dynamic Rows */}
                      {rows.map((row) => (
                        <tr key={row.id}>
                          <td className="text-start">
                            <select className="form-control form-select">
                              <option selected>{row.type}</option>
                              <option>Other Type</option>
                            </select>
                          </td>
                          <td className="text-start">
                            <select className="form-control form-select">
                              <option selected>{row.charges}</option>
                              <option>Other Charges</option>
                            </select>
                          </td>
                          <td className="text-start"></td>
                          <td className="text-start"></td>
                          <td
                            className="text-start"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-dash-circle"
                              viewBox="0 0 16 16"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                            </svg>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <th className="text-start">Total Deduction</th>
                        <td className="text-start" />
                        <td className="" />
                        <td className="text-start">3540</td>
                        <td />
                      </tr>
                      <tr>
                        <th className="text-start">Payable Amount</th>
                        <td className="text-start" />
                        <td className="" />
                        <td className="text-start" />
                        <td />
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
                  <h5 className=" ">Advance Deductions:</h5>
                </div>
                <div className="details_page">
                  <div className="row px-3">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Deduction</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Document
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Deduction Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Done/pending
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Addition</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Demo Addition
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Addition Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          work in progress
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Debit Note Adjustment</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Demo debit note
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Total Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          10000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Percentage</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>{" "}
                          55%
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          5000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Amount Payable</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          7000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Round Off Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          17000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Favouring / Payee</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          6000
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Payment Mode</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          UPI
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Payment Due Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          30/5/24
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Total Certified Till Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          5
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Pament pending
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Expected Payment Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          29/5/24
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Processed Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          25/4/24
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Status</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Demo Status
                        </label>
                      </div>
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
                          className="text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={openAttachOneModal}
                        >
                          Action
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

              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                >
                  <option value="draft">PO Draft</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                  <option value="submit">Submit</option>
                </select>
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
              <div className="mx-0">
                <Table columns={auditLogColumns} data={auditLogData} />
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  // onClick={openAttachTwoModal}
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
              {/* <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Close
              </button> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillBookingDetails;
