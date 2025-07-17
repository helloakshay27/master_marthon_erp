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
  const [attachOneModal, setattachOneModal] = useState(false);
  const [attachTwoModal, setattachTwoModal] = useState(false);
  const [attachThreeModal, setattachThreeModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState(null);

  const openAttachTwoModal = () => setattachTwoModal(true);
  const closeAttachTwoModal = () => setattachTwoModal(false);

  const openAttachThreeModal = () => setattachThreeModal(true);
  const closeAttachThreeModal = () => setattachThreeModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);

  // Document attachment state and handlers for advanced modal
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });
  const [documents, setDocuments] = useState([]); // If you want to keep a list
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

  const [editableAdvanceNote, setEditableAdvanceNote] = useState({
    performa_number: "",
    performa_amount: "",
    supplier_name: "",
    gstn_number: "",
    pan_no: "",
    advance_percentage: "",
    advance_amount: "",
    net_payable: "",
    mode_of_payment: "",
    favoring_payee: "",
    expected_payment_date: "",
    remark: "",
  });

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

        const formattedDocuments = data.attachments.map((att) => ({
          document_type: att.relation || "", // or a custom label if needed
          attachments: [att],
          uploadDate: new Date(att.created_at)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-"),

          blob_id: att.blob_id || null,
          filename: att.filename || "-",
        }));
        setDocuments(formattedDocuments); // ✅ Set to your documents array

         setCreditNoteData(data);
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


  useEffect(() => {
    if (advanceNote) {
      setEditableAdvanceNote({
        performa_number: advanceNote.performa_number || "",
        performa_amount: advanceNote.performa_amount || "",
        supplier_name: advanceNote.supplier_name || "",
        gstn_number: advanceNote.gstn_number || "",
        pan_no: advanceNote.pan_no || "",
        advance_percentage: advanceNote.advance_percentage || "",
        advance_amount: advanceNote.advance_amount || "",
        net_payable: advanceNote.net_payable || "",
        mode_of_payment: advanceNote.mode_of_payment || "",
        favoring_payee: advanceNote.favoring_payee || "",
        expected_payment_date: advanceNote.expected_payment_date || "",
        remark: advanceNote.remark || "",
      });
    }
  }, [advanceNote]);

  // const handleInputChange = (field, value) => {
  //   setEditableAdvanceNote((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   if (field === "advance_amount") {
  //     setCreditNoteAmount(Number(value) || 0); // Update creditNoteAmount from edited advance_amount
  //   }

    
  // };

  const handleInputChange = (field, value) => {
  setEditableAdvanceNote((prev) => {
    const updated = { ...prev, [field]: value };

    // When advance_percentage changes, calculate advance_amount
    if (field === "advance_percentage") {
      const poValue = parseFloat(advanceNote?.po_value) || 0;
      const percentage = parseFloat(value) || 0;
      updated.advance_amount = ((poValue * percentage) / 100).toFixed(2);
      setCreditNoteAmount(Number(updated.advance_amount));
    }

    return updated;
  });

  // Still update creditNoteAmount when advance_amount changes
  // if (field === "advance_amount") {
  //   setCreditNoteAmount(Number(value) || 0);
  // }
};

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
      //  attachments: attachments.length > 0 ? attachments : null,
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
      },


      performa_number: editableAdvanceNote.performa_number || null,
      performa_amount: Number(editableAdvanceNote.performa_amount) || null,
      advance_percentage: Number(editableAdvanceNote.advance_percentage) || null,
      advance_amount: Number(editableAdvanceNote.advance_amount) || null,
      net_payable: Number(editableAdvanceNote.net_payable) || null,
      payment_mode: editableAdvanceNote.mode_of_payment || null,
      payee_name: editableAdvanceNote.favoring_payee || null,
      expected_payment_date: editableAdvanceNote.expected_payment_date || null,
      remark: editableAdvanceNote.remark || "",
      gstin: editableAdvanceNote.gstn_number || null,
      pan_no: editableAdvanceNote.pan_no || null,

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

    const attachments = (documents || [])
      .map((doc) =>
        doc.attachments && doc.attachments[0]
          ? {
            filename: doc.attachments[0].filename || null,
            content: doc.attachments[0].content || null,
            content_type: doc.attachments[0].content_type || null,
            document_name: doc.document_type || null,
          }
          : null
      )
      .filter(Boolean);

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
        performa_number: editableAdvanceNote.performa_number || null,
        performa_amount: Number(editableAdvanceNote.performa_amount) || null,
        advance_percentage: Number(editableAdvanceNote.advance_percentage) || null,
        advance_amount: Number(editableAdvanceNote.advance_amount) || null,
        net_payable: Number(editableAdvanceNote.net_payable) || null,
        payment_mode: editableAdvanceNote.mode_of_payment || null,
        payee_name: editableAdvanceNote.favoring_payee || null,
        expected_payment_date: editableAdvanceNote.expected_payment_date || null,
        remark: editableAdvanceNote.remark || "",
        gstin: editableAdvanceNote.gstn_number || null,
        pan_no: editableAdvanceNote.pan_no || null,
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

  const paymentModeOptions = [
    { value: "Bank Advice", label: "Bank Advice" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque Local", label: "Cheque Local" },
    { value: "Cheque OutStation", label: "Cheque OutStation" },
    { value: "CreditCard", label: "CreditCard" },
    { value: "Demand Draft", label: "Demand Draft" },
    { value: "Direct Remittance", label: "Direct Remittance" },
    { value: "Interest Waive off", label: "Interest Waive off" },
    {
      value: "Online Payment from Portal/App",
      label: "Online Payment from Portal/App",
    },
    { value: "Others", label: "Others" },
    { value: "TDS", label: "TDS" },
  ];

  // Document attachment state and handlers for advanced modal




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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
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
                                  {/* {advanceNote?.po_date ? formatDateDDMMYYYY(advanceNote.po_date) : ""} */}
                                  {advanceNote?.po_date
                                    ? new Date(advanceNote?.po_date)
                                      .toLocaleDateString("en-GB") // gives 13/06/2025
                                      .replace(/\//g, "-")         // replace / with -
                                    : "-"}
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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
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
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
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
                            </div> */}
                          </div>





                        </div>





                        <div className="row mt-4">
                          <div className="col-md-12 mt-2">
                            <div className="card p-3">
                              <div className="row mb-3">
                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Performa Number</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editableAdvanceNote.performa_number}
                                      onChange={(e) => handleInputChange("performa_number", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Performa Amount</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editableAdvanceNote.performa_amount || ""}
                                      onChange={(e) => handleInputChange("performa_amount", e.target.value)}
                                    />
                                  </div>
                                </div>
                                {/* <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>GSTN Number</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editableAdvanceNote.gstn_number || ""}
                                      onChange={(e) => handleInputChange("gstn_number", e.target.value)}
                                    />
                                  </div>
                                </div> */}
                                {/* <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>PAN Number</label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editableAdvanceNote.pan_no || ""}
                                      onChange={(e) => handleInputChange("pan_no", e.target.value)}
                                    />
                                  </div>
                                </div> */}

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Advance %</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editableAdvanceNote.advance_percentage || ""}
                                      onChange={(e) => handleInputChange("advance_percentage", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Advance Amount</label>

                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editableAdvanceNote.advance_amount || ""}
                                      onChange={(e) => handleInputChange("advance_amount", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Net Payable</label>

                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editableAdvanceNote.net_payable || ""}
                                      onChange={(e) => handleInputChange("net_payable", e.target.value)}
                                    />
                                  </div>
                                </div>


                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Mode of Payment</label>
                                    <SingleSelector
                                      options={paymentModeOptions}
                                      className="form-control form-select"
                                      value={
                                        paymentModeOptions.find(
                                          (opt) => opt.value === editableAdvanceNote.mode_of_payment
                                        ) || null
                                      }
                                      onChange={(selected) =>
                                        handleInputChange("mode_of_payment", selected ? selected.value : "")
                                      }
                                      placeholder="Select Payment Mode"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Favoring / Payee</label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editableAdvanceNote.favoring_payee || ""}
                                      onChange={(e) => handleInputChange("favoring_payee", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Expected Payment Date</label>

                                    <input
                                      type="date"
                                      className="form-control"
                                      value={editableAdvanceNote.expected_payment_date || ""}
                                      onChange={(e) => handleInputChange("expected_payment_date", e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group mb-0">
                                    <label>Remark</label>

                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      value={editableAdvanceNote.remark || ""}
                                      onChange={(e) => handleInputChange("remark", e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                        {/* tax details */}
                        {/* {console.log("tax table show not show :",advanceNote?.advance_payment_schedule?.with_tax)} */}

                        {/* {!advanceNote?.advance_payment_schedule?.with_tax && (
                          <> */}
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
                                      className="text-start text-decoration-underline"
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
                        <td>{idx + 1}</td>
                        <td>{doc.document_type}</td>
                        <td>{doc.attachments[0]?.filename || "-"}</td>
                        {/* <td className="text-start">
                                                          {doc.attachments[0]?.content_type || "-"}
                                                        </td> */}
                        <td className="text-start">
                          {doc.uploadDate || "-"}
                        </td>
                        <td>
                          {doc?.blob_id && (
                          <a
                            href={
                              // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                              `${baseURL}advance_notes/${id}/download?token=${token}&blob_id=${doc.blob_id}`
                              // attachment.url
                            }
                            target="_blank"
                            // rel="noopener noreferrer"
                            download={doc.filename}
                          >
                            <DownloadIcon />
                          </a>
                          )}
                          {console.log("document data:",documents)}
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
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn1 w-100" onClick={closeviewDocumentModal}>Close</button>
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

export default POAdvanceNoteDetails;
