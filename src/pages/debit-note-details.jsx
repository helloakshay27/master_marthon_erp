import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { DownloadIcon } from "../components";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleSelector from '../components/base/Select/SingleSelector';
import { baseURL } from '../confi/apiDomain';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from "react-toastify";
const DebitNoteDetails = () => {
  // const [showRows, setShowRows] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAuditModal, setShowAuditModal] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [showRows, setShowRows] = useState(false);
  const [debitNoteData, setDebitNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available
  const [creditNoteAmount, setCreditNoteAmount] = useState(null);
  const [creditNoteData, setCreditNoteData] = useState(null);

  // Fetch credit note data
  const fetchCreditNoteData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}debit_notes/${id}?token=${token}`
      );
      setDebitNoteData(response.data);
      setStatus(response.data.status)
      setCreditNoteAmount(response.data.debit_note_amount || 0)
      setCreditNoteData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNoteData();
  }, [id]);
  console.log("status:", status)


  const [rows, setRows] = useState([
    // { id: 1, type: "Handling Charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 2, resource_type: "TaxCharge" },
    // { id: 2, type: "Other charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 4, resource_type: "TaxCharge" },
    // { id: 3, type: "Freight", percentage: "", inclusive: false, amount: ' ', isEditable: false, addition: true, resource_id: 5, resource_type: "TaxCharge" },
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
  //     setRows((prevRows) => [
  //         ...prevRows,
  //         {
  //             id: prevRows.length + 1,
  //             type: "",
  //             percentage: "0",
  //             inclusive: false,
  //             amount: "",
  //             isEditable: true,
  //             addition: true,
  //         },
  //     ]);
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

  useEffect(() => {
    // if (creditNoteData) {
    //     setBillNumber(creditNoteData.bill_no || "");
    //     setBillDate(creditNoteData.bill_date || "");
    //     setCreditNoteAmount(creditNoteData.amount || "");
    // }
    if (creditNoteData && creditNoteData.taxes_and_charges) {
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
          resource_id: tax.resource_id,
          resource_type: tax.resource_type,
        }));

      // Ensure first three rows are always Handling Charges, Other charges, Freight
      const defaultRows = [
        { type: "Handling Charges" },
        { type: "Other charges" },
        { type: "Freight" },
      ];
      const mergedRows = defaultRows.map((def, i) => {
        const found = additionRows.find((r) => r.type === def.type);
        return (
          found || {
            id: i + 1,
            type: def.type,
            percentage: "",
            inclusive: false,
            amount: "",
            isEditable: false,
            addition: true,
            resource_id: null,
            resource_type: "TaxCharge",
          }
        );
      });

      // Add any extra addition rows (not the first three)
      const extraRows = additionRows.filter(
        (r) => !["Handling Charges", "Other charges", "Freight"].includes(r.type)
      );
      setRows([...mergedRows, ...extraRows]);

      // Deduction rows
      const deductionRows = creditNoteData.taxes_and_charges
        .filter((tax) => !tax.addition)
        .map((tax, idx) => ({
          id: idx + 1,
          type: tax.tax_name || "",
          percentage: tax.percentage || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          addition: false,
          resource_id: tax.resource_id,
          resource_type: tax.resource_type,
        }));
      setDeductionRows(deductionRows);
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




  const handleSubmit = async () => {
    // Prepare the payload for the API
    // const payload = {
    //   // status_log: {
    //   //   status: status,
    //   //   remarks: remark,
    //   //   comments: comment,
    //   // },

    //   taxes_and_charges,
    // attachments,
    // // status_log: {
    // //   status: status,
    // //   remarks: remark,
    // //   comments: comment,
    // // },
    // };

    const payload = {

      debit_note: {
        // company_id: debitNoteData?.company_id,
        // project_id: debitNoteData?.project_id,
        // debit_note_no: debitNoteData?.debit_note_no,
        // debit_note_amount: debitNoteData?.debit_note_amount,
        // remark: debitNoteData?.remark,
        // reason: debitNoteData?.reason,
        taxes_and_charges,
        attachments,
        status_log: {
          status: status,
          remarks: remark,
          comments: comment,
        },
      }
    };




    console.log("detail status change", payload);
    setLoading(true);

    try {
      const response = await axios.put(
        `${baseURL}debit_notes/${id}?token=${token}`,
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
        toast.success("Debit Note updated successfully!");
        // await fetchCreditNoteData();
      } else {
        console.log("Error updating status:", response.data);
        toast.error("Failed to update Debit Note .");
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

  // const [rows, setRows] = useState([
  //   {
  //     id: 1,
  //     type: "TDS 1",
  //     charges: "100",
  //     inclusive: false,
  //     amount: 50.0,
  //   },
  // ]);

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
  //   return rows.reduce((total, row) => total + row.amount, 0).toFixed(2); // Sum of all amounts
  // };

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

  //  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);

  const [documentRows, setDocumentRows] = useState([]);
  const documentRowsRef = useRef(documentRows);
  const [documentRowsInitialized, setDocumentRowsInitialized] = useState(false);

  useEffect(() => {
    if (debitNoteData?.attachments && !documentRowsInitialized) {
      setDocumentRows(
        debitNoteData.attachments.map((att, idx) => ({
          srNo: idx + 1,
          upload: {
            filename: att.filename,
            content_type: att.content_type,
            url: att.url || `${baseURL}debit_notes/${id}/download?token=${token}&blob_id=${att.blob_id}`,
          },
          isApiAttachment: true,
        }))
      );
      setDocumentRowsInitialized(true);
    }
  }, [debitNoteData, documentRowsInitialized]);

  const handleAddDocumentRow = () => {
    // const newRow = { srNo: documentRows.length + 1, upload: null };
    // documentRowsRef.current.push(newRow);
    // setDocumentRows([...documentRowsRef.current]);
    setDocumentRows(prevRows => [
      ...prevRows,
      { srNo: prevRows.length + 1, upload: null }
    ]);
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

  // const handleFileChange = (index, file) => {
  //   if (!file) return; // Ensure a file is selected

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64String = reader.result.split(",")[1];

  //     documentRowsRef.current[index].upload = {
  //       filename: file.name,
  //       content: base64String,
  //       content_type: file.type,
  //     };

  //     setDocumentRows([...documentRowsRef.current]);
  //   };

  //   reader.readAsDataURL(file);

  //   // Reset the input field to allow re-selecting the same file
  //   const inputElement = document.getElementById(`file-input-${index}`);
  //   if (inputElement) {
  //     inputElement.value = ""; // Clear input value
  //   }
  // };

  const handleFileChange = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      setDocumentRows(prevRows => {
        const updatedRows = [...prevRows];
        updatedRows[index] = {
          ...updatedRows[index],
          upload: {
            filename: file.name,
            content: base64String,
            content_type: file.type,
          }
        };
        return updatedRows;
      });
    };

    reader.readAsDataURL(file);

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = "";
    }
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

  // Only include new uploads (not API attachments)
  const attachments = documentRows
    .filter(row => !row.isApiAttachment && row.upload)
    .map(row => ({
      filename: row.upload.filename,
      content_type: row.upload.content_type,
      content: row.upload.content, // base64 string
    }));
  const payload = {

    debit_note: {
      // company_id: debitNoteData?.company_id,
      // project_id: debitNoteData?.project_id,
      // debit_note_no: debitNoteData?.debit_note_no,
      // debit_note_amount: debitNoteData?.debit_note_amount,
      // remark: debitNoteData?.remark,
      // reason: debitNoteData?.reason,
      taxes_and_charges,
      attachments,
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
      },
    }
  };

  console.log("detail edit change", payload);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section ms-2 ">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Debit Note </a>
          <h5 className="mt-3">Debit Note </h5>
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
                                      onChange={(selectedOption) => {
                                        console.log("Selected Option:", selectedOption); // Log the selected option
                                        setRows((prevRows) =>
                                          prevRows.map((r) =>
                                            r.id === row.id
                                              ? {
                                                ...r,
                                                type: selectedOption?.value || "", // Handle null or undefined
                                                resource_id: selectedOption?.id || null, // Handle null or undefined
                                                resource_type: selectedOption?.tax || "", // Handle null or undefined
                                              }
                                              : r
                                          )
                                        );
                                        console.log("Updated Rows:", rows); // Log the updated rows
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



                        <div className="d-flex justify-content-between align-items-end  mt-5">
                          <h5 className="mt-3">
                            Document Attachments{" "}
                            {/* <span style={{ color: "red", fontSize: "16px" }}>*</span> */}
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
                            { label: "View", key: "view" },
                          ]}
                          data={documentRows.map((row, index) => ({
                            srNo: index + 1,
                            upload: row.isApiAttachment ? (
                              <span>{row.upload?.filename}</span>
                            ) : (
                              <td style={{ border: "none" }}>
                                <input
                                  type="file"
                                  id={`file-input-${index}`}
                                  key={row?.srNo}
                                  style={{ display: "none" }}
                                  onChange={(e) => handleFileChange(index, e.target.files[0])}
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
                                  {row.upload?.filename ? row.upload.filename : "Choose File"}
                                </label>
                              </td>
                            ),
                            action: row.isApiAttachment ? (
                              <span style={{ color: "#aaa" }}>—</span>
                            ) : (
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveDocumentRow(index)}
                                disabled={documentRows.length === 1}
                              >
                                Remove
                              </button>
                            ),
                            view: row.upload?.url ? (
                              <a
                                // href={row.upload.url}
                                href={
                                  row.upload?.url
                                    ? row.upload.url
                                    : `${baseURL}debit_notes/${id}/download?token=${token}&blob_id=${row.upload?.blob_id}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                download={row.upload.filename}

                              >
                                <DownloadIcon />
                              </a>
                            ) : null,
                          }))}
                          isAccordion={false}
                        />
                      </div>
                    </div>

                  </section>
                </div>
                <div className="row w-100">
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
                    <button className="purple-btn1 w-100" onClick={() => navigate(`/debit-note-list?token=${token}`)}>Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100 mb-5">
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
                            {(debitNoteData?.status_logs || [])
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
                        {debitNoteData?.status_logs?.length > 10 && (
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
                    {/* <div className="mx-0">
                      <Table columns={auditLogColumns} data={auditLogData} />
                    </div> */}
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
                {(debitNoteData?.status_logs || []).map((log, index) => (
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
  )
}

export default DebitNoteDetails