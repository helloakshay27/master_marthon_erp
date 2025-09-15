import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";
import SelectBox from "../components/base/Select/SelectBox";
import DownloadIcon from "../components/common/Icon/DownloadIcon";
import { baseURL } from "../confi/apiDomain";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PoEdit = () => {
  // State variables for the modal
  const [apiMaterialInventoryIds, setApiMaterialInventoryIds] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const navigate = useNavigate();


  // Tax modal state variables
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [taxRateData, setTaxRateData] = useState({});
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);
  const [materialTaxPercentages, setMaterialTaxPercentages] = useState({});
  const { id } = useParams();

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
  const [wingsOptions, setWingsOptions] = useState([]);

  // PO form state
  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);
  const [createdOn, setCreatedOn] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Material data from API response
  const [submittedMaterials, setSubmittedMaterials] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Terms and conditions state
  const [termsConditions, setTermsConditions] = useState([]);
  const [selectedConditionCategory, setSelectedConditionCategory] =
    useState(null);
  const [conditionCategories, setConditionCategories] = useState([]);
  const [materialTermConditions, setMaterialTermConditions] = useState([]);

  // Supplier state
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [loading2, setLoading2] = useState(false);
    const [vendorGstin, setVendorGstin] = useState("");

  // Active tab state
  const [activeTab, setActiveTab] = useState("po-details"); // "po-details", "rate-taxes", "terms-conditions"

  // Handle tab change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Terms and conditions form state
  const [termsFormData, setTermsFormData] = useState({
    creditPeriod: "",
    poValidityPeriod: "",
    advanceReminderDuration: "",
    paymentTerms: "",
    paymentRemarks: "",
    remark: "",
    comments: "",
    supplierAdvance: "",
    supplierAdvanceAmount: "",
    surviceCertificateAdvance: "",
  });

  const [taxSummary, setTaxSummary] = useState({
  total_base_cost: 0,
  total_tax: 0,
  total_charge: 0,
  total_inclusive_cost: 0,
});

  // Charges state
  const [charges, setCharges] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [chargeNames, setChargeNames] = useState([]);

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

  // Add these state setters at the top of your component if not already present:
  const [materialDetails, setMaterialDetails] = useState([]);
  const [rateAndTaxes, setRateAndTaxes] = useState([]);

// For different format options:
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Different format examples:
    
    // American style: MM/DD/YYYY, HH:MM AM/PM
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // 24-hour format: DD/MM/YYYY, HH:MM
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
  // Fetch purchase order data on component mount
  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        setIsLoading(true);

        // If we have an ID from URL params, set it as purchaseOrderId for existing PO
        if (id) {
          setPurchaseOrderId(id);
          console.log("Setting purchaseOrderId from URL params:", id);
        }

        const response = await axios.get(
          `${baseURL}purchase_orders/${id}/ropo_detail.json?token=${token}`
        );
        console.log("Purchase order data:", response.data);
        setPurchaseOrderData(response.data);
        populateFormData(response.data);
      } catch (error) {
        console.error("Error fetching purchase order data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseOrderData();
  }, [id, token]);

  // Helper to refetch and refresh page state after successful updates
  const refetchPurchaseOrderData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}purchase_orders/${id}/ropo_detail.json?token=${token}`
      );
      console.log("Refetched purchase order data");
      populateFormData(response.data);
    } catch (error) {
      console.error("Error refetching purchase order data:", error);
    }
  };

  // Function to populate form data from API response
  const populateFormData = (poData) => {
    // Populate company and supplier
    if (poData.company_id) {
      const companyOption = {
        value: poData.company_id,
        label: poData.company_name || "",
      };
      setSelectedCompany(companyOption);
    }

    if (poData.supplier_id) {
      const supplierOption = {
        value: poData.supplier_id,
        label: poData.supplier_name || "",
      };
      setSelectedSupplier(supplierOption);
    }

    // Set PO date
    if (poData.po_date) {
      setPoDate(poData.po_date);
    }

    // Populate terms and conditions
    if (poData.terms_and_conditions) {
      setTermsFormData({
        creditPeriod:
          poData.terms_and_conditions.credit_period?.toString() || "",
        poValidityPeriod:
          poData.terms_and_conditions.po_validity_period?.toString() || "",
        advanceReminderDuration:
          poData.terms_and_conditions.advance_reminder_duration?.toString() ||
          "",
        paymentTerms: poData.terms_and_conditions.payment_terms || "",
        paymentRemarks: poData.terms_and_conditions.payment_remarks || "",
        remark: poData.terms_and_conditions.remark || "",
        comments: poData.terms_and_conditions.comments || "",
        supplierAdvance:
          poData.terms_and_conditions.supplier_advance?.toString() || "",
        supplierAdvanceAmount:
          poData.terms_and_conditions.supplier_advance_amount?.toString() || "",
        surviceCertificateAdvance:
          poData.terms_and_conditions.survice_certificate_advance?.toString() ||
          "",
      });
    }

    // Populate other cost details
    if (poData.other_cost_details) {
      console.log("Raw other_cost_details:", poData.other_cost_details);

      const formattedOtherCosts = poData.other_cost_details.map((cost) => {
        // Log tax data for debugging
        if (cost.taxes_and_charges && cost.taxes_and_charges.length > 0) {
          console.log(
            `Taxes for cost ${cost.cost_type}:`,
            cost.taxes_and_charges
          );
        }

        return {
          ...(cost.id && { id: cost.id }), // Only include ID if it exists (existing record)
          cost_name: cost.cost_type || "",
          amount: cost.cost?.toString() || "",
          scope: cost.scope || "",
          realised_amount: cost.cost?.toString() || "",
          taxes: {
            additionTaxes:
              cost.taxes_and_charges
                ?.filter((tax) => tax.addition)
                .map((tax) => {
                  console.log(`Processing addition tax for cost:`, tax);
                  return {
                    ...(tax.id && { id: tax.id }), // Only include ID if it exists (existing record)
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  };
                }) || [],
            deductionTaxes:
              cost.taxes_and_charges
                ?.filter((tax) => !tax.addition)
                .map((tax) => {
                  console.log(`Processing deduction tax for cost:`, tax);
                  return {
                    ...(tax.id && { id: tax.id }), // Only include ID if it exists (existing record)
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  };
                }) || [],
            netCost: cost.cost?.toString() || "0",
          },
        };
      });

      console.log("Formatted other costs:", formattedOtherCosts);
      setOtherCosts(formattedOtherCosts);
    }

    // Populate charges with taxes - only if charge names are available
    if (poData.charges_with_taxes && chargeNames.length > 0) {
      console.log("Raw charges_with_taxes:", poData.charges_with_taxes);
      console.log("Available chargeNames:", chargeNames);

      const formattedCharges = poData.charges_with_taxes.map((charge) => {
        // Find the charge name by charge_id
        const chargeNameObj = chargeNames.find(
          (cn) => cn.id === charge.charge_id
        );
        const chargeName = chargeNameObj
          ? chargeNameObj.name
          : charge.charge_id?.toString() || "";

        console.log(
          `Mapping charge_id ${charge.charge_id} to charge name: ${chargeName}`
        );

        // Log tax data for debugging
        if (charge.taxes_and_charges && charge.taxes_and_charges.length > 0) {
          console.log(
            `Taxes for charge ${charge.charge_id}:`,
            charge.taxes_and_charges
          );
        }

        return {
          ...(charge.id && { id: charge.id }), // Only include ID if it exists (existing record)
          charge_name: chargeName,
          charge_id: charge.charge_id || 0,
          amount: charge.amount?.toString() || "",
          realised_amount: charge.realised_amount?.toString() || "",
          taxes: {
            additionTaxes:
              charge.taxes_and_charges
                ?.filter((tax) => tax.addition)
                .map((tax) => {
                  console.log(`Re-processing addition tax:`, tax);
                  return {
                    ...(tax.id && { id: tax.id }), // Only include ID if it exists (existing record)
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  };
                }) || [],
            deductionTaxes:
              charge.taxes_and_charges
                ?.filter((tax) => !tax.addition)
                .map((tax) => {
                  console.log(`Re-processing deduction tax:`, tax);
                  return {
                    ...(tax.id && { id: tax.id }), // Only include ID if it exists (existing record)
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  };
                }) || [],
            netCost: charge.realised_amount?.toString() || "0",
          },
        };
      });

      console.log("Formatted charges:", formattedCharges);
      setCharges(formattedCharges);
    } else if (poData.charges_with_taxes) {
      // Store the raw charges data for later processing when charge names are available
      console.log("Charges data available but charge names not loaded yet");
    }

    if (poData.tax_summary) {
      setTaxSummary({
        total_base_cost: poData.tax_summary.total_base_cost ?? 0,
        total_tax: poData.tax_summary.total_tax ?? 0,
        total_charge: poData.tax_summary.total_charge ?? 0,
        total_inclusive_cost: poData.tax_summary.total_inclusive_cost ?? 0,
      });
    }

    // Populate resource term conditions
    if (poData.resource_term_conditions) {
      const formattedTermConditions = poData.resource_term_conditions.map(
        (condition) => ({
          ...(condition.id && { id: condition.id }), // Only include ID if it exists (existing record)
          term_condition_id: condition.term_condition_id || "",
          category: condition.condition_category || "",
          condition: condition.condition || "",
        })
      );
      setTermsConditions(formattedTermConditions);
      setGeneralTerms(formattedTermConditions); // <-- ADD THIS LINE
    }

    // Populate resource material term conditions
    if (poData.resource_material_term_conditions) {
      console.log(
        "Raw resource_material_term_conditions:",
        poData.resource_material_term_conditions
      );
      const formattedMaterialTermConditions =
        poData.resource_material_term_conditions.map((condition) => ({
          ...(condition.id && { id: condition.id }), // Only include ID if it exists (existing record)
          term_condition_id: condition.term_condition_id || "",
          material_sub_type: condition.material_sub_type || "",
          condition_category: condition.condition_category || "",
          condition: condition.condition || "",
        }));
      console.log(
        "Formatted material term conditions:",
        formattedMaterialTermConditions
      );
      setMaterialTermConditions(formattedMaterialTermConditions);
    }

   

    if (poData.material_details) {
      const formatted = poData.material_details.map((mat) => ({
        // Map to your table row structure
        materialTypeLabel: mat.material_type_name || "", // or whatever field you use
        materialSubTypeLabel: mat.material_sub_type_name || "",
        materialLabel: mat.material_name || "",
        genericSpecificationLabel: mat.generic_info || "",
        colourLabel: mat.colour || "",
        brandLabel: mat.brand_name || "",
        uomLabel: mat.uom || "",
        // ...other fields as needed
        // You may want to keep the original data for editing
        material: mat, // for edit modal
      }));
      setTableData(formatted); // <-- THIS IS THE KEY LINE
      console.log("Formatted material details:", formatted);
    }


    if (poData.rate_and_taxes) {
      setRateAndTaxes(
        poData.rate_and_taxes.map((rate) => ({
          id: rate.id,
          material_inventory_id: rate.material_inventory_id,
          material: rate.material,
          uom: rate.uom,
          po_qty: rate.po_qty,
          adjusted_qty: rate.adjusted_qty,
          tolerance_qty: rate.tolerance_qty,
          material_rate: rate.material_rate,
          material_cost: rate.material_cost,
          discount_percentage: rate.discount_percentage,
          discount_rate: rate.discount_rate,
          after_discount_value: rate.after_discount_value,
          tax_addition: rate.tax_addition,
          tax_deduction: rate.tax_deduction,
          total_charges: rate.total_charges,
          total_base_cost: rate.total_base_cost,
          all_inclusive_cost: rate.all_inclusive_cost,
          // ...add other fields as needed
        }))
      );
    }

      if (poData.attachments && Array.isArray(poData.attachments)) {
    console.log("Raw attachment data:", poData.attachments);
    
    const formattedAttachments = poData.attachments.map((att) => {
      // Use helper to convert API date "13/08/2025,  5:43 PM" to datetime-local format
      const uploadDate = att.uploaded_at
        ? formatToLocalDateTimeInput(att.uploaded_at)
        : getLocalDateTime();
      
      return {
        id: att.id || att.blob_id || Math.random(),
        fileType: att.file_type || att.document_content_type || "",
        fileName: att.file_name || att.document_file_name || "Untitled",
        uploadDate: uploadDate,
        fileUrl: att.url || "",
        doc_path: att.url || "", // Use url as doc_path
        isExisting: true,
        blob_id: att.blob_id,
        // Keep original data for reference
        originalData: att
      };
    });

    console.log("Formatted attachments:", formattedAttachments);
    setAttachments(formattedAttachments);
  }
    //  Populate attachments
   

  };
   // Populate attachments
    // if (poData.attachments && Array.isArray(poData.attachments)) {
    //   const formattedAttachments = poData.attachments.map((att) => {
    //     const originalDate = new Date(att.created_at || att.uploaded_at);
    //     const localDate = new Date(
    //       originalDate.getTime() - originalDate.getTimezoneOffset() * 60000
    //     );
    //     const uploadDate = localDate.toISOString().slice(0, 19);
    //     return {
    //       id: att.blob_id || att.id || Math.random(),
    //       fileType: att.document_content_type || att.file_type || "",
    //       fileName: att.file_name || "",
    //       uploadDate,
    //       fileUrl: att.url || "",
    //       file: att.document_file_name || att.filename,
    //       isExisting: true,
    //       blob_id: att.blob_id,
    //       doc_path: att.doc_path || "",
    //     };
    //   });
    //   setAttachments(formattedAttachments);
    // }

    

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
      .get(`${baseURL}pms/suppliers.json?token=${token}`)
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers data:", error);
      });
  }, []);

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
  };
  // Map companies to options for the dropdown
  const companyOptions = Array.isArray(companies)
    ? companies.map((company) => ({
        value: company.id,
        label: company.company_name,
      }))
    : [];

  // Map suppliers to options for the dropdown
  const supplierOptions = Array.isArray(suppliers)
    ? suppliers.map((supplier) => ({
        value: supplier.id,
        label: supplier.organization_name || supplier.full_name,
      }))
    : [];

  // State for dropdown options
  const [inventoryTypes2, setInventoryTypes2] = useState([]);
  const [selectedInventory2, setSelectedInventory2] = useState(null);
  const [inventorySubTypes2, setInventorySubTypes2] = useState([]);
  const [selectedSubType2, setSelectedSubType2] = useState(null);
  const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]);
  const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] =
    useState(null);
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [genericSpecifications, setGenericSpecifications] = useState([]);
  const [selectedGenericSpecifications, setSelectedGenericSpecifications] =
    useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState(null);
  const [inventoryBrands, setInventoryBrands] = useState([]);
  const [selectedInventoryBrands, setSelectedInventoryBrands] = useState(null);

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
    const getRowKeyValues = (row) => ({
      materialType: toStr(row.materialType ?? row.material?.pms_inventory_type_id),
      materialSubType: toStr(
        row.materialSubType ?? row.material?.pms_inventory_sub_type_id
      ),
      material: toStr(
        typeof row.material === "object"
          ? row.material?.pms_inventory_id
          : row.material
      ),
      uom: toStr(row.uom ?? row.material?.uom_id),
      brand: toStr(row.brand ?? row.material?.pms_brand_id),
      colour: toStr(row.colour ?? row.material?.pms_colour_id),
      genericSpecification: toStr(
        row.genericSpecification ?? row.material?.pms_generic_info_id
      ),
    });

    const newKey = {
      materialType: toStr(formData.materialType),
      materialSubType: toStr(formData.materialSubType),
      material: toStr(formData.material),
      uom: toStr(formData.uom),
      brand: toStr(formData.brand),
      colour: toStr(formData.colour),
      genericSpecification: toStr(formData.genericSpecification),
    };

    const isDuplicate = tableData
      .filter((row) => !row._destroy)
      .some((row, index) => {
        if (editRowIndex !== null && index === editRowIndex) return false;
        const key = getRowKeyValues(row);
        return (
          key.materialType === newKey.materialType &&
          key.materialSubType === newKey.materialSubType &&
          key.material === newKey.material &&
          key.uom === newKey.uom &&
          key.brand === newKey.brand &&
          key.colour === newKey.colour &&
          key.genericSpecification === newKey.genericSpecification
        );
      });

    if (isDuplicate) {
      const duplicateMsg =
        "Duplicate material entry with same Type, Sub-Type, Material, UOM, Brand, Colour and Specification is not allowed.";
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
        prev.map((row, index) => {
          if (index === editRowIndex) {
            // Check if this is an existing material (has material object with API data)
            if (row.material && typeof row.material === 'object' && row.material.id) {
              // Update existing material - preserve the material object but update the labels
              return {
                ...row,
                materialTypeLabel: inventoryTypes2.find((opt) => opt.value === formData.materialType)?.label || "",
                materialSubTypeLabel: inventorySubTypes2.find((opt) => opt.value === formData.materialSubType)?.label || "",
                materialLabel: inventoryMaterialTypes2.find((opt) => opt.value === formData.material)?.label || "",
                genericSpecificationLabel: genericSpecifications.find((opt) => opt.value === formData.genericSpecification)?.label || "",
                colourLabel: colors.find((opt) => opt.value === formData.colour)?.label || "",
                brandLabel: inventoryBrands.find((opt) => opt.value === formData.brand)?.label || "",
                uomLabel: unitOfMeasures.find((opt) => opt.value === formData.uom)?.label || "",
                effectiveDate: formData.effectiveDate,
                // Update the material object with new values
                material: {
                  ...row.material,
                  pms_inventory_type_id: formData.materialType,
                  pms_inventory_sub_type_id: formData.materialSubType,
                  pms_inventory_id: formData.material,
                  pms_generic_info_id: formData.genericSpecification,
                  pms_colour_id: formData.colour,
                  pms_brand_id: formData.brand,
                  uom_id: formData.uom,
                }
              };
            } else {
              // Update new material - use the newRow structure
              return newRow;
            }
          }
          return row;
        })
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
    
    // Check if this is an existing material (has material object with API data)
    if (row.material && typeof row.material === 'object' && row.material.id) {
      // Existing material - extract values from the material object
    setFormData({
        materialType: row.material.pms_inventory_type_id || "",
        materialSubType: row.material.pms_inventory_sub_type_id || "",
        material: row.material.pms_inventory_id || "",
        genericSpecification: row.material.pms_generic_info_id || "",
        colour: row.material.pms_colour_id || "",
        brand: row.material.pms_brand_id || "",
        effectiveDate: row.effectiveDate || "",
        uom: row.material.uom_id || "",
      });
    } else {
      // New material - use the direct values
      setFormData({
        materialType: row.materialType || "",
        materialSubType: row.materialSubType || "",
        material: row.material || "",
        genericSpecification: row.genericSpecification || "",
        colour: row.colour || "",
        brand: row.brand || "",
        effectiveDate: row.effectiveDate || "",
        uom: row.uom || "",
      });
    }
    
    setEditRowIndex(index);
    setShowModal(true);
  };

  // const handleDeleteRow = (index) => {
  //   setTableData((prev) =>
  //     prev.map((row, i) =>
  //       i === index
  //         ? { ...row, _destroy: true } // Mark for deletion
  //         : row
  //     )
  //   );
  // };
  //   const handleDeleteRow = (index) => {
  //     // setTableData(
  //     //   (prev) => prev.filter((_, i) => i !== index) // Remove the row entirely, do not mark with _destroy
  //     // );
  //     setTableData(prev =>
  //   prev.map((row, i) =>
  //     i === index ? { ...row, _destroy: true } : row
  //   )
  // );
  //   };
  const handleDeleteRow = (index) => {
    // Soft-delete: mark row with _destroy so it is excluded from submission and views
    setTableData((prev) =>
      prev.map((row, i) => (i === index ? { ...row, _destroy: true } : row))
    );
  };

  // Handle submit button click
  const handleSubmitMaterials = async () => {
    console.log("Submit button clicked");
    console.log("tableData:", tableData);
    console.log("selectedCompany:", selectedCompany);
    console.log("URL param id:", id);
    console.log("purchaseOrderId state:", purchaseOrderId);

    // Simple test alert

    if (!selectedCompany) {
      toast.error("Please select a company.");
      return;
    }

    // Filter out deleted rows for validation
    const activeRows = tableData.filter((row) => !row._destroy);

    if (activeRows.length === 0) {
      toast.error("Please add at least one material before submitting.");
      return;
    }

    // Check if any row is missing a material
    const missingMaterial = activeRows.some((row) => !row.material);
    console.log("missingMaterial:", missingMaterial);
    if (missingMaterial) {
      toast.error("Please select a material for all rows before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Prepare materials array for API
    const materials =
      //  tableData.map((row) => {
      tableData
        .filter((row) => row) // Only include rows that exist (not deleted)
        .map((row) => {
          // Check if this is an existing material (has material object with id)
          if (
            row.material &&
            typeof row.material === "object" &&
            row.material.id
          ) {
            // Existing material - extract values from the material object with safe fallbacks
            return {
              id: row.material.id || row.id,
              pms_inventory_id:
                row.material.pms_inventory_id || row.material || row.materialId,
              unit_of_measure_id: row.material.uom_id || row.uom,
              pms_inventory_sub_type_id:
                row.material.pms_inventory_sub_type_id || row.materialSubType || null,
              pms_generic_info_id:
                row.material.pms_generic_info_id || row.genericSpecification || null,
              pms_colour_id: row.material.pms_colour_id || row.colour || null,
              pms_brand_id: row.material.pms_brand_id || row.brand || null,
              _destroy: row._destroy || false,
            };
          } else {
            // New material - use the direct values
            return {
              id: row.id, // Include ID for existing records
              pms_inventory_id: row.material,
              unit_of_measure_id: row.uom,
              pms_inventory_sub_type_id: row.materialSubType || null,
              pms_generic_info_id: row.genericSpecification || null,
              pms_colour_id: row.colour || null,
              pms_brand_id: row.brand || null,
              _destroy: row._destroy || false, // Include destroy flag
            };
          }
        });

    console.log("Processed materials for API:", materials);

    const payload = {
      company_id: selectedCompany.value,
      materials: materials,
    };

    // Add po_id if we have a purchase order ID (either from URL params for existing PO or from previous submission)
    const poIdToUse = id || purchaseOrderId; // Use URL param id first, then fallback to purchaseOrderId
    if (poIdToUse) {
      payload.po_id = poIdToUse;
      console.log("Including po_id in payload:", poIdToUse);
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
          // Keep displaying the user's current tableData (labels preserved)
          // and only store API-returned materials separately for calculations/rates
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

        toast.success("Materials submitted successfully!");
        // Refresh page data and then change tab to Rate & Taxes
        await refetchPurchaseOrderData();
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

  // Tax modal functions
  const handleOpenTaxModal = async (rowIndex) => {
    console.log("Opening tax modal for row:", rowIndex);
    console.log("Current tax options:", taxOptions);
    setTableId(rowIndex);
    setShowTaxModal(true);

    // Get the material from combined materials (both existing and submitted)
    const combinedMaterials = getCombinedMaterials();
    const material = combinedMaterials[rowIndex];

    console.log("Selected material for tax modal:", material);

    if (material && material.id) {
      try {
        // For existing materials from API, use the material.id directly
        // For submitted materials, use material.id as well
        const materialId = material.id;
        console.log("Fetching rate details for material ID:", materialId);
        const response = await axios.get(
          `${baseURL}po_mor_inventories/${materialId}/ropo_rate_details.json?token=${token}`
        );

        console.log("Rate details API response:", response.data);

        // Map the API response to our tax data structure
        const rateData = response.data;
        console.log("Processing rate data for material:", material.material);
        setTaxRateData((prev) => ({
          ...prev,
          [rowIndex]: {
            material: rateData.material_name,
            hsnCode: rateData.hsn_code,
            ratePerNos: rateData.rate_per_nos?.toString(),
            totalPoQty: rateData.order_qty?.toString(),
            discount: rateData.discount_per?.toString(),
            materialCost: rateData.material_cost?.toString(),
            discountRate: rateData.discount_rate?.toString(),
            afterDiscountValue: rateData.after_discount_value?.toString(),
            remark: rateData.remarks || "",
            isedit: !!rateData.isedit,

            netCost: rateData.total_material_cost?.toString(),
            pms_inventory_id: rateData.pms_inventory_id || null, // Store pms_inventory_id
            addition_bid_material_tax_details:
              rateData.addition_tax_details?.map((tax) => ({
                id: tax.id,
                resource_id: tax.resource_id,
                tax_category_id: tax.tax_category_id,
                taxChargeType:
                  taxOptions.find((option) => option.id === tax.tax_category_id)
                    ?.value || tax.resource_type,
                taxType: tax.resource_type, // Set taxType based on API response
                taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                percentageId: tax.percentage_id || null, // Add percentageId from API response
                inclusive: tax.inclusive,
                amount: tax.amount?.toString() || "0",
              })) || [],
            deduction_bid_material_tax_details:
              rateData.deduction_tax_details?.map((tax) => ({
                id: tax.id,
                resource_id: tax.resource_id,
                tax_category_id: tax.tax_category_id,
                taxChargeType:
                  deductionTaxOptions.find(
                    (option) => option.id === tax.tax_category_id
                  )?.value || tax.resource_type,
                taxType: tax.resource_type, // Set taxType based on API response
                taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                percentageId: tax.percentage_id || null, // Add percentageId from API response
                inclusive: tax.inclusive,
                amount: tax.amount?.toString() || "0",
              })) || [],
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
      // Fallback if no material data or new material without ID
      console.log(
        "No material ID found, opening modal with empty data for new material"
      );
      if (!taxRateData[rowIndex]) {
        setTaxRateData((prev) => ({
          ...prev,
          [rowIndex]: {
            material: material?.material || "Sample Material",
            hsnCode: "",
            ratePerNos: "",
            totalPoQty: "",
            discount: "",
            materialCost: "",
            discountRate: "",
            afterDiscountValue: "",
            remark: "",
            netCost: "",
            pms_inventory_id: material?.material_inventory_id || null,
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
    setTaxRateData((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [type === "addition"
          ? "addition_bid_material_tax_details"
          : "deduction_bid_material_tax_details"]: prev[rowIndex][
          type === "addition"
            ? "addition_bid_material_tax_details"
            : "deduction_bid_material_tax_details"
        ].map((item) =>
          item.id === id
            ? { ...item, _destroy: true } // Mark for deletion
            : item
        ),
      },
    }));
  };

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

          // Handle different tax types
          if (field === "taxChargeType") {
            // Find the selected tax option to determine type
            const selectedTaxOption =
              type === "addition"
                ? taxOptions.find((option) => option.value === value)
                : deductionTaxOptions.find((option) => option.value === value);

            // Set the tax type for later reference
            currentTax.taxType = selectedTaxOption?.type || "TaxCharge";
            currentTax[field] = value;

            // Clear amount when tax type changes
            currentTax.amount = "0";
            currentTax.taxChargePerUom = "";
            currentTax.percentageId = null; // Clear percentage ID
          } else if (field === "taxChargePerUom") {
            // Auto-calculate amount based on tax type
            currentTax[field] = value;

            // Find the percentage ID from materialTaxPercentages
            if (value && value.includes("%")) {
              const percentage = parseFloat(value.replace("%", "")) || 0;
              const percentages = materialTaxPercentages[currentTax.id] || [];
              const percentageData = percentages.find(
                (p) => p.percentage === percentage
              );
              currentTax.percentageId = percentageData?.id || null;

              console.log("Setting percentageId for tax:", {
                taxId: currentTax.id,
                taxType: type,
                percentage: percentage,
                percentageData: percentageData,
                percentageId: currentTax.percentageId,
              });
            }

            if (currentTax.taxChargeType) {
              const baseAmount =
                parseFloat(updatedData[rowIndex]?.afterDiscountValue) || 0;
              let calculatedAmount = 0;

              // Check if it's a percentage-based tax (TaxCategory)
              if (value && value.includes("%")) {
                const percentage = parseFloat(value.replace("%", "")) || 0;
                calculatedAmount = (baseAmount * percentage) / 100;
              } else if (value && !isNaN(parseFloat(value))) {
                // Fixed amount (TaxCharge)
                calculatedAmount = parseFloat(value) || 0;
              }

              currentTax.amount = calculatedAmount.toString();
            }
          } else if (field === "amount") {
            // Handle direct amount input for TaxCharge type, non-negative only
            const parsed = parseFloat(value);
            const nonNegative = isNaN(parsed) ? 0 : Math.max(0, parsed);
            currentTax[field] = nonNegative.toString();

            // For TaxCategory, amount is auto-calculated from percentage
            if (
              currentTax.taxType === "TaxCategory" &&
              currentTax.taxChargePerUom
            ) {
              const baseAmount =
                parseFloat(updatedData[rowIndex]?.afterDiscountValue) || 0;
              const percentage =
                parseFloat(currentTax.taxChargePerUom.replace("%", "")) || 0;
              const calculatedAmount = (baseAmount * percentage) / 100;
              currentTax.amount = calculatedAmount.toString();
            }
          } else {
            // Handle other fields (inclusive, etc.)
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

          // Recalculate net cost only if there are changes
          if (taxIndex !== -1) {
            const newNetCost = calculateNetCostWithTaxes(
              updatedData[rowIndex]?.afterDiscountValue || 0,
              updatedData[rowIndex]?.addition_bid_material_tax_details || [],
              updatedData[rowIndex]?.deduction_bid_material_tax_details || []
            );

            updatedData[rowIndex].netCost = newNetCost.toString();
          }
        }

        return updatedData;
      });
    },
    [taxOptions]
  );

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
      // Ensure percentageId is set for percentage-based taxes before saving
      const resolvePercentageIds = (data) => {
        if (!data) return data;
        const updateList = (list) =>
          (list || []).map((taxItem) => {
            // If percentageId missing but percentage value present, resolve from cached percentages
            if (
              (!taxItem.percentageId || taxItem.percentageId === null) &&
              taxItem.taxChargePerUom &&
              typeof taxItem.taxChargePerUom === "string" &&
              taxItem.taxChargePerUom.includes("%")
            ) {
              const numeric = parseFloat(
                taxItem.taxChargePerUom.replace("%", "")
              );
              const available = materialTaxPercentages[taxItem.id] || [];
              const match = available.find(
                (p) => parseFloat(p.percentage) === numeric
              );
              if (match && match.id) {
                return { ...taxItem, percentageId: match.id };
              }
            }
            return taxItem;
          });

        return {
          ...data,
          addition_bid_material_tax_details: updateList(
            data.addition_bid_material_tax_details
          ),
          deduction_bid_material_tax_details: updateList(
            data.deduction_bid_material_tax_details
          ),
        };
      };

      const currentData = resolvePercentageIds(taxRateData[tableId]);
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
            const payload = {
              resource_type: tax.taxType || "TaxCharge",
              resource_id:
                tax.percentageId ||
                taxOptions.find((option) => option.value === tax.taxChargeType)
                  ?.id ||
                tax.resource_id,
              amount: parseFloat(tax.amount) || 0,
              inclusive: tax.inclusive || false,
              addition: true,
              remarks: `${tax.taxChargeType} - ${tax.amount}`,
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

            const payload = {
              resource_type: tax.taxType || "TaxCharge",
              resource_id:
                tax.percentageId ||
                deductionTaxOptions.find(
                  (option) => option.value === tax.taxChargeType
                )?.id ||
                tax.resource_id,
              amount: parseFloat(tax.amount) || 0,
              inclusive: tax.inclusive || false,
              addition: false,
              remarks: `${tax.taxChargeType} - ${tax.amount}`,
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
                responseData.addition_tax_details?.map((tax) => ({
                  id: tax.id,
                  resource_id: tax.resource_id,
                  taxChargeType:
                    taxOptions.find((option) => option.id === tax.tax_category_id)
                      ?.value || "",
                  taxType: tax.resource_type,
                  taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
                })) || currentData.addition_bid_material_tax_details,
              deduction_bid_material_tax_details:
                responseData.deduction_tax_details?.map((tax) => ({
                  id: tax.id,
                  resource_id: tax.resource_id,
                  taxChargeType:
                    deductionTaxOptions.find(
                      (option) => option.id === tax.tax_category_id
                    )?.value || "",
                  taxType: tax.resource_type,
                  taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
                })) || currentData.deduction_bid_material_tax_details,
            },
          }));
          

          toast.success("Tax changes saved successfully!");
          // Reflect saved values into Rate & Taxes table row
          try {
            const mappedValues = {
              material_rate: responseData.rate_per_nos ?? "",
              discount_percentage: responseData.discount_per ?? "",
              discount_rate: responseData.discount_rate ?? "",
              material_cost: responseData.material_cost ?? "",
              after_discount_value: responseData.after_discount_value ?? "",
              total_base_cost: responseData.tax_applicable_cost ?? "",
              all_inclusive_cost: responseData.total_material_cost ?? "",
            };

            const rateLen = Array.isArray(rateAndTaxes) ? rateAndTaxes.length : 0;
            if (tableId < rateLen) {
              setRateAndTaxes((prev) =>
                prev.map((item, idx) => (idx === tableId ? { ...item, ...mappedValues } : item))
              );
            } else {
              const submittedIndex = tableId - rateLen;
              setSubmittedMaterials((prev) =>
                prev.map((m, idx) => (idx === submittedIndex ? { ...m, ...mappedValues } : m))
              );
            }
          } catch (e) {
            console.error("Error updating Rate & Taxes row:", e);
          }
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
          `${baseURL}rfq/events/taxes_dropdown?token=${token}`
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
        setTaxOptions([
          { value: "CGST", label: "CGST", id: 19, type: "TaxCategory" },
          { value: "SGST", label: "SGST", id: 18, type: "TaxCategory" },
          { value: "IGST", label: "IGST", id: 20, type: "TaxCategory" },
          {
            value: "Handling Charges",
            label: "Handling Charges",
            id: 2,
            type: "TaxCharge",
          },
          {
            value: "Other charges",
            label: "Other charges",
            id: 4,
            type: "TaxCharge",
          },
          { value: "Freight", label: "Freight", id: 5, type: "TaxCharge" },
        ]);
      }
    };

    const fetchDeductionTaxOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
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
        setTermsConditions([
          {
            id: 10,
            condition: "the order should be delivered before delivery date",
            condition_category_name: "validity",
          },
          {
            id: 9,
            condition: "aa",
            condition_category_name: "as",
          },
        ]);
        setConditionCategories(["validity", "as"]);
      }
    };

    fetchTermsConditions();
  }, []);

  // Fetch material term conditions when submitted materials change
  useEffect(() => {
    const fetchMaterialTermConditions = async () => {
      try {
        // Get material IDs from submitted materials
        console.log(
          "submittedMaterials for term conditions:",
          submittedMaterials
        );
        const materialIds = submittedMaterials
          .map((material) => material.id)
          .join(",");

        if (materialIds) {
          const response = await axios.get(
            `${baseURL}po_mor_inventories/material_term_conditions.json?po_mor_inventory_ids=${materialIds}&token=${token}`
          );
          console.log("Material term conditions response:", response.data);
          // If API returns { material_term_conditions: [...] }
          setMaterialTermConditions(
            Array.isArray(response.data)
              ? response.data
              : response.data.material_term_conditions || []
          );
        } else {
          setMaterialTermConditions([]);
        }
      } catch (error) {
        console.error("Error fetching material term conditions:", error);
        setMaterialTermConditions([]);
      }
    };

    fetchMaterialTermConditions();
  }, [submittedMaterials]);

  // Fetch charges taxes data on component mount
  useEffect(() => {
    fetchChargesAdditionTaxes();
    fetchChargesDeductionTaxes();
    fetchChargesTaxPercentages();
  }, []);

  // Re-populate charges when charge names are available
  useEffect(() => {
    if (chargeNames.length > 0 && purchaseOrderData?.charges_with_taxes) {
      console.log("Re-populating charges with available charge names");

      const formattedCharges = purchaseOrderData.charges_with_taxes.map(
        (charge) => {
          // Find the charge name by charge_id
          const chargeNameObj = chargeNames.find(
            (cn) => cn.id === charge.charge_id
          );
          const chargeName = chargeNameObj
            ? chargeNameObj.name
            : charge.charge_id?.toString() || "";

          console.log(
            `Re-mapping charge_id ${charge.charge_id} to charge name: ${chargeName}`
          );

          return {
            id: charge.id || Date.now(),
            charge_name: chargeName,
            charge_id: charge.charge_id || 0,
            amount: charge.amount?.toString() || "",
            realised_amount: charge.realised_amount?.toString() || "",
            taxes: {
              additionTaxes:
                charge.taxes_and_charges
                  ?.filter((tax) => tax.addition)
                  .map((tax) => ({
                    id: tax.id || Date.now(),
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  })) || [],
              deductionTaxes:
                charge.taxes_and_charges
                  ?.filter((tax) => !tax.addition)
                  .map((tax) => ({
                    id: tax.id || Date.now(),
                    taxType: tax.resource_id?.toString() || "",
                    taxPercentage: tax.percentage?.toString() || "",
                    inclusive: tax.inclusive || false,
                    amount: tax.amount?.toString() || "0",
                  })) || [],
              netCost: charge.realised_amount?.toString() || "0",
            },
          };
        }
      );

      console.log("Re-formatted charges:", formattedCharges);
      setCharges(formattedCharges);
    }
  }, [chargeNames, purchaseOrderData]);
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

  // Convert dates like "13/08/2025,  5:43 PM" or ISO strings to
  // input[type="datetime-local"] format: YYYY-MM-DDTHH:MM:SS
  const formatToLocalDateTimeInput = (input) => {
    if (!input) return "";

    const toInputDateTimeLocal = (date) => {
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const mi = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
    };

    // If ISO-like, let Date parse
    if (input.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(input)) {
      const d = new Date(input);
      if (!isNaN(d.getTime())) return toInputDateTimeLocal(d);
    }

    try {
      // Expect format dd/mm/yyyy, hh:mm AM/PM (with possible extra spaces)
      const [datePartRaw = "", timePartFullRaw = ""] = input.split(",");
      const datePart = datePartRaw.trim();
      const timeFull = timePartFullRaw.trim().replace(/\s+/g, " ");

      const [dd, mm, yyyy] = datePart.split("/").map((s) => s.trim());
      if (!dd || !mm || !yyyy) return "";

      const [timePart = "", ampmRaw = ""] = timeFull.split(" ");
      const [hhStr = "0", minStr = "0", ssStr = "0"] = timePart.split(":");
      let hour = parseInt(hhStr, 10);
      const minute = parseInt(minStr, 10) || 0;
      const second = parseInt(ssStr, 10) || 0;
      const ampm = ampmRaw.toUpperCase();

      if (ampm === "PM" && hour < 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;

      const pad = (n) => String(n).padStart(2, "0");
      return `${yyyy}-${pad(parseInt(mm, 10))}-${pad(parseInt(dd, 10))}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
    } catch (e) {
      return "";
    }
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
        doc_path: "",
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
                doc_path: "",
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

  // const attachmentsPayload = attachments.flatMap(
  //   (att) => att.attachments || []
  // );
  const attachmentsPayload = attachments.flatMap((att) => {
    // Existing attachment (from API)
    if (att.isExisting) {
      const payload = {};
      if (att.id) payload.id = att.id;
      // If user edited the fileName, pass it as document_file_name
      if (att.fileName && att.fileName.trim() !== "") {
        payload.document_file_name = att.fileName.trim();
      }
      // Only include payload object if it has some keys (id or document_file_name)
      return Object.keys(payload).length > 0 ? [payload] : [];
    }

    // New attachment: use first item of attachments array
    const first = (att.attachments || [])[0];
    if (!first) return [];
    return [
      {
        filename: first.filename,
        content: first.content,
        content_type: first.content_type,
        document_file_name: att.fileName && att.fileName.trim() !== "" ? att.fileName.trim() : first.document_file_name || first.filename,
      },
    ];
  });

  console.log("attachments:", attachmentsPayload);
  // document secttion

  // terms and condtion section
  // ...existing code...
  const [generalTerms, setGeneralTerms] = useState([]);

  // Add new row to terms and conditions
  const addTermsConditionRow = () => {
    const newRow = {
      // No ID for new records - let the API generate it
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

  // Calculate discount rate based on rate per nos and discount percentage
  // Calculate discount rate based on rate per nos and discount percentage
  const calculateDiscountRate = (ratePerNos, discountPercentage) => {
    const rate = parseFloat(ratePerNos) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    // Correct calculation: Discount Rate = Rate per Nos - (Rate per Nos * Discount % / 100)
    return Math.max(0, rate - (rate * discount) / 100);
  };

  // Calculate material cost based on rate per nos and total PO qty
  const calculateMaterialCost = (ratePerNos, totalPoQty) => {
    const rate = parseFloat(ratePerNos) || 0;
    const qty = parseFloat(totalPoQty) || 0;
    return rate * qty;
  };

  // Calculate after discount value based on material cost and discount percentage
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

    // Add addition taxes/charges
    additionTaxes.forEach((tax) => {
      if (tax.amount) {
        const amount = parseFloat(tax.amount) || 0;
        netCost += amount;
      }
    });

    // Subtract deduction taxes/charges
    deductionTaxes.forEach((tax) => {
      if (tax.amount) {
        const amount = parseFloat(tax.amount) || 0;
        netCost -= amount;
      }
    });

    return Math.max(0, netCost);
  };

  // Handle rate per nos change with automatic discount rate calculation
  const handleRatePerNosChange = useCallback(
    (value) => {
      // Disallow negatives
      const numeric = parseFloat(value);
      const safeRatePerNos = isNaN(numeric) ? 0 : Math.max(0, numeric);
      const currentData = taxRateData[tableId];
      if (!currentData) return;

      const discountPercentage = parseFloat(currentData.discount) || 0;
      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newDiscountRate = calculateDiscountRate(safeRatePerNos, discountPercentage);
      const newMaterialCost = calculateMaterialCost(safeRatePerNos, totalPoQty);
      const newAfterDiscountValue = calculateAfterDiscountValue(
        newMaterialCost,
        discountPercentage
      );

      setTaxRateData((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          ratePerNos: safeRatePerNos.toString(),
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
      // Clamp between 0 and 100
      const parsed = parseFloat(value);
      const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
      const currentData = taxRateData[tableId];
      if (!currentData) return;

      const ratePerNos = parseFloat(currentData.ratePerNos) || 0;
      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newDiscountRate = calculateDiscountRate(ratePerNos, clamped);
      const newMaterialCost = calculateMaterialCost(ratePerNos, totalPoQty);
      const newAfterDiscountValue = calculateAfterDiscountValue(
        newMaterialCost,
        clamped
      );

      setTaxRateData((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          discount: clamped.toString(),
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
  const fetchTaxPercentagesByMaterial = async (
    pmsInventoryId,
    taxCategoryId
  ) => {
    try {
      const response = await axios.get(
        `${baseURL}tax_percentage_by_material.json?pms_inventory_id=${pmsInventoryId}&tax_category_id=${taxCategoryId}&token=${token}`
      );
      console.log("Tax percentages by material response:", response.data);
      console.log("Percentages array:", response.data.percentages);
      return response.data.percentages || [];
    } catch (error) {
      console.error("Error fetching tax percentages by material:", error);
      return [];
    }
  };

  // Handle terms form input changes
  const handleTermsFormChange = (field, value) => {
    // Clamp non-negative for specific numeric fields
    const nonNegativeFields = [
      "creditPeriod",
      "poValidityPeriod",
      "advanceReminderDuration",
    ];
    let nextValue = value;
    if (nonNegativeFields.includes(field)) {
      const parsed = parseFloat(value);
      nextValue = isNaN(parsed) ? "" : Math.max(0, parsed).toString();
    }
    setTermsFormData((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  // Handle charges functions
  const addCharge = () => {
    const newCharge = {
      // No ID for new records - let the API generate it
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
      // No ID for new records - let the API generate it
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
    setOtherCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, [field]: value } : cost))
    );
  };
  // ...existing code...
    const calculateNetCostForTaxes = (baseCost, additionTaxes, deductionTaxes) => {
    const additionTotal = (additionTaxes || []).reduce((sum, tax) => {
      return sum + (parseFloat(tax.amount) || 0);
    }, 0);

    const deductionTotal = (deductionTaxes || []).reduce((sum, tax) => {
      return sum + (parseFloat(tax.amount) || 0);
    }, 0);

    // Formula: Net Cost = Base Cost + Addition Taxes - Deduction Taxes
    return baseCost + additionTotal - deductionTotal;
  };

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

    // Load previously saved tax data if it exists
    const savedTaxes = item?.taxes || {
      additionTaxes: [],
      deductionTaxes: [],
      netCost: baseCost.toFixed(2),
    };

       const initialNetCost = calculateNetCostForTaxes(
      baseCost,
      savedTaxes.additionTaxes,
      savedTaxes.deductionTaxes
    );

    setChargeTaxes({
      additionTaxes: savedTaxes.additionTaxes || [],
      deductionTaxes: savedTaxes.deductionTaxes || [],
      baseCost: baseCost,
      // netCost: savedTaxes.netCost || baseCost.toFixed(2),
        netCost: initialNetCost.toFixed(2),
    });
    setShowTaxesModal(true);
  };

  const handleCloseTaxesModal = () => {
    setShowTaxesModal(false);
    setSelectedChargeId(null);
    setSelectedItemType(null);
    // Don't reset chargeTaxes to preserve data for reopening
  };

  const addTaxRow = (type) => {
    const newTax = {
      // No ID for new records - let the API generate it
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

        // // Calculate net cost
        // const additionTotal = updatedAdditionTaxes.reduce((sum, tax) => {
        //   return sum + (parseFloat(tax.amount) || 0);
        // }, 0);

        // const deductionTotal = prev.deductionTaxes.reduce((sum, tax) => {
        //   return sum + (parseFloat(tax.amount) || 0);
        // }, 0);

        // const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;
          const netCost = calculateNetCostForTaxes(
          chargeTaxes.baseCost,
          updatedAdditionTaxes,
          prev.deductionTaxes
        );

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
        // const additionTotal = prev.additionTaxes.reduce((sum, tax) => {
        //   return sum + (parseFloat(tax.amount) || 0);
        // }, 0);

        // const deductionTotal = updatedDeductionTaxes.reduce((sum, tax) => {
        //   return sum + (parseFloat(tax.amount) || 0);
        // }, 0);

        // const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;
         const netCost = calculateNetCostForTaxes(
          chargeTaxes.baseCost,
          prev.additionTaxes,
          updatedDeductionTaxes
        );

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

  // Get percentages for specific tax category
  const getChargesTaxPercentages = (taxCategoryId) => {
    const taxData = chargesTaxPercentages.find(
      (tax) => tax.tax_category_id === parseInt(taxCategoryId)
    );
    return taxData ? taxData.percentage : [];
  };

  // Handle purchase order update
  const handleUpdatePurchaseOrder = async () => {
    try {
      setIsUpdatingOrder(true);
      setLoading2(true);

      // Validate required fields
      if (!selectedCompany?.value) {
        toast.error("Please select a company.");
        setIsUpdatingOrder(false);
        return;
      }

      if (!selectedSupplier?.value) {
        toast.error("Please select a supplier.");
        setIsUpdatingOrder(false);
        return;
      }

      // Get material inventory IDs from submitted materials
      const materialInventoryIds = submittedMaterials.map(
        (material) => material.id
      );

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

      // Prepare the payload based on the structure you provided
      const payload = {
        purchase_order: {
          status: "draft",
          credit_period: termsFormData.creditPeriod ? parseInt(termsFormData.creditPeriod) : null,
          po_validity_period: termsFormData.poValidityPeriod ? parseInt(termsFormData.poValidityPeriod) : null,
          advance_reminder_duration: termsFormData.advanceReminderDuration ? parseInt(termsFormData.advanceReminderDuration) : null,
          payment_terms: termsFormData.paymentTerms || null,
          payment_remarks: termsFormData.paymentRemarks || null,
          supplier_advance: termsFormData.supplierAdvance ? parseFloat(termsFormData.supplierAdvance) : null,
          supplier_advance_amount: termsFormData.supplierAdvanceAmount ? parseFloat(termsFormData.supplierAdvanceAmount) : null,
          survice_certificate_advance: termsFormData.surviceCertificateAdvance ? parseFloat(termsFormData.surviceCertificateAdvance) : null,
          total_value: null,
          total_discount: null,
          po_date: getLocalDateTime().split("T")[0], // Current date
          company_id: selectedCompany?.value,
          po_type: "ropo",
          supplier_id: selectedSupplier?.value,
          remark: termsFormData.remark || "",
          comments: termsFormData.comments || "",
          material_inventory_ids: apiMaterialInventoryIds,

          // Include purchase order ID if available (for updates)
          ...(purchaseOrderId && { po_id: purchaseOrderId }),

          // Format other cost details with taxes
          other_cost_details_attributes: otherCosts.map((cost) => {
            const costPayload = {
              cost_type: cost.cost_name || null,
              cost: cost.amount ? parseFloat(cost.amount) : null,
              scope: cost.scope || null,
              taxes_and_charges_attributes: [
                ...(cost.taxes?.additionTaxes || []).map((tax) => {
                  const taxPayload = {
                    resource_id: tax.taxType ? parseInt(tax.taxType) : null,
                    resource_type: "TaxCategory",
                    percentage: tax.taxPercentage ? parseFloat(tax.taxPercentage.replace("%", "")) : null,
                    inclusive: tax.inclusive || false,
                    amount: tax.amount ? parseFloat(tax.amount) : null,
                    addition: true,
                  };
                  // Only include ID if it exists and is not undefined/null
                  if (tax.id) {
                    taxPayload.id = tax.id;
                  }
                  return taxPayload;
                }),
                ...(cost.taxes?.deductionTaxes || []).map((tax) => {
                  const taxPayload = {
                    resource_id: tax.taxType ? parseInt(tax.taxType) : null,
                    resource_type: "TaxCategory",
                    percentage: tax.taxPercentage ? parseFloat(tax.taxPercentage.replace("%", "")) : null,
                    inclusive: tax.inclusive || false,
                    amount: tax.amount ? parseFloat(tax.amount) : null,
                    addition: false,
                  };
                  // Only include ID if it exists and is not undefined/null
                  if (tax.id) {
                    taxPayload.id = tax.id;
                  }
                  return taxPayload;
                }),
              ],
            };
            // Only include ID if it exists and is not undefined/null
            if (cost.id) {
              costPayload.id = cost.id;
            }
            return costPayload;
          }),

          // Format charges with taxes
          charges_with_taxes_attributes: charges.map((charge) => {
            const chargePayload = {
              charge_id: charge.charge_id || null,
              amount: charge.amount ? parseFloat(charge.amount) : null,
              realised_amount: charge.realised_amount ? parseFloat(charge.realised_amount) : null,
              taxes_and_charges_attributes: [
                ...(charge.taxes?.additionTaxes || []).map((tax) => {
                  const taxPayload = {
                    resource_id: tax.taxType ? parseInt(tax.taxType) : null,
                    resource_type: "TaxCategory",
                    percentage: tax.taxPercentage ? parseFloat(tax.taxPercentage.replace("%", "")) : null,
                    inclusive: tax.inclusive || false,
                    amount: tax.amount ? parseFloat(tax.amount) : null,
                    addition: true,
                  };
                  // Only include ID if it exists and is not undefined/null
                  if (tax.id) {
                    taxPayload.id = tax.id;
                  }
                  return taxPayload;
                }),
                ...(charge.taxes?.deductionTaxes || []).map((tax) => {
                  const taxPayload = {
                    resource_id: tax.taxType ? parseInt(tax.taxType) : null,
                    resource_type: "TaxCategory",
                    percentage: tax.taxPercentage ? parseFloat(tax.taxPercentage.replace("%", "")) : null,
                    inclusive: tax.inclusive || false,
                    amount: tax.amount ? parseFloat(tax.amount) : null,
                    addition: false,
                  };
                  // Only include ID if it exists and is not undefined/null
                  if (tax.id) {
                    taxPayload.id = tax.id;
                  }
                  return taxPayload;
                }),
              ],
            };
            // Only include ID if it exists and is not undefined/null
            if (charge.id) {
              chargePayload.id = charge.id;
            }
            return chargePayload;
          }),

          // Resource term conditions
          // resource_term_conditions_attributes: Array.isArray(termsConditions)
          //   ? termsConditions.map((term) => ({
          //       term_condition_id: term.term_condition_id,
          //       condition_category: term.condition_category,
          //       condition: term.condition,
          //     }))
          //   : [],
          // resource_term_conditions_attributes: Array.isArray(generalTerms)
          //   ? generalTerms
          //       .filter((row) => row.category && row.condition) // Only include filled rows
          //       .map((row) => {
          //         // Find the term in termsConditions that matches the selected category
          //         const term = termsConditions.find(
          //           (t) => t.condition_category_name === row.category
          //         );
          //         if (term) {
          //           const termPayload = {
          //             term_condition_id: term.id,
          //             condition_type: "general",
          //             // Optionally, you can also send the condition text if your API expects it:
          //             // condition: row.condition,
          //           };
          //           // Only include ID if it exists and is not undefined/null
          //           if (row.id) {
          //             termPayload.id = row.id;
          //           }
          //           return termPayload;
          //         }
          //         return null;
          //       })
          //       .filter(Boolean) // Remove any nulls if no match found
          //   : [],

          // resource_term_conditions_attributes: Array.isArray(generalTerms)
          //   ? // ? generalTerms
          //     //     .filter((row) => row.category && row.condition)
          //     generalTerms
          //       .filter((row) => {
          //         // Keep rows that are either valid for creation/update OR are marked for deletion
          //         return (row.category && row.condition) || row._destroy;
          //       })
          //       .map((row) => {
          //         // Find the term in termsConditions that matches the selected category
          //         const term = termsConditions.find(
          //           (t) => t.condition_category_name === row.category
          //         );
          //         if (term) {
          //           const termPayload = {
          //             term_condition_id: term.id,
          //             condition_type: "general",
          //             // Only include ID if it exists, is not undefined/null, and is not a random (new) ID
          //             // Only pass id if it is from API (assume API IDs are less than 10 digits)
          //           };
          //           if (row.id && row.id.toString().length < 10) {
          //             termPayload.id = row.id;
          //           }
          //           if (row._destroy) {
          //             termPayload.destroy = true;
          //             return termPayload;
          //           }

          //           // For normal create/update, set term_condition_id
          //           if (term) {
          //             termPayload.term_condition_id = term.id;
          //           }
          //           return termPayload;
          //         }
          //         return null;
          //       })
          //       .filter(Boolean)
          //   : [],
          resource_term_conditions_attributes: Array.isArray(generalTerms)
            ? generalTerms
                .filter((row) => {
                  // Keep rows that are valid for create/update OR are marked for deletion
                  return (row.category && row.condition) || row._destroy;
                })
                .map((row) => {
                  // Find matching term from API data
                  const term = termsConditions.find(
                    (t) => t.condition_category_name === row.category
                  );

                  const termPayload = {
                    condition_type: "general",
                  };

                  // Pass existing DB id only if it's a real API id (shorter than 10 digits)
                  if (row.id && row.id.toString().length < 10) {
                    termPayload.id = row.id;
                  }

                  // If marked for deletion
                  if (row._destroy) {
                    termPayload._destroy = true;
                    return termPayload; // Only send id + _destroy (and condition_type)
                  }

                  // For create/update, set the term_condition_id
                  if (term) {
                    termPayload.term_condition_id = term.id;
                  }

                  return termPayload;
                })
                .filter(Boolean)
            : [],

          // Resource material term conditions
          // ...existing code...
          // resource_material_term_conditions_attributes: Array.isArray(
          //   materialTermConditions
          // )
          //   ? materialTermConditions.map((term) => {
          //       const termPayload = {
          //         // Always send the correct term_condition_id (not id)
          //         term_condition_id: term.term_condition_id,
          //         material_sub_type: term.material_sub_type,
          //         condition_category: term.condition_category,
          //         condition: term.condition,
          //       };

          //       // Only include the record id if it is a real API id (not a term_condition_id)
          //       // Usually, API ids are short (e.g. < 10 digits), and term_condition_id is always required
          //       if (
          //         term.id &&
          //         term.id !== term.term_condition_id && // Don't send if id is same as term_condition_id
          //         term.id.toString().length < 10 // Only include if it's a real DB id
          //       ) {
          //         termPayload.id = term.id;
          //       }

          //       return termPayload;
          //     })
          //   : [],
          // ...existing code...

          resource_material_term_conditions_attributes: Array.isArray(
            materialTermConditions
          )
            ? materialTermConditions
                .filter((term) => {
                  // Keep normal rows OR ones marked for deletion
                  return (
                    (term.term_condition_id &&
                      term.material_sub_type &&
                      term.condition_category &&
                      term.condition) ||
                    term._destroy
                  );
                })
                .map((term) => {
                  const termPayload = {
                    term_condition_id: term.term_condition_id,
                    material_sub_type: term.material_sub_type,
                    condition_category: term.condition_category,
                    condition: term.condition,
                  };

                  // If this is from DB, pass its real id
                  if (
                    term.id &&
                    term.id !== term.term_condition_id &&
                    term.id.toString().length < 10
                  ) {
                    termPayload.id = term.id;
                  }

                  // If deleted, mark with _destroy
                  if (term._destroy) {
                    termPayload._destroy = true;
                  }

                  return termPayload;
                })
            : [],

          attachments: attachmentsPayload || [],

          // Attachments
          // attachments: Array.isArray(attachments)
          //   ? attachments.map((attachment) => ({
          //       filename: attachment.filename,
          //       document_name: attachment.document_name,
          //       content: attachment.content,
          //       content_type: attachment.content_type,
          //     }))
          //   : [],
        },
      };

      console.log("Updating purchase order with payload:", payload);
      console.log("Purchase Order ID:", id);
      console.log(
        "API URL:",
        `${baseURL}purchase_orders/${id}.json?token=${token}`
      );

      const response = await axios.patch(
        `${baseURL}purchase_orders/${id}.json?token=${token}`,
        payload
      );

      console.log("Purchase order updated successfully:", response.data);
      toast.success("Purchase order updated successfully!", {
        autoClose: 1500,
        onClose: () => navigate(`/po-list?token=${token}`),
      });

      // Optionally redirect to PO list after successful update
      // window.location.href = '/po-list'; // Uncomment to redirect
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error("Error updating purchase order. Please try again.");
    } finally {
      setIsUpdatingOrder(false);
      setLoading2(false);
    }
  };

  // ...existing code...

  const handleAddMaterial = (newMaterial) => {
    setMaterialDetails((prev) => [...prev, newMaterial]);
  };

  const handleUpdateMaterial = (index, updatedMaterial) => {
    setMaterialDetails((prev) =>
      prev.map((mat, idx) => (idx === index ? updatedMaterial : mat))
    );
  };

  // Function to get combined materials (prepopulated + submitted)
  const getCombinedMaterials = () => {
    const combined = [];

    console.log("rateAndTaxes:", rateAndTaxes);
    console.log("submittedMaterials:", submittedMaterials);

    // Add prepopulated rate and taxes data
    if (rateAndTaxes && rateAndTaxes.length > 0) {
      // Exclude any materials flagged as _destroy in current tableData mapping
      const deletedIds = new Set(
        tableData
          .filter((row) => row._destroy)
          .map((row) => row.material_inventory_id || row.material?.pms_inventory_id)
          .filter(Boolean)
      );

      combined.push(
        ...rateAndTaxes.filter(
          (rate) =>
            !deletedIds.has(rate.material_inventory_id) &&
            // also ensure not marked _destroy on rate if present
            !rate._destroy
        )
      );
      console.log("Added prepopulated data:", rateAndTaxes.length, "items");
    }

    // Add submitted materials (if not already in rateAndTaxes)
    if (submittedMaterials && submittedMaterials.length > 0) {
      submittedMaterials
        .filter((s) => !s._destroy)
        .forEach((submitted) => {
        const submittedMaterialName = submitted.material || submitted.material_name || "";
        const submittedUomName = submitted.uom || submitted.uom_name || "";

        const exists = combined.some((item) => {
          const itemMaterialName = item.material || item.material_name || "";
          return (
            item.material_inventory_id === submitted.material_inventory_id ||
            itemMaterialName === submittedMaterialName
          );
        });

        if (!exists) {
          combined.push({
            id: submitted.id,
            material: submittedMaterialName,
            uom: submittedUomName,
            po_qty: submitted.po_qty || "",
            material_rate: submitted.material_rate || "",
            material_cost: submitted.material_cost || "",
            discount_percentage: submitted.discount_percentage || "",
            discount_rate: submitted.discount_rate || "",
            after_discount_value: submitted.after_discount_value || "",
            tax_addition: submitted.tax_addition || "",
            tax_deduction: submitted.tax_deduction || "",
            total_charges: submitted.total_charges || "",
            total_base_cost: submitted.total_base_cost || "",
            all_inclusive_cost: submitted.all_inclusive_cost || "",
            material_inventory_id: submitted.material_inventory_id,
            isSubmitted: true, // Flag to identify submitted materials
          });
          console.log("Added submitted material:", submittedMaterialName);
        }
      });
    }

    console.log("Combined materials:", combined);
    return combined;
  };

  return (
    <>
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

      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover containerStyle={{ zIndex: 20000 }} />
      {/* <main className="h-100 w-100"> */}

      {/* Loading state */}
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading purchase order data...</span>
        </div>
      )}

      {/* top navigation above */}
      <div className="main-content overflow-auto">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content ">
          <div className="module-data-section ">
            <a href="">Home &gt; Purchase &gt; MTO &gt; MTO Pending Approval</a>
            <h5 className="mt-3">Edit Purchase Order</h5>
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
                            />
                            <label className="form-check-label">ROPO</label>
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
                      <h4>PO for New Material (ROPO)</h4>
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
                              className={`nav-link ${activeTab === "po-details" ? "active" : ""}`}
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
                              className={`nav-link ${activeTab === "rate-taxes" ? "active" : ""}`}
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
                              className={`nav-link ${activeTab === "terms-conditions" ? "active" : ""}`}
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic3"
                              type="button"
                              role="tab"
                              aria-controls="nav-contact"
                              aria-selected={activeTab === "terms-conditions"}
                              onClick={() => handleTabChange("terms-conditions")}
                            >
                              Term &amp; Conditions
                            </button>
                          </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className={`tab-pane fade ${activeTab === "po-details" ? "show active" : ""}`}
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
                                      value="ROPO"
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
                                      onChange={(e) =>
                                        setPoDate(e.target.value)
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

                                {/* <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">PO No</label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="PO 056"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Total PO Value
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder={1}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Total Discount
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="INR 600.00"
                                    />
                                  </div>
                                </div> */}
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
                                {/* <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Branch
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="82.77 INR"
                                    />
                                  </div>
                                </div> */}
                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Vendor GSTIN
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      // placeholder="Site"
                                         value={vendorGstin}
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

                              <div>
                                <button
                                  className="purple-btn2  ms-3"
                                  onClick={() => {
                                    setFieldErrors({});
                                    setShowModal(true);
                                  }}
                                >
                                  <span> + Add</span>
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
                                      <th className="text-start">Sr.No.</th>
                                      <th className="text-start">
                                        Material Type
                                      </th>
                                      <th className="text-start">
                                        Material Sub-Type
                                      </th>
                                      <th className="text-start">Material</th>
                                      <th className="text-start">
                                        Generic Specification
                                      </th>
                                      <th className="text-start">Colour</th>
                                      <th className="text-start">Brand</th>
                                      <th className="text-start">UOM</th>

                                      <th className="text-start">Edit</th>
                                      <th className="text-start">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableData.filter((row) => !row._destroy)
                                      .length > 0 ? (
                                      tableData
                                        .filter((row) => !row._destroy)
                                        .map((row, index) => (
                                          <tr key={index}>
                                            <td className="text-start">
                                              {index + 1}
                                            </td>
                                            <td className="text-start">
                                              {row.materialTypeLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.materialSubTypeLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.materialLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.genericSpecificationLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.colourLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.brandLabel}
                                            </td>
                                            <td className="text-start">
                                              {row.uomLabel}
                                            </td>

                                            <td className="text-start">
                                              {(row.material?.isedit === true || !row.material || typeof row.material !== "object" || !row.material.id) && (
                                              <span
                                                onClick={() =>
                                                  handleEditRow(
                                                    index,
                                                    row.material
                                                  )
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  className="bi bi-pencil-square"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                  ></path>
                                                </svg>
                                              </span>
                                              )}
                                            </td>
                                            <td className="text-start">
                                              {(row.material?.isedit === true || !row.material || typeof row.material !== "object" || !row.material.id) && (
                                              <button
                                                className="btn mt-0 pt-0"
                                                onClick={() =>
                                                  handleDeleteRow(index)
                                                }
                                              >
                                                <svg
                                                  width="16"
                                                  height="20"
                                                  viewBox="0 0 16 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
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
                                        <td
                                          colSpan="11"
                                          className="text-center"
                                        >
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
                                onClick={handleSubmitMaterials}
                                disabled={isSubmitting}
                              >
                                {isSubmitting
                                  ? "Submitting..."
                                  : "Submit Materials"}
                              </button>
                            </div>
                          </div>
                          <div
                            className={`tab-pane fade ${activeTab === "rate-taxes" ? "show active" : ""}`}
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
                                    <th>Material Description</th>
                                    <th>UOM</th>
                                    <th>PO Qty</th>
                                    <th>Material Rate</th>
                                    <th>Material Cost</th>
                                    <th>Discount(%)</th>
                                    <th>Discount Rate</th>
                                    <th>After Discount Value</th>
                                    <th>Tax Addition</th>
                                    <th>Tax Deduction</th>
                                    <th>Total Charges</th>
                                    <th>Total Base Cost</th>
                                    <th>All Incl. Cost</th>
                                    <th>Select Tax</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    const combinedMaterials =
                                      getCombinedMaterials();
                                    return combinedMaterials.length > 0 ? (
                                      combinedMaterials.map((item, index) => (
                                        <tr key={item.id || index}>
                                          <td>{index + 1}</td>
                                          <td>{item.material}</td>
                                          <td>{item.uom}</td>
                                          <td>{item.po_qty || "-"}</td>
                                          <td>{item.material_rate || "-"}</td>
                                          <td>{item.material_cost || "-"}</td>
                                          <td>
                                            {item.discount_percentage || "-"}
                                          </td>
                                          <td>{item.discount_rate || "-"}</td>
                                          <td>
                                            {item.after_discount_value || "-"}
                                          </td>
                                          <td>{item.tax_addition || "-"}</td>
                                          <td>{item.tax_deduction || "-"}</td>
                                          <td>{item.total_charges || "-"}</td>
                                          <td>{item.total_base_cost || "-"}</td>
                                          <td>
                                            {item.all_inclusive_cost || "-"}
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
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan="15"
                                          className="text-center"
                                        >
                                          No materials added yet.
                                        </td>
                                      </tr>
                                    );
                                  })()}
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
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Total Base Cost</td>
                                    <td>{taxSummary.total_base_cost}</td>
                                  </tr>
                                  <tr>
                                    <td>Total Tax</td>
                                    <td>{taxSummary.total_tax}</td>
                                  </tr>
                                  <tr>
                                    <td>Total Charge</td>
                                    <td>{taxSummary.total_charge}</td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">
                                      Total All Incl. Cost
                                    </td>
                                    <td className="fw-bold">
                                      {taxSummary.total_inclusive_cost}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Charges Section */}
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Charges</h5>
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
                            </div>
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
                                  className=" purple-btn2"
                                  onClick={() => setActiveTab("terms-conditions")}
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`tab-pane fade ${activeTab === "terms-conditions" ? "show active" : ""}`}
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
                                      min={0}
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
                                      min={0}
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
                                      min={0}
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
                              {/* <div className="row">
                                <div className="mb-3 w-50">
                                  <label
                                    htmlFor="supplierAdvance"
                                    className="form-label po-fontBoldM"
                                  >
                                    Supplier Advance
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="supplierAdvance"
                                    value={termsFormData.supplierAdvance}
                                    onChange={(e) =>
                                      handleTermsFormChange(
                                        "supplierAdvance",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter supplier advance"
                                  />
                                </div>
                                <div className="mb-3 w-50">
                                  <label
                                    htmlFor="supplierAdvanceAmount"
                                    className="form-label po-fontBoldM"
                                  >
                                    Supplier Advance Amount
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="supplierAdvanceAmount"
                                    value={termsFormData.supplierAdvanceAmount}
                                    onChange={(e) =>
                                      handleTermsFormChange(
                                        "supplierAdvanceAmount",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter supplier advance amount"
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="mb-3 w-50">
                                  <label
                                    htmlFor="surviceCertificateAdvance"
                                    className="form-label po-fontBoldM"
                                  >
                                    Service Certificate Advance
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="surviceCertificateAdvance"
                                    value={
                                      termsFormData.surviceCertificateAdvance
                                    }
                                    onChange={(e) =>
                                      handleTermsFormChange(
                                        "surviceCertificateAdvance",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter service certificate advance"
                                  />
                                </div>
                              </div> */}
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
                                      placeholder="INR 0.00"
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
                                      min={0}
                                      placeholder={0}
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
                                      placeholder="NR 0.00"
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Supplier Advance Amount
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="INR 0.00"
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Service Certificate Advance Allowed (%)
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder={0}
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Service Certificate Advance Amount
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="INR 0.00"
                                      disabled
                                    />
                                  </div>
                                </div>
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
                            {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Delivery Schedule</h5>
                            <button className="purple-btn2"> Add</button>
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
                                  <th>Delivery Address</th>
                                  <th>Store Name</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div> */}
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
                                      // id: Date.now(),
                                      category: "",
                                      condition: "",
                                      destroy: false, // new flag for backend deletion
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
                                  {generalTerms &&
                                  generalTerms.filter((item) => !item._destroy)
                                    .length > 0 ? (
                                    generalTerms
                                      .filter((item) => !item._destroy) // hide deleted in UI
                                      .map((row, idx) => (
                                        <tr key={row.id}>
                                          <td>
                                            <select
                                              className="form-control"
                                              value={row.category}
                                              onChange={(e) => {
                                                const selectedCategory =
                                                  e.target.value;

                                                const existingConditionsForCategory =
                                                  termsConditions.filter(
                                                    (item) =>
                                                      item.condition_category_name ===
                                                      selectedCategory
                                                  );

                                                const defaultConditionText =
                                                  existingConditionsForCategory.length >
                                                  0
                                                    ? existingConditionsForCategory[0]
                                                        .condition
                                                    : "";

                                                setGeneralTerms((prev) =>
                                                  prev.map((item) =>
                                                    item.id === row.id
                                                      ? {
                                                          ...item,
                                                          category:
                                                            selectedCategory,
                                                          condition:
                                                            defaultConditionText,
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
                                                  prev.map((item) =>
                                                    item.id === row.id
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
                                                  prev.map((item) =>
                                                    item.id === row.id
                                                      ? {
                                                          ...item,
                                                          _destroy: true,
                                                        } // mark for deletion
                                                      : item
                                                  )
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
                                {/* <tbody>
                                  {materialTermConditions &&
                                  materialTermConditions.length > 0 ? (
                                    (() => {
                                      console.log(
                                        "Rendering materialTermConditions:",
                                        materialTermConditions
                                      );
                                      return materialTermConditions.map(
                                        (item, index) => (
                                          <tr key={index}>
                                            <td>
                                              {item.material_sub_type ||
                                                item.material_name ||
                                                item.material ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {item.condition_category ||
                                                item.condition_category_name ||
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
                                      );
                                    })()
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center">
                                        No material specific conditions found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody> */}
                                <tbody>
                                  {materialTermConditions &&
                                  materialTermConditions.filter(
                                    (item) => !item._destroy
                                  ).length > 0 ? (
                                    materialTermConditions
                                      .filter((item) => !item._destroy) // hide deleted rows in UI
                                      .map((item, index) => (
                                        <tr key={index}>
                                          <td>
                                            {item.material_sub_type ||
                                              item.material_name ||
                                              item.material ||
                                              "N/A"}
                                          </td>
                                          <td>
                                            {item.condition_category ||
                                              item.condition_category_name ||
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
                                                setMaterialTermConditions(
                                                  (prev) =>
                                                    prev.map((row) =>
                                                      row === item
                                                        ? {
                                                            ...row,
                                                            _destroy: true,
                                                          } // mark deleted for backend
                                                        : row
                                                    )
                                                );
                                              }}
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

                                <div
                                  className="tbl-container mb-2"
                                  style={{ maxHeight: "500px" }}
                                >
                                  <table className="w-100">
                                    <thead>
                                      <tr>
                                        <th className="main2-th">File Type</th>
                                        <th className="main2-th">File Name </th>
                                        <th className="main2-th">Upload At</th>
                                        <th className="main2-th">Upload File</th>
                                        <th className="main2-th" style={{ width: 100 }}>
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
                                              value={att.fileName || 'Untitled'}
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
                                                {att.isExisting && att.doc_path && (
                                                  <div className="file-box">
                                                    <div className="">
                                                      <a
                                                        href={att.doc_path}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        <DownloadIcon />
                                                      </a>
                                                    </div>
                                                    <div className="file-name">
                                                      <span>{att.fileName || 'Untitled'}</span>
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
                                      <label style={{ fontSize: "0.95rem", color: "black" }}>
                                        Status
                                      </label>
                                      <SingleSelector
                                        options={[{ value: "draft", label: "Draft" }]}
                                        value={{ value: "draft", label: "Draft" }}
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
                                      onClick={handleUpdatePurchaseOrder}
                                      disabled={isUpdatingOrder}
                                    >
                                      {isUpdatingOrder ? "Updating..." : "Update ROPO"}
                                    </button>
                                  </div>
                                  <div className="col-md-2">
                                    <button className="purple-btn1 w-100">Cancel</button>
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


            </div>
          </div>
        </div>
      </div>

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
          {/* Ensure native dropdown arrows are visible inside this modal */}
          <style>{`
            .modal select.form-control, .modal select {
              -webkit-appearance: auto;
              -moz-appearance: auto;
              appearance: auto;
              background-image: initial !important;
              background-repeat: no-repeat;
            }
          `}</style>
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
                  <label className="form-label fw-bold">Rate per Nos</label>
                  <input
                    type="number"
                    className="form-control"
                    value={taxRateData[tableId]?.ratePerNos || ""}
                    onChange={(e) => handleRatePerNosChange(e.target.value)}
                    min={0}
                    disabled={!taxRateData[tableId]?.isedit}
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

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={taxRateData[tableId]?.discount || ""}
                    onChange={(e) =>
                      handleDiscountPercentageChange(e.target.value)
                    }
                    min={0}
                    max={100}
                    disabled={!taxRateData[tableId]?.isedit}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Material Cost</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.materialCost || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Discount Rate</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.discountRate || ""}
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    After Discount Value
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
            </div>

            <div className="row mb-3">
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
                    disabled={!taxRateData[tableId]?.isedit}
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
                        <th>Tax / Charges per UOM (INR)</th>
                        <th>Inclusive</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Total Base Cost Row */}
                      <tr>
                        <td>Total Base Cost</td>
                        <td></td>
                        <td></td>
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
                        <td className="text-center">
                          {taxRateData[tableId]?.isedit && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => addAdditionTaxCharge(tableId)}
                          >
                            <span>+</span>
                          </button>
                          )}
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
                                    (option) => option.id === item.tax_category_id
                                  )?.value ||
                                  ""
                                }
                                onChange={(e) => {
                                  const selectedValue = e.target.value;
                                  const selectedOption = taxOptions.find(
                                    (option) => option.value === selectedValue
                                  );
                                  const selectedTaxType =
                                    selectedOption?.value || selectedValue;

                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "taxChargeType",
                                    selectedTaxType,
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
                              >
                                <option value="">Select Tax</option>
                                {taxOptions.map((opt) => (
                                  <option
                                    key={opt.id}
                                    value={opt.value}
                                    disabled={
                                      (() => {
                                        const current =
                                          item.taxChargeType ||
                                          taxOptions.find((o) => o.id === item.tax_category_id)?.value ||
                                          "";
                                        const disabledSet = (
                                          taxRateData[tableId]?.addition_bid_material_tax_details?.reduce(
                                            (acc, detail) => {
                                              if (detail._destroy || detail.id === item.id) return acc;
                                              const matchedOption = taxOptions.find(
                                                (o) => o.id === detail.resource_id
                                              );
                                              const t = detail.taxChargeType;
                                              if (t === "CGST") acc.push("CGST", "IGST");
                                              if (t === "SGST") acc.push("SGST", "IGST");
                                              if (t === "IGST") acc.push("CGST", "SGST");
                                              if (t) acc.push(t);
                                              else if (matchedOption?.value) acc.push(matchedOption.value);
                                              return acc;
                                            },
                                            []
                                          ) || []
                                        ).filter((v, i, self) => self.indexOf(v) === i);
                                        return disabledSet.includes(opt.value) && opt.value !== current;
                                      })()
                                    }
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td>
                              <select
                                className="form-control"
                                value={
                                  item?.taxChargePerUom ||
                                  (() => {
                                    const found = (materialTaxPercentages[item.id] || []).find(
                                      (p) => p.id === item.tax_category_id
                                    );
                                    return found ? `${found.percentage}%` : "";
                                  })() || ""
                                }
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "taxChargePerUom",
                                    e.target.value,
                                    "addition"
                                  )
                                }
                                disabled={(materialTaxPercentages[item.id] || []).length === 0}
                              >
                                <option value="">{(materialTaxPercentages[item.id] || []).length === 0 ? "No percentages available" : "Select percentage"}</option>
                                {(materialTaxPercentages[item.id] || []).map((percent) => (
                                  <option key={percent.id} value={`${percent.percentage}%`}>
                                    {percent.percentage}%
                                  </option>
                                ))}
                              </select>
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
                                type="number"
                                className="form-control"
                                value={item.amount || ""}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "amount",
                                    e.target.value,
                                    "addition"
                                  )
                                }
                                min={0}
                                disabled={
                                  item.taxType === "TaxCategory" ||
                                  (item.taxChargeType &&
                                    ["SGST", "CGST", "IGST", "TDS"].includes(
                                      item.taxChargeType
                                    ) &&
                                    item.taxChargePerUom &&
                                    item.taxChargePerUom.includes("%")) ||
                                  (item.tax_category_id &&
                                    (
                                      materialTaxPercentages[item.id] || []
                                    ).find(
                                      (option) =>
                                        option.id === item.tax_category_id
                                    ))
                                }
                                placeholder={
                                  item.taxType === "TaxCategory" ||
                                  (item.taxChargeType &&
                                    ["SGST", "CGST", "IGST", "TDS"].includes(
                                      item.taxChargeType
                                    ) &&
                                    item.taxChargePerUom &&
                                    item.taxChargePerUom.includes("%")) ||
                                  (item.tax_category_id &&
                                    (
                                      materialTaxPercentages[item.id] || []
                                    ).find(
                                      (option) =>
                                        option.id === item.tax_category_id
                                    ))
                                    ? "Auto-calculated"
                                    : "Enter amount"
                                }
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
                              <select
                                className="form-control"
                                value={
                                  item.taxChargeType ||
                                  deductionTaxOptions.find(
                                    (option) => option.id == item.tax_category_id
                                  )?.value ||
                                  ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "taxChargeType",
                                    value,
                                    "deduction"
                                  );

                                  const selectedOption = deductionTaxOptions.find(
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
                              >
                                <option value="">Select Tax & Charges</option>
                                {deductionTaxOptions
                                  .filter((opt) => opt.value)
                                  .map((opt) => (
                                    <option key={opt.id} value={opt.value} disabled={
                                      (taxRateData[tableId]?.deduction_bid_material_tax_details || [])
                                        .map((d) => d.taxChargeType)
                                        .includes(opt.value) && opt.value !== item.taxChargeType
                                    }>
                                      {opt.label}
                                    </option>
                                  ))}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={
                                  item?.taxChargePerUom ||
                                  (() => {
                                    const found = (materialTaxPercentages[item.id] || []).find(
                                      (p) => p.id === item.tax_category_id
                                    );
                                    return found ? `${found.percentage}%` : "";
                                  })() || ""
                                }
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "taxChargePerUom",
                                    e.target.value,
                                    "deduction"
                                  )
                                }
                                disabled={(materialTaxPercentages[item.id] || []).length === 0}
                              >
                                <option value="">{(materialTaxPercentages[item.id] || []).length === 0 ? "No percentages available" : "Select percentage"}</option>
                                {(materialTaxPercentages[item.id] || []).map((percent) => (
                                  <option key={percent.id} value={`${percent.percentage}%`}>
                                    {percent.percentage}%
                                  </option>
                                ))}
                              </select>
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
                                type="number"
                                className="form-control"
                                value={item.amount || ""}
                                onChange={(e) =>
                                  handleTaxChargeChange(
                                    tableId,
                                    item.id,
                                    "amount",
                                    e.target.value,
                                    "deduction"
                                  )
                                }
                                min={0}
                                disabled={
                                  item.taxType === "TaxCategory" ||
                                  (item.taxChargeType &&
                                    ["SGST", "CGST", "IGST", "TDS"].includes(
                                      item.taxChargeType
                                    ) &&
                                    item.taxChargePerUom &&
                                    item.taxChargePerUom.includes("%")) ||
                                  (item.tax_category_id &&
                                    (
                                      materialTaxPercentages[item.id] || []
                                    ).find(
                                      (option) =>
                                        option.id === item.tax_category_id
                                    ))
                                }
                                placeholder={
                                  item.taxType === "TaxCategory" ||
                                  (item.taxChargeType &&
                                    ["SGST", "CGST", "IGST", "TDS"].includes(
                                      item.taxChargeType
                                    ) &&
                                    item.taxChargePerUom &&
                                    item.taxChargePerUom.includes("%"))
                                    ? "Auto-calculated"
                                    : "Enter amount"
                                }
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
                        <td className="text-center">
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
          {/* <button
            variant="primary"
            onClick={handleSaveTaxChanges}
            className="purple-btn2"
          >
            Save Changes
          </button> */}
          <button
            variant="primary"
            onClick={() => {
              // Validation: Show alert if Rate per Nos is empty
              if (
                !taxRateData[tableId] ||
                !taxRateData[tableId].ratePerNos ||
                String(taxRateData[tableId].ratePerNos).trim() === ""
              ) {
                toast.error("Rate per Nos is required.");
                return;
              }
              handleSaveTaxChanges();
            }}
            className="purple-btn2"
            disabled={!taxRateData[tableId]?.isedit}
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PoEdit;
