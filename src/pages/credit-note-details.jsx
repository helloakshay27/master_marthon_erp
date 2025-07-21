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
  const [creditNoteAmount, setCreditNoteAmount] = useState(null);
  // const [creditNoteData, setCreditNoteData] = useState(null);
  const [editableDebitNote, setEditableDebitNote] = useState({
    credit_note_amount: "",
    credit_note_date: "",
    remark: "",
  });
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });
  const [documents, setDocuments] = useState([]); // If you want to keep a list
  const [attachments, setAttachments] = useState([]);



  // Fetch credit note data
  const fetchCreditNoteData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}credit_notes/${id}?token=${token}`
      );
      setCreditNoteData(response.data);
      setStatus(response.data.status)
      setCreditNoteAmount(response.data.credit_note_amount || 0)

      const formattedDocuments = response.data.attachments.map((att) => {
        const originalDate = new Date(att.created_at);
        const localDate = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
        const uploadDate = localDate.toISOString().slice(0, 19); // include seconds (YYYY-MM-DDTHH:MM:SS)

        return {
          id: att.id ,
          fileType: att.content_type || "",
          uploadDate,
          blob_id: att.blob_id || null,
          fileName: att.filename || "-",
          file: att.document_file_name,
          isExisting: true,
        };
      });
      setAttachments(formattedDocuments); // ✅ Set to your documents array
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchCreditNoteData(id);
  }, [id]);

  useEffect(() => {
    if (creditNoteData) {
      setEditableDebitNote({
        credit_note_amount: creditNoteData.credit_note_amount || "",
        credit_note_date: creditNoteData.credit_note_date || "",
        remark: creditNoteData.remark || "",
      });
    }
  }, [creditNoteData]);



  const handleDebitNoteChange = (field, value) => {
    setEditableDebitNote((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "credit_note_amount") {
      setCreditNoteAmount(Number(value) || 0);
    }
  };

  // tax table functionality
  const [rows, setRows] = useState([
  ]);

  const [taxTypes, setTaxTypes] = useState([]); // State to store tax types
  const [taxPercentages, setTaxPercentages] = useState([]);
  // Fetch tax types from API
  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=${token}`
        );
        setTaxTypes(response.data.taxes); // Assuming the API returns an array of tax types
      } catch (error) {
        console.error("Error fetching tax types:", error);
      }
    };

    fetchTaxTypes();
  }, []);

  useEffect(() => {
    const fetchTaxPercentages = async () => {
      try {
        const response = await fetch(`${baseURL}rfq/events/tax_percentage?token=${token}`);
        const data = await response.json();
        setTaxPercentages(data);
      } catch (error) {
        console.error("Error fetching tax percentages:", error);
      }
    };

    fetchTaxPercentages();
  }, []);

  // Toggle visibility of rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  // Delete a specific row
  // const deleteRow = (id) => {
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  // };

  // Calculate Sub Total (Addition)
  // const calculateSubTotal = () => {
  //   return rows.reduce((total, row) => total + row.amount, 0).toFixed(2);
  // };

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


  const addRow = () => {
    const specialTypes = ["Handling Charges", "Other charges", "Freight"];
    const existingTypes = rows.map((r) => r.type);

    const hasSpecial = specialTypes.some((type) => existingTypes.includes(type));
    const hasSGST = existingTypes.includes("SGST");
    const hasCGST = existingTypes.includes("CGST");
    const hasIGST = existingTypes.includes("IGST");

    // 🔒 Lock condition: if any special type + (IGST or both SGST & CGST) are present
    const isLockedCombo =
      hasSpecial && (hasIGST || (hasSGST && hasCGST));

    if (isLockedCombo) {
      toast.error(
        "Cannot add more Tax rows ."
      );
      return; // ❌ Don't add row
    }

    // Allow adding remaining special types if any
    const allSpecialTypes = [
      { type: "Handling Charges", resource_id: 2 },
      { type: "Other charges", resource_id: 4 },
      { type: "Freight", resource_id: 5 },
    ];

    const nextSpecial = allSpecialTypes.find(
      (st) => !existingTypes.includes(st.type)
    );

    if (nextSpecial) {
      setRows((prevRows) => [
        ...prevRows,
        {
          id: prevRows.length + 1,
          type: nextSpecial.type,
          percentage: "",
          inclusive: false,
          amount: "",
          isEditable: false,
          addition: true,
          resource_id: nextSpecial.resource_id,
          resource_type: "TaxCharge",
        },
      ]);
    } else {
      // Add editable row for user-defined tax
      setRows((prevRows) => [
        ...prevRows,
        {
          id: prevRows.length + 1,
          type: "",
          percentage: "0",
          inclusive: false,
          amount: "",
          isEditable: true,
          addition: true,
        },
      ]);
    }
  };


  const calculateSubTotal = () => {
    return rows
      .filter((row) => !row.inclusive)
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
  };
  // Delete a row
  const deleteRow = (id) => {
    // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setRows((prevRows) =>
      prevRows.filter((row, index) => {
        // Prevent deletion of the first three rows
        if (index < 3) {
          return true;
        }
        return row.id !== id;
      })
    );
  };

  // deduction
  const [deductionRows, setDeductionRows] = useState([
    // { id: 1, type: "", charges: "", inclusive: false, amount: 0.0 },
  ]);
  const [deductionTypes, setDeductionTypes] = useState([]); // State to store tax types

  // Fetch tax types from API
  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
        );
        setDeductionTypes(response.data.taxes); // Assuming the API returns an array of tax types
      } catch (error) {
        console.error("Error fetching tax types:", error);
      }
    };

    fetchTaxTypes();
  }, []);

  const addDeductionRow = () => {
    if (deductionRows.length === 0) {
      setDeductionRows([
        { id: 1, type: "", percentage: "", inclusive: false, amount: "", addition: false, },
      ]);
    }
  };
  // Function to calculate the subtotal of deduction rows
  const calculateDeductionSubTotal = () => {
    return deductionRows
      .filter((row) => !row.inclusive)
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
  };
  // Function to calculate the payable amount
  const calculatePayableAmount = () => {
    const grossAmount = parseFloat(calculateSubTotal()) + (parseFloat(creditNoteAmount) || 0);
    const deductionSubTotal = parseFloat(calculateDeductionSubTotal()) || 0;
    return (grossAmount - deductionSubTotal).toFixed(2);
  };

  const deleteDeductionRow = (id) => {
    setDeductionRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };


  useEffect(() => {
    if (creditNoteData && creditNoteData.taxes_and_charges?.length > 0) {
      // Split addition and deduction rows
      const additionRows = creditNoteData.taxes_and_charges
        .filter((tax) => tax.addition)
        .map((tax, idx) => ({
          id: idx + 1,
          type: tax.tax_name || "",
          percentage: tax.percentage || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          isEditable: !["Handling Charges", "Other charges", "Freight"].includes(tax.tax_name),
          addition: true,
          resource_id: tax.resource_id || null,
          resource_type: tax.resource_type || "TaxCharge",
        }));

      setRows(additionRows);

      const deductionRows = creditNoteData.taxes_and_charges
        .filter((tax) => !tax.addition)
        .map((tax, idx) => ({
          id: idx + 1,
          type: tax.tax_name || "",
          percentage: tax.percentage || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          addition: false,
          resource_id: tax.resource_id || null,
          resource_type: tax.resource_type || "TaxCharge",
        }));

      setDeductionRows(deductionRows);
    } else {
      // Reset everything if no tax data
      setRows([]);
      setDeductionRows([]);
    }
  }, [creditNoteData]);
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

  const taxes_and_charges = [
    ...rows.map(row => ({
      inclusive: row.inclusive,
      amount: parseFloat(row.amount) || 0,
      remarks: row.type,
      addition: true,
      percentage: parseFloat(row.percentage) || 0,
      resource_id: row.resource_id,
      resource_type: row.resource_type,
    })),
    ...deductionRows.map(row => ({
      inclusive: row.inclusive,
      amount: parseFloat(row.amount) || 0,
      remarks: row.type,
      addition: false,
      percentage: parseFloat(row.percentage) || 0,
      resource_id: row.resource_id,
      resource_type: row.resource_type,
    }))
  ];




  // attachment like mor******


  const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // in minutes
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM"

  };

  const handleAddRow = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now(),
        fileType: "",
        fileName: "",
        uploadDate: getLocalDateTime(),
        fileUrl: "",
        file: null,
        isExisting: false,
      },
    ]);
  };

  const handleRemove = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const contentType = file.type;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Content = reader.result.split(",")[1]; // Remove data:<type>;base64, prefix

      setAttachments((prev) =>
        prev.map((att) =>
          att.id === id
            ? {
              ...att,
              file,
              fileType: contentType,
              fileName: file.name,
              isExisting: false,
              document_file_name: att.document_file_name || file.name,
              uploadDate: getLocalDateTime(),
              attachments: [
                {
                  filename: file.name,
                  content: base64Content,
                  content_type: contentType,
                  document_file_name: att.document_file_name || file.name,
                },
              ],
            }
            : att
        )
      );
    };

    reader.readAsDataURL(file);
  };

  const handleFileNameChange = (id, newFileName) => {
    setAttachments((prev) =>
      prev.map((att) =>
        att.id === id
          ? {
            ...att,
            fileName: newFileName,
            attachments: att.attachments?.length
              ? [
                {
                  ...att.attachments[0],
                  filename: newFileName,
                },
              ]
              : [],
          }
          : att
      )
    );
  };

  const attachmentsPayload = attachments
    .flatMap((att) => att.attachments || []);

  console.log("attachments:", attachmentsPayload)
  // attachment like mor end******

  const payload = {
    credit_note: {
      credit_note_amount: editableDebitNote.credit_note_amount || null,
      credit_note_date: editableDebitNote.credit_note_date || null,
      remark: editableDebitNote.remark || null,
      taxes_and_charges,
      attachments: attachmentsPayload || [],
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
      },
    }
  };

  console.log("detail  edit credit note change**", payload);

  const handleSubmit = async () => {

    const { credit_note_amount, credit_note_date } = editableDebitNote;

    if (!credit_note_amount || isNaN(credit_note_amount) || Number(credit_note_amount) <= 0) {
      toast.error("Please enter Credit Note Amount.");
      return;
    }

    if (!credit_note_date) {
      toast.error("Please select Credit Note Date.");
      return;
    }


    const attachments = (documents || [])
      .map((doc) => {
        const attachment = doc.attachments?.[0];

        if (!attachment) return null;

        // If blob_id is present, skip this attachment
        if (attachment.blob_id) {
          return null;
        }

        // Include content info if no blob_id
        return {
          filename: attachment.filename || null,
          content: attachment.content || null,
          content_type: attachment.content_type || null,
          document_name: doc.document_type || null,
        };
      })
      .filter(Boolean);

    // Prepare the payload for the API
    const payload = {
      credit_note: {
        credit_note_amount: editableDebitNote.credit_note_amount
          ? Number(editableDebitNote.credit_note_amount)
          : null,
        // editableDebitNote.credit_note_amount || null,
        credit_note_date: editableDebitNote.credit_note_date || null,
        remark: editableDebitNote.remark || null,
        taxes_and_charges,
        attachments: attachmentsPayload || [],
        status_log: {
          status: status,
          remarks: remark,
          comments: comment,
        },
      }
    };

    console.log("credit after submit payload", payload);
    setLoading(true);

    try {
      const response = await axios.put(
        `${baseURL}credit_notes/${id}?token=${token}`,
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
        toast.success("Credit Note updated successfully!");
        navigate(`/credit-note-list?token=${token}`)
      } else {
        console.log("Error updating status:", response.data);
        toast.error("Failed to update Credit Note.");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Request failed:", error);
      // Handle network or other errors (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };



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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Credit Note Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                 
                                  {creditNoteData.credit_note_date
                                    ? new Date(creditNoteData.credit_note_date)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
                                    : "-"}
                                </label>
                              </div>
                            </div> */}
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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
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
                            </div> */}
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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
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
                            </div> */}
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-md-12 mt-2">
                            <div className="card p-3">
                              <div className="row mb-3">
                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Credit Note Amount <span>*</span></label>


                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editableDebitNote.credit_note_amount}
                                      onChange={(e) => handleDebitNoteChange("credit_note_amount", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Credit Note Date <span>*</span></label>

                                    <input
                                      type="date"
                                      className="form-control"
                                      value={editableDebitNote.credit_note_date}
                                      onChange={(e) => handleDebitNoteChange("credit_note_date", e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Remark</label>

                                    <textarea
                                      className="form-control"
                                      rows={2}
                                      value={editableDebitNote.remark}
                                      onChange={(e) => handleDebitNoteChange("remark", e.target.value)}
                                    />
                                  </div>
                                </div>





                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="d-flex justify-content-between mt-3 me-2">
                          <h5 className=" ">Tax Details</h5>
                        </div>

                        <div className="tbl-container  mt-3 mb-5" style={{ maxHeight: "500px" }}>
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
                              {/* Static Rows for Addition Tax */}
                              <tr>
                                <th className="text-start">Total Base Cost</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start"> {creditNoteAmount || ""}</td>
                                {/* {console.log("credit note amount:",creditNoteAmount)} */}
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Addition Tax & Charges</th>
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start" />
                                <td className="text-start" onClick={addRow}>
                                  {/* <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        fill="currentColor"
                                                                        className="bi bi-plus-circle"
                                                                        viewBox="0 0 16 16"
                                                                        style={{
                                                                            transform: showRows ? "rotate(45deg)" : "none",
                                                                            transition: "transform 0.3s ease",
                                                                        }}
                                                                    >
                                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                                                    </svg> */}
                                  <button class="btn btn-outline-danger btn-sm"><span>+</span></button>
                                </td>
                              </tr>
                              {/* Dynamic Rows for Addition Tax */}



                              {rows?.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="text-start">
                                    <SingleSelector
                                      options={taxTypes?.map((type) => ({
                                        value: type.name,
                                        label: type.name,
                                        id: type.id,
                                        tax: type.type,
                                        isDisabled:
                                          ["Handling Charges", "Other charges", "Freight"].includes(type.name) ||
                                          (type.name === "IGST" &&
                                            rows.some((r) => ["SGST", "CGST"].includes(r.type) && r.id !== row.id)) ||
                                          (["SGST", "CGST"].includes(type.name) &&
                                            rows.some((r) => r.type === "IGST" && r.id !== row.id)),
                                      }))}
                                      value={{ value: row.type, label: row.type }}
                                      // onChange={(selectedOption) => {
                                      //   console.log("Selected Option:", selectedOption); // Log the selected option
                                      //   setRows((prevRows) =>
                                      //     prevRows.map((r) =>
                                      //       r.id === row.id
                                      //         ? {
                                      //           ...r,
                                      //           type: selectedOption?.value || "", // Handle null or undefined
                                      //           resource_id: selectedOption?.id || null, // Handle null or undefined
                                      //           resource_type: selectedOption?.tax || "", // Handle null or undefined
                                      //         }
                                      //         : r
                                      //     )
                                      //   );
                                      //   console.log("Updated Rows:", rows); // Log the updated rows
                                      // }}


                                      onChange={(selectedOption) => {
                                        setRows((prevRows) => {
                                          let updatedRows = prevRows.map((r) =>
                                            r.id === row.id
                                              ? {
                                                ...r,
                                                type: selectedOption?.value || "",
                                                resource_id: selectedOption?.id || null,
                                                resource_type: selectedOption?.tax || "",
                                              }
                                              : r
                                          );

                                          // Auto-add CGST if SGST is selected
                                          if (selectedOption?.value === "SGST" && !prevRows.some(r => r.type === "CGST")) {
                                            updatedRows = [
                                              ...updatedRows,
                                              {
                                                id: updatedRows.length + 1,
                                                type: "CGST",
                                                percentage: row.percentage,
                                                inclusive: row.inclusive,
                                                amount: row.amount,
                                                isEditable: true,
                                                addition: true,
                                                resource_id: taxTypes.find(t => t.name === "CGST")?.id || null,
                                                resource_type: taxTypes.find(t => t.name === "CGST")?.type || "",
                                              },
                                            ];
                                          }

                                          // Auto-add SGST if CGST is selected
                                          if (selectedOption?.value === "CGST" && !prevRows.some(r => r.type === "SGST")) {
                                            updatedRows = [
                                              ...updatedRows,
                                              {
                                                id: updatedRows.length + 1,
                                                type: "SGST",
                                                percentage: row.percentage,
                                                inclusive: row.inclusive,
                                                amount: row.amount,
                                                isEditable: true,
                                                addition: true,
                                                resource_id: taxTypes.find(t => t.name === "SGST")?.id || null,
                                                resource_type: taxTypes.find(t => t.name === "SGST")?.type || "",
                                              },
                                            ];
                                          }

                                          return updatedRows;
                                        });
                                      }}
                                      placeholder="Select Type"
                                      isDisabled={!row.isEditable}
                                    />
                                  </td>
                                  <td className="text-start">
                                    {row.isEditable ? (

                                      // <SingleSelector
                                      //   className="form-control"
                                      //   options={[
                                      //     { value: "", label: "Select Tax" },
                                      //     { value: "5%", label: "5%" },
                                      //     { value: "12%", label: "12%" },
                                      //     { value: "18%", label: "18%" },
                                      //     { value: "28%", label: "28%" },
                                      //   ]}
                                      //   value={
                                      //     [
                                      //       { value: "", label: "Select Tax" },
                                      //       { value: "5%", label: "5%" },
                                      //       { value: "12%", label: "12%" },
                                      //       { value: "18%", label: "18%" },
                                      //       { value: "28%", label: "28%" },
                                      //     ].find(opt => opt.value === (
                                      //       row.percentage && row.percentage.toString().includes("%")
                                      //         ? row.percentage
                                      //         : row.percentage
                                      //           ? `${row.percentage}%`
                                      //           : ""
                                      //     )) || { value: "", label: "Select Tax" }
                                      //   }
                                      //   onChange={selected => {
                                      //     const value = selected?.value?.replace("%", "");
                                      //     const percentage = parseFloat(value) || 0;
                                      //     const amount = ((creditNoteAmount || 0) * percentage) / 100;
                                      //     setRows(prevRows =>
                                      //       prevRows.map(r =>
                                      //         r.id === row.id
                                      //           ? { ...r, percentage: selected?.value, amount: amount.toFixed(2) }
                                      //           : r
                                      //       )
                                      //     );
                                      //   }}
                                      //   placeholder="Select Tax"
                                      // />

                                      <SingleSelector
                                        className="form-control"
                                        options={
                                          Array.isArray(
                                            taxPercentages.find((t) => t.tax_name === row.type)?.percentage
                                          )
                                            ? taxPercentages
                                              .find((t) => t.tax_name === row.type)
                                              .percentage.map((percent) => ({
                                                value: `${percent}%`,
                                                label: `${percent}%`,
                                              }))
                                            : []
                                        }
                                        value={
                                          row.percentage !== undefined && row.percentage !== null
                                            ? {
                                              value: `${parseFloat(row.percentage)}%`,
                                              label: `${parseFloat(row.percentage)}%`,
                                            }
                                            : { value: "", label: "Select Tax" }
                                        }
                                        onChange={(selected) => {
                                          const percentage = parseFloat(selected?.value?.replace("%", "")) || 0;
                                          const amount = ((creditNoteAmount || 0) * percentage) / 100;

                                          setRows((prevRows) =>
                                            prevRows.map((r) =>
                                              r.id === row.id
                                                ? {
                                                  ...r,
                                                  percentage: selected?.value,
                                                  amount: amount.toFixed(2),
                                                }
                                                : r
                                            )
                                          );
                                        }}
                                        placeholder="Select Tax"
                                        isDisabled={!row.isEditable}
                                      />

                                    ) : (
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={
                                          row.percentage && row.percentage.toString().includes("%")
                                            ? row.percentage
                                            : row.percentage
                                              ? `${row.percentage}%`
                                              : ""
                                        }
                                        disabled
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={row.inclusive}
                                      onChange={(e) =>
                                        setRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? { ...r, inclusive: e.target.checked }
                                              : r
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={row.amount}
                                      // Editable for first three taxes, otherwise disabled if percentage is selected
                                      disabled={index > 2 && row.percentage !== ""}
                                      onChange={(e) =>
                                        setRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? { ...r, amount: parseFloat(e.target.value) || 0 }
                                              : r
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    className="text-start"
                                    onClick={() => deleteRow(row.id)}
                                    style={{ cursor: "pointer", color: "black" }}
                                  >
                                    {index > 2 && (
                                      // <svg
                                      //     xmlns="http://www.w3.org/2000/svg"
                                      //     width="16"
                                      //     height="16"
                                      //     fill="currentColor"
                                      //     className="bi bi-dash-circle"
                                      //     viewBox="0 0 16 16"
                                      //     style={{
                                      //         transition: "transform 0.3s ease",
                                      //     }}
                                      // >
                                      //     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                      //     <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                                      // </svg>
                                      <button class="btn btn-outline-danger btn-sm"><span>×</span></button>
                                    )}


                                  </td>
                                </tr>
                              ))}

                              <tr>
                                <th className="text-start">Sub Total A (Addition)</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">{calculateSubTotal()}</td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Gross Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">  {(parseFloat(calculateSubTotal()) + (parseFloat(creditNoteAmount) || 0)).toFixed(2)}</td>
                                <td />
                              </tr>
                              {/* Deduction Tax Section */}
                              <tr>
                                <th className="text-start">Deduction Tax</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start" />
                                <td className="text-start" onClick={addDeductionRow}>
                                  {/* <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        fill="currentColor"
                                                                        className="bi bi-plus-circle"
                                                                        viewBox="0 0 16 16"
                                                                        style={{
                                                                            // transform: showDeductionRows ? "rotate(45deg)" : "none",
                                                                            transition: "transform 0.3s ease",
                                                                        }}
                                                                    >
                                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                                                    </svg> */}
                                  <button class="btn btn-outline-danger btn-sm"><span>+</span></button>
                                </td>
                              </tr>
                              {/* Dynamic Rows for Deduction Tax */}



                              {deductionRows.map((row) => (
                                <tr key={row.id}>
                                  <td className="text-start">
                                    <SingleSelector
                                      options={deductionTypes.map((type) => ({
                                        value: type.name,
                                        label: type.name,
                                        id: type.id,
                                        tax: type.type,
                                      }))}
                                      value={{ value: row.type, label: row.type }}
                                      onChange={(selectedOption) =>
                                        setDeductionRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? {
                                                ...r,
                                                type: selectedOption?.value || "",
                                                resource_id: selectedOption?.id || null,
                                                resource_type: selectedOption?.tax || "",
                                              }
                                              : r
                                          )
                                        )
                                      }
                                      placeholder="Select Type"
                                    />
                                  </td>
                                  <td className="text-start">
                                    {/* <select
                                      className="form-control form-select"
                                      value={
                                        row.percentage && row.percentage.toString().includes("%")
                                          ? row.percentage
                                          : row.percentage
                                            ? `${row.percentage}%`
                                            : ""
                                      }
                                      onChange={(e) => {
                                       
                                        const value = e.target.value.replace("%", "");
                                        const percentage = parseFloat(value) || 0;
                                        const amount = ((creditNoteAmount || 0) * percentage) / 100;

                                        setDeductionRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? { ...r, percentage: e.target.value, amount: amount.toFixed(2) }
                                              : r
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax</option>
                                      <option value="1%">1%</option>
                                      <option value="2%">2%</option>
                                      <option value="10%">10%</option>
                                    
                                    </select> */}


                                    {/* <SingleSelector
                                      className="form-control"
                                      options={[
                                        { value: "", label: "Select Tax" },
                                        // { value: "1%", label: "1%" },
                                        // { value: "2%", label: "2%" },
                                        // { value: "10%", label: "10%" },
                                        { value: "5%", label: "5%" },
                                        { value: "12%", label: "12%" },
                                        { value: "18%", label: "18%" },
                                        { value: "28%", label: "28%" },

                                      ]}
                                      value={
                                        [
                                          { value: "", label: "Select Tax" },
                                          // { value: "1%", label: "1%" },
                                          // { value: "2%", label: "2%" },
                                          // { value: "10%", label: "10%" },
                                          { value: "5%", label: "5%" },
                                          { value: "12%", label: "12%" },
                                          { value: "18%", label: "18%" },
                                          { value: "28%", label: "28%" },

                                        ].find(opt => opt.value === (
                                          row.percentage && row.percentage.toString().includes("%")
                                            ? row.percentage
                                            : row.percentage
                                              ? `${row.percentage}%`
                                              : ""
                                        )) || { value: "", label: "Select Tax" }
                                      }
                                      onChange={selected => {
                                        const value = selected?.value?.replace("%", "");
                                        const percentage = parseFloat(value) || 0;
                                        const amount = ((creditNoteAmount || 0) * percentage) / 100;
                                        setDeductionRows(prevRows =>
                                          prevRows.map(r =>
                                            r.id === row.id
                                              ? { ...r, percentage: selected?.value, amount: amount.toFixed(2) }
                                              : r
                                          )
                                        );
                                      }}
                                      placeholder="Select Tax"
                                    /> */}

                                    <SingleSelector
                                      className="form-control"
                                      options={
                                        taxPercentages.find((t) => t.tax_name === row.type)?.percentage.map((p) => ({
                                          value: `${p}%`,
                                          label: `${p}%`,
                                        })) || []
                                      }
                                      value={
                                        (() => {
                                          const percent = row.percentage?.toString().includes("%")
                                            ? row.percentage
                                            : `${row.percentage}%`;

                                          const options = taxPercentages.find((t) => t.tax_name === row.type)?.percentage || [];
                                          return options.includes(parseFloat(percent))
                                            ? { value: percent, label: percent }
                                            : { value: "", label: "Select Tax" };
                                        })()
                                      }
                                      onChange={(selected) => {
                                        const percentage = parseFloat(selected?.value?.replace("%", "")) || 0;
                                        const amount = ((creditNoteAmount || 0) * percentage) / 100;

                                        setDeductionRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? {
                                                ...r,
                                                percentage: percentage,
                                                amount: amount.toFixed(2),
                                              }
                                              : r
                                          )
                                        );
                                      }}
                                      placeholder="Select Tax %"
                                    // isDisabled={!row.isEditable}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={row.inclusive}
                                      onChange={(e) =>
                                        setDeductionRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? { ...r, inclusive: e.target.checked }
                                              : r
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={row.amount}
                                      disabled
                                      onChange={(e) =>
                                        setDeductionRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? { ...r, amount: parseFloat(e.target.value) || 0 }
                                              : r
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    className="text-start"
                                    onClick={() => deleteDeductionRow(row.id)}
                                    style={{ cursor: "pointer", color: "black" }}
                                  >
                                    {/* <svg
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
                                                                        </svg> */}
                                    <button class="btn btn-outline-danger btn-sm"><span>×</span></button>
                                  </td>
                                </tr>
                              ))}
                              {/* Static Rows */}
                              <tr>
                                <th className="text-start">Sub Total B (Deductions)</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">{calculateDeductionSubTotal()}</td>
                                <td />
                              </tr>
                              <tr>
                                <th className="text-start">Payable Amount</th>
                                <td className="text-start" />
                                <td className="" />
                                <td className="text-start">{calculatePayableAmount()}</td>
                                <td />
                              </tr>


                            </tbody>
                          </table>
                        </div>

                        {/* <div className="d-flex justify-content-between mt-4 ">
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
                        </div> */}
                        {/* Document Table (dynamic) */}
                        {/* <div className="tbl-container mt-2 ">
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
                                    <td className="text-start">
                            {doc.attachments[0]?.content_type || "-"}
                          </td>
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
                        </div> */}

                        {/* document like mor start */}
                        <div className="d-flex justify-content-between mt-5 ">
                          <h5 className=" ">Document Attachment</h5>
                          <div
                            className="card-tools d-flex"
                            data-bs-toggle="modal"
                            data-bs-target="#attachModal"
                            // onClick={openattachModal}
                            onClick={handleAddRow}
                          >
                            <button
                              className="purple-btn2 mb-2 "
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
                              <span>Add Attachments</span>
                            </button>
                          </div>
                        </div>

                        <div className="tbl-container mb-4" style={{ maxHeight: "500px" }}>
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th className="main2-th">File Type</th>
                                <th className="main2-th" >File Name </th>
                                <th className="main2-th">Upload At</th>
                                <th className="main2-th">Upload File</th>
                                <th className="main2-th">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {attachments.map((att, index) => (
                                <tr key={att.id}>
                                  <td>
                                    <input
                                      className="form-control document_content_type"
                                      readOnly
                                      disabled
                                      value={att.fileType}
                                      placeholder="File Type"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control file_name"
                                      required
                                      value={att.fileName}
                                      onChange={(e) => handleFileNameChange(att.id, e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control created_at"
                                      readOnly
                                      disabled
                                      type="datetime-local"
                                      step="1"
                                      value={att.uploadDate || ""}
                                    />
                                  </td>
                                  <td>
                                    {!att.isExisting && (
                                      <input
                                        type="file"
                                        className="form-control"
                                        required
                                        onChange={(e) => handleFileChange(e, att.id)}
                                      />
                                    )}
                                  </td>
                                  <td className="document">
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                      <div className="attachment-placeholder">
                                        {att.isExisting && (
                                          <div className="file-box">
                                            {console.log("att bolb id", att.blob_id)}
                                            <div className="">
                                              <a
                                                // href={`${baseURL}debit_notes/${id}/download?token=${token}&blob_id=${att.blob_id} rel="noopener noreferrer"`}
                                                href={
                                                  // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                  `${baseURL}debit_notes/${id}/download?token=${token}&blob_id=${att.blob_id}`
                                                  // attachment.url
                                                }
                                                target="_blank"
                                                // rel="noopener noreferrer"
                                                download={att.file}
                                              >
                                                <DownloadIcon />
                                              </a>

                                            </div>
                                            <div className="file-name">
                                              {/* <a href={`${baseURL}debit_notes/${id}/download?token=${token}&blob_id=${att.blob_id}`} download>
                                                                          <span className="material-symbols-outlined">file_download</span>
                                                                        </a> */}
                                              <span>{att.fileName}</span>
                                            </div>

                                          </div>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={() => handleRemove(att.id)}
                                      >
                                        <span className="material-symbols-outlined">cancel</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>


                        </div>
                        {/* document like mor end*/}
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
                    <th>Action</th>
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
                        <td className="text-start">{doc.attachments[0]?.filename || "-"}</td>
                        {/* <td className="text-start">
                                                                {doc.attachments[0]?.content_type || "-"}
                                                              </td> */}
                        <td className="text-start">
                          {doc.uploadDate || "-"}
                        </td>
                        <td className="text-start">

                          {doc?.blob_id && (
                            <a
                              href={
                                // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                `${baseURL}credit_notes/${id}/download?token=${token}&blob_id=${doc.blob_id}`
                                // attachment.url
                              }
                              target="_blank"
                              // rel="noopener noreferrer"
                              download={doc.filename}
                            >
                              <DownloadIcon />
                            </a>
                          )}

                        </td>


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
