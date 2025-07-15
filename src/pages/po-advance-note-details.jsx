import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { DownloadIcon } from "../components";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";

import { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function formatDateDDMMYYYY(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const POAdvanceNoteDetails = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const [showRows, setShowRows] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [creditNoteAmount, setCreditNoteAmount] = useState(null);
  const [remark, setRemark] = useState("");
  const [comment, setComment] = useState("");


  // tax table functionality

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

  const [advanceNote, setAdvanceNote] = useState(null); // State to store API data

  // Fetch data from API
  // useEffect(() => {
  //   const fetchAdvanceNotes = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `https://marathon.lockated.com/advance_notes/${id}/
  //         token=${token}`
  //       );
  //       const data = response.data; // Assuming you want the first item
  //       console.log("data", data);
  //       setAdvanceNote(data);
  //     } catch (err) {
  //       setError("Failed to fetch data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAdvanceNotes();
  // }, [id]);

  useEffect(() => {
    const fetchAdvanceNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}advance_notes/${id}?token=${token}`
        );
        const data = response.data;
        console.log("data", data);
        setAdvanceNote(data);
        setCreditNoteAmount(data.advance_amount || 0)
        setStatus(
          data.status?.charAt(0).toUpperCase() +
          data.status?.slice(1).toLowerCase() || ""
        );
      } catch (err) {
        console.error("Error fetching advance note:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdvanceNotes();
    }
  }, [id]);

  const [rows, setRows] = useState([
    // {
    //   id: 1,
    //   type: "Handling Charges",
    //   percentage: "Select Charges",
    //   inclusive: false,
    //   amount: "",
    //   isEditable: false,
    //   addition: true,
    // },
    // {
    //   id: 2,
    //   type: "Other charges",
    //   percentage: "Select Charges",
    //   inclusive: false,
    //   amount: "",
    //   isEditable: false,
    //   addition: true,
    // },
    // {
    //   id: 3,
    //   type: "Freight",
    //   percentage: "Select Charges",
    //   inclusive: false,
    //   amount: " ",
    //   isEditable: false,
    //   addition: true,
    // },
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
  // console.log("tax types:", taxTypes)
  // const addRow = () => {
  //   setRows((prevRows) => [
  //     ...prevRows,
  //     {
  //       id: prevRows.length + 1,
  //       type: "",
  //       percentage: "0",
  //       inclusive: false,
  //       amount: "",
  //       isEditable: true,
  //       addition: true,
  //     },
  //   ]);
  // };

  // const addRow = () => {
  //   // List of special types
  //   const specialTypes = [
  //     { type: "Handling Charges", resource_id: 2 },
  //     { type: "Other charges", resource_id: 4 },
  //     { type: "Freight", resource_id: 5 },
  //   ];

  //   // Find the first special type not yet added
  //   const existingTypes = rows.map(r => r.type);
  //   const nextSpecial = specialTypes.find(st => !existingTypes.includes(st.type));

  //   if (nextSpecial) {
  //     setRows(prevRows => [
  //       ...prevRows,
  //       {
  //         id: prevRows.length + 1,
  //         type: nextSpecial.type,
  //         percentage: "",
  //         inclusive: false,
  //         amount: "",
  //         isEditable: false,
  //         addition: true,
  //         resource_id: nextSpecial.resource_id,
  //         resource_type: "TaxCharge",
  //       },
  //     ]);
  //   } else {
  //     // Add a generic editable row if all special types are already added
  //     setRows(prevRows => [
  //       ...prevRows,
  //       {
  //         id: prevRows.length + 1,
  //         type: "",
  //         percentage: "0",
  //         inclusive: false,
  //         amount: "",
  //         isEditable: true,
  //         addition: true,
  //       },
  //     ]);
  //   }
  // };


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

  // Function to calculate the subtotal of addition rows
  const calculateSubTotal = () => {
    return rows
      .filter((row) => !row.inclusive)
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0)
      .toFixed(2);
  };

  // Delete a row
  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    // setRows((prevRows) =>
    //   prevRows.filter((row, index) => {
    //     // Prevent deletion of the first three rows
    //     if (index < 3) {
    //       return true;
    //     }
    //     return row.id !== id;
    //   })
    // );
  };

  // deduction
  const [deductionRows, setDeductionRows] = useState([
    // { id: 1, type: "", charges: "", inclusive: false, amount: 0.0 },
  ]);
  // const addDeductionRow = () => {
  //   setDeductionRows((prevRows) => [
  //     ...prevRows,
  //     { id: prevRows.length + 1, type: "", charges: "", inclusive: false, amount: 0.0 },
  //   ]);
  // };

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
        {
          id: 1,
          type: "",
          percentage: "",
          inclusive: false,
          amount: "",
          addition: false,
        },
      ]);
    }
  };
  // Function to calculate the subtotal of deduction rows
  const calculateDeductionSubTotal = () => {
    return deductionRows
      .filter((row) => !row.inclusive)
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0)
      .toFixed(2);
  };
  // Function to calculate the payable amount
  const calculatePayableAmount = () => {
    const grossAmount =
      parseFloat(calculateSubTotal()) + (parseFloat(creditNoteAmount) || 0);
    const deductionSubTotal = parseFloat(calculateDeductionSubTotal()) || 0;
    return (grossAmount - deductionSubTotal).toFixed(2);
  };

  const deleteDeductionRow = (id) => {
    setDeductionRows((prevRows) => prevRows.filter((row) => row.id !== id));
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
      label: "Submitted",
      value: "submitted",
    },
    {
      label: "Verified",
      value: "verified",
    },
    {
      label: "Approved",
      value: "approved",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
  ];

  const [status, setStatus] = useState("");

  // const [attachments, setAttachments] = useState([]);
  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);
  const documentRowsRef = useRef(documentRows);

  const handleAddDocumentRow = () => {
    const newRow = { srNo: documentRows.length + 1, upload: null };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      const updatedRows = documentRows.filter((_, i) => i !== index);

      // Reset row numbers properly
      updatedRows.forEach((row, i) => {
        row.srNo = i + 1;
      });

      documentRowsRef.current = updatedRows;
      setDocumentRows([...updatedRows]);
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return; // Ensure a file is selected

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      documentRowsRef.current[index].upload = {
        filename: file.name,
        content: base64String,
        content_type: file.type,
      };

      setDocumentRows([...documentRowsRef.current]);
    };

    reader.readAsDataURL(file);

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = ""; // Clear input value
    }
  };
  const attachments = documentRows
    .filter(row => row.upload)
    .map(row => ({
      filename: row.upload.filename,
      content_type: row.upload.content_type,
      content: row.upload.content, // base64 string
    }));

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

    advance_note: {
      company_id: advanceNote?.company_id,
      project_id: advanceNote?.project_id,
      advance_number: advanceNote?.advance_number,
      // supplier_name: advanceNote?.supplier_name,
      taxes_and_charges: [
        ...rows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition,
          percentage: parseFloat(row.percentage) || 0,
          resource_id: row.resource_id || null,
          resource_type: row.resource_type || ""
        })),
        ...deductionRows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition || false, // Ensure addition is false for deductions
          percentage: parseFloat(row.percentage) || 0,
          resource_id: row.resource_id || null,
          resource_type: row.resource_type || ""
        })),
      ],
      attachments,
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
        // status, // dynamically selected status
        // remarks, // Dynamically pass the entered remarks
        // comments,
        // remarks, comments, admin_comment can be added here if needed
      },
    }
  };

  console.log("payload for edit:************", payload)

  const handleSubmit = async () => {
    // const payload = {
    //   status_log: {
    //     // status: "Approved", // Replace with dynamic status if needed
    //     // remarks: "Status updated to Approved", // Replace with dynamic remarks if needed
    //     // comments: "All checks passed", // Replace with dynamic comments if needed
    //     // admin_comment: "Approved by admin", // Replace with dynamic admin comment if needed
    //     status, // Dynamically pass the selected status
    //     // remarks, // Dynamically pass the entered remarks
    //     // comments, // Dynamically pass the entered comments
    //     // admin_comment: "adminComment", // Dynamically pass the admin comment if needed
    //   },
    //   attachments,
    // };

    const payload = {

      advance_note: {
        company_id: advanceNote?.company_id,
        project_id: advanceNote?.project_id,
        advance_number: advanceNote?.advance_number,
        // supplier_name: advanceNote?.supplier_name,
        taxes_and_charges: [
          ...rows.map((row) => ({
            inclusive: row.inclusive,
            amount: parseFloat(row.amount) || 0,
            remarks: row.type,
            addition: row.addition,
            percentage: parseFloat(row.percentage) || 0,
            resource_id: row.resource_id || null,
            resource_type: row.resource_type || ""
          })),
          ...deductionRows.map((row) => ({
            inclusive: row.inclusive,
            amount: parseFloat(row.amount) || 0,
            remarks: row.type,
            addition: row.addition || false, // Ensure addition is false for deductions
            percentage: parseFloat(row.percentage) || 0,
            resource_id: row.resource_id || null,
            resource_type: row.resource_type || ""
          })),
        ],
        attachments,
        status_log: {
          status: status,
          remarks: remark,
          comments: comment,
          // remarks, comments, admin_comment can be added here if needed
        },
      }
    };

    console.log("payload for Submission edit po:************", payload)

    try {
      const response = await axios.put(
        // "https://marathon.lockated.com/advance_notes/3/update_status",
        `${baseURL}advance_notes/${id}?token=${token}`, // Use the dynamic ID here

        payload
      );
      console.log("Status updated successfully:", response.data);
      setRemark("");
      setComment("")
      alert("Advance Note updated successfully!");
      navigate(`/po-advance-note-list?token=${token}`); // Redirect to bill-booking-list
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update Advance Note.");
    }
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section ms-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Advance Details</a>
          <h5 className="mt-3">Advance Details</h5>
          <div className="row my-4 align-items-center container-fluid ">
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
                    <div className="mor-tabs mt-4 ">
                      <ul
                        className="nav nav-pills mb-3 justify-content-center"
                        id="pills-tab"
                        role="tablist"
                        style={{ boxShadow: "none", backgroundColor: "#fff" }}
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link "
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-home"
                            type="button"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                          >
                            MOR
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                          >
                            MOR Approval
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            PO
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link "
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Advance
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Material Received
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Billing
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="row justify-content-center my-4">
                      <div className="col-md-10 ">
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
                            {/* Prev Button */}
                            <button
                              className={`btn btn-prev ${currentStep === 1 ? "disabled" : ""
                                }`}
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            {/* Next Button */}
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

                    {/* form-select EXAMPLE */}
                    <div
                      className="card card-default"
                      id="mor-material-details"
                    >
                      <div className="card-body mt-0">
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
                                  {advanceNote?.company_name || ""}
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
                                  {advanceNote?.project_name || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Advance Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.advance_number || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Certificate Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.certificate_number || ""}
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
                                  {advanceNote?.po_number || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>PO Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.po_date ? formatDateDDMMYYYY(advanceNote.po_date) : ""}
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
                                  {advanceNote?.po_value || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Performa Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.performa_number || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Performa Amount</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.performa_amount || ""}
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
                                  {advanceNote?.invoice_date || ""}
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
                                  {advanceNote?.supplier_name || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>GSTN Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.gstn_number || ""}
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
                                  {advanceNote?.pan_no || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Advance %</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.advance_percentage || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Advance Amount</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.advance_amount || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Net Payable</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.net_payable || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Mode of Payment</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.mode_of_payment || ""}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Favoring / Payee</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {advanceNote?.favoring_payee || ""}
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
                                  {advanceNote?.expected_payment_date ? formatDateDDMMYYYY(advanceNote.expected_payment_date) : ""}
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
                                  {advanceNote?.remark || ""}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* tax details */}
                        {/* {console.log("tax table show not show :",advanceNote?.advance_payment_schedule?.with_tax)} */}

                        {!advanceNote?.advance_payment_schedule?.with_tax && (
                          <>
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
                                  {/* Static Rows for Addition Tax */}
                                  <tr>
                                    <th className="text-start">Total Base Cost</th>
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start"> {creditNoteAmount || ""}</td>
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
                                  {rows.map((row) => (
                                    <tr key={row.id}>
                                      <td className="text-start">
                                        <SingleSelector
                                          options={taxTypes.map((type) => ({
                                            value: type.name,
                                            label: type.name,
                                            id: type.id,
                                            tax: type.type,
                                            isDisabled:
                                              // Disable "Handling Charges", "Other charges", "Freight" for all rows
                                              ["Handling Charges", "Other charges", "Freight"].includes(type.name) ||


                                              // Disable "IGST" if "SGST" or "CGST" is selected in any row
                                              (type.name === "IGST" &&
                                                rows.some((r) => ["SGST", "CGST"].includes(r.type) && r.id !== row.id)) ||
                                              // Disable "SGST" and "CGST" if "IGST" is selected in any row
                                              (["SGST", "CGST"].includes(type.name) &&
                                                rows.some((r) => r.type === "IGST" && r.id !== row.id)),

                                          }))}
                                          value={{ value: row.type, label: row.type }}
                                          // onChange={(selectedOption) =>
                                          //   setRows((prevRows) =>
                                          //     prevRows.map((r) =>
                                          //       r.id === row.id ? { ...r, type: selectedOption.value } : r
                                          //     )
                                          //   )
                                          // }


                                          // onChange={(selectedOption) =>
                                          //   setRows((prevRows) =>
                                          //     prevRows.map((r) =>
                                          //       r.id === row.id
                                          //         ? {
                                          //           ...r,
                                          //           type: selectedOption?.value || "", // Handle null or undefined
                                          //           resource_id: selectedOption?.id || null, // Handle null or undefined
                                          //           resource_type: selectedOption?.tax || "", // Handle null or undefined
                                          //           // resource_id: selectedOption?.value || null, // Handle null or undefined
                                          //           // resource_type: taxTypes.find((t) => t.id === selectedOption?.value)?.type || "", // Handle null or undefined
                                          //         }
                                          //         : r
                                          //     )
                                          //   )
                                          // }


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
                                          isDisabled={!row.isEditable} // Disable if not editable
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
                                          //     ].find(opt => opt.value === row.percentage) || { value: "", label: "Select Tax" }
                                          //   }
                                          //   onChange={selected => {
                                          //     const percentage = parseFloat(selected?.value) || 0;
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

                                          // <SingleSelector
                                          //   className="form-control"
                                          //   options={
                                          //     taxPercentages.find((t) => t.tax_name === row.type)?.percentage.map((percent) => ({
                                          //       value: `${percent}%`,
                                          //       label: `${percent}%`,
                                          //     })) || []
                                          //   }
                                          //   value={
                                          //     taxPercentages
                                          //       .find((t) => t.tax_name === row.type)?.percentage
                                          //       .map((p) => `${p}%`)
                                          //       .includes(
                                          //         row.percentage?.toString().includes("%")
                                          //           ? row.percentage
                                          //           : `${row.percentage}`
                                          //       )
                                          //       ? { value: `${row.percentage}%`, label: `${row.percentage}%` }
                                          //       : null
                                          //   }
                                          //   onChange={(selectedOption) => {
                                          //     setRows((prevRows) =>
                                          //       prevRows.map((r) =>
                                          //         r.id === row.id
                                          //           ? {
                                          //             ...r,
                                          //             percentage: selectedOption
                                          //               ? parseFloat(selectedOption.value.replace("%", ""))
                                          //               : "",
                                          //           }
                                          //           : r
                                          //       )
                                          //     );
                                          //   }}
                                          //   placeholder="Select Tax %"
                                          //   isDisabled={!row.isEditable}
                                          // />



                                          //                                         <select
                                          //   className="form-control"
                                          //   value={row.percentage}
                                          //   onChange={(e) =>
                                          //     setRows((prevRows) =>
                                          //       prevRows.map((r) =>
                                          //         r.id === row.id ? { ...r, percentage: parseFloat(e.target.value) } : r
                                          //       )
                                          //     )
                                          //   }
                                          // >
                                          //   {taxPercentages
                                          //     .find((t) => t.tax_name === row.type)?.percentage.map((percent) => (
                                          //       <option key={percent} value={percent}>
                                          //         {percent}%
                                          //       </option>
                                          //     ))}
                                          // </select>



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
                                            value={row.percentage}
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
                                          disabled={row.percentage !== ""}
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
                                          // onChange={(selectedOption) =>
                                          //   setDeductionRows((prevRows) =>
                                          //     prevRows.map((r) =>
                                          //       r.id === row.id ? { ...r, type: selectedOption.value } : r
                                          //     )
                                          //   )
                                          // }


                                          onChange={(selectedOption) =>
                                            setDeductionRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id ? {
                                                  ...r,
                                                  type: selectedOption?.value || "", // Handle null or undefined
                                                  resource_id: selectedOption?.id || null, // Handle null or undefined
                                                  resource_type: selectedOption?.tax || "", // Handle null or undefined
                                                } : r
                                              )
                                            )
                                          }
                                          placeholder="Select Type"
                                        />
                                      </td>
                                      <td className="text-start">
                                        {/* <SingleSelector
                                                                className="form-control"
                                                                options={[
                                                                  { value: "", label: "Select Tax" },
                                                                  { value: "5%", label: "5%" },
                                                                  { value: "12%", label: "12%" },
                                                                  { value: "18%", label: "18%" },
                                                                  { value: "28%", label: "28%" },
                                                                ]}
                                                                value={
                                                                  [
                                                                    { value: "", label: "Select Tax" },
                                                                    { value: "5%", label: "5%" },
                                                                    { value: "12%", label: "12%" },
                                                                    { value: "18%", label: "18%" },
                                                                    { value: "28%", label: "28%" },
                                                                  ].find(opt => opt.value === row.percentage) || { value: "", label: "Select Tax" }
                                                                }
                                                                onChange={selected => {
                                                                  const percentage = parseFloat(selected?.value) || 0;
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
                          </>
                        )}
                        {/* <div className="d-flex justify-content-between mt-3 me-2">
                          <h5 className=" ">Advance Amount Bifurcation</h5>
                        </div>
                        <div className="tbl-container mx-3 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th className="text-start">Sub-Project</th>
                                <th className="text-start">MOR Number</th>
                                <th className="text-start">Advance Amount</th>
                                <th className="text-start">Paid Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-start">Cedar</td>
                                <td className="text-start">MOR123</td>
                                <td className="text-start">1170</td>
                                <td className="text-start">1770</td>
                              </tr>
                              <tr>
                                <td className="text-start">Bodhi</td>
                                <td className="text-start">MOR123</td>
                                <td className="text-start">1170</td>
                                <td className="text-start">1770</td>
                              </tr>
                            </tbody>
                          </table>
                        </div> */}
                        <div className="d-flex justify-content-between mt-5 me-2">
                          <h5 className=" ">Payment Details</h5>
                        </div>
                        <div className="tbl-container  mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th className="text-start">Mode of Payment</th>
                                <th className="text-start">Instrument Date</th>
                                <th className="text-start">Instrument No.</th>
                                <th className="text-start">UTR NO.</th>
                                <th className="text-start">
                                  Bank / Cash Account
                                </th>
                                <th className="text-start">Amount</th>
                                <th className="text-start">Created by</th>
                                <th className="text-start">Created On</th>
                                <th className="text-start">Status</th>
                                <th className="text-start">
                                  Reconsilation Date
                                </th>
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
                                <td className="text-start text-decoration-underline">
                                  Print
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>


                        <div className="d-flex justify-content-between align-items-end  mt-5">
                          <h5 className="mt-3">
                            Document Attachments{" "}
                            <span style={{ color: "red", fontSize: "16px" }}>
                              *
                            </span>
                          </h5>
                          <button
                            className="purple-btn2 mt-3"
                            onClick={handleAddDocumentRow}
                          >
                            <span className="material-symbols-outlined align-text-top me-2">
                              add
                            </span>
                            <span>Add</span>
                          </button>
                        </div>
                        <Table
                          columns={[
                            { label: "Sr No", key: "srNo" },
                            { label: "Upload File", key: "upload" },
                            { label: "Action", key: "action" },
                            { label: "view", key: "view" },
                          ]}
                          data={documentRows.map((row, index) => ({
                            srNo: index + 1,
                            upload: (
                              <td style={{ border: "none" }}>
                                {/* Hidden file input */}
                                <input
                                  type="file"
                                  id={`file-input-${index}`}
                                  key={row?.srNo}
                                  style={{ display: "none" }} // Hide input
                                  onChange={(e) =>
                                    handleFileChange(index, e.target.files[0])
                                  }
                                  accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                                />

                                <label
                                  htmlFor={`file-input-${index}`}
                                  style={{
                                    display: "inline-block",
                                    width: "300px",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    color: "#555",
                                    backgroundColor: "#f5f5f5",
                                    textAlign: "center",
                                  }}
                                >
                                  {row.upload?.filename
                                    ? row.upload.filename
                                    : "Choose File"}
                                </label>
                              </td>
                            ),
                            action: (
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveDocumentRow(index)}
                                disabled={documentRows.length === 1}
                              >
                                Remove
                              </button>
                            ),
                          }))}
                          isAccordion={false}
                        />
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
                <div className="row mt-4 justify-content-end align-items-center w-100">
                  <div className="col-md-3">
                    <div className="form-group d-flex gap-3 align-items-center">
                      <label style={{ fontSize: "1.1rem" }}>status</label>
                      {/* <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        value={status} // Bind the value to the status state
                        onChange={(e) => setStatus(e.target.value)} // Update the status state on change
                      >
                        <option value="">Select Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Verified">Verified</option>
                        <option value="Proceed">Proceed</option>
                      </select> */}

                      <SingleSelector
                        className="form-control"
                        style={{ width: "100%" }}
                        options={[
                          { value: "Approved", label: "Approved" },
                          { value: "Draft", label: "Draft" },
                          { value: "Submitted", label: "Submitted" },
                          { value: "Verified", label: "Verified" },
                          { value: "Proceed", label: "Proceed" },
                          { value: "Paid and Clear", label: "Paid and Clear" }, // New option
                        ]}
                        value={
                          [
                            { value: "Approved", label: "Approved" },
                            { value: "Draft", label: "Draft" },
                            { value: "Submitted", label: "Submitted" },
                            { value: "Verified", label: "Verified" },
                            { value: "Proceed", label: "Proceed" },
                            { value: "Paid and Clear", label: "Paid and Clear" },
                          ].find(opt => opt.value === status) || null
                        }
                        onChange={selected => setStatus(selected?.value || "")}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-end w-100">
                  <div className="col-md-2 mt-2">
                    {/* <button className="purple-btn2 w-100">Print</button> */}
                  </div>
                  <div className="col-md-2 mt-2">
                    <button
                      className="purple-btn2 w-100"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
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
                            {(advanceNote?.status_logs || [])
                              .slice(0, 10)
                              .map((log, index) => (
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
                        {/* Show "Show More" link if more than 10 records */}
                        {advanceNote?.status_logs?.length > 10 && (
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
                    <div className="mx-0">
                      {/* <Table columns={auditLogColumns} data={auditLogData} /> */}
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

export default POAdvanceNoteDetails;
