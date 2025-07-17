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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const CreditNoteDetails = () => {
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
   const [attachOneModal, setattachOneModal] = useState(false);
      const [attachTwoModal, setattachTwoModal] = useState(false);
      const [attachThreeModal, setattachThreeModal] = useState(false);
      const [attachModal, setattachModal] = useState(false);
          const [viewDocumentModal, setviewDocumentModal] = useState(false);
  
          const closeAttachOneModal = () => setattachOneModal(false);
  
    const openAttachTwoModal = () => setattachTwoModal(true);
    const closeAttachTwoModal = () => setattachTwoModal(false);
  
    const openAttachThreeModal = () => setattachThreeModal(true);
    const closeAttachThreeModal = () => setattachThreeModal(false);
  
    const openattachModal = () => setattachModal(true);
    const closeattachModal = () => setattachModal(false);
    const openviewDocumentModal = () => setviewDocumentModal(true);
    const closeviewDocumentModal = () => setviewDocumentModal(false);
  

  // Fetch credit note data
  const fetchCreditNoteData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}credit_notes/${id}?token=${token}`
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
    // handleStatusChange(selectedOption); // Handle status change
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
        `${baseURL}credit_notes/${id}/update_status.json?token=${token}`,
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

   const [newDocument, setNewDocument] = useState({
          document_type: "",
          attachments: [],
        });
        const [documents, setDocuments] = useState([]); // If you want to keep a list
      
        // Handle file upload
        const handleFileUpload = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewDocument((prev) => ({
              ...prev,
              attachments: [
                {
                  filename: file.name,
                  content: reader.result.split(",")[1],
                  content_type: file.type,
                },
              ],
            }));
          };
          reader.readAsDataURL(file);
        };
      
        // Handle attach document
        const handleAttachDocument = () => {
          if (!newDocument.document_type || newDocument.attachments.length === 0)
            return;
          const now = new Date();
          const uploadDate = `${now.getDate().toString().padStart(2, "0")}-${(
            now.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${now.getFullYear()}`;
          setDocuments((prev) => [
            ...prev,
            {
              ...newDocument,
              uploadDate,
            },
          ]);
          setNewDocument({ document_type: "", attachments: [] });
          closeattachModal();
        };
      
        // For viewing a specific document
        const [viewDocIndex, setViewDocIndex] = useState(null);
        const handleViewDocument = (index) => {
          setViewDocIndex(index);
          openviewDocumentModal();
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
          <a href="">Home &gt; Billing &amp; Accounts &gt; Credit Note </a>
          <h5 className="mt-3">Credit Note </h5>
          <div className="row container-fluid my-4 align-items-center">
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
                                  {/* {creditNoteData.credit_note_date
                                    ? new Date(
                                      creditNoteData.credit_note_date
                                    ).toLocaleDateString()
                                    : "-"} */}

                                  {creditNoteData.credit_note_date
                                    ? new Date(creditNoteData.credit_note_date)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
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
                                  {/* {creditNoteData.po_date
                                    ? new Date(
                                      creditNoteData.po_date
                                    ).toLocaleDateString()
                                    : "-"} */}

                                  {creditNoteData.po_date
                                    ? new Date(creditNoteData.po_date)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
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



                        <div className="tbl-container mt-3">
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
                              {/* Static Rows */}
                              <tr>
                                <th className="text-start">Total Base Cost</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start">{creditNoteData.credit_note_amount}</td>
                                <td />
                              </tr>

                              {/* Addition Tax & Charges */}
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
                                      {/* {tax.inclusive ? "Inclusive" : "Exclusive"} */}
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

                              {/* Sub Total A */}
                              <tr>
                                <th className="text-start">Sub Total A (Addition)</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {creditNoteData.taxes_and_charges
                                    .filter((tax) => tax.addition)
                                    .reduce((total, tax) => total + parseFloat(tax.amount), 0)
                                    .toFixed(2)}
                                </td>
                                <td />
                              </tr>

                              {/* Gross Amount */}
                              <tr>
                                <th className="text-start">Gross Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    creditNoteData.taxes_and_charges
                                      .filter((tax) => tax.addition)
                                      .reduce((total, tax) => total + parseFloat(tax.amount), 0) +
                                    parseFloat(creditNoteData.credit_note_amount || 0)
                                  ).toFixed(2)}
                                </td>
                                <td />
                              </tr>

                              {/* Deduction Tax */}
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
                                      {/* {tax.inclusive ? "Inclusive" : "Exclusive"} */}
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

                              {/* Sub Total B */}
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

                              {/* Gross Amount */}
                              <tr>
                                <th className="text-start">Payable Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">
                                  {(
                                    creditNoteData.taxes_and_charges.reduce(
                                      (total, tax) =>
                                        total + (tax.addition ? parseFloat(tax.amount) : -parseFloat(tax.amount)),
                                      0
                                    ) + creditNoteData.credit_note_amount
                                  ).toFixed(2)}
                                </td>
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                     <div className="d-flex justify-content-between mt-4 ">
                            <h5 className=" ">Document Attachment</h5>
                            <div
                              className="card-tools d-flex"
                              data-bs-toggle="modal"
                              data-bs-target="#attachModal"
                              onClick={openattachModal}
                            >
                              <button
                                className="purple-btn2 rounded-3"
                                data-bs-toggle="modal"
                                data-bs-target="#attachModal"
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
                          {/* Document Table (dynamic) */}
                          <div className="tbl-container mt-2 ">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th className="text-start">Sr. No.</th>
                                  <th className="text-start">Document Name</th>
                                  <th className="text-start">File Name</th>
                                  {/* <th className="text-start">File Type</th> */}
                                  <th className="text-start">Upload Date</th>
                                  <th className="text-start">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {documents.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="text-center">
                                      No documents attached
                                    </td>
                                  </tr>
                                ) : (
                                  documents.map((doc, idx) => (
                                    <tr key={idx}>
                                      <td className="text-start">{idx + 1}</td>
                                      <td className="text-start">{doc.document_type}</td>
                                      <td className="text-start">
                                        {doc.attachments[0]?.filename || "-"}
                                      </td>
                                      {/* <td className="text-start">
                            {doc.attachments[0]?.content_type || "-"}
                          </td> */}
                                      <td className="text-start">
                                        {doc.uploadDate || "-"}
                                      </td>
                                      <td
                                        className="text-decoration-underline"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleViewDocument(idx)}
                                      >
                                        View
                                      </td>
                                    </tr>
                                  ))
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
                    <button className="purple-btn1 w-100" onClick={() => navigate(`/credit-note-list?token=${token}`)}>Cancel</button>
                  </div>
                </div>
                {/* <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
                    <h5>Audit Log</h5>
                    <div className="mx-0">

                      <div className="tbl-container mt-1">
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
                            {creditNoteData?.status_logs?.map((log, index) => (
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
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div> */}
                <div className="row mt-2 w-100">
                  <div className="col-12 px-4" >
                    <h5>Audit Log</h5>
                    <div className="mx-0" >
                      <div className="tbl-container mt-1" style={{ maxHeight: "450px" }} >
                        <table className="w-100"  >
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
                            <h5>Attach Document</h5>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Name of the Document</label>
                                  {newDocument.document_type &&
                                    documents.find(
                                      (doc) =>
                                        doc.isDefault &&
                                        doc.document_type === newDocument.document_type
                                    ) ? (
                                    // For default document types - show as disabled input
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newDocument.document_type}
                                      disabled
                                    />
                                  ) : (
                                    // For new document types - allow input
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newDocument.document_type}
                                      onChange={(e) =>
                                        setNewDocument((prev) => ({
                                          ...prev,
                                          document_type: e.target.value,
                                        }))
                                      }
                                      placeholder="Enter document name"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="col-md-12 mt-2">
                                <div className="form-group">
                                  <label>Upload File</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  />
                                </div>
                              </div>
                              {/* Add this new section for file name editing */}
                              {newDocument.attachments.length > 0 && (
                                <div className="col-md-12 mt-2">
                                  <div className="form-group">
                                    <label>File Name</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newDocument.attachments[0].filename}
                                      onChange={(e) => {
                                        setNewDocument((prev) => ({
                                          ...prev,
                                          attachments: [
                                            {
                                              ...prev.attachments[0],
                                              filename: e.target.value,
                                            },
                                          ],
                                        }));
                                      }}
                                      placeholder="Enter file name"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="row mt-2 justify-content-center">
                              <div className="col-md-4">
                                <button
                                  className="purple-btn2 w-100 mt-2"
                                  onClick={handleAttachDocument}
                                  disabled={
                                    !newDocument.document_type ||
                                    newDocument.attachments.length === 0
                                  }
                                >
                                  Attach
                                </button>
                              </div>
                              <div className="col-md-4">
                                <button
                                  className="purple-btn1 w-100"
                                  onClick={closeattachModal}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                        {/* View Document Modal (dynamic) */}
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
                                  data-bs-target="#attachModal"
                                >
                                  <button
                                    className="purple-btn2 rounded-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#attachModal"
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
                                      {/* <th>File Type</th> */}
                                      <th>Upload Date</th>
                                      {/* <th>Action</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {documents.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="text-center">
                                          No documents attached
                                        </td>
                                      </tr>
                                    ) : (
                                      documents.map((doc, idx) => (
                                        <tr key={idx}>
                                          <td>{idx + 1}</td>
                                          <td>{doc.document_type}</td>
                                          <td>{doc.attachments[0]?.filename || "-"}</td>
                                          {/* <td className="text-start">
                                                                {doc.attachments[0]?.content_type || "-"}
                                                              </td> */}
                                          <td className="text-start">
                                            {doc.uploadDate || "-"}
                                          </td>
                                          {/* <td>
                                                                <i
                                                                  className="fa-regular fa-eye"
                                                                  style={{ fontSize: 18, cursor: "pointer" }}
                                                                  // You can add onClick to preview/download if needed
                                                                />
                                                              </td> */}
                                        </tr>
                                      ))
                                    )}
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
                                      {/* <th>File Type</th> */}
                                      <th>Upload Date</th>
                                      {/* <th>Action</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {documents.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="text-center">
                                          No documents attached
                                        </td>
                                      </tr>
                                    ) : (
                                      documents.map((doc, idx) => (
                                        <tr key={idx}>
                                          <td>{idx + 1}</td>
                                          <td>{doc.document_type}</td>
                                          <td>{doc.attachments[0]?.filename || "-"}</td>
                                          {/* <td>
                                                                {doc.attachments[0]?.content_type || "-"}
                                                              </td> */}
                                          <td className="text-start">
                                            {doc.uploadDate || "-"}
                                          </td>
                                         
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="row mt-2 justify-content-center">
                              <div className="col-md-3">
                                <button className="purple-btn1 w-100"
                                onClick={closeviewDocumentModal}>Close</button>
                              </div>
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

export default CreditNoteDetails;
