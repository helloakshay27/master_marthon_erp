import React from "react";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { DownloadIcon } from "../components";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Then use id in your API URL

const BillEntryDetails = () => {
  const [billDetails, setBillDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAuditModal, setShowAuditModal] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [status, setStatus] = useState(""); // A
  const [loading, setLoading] = useState(false); // Add loading state
  const [editableBillNo, setEditableBillNo] = useState("");
  const [editableBillDate, setEditableBillDate] = useState("");
  const [editableBillAmount, setEditableBillAmount] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [comments, setComments] = useState("");
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);

  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);

  // const navigate = useNavigate();
  const [statusOptions, setStatusOptions] = useState([
    {
      label: "Select Status",
      value: "",
    },
  ]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}statuses_list?model=BillEntry&token=${token}`
        );

        // Ensure we're handling the response data safely
        const statusData = Array.isArray(response.data) ? response.data : [];

        // Map the API response to the format needed for SingleSelector
        const options = statusData.map((status) => ({
          value: status.value, // Use the value directly from API
          label: status.name, // Use the name directly from API
        }));

        // Add the default "Select Status" option at the beginning
        setStatusOptions([
          {
            label: "Select Status",
            value: "",
          },
          ...options,
        ]);
      } catch (error) {
        console.error("Error fetching status options:", error);
        setStatusOptions([
          {
            label: "Select Status",
            value: "",
          },
        ]);
      }
    };

    fetchStatusOptions();
  }, [token]); // Keep token as dependency

  // const statusOptions = [
  //   {
  //     label: "Select Status",
  //     value: "",
  //   },
  //   {
  //     label: "Open",
  //     value: "open",
  //   },
  //   // {
  //   //   label: "Verified",
  //   //   value: "verified",
  //   // },
  //   // {
  //   //   label: "All",
  //   //   value: "all",
  //   // },
  //   {
  //     label: "Submited",
  //     value: "submited",
  //   },
  //   {
  //     label: "Request for revision",
  //     value: "request_for_revision",
  //   },
  //   // {
  //   //   label: "Proceed",
  //   //   value: "proceed",
  //   // },
  //   // {
  //   //   label: "Approved",
  //   //   value: "approved",
  //   // },
  // ];

  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    // handleStatusChange(selectedOption); // Handle status change
  };

  // Remove the logic that disables previous statuses
  // const currentStatusIndex = statusOptions.findIndex(
  //   (option) => option.value === status
  // );
  // const statusOptionsWithDisabled = statusOptions.map((option, idx) => {
  //   if (idx === 0) return option; // 'Select Status' always enabled
  //   return {
  //     ...option,
  //     isDisabled: idx < currentStatusIndex,
  //   };
  // });

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}bill_entries/${id}?token=${token}`
      );
      setBillDetails(response.data);
      setStatus(response.data.status);
      console.log("API Bill Entry Data:", response.data); // <-- Console log full API response
      if (response.data.documents) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Failed to fetch bill entry details", error);
    }
  };

  useEffect(() => {
    fetchBillDetails();
  }, [id]);
  useEffect(() => {
    if (billDetails) {
      setEditableBillNo(billDetails.bill_no || "");
      setEditableBillDate(billDetails.bill_date || "");
      setEditableBillAmount(billDetails.bill_amount || "");
    }
    if (billDetails?.status === "request_for_revision") {
      setShowRevisionModal(true);
    }
  }, [billDetails]);

  const handleAttachDocument = () => {
    if (newDocument.document_type && newDocument.attachments.length > 0) {
      // Check if document type already exists
      const existingDocIndex = documents.findIndex(
        (doc) => doc.document_type === newDocument.document_type
      );

      if (existingDocIndex !== -1) {
        // If document type exists, append new attachments
        const updatedDocuments = [...documents];
        updatedDocuments[existingDocIndex].attachments = [
          ...updatedDocuments[existingDocIndex].attachments,
          ...newDocument.attachments,
        ];
        setDocuments(updatedDocuments);
      } else {
        // If document type doesn't exist, add new document
        setDocuments((prev) => [...prev, newDocument]);
      }

      // Reset new document state
      setNewDocument({
        document_type: "",
        attachments: [],
      });
      closeattachModal();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewDocument((prev) => ({
        ...prev,
        attachments: [
          {
            filename: file.name,
            content_type: file.type,
            content: event.target.result,
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentCountClick = (documentType) => {
    const doc = documents.find((d) => d.document_type === documentType);
    if (doc) {
      setSelectedDocument(doc);
      setviewDocumentModal(true);
    }
  };

  const payload = {
    bill_entry: {
      status: status || "",
      remarks: remarks,
      comments: comments,
      bill_no: editableBillNo,
      bill_date: editableBillDate,
      bill_amount: editableBillAmount,
      documents: documents.map((doc) => ({
        document_type: doc.document_type,
        attachments: doc.attachments.map((attachment) => ({
          filename: attachment.filename,
          content_type: attachment.content_type,
          content: attachment.content,
        })),
      })),
    },
  };
  console.log("bill entry update payload:", payload);

  const handleUpdateBillEntry = async () => {
    // Validation: Bill Amount should not exceed PO Value (if PO Value is present)
    const poValue = parseFloat(billDetails?.po_value) || 0;
    const billAmount = parseFloat(editableBillAmount) || 0;
    if (poValue > 0 && billAmount > poValue) {
      toast.error("Bill amount cannot be greater than PO value", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      setLoading(true);
      // const payload = {
      //   bill_entry: {
      //     status: status || "",
      //   },
      // };

      const payload = {
        bill_entry: {
          status: status || "",
          remarks: remarks,
          comments: comments,
          bill_no: editableBillNo,
          bill_date: editableBillDate,
          bill_amount: editableBillAmount,
          documents: documents.map((doc) => ({
            document_type: doc.document_type,
            attachments: doc.attachments.map((attachment) => ({
              filename: attachment.filename,
              content_type: attachment.content_type,
              content: attachment.content,
            })),
          })),
        },
      };

      const response = await axios.patch(
        `${baseURL}bill_entries/${id}?token=${token}`,
        payload
      );

      await fetchBillDetails();
      if (response.data) {
        // alert("Bill entry updated successfully");
        toast.success("Bill entry updated successfully!");
        // Make sure to import navigate from react-router-dom
        // navigate(`/bill-entry-list?token=${token}`,);
        setLoading(false);
      } else {
        throw new Error("No response data received");
      }
    } catch (error) {
      console.error("Error updating bill entry:", error);
      // alert("Failed to update bill entry. Please try again.");
      toast.error("Failed to update bill entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid px-3 mt-2">
          <a href="">
            Home &gt; Security &gt; Bill Entry List &gt; Bill Information (For
            Billing User)
          </a>
          <h5 className="mt-3">Bill Information (For Billing User)</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="details_page">
                  <div className="row px-3 ">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Name</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.supplier_name || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.po_number || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Value</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.po_value || "-"}
                        </label>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_no || "-"}
                        </label>
                      </div>
                    </div> */}
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_date || "-"}
                        </label>
                      </div>
                    </div> */}
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_amount || "-"}
                        </label>
                      </div>
                    </div> */}
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.vendor_remark || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>GSTIN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.gstin || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PAN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.pan_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Due Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {/* {billDetails?.due_date || "-"} */}
                          {billDetails?.due_date
                            ? new Date(billDetails.due_date)
                                .toISOString()
                                .slice(0, 10)
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
                          <span className="me-3">:-</span>
                          {billDetails?.remark || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Comments</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.comments || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Revision Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.revision_remark || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Id</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_id || "-"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12 mt-2">
                  <div className="card p-3">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <div className="form-group mb-0">
                          <label>Invoice Number</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                            value={editableBillNo}
                            onChange={(e) => setEditableBillNo(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-0">
                          <label>Invoice Date</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                            value={editableBillDate}
                            onChange={(e) =>
                              setEditableBillDate(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-0">
                          <label>Bill Amount</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                            value={editableBillAmount}
                            onChange={(e) =>
                              setEditableBillAmount(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-5 ">
                <h5 className=" ">Supporting Documents</h5>
                <div className="card-tools d-flex">
                  {/* <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#AttachModal"
                      // onClick={openremarkModal}
                    >
                      Revision Req.
                    </button> */}
                  <div>
                    <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#RevisionModal"
                      onClick={openattachModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span> Attach Document</span>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="tbl-container mt-3"
                style={{ maxHeight: "400px" }}
              >
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="text-start">Sr. No.</th>
                      <th className="text-start">Document Name</th>
                      <th className="text-start">No. of Documents</th>
                      <th className="text-start">Attach Additional Copy</th>
                    </tr>
                  </thead>
                  {/* // Replace your existing table body with this */}
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={index}>
                        <td className="text-start">{index + 1}</td>
                        <td className="text-start">{doc.document_type}</td>
                        <td
                          className="text-start"
                          style={{
                            color: "#8b0203",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleDocumentCountClick(doc.document_type)
                          }
                        >
                          {doc.attachments.length}
                        </td>
                        <td className="text-start">
                          <button
                            className="text-decoration-underline border-0 bg-transparent"
                            style={{
                              color: "#8b0203",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setNewDocument((prev) => ({
                                ...prev,
                                document_type: doc.document_type,
                              }));
                              openattachModal();
                            }}
                          >
                            + Attach
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Enter ..."
                      defaultValue={""}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
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
                      value={statusOptions.find((option) => option.value === status)}
                      placeholder="Select Status"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2 mt-2">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleUpdateBillEntry}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    onClick={() => navigate(`/bill-entry-list?token=${token}`)}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* <h5 className=" mt-3">Audit Log</h5>
              <div className="mx-0">
                <Table columns={auditLogColumns} data={auditLogData} />
              </div> */}

              <div className=" mb-5">
                <h5>Audit Log</h5>
                <div className="mx-0">
                  <div
                    className="tbl-container mt-1"
                    style={{ maxHeight: "450px" }}
                  >
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
                        {/* {billDetails?.status_logs?.map((log, index) => (
                          <tr key={log.id}>
                            <td className="text-start">{index + 1}</td>
                            <td className="text-start">
                              {log.created_by_name || ""}
                            </td>
                            <td className="text-start">
                              {log.status
                                ? log.status.charAt(0).toUpperCase() +
                                log.status.slice(1)
                                : ""}
                            </td>
                            <td className="text-start">
                             
                              {log.created_at
                                ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}      ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  
                                  hour12: true,
                                })}`
                                : ""}
                            </td>

                            <td className="text-start">{log.remarks || ""}</td>
                            <td className="text-start">{""}</td>
                          </tr>
                        ))} */}
                        {(billDetails?.status_logs || [])
                          .slice(0, 10)
                          .map((log, index) => (
                            <tr key={log.id}>
                              <td className="text-start">{index + 1}</td>
                              <td className="text-start">
                                {log.created_by_name}
                              </td>
                              <td className="text-start">
                                {log.created_at
                                  ? `${new Date(
                                      log.created_at
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}      ${new Date(
                                      log.created_at
                                    ).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}`
                                  : ""}
                              </td>
                              <td className="text-start">
                                {log.status
                                  ? log.status.charAt(0).toUpperCase() +
                                    log.status.slice(1)
                                  : ""}
                              </td>
                              <td className="text-start">
                                {log.remarks || ""}
                              </td>
                              <td className="text-start">
                                {log.comments || ""}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {billDetails?.status_logs?.length > 10 && (
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
          <p>Updating...</p>
        </div>
      )}

      {/* revision modal */}
      <Modal
        centered
        size="xl"
        show={showRevisionModal}
        onHide={() => setShowRevisionModal(false)}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Revision Requested</h5>
        </Modal.Header>
        <Modal.Body style={{ background: "#f5f5f5" }}>
          <div className="col-md-12">
            <div className="form-group">
              <p>
                This bill entry is marked as <b>Request for Revision</b>.
              </p>
              {billDetails?.revision_remark && (
                <div>
                  <strong>Remark :</strong>
                  <div>{billDetails.revision_remark}</div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="row mt-3 justify-content-center">
      <div className="col-md-4">
        <button
          className="purple-btn1 w-100"
          onClick={() => setShowRevisionModal(false)}
        >
          Close
        </button>
      </div>
    </div> */}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <button
            className="purple-btn1"
            onClick={() => setShowRevisionModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      {/* document add */}

      <Modal
        centered
        size="lg"
        show={viewDocumentModal}
        onHide={() => {
          setviewDocumentModal(false);
          setSelectedDocument(null);
        }}
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
              <h5>Latest Documents</h5>
              <div className="card-tools d-flex">
                <button
                  className="purple-btn2 rounded-3"
                  onClick={() => {
                    setviewDocumentModal(false);
                    setNewDocument((prev) => ({
                      ...prev,
                      document_type: selectedDocument?.document_type,
                    }));
                    openattachModal();
                  }}
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
                    <th>Document Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDocument?.attachments.map((attachment, index) => (
                    <tr key={index}>
                      <td className="text-start">{index + 1}</td>
                      <td className="text-start">
                        {selectedDocument.document_type}
                      </td>
                      <td className="text-start">{attachment.filename}</td>
                      <td className="text-start">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="text-start" style={{ width: "150px" }}>
                        {attachment.created_by}
                      </td>
                      <td className="text-start">
                        {/* <button
                                className="btn btn-link p-0 text-decoration-underline"
                                onClick={() => handleDownload(attachment.blob_id)}
                              >
                                <DownloadIcon />
                              </button> */}
                        <a
                          href={
                            // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                            // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                            attachment.url
                          }
                          target="_blank"
                          // rel="noopener noreferrer"
                          download={attachment.filename}
                        >
                          <DownloadIcon />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 me-2">
              <h5>Document Attachment History</h5>
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
                    <th>Document Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDocument?.attachments.map((attachment, index) => (
                    <tr key={index}>
                      <td className="text-start">{index + 1}</td>
                      <td className="text-start">
                        {selectedDocument.document_type}
                      </td>
                      <td className="text-start">{attachment.filename}</td>
                      <td className="text-start">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="text-start" style={{ width: "150px" }}>
                        {attachment.created_by}
                      </td>
                      {/* <td> */}
                      {/* <button
                                className="btn btn-link p-0 text-decoration-underline"
                                onClick={() => handleDownload(attachment.blob_id)}
                              >
                                <DownloadIcon />
                              </button> */}

                      <td className="text-start">
                        <a
                          href={
                            // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                            // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                            attachment.url
                          }
                          target="_blank"
                          // rel="noopener noreferrer"
                          download={attachment.filename}
                        >
                          <DownloadIcon />
                        </a>
                      </td>
                      {/* </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={() => {
                  setviewDocumentModal(false);
                  setSelectedDocument(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* attach document */}

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

          <div className="row mt-3 justify-content-center">
            <div className="col-md-8 d-flex justify-content-center align-items-center gap-4">
              <div className="col-md-4">
                <button
                  className="purple-btn2 w-100"
                  onClick={handleAttachDocument}
                  disabled={
                    !newDocument.document_type ||
                    newDocument.attachments.length === 0
                  }
                >
                  Attach
                </button>
              </div>
              <div className="col-md-4 ">
                <button
                  className="purple-btn1 w-100"
                  onClick={closeattachModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {/* <div className="row mt-3 justify-content-center">
                       <div className="col-md-4">
                         <button
                           className="purple-btn2 w-100"
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
                         <button className="purple-btn1 w-100" onClick={closeattachModal}>
                           Cancel
                         </button>
                       </div>
                     </div> */}
        </Modal.Body>
      </Modal>
      {/* attach document */}

      {/* Modal for all audit logs */}
      <Modal
        show={showAuditModal}
        onHide={() => setShowAuditModal(false)}
        size="xl"
      >
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
                {(billDetails?.status_logs || []).map((log, index) => (
                  <tr key={log.id}>
                    <td className="text-start">{index + 1}</td>
                    <td className="text-start">{""}</td>
                    <td className="text-start">
                      {log.created_at
                        ? `${new Date(log.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )} ${new Date(log.created_at).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}`
                        : ""}
                    </td>
                    <td className="text-start">
                      {log.status
                        ? log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)
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

export default BillEntryDetails;
