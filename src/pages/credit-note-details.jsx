import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreditNoteDetails = () => {
  const { id } = useParams();
  const [showRows, setShowRows] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch credit note data
  useEffect(() => {
    const fetchCreditNoteData = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/credit_notes/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setCreditNoteData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCreditNoteData();
  }, [id]);

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
    return rows.reduce((total, row) => total + row.amount, 0).toFixed(2);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Function to handle the next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle the previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!creditNoteData) return <div>No data found</div>;

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Credit Note </a>
          <h5 className="mt-3">Credit Note </h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 px-2">
              <div
                className="tab-content mor-content active"
                id="pills-tabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <section className="mor p-2 pt-2">
                    <div className="row justify-content-center my-4">
                      <div className="col-md-10">
                        <div className="progress-steps">
                          <div className="top">
                            <div className="progress">
                              <span
                                style={{
                                  width: `${
                                    ((currentStep - 1) / (totalSteps - 1)) * 100
                                  }%`,
                                }}
                              ></span>
                            </div>
                            <div className="steps">
                              {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                  <div
                                    className={`step ${
                                      currentStep > index + 1 ? "active" : ""
                                    }`}
                                    data-step={index + 1}
                                  >
                                    <span></span>
                                  </div>
                                  <p>Layer {index + 1}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="buttons d-m">
                            <button
                              className={`btn btn-prev ${
                                currentStep === 1 ? "disabled" : ""
                              }`}
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            <button
                              className={`btn btn-next ${
                                currentStep === totalSteps ? "disabled" : ""
                              }`}
                              onClick={handleNext}
                              disabled={currentStep === totalSteps}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card card-default"
                      id="mor-material-details"
                    >
                      <div className="card-body">
                        <div className="details_page">
                          <div className="row px-3">
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Company</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.company || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Project</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.project || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Sub-Project</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.sub_project || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Credit Note Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.credit_note_no || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Credit Note Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.credit_note_date
                                    ? new Date(
                                        creditNoteData.credit_note_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Created On</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.created_at
                                    ? new Date(
                                        creditNoteData.created_at
                                      ).toLocaleDateString()
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>PO / WO Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.purchase_order_id || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>PO / WO Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.po_date
                                    ? new Date(
                                        creditNoteData.po_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>PO Value</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.po_value || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Supplier Name</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.supplier_name || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>GSTN No.</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.gstn_no || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>PAN Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.pan_number || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Credit Note Amount</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.credit_note_amount || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Status</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.status || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Remark</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.remark || "-"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mt-3 me-2">
                          <h5 className=" ">Tax Details</h5>
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
                                <th className="text-start">Total Base Cost</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start">
                                  {creditNoteData.credit_note_amount || "-"}
                                </td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">
                                  Addition Tax & Charges
                                </th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start" />
                                <td />
                              </tr>
                              {/* Dynamic Rows for Addition Tax */}
                              {creditNoteData.taxes_and_charges &&
                                creditNoteData.taxes_and_charges
                                  .filter((tax) => tax.addition)
                                  .map((tax) => (
                                    <tr key={tax.id}>
                                      <td className="text-start">
                                        {tax.remarks || "-"}
                                      </td>
                                      <td className="text-start">
                                        {tax.percentage
                                          ? `${tax.percentage}%`
                                          : "-"}
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={tax.inclusive}
                                          disabled
                                        />
                                      </td>
                                      <td>{tax.amount || "-"}</td>
                                      <td />
                                    </tr>
                                  ))}
                              {/* Static Rows */}
                              <tr>
                                <th className="text-start">
                                  Sub Total A (Addition)
                                </th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {creditNoteData.taxes_and_charges &&
                                    creditNoteData.taxes_and_charges
                                      .filter((tax) => tax.addition)
                                      .reduce(
                                        (total, tax) =>
                                          total + (parseFloat(tax.amount) || 0),
                                        0
                                      )
                                      .toFixed(2)}
                                </td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Gross Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    parseFloat(
                                      creditNoteData.credit_note_amount || 0
                                    ) +
                                    (creditNoteData.taxes_and_charges &&
                                      creditNoteData.taxes_and_charges
                                        .filter((tax) => tax.addition)
                                        .reduce(
                                          (total, tax) =>
                                            total +
                                            (parseFloat(tax.amount) || 0),
                                          0
                                        ))
                                  ).toFixed(2)}
                                </td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Deduction Tax</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start" />
                                <td />
                              </tr>
                              {/* Dynamic Rows for Deduction Tax */}
                              {creditNoteData.taxes_and_charges &&
                                creditNoteData.taxes_and_charges
                                  .filter((tax) => !tax.addition)
                                  .map((tax) => (
                                    <tr key={tax.id}>
                                      <td className="text-start">
                                        {tax.remarks || "-"}
                                      </td>
                                      <td className="text-start">
                                        {tax.percentage
                                          ? `${tax.percentage}%`
                                          : "-"}
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={tax.inclusive}
                                          disabled
                                        />
                                      </td>
                                      <td>{tax.amount || "-"}</td>
                                      <td />
                                    </tr>
                                  ))}
                              {/* Static Rows */}
                              <tr>
                                <th className="text-start">
                                  Sub Total B (Deductions)
                                </th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {creditNoteData.taxes_and_charges &&
                                    creditNoteData.taxes_and_charges
                                      .filter((tax) => !tax.addition)
                                      .reduce(
                                        (total, tax) =>
                                          total + (parseFloat(tax.amount) || 0),
                                        0
                                      )
                                      .toFixed(2)}
                                </td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Payable Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    parseFloat(
                                      creditNoteData.credit_note_amount || 0
                                    ) +
                                    (creditNoteData.taxes_and_charges &&
                                      creditNoteData.taxes_and_charges
                                        .filter((tax) => tax.addition)
                                        .reduce(
                                          (total, tax) =>
                                            total +
                                            (parseFloat(tax.amount) || 0),
                                          0
                                        )) -
                                    (creditNoteData.taxes_and_charges &&
                                      creditNoteData.taxes_and_charges
                                        .filter((tax) => !tax.addition)
                                        .reduce(
                                          (total, tax) =>
                                            total +
                                            (parseFloat(tax.amount) || 0),
                                          0
                                        ))
                                  ).toFixed(2)}
                                </td>
                                <td />
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
                              {creditNoteData.attachments &&
                              creditNoteData.attachments.length > 0 ? (
                                creditNoteData.attachments.map(
                                  (attachment, index) => (
                                    <tr key={attachment.id}>
                                      <td className="text-start">
                                        {index + 1}
                                      </td>
                                      <td className="text-start">
                                        {attachment.relation}
                                      </td>
                                      <td className="text-start">
                                        {attachment.filename}
                                      </td>
                                      <td className="text-start">
                                        {attachment.content_type}
                                      </td>
                                      <td className="text-start">
                                        {new Date(
                                          attachment.created_at
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="text-decoration-underline cursor-pointer">
                                        <a
                                          href={`https://marathon.lockated.com/attachments/${attachment.id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View
                                        </a>
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    No attachments found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="row w-100">
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
                <div className="row w-100">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4 justify-content-end align-items-center w-100">
                  <div className="col-md-3">
                    <div className="form-group d-flex gap-3 align-items-center">
                      <label style={{ fontSize: "1.1rem" }}>status</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
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
                </div>
                <div className="row mt-2 justify-content-end w-100">
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
                    <h5>Audit Log</h5>
                    <div className="mx-0">
                      <Table columns={auditLogColumns} data={auditLogData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            ...
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            ...
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditNoteDetails;
