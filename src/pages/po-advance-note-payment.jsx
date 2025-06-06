import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import Select from "../components/base/Select/Select";

const PoAdvanceNotePayment = () => {
  const [activeTab, setActiveTab] = useState("pills-home");
  const [showRows, setShowRows] = useState(false); // Controls visibility of dynamic rows
  const [makeCashModal, setmakeCashModal] = useState(false);
  const [makeBankModal, setmakeBankModal] = useState(false);
  const [makeAdjustModal, setmakeAdjustModal] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);

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
      tableRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Toggle visibility of rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  const [pageSize, setPageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedPOs, setSelectedPOs] = useState([]);

  const openCashModal = () => setmakeCashModal(true);
  const closeCashModal = () => setmakeCashModal(false);

  const openBankModal = () => setmakeBankModal(true);
  const closeBankModal = () => setmakeBankModal(false);

  const openAdjustModal = () => setmakeAdjustModal(true);
  const closeAdjustModal = () => setmakeAdjustModal(false);

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
  // tax table functionality

  // tax table functionality

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

  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const [advanceNote, setAdvanceNote] = useState(null); // State to store API data

  // Fetch data from API
  useEffect(() => {
    const fetchAdvanceNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}advance_notes`
        );
        const data = response.data.advance_notes[0]; // Assuming you want the first item
        setAdvanceNote(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvanceNotes();
  }, []);

  const [rows, setRows] = useState([
    {
      id: 1,
      type: "Handling Charges",
      percentage: "Select Charges",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 2,
      type: "Other charges",
      percentage: "Select Charges",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 3,
      type: "Freight",
      percentage: "Select Charges",
      inclusive: false,
      amount: " ",
      isEditable: false,
      addition: true,
    },
  ]);
  const [taxTypes, setTaxTypes] = useState([]); // State to store tax types
  const [creditNoteAmount, setCreditNoteAmount] = useState(null);

  // Fetch tax types from API
  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setTaxTypes(response.data.taxes); // Assuming the API returns an array of tax types
      } catch (error) {
        console.error("Error fetching tax types:", error);
      }
    };

    fetchTaxTypes();
  }, []);
  // console.log("tax types:", taxTypes)
  const addRow = () => {
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
          `${baseURL}rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
  const [remarks, setRemarks] = useState("");
  const [comments, setComments] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async () => {
    const attachments = documentRows
      .filter((row) => row.upload) // Ensure only rows with uploaded files are included
      .map((row) => ({
        filename: row.upload.filename,
        content: row.upload.content,
        content_type: row.upload.content_type,
      }));

    const payload = {
      status_log: {
        // status: "Approved", // Replace with dynamic status if needed
        // remarks: "Status updated to Approved", // Replace with dynamic remarks if needed
        // comments: "All checks passed", // Replace with dynamic comments if needed
        // admin_comment: "Approved by admin", // Replace with dynamic admin comment if needed
        status, // Dynamically pass the selected status
        remarks, // Dynamically pass the entered remarks
        comments, // Dynamically pass the entered comments
        admin_comment: "adminComment", // Dynamically pass the admin comment if needed
      },
      attachments,
    };

    try {
      const response = await axios.patch(
        // "https://marathon.lockated.com/advance_notes/3/update_status",
        `${baseURL}advance_notes/${advanceNote.id}/update_status`, // Use the dynamic ID here

        payload
      );
      console.log("Status updated successfully:", response.data);
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <>
      <div
        className="main-concent"
        // style={{
        //   overflowX: "hidden",
        //   width: "100%",
        // }}
      >
        <div
          className="website-content "
          // style={{
          //   maxWidth: "100%",
          //   overflowX: "hidden",
          // }}
        >
          <div className="module-data-section ms-2">
            <a href="">Home &gt; Billing &amp; Accounts &gt; Advance </a>
            <h5 className="mt-3">Advance </h5>
            <div className="row my-4 align-items-center container-fluid">
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
                      <div className="mor-tabs mt-4">
                        <ul
                          className="nav nav-pills mb-3 justify-content-center"
                          id="pills-tab"
                          role="tablist"
                          style={{ boxShadow: "none", backgroundColor: "#fff" }}
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-home" ? "active" : ""
                              }`}
                              id="pills-home-tab"
                              onClick={() => handleTabChange("pills-home")}
                              role="tab"
                              aria-controls="pills-home"
                              aria-selected={activeTab === "pills-home"}
                            >
                              MOR
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-profile" ? "active" : ""
                              }`}
                              id="pills-profile-tab"
                              onClick={() => handleTabChange("pills-profile")}
                              role="tab"
                              aria-controls="pills-profile"
                              aria-selected={activeTab === "pills-profile"}
                            >
                              MOR Approval
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-contact" ? "active" : ""
                              }`}
                              id="pills-contact-tab"
                              onClick={() => handleTabChange("pills-contact")}
                              role="tab"
                              aria-controls="pills-contact"
                              aria-selected={activeTab === "pills-contact"}
                            >
                              PO
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-advance" ? "active" : ""
                              }`}
                              id="pills-advance-tab"
                              onClick={() => handleTabChange("pills-advance")}
                              role="tab"
                              aria-controls="pills-advance"
                              aria-selected={activeTab === "pills-advance"}
                            >
                              Advance
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-material" ? "active" : ""
                              }`}
                              id="pills-material-tab"
                              onClick={() => handleTabChange("pills-material")}
                              role="tab"
                              aria-controls="pills-material"
                              aria-selected={activeTab === "pills-material"}
                            >
                              Material Received
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-billing" ? "active" : ""
                              }`}
                              id="pills-billing-tab"
                              onClick={() => handleTabChange("pills-billing")}
                              role="tab"
                              aria-controls="pills-billing"
                              aria-selected={activeTab === "pills-billing"}
                            >
                              Billing
                            </button>
                          </li>
                        </ul>
                      </div>

                      <div className="row justify-content-center my-4">
                        <div className="col-md-10">
                          <div className="progress-steps">
                            <div className="top">
                              <div className="progress">
                                <span
                                  style={{
                                    width: `${
                                      ((currentStep - 1) / (totalSteps - 1)) *
                                      100
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

                      <div className="row">
                        {/* form-select EXAMPLE */}
                        <div className="card">
                          <div className="card-body mt-0">
                            {/* <div className=" d-flex justify-content-end">
                              <a href="#" className="text-decoration-underline">
                                Existing Allocated PO &amp; Advance
                              </a>
                            </div> */}
                            <div className="row">
                              <div className="col-md-4 ">
                                <div className="form-group">
                                  <label>
                                    Company <span>*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={advanceNote?.company_name}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4  ">
                                <div className="form-group">
                                  <label>
                                    Project <span>*</span>
                                  </label>

                                  <input
                                    className="form-control"
                                    type="text"
                                    // value={advanceNote?.project_id || ""}
                                    value={advanceNote?.project_name || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>Advance Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                    value={advanceNote?.advance_number || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Certificate Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                    value={
                                      advanceNote?.certificate_number || ""
                                    }
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PO Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={advanceNote?.po_number || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              {/* <div className="col-md-1 pt-4">
                                <p
                                  className="mt-2 text-decoration-underline cursor-pointer"
                                  onClick={openSelectPOModal}
                                >
                                  Select
                                </p>
                              </div> */}
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PO Date</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="po_date"
                                    value={advanceNote?.po_date || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PO Value</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="po_value"
                                    value={advanceNote?.po_value || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Performa Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.performa_number || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Performa Amount</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.performa_amount || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Invoice Date</label>
                                  <div
                                    id="datepicker"
                                    className="input-group date"
                                    data-date-format="mm-dd-yyyy"
                                  >
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={advanceNote?.invoice_date || ""}
                                      disabled
                                    />
                                    {/* <span className="input-group-addon">
                                      <i
                                        className="fa-solid fa-calendar-days"
                                        style={{ color: "#8B0203" }}
                                      />{" "}
                                    </span> */}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Supplier Name</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.supplier_name || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                              {/* <div
                                className="col-md-1 pt-4"
                                data-bs-toggle="modal"
                                data-bs-target="#selectModal"
                              >
                                <p className="mt-2 text-decoration-underline">
                                  View Details
                                </p>
                              </div> */}
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>GSTIN Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="gstin_number"
                                    value={advanceNote?.gstin || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PAN Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="pan_number"
                                    value={advanceNote?.pan_no || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Advance %</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={
                                      advanceNote?.advance_percentage || ""
                                    }
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Advance Amount</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.advance_amount || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Net Payable</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.net_payable || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4  mt-2">
                                <div className="form-group">
                                  <label>Mode of Payment</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={advanceNote?.payment_mode || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Favoring / Payee</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                    value={advanceNote?.payee_name || ""}
                                    readOnly
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Expected Payment Date</label>
                                  <div
                                    id="datepicker"
                                    className="input-group date"
                                    data-date-format="mm-dd-yyyy"
                                  >
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={
                                        advanceNote?.expected_payment_date || ""
                                      }
                                      readOnly
                                      disabled
                                    />
                                    {/* <span className="input-group-addon">
                                      <i
                                        className="fa-solid fa-calendar-days"
                                        style={{ color: "#8B0203" }}
                                      />{" "}
                                    </span> */}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Remark</label>
                                  <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter ..."
                                    defaultValue={""}
                                    value={advanceNote?.remark || ""}
                                    readOnly
                                    disabled
                                  />
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
                                  {/* Static Rows for Addition Tax */}
                                  <tr>
                                    <th className="text-start">
                                      Total Base Cost
                                    </th>
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start">
                                      {" "}
                                      {creditNoteAmount || ""}
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
                                    <td onClick={addRow}>
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
                                              [
                                                "Handling Charges",
                                                "Other charges",
                                                "Freight",
                                              ].includes(type.name) ||
                                              // Disable "IGST" if "SGST" or "CGST" is selected in any row
                                              (type.name === "IGST" &&
                                                rows.some(
                                                  (r) =>
                                                    ["SGST", "CGST"].includes(
                                                      r.type
                                                    ) && r.id !== row.id
                                                )) ||
                                              // Disable "SGST" and "CGST" if "IGST" is selected in any row
                                              (["SGST", "CGST"].includes(
                                                type.name
                                              ) &&
                                                rows.some(
                                                  (r) =>
                                                    r.type === "IGST" &&
                                                    r.id !== row.id
                                                )),
                                          }))}
                                          value={{
                                            value: row.type,
                                            label: row.type,
                                          }}
                                          // onChange={(selectedOption) =>
                                          //   setRows((prevRows) =>
                                          //     prevRows.map((r) =>
                                          //       r.id === row.id ? { ...r,
                                          //         type: selectedOption.value,
                                          //         resource_id: selectedOption.value, // Set the selected tax ID
                                          //         resource_type: taxTypes.find((t) => t.id === selectedOption.value)?.type || "", // Set the tax type
                                          //        } : r
                                          //     )
                                          //   )
                                          // }

                                          // onChange={(selectedOption) =>
                                          //   setRows((prevRows) =>
                                          //     prevRows.map((r) =>
                                          //       r.id === row.id
                                          //         ? {
                                          //             ...r,
                                          //             type: selectedOption?.value || "", // Handle null or undefined
                                          //             resource_id: selectedOption?.value || null, // Handle null or undefined
                                          //             resource_type: taxTypes.find((t) => t.id === selectedOption?.value)?.type || "", // Handle null or undefined
                                          //           }
                                          //         : r
                                          //     )
                                          //   )
                                          // }

                                          onChange={(selectedOption) => {
                                            console.log(
                                              "Selected Option:",
                                              selectedOption
                                            ); // Log the selected option
                                            setRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      type:
                                                        selectedOption?.value ||
                                                        "", // Handle null or undefined
                                                      resource_id:
                                                        selectedOption?.id ||
                                                        null, // Handle null or undefined
                                                      resource_type:
                                                        selectedOption?.tax ||
                                                        "", // Handle null or undefined
                                                    }
                                                  : r
                                              )
                                            );
                                            console.log("Updated Rows:", rows); // Log the updated rows
                                          }}
                                          placeholder="Select Type"
                                          isDisabled={!row.isEditable} // Disable if not editable
                                        />
                                      </td>
                                      <td className="text-start">
                                        {row.isEditable ? (
                                          //                             <select
                                          //                               className="form-control form-select"
                                          //                               value={row.percentage}
                                          //                               onChange={(e) =>
                                          //                                 const percentage = parseFloat(e.target.value) || 0;
                                          // const amount = ((selectedPO?.total_value || 0) * percentage) / 100;
                                          //                                 setRows((prevRows) =>
                                          //                                   prevRows.map((r) =>
                                          //                                     r.id === row.id ? { ...r, percentage: e.target.value } : r
                                          //                                   )
                                          //                                 )
                                          //                               }
                                          //                             >

                                          <select
                                            className="form-control form-select"
                                            value={row.percentage}
                                            onChange={(e) => {
                                              const percentage =
                                                parseFloat(e.target.value) || 0;
                                              const amount =
                                                ((creditNoteAmount || 0) *
                                                  percentage) /
                                                100;

                                              setRows((prevRows) =>
                                                prevRows.map((r) =>
                                                  r.id === row.id
                                                    ? {
                                                        ...r,
                                                        percentage:
                                                          e.target.value,
                                                        amount:
                                                          amount.toFixed(2),
                                                      }
                                                    : r
                                                )
                                              );
                                            }}
                                          >
                                            <option value="">Select Tax</option>
                                            <option value="5%">5%</option>
                                            <option value="12%">12%</option>
                                            <option value="18%">18%</option>
                                            <option value="28%">28%</option>
                                          </select>
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
                                                  ? {
                                                      ...r,
                                                      inclusive:
                                                        e.target.checked,
                                                    }
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
                                                  ? {
                                                      ...r,
                                                      amount:
                                                        parseFloat(
                                                          e.target.value
                                                        ) || 0,
                                                    }
                                                  : r
                                              )
                                            )
                                          }
                                        />
                                      </td>
                                      <td
                                        className="text-start"
                                        onClick={() => deleteRow(row.id)}
                                        style={{
                                          cursor: "pointer",
                                          color: "black",
                                        }}
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

                                  <tr>
                                    <th className="text-start">
                                      Sub Total A (Addition)
                                    </th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start">
                                      {calculateSubTotal()}
                                    </td>
                                    <td />
                                  </tr>
                                  <tr>
                                    <th className="text-start">Gross Amount</th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start">
                                      {" "}
                                      {(
                                        parseFloat(calculateSubTotal()) +
                                        (parseFloat(creditNoteAmount) || 0)
                                      ).toFixed(2)}
                                    </td>
                                    <td />
                                  </tr>
                                  {/* Deduction Tax Section */}
                                  <tr>
                                    <th className="text-start">
                                      Deduction Tax
                                    </th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start" />
                                    <td onClick={addDeductionRow}>
                                      <svg
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
                                      </svg>
                                    </td>
                                  </tr>
                                  {/* Dynamic Rows for Deduction Tax */}
                                  {deductionRows.map((row) => (
                                    <tr key={row.id}>
                                      <td className="text-start">
                                        <SingleSelector
                                          options={deductionTypes.map(
                                            (type) => ({
                                              value: type.name,
                                              label: type.name,
                                              id: type.id,
                                              tax: type.type,
                                            })
                                          )}
                                          value={{
                                            value: row.type,
                                            label: row.type,
                                          }}
                                          onChange={(selectedOption) =>
                                            setDeductionRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      type:
                                                        selectedOption?.value ||
                                                        "", // Handle null or undefined
                                                      resource_id:
                                                        selectedOption?.id ||
                                                        null, // Handle null or undefined
                                                      resource_type:
                                                        selectedOption?.tax ||
                                                        "", // Handle null or undefined
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
                                                                   value={row.percentage}
                                                                   onChange={(e) =>
                                                                     
                                                                     setDeductionRows((prevRows) =>
                                                                       prevRows.map((r) =>
                                                                         r.id === row.id ? { ...r, percentage: e.target.value } : r
                                                                       )
                                                                     )
                                                                   }
                                                                 > */}
                                        <select
                                          className="form-control form-select"
                                          value={row.percentage}
                                          onChange={(e) => {
                                            const percentage =
                                              parseFloat(e.target.value) || 0;
                                            const amount =
                                              ((creditNoteAmount || 0) *
                                                percentage) /
                                              100;

                                            setDeductionRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      percentage:
                                                        e.target.value,
                                                      amount: amount.toFixed(2),
                                                    }
                                                  : r
                                              )
                                            );
                                          }}
                                        >
                                          {console.log(
                                            "percent deduction",
                                            row.percentage
                                          )}
                                          <option value="">Select Tax</option>
                                          <option value="1%">1%</option>
                                          <option value="2%">2%</option>
                                          <option value="10%">10%</option>
                                          {/* <option value="28%">28%</option> */}
                                        </select>
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={row.inclusive}
                                          onChange={(e) =>
                                            setDeductionRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      inclusive:
                                                        e.target.checked,
                                                    }
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
                                                  ? {
                                                      ...r,
                                                      amount:
                                                        parseFloat(
                                                          e.target.value
                                                        ) || 0,
                                                    }
                                                  : r
                                              )
                                            )
                                          }
                                        />
                                      </td>
                                      <td
                                        className="text-start"
                                        onClick={() =>
                                          deleteDeductionRow(row.id)
                                        }
                                        style={{
                                          cursor: "pointer",
                                          color: "black",
                                        }}
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
                                  {/* Static Rows */}
                                  <tr>
                                    <th className="text-start">
                                      Sub Total B (Deductions)
                                    </th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start">
                                      {calculateDeductionSubTotal()}
                                    </td>
                                    <td />
                                  </tr>
                                  <tr>
                                    <th className="text-start">
                                      Payable Amount
                                    </th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start">
                                      {calculatePayableAmount()}
                                    </td>
                                    <td />
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {/* <div className="d-flex justify-content-between mt-3 me-2">
                              <h5 className=" ">Advance Amount Bifurcation</h5>
                            </div>
                            <div className="tbl-container mx-3 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-start">Sub-Project</th>
                                    <th className="text-start">MOR Number</th>
                                    <th className="text-start">
                                      Advance Amount
                                    </th>
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
                            <div className="d-flex justify-content-between mt-3 me-2">
                              <h5 className=" ">Payment Details</h5>
                              <div className="card-tools d-flex pe-1">
                                <div className="d-flex">
                                  <div className="px-2 pt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-check2"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                    </svg>{" "}
                                  </div>
                                  <div>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="CIN Verification"
                                      disabled=""
                                      fdprocessedid="qv9ju9"
                                    />
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div className="px-2 pt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-check2"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                    </svg>{" "}
                                  </div>
                                  <div>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="CIN Details"
                                      disabled=""
                                      fdprocessedid="qv9ju9"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="tbl-container mx-3 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-start">
                                      Mode of Payment
                                    </th>
                                    <th className="text-start">
                                      Instrument Date
                                    </th>
                                    <th className="text-start">
                                      Instrument No.
                                    </th>
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
                            <div className="row mt-2 justify-content-center">
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makecasheModal"
                                onClick={openCashModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="u33pye"
                                >
                                  Make Cash Payment
                                </button>
                              </div>
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makebankModal"
                                onClick={openBankModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="af5l5g"
                                >
                                  Make Bank Payment
                                </button>
                              </div>
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makeadjustmentModal"
                                onClick={openAdjustModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="af5l5g"
                                >
                                  Make Adjustment Entry
                                </button>
                              </div>
                            </div>
                            {/* <div className="row mt-4 justify-content-start align-items-center">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>Attchment</label>
                                  <input
                                    className="form-control"
                                    type="file"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-8">
                                <div className="tbl-container me-2 mt-3">
                                  <table className="w-100">
                                    <thead className="w-100">
                                      <tr>
                                        <th className="main2-th">
                                          Document Name
                                        </th>
                                        <th className="main2-th">
                                          Upload Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th>MTO Copy.pdf</th>
                                        <td>03-03-2024</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div> */}

                            <div>
                              <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                                <h5 className="mt-3">
                                  Document Attachments{" "}
                                  <span
                                    style={{ color: "red", fontSize: "16px" }}
                                  >
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
                                          handleFileChange(
                                            index,
                                            e.target.files[0]
                                          )
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
                                      onClick={() =>
                                        handleRemoveDocumentRow(index)
                                      }
                                      disabled={documentRows.length === 1}
                                    >
                                      Remove
                                    </button>
                                  ),
                                }))}
                              />
                            </div>
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
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
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
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
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
                          value={status} // Bind the value to the status state
                          onChange={(e) => setStatus(e.target.value)} // Update the status state on change
                        >
                          {/* {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))} */}
                          <option value="">Select Status</option>
                          <option value="Approved">Approved</option>
                          <option value="Draft">Draft</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Verified">Verified</option>
                          <option value="Proceed">Proceed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2 justify-content-end w-100">
                    <div className="col-md-2">
                      <button className="purple-btn2 w-100">Print</button>
                    </div>
                    <div className="col-md-2">
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
                  onClick={() =>
                    handleDeleteRow(tableRows[tableRows.length - 1]?.id)
                  }
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

      {/* Select PO Modal */}
    </>
  );
};

export default PoAdvanceNotePayment;
