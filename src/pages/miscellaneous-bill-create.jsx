import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useParams } from "react-router-dom";

import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const MiscellaneousBillCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [showRows, setShowRows] = useState(false);
  const [taxesRowDetails, settaxesRowDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [withBillEntry, setWithBillEntry] = useState(false);
  const [withoutBillEntry, setWithoutBillEntry] = useState(true);
   const [attachOneModal, setattachOneModal] = useState(false);
    const [attachTwoModal, setattachTwoModal] = useState(false);
    const [attachThreeModal, setattachThreeModal] = useState(false);
    const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);
  // ...existing code...
  const [billEntryData, setBillEntryData] = useState({});
  const taxesRowDropdown = () => {
    settaxesRowDetails(!taxesRowDetails);
  };
const closeAttachOneModal = () => setattachOneModal(false);
const openAttachTwoModal = () => setattachTwoModal(true);
  const closeAttachTwoModal = () => setattachTwoModal(false);

  const openAttachThreeModal = () => setattachThreeModal(true);
  const closeAttachThreeModal = () => setattachThreeModal(false);

  const [pageSize, setPageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");
   const [attachModal, setattachModal] = useState(false);
    const [viewDocumentModal, setviewDocumentModal] = useState(false);
  
    

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
    // {
    //   id: 1,
    //   type: "Handling Charges",
    //   percentage: "",
    //   inclusive: false,
    //   amount: "",
    //   isEditable: false,
    //   addition: true,
    //   resource_id: 2,
    //   resource_type: "TaxCharge",
    // },
    // {
    //   id: 2,
    //   type: "Other charges",
    //   percentage: "",
    //   inclusive: false,
    //   amount: "",
    //   isEditable: false,
    //   addition: true,
    //   resource_id: 4,
    //   resource_type: "TaxCharge",
    // },
    // {
    //   id: 3,
    //   type: "Freight",
    //   percentage: "",
    //   inclusive: false,
    //   amount: " ",
    //   isEditable: false,
    //   addition: true,
    //   resource_id: 5,
    //   resource_type: "TaxCharge",
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
          `${baseURL}miscellaneous_bills/suppliers_list.json?token=${token}`
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const [billEntryOptions, setBillEntryOptions] = useState([]);
  const [selectedBillEntry, setSelectedBillEntry] = useState(null);
  useEffect(() => {
    const fetchAndSelectBillEntry = async () => {
      console.log("..........bill id in misc:", typeof id, id);
      try {
        // Always fetch bill entry options
        const billEntryResponse = await axios.get(
          `${baseURL}miscellaneous_bills/bill_entry_list?token=${token}`
        );
        console.log("bill entry res:", billEntryResponse.data.be_list);
        if (
          billEntryResponse.data &&
          Array.isArray(billEntryResponse.data.be_list)
        ) {
          setBillEntryOptions(
            billEntryResponse.data.be_list.map((item) => ({
              value: item.value,
              label: item.name,
            }))
          );

          // If ID is available, find and set the matching entry
          if (id) {
            setWithBillEntry(true); // <-- Set with bill entry true
            setWithoutBillEntry(false);
            // First fetch specific bill entry details
            const response = await axios.get(
              `${baseURL}bill_entries/${id}?token=${token}`
            );

            console.log("res with id :", response.data);
            console.log("data ", billEntryResponse.data.be_list);
            // Find and set the matching bill entry option
            const matchingEntry = billEntryResponse.data.be_list.find(
              // (item) => String(item.value) === String(id)
              (item) => Number(item.value) === Number(id)
            );
            console.log("matching :", matchingEntry);
            if (matchingEntry) {
              setSelectedBillEntry({
                value: matchingEntry.value,
                label: matchingEntry.name,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching bill entries:", error);
        // Clear selected bill entry in case of error
        setSelectedBillEntry(null);
      }
    };

    fetchAndSelectBillEntry();
  }, [id]);

  console.log("selected bill entry:", selectedBillEntry);
  useEffect(() => {
    if (selectedBillEntry && selectedBillEntry.value) {
      console.log("selected bill entry:", selectedBillEntry);
      const fetchBillEntryDetails = async () => {
        try {
          const response = await axios.get(
            `${baseURL}bill_entries/${selectedBillEntry.value}?token=${token}`
          );
          const data = response.data;
          console.log("bill entry all data:", data);
          setBillEntryData(data || {});
          setCreditNoteAmount(data.bill_amount || 0);
        } catch (error) {
          console.error("Error fetching bill entry or PO GRN details:", error);
        }
      };
      fetchBillEntryDetails();
    }
  }, [selectedBillEntry]);

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






  const payload = {
    miscellaneous_bill: {
      company_id: selectedCompany?.value || billEntryData?.company_id || "",
      site_id: selectedSite?.value || billEntryData?.site_id || "",
      project_id: selectedProject?.value || billEntryData?.project_id || "",
      purchase_order_id: selectedPO?.id || "",
      bill_no: billNumber || billEntryData?.bill_no || "",
      bill_date: billDate || billEntryData?.bill_date || "",
      amount: creditNoteAmount || 0,
      remark: remark2 || "",
      status: status || "draft",
      remarks: remark || "",
      comments: comment || "",
      // created_by_id: 1,
      // pms_supplier_id: selectedSupplier?.id || billEntryData?.pms_supplier_id || null,
      pms_supplier_id:
        selectedSupplier?.id ?? billEntryData?.pms_supplier_id ?? null,
      bill_entry_id: selectedBillEntry?.value || billEntryData?.id || "", // <-- Add this line
      taxes_and_charges: [
        ...rows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition,
          percentage: parseFloat(row.percentage) || 0,
          resource_id: row.resource_id || null,
          resource_type: row.resource_type || "",
        })),
        ...deductionRows.map((row) => ({
          inclusive: row.inclusive,
          amount: parseFloat(row.amount) || 0,
          remarks: row.type,
          addition: row.addition || false, // Ensure addition is false for deductions
          percentage: parseFloat(row.percentage) || 0,
          resource_id: row.resource_id || null,
          resource_type: row.resource_type || "",
        })),
      ],
      attachments: documentRows.map((row) => ({
        filename: row.upload?.filename || "",
        content: row.upload?.content || "",
        content_type: row.upload?.content_type || "",
      })),
    },
  };

  console.log("payload:", payload);
  // console.log("addition tax rows:", rows)

  const handleSubmit = async () => {
    setLoading2(true);

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
      miscellaneous_bill: {
        company_id: selectedCompany?.value || billEntryData?.company_id || "",
        site_id: selectedSite?.value || billEntryData?.site_id || "",
        project_id: selectedProject?.value || billEntryData?.project_id || "",
        purchase_order_id: selectedPO?.id || "",
        bill_no: billNumber || billEntryData?.bill_no || "",
        bill_date: billDate || billEntryData?.bill_date || "",
        amount: creditNoteAmount || 0,
        remark: remark2 || "",
        status: status || "draft",
        remarks: remark || "",
        comments: comment || "",
        // created_by_id: 1,
        // pms_supplier_id: selectedSupplier?.id || billEntryData?.pms_supplier_id || null,
        pms_supplier_id:
          selectedSupplier?.id ?? billEntryData?.pms_supplier_id ?? null,
        bill_entry_id: selectedBillEntry?.value || billEntryData?.id || "", // <-- Add this line
        taxes_and_charges: [
          ...rows.map((row) => ({
            inclusive: row.inclusive,
            amount: parseFloat(row.amount) || 0,
            remarks: row.type,
            addition: row.addition,
            percentage: parseFloat(row.percentage) || 0,
            resource_id: row.resource_id || null,
            resource_type: row.resource_type || "",
          })),
          ...deductionRows.map((row) => ({
            inclusive: row.inclusive,
            amount: parseFloat(row.amount) || 0,
            remarks: row.type,
            addition: row.addition || false, // Ensure addition is false for deductions
            percentage: parseFloat(row.percentage) || 0,
            resource_id: row.resource_id || null,
            resource_type: row.resource_type || "",
          })),
        ],
        // attachments: documentRows.map((row) => ({
        //   filename: row.upload?.filename || "",
        //   content: row.upload?.content || "",
        //   content_type: row.upload?.content_type || "",
        // })),
         attachments: attachments.length > 0 ? attachments : null,
      },
    };

    try {
      const response = await axios.post(
        `${baseURL}miscellaneous_bills.json?token=${token}`,
        payload
      );
      console.log("Response:", response.data);
      if (response.status === 201) {
        alert("Miscellaneous Bill submitted successfully!");
        setLoading2(false);
        navigate(`/miscellaneous-bill-list?token=${token}`); // Navigate to the list page
      }
    } catch (error) {
      console.error("Error submitting Miscellaneous Bill:", error);
      setLoading2(false);
      alert("Failed to submit Miscellaneous Bill. Please try again.");
    } finally {
      setLoading2(false);
    }
  };
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section ms-2">
          <a href="">
            Home &gt; Billing &amp; Accounts &gt; Miscellaneous Bill{" "}
          </a>
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
                          <div className="row mb-3">
                            <div className="col-md-2 d-flex align-items-center">
                              <input
                                type="checkbox"
                                id="without-bill-entry"
                                checked={withoutBillEntry}
                                onChange={() => {
                                  setWithBillEntry(false);
                                  setWithoutBillEntry(true);
                                }}
                                className="me-2"
                              />
                              <label
                                htmlFor="without-bill-entry"
                                className="mb-0"
                              >
                                Without Bill Entry
                              </label>
                            </div>
                            <div className="col-md-2 d-flex align-items-center">
                              <input
                                type="checkbox"
                                id="with-bill-entry"
                                checked={withBillEntry}
                                onChange={() => {
                                  setWithBillEntry(true);
                                  setWithoutBillEntry(false);
                                }}
                                className="me-2"
                              />
                              <label htmlFor="with-bill-entry" className="mb-0">
                                With Bill Entry
                              </label>
                            </div>
                          </div>

                          {withBillEntry && !withoutBillEntry && (
                            <div className="row">
                              <div className="col-md-4">
                                <label htmlFor="event-no-select">
                                  Bill Entries
                                </label>
                                <span style={{ color: "#8b0203" }}> *</span>
                                <div className="form-group">
                                  <SingleSelector
                                    options={billEntryOptions}
                                    onChange={setSelectedBillEntry}
                                    value={selectedBillEntry}
                                    placeholder="Select Bill Entry"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>Company</label>
                                  <span style={{ color: "#8b0203" }}> *</span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.company_name || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="col-md-4">
                                <label htmlFor="event-no-select">Project</label>
                                <span style={{ color: "#8b0203" }}> *</span>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.project_name || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="col-md-4 mt-2">
                                <label htmlFor="event-no-select">
                                  {" "}
                                  SubProject
                                </label>
                                <span style={{ color: "#8b0203" }}> *</span>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.site_name || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Invoice Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.bill_no || ""}
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
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
                                      type="date"
                                      value={billEntryData.bill_date || ""}
                                      disabled
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
                                    // onChange={(e) => setCreditNoteAmount(Number(e.target.value) || 0)} // Update state on change
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
                                    <input
                                      className="form-control"
                                      type="text"
                                      // value={new Date().toLocaleDateString(
                                      //   "en-GB"
                                      // ).replace(/\//g, "-")} // Format: DD/MM/YYYY
                                       value={new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
                                      disabled // Makes the input field non-editable
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-4  mt-2">
                                <div className="form-group">
                                  <label>Supplier</label>
                                  {/* <SingleSelector
                        options={supplierOptions}
                        className="form-control form-select"
                        // value={selectedSupplier}
                        // onChange={(selected) => setSelectedSupplier(selected)}
                        placeholder="Select Supplier"
                        
                      /> */}
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.supplier_name || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                              {/* <div className="col-md-1 pt-2 mt-4">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div> */}
                              <div className="col-md-4 mt-3">
                                <div className="form-group">
                                  <label>GSTIN</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.gstin || ""}
                                    disabled
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PAN</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billEntryData.pan_no || ""}
                                    disabled
                                    readOnly
                                  />
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
                                {/* {console.log("selected po id:", selectedPO)} */}
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
                          )}


                          {withoutBillEntry && !withBillEntry && (
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
                                  <label>Invoice Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={billNumber}
                                    onChange={(e) =>
                                      setBillNumber(e.target.value)
                                    }
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
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
                                      type="date"
                                      value={billDate}
                                      onChange={(e) =>
                                        setBillDate(e.target.value)
                                      }
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
                                    onChange={(e) =>
                                      setCreditNoteAmount(
                                        Number(e.target.value) || 0
                                      )
                                    } // Update state on change
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
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={new Date().toLocaleDateString(
                                        "en-GB"
                                      ).replace(/\//g, "-")} // Format: DD/MM/YYYY
                                      disabled // Makes the input field non-editable
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Supplier Name</label>

                                  <SingleSelector
                                    options={suppliers.map((s) => ({
                                      label: s.organization_name,
                                      value: s.id,
                                      gstin: s.gstin,
                                      pan_number: s.pan_number,
                                    }))}
                                    value={
                                      selectedSupplier
                                        ? {
                                          label:
                                            selectedSupplier.organization_name,
                                          value: selectedSupplier.id,
                                          gstin: selectedSupplier.gstin,
                                          pan_number:
                                            selectedSupplier.pan_number,
                                        }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const supplier = suppliers.find(
                                        (s) => s.id === option.value
                                      );
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
                                {console.log("selected po id:", selectedPO)}
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
                          )}
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
                          
                             <div className="d-flex justify-content-between mt-3 me-2">
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
                          <div className="tbl-container mx-3 mt-3">
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
                                      <td className="text-start">
                                        {doc.document_type}
                                      </td>
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
                        value={statusOptions.find(
                          (option) => option.value === status
                        )} // Set "Draft" as the selected status
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
                  <div className="col-md-2 mt-2" >
                    <button
                      className="purple-btn2 w-100"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100" onClick={() => navigate(`/miscellaneous-bill-list?token=${token}`)}>Cancel</button>
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
                     <button className="purple-btn1 w-100" onClick={closeattachModal}>
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
                               <td className="text-start">{doc.uploadDate || "-"}</td>
                            
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
                               <td className="text-start">{doc.uploadDate || "-"}</td>
                              
                             </tr>
                           ))
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
                 <div className="row mt-2 justify-content-center">
                   <div className="col-md-3">
                     <button className="purple-btn1 w-100">Close</button>
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

export default MiscellaneousBillCreate;
