import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom"; // Import useNavigate
const DebitNoteCreate = () => {
   const navigate = useNavigate();
  // const [showRows, setShowRows] = useState(false);
  // const [attachOneModal, setattachOneModal] = useState(false);
  // const [attachTwoModal, setattachTwoModal] = useState(false);
  // const [attachThreeModal, setattachThreeModal] = useState(false);
  // const [taxesRowDetails, settaxesRowDetails] = useState(false);

  // const taxesRowDropdown = () => {
  //   settaxesRowDetails(!taxesRowDetails);
  // };

  // const openAttachOneModal = () => setattachOneModal(true);
  // const closeAttachOneModal = () => setattachOneModal(false);

  // const openAttachTwoModal = () => setattachTwoModal(true);
  // const closeAttachTwoModal = () => setattachTwoModal(false);

  // const openAttachThreeModal = () => setattachThreeModal(true);
  // const closeAttachThreeModal = () => setattachThreeModal(false);

  // // tax table functionality

  // const [rows, setRows] = useState([
  //   {
  //     id: 1,
  //     type: "TDS 1",
  //     charges: "100",
  //     inclusive: false,
  //     amount: 50.0,
  //   },
  // ]);

  // // Toggle visibility of rows
  // const toggleRows = () => {
  //   setShowRows((prev) => !prev);
  // };

  // // Delete a specific row
  // const deleteRow = (id) => {
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  // };

  // // Calculate Sub Total (Addition)
  // const calculateSubTotal = () => {
  //   return rows.reduce((total, row) => total + row.amount, 0).toFixed(2); // Sum of all amounts
  // };
  // // tax table functionality

  //   // Function to handle tab change
  //   const handleTabChange = (tabId) => {
  //     setActiveTab(tabId);
  //   };

  //   const [currentStep, setCurrentStep] = useState(1);
  //   const totalSteps = 4;

  //   // Function to handle the next step
  //   const handleNext = () => {
  //     if (currentStep < totalSteps) {
  //       setCurrentStep(currentStep + 1);
  //     }
  //   };

  //   // Function to handle the previous step
  //   const handlePrev = () => {
  //     if (currentStep > 1) {
  //       setCurrentStep(currentStep - 1);
  //     }
  //   };

  const [showRows, setShowRows] = useState(false);
  const [attachOneModal, setattachOneModal] = useState(false);
  const [attachTwoModal, setattachTwoModal] = useState(false);
  const [attachThreeModal, setattachThreeModal] = useState(false);
  const [taxesRowDetails, settaxesRowDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);

  const taxesRowDropdown = () => {
    settaxesRowDetails(!taxesRowDetails);
  };

  const openAttachOneModal = () => setattachOneModal(true);
  const closeAttachOneModal = () => setattachOneModal(false);

  const openAttachTwoModal = () => setattachTwoModal(true);
  const closeAttachTwoModal = () => setattachTwoModal(false);

  const openAttachThreeModal = () => setattachThreeModal(true);
  const closeAttachThreeModal = () => setattachThreeModal(false);

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
  // tax table functionality

  // Function to handle tab change
  // const handleTabChange = (tabId) => {
  //   setActiveTab(tabId);
  // };

  // const [currentStep, setCurrentStep] = useState(1);
  // const totalSteps = 4;

  // // Function to handle the next step
  // const handleNext = () => {
  //   if (currentStep < totalSteps) {
  //     setCurrentStep(currentStep + 1);
  //   }
  // };

  // // Function to handle the previous step
  // const handlePrev = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };
  const [pageSize, setPageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedPOs, setSelectedPOs] = useState([]);
  const [poTypes, setPoTypes] = useState([
    { value: "", label: "All" },
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ]);

  // add row & delete row

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    poType: "",
    poNumber: "",
    selectedPOIds: [],
    projectId: "",
    siteId: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 1,
    total_count: 0,
    per_page: 5,
  });

  const openCashModal = () => setmakeCashModal(true);
  const closeCashModal = () => setmakeCashModal(false);

  const openBankModal = () => setmakeBankModal(true);
  const closeBankModal = () => setmakeBankModal(false);

  const openAdjustModal = () => setmakeAdjustModal(true);
  const closeAdjustModal = () => setmakeAdjustModal(false);

  const openSelectPOModal = () => {
    setselectPOModal(true);
  };

  const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

  const handlePOSelect = (po) => {
    setSelectedPO(po);
    setFilterParams((prev) => ({
      ...prev,
      selectedPOIds: [po.id],
    }));

    // Update form fields with selected PO details
    if (po) {
      // Update PO Date
      const poDateInput = document.querySelector('input[name="po_date"]');
      if (poDateInput) {
        poDateInput.value = po.po_date;
      }

      // Update PO Value
      const poValueInput = document.querySelector('input[name="po_value"]');
      if (poValueInput) {
        poValueInput.value = po.total_value;
      }

      // Update GSTIN Number
      const gstinInput = document.querySelector('input[name="gstin_number"]');
      if (gstinInput) {
        gstinInput.value = po.gstin || "";
      }

      // Update PAN Number
      const panInput = document.querySelector('input[name="pan_number"]');
      if (panInput) {
        panInput.value = po.pan || "";
      }
    }

    closeSelectPOModal();
  };

  const handleCheckboxChange = (poId) => {
    setSelectedPOs((prev) => {
      if (prev.includes(poId)) {
        return prev.filter((id) => id !== poId);
      } else {
        return [...prev, poId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedPOs(purchaseOrders.map((po) => po.id));
    } else {
      setSelectedPOs([]);
    }
  };

  // Fetch initial PO data when component mounts
  useEffect(() => {
    fetchPurchaseOrders(null, null, null, {
      page: 1,
      pageSize: pageSize,
    });
  }, []);

  const fetchPurchaseOrders = async (
    companyId = null,
    projectId = null,
    siteId = null,
    filters = {
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
      supplierId: "",
      page: 1,
      pageSize: 5,
    }
  ) => {
    try {
      setLoading(true);
      let url = `${baseURL}purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      // Add filters only if they are provided
      if (companyId) url += `&q[company_id_eq]=${companyId}`;
      if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
      if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;
      if (filters?.supplierId)
        url += `&q[supplier_id_eq]=${filters.supplierId}`;
      if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
      if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
      if (filters?.selectedPOIds?.length > 0) {
        url += `&q[id_in]=${filters.selectedPOIds.join(",")}`;
      }

      // Always add pagination parameters
      url += `&page=${filters.page || 1}`;
      url += `&per_page=${filters.pageSize || 5}`;

      const response = await axios.get(url);
      setPurchaseOrders(response.data.purchase_orders);

      if (response.data.pagination) {
        setPagination({
          current_page: parseInt(response.data.pagination.current_page) || 1,
          next_page: parseInt(response.data.pagination.next_page) || null,
          prev_page: parseInt(response.data.pagination.prev_page) || null,
          total_pages: parseInt(response.data.pagination.total_pages) || 1,
          total_count: parseInt(response.data.pagination.total_count) || 0,
          per_page: parseInt(response.data.pagination.per_page) || 5,
        });
      }
    } catch (err) {
      setError("Failed to fetch purchase orders");
      console.error("Error fetching purchase orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));

    fetchPurchaseOrders(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        ...filterParams,
        page: 1,
        pageSize: pageSize,
      }
    );
  };

  const handleReset = () => {
    setFilterParams({
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
    });
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects([]);
    setSites([]);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
    fetchPurchaseOrders(null, null, null, {
      page: 1,
      pageSize: pageSize,
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(
      pagination.total_pages,
      pagination.current_page + 2
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));

    fetchPurchaseOrders(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        ...filterParams,
        page: page,
        pageSize: pageSize,
      }
    );
  };

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
        "https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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
      { id: 1, type: "Handling Charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, },
      { id: 2, type: "Other charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, },
      { id: 3, type: "Freight", percentage: "", inclusive: false, amount: ' ', isEditable: false, addition: true, },
    ]);
    const [taxTypes, setTaxTypes] = useState([]); // State to store tax types
  
    // Fetch tax types from API
    useEffect(() => {
      const fetchTaxTypes = async () => {
        try {
          const response = await axios.get(
            "https://marathon.lockated.com/rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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
      return rows.reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
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
            `https://marathon.lockated.com/rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
    return deductionRows.reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
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
    console.log("status:", status)
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
  
    const [remark2, setRemark2] = useState("");
    // Step 3: Handle remark change
    const handleRemarkChange2 = (e) => {
      setRemark2(e.target.value);
    };
    console.log("remark:", remark2)
    const [creditNoteDate, setCreditNoteDate] = useState(""); // State to store the date
    const [creditNoteAmount, setCreditNoteAmount] = useState(null); // State to store the amount

  const payload = {

    debit_note: {
      company_id: selectedCompany?.value || "",
      site_id: selectedSite?.value || "",
      project_id: selectedProject?.value || "",
      purchase_order_id: selectedPO?.id || "",
      debit_note_no: "DN-001",
      debit_note_date: creditNoteDate || "",
      debit_note_amount: creditNoteAmount || 0,
      remark: remark2 || "",
      status: "draft",
      
      taxes_and_charges: [
        ...rows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition,
          percentage: parseFloat(row.percentage) || 0,
        })),
        ...deductionRows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition || false, // Ensure addition is false for deductions
          percentage: parseFloat(row.percentage) || 0,
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

   const handleSubmit = async () => {
      const payload = {
        debit_note: {
          company_id: selectedCompany?.value || "",
          site_id: selectedSite?.value || "",
          project_id: selectedProject?.value || "",
          purchase_order_id: selectedPO?.id || "",
          debit_note_no: "DN-001",
          debit_note_date: creditNoteDate || "",
          debit_note_amount: creditNoteAmount || 0,
          remark: remark2 || "",
          status: "draft",
          
          taxes_and_charges: [
            ...rows.map((row) => ({
              inclusive: row.inclusive,
              amount: parseFloat(row.amount) || 0,
              remarks: row.type,
              addition: row.addition,
              percentage: parseFloat(row.percentage) || 0,
            })),
            ...deductionRows.map((row) => ({
              inclusive: row.inclusive,
              amount: parseFloat(row.amount) || 0,
              remarks: row.type,
              addition: row.addition || false, // Ensure addition is false for deductions
              percentage: parseFloat(row.percentage) || 0,
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
          "https://marathon.lockated.com/debit_notes.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
          payload
        );
        console.log("Response:", response.data);
        alert("debit Note submitted successfully!");
        navigate("/debit-note-list"); // Navigate to the list page
      } catch (error) {
        console.error("Error submitting Credit Note:", error);
        alert("Failed to submit debit Note. Please try again.");
      }
    };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid ms-2">
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
                    <div className="row">
                      {/* form-select EXAMPLE */}
                      <div
                        className="card card-default"
                        id="mor-material-details"
                      >
                        <div className="card-body mt-0">
                          <div className=" d-flex justify-content-end">
                            <a href="#" className="text-decoration-underline">
                              Existing Allocated PO &amp; Advance
                            </a>
                          </div>
                          <div className="row">
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
                                  value={selectedSite}
                                  onChange={handleSiteChange}
                                  placeholder="Select Project"
                                  isDisabled={!selectedCompany}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Debit Note Number</label>
                                <input
                                  disabled
                                  className="form-control"
                                  type="text"
                                  placeholder="Default input"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Debit Note Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="date"
                                   value={creditNoteDate} // Bind to state
                                   onChange={(e) => setCreditNoteDate(e.target.value)} // Update state on change
                                   />
                                 
                                </div>
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
                            <div className="col-md-3 mt-2">
                              <div className="form-group">
                                <label>PO / WO Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  value={selectedPO?.po_number || ""}
                                  disabled
                                />
                              </div>
                            </div>
                            <div
                              className="col-md-1 pt-4"
                              data-bs-toggle="modal"
                              data-bs-target="#selectModal"
                            >
                              <p
                                className="mt-2 text-decoration-underline"
                                onClick={openSelectPOModal}
                              >
                                Select
                              </p>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>PO / WO Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text"
                                   value={selectedPO?.po_date || ""}
                                   disabled />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>PO Value</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  value={selectedPO?.total_value || ""}
                                  disabled
                                />
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
                                  value={selectedPO?.supplier_name || ""}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>GSTIN Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  value={selectedPO?.gstin || ""}
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
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                  value={selectedPO?.pan || ""}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Debit Note Amount</label>
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

                          <div className="tbl-container mx-3 mt-3">
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
                                                                    isDisabled:
                                                                      // Disable "Handling Charges", "Other charges", "Freight" for all rows
                                                                      ["Handling Charges", "Other charges", "Freight"].includes(type.name) ||
                                                                      // Disable "SGST", "CGST", "IGST" if already selected in another row
                                                                      (["SGST", "CGST", "IGST"].includes(type.name) &&
                                                                        rows.some((r) => r.type === type.name && r.id !== row.id)),
                                                                  }))}
                                                                  value={{ value: row.type, label: row.type }}
                                                                  onChange={(selectedOption) =>
                                                                    setRows((prevRows) =>
                                                                      prevRows.map((r) =>
                                                                        r.id === row.id ? { ...r, type: selectedOption.value } : r
                                                                      )
                                                                    )
                                                                  }
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
                                                                  }))}
                                                                  value={{ value: row.type, label: row.type }}
                                                                  onChange={(selectedOption) =>
                                                                    setDeductionRows((prevRows) =>
                                                                      prevRows.map((r) =>
                                                                        r.id === row.id ? { ...r, type: selectedOption.value } : r
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
                          <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
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
                          />
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
                                        value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                                        placeholder="Select Status"
                                        isClearable={false}
                                        isDisabled={true} // Disable the selector
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
                    <button className="purple-btn2 w-100"  onClick={handleSubmit}>Submit</button>
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

      {/*  */}
      <Modal
        centered
        size="lg"
        show={attachOneModal}
        onHide={closeAttachOneModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between mt-3 me-2">
              <h5 className=" ">Latest Documents</h5>
              <div
                className="card-tools d-flex"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <button
                  className="purple-btn2 rounded-3"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  data-bs-target="#secModal"
                  fdprocessedid="xn3e6n"
                  onClick={openAttachTwoModal}
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>MTC</td>
                    <td>Material test Cert 1.pdf</td>
                    <td>01-03-2024</td>
                    <td>vendor user</td>
                    <td>
                      <i
                        className="fa-regular fa-eye"
                        data-bs-toggle="modal"
                        data-bs-target="#comments-modal"
                        style={{ fontSize: 18 }}
                      />
                    </td>
                  </tr>
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
                    <th>Upload Date</th>
                    <th>Uploaded By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>MTC</td>
                    <td>Material test Cert 1.pdf</td>
                    <td>01-03-2024</td>
                    <td>vendor user</td>
                    <td>
                      <i
                        className="fa-regular fa-eye"
                        data-bs-toggle="modal"
                        data-bs-target="#comments-modal"
                        style={{ fontSize: 18 }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal
        centered
        size="lg"
        show={attachTwoModal}
        onHide={closeAttachTwoModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>GRN Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Delivery Challan No</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Amount (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Certified Till Date (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>All Inclusive Cost (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
          </div>
          <div className=" mt-3 me-2">
            <h5 className=" ">GRN Details</h5>
          </div>
          <div className="tbl-container mx-3 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Material Name</th>
                  <th>Material GRN Amount</th>
                  <th>Certified Till Date</th>
                  <th>Base cost</th>
                  <th>Net Taxes</th>
                  <th>Net Charges</th>
                  <th>Qty</th>
                  <th>All Inclusive Cost</th>
                  <th>Taxes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td
                    className="text-decoration-underline"
                    data-bs-toggle="modal"
                    data-bs-target="#taxesModal"
                    data-bs-dismiss="modal"
                    onClick={openAttachThreeModal}
                  >
                    Taxes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Submit
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal
        centered
        size="lg"
        show={attachThreeModal}
        onHide={closeAttachThreeModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container mx-3 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Tax / Charge Type</th>
                  <th>Tax / Charges per UOM (INR)</th>
                  <th>Inclusive / Exculsive</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Total Base Cost</th>
                  <td />
                  <td />
                  <td>3000</td>
                  <td />
                </tr>
                <tr>
                  <th>Addition Tax &amp; Charges</th>
                  <td />
                  <td />
                  <td />
                  <td className="row-1" data-group={1}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-plus-circle"
                      viewBox="0 0 16 16"
                      onClick={taxesRowDropdown}
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                  </td>
                </tr>
                {taxesRowDetails && (
                  <>
                    <tr
                      className="row-2"
                      data-group={1}
                      style={{ display: "table-row" }}
                    >
                      <td>
                        <select
                          className="form-control form-select"
                          style={{ width: "100%" }}
                          fdprocessedid="3x7jfv"
                        >
                          <option selected="selected">Vendor Name</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control form-select"
                          style={{ width: "100%" }}
                          fdprocessedid="3x7jfv"
                        >
                          <option selected="selected">Vendor Name</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select>
                      </td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>270</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          fill="currentColor"
                          className="bi bi-dash-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                        </svg>{" "}
                      </td>
                    </tr>
                    <tr
                      className="row-2"
                      data-group={1}
                      style={{ display: "table-row" }}
                    >
                      <td> Sub Total A (Addition)</td>
                      <td />
                      <td />
                      <td />
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          fill="currentColor"
                          className="bi bi-dash-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                        </svg>
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <th>Gross Amount</th>
                  <td />
                  <td />
                  <td>3540</td>
                  <td />
                </tr>
                <tr>
                  <th className="row-1" data-group={2}>
                    Deduction Tax
                  </th>
                  <td />
                  <td />
                  <td />
                  <td>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-plus-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                  </td>
                </tr>
                <tr className="row-2" data-group={2}>
                  <td>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                      fdprocessedid="3x7jfv"
                    >
                      <option selected="selected">Vendor Name</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                      fdprocessedid="3x7jfv"
                    >
                      <option selected="selected">Vendor Name</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>30</td>
                  <td>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-dash-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                    </svg>{" "}
                  </td>
                </tr>
                <tr className="row-2" data-group={2}>
                  <td>Payble Amount</td>
                  <td />
                  <td />
                  <td>3510</td>
                  <td>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-dash-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        size="xl"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Select PO</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Company</label>
                <SingleSelector
                  options={companies}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  placeholder="Select Company"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Project</label>
                <SingleSelector
                  options={projects}
                  value={selectedProject}
                  onChange={handleProjectChange}
                  placeholder="Select Project"
                  isDisabled={!selectedCompany}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Sub-Project</label>
                <SingleSelector
                  options={sites}
                  value={selectedSite}
                  onChange={handleSiteChange}
                  placeholder="Select Sub-Project"
                  isDisabled={!selectedProject}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filterParams.startDate}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filterParams.endDate}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Type</label>
                <SingleSelector
                  options={poTypes}
                  value={
                    poTypes.find(
                      (type) => type.value === filterParams.poType
                    ) || poTypes[0]
                  }
                  onChange={(selected) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      poType: selected.value,
                    }))
                  }
                  placeholder="Select PO Type"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterParams.poNumber}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      poNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter PO Number"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3 justify-content-center">
            {/* <div className="col-md-12 d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={loading}
                          >
                            Reset
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                            disabled={loading}
                          >
                            Search
                          </button>
                        </div> */}
            <div className="col-md-3">
              <button className="purple-btn2 w-100" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn1 w-100" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="tbl-container mx-3 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="text-start">
                        <input
                          type="checkbox"
                          checked={selectedPOs.length === purchaseOrders.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-start">PO Number</th>
                      <th className="text-start">PO Date</th>
                      <th className="text-start">PO Value</th>
                      <th className="text-start">PO Type</th>
                      <th className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : purchaseOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No purchase orders found
                        </td>
                      </tr>
                    ) : (
                      purchaseOrders.map((po) => (
                        <tr key={po.id}>
                          <td className="text-start">
                            <input
                              type="checkbox"
                              checked={selectedPOs.includes(po.id)}
                              onChange={() => handleCheckboxChange(po.id)}
                            />
                          </td>
                          <td className="text-start">{po.po_number}</td>
                          <td className="text-start">{po.po_date}</td>
                          <td className="text-start">{po.total_value}</td>
                          <td className="text-start">{po.po_type}</td>
                          <td className="text-start">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handlePOSelect(po)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {purchaseOrders.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="showing-entries"></div>
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          pagination.current_page === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.current_page === 1}
                        >
                          First
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          pagination.current_page === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                          }
                          disabled={pagination.current_page === 1}
                        >
                          Prev
                        </button>
                      </li>
                      {getPageNumbers().map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            page === pagination.current_page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Next
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.total_pages)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Last
                        </button>
                      </li>
                    </ul>
                  </nav>
                  {getShowingEntriesText()}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DebitNoteCreate;
