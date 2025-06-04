import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
const MiscellaneousBillCreate = () => {
  const navigate = useNavigate();
  const [showRows, setShowRows] = useState(false);
  const [taxesRowDetails, settaxesRowDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const taxesRowDropdown = () => {
    settaxesRowDetails(!taxesRowDetails);
  };

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);



  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");


  // tax table functionality

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedSite(null);
    setSites(
      value?.sites?.map((site) => ({
        value: site.id,
        label: site.name,
      })) || []
    );
  };

  const handleSiteChange = (value) => {
    setSelectedSite(value);
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects(
      selectedOption?.projects?.map((project) => ({
        value: project.id,
        label: project.name,
        sites: project.pms_sites,
      })) || []
    );
    setSites([]);
  };

  const fetchProjects = async (companyId) => {
    try {
      const response = await axios.get(
        `${baseURL}projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}`
      );
      setProjects(
        response.data.projects.map((project) => ({
          value: project.id,
          label: project.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSites = async (projectId) => {
    try {
      const response = await axios.get(
        `${baseURL}sites.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[project_id_eq]=${projectId}`
      );
      setSites(
        response.data.sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  useEffect(() => {
    if (selectedProject?.value) {
      fetchSites(selectedProject.value);
    }
  }, [selectedProject]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      const formattedCompanies = response.data.companies.map((company) => ({
        value: company.id,
        label: company.company_name,
        projects: company.projects,
      }));
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany?.value) {
      fetchProjects(selectedCompany.value);
    }
  }, [selectedCompany]);

  const getShowingEntriesText = () => {
    if (!pagination.total_count) return "No entries found";

    const start = (pagination.current_page - 1) * pagination.per_page + 1;
    const end = Math.min(
      start + pagination.per_page - 1,
      pagination.total_count
    );

    return `Showing ${start} to ${end} of ${pagination.total_count} entries`;
  };

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

  const [rows, setRows] = useState([
    { id: 1, type: "Handling Charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 2, resource_type: "TaxCharge" },
    { id: 2, type: "Other charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 4, resource_type: "TaxCharge" },
    { id: 3, type: "Freight", percentage: "", inclusive: false, amount: ' ', isEditable: false, addition: true, resource_id: 5, resource_type: "TaxCharge" },
  ]);
  const [taxTypes, setTaxTypes] = useState([]); // State to store tax types

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

  ];

  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [comment, setComment] = useState("");
  //   console.log("status:", status)
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

  const [remark2, setRemark2] = useState("");
  // Step 3: Handle remark change
  const handleRemarkChange2 = (e) => {
    setRemark2(e.target.value);
  };
  //   console.log("remark:", remark2)
  const [creditNoteDate, setCreditNoteDate] = useState(""); // State to store the date
  const [creditNoteAmount, setCreditNoteAmount] = useState(null); // State to store the amount
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}miscellaneous_bills/suppliers_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const payload = {

    miscellaneous_bill: {
      company_id: selectedCompany?.value || "",
      site_id: selectedSite?.value || "",
      project_id: selectedProject?.value || "",
      //   purchase_order_id: selectedPO?.id || "",
      bill_no: billNumber || "",
      bill_date: billDate || "",
      amount: creditNoteAmount || 0,
      remark: remark2 || "",
      status: status || "draft",
      // created_by_id: 1,
      pms_supplier_id:selectedSupplier?.id || "",
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
      attachments: documentRows.map((row) => ({
        filename: row.upload?.filename || "",
        content: row.upload?.content || "",
        content_type: row.upload?.content_type || "",
      })),
    }

  };

  console.log("payload:", payload)
  // console.log("addition tax rows:", rows)

  const handleSubmit = async () => {
    setLoading2(true)
    const payload = {
 miscellaneous_bill: {
      company_id: selectedCompany?.value || "",
      site_id: selectedSite?.value || "",
      project_id: selectedProject?.value || "",
      //   purchase_order_id: selectedPO?.id || "",
      bill_no: billNumber || "",
      bill_date: billDate || "",
      amount: creditNoteAmount || 0,
      remark: remark2 || "",
      status: status || "draft",
      // created_by_id: 1,
      pms_supplier_id:selectedSupplier?.id || "",
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
      attachments: documentRows.map((row) => ({
        filename: row.upload?.filename || "",
        content: row.upload?.content || "",
        content_type: row.upload?.content_type || "",
      })),
    }
    };

    try {
      const response = await axios.post(
        `${baseURL}miscellaneous_bills.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );
      console.log("Response:", response.data);
      if (response.status === 201) {
        alert("Miscellaneous Bill submitted successfully!");
        setLoading2(false)
        navigate("/miscellaneous-bill-list"); // Navigate to the list page
      }
    } catch (error) {
      console.error("Error submitting Miscellaneous Bill:", error);
      setLoading2(false)
      alert("Failed to submit Miscellaneous Bill. Please try again.");
    } finally {
      setLoading2(false)
    }
  };
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section ms-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Miscellaneous Bill </a>
          <h5 className="mt-3">Miscellaneous Bill </h5>
          <div className="row container-fluid my-4 align-items-center">
            <div className="col-md-12 ">
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
                    <div className="row">
                      {/* form-select EXAMPLE */}
                      <div
                        className="card card-default"
                        id="mor-material-details"
                      >
                        <div className="card-body mt-0">
                          {/* <div className=" d-flex justify-content-end">
                            <a href="#" className="text-decoration-underline">
                              Existing Allocated PO &amp; Advance
                            </a>
                          </div> */}
                          <div className="row mt-2">
                            <div className="col-md-4 ">
                              <div className="form-group">
                                <label>
                                  Company <span>*</span>
                                </label>
                                <SingleSelector
                                  options={companies}
                                  value={selectedCompany}
                                  onChange={handleCompanyChange}
                                  placeholder="Select Company"
                                />
                              </div>
                            </div>
                            <div className="col-md-4  ">
                              <div className="form-group">
                                <label>
                                  Project <span>*</span>
                                </label>
                                <SingleSelector
                                  options={projects}
                                  value={selectedProject}
                                  onChange={handleProjectChange}
                                  placeholder="Select Project"
                                  isDisabled={!selectedCompany}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 ">
                              <div className="form-group">
                                <label>
                                  Sub-Project <span>*</span>
                                </label>

                                <SingleSelector
                                  options={sites}
                                  onChange={handleSiteChange}
                                  value={selectedSite}
                                  placeholder={`Select Sub-Project`} // Dynamic placeholder
                                  isDisabled={!selectedCompany}
                                />
                              </div>
                            </div>
                            {/* <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Credit Note Number</label>
                                <input
                                  disabled
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                />
                              </div>
                            </div> */}


                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Bill Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={billNumber}
                                  onChange={e => setBillNumber(e.target.value)}
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>

                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Bill Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="date"
                                    value={billDate}
                                    onChange={e => setBillDate(e.target.value)}

                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Bill Amount</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  value={creditNoteAmount} // Bind to state
                                  onChange={(e) => setCreditNoteAmount(Number(e.target.value) || 0)} // Update state on change
                                />
                              </div>
                            </div>

                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Created On</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text"
                                    value={new Date().toLocaleDateString("en-GB")} // Format: DD/MM/YYYY
                                    disabled // Makes the input field non-editable
                                  />

                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Supplier Name</label>

                                <SingleSelector
                                  options={suppliers.map(s => ({
                                    label: s.organization_name,
                                    value: s.id,
                                    gstin: s.gstin,
                                    pan_number: s.pan_number,
                                  }))}
                                  value={
                                    selectedSupplier
                                      ? {
                                        label: selectedSupplier.organization_name,
                                        value: selectedSupplier.id,
                                        gstin: selectedSupplier.gstin,
                                        pan_number: selectedSupplier.pan_number,
                                      }
                                      : null
                                  }
                                  onChange={option => {
                                    const supplier = suppliers.find(s => s.id === option.value);
                                    setSelectedSupplier(supplier || null);
                                  }}
                                  placeholder="Select Supplier"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>GSTIN Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={selectedSupplier?.gstin || ""}
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
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
                                  value={selectedSupplier?.pan_number || ""}
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  disabled
                                />
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
                                  value={remark2}
                                  onChange={handleRemarkChange2}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-3 me-2">
                            <h5 className=" ">Tax Details</h5>
                          </div>

                          <div className="tbl-container  mt-3">
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
                                  <td onClick={addRow}>
                                    <svg
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
                                            const percentage = parseFloat(e.target.value) || 0;
                                            const amount = ((creditNoteAmount || 0) * percentage) / 100;

                                            setRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, percentage: e.target.value, amount: amount.toFixed(2) }
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
                                          const percentage = parseFloat(e.target.value) || 0;
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
                                        {console.log("percent deduction", row.percentage)}
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
                          <div>
                            <div className="d-flex justify-content-between align-items-end  mt-5">
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
                              isAccordion={false}
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
                        value={statusOptions.find((option) => option.value === status)} // Set "Draft" as the selected status
                        placeholder="Select Status"
                        isClearable={false}
                        // isDisabled={true} // Disable the selector
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-end w-100">
                  {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
                {/* <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
                    <h5>Audit Log</h5>
                    <div className="mx-0">
                      <Table columns={auditLogColumns} data={auditLogData} />
                    </div>
                  </div>
                </div> */}
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
      {loading2 && (
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
          <p>Submitting...</p>
        </div>
      )}


    </>
  );
};

export default MiscellaneousBillCreate;
