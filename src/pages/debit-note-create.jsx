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
import { toast, ToastContainer } from "react-toastify";
const DebitNoteCreate = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [showRows, setShowRows] = useState(false);
  const [debitNoteReason, setDebitNoteReason] = useState("");
  const [attachOneModal, setattachOneModal] = useState(false);
  const [attachTwoModal, setattachTwoModal] = useState(false);
  const [attachThreeModal, setattachThreeModal] = useState(false);
  const [taxesRowDetails, settaxesRowDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);
  // Document attachment state and handlers for advanced modal
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });
  const [documents, setDocuments] = useState([]); // If you want to keep a list



  const taxesRowDropdown = () => {
    settaxesRowDetails(!taxesRowDetails);
  };

  const openAttachOneModal = () => setattachOneModal(true);
  const closeAttachOneModal = () => setattachOneModal(false);

  const openAttachTwoModal = () => setattachTwoModal(true);
  const closeAttachTwoModal = () => setattachTwoModal(false);

  const openAttachThreeModal = () => setattachThreeModal(true);
  const closeAttachThreeModal = () => setattachThreeModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);



  // tax table functionality



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
      let url = `${baseURL}purchase_orders/grn_details.json?token=${token}`;

      // Add filters only if they are provided
      if (companyId) url += `&q[company_id_eq]=${companyId}`;
      if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
      if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;
      if (filters?.supplierId)
        url += `&q[supplier_id_eq]=${filters.supplierId}`;
      if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
      if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
      // if (filters?.selectedPOIds?.length > 0) {
      //   url += `&q[id_in]=${filters.selectedPOIds.join(",")}`;
      // }

      if (filters?.poNumber && filters.poNumber !== "") {
        url += `&q[po_number_cont]=${filters.poNumber}`;
      }
      if (filters?.poType && filters.poType !== "") {
        url += `&q[po_type_cont]=${filters.poType}`;
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
        `${baseURL}projects.json?token=${token}&q[company_id_eq]=${companyId}`
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
        `${baseURL}sites.json?token=${token}&q[project_id_eq]=${projectId}`
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
        `${baseURL}pms/company_setups.json?token=${token}`
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
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
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

  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: "",
    poValue: "",
    gstin: "",
    pan: "",
    invoiceNumber: "",
    // invoiceDate: getFormattedDate(), // Initial date
    invoiceAmount: "",
    baseCost: "",
    netTaxes: "",
    netCharges: "",
    allInclusiveCost: "",
    charges: [],
    deductions: [],
    typeOfCertificate: "",
    departmentId: "",
    otherDeductions: "",
    otherDeductionRemarks: "",
    otherAdditions: "",
    otherAdditionRemarks: "",
    retentionPercentage: "",
    retentionAmount: "",
    remark: "",
    payeeName: "",
    paymentMode: "",
    paymentDueDate: "",
    attachments: [],
    currentAdvanceDeduction: "",
    status: "draft",
    roundOffAmount: "",
  });
  const [pendingAdvances, setPendingAdvances] = useState([]);

  useEffect(() => {
    const fetchPendingAdvances = async () => {
      if (selectedPO?.id) {
        try {
          const response = await axios.get(
            `${baseURL}advance_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&q[status_eq]=proceed&token=${token}`
          );
          setPendingAdvances(response.data.advance_notes || []);
        } catch (error) {
          console.error("Error fetching pending advances:", error);
          setPendingAdvances([]);
        }
      }
    };

    fetchPendingAdvances();
  }, [selectedPO, formData.pms_supplier_id]);


  // Add these state variables at the top
  const [advanceNoteModal, setAdvanceNoteModal] = useState(false);
  const [selectedAdvanceNotes, setSelectedAdvanceNotes] = useState([]);

  // Add these handlers
  const handleAdvanceNoteSelect = (note) => {
    setSelectedAdvanceNotes((prev) => {
      const isSelected = prev.some((n) => n.id === note.id);
      if (isSelected) {
        const newNotes = prev.filter((n) => n.id !== note.id);
        // Update form data with new total
        setFormData((prevForm) => ({
          ...prevForm,
          currentAdvanceDeduction: calculateTotalAdvanceRecovery(),
        }));
        return newNotes;
      } else {
        const newNotes = [...prev, note];
        // Update form data with new total
        setFormData((prevForm) => ({
          ...prevForm,
          currentAdvanceDeduction: calculateTotalAdvanceRecovery(),
        }));
        return newNotes;
      }
    });
  };


  // Add modal toggle handlers
  const openAdvanceNoteModal = () => setAdvanceNoteModal(true);
  const closeAdvanceNoteModal = () => setAdvanceNoteModal(false);

  // Add validation handler
  const validateAdvanceRecovery = (note, value) => {
    // const recovery = parseFloat(value) || 0;
    const recovery = (parseFloat(value) || 0) + (parseFloat(note.recovered_amount) || 0);
    const advanceAmount = parseFloat(note.advance_amount) || 0;

    if (recovery > advanceAmount) {
      // alert("Recovery amount cannot exceed advance amount");
      // return false;
      toast.error("Recovery amount cannot exceed advance amount.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
    return true;
  };

  const calculateTotalAdvanceRecovery = () => {
    return selectedAdvanceNotes
      .reduce((total, note) => {
        return total + (parseFloat(note.this_recovery) || 0);
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    // const totalRecovery = calculateTotalAdvanceRecovery();
    // setCreditNoteAmount(Number(totalRecovery));

    if (selectedAdvanceNotes.length > 0) {
      const totalRecovery = calculateTotalAdvanceRecovery();
      setCreditNoteAmount(Number(totalRecovery));
    } else {
      // Optionally set empty string or leave it unchanged
      setCreditNoteAmount(""); // or skip this line if you want to keep the previous value
    }
  }, [selectedAdvanceNotes]); // run when selectedAdvanceNotes change

  // console.log("total recovery:",calculateTotalAdvanceRecovery ())

  const advance_note_adjustment = selectedAdvanceNotes?.map((note) => ({
    id: note.id,
    value: parseFloat(note.this_recovery) || 0,
  }));
  console.log("advance_note_adjustment:", advance_note_adjustment)

  // const attachments = (documents || [])
  //   .map((doc) =>
  //     doc.attachments && doc.attachments[0]
  //       ? {
  //         filename: doc.attachments[0].filename || null,
  //         content: doc.attachments[0].content || null,
  //         content_type: doc.attachments[0].content_type || null,
  //         document_name: doc.document_type || null,
  //       }
  //       : null
  //   )
  //   .filter(Boolean);


// attachment like mor******
   const [attachments, setAttachments] = useState([
    // {
    //   id: 1,
    //   fileType: "image/png",
    //   fileName: "otp (5).png",
    //   uploadDate: "2025-07-18T19:01:00",
    //   fileUrl: "https://blob-store-files.s3.ap-south-1.amazonaws.com/qe6dptv1sieyo4rd12hlwcv54p9n",
    //   file: null, // Actual File object for new uploads
    //   isExisting: true, // mark if file already uploaded
    // },
  ]);

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
    // attachment like mor end****
    // console.log("debit note reason:",debitNoteReason)

  const payload = {

    debit_note: {
      // company_id: selectedCompany?.value || "",
      // site_id: selectedSite?.value || "",
      // project_id: selectedProject?.value || "",
      purchase_order_id: selectedPO?.id || "",
      debit_note_no: "DN-001",
      debit_note_date: creditNoteDate || "",
      debit_note_amount: creditNoteAmount || 0,
      reason: debitNoteReason ||"",
      remark: remark2 || "",
      status: "draft",
      attachments: attachmentsPayload || [],
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

      // attachments: documentRows.map((row) => ({
      //   filename: row.upload?.filename || "",
      //   content: row.upload?.content || "",
      //   content_type: row.upload?.content_type || "",
      // })),

      advance_note_adjustment,
    }


  };

  console.log("payload#########:", payload)

  const handleSubmit = async () => {
    // Validation
    if (!selectedPO?.id) {
      toast.error("Please select a Purchase Order number.");
      return;
    }
    if (!creditNoteAmount || isNaN(creditNoteAmount) || Number(creditNoteAmount) <= 0) {
      toast.error("Please enter a valid Debit Note amount.");
      return;
    }
    if (!creditNoteDate) {
      toast.error("Please select a Debit Note date.");
      return;
    }
    if (!debitNoteReason || debitNoteReason.trim() === "") {
      toast.error("Please Select a reason.");
      return;
    }

    setLoading2(true)
    const payload = {
      debit_note: {
        company_id: selectedCompany?.value || "",
        site_id: selectedSite?.value || "",
        project_id: selectedProject?.value || "",
        purchase_order_id: selectedPO?.id || "",
        debit_note_no: "DN-001",
        reason: debitNoteReason ||"",
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
        attachments:attachmentsPayload|| [],
        advance_note_adjustment,
      }
    };

    console.log("debit note create payload:", payload)

    try {
      const response = await axios.post(
        `${baseURL}debit_notes.json?token=${token}`,
        payload
      );
      console.log("Response:", response.data);
      setLoading2(false)
      toast.success("Debit Note submitted successfully!");
      navigate(`/debit-note-list?token=${token}`); // Navigate to the list page
    } catch (error) {
      setLoading2(false)
      console.error("Error submitting Credit Note:", error);
      toast.error("Failed to submit Debit Note. Please try again.");
    } finally {
      setLoading2(false)
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

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section  ms-2">
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

                      <div
                        className="card card-default"
                        id="mor-material-details"
                      >
                        <div className="card-body mt-0">

                          <div className="row mt-2">


                            <div className="col-md-3 mt-2">
                              <div className="form-group">
                                <label>PO / WO Number <span>*</span></label>
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
                                    value={selectedPO?.po_date
                                      ? new Date(selectedPO.po_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                      : ""}
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
                                <label>Created On</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text"
                                    value={new Date().toLocaleDateString("en-GB").replace(/\//g, "-")} // Format: DD/MM/YYYY
                                    disabled // Makes the input field non-editable
                                  />
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
                                <label>Debit Note Amount  <span>*</span></label>
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
                                <label>Debit Note Reason  <span>*</span></label>
                                <SingleSelector
                                  options={[
                                    { value: "Advance Note", label: "Advance Note" },
                                    { value: "Miscellaneous", label: "Miscellaneous" },
                                    { value: "Others", label: "Others" },
                                  ]}
                                  value={debitNoteReason ? {
                                    value: debitNoteReason,
                                    label:
                                      debitNoteReason === "advance_note"
                                        ? "Advance Note"
                                        : debitNoteReason === "miscellaneous"
                                          ? "Miscellaneous"
                                          : "Others",
                                  } : null}
                                  onChange={(selected) =>
                                    setDebitNoteReason(selected?.value || "")
                                  }
                                  placeholder="Select Debit Note Reason"
                                  className="form-control"
                                />
                                {console.log("debit note reason",debitNoteReason)}
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Debit Note Date  <span>*</span></label>
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
                          {/* advance note  */}
                          {debitNoteReason === "Advance Note" && (
                            <>
                              <div className="d-flex justify-content-between mt-5 me-1">
                                <h5 className=" ">Advance Adjustment</h5>
                                <button
                                  className="purple-btn2"
                                  onClick={openAdvanceNoteModal}
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
                                  <span>Select Advance Note</span>
                                </button>
                              </div>
                              <div className="tbl-container mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th className="text-start">ID</th>
                                      <th className="text-start">PO Display No.</th>
                                      <th className="text-start">Project</th>
                                      <th className="text-start">Advance Number</th>

                                      <th className="text-start">Advance Amount (INR)</th>
                                      <th className="text-start">Status</th>
                                      <th className="text-start">
                                        Debit Note For Advance (INR)
                                      </th>
                                      <th className="text-start">
                                        Advance Adjusted Till Date (INR)
                                      </th>
                                      <th className="text-start">
                                        Advance Outstanding till Certificate Date (INR)
                                      </th>
                                      <th className="text-start">
                                        Advance Outstanding till current Date (INR)
                                      </th>
                                      <th className="text-start" style={{ width: "200px" }}>
                                        This Recovery (INR)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedAdvanceNotes.length > 0 ? (
                                      selectedAdvanceNotes.map((note) => (
                                        <tr key={note.id}>
                                          <td className="text-start">{note.id || "-"}</td>
                                          <td className="text-start">
                                            {note.po_number || "-"}
                                          </td>
                                          <td className="text-start">
                                            {note.project_name || "-"}
                                          </td>
                                          <td className="text-start">
                                            {note.advance_number || "-"}
                                          </td>
                                          <td className="text-start">
                                            {note.advance_amount || "-"}
                                          </td>
                                          <td className="text-start">{note.status || "-"}</td>

                                          <td className="text-start">
                                            {note.debit_note_for_advance || "-"}
                                          </td>
                                          <td className="text-start">
                                            {/* {note.advance_adjusted_till_date || "-"} */}
                                            {note.recovered_amount || "0"}
                                          </td>
                                          <td className="text-start">
                                            {note.advance_outstanding_till_certificate_date ||
                                              "-"}
                                          </td>
                                          <td className="text-start">
                                            {note.advance_outstanding_till_current_date ||
                                              "-"}
                                          </td>
                                          <td className="text-start">
                                            <input
                                              type="number"
                                              className="form-control"
                                              value={note.this_recovery || ""}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (validateAdvanceRecovery(note, value)) {
                                                  setSelectedAdvanceNotes((prev) => {
                                                    const newNotes = prev.map((n) =>
                                                      n.id === note.id
                                                        ? { ...n, this_recovery: value }
                                                        : n
                                                    );
                                                    // Update form data with new total after recovery amount changes
                                                    setFormData((prevForm) => ({
                                                      ...prevForm,
                                                      currentAdvanceDeduction:
                                                        calculateTotalAdvanceRecovery(),
                                                    }));
                                                    return newNotes;
                                                  });
                                                }
                                              }}
                                              min="0"
                                              max={note.advance_amount}
                                            />
                                          </td>
                                          {/* {console.log("selected advance notes:",selectedAdvanceNotes)} */}
                                          {/* {console.log("currentAdvanceDeduction:",formData.currentAdvanceDeduction)} */}
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td className="text-start" colSpan="9">
                                          No advance notes selected.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}

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
                                  {/* <th className="text-start">File Type</th> */}
                          {/* <th className="text-start">Upload Date</th>
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
                                  documents.map((doc, idx) => ( */}
                          {/* <tr key={idx}>
                                      <td className="text-start">{idx + 1}</td>
                                      <td className="text-start">{doc.document_type}</td>
                                      <td className="text-start">
                                        {doc.attachments[0]?.filename || "-"}
                                      </td> */}
                          {/* <td className="text-start">
                            {doc.attachments[0]?.content_type || "-"}
                          </td> */}
                          {/* <td className="text-start">
                                        {doc.uploadDate || "-"}
                                      </td>
                                      <td
                                        className="text-start text-decoration-underline "
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
                                  <th className="main2-th" style={{ width: "100px" }}>
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
                                              <div className="image">
                                                <a href={att.fileUrl} target="_blank" rel="noreferrer">
                                                  <img
                                                    alt="preview"
                                                    className="img-responsive"
                                                    height={50}
                                                    width={50}
                                                    src={att.fileUrl}
                                                  />
                                                </a>
                                              </div>
                                              <div className="file-name">
                                                <a href={att.fileUrl} download>
                                                  <span className="material-symbols-outlined">file_download</span>
                                                </a>
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
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g" closeButton>
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
              <button className="purple-btn2 w-100 mt-2" onClick={handleSearch}>
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
                        {/* <input
                          type="checkbox"
                          checked={selectedPOs.length === purchaseOrders.length}
                          onChange={handleSelectAll}
                        /> */}
                        Sr.No.
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
                      purchaseOrders.map((po, index) => (
                        <tr key={po.id}>
                          <td className="text-start">
                            {/* <input
                              type="checkbox"
                              checked={selectedPOs.includes(po.id)}
                              onChange={() => handleCheckboxChange(po.id)}
                            /> */}
                            {((pagination.current_page - 1) * pagination.per_page) + index + 1}
                          </td>
                          <td className="text-start">{po.po_number}</td>
                          <td className="text-start">
                            {/* {po.po_date} */}
                            {po.po_date
                              ? new Date(po.po_date).toLocaleDateString("en-GB").split("/").join("-")
                              : "-"}
                          </td>
                          <td className="text-start">{po.total_value}</td>
                          <td className="text-start">{po.po_type}</td>
                          <td className="text-start">
                            <button
                              className=" purple-btn2"
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
                        className={`page-item ${pagination.current_page === 1 ? "disabled" : ""
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
                        className={`page-item ${pagination.current_page === 1 ? "disabled" : ""
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
                          className={`page-item ${page === pagination.current_page ? "active" : ""
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
                        className={`page-item ${pagination.current_page === pagination.total_pages
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
                        className={`page-item ${pagination.current_page === pagination.total_pages
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


      {/* advance note modal  */}

      <Modal
        centered
        size="xl"
        show={advanceNoteModal}
        onHide={closeAdvanceNoteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Advance Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        pendingAdvances.length > 0 &&
                        selectedAdvanceNotes.length === pendingAdvances.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAdvanceNotes(pendingAdvances);
                        } else {
                          setSelectedAdvanceNotes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-start">ID</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Project</th>
                  <th className="text-start">Advance Number</th>

                  <th className="text-start">Advance Amount (INR)</th>
                  <th className="text-start">Status</th>
                  <th className="text-start">Debit Note For Advance (INR)</th>
                  <th className="text-start">
                    Advance Adjusted Till Date (INR)
                  </th>
                  <th className="text-start">
                    Advance Outstanding till Certificate Date (INR)
                  </th>
                  <th className="text-start">
                    Advance Outstanding till current Date (INR)
                  </th>
                  <th className="text-start">This Recovery (INR)</th>
                </tr>
              </thead>
              <tbody>
                {pendingAdvances.length > 0 ? (
                  pendingAdvances.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedAdvanceNotes.some(
                            (n) => n.id === note.id
                          )}
                          onChange={() => handleAdvanceNoteSelect(note)}
                        />
                      </td>
                      <td className="text-start">{note.id || "-"}</td>
                      <td className="text-start">{note.po_number || "-"}</td>
                      <td className="text-start">{note.project_name || "-"}</td>
                      <td className="text-start">
                        {note.advance_number || "-"}
                      </td>
                      <td className="text-start">
                        {note.advance_amount || "-"}
                      </td>
                      <td className="text-start">{note.status || "-"}</td>
                      <td className="text-start">
                        {note.debit_note_for_advance || "-"}
                      </td>
                      <td className="text-start">
                        {/* {note.advance_adjusted_till_date || "-"} */}
                        {note.recovered_amount || "0"}
                      </td>
                      <td className="text-start">
                        {note.advance_outstanding_till_certificate_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.advance_outstanding_till_current_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.this_recovery || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No advance notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3 ">
              <button
                className="purple-btn2 w-100 mt-2"
                onClick={closeAdvanceNoteModal}
                disabled={selectedAdvanceNotes.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeAdvanceNoteModal}
              >
                Cancel
              </button>
            </div>
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
                        <td className="text-start" >{idx + 1}</td>
                        <td className="text-start">{doc.document_type}</td>
                        <td className="text-start">{doc.attachments[0]?.filename || "-"}</td>
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
                        <td className="text-start">{idx + 1}</td>
                        <td className="text-start">{doc.document_type}</td>
                        <td className="text-start">{doc.attachments[0]?.filename || "-"}</td>
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

export default DebitNoteCreate;
