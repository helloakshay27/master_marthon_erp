import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { DownloadIcon } from "../components";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const MiscellaneousBillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAuditModal, setShowAuditModal] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [showRows, setShowRows] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available

  // Fetch credit note data
  const fetchCreditNoteData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}miscellaneous_bills/${id}?token=${token}`
      );
      setCreditNoteData(response.data);
      setStatus(response.data.status)
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchCreditNoteData(id);
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


  const statusOptions = [
    {
      label: "Select Status",
      value: "",
    },
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Verified",
      value: "verified",
    },
    {
      label: "Submitted",
      value: "submitted",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
    {
      label: "Approved",
      value: "approved",
    },
  ];

  const [remark, setRemark] = useState("");
  const [comment, setComment] = useState("");
  // console.log("status:",status)
  // Step 2: Handle status change
  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    handleStatusChange(selectedOption); // Handle status change
  };

  // Step 3: Handle remark change
  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const payload = {
    status_log: {
      status: status,
      remarks: remark,
      comments: comment,
    },
  };

  console.log("detail status change", payload);

  const handleSubmit = async () => {
    // Prepare the payload for the API
    const payload = {
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
      },
    };

    console.log("detail status change", payload);
    setLoading(true);

    try {
      const response = await axios.patch(
        `${baseURL}miscellaneous_bills/${id}/update_status.json?token=${token}`,
        payload, // The request body containing status and remarks
        {
          headers: {
            "Content-Type": "application/json", // Set the content type header
          },
        }
      );
      await fetchCreditNoteData();

      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
        setRemark("");
        setComment("")
        // alert('Status updated successfully');
        // Handle success (e.g., update the UI, reset fields, etc.)
        toast.success("Status updated successfully!");
      } else {
        console.log("Error updating status:", response.data);
        toast.error("Failed to update status.");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Request failed:", error);
      // Handle network or other errors (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };


  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  if (!creditNoteData) return <div> {loading && (
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
  )}</div>;

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section  ms-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Miscellaneous Bill</a>
          <h5 className="mt-3">Miscellaneous Bill </h5>
          <div className="row container-fluid my-4 align-items-center">

            <div className="col-md-12 px-2">
              <div className="d-flex justify-content-end m-2">

                <Link
                  to={`/miscellaneous-bill-edit/${id}?token=${token}`}
                  className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>

                  <button class="purple-btn1" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b0203" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="#8b0203" />
                      <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#8b0203" />
                    </svg>
                  </button>

                </Link>

              </div>
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
                    {/* <div className="row justify-content-center my-4">
                      <div className="col-md-10">
                        <div className="progress-steps">
                          <div className="top">
                            <div className="progress">
                              <span
                                style={{
                                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100
                                    }%`,
                                }}
                              ></span>
                            </div>
                            <div className="steps">
                              {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                  <div
                                    className={`step ${currentStep > index + 1 ? "active" : ""
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
                              className={`btn btn-prev ${currentStep === 1 ? "disabled" : ""
                                }`}
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            <button
                              className={`btn btn-next ${currentStep === totalSteps ? "disabled" : ""
                                }`}
                              onClick={handleNext}
                              disabled={currentStep === totalSteps}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}

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
                                  {creditNoteData.company_name || "-"}
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
                                  {creditNoteData.project_name || "-"}
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
                                  {creditNoteData.site_name || "-"}
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
                                  {/* {creditNoteData.created_at
                                    ? new Date(
                                      creditNoteData.created_at
                                    ).toLocaleDateString()
                                    : "-"} */}

                                    {creditNoteData.created_at
                                    ? new Date(creditNoteData.created_at)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Invoice Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.bill_no || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Invoice Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {/* {creditNoteData.bill_date
                                    ? new Date(
                                      creditNoteData.bill_date
                                    ).toLocaleDateString()
                                    : "-"} */}
                                    {creditNoteData.bill_date
                                    ? new Date(creditNoteData.bill_date)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Bill Amount</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.amount || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Bill ID</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData?.bill_id || "-"}
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
                                  {creditNoteData.pms_supplier || "-"}
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
                                  {creditNoteData.gstin || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Organization Name</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.organization_name || "-"}
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
                                  {creditNoteData.pan_no || "-"}
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



                        <div className="tbl-container mt-3" style={{ maxHeight: "500px" }}>
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th className="text-start">Tax / Charge Type</th>
                                <th className="text-start">Tax / Charges per UOM (INR)</th>
                                <th className="text-start">Inclusive / Exclusive</th>
                                <th className="text-start">Amount</th>
                                <th className="text-start">Action</th>
                              </tr>
                            </thead>
                            <tbody>

                              <tr>
                                <th className="text-start">Total Base Cost</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start">{creditNoteData.amount}</td>
                                <td />
                              </tr>


                              <tr>
                                <th className="text-start">Addition Tax & Charges</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start" />
                                <td />
                              </tr>
                              {creditNoteData.taxes_and_charges
                                .filter((tax) => tax.addition) // Filter for addition: true
                                .map((tax) => (
                                  <tr key={tax.id}>
                                    <td className="text-start">{tax.tax_name}</td>
                                    <td className="text-start">{tax.percentage}%</td>
                                    <td className="text-start">

                                      <input
                                        type="checkbox"
                                        checked={tax.inclusive} // Set checkbox checked based on `inclusive`
                                        disabled={tax.inclusive} // Disable checkbox if `inclusive` is true
                                      />
                                    </td>
                                    <td className="text-start">{tax.amount}</td>
                                    <td />
                                  </tr>
                                ))}


                              <tr>
                                <th className="text-start">Sub Total A (Addition)</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {creditNoteData.taxes_and_charges
                                    .filter((tax) => tax.addition && !tax.inclusive)
                                    .reduce((total, tax) => total + parseFloat(tax.amount), 0)
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
                                    creditNoteData.taxes_and_charges
                                      .filter((tax) => tax.addition && !tax.inclusive)
                                      .reduce((total, tax) => total + parseFloat(tax.amount), 0) +
                                    parseFloat(creditNoteData.amount || 0)
                                  ).toFixed(2)}
                                </td>
                                <td />
                              </tr>


                              <tr>
                                <th className="text-start">Deduction Tax</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start" />
                                <td />
                              </tr>
                              {creditNoteData.taxes_and_charges
                                .filter((tax) => !tax.addition) // Filter for addition: false
                                .map((tax) => (
                                  <tr key={tax.id}>
                                    <td className="text-start">{tax.tax_name}</td>
                                    <td className="text-start">{tax.percentage}%</td>
                                    <td className="text-start">

                                      <input
                                        type="checkbox"
                                        checked={tax.inclusive} // Set checkbox checked based on `inclusive`
                                        disabled={tax.inclusive} // Disable checkbox if `inclusive` is true
                                      />
                                    </td>
                                    <td className="text-start">{tax.amount}</td>
                                    <td />
                                  </tr>
                                ))}


                              <tr>
                                <th className="text-start">Sub Total B (Deductions)</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {creditNoteData.taxes_and_charges
                                    .filter((tax) => !tax.addition)
                                    .reduce((total, tax) => total + parseFloat(tax.amount), 0)
                                    .toFixed(2)}
                                </td>
                                <td />
                              </tr>


                              {/* <tr>
                                <th className="text-start">Payable Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    creditNoteData.taxes_and_charges.reduce(
                                      (total, tax) =>
                                        total + (tax.addition ? parseFloat(tax.amount) : -parseFloat(tax.amount)),
                                      0
                                    ) + creditNoteData.amount
                                  ).toFixed(2)}
                                </td>
                                <td />
                              </tr> */}

                              <tr>
                                <th className="text-start">Payable Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    creditNoteData.taxes_and_charges.reduce(
                                      (total, tax) => {
                                        if (tax.addition && !tax.inclusive) {
                                          // Add only non-inclusive addition taxes
                                          return total + parseFloat(tax.amount);
                                        } else if (!tax.addition && !tax.inclusive) {
                                          // Subtract only non-inclusive deduction taxes
                                          return total - parseFloat(tax.amount);
                                        }
                                        // Ignore inclusive taxes for both addition and deduction
                                        return total;
                                      },
                                      parseFloat(creditNoteData.amount || 0)
                                    )
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
                        <div className="tbl-container  mt-3">
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
                                        {/* {new Date(
                                          attachment.created_at
                                        ).toLocaleDateString()} */}
                                        {attachment.created_at
                                          ? new Date(attachment.created_at)
                                            .toLocaleDateString("en-GB") // gives 16/07/2025
                                            .replace(/\//g, "-")         // replaces / with -
                                          : ""}
                                      </td>
                                      <td className="text-decoration-underline cursor-pointer">
                                        {/* <a
                                          href={`https://marathon.lockated.com/attachments/${attachment.id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View
                                        </a> */}
                                        <a
                                          href={
                                            // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                            `${baseURL}credit_notes/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                                          }
                                          download={attachment.filename}
                                        >
                                          <DownloadIcon />
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
                <div className="row w-100 ">
                  <div className="col-md-12 mx-2">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                        value={remark}
                        onChange={handleRemarkChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row w-100">
                  <div className="col-md-12 mx-2 mt-2">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                        value={comment}
                        onChange={handleCommentChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4 justify-content-end align-items-center mx-2">
                  <div className="col-md-3">
                    <div className="form-group d-flex gap-3 align-items-center mx-3">
                      <label style={{ fontSize: "0.95rem", color: "black" }}>
                        Status
                      </label>
                      <SingleSelector
                        options={statusOptions}
                        onChange={handleStatusChange}
                        // options.find(option => option.value === status)
                        // value={filteredOptions.find(option => option.value === status)}
                        value={statusOptions.find(
                          (option) => option.value === status
                        )}
                        placeholder="Select Status"
                        isClearable={false}
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-end w-100">
                  {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}
                  <div className="col-md-2 mt-2">
                    <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100" onClick={() => navigate(`/miscellaneous-bill-list?token=${token}`)}>Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
                    <h5>Audit Log</h5>
                    <div className="mx-0">

                      <div className="tbl-container mt-1" style={{ maxHeight: "450px" }}>
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>Sr.No.</th>
                              <th>Created By</th>
                              <th>Created At</th>
                              <th>Status</th>
                              <th>Remark</th>
                              <th>Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {creditNoteData?.status_logs?.map((log, index) => (
                              <tr key={log.id}>
                                <td className="text-start">{index + 1}</td>
                                <td className="text-start">{""}</td>
                                <td className="text-start">
                                  {log.created_at
                                    ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}      ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      // second: "2-digit",
                                      hour12: true,
                                    })}`
                                    : ""}
                                </td>
                                <td className="text-start">{log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : ""}</td>
                                <td className="text-start">{log.remarks || ""}</td>
                              </tr>
                            ))} */}

                            {(creditNoteData?.status_logs || [])
                              .slice(0, 10)
                              .map((log, index) => (
                                <tr key={log.id}>
                                  <td className="text-start">{index + 1}</td>
                                  <td className="text-start">{""}{log.created_by_name}</td>
                                  <td className="text-start">
                                    {/* {log.created_at
                                      ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}      ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}`
                                      : ""} */}
                                      {new Date(log.created_at)
                                      .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .replaceAll("/", "-")} , {new Date(log.created_at).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }).toUpperCase()}
                                  </td>
                                  <td className="text-start">
                                    {log.status
                                      ? log.status.charAt(0).toUpperCase() + log.status.slice(1)
                                      : ""}
                                  </td>
                                  <td className="text-start">{log.remarks || ""}</td>
                                  <td className="text-start">{log.comments || ""}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {/* Show "Show More" link if more than 10 records */}
                        {creditNoteData?.status_logs?.length > 10 && (
                          <div className="mt-2 text-start">
                            <span
                              className="boq-id-link"
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                              onClick={() => setShowAuditModal(true)}
                            >
                              Show More
                            </span>
                          </div>
                        )}
                      </div>

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
      {/* Modal for all audit logs */}
      <Modal show={showAuditModal} onHide={() => setShowAuditModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>All Audit Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container" style={{ maxHeight: "700px" }}>
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {(creditNoteData?.status_logs || []).map((log, index) => (
                  <tr key={log.id}>
                    <td className="text-start">{index + 1}</td>
                    <td className="text-start">{""}</td>
                    <td className="text-start">
                      {log.created_at
                        ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })} ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`
                        : ""}
                    </td>
                    <td className="text-start">
                      {log.status
                        ? log.status.charAt(0).toUpperCase() + log.status.slice(1)
                        : ""}
                    </td>
                    <td className="text-start">{log.remarks || ""}</td>
                    <td className="text-start">{log.comments || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default MiscellaneousBillDetails;
