import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import MultiSelector from "../components/base/Select/MultiSelector";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillBookingCreate = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [actionDetails, setactionDetails] = useState(false);

  const [selectGRNModal, setselectGRNModal] = useState(false);

  const [attachThreeModal, setattachThreeModal] = useState(false);
  const navigate = useNavigate();
  const [withBillEntry, setWithBillEntry] = useState(true);
  const [withoutBillEntry, setWithoutBillEntry] = useState(false);


  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
   const [attachModal, setattachModal] = useState(false);
    const [viewDocumentModal, setviewDocumentModal] = useState(false);
  
    const openattachModal = () => setattachModal(true);
    const closeattachModal = () => setattachModal(false);
    const openviewDocumentModal = () => setviewDocumentModal(true);
    const closeviewDocumentModal = () => setviewDocumentModal(false);


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


  // calculation for tax details table
  const [rows, setRows] = useState([
    {
      id: 1,
      type: "SGST",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: true,
      addition: true,
    },
    {
      id: 2,
      type: "CGST",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: true,
      addition: true,
    },
    {
      id: 3,
      type: "IGST",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: true,
      addition: true,
    },
    {
      id: 4,
      type: "Handling Charges",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 5,
      type: "Other charges",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 6,
      type: "Freight",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    // {
    //   id: 4,
    //   type: "IGST",
    //   percentage: "",
    //   inclusive: false,
    //   amount: "",
    //   isEditable: true,
    //   addition: true,
    // },
  ]);
  const [taxTypes, setTaxTypes] = useState([]); // State to store tax types
  const { id } = useParams();

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
    // Only allow adding non-tax rows
    const newRow = {
      id: rows.length + 1,
      type: "",
      percentage: "0",
      inclusive: false,
      amount: "0",
      isEditable: false, // Set to false to prevent editing
      addition: true,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };
  // Function to calculate the subtotal of addition rows
  const calculateSubTotal = () => {
    return rows
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
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0)
      .toFixed(2);
  };
  // Function to calculate the payable amount
  const calculatePayableAmount = () => {
    const grossAmount =
      parseFloat(selectedGRN?.base_cost || 0) + parseFloat(calculateSubTotal());
    const deductionSubTotal = parseFloat(calculateDeductionSubTotal()) || 0;
    return (grossAmount - deductionSubTotal).toFixed(2);
  };

  const deleteDeductionRow = (id) => {
    setDeductionRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Add new state for taxes
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [taxDeductionData, setTaxDeductionData] = useState({
    total_material_cost: 0,
    deduction_mor_inventory_tax_amount: 0,
    total_deduction_cost: 0,
  });

  const [taxDetailsData, setTaxDetailsData] = useState({
    tax_data: {},
  });

  // Add useEffect to fetch taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details.json?token=${token}`
        );
        // console.log("Taxes response:", response.data);
        if (response.data && response.data.taxes) {
          setTaxes(response.data.taxes);
        }
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setTaxes([]);
      }
    };

    fetchTaxes();
  }, []);

  // Convert taxes to options format with null check
  const taxOptions =
    taxes && Array.isArray(taxes) && taxes.length > 0
      ? taxes.map((tax) => ({
        value: tax.id,
        label: tax.name,
      }))
      : [];

  // console.log("Tax options:", taxOptions); // Add this for debugging

  // action dropdown
  const actionDropdown = () => {
    setactionDetails(!actionDetails);
  };
  //   modal

  // const closeSelectPOModal = () => setselectPOModal(false);

  const openSelectGRNModal = () => setselectGRNModal(true);
  const closeSelectGRNModal = () => setselectGRNModal(false);

  const closeAttachThreeModal = () => setattachThreeModal(false);

  const [showRows, setShowRows] = useState(true);

  // company project subproject api

  // Add New Row

  // Add new state variables for API data
  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [purchaseOrders, setPurchaseOrders] = useState([]);
  // const [selectedPO, setSelectedPO] = useState(null);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [selectedGRNs, setSelectedGRNs] = useState([]);


  const openSelectPOModal = () => {
    setselectPOModal(true);
  };

  const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

  // Add this array at the top of your component
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

  // // Add this at the top with other state declarations
  // const getFormattedDate = () => {
  //   const today = new Date();
  //   const day = String(today.getDate()).padStart(2, "0");
  //   const month = String(today.getMonth() + 1).padStart(2, "0");
  //   const year = today.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // // Add this useEffect to ensure date is set and maintained
  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     invoiceDate: getFormattedDate(),
  //   }));
  // }, []); // Empty dependency array means this runs once on mount

  // First, modify the getFormattedDate function to support both display and API formats
  const getFormattedDate = (forAPI = false) => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return forAPI
      ? `${year}-${month}-${day}` // API format: YYYY-MM-DD
      : `${day}-${month}-${year}`; // Display format: DD-MM-YYYY
  };
  // Add a helper function to convert date format
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return getFormattedDate(true); // Return today's date in YYYY-MM-DD if no date provided

    try {
      const [day, month, year] = dateStr.split("-");
      if (year && month && day) {
        return `${year}-${month}-${day}`;
      }
      return getFormattedDate(true); // Fallback to today's date
    } catch (error) {
      console.error("Error converting date:", error);
      return getFormattedDate(true); // Fallback to today's date
    }
  };

  // Update the useEffect
  //
  useEffect(() => {
    if (!formData.invoiceDate) {
      setFormData((prev) => ({
        ...prev,
        invoiceDate: getFormattedDate(),
      }));
    }
  }, []);

  // Update the handleSubmit payload section

  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: "",
    poValue: "",
    gstin: "",
    pan: "",
    invoiceNumber: "",
    invoiceDate: getFormattedDate(), // Initial date
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
    status: "",
    roundOffAmount: "",
  });

  const [billEntryOptions, setBillEntryOptions] = useState([]);
  const [selectedBillEntry, setSelectedBillEntry] = useState(null);
  // ...existing code...
  const [supplierName, setSupplierName] = useState("");
  const [displayCompany, setDisplayCompany] = useState("");
  const [displayProject, setDisplayProject] = useState("");
  const [displaySite, setDisplaySite] = useState("");
  const [displayCompanyId, setDisplayCompanyId] = useState(null);
  const [displayProjectId, setDisplayProjectId] = useState(null);
  const [displaySiteId, setDisplaySiteId] = useState(null);

  // Add this helper function if date format conversion is needed
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      // Handle ISO date string from API
      if (dateString.includes("T")) {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      }

      // Handle DD/MM/YYYY format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      // Handle DD-MM-YYYY format
      if (dateString.includes("-")) {
        const [day, month, year] = dateString.split("-");
        if (year && month && day) {
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }

      return "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // useEffect(() => {
  //   const fetchBillEntries = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://marathon.lockated.com/bill_bookings/bill_entry_list?token=${token}"
  //       );
  //       if (response.data && Array.isArray(response.data.be_list)) {
  //         setBillEntryOptions(
  //           response.data.be_list.map((item) => ({
  //             value: item.value,
  //             label: item.name,
  //           }))
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching bill entries:", error);
  //     }
  //   };
  //   fetchBillEntries();
  // }, []);

  // ...existing imports...
  // Add this useEffect after your billEntryOptions and selectedBillEntry state

  // useEffect(() => {
  //   const fetchAndSelectBillEntry = async () => {
  //     if (id) {
  //       try {
  //         // First fetch bill entry details
  //         const response = await axios.get(
  //           `${baseURL}bill_entries/${id}?token=${token}`
  //         );

  //         // Get bill entry options
  //         const billEntryResponse = await axios.get(
  //           `${baseURL}bill_bookings/bill_entry_list?token=${token}`
  //         );

  //         if (
  //           billEntryResponse.data &&
  //           Array.isArray(billEntryResponse.data.be_list)
  //         ) {
  //           setBillEntryOptions(
  //             billEntryResponse.data.be_list.map((item) => ({
  //               value: item.value,
  //               label: item.name,
  //             }))
  //           );

  //           // Find and set the matching bill entry option
  //           const matchingEntry = billEntryResponse.data.be_list.find(
  //             (item) => item.value === parseInt(id)
  //           );
  //           if (matchingEntry) {
  //             setSelectedBillEntry({
  //               value: matchingEntry.value,
  //               label: matchingEntry.name,
  //             });
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching bill entry:", error);
  //       }
  //     }
  //   };

  //   fetchAndSelectBillEntry();
  // }, [id]);

  useEffect(() => {
    const fetchAndSelectBillEntry = async () => {
      try {
        // Always fetch bill entry options
        const billEntryResponse = await axios.get(
          `${baseURL}bill_bookings/bill_entry_list?token=${token}`
        );

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
            // First fetch specific bill entry details
            const response = await axios.get(
              `${baseURL}bill_entries/${id}?token=${token}`
            );

            // Find and set the matching bill entry option
            const matchingEntry = billEntryResponse.data.be_list.find(
              (item) => item.value === parseInt(id)
            );

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
  // Rest of your component code...

  useEffect(() => {
    if (selectedBillEntry && selectedBillEntry.value) {
      const fetchBillEntryDetails = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/bill_entries/${selectedBillEntry.value}?token=${token}`
          );
          const data = response.data;

          setFormData((prev) => ({
            ...prev,
            poNumber: data.po_number || data.purchase_order?.po_number || "",
            poValue: data.purchase_order?.total_value || "",
            gstin: data.gstin || "",
            pan: data.pan_no || "",
            pms_supplier_id: data.pms_supplier_id || null, // <-- Add this line
            invoiceAmount: data.bill_amount || "", // <-- Add this line

            totalAmount: data.bill_amount || "", // <-- Add this line
            invoiceNumber: data.bill_no || "", // Auto-populate from bill_no
            paymentDueDate: formatDateForInput(data.due_date) || "",

            // data.due_date || "", // Add this line to get due date
          }));

          setSupplierName(data.supplier_name || "");
          setDisplayCompany(data.company_name || "");
          setDisplayProject(data.project_name || "");
          setDisplaySite(data.site_name || "");
          setDisplayCompanyId(data.company_id || null);
          setDisplayProjectId(data.project_id || null);
          setDisplaySiteId(data.site_id || null);

          // Fetch PO GRN details using purchase_order.id
          if (data.purchase_order?.id) {
            const grnResponse = await axios.get(
              `${baseURL}/purchase_orders/grn_details.json?token=${token}&page=1&per_page=10&q[id_in]=${data.purchase_order.id}`
            );

            // Set the selected PO with GRN materials
            const poWithGrn = {
              ...data.purchase_order,
              grn_materials:
                grnResponse.data.purchase_orders[0]?.grn_materials || [],
              gstin: data.gstin,
              pan: data.pan_no,
              due_date: data.due_date, // Add this line
            };
            setSelectedPO(poWithGrn);

            // Reset selected GRNs instead of auto-selecting them
            setSelectedGRNs([]);
          } else {
            setSelectedPO({
              id: data.purchase_order?.id,
              po_number: data.purchase_order?.po_number,
              po_date: data.purchase_order?.po_date,
              total_value: data.purchase_order?.total_value,
              po_type: data.purchase_order?.po_type,
              gstin: data.gstin,
              pan: data.pan_no,
              due_date: data.purchase_order?.due_date, // Add this line
              grn_materials: [],
            });
            setSelectedGRNs([]);
          }
        } catch (error) {
          console.error("Error fetching bill entry or PO GRN details:", error);
        }
      };
      fetchBillEntryDetails();
    }
  }, [selectedBillEntry]);

  useEffect(() => {
    if (!selectedBillEntry) {
      setFormData((prev) => ({
        ...prev,
        poNumber: "",
        poDate: "",
        poValue: "",
        gstin: "",
        pan: "",
        invoiceNumber: "",
        invoiceDate: "",
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
      }));
      setSupplierName("");
      setSelectedPO(null);
      setSelectedGRN(null);
      setSelectedGRNs([]);
      setPendingAdvances([]);
      setCreditNotes([]);
      setDebitNotes([]);
    }
  }, [selectedBillEntry]);

  // Handle GRN selection
  const handleGRNSelect = (grn) => {
    setSelectedGRN(grn);
    setFormData((prev) => ({
      ...prev,
      baseCost: grn.base_cost,
      netTaxes: grn.net_taxes,
      netCharges: grn.net_charges,
      allInclusiveCost: grn.all_inc_tax,
      charges: grn.addition_tax_charges || [],
      deductions: grn.deduction_taxes || [],
    }));
  };

  // Handle GRN checkbox selection
  const handleGRNCheckboxSelect = (grn) => {
    setSelectedGRNs((prev) => {
      const isSelected = prev.some((g) => g.id === grn.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== grn.id);
      } else {
        return [...prev, grn];
      }
    });
  };
  const areAllGRNsSelected =
    selectedPO &&
    Array.isArray(selectedPO.grn_materials) &&
    selectedPO.grn_materials.length > 0 &&
    selectedGRNs.length === selectedPO.grn_materials.length;

  // Handler for header checkbox
  const handleSelectAllGRNs = (e) => {
    if (e.target.checked) {
      setSelectedGRNs(selectedPO.grn_materials);
    } else {
      setSelectedGRNs([]);
    }
  };

  // Handle GRN submission
  const handleGRNSubmit = () => {
    // setSelectedGRN(selectedGRNs[0]); // Set the first selected GRN as the main selected GRN
    closeSelectGRNModal();
  };

  // Render GRN table in modal
  const renderGRNTable = () => {
    if (!selectedPO || !Array.isArray(selectedPO.grn_materials)) return null;

    return (
      <div className="tbl-container  mt-3">
        <table className="w-100">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={areAllGRNsSelected}
                  onChange={handleSelectAllGRNs}
                />
              </th>
              <th>Material Name</th>
              <th>Material GRN Amount</th>
              <th>Certified Till Date</th>
              <th>Base cost</th>
              <th>Net Taxes</th>
              <th>Net Charges</th>
              <th className="text-start">All Inclusive Cost</th>
              <th className="text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedPO.grn_materials.map((grn, index) => (
              <tr key={grn.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGRNs.some((g) => g.id === grn.id)}
                    onChange={() => handleGRNCheckboxSelect(grn)}
                  />
                </td>
                <td>{grn.material_name}</td>
                <td>{grn.material_grn_amount}</td>
                <td>{grn.certified_till_date || "-"}</td>
                <td>{grn.base_cost}</td>
                <td>{grn.net_taxes}</td>
                <td>{grn.net_charges}</td>
                <td>{grn.all_inc_tax}</td>
                <td>
                  <button
                    className="btn btn-light p-0 border-0"
                    onClick={() => {
                      handleGRNSelect(grn);
                      setattachThreeModal(true);
                    }}
                  >
                    Taxes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add PO Type options
  const poTypeOptions = [
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ];

  // const [selectedPOType, setSelectedPOType] = useState(null);
  const [selectedPOType, setSelectedPOType] = useState({
    value: "Domestic",
    label: "Domestic",
  });

  // Add E-Invoice options
  const eInvoiceOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const [selectedEInvoice, setSelectedEInvoice] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleTaxChange = (selectedOption) => {
    console.log("Selected tax:", selectedOption);
    setSelectedTax(selectedOption);
    if (selectedOption && selectedOption.value) {
      setFormData((prev) => ({
        ...prev,
        tax: selectedOption.value,
        taxName: selectedOption.label,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        tax: "",
        taxName: "",
      }));
    }
  };

  // Add null check for selectedTax in the SingleSelector
  <SingleSelector
    options={taxOptions}
    value={selectedTax || null}
    onChange={handleTaxChange}
    placeholder="Select Tax"
    isDisabled={isLoading}
  />;

  // Add percentage options for tax/charges
  const percentageOptions = [
    { value: "1", label: "1%" },
    { value: "2", label: "2%" },
    { value: "3", label: "3%" },
  ];

  // Add useEffect to fetch tax deduction data when GRNs change
  useEffect(() => {
    const fetchTaxDeductionData = async () => {
      if (selectedGRNs.length > 0) {
        try {
          const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/deduction_data?grns=[${grnIds.join(
              ","
            )}]&token=${token}`
          );
          setTaxDeductionData(response.data);
        } catch (error) {
          console.error("Error fetching tax deduction data:", error);
        }
      }
    };

    fetchTaxDeductionData();
  }, [selectedGRNs]);

  // Add useEffect to fetch tax details data when GRNs change
  // useEffect(() => {
  //   const fetchTaxDetailsData = async () => {
  //     if (selectedGRNs.length > 0) {
  //       try {
  //         const grnIds = selectedGRNs.map((grn) => grn.id);
  //         const response = await axios.get(
  //           `${baseURL}bill_bookings/taxes_data?grns=[${grnIds.join(
  //             ","
  //           )}]&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
  //         );
  //         setTaxDetailsData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching tax details data:", error);
  //       }
  //     }
  //   };

  //   fetchTaxDetailsData();
  // }, [selectedGRNs]);
  useEffect(() => {
    const fetchTaxDetailsData = async () => {
      if (selectedGRNs.length > 0) {
        try {
          const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/taxes_data?grns=[${grnIds.join(
              ","
            )}]&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
          );
          setTaxDetailsData({
            tax_data: response.data?.tax_data || {}, // Add null check and default empty object
          });
        } catch (error) {
          console.error("Error fetching tax details data:", error);
          setTaxDetailsData({ tax_data: {} }); // Set empty object on error
        }
      } else {
        setTaxDetailsData({ tax_data: {} }); // Reset to empty object when no GRNs selected
      }
    };

    fetchTaxDetailsData();
  }, [selectedGRNs]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("status chnage:", formData.status)
  const handleSubmit = async () => {




    if (
      // !selectedCompany ||
      // !selectedProject ||
      // !selectedSite ||
      !selectedPO ||
      selectedGRNs.length === 0 ||
      !formData.invoiceNumber || // Invoice Number mandatory
      !formData.invoiceAmount // Invoice Amount mandatory
    ) {
      // alert("Please fill in all required fields");
      // return;
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (
      parseFloat(otherDeductions) > 0 &&
      !formData.otherDeductionRemarks?.trim()
    ) {
      toast.error("Please provide remarks for Other Deductions", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Add validation for other additions remark
    if (
      parseFloat(otherAdditions) > 0 &&
      !formData.otherAdditionRemarks?.trim()
    ) {
      toast.error("Please provide remarks for Other Additions", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }


    // Invoice amount check
    const baseCost = getSelectedGRNsBaseCost();
    const allInclusiveCost = getSelectedGRNsAllIncTax();
    const otherDeduction = parseFloat(otherDeductions) || 0;
    const otherAddition = parseFloat(otherAdditions) || 0;
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    const invoiceAmount = parseFloat(formData.invoiceAmount) || 0;
    const payableAmount = parseFloat(calculateAmountPayable()) || 0;
    const retentionAmount = parseFloat(calculateRetentionAmount()) || 0;

    if (invoiceAmount < payableAmount) {
      // alert("Invoice Amount should not be less than Payable Amount.");
      // return;
      toast.error("Invoice Amount should not be less than Payable Amount.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const advance_note_adjustment = selectedAdvanceNotes.map((note) => ({
      id: note.id,
      value: parseFloat(note.this_recovery) || 0,
    }));
    // Build debit and credit note adjustment arrays
    const debit_note_adjustment = selectedDebitNotes.map((note) => ({
      id: note.id,
      value: parseFloat(note.this_recovery) || 0,
    }));
    const credit_note_adjustment = selectedCreditNotes.map((note) => ({
      id: note.id,
      value: parseFloat(note.this_recovery) || 0,
    }));

    setLoading(true);


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

    try {
      const payload = {
        bill_booking: {
          // company_id: selectedCompany?.value || null,
          // site_id: selectedSite?.value || null,
          // project_id: selectedProject?.value || null,
          company_id: displayCompanyId,
          site_id: displaySiteId,
          project_id: displayProjectId,
          pms_supplier_id: formData.pms_supplier_id || null,
          bill_entry_id: selectedBillEntry?.value, // Add this line
          invoice_number: formData.invoiceNumber,
          einvoice: selectedEInvoice?.value === "yes",
          // inventory_date: convertDateFormat(formData.invoiceDate),
          // // Convert to YYYY-MM-DD for API,
          inventory_date: convertDateFormat(
            formData.invoiceDate || getFormattedDate()
          ), // Add fallback
          invoice_amount: parseFloat(formData.invoiceAmount),
          type_of_certificate: formData.typeOfCertificate,
          department_id: formData.departmentId,
          base_cost: baseCost,
          all_inclusive_cost: allInclusiveCost,
          other_deductions: otherDeduction,
          other_additions: otherAddition,
          total_amount: totalAmount,
          other_deduction_remarks: formData.otherDeductionRemarks,
          other_addition_remarks: formData.otherAdditionRemarks,
          retention_per: parseFloat(formData.retentionPercentage) || 0,
          retention_amount: retentionAmount,
          total_value: taxDeductionData.total_material_cost,
          payable_amount: payableAmount,
          remark: formData.remark || "",
          status: formData.status || "draft",
          po_type: "domestic",
          payee_name: formData.pms_supplier_id || null,
          payment_mode: formData.paymentMode,
          payment_due_date: formData.paymentDueDate,
          created_by_id: 1,
          current_advance_deduction:
            parseFloat(formData.currentAdvanceDeduction) || 0,
          billing_po: [
            {
              id: selectedPO.id,
              grn_ids: selectedGRNs.map((grn) => grn.id),
            },
          ],
          // attachments: documentRows.map((row) => ({
          //   filename: row.upload?.filename || "",
          //   content: row.upload?.content || "",
          //   content_type: row.upload?.content_type || "",
          // })),
           attachments: attachments.length > 0 ? attachments : null,
          debit_note_adjustment,
          credit_note_adjustment,
          advance_note_adjustment,
        },
      };

      console.log("Payload for API:", payload);

      const response = await axios.post(
        `${baseURL}bill_bookings?token=${token}`,
        payload
      );

      if (response.data) {
        // alert("Bill booking created successfully!");
        // setLoading(false);
        // navigate("/bill-booking-list"); // Redirect to bill-booking-list
        // Reset form or redirect as needed
        toast.success("Bill booking created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Add delay before navigation
        setTimeout(() => {
          setLoading(false);
          navigate(`/bill-booking-list?token=${token}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating bill booking:", error);
      // alert("Failed to create bill booking. Please try again.");
      toast.error("Failed to create bill booking. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  

  const [otherDeductions, setOtherDeductions] = useState(0);
  const [otherAdditions, setOtherAdditions] = useState(0);
  const [taxDetailsTotal, setTaxDetailsTotal] = useState(0);

  // Function to calculate the total dynamically
  const calculateTaxDetailsTotal = () => {
    const baseCost = taxDeductionData.total_material_cost || 0;
    const taxAmount = Object.values(taxDetailsData.tax_data).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
    const total =
      baseCost +
      taxAmount +
      parseFloat(otherAdditions || 0) -
      parseFloat(otherDeductions || 0);
    setTaxDetailsTotal(total);
  };

  // Update total whenever deductions or additions change
  useEffect(() => {
    calculateTaxDetailsTotal();
  }, [otherDeductions, otherAdditions, taxDeductionData, taxDetailsData]);

  // Update rows when selectedGRN changes
  useEffect(() => {
    const defaultRows = [
      {
        id: 1,
        type: "Handling Charges",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
      {
        id: 2,
        type: "Other charges",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
      {
        id: 3,
        type: "Freight",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
    ];

    if (
      selectedGRN?.addition_tax_charges &&
      selectedGRN.addition_tax_charges.length > 0
    ) {
      const taxCharges = selectedGRN.addition_tax_charges;
      setRows((prevRows) => {
        // Create a map of existing rows by type
        const existingRows = new Map(prevRows.map((row) => [row.type, row]));

        // Update or add rows based on API response
        const updatedRows = taxCharges.map((tax, index) => ({
          id: index + 1,
          type: tax.tax_name,
          percentage: tax.tax_charge_per_uom || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          isEditable: ![
            "Handling Charges",
            "Other charges",
            "Freight",
          ].includes(tax.tax_name),
          addition: true,
        }));

        // Add any default rows that weren't in the API response
        defaultRows.forEach((row) => {
          if (!existingRows.has(row.type)) {
            updatedRows.push(row);
          }
        });

        return updatedRows;
      });
    } else {
      // If no tax charges in API, show default rows
      setRows(defaultRows);
    }
  }, [selectedGRN]);

  // Update deductionRows when selectedGRN changes
  useEffect(() => {
    if (
      selectedGRN?.deduction_taxes &&
      selectedGRN.deduction_taxes.length > 0
    ) {
      const deductionTaxes = selectedGRN.deduction_taxes;
      setDeductionRows((prevRows) => {
        return deductionTaxes.map((tax, index) => ({
          id: index + 1,
          type: tax.tax_name,
          percentage: tax.tax_charge_per_uom || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          addition: false,
        }));
      });
    }
  }, [selectedGRN]);

  // Add new state for tax percentages
  const [taxPercentages, setTaxPercentages] = useState({
    SGST: [],
    CGST: [],
    IGST: [],
    TDS: [],
  });

  // Add useEffect to fetch tax percentages
  useEffect(() => {
    const fetchTaxPercentages = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/rfq/events/tax_percentage?token=${token}`
        );

        if (response.data) {
          const formattedData = {
            SGST: [],
            CGST: [],
            IGST: [],
            TDS: [],
          };

          const taxData = Array.isArray(response.data)
            ? response.data
            : [response.data];

          taxData.forEach((tax) => {
            if (tax.tax_name === "SGST") {
              formattedData.SGST = tax.percentage.map((p) => ({
                value: `SGST ${p}%`,
                percentage: p,
              }));
            } else if (tax.tax_name === "CGST") {
              formattedData.CGST = tax.percentage.map((p) => ({
                value: `CGST ${p}%`,
                percentage: p,
              }));
            } else if (tax.tax_name === "IGST") {
              formattedData.IGST = tax.percentage.map((p) => ({
                value: `IGST ${p}%`,
                percentage: p,
              }));
            } else if (tax.tax_name === "TDS") {
              formattedData.TDS = tax.percentage.map((p) => ({
                value: `TDS ${p}%`,
                percentage: p,
              }));
            }
          });

          setTaxPercentages(formattedData);
        }
      } catch (error) {
        console.error("Error fetching tax percentages:", error);
      }
    };

    fetchTaxPercentages();
  }, []);

  const [pendingAdvances, setPendingAdvances] = useState([]);
  const [pendingAdvances2, setPendingAdvances2] = useState([]);

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
  }, [selectedPO, formData.pms_supplier_id, formData.status]);

  useEffect(() => {
    const fetchPendingAdvances = async () => {
      if (selectedPO?.id) {
        try {
          const response = await axios.get(
            `${baseURL}advance_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&token=${token}`
          );
          setPendingAdvances2(response.data.advance_notes || []);
        } catch (error) {
          console.error("Error fetching pending advances:", error);
          setPendingAdvances2([]);
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
      alert("Recovery amount cannot exceed advance amount.");
      // return false;
      // toast.error("Recovery amount cannot exceed advance amount", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
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

  const [creditNotes, setCreditNotes] = useState([]);
  const [debitNotes, setDebitNotes] = useState([]);
  // Add these state variables at the top
  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [debitNoteModal, setDebitNoteModal] = useState(false);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);
  const [selectedDebitNotes, setSelectedDebitNotes] = useState([]);

  // Add these handlers
  const handleCreditNoteSelect = (note) => {
    setSelectedCreditNotes((prev) => {
      const isSelected = prev.some((n) => n.id === note.id);
      if (isSelected) {
        return prev.filter((n) => n.id !== note.id);
      } else {
        return [...prev, note];
      }
    });
  };

  const handleDebitNoteSelect = (note) => {
    setSelectedDebitNotes((prev) => {
      const isSelected = prev.some((n) => n.id === note.id);
      if (isSelected) {
        return prev.filter((n) => n.id !== note.id);
      } else {
        return [...prev, note];
      }
    });
  };

  // Add modal toggle handlers
  const openCreditNoteModal = () => setCreditNoteModal(true);
  const closeCreditNoteModal = () => setCreditNoteModal(false);
  const openDebitNoteModal = () => setDebitNoteModal(true);
  const closeDebitNoteModal = () => setDebitNoteModal(false);

  useEffect(() => {
    const fetchCreditAndDebitNotes = async () => {
      if (formData.pms_supplier_id) {
        try {
          // Fetch Credit Notes
          // const creditResponse = await axios.get(
          //   `${baseURL}credit_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&q[status_eq]=proceed&token=${token}`
          // );
          // setCreditNotes(creditResponse.data.credit_notes || []);

          // Fetch Debit Notes
          const debitResponse = await axios.get(
            `${baseURL}debit_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&q[status_eq]=proceed&token=${token}`
          );
          setDebitNotes(debitResponse.data.debit_notes || []);
          console.log("Supplier ID for debit notes:", formData.pms_supplier_id);
        } catch (error) {
          console.error("Error fetching credit or debit notes:", error);
          // setCreditNotes([]);
          setDebitNotes([]);
        }
      }
    };

    fetchCreditAndDebitNotes();
  }, [selectedPO, formData.pms_supplier_id]);

  // Add these handler functions if not already present

  // const handleSelectAllCreditNotes = (e) => {
  //   if (e.target.checked) {
  //     setSelectedCreditNotes(creditNotes);
  //   } else {
  //     setSelectedCreditNotes([]);
  //   }
  // };

  const handleSelectAllDebitNotes = (e) => {
    if (e.target.checked) {
      setSelectedDebitNotes(debitNotes);
    } else {
      setSelectedDebitNotes([]);
    }
  };

  // const validateCreditRecovery = (note, value) => {
  //   const recovery = parseFloat(value) || 0;
  //   const creditAmount = parseFloat(note.credit_note_amount) || 0;

  //   // const outstandingAmount = parseFloat(note.outstanding_current_date) || 0;
  //   if (recovery > creditAmount) {
  //     alert("Recovery amount cannot exceed credit amount");
  //     return false;
  //   }
  //   return true;
  // };

  const validateDebitRecovery = (note, value) => {
    // const recovery = parseFloat(value) || 0;
    const recovery = (parseFloat(value) || 0) + (parseFloat(note.recovered_amount) || 0);
    const debitAmount = parseFloat(note.debit_note_amount) || 0;
    // const outstandingAmount = parseFloat(note.outstanding_current_date) || 0;
    if (recovery > debitAmount) {
      alert("Recovery amount cannot exceed  debit amount");
      return false;
    }
    return true;
  };

  // Add these helper functions above your return statement

  const calculateTotalAmount = () =>
    selectedGRNs.reduce(
      (acc, grn) => acc + (parseFloat(grn.all_inc_tax) || 0),
      0
    );

  const calculateAmountPayable = () => {
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    const retentionAmount = parseFloat(calculateRetentionAmount()) || 0;
    const otherDed = parseFloat(otherDeductions) || 0;
    const otherAdd = parseFloat(otherAdditions) || 0;
    // const creditAdjustment = parseFloat(calculateCreditNoteAdjustment()) || 0;
    const debitAdjustment = parseFloat(calculateDebitNoteAdjustment()) || 0;
    const advanceAdjustment = parseFloat(calculateTotalAdvanceRecovery()) || 0; // Add this line

    return (
      totalAmount -
      retentionAmount -
      otherDed +
      otherAdd +
      // creditAdjustment -
      debitAdjustment -
      advanceAdjustment
    ) // Subtract advance adjustment
      .toFixed(2);
  };

  // ...existing code...

  // 1. Add a function to calculate updated values based on rows
  const calculateUpdatedGRNValues = () => {
    let netCharges = 0;
    let netTaxes = 0;
    let baseCost = parseFloat(selectedGRN?.base_cost) || 0;

    rows.forEach((row) => {
      if (["Handling Charges", "Other charges", "Freight"].includes(row.type)) {
        netCharges += parseFloat(row.amount) || 0;
      }
      if (["IGST", "SGST", "CGST"].includes(row.type)) {
        netTaxes += parseFloat(row.amount) || 0;
      }
    });

    // All Inclusive Cost = base cost + net charges + net taxes
    const allIncTax = baseCost + netCharges + netTaxes;

    return {
      net_charges: netCharges.toFixed(2),
      net_taxes: netTaxes.toFixed(2),
      all_inc_tax: allIncTax.toFixed(2),
    };
  };

  // 2. Add a handler for submitting the Tax & Charges modal
  // ...existing code...

  const handleTaxChargesSubmit = () => {
    if (!selectedGRN) return;

    const updatedValues = calculateUpdatedGRNValues();
    const updatedGRN = {
      ...selectedGRN,
      base_cost: selectedGRN.base_cost, // or the new value if edited
      net_charges: updatedValues.net_charges,
      net_taxes: updatedValues.net_taxes,
      all_inc_tax: updatedValues.all_inc_tax,
      tax_charge_rows: rows,
    };
    setSelectedGRNs((prev) =>
      prev.map((grn) => (grn.id === selectedGRN.id ? updatedGRN : grn))
    );
    setSelectedGRN(updatedGRN);

    // Close both modals
    setattachThreeModal(false); // Close Tax & Charges modal
    closeSelectGRNModal(); // Close GRN Information modal
  };

  // ...existing code...

  const getSelectedGRNsBaseCost = () =>
    selectedGRNs.reduce(
      (sum, grn) => sum + (parseFloat(grn.base_cost) || 0),
      0
    );

  const getSelectedGRNsAllIncTax = () =>
    selectedGRNs.reduce(
      (sum, grn) => sum + (parseFloat(grn.all_inc_tax) || 0),
      0
    );

  // ...existing code...

  // Helper to calculate retention amount
  const calculateRetentionAmount = () => {
    const percentage = parseFloat(formData.retentionPercentage) || 0;
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    return ((percentage / 100) * totalAmount).toFixed(2);
  };

  // Add these calculation functions after the existing calculation functions
  const calculateCreditNoteAdjustment = () => {
    return selectedCreditNotes
      .reduce((total, note) => {
        return total + (parseFloat(note.this_recovery) || 0);
      }, 0)
      .toFixed(2);
  };

  const calculateDebitNoteAdjustment = () => {
    return selectedDebitNotes
      .reduce((total, note) => {
        return total - (parseFloat(note.this_recovery) || 0);
      }, 0)
      .toFixed(2);
  };

  // Update the validatePositiveNumber function

  const validatePositiveNumber = (value) => {
    // Allow empty string to clear the field
    if (value === "") {
      return true;
    }
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  };

  console.log("selected po:", selectedPO)
  // Document attachment state and handlers for advanced modal
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
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section px-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Bill Booking</a>
          <h5 className="mt-3">Bill Booking</h5>
          <div className="row my-4 align-items-center container-fluid">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="row">
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
                    <div className="col-md-4">
                      <label htmlFor="event-no-select">Bill Entries</label>
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
                  )}
                  {withoutBillEntry && !withBillEntry && (
                    <>
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
                    </>
                  )}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <span style={{ color: "#8b0203" }}> *</span>
                      <input
                        className="form-control"
                        type="text"
                        // value={displayCompany || selectedPO?.company_name}
                        // value={withoutBillEntry ? selectedPO.company_name : displayCompany}
                        value={
                          withoutBillEntry && selectedPO
                            ? selectedPO.company_name
                            : withBillEntry
                              ? displayCompany
                              : ""
                        }

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
                        // value={displayProject }
                        value={
                          withoutBillEntry && selectedPO
                            ? selectedPO.project_name
                            : withBillEntry
                              ? displayProject
                              : ""
                        }

                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <label htmlFor="event-no-select"> SubProject</label>
                    <span style={{ color: "#8b0203" }}> *</span>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        // value={displaySite}
                        value={
                          withoutBillEntry && selectedPO
                            ? selectedPO.site_name
                            : withBillEntry
                              ? displaySite
                              : ""
                        }
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4  mt-2">
                    <div className="form-group">
                      <label>Supplier</label>
                      <span style={{ color: "#8b0203" }}> *</span>
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
                        // value={supplierName|| selectedPO?.supplier_name}
                        value={
                          withoutBillEntry && selectedPO
                            ? selectedPO.supplier_name
                            : withBillEntry
                              ? supplierName
                              : ""
                        }
                        disabled
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-1 pt-2 mt-4">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div> */}

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Type</label>
                      <span style={{ color: "#8b0203" }}> *</span>
                      <SingleSelector
                        options={poTypeOptions}
                        className="form-control form-select"
                        value={selectedPOType}
                        onChange={(selected) => setSelectedPOType(selected)}
                      />
                    </div>
                  </div>
                  {withBillEntry && !withoutBillEntry && (
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>PO Number</label>

                        <input
                          className="form-control"
                          type="text"
                          value={formData.poNumber}
                          disabled
                        />
                      </div>
                    </div>
                  )}


                  <div className="d-flex justify-content-between mt-3 me-2">
                    <h5 className=" ">PO Details</h5>
                  </div>

                  <div className="tbl-container mx-1 mt-3">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th className="text-start">Sr. No.</th>
                          <th className="text-start">Po Display No</th>
                          <th className="text-start">PO Date</th>
                          <th className="text-start">PO Value</th>
                          <th className="text-start">PO Type</th>
                          <th className="text-start">PO Fright</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">1</td>
                          <td className="text-start">
                            {selectedPO?.po_number || "-"}
                          </td>
                          <td className="text-start">
                            {/* {selectedPO?.po_date || "-"} */}
                             {selectedPO?.po_date
                              ? new Date(selectedPO?.po_date).toLocaleDateString("en-GB").split("/").join("-")
                              : "-"}
                          </td>
                          <td className="text-start">
                            {selectedPO?.total_value || "-"}
                          </td>
                          <td className="text-start">
                            {selectedPO?.po_type || "-"}
                          </td>
                          <td className="text-start">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Number</label>
                      <span style={{ color: "#8b0203" }}> *</span>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceNumber: e.target.value,
                          }))
                        }
                        disabled={!withoutBillEntry}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>E-Invoice</label>
                      <SingleSelector
                        options={eInvoiceOptions}
                        className="form-control form-select"
                        value={selectedEInvoice}
                        onChange={(selected) => setSelectedEInvoice(selected)}
                      />
                    </div>
                  </div>
                  {withBillEntry && !withoutBillEntry && (
                    <div className="col-md-4 mt-3">
                      <div className="form-group">
                        <label>Invoice Date</label>
                        <input
                          className="form-control"
                          type="text"
                          // type={!withoutBillEntry ? "text" : "date"}
                          value={formData.invoiceDate || getFormattedDate()} // Fallback to current date if empty
                          readOnly
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     invoiceDate: e.target.value,
                        //   }))
                        // }
                        // disabled={!withoutBillEntry}
                        />
                      </div>
                      {/* {console.log(".........invoice date:",formData.invoiceDate )} */}
                    </div>
                  )}
                  {withoutBillEntry && !withBillEntry && (
                    <div className="col-md-4 mt-3">
                      <div className="form-group">
                        <label>Invoice Date</label>
                        <input
                          className="form-control"
                          type="date"
                          // type={!withoutBillEntry ? "text" : "date"}
                          value={formData.invoiceDate} // Fallback to current date if empty
                          // readOnly
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              invoiceDate: e.target.value,
                            }))
                          }
                        // disabled={!withoutBillEntry}
                        />
                      </div>
                    </div>
                  )}
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Amount</label>
                      <span style={{ color: "#8b0203" }}> *</span>
                      {/* <input
                        className="form-control"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceAmount: e.target.value,
                            // totalAmount: e.target.value, // Keep in sync
                          }))
                        }
                      /> */}
                      <input
                        className="form-control"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (validatePositiveNumber(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              invoiceAmount: value,
                            }));
                          }
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>PO Value</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.poValue}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-3">
                    <div className="form-group">
                      <label>GSTIN</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.gstin}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-1 pt-4 mt-3">
                    <p className="mt-2 text-decoration-underline">Verify</p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PAN</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.pan}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Type of Certificate</label>
                      <SingleSelector
                        options={[
                          { value: "Regular", label: "Regular" },
                          { value: "Retention", label: "Retention" },
                        ]}
                        className="form-control form-select"
                        value={
                          formData.typeOfCertificate
                            ? {
                              value: formData.typeOfCertificate,
                              label: formData.typeOfCertificate,
                            }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            typeOfCertificate: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Type"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">GRN Details</h5>
                  <div
                    className="card-tools d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#RevisionModal"
                  >
                    <button
                      className="purple-btn2 rounded-3"
                      data-bs-toggle="modal"
                      data-bs-target="#RevisionModal"
                      fdprocessedid="xn3e6n"
                      onClick={openSelectGRNModal}
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
                      <span>Select GRN</span>
                    </button>
                  </div>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Material Name</th>
                        <th className="text-start">Material GRN Amount</th>
                        <th className="text-start">Certified Till Date</th>
                        <th className="text-start">Base Cost</th>
                        <th className="text-start">Net Taxes</th>
                        <th className="text-start">Net Charges</th>
                        <th className="text-start">Qty</th>
                        <th className="text-start">All Inclusive Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGRNs.map((grn, index) => (
                        <tr key={grn.id}>
                          <td className="text-start">{index + 1}</td>
                          <td className="text-start">{grn.material_name}</td>
                          <td className="text-start">{grn.all_inc_tax}</td>
                          <td className="text-start">
                            {grn.certified_till_date || "-"}
                          </td>
                          <td className="text-start">{grn.base_cost}</td>
                          <td className="text-start">{grn.net_taxes}</td>
                          <td className="text-start">{grn.net_charges}</td>
                          <td className="text-start">{grn.qty || "-"}</td>
                          <td className="text-start">{grn.all_inc_tax}</td>
                        </tr>
                      ))}
                      {/* <tr>
                        <th className="text-start">Total</th>
                        <td />
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.all_inc_tax) || 0),
                            0
                          )}
                        </td>
                        <td />
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.base_cost) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_taxes) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_charges) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) => acc + (parseFloat(grn.qty) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.all_inc_tax) || 0),
                            0
                          )}
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Notes</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project</th>
                        <th className="text-start">PO No.</th>
                        <th className="text-start">Advance Number</th>
                        <th className="text-start">Advance Amount</th>
                        <th className="text-start">Status</th>
                        <th className="text-start">Paid Ammount</th>
                        <th className="text-start">Adjusted Amount</th>
                        <th className="text-start">Balance Amount</th>
                        <th className="text-start">
                          Current Adjustment Amount
                        </th>
                        <th className="text-start">Net Amount</th>
                        <th className="text-start">Add Certificate No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAdvances2.length > 0 ? (
                        pendingAdvances2.map((advance, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {advance.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {advance.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_number || "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.status || "-"}
                            </td>
                            <td className="text-start">
                              {advance.paid_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.recovered_amount || "0"}
                            </td>
                            {/* {console.log("advance recoverd:",advance.recovered_amount )} */}
                            <td className="text-start">
                              {advance.balance_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.current_adjustment || "-"}
                            </td>
                            <td className="text-start">
                              {advance.net_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.certificate_number || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="8">
                            No pending advances found.
                          </td>
                        </tr>
                      )}
                      {/* <tr>
                        <th className="text-start">Total</th>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr> */}
                    </tbody>
                  </table>

                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Debit Note No.</th>
                        <th className="text-start">PO No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Sub Project</th>
                        <th className="text-start">Status</th>
                        <th className="text-start">Debit Note Amount</th>
                        <th className="text-start">Recovery Till Date</th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Debit Note Reason Type</th>

                        <th className="text-start">This Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debitNotes.length > 0 ? (
                        debitNotes.map((note, index) => (
                          <tr key={note.id}>
                            <td className="text-start">
                              {note.debit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.site_name || note.sub_project_name || "-"}
                            </td>
                            <td className="text-start">{note.status || "-"}</td>
                            <td className="text-start">
                              {note.debit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovered_amount || "0"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>

                            <td className="text-start">
                              {note.this_recovery || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="12">
                            No debit notes available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Deduction:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">Taxable Amount</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Deduction Tax</td>
                        <td className="text-start">
                          {taxDeductionData.deduction_mor_inventory_tax_amount}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Total Deduction</td>
                        <td className="text-start">
                          {taxDeductionData.total_deduction_cost}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Payable Amount</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost -
                            taxDeductionData.deduction_mor_inventory_tax_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">Base Cost</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost}
                        </td>
                      </tr>
                      {/* {Object.entries(taxDetailsData.tax_data).map(
                        ([taxType, amount]) => (
                          <tr key={taxType}>
                            <td className="text-start">{taxType}</td>
                            <td className="text-start">{amount}</td>
                          </tr>
                        )
                      )} */}
                      {/* Replace the existing tax details mapping code with this: */}
                      {Object.entries(taxDetailsData?.tax_data || {}).map(
                        ([taxType, amount]) => (
                          <tr key={taxType}>
                            <td className="text-start">{taxType}</td>
                            <td className="text-start">{amount}</td>
                          </tr>
                        )
                      )}
                      {/* <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start">
                          {Object.values(taxDetailsData.tax_data).reduce(
                            (sum, value) => sum + (value || 0),
                            0
                          ) + taxDeductionData.total_material_cost}
                        </td>
                      </tr> */}
                      <tr>
                        <td className="text-start">Other Additions</td>
                        <td className="text-start">{otherAdditions}</td>
                      </tr>
                      <tr>
                        <td className="text-start">Other Deductions</td>
                        <td className="text-start">{otherDeductions}</td>
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start">{taxDetailsTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div> */}
                {/* <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax</th>
                        <th className="text-start">Tax Amount</th>
                        <th className="text-start">Tax Adjusted</th>
                        <th className="text-start">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start"> </td>
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project Name</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Advance Amount</th>
                        <th className="text-start">Advance Paid Till Date</th>
                        <th className="text-start">Debit Note for Advance</th>
                        <th className="text-start">Advance Outstanding</th>
                        <th className="text-start">
                          Current Advance Deduction
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start">Total</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Retention Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Retention Amount Payable</th>
                        <th className="text-start">Retention Amount Paid</th>
                        <th className="text-start">Retention Amount Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                <div className="d-flex justify-content-between mt-3 me-2">
                  {/* <h5 className=" ">Current advance deduction:</h5> */}
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Base Cost</label>
                      <input
                        className="form-control"
                        type="number"
                        // value={formData.currentAdvanceDeduction}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     currentAdvanceDeduction: e.target.value,
                        //   }))
                        // }  base cost should be grn seleted base cost
                        // placeholder="Enter advance deduction amount"
                        value={getSelectedGRNsBaseCost()}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>All Inclusive Cost</label>
                      <input
                        className="form-control"
                        type="number"
                        value={getSelectedGRNsAllIncTax()}
                        placeholder="Enter advance deduction amount"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 ">
                    <div className="form-group">
                      <label>Total Amount</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={selectedGRNs.reduce(
                        //   (acc, grn) =>
                        //     acc + (parseFloat(grn.all_inc_tax) || 0),
                        //   0
                        // )}
                        value={calculateTotalAmount()}
                        // value={formData.totalAmount}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     totalAmount: e.target.value,
                        //     invoiceAmount: e.target.value, // keep in sync
                        //   }))
                        // }
                        placeholder="Enter other addition amount"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Deduction Advance</label>
                      <input
                        className="form-control"
                        type="number"
                        // value={formData.currentAdvanceDeduction}
                        value={calculateTotalAdvanceRecovery()} // Changed this line
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currentAdvanceDeduction: e.target.value,
                          }))
                        }
                        placeholder="Enter advance deduction amount"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Debit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        value={Math.abs(calculateDebitNoteAdjustment())}
                        // value={calculateDebitNoteAdjustment()}
                        disabled
                        placeholder="Debit note adjustment amount"
                      />
                    </div>
                  </div>
                  {/* <h1 className="text-end">
                    ₹ {Math.abs(calculateDebitNoteAdjustment())}
                  </h1> */}

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label> Amount Payable</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={otherAdditions}
                        // onChange={(e) => setOtherAdditions(e.target.value)}
                        value={calculateAmountPayable()}
                        readOnly
                        placeholder="Enter other addition amount"
                        // amount payable should be total amount - retention amount
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <SingleSelector
                        options={paymentModeOptions}
                        className="form-control form-select"
                        value={
                          paymentModeOptions.find(
                            (opt) => opt.value === formData.paymentMode
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMode: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Payment Mode"
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Round Of Amount</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={otherAdditions}
                        // onChange={(e) => setOtherAdditions(e.target.value)}
                        placeholder="Enter other addition amount"
                        min="0"
                      />
                    </div>
                  </div> */}

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Favouring / Payee</label>
                      <input
                        className="form-control"
                        type="text"
                        // value={formData.payeeName}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     payeeName: e.target.value,
                        //   }))
                        value={supplierName}
                        disabled
                        placeholder="Enter payee name"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Due Date</label>
                      <input
                        className="form-control"
                        type="date"
                        // value={formData.paymentDueDate}
                        value={formData.paymentDueDate} // Keep the ISO format for the value
                        // value={
                        //   formData.paymentDueDate
                        //     ? new Date(
                        //         formData.paymentDueDate
                        //       ).toLocaleDateString("en-GB")
                        //     : ""
                        // }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentDueDate: e.target.value,
                          }))
                        }
                        disabled
                      />
                    </div>
                  </div>

                  {/* </div> */}
                  {/* <div className="row"> */}
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Deduction</label>
                      <input
                        className="form-control"
                        type="number"
                        // value={formData.otherDeductions}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     otherDeductions: e.target.value,
                        //   }))
                        // }
                        // value={otherDeductions}
                        value={otherDeductions === "0" ? "" : otherDeductions}
                        onChange={(e) => {
                          const value = e.target.value;
                          // if (validatePositiveNumber(value)) {
                          //   setOtherDeductions(value);
                          // }
                          if (validatePositiveNumber(value)) {
                            setOtherDeductions(value === "" ? "0" : value); // Set to "0" when cleared
                          }
                        }}
                        placeholder="Enter other deduction amount"
                      />
                    </div>
                  </div>
                  <div className="col-md-5 mt-2">
                    <div className="form-group">
                      <label>Other Deduction Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.otherDeductionRemarks}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherDeductionRemarks: e.target.value,
                          }))
                        }
                        placeholder="Enter other deduction remarks"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Addition</label>
                      {/* <input
                        className="form-control"
                        type="number"
                        value={formData.otherAdditions}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherAdditions: e.target.value,
                          }))
                        }
                        placeholder="Enter other addition amount"
                      /> */}
                      <input
                        className="form-control"
                        type="number"
                        // value={otherAdditions}
                        value={otherAdditions === "0" ? "" : otherAdditions}
                        onChange={(e) => {
                          const value = e.target.value;
                          // if (validatePositiveNumber(value)) {
                          //   setOtherAdditions(value);
                          // }
                          if (validatePositiveNumber(value)) {
                            setOtherAdditions(value === "" ? "0" : value); // Set to "0" when cleared
                          }
                        }}
                        placeholder="Enter other addition amount"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="col-md-5 mt-2">
                    <div className="form-group">
                      <label>Other Addition Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.otherAdditionRemarks}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherAdditionRemarks: e.target.value,
                          }))
                        }
                        placeholder="Enter other addition remarks"
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Credit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        value={calculateCreditNoteAdjustment()}
                        disabled
                        placeholder="Credit note adjustment amount"
                      />
                    </div>
                  </div> */}

                  {formData.typeOfCertificate === "Retention" && (
                    <>
                      <div className="col-md-4 mt-2">
                        <div className="form-group">
                          <label>Retention Percentage</label>
                          <input
                            className="form-control"
                            type="number"
                            value={formData.retentionPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (validatePositiveNumber(value)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  retentionPercentage: value,
                                }));
                              }
                            }}
                            placeholder="Enter retention percentage"
                            disabled
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mt-2">
                        <div className="form-group">
                          <label>Retention Amount</label>
                          <input
                            className="form-control"
                            type="number"
                            value={calculateRetentionAmount()}
                            disabled
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <SingleSelector
                        options={paymentModeOptions}
                        className="form-control form-select"
                        value={
                          paymentModeOptions.find(
                            (opt) => opt.value === formData.paymentMode
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMode: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Payment Mode"
                      />
                    </div>
                  </div> */}

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Certified Till Date</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Enter ..."
                        defaultValue={""}
                        value={formData.remark} // Bind to formData.remark
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            remark: e.target.value, // Update formData.remark
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Expected Payment Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Processed Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div> */}
                </div>
                {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Status</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div> */}
                {/* </div> */}
                <div className="d-flex justify-content-between mt-4 me-2">
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
                <div className="tbl-container mx-3 mt-3">
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

                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                  <button className="purple-btn2" onClick={openDebitNoteModal}>
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
                    <span>Select Debit Note</span>
                  </button>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Debit Note No.</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Debit Note Amount</th>
                        <th className="text-start">
                          Debit Note Recovery Till Date
                        </th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Debit Note Reason Type</th>
                        <th className="text-start" style={{ width: "200px" }}>
                          This Recovery
                        </th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      {debitNotes.length > 0 ? (
                        debitNotes.map((note, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {note.debit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.debit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovery_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>
                            <td className="text-start">
                              {note.this_recovery || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No debit notes found.
                          </td>
                        </tr>
                      )}
                    </tbody> */}
                    <tbody>
                      {selectedDebitNotes.length > 0 ? (
                        selectedDebitNotes.map((note, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {note.debit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.debit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovered_amount || "0"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>
                            {/* <td className="text-start">
                              {note.this_recovery || "-"}
                            </td> */}
                            <td className="text-start">
                              <input
                                type="number"
                                className="form-control"
                                value={note.this_recovery || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (validateDebitRecovery(note, value)) {
                                    setSelectedDebitNotes((prev) =>
                                      prev.map((n) =>
                                        n.id === note.id
                                          ? { ...n, this_recovery: value }
                                          : n
                                      )
                                    );
                                  }
                                }}
                                min="0"
                                max={note.debit_note_amount}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No debit notes selected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Credit Note</h5>
                  <button className="purple-btn2" onClick={openCreditNoteModal}>
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
                    <span>Select Credit Note</span>
                  </button>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Credit Note No.</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Credi Note Amount</th>
                        <th className="text-start">
                          Credit Note Recovery Till Date
                        </th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Credit Note Reason Type</th>
                        <th className="text-start">This Recovery</th>
                      </tr>
                    </thead>
                   
                    <tbody>
                      {selectedCreditNotes.length > 0 ? (
                        selectedCreditNotes.map((note, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {note.credit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.credit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovery_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>

                            <td className="text-start">
                              <input
                                type="number"
                                className="form-control"
                                value={note.this_recovery || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (validateCreditRecovery(note, value)) {
                                    setSelectedCreditNotes((prev) =>
                                      prev.map((n) =>
                                        n.id === note.id
                                          ? { ...n, this_recovery: value }
                                          : n
                                      )
                                    );
                                  }
                                }}
                                min="0"
                                max={note.credit_note_amount}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No credit notes selected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div> */}
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
                            className=" text-start text-decoration-underline"
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
              
              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                  value={formData.status || "draft"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                  <option value="proceed">Proceed</option>
                </select>
              </div>

              <div className="row mt-2 justify-content-end mb-5">
                <div className="col-md-2 mt-2">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleSubmit}
                  // disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              {/* <h5 className=" mt-3">Audit Log</h5> */}
              {/* <div className="pb-4 mb-4">
                <Table columns={auditLogColumns} data={auditLogData} />
              </div> */}
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
          <p>loading...</p>
        </div>
      )}
      {/* modal */}
      {/* 
      {/*  */}
      <Modal
        centered
        size="xl"
        show={selectGRNModal}
        onHide={closeSelectGRNModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>GRN Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <input
                  className="form-control"
                  type="text"
                  value={selectedPO?.po_number || ""}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className=" mt-3 me-2">
            <h5 className=" ">GRN Details</h5>
          </div>
          {renderGRNTable()}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100 mt-2"
                onClick={handleGRNSubmit}
                disabled={selectedGRNs.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeSelectGRNModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/*  */}
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
          <Modal.Title>Tax & Charges</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="tbl-container  mt-3 "
            style={{ maxHeight: "500px" }}
          // style={{ maxHeight: 'none', overflowY: 'visible',
          //   overflowX: 'visible'

          //  }}
          // style={{
          //   maxHeight: "none",
          //   overflowY: "visible !important",
          //   overflowX: "visible !important",
          //   width: "100%",
          // }}
          >
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
                  <th className="text-start ">Total Base Cost</th>
                  <td className="text-start" />
                  <td className="text-start" />
                  <td className="text-start">
                    <input
                      type="number"
                      className="form-control"
                      value={selectedGRN?.base_cost}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (validatePositiveNumber(value)) {
                          const newBaseCost = parseFloat(value) || 0;
                          setSelectedGRN((prev) => ({
                            ...prev,
                            base_cost: newBaseCost,
                          }));
                        }
                      }}
                      min="0"
                      disabled
                    />
                  </td>
                  <td />
                </tr>
                <tr>
                  <th className="text-start">Addition Tax & Charges</th>
                  <td className="text-start" />
                  <td className="text-start" />
                  <td className="text-start" />
                  <td className="text-start" onClick={addRow}>
                  

                    <button class="btn btn-outline-danger btn-sm"><span>+</span></button>
                  </td>
                </tr>
                {/* Dynamic Rows for Addition Tax */}
                {rows.map((row) => (
                  <tr key={row.id}>
                    {/* <td className="text-start">
                      <SingleSelector
                        options={taxTypes.map((type) => ({
                          value: type.name,
                          label: type.name,
                          isDisabled:
                            // Disable "Handling Charges", "Other charges", "Freight" for all rows
                            [
                              "Handling Charges",
                              "Other charges",
                              "Freight",
                            ].includes(type.name) ||
                            // Disable "SGST", "CGST", "IGST" if already selected in another row
                            (["SGST", "CGST", "IGST"].includes(type.name) &&
                              rows.some(
                                (r) => r.type === type.name && r.id !== row.id
                              )),
                        }))}
                        value={{ value: row.type, label: row.type }}
                        // onChange={(selectedOption) =>
                        //   setRows((prevRows) =>
                        //     prevRows.map((r) =>
                        //       r.id === row.id
                        //         ? { ...r, type: selectedOption.value || "" }
                        //         : r
                        //     )
                        //   )
                        // }
                        onChange={(selectedOption) => {
                          console.log("Selected Option:", selectedOption);
                          setRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, type: selectedOption?.value || "" }
                                : r
                            )
                          );
                        }}
                        placeholder="Select Type"
                        isDisabled={!row.isEditable} // Disable if not editable
                      />
                    </td> */}
                    <td className="text-start">
                      <SingleSelector
                        options={
                          taxTypes.map((type) => ({
                            value: type.name,
                            label: type.name,
                            isDisabled: true, // Make all options disabled
                          }))
                        }
                        value={{ value: row.type, label: row.type }}
                        onChange={() => { }} // Empty onChange handler
                        placeholder="Select Type"
                        isDisabled={true} // Disable the entire selector
                      />
                      {/* {console.log("tax types:", taxTypes)} */}
                    </td>
                    <td className="text-start">
                      {row.isEditable ? (
                        <select
                          className="form-control form-select"
                          value={row.percentage}
                          onChange={(e) => {
                            const percentage =
                              parseFloat(e.target.value.split(" ")[1]) || 0;
                            const amount =
                              ((selectedGRN?.base_cost || 0) * percentage) /
                              100;

                            setRows((prevRows) =>
                              prevRows.map((r) =>
                                r.id === row.id
                                  ? {
                                    ...r,
                                    percentage: e.target.value,
                                    amount: amount.toFixed(2),
                                  }
                                  : r
                              )
                            );
                          }}
                        >
                          <option value="">Select Tax</option>
                          {row.type === "IGST" &&
                            taxPercentages.IGST.map((tax, index) => (
                              <option key={index} value={tax.value}>
                                {tax.value}
                              </option>
                            ))}
                          {row.type === "SGST" &&
                            taxPercentages.SGST.map((tax, index) => (
                              <option key={index} value={tax.value}>
                                {tax.value}
                              </option>
                            ))}
                          {row.type === "CGST" &&
                            taxPercentages.CGST.map((tax, index) => (
                              <option key={index} value={tax.value}>
                                {tax.value}
                              </option>
                            ))}
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
                        // value={row.amount}
                        value={
                          row.amount === "0" || row.amount === 0
                            ? ""
                            : row.amount
                        } // Clear if zero
                        disabled={row.percentage !== ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (validatePositiveNumber(value)) {
                            setRows((prevRows) =>
                              prevRows.map((r) =>
                                r.id === row.id
                                  ? {
                                    ...r,
                                    // amount: parseFloat(value) || 0,
                                    amount: value === "" ? "0" : value, // Set to "0" when cleared
                                  }
                                  : r
                              )
                            );
                          }
                        }}
                        min="0"
                        placeholder="Enter amount"
                      />
                    </td>
                    <td
                      className="text-start"
                      onClick={() => deleteRow(row.id)}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      
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
                  <td className="text-start">
                    {(
                      parseFloat(calculateSubTotal()) +
                      (parseFloat(selectedGRN?.base_cost) || 0)
                    ).toFixed(2)}
                  </td>
                  <td />
                </tr>
                {/* Deduction Tax Section */}
                <tr>
                  <th className="text-start">Deduction Tax</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start" />
                  <td onClick={addDeductionRow} className="text-start">
                   

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
                        }))}
                        value={{ value: row.type, label: row.type }}
                        onChange={(selectedOption) =>
                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, type: selectedOption.value }
                                : r
                            )
                          )
                        }
                        placeholder="Select Type"
                      />
                    </td>
                    <td className="text-start">
                      <select
                        className="form-control form-select"
                        value={row.percentage}
                        onChange={(e) => {
                          const percentage =
                            parseFloat(e.target.value.split(" ")[1]) || 0;
                          const amount =
                            ((selectedGRN?.base_cost || 0) * percentage) / 100;

                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? {
                                  ...r,
                                  percentage: e.target.value,
                                  amount: amount.toFixed(2),
                                }
                                : r
                            )
                          );
                        }}
                      >
                        <option value="">Select Tax</option>
                        {row.type === "TDS" && (
                          <>
                            <option value="TDS 1%">TDS 1%</option>
                            <option value="TDS 2%">TDS 2%</option>
                            <option value="TDS 10%">TDS 10%</option>
                          </>
                        )}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (validatePositiveNumber(value)) {
                            setDeductionRows((prevRows) =>
                              prevRows.map((r) =>
                                r.id === row.id
                                  ? {
                                    ...r,
                                    amount: parseFloat(value) || 0,
                                  }
                                  : r
                              )
                            );
                          }
                        }}
                        min="0"
                      />
                    </td>
                    <td
                      className="text-start"
                      onClick={() => deleteDeductionRow(row.id)}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                    

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


          <div className="d-flex justify-content-center mt-3 mb-2">
            <button
              className="purple-btn2"
              // onClick={handleSubmit}
              // disabled={isSubmitting}
              onClick={handleTaxChargesSubmit}
            >
              {/* {isSubmitting ? "Submitting..." : "Submit"} */}
              Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Credit Note Modal */}
      {/* // Update the Credit Note Modal table structure */}
      {/* <Modal
        centered
        size="xl"
        show={creditNoteModal}
        onHide={closeCreditNoteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Credit Notes</Modal.Title>
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
                        creditNotes.length > 0 &&
                        selectedCreditNotes.length === creditNotes.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCreditNotes(creditNotes);
                        } else {
                          setSelectedCreditNotes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-start">Credit Note No.</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Project</th>
                  <th className="text-start">Credit Note Amount</th>
                  <th className="text-start">Recovery Till Date</th>
                  <th className="text-start">Waive off Till Date</th>
                  <th className="text-start">
                    Outstanding Amount (Certificate Date)
                  </th>
                  <th className="text-start">
                    Outstanding Amount (Current Date)
                  </th>
                  <th className="text-start">Credit Note Reason Type</th>
                  <th className="text-start">This Recovery</th>
                </tr>
              </thead>
              <tbody>
                {creditNotes.length > 0 ? (
                  creditNotes.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCreditNotes.some(
                            (n) => n.id === note.id
                          )}
                          onChange={() => handleCreditNoteSelect(note)}
                        />
                      </td>
                      <td className="text-start">
                        {note.credit_note_no || "-"}
                      </td>
                      <td className="text-start">{note.po_number || "-"}</td>
                      <td className="text-start">{note.project_name || "-"}</td>
                      <td className="text-start">
                        {note.credit_note_amount || "-"}
                      </td>
                      <td className="text-start">
                        {note.recovery_till_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.waive_off_till_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.outstanding_certificate_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.outstanding_current_date || "-"}
                      </td>
                      <td className="text-start">{note.reason_type || "-"}</td>
                      <td className="text-start">
                        {note.this_recovery || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No credit notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
                onClick={closeCreditNoteModal}
                disabled={selectedCreditNotes.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeCreditNoteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
      {/* Update the Debit Note Modal with similar structure */}
      <Modal
        centered
        size="xl"
        show={debitNoteModal}
        onHide={closeDebitNoteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Debit Notes</Modal.Title>
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
                        debitNotes.length > 0 &&
                        selectedDebitNotes.length === debitNotes.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDebitNotes(debitNotes);
                        } else {
                          setSelectedDebitNotes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-start">Debit Note No.</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Project</th>
                  <th className="text-start">Debit Note Amount</th>
                  <th className="text-start">Recovery Till Date</th>
                  <th className="text-start">Waive off Till Date</th>
                  <th className="text-start">
                    Outstanding Amount (Certificate Date)
                  </th>
                  <th className="text-start">
                    Outstanding Amount (Current Date)
                  </th>
                  <th className="text-start">Debit Note Reason Type</th>
                  <th className="text-start">This Recovery</th>
                </tr>
              </thead>
              <tbody>
                {debitNotes.length > 0 ? (
                  debitNotes.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedDebitNotes.some(
                            (n) => n.id === note.id
                          )}
                          onChange={() => handleDebitNoteSelect(note)}
                        />
                      </td>
                      <td className="text-start">
                        {note.debit_note_no || "-"}
                      </td>
                      <td className="text-start">{note.po_number || "-"}</td>
                      <td className="text-start">{note.project_name || "-"}</td>
                      <td className="text-start">
                        {note.debit_note_amount || "-"}
                      </td>
                      <td className="text-start">
                        {note.recovered_amount || "0"}
                      </td>
                      <td className="text-start">
                        {note.waive_off_till_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.outstanding_certificate_date || "-"}
                      </td>
                      <td className="text-start">
                        {note.outstanding_current_date || "-"}
                      </td>
                      <td className="text-start">{note.reason_type || "-"}</td>
                      <td className="text-start">
                        {note.this_recovery || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No debit notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
                onClick={closeDebitNoteModal}
                disabled={selectedDebitNotes.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeDebitNoteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
        {/* Attach Modal (advanced, from Bill Entry Create) */}
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
                                      <td>{idx + 1}</td>
                                      <td>{doc.document_type}</td>
                                      <td>{doc.attachments[0]?.filename || "-"}</td>
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

export default BillBookingCreate;
