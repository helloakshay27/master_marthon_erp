import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  DownloadIcon,
  FilterIcon,
  StarIcon,
  SettingIcon,
  MultiSelector,
} from "../components";
const PoList = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const navigate = useNavigate();
  // Quick Filter states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Table data states
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);
  const [summaryCards, setSummaryCards] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    amended: 0, // Add this
    total_amount: 0,
  });

  // Add state to store current filters
  const [currentFilters, setCurrentFilters] = useState({
    companyId: "",
    projectId: "",
    siteId: "",
  });

  // Advanced filter states
  const [filterShow, setFilterShow] = useState(false);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);
  const [poTypeOptions, setPoTypeOptions] = useState([]);
  const [selectedPoType, setSelectedPoType] = useState(null);
  const [materialTypeOptions, setMaterialTypeOptions] = useState([]);
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [advanceApplicableOptions, setAdvanceApplicableOptions] = useState([]);
  const [selectedAdvanceApplicable, setSelectedAdvanceApplicable] =
    useState(null);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [consumptionCategoryOptions, setConsumptionCategoryOptions] = useState(
    []
  );
  const [selectedConsumptionCategory, setSelectedConsumptionCategory] =
    useState(null);
  const [requisitionDepartmentOptions, setRequisitionDepartmentOptions] =
    useState([]);
  const [selectedRequisitionDepartment, setSelectedRequisitionDepartment] =
    useState(null);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(null);
  const [poDateFrom, setPoDateFrom] = useState("");
  const [poDateTo, setPoDateTo] = useState("");
  const [poBaseValueOptions, setPoBaseValueOptions] = useState([]);
  const [selectedPoBaseValue, setSelectedPoBaseValue] = useState(null);
  const [poGrossValueOptions, setPoGrossValueOptions] = useState([]);
  const [selectedPoGrossValue, setSelectedPoGrossValue] = useState(null);
  const [eventNoOptions, setEventNoOptions] = useState([]);
  const [selectedEventNo, setSelectedEventNo] = useState(null);
  const [morNoOptions, setMorNoOptions] = useState([]);
  const [selectedMorNo, setSelectedMorNo] = useState(null);
  const [advanceAmountOptions, setAdvanceAmountOptions] = useState([]);
  const [selectedAdvanceAmount, setSelectedAdvanceAmount] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  // Settings modal
  const [settingShow, setSettingShow] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    star: true,
    poNo: true,
    poDate: true,
    poType: true,
    consumptionCategory: true,
    company: true,
    project: true,
    subProject: true,
    materialType: true,
    createdBy: true,
    morNo: true,
    eventNos: true,
    advanceApplicable: true,
    advanceAmount: true,
    advancePaymentDate: true,
    supplier: true,
    requestionToDepartment: true,
    rfqNo: true,
    poBaseValue: true,
    poGrossValue: true,
    poAmount: true,
    status: true,
    dueDate: true,
    overdue: true,
    stage: true,
    dueFrom: true,
  });

  // Collapse states - start collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [bulkActionCollapsed, setBulkActionCollapsed] = useState(true);

  const [searchInput, setSearchInput] = useState("");

  // Handle search button click
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Table columns
  const allColumns = [
    { field: "srNo", headerName: "Sr.no", width: 80 },

    // ...existing code...
    {
      field: "poNo",
      headerName: "PO No.",
      width: 140,
      sortable: true,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: "#8B0203",
            textDecoration: "underline",
          }}
          onClick={() =>
            navigate(`/po-details/${params.row.id}?token=${token}`)
          }
        >
          {params.value}
        </div>
      ),
    },
    // ...existing code...
    { field: "poDate", headerName: "PO Date", width: 140, sortable: true },
    { field: "poType", headerName: "PO Type", width: 120 },
    {
      field: "consumptionCategory",
      headerName: "Consumption Category",
      width: 160,
    },
    { field: "company", headerName: "Company", width: 150 },
    { field: "project", headerName: "Project", width: 150 },
    { field: "subProject", headerName: "Sub Project", width: 150 },
    { field: "materialType", headerName: "Material Type", width: 150 },
    { field: "createdBy", headerName: "Created By", width: 140 },
    { field: "morNo", headerName: "MOR No.", width: 120 },
    { field: "eventNos", headerName: "Event Nos.", width: 120 },
    {
      field: "advanceApplicable",
      headerName: "Advance Applicable",
      width: 140,
    },
    { field: "advanceAmount", headerName: "Advance Amount", width: 140 },
    {
      field: "advancePaymentDate",
      headerName: "Advance Payment Date",
      width: 160,
    },
    { field: "supplier", headerName: "Supplier / Vendor", width: 150 },
    {
      field: "requestionToDepartment",
      headerName: "Requestion to Department",
      width: 180,
    },
    { field: "rfqNo", headerName: "RFQ No.", width: 120 },
    { field: "poBaseValue", headerName: "PO Base Value", width: 140 },
    {
      field: "poGrossValue",
      headerName: "PO Gross Value",
      width: 140,
      sortable: true,
    },
    { field: "poAmount", headerName: "PO Amount", width: 140, sortable: true },
    { field: "status", headerName: "Status", width: 120 },
    { field: "dueDate", headerName: "Due Date", width: 120 },
    { field: "overdue", headerName: "Overdue", width: 100 },
    { field: "stage", headerName: "Stage", width: 120 },
    { field: "dueFrom", headerName: "Due From", width: 120 },
  ];

  const columns = allColumns.filter((col) => columnVisibility[col.field]);

  // Fetch companies on mount
  // useEffect(() => {
  //   axios
  //     .get(`${baseURL}pms/company_setups.json`)
  //     .then((response) => setCompanies(response.data.companies))
  //     .catch((error) => console.error("Error fetching companies:", error));
  // }, []);
  useEffect(() => {
    axios
      .get(`${baseURL}pms/company_setups.json?token=${token}`)
      .then((response) => {
        if (response.data && response.data.companies) {
          setCompanies(response.data.companies);
        } else {
          setCompanies([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      });
  }, []);

  // Main data fetching useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build base URL
        let url = `${baseURL}purchase_orders.json?q[po_type_eq]=ropo&page=${currentPage}&per_page=${pageSize}&token=${token}`;

        // Add filters
        if (currentFilters.companyId) {
          url += `&q[company_id_eq]=${currentFilters.companyId}`;
        }
        if (currentFilters.projectId) {
          url += `&q[po_mor_inventories_mor_inventory_material_order_request_project_id]=${currentFilters.projectId}`;
        }
        if (currentFilters.siteId) {
          url += `&q[po_mor_inventories_mor_inventory_material_order_request_pms_site_id ]=${currentFilters.siteId}`;
        }

        // Add search
        if (searchKeyword) {
          url += `&search=${searchKeyword}`;
        }

        // Add status filter
        if (statusFilter) {
          if (statusFilter === "amended") {
            url = `${baseURL}purchase_orders.json?token=${token}&filter=amended&q[po_type_eq]=ropo`;
          } else if (statusFilter === "approved") {
            url += `&q[status_eq]=approved`;
          } else if (statusFilter === "rejected") {
            url += `&q[status_eq]=rejected`;
          }
        }

        // Append any advanced filter params (q[...]) captured in currentFilters
        Object.entries(currentFilters || {}).forEach(([key, value]) => {
          if (key.startsWith("q[")) {
            if (value !== undefined && value !== null && value !== "") {
              url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
          }
        });

        const response = await axios.get(url);

        // Debug: Log the response structure
        console.log("API Response:", response.data);

        // Get the purchase_orders array from the response
        const responseData = response.data.purchase_orders || [];

        // Transform the data to match table columns
        const data = responseData.map((entry, index) => ({
          id: entry.id,
          srNo: (currentPage - 1) * pageSize + index + 1,
          // star: entry.starred ? "★" : "",
          poNo: entry.po_number || "-",
          poDate: formatDate(entry.po_date),
          poType: entry.po_type || "-",
          consumptionCategory: entry.consumption_category?.join(", ") || "-",
          company: entry.company_name || "-",
          project: entry.project_names?.join(", ") || "-",
          subProject: entry.sub_project_names?.join(", ") || "-",
          materialType: entry.material_types?.join(", ") || "-",
          createdBy: entry.created_by || "-",
          morNo: entry.mor_numbers?.join(", ") || "-",
          eventNos: entry.event_nos?.join(", ") || "-",
          advanceApplicable: entry.advance_applicable ? "Yes" : "No",
          advanceAmount: entry.advance_amount ? `${entry.advance_amount}` : "-",
          advancePaymentDate: "-", // Not available in API response
          supplier: entry.supplier_name || "-",
          requestionToDepartment: entry.department_names?.join(", ") || "-",
          rfqNo: "-", // Not available in API response
          poBaseValue: entry.po_base_value ? `${entry.po_base_value}` : "-",
          poGrossValue: entry.po_gross_value ? `${entry.po_gross_value}` : "-",
          poAmount: entry.po_amount ? `${entry.po_amount}` : "-",
          status: entry.status || "-",
          dueDate: "-", // Not available in API response
          overdue: "-", // Not available in API response
          stage: "-", // Not available in API response
          dueFrom: entry.due_from?.name || "-",
        }));

        setRows(data);

        // Set pagination info if available
        setMeta(response.data.pagination || {});
        setTotalPages(response.data.pagination?.total_pages || 1);
        setTotalEntries(response.data.pagination?.total_count || data.length);

        // Set summary cards data
        setSummaryCards(
          response.data.summary_cards || {
            total: 0,
            approved: 0,
            rejected: 0,
            amended: 0,
            total_amount: 0,
          }
        );

        // Debug: Log the transformed data
        console.log("Transformed data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchKeyword, currentFilters, statusFilter]);

  // Fetch filter options
  useEffect(() => {
    if (!token) return;

    const loadFilterOptions = async () => {
      try {
        // Single call for all PO-derived options
        const poResp = await axios.get(
          `${baseURL}purchase_orders.json?token=${token}`
        );

        const raw = poResp?.data;
        const purchaseOrders = Array.isArray(raw?.purchase_orders)
          ? raw.purchase_orders
          : [];

        // Helper to dedupe non-empty values
        const unique = (arr) => [
          ...new Set((arr || []).filter((x) => x !== undefined && x !== null)),
        ];

        // PO Number: handle both array-of-strings API and standard list
        const poNumbers = Array.isArray(raw) && raw.every((v) => typeof v === "string")
          ? unique(raw)
          : unique(purchaseOrders.map((item) => item.po_number));
        setPoNumberOptions(poNumbers.map((v) => ({ value: v, label: v })));

        // Other options from purchaseOrders list
        const poTypes = unique(purchaseOrders.map((item) => item.po_type));
        setPoTypeOptions(poTypes.map((v) => ({ value: v, label: v })));

        const materialTypes = unique(
          purchaseOrders.flatMap((item) => item.material_types || [])
        );
        setMaterialTypeOptions(
          materialTypes.map((v) => ({ value: v, label: v }))
        );

        // Status options loaded from unique statuses endpoint below

    setAdvanceApplicableOptions([
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ]);

        const baseValues = unique(
          purchaseOrders.map((item) => item.po_base_value)
        );
        setPoBaseValueOptions(
          baseValues.map((v) => ({ value: v, label: `₹${v}` }))
        );

        const grossValues = unique(
          purchaseOrders.map((item) => item.po_gross_value)
        );
        setPoGrossValueOptions(
          grossValues.map((v) => ({ value: v, label: `₹${v}` }))
        );

        const eventNos = unique(
          purchaseOrders.flatMap((item) => item.event_nos || [])
        );
        setEventNoOptions(eventNos.map((v) => ({ value: v, label: v })));

        // Load Status options from unique statuses endpoint
        try {
          const statusResp = await axios.get(
            `${baseURL}unique_statuses?model=PurchaseOrder&token=${token}`
          );
          const statusList = Array.isArray(statusResp?.data)
            ? statusResp.data
            : [];
          setStatusOptions(
            statusList
              .filter((v) => typeof v === "string" && v.trim().length > 0)
              .map((v) => ({ value: v, label: v }))
          );
        } catch {
          setStatusOptions([]);
        }

        // Load Requisition Department options
        try {
          const deptResp = await axios.get(
            `${baseURL}pms/departments.json?model=PurchaseOrder&token=${token}`
          );
          const deptList = Array.isArray(deptResp?.data) ? deptResp.data : [];
          setRequisitionDepartmentOptions(
            deptList
              .filter((d) => d && (d.name || d.label) && (d.id !== undefined))
              .map((d) => ({ value: d.id, label: d.name || d.label }))
          );
        } catch {
          setRequisitionDepartmentOptions([]);
        }

        // Load Consumption Category options
        try {
          const consResp = await axios.get(
            `${baseURL}pms/consumption_categories.json?model=PurchaseOrder&token=${token}`
          );
          const consList = Array.isArray(consResp?.data) ? consResp.data : [];
          setConsumptionCategoryOptions(
            consList
              .filter((c) => c && (c.name || c.label) && (c.id !== undefined))
              .map((c) => ({ value: c.id, label: c.name || c.label }))
          );
        } catch {
          setConsumptionCategoryOptions([]);
        }

        // Load Created By options
        try {
          const createdByResp = await axios.get(
            `${baseURL}created_and_approved_users?model=PurchaseOrder&created_by=true&token=${token}`
          );
          const userList = Array.isArray(createdByResp?.data)
            ? createdByResp.data
            : [];
          setCreatedByOptions(
            userList
              .filter((u) => u && (u.name || u.label) && (u.id !== undefined))
              .map((u) => ({ value: u.id, label: u.name || u.label }))
          );
        } catch {
          setCreatedByOptions([]);
        }

        // Load MOR numbers
        try {
          const morResp = await axios.get(
        `${baseURL}material_order_requests/filter_mor_numbers.json?token=${token}`
          );
          const morList = Array.isArray(morResp?.data?.mor_numbers)
            ? morResp.data.mor_numbers
            : Array.isArray(morResp?.data)
            ? morResp.data
            : [];
          setMorNoOptions(
            morList.map((morNo) => ({ value: morNo, label: morNo }))
          );
        } catch {
          setMorNoOptions([]);
        }

        // Load Suppliers (ids + names)
        try {
          const supResp = await axios.get(
            `${baseURL}pms/suppliers.json?token=${token}`
          );
          const list = Array.isArray(supResp?.data) ? supResp.data : [];
          const supplierOpts = list
            .map((s) => ({
              value: s.id,
              label: s.organization_name || s.full_name || `Supplier #${s.id}`,
            }))
            .filter((opt) => opt.label);
          setSupplierOptions(supplierOpts);
        } catch {
          setSupplierOptions([]);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setPoNumberOptions([]);
        setPoTypeOptions([]);
        setMaterialTypeOptions([]);
        setStatusOptions([]);
        setSupplierOptions([]);
        setConsumptionCategoryOptions([]);
        setRequisitionDepartmentOptions([]);
        setCreatedByOptions([]);
        setPoBaseValueOptions([]);
        setPoGrossValueOptions([]);
        setEventNoOptions([]);
        setAdvanceApplicableOptions([
          { value: true, label: "Yes" },
          { value: false, label: "No" },
        ]);
        setMorNoOptions([]);
      }
    };

    loadFilterOptions();
  }, [token]);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(selectedCompanyData?.projects || []);
    } else {
      setProjects([]);
    }
    setSiteOptions([]);
  };

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany?.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );
      setSiteOptions(selectedProjectData?.pms_sites || []);
    } else {
      setSiteOptions([]);
    }
  };

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects([]);
    setSiteOptions([]);
    setSearchKeyword("");
    setStatusFilter(null);
    setCurrentFilters({
      companyId: "",
      projectId: "",
      siteId: "",
    });

    // Reset to first page
    setCurrentPage(1);
  };

  // Fetch ROPO mapping data
  const fetchRopoData = () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";

    // Store current filters
    setCurrentFilters({
      companyId,
      projectId,
      siteId,
    });

    // Reset to first page when applying new filters
    setCurrentPage(1);
  };

  // Settings modal handlers
  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleToggleColumn = (field) => {
    setColumnVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleShowAll = () => {
    const updated = {};
    allColumns.forEach((col) => (updated[col.field] = true));
    setColumnVisibility(updated);
  };
  const handleHideAll = () => {
    const updated = {};
    allColumns.forEach((col) => (updated[col.field] = false));
    setColumnVisibility(updated);
  };
  const handleResetColumns = () => handleShowAll();

  // Filter modal handlers
  const handleFilterModalShow = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);

  // Advanced filter handlers
  const handlePoNumberChange = (selectedOption) => {
    setSelectedPoNumber(selectedOption);
  };

  const handlePoTypeChange = (selectedOption) => {
    setSelectedPoType(selectedOption);
  };

  const handleMaterialTypeChange = (selectedOption) => {
    setSelectedMaterialType(selectedOption);
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleAdvanceApplicableChange = (selectedOption) => {
    setSelectedAdvanceApplicable(selectedOption);
  };

  const handleSupplierChange = (selectedOption) => {
    setSelectedSupplier(selectedOption);
  };

  const handleConsumptionCategoryChange = (selectedOption) => {
    setSelectedConsumptionCategory(selectedOption);
  };

  const handleRequisitionDepartmentChange = (selectedOption) => {
    setSelectedRequisitionDepartment(selectedOption);
  };

  const handleCreatedByChange = (selectedOption) => {
    setSelectedCreatedBy(selectedOption);
  };

  const handlePoDateFromChange = (e) => {
    setPoDateFrom(e.target.value);
  };

  const handlePoDateToChange = (e) => {
    setPoDateTo(e.target.value);
  };

  const handlePoBaseValueChange = (selectedOption) => {
    setSelectedPoBaseValue(selectedOption);
  };

  const handlePoGrossValueChange = (selectedOption) => {
    setSelectedPoGrossValue(selectedOption);
  };

  const handleEventNoChange = (selectedOption) => {
    setSelectedEventNo(selectedOption);
  };

  const handleMorNoChange = (selectedOption) => {
    setSelectedMorNo(selectedOption);
  };

  const handleAdvanceAmountChange = (selectedOption) => {
    setSelectedAdvanceAmount(selectedOption);
  };

  // Filter apply and reset functions
  const handleFilterApply = () => {
    // Build filter parameters
    const filterParams = {};

    // PO Date filters
    if (poDateFrom) {
      filterParams["q[po_date_gteq]"] = poDateFrom;
    }
    if (poDateTo) {
      filterParams["q[po_date_lteq]"] = poDateTo;
    }

    // PO Number filter
    if (selectedPoNumber) {
      filterParams["q[po_number_in][]"] = selectedPoNumber.value;
    }

    // PO Type filter
    if (selectedPoType) {
      filterParams["q[po_type_in][]"] = selectedPoType.value;
    }

    // Event No. filter
    if (selectedEventNo) {
      filterParams["q[event_nos][]"] = selectedEventNo.value;
    }

    // MOR No. filter
    if (selectedMorNo) {
      filterParams[
        "q[po_mor_inventories_mor_inventory_material_order_request_mor_number_in][]"
      ] = selectedMorNo.value;
    }

    // Advance Amount filter
    if (selectedAdvanceAmount) {
      filterParams["q[supplier_advance_amount_in][]"] =
        selectedAdvanceAmount.value;
    }

    // Company filter
    if (selectedCompany) {
      filterParams["q[company_id_in][]"] = selectedCompany.value;
    }

    // Project filter
    if (selectedProject) {
      filterParams[
        "q[po_mor_inventories_mor_inventory_material_order_request_project_id_in][]"
      ] = selectedProject.value;
    }

    // Sub Project filter
    if (selectedSite) {
      filterParams[
        "q[po_mor_inventories_mor_inventory_material_order_request_pms_site_id_in][]"
      ] = selectedSite.value;
    }

    // Material Type filter
    if (selectedMaterialType) {
      filterParams[
        "q[po_mor_inventories_material_inventory_material_sub_type_material_type_id_in][]"
      ] = selectedMaterialType.value;
    }

    // Status filter
    if (selectedStatus) {
      filterParams["q[list_status_in][]"] = selectedStatus.value;
    }

    // Advance Applicable filter
    if (selectedAdvanceApplicable) {
      filterParams["q[with_advance]"] = selectedAdvanceApplicable.value;
    }

    // Supplier filter
    if (selectedSupplier) {
      filterParams["q[supplier_id_in][]"] = selectedSupplier.value;
    }

    // Consumption Category filter
    if (selectedConsumptionCategory) {
      filterParams[
        "q[po_mor_inventories_mor_inventory_material_order_request_consumption_id_in][]"
      ] = selectedConsumptionCategory.value;
    }

    // Requisition Department filter
    if (selectedRequisitionDepartment) {
      filterParams["q[request_to_department_id_in][]"] =
        selectedRequisitionDepartment.value;
    }

    // PO Base Value filter
    if (selectedPoBaseValue) {
      filterParams["q[po_base_value_in][]"] = selectedPoBaseValue.value;
    }

    // PO Gross Value filter
    if (selectedPoGrossValue) {
      filterParams["q[total_value_in][]"] = selectedPoGrossValue.value;
    }

    // Created By filter
    if (selectedCreatedBy) {
      filterParams["q[created_by_id_in][]"] = selectedCreatedBy.value;
    }

    // Update current filters with new filter params
    setCurrentFilters((prev) => ({
      ...prev,
      ...filterParams,
    }));

    setCurrentPage(1);
    setFilterShow(false);
  };

  const handleFilterReset = () => {
    setSelectedPoNumber(null);
    setSelectedPoType(null);
    setSelectedMaterialType(null);
    setSelectedStatus(null);
    setSelectedAdvanceApplicable(null);
    setSelectedSupplier(null);
    setSelectedConsumptionCategory(null);
    setSelectedRequisitionDepartment(null);
    setSelectedCreatedBy(null);
    setPoDateFrom("");
    setPoDateTo("");
    setSelectedPoBaseValue(null);
    setSelectedPoGrossValue(null);
    setSelectedEventNo(null);
    setSelectedMorNo(null);
    setSelectedAdvanceAmount(null);
    setCurrentPage(1);
    // Clear any advanced q[...] params from currentFilters while preserving quick filters
    setCurrentFilters((prev) => {
      return {
        companyId: prev.companyId || "",
        projectId: prev.projectId || "",
        siteId: prev.siteId || "",
      };
    });
  };

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    // Check if date is already in DD/MM/YYYY format
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${day}-${month}-${year.substring(0, 4)}`;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (e) {
      return "-";
    }
  };

  return (
    <>
      <style type="text/css">
        {`.tbl-container {

height: auto !important;
max-height: 100% !important;

}
.css-5n0k77:last-child{
display:none !important;
}
.MuiDataGrid-cell, .MuiDataGrid-cell > div {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}
/* Widen Advanced Filter modal dialog */
.modal-dialog.modal-right {
  max-width: 40vw !important;
  width: 40vw !important;
}
        `}
      </style>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Store &gt; Store Operations &gt; ROPO List</a>
          <h5 className="mt-4">ROPO List</h5>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="material-boxes mt-3">
                <div className="container-fluid">
                  <div className="row justify-content-center">
                    <div className="col-md-2 text-center">
                      <div
                        className={`content-box tab-button ${
                          statusFilter === null ? "active" : ""
                        }`}
                        onClick={() => {
                          setStatusFilter(null);
                          setCurrentPage(1);
                        }}
                      >
                        <h4 className="content-box-title fw-semibold">
                          PO List
                        </h4>
                        <p className="content-box-sub">{summaryCards.total}</p>
                      </div>
                    </div>

                    <div className="col-md-2 text-center">
                      <div
                        className={`content-box tab-button ${
                          statusFilter === "approved" ? "active" : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("approved");
                          setCurrentPage(1);
                        }}
                      >
                        <h4 className="content-box-title fw-semibold">
                          Approved
                        </h4>
                        <p className="content-box-sub">
                          {summaryCards.approved}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <div
                        className={`content-box tab-button ${
                          statusFilter === "rejected" ? "active" : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("rejected");
                          setCurrentPage(1);
                        }}
                      >
                        <h4 className="content-box-title fw-semibold">
                          Rejected
                        </h4>
                        <p className="content-box-sub">
                          {summaryCards.rejected}
                        </p>
                      </div>
                    </div>
                    {/* <div className="col-md-2 text-center">
        <div
          className={`content-box tab-button ${statusFilter === "terminated" ? "active" : ""}`}
          onClick={() => {
            setStatusFilter("terminated");
            setCurrentPage(1);
          }}
        >
          <h4 className="content-box-title fw-semibold">Terminated</h4>
          <p className="content-box-sub">{summaryCards.terminated}</p>
        </div>
      </div> */}
                    <div className="col-md-2 text-center">
                      <div
                        className={`content-box tab-button ${
                          statusFilter === "amended" ? "active" : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("amended");
                          setCurrentPage(1);
                        }}
                      >
                        <h4 className="content-box-title fw-semibold">
                          Amended
                        </h4>
                        <p className="content-box-sub">
                          {summaryCards.amended}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="content-box">
                        <h4 className="content-box-title fw-semibold">
                          Amount value
                        </h4>
                        <p className="content-box-sub">
                          ₹{summaryCards.total_amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-3 pb-4">
            {/* Quick Filter */}
            <div className="card mx-3 mt-3">
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={16} cy={16} r={16} fill="#8B0203" />
                      <path
                        d={
                          isCollapsed
                            ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                            : "M16 8L22.9282 20L9.0718 20L16 8Z"
                        }
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="card-body pt-0 mt-0">
                  <div className="row my-2 align-items-end">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Company</label>
                        {/* <SingleSelector
                          options={companies.map((c) => ({
                            value: c.id,
                            label: c.company_name,
                          }))}
                          onChange={handleCompanyChange}
                          value={selectedCompany}
                          placeholder="Select Company"
                        /> */}

                        <SingleSelector
                          options={
                            companies?.map((c) => ({
                              value: c.id,
                              label: c.company_name,
                            })) || []
                          }
                          value={selectedCompany}
                          onChange={handleCompanyChange}
                          placeholder="Select Company"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project</label>
                        <SingleSelector
                          options={projects.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))}
                          onChange={handleProjectChange}
                          value={selectedProject}
                          placeholder="Select Project"
                          isDisabled={!selectedCompany}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={siteOptions.map((s) => ({
                            value: s.id,
                            label: s.name,
                          }))}
                          onChange={handleSiteChange}
                          value={selectedSite}
                          placeholder="Select Sub-project"
                          isDisabled={!selectedProject}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="purple-btn2 m-0"
                        onClick={fetchRopoData}
                      >
                        Go
                      </button>
                      <button
                        className="purple-btn2 ms-2"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DataGrid Table with Settings */}
            <div className="card mx-3">
              <div className="card-header3">
                <h3 className="card-title">Bulk Action</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={() => setBulkActionCollapsed(!bulkActionCollapsed)}
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={16} cy={16} r={16} fill="#8B0203" />
                      <path
                        d={
                          bulkActionCollapsed
                            ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                            : "M16 8L22.9282 20L9.0718 20L16 8Z"
                        }
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {!bulkActionCollapsed && (
                <div className="card-body mt-0 pt-0">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        <select
                          name="from_status"
                          id="from_status"
                          className="form-control form-select from"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        <select
                          name="to_status"
                          id="to_status"
                          className="form-control form-select to"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          className="form-control remark"
                          rows={4}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button className="purple-btn2 m-0 status">
                        <a style={{ color: "white !important" }}> Submit </a>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex mt-3 align-items-end px-3">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control tbl-search"
                    placeholder="Type your keywords here"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-md btn-default"
                      // onClick={() => setCurrentPage(1)}
                      onClick={handleSearch}
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                          fill="#8B0203"
                        />
                        <path
                          d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-end align-items-center gap-2  mt-4">
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleFilterModalShow}
                >
                  <FilterIcon />
                </button>
                <button
                  type="button"
                  className="btn btn-md me-4"
                  onClick={handleSettingModalShow}
                >
                  <SettingIcon />
                </button>
                <button
                  className="purple-btn2"
                  onClick={() => navigate(`/po-create?token=${token}`)}
                >
                  <span> + Add</span>
                </button>
              </div>
            </div>
            <div className="mx-1 mt-3" style={{ overflowY: "auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                autoHeight={false}
                getRowId={(row) => row.id}
                loading={loading}
                disableSelectionOnClick
                components={{
                  ColumnMenu: () => null,
                }}
                localeText={{
                  noRowsLabel: "No data available",
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8f9fa",
                    color: "#000",
                    fontWeight: "bold",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "#dee2e6",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    borderColor: "#dee2e6",
                  },
                }}
              />
            </div>

            {/* Bootstrap-style Pagination Bar */}
            <div className="d-flex justify-content-between align-items-center px-3 py-2">
              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </li>
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, idx, arr) => {
                      // Add ellipsis if needed
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        return [
                          <li
                            key={`ellipsis-${page}`}
                            className="page-item disabled"
                          >
                            <span className="page-link">...</span>
                          </li>,
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>,
                        ];
                      }
                      return (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="ms-3">
                <span>
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalEntries)} of{" "}
                  {totalEntries} entries
                </span>
              </div>
            </div>

            {/* Settings Modal */}

            {/* Settings Modal */}
            <Modal
              show={settingShow}
              onHide={handleSettingClose}
              dialogClassName="modal-right"
              className="setting-modal"
              backdrop={true}
            >
              <Modal.Header>
                <div className="container-fluid p-0">
                  <div className="border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <button
                        type="button"
                        className="btn"
                        aria-label="Close"
                        onClick={handleSettingClose}
                      >
                        <svg
                          width="10"
                          height="16"
                          viewBox="0 0 10 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 2L2 8L8 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <Button
                      style={{ textDecoration: "underline" }}
                      variant="alert"
                      onClick={handleResetColumns}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
                {allColumns
                  .filter(
                    (column) =>
                      column.field !== "srNo" && column.field !== "Star"
                  )
                  .map((column) => (
                    <div
                      className="row justify-content-between align-items-center mt-2"
                      key={column.field}
                    >
                      <div className="col-md-6">
                        <button type="submit" className="btn btn-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={22}
                            height={22}
                            viewBox="0 0 48 48"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                        {/* <button type="submit" className="btn btn-md">
                               <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="22"
                                 height="22"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                               >
                                 <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                               </svg>
                             </button> */}
                        <label>{column.headerName}</label>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check form-switch mt-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={columnVisibility[column.field]}
                            onChange={() => handleToggleColumn(column.field)}
                            role="switch"
                            id={`flexSwitchCheckDefault-${column.field}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </Modal.Body>

              <Modal.Footer>
                {/* <Button variant="primary" onClick={handleShowAll}>
                       Show All
                     </Button>
                     <Button variant="danger" onClick={handleHideAll}>
                       Hide All
                     </Button> */}
                <button className="purple-btn2" onClick={handleShowAll}>
                  Show All
                </button>
                <button className="purple-btn1" onClick={handleHideAll}>
                  Hide All
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>

      {/* filter modal */}
      <div
        className="modal fade right"
        id="sidebarModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ width: 500 }}>
          <div className="modal-content h-100" style={{ borderRadius: 0 }}>
            <div className="modal-header border-0">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button "
                  className="btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <svg
                    width={10}
                    height={16}
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <a
                className="resetCSS"
                style={{ fontSize: 14, textDecoration: "underline !important" }}
                href="#"
              >
                Reset
              </a>
            </div>
            <div className="modal-body" style={{ overflowY: "scroll" }}>
              <div className="row">
                <div className="row mt-2 px-2"></div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      MOR Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Approval Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 align-items-end">
                <div className="col-md-12">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Due Date
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>From</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Default input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="form-group">
                    <label style={{ fontSize: 16, fontWeight: 600 }}>
                      Created On
                    </label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Default input"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material Type </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material Sub Tupe </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Material </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Activity </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Status </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>MOR No. </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
              </div>
              <div className="row mt-3 align-items-end">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Overdue </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                    <label>Requisition Department </label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
              </div>
            </div>
            <div className="modal-footer modal-footer-k justify-content-center">
              <a
                className="purple-btn2"
                href="/pms/admin/task_managements/kanban_list?type="
              >
                Go
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* filter modal end */}

      {/* Advanced Filter Modal */}
      <Modal
        show={filterShow}
        onHide={handleFilterClose}
        dialogClassName="modal-right"
        className="setting-modal"
        backdrop={true}
      >
        <Modal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn"
                  aria-label="Close"
                  onClick={handleFilterClose}
                >
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <span
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                onClick={handleFilterReset}
                role="button"
              >
                Reset
              </span>
            </div>
          </div>
        </Modal.Header>

        <div className="modal-body" style={{ overflowY: "scroll" }}>
          <div className="row">
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">PO Date From</label>
              <input
                type="date"
                className="form-control"
                value={poDateFrom}
                onChange={handlePoDateFromChange}
                placeholder="Select From Date"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">PO Date To</label>
              <input
                type="date"
                className="form-control"
                value={poDateTo}
                onChange={handlePoDateToChange}
                placeholder="Select To Date"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">PO Number</label>
              <SingleSelector
                options={poNumberOptions}
                value={selectedPoNumber}
                onChange={handlePoNumberChange}
                placeholder="Select PO Number"
              />
            </div>
            {/* <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">PO Type</label>
              <SingleSelector
                options={poTypeOptions}
                value={selectedPoType}
                onChange={handlePoTypeChange}
                placeholder="Select PO Type"
              />
            </div> */}
            {/* <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Event No.</label>
              <SingleSelector
                options={eventNoOptions}
                value={selectedEventNo}
                onChange={handleEventNoChange}
                placeholder="Select Event No."
              />
            </div> */}
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">MOR No.</label>
              <SingleSelector
                options={morNoOptions}
                value={selectedMorNo}
                onChange={handleMorNoChange}
                placeholder="Select MOR No."
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Company</label>
              <SingleSelector
                // options={companies.map((c) => ({
                //   value: c.id,
                //   label: c.company_name,
                // }))}
                options={
                  Array.isArray(companies)
                    ? companies.map((c) => ({
                        value: c.id,
                        label: c.company_name,
                      }))
                    : []
                }
                value={selectedCompany}
                onChange={handleCompanyChange}
                placeholder="Select Company"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Project</label>
              <SingleSelector
                options={projects.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                value={selectedProject}
                onChange={handleProjectChange}
                placeholder="Select Project"
                isDisabled={!selectedCompany}
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Sub Project</label>
              <SingleSelector
                options={siteOptions.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                value={selectedSite}
                onChange={handleSiteChange}
                placeholder="Select Sub Project"
                isDisabled={!selectedProject}
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Material Type</label>
              <SingleSelector
                options={materialTypeOptions}
                value={selectedMaterialType}
                onChange={handleMaterialTypeChange}
                placeholder="Select Material Type"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Status</label>
              <SingleSelector
                options={statusOptions}
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Select Status"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                Advance Applicable
              </label>
              <SingleSelector
                options={advanceApplicableOptions}
                value={selectedAdvanceApplicable}
                onChange={handleAdvanceApplicableChange}
                placeholder="Select Advance Applicable"
              />
            </div>
            {/* <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                Advance Amount
              </label>
              <SingleSelector
                options={advanceAmountOptions}
                value={selectedAdvanceAmount}
                onChange={handleAdvanceAmountChange}
                placeholder="Select Advance Amount"
              />
            </div> */}
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                Supplier/Vendor
              </label>
              <SingleSelector
                options={supplierOptions}
                value={selectedSupplier}
                onChange={handleSupplierChange}
                placeholder="Select Supplier"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                Consumption Category
              </label>
              <SingleSelector
                options={consumptionCategoryOptions}
                value={selectedConsumptionCategory}
                onChange={handleConsumptionCategoryChange}
                placeholder="Select Consumption Category"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                Requisition Department
              </label>
              <SingleSelector
                options={requisitionDepartmentOptions}
                value={selectedRequisitionDepartment}
                onChange={handleRequisitionDepartmentChange}
                placeholder="Select Department"
              />
            </div>
            <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">Created By</label>
              <SingleSelector
                options={createdByOptions}
                value={selectedCreatedBy}
                onChange={handleCreatedByChange}
                placeholder="Select Created By"
              />
            </div>
            {/* <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">PO Base Value</label>
              <SingleSelector
                options={poBaseValueOptions}
                value={selectedPoBaseValue}
                onChange={handlePoBaseValueChange}
                placeholder="Select PO Base Value"
              />
            </div> */}
            {/* <div className="col-md-6 mt-2">
              <label className="block text-sm font-medium">
                PO Gross Value
              </label>
              <SingleSelector
                options={poGrossValueOptions}
                value={selectedPoGrossValue}
                onChange={handlePoGrossValueChange}
                placeholder="Select PO Gross Value"
              />
            </div> */}
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleFilterApply}
          >
            Apply Filter
          </button>
        </div>
      </Modal>

      {/* Setting modal */}
    </>
  );
};

export default PoList;
