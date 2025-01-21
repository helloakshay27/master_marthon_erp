import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";

const BillPaymentCreate = () => {
  const [makeCashModal, setmakeCashModal] = useState(false);
  const [makeBankModal, setmakeBankModal] = useState(false);
  const [makeAdjustModal, setmakeAdjustModal] = useState(false);
  const [selectPOModal, seselectPOModal] = useState(false);
  const [uploadModal, setuploadModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);
  const [showRows, setShowRows] = useState(false);
  

  const openCashModal = () => setmakeCashModal(true);
  const closeCashModal = () => setmakeCashModal(false);

  const openBankModal = () => setmakeBankModal(true);
  const closeBankModal = () => setmakeBankModal(false);
  
  const openAdjustModal = () => setmakeAdjustModal(true);
  const closeAdjustModal = () => setmakeAdjustModal(false);

  const openselectPOModal = () => seselectPOModal(true);
  const closeselectPOModal = () => seselectPOModal(false);

  const openuploadModal = () => setuploadModal(true);
  const closeuploadModal = () => setuploadModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);

  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);

    // add row & delete row
    const [tableRows, setTableRows] = useState([
      { id: 1, type: "Tax Type 1", charges: "100", inclusive: false },
    ]);
  
    const handleAddRow = () => {
      const newRow = { id: Date.now(), type: "", charges: "", inclusive: false };
      setTableRows([...tableRows, newRow]);
    };
  
    const handleDeleteRow = (id) => {
      setTableRows(tableRows.filter((row) => row.id !== id));
    };
  
    const handleChange = (id, field, value) => {
      setTableRows(
        tableRows.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        )
      );
    };
    // add row & delete row
   // tax table functionality

   const [rows, setRows] = useState([
    {
      id: 1,
      type: "TDS 1",
      charges: "100",
      inclusive: false,
      amount: 50.0,
    },
  ]);

  // Toggle visibility of rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  // Delete a specific row
  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Calculate Sub Total (Addition)
  const calculateSubTotal = () => {
    return rows.reduce((total, row) => total + row.amount, 0).toFixed(2); // Sum of all amounts
  };
  // tax table functionality
  
  return (
     <>
      <div className="website-content overflow-auto">
  <div className="module-data-section container-fluid">
    <a href="">Home &gt; Accounts &gt; Bill payment</a>
    <h5 className="mt-3">Bill payment</h5>
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
              <p className="mt-2 text-decoration-underline">View Details</p>
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
              onClick={openselectPOModal}
            >
              <p className="mt-2 text-decoration-underline">Select</p>
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
                <label>UAN No.</label>
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
                  <th className="text-start">Current Adjustment Amount</th>
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
                                  <th className="text-start">
                                    Tax / Charge Type
                                  </th>
                                  <th className="text-start">
                                    Tax / Charges per UOM (INR)
                                  </th>
                                  <th className="text-start">
                                    Inclusive / Exclusive
                                  </th>
                                  <th className="text-start">Amount</th>
                                  <th className="text-start">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Static Rows */}
                                <tr>
                                  <th className="text-start">
                                  Taxable Amount
                                  </th>
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start">3000</td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">
                                  Deduction Tax
                                  </th>
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td onClick={toggleRows}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-plus-circle"
                                      viewBox="0 0 16 16"
                                      style={{
                                        transform: showRows
                                          ? "rotate(45deg)"
                                          : "none",
                                        transition: "transform 0.3s ease",
                                      }}
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                    </svg>
                                  </td>
                                </tr>
                                {/* Dynamic Rows */}
                                {showRows &&
                                  rows.map((row) => (
                                    <tr key={row.id}>
                                      <td className="text-start">
                                        <select className="form-control form-select">
                                          <option selected>{row.type}</option>
                                          <option>Other Type</option>
                                        </select>
                                      </td>
                                      <td className="text-start">
                                        <select className="form-control form-select">
                                          <option selected>
                                            {row.charges}
                                          </option>
                                          <option>Other Charges</option>
                                        </select>
                                      </td>
                                     
                                      <td></td>
                                     
                                      <td></td>
                                      <td
                                        className="text-start"
                                        onClick={() => deleteRow(row.id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-dash-circle"
                                          viewBox="0 0 16 16"
                                          style={{
                                            transition: "transform 0.3s ease",
                                          }}
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                                        </svg>
                                      </td>
                                    </tr>
                                  ))}
                                {/* Dynamic Sub Total Row */}
                                {/* Static Rows */}
                                <tr>
                                  <th className="text-start">Total Deduction</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start">3540</td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">Payble Amount</th>
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
                  <th className="text-start">Company Name</th>
                  <th className="text-start">Project Name</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Advance Amount</th>
                  <th className="text-start">Advance Paid Till Date</th>
                  <th className="text-start">Debit Note for Advance</th>
                  <th className="text-start">Advance Outstanding</th>
                  <th className="text-start">Current Advance Deduction</th>
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
                  <td className="text-start" />
                </tr>
                <tr>
                  <td className="text-start" />
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
                  <th className="text-start">Debit Note For Advance (INR)</th>
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
            <div
              className="card-tools d-flex"
              data-bs-toggle="modal"
              data-bs-target="#uploadModal"
              onClick={openuploadModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                height={40}
                fill="currentColor"
                className="bi bi-file-earmark-arrow-down"
                viewBox="0 0 16 16"
              >
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>
            </div>
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
                  <th className="text-start">Reconsilation Date</th>
                  <th className="text-start">Cheque Print</th>
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
          <div className="row mt-2 justify-content-center">
            <div
              className="col-md-3"
              data-bs-toggle="modal"
              data-bs-target="#makecasheModal"
              onClick={openCashModal}
            >
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Make Cash Payment
              </button>
            </div>
            <div
              className="col-md-3"
              data-bs-toggle="modal"
              data-bs-target="#makebankModal"
              onClick={openBankModal}
            >
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Make Bank Payment
              </button>
            </div>
            <div
              className="col-md-3"
              data-bs-toggle="modal"
              data-bs-target="#makeadjustmentModal"
              onClick={openAdjustModal}
            >
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Make Adjustment Entry
              </button>
            </div>
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
                  <th className="text-start">Debit Note Recovery Till Date</th>
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
                data-bs-target="#RevisionModal"
                fdprocessedid="xn3e6n"
                onClick={openattachModal}
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
                    className="text-decoration-underline"
                    data-bs-toggle="modal"
                    data-bs-target="#viewDocumentModal"
                    onClick={openviewDocumentModal}
                  >
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
       <div className="mx-0">
                                               <Table columns={auditLogColumns} data={auditLogData} />
                                             </div>
      </div>
    </div>
  </div>
</div>

 {/* cash modal start */}
 <Modal
        centered
        size="l"
        show={makeCashModal}
        onHide={closeCashModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
         <Modal.Header closeButton>
          <h5>Cash Payment Details</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label>Certifying Company</label>
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
        <label>Outstanding Amount</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Voucher Date <span>*</span>
        </label>
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
        <label>
          Cash Account <span>*</span>
        </label>
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
    <div className="col-md-6">
      <div className="form-group">
        <label>Closing Balance Amount</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Favouring / Payee<span>*</span>
        </label>
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
        <label>
          Amount<span>*</span>
        </label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Narration</label>
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
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Submit
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
        Reset
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
      {/* cash modal end */}

      {/* bank modal start */}
      <Modal
        centered
        size="l"
        show={makeBankModal}
        onHide={closeBankModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
         <Modal.Header closeButton>
          <h5>Bank Payment Details</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label>Certifying Company</label>
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
        <label>Outstanding Amount</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Voucher Date <span>*</span>
        </label>
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
        <label>
          Instrument Date<span>*</span>
        </label>
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
        <label>
          Bank Account <span>*</span>
        </label>
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
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Instrument No. <span>*</span>
        </label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Closing Balance Amount</label>
        <input
          className="form-control"
          type="number"
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Favouring / Payee<span>*</span>
        </label>
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
        <label>
          Amount<span>*</span>
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="INR"
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Narration</label>
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
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Submit
      </button>
    </div>
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
        Reset
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
      {/* bank modal end */}

      {/* Adjust modal start */}
      <Modal
        centered
        size="lg"
        show={makeAdjustModal}
        onHide={closeAdjustModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
         <Modal.Header closeButton>
          <h5>Payment Adjustment</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label>Company</label>
        <input
          className="form-control"
          type="text"
          placeholder={123}
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-6">
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
    <div className="col-md-6">
      <div className="form-group">
        <label>Voucher Type</label>
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
    <div className="col-md-6">
      <div className="form-group">
        <label>
          Voucher Date <span>*</span>
        </label>
        <input
          className="form-control"
          type="text"
          placeholder={123}
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
  </div>
  <div>
      <div className="tbl-container me-2 mt-3 mx-3">
        <table id="table3" className="w-100">
          <thead>
            <tr>
              <th />
              <th>Dr/Cr</th>
              <th>Ledger Account</th>
              <th>Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id}>
                <td />
                <td>
                  <div className="form-group">
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                      value={row.type}
                      onChange={(e) =>
                        handleChange(row.id, "type", e.target.value)
                      }
                    >
                      <option value="Tax Type 1">Tax Type 1</option>
                      <option value="Tax Type 2">Tax Type 2</option>
                    </select>
                  </div>
                </td>
                <td />
                <td>
                  <input
                    type="number"
                    value={row.charges}
                    onChange={(e) =>
                      handleChange(row.id, "charges", e.target.value)
                    }
                  />
                </td>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end">
    <p className="me-5">Total</p>
    <p className="me-3">
      Dr. <span>:0.00</span>
    </p>
    <p className="me-3">
      Cr. <span>:0.00</span>
    </p>
  </div>

      {/* Buttons placed side by side */}
      
      <div className="row mx-3">
  <p>
    <button
      className="fw-bold text-decoration-underline border-0"
      // onclick="myCreateFunction('table3')"
      style={{ color: "var(--red)" }}
      onClick={handleAddRow}
    >
      Add Row
    </button>{" "}
    |
    <button
      className="fw-bold text-decoration-underline border-0"
      onClick={() => handleDeleteRow(tableRows[tableRows.length - 1]?.id)}
      style={{ color: "var(--red)" }}
    >
      Delete Row
    </button>
  </p>
</div>

    </div>

  <div className="row">
    <div className="col-md-12">
      <div className="form-group">
        <label>Narration</label>
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
    <div className="col-md-3">
      <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
        Create
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
      {/* Adjust modal end */}

      {/* select po modal */}
<Modal 
centered
size="lg"
show={selectPOModal}
onHide={closeselectPOModal}
backdrop="true"
keyboard={true}
className="modal-centered-custom"
>
<Modal.Header closeButton>
          <h5>Select PO</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="modal-body pt-0">
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
</div>

          </Modal.Body>

</Modal>
      {/* select po modal */}

      {/* upload modal */}
      <Modal 
centered
size="l"
show={uploadModal}
onHide={closeuploadModal}
backdrop="true"
keyboard={true}
className="modal-centered-custom"
>
<Modal.Header closeButton>
          <h5>Upload Document</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-12">
      <div className="form-group">
        <label>Name of the Document</label>
        <input
          className="form-control"
          type=""
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-12 mt-2">
      <div className="form-group">
        <form action="/upload" method="post" encType="multipart/form-data">
          {/* <label for="fileInput">Choose File:</label> */}
          <input type="file" id="fileInput" name="attachment" />
        </form>
      </div>
    </div>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-4">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Attach
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
      {/* upload modal */}

      {/* attach modal */}
      <Modal 
centered
size="l"
show={attachModal}
onHide={closeattachModal}
backdrop="true"
keyboard={true}
className="modal-centered-custom"
>
<Modal.Header closeButton>
          <h5>Attach Other Document</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-12">
      <div className="form-group">
        <label>Name of the Document</label>
        <input
          className="form-control"
          type=""
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-12 mt-2">
      <div className="form-group">
        <form action="/upload" method="post" encType="multipart/form-data">
          {/* <label for="fileInput">Choose File:</label> */}
          <input type="file" id="fileInput" name="attachment" />
        </form>
      </div>
    </div>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-4">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Attach
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
      {/* attach modal */}

      {/* document modal */}
      <Modal 
centered
size="lg"
show={viewDocumentModal}
onHide={closeviewDocumentModal}
backdrop="true"
keyboard={true}
className="modal-centered-custom"
>
<Modal.Header closeButton>
          <h5>Document Attachment</h5>
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
          data-bs-target="#RevisionModal"
          fdprocessedid="xn3e6n"
          onClick={openattachModal}
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
    <div className="col-md-3">
      <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
        Close
      </button>
    </div>
  </div>
          </Modal.Body>

</Modal>
      {/* document modal */}
     </>
  )
}

export default BillPaymentCreate