import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";
import SelectBox from "../components/base/Select/SelectBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom";

const RopoImportEdit = () => {
  // State variables for the modal

  const [showModal, setShowModal] = useState(false);
   const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState();
  const [addMORModal, setAddMORModal] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiMaterialInventoryIds, setApiMaterialInventoryIds] = useState();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const poId = urlParams.get("id") || window.location.pathname.split("/").pop();
  
  const [serviceProviders, setServiceProviders] = useState([]);

  // State for MOR modal dropdown options

  const [inventoryTypes2, setInventoryTypes2] = useState([]);
  const [selectedInventory2, setSelectedInventory2] = useState(null);
  const [inventorySubTypes2, setInventorySubTypes2] = useState([]);
  const [selectedSubType2, setSelectedSubType2] = useState(null);
  const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]);
  const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] =
    useState(null);

  // Tax modal state variables
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [taxRateData, setTaxRateData] = useState({});
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);
  const [materialTaxPercentages, setMaterialTaxPercentages] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    materialType: "",
    materialSubType: "",
    material: "",
    genericSpecification: "",
    colour: "",
    brand: "",
    effectiveDate: "",
    rate: "",
    uom: "",
  });

  // States to store data company, project ,subproject ,wing

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);

  // Normalize options for MOR modal selectors in case API sets raw arrays

  const projectsOptions = React.useMemo(() => {
    // Prefer deriving projects from the selected company (without external API)

    if (selectedCompany?.value) {
      const company = (companies || []).find(
        (c) => `${c.id}` === `${selectedCompany.value}`
      );

      return (company?.projects || [])

        .map((p) => ({ value: p.id, label: p.name }))

        .filter((o) => o.value != null && o.label);
    }

    // Fallback to whatever is in projects state, normalizing

    return (projects || [])

      .map((p) =>
        p && p.value !== undefined && p.label !== undefined
          ? p
          : { value: p?.id, label: p?.name }
      )

      .filter((o) => o.value != null && o.label);
  }, [selectedCompany, companies, projects]);

  const siteOptionsNorm = React.useMemo(() => {
    // Derive sites from selected projects in the selected company

    if (selectedCompany?.value) {
      const company = (companies || []).find(
        (c) => `${c.id}` === `${selectedCompany.value}`
      );

      const selectedProjectIds = Array.isArray(selectedProject)
        ? selectedProject.map((p) => p.value)
        : selectedProject?.value
        ? [selectedProject.value]
        : [];

      const unique = new Map();
      (company?.projects || [])
        .filter((p) =>
          selectedProjectIds.length === 0
            ? true
            : selectedProjectIds.includes(p.id)
        )

        .forEach((p) => {
          (p.pms_sites || []).forEach((s) => {
            if (!unique.has(s.id))
              unique.set(s.id, { value: s.id, label: s.name });
          });
        });

      return Array.from(unique.values());
    }

    // Fallback to existing siteOptions

    return (siteOptions || [])

      .map((s) =>
        s && s.value !== undefined && s.label !== undefined
          ? s
          : { value: s?.id, label: s?.name }
      )

      .filter((o) => o.value != null && o.label);
  }, [companies, selectedCompany, selectedProject, siteOptions]);

  const [wingsOptions, setWingsOptions] = useState([]);

  // PO form state

  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);

  const [createdOn, setCreatedOn] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Material data from API response

  const [submittedMaterials, setSubmittedMaterials] = useState([]);
  
  // Store original material details from API for validation
  const [originalMaterialDetails, setOriginalMaterialDetails] = useState([]);

  const [purchaseOrderId, setPurchaseOrderId] = useState(null);

  // MOR modal data

  const [materialDetailsData, setMaterialDetailsData] = useState([]);

  const [selectedMaterialItems, setSelectedMaterialItems] = useState([]);

  const [loadingMaterialDetails, setLoadingMaterialDetails] = useState(false);

  const [morFormData, setMorFormData] = useState({
    morNumber: "",

    morStartDate: "",

    morEndDate: "",

    projectIds: [],

    siteIds: [],

    materialType: "",

    materialSubType: "",

    material: "",
  });

  // MOR list options for Add MOR modal (import type)
  const [morOptions, setMorOptions] = useState([]);

  // useEffect(() => {
  //   const fetchMorNumbers = async () => {
  //     try {
  //       const resp = await axios.get(
  //         `${baseURL}pms/company_setups/get_mors.json?token=${token}&q[mor_type_eq]=import`
  //       );
  //       const options = (resp.data?.material_order_requests || []).map((mor) => ({
  //         value: mor.id,
  //         label: mor.mor_number,
  //       }));
  //       setMorOptions(options);
  //     } catch (err) {
  //       console.error("Error fetching MOR numbers:", err);
  //       setMorOptions([]);
  //     }
  //   };
  //   if (token) fetchMorNumbers();
  // }, [token]);
  
  useEffect(() => {
    const fetchMorNumbers = async () => {
      try {
        const companyParam = selectedCompany?.value
          ? `&q[company_id_in][]=${selectedCompany.value}`
          : "";
        const resp = await axios.get(
          `${baseURL}pms/company_setups/get_mors.json?token=${token}&q[mor_type_eq]=import${companyParam}`
        );
        const options = (resp.data?.material_order_requests || []).map((mor) => ({
          value: mor.id,
          label: mor.mor_number,
        }));
        setMorOptions(options);
      } catch (err) {
        console.error("Error fetching MOR numbers:", err);
        setMorOptions([]);
      }
    };
    if (token) fetchMorNumbers();
  }, [token, selectedCompany]);

  // Terms and conditions state

  const [termsConditions, setTermsConditions] = useState([]);

  const [selectedConditionCategory, setSelectedConditionCategory] =
    useState(null);

  const [conditionCategories, setConditionCategories] = useState([]);

  const [materialTermConditions, setMaterialTermConditions] = useState([]);

  // Supplier state

  const [suppliers, setSuppliers] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [vendorGstin, setVendorGstin] = useState("");

  // Loading state

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Tax summary state

  const [taxSummary, setTaxSummary] = useState({});

  // Active tab state

  const [activeTab, setActiveTab] = useState("po-details"); // "po-details", "rate-taxes", "terms-conditions"

  // Terms and conditions form state

  const [termsFormData, setTermsFormData] = useState({
    creditPeriod: "",

    poValidityPeriod: "",

    advanceReminderDuration: "",

    paymentTerms: "",

    paymentRemarks: "",

    remark: "",

    comments: "",
  });

  // Charges state

  const [charges, setCharges] = useState([]);

  const [otherCosts, setOtherCosts] = useState([]);

  const [chargeNames, setChargeNames] = useState([]);

  // New state for charges from API

  const [chargesFromApi, setChargesFromApi] = useState([]);

  const [selectedServiceProviders, setSelectedServiceProviders] = useState({});

  const [loadingCharges, setLoadingCharges] = useState(false);

  const [serviceCertificates, setServiceCertificates] = useState({});

  const [chargeRemarks, setChargeRemarks] = useState({});

  // State for advance calculations

  const [supplierAdvancePercentage, setSupplierAdvancePercentage] =
    useState("");

  const [
    serviceCertificateAdvancePercentage,

    setServiceCertificateAdvancePercentage,
  ] = useState("");

  const [totalMaterialCost, setTotalMaterialCost] = useState(0);

  // State to store calculated values for Rate & Taxes table

  const [materialCalculatedValues, setMaterialCalculatedValues] = useState({});

  // State for delivery schedules

  const [deliverySchedules, setDeliverySchedules] = useState([]);

  // Delivery Schedule helpers and validators

  const getOrderQtyForSchedule = (schedule) => {
    try {
      // First, try to get po_order_qty from original material details (most reliable)
      const schedMorId =
        schedule?.mor_inventory_id ||
        schedule?.po_mor_inventory_id ||
        schedule?.material_id ||
        schedule?.pms_inventory_id;

      console.log("getOrderQtyForSchedule - schedule:", schedule);
      console.log("getOrderQtyForSchedule - schedMorId:", schedMorId);
      console.log("getOrderQtyForSchedule - originalMaterialDetails:", originalMaterialDetails);

      // Debug: Check what IDs are available in original material details
      if (originalMaterialDetails && originalMaterialDetails.length > 0) {
        console.log("Available IDs in originalMaterialDetails:");
        originalMaterialDetails.forEach((m, index) => {
          console.log(`Material ${index}:`, {
            mor_inventory_id: m.mor_inventory_id,
            pms_inventory_id: m.pms_inventory_id,
            material_inventory_id: m.material_inventory_id,
            po_order_qty: m.po_order_qty
          });
        });
      }

      // Check in original material details from API response
      const matchedOriginal = (originalMaterialDetails || []).find(
        (m) => 
          `${m.mor_inventory_id}` === `${schedMorId}` ||
          `${m.pms_inventory_id}` === `${schedMorId}` ||
          `${m.material_inventory_id}` === `${schedMorId}`
      );

      console.log("getOrderQtyForSchedule - matched original material:", matchedOriginal);

      // Use po_order_qty from original material details (this is the correct validation value)
      if (matchedOriginal && matchedOriginal.po_order_qty) {
        const poOrderQty = parseFloat(matchedOriginal.po_order_qty);
        console.log("getOrderQtyForSchedule - using po_order_qty from original:", poOrderQty);
        return poOrderQty;
      }

      // Fallback to submittedMaterials if original not found
      const matched = (submittedMaterials || []).find(
        (m) => 
          `${m.mor_inventory_id}` === `${schedMorId}` ||
          `${m.pms_inventory_id}` === `${schedMorId}` ||
          `${m.material_inventory_id}` === `${schedMorId}`
      );

      console.log("getOrderQtyForSchedule - matched submitted material:", matched);

      if (matched) {
        const materialOrderQty = 
          parseFloat(matched?.poOrderQty) ||
          parseFloat(matched?.po_order_qty) ||
          parseFloat(matched?.order_qty) ||
          parseFloat(matched?.required_quantity);
        
        console.log("getOrderQtyForSchedule - materialOrderQty from submitted:", materialOrderQty);
        
        if (materialOrderQty > 0) {
          return materialOrderQty;
        }
      }

      // Final fallback to schedule data
      const scheduleOrderQty = 
        parseFloat(schedule?.order_qty) ||
        parseFloat(schedule?.po_order_qty) ||
        parseFloat(schedule?.required_quantity) ||
        parseFloat(schedule?.sch_delivery_qty) ||
        parseFloat(schedule?.expected_quantity);

      console.log("getOrderQtyForSchedule - scheduleOrderQty (final fallback):", scheduleOrderQty);
      console.log("getOrderQtyForSchedule - schedule fields:", {
        order_qty: schedule?.order_qty,
        po_order_qty: schedule?.po_order_qty,
        required_quantity: schedule?.required_quantity,
        sch_delivery_qty: schedule?.sch_delivery_qty,
        expected_quantity: schedule?.expected_quantity
      });

      return scheduleOrderQty > 0 ? scheduleOrderQty : 0;
    } catch (e) {
      console.error("getOrderQtyForSchedule error:", e);
      return 0;
    }
  };

  const handleScheduleDateChange = (rowIndex, value) => {
    setDeliverySchedules((prev) => {
      const list = [...prev];

      const row = { ...list[rowIndex] };

      const expected = row?.expected_date ? new Date(row.expected_date) : null;

      if (expected) {
        const minDate = new Date(expected);

        const maxDate = new Date(expected);

        maxDate.setFullYear(maxDate.getFullYear() + 1);

        const picked = new Date(value);

        minDate.setHours(0, 0, 0, 0);

        maxDate.setHours(23, 59, 59, 999);

        picked.setHours(12, 0, 0, 0);

        if (picked < minDate || picked > maxDate) {
          toast.error(
            `PO Delivery Date must be between ${
              minDate

                .toISOString()

                .split("T")[0]
            } and ${
              maxDate.toISOString().split("T")[0]
            } (within 1 year of MOR Delivery Schedule).`
          );

          return prev;
        }
      }

      row.po_delivery_date = value;

      list[rowIndex] = row;

      return list;
    });
  };

  const handleSchedulePoQtyChange = (rowIndex, value) => {
    const entered = value === "" ? "" : parseFloat(value);

    if (entered !== "" && (isNaN(entered) || entered < 0)) {
      toast.error("PO Delivery Qty must be a non-negative number.");

      return;
    }

    setDeliverySchedules((prev) => {
      const list = [...prev];

      const row = { ...list[rowIndex] };

      const maxQty = getOrderQtyForSchedule(row);

      if (entered !== "" && entered > maxQty) {
        toast.error(`PO Delivery Qty cannot exceed current Order Qty (${maxQty}).`);

        return prev;
      }

      row.po_delivery_qty = value;

      list[rowIndex] = row;

      return list;
    });
  };

  const handleScheduleStoreNameChange = (rowIndex, value) => {
    setDeliverySchedules((prev) => {
      const list = [...prev];

      const row = { ...list[rowIndex] };

      row.store_name = value;

      list[rowIndex] = row;

      return list;
    });
  };

  const handleScheduleRemarksChange = (rowIndex, value) => {
    setDeliverySchedules((prev) => {
      const list = [...prev];

      const row = { ...list[rowIndex] };

      row.remarks = value;

      list[rowIndex] = row;

      return list;
    });
  };

  const getScheduleMaterialKey = (s) =>
    `${
      s?.mor_inventory_id ||
      s?.po_mor_inventory_id ||
      s?.material_id ||
      s?.material_formatted_name ||
      ""
    }`;

  const isScheduleRowVisible = (s) => {
    try {
      const key = getScheduleMaterialKey(s);

      if (!key) {
        console.log("isScheduleRowVisible: No key, returning true");
        return true;
      }

      const orderQty = getOrderQtyForSchedule(s) || 0;

      const totalEntered = (deliverySchedules || [])

        .filter((x) => getScheduleMaterialKey(x) === key)

        .reduce((sum, x) => sum + (parseFloat(x.po_delivery_qty) || 0), 0);

      console.log("isScheduleRowVisible:", {
        schedule: s,
        key,
        orderQty,
        totalEntered,
        currentQty: parseFloat(s.po_delivery_qty) || 0
      });

      if (orderQty <= 0) {
        console.log("isScheduleRowVisible: orderQty <= 0, returning true");
        return true;
      }

      if (totalEntered >= orderQty) {
        const hasQty = (parseFloat(s.po_delivery_qty) || 0) > 0;
        console.log("isScheduleRowVisible: totalEntered >= orderQty, returning:", hasQty);
        return hasQty;
      }

      console.log("isScheduleRowVisible: returning true");
      return true;
    } catch (e) {
      console.error("isScheduleRowVisible error:", e);
      return true;
    }
  };

  // Taxes modal state

  const [showTaxesModal, setShowTaxesModal] = useState(false);

  const [selectedChargeId, setSelectedChargeId] = useState(null);

  const [selectedItemType, setSelectedItemType] = useState(null); // 'charge' or 'cost'

  const [chargeTaxes, setChargeTaxes] = useState({
    additionTaxes: [],

    deductionTaxes: [],

    baseCost: 0,

    netCost: 0,
  });

  // Charges taxes modal state (separate from material taxes)

  const [chargesAdditionTaxOptions, setChargesAdditionTaxOptions] = useState(
    []
  );

  const [chargesDeductionTaxOptions, setChargesDeductionTaxOptions] = useState(
    []
  );

  const [chargesTaxPercentages, setChargesTaxPercentages] = useState([]);

  // Handle tab change

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    // Fetch charges data when Terms & Conditions tab is selected

    if (tabName === "terms-conditions" && submittedMaterials.length > 0) {
      fetchChargesData();
    }
  };

  // Fetch company data on component mount

  useEffect(() => {
    axios

      .get(`${baseURL}pms/company_setups.json?token=${token}`)

      .then((response) => {
        setCompanies(response.data.companies);
      })

      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  // Fetch suppliers data on component mount

  useEffect(() => {
    axios

      .get(`${baseURL}pms/suppliers.json?token=${token}&q[vendor_type_supplier_type_eq]=Importer Vendor`)

      .then((response) => {
        setSuppliers(response.data);
      })

      .catch((error) => {
        console.error("Error fetching suppliers data:", error);
      });
  }, []);




  useEffect(() => {
    axios

      .get(`${baseURL}pms/suppliers.json?token=${token}&q[vendor_type_supplier_type_not_eq]=Importer Vendor`)

      .then((response) => {
        setServiceProviders(response.data);
      })

      .catch((error) => {
        console.error("Error fetching service providers data:", error);
      });
  }, []);
  // Fetch currencies data on component mount

  useEffect(() => {
    axios

      .get(`${baseURL}currencies.json?token=${token}`)

      .then((response) => {
        console.log("Currencies response:", response.data);

        setCurrencies(response.data);
      })

      .catch((error) => {
        console.error("Error fetching currencies data:", error);

        // Set fallback currencies if API fails

        setCurrencies([
          { id: 1, name: "America", currency: "usd" },

          { id: 2, name: "Canada", currency: "cad" },
        ]);
      });
  }, []);

  // Fe
  // 
  const serviceProviderOptions = serviceProviders.map((sp) => ({
    value: sp.id,

    label: sp.organization_name || sp.full_name,
  }));
  // tch edit data when component mounts and poId is available

  useEffect(() => {
    if (poId && token && companies.length > 0 && suppliers.length > 0) {
      fetchEditData();
    }
  }, [poId, token, companies, suppliers]);

  // Fetch edit data function

  const fetchEditData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}purchase_orders/${poId}/ropo_detail.json?token=${token}&po_type=import&type=edit`
      );

      const data = response.data;

      console.log("Edit data response:", data);

      // Populate form data

      populateFormData(data);

      // Populate material details

      populateMaterialDetails(data.material_details || []);

      // Populate rate and taxes

      populateRateAndTaxes(data.rate_and_taxes || []);

      // Populate other sections

      populateOtherSections(data);

      // Populate tax details

      if (data.mor_inventory_tax_details) {
        populateTaxDetails(data.mor_inventory_tax_details);
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };
  // Populate form data from API response

  const populateFormData = (data) => {
    // Find the matching company from the loaded companies list

    const selectedCompany = companies.find(
      (company) => company.id === data.company_id
    );

    const companyOption = selectedCompany
      ? { value: selectedCompany.id, label: selectedCompany.name }
      : null;

    // Find the matching supplier from the loaded suppliers list

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.id === data.supplier_id
    );

    const supplierOption = selectedSupplier
      ? { value: selectedSupplier.id, label: selectedSupplier.name }
      : null;

    setFormData((prev) => ({
      ...prev,

      company: companyOption,

      supplier: supplierOption,

      currency: data.po_currency
        ? {
            value: data.po_currency.toLowerCase(),

            label: data.po_currency.toUpperCase(),
          }
        : null,

      conversionRate: data.conversion_rate?.toString() || "",

      poDate: data.po_date || "",

      vendorGstin: data.vendor_gstin || "",

      branch: data.branch || "",

      unloadingScope: data.unloading_scope || "",

      payableToSupplier: data.payable_to_supplier?.toString() || "",

      payableToServiceProvider:
        data.payable_to_service_provider?.toString() || "",

      totalDiscount: data.total_discount?.toString() || "",

      totalDiscountInInr: data.total_discount_in_inr?.toString() || "",
    }));

    // Also set the selected company and supplier states

    setSelectedCompany(companyOption);

    setSelectedSupplier(supplierOption);

    // Set the selected currency from API data

    if (data.po_currency) {
      setSelectedCurrency({
        code: data.po_currency.toUpperCase(),
        symbol: getCurrencySymbol(data.po_currency.toUpperCase()),
      });
    }

    // Populate Delivery Schedules from API response

    if (data.delivery_schedules) {
      // Add mor_inventory_id to delivery schedules by matching with material details
      const enhancedDeliverySchedules = data.delivery_schedules.map(schedule => {
        // Find matching material by mor_number and material name
        const matchingMaterial = data.material_details?.find(material => 
          material.mor_number === schedule.mor_number && 
          material.material === schedule.material
        );
        
        return {
          ...schedule,
          mor_inventory_id: matchingMaterial?.mor_inventory_id || schedule.mor_inventory_id
        };
      });
      
      console.log("Enhanced delivery schedules with mor_inventory_id:", enhancedDeliverySchedules);
      setDeliverySchedules(enhancedDeliverySchedules);
    }

    // Fetch and populate projects and sites

    fetchProjectsAndSites(data);
  };

  // Fetch projects and sites data

  const fetchProjectsAndSites = async (data) => {
    try {
      // Fetch projects

      const projectsResponse = await axios.get(
        `${baseURL}projects.json?token=${token}`
      );

      setProjects(projectsResponse.data.projects || []);

      // Fetch sites

      const sitesResponse = await axios.get(
        `${baseURL}sites.json?token=${token}`
      );

      setSiteOptions(sitesResponse.data.sites || []);

      // Set selected project and site if they exist in the data

      if (data.material_details && data.material_details.length > 0) {
        const firstMaterial = data.material_details[0];

        if (firstMaterial.project_id) {
          const selectedProject = projectsResponse.data.projects?.find(
            (p) => p.id === firstMaterial.project_id
          );

          if (selectedProject) {
            setFormData((prev) => ({
              ...prev,

              project: {
                value: selectedProject.id,

                label: selectedProject.name,
              },
            }));
          }
        }

        if (firstMaterial.sub_project_id) {
          const selectedSite = sitesResponse.data.sites?.find(
            (s) => s.id === firstMaterial.sub_project_id
          );

          if (selectedSite) {
            setFormData((prev) => ({
              ...prev,

              site: { value: selectedSite.id, label: selectedSite.name },
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching projects and sites:", error);
    }
  };

  // Populate material details

  const populateMaterialDetails = (materialDetails) => {
    // Store original material details for validation
    setOriginalMaterialDetails(materialDetails);
    
    const populatedMaterials = materialDetails.map((material) => ({
      id: material.id,

      material: {
        id: material.pms_inventory_id,

        material_name: material.material_name,

        material_sub_type_name: material.material_sub_type_name,

        material_type_name: material.material_type_name,

        generic_info: material.generic_info,

        colour: material.colour,

        brand_name: material.brand_name,

        uom: material.uom,

        uom_id: material.uom_id,

        isedit: material.isedit,
      },

      project: material.project_id
        ? { value: material.project_id, label: material.project }
        : null,

      subProject: material.sub_project_id
        ? { value: material.sub_project_id, label: material.sub_project }
        : null,

      morNumber: material.mor_number || "",

      morQty: material.mor_qty?.toString() || "",

      poOrderQty: material.po_order_qty?.toString() || "",

      grnQty: material.grn_qty?.toString() || "",

      uom_name: material.uom || "",

      order_qty: material.po_order_qty?.toString() || "",

      material_name: material.material_name,

      pms_inventory_id: material.pms_inventory_id,

      mor_inventory_id: material.mor_inventory_id,

      material_inventory_id: material.material_inventory_id,

      // Add fields that the table expects

      project_name: material.project || "",

      sub_project_name: material.sub_project || "",

      mor_number: material.mor_number || "",

      required_quantity: material.mor_qty?.toString() || "",
    }));

    setSubmittedMaterials(populatedMaterials);
  };
  // Populate rate and taxes

  const populateRateAndTaxes = (rateAndTaxes) => {
    const populatedRateData = {};

    rateAndTaxes.forEach((rate, index) => {
      populatedRateData[index] = {
        material: rate.material,

        hsnCode: "", // Not in API response

        ratePerNos: rate.material_rate?.toString() || "",

        totalPoQty: rate.po_qty?.toString() || "",

        discount: rate.discount_percentage?.toString() || "",

        materialCost: rate.material_cost?.toString() || "",

        discountRate: rate.discount_rate?.toString() || "",

        afterDiscountValue: rate.after_discount_value?.toString() || "",

        remark: "", // Not in API response

        isedit: rate.isedit,

        netCost: rate.all_inclusive_cost?.toString() || "",

        pms_inventory_id: rate.material_inventory_id || null,

        addition_bid_material_tax_details: [],

        deduction_bid_material_tax_details: [],
      };
    });

    setTaxRateData(populatedRateData);
  };

  // Populate tax details from mor_inventory_tax_details

  const populateTaxDetails = (taxDetails) => {
    const populatedTaxData = {};

    // Group tax details by po_mor_inventory_id

    const groupedTaxes = taxDetails.reduce((acc, tax) => {
      const key = tax.po_mor_inventory_id;

      if (!acc[key]) {
        acc[key] = { addition: [], deduction: [] };
      }

      const taxItem = {
        id: tax.id,

        resource_id: tax.resource_id,

        tax_category_id: tax.resource_id, // Using resource_id as tax_category_id

        taxChargeType: tax.resource_name || tax.resource_type,

        taxType: tax.resource_type,

        taxChargePerUom: "", // Not in API response

        percentageId: null,

        inclusive: tax.inclusive,

        amount: tax.amount?.toString() || "0",
      };

      if (tax.addition) {
        acc[key].addition.push(taxItem);
      } else {
        acc[key].deduction.push(taxItem);
      }

      return acc;
    }, {});

    // Update taxRateData with tax details

    setTaxRateData((prev) => {
      const updated = { ...prev };

      Object.keys(groupedTaxes).forEach((key) => {
        const materialIndex = submittedMaterials.findIndex((m) => m.id == key);

        if (materialIndex !== -1 && updated[materialIndex]) {
          updated[materialIndex] = {
            ...updated[materialIndex],

            addition_bid_material_tax_details: groupedTaxes[key].addition,

            deduction_bid_material_tax_details: groupedTaxes[key].deduction,
          };
        }
      });

      return updated;
    });
  };

  // Populate other sections (charges, terms, etc.)

  const populateOtherSections = (data) => {
    // Populate tax summary

    if (data.tax_summary) {
      setTaxSummary(data.tax_summary);
    }

    // Populate charges data from mor_inventory_tax_details (map to internal shape)

    if (data.mor_inventory_tax_details) {
      const mappedCharges = (data.mor_inventory_tax_details || [])
        // Consider only TaxCharge additions that are exclusive (inclusive=false)
        .filter(
          (item) =>
            item &&
            item.resource_type === "TaxCharge" &&
            Boolean(item.inclusive) === false
        )
        .map((item) => ({
          id: item.id,
          material_id: item.po_mor_inventory_id,
          charge_name: item.resource_name || "",
          resource_id: item.resource_id,
          resource_type: item.resource_type,
          amount: parseFloat(item.amount || 0),
          amount_inr: parseFloat(item.amount_in_inr || 0),
          inclusive: Boolean(item.inclusive),
          addition: Boolean(item.addition),
          applicable_to_payable: Boolean(item.applicable_to_payable),
          supplier_id: item.supplier_id ?? null,
          supplier_name: item.supplier_name || "",
          remarks: item.remarks || "",
          service_certificate_advance_percentage:
            item.service_certificate_advance_percentage ?? null,
          service_certificate_advance_amount:
            item.service_certificate_advance_amount ?? null,
        }));

      setChargesFromApi(mappedCharges);
    }

    // Populate charges data from charges_with_taxes

    if (data.charges_with_taxes) {
      const populatedCharges = data.charges_with_taxes.map((charge) => ({
        id: charge.id,

        charge_name: "Handling Charges", // Default charge name, you can map based on charge_id if needed

        amount: charge.amount?.toString() || "",

        realised_amount: charge.realised_amount?.toString() || "",

        taxes_and_charges: charge.taxes_and_charges || [],
      }));

      setCharges(populatedCharges);
    }

    // Populate other cost details from other_cost_details

    if (data.other_cost_details) {
      const populatedCosts = data.other_cost_details.map((cost) => ({
        id: cost.id,

        cost_name: cost.cost_type || "",

        amount: cost.cost?.toString() || "",

        scope: cost.scope || "",

        taxes_and_charges: cost.taxes_and_charges || [],
      }));

      setOtherCosts(populatedCosts);
    }

    // Populate terms and conditions

    if (data.terms_and_conditions) {
      const terms = data.terms_and_conditions;

      setTermsFormData((prev) => ({
        ...prev,

        creditPeriod: terms.credit_period?.toString() || "",

        poValidityPeriod: terms.po_validity_period?.toString() || "",

        advanceReminderDuration:
          terms.advance_reminder_duration?.toString() || "",

        paymentTerms: terms.payment_terms || "",

        paymentRemarks: terms.payment_remarks || "",

        supplierAdvance: terms.supplier_advance || "",

        supplierAdvanceAmount: terms.supplier_advance_amount?.toString() || "",

        serviceCertificateAdvance: terms.survice_certificate_advance || "",
      }));

      // Set advance percentage state variables

      setSupplierAdvancePercentage(terms.supplier_advance_percentage?.toString() || "");

      setServiceCertificateAdvancePercentage(
        terms.survice_certificate_advance?.toString() || ""
      );
    }

    // Set conversion rate from API response

    if (data.conversion_rate) {
      setConversionRate(data.conversion_rate.toString());
    }

    // Populate resource term conditions

    if (data.resource_term_conditions) {
      const populatedTermConditions = data.resource_term_conditions.map(
        (term) => ({
          id: term.id,

          termConditionId: term.term_condition_id,

          conditionCategory: term.condition_category || "",

          condition: term.condition || "",
        })
      );

      setTermsConditions(populatedTermConditions);

      // Also populate general terms for the General Term & Conditions table

      const formattedGeneralTerms = data.resource_term_conditions.map(
        (term) => ({
          id: term.id,

          category: term.condition_category || "",

          condition: term.condition || "",
        })
      );

      setGeneralTerms(formattedGeneralTerms);
    }
  };

  // Fetch delivery schedules data

  const fetchDeliverySchedules = useCallback(() => {
    if (submittedMaterials && submittedMaterials.length > 0) {
      const morInventoryIds = submittedMaterials

        .map((material) => material.mor_inventory_id)

        .join(",");

      const apiUrl = `${baseURL}purchase_orders/material_delivery_schedules.json?token=${token}&mor_inventory_ids=${morInventoryIds}&type=import`;

      console.log("Fetching delivery schedules from:", apiUrl);

      axios

        .get(apiUrl)

        .then((response) => {
          console.log("Delivery schedules response:", response.data);

          // Only set delivery schedules if we don't already have them from main API response

          setDeliverySchedules((prev) => {
            // If we already have delivery schedules from main API response, don't override

            if (prev && prev.length > 0) {
              console.log(
                "Keeping existing delivery schedules from main API response"
              );

              return prev;
            }

            return response.data.material_delivery_schedules || [];
          });

          // Populate Material Specific Term & Conditions from the same response

          setMaterialTermConditions(
            response.data.material_term_conditions || []
          );
        })

        .catch((error) => {
          console.error("Error fetching delivery schedules:", error);

          setDeliverySchedules([]);

          setMaterialTermConditions([]);
        });
    }
  }, [submittedMaterials, token, baseURL]);

  // Removed dedicated term conditions fetch; using delivery schedules response instead

  // Fetch delivery schedules when submitted materials change

  useEffect(() => {
    fetchDeliverySchedules();
  }, [fetchDeliverySchedules]);

  // Function to consolidate charges by charge name

  // This consolidates similar charges (e.g., handling charges, freight charges) across multiple materials

  // into single rows with total amounts, instead of showing separate rows for each material

  const getConsolidatedCharges = useCallback(() => {
    if (!chargesFromApi || chargesFromApi.length === 0) return [];

    // Filter only TaxCharge type charges and exclude inclusive=true

    const taxCharges = (chargesFromApi || []).filter(
      (charge) =>
        charge &&
        charge.resource_type === "TaxCharge" &&
        Boolean(charge.inclusive) === false
    );

    // Group charges by charge_name

    const groupedCharges = taxCharges.reduce((acc, charge) => {
      const chargeName = charge.charge_name || "Unknown";

      if (!acc[chargeName]) {
        acc[chargeName] = {
          charge_name: chargeName,

          total_amount_usd: 0,

          total_amount_inr: 0,

          charge_ids: [],

          charges: [],
        };
      }

      // Add amounts

      acc[chargeName].total_amount_usd += parseFloat(charge.amount || 0);

      acc[chargeName].total_amount_inr += parseFloat(charge.amount_inr || 0);

      acc[chargeName].charge_ids.push(charge.id);

      acc[chargeName].charges.push(charge);

      return acc;
    }, {});

    // Convert to array and sort by charge name

    return Object.values(groupedCharges).sort((a, b) =>
      a.charge_name.localeCompare(b.charge_name)
    );
  }, [chargesFromApi]);

  // Initialize preselected fields for Charges (Exclusive) from API data
  useEffect(() => {
    if (!Array.isArray(chargesFromApi) || chargesFromApi.length === 0) return;

    // Initialize Service Provider, Remarks, and Service Certificate per charge id
    setSelectedServiceProviders((prev) => {
      const next = { ...prev };
      chargesFromApi.forEach((c) => {
        if (c && c.id) {
          if (c.supplier_id && c.supplier_name) {
            next[c.id] = { value: c.supplier_id, label: c.supplier_name };
          }
        }
      });
      return next;
    });

    setChargeRemarks((prev) => {
      const next = { ...prev };
      chargesFromApi.forEach((c) => {
        if (c && c.id) {
          if (typeof c.remarks === "string") next[c.id] = c.remarks;
        }
      });
      return next;
    });

    setServiceCertificates((prev) => {
      const next = { ...prev };
      chargesFromApi.forEach((c) => {
        if (c && c.id) {
          // Map applicable_to_payable to the Service Certificate checkbox
          if (typeof c.applicable_to_payable === "boolean") {
            next[c.id] = c.applicable_to_payable;
          }
        }
      });
      return next;
    });

    // Initialize Service Certificate Advance % per consolidated row
    // Derive percentage from total advance amount (INR) / total consolidated base (INR)
    const consolidated = getConsolidatedCharges();
    if (Array.isArray(consolidated) && consolidated.length > 0) {
      setServiceCertAdvancePercentByRow((prev) => {
        const next = { ...prev };
        consolidated.forEach((row, idx) => {
          const totalInr = parseFloat(row.total_amount_inr || 0) || 0;
          if (totalInr <= 0) return;

          // Sum INR advance amount across all charges in this consolidated row
          const sumAdvanceInr = (row.charge_ids || []).reduce((sum, id) => {
            const charge = (chargesFromApi || []).find((c) => c.id === id);
            const advInr = parseFloat(
              charge?.service_certificate_advance_amount || 0
            );
            return sum + (isNaN(advInr) ? 0 : advInr);
          }, 0);

          if (sumAdvanceInr > 0) {
            const percent = (sumAdvanceInr / totalInr) * 100;
            next[idx] = percent.toFixed(2);
          }
        });
        return next;
      });
    }
  }, [chargesFromApi, getConsolidatedCharges]);

  // Fetch inventory types for MOR modal

  useEffect(() => {
    axios

      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )

      .then((response) => {
        if (Array.isArray(response.data)) {
          const options = response.data.map((inventory) => ({
            value: inventory.id,

            label: inventory.name,
          }));

          setInventoryTypes2(options);
        } else if (
          response.data &&
          Array.isArray(response.data.inventory_types)
        ) {
          const options = response.data.inventory_types.map((inventory) => ({
            value: inventory.id,

            label: inventory.name,
          }));

          setInventoryTypes2(options);
        } else {
          setInventoryTypes2([]);
        }
      })

      .catch((error) => {
        console.error("Error fetching inventory types:", error);

        setInventoryTypes2([]);
      });
  }, []);

  // Fetch inventory sub-types when material type changes

  useEffect(() => {
    if (selectedInventory2 || morFormData.materialType) {
      axios

        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${
            selectedInventory2?.value || morFormData.materialType
          }&token=${token}`
        )

        .then((response) => {
          if (Array.isArray(response.data)) {
            const options = response.data.map((subType) => ({
              value: subType.id,

              label: subType.name,
            }));

            setInventorySubTypes2(options);
          } else if (
            response.data &&
            Array.isArray(response.data.inventory_sub_types)
          ) {
            const options = response.data.inventory_sub_types.map(
              (subType) => ({
                value: subType.id,

                label: subType.name,
              })
            );

            setInventorySubTypes2(options);
          } else {
            setInventorySubTypes2([]);
          }
        })

        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);

          setInventorySubTypes2([]);
        });
    }
  }, [selectedInventory2, morFormData.materialType]);
  // Fetch inventory materials when material type changes

  useEffect(() => {
    if (selectedInventory2 || morFormData.materialType) {
      axios

        .get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${
            selectedInventory2?.value || morFormData.materialType
          }&q[material_category_eq]=material&token=${token}`
        )

        .then((response) => {
          if (Array.isArray(response.data)) {
            const options = response.data.map((subType) => ({
              value: subType.id,

              label: subType.name,
            }));

            setInventoryMaterialTypes2(options);
          } else if (
            response.data &&
            Array.isArray(response.data.inventories)
          ) {
            const options = response.data.inventories.map((subType) => ({
              value: subType.id,

              label: subType.name,
            }));

            setInventoryMaterialTypes2(options);
          } else {
            setInventoryMaterialTypes2([]);
          }
        })

        .catch((error) => {
          console.error("Error fetching inventory materials:", error);

          setInventoryMaterialTypes2([]);
        });
    }
  }, [selectedInventory2, morFormData.materialType]);

  // Fetch Vendor GSTIN when supplier changes

  useEffect(() => {
    const fetchVendorGstin = async () => {
      try {
        if (selectedSupplier?.value) {
          const supplierId = selectedSupplier.value;

          const res = await axios.get(
            `${baseURL}pms/suppliers/${supplierId}/gstin.json?token=${token}`
          );

          // API returns { supplier_id, gstin }

          setVendorGstin(res.data?.gstin || "");
        } else {
          setVendorGstin("");
        }
      } catch (e) {
        console.error("Failed to fetch Vendor GSTIN:", e);

        setVendorGstin("");
      }
    };

    fetchVendorGstin();
  }, [selectedSupplier, token]);

  // Handle company selection

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company

    // setSelectedProject(null); // Reset project selection

    // setSelectedSite(null); // Reset site selection

    // setSelectedWing(null); // Reset wing selection

    // setProjects([]); // Reset projects

    // setSiteOptions([]); // Reset site options

    // setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected company from the list

      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );

      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,

          label: prj.name,
        }))
      );
    }
  };
  // Handle supplier selection

  const handleSupplierChange = (selectedOption) => {
    setSelectedSupplier(selectedOption);

    setVendorGstin("");
  };

  // Handle currency selection

  const handleCurrencyChange = (selectedOption) => {
    if (!selectedOption || !selectedOption.value) {
      setSelectedCurrency(null);
      return;
    }
    setSelectedCurrency({
      code: selectedOption.value,
      symbol: selectedOption.symbol,
    });
  };

  // Handle project selection

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);

    setSelectedSite(null); // Reset site selection when project changes
  };

  // Handle site selection

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Currencies state

  const [currencies, setCurrencies] = useState([]);

  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      JPY: "¥",
      INR: "₹",
      CNY: "¥",
    };
    return symbols[currencyCode] || "$";
  };

  // Dynamic PO currency code for display (e.g., USD, CAD)

  const poCurrencyCode = selectedCurrency?.code || "";

  // State for conversion rate

  const [conversionRate, setConversionRate] = useState("");

  // Map companies to options for the dropdown

  const companyOptions = companies.map((company) => ({
    value: company.id,

    label: company.company_name,
  }));

  // Map suppliers to options for the dropdown

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,

    label: supplier.organization_name || supplier.full_name,
  }));

  // Map currencies to options for the dropdown

  const currencyOptions = currencies.map((currency) => ({
    value: currency.currency.toUpperCase(),

    label: currency.name,

    symbol:
      currency.currency === "usd"
        ? "$"
        : currency.currency === "cad"
        ? "C$"
        : currency.currency.toUpperCase(),
  }));
  const currencyOptionsWithPlaceholder = [
    { value: "", label: "Select Currency" },
    ...currencyOptions,
  ];

  // State for dropdown options

  const [unitOfMeasures, setUnitOfMeasures] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);

  const [genericSpecifications, setGenericSpecifications] = useState([]);

  const [selectedGenericSpecifications, setSelectedGenericSpecifications] =
    useState(null);

  const [colors, setColors] = useState([]);

  const [selectedColors, setSelectedColors] = useState(null);

  const [inventoryBrands, setInventoryBrands] = useState([]);

  const [selectedInventoryBrands, setSelectedInventoryBrands] = useState(null);

  // Get token from URL

  // Table data state

  const [tableData, setTableData] = useState([]);

  // Handler functions

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSelectorChange = (field, selectedOption) => {
    setFormData((prev) => ({
      ...prev,

      [field]: selectedOption ? selectedOption.value : "",
    }));

    // Update the selectedInventory2 state when material type is selected

    if (field === "materialType") {
      setSelectedInventory2(selectedOption);

      // Clear dependent fields when material type changes

      setFormData((prev) => ({
        ...prev,

        materialSubType: "",

        material: "",

        genericSpecification: "",

        colour: "",

        brand: "",

        uom: "",
      }));
    }
  };
  const handleCreate = (e) => {
    // Prevent form submission and page refresh

    e.preventDefault();

    // Validation logic here

    const errors = {};

    if (!formData.materialType)
      errors.materialType = "Material Type is required";

    if (!formData.materialSubType)
      errors.materialSubType = "Material Sub Type is required";

    if (!formData.material) errors.material = "Material is required";

    if (!formData.uom) errors.uom = "UOM is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      return;
    }

    // Prevent duplicate combination (Type, Sub-Type, Material, UOM, Brand, Colour, Specification)

    const toStr = (v) => (v === undefined || v === null ? "" : String(v));

    const isDuplicateMaterial = tableData

      .filter((row) => !row._destroy)

      .some((row, index) => {
        // Exclude the row being edited from duplicate check

        if (editRowIndex !== null && index === editRowIndex) return false;

        return (
          toStr(row.materialType) === toStr(formData.materialType) &&
          toStr(row.materialSubType) === toStr(formData.materialSubType) &&
          toStr(row.material) === toStr(formData.material) &&
          toStr(row.uom) === toStr(formData.uom) &&
          toStr(row.brand) === toStr(formData.brand) &&
          toStr(row.colour) === toStr(formData.colour) &&
          toStr(row.genericSpecification) ===
            toStr(formData.genericSpecification)
        );
      });

    if (isDuplicateMaterial) {
      const duplicateMsg =
        "Duplicate material entry with same Type, Sub-Type, Material, UOM, Brand, Colour and Specification is not allowed.";

      setFieldErrors((prev) => ({
        ...prev,

        // materialType: duplicateMsg,

        // materialSubType: duplicateMsg,

        // material: duplicateMsg,

        // uom: duplicateMsg,

        // brand: duplicateMsg,

        // colour: duplicateMsg,

        // genericSpecification: duplicateMsg,
      }));

      toast.error(duplicateMsg);

      return;
    }

    // Add to table data or update existing

    const newRow = {
      id: editRowIndex !== null ? tableData[editRowIndex].id : Date.now(),

      materialType: formData.materialType,

      materialTypeLabel:
        inventoryTypes2.find((opt) => opt.value === formData.materialType)
          ?.label || "",

      materialSubType: formData.materialSubType,

      materialSubTypeLabel:
        inventorySubTypes2.find((opt) => opt.value === formData.materialSubType)
          ?.label || "",

      material: formData.material,

      materialLabel:
        inventoryMaterialTypes2.find((opt) => opt.value === formData.material)
          ?.label || "",

      genericSpecification: formData.genericSpecification,

      genericSpecificationLabel:
        genericSpecifications.find(
          (opt) => opt.value === formData.genericSpecification
        )?.label || "",

      colour: formData.colour,

      colourLabel:
        colors.find((opt) => opt.value === formData.colour)?.label || "",

      brand: formData.brand,

      brandLabel:
        inventoryBrands.find((opt) => opt.value === formData.brand)?.label ||
        "",

      uom: formData.uom,

      uomLabel:
        unitOfMeasures.find((opt) => opt.value === formData.uom)?.label || "",

      effectiveDate: formData.effectiveDate,
    };

    if (editRowIndex !== null) {
      // Update existing row

      setTableData((prev) =>
        prev.map((row, index) => (index === editRowIndex ? newRow : row))
      );
    } else {
      // Add new row

      setTableData((prev) => [...prev, newRow]);
    }

    // Reset form

    setFormData({
      materialType: "",

      materialSubType: "",

      material: "",

      genericSpecification: "",

      colour: "",

      brand: "",

      effectiveDate: "",

      uom: "",
    });

    setShowModal(false);

    setEditRowIndex(null);

    setFieldErrors({});
  };

  const handleEffectiveDateChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          return { ...row, effectiveDate: value };
        }

        return row;
      })
    );
  };

  const handleEditRow = (index, material) => {
    const row = tableData[index];

    setFormData({
      materialType: row.materialType,

      materialSubType: row.materialSubType,

      material: row.material,

      genericSpecification: row.genericSpecification,

      colour: row.colour,

      brand: row.brand,

      effectiveDate: row.effectiveDate,

      uom: row.uom,
    });

    setEditRowIndex(index);

    setShowModal(true);
  };

  const handleDeleteRow = (index) => {
    setTableData((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, _destroy: true } // Mark for deletion
          : row
      )
    );
  };

  // Handle submit button click

  const handleUpdateMaterials = async () => {
    console.log("Update button clicked");

    console.log("tableData:", tableData);

    console.log("selectedCompany:", selectedCompany);

    // Simple test alert

    if (!selectedCompany) {
      console.log("No company selected");

      toast.error("Please select a company.");

      return;
    }

    // Filter out deleted rows for validation

    const activeRows = tableData.filter((row) => !row._destroy);

    if (activeRows.length === 0) {
      console.log("No materials in table");

      toast.error("Please add at least one material before updating.");

      return;
    }

    // Check for duplicate materials

    // const materialIds = activeRows.map((row) => row.material);

    // const hasDuplicate = materialIds.some(

    //   (id, idx) => id && materialIds.indexOf(id) !== idx

    // );

    // if (hasDuplicate) {

    //   toast.error(

    //     "Duplicate materials are not allowed. Please ensure each material is unique."

    //   );

    //   return;

    // }

    // Check if any row is missing a material

    const missingMaterial = activeRows.some((row) => !row.material);

    console.log("missingMaterial:", missingMaterial);

    if (missingMaterial) {
      console.log("Some rows missing material");

      toast.error("Please select a material for all rows before updating.");

      return;
    }

    setIsSubmitting(true);

    // Prepare materials array for API (exclude deleted rows)

    const materials = tableData

      .filter((row) => !row._destroy)

      .map((row) => ({
        id: row.id, // Include ID for existing records (local or server)

        pms_inventory_id: row.material,

        unit_of_measure_id: row.uom,

        pms_inventory_sub_type_id: row.materialSubType,

        pms_generic_info_id: row.genericSpecification || null,

        pms_colour_id: row.colour || null,

        pms_brand_id: row.brand || null,
      }));

    const payload = {
      company_id: selectedCompany.value,

      materials: materials,
    };

    // Add po_id only if we have a purchase order ID from previous submission

    if (purchaseOrderId) {
      payload.po_id = purchaseOrderId;

      console.log("Including po_id in payload:", purchaseOrderId);
    } else {
      console.log("No po_id included in payload (first submission)");
    }

    try {
      const response = await axios.post(
        `${baseURL}purchase_orders/ropo_material_details.json?token=${token}`,

        payload
      );

      if (response.status === 200 || response.status === 201) {
        console.log("API Response:", response.data);

        // Store the materials data from API response

        if (response.data.success && response.data.materials) {
          setSubmittedMaterials(response.data.materials);
        }

        if (response.data.success && response.data.material_inventory_ids) {
          setApiMaterialInventoryIds(response.data.material_inventory_ids);

          console.log(
            "Material Inventory IDs after submit:",

            response.data.material_inventory_ids
          );
        }

        // Store the purchase order ID for future submissions

        if (response.data.success && response.data.purchase_order_id) {
          setPurchaseOrderId(response.data.purchase_order_id);

          console.log(
            "Purchase Order ID stored:",

            response.data.purchase_order_id
          );
        }

        toast.success("Materials updated successfully!");

        // Change tab to Rate & Taxes

        setActiveTab("rate-taxes");

        const rateTaxesTab = document.querySelector(
          '[data-bs-target="#Domestic2"]'
        );

        if (rateTaxesTab) {
          rateTaxesTab.click();
        }
      }
    } catch (error) {
      console.error("Error submitting materials:", error);

      toast.error("Error submitting materials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Add MOR modal logic (borrowed from mapping page, simplified) ---

  const handleMorMaterialCheckboxChange = (index) => {
    setSelectedMaterialItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleMorSelectAllMaterials = (e) => {
    if (e.target.checked) {
      setSelectedMaterialItems(materialDetailsData.map((_, idx) => idx));
    } else {
      setSelectedMaterialItems([]);
    }
  };
  const fetchMaterialDetails = async () => {
    setLoadingMaterialDetails(true);

    try {
      const params = new URLSearchParams();

      params.append("token", token);

      params.append("q[mor_type_eq]", "import");

      if (selectedCompany?.value) {
        params.append("q[company_id_eq]", selectedCompany.value);
      }

      if (poId) {
        params.append("po_id", poId);

        params.append("type", "edit");
      }

      if (morFormData.morNumber)
        params.append("q[id_in][]", morFormData.morNumber);

      if (morFormData.morStartDate)
        params.append("q[mor_date_gteq][]", morFormData.morStartDate);

      if (morFormData.morEndDate)
        params.append("q[mor_date_lteq][]", morFormData.morEndDate);

      // Add project and sub-project filters

      if (selectedProject && selectedProject.length > 0) {
        selectedProject.forEach((project) => {
          params.append("q[project_id_in][]", project.value);
        });
      }

      if (selectedSite && selectedSite.length > 0) {
        selectedSite.forEach((site) => {
          params.append("q[pms_site_id_in][]", site.value);
        });
      }

      // Add material type filters

      if (morFormData.materialType) {
        params.append("q[material_type_id_in][]", morFormData.materialType);
      }

      if (morFormData.materialSubType) {
        params.append(
          "q[material_type_material_sub_type_id_in][]",

          morFormData.materialSubType
        );
      }

      if (morFormData.material) {
        params.append(
          "q[mor_inventories_material_id_in][]",

          morFormData.material
        );
      }

      const url = `${baseURL}material_order_requests/material_details.json?${params.toString()}`;

      console.log("Fetching material details with URL:", url);

      const resp = await axios.get(url);

      const list = Array.isArray(resp.data?.material_order_requests)
        ? resp.data.material_order_requests
        : Array.isArray(resp.data)
        ? resp.data
        : [];

      const rows = [];

      list.forEach((mor) => {
        const morInventories = mor.mor_inventories || [];

        morInventories.forEach((inv, invIndex) => {
          rows.push({
            mor_id: mor.id,

            mor_number: mor.mor_number,

            mor_date: mor.mor_date,

            project_name: mor.project_name,

            sub_project_name: mor.sub_project_name,

            status: mor.status,

            inventory_id: inv.id,
            material_inventory_id: inv.inventory_id,

            material_name: inv.material_name || inv.material,

            uom_name: inv.uom_name,

            uom_id: inv.uom_id,

            required_quantity: inv.required_quantity,

            prev_order_qty: inv.prev_order_qty,

            pending_qty: inv.pending_qty || "", // Use empty string if null

            order_qty: inv.order_qty || "", // Use empty string if null

            generic_info_id: inv.generic_info_id,

            brand_id: inv.brand_id,

            colour_id: inv.colour_id,

            inventory_status: inv.inventory_status,

            isFirstMaterial: invIndex === 0, // First material in this MOR

            rowspan: morInventories.length, // Number of materials in this MOR
          });
        });
      });

      // Preselect already-added materials and carry over their order qty

      const existingByInventoryId = new Map(
        (Array.isArray(submittedMaterials) ? submittedMaterials : []).map(
          (m) => [String(m.mor_inventory_id || m.inventory_id || m.id), m]
        )
      );

      const preselectedIndices = [];

      const adjustedRows = rows.map((r, idx) => {
        const key = String(r.inventory_id);

        if (existingByInventoryId.has(key)) {
          preselectedIndices.push(idx);

          const existing = existingByInventoryId.get(key);

          const carriedOrderQty =
            existing.order_qty ?? existing.poOrderQty ?? existing.po_order_qty;

          return {
            ...r,

            order_qty:
              carriedOrderQty !== undefined &&
              carriedOrderQty !== null &&
              carriedOrderQty !== ""
                ? carriedOrderQty
                : r.order_qty,
          };
        }

        return r;
      });

      setMaterialDetailsData(adjustedRows);

      if (preselectedIndices.length > 0) {
        setSelectedMaterialItems(preselectedIndices);
      }
    } catch (e) {
      console.error("Failed to fetch MOR material details", e);

      setMaterialDetailsData([]);
    } finally {
      setLoadingMaterialDetails(false);
    }
  };

  const handleMorSearch = () => fetchMaterialDetails();

  const handleMorReset = () => {
    setMorFormData({
      morNumber: "",

      morStartDate: "",

      morEndDate: "",

      projectIds: [],

      siteIds: [],

      materialType: "",

      materialSubType: "",

      material: "",
    });

    setSelectedProject(null);

    setSelectedSite(null);

    setSelectedInventory2(null);

    setSelectedSubType2(null);

    setSelectedInventoryMaterialTypes2(null);

    setMaterialDetailsData([]);

    setSelectedMaterialItems([]);
  };

  // Handle project selection for MOR modal

  const handleMorSelectProject = (e, morId) => {
    const isChecked = e.target.checked;

    const morMaterials = materialDetailsData.filter((m) => m.mor_id === morId);

    const morIndices = morMaterials.map((m) => materialDetailsData.indexOf(m));

    if (isChecked) {
      setSelectedMaterialItems((prev) => [
        ...new Set([...prev, ...morIndices]),
      ]);
    } else {
      setSelectedMaterialItems((prev) =>
        prev.filter((idx) => !morIndices.includes(idx))
      );
    }
  };
  // Handle order quantity change

  const handleOrderQtyChange = (index, value) => {
    // Validation: Prevent negative values

    const numValue = parseFloat(value);

    if (value !== "" && (isNaN(numValue) || numValue < 0)) {
      toast.error(
        "Order quantity cannot be negative. Please enter a valid positive number."
      );

      return;
    }

    // Validation: Prevent entering order qty greater than (pending qty + prev order qty)

    const rowAtIndex = materialDetailsData[index];

    const pendingQty =
      parseFloat(rowAtIndex?.pending_qty ?? rowAtIndex?.pending_quantity) || 0;

    const prevOrdered = parseFloat(rowAtIndex?.prev_order_qty) || 0;

    const maxAllowed = pendingQty + prevOrdered;

    if (value !== "" && Number.isFinite(numValue) && numValue > maxAllowed) {
      toast.error(
        `Order quantity cannot exceed Pending Qty + Prev Order Qty (${maxAllowed}).`
      );

      return;
    }

    setMaterialDetailsData((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, order_qty: value } : item
      )
    );
  };

  // MOR Modal related functions

  const handleMorSelectorChange = (field, selectedOption) => {
    setMorFormData((prev) => ({
      ...prev,

      [field]: selectedOption ? selectedOption.value : "",
    }));

    if (field === "materialType") {
      setSelectedInventory2(selectedOption);

      setMorFormData((prev) => ({
        ...prev,

        materialSubType: "",

        material: "",
      }));
    }
  };

  // Per-row options cache for MOR modal (by inventory_id)
  const [morOptionsByInventoryId, setMorOptionsByInventoryId] = useState({});

  const loadMorRowOptionsIfNeeded = async (inventoryId) => {
    if (!inventoryId) return;
    setMorOptionsByInventoryId((prev) => prev[inventoryId] ? prev : { ...prev, [inventoryId]: { loading: true } });
    try {
      const [genResp, colorResp, brandResp, uomResp] = await Promise.all([
        axios.get(`${baseURL}pms/generic_infos.json?q[material_id_eq]=${inventoryId}&token=${token}`),
        axios.get(`${baseURL}pms/colours.json?q[material_id_eq]=${inventoryId}&token=${token}`),
        axios.get(`${baseURL}pms/inventory_brands.json?q[material_id_eq]=${inventoryId}&token=${token}`),
        axios.get(`${baseURL}unit_of_measures.json?q[material_uoms_material_id_eq]=${inventoryId}&token=${token}`),
      ]);

      const genericOptions = Array.isArray(genResp?.data)
        ? genResp.data.map((spec) => ({ value: spec.id, label: spec.generic_info }))
        : [];
      const colourOptions = Array.isArray(colorResp?.data)
        ? colorResp.data.map((c) => ({ value: c.id, label: c.colour }))
        : [];
      const brandOptions = Array.isArray(brandResp?.data)
        ? brandResp.data.map((b) => ({ value: b.id, label: b.brand_name }))
        : [];
      const uomOptions = Array.isArray(uomResp?.data)
        ? uomResp.data.map((u) => ({ value: u.id, label: u.unit_name || u.name || u.uom }))
        : [];

      setMorOptionsByInventoryId((prev) => ({
        ...prev,
        [inventoryId]: { genericOptions, colourOptions, brandOptions, uomOptions, loading: false },
      }));
    } catch (e) {
      setMorOptionsByInventoryId((prev) => ({
        ...prev,
        [inventoryId]: { genericOptions: [], colourOptions: [], brandOptions: [], uomOptions: [], loading: false },
      }));
    }
  };

  const handleMorRowGenericChange = (rowIndex, selectedOption) => {
    setMaterialDetailsData((prev) => prev.map((r, idx) => idx === rowIndex ? { ...r, generic_info_id: selectedOption ? selectedOption.value : null } : r));
  };
  const handleMorRowBrandChange = (rowIndex, selectedOption) => {
    setMaterialDetailsData((prev) => prev.map((r, idx) => idx === rowIndex ? { ...r, brand_id: selectedOption ? selectedOption.value : null } : r));
  };
  const handleMorRowColourChange = (rowIndex, selectedOption) => {
    setMaterialDetailsData((prev) => prev.map((r, idx) => idx === rowIndex ? { ...r, colour_id: selectedOption ? selectedOption.value : null } : r));
  };
  
  const handleAcceptSelectedMaterials = async () => {
    if (!selectedCompany?.value) {
      toast.error("Please select a company first.");

      return;
    }

    if (selectedMaterialItems.length === 0) {
      toast.error("Please select at least one material");

      return;
    }

    try {
      const selectedRows = selectedMaterialItems.map(
        (idx) => materialDetailsData[idx]
      );

      // Do not block duplicates; we'll merge with existing to update order qty

      // Validation: Check for negative or zero order quantities

      const invalidQuantities = selectedRows.some((row) => {
        const orderQty = parseFloat(row.order_qty) || 0;

        return orderQty <= 0;
      });

      if (invalidQuantities) {
        toast.error("Order quantity must be greater than 0 for all materials.");

        return;
      }

      // Validation: Check if all required fields are filled

      const missingFields = selectedRows.some((row) => {
        return (
          !(row.material_name || row.material) ||
          !row.uom_name ||
          !row.order_qty
        );
      });

      if (missingFields) {
        toast.error(
          "Please ensure all materials have material name, UOM, and order quantity filled."
        );

        return;
      }

      // Prepare materials array for API payload

      // Requirement: when adding more materials later, include previously added materials too

      // Build a normalized list from both submittedMaterials and selectedRows, then dedupe by mor_inventory_id

      const previouslySubmitted = Array.isArray(submittedMaterials)
        ? submittedMaterials
        : [];

      const normalizedFromSubmitted = previouslySubmitted.map((r) => ({
        mor_inventory_id: r.mor_inventory_id || r.inventory_id || r.id,

        po_mor_inventory_id: r.id, // ensure updates for existing

        order_qty: r.order_qty || r.required_quantity || 0,

        uom_id: r.uom_id || null,

        generic_info_id: r.generic_info_id || null,

        brand_id: r.brand_id || null,

        colour_id: r.colour_id || null,
      }));

      const existingByMorInv = new Map(
        previouslySubmitted.map((m) => [
          String(m.mor_inventory_id || m.inventory_id || m.id),

          m,
        ])
      );

      const normalizedFromSelected = selectedRows.map((r) => {
        const morInvId = r.mor_inventory_id || r.inventory_id;

        const existing = existingByMorInv.get(String(morInvId));

        return {
          mor_inventory_id: morInvId,

          po_mor_inventory_id: existing ? existing.id : undefined,

          order_qty: r.order_qty || r.required_quantity || 0,

          uom_id: r.uom_id || null,

          generic_info_id: r.generic_info_id || null,

          brand_id: r.brand_id || null,

          colour_id: r.colour_id || null,
        };
      });

      const dedupMap = new Map();

      [...normalizedFromSubmitted, ...normalizedFromSelected].forEach((m) => {
        if (!m || m.mor_inventory_id == null) return;

        const key = String(m.mor_inventory_id);

        const prev = dedupMap.get(key);

        // Prefer selected row values (especially order_qty); keep po_mor_inventory_id when present

        if (prev) {
          dedupMap.set(key, {
            ...prev,

            ...m,

            po_mor_inventory_id:
              prev.po_mor_inventory_id || m.po_mor_inventory_id,
          });
        } else {
          dedupMap.set(key, m);
        }
      });

      const materials = Array.from(dedupMap.values());

      // Prepare API payload

      const payload = {
        // Ensure existing PO is referenced so API updates instead of creating

        po_id: purchaseOrderId || poId || null,

        company_id: selectedCompany?.value,

        materials: materials,
      };

      console.log("Submitting materials with payload:", payload);

      // Make API call

      const response = await axios.post(
        `${baseURL}purchase_orders/import_material_details.json?token=${token}`,

        payload
      );

      console.log("API response:", response.data);

      // Update purchase order ID if returned from API

      if (response.data?.purchase_order_id) {
        setPurchaseOrderId(response.data.purchase_order_id);
      }

      // Prefer server-returned materials to capture po_mor_inventory IDs

      const apiMaterials = Array.isArray(response.data?.materials)
        ? response.data.materials
        : [];

      // Build a lookup from mor_inventory_id -> selected row info

      const byMorInvId = new Map(selectedRows.map((r) => [r.inventory_id, r]));

      const mappedFromApi = apiMaterials.map((m) => {
        const base = byMorInvId.get(m.mor_inventory_id) || {};

        return {
          // Use server id (po_mor_inventory id) so tax modal fetch works

          id: m.id,

          mor_inventory_id: m.mor_inventory_id, // Add this for duplicate checking

          mor_id: base.mor_id,

          mor_number: base.mor_number,

          mor_date: base.mor_date,

          project_name: base.project_name,

          sub_project_name: base.sub_project_name,

          material_name: base.material_name || base.material,

          uom_name: base.uom_name,

          required_quantity: base.required_quantity,

          prev_order_qty: base.prev_order_qty,

          order_qty: base.order_qty,
        };
      });

      const rowsToAdd =
        mappedFromApi.length > 0
          ? mappedFromApi
          : selectedRows.map((r) => ({
              id: r.inventory_id,

              mor_inventory_id: r.inventory_id,

              mor_id: r.mor_id,

              mor_number: r.mor_number,

              mor_date: r.mor_date,

              project_name: r.project_name,

              sub_project_name: r.sub_project_name,

              material_name: r.material_name || r.material,

              uom_name: r.uom_name,

              required_quantity: r.required_quantity,

              prev_order_qty: r.prev_order_qty,

              order_qty: r.order_qty,
            }));

      // Merge by mor_inventory_id, preserving existing order and updating in place

      setSubmittedMaterials((prev) => {
        const addByMorInv = new Map(
          rowsToAdd.map((r) => [String(r.mor_inventory_id), r])
        );

        const updated = prev.map((existing) => {
          const key = String(existing.mor_inventory_id);

          if (addByMorInv.has(key)) {
            const row = addByMorInv.get(key);

            // Update in place, keep existing id if server didn't return one

            addByMorInv.delete(key);

            return {
              ...existing,

              ...row,

              id: row.id ?? existing.id,
            };
          }

          return existing;
        });

        // Append only truly new materials (not previously present)

        const appended = Array.from(addByMorInv.values());

        return appended.length > 0 ? [...updated, ...appended] : updated;
      });

      toast.success(`Successfully added ${selectedRows.length} material(s)`);

      setAddMORModal(false);

      setSelectedMaterialItems([]);

      // Fetch delivery schedules after materials are added

      setTimeout(() => {
        fetchDeliverySchedules();
      }, 100);
    } catch (error) {
      console.error("Error adding materials:", error);

      toast.error("Error adding materials. Please try again.");
    }
  };
  // Tax modal functions

  const handleOpenTaxModal = async (rowIndex) => {
    console.log("Opening tax modal for row:", rowIndex);

    console.log("Current tax options:", taxOptions);

    // Validate conversion rate is set

    if (!conversionRate || conversionRate <= 0) {
      toast.error(
        `Please set the Conversion Rate (${poCurrencyCode} to INR) in the PO Details tab before opening tax modal.`
      );

      return;
    }

    setTableId(rowIndex);

    setShowTaxModal(true);

    // Get the material ID from submitted materials

    const material = submittedMaterials[rowIndex];

    if (material && material.id) {
      try {
        console.log("Fetching rate details for material ID:", material.id);

        const response = await axios.get(
          `${baseURL}po_mor_inventories/${material.id}/ropo_rate_details.json?token=${token}`
        );

        console.log("Rate details API response:", response.data);

        // Map the API response to our tax data structure

        const rateData = response.data;

        setTaxRateData((prev) => ({
          ...prev,

          [rowIndex]: {
            material:
              rateData.material ||
              submittedMaterials[rowIndex]?.material_name ||
              submittedMaterials[rowIndex]?.material?.material_name ||
              submittedMaterials[rowIndex]?.material ||
              "",

            hsnCode: rateData.hsn_code,

            ratePerNos: rateData.rate_per_nos?.toString(),

            totalPoQty: rateData.order_qty?.toString(),

            discount: rateData.discount_per?.toString(),

            materialCost: rateData.material_cost?.toString(),

            discountRate: rateData.discount_rate?.toString(),

            afterDiscountValue: rateData.after_discount_value?.toString(),

            remark: rateData.remarks || "",

            netCost: rateData.total_material_cost?.toString(),

            pms_inventory_id: rateData.pms_inventory_id || null,

            addition_bid_material_tax_details:
              rateData.addition_tax_details?.map((tax) => {
                // API provides fixed amounts in INR; show INR directly

                let taxChargePerUom = "";

                if (tax.percentage) {
                  taxChargePerUom = `${tax.percentage}%`;
                } else {
                  const inrAmount = parseFloat(tax.amount) || 0;

                  taxChargePerUom = inrAmount.toString();
                }

                const amountInr = parseFloat(tax.amount || 0) || 0;

                return {
                  id: tax.id,

                  resource_id: tax.resource_id,

                  tax_category_id: tax.tax_category_id,

                  taxChargeType:
                    taxOptions.find(
                      (option) => option.id === tax.tax_category_id
                    )?.value || tax.resource_type,

                  taxType: tax.resource_type,

                  taxChargePerUom: taxChargePerUom,

                  percentageId: tax.percentage_id || null,

                  inclusive: tax.inclusive,

                  // Store INR and USD
                  amount_inr: amountInr.toString(),

                  amount: safeConvertInrToUsd(
                    amountInr,
                    conversionRate
                  ).toString(),
                };
              }) || [],

            deduction_bid_material_tax_details:
              rateData.deduction_tax_details?.map((tax) => {
                // API provides fixed amounts in INR; show INR directly

                let taxChargePerUom = "";

                if (tax.percentage) {
                  taxChargePerUom = `${tax.percentage}%`;
                } else {
                  const inrAmount = parseFloat(tax.amount) || 0;

                  taxChargePerUom = inrAmount.toString();
                }

                const amountInr = parseFloat(tax.amount || 0) || 0;

                return {
                  id: tax.id,

                  resource_id: tax.resource_id,

                  tax_category_id: tax.tax_category_id,

                  taxChargeType:
                    deductionTaxOptions.find(
                      (option) => option.id === tax.tax_category_id
                    )?.value || tax.resource_type,

                  taxType: tax.resource_type,

                  taxChargePerUom: taxChargePerUom,

                  percentageId: tax.percentage_id || null,

                  inclusive: tax.inclusive,

                  // Store INR and USD
                  amount_inr: amountInr.toString(),

                  amount: safeConvertInrToUsd(
                    amountInr,
                    conversionRate
                  ).toString(),
                };
              }) || [],
          },
        }));

        // Fetch tax percentages for each tax item after setting the data

        const pmsInventoryId = rateData.pms_inventory_id || material.id;

        // Fetch percentages for addition taxes

        for (const tax of rateData.addition_tax_details || []) {
          if (tax.tax_category_id) {
            try {
              const percentages = await fetchTaxPercentagesByMaterial(
                pmsInventoryId,

                tax.tax_category_id
              );

              setMaterialTaxPercentages((prev) => ({
                ...prev,

                [tax.id]: percentages,
              }));
            } catch (error) {
              console.error(
                `Error fetching percentages for tax ${tax.id}:`,

                error
              );
            }
          }
        }

        // Fetch percentages for deduction taxes

        for (const tax of rateData.deduction_tax_details || []) {
          if (tax.tax_category_id) {
            try {
              const percentages = await fetchTaxPercentagesByMaterial(
                pmsInventoryId,

                tax.tax_category_id
              );

              setMaterialTaxPercentages((prev) => ({
                ...prev,

                [tax.id]: percentages,
              }));
            } catch (error) {
              console.error(
                `Error fetching percentages for tax ${tax.id}:`,

                error
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching rate details:", error);

        // Fallback to default data if API fails

        if (!taxRateData[rowIndex]) {
          setTaxRateData((prev) => ({
            ...prev,

            [rowIndex]: {
              material: "Sample Material",

              hsnCode: "123456",

              ratePerNos: "100",

              totalPoQty: "10",

              discount: "5",

              materialCost: "950",

              discountRate: "95",

              afterDiscountValue: "950",

              remark: "",

              netCost: "950",

              addition_bid_material_tax_details: [],

              deduction_bid_material_tax_details: [],
            },
          }));
        }
      }
    } else {
      // Fallback if no material data

      if (!taxRateData[rowIndex]) {
        setTaxRateData((prev) => ({
          ...prev,

          [rowIndex]: {
            material: "Sample Material",

            hsnCode: "123456",

            ratePerNos: "100",

            totalPoQty: "10",

            discount: "5",

            materialCost: "950",

            discountRate: "95",

            afterDiscountValue: "950",

            remark: "",

            netCost: "950",

            addition_bid_material_tax_details: [],

            deduction_bid_material_tax_details: [],
          },
        }));
      }
    }
  };

  const handleCloseTaxModal = () => {
    setShowTaxModal(false);

    setTableId(null);
  };

  const addAdditionTaxCharge = (rowIndex) => {
    const newTaxCharge = {
      id: Date.now(),

      taxChargeType: "",

      taxChargePerUom: "",

      inclusive: false,

      amount: "0",

      taxType: "TaxCharge", // Default to TaxCharge
    };

    setTaxRateData((prev) => {
      const updatedData = { ...prev };

      updatedData[rowIndex] = {
        ...updatedData[rowIndex],

        addition_bid_material_tax_details: [
          ...(updatedData[rowIndex]?.addition_bid_material_tax_details || []),

          newTaxCharge,
        ],
      };

      // Recalculate net cost after adding new tax charge

      const newNetCost = calculateNetCostWithTaxes(
        updatedData[rowIndex]?.afterDiscountValue || 0,

        updatedData[rowIndex]?.addition_bid_material_tax_details || [],

        updatedData[rowIndex]?.deduction_bid_material_tax_details || []
      );

      updatedData[rowIndex].netCost = newNetCost.toString();

      return updatedData;
    });
  };

  const addDeductionTaxCharge = (rowIndex) => {
    const newTaxCharge = {
      id: Date.now(),

      taxChargeType: "",

      taxChargePerUom: "",

      inclusive: false,

      amount: "0",

      taxType: "TaxCharge", // Default to TaxCharge
    };

    setTaxRateData((prev) => {
      const updatedData = { ...prev };

      updatedData[rowIndex] = {
        ...updatedData[rowIndex],

        deduction_bid_material_tax_details: [
          ...(updatedData[rowIndex]?.deduction_bid_material_tax_details || []),

          newTaxCharge,
        ],
      };

      // Recalculate net cost after adding new tax charge

      const newNetCost = calculateNetCostWithTaxes(
        updatedData[rowIndex]?.afterDiscountValue || 0,

        updatedData[rowIndex]?.addition_bid_material_tax_details || [],

        updatedData[rowIndex]?.deduction_bid_material_tax_details || []
      );

      updatedData[rowIndex].netCost = newNetCost.toString();

      return updatedData;
    });
  };

  const removeTaxChargeItem = (rowIndex, id, type) => {
    setTaxRateData((prev) => {
      const updatedData = { ...prev };

      const key =
        type === "addition"
          ? "addition_bid_material_tax_details"
          : "deduction_bid_material_tax_details";

      updatedData[rowIndex] = {
        ...updatedData[rowIndex],

        [key]: (updatedData[rowIndex][key] || []).map((item) =>
          item.id === id ? { ...item, _destroy: true } : item
        ),
      };

      const newNetCost = calculateNetCostWithTaxes(
        updatedData[rowIndex]?.afterDiscountValue || 0,

        updatedData[rowIndex]?.addition_bid_material_tax_details || [],

        updatedData[rowIndex]?.deduction_bid_material_tax_details || []
      );

      updatedData[rowIndex].netCost = newNetCost.toString();

      return updatedData;
    });
  };

  // const handleTaxChargeChange = useCallback(

  //   (rowIndex, id, field, value, type) => {

  //     setTaxRateData((prev) => {

  //       const updatedData = { ...prev };

  //       const taxDetails =

  //         type === "addition"

  //           ? updatedData[rowIndex]?.addition_bid_material_tax_details || []

  //           : updatedData[rowIndex]?.deduction_bid_material_tax_details || [];

  //       const taxIndex = taxDetails.findIndex((tax) => tax.id === id);

  //       if (taxIndex !== -1) {

  //         const currentTax = { ...taxDetails[taxIndex] };

  //         // Handle different tax types

  //         if (field === "taxChargeType") {

  //           // Find the selected tax option to determine type

  //           const selectedTaxOption =

  //             type === "addition"

  //               ? taxOptions.find((option) => option.value === value)

  //               : deductionTaxOptions.find((option) => option.value === value);
  //           // Set the tax type for later reference

  //           currentTax.taxType = selectedTaxOption?.type || "TaxCharge";

  //           currentTax[field] = value;

  //           // Clear amount when tax type changes

  //           currentTax.amount = "0";

  //           currentTax.taxChargePerUom = "";

  //           currentTax.percentageId = null; // Clear percentage ID

  //         } else if (field === "taxChargePerUom") {

  //           // Auto-calculate amount based on tax type

  //           currentTax[field] = value;

  //           // Find the percentage ID from materialTaxPercentages

  //           if (value && value.includes("%")) {

  //             const percentage = parseFloat(value.replace("%", "")) || 0;

  //             const percentages = materialTaxPercentages[currentTax.id] || [];

  //             const percentageData = percentages.find(

  //               (p) => p.percentage === percentage

  //             );

  //             currentTax.percentageId = percentageData?.id || null;

  //             console.log("Setting percentageId for tax:", {

  //               taxId: currentTax.id,

  //               taxType: type,

  //               percentage: percentage,

  //               percentageData: percentageData,

  //               percentageId: currentTax.percentageId,

  //             });

  //           }

  //           if (currentTax.taxChargeType) {

  //             const baseAmount =
  //               parseFloat(updatedData[rowIndex]?.afterDiscountValue) || 0;

  //             let calculatedAmount = 0;

  //             // Check if it's a percentage-based tax (TaxCategory)

  //             if (value && value.includes("%")) {

  //               const percentage = parseFloat(value.replace("%", "")) || 0;

  //               calculatedAmount = (baseAmount * percentage) / 100;

  //             } else if (value && !isNaN(parseFloat(value))) {

  //               // Fixed amount (TaxCharge)

  //               calculatedAmount = parseFloat(value) || 0;

  //             }

  //             currentTax.amount = calculatedAmount.toString();

  //           }

  //         } else if (field === "amount") {

  //           // Handle direct amount input for TaxCharge type

  //           currentTax[field] = value;

  //           // For TaxCategory, amount is auto-calculated from percentage

  //           if (

  //             currentTax.taxType === "TaxCategory" &&

  //             currentTax.taxChargePerUom

  //           ) {

  //             const baseAmount =

  //               parseFloat(updatedData[rowIndex]?.afterDiscountValue) || 0;

  //             const percentage =

  //               parseFloat(currentTax.taxChargePerUom.replace("%", "")) || 0;

  //             const calculatedAmount = (baseAmount * percentage) / 100;

  //             currentTax.amount = calculatedAmount.toString();

  //           }

  //         } else {

  //           // Handle other fields (inclusive, etc.)

  //           currentTax[field] = value;

  //         }

  //         taxDetails[taxIndex] = currentTax;

  //         if (type === "addition") {

  //           updatedData[rowIndex].addition_bid_material_tax_details =

  //             taxDetails;

  //         } else {

  //           updatedData[rowIndex].deduction_bid_material_tax_details =

  //             taxDetails;

  //         }

  //         // Recalculate net cost only if there are changes

  //         if (taxIndex !== -1) {

  //           const newNetCost = calculateNetCostWithTaxes(

  //             updatedData[rowIndex]?.afterDiscountValue || 0,

  //             updatedData[rowIndex]?.addition_bid_material_tax_details || [],

  //             updatedData[rowIndex]?.deduction_bid_material_tax_details || []

  //           );

  //           updatedData[rowIndex].netCost = newNetCost.toString();

  //         }

  //       }

  //       return updatedData;

  //     });

  //   },

  //   [taxOptions]

  // );

  // In handleTaxChargeChange function, update the input validation logic
  const handleTaxChargeChange = useCallback(
    (rowIndex, id, field, value, type) => {
      setTaxRateData((prev) => {
        const updatedData = { ...prev };

        const taxDetails =
          type === "addition"
            ? updatedData[rowIndex]?.addition_bid_material_tax_details || []
            : updatedData[rowIndex]?.deduction_bid_material_tax_details || [];

        const taxIndex = taxDetails.findIndex((tax) => tax.id === id);

        if (taxIndex !== -1) {
          const currentTax = { ...taxDetails[taxIndex] };

          const baseAmount =
            parseFloat(updatedData[rowIndex]?.afterDiscountValue) || 0;

          if (field === "taxChargeType") {
            const selectedTaxOption =
              type === "addition"
                ? taxOptions.find((option) => option.value === value)
                : deductionTaxOptions.find((option) => option.value === value);

            currentTax.taxType = selectedTaxOption?.type || "TaxCharge";

            currentTax[field] = value;

            currentTax.amount = "0";

            currentTax.taxChargePerUom = "";

            currentTax.percentageId = null;

            currentTax.tax_category_id = selectedTaxOption?.id;

            // Fetch tax percentages if it's a percentage-based tax (CGST, SGST, IGST, TDS)

            if (selectedTaxOption?.id && isPercentageTax(value)) {
              handleTaxCategoryChange(
                rowIndex,

                selectedTaxOption.id,

                currentTax.id
              );
            }
          } else if (field === "taxChargePerUom") {
            currentTax[field] = value;

            // For addition taxes, calculate amount based on input value

            if (type === "addition") {
              if (value && !isNaN(parseFloat(value))) {
                // If it's a percentage, calculate the percentage amount

                if (value.includes("%")) {
                  const percentage = parseFloat(value.replace("%", ""));

                  const calculatedAmount = calculateTaxAmount(
                    percentage,

                    baseAmount,

                    Boolean(currentTax.inclusive)
                  );

                  currentTax.amount = calculatedAmount.toString();

                  currentTax.amount_inr = (
                    parseFloat(
                      safeConvertUsdToInr(calculatedAmount, conversionRate)
                    ) || 0
                  ).toString();

                  // Find the percentage ID from materialTaxPercentages

                  const percentages =
                    materialTaxPercentages[currentTax.id] || [];

                  const percentageData = percentages.find(
                    (p) => p.percentage === percentage
                  );

                  if (percentageData) {
                    currentTax.percentageId = percentageData.id;
                  }
                } else {
                  // If it's a fixed amount in INR, convert to USD for storage

                  const inrValue = parseFloat(value) || 0;

                  const usdValue =
                    parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) ||
                    0;

                  currentTax.amount_inr = inrValue.toString();

                  currentTax.amount = usdValue.toString();
                }
              } else {
                currentTax.amount = "0";
              }
            } else {
              // For deduction taxes, calculate amount based on input value

              if (value && !isNaN(parseFloat(value))) {
                if (value.includes("%")) {
                  const percentage = parseFloat(value.replace("%", ""));

                  const calculatedAmount = calculateTaxAmount(
                    percentage,

                    baseAmount,

                    Boolean(currentTax.inclusive)
                  );

                  currentTax.amount = calculatedAmount.toString();

                  currentTax.amount_inr = (
                    parseFloat(
                      safeConvertUsdToInr(calculatedAmount, conversionRate)
                    ) || 0
                  ).toString();

                  // Find the percentage ID from materialTaxPercentages

                  const percentages =
                    materialTaxPercentages[currentTax.id] || [];

                  const percentageData = percentages.find(
                    (p) => p.percentage === percentage
                  );

                  if (percentageData) {
                    currentTax.percentageId = percentageData.id;
                  }
                } else {
                  // If it's a fixed amount in INR, convert to USD for storage

                  const inrValue = parseFloat(value) || 0;

                  const usdValue =
                    parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) ||
                    0;

                  currentTax.amount_inr = inrValue.toString();

                  currentTax.amount = usdValue.toString();
                }
              } else {
                currentTax.amount = "0";
              }
            }
          } else if (field === "amount") {
            // Allow manual amount input for TaxCharge type taxes

            if (currentTax.taxType === "TaxCharge") {
              currentTax.amount = value;

              const usdVal = parseFloat(value) || 0;

              currentTax.amount_inr = (
                parseFloat(safeConvertUsdToInr(usdVal, conversionRate)) || 0
              ).toString();
            }
          } else if (field === "inclusive") {
            // Toggle inclusive and recalculate when percentage-based

            currentTax.inclusive = value;

            const inputValue = currentTax.taxChargePerUom || "";

            if (inputValue && inputValue.includes("%")) {
              // For deduction taxes (e.g., TDS), do NOT change amount on toggle
              if (type === "deduction") {
                // keep amounts unchanged
              } else {
                const percentage = parseFloat(inputValue.replace("%", "")) || 0;

                const recalculated = calculateTaxAmount(
                  percentage,

                  baseAmount,

                  Boolean(value)
                );

                currentTax.amount = recalculated.toString();

                currentTax.amount_inr = (
                  parseFloat(
                    safeConvertUsdToInr(recalculated, conversionRate)
                  ) || 0
                ).toString();
              }
            }
          } else {
            // Generic setter for any other simple fields

            currentTax[field] = value;
          }

          taxDetails[taxIndex] = currentTax;

          if (type === "addition") {
            updatedData[rowIndex].addition_bid_material_tax_details =
              taxDetails;
          } else {
            updatedData[rowIndex].deduction_bid_material_tax_details =
              taxDetails;
          }

          // Recalculate net cost

          const newNetCost = calculateNetCostWithTaxes(
            updatedData[rowIndex]?.afterDiscountValue || 0,

            updatedData[rowIndex]?.addition_bid_material_tax_details || [],

            updatedData[rowIndex]?.deduction_bid_material_tax_details || []
          );

          updatedData[rowIndex].netCost = newNetCost.toString();
        }

        return updatedData;
      });
    },

    [taxOptions, deductionTaxOptions, materialTaxPercentages]
  );

  // Update the input field's disabled condition in the modal

  const calculateTaxAmount = (percentage, baseAmount, inclusive = false) => {
    const percent = parseFloat(percentage) || 0;

    const amount = parseFloat(baseAmount) || 0;

    if (inclusive) {
      return (amount * percent) / (100 + percent);
    } else {
      return (amount * percent) / 100;
    }
  };

  const calculateNetCost = (rowIndex, updatedData = taxRateData) => {
    const data = updatedData[rowIndex];

    if (!data) return 0;

    const baseAmount = parseFloat(data.afterDiscountValue) || 0;

    // Calculate addition amounts

    const additionAmount = (
      data.addition_bid_material_tax_details || []
    ).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    // Calculate deduction amounts

    const deductionAmount = (
      data.deduction_bid_material_tax_details || []
    ).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    return baseAmount + additionAmount - deductionAmount;
  };
  const handleSaveTaxChanges = async () => {
    if (tableId !== null) {
      const currentData = taxRateData[tableId];

      if (!currentData) {
        console.error("No data available for saving");

        return;
      }

      // Get the material ID from submitted materials

      const material = submittedMaterials[tableId];

      if (!material || !material.id) {
        console.error("No material ID available for API call");

        return;
      }

      // Prepare the payload based on the API response structure

      const payload = {
        po_mor_inventory: {
          active: true,

          additional_info: currentData.remark || "",

          remarks: currentData.remark || "",

          rate_per_nos: parseFloat(currentData.ratePerNos) || 0,

          discount_per: parseFloat(currentData.discount) || 0,

          discount_rate: parseFloat(currentData.discountRate) || 0,

          material_cost: parseFloat(currentData.materialCost) || 0,

          total_material_cost: parseFloat(currentData.netCost) || 0,

          after_discount_value: parseFloat(currentData.afterDiscountValue) || 0,

          tax_applicable_cost: parseFloat(currentData.afterDiscountValue) || 0,

          // material_inventory_id: currentData.pms_inventory_id || material.id,

          // Map addition tax details

          mor_inventory_tax_details_attributes: (
            currentData.addition_bid_material_tax_details || []
          ).map((tax) => {
            // Resolve resource_id prioritizing percentageId; if missing, derive from selected percentage value

            let resolvedResourceId = tax.percentageId;

            if (
              !resolvedResourceId &&
              tax.taxChargePerUom &&
              tax.taxChargePerUom.includes("%")
            ) {
              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;

              const percList = materialTaxPercentages[tax.id] || [];

              const found = percList.find((p) => p.percentage === percentage);

              if (found) resolvedResourceId = found.id;
            }

            if (!resolvedResourceId) {
              resolvedResourceId =
                taxOptions.find((option) => option.value === tax.taxChargeType)
                  ?.id || tax.resource_id;
            }

            // Calculate the amount to send in INR

            // For ALL addition taxes, send the Tax / Charges per UOM value in INR

            let amountToSend = 0;

            if (tax.taxChargePerUom && tax.taxChargePerUom.includes("%")) {
              // Percentage: base is in USD; convert to INR first, then apply percentage

              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;

              const baseUsd = currentData.afterDiscountValue || 0;

              const baseInr =
                parseFloat(safeConvertUsdToInr(baseUsd, conversionRate)) || 0;

              amountToSend = (baseInr * percentage) / 100;
            } else {
              // Fixed amount: already entered in INR

              const inrValue = parseFloat(tax.taxChargePerUom) || 0;

              amountToSend = inrValue;
            }

            const payload = {
              resource_type: tax.taxType || "TaxCharge",

              resource_id: resolvedResourceId,

              amount: amountToSend,

              inclusive: tax.inclusive || false,

              addition: true,

              remarks: `${tax.taxChargeType} - INR ${amountToSend}`,

              _destroy: tax._destroy, // Include destroy flag
            };

            // Only include id for existing records (not temporary UI IDs)

            if (tax.id && tax.id.toString().length < 10) {
              payload.id = tax.id;
            }

            return payload;
          }),

          // Map deduction tax details

          deduction_mor_inventory_tax_details_attributes: (
            currentData.deduction_bid_material_tax_details || []
          ).map((tax) => {
            console.log("Processing deduction tax for payload:", {
              taxId: tax.id,

              taxChargeType: tax.taxChargeType,

              taxType: tax.taxType,

              percentageId: tax.percentageId,

              resource_id: tax.resource_id,

              amount: tax.amount,
            });

            // Resolve resource_id prioritizing percentageId; if missing, derive from selected percentage value

            let resolvedResourceId = tax.percentageId;

            if (
              !resolvedResourceId &&
              tax.taxChargePerUom &&
              tax.taxChargePerUom.includes("%")
            ) {
              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;

              const percList = materialTaxPercentages[tax.id] || [];

              const found = percList.find((p) => p.percentage === percentage);

              if (found) resolvedResourceId = found.id;
            }

            if (!resolvedResourceId) {
              resolvedResourceId =
                deductionTaxOptions.find(
                  (option) => option.value === tax.taxChargeType
                )?.id || tax.resource_id;
            }

            // Calculate the amount to send in INR

            // For deduction taxes, send the Tax / Charges per UOM value in INR

            let amountToSend = 0;

            if (tax.taxChargePerUom && tax.taxChargePerUom.includes("%")) {
              // Percentage: base is in USD; convert to INR first, then apply percentage

              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;

              const baseUsd = currentData.afterDiscountValue || 0;

              const baseInr =
                parseFloat(safeConvertUsdToInr(baseUsd, conversionRate)) || 0;

              amountToSend = (baseInr * percentage) / 100;
            } else {
              // Fixed amount: already entered in INR

              const inrValue = parseFloat(tax.taxChargePerUom) || 0;

              amountToSend = inrValue;
            }

            const payload = {
              resource_type: tax.taxType || "TaxCharge",

              resource_id: resolvedResourceId,

              amount: amountToSend,

              inclusive: tax.inclusive || false,

              addition: false,

              remarks: `${tax.taxChargeType} - INR ${amountToSend}`,

              _destroy: tax._destroy, // Include destroy flag
            };

            console.log("Deduction tax payload:", payload);

            // Only include id for existing records (not temporary UI IDs)

            if (tax.id && tax.id.toString().length < 10) {
              payload.id = tax.id;
            }

            return payload;
          }),
        },
      };

      console.log("Saving tax changes with payload:", payload);
      console.log("Material ID:", material.id);

      try {
        const response = await axios.patch(
          `${baseURL}po_mor_inventories/${material.id}.json?token=${token}`,

          payload
        );

        console.log("API Response:", response.data);

        if (response.status === 200 || response.status === 201) {
          // Update local state with the response data

          const responseData = response.data;

          setTaxRateData((prev) => ({
            ...prev,

            [tableId]: {
              ...prev[tableId],

              ratePerNos:
                responseData.rate_per_nos?.toString() || currentData.ratePerNos,

              discount:
                responseData.discount_per?.toString() || currentData.discount,

              materialCost:
                responseData.material_cost?.toString() ||
                currentData.materialCost,

              discountRate:
                responseData.discount_rate?.toString() ||
                currentData.discountRate,

              afterDiscountValue:
                responseData.after_discount_value?.toString() ||
                currentData.afterDiscountValue,

              netCost:
                responseData.total_material_cost?.toString() ||
                currentData.netCost,

              remark: responseData.remarks || currentData.remark,

              addition_bid_material_tax_details:
                responseData.addition_tax_details?.map((tax) => {
                  // Convert USD amount back to INR for the input field

                  let taxChargePerUom = "";

                  if (tax.percentage) {
                    // If it's a percentage, keep it as percentage

                    taxChargePerUom = `${tax.percentage}%`;
                  } else {
                    // If it's a fixed amount, convert USD to INR for display

                    const usdAmount = parseFloat(tax.amount) || 0;

                    taxChargePerUom = convertUsdToInr(usdAmount);
                  }

                  return {
                    id: tax.id,

                    resource_id: tax.resource_id,

                    tax_category_id: tax.tax_category_id,

                    percentageId: tax.percentage_id,

                    taxChargeType:
                      taxOptions.find(
                        (option) => option.id === tax.tax_category_id
                      )?.value || "",

                    taxType: tax.resource_type,

                    taxChargePerUom: taxChargePerUom,

                    inclusive: tax.inclusive,

                    amount: tax.amount?.toString() || "0", // Keep USD amount for calculations
                  };
                }) || currentData.addition_bid_material_tax_details,

              deduction_bid_material_tax_details:
                responseData.deduction_tax_details?.map((tax) => {
                  // Convert USD amount back to INR for the input field

                  let taxChargePerUom = "";

                  if (tax.percentage) {
                    // If it's a percentage, keep it as percentage

                    taxChargePerUom = `${tax.percentage}%`;
                  } else {
                    // If it's a fixed amount, convert USD to INR for display

                    const usdAmount = parseFloat(tax.amount) || 0;

                    taxChargePerUom = convertUsdToInr(usdAmount);
                  }

                  return {
                    id: tax.id,

                    resource_id: tax.resource_id,

                    tax_category_id: tax.tax_category_id,

                    percentageId: tax.percentage_id,

                    taxChargeType:
                      deductionTaxOptions.find(
                        (option) => option.id === tax.tax_category_id
                      )?.value || "",

                    taxType: tax.resource_type,

                    taxChargePerUom: taxChargePerUom,

                    inclusive: tax.inclusive,

                    amount: tax.amount?.toString() || "0", // Keep USD amount for calculations
                  };
                }) || currentData.deduction_bid_material_tax_details,
            },
          }));

          // After successfully saving tax changes, call the ROPO details API to refresh charges data for the specific material

          if (submittedMaterials.length > 0) {
            // Call the ROPO rate details API for the specific material that was just updated

            try {
              const ropoResponse = await axios.get(
                `${baseURL}po_mor_inventories/${material.id}/ropo_rate_details.json?token=${token}`
              );

              console.log(
                "ROPO Rate Details API Response after save:",

                ropoResponse.data
              );

              // Update the charges data with the new information from the API

              if (ropoResponse.data) {
                const rateData = ropoResponse.data;

                const updatedChargesData = [];

                // Process addition tax details

                if (
                  rateData.addition_tax_details &&
                  Array.isArray(rateData.addition_tax_details)
                ) {
                  rateData.addition_tax_details.forEach((tax) => {
                    updatedChargesData.push({
                      id: tax.id,

                      material_id: material.id,

                      material_name:
                        material.material_name ||
                        material.material?.material_name ||
                        "",

                      charge_name: getTaxNameById(tax.resource_id),

                      resource_id: tax.resource_id,

                      resource_type: tax.resource_type,

                      amount: safeConvertInrToUsd(
                        parseFloat(tax.amount || 0) || 0,
                        conversionRate
                      ),

                      amount_inr: parseFloat(tax.amount || 0) || 0,

                      inclusive: tax.inclusive,

                      tax_category_id: tax.tax_category_id,

                      percentage: tax.percentage,
                    });
                  });
                }

                // Process deduction tax details

                if (
                  rateData.deduction_tax_details &&
                  Array.isArray(rateData.deduction_tax_details)
                ) {
                  rateData.deduction_tax_details.forEach((tax) => {
                    updatedChargesData.push({
                      id: tax.id,

                      material_id: material.id,

                      material_name:
                        material.material_name ||
                        material.material?.material_name ||
                        "",

                      charge_name: getTaxNameById(tax.resource_id),

                      resource_id: tax.resource_id,

                      resource_type: tax.resource_type,

                      amount: safeConvertInrToUsd(
                        parseFloat(tax.amount || 0) || 0,
                        conversionRate
                      ),

                      amount_inr: parseFloat(tax.amount || 0) || 0,

                      inclusive: tax.inclusive,

                      tax_category_id: tax.tax_category_id,

                      percentage: tax.percentage,
                    });
                  });
                }

                // Update the charges data state with the new data

                setChargesFromApi((prevCharges) => {
                  // Remove existing charges for this material and add the new ones

                  const filteredCharges = prevCharges.filter(
                    (charge) => charge.material_id !== material.id
                  );

                  return [...filteredCharges, ...updatedChargesData];
                });

                // Update total material cost if available

                if (rateData.total_material_cost) {
                  setTotalMaterialCost((prevTotal) => {
                    // Calculate the new total by adding the new material cost

                    return prevTotal + parseFloat(rateData.total_material_cost);
                  });
                }

                // Calculate and store values for Rate & Taxes table

                const calculatedValues = {
                  taxAddition: 0,

                  totalChanges: 0,

                  otherAddition: 0,

                  otherDeductions: 0,

                  allInclCost: parseFloat(rateData.total_material_cost) || 0,

                  taxDeductions: 0,
                };

                // Calculate Tax Addition (sum of addition tax details)

                if (
                  rateData.addition_tax_details &&
                  Array.isArray(rateData.addition_tax_details)
                ) {
                  calculatedValues.taxAddition =
                    rateData.addition_tax_details.reduce((sum, tax) => {
                      return sum + (parseFloat(tax.amount) || 0);
                    }, 0);
                }

                // Calculate Tax Deductions (sum of deduction tax details)

                if (
                  rateData.deduction_tax_details &&
                  Array.isArray(rateData.deduction_tax_details)
                ) {
                  calculatedValues.taxDeductions =
                    rateData.deduction_tax_details.reduce((sum, tax) => {
                      return sum + (parseFloat(tax.amount) || 0);
                    }, 0);
                }

                // Calculate Other Addition (TaxCharge type additions)

                if (
                  rateData.addition_tax_details &&
                  Array.isArray(rateData.addition_tax_details)
                ) {
                  calculatedValues.otherAddition = rateData.addition_tax_details

                    .filter((tax) => tax.resource_type === "TaxCharge")

                    .reduce((sum, tax) => {
                      return sum + (parseFloat(tax.amount) || 0);
                    }, 0);
                }

                // Calculate Other Deductions (TaxCharge type deductions)

                if (
                  rateData.deduction_tax_details &&
                  Array.isArray(rateData.deduction_tax_details)
                ) {
                  calculatedValues.otherDeductions =
                    rateData.deduction_tax_details

                      .filter((tax) => tax.resource_type === "TaxCharge")

                      .reduce((sum, tax) => {
                        return sum + (parseFloat(tax.amount) || 0);
                      }, 0);
                }

                // Calculate Total Changes (Tax Addition - Tax Deductions)

                calculatedValues.totalChanges =
                  calculatedValues.taxAddition - calculatedValues.taxDeductions;

                // Store the calculated values for this material

                setMaterialCalculatedValues((prev) => ({
                  ...prev,

                  [material.id]: calculatedValues,
                }));
              }
            } catch (error) {
              console.error(
                "Error fetching ROPO rate details after save:",

                error
              );
            }
          }

          toast.success("Tax changes saved successfully!");
        }
      } catch (error) {
        console.error("Error saving tax changes:", error);

        toast.error("Error saving tax changes. Please try again.");
      }
    }

    handleCloseTaxModal();
  };

  // Fetch tax options on component mount

  useEffect(() => {
    const fetchTaxOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=${token}&entity_sub_type=import`
        );

        console.log("Tax options response:", response.data);

        // Check if response has taxes property

        const taxesData = response.data.taxes || response.data;

        const options = taxesData.map((tax) => ({
          id: tax.id,

          value: tax.name,

          label: tax.name,

          // type: tax.type,

          type: tax.type === "TaxCategory" ? "TaxDetail" : tax.type,
        }));

        console.log("Formatted tax options:", options);

        setTaxOptions(options);
      } catch (error) {
        console.error("Error fetching tax options:", error);

        // Set fallback options if API fails

        // setTaxOptions([
        //   { value: "CGST", label: "CGST", id: 19, type: "TaxCategory" },

        //   { value: "SGST", label: "SGST", id: 18, type: "TaxCategory" },

        //   { value: "IGST", label: "IGST", id: 20, type: "TaxCategory" },

        //   {
        //     value: "Handling Charges",

        //     label: "Handling Charges",

        //     id: 2,

        //     type: "TaxCharge",
        //   },

        //   {
        //     value: "Other charges",

        //     label: "Other charges",

        //     id: 4,

        //     type: "TaxCharge",
        //   },

        //   { value: "Freight", label: "Freight", id: 5, type: "TaxCharge" },
        // ]);
      }
    };

    const fetchDeductionTaxOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}&entity_sub_type=import`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,

            label: tax.name,

            id: tax.id,

            type: tax.type === "TaxCategory" ? "TaxDetail" : tax.type,
          }));

          setDeductionTaxOptions([
            { value: "", label: "Select Tax & Charges" },

            ...formattedOptions,
          ]);
        }
      } catch (error) {
        console.error("Error fetching deduction tax data:", error);
      }
    };

    const fetchTaxPercentages = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/tax_percentage?token=${token}`
        );

        setTaxPercentageOptions(response.data);
      } catch (error) {
        console.error("Error fetching tax percentages:", error);

        setTaxPercentageOptions([]);
      }
    };

    fetchTaxOptions();

    fetchDeductionTaxOptions();

    fetchTaxPercentages();

    fetchChargesAdditionTaxes();

    fetchChargesDeductionTaxes();

    fetchChargesTaxPercentages();

    fetchChargeNames();
  }, []);

  // Fetch terms and conditions on component mount

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}term_conditions.json?token=${token}&q[condition_category_condition_group_eq]=general`
        );

        console.log("Terms and conditions response:", response.data);

        setTermsConditions(response.data);

        // Extract unique condition categories from API response

        const categories = [
          ...new Set(response.data.map((item) => item.condition_category_name)),
        ];

        setConditionCategories(categories);

        console.log("Available categories:", categories);
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);

        // Set fallback data if API fails

        setConditionCategories(["validity", "as"]);
      }
    };

    fetchTermsConditions();
  }, []);

  // Fetch material term conditions when submitted materials change -> handled by fetchDeliverySchedules

  useEffect(() => {
    fetchDeliverySchedules();
  }, [submittedMaterials, fetchDeliverySchedules]);

  // Fetch charges data when submitted materials change and we're on terms tab

  useEffect(() => {
    if (activeTab === "terms-conditions" && submittedMaterials.length > 0) {
      fetchChargesData();
    }
  }, [submittedMaterials, activeTab]);

  // Fetch charges taxes data on component mount

  useEffect(() => {
    fetchChargesAdditionTaxes();

    fetchChargesDeductionTaxes();

    fetchChargesTaxPercentages();
  }, []);

  // Fetching inventory types data from API on component mount

  useEffect(() => {
    axios

      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )

      .then((response) => {
        const options = response.data.map((inventory) => ({
          value: inventory.id,

          label: inventory.name,
        }));

        setInventoryTypes2(options);
      })

      .catch((error) => {
        console.error("Error fetching inventory types:", error);
      });
  }, []);
  // Fetch inventory sub-types when an inventory type is selected

  useEffect(() => {
    if (selectedInventory2 || formData.materialType) {
      const materialTypeId = selectedInventory2?.value || formData.materialType;

      if (materialTypeId) {
        axios

          .get(
            `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${materialTypeId}&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((subType) => ({
              value: subType.id,

              label: subType.name,
            }));

            setInventorySubTypes2(options);
          })

          .catch((error) => {
            console.error("Error fetching inventory sub-types:", error);
          });
      }
    }
  }, [selectedInventory2, formData.materialType]);

  // Fetch inventory Material when an inventory type is selected

  useEffect(() => {
    if (selectedInventory2 || formData.materialType) {
      const materialTypeId = selectedInventory2?.value || formData.materialType;

      if (materialTypeId) {
        axios

          .get(
            `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${materialTypeId}&q[material_category_eq]=material&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((subType) => ({
              value: subType.id,

              label: subType.name,
            }));

            setInventoryMaterialTypes2(options);
          })

          .catch((error) => {
            console.error("Error fetching inventory sub-types:", error);
          });
      }
    }
  }, [selectedInventory2, formData.materialType]);

  // Fetch UOMs

  useEffect(() => {
    if (selectedInventoryMaterialTypes2 || formData.material) {
      const materialId =
        selectedInventoryMaterialTypes2?.value || formData.material;

      if (materialId) {
        axios

          .get(
            `${baseURL}unit_of_measures.json?q[material_uoms_material_id_eq]=${materialId}&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((unit) => ({
              value: unit.id,

              label: unit.name,
            }));

            setUnitOfMeasures(options);
          })

          .catch((error) => {
            console.error("Error fetching unit of measures:", error);
          });
      }
    }
  }, [selectedInventoryMaterialTypes2, formData.material]);

  // Fetch generic specifications

  useEffect(() => {
    if (selectedInventoryMaterialTypes2 || formData.material) {
      const materialId =
        selectedInventoryMaterialTypes2?.value || formData.material;

      if (materialId) {
        axios

          .get(
            `${baseURL}pms/generic_infos.json?q[material_id_eq]=${materialId}&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((specification) => ({
              value: specification.id,

              label: specification.generic_info,
            }));

            setGenericSpecifications(options);
          })

          .catch((error) => {
            console.error("Error fetching generic specifications:", error);
          });
      }
    }
  }, [selectedInventoryMaterialTypes2, formData.material]);

  // Fetch colors

  useEffect(() => {
    if (selectedInventoryMaterialTypes2 || formData.material) {
      const materialId =
        selectedInventoryMaterialTypes2?.value || formData.material;

      if (materialId) {
        axios

          .get(
            `${baseURL}pms/colours.json?q[material_id_eq]=${materialId}&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((color) => ({
              value: color.id,

              label: color.colour,
            }));

            setColors(options);
          })

          .catch((error) => {
            console.error("Error fetching colors:", error);
          });
      }
    }
  }, [selectedInventoryMaterialTypes2, formData.material]);

  // Fetch brands

  useEffect(() => {
    if (selectedInventoryMaterialTypes2 || formData.material) {
      const materialId =
        selectedInventoryMaterialTypes2?.value || formData.material;

      if (materialId) {
        axios

          .get(
            `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${materialId}&token=${token}`
          )

          .then((response) => {
            const options = response.data.map((brand) => ({
              value: brand.id,

              label: brand.brand_name,
            }));

            setInventoryBrands(options);
          })

          .catch((error) => {
            console.error(
              "Error fetching inventory brands for material:",

              error
            );
          });
      }
    }
  }, [selectedInventoryMaterialTypes2, formData.material]);

  const [attachments, setAttachments] = useState([]);

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

  const attachmentsPayload = attachments.flatMap(
    (att) => att.attachments || []
  );

  console.log("attachments:", attachmentsPayload);

  // document secttion

  // terms and condtion section

  // ...existing code...

  const [generalTerms, setGeneralTerms] = useState([]);

  // Add new row to terms and conditions

  const addTermsConditionRow = () => {
    const newRow = {
      id: Date.now(), // Temporary ID for new rows

      condition_category_name: "",

      condition: "",

      isNew: true,
    };

    setTermsConditions([...termsConditions, newRow]);
  };

  // Remove row from terms and conditions

  const removeTermsConditionRow = (index) => {
    const updatedConditions = termsConditions.filter((_, i) => i !== index);

    setTermsConditions(updatedConditions);
  };

  // Handle condition category change for a specific row

  const handleConditionCategoryChange = (index, selectedCategory) => {
    // Find existing conditions for the selected category from API data

    const existingConditionsForCategory = termsConditions.filter(
      (item) => item.condition_category_name === selectedCategory
    );

    // Get the first condition text for this category (or empty if none exists)

    const defaultConditionText =
      existingConditionsForCategory.length > 0
        ? existingConditionsForCategory[0].condition
        : "";

    const updatedConditions = termsConditions.map((condition, i) =>
      i === index
        ? {
            ...condition,

            condition_category_name: selectedCategory,

            condition: defaultConditionText, // Auto-populate with existing condition
          }
        : condition
    );

    setTermsConditions(updatedConditions);
  };

  // Handle condition text change for a specific row

  const handleConditionTextChange = (index, conditionText) => {
    const updatedConditions = termsConditions.map((condition, i) =>
      i === index ? { ...condition, condition: conditionText } : condition
    );

    setTermsConditions(updatedConditions);
  };

  // Calculate discount amount based on base amount (material cost) and discount percentage (all in USD)

  const calculateDiscountRate = (baseAmount, discountPercentage) => {
    const amount = parseFloat(baseAmount) || 0;

    const discount = parseFloat(discountPercentage) || 0;

    // Discount amount: Example amount=100, discount=10% -> 10

    return Math.max(0, (amount * discount) / 100);
  };

  // Calculate material cost based on rate per nos and total PO qty (all in USD)

  const calculateMaterialCost = (ratePerNos, totalPoQty) => {
    const rate = parseFloat(ratePerNos) || 0;

    const qty = parseFloat(totalPoQty) || 0;

    return rate * qty;
  };

  // Calculate after discount value based on material cost and discount percentage (all in USD)

  const calculateAfterDiscountValue = (materialCost, discountPercentage) => {
    const cost = parseFloat(materialCost) || 0;

    const discount = parseFloat(discountPercentage) || 0;

    const discountAmount = (cost * discount) / 100;

    return Math.max(0, cost - discountAmount);
  };

  // Calculate net cost including tax charges and deductions

  const calculateNetCostWithTaxes = (
    baseAmount,

    additionTaxes,

    deductionTaxes
  ) => {
    let netCost = parseFloat(baseAmount) || 0;

    // Add addition taxes/charges (ignore _destroy and inclusive)

    (additionTaxes || [])
      .filter((t) => !t._destroy)
      .forEach((tax) => {
        if (tax.amount && !tax.inclusive) {
          const amount = parseFloat(tax.amount) || 0;

          netCost += amount;
        }
      });

    // Subtract deduction taxes/charges (ignore _destroy and inclusive)

    (deductionTaxes || [])
      .filter((t) => !t._destroy)
      .forEach((tax) => {
        if (tax.amount && !tax.inclusive) {
          const amount = parseFloat(tax.amount) || 0;

          netCost -= amount;
        }
      });

    return Math.max(0, netCost);
  };

  // Handle rate per nos change with automatic discount rate calculation

  const handleRatePerNosChange = useCallback(
    (value) => {
      // Validation: Prevent negative values

      const numValue = parseFloat(value);

      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        toast.error(
          "Rate per Nos cannot be negative. Please enter a valid positive number."
        );

        return;
      }

      const currentData = taxRateData[tableId];

      if (!currentData) return;

      const discountPercentage = parseFloat(currentData.discount) || 0;

      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newMaterialCost = calculateMaterialCost(value, totalPoQty);

      const newDiscountRate = calculateDiscountRate(
        newMaterialCost,

        discountPercentage
      );

      const newAfterDiscountValue = calculateAfterDiscountValue(
        newMaterialCost,

        discountPercentage
      );

      setTaxRateData((prev) => ({
        ...prev,

        [tableId]: {
          ...prev[tableId],

          ratePerNos: value,

          discountRate: newDiscountRate.toString(),

          materialCost: newMaterialCost.toString(),

          afterDiscountValue: newAfterDiscountValue.toString(),
        },
      }));
    },

    [tableId, taxRateData]
  );

  // Handle discount percentage change with automatic discount rate calculation

  const handleDiscountPercentageChange = useCallback(
    (value) => {
      // Validation: Prevent negative values and values over 100%

      const numValue = parseFloat(value);

      if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
        toast.error(
          "Discount percentage must be between 0 and 100. Please enter a valid percentage."
        );

        return;
      }

      const currentData = taxRateData[tableId];

      if (!currentData) return;

      const ratePerNos = parseFloat(currentData.ratePerNos) || 0;

      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newMaterialCost = calculateMaterialCost(ratePerNos, totalPoQty);

      const newDiscountRate = calculateDiscountRate(newMaterialCost, value);

      const newAfterDiscountValue = calculateAfterDiscountValue(
        newMaterialCost,

        value
      );

      setTaxRateData((prev) => ({
        ...prev,

        [tableId]: {
          ...prev[tableId],

          discount: value,

          discountRate: newDiscountRate.toString(),

          materialCost: newMaterialCost.toString(),

          afterDiscountValue: newAfterDiscountValue.toString(),
        },
      }));
    },

    [tableId, taxRateData]
  );

  // Handle tax category selection and fetch percentages

  const handleTaxCategoryChange = async (rowIndex, taxCategoryId, taxId) => {
    const currentData = taxRateData[rowIndex];

    if (!currentData || !currentData.pms_inventory_id) {
      console.error("No pms_inventory_id available for tax category change");

      return;
    }

    console.log(
      `Fetching tax percentages for pms_inventory_id: ${currentData.pms_inventory_id}, tax_category_id: ${taxCategoryId}`
    );

    try {
      const percentages = await fetchTaxPercentagesByMaterial(
        currentData.pms_inventory_id,

        taxCategoryId
      );

      setMaterialTaxPercentages((prev) => ({
        ...prev,

        [taxId]: percentages,
      }));

      console.log("Fetched tax percentages:", percentages);
    } catch (error) {
      console.error("Error fetching tax percentages:", error);

      setMaterialTaxPercentages((prev) => ({
        ...prev,

        [taxId]: [],
      }));
    }
  };

  // Recalculate all conversions when conversion rate changes

  useEffect(() => {
    if (tableId !== null && taxRateData[tableId]) {
      // Force re-render of tax data to update all conversions

      setTaxRateData((prev) => ({
        ...prev,

        [tableId]: {
          ...prev[tableId],
        },
      }));
    }
  }, [conversionRate, tableId]);

  // Get available conditions for a specific category

  const getConditionsForCategory = (category) => {
    return termsConditions.filter(
      (item) => item.condition_category_name === category
    );
  };

  // Helper function to check if a tax is TaxCategory type

  const isTaxCategory = (taxType) => {
    const taxOption = taxOptions.find((option) => option.value === taxType);

    return taxOption?.type === "TaxCategory";
  };

  // Fetch tax percentages for specific material and tax category

  // In the tax percentage fetching section, add type checking and fallback

  const fetchTaxPercentagesByMaterial = async (
    pmsInventoryId,

    taxCategoryId
  ) => {
    try {
      const response = await axios.get(
        `${baseURL}tax_percentage_by_material.json?pms_inventory_id=${pmsInventoryId}&tax_category_id=${taxCategoryId}&token=${token}`
      );

      console.log("Tax percentages by material response:", response.data);

      // Check if response.data is an array

      if (Array.isArray(response.data)) {
        return response.data;
      }

      // If response.data has a percentages property that's an array
      else if (Array.isArray(response.data?.percentages)) {
        return response.data.percentages;
      }

      // If response.data is an object with nested data
      else if (response.data && typeof response.data === "object") {
        // Look for any array property that might contain the percentages

        const percentagesArray = Object.values(response.data).find((val) =>
          Array.isArray(val)
        );

        return percentagesArray || [];
      }

      // Fallback to empty array if no valid data structure is found

      return [];
    } catch (error) {
      console.error("Error fetching tax percentages by material:", error);

      return [];
    }
  };

  // Handle terms form input changes

  const handleTermsFormChange = (field, value) => {
    // Validation: Prevent negative values for numeric fields

    if (
      ["creditPeriod", "poValidityPeriod", "advanceReminderDuration"].includes(
        field
      )
    ) {
      const numValue = parseFloat(value);

      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        toast.error(
          `${field

            .replace(/([A-Z])/g, " $1")

            .replace(/^./, (str) =>
              str.toUpperCase()
            )} cannot be negative. Please enter a valid positive number.`
        );

        return;
      }
    }

    setTermsFormData((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  // Handle charges functions

  const addCharge = () => {
    const newCharge = {
      id: Date.now(),

      charge_name: "",

      charge_id: 0,

      amount: "",

      realised_amount: "",
    };

    setCharges((prev) => [...prev, newCharge]);
  };

  const removeCharge = (id) => {
    setCharges((prev) => prev.filter((charge) => charge.id !== id));
  };

  const handleChargeChange = (id, field, value) => {
    // Validation: Prevent negative values for amount fields

    if (field === "amount") {
      const numValue = parseFloat(value);

      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        toast.error(
          "Amount cannot be negative. Please enter a valid positive number."
        );

        return;
      }
    }

    setCharges((prev) =>
      prev.map((charge) => {
        if (charge.id === id) {
          const updatedCharge = { ...charge, [field]: value };

          // If charge_name is being updated, also update charge_id

          if (field === "charge_name") {
            const chargeNameObj = chargeNames.find((cn) => cn.name === value);

            if (chargeNameObj) {
              updatedCharge.charge_id = chargeNameObj.id;
            }
          }

          return updatedCharge;
        }

        return charge;
      })
    );
  };

  // ...existing code...

  const addCost = () => {
    const newCost = {
      id: Date.now(),

      cost_name: "",

      amount: "",

      scope: "",

      realised_amount: "",
    };

    setOtherCosts((prev) => [...prev, newCost]);
  };

  const removeCost = (id) => {
    setOtherCosts((prev) => prev.filter((cost) => cost.id !== id));
  };
  const handleCostChange = (id, field, value) => {
    // Validation: Prevent negative values for amount fields

    if (field === "amount") {
      const numValue = parseFloat(value);

      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        toast.error(
          "Amount cannot be negative. Please enter a valid positive number."
        );

        return;
      }
    }

    setOtherCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, [field]: value } : cost))
    );
  };

  // ...rest of the code...

  // Handle taxes modal functions

  const handleOpenTaxesModal = (itemId, itemType = "charge") => {
    console.log("opneddd");

    setSelectedChargeId(itemId);

    setSelectedItemType(itemType);

    let item;

    if (itemType === "charge") {
      item = charges.find((c) => c.id === itemId);
    } else {
      item = otherCosts.find((c) => c.id === itemId);
    }

    const baseCost = parseFloat(item?.amount) || 0;

    // Load taxes from API response if available

    let savedTaxes;

    if (item?.taxes_and_charges && item.taxes_and_charges.length > 0) {
      // Convert API taxes to modal format

      const additionTaxes = item.taxes_and_charges

        .filter((tax) => tax.addition)

        .map((tax) => ({
          id: tax.id,

          taxType: tax.resource_id?.toString() || "", // Use resource_id for dropdown selection

          taxPercentage: tax.percentage || "",

          inclusive: tax.inclusive,

          amount: tax.amount?.toString() || "",

          resource_id: tax.resource_id,

          resource_type: tax.resource_type,
        }));

      const deductionTaxes = item.taxes_and_charges

        .filter((tax) => !tax.addition)

        .map((tax) => ({
          id: tax.id,

          taxType: tax.resource_id?.toString() || "", // Use resource_id for dropdown selection

          taxPercentage: tax.percentage || "",

          inclusive: tax.inclusive,

          amount: tax.amount?.toString() || "",

          resource_id: tax.resource_id,

          resource_type: tax.resource_type,
        }));

      savedTaxes = {
        additionTaxes: additionTaxes,

        deductionTaxes: deductionTaxes,

        netCost: (
          baseCost +
          additionTaxes.reduce(
            (sum, tax) => sum + parseFloat(tax.amount || 0),

            0
          ) -
          deductionTaxes.reduce(
            (sum, tax) => sum + parseFloat(tax.amount || 0),

            0
          )
        ).toFixed(2),
      };
    } else {
      // Load previously saved tax data if it exists

      savedTaxes = item?.taxes || {
        additionTaxes: [],

        deductionTaxes: [],

        netCost: baseCost.toFixed(2),
      };
    }

    setChargeTaxes({
      additionTaxes: savedTaxes.additionTaxes || [],

      deductionTaxes: savedTaxes.deductionTaxes || [],

      baseCost: baseCost,

      netCost: savedTaxes.netCost || baseCost.toFixed(2),
    });

    setShowTaxesModal(true);
  };

  const handleCloseTaxesModal = () => {
    setShowTaxesModal(false);

    setSelectedChargeId(null);

    setSelectedItemType(null);

    // Don't reset chargeTaxes to preserve data for reopening
  };

  const getTaxOptionNameById = (id) => {
    const allOpts = [
      ...(chargesAdditionTaxOptions || []),

      ...(chargesDeductionTaxOptions || []),
    ];

    const found = allOpts.find((o) => `${o.id}` === `${id}`);

    return found?.name || "";
  };

  const isPercentageTax = (taxChargeType) => {
    if (!taxChargeType) return false;

    const taxType = taxChargeType.toLowerCase();

    return (
      taxType.includes("cgst") ||
      taxType.includes("sgst") ||
      taxType.includes("igst") ||
      taxType.includes("tds")
    );
  };

  const addTaxRow = (type) => {
    const newTax = {
      id: Date.now(),

      taxType: "",

      taxPercentage: "",

      inclusive: false,

      amount: "",
    };

    if (type === "addition") {
      setChargeTaxes((prev) => ({
        ...prev,

        additionTaxes: [...prev.additionTaxes, newTax],
      }));
    } else {
      setChargeTaxes((prev) => ({
        ...prev,

        deductionTaxes: [...prev.deductionTaxes, newTax],
      }));
    }
  };

  const removeTaxRow = (type, taxId) => {
    if (type === "addition") {
      setChargeTaxes((prev) => ({
        ...prev,

        additionTaxes: prev.additionTaxes.filter((tax) => tax.id !== taxId),
      }));
    } else {
      setChargeTaxes((prev) => ({
        ...prev,

        deductionTaxes: prev.deductionTaxes.filter((tax) => tax.id !== taxId),
      }));
    }
  };
  const handleTaxChange = (type, taxId, field, value) => {
    if (type === "addition") {
      setChargeTaxes((prev) => {
        const updatedAdditionTaxes = prev.additionTaxes.map((tax) => {
          if (tax.id === taxId) {
            const updatedTax = { ...tax, [field]: value };

            // Auto-calculate amount when taxType, taxPercentage, or inclusive changes

            if (
              field === "taxType" ||
              field === "taxPercentage" ||
              field === "inclusive"
            ) {
              if (
                updatedTax.taxType &&
                updatedTax.taxPercentage &&
                !updatedTax.inclusive
              ) {
                const percentage =
                  parseFloat(updatedTax.taxPercentage.replace("%", "")) || 0;

                const baseAmount = parseFloat(chargeTaxes.baseCost) || 0;

                const calculatedAmount = (percentage / 100) * baseAmount;

                updatedTax.amount = calculatedAmount.toFixed(2);
              } else {
                updatedTax.amount = "0";
              }
            }

            return updatedTax;
          }

          return tax;
        });

        // Calculate net cost

        const additionTotal = updatedAdditionTaxes.reduce((sum, tax) => {
          if (tax.inclusive) return sum;

          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = prev.deductionTaxes.reduce((sum, tax) => {
          if (tax.inclusive) return sum;

          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;

        return {
          ...prev,

          additionTaxes: updatedAdditionTaxes,

          netCost: netCost.toFixed(2),
        };
      });
    } else {
      setChargeTaxes((prev) => {
        const updatedDeductionTaxes = prev.deductionTaxes.map((tax) => {
          if (tax.id === taxId) {
            const updatedTax = { ...tax, [field]: value };

            // Auto-calculate amount when taxType, taxPercentage, or inclusive changes

            if (
              field === "taxType" ||
              field === "taxPercentage" ||
              field === "inclusive"
            ) {
              if (
                updatedTax.taxType &&
                updatedTax.taxPercentage &&
                !updatedTax.inclusive
              ) {
                const percentage =
                  parseFloat(updatedTax.taxPercentage.replace("%", "")) || 0;

                const baseAmount = parseFloat(chargeTaxes.baseCost) || 0;

                const calculatedAmount = (percentage / 100) * baseAmount;

                updatedTax.amount = calculatedAmount.toFixed(2);
              } else {
                updatedTax.amount = "0";
              }
            }

            return updatedTax;
          }

          return tax;
        });

        // Calculate net cost

        const additionTotal = prev.additionTaxes.reduce((sum, tax) => {
          if (tax.inclusive) return sum;

          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = updatedDeductionTaxes.reduce((sum, tax) => {
          if (tax.inclusive) return sum;

          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;

        return {
          ...prev,

          deductionTaxes: updatedDeductionTaxes,

          netCost: netCost.toFixed(2),
        };
      });
    }
  };

  const handleSaveTaxes = () => {
    console.log("Save taxes button clicked!");

    console.log("Selected item type:", selectedItemType);

    console.log("Selected charge ID:", selectedChargeId);

    console.log("Charge taxes data:", chargeTaxes);

    // Update the charge or cost with taxes data

    if (selectedItemType === "charge") {
      setCharges((prev) =>
        prev.map((charge) =>
          charge.id === selectedChargeId
            ? {
                ...charge,

                taxes: {
                  additionTaxes: chargeTaxes.additionTaxes,

                  deductionTaxes: chargeTaxes.deductionTaxes,

                  netCost: chargeTaxes.netCost,
                },

                realised_amount: chargeTaxes.netCost, // Set realised amount to net cost
              }
            : charge
        )
      );
    } else {
      setOtherCosts((prev) =>
        prev.map((cost) =>
          cost.id === selectedChargeId
            ? {
                ...cost,

                taxes: {
                  additionTaxes: chargeTaxes.additionTaxes,

                  deductionTaxes: chargeTaxes.deductionTaxes,

                  netCost: chargeTaxes.netCost,
                },

                realised_amount: chargeTaxes.netCost, // Set realised amount to net cost
              }
            : cost
        )
      );
    }

    handleCloseTaxesModal();
  };

  // Fetch charges addition taxes

  const fetchChargesAdditionTaxes = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/addition_taxes_dropdown?token=${token}`
      );

      console.log("Charges addition taxes response:", response.data);

      setChargesAdditionTaxOptions(response.data.taxes || []);
    } catch (error) {
      console.error("Error fetching charges addition taxes:", error);

      setChargesAdditionTaxOptions([]);
    }
  };

  // Fetch charges deduction taxes

  const fetchChargesDeductionTaxes = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/deduction_tax_details?token=${token}`
      );

      console.log("Charges deduction taxes response:", response.data);

      setChargesDeductionTaxOptions(response.data.taxes || []);
    } catch (error) {
      console.error("Error fetching charges deduction taxes:", error);

      setChargesDeductionTaxOptions([]);
    }
  };

  // Fetch charges tax percentages

  const fetchChargesTaxPercentages = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/tax_percentage?token=${token}`
      );

      console.log("Charges tax percentages response:", response.data);

      setChargesTaxPercentages(response.data || []);
    } catch (error) {
      console.error("Error fetching charges tax percentages:", error);

      setChargesTaxPercentages([]);
    }
  };

  // Fetch charge names from API

  const fetchChargeNames = async () => {
    try {
      const response = await axios.get(
        `${baseURL}tax_configurations/charge_names.json?token=${token}`
      );

      console.log("Charge names response:", response.data);

      setChargeNames(response.data || []);
    } catch (error) {
      console.error("Error fetching charge names:", error);

      setChargeNames([]);
    }
  };

  // Service providers will use the same data as suppliers

  // No need for separate fetchServiceProviders function

  // Fetch charges data from API for all submitted materials

  const fetchChargesData = async () => {
    try {
      setLoadingCharges(true);

      const chargesData = [];

      let totalCost = 0;

      for (const material of submittedMaterials) {
        if (material.id) {
          // Make only ONE API call per material to get all the data

          const response = await axios.get(
            `${baseURL}po_mor_inventories/${material.id}/ropo_rate_details.json?token=${token}`
          );

          if (response.data) {
            const rateData = response.data;

            // Calculate total material cost from this single API call

            if (rateData.total_material_cost) {
              totalCost += parseFloat(rateData.total_material_cost) || 0;
            }

            // Process addition tax details

            if (
              rateData.addition_tax_details &&
              Array.isArray(rateData.addition_tax_details)
            ) {
              rateData.addition_tax_details.forEach((tax) => {
                chargesData.push({
                  id: tax.id,

                  material_id: material.id,

                  material_name:
                    material.material_name ||
                    material.material?.material_name ||
                    "",

                  charge_name: getTaxNameById(tax.resource_id),

                  resource_id: tax.resource_id,

                  resource_type: tax.resource_type,

                  amount: safeConvertInrToUsd(
                    parseFloat(tax.amount || 0) || 0,
                    conversionRate
                  ),

                  amount_inr: parseFloat(tax.amount || 0) || 0,

                  inclusive: tax.inclusive,

                  tax_category_id: tax.tax_category_id,

                  percentage: tax.percentage,
                });
              });
            }

            // Process deduction tax details

            if (
              rateData.deduction_tax_details &&
              Array.isArray(rateData.deduction_tax_details)
            ) {
              rateData.deduction_tax_details.forEach((tax) => {
                chargesData.push({
                  id: tax.id,

                  material_id: material.id,

                  material_name:
                    material.material_name ||
                    material.material?.material_name ||
                    "",

                  charge_name: getTaxNameById(tax.resource_id),

                  resource_id: tax.resource_id,

                  resource_type: tax.resource_type,

                  amount: safeConvertInrToUsd(
                    parseFloat(tax.amount || 0) || 0,
                    conversionRate
                  ),

                  amount_inr: parseFloat(tax.amount || 0) || 0,

                  inclusive: tax.inclusive,

                  tax_category_id: tax.tax_category_id,

                  percentage: tax.percentage,
                });
              });
            }
          }
        }
      }

      setChargesFromApi(chargesData);

      setTotalMaterialCost(totalCost);

      console.log("Charges data from API:", chargesData);

      console.log("Total material cost:", totalCost);

      // Calculate and store values for Rate & Taxes table for each material

      const calculatedValuesMap = {};

      for (const material of submittedMaterials) {
        if (material.id) {
          const materialCharges = chargesData.filter(
            (charge) => charge.material_id === material.id
          );

          const calculatedValues = {
            taxAddition: 0,

            totalChanges: 0,

            otherAddition: 0,

            otherDeductions: 0,

            allInclCost: 0,

            taxDeductions: 0,
          };

          // Calculate Tax Addition (sum of TaxCategory additions)

          calculatedValues.taxAddition = materialCharges

            .filter((charge) => charge.resource_type === "TaxCategory")

            .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);

          // Calculate Tax Deductions (sum of TaxCategory deductions)

          calculatedValues.taxDeductions = materialCharges

            .filter(
              (charge) =>
                charge.resource_type === "TaxCategory" && charge.amount < 0
            )

            .reduce(
              (sum, charge) => sum + Math.abs(parseFloat(charge.amount) || 0),

              0
            );

          // Calculate Other Addition (sum of TaxCharge additions)

          calculatedValues.otherAddition = materialCharges

            .filter(
              (charge) =>
                charge.resource_type === "TaxCharge" && charge.amount > 0
            )

            .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);

          // Calculate Other Deductions (sum of TaxCharge deductions)

          calculatedValues.otherDeductions = materialCharges

            .filter(
              (charge) =>
                charge.resource_type === "TaxCharge" && charge.amount < 0
            )

            .reduce(
              (sum, charge) => sum + Math.abs(parseFloat(charge.amount) || 0),

              0
            );

          // Calculate Total Changes

          calculatedValues.totalChanges =
            calculatedValues.taxAddition - calculatedValues.taxDeductions;

          // Calculate All Inclusive Cost (sum of all positive amounts)

          calculatedValues.allInclCost = materialCharges.reduce(
            (sum, charge) => sum + Math.max(0, parseFloat(charge.amount) || 0),

            0
          );

          calculatedValuesMap[material.id] = calculatedValues;
        }
      }

      setMaterialCalculatedValues(calculatedValuesMap);
    } catch (error) {
      console.error("Error fetching charges data:", error);

      setChargesFromApi([]);

      setTotalMaterialCost(0);
    } finally {
      setLoadingCharges(false);
    }
  };

  // Helper function to get tax name by resource ID

  const getTaxNameById = (resourceId) => {
    // Check in tax options

    const taxOption = taxOptions.find((option) => option.id === resourceId);

    if (taxOption) return taxOption.label;

    // Check in deduction tax options

    const deductionOption = deductionTaxOptions.find(
      (option) => option.id === resourceId
    );

    if (deductionOption) return deductionOption.label;

    // Check in charge names

    const chargeName = chargeNames.find((charge) => charge.id === resourceId);

    if (chargeName) return chargeName.name;

    return "Unknown Charge";
  };

  // Handle service provider selection

  const handleServiceProviderChange = (chargeId, selectedOption) => {
    setSelectedServiceProviders((prev) => ({
      ...prev,

      [chargeId]: selectedOption,
    }));
  };

  // Handle service certificate checkbox

  const handleServiceCertificateChange = (chargeId, checked) => {
    setServiceCertificates((prev) => ({
      ...prev,

      [chargeId]: checked,
    }));
  };

  // Handle charge remarks

  const handleChargeRemarksChange = (chargeId, remarks) => {
    setChargeRemarks((prev) => ({
      ...prev,

      [chargeId]: remarks,
    }));
  };

  // Per-row Service Certificate Advance percentage for Charges (Exclusive)

  const [serviceCertAdvancePercentByRow, setServiceCertAdvancePercentByRow] =
    useState({});

  const handleServiceCertAdvancePercentChange = (rowIndex, value) => {
    const num = parseFloat(value);

    if (value === "" || (!isNaN(num) && num >= 0 && num <= 100)) {
      setServiceCertAdvancePercentByRow((prev) => ({
        ...prev,
        [rowIndex]: value,
      }));
    }
  };

  // Calculate supplier advance amount

  const calculateSupplierAdvanceAmount = () => {
    const percentage = parseFloat(supplierAdvancePercentage) || 0;

    // Base should be Total Payable To Supplier (preset data)
    const baseUsd = parseFloat(formData.payableToSupplier || 0);

    const amount = (baseUsd * percentage) / 100;

    return amount;
  };

  // Calculate service certificate advance amount

  const calculateServiceCertificateAdvanceAmount = () => {
    const percentage = parseFloat(serviceCertificateAdvancePercentage) || 0;

    // Base should be sum of TaxCharge additions (handling/freight/other additions) in USD across materials

    const baseUsd = (chargesFromApi || [])

      .filter(
        (c) =>
          c &&
          c.resource_type === "TaxCharge" &&
          (parseFloat(c.amount) || 0) > 0
      )

      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

    const amount = (baseUsd * percentage) / 100;

    return amount;
  };
  // Calculate total discount as sum of discount_rate for all materials (USD)

  const calculateTotalDiscountAmount = () => {
    return submittedMaterials.reduce((sum, _mat, idx) => {
      const discount = parseFloat(taxRateData[idx]?.discountRate) || 0;

      return sum + discount;
    }, 0);
  }; 


  const calculateOtherVendorNetCost = () => {
    try {
      return (otherCosts || [])
        .filter((c) => (c?.scope || "").toLowerCase() === "by vendor")
        .reduce((sum, c) => {
          const net = parseFloat(c?.taxes?.netCost ?? c?.realised_amount ?? c?.amount) || 0;
          return sum + net;
        }, 0);
    } catch {
      return 0;
    }
  };

  // Total deduction taxes across materials (non-inclusive)
  const calculateTotalMaterialDeductionTaxes = () => {
    try {
      const indices = Object.keys(taxRateData || {});
      return indices.reduce((outerSum, idx) => {
        const list = taxRateData[idx]?.deduction_bid_material_tax_details || [];
        const rowSum = list
          .filter((t) => !t?._destroy && !t?.inclusive)
          .reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0);
        return outerSum + rowSum;
      }, 0);
    } catch {
      return 0;
    }
  };

  // Final payable to supplier = total discount + other vendor net - material deduction taxes
  const calculatePayableToSupplier = () => {
    const totalDiscount = parseFloat(calculateTotalDiscountAmount() || 0);
    const otherVendorNet = parseFloat(calculateOtherVendorNetCost() || 0);
    const totalDeductionTaxes = parseFloat(calculateTotalMaterialDeductionTaxes() || 0);
    return totalDiscount + otherVendorNet - totalDeductionTaxes;
  };


  // Handle supplier advance percentage change

  const handleSupplierAdvancePercentageChange = (value) => {
    const numValue = parseFloat(value) || 0;

    if (value === "") {
      setSupplierAdvancePercentage("");
    } else if (numValue >= 0 && numValue <= 100) {
      setSupplierAdvancePercentage(value);
    } else {
      toast.error("Supplier advance percentage must be between 0 and 100.");
    }
  };

  // Handle service certificate advance percentage change

  const handleServiceCertificateAdvancePercentageChange = (value) => {
    const numValue = parseFloat(value) || 0;

    if (value === "") {
      setServiceCertificateAdvancePercentage("");
    } else if (numValue >= 0 && numValue <= 100) {
      setServiceCertificateAdvancePercentage(value);
    } else {
      toast.error(
        "Service certificate advance percentage must be between 0 and 100."
      );
    }
  };

  // Refresh charges data

  const refreshChargesData = () => {
    if (activeTab === "terms-conditions" && submittedMaterials.length > 0) {
      fetchChargesData();
    }
  };

  // Get percentages for specific tax category

  const getChargesTaxPercentages = (taxCategoryId) => {
    const taxData = chargesTaxPercentages.find(
      (tax) => tax.tax_category_id === parseInt(taxCategoryId)
    );

    return taxData ? taxData.percentage : [];
  };
  // Handle purchase order creation

  const handleCreatePurchaseOrder = async () => {
    try {
      setIsCreatingOrder(true);

      // Validate required fields

      if (!selectedCompany?.value) {
        toast.error("Please select a company.");

        setIsCreatingOrder(false);
        setLoading(false);

        return;
      }

      if (!selectedSupplier?.value) {
        toast.error("Please select a supplier.");

        setIsCreatingOrder(false);
        setLoading(false);

        return;
      }

      if (!conversionRate || conversionRate <= 0) {
        toast.error(
          "Please set the Conversion Rate (USD to INR) in the PO Details tab."
        );

        setIsCreatingOrder(false);
        setLoading(false);

        return;
      }

      // Validate Delivery Schedules: if present, each visible row must have both PO Delivery Date and a positive PO Delivery Qty

      const hasSchedules =
        Array.isArray(deliverySchedules) && deliverySchedules.length > 0;

      if (hasSchedules) {
        const anyInvalid = deliverySchedules.some((s, idx) => {
          if (!isScheduleRowVisible(s)) return false;

          const hasDate = Boolean(s.po_delivery_date);

          const qty = parseFloat(s.po_delivery_qty);

          return !(hasDate && Number.isFinite(qty) && qty > 0);
        });

        if (anyInvalid) {
          toast.error(
            "Please enter both PO Delivery Date and a positive PO Delivery Qty for all Delivery Schedule rows."
          );

          setIsCreatingOrder(false);
          setLoading(false);

          return;
        }
      }

      // Prepare charges data for submission

      const chargesSubmissionData = chargesFromApi.map((charge) => ({
        id: charge.id,

        material_id: charge.material_id,

        charge_name: charge.charge_name,

        resource_id: charge.resource_id,

        resource_type: charge.resource_type,

        amount: charge.amount,

        amount_inr: charge.amount_inr,

        service_certificate: serviceCertificates[charge.id] || false,

        service_provider_id: selectedServiceProviders[charge.id]?.value || null,

        service_provider_name:
          selectedServiceProviders[charge.id]?.label || null,

        remarks: chargeRemarks[charge.id] || "",
      }));

      console.log("Charges data for submission:", chargesSubmissionData);

      // Get material inventory IDs from submitted materials

      console.log("Submitted materials:", submittedMaterials);

     

      console.log("apiMaterialInventoryIds", apiMaterialInventoryIds);

      if (purchaseOrderId) {
        console.log(
          "Including po_id in purchase order payload:",

          purchaseOrderId
        );
      }

      // Debug logging

      console.log("materialTermConditions:", materialTermConditions);

      console.log(
        "typeof materialTermConditions:",

        typeof materialTermConditions
      );

      console.log(
        "Array.isArray(materialTermConditions):",

        Array.isArray(materialTermConditions)
      );

      const consolidatedCharges = getConsolidatedCharges();
           const chargeIdToServiceCertPct = {};
      try {
        setLoading(true);
        (consolidatedCharges || []).forEach((row, rowIndex) => {
          const pct =
            parseFloat(serviceCertAdvancePercentByRow[rowIndex] || 0) || 0;
          (row.charge_ids || []).forEach((cid) => {
            chargeIdToServiceCertPct[cid] = pct;
          });
        });
      } catch (e) {}

      const payload = {
        purchase_order: {
          status: "draft",

          
          credit_period: termsFormData.creditPeriod
            ? parseInt(termsFormData.creditPeriod)
            : null,

          po_validity_period: termsFormData.poValidityPeriod
            ? parseInt(termsFormData.poValidityPeriod)
            : null,

          advance_reminder_duration: termsFormData.advanceReminderDuration
            ? parseInt(termsFormData.advanceReminderDuration)
            : null,

          payment_terms: termsFormData.paymentTerms || null,

          payment_remarks: termsFormData.paymentRemarks || null,

          supplier_advance: parseFloat(calculateSupplierAdvanceAmount() || 0),

         supplier_advance_percentage: parseFloat(supplierAdvancePercentage || 0),

          

          total_discount: parseFloat(calculateTotalDiscountAmount() || 0),

          total_value: parseFloat(totalMaterialCost || 0),

          po_date: getLocalDateTime().split("T")[0], // Current date

          company_id: selectedCompany?.value,

          po_type: "import",

          supplier_id: selectedSupplier?.value,

          conversion_rate: conversionRate, // Add conversion rate to payload

          // Selected PO currency from dropdown

          po_currency: selectedCurrency?.code || null,

          // Payables

          // payable_to_supplier: submittedMaterials.reduce((sum, _mat, idx) => {
          //   const materialCost =
          //     parseFloat(taxRateData[idx]?.materialCost) || 0;

          //   return sum + materialCost;
          // }, 0),
          payable_to_supplier: parseFloat(calculatePayableToSupplier() || 0),

         

          remark: termsFormData.remark || "",

          comments: termsFormData.comments || "",

          material_inventory_ids: apiMaterialInventoryIds,

          // Extract unique MOR IDs from submitted materials

         
          // Include purchase order ID if available (for updates)

          ...(purchaseOrderId && { po_id: purchaseOrderId }),

          // Format other cost details with taxes

          other_cost_details_attributes: otherCosts.map((cost) => ({
            cost_type: cost.cost_name || "",

            cost: parseFloat(cost.amount) || 0,

            scope: cost.scope || "",

            taxes_and_charges_attributes: [
              ...(cost.taxes?.additionTaxes || []).map((tax) => ({
                resource_id: parseInt(tax.taxType) || 0,

                resource_type: "TaxCategory",

                percentage:
                  parseFloat(tax.taxPercentage?.replace("%", "")) || 0,

                inclusive: tax.inclusive || false,

                amount: parseFloat(tax.amount) || 0,

                addition: true,
              })),

              ...(cost.taxes?.deductionTaxes || []).map((tax) => ({
                resource_id: parseInt(tax.taxType) || 0,

                resource_type: "TaxCategory",

                percentage:
                  parseFloat(tax.taxPercentage?.replace("%", "")) || 0,

                inclusive: tax.inclusive || false,

                amount: parseFloat(tax.amount) || 0,

                addition: false,
              })),
            ],
          })),

          

          // charges_with_taxes_attributes: charges.map((charge) => {
          //   return {
          //     charge_id: charge.charge_id || 0,

          //     amount: parseFloat(charge.amount) || 0,

          //     realised_amount: parseFloat(charge.realised_amount) || 0,

          //     taxes_and_charges_attributes: [
          //       ...(charge.taxes?.additionTaxes || []).map((tax) => ({
          //         resource_id: parseInt(tax.taxType) || 0,

          //         resource_type: "TaxCategory",

          //         percentage:
          //           parseFloat(tax.taxPercentage?.replace("%", "")) || 0,

          //         inclusive: tax.inclusive || false,

          //         amount: parseFloat(tax.amount) || 0,

          //         addition: true,
          //       })),

          //       ...(charge.taxes?.deductionTaxes || []).map((tax) => ({
          //         resource_id: parseInt(tax.taxType) || 0,

          //         resource_type: "TaxCategory",

          //         percentage:
          //           parseFloat(tax.taxPercentage?.replace("%", "")) || 0,

          //         inclusive: tax.inclusive || false,

          //         amount: parseFloat(tax.amount) || 0,

          //         addition: false,
          //       })),
          //     ],
          //   };
          // }),

          // Resource term conditions

          resource_term_conditions_attributes: Array.isArray(generalTerms)
            ? generalTerms

                .filter((row) => row.category && row.condition) // Only include filled rows

                .map((row) => {
                  // Find the term in termsConditions that matches the selected category

                  const term = termsConditions.find(
                    (t) => t.condition_category_name === row.category
                  );

                  return term
                    ? {
                        term_condition_id: term.id,

                        condition_type: "general",

                        // Optionally, you can also send the condition text if your API expects it:

                        // condition: row.condition,
                      }
                    : null;
                })

                .filter(Boolean) // Remove any nulls if no match found
            : [],

          // Resource material term conditions

          resource_material_term_conditions_attributes: Array.isArray(
            materialTermConditions
          )
            ? materialTermConditions.map((term) => ({
                term_condition_id: term.id,

                condition_type: "material",
              }))
            : [],

          attachments: attachmentsPayload || [],

          // Delivery Schedules payload

          delivery_schedules_attributes: (() => {
            console.log("All delivery schedules:", deliverySchedules);
            
            const schedules = (deliverySchedules || [])

            .filter((s, index) => {
              const qty = parseFloat(s.po_delivery_qty) || 0;
              const hasDate = Boolean(s.po_delivery_date);
              
              // Try to parse date with different formats
              let dateObj = null;
              let isValidDate = false;
              
              if (hasDate) {
                // Try direct parsing first
                dateObj = new Date(s.po_delivery_date);
                isValidDate = !isNaN(dateObj.getTime());
                
                // If that fails, try parsing DD/MM/YYYY format
                if (!isValidDate && s.po_delivery_date.includes('/')) {
                  const parts = s.po_delivery_date.split('/');
                  if (parts.length === 3) {
                    // Convert DD/MM/YYYY to MM/DD/YYYY for JavaScript Date
                    const reformattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
                    dateObj = new Date(reformattedDate);
                    isValidDate = !isNaN(dateObj.getTime());
                  }
                }
              }
              
              const isVisible = isScheduleRowVisible(s);
              
              console.log(`Schedule ${index}:`, {
                schedule: s,
                qty,
                hasDate,
                po_delivery_date: s.po_delivery_date,
                dateObj,
                isValidDate,
                isVisible,
                willInclude: qty > 0 && isValidDate && isVisible
              });
              
              return qty > 0 && isValidDate && isVisible;
            })

            .map((s) => {
              // Use the same date parsing logic as in the filter
              let dateObj = new Date(s.po_delivery_date);
              if (isNaN(dateObj.getTime()) && s.po_delivery_date.includes('/')) {
                const parts = s.po_delivery_date.split('/');
                if (parts.length === 3) {
                  const reformattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
                  dateObj = new Date(reformattedDate);
                }
              }

              const ymd = dateObj.toISOString().split("T")[0];

              return {
                id: s.id || null, // Include existing ID to preserve the delivery schedule

                po_delivery_date: ymd,

                order_qty: parseFloat(s.po_delivery_qty) || 0,

                mor_inventory_schedule_id:
                  s.mor_inventory_schedule_id || s.id || null,

                delivery_address: s.store_address || "",

                store_name: s.store_name || "",

                remarks: s.remarks || "",

                _destroy: false,
              };
            });
            
            console.log("Delivery schedules payload:", schedules);
            return schedules;
          })(),

         
        },
         mor_ids: [
            ...new Set(
              submittedMaterials

                .map((material) => material.mor_inventory_id)

                .filter(Boolean)
            ),
          ],

          // Extract MOR inventory tax details from charges data

          mor_inventory_tax_details: chargesFromApi

            .filter(
              (charge) =>
                charge.resource_type === "TaxCategory" ||
                charge.resource_type === "TaxCharge"
            )

            .map((charge) => ({
              id: charge.id,

              remarks: chargeRemarks[charge.id] || "",
              supplier_id:
                (selectedServiceProviders[charge.id]?.value ?? null) !== null
                  ? selectedServiceProviders[charge.id]?.value
                  : selectedSupplier?.value || null,
              applicable_to_payable: true,
              service_certificate_advance_percentage: (() => {
                const pct = chargeIdToServiceCertPct[charge.id];
                return pct === 0 || pct ? pct : 0;
              })(),
            })),
      };

      console.log("Creating purchase order with payload:", payload);

      const response = await axios.patch(
        `${baseURL}purchase_orders/${poId}.json?token=${token}`,

        payload
      );

      console.log("Purchase order created successfully:", response.data);

      toast.success("Purchase order created successfully!", {
        autoClose: 1500,
        onClose: () => navigate(`/ropo-import-list?token=${token}`),
      });

      // Optionally redirect or clear form

      // window.location.href = '/po-list'; // Redirect to PO list
    } catch (error) {
      console.error("Error creating purchase order:", error);
      setLoading(false);

      toast.error("Error creating purchase order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
      setLoading(false);
    }
  };

  // ...rest of the code...

  // Currency helpers for modal

  // Exchange rate: 1 USD = 82.5 INR (default)

  // Conversion functions with safety checks

  const convertInrToUsd = useCallback(
    (inrValue, customRate = null) => {
      if (!inrValue || isNaN(inrValue)) return "";

      const rate = customRate ?? conversionRate;

      if (!rate || isNaN(rate) || rate <= 0) return "";

      return (parseFloat(inrValue) / rate).toFixed(2);
    },

    [conversionRate]
  );

  const convertUsdToInr = useCallback(
    (usdValue, customRate = null) => {
      if (!usdValue || isNaN(usdValue)) return "";

      const rate = customRate ?? conversionRate;

      if (!rate || isNaN(rate) || rate <= 0) return "";

      return (parseFloat(usdValue) * rate).toFixed(2);
    },

    [conversionRate]
  );

  // Safe conversion functions that can be used during initial render

  const safeConvertInrToUsd = (inrValue, customRate = null) => {
    if (!inrValue || isNaN(inrValue)) return "";

    const rate = customRate ?? conversionRate;

    if (!rate || isNaN(rate) || rate <= 0) return "";

    return (parseFloat(inrValue) / rate).toFixed(2);
  };

  const safeConvertUsdToInr = (usdValue, customRate = null) => {
    if (!usdValue || isNaN(usdValue)) return "";

    const rate = customRate ?? conversionRate;

    if (!rate || isNaN(rate) || rate <= 0) return "";

    return (parseFloat(usdValue) * rate).toFixed(2);
  };

  // Calculate total amount for addition taxes (Base Cost + Tax Amount)

  const calculateAdditionTaxAmount = (baseCost, taxAmount) => {
    const base = parseFloat(baseCost) || 0;

    const tax = parseFloat(taxAmount) || 0;

    return base + tax;
  };

  // Calculate total amount for deduction taxes (Base Cost - Tax Amount)

  const calculateDeductionTaxAmount = (baseCost, taxAmount) => {
    const base = parseFloat(baseCost) || 0;

    const tax = parseFloat(taxAmount) || 0;

    return Math.max(0, base - tax);
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      {/* <main className="h-100 w-100"> */}

      {/* top navigation above */}

      <div className="main-content overflow-auto">
        {/* sidebar ends above */}

        {/* webpage conteaint start */}

        <div className="website-content ">
          <div className="module-data-section ">
            <a href="">Home &gt; Purchase &gt; MTO &gt; MTO Pending Approval</a>

            <h5 className="mt-3">Create Purchase Order</h5>

            <div className="row my-4 container-fluid align-items-center">
              <div className="col-md-12 ">
                <div className="mor-tabs mt-4">
                  <ul
                    className="nav nav-pills mb-3 justify-content-center"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        data-bs-toggle="pill"
                        data-bs-target="#create-mor"
                        type="button"
                        role="tab"
                        aria-controls="create-mor"
                        aria-selected="false"
                      >
                        MOR
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        data-bs-toggle="pill"
                        data-bs-target="#mor-approval-create"
                        type="button"
                        role="tab"
                        aria-controls="mor-approval-create"
                        aria-selected="true"
                      >
                        MTO Creation
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
                        MTO Approval
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
                        PO
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
                        className="nav-link"
                        id="pills-contact-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-contact"
                        type="button"
                        role="tab"
                        aria-controls="pills-contact"
                        aria-selected="false"
                      >
                        Material Issued
                      </button>
                    </li>

                    <li className="nav-item" role="presentation" />
                  </ul>
                </div>

                <div className="card  ms-3">
                  <div className="card-header">
                    <h3 className="card-title">Po Type</h3>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {/* <div className="col-md-2">



                      <div className="form-group"> */}

                      {/* <div className="form-check">



                          <input



                            className="form-check-input"



                            type="radio"



                            name="contentSelector"



                            defaultValue="content1"



                            defaultChecked=""



                          />



                          <label className="form-check-label">Domestic</label>



                        </div> */}

                      {/* </div>



                    </div> */}

                      {/* <div className="col-md-2">



                      <div className="form-group"> */}

                      {/* <div className="form-check">



                          <input



                            className="form-check-input"



                            type="radio"



                            name="contentSelector"



                            defaultValue="content2"



                          />



                          <label className="form-check-label">Import</label>



                        </div> */}

                      {/* </div> */}

                      {/* </div> */}

                      <div className="col-md-2">
                        <div className="form-group">
                          <div className="form-check">
                            <input
                              className="form-check-input "
                              type="radio"
                              name="contentSelector"
                              defaultValue="content3"
                              checked
                            />

                            <label className="form-check-label">IMPORT</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="card ms-3">
                  <div className="card-body">
                    <div className=" text-center">
                      <h4>PO for New Material (ROPO Import)</h4>
                    </div>

                    <section className="mor p-2 pt-2">
                      <div className="container-fluid">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className={`nav-link ${
                                activeTab === "po-details" ? "active" : ""
                              }`}
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic1"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected={activeTab === "po-details"}
                              onClick={() => handleTabChange("po-details")}
                            >
                              PO Details
                            </button>

                            <button
                              className={`nav-link ${
                                activeTab === "rate-taxes" ? "active" : ""
                              }`}
                              id="nav-profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic2"
                              type="button"
                              role="tab"
                              aria-controls="nav-profile"
                              aria-selected={activeTab === "rate-taxes"}
                              onClick={() => handleTabChange("rate-taxes")}
                            >
                              Rate &amp; Taxes
                            </button>

                            <button
                              className={`nav-link ${
                                activeTab === "terms-conditions" ? "active" : ""
                              }`}
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic3"
                              type="button"
                              role="tab"
                              aria-controls="nav-contact"
                              aria-selected={activeTab === "terms-conditions"}
                              onClick={() =>
                                handleTabChange("terms-conditions")
                              }
                            >
                              Term &amp; Conditions
                            </button>
                          </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className={`tab-pane fade ${
                              activeTab === "po-details" ? "show active" : ""
                            }`}
                            id="Domestic1"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            tabIndex={0}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label>
                                      Company <span>*</span>
                                    </label>

                                    <SingleSelector
                                      options={companyOptions}
                                      onChange={handleCompanyChange}
                                      value={selectedCompany}
                                      placeholder={`Select Company`} // Dynamic placeholder
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      PO Type <span>*</span>
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      value="IMPORT"
                                      disabled
                                      style={{
                                        backgroundColor: "#f8f9fa",

                                        cursor: "not-allowed",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      PO Date <span>*</span>
                                    </label>

                                    <input
                                      className="form-control"
                                      type="date"
                                      value={poDate}
                                      onChange={(e) => {
                                        const selectedDate = new Date(
                                          e.target.value
                                        );

                                        const today = new Date();

                                        today.setHours(0, 0, 0, 0);

                                        if (selectedDate < today) {
                                          toast.error(
                                            "PO Date cannot be in the past. Please select today's date or a future date."
                                          );

                                          return;
                                        }

                                        setPoDate(e.target.value);
                                      }}
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Created On
                                    </label>

                                    <input
                                      className="form-control"
                                      type="date"
                                      value={createdOn}
                                      disabled
                                    />
                                  </div>
                                </div>

                        

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Supplier <span>*</span>
                                    </label>

                                    <SingleSelector
                                      options={supplierOptions}
                                      value={selectedSupplier}
                                      onChange={handleSupplierChange}
                                      placeholder="Select Supplier"
                                    />
                                  </div>
                                </div>

                              

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Vendor GSTIN
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      value={vendorGstin}
                                      // placeholder="GSTIN"

                                      readOnly
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Branch
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      // placeholder="Site"

                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      PO Currency  <span>*</span>
                                    </label>

                                    <SingleSelector
                                      options={currencyOptionsWithPlaceholder}
                                      value={selectedCurrency ? currencyOptionsWithPlaceholder.find((o) => o.value === selectedCurrency.code) : null}
                                      onChange={handleCurrencyChange}
                                      placeholder="Select Currency"
                                      isClearable={true}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      {`Conversion Rate (${poCurrencyCode} to INR)`}  <span>*</span>
                                    </label>

                                    <input
                                      className="form-control"
                                      type="number"
                                      value={conversionRate ?? ""}
                                      onChange={(e) => {
                                        if (e.target.value === "") {
                                          setConversionRate("");

                                          return;
                                        }

                                        const value = parseFloat(
                                          e.target.value
                                        );

                                        if (
                                          !Number.isFinite(value) ||
                                          value <= 0
                                        ) {
                                          toast.error(
                                            "Conversion rate must be greater than 0."
                                          );

                                          return;
                                        }

                                        setConversionRate(value);
                                      }}
                                      placeholder="Enter conversion rate"
                                      step="0.01"
                                      min="0.01"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between  align-items-center">
                              <h5
                                className=" ms-2"
                                data-bs-toggle="modal"
                                data-bs-target="#sereneModal"
                              >
                                Material Details
                              </h5>

                              <div className="me-4">
                                <button
                                  className="purple-btn2 "
                                  onClick={() => {
                                    if (!selectedCompany?.value) {
                                      toast.error("Please select a company first.");

                                      return;
                                    }

                                    setAddMORModal(true);

                                    fetchMaterialDetails();
                                  }}
                                >
                                  <span> + Add MOR</span>
                                </button>
                              </div>
                            </div>

                            <div className="mx-3">
                              <div
                                className="tbl-container mt-1"
                                style={{ maxHeight: "600px" }}
                              >
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th className="text-start">Sr. No</th>

                                      <th className="text-start">Project</th>

                                      <th className="text-start">
                                        Sub-Project
                                      </th>

                                      <th className="text-start">MOR No.</th>

                                      <th className="text-start">Material</th>

                                      <th className="text-start">UOM</th>

                                      <th className="text-start">MOR Qty</th>

                                      <th className="text-start">Order Qty</th>

                                      <th className="text-start">Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {submittedMaterials.length > 0 ? (
                                      submittedMaterials.map((row, index) => (
                                        <tr key={index}>
                                          <td className="text-start">
                                            {index + 1}
                                          </td>

                                          <td className="text-start">
                                            {row.project_name || ""}
                                          </td>

                                          <td className="text-start">
                                            {row.sub_project_name || ""}
                                          </td>

                                          <td className="text-start">
                                            {row.mor_number || ""}
                                          </td>

                                          <td className="text-start">
                                            {row.material_name ||
                                              row.material?.material_name ||
                                              ""}
                                          </td>

                                          <td className="text-start">
                                            {row.uom_name || ""}
                                          </td>

                                          <td className="text-start">
                                            {row.required_quantity ?? ""}
                                          </td>

                                          <td className="text-start">
                                            {row.order_qty ?? ""}
                                          </td>

                                          <td className="text-start">
                                            {row.material?.isedit === true && (
                                              <button
                                                className="btn mt-0 pt-0"
                                                onClick={() => {
                                                  setSubmittedMaterials(
                                                    (prev) =>
                                                      prev.filter(
                                                        (_, i) => i !== index
                                                      )
                                                  );

                                                  // Refresh delivery schedules after removing material

                                                  setTimeout(() => {
                                                    fetchDeliverySchedules();
                                                  }, 100);
                                                }}
                                              >
                                                <svg
                                                  width="16"
                                                  height="20"
                                                  viewBox="0 0 16 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533H7.52531V16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                    fill="#B25657"
                                                  />
                                                </svg>
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="9" className="text-center">
                                          No data added yet.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Submit Button */}

                            <div className="d-flex justify-content-center mt-4 mb-3">
                              <button
                                className="purple-btn2 px-4 py-2"
                                onClick={() => {
                                  if (
                                    !submittedMaterials ||
                                    submittedMaterials.length === 0
                                  ) {
                                    toast.error(
                                      "Please add at least one material before proceeding to Rate & Taxes."
                                    );

                                    return;
                                  }

                                  setActiveTab("rate-taxes");

                                  const rateTaxesTab = document.querySelector(
                                    '[data-bs-target="#Domestic2"]'
                                  );

                                  if (rateTaxesTab) rateTaxesTab.click();
                                }}
                                disabled={false}
                              >
                                Update
                              </button>
                            </div>
                          </div>

                          <div
                            className={`tab-pane fade ${
                              activeTab === "rate-taxes" ? "show active" : ""
                            }`}
                            id="Domestic2"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                            tabIndex={0}
                          >
                            {/* <div className=" mt-3">



                              <h5 className=" ">Quotation Details</h5>



                            </div>



                            <div className="tbl-container me-2 mt-3">



                              <table className="w-100">



                                <thead>



                                  <tr>



                                    <th>Quotation No.</th>



                                    <th>Supplier Ref. No</th>



                                    <th>Material</th>



                                    <th>Brand</th>



                                    <th>UOM</th>



                                    <th>All Incl. Rate</th>



                                  </tr>



                                </thead>



                                <tbody>



                                  <tr>



                                    <td className="text-decoration-underline">



                                      Quotation 9655295



                                    </td>



                                    <td>65985</td>



                                    <td>Plain White Sperenza Tiles</td>



                                    <td>Sperenza</td>



                                    <td>Nos</td>



                                    <td>600</td>



                                  </tr>



                                </tbody>



                              </table>



                            </div> */}

                            <div className=" ">
                              <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                            </div>

                            <div className="tbl-container me-2 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th>Sr. No</th>

                                    <th style={{ minWidth: "220px" }}>
                                      Material
                                    </th>

                                    <th>UOM</th>

                                    <th>PO Qty</th>

                                    <th>Adjusted Qty</th>

                                    <th>Tolerance Qty</th>

                                    <th style={{ minWidth: "160px" }}>
                                      Material Rate
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      Material Cost
                                    </th>

                                    <th>Discount(%)</th>

                                    <th style={{ minWidth: "160px" }}>
                                      Discount Rate
                                    </th>

                                    <th style={{ minWidth: "180px" }}>
                                      After Discount Value
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      Tax Addition
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      Tax Deduction
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      Total Charges
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      Total Base Cost
                                    </th>

                                    <th style={{ minWidth: "160px" }}>
                                      All Incl. Cost
                                    </th>

                                    <th style={{ minWidth: "120px" }}>
                                      Select Tax
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {submittedMaterials.length > 0 ? (
                                    submittedMaterials.map(
                                      (material, index) => {
                                        const calculatedValues =
                                          materialCalculatedValues[
                                            material.id
                                          ] || {};

                                        const rateRow =
                                          taxRateData[index] || {};

                                        const totalCharges = (
                                          (parseFloat(
                                            calculatedValues.otherAddition
                                          ) || 0) -
                                          (parseFloat(
                                            calculatedValues.otherDeductions
                                          ) || 0)
                                        ).toFixed(2);

                                        return (
                                          <tr key={material.id}>
                                            <td>{index + 1}</td>

                                            <td>
                                              {material.material_name ||
                                                material.material
                                                  ?.material_name ||
                                                ""}
                                            </td>

                                            <td>{material.uom_name}</td>

                                            <td>{material.order_qty || ""}</td>

                                            <td>
                                              {material.adjusted_qty ?? ""}
                                            </td>

                                            <td>
                                              {material.tolerance_qty ?? ""}
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.ratePerNos || 0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    rateRow.ratePerNos || 0,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.materialCost || 0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    rateRow.materialCost || 0,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {parseFloat(
                                                rateRow.discount || 0
                                              ).toFixed(2)}
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.discountRate || 0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    rateRow.discountRate || 0,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.afterDiscountValue || 0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    rateRow.afterDiscountValue ||
                                                      0,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {calculatedValues.taxAddition?.toFixed(
                                                2
                                              ) || "0.00"}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const usd = parseFloat(
                                                  calculatedValues.taxAddition ||
                                                    0
                                                );

                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    usd,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {calculatedValues.taxDeductions?.toFixed(
                                                2
                                              ) || "0.00"}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const usd = parseFloat(
                                                  calculatedValues.taxDeductions ||
                                                    0
                                                );

                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    usd,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode} {totalCharges}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const usd =
                                                  parseFloat(totalCharges) || 0;

                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    usd,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.afterDiscountValue || 0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    rateRow.afterDiscountValue ||
                                                      0,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td>
                                              {poCurrencyCode}{" "}
                                              {parseFloat(
                                                rateRow.netCost ||
                                                  rateRow.total_material_cost ||
                                                  0
                                              ).toFixed(2)}{" "}
                                              (INR{" "}
                                              {(() => {
                                                const usd =
                                                  parseFloat(
                                                    rateRow.netCost ||
                                                      rateRow.total_material_cost ||
                                                      0
                                                  ) || 0;

                                                const inr = parseFloat(
                                                  convertUsdToInr(
                                                    usd,

                                                    conversionRate
                                                  )
                                                );

                                                return isNaN(inr)
                                                  ? "0.00"
                                                  : inr.toFixed(2);
                                              })()}
                                              )
                                            </td>

                                            <td
                                              className="text-decoration-underline"
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                handleOpenTaxModal(index)
                                              }
                                            >
                                              select
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan="17" className="text-center">
                                        No materials added yet.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <div className=" ">
                              <h5 className=" mt-3">
                                Tax &amp; Charges Summary
                              </h5>
                            </div>

                            <div className="tbl-container me-2 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Tax / Charge Type</th>

                                    <th colSpan={2}>Amount</th>
                                  </tr>

                                  <tr>
                                    <th>INR</th>

                                    <th>{poCurrencyCode}</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td>Total Base Cost</td>

                                    <td>
                                      {taxSummary?.total_base_cost_in_inr ||
                                        "0"}
                                    </td>

                                    <td>
                                      {taxSummary?.total_base_cost || "0"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>Total Tax</td>

                                    <td>
                                      {taxSummary?.total_tax_in_inr || "0"}
                                    </td>

                                    <td>{taxSummary?.total_tax || "0"}</td>
                                  </tr>

                                  <tr>
                                    <td>Total Charge</td>

                                    <td>
                                      {taxSummary?.total_charge_in_inr || "0"}
                                    </td>

                                    <td>{taxSummary?.total_charge || "0"}</td>
                                  </tr>

                                  <tr>
                                    <td className="fw-bold">
                                      Total All Incl. Cost
                                    </td>

                                    <td className="fw-bold">
                                      {taxSummary?.total_inclusive_cost_in_inr ||
                                        "0"}
                                    </td>

                                    <td className="fw-bold">
                                      {taxSummary?.total_inclusive_cost || "0"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Tax Addition and Charges Tables */}

                            <div className="tbl-container me-2 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th style={{ width: "200px" }} rowSpan={2}>
                                      Charges And Taxes
                                    </th>

                                    <th style={{ width: "200px" }} colSpan={2}>
                                      Amount
                                    </th>

                                    {/* <th rowSpan={2}>Payable Currency</th> */}

                                    <th style={{ width: "100px" }} rowSpan={2}>
                                      Service Certificate
                                    </th>

                                    <th style={{ width: "180px" }} rowSpan={2}>
                                      Select Service Provider
                                    </th>

                                    <th style={{ width: "120px" }} rowSpan={2}>
                                      Remarks
                                    </th>

                                    <th style={{ width: "150px" }} rowSpan={2}>
                                      Service Certificate Advance Allowed (%)
                                    </th>

                                    <th style={{ width: "150px" }} rowSpan={2}>
                                      Service Certificate Advance Amount
                                    </th>
                                  </tr>

                                  <tr>
                                    <th style={{ width: "100px" }}>INR</th>

                                    <th style={{ width: "100px" }}>
                                      {poCurrencyCode}
                                    </th>
                                  </tr>

                                  <tr>
                                    <th colSpan={8}>Tax Addition(Exclusive)</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {loadingCharges ? (
                                    <tr>
                                      <td colSpan={8} className="text-center">
                                        <div
                                          className="spinner-border spinner-border-sm me-2"
                                          role="status"
                                        >
                                          <span className="visually-hidden">
                                            Loading...
                                          </span>
                                        </div>
                                        Loading charges data...
                                      </td>
                                    </tr>
                                  ) : chargesFromApi.filter(
                                      (charge) =>
                                        charge.resource_type === "TaxCategory"
                                    ).length > 0 ? (
                                    chargesFromApi

                                      .filter(
                                        (charge) =>
                                          charge.resource_type === "TaxCategory"
                                      )

                                      .map((charge, index) => (
                                        <tr key={`tax-${charge.id}-${index}`}>
                                          <td>{charge.charge_name}</td>

                                          <td>
                                            INR {charge.amount_inr || "0.00"}
                                          </td>

                                          <td>
                                            {poCurrencyCode}{" "}
                                            {charge.amount || "0.00"}
                                          </td>

                                          <td>{poCurrencyCode}</td>

                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                serviceCertificates[
                                                  charge.id
                                                ] || false
                                              }
                                              onChange={(e) =>
                                                handleServiceCertificateChange(
                                                  charge.id,

                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </td>

                                          <td>
                                            <SingleSelector
                                              options={supplierOptions}
                                              value={
                                                selectedServiceProviders[
                                                  charge.id
                                                ] || null
                                              }
                                              onChange={(selectedOption) =>
                                                handleServiceProviderChange(
                                                  charge.id,

                                                  selectedOption
                                                )
                                              }
                                              placeholder="Select Service Provider"
                                            />
                                          </td>

                                          <td>
                                            <textarea
                                              className="form-control"
                                              rows={2}
                                              placeholder="Enter remarks"
                                              value={
                                                chargeRemarks[charge.id] || ""
                                              }
                                              onChange={(e) =>
                                                handleChargeRemarksChange(
                                                  charge.id,

                                                  e.target.value
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan={8} className="text-center">
                                        No Records Found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className="tbl-container me-2 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-center" colSpan={8}>Charges (Exclusive)</th>
                                  </tr>

                                  <tr>
                                    {/* <th style={{ width: "200px" }}>
                                      Charge Name
                                    </th>

                                    <th style={{ width: "120px" }}>
                                      Amount (INR)
                                    </th>

                                    <th style={{ width: "120px" }}>
                                      Amount ({poCurrencyCode})
                                    </th>

                                    <th style={{ width: "100px" }}>
                                      Service Certificate
                                    </th>

                                    <th style={{ width: "180px" }}>
                                      Service Provider
                                    </th>

                                    <th style={{ width: "120px" }}>Remarks</th>

                                    <th style={{ width: "150px" }}>
                                      Service Certificate Advance Allowed (%)
                                    </th>

                                    <th style={{ width: "150px" }}>
                                      Service Certificate Advance Amount
                                    </th> */}
                                  </tr>
                                </thead>

                                <tbody>
                                  {loadingCharges ? (
                                    <tr>
                                      <td colSpan={8} className="text-center">
                                        <div
                                          className="spinner-border spinner-border-sm me-2"
                                          role="status"
                                        >
                                          <span className="visually-hidden">
                                            Loading...
                                          </span>
                                        </div>
                                        Loading charges data...
                                      </td>
                                    </tr>
                                  ) : getConsolidatedCharges().length > 0 ? (
                                    getConsolidatedCharges().map(
                                      (consolidatedCharge, index) => (
                                        <tr key={`consolidated-${index}`}>
                                          <td style={{ width: "200px" }}>
                                            {consolidatedCharge.charge_name}
                                          </td>

                                          <td style={{ width: "100px" }}>
                                            INR{" "}
                                            {consolidatedCharge.total_amount_inr.toFixed(
                                              2
                                            )}
                                          </td>

                                          <td style={{ width: "100px" }}>
                                            {poCurrencyCode}{" "}
                                            {consolidatedCharge.total_amount_usd.toFixed(
                                              2
                                            )}
                                          </td>

                                          <td style={{ width: "100px" }}>
                                            <input
                                              type="checkbox"
                                              checked={
                                                consolidatedCharge.charge_ids.every(
                                                  (id) =>
                                                    serviceCertificates[id]
                                                ) || false
                                              }
                                              onChange={(e) => {
                                                // Update all related charges

                                                consolidatedCharge.charge_ids.forEach(
                                                  (id) => {
                                                    handleServiceCertificateChange(
                                                      id,

                                                      e.target.checked
                                                    );
                                                  }
                                                );
                                              }}
                                            />
                                          </td>

                                          <td style={{ width: "180px" }}>
                                            <SingleSelector
                                              // options={supplierOptions}
                                              options={serviceProviderOptions}
                                              value={
                                                selectedServiceProviders[
                                                  consolidatedCharge
                                                    .charge_ids[0]
                                                ] || null
                                              }
                                              onChange={(selectedOption) => {
                                                // Update all related charges with same service provider

                                                consolidatedCharge.charge_ids.forEach(
                                                  (id) => {
                                                    handleServiceProviderChange(
                                                      id,

                                                      selectedOption
                                                    );
                                                  }
                                                );
                                              }}
                                              placeholder="Select Service Provider"
                                            />
                                          </td>

                                          <td style={{ width: "120px" }}>
                                            <textarea
                                              className="form-control"
                                              rows={2}
                                              placeholder="Enter remarks"
                                              value={
                                                chargeRemarks[
                                                  consolidatedCharge
                                                    .charge_ids[0]
                                                ] || ""
                                              }
                                              onChange={(e) => {
                                                // Update all related charges with same remarks

                                                consolidatedCharge.charge_ids.forEach(
                                                  (id) => {
                                                    handleChargeRemarksChange(
                                                      id,

                                                      e.target.value
                                                    );
                                                  }
                                                );
                                              }}
                                            />
                                          </td>

                                          <td style={{ width: "150px" }}>
                                            <input
                                              type="number"
                                              className="form-control"
                                              value={
                                                serviceCertAdvancePercentByRow[
                                                  index
                                                ] || ""
                                              }
                                              onChange={(e) =>
                                                handleServiceCertAdvancePercentChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Enter %"
                                              min="0"
                                              max="100"
                                              step="0.01"
                                            />
                                          </td>

                                          <td style={{ width: "150px" }}>
                                            {(() => {
                                              const percent =
                                                parseFloat(
                                                  serviceCertAdvancePercentByRow[
                                                    index
                                                  ] || 0
                                                ) || 0;

                                              const usd =
                                                ((parseFloat(
                                                  consolidatedCharge.total_amount_usd
                                                ) || 0) *
                                                  percent) /
                                                100;

                                              const inr = safeConvertUsdToInr(
                                                usd,
                                                conversionRate
                                              );

                                              const inrNum =
                                                parseFloat(inr) || 0;

                                              return (
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  disabled
                                                  value={`${poCurrencyCode} ${usd.toFixed(
                                                    2
                                                  )} (INR ${inrNum.toFixed(
                                                    2
                                                  )})`}
                                                  placeholder={`${poCurrencyCode} 0.00 (INR 0.00)`}
                                                />
                                              );
                                            })()}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={8} className="text-center">
                                        No Records Found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Summary Section

                            {/* Charges Section */}

                            {/* <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Charges</h5>

                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    className="btn purple-btn2"
                                    onClick={addCharge}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-plus"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                    </svg>
                                    Add
                                  </button>
                                </div>
                              </div>

                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Charge Name</th>

                                      <th>Amount</th>

                                      <th>Realised Amount</th>

                                      <th>Taxes</th>

                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {charges.map((charge) => (
                                      <tr key={charge.id}>
                                        <td>
                                          <select
                                            className="form-control form-select mySelect"
                                            value={charge.charge_name}
                                            onChange={(e) =>
                                              handleChargeChange(
                                                charge.id,

                                                "charge_name",

                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select Type
                                            </option>

                                            {chargeNames.map((chargeName) => (
                                              <option
                                                key={chargeName.id}
                                                value={chargeName.name}
                                              >
                                                {chargeName.name}
                                              </option>
                                            ))}
                                          </select>
                                        </td>

                                        <td>
                                          <input
                                            type="number"
                                            className="form-control forname-control decimal-input"
                                            value={charge.amount}
                                            onChange={(e) =>
                                              handleChargeChange(
                                                charge.id,

                                                "amount",

                                                e.target.value
                                              )
                                            }
                                            placeholder="Enter amount"
                                            required
                                          />
                                        </td>

                                        <td>
                                          <input
                                            type="number"
                                            className="form-control forname-control decimal-input"
                                            value={charge.realised_amount}
                                            disabled
                                            placeholder="Auto-calculated"
                                          />
                                        </td>

                                        <td>
                                          <button
                                            type="button"
                                            className="btn btn-info chargeButton"
                                            onClick={() =>
                                              handleOpenTaxesModal(
                                                charge.id,

                                                "charge"
                                              )
                                            }
                                          >
                                            Taxes
                                          </button>
                                        </td>

                                        <td>
                                          <button
                                            type="button"
                                            className="btn btn-link text-danger remove-cost-row"
                                            onClick={() =>
                                              removeCharge(charge.id)
                                            }
                                          >
                                            <span className="material-symbols-outlined">
                                              cancel
                                            </span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div> */}

                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Other Cost</h5>

                                <button
                                  type="button"
                                  className="btn purple-btn2"
                                  onClick={addCost}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-plus"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                  </svg>
                                  Add
                                </button>
                              </div>

                              {/* {charges.length > 0 && ( */}

                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>
                                        Transportation, Loading & Unloading
                                        Details
                                      </th>

                                      <th>Cost</th>

                                      <th>Scope</th>

                                      <th>Taxes</th>

                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {otherCosts.map((cost) => (
                                      <tr key={cost.id}>
                                        <td>
                                          <select
                                            className="form-control form-select mySelect"
                                            value={cost.cost_name}
                                            onChange={(e) =>
                                              handleCostChange(
                                                cost.id,

                                                "cost_name",

                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select Type
                                            </option>

                                            <option value="Transportation">
                                              Transportation
                                            </option>

                                            <option value="Loading">
                                              Loading
                                            </option>

                                            <option value="Unloading">
                                              Unloading
                                            </option>
                                          </select>
                                        </td>

                                        <td>
                                          <input
                                            type="number"
                                            className="form-control forname-control decimal-input"
                                            value={cost.amount}
                                            onChange={(e) =>
                                              handleCostChange(
                                                cost.id,

                                                "amount",

                                                e.target.value
                                              )
                                            }
                                            placeholder="Enter amount"
                                            required
                                          />
                                        </td>

                                        <td>
                                          <select
                                            className="form-control form-select mySelect"
                                            value={cost.scope}
                                            onChange={(e) =>
                                              handleCostChange(
                                                cost.id,

                                                "scope",

                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select Scope
                                            </option>

                                            <option value="By Vendor">
                                              By Vendor
                                            </option>

                                            <option value="By Marathon">
                                              By Marathon
                                            </option>
                                          </select>
                                        </td>

                                        <td>
                                          <button
                                            type="button"
                                            className="btn btn-info chargeButton"
                                            onClick={() =>
                                              handleOpenTaxesModal(
                                                cost.id,

                                                "cost"
                                              )
                                            }
                                          >
                                            Add Taxes and Charges
                                          </button>
                                        </td>

                                        <td>
                                          <button
                                            type="button"
                                            className="btn btn-link text-danger remove-cost-row"
                                            onClick={() => removeCost(cost.id)}
                                          >
                                            <span className="material-symbols-outlined">
                                              cancel
                                            </span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* )} */}

                              {/* Update Button */}

                              <div className="d-flex justify-content-center mt-3">
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    setActiveTab("terms-conditions")
                                  }
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`tab-pane fade ${
                              activeTab === "terms-conditions"
                                ? "show active"
                                : ""
                            }`}
                            id="Domestic3"
                            role="tabpanel"
                            aria-labelledby="nav-contact-tab"
                            tabIndex={0}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6 mt-0">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Credit Period (Days)
                                    </label>

                                    <input
                                      className="form-control"
                                      type="number"
                                      value={termsFormData.creditPeriod}
                                      onChange={(e) =>
                                        handleTermsFormChange(
                                          "creditPeriod",

                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter credit period"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 mt-0">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      P.O Validity Period (Days)
                                    </label>

                                    <input
                                      className="form-control"
                                      type="number"
                                      value={termsFormData.poValidityPeriod}
                                      onChange={(e) =>
                                        handleTermsFormChange(
                                          "poValidityPeriod",

                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter validity period"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Advance Reminder Duration (Days)
                                    </label>

                                    <input
                                      className="form-control"
                                      type="number"
                                      value={
                                        termsFormData.advanceReminderDuration
                                      }
                                      onChange={(e) =>
                                        handleTermsFormChange(
                                          "advanceReminderDuration",

                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter reminder duration"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card-body pt-1">
                              <div className="row">
                                <div className="mb-3 w-50">
                                  <label
                                    htmlFor="exampleFormControlTextarea1"
                                    className="form-label po-fontBoldM"
                                  >
                                    Payment Terms
                                  </label>

                                  <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    value={termsFormData.paymentTerms}
                                    onChange={(e) =>
                                      handleTermsFormChange(
                                        "paymentTerms",

                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter payment terms"
                                  />
                                </div>

                                <div className="mb-3 w-50">
                                  <label
                                    htmlFor="exampleFormControlTextarea1"
                                    className="form-label po-fontBoldM"
                                  >
                                    Payment Remarks
                                  </label>

                                  <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    value={termsFormData.paymentRemarks}
                                    onChange={(e) =>
                                      handleTermsFormChange(
                                        "paymentRemarks",

                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter payment remarks"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div className="tbl-container me-2 mt-3">



                              <table className="w-100">



                                <thead>



                                  <tr>



                                    <th>Charges And Taxes</th>



                                    <th>Amount</th>



                                    <th>Payable Currency</th>



                                    <th>Service Certificate</th>



                                    <th>Select Service Provider</th>



                                    <th>Remarks</th>



                                  </tr>



                                  <tr>



                                    <th colSpan={6}>Tax Addition(Exclusive)</th>



                                  </tr>



                                </thead>



                                <tbody>



                                  <tr>



                                  

                                  

                                    <td>CGST</td>



                                    <td colSpan={2}>INR 0.00</td>



                                    <td>



                                      <input type="checkbox" />



                                    </td>



                                    <td colSpan={2}>



                                      <textarea



                                        className="form-control"



                                        id="exampleFormControlTextarea1"



                                        rows={2}



                                        defaultValue={""}



                                      />



                                    </td>



                                  </tr>



                                  <tr>



                                    <td>SGST</td>



                                    <td colSpan={2}>INR 0.00</td>



                                    <td>



                                      <input type="checkbox" />



                                    </td>



                                    <td colSpan={2}>



                                      <textarea



                                        className="form-control"



                                        id="exampleFormControlTextarea1"



                                        rows={2}



                                        defaultValue={""}



                                      />



                                    </td>



                                  </tr>



                                </tbody>



                              </table>



                            </div> */}

                            {/* <div className="tbl-container me-2 mt-3">



                              <table className="w-100">



                                <thead>



                                  <tr>



                                    <th colSpan={6}>Charges (Exclusive)</th>



                                  </tr>



                                </thead>



                                <tbody>



                                  <tr>



                                    <td>OTHER CHARGES </td>



                                    <td colSpan={2}>INR 0.00</td>



                                    <td>



                                      <input type="checkbox" />



                                    </td>



                                    <td colSpan={2}>



                                      <textarea



                                        className="form-control"



                                        id="exampleFormControlTextarea1"



                                        rows={2}



                                        defaultValue={""}



                                      />



                                    </td>



                                  </tr>



                                </tbody>



                              </table>



                            </div> */}

                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6 mt-0">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Total PO Value
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      value={`${poCurrencyCode} ${totalMaterialCost.toFixed(
                                        2
                                      )} (INR ${convertUsdToInr(
                                        totalMaterialCost,

                                        conversionRate
                                      )})`}
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 mt-0">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Supplier Advance Allowed (%)
                                    </label>

                                    <input
                                      className="form-control"
                                      type="number"
                                      value={supplierAdvancePercentage}
                                      onChange={(e) =>
                                        handleSupplierAdvancePercentageChange(
                                          e.target.value
                                        )
                                      }
                                      placeholder="0"
                                      min="0"
                                      max="100"
                                      step="0.01"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Total Discount
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      value={`${poCurrencyCode} ${calculateTotalDiscountAmount().toFixed(
                                        2
                                      )} (INR ${convertUsdToInr(
                                        calculateTotalDiscountAmount(),

                                        conversionRate
                                      )})`}
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Supplier Advance Amount
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      value={`${poCurrencyCode} ${calculateSupplierAdvanceAmount().toFixed(
                                        2
                                      )} (INR ${convertUsdToInr(
                                        calculateSupplierAdvanceAmount(),

                                        conversionRate
                                      )})`}
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 mt-2">
                                  <div className="form-group">

                                    <label className="po-fontBold">

                                      Total Payable To Suplier

                                    </label>

                                    <input

                                      className="form-control"

                                      type="text"

                                      value={`${poCurrencyCode} ${(
                                        parseFloat(formData.payableToSupplier || 0)
                                      ).toFixed(2)} (INR ${Number(
                                        safeConvertUsdToInr(
                                          parseFloat(formData.payableToSupplier || 0),
                                          conversionRate
                                        ) || 0
                                      ).toFixed(2)})`}

                                      disabled

                                    />

                                  </div>

                                </div> 

                                {/* <div className="col-md-6 mt-2">

                                  <div className="form-group">

                                    <label className="po-fontBold">

                                      Service Certificate Advance Allowed (%)

                                    </label>



                                    <input

                                      className="form-control"

                                      type="number"

                                      value={

                                        serviceCertificateAdvancePercentage

                                      }

                                      onChange={(e) =>

                                        handleServiceCertificateAdvancePercentageChange(

                                          e.target.value

                                        )

                                      }

                                      placeholder="0"

                                      min="0"

                                      max="100"

                                      step="0.01"

                                    />

                                  </div>

                                </div> */}

                                {/* <div className="col-md-6 mt-2">

                                  <div className="form-group">

                                    <label className="po-fontBold">

                                      Service Certificate Advance Amount

                                    </label>



                                    <input

                                      className="form-control"

                                      type="text"

                                      value={`${poCurrencyCode} ${calculateServiceCertificateAdvanceAmount().toFixed(

                                        2

                                      )} (INR ${convertUsdToInr(

                                        calculateServiceCertificateAdvanceAmount(),



                                        conversionRate

                                      )})`}

                                      disabled

                                    />

                                  </div>

                                </div> */}
                              </div>
                            </div>

                            {/* <div className="mt-3 d-flex justify-content-between align-items-center">



                            <h5 className=" mt-3">Advance Payment Schedule</h5>



                            <button className="purple-btn2"> Add</button>



                          </div>



                          <div className="tbl-container me-2 mt-2">



                            <table className="w-100">



                              <thead>



                                <tr>



                                  <th>Payment Date</th>



                                  <th>Payment %age</th>



                                  <th>Payment Amount</th>



                                  <th>Remark</th>



                                </tr>



                              </thead>



                              <tbody>



                                <tr>



                                  <td>05-03-2024</td>



                                  <td>40</td>



                                  <td />



                                  <td />



                                </tr>



                              </tbody>



                            </table>
                          </div> */}

                            <div className="mt-3 d-flex justify-content-between align-items-center">
                              <h5 className=" mt-3">Delivery Schedule</h5>
                            </div>

                            <div className="tbl-container me-2 mt-2">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th>MOR No.</th>

                                    <th>Material</th>

                                    <th>MOR Delivery Schedule</th>

                                    <th>PO Delivery Date</th>

                                    <th>Sch. Delivery Qty</th>

                                    <th>PO Delivery Qty</th>

                                    <th>Delivery Address</th>

                                    <th>Store Name</th>

                                    <th>Remarks</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {deliverySchedules &&
                                  deliverySchedules.length > 0 ? (
                                    deliverySchedules.map((schedule, index) => (
                                      <tr key={schedule.id || index}>
                                        <td>{schedule.mor_number || "-"}</td>

                                        <td>
                                          {schedule.material ||
                                            schedule.material_formatted_name ||
                                            "-"}
                                        </td>

                                        <td>
                                          {schedule.mor_delivery_schedule ||
                                            (schedule.expected_date
                                              ? new Date(
                                                  schedule.expected_date
                                                ).toLocaleDateString()
                                              : "-")}
                                        </td>

                                        <td>
                                          {(() => {
                                            const expectedStr =
                                              schedule.expected_date ||
                                              schedule.mor_delivery_schedule
                                                ? (() => {
                                                    const dateStr =
                                                      schedule.expected_date ||
                                                      schedule.mor_delivery_schedule;

                                                    if (dateStr.includes("/")) {
                                                      const [day, month, year] =
                                                        dateStr.split("/");

                                                      return `${year}-${month.padStart(
                                                        2,
                                                        "0"
                                                      )}-${day.padStart(
                                                        2,
                                                        "0"
                                                      )}`;
                                                    }

                                                    return new Date(dateStr)
                                                      .toISOString()
                                                      .split("T")[0];
                                                  })()
                                                : "";

                                            const maxStr = (() => {
                                              const dateStr =
                                                schedule.expected_date ||
                                                schedule.mor_delivery_schedule;

                                              if (!dateStr) return "";

                                              let d;

                                              if (dateStr.includes("/")) {
                                                const [day, month, year] =
                                                  dateStr.split("/");

                                                d = new Date(
                                                  year,
                                                  month - 1,
                                                  day
                                                );
                                              } else {
                                                d = new Date(dateStr);
                                              }

                                              d.setFullYear(
                                                d.getFullYear() + 1
                                              );

                                              return d
                                                .toISOString()
                                                .split("T")[0];
                                            })();

                                            const valueStr =
                                              schedule.po_delivery_date
                                                ? (() => {
                                                    // Handle both "06/09/2025" and "2025-09-06" formats

                                                    if (
                                                      schedule.po_delivery_date.includes(
                                                        "/"
                                                      )
                                                    ) {
                                                      const [day, month, year] =
                                                        schedule.po_delivery_date.split(
                                                          "/"
                                                        );

                                                      return `${year}-${month.padStart(
                                                        2,
                                                        "0"
                                                      )}-${day.padStart(
                                                        2,
                                                        "0"
                                                      )}`;
                                                    }

                                                    return new Date(
                                                      schedule.po_delivery_date
                                                    )
                                                      .toISOString()
                                                      .split("T")[0];
                                                  })()
                                                : "";

                                            return (
                                              <input
                                                type="date"
                                                className="form-control"
                                                value={valueStr}
                                                min={expectedStr || undefined}
                                                max={maxStr || undefined}
                                                onChange={(e) =>
                                                  handleScheduleDateChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            );
                                          })()}
                                        </td>

                                        <td>
                                          {schedule.sch_delivery_qty ||
                                            schedule.expected_quantity ||
                                            "-"}
                                        </td>

                                        <td>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={
                                              schedule.po_delivery_qty ?? ""
                                            }
                                            onChange={(e) =>
                                              handleSchedulePoQtyChange(
                                                index,
                                                e.target.value
                                              )
                                            }
                                            min="0"
                                            step="0.01"
                                          />
                                        </td>

                                        <td>
                                          {schedule.delivery_address ||
                                            schedule.store_address ||
                                            "-"}
                                        </td>

                                        <td>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={schedule.store_name || ""}
                                            onChange={(e) =>
                                              handleScheduleStoreNameChange(
                                                index,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Enter store name"
                                          />
                                        </td>

                                        <td>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Add remarks"
                                            value={schedule.remarks || ""}
                                            onChange={(e) =>
                                              handleScheduleRemarksChange(
                                                index,
                                                e.target.value
                                              )
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="9" className="text-center">
                                        No delivery schedules available.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* General Term & Conditions Section */}

                            <div className="mt-3 d-flex justify-content-between align-items-center">
                              <h5 className="">
                                General Term &amp; Conditions
                              </h5>

                              <button
                                className="purple-btn2"
                                style={{ minWidth: 100 }}
                                onClick={() =>
                                  setGeneralTerms((prev) => [
                                    ...prev,

                                    {
                                      id: Date.now(),

                                      category: "",

                                      condition: "",
                                    },
                                  ])
                                }
                              >
                                <span className="material-symbols-outlined align-text-top me-2">
                                  add
                                </span>
                                Add
                              </button>
                            </div>

                            <div className="tbl-container me-2 mt-2">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th>Condition Category</th>

                                    <th>Condition</th>

                                    <th>Action</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {generalTerms && generalTerms.length > 0 ? (
                                    generalTerms.map((row, idx) => (
                                      <tr key={row.id}>
                                        <td>
                                          <select
                                            className="form-control"
                                            value={row.category}
                                            onChange={(e) => {
                                              const selectedCategory =
                                                e.target.value;

                                              // Find existing conditions for the selected category from API data

                                              const existingConditionsForCategory =
                                                termsConditions.filter(
                                                  (item) =>
                                                    item.condition_category_name ===
                                                    selectedCategory
                                                );

                                              // Get the first condition text for this category (or empty if none exists)

                                              const defaultConditionText =
                                                existingConditionsForCategory.length >
                                                0
                                                  ? existingConditionsForCategory[0]
                                                      .condition
                                                  : "";

                                              setGeneralTerms((prev) =>
                                                prev.map((item, i) =>
                                                  i === idx
                                                    ? {
                                                        ...item,

                                                        category:
                                                          selectedCategory,

                                                        condition:
                                                          defaultConditionText, // Auto-populate with existing condition
                                                      }
                                                    : item
                                                )
                                              );
                                            }}
                                          >
                                            <option value="">
                                              Select Category
                                            </option>

                                            {conditionCategories.map(
                                              (category, catIndex) => (
                                                <option
                                                  key={catIndex}
                                                  value={category}
                                                >
                                                  {category}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </td>

                                        <td>
                                          <input
                                            className="form-control"
                                            value={row.condition}
                                            onChange={(e) =>
                                              setGeneralTerms((prev) =>
                                                prev.map((item, i) =>
                                                  i === idx
                                                    ? {
                                                        ...item,

                                                        condition:
                                                          e.target.value,
                                                      }
                                                    : item
                                                )
                                              )
                                            }
                                            placeholder={
                                              row.category
                                                ? "Enter condition"
                                                : "Select category first"
                                            }
                                            disabled={!row.category}
                                          />
                                        </td>

                                        <td className="text-center">
                                          <button
                                            type="button"
                                            className="btn btn-link text-danger"
                                            onClick={() =>
                                              setGeneralTerms((prev) =>
                                                prev.filter((_, i) => i !== idx)
                                              )
                                            }
                                          >
                                            <span className="material-symbols-outlined">
                                              cancel
                                            </span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={3} className="text-center">
                                        No conditions added.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-3 ">
                              <h5 className=" mt-3">
                                Material Specific Term &amp; Conditions
                              </h5>
                            </div>

                            <div className="tbl-container me-2 mt-2">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th>Material</th>

                                    <th>Condition Category</th>

                                    <th>Condition</th>

                                    <th>Actions</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {materialTermConditions &&
                                  materialTermConditions.length > 0 ? (
                                    materialTermConditions.map(
                                      (item, index) => (
                                        <tr key={index}>
                                          <td>
                                            {item.material_name ||
                                              item.material ||
                                              "N/A"}
                                          </td>

                                          <td>
                                            {item.condition_category_name ||
                                              item.category ||
                                              "N/A"}
                                          </td>

                                          <td>
                                            {item.condition ||
                                              item.condition_text ||
                                              "N/A"}
                                          </td>

                                          <td className="text-center">
                                            <button
                                              type="button"
                                              className="btn btn-link text-danger"
                                              onClick={() => {
                                                // Handle remove if needed

                                                console.log(
                                                  "Remove material term condition:",

                                                  item
                                                );
                                              }}
                                            >
                                              <span className="material-symbols-outlined">
                                                cancel
                                              </span>
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center">
                                        No material specific conditions found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Document Attachment Section - Only visible on Terms & Conditions tab */}

                            {activeTab === "terms-conditions" && (
                              <>
                                <div className="d-flex justify-content-between mt-5 ">
                                  <h5>Document Attachment</h5>

                                  <div
                                    className=""
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

                                {/* Document Attachment Table */}

                                <div
                                  className="tbl-container mb-4"
                                  style={{ maxHeight: "500px" }}
                                >
                                  <table className="w-100">
                                    <thead>
                                      <tr>
                                        <th className="main2-th">File Type</th>

                                        <th className="main2-th">File Name </th>

                                        <th className="main2-th">Upload At</th>

                                        <th className="main2-th">
                                          Upload File
                                        </th>

                                        <th
                                          className="main2-th"
                                          style={{ width: 100 }}
                                        >
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
                                              onChange={(e) =>
                                                handleFileNameChange(
                                                  att.id,

                                                  e.target.value
                                                )
                                              }
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
                                                onChange={(e) =>
                                                  handleFileChange(e, att.id)
                                                }
                                              />
                                            )}
                                          </td>

                                          <td className="document">
                                            <div
                                              style={{
                                                display: "flex",

                                                alignItems: "center",
                                              }}
                                            >
                                              <div className="attachment-placeholder">
                                                {att.isExisting && (
                                                  <div className="file-box">
                                                    <div className="image">
                                                      <a
                                                        href={att.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                      >
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
                                                      <a
                                                        href={att.fileUrl}
                                                        download
                                                      >
                                                        <span className="material-symbols-outlined">
                                                          file_download
                                                        </span>
                                                      </a>

                                                      <span>
                                                        {att.fileName}
                                                      </span>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                className="btn btn-sm btn-link text-danger"
                                                onClick={() =>
                                                  handleRemove(att.id)
                                                }
                                              >
                                                <span className="material-symbols-outlined">
                                                  cancel
                                                </span>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Remark, Comments, Status, and Submit/Cancel buttons */}

                                <div className="row w-100">
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label>Remark</label>

                                      <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter ..."
                                        defaultValue={""}
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
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mt-4 justify-content-end align-items-center mx-2">
                                  <div className="col-md-3">
                                    <div className="form-group d-flex gap-3 align-items-center mx-3">
                                      <label
                                        style={{
                                          fontSize: "0.95rem",

                                          color: "black",
                                        }}
                                      >
                                        Status
                                      </label>

                                      <SingleSelector
                                        options={[
                                          { value: "draft", label: "Draft" },
                                        ]}
                                        value={{
                                          value: "draft",

                                          label: "Draft",
                                        }}
                                        placeholder="Select Status"
                                        isClearable={false}
                                        isDisabled={true}
                                        classNamePrefix="react-select"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mt-2 justify-content-end">
                                  <div className="col-md-2">
                                    <button
                                      className="purple-btn2 w-100  mt-2"
                                      onClick={handleCreatePurchaseOrder}
                                      disabled={isCreatingOrder}
                                    >
                                      {isCreatingOrder
                                        ? "Creating..."
                                        : "Submit"}
                                    </button>
                                  </div>

                                  <div className="col-md-2">
                                    <button className="purple-btn1 w-100">
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            className="tab-pane fade"
                            id="Domestic4"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            tabIndex={0}
                          >
                            Amendment Details
                          </div>
                        </div>

                        {/* /.container-fluid */}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Document Attachment Section - Only visible on Terms & Conditions tab */}
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

      {/* Navigation Top */}

      {/* sidebar start below */}

      {/* webpage container end */}

      {/* Select RfQ Start*/}

      {/* Select RfQ end */}

      {/* Modal Attributes*/}

      {/* Modal end */}

      {/* rate & taxes Attributes modal start */}

      {/* rate & taxes Attributes modal end */}

      {/* rate & taxes select modal start */}

      {/* rate & taxes select modal end */}

      {/* Matarial Details (sereneModal) modal start */}

      {/* Matarial Details (sereneModal) modal end */}

      {/* Remark  modal start end */}

      {/* Comments  modal start */}

      {/* Comments  modal start end */}

      {/* file_attchement add modal */}
      {/* file_attchement add modal end */}
      {/* document_attchment schedule modal */}
      {/* document_attchment schedule modal end */}

      {/* Add Material Modal */}

      <Modal
        show={showTaxesModal}
        onHide={handleCloseTaxesModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Taxes and Charges</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="tax-table-header">
                <tr>
                  <th>Tax / Charge Type</th>

                  <th>Tax / Charges per UOM (INR)</th>

                  <th>Inclusive</th>

                  <th>Amount</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Total Base Cost</td>

                  <td></td>

                  <td></td>

                  <td>
                    <input
                      type="number"
                      className="form-control base_cost"
                      value={chargeTaxes.baseCost}
                      readOnly
                      disabled
                    />
                  </td>

                  <td></td>
                </tr>

                {/* Addition Tax & Charges Section */}

                <tr className="addition-anchor">
                  <td>Addition Tax & Charges</td>

                  <td></td>

                  <td></td>

                  <td></td>

                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm add-tax-row"
                      onClick={() => addTaxRow("addition")}
                    >
                      +
                    </button>
                  </td>
                </tr>

                {/* Addition Tax Rows */}

                {chargeTaxes.additionTaxes.map((tax) => (
                  <tr key={tax.id}>
                    <td>
                      <select
                        className="form-control"
                        value={tax.taxType}
                        onChange={(e) =>
                          handleTaxChange(
                            "addition",

                            tax.id,

                            "taxType",

                            e.target.value
                          )
                        }
                        
                      >
                        <option value="">Select Tax Type</option>

                        {chargesAdditionTaxOptions.map((taxOption) => (
                          <option key={taxOption.id} value={taxOption.id}>
                            {taxOption.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-control"
                        value={tax.taxPercentage}
                        onChange={(e) =>
                          handleTaxChange(
                            "addition",

                            tax.id,

                            "taxPercentage",

                            e.target.value
                          )
                        }
                        disabled={!tax.taxType}
                      >
                        <option value="">Select Percentage</option>

                        {tax.taxType &&
                          getChargesTaxPercentages(tax.taxType).map(
                            (percentage, index) => (
                              <option key={index} value={percentage}>
                                {percentage}%
                              </option>
                            )
                          )}
                      </select>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={tax.inclusive}
                        onChange={(e) =>
                          handleTaxChange(
                            "addition",

                            tax.id,

                            "inclusive",

                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={tax.amount}
                        disabled
                        placeholder="Auto-calculated"
                      />
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-danger"
                        onClick={() => removeTaxRow("addition", tax.id)}
                      >
                        <span className="material-symbols-outlined">
                          cancel
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Deduction Tax Section */}

                <tr className="deduction-anchor">
                  <td>Deduction Tax</td>

                  <td></td>

                  <td></td>

                  <td></td>

                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm add-tax-row"
                      onClick={() => addTaxRow("deduction")}
                    >
                      +
                    </button>
                  </td>
                </tr>

                {/* Deduction Tax Rows */}

                {chargeTaxes.deductionTaxes.map((tax) => (
                  <tr key={tax.id}>
                    <td>
                      <select
                        className="form-control"
                        value={tax.taxType}
                        onChange={(e) =>
                          handleTaxChange(
                            "deduction",

                            tax.id,

                            "taxType",

                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Tax Type</option>

                        {chargesDeductionTaxOptions.map((taxOption) => (
                          <option key={taxOption.id} value={taxOption.id}>
                            {taxOption.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-control"
                        value={tax.taxPercentage}
                        onChange={(e) =>
                          handleTaxChange(
                            "deduction",

                            tax.id,

                            "taxPercentage",

                            e.target.value
                          )
                        }
                        disabled={!tax.taxType}
                      >
                        <option value="">Select Percentage</option>

                        {tax.taxType &&
                          getChargesTaxPercentages(tax.taxType).map(
                            (percentage, index) => (
                              <option key={index} value={percentage}>
                                {percentage}%
                              </option>
                            )
                          )}
                      </select>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={tax.inclusive}
                        onChange={(e) =>
                          handleTaxChange(
                            "deduction",

                            tax.id,

                            "inclusive",

                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={tax.amount}
                        disabled
                        placeholder="Auto-calculated"
                      />
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-danger"
                        onClick={() => removeTaxRow("deduction", tax.id)}
                      >
                        <span className="material-symbols-outlined">
                          cancel
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td>Net Cost</td>

                  <td></td>

                  <td></td>

                  <td className="text-center">
                    <input
                      type="text"
                      className="form-control net-cost"
                      value={chargeTaxes.netCost}
                      readOnly
                      disabled
                    />
                  </td>

                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <button
            type="button"
            className=" purple-btn1"
            onClick={handleCloseTaxesModal}
          >
            Close
          </button>

          <button
            type="button"
            className="purple-btn2"
            onClick={handleSaveTaxes}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      {/* Add MOR Modal */}

      <Modal
        centered
        size="xl"
        show={addMORModal}
        onHide={() => {
          setAddMORModal(false);
        }}
      >
        <Modal.Header closeButton>
          <h5>Select MOR Materials</h5>
        </Modal.Header>

        <Modal.Body>
          <div className="p-3">
            <div className="row">
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>
                    Project <span></span>
                  </label>

                  <MultiSelector
                    options={projectsOptions}
                    value={selectedProject}
                    onChange={handleProjectChange}
                    placeholder="Select Project"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Sub-project</label>

                  <MultiSelector
                    options={siteOptionsNorm}
                    value={selectedSite}
                    onChange={handleSiteChange}
                    placeholder="Select Sub-project"
                    isDisabled={!selectedProject}
                  />
                </div>
              </div>

              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label>MOR No.</label>

                  <SingleSelector
                    options={morOptions}
                    value={
                      morOptions.find((opt) => opt.value === morFormData.morNumber) || null
                    }
                    placeholder="Select MOR No."
                    onChange={(selectedOption) =>
                      setMorFormData((prev) => ({
                        ...prev,
                        morNumber: selectedOption?.value || "",
                      }))
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>MOR Start Date</label>

                  <input
                    className="form-control"
                    type="date"
                    value={morFormData.morStartDate}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);

                      const today = new Date();

                      today.setHours(0, 0, 0, 0);

                      if (selectedDate < today) {
                        toast.error(
                          "MOR Start Date cannot be in the past. Please select today's date or a future date."
                        );

                        return;
                      }

                      // If end date is set, ensure start date is before end date

                      if (
                        morFormData.morEndDate &&
                        e.target.value > morFormData.morEndDate
                      ) {
                        toast.error(
                          "MOR Start Date must be before or equal to MOR End Date."
                        );

                        return;
                      }

                      setMorFormData((prev) => ({
                        ...prev,

                        morStartDate: e.target.value,
                      }));
                    }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>MOR End Date</label>

                  <input
                    className="form-control"
                    type="date"
                    value={morFormData.morEndDate}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);

                      const today = new Date();

                      today.setHours(0, 0, 0, 0);

                      if (selectedDate < today) {
                        toast.error(
                          "MOR End Date cannot be in the past. Please select today's date or a future date."
                        );

                        return;
                      }

                      // If start date is set, ensure end date is after start date

                      if (
                        morFormData.morStartDate &&
                        e.target.value < morFormData.morStartDate
                      ) {
                        toast.error(
                          "MOR End Date must be after or equal to MOR Start Date."
                        );

                        return;
                      }

                      setMorFormData((prev) => ({
                        ...prev,

                        morEndDate: e.target.value,
                      }));
                    }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material Type <span></span>
                  </label>

                  <SingleSelector
                    options={inventoryTypes2}
                    value={inventoryTypes2.find(
                      (option) => option.value === morFormData.materialType
                    )}
                    placeholder="Select Material Type"
                    onChange={(selectedOption) =>
                      handleMorSelectorChange("materialType", selectedOption)
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material Sub Type <span></span>
                  </label>

                  <SingleSelector
                    options={inventorySubTypes2}
                    value={inventorySubTypes2.find(
                      (option) => option.value === morFormData.materialSubType
                    )}
                    placeholder="Select Material Sub Type"
                    onChange={(selectedOption) =>
                      handleMorSelectorChange("materialSubType", selectedOption)
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material <span></span>
                  </label>

                  <SingleSelector
                    options={inventoryMaterialTypes2}
                    value={inventoryMaterialTypes2.find(
                      (option) => option.value === morFormData.material
                    )}
                    placeholder="Select Material"
                    onChange={(selectedOption) =>
                      handleMorSelectorChange("material", selectedOption)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-1 justify-content-center d-flex gap-2">
              <button className="purple-btn1" onClick={handleMorSearch}>
                Search
              </button>

              <button className="purple-btn1" onClick={handleMorReset}>
                Reset
              </button>
            </div>

            <div className="tbl-container me-2 mt-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {loadingMaterialDetails ? (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                <style type="text/css">{`
                  .select-mor-table thead th {
                    padding: 6px 8px !important;
                    height: 28px !important;
                    line-height: 1.1 !important;
                    vertical-align: middle !important;
                  }
                  .select-mor-table tbody td {
                    padding: 6px 8px !important;
                    vertical-align: middle !important;
                  }
                `}</style>

                <table className="w-100 select-mor-table">
                  <thead>
                    <tr>
                      <th rowSpan="2">
                        <input
                          type="checkbox"
                          checked={
                            selectedMaterialItems.length ===
                              materialDetailsData.length &&
                            materialDetailsData.length > 0
                          }
                          onChange={handleMorSelectAllMaterials}
                        />
                      </th>

                      <th rowSpan="2">Project SubProject</th>

                      <th rowSpan="2">MOR Number</th>

                      <th rowSpan="2">MOR Date</th>

                      <th colSpan="11">Material Details</th>
                    </tr>

                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>

                      <th>Material</th>

                      <th>UOM</th>
                      <th>Generic Specification</th>
                      <th>Brand</th>
                      <th>Color</th>

                      <th>Required Qty</th>

                      <th>Prev Order Qty</th>

                      <th>Pending Qty</th>

                      <th>Order Qty</th>

                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {materialDetailsData.length > 0 ? (
                      materialDetailsData.map((item, index) => (
                        <tr
                          key={`${item.mor_id}-${item.inventory_id}-${index}`}
                        >
                          {/* Left-most checkbox: render only for first row of the project block */}

                          <td>
                            {item.isFirstMaterial ? (
                              <input
                                type="checkbox"
                                checked={materialDetailsData

                                  .filter((m) => m.mor_id === item.mor_id)

                                  .every((m) =>
                                    selectedMaterialItems.includes(
                                      materialDetailsData.indexOf(m)
                                    )
                                  )}
                                onChange={(e) =>
                                  handleMorSelectProject(e, item.mor_id)
                                }
                              />
                            ) : null}
                          </td>

                          {/* Project/Subproject cell (merged rows) */}

                          {item.isFirstMaterial ? (
                            <td rowSpan={item.rowspan}>
                              {item.project_name && item.sub_project_name
                                ? `${item.project_name} - ${item.sub_project_name}`
                                : item.project_name ||
                                  item.sub_project_name ||
                                  ""}
                            </td>
                          ) : null}

                          {/* MOR Number (merged rows) */}

                          {item.isFirstMaterial ? (
                            <td rowSpan={item.rowspan}>
                              {item.mor_number || ""}
                            </td>
                          ) : null}

                          {/* MOR Date (merged rows) */}

                          {item.isFirstMaterial ? (
                            <td rowSpan={item.rowspan}>
                              {item.mor_date || ""}
                            </td>
                          ) : null}

                          {/* Per-material checkbox */}

                          <td>
                            <input
                              type="checkbox"
                              checked={selectedMaterialItems.includes(index)}
                              onChange={() =>
                                handleMorMaterialCheckboxChange(index)
                              }
                            />
                          </td>

                          <td style={{ minWidth: 180 }}>
                            {item.material_name ||
                              item.material?.material_name ||
                              ""}
                          </td>

                          <td style={{ minWidth: 140 }}>
                            {(() => {
                              const invId = item.material_inventory_id;
                              if (!morOptionsByInventoryId[invId]) {
                                loadMorRowOptionsIfNeeded(invId);
                              }
                              const opts = morOptionsByInventoryId[invId] || {};
                              const options = opts.uomOptions || [];
                              const value = options.find((o) => o.value === item.uom_id) || null;
                              return (
                                <SingleSelector
                                  options={options}
                                  value={value}
                                  onChange={(sel) => {
                                    const selected = sel ? sel.value : null;
                                    const label = sel ? sel.label : "";
                                    setMaterialDetailsData((prev) => prev.map((r, idx) => idx === index ? { ...r, uom_id: selected, uom_name: label } : r));
                                  }}
                                  placeholder="Select UOM"
                                />
                              );
                            })()}
                          </td>
                          <td style={{ minWidth: 180 }}>
                            {(() => {
                              const invId = item.material_inventory_id;
                              if (!morOptionsByInventoryId[invId]) {
                                loadMorRowOptionsIfNeeded(invId);
                              }
                              const opts = morOptionsByInventoryId[invId] || {};
                              const options = opts.genericOptions || [];
                              const value = options.find((o) => o.value === item.generic_info_id) || null;
                              return (
                                <SingleSelector
                                  options={options}
                                  value={value}
                                  onChange={(sel) => handleMorRowGenericChange(index, sel)}
                                  placeholder="Select Specification"
                                />
                              );
                            })()}
                          </td>
                          <td style={{ minWidth: 180 }}>
                            {(() => {
                              const invId = item.material_inventory_id;
                              if (!morOptionsByInventoryId[invId]) {
                                loadMorRowOptionsIfNeeded(invId);
                              }
                              const opts = morOptionsByInventoryId[invId] || {};
                              const options = opts.brandOptions || [];
                              const value = options.find((o) => o.value === item.brand_id) || null;
                              return (
                                <SingleSelector
                                  options={options}
                                  value={value}
                                  onChange={(sel) => handleMorRowBrandChange(index, sel)}
                                  placeholder="Select Brand"
                                />
                              );
                            })()}
                          </td>
                          <td style={{ minWidth: 180 }}>
                            {(() => {
                              const invId = item.material_inventory_id;
                              if (!morOptionsByInventoryId[invId]) {
                                loadMorRowOptionsIfNeeded(invId);
                              }
                              const opts = morOptionsByInventoryId[invId] || {};
                              const options = opts.colourOptions || [];
                              const value = options.find((o) => o.value === item.colour_id) || null;
                              return (
                                <SingleSelector
                                  options={options}
                                  value={value}
                                  onChange={(sel) => handleMorRowColourChange(index, sel)}
                                  placeholder="Select Color"
                                />
                              );
                            })()}
                          </td>

                          <td>{item.required_quantity || ""}</td>

                          <td >{item.prev_order_qty || ""}</td>

                          <td>
                            {item.pending_qty ?? item.pending_quantity ?? ""}
                          </td>

                          <td style={{ minWidth: 160 }}>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.order_qty || ""}
                              onChange={(e) =>
                                handleOrderQtyChange(index, e.target.value)
                              }
                              placeholder="Enter Qty"
                              min="0"
                            />
                          </td>

                          <td>{item.status || ""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <button
            type="button"
            className=" purple-btn1"
            onClick={() => setAddMORModal(false)}
          >
            Close
          </button>

          <button
            type="button"
            className="purple-btn2"
            onClick={handleAcceptSelectedMaterials}
          >
            Add Selected
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);

          setEditRowIndex(null); // <-- Reset editRowIndex on modal close
        }}
      >
        {/* Taxes and Charges Modal */}

        <Modal.Header closeButton>
          <h5>{editRowIndex !== null ? "Edit Material" : "Add Material"}</h5>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleCreate}>
            <div className="row">
              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material Type <span>*</span>
                  </label>

                  <SingleSelector
                    options={inventoryTypes2}
                    value={inventoryTypes2.find(
                      (option) => option.value === formData.materialType
                    )}
                    placeholder={`Select Material Type`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("materialType", selectedOption)
                    }
                  />

                  {fieldErrors.materialType && (
                    <span className="text-danger">
                      {fieldErrors.materialType}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material Sub Type <span>*</span>
                  </label>

                  <SingleSelector
                    options={inventorySubTypes2}
                    value={inventorySubTypes2.find(
                      (option) => option.value === formData.materialSubType
                    )}
                    placeholder={`Select Material Sub Type`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("materialSubType", selectedOption)
                    }
                  />

                  {fieldErrors.materialSubType && (
                    <span className="text-danger">
                      {fieldErrors.materialSubType}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    Material <span>*</span>
                  </label>

                  <SingleSelector
                    options={inventoryMaterialTypes2}
                    value={inventoryMaterialTypes2.find(
                      (option) => option.value === formData.material
                    )}
                    placeholder={`Select Material`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("material", selectedOption)
                    }
                  />

                  {fieldErrors.material && (
                    <span className="text-danger">{fieldErrors.material}</span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Generic Specification</label>

                  <SingleSelector
                    options={
                      Array.isArray(genericSpecifications)
                        ? genericSpecifications
                        : []
                    }
                    value={genericSpecifications.find(
                      (option) => option.value === formData.genericSpecification
                    )}
                    placeholder={`Select Specification`}
                    onChange={(selectedOption) =>
                      handleSelectorChange(
                        "genericSpecification",

                        selectedOption
                      )
                    }
                  />

                  {fieldErrors.genericSpecification && (
                    <span className="text-danger">
                      {fieldErrors.genericSpecification}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Colour</label>

                  <SingleSelector
                    options={colors || []}
                    value={colors.find(
                      (option) => option.value === formData.colour
                    )}
                    placeholder={`Select Colour`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("colour", selectedOption)
                    }
                  />

                  {fieldErrors.colour && (
                    <span className="text-danger">{fieldErrors.colour}</span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Brand</label>

                  <SingleSelector
                    options={inventoryBrands || []}
                    value={inventoryBrands.find(
                      (option) => option.value === formData.brand
                    )}
                    placeholder={`Select Brand`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("brand", selectedOption)
                    }
                  />

                  {fieldErrors.brand && (
                    <span className="text-danger">{fieldErrors.brand}</span>
                  )}
                </div>
              </div>

              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">
                    UOM <span>*</span>
                  </label>

                  <SingleSelector
                    options={unitOfMeasures}
                    value={unitOfMeasures.find(
                      (option) => option.value === formData.uom
                    )}
                    placeholder={`Select UOM`}
                    onChange={(selectedOption) =>
                      handleSelectorChange("uom", selectedOption)
                    }
                  />

                  {fieldErrors.uom && (
                    <span className="text-danger">{fieldErrors.uom}</span>
                  )}
                </div>
              </div>

              <div className="row mt-2 justify-content-center mt-5">
                <div className="col-md-3 mt-2">
                  <button type="submit" className="purple-btn2 w-100">
                    {editRowIndex !== null ? "Update" : "Add"}
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    type="button"
                    className="purple-btn1 w-100"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setShowModal(false);

                      setEditRowIndex(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Tax Modal */}

      <Modal
        show={showTaxModal}
        onHide={handleCloseTaxModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>View Tax & Rate</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container-fluid p-0">
            {console.log("Modal is rendering, tableId:", tableId)}

            {console.log("Tax options in modal:", taxOptions)}

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Material</label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.material || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">HSN Code</label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.hsnCode || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    {" "}
                    Rate per Nos ({poCurrencyCode}) <span> *</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.ratePerNos || ""}
                    onChange={(e) => handleRatePerNosChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Total PO Qty</label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.totalPoQty || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* <div className="row mb-3"> */}

            {/* </div> */}

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Conversion Rate{poCurrencyCode}
                                      </label>

                  <input
                    type="number"
                    className="form-control"
                    value={conversionRate}
                    readOnly
                    disabled={true}
                    placeholder="Set in PO Details tab"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Discount (%)</label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.discount || ""}
                    onChange={(e) =>
                      handleDiscountPercentageChange(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Material Cost ({poCurrencyCode})
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.materialCost || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Discount Rate ({poCurrencyCode})
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.discountRate || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    After Discount Value ({poCurrencyCode})
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.afterDiscountValue || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Remark</label>

                  <textarea
                    className="form-control"
                    rows={3}
                    value={taxRateData[tableId]?.remark || ""}
                    onChange={(e) => {
                      setTaxRateData((prev) => ({
                        ...prev,

                        [tableId]: {
                          ...prev[tableId],

                          remark: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Tax Charges Table */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="tax-table-header">
                      <tr>
                        <th>Tax / Charge Type</th>

                        <th colSpan="2">Tax / Charges per UOM (INR)</th>

                        <th>Inclusive</th>

                        <th colSpan="2">Tax / Charges Amount</th>

                        <th>Action</th>
                      </tr>

                      <tr>
                        <th></th>

                        <th>INR</th>

                        <th>{poCurrencyCode}</th>

                        <th></th>

                        <th>INR</th>

                        <th>{poCurrencyCode}</th>

                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Total Base Cost Row */}

                      <tr>
                        <td>Total Base Cost</td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td>
                          <input
                            type="number"
                            className="form-control "
                            value={safeConvertUsdToInr(
                              taxRateData[tableId]?.afterDiscountValue,

                              conversionRate
                            )}
                            readOnly
                            disabled={true}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="form-control "
                            value={
                              taxRateData[tableId]?.afterDiscountValue || ""
                            }
                            readOnly
                            disabled={true}
                          />
                        </td>

                        <td></td>
                      </tr>

                      {/* Addition Tax & Charges Row */}

                      <tr>
                        <td>Addition Tax & Charges</td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => addAdditionTaxCharge(tableId)}
                          >
                            <span>+</span>
                          </button>
                        </td>
                      </tr>

                      {taxRateData[tableId]?.addition_bid_material_tax_details

                        ?.filter((item) => !item._destroy)

                        .map((item, rowIndex) => (
                          <tr key={`${rowIndex}-${item.id}`}>
                            <td>
                              <select
                                className="form-control"
                                value={
                                  item.taxChargeType ||
                                  taxOptions.find(
                                    (option) =>
                                      option.id === item.tax_category_id
                                  )?.value ||
                                  ""
                                }
                                onChange={(e) => {
                                  const selectedValue = e.target.value;

                                  const selectedOption = taxOptions.find(
                                    (option) => option.value === selectedValue
                                  );

                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "taxChargeType",

                                    selectedOption?.value || selectedValue,

                                    "addition"
                                  );

                                  if (selectedOption?.id) {
                                    handleTaxCategoryChange(
                                      tableId,

                                      selectedOption.id,

                                      item.id
                                    );
                                  }
                                }}
                                style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M10.293 3.293 6 7.586 1.707 3.293A1 1 0 0 0 .293 4.707l5 5a1 1 0 0 0 1.414 0l5-5a1 1 0 1 0-1.414-1.414z' fill='%23000000'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '10px',
    appearance: 'none',
    paddingRight: '2.5rem',
     minWidth: '150px', // Set minimum width
    width: 'auto', // Allow growing based on content
    maxWidth: '100%', // Don't overflow container
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden', // Hide overflow
    textOverflow: 'ellipsis' // Show ellipsis for overflow text
  }}
                              >
                                <option value="">Select Tax</option>

                                {taxOptions.map((opt) => (
                                  <option
                                    key={opt.id}
                                    value={opt.value}
                                    disabled={(() => {
                                      const current =
                                        item.taxChargeType ||
                                        taxOptions.find(
                                          (o) => o.id === item.tax_category_id
                                        )?.value ||
                                        "";

                                      const disabledSet = (
                                        taxRateData[
                                          tableId
                                        ]?.addition_bid_material_tax_details?.reduce(
                                          (acc, detail) => {
                                            if (
                                              detail._destroy ||
                                              detail.id === item.id
                                            )
                                              return acc;

                                            const t = detail.taxChargeType;

                                            if (t === "CGST")
                                              acc.push("CGST", "IGST");

                                            if (t === "SGST")
                                              acc.push("SGST", "IGST");

                                            if (t === "IGST")
                                              acc.push("CGST", "SGST");

                                            if (t) acc.push(t);

                                            return acc;
                                          },

                                          []
                                        ) || []
                                      ).filter(
                                        (v, i, self) => self.indexOf(v) === i
                                      );

                                      return (
                                        disabledSet.includes(opt.value) &&
                                        opt.value !== current
                                      );
                                    })()}
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td>
                              {isPercentageTax(item.taxChargeType) ? (
                                <select
                                  className="form-control"
                                  value={item?.taxChargePerUom || ""}
                                  onChange={(e) =>
                                    handleTaxChargeChange(
                                      tableId,

                                      item.id,

                                      "taxChargePerUom",

                                      e.target.value,

                                      "addition"
                                    )
                                  }
                                  disabled={
                                    (materialTaxPercentages[item.id] || [])
                                      .length === 0
                                  }
                                >
                                  <option value="">
                                    {(materialTaxPercentages[item.id] || [])
                                      .length === 0
                                      ? "No percentages available"
                                      : "Select percentage"}
                                  </option>

                                  {(materialTaxPercentages[item.id] || []).map(
                                    (percent) => (
                                      <option
                                        key={percent.id}
                                        value={`${percent.percentage}%`}
                                      >
                                        {percent.percentage}%
                                      </option>
                                    )
                                  )}
                                </select>
                              ) : (
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item?.taxChargePerUom || ""}
                                  onChange={(e) =>
                                    handleTaxChargeChange(
                                      tableId,

                                      item.id,

                                      "taxChargePerUom",

                                      e.target.value,

                                      "addition"
                                    )
                                  }
                                  placeholder="Enter amount"
                                />
                              )}
                            </td>

                            <td>
                              {isPercentageTax(item.taxChargeType) ? (
                                <span></span>
                              ) : (
                                <input
                                  type="number"
                                  className="form-control"
                                  value={convertInrToUsd(item?.taxChargePerUom)}
                                  readOnly
                                  disabled={true}
                                  placeholder="Auto calculated"
                                />
                              )}
                            </td>

                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "inclusive",

                                    e.target.checked,

                                    "addition"
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={parseFloat(item.amount_inr || 0).toFixed(
                                  2
                                )}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "amount",

                                    e.target.value,

                                    "addition"
                                  )
                                }
                                disabled={true}
                                placeholder="Tax Amount"
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={(() => {
                                  const usd = safeConvertInrToUsd(
                                    parseFloat(item.amount_inr || 0) || 0,
                                    conversionRate
                                  );
                                  const num = parseFloat(usd);
                                  return isNaN(num) ? "0.00" : num.toFixed(2);
                                })()}
                                readOnly
                                disabled={true}
                                placeholder="Auto calculated"
                              />
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  removeTaxChargeItem(
                                    tableId,

                                    item.id,

                                    "addition"
                                  )
                                }
                              >
                                <span>×</span>
                              </button>
                            </td>
                          </tr>
                        ))}

                      <tr>
                        <td>Deduction Tax</td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => addDeductionTaxCharge(tableId)}
                          >
                            <span>+</span>
                          </button>
                        </td>
                      </tr>

                      {taxRateData[tableId]?.deduction_bid_material_tax_details

                        ?.filter((item) => !item._destroy)

                        .map((item) => (
                          <tr key={item.id}>
                            <td>
                              <SelectBox
                                options={deductionTaxOptions || []}
                                value={item.taxChargeType || ""}
                                defaultValue={item.taxChargeType || ""}
                                onChange={(value) => {
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "taxChargeType",

                                    value,

                                    "deduction"
                                  );

                                  // Fetch tax percentages for the selected category

                                  const selectedOption =
                                    deductionTaxOptions.find(
                                      (option) => option.value === value
                                    );

                                  if (selectedOption?.id) {
                                    handleTaxCategoryChange(
                                      tableId,

                                      selectedOption.id,

                                      item.id
                                    );
                                  }
                                }}
                                // disabledOptions={taxRateData[
                                //   tableId
                                // ]?.deduction_bid_material_tax_details?.map(
                                //   (item) => item.taxChargeType
                                // )}
                                disabledOptions={
                                  (taxRateData[tableId]?.deduction_bid_material_tax_details || [])
                                    .filter(
                                      (deductionItem) =>
                                        !deductionItem?._destroy && deductionItem?.id !== item.id
                                    )
                                    .map((deductionItem) => deductionItem?.taxChargeType)
                                }
                              />
                            </td>

                            <td>
                              <select
                                className="form-control"
                                value={item?.taxChargePerUom || ""}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "taxChargePerUom",

                                    e.target.value,

                                    "deduction"
                                  )
                                }
                                disabled={
                                  (materialTaxPercentages[item.id] || [])
                                    .length === 0
                                }
                              >
                                <option value="">
                                  {(materialTaxPercentages[item.id] || [])
                                    .length === 0
                                    ? "No percentages available"
                                    : "Select percentage"}
                                </option>

                                {(materialTaxPercentages[item.id] || []).map(
                                  (percent) => (
                                    <option
                                      key={percent.id}
                                      value={`${percent.percentage}%`}
                                    >
                                      {percent.percentage}%
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td>
                              <span></span>
                            </td>

                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "inclusive",

                                    e.target.checked,

                                    "deduction"
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={parseFloat(item.amount_inr || 0).toFixed(
                                  2
                                )}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,

                                    item.id,

                                    "amount",

                                    e.target.value,

                                    "deduction"
                                  )
                                }
                                disabled={true}
                                placeholder="Tax Amount"
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={(() => {
                                  const usd = safeConvertInrToUsd(
                                    parseFloat(item.amount_inr || 0) || 0,
                                    conversionRate
                                  );
                                  const num = parseFloat(usd);
                                  return isNaN(num) ? "0.00" : num.toFixed(2);
                                })()}
                                readOnly
                                disabled={true}
                                placeholder="Auto calculated"
                              />
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  removeTaxChargeItem(
                                    tableId,

                                    item.id,

                                    "deduction"
                                  )
                                }
                              >
                                <span>×</span>
                              </button>
                            </td>
                          </tr>
                        ))}

                      <tr>
                        <td>Net Cost</td>

                        <td></td>

                        <td></td>

                        <td></td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={safeConvertUsdToInr(
                              taxRateData[tableId]?.netCost,

                              conversionRate
                            )}
                            readOnly
                            disabled={true}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={taxRateData[tableId]?.netCost || ""}
                            readOnly
                            disabled={true}
                          />
                        </td>

                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <button
            variant="secondary"
            onClick={handleCloseTaxModal}
            className="purple-btn1"
          >
            Close
          </button>

          <button
            variant="primary"
            onClick={() => {
              // Validation: Show alert if Rate per Nos is empty

              if (
                !taxRateData[tableId] ||
                !taxRateData[tableId].ratePerNos ||
                taxRateData[tableId].ratePerNos.trim() === ""
              ) {
                toast.error("Rate per Nos is required.");

                return;
              }

              handleSaveTaxChanges();
            }}
            className="purple-btn2"
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RopoImportEdit;