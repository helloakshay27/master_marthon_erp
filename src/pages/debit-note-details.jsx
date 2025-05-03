import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState,useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleSelector from '../components/base/Select/SingleSelector';
const DebitNoteDetails = () => {
  // const [showRows, setShowRows] = useState(false);
    const { id } = useParams();
    const [showRows, setShowRows] = useState(false);
    const [debitNoteData, setDebitNoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available
  
    // Fetch credit note data
    useEffect(() => {
      const fetchCreditNoteData = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/debit_notes/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          setDebitNoteData(response.data);
          setStatus(response.data.status)
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCreditNoteData();
    }, [id]);
    console.log("status:",status)

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
        label: "Submited",
        value: "submited",
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
            `${baseURL}debit_notes/${id}/update_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
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
  // Function to handle tab change
  const handleTabChange = (tabId) => {
   setActiveTab(tabId);
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


 
 
  return (
  <>
  <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Debit Note </a>
          <h5 className="mt-3">Debit Note </h5>
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
                            {/* Prev Button */}
                            <button
                              className={`btn btn-prev ${
                                currentStep === 1 ? "disabled" : ""
                              }`}
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            {/* Next Button */}
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
                  
                      {/* form-select EXAMPLE */}
                      <div
                        className="card card-default"
                        id="mor-material-details"
                      >
                        <div className="card-body">
                          <div className="details_page">
                            <div className="row px-3">
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Company</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.company_name || "-"}
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
                                    {debitNoteData?.project_name || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Sub-Project </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.site_name || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Debit Note Number</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.debit_note_no || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Debit Note Date</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.debit_note_date
                ? new Date(debitNoteData.debit_note_date).toLocaleDateString()
                : "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Created On</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.created_at
                ? new Date(debitNoteData.created_at).toLocaleDateString()
                : "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>PO / WO Number</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.po_number || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>PO / WO Date</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    
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
                                    
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Supplier Name</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.pms_supplier || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>GSTN No.</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>PAN Number</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Debit Note Amount</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3">
                                      <span className="text-dark">:</span>
                                    </span>
                                    {debitNoteData?.debit_note_amount
                ? ` ${debitNoteData.debit_note_amount}`
                : "-"}
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
                                    {debitNoteData?.remark || "-"}
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
                                  <th className="text-start">
                                  Total Base Cost
                                  </th>
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start"></td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">
                                  Addition Tax & Charges
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
                                    <tr>
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
                                     
                                      <td><input type="checkbox" /></td>
                                     
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
                                  <th className="text-start">Sub Total A (Addition)</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start"></td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">Gross Amount</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start"></td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">Deduction Tax</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start" />
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
                                {debitNoteData?.attachments &&
                              debitNoteData?.attachments.length > 0 ? (
                                debitNoteData?.attachments?.map(
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
                        value={remark}
                        onChange={handleRemarkChange}
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
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100 mb-5">
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
  )
}

export default DebitNoteDetails