import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";
import SelectBox from "../components/base/Select/SelectBox";
import DownloadIcon from "../components/common/Icon/DownloadIcon";
import { baseURL } from "../confi/apiDomain";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PoDetails = () => {
  // State variables for the modal
  const [apiMaterialInventoryIds, setApiMaterialInventoryIds] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const openApprovalModal = () => setShowApprovalModal(true);
  const closeApprovalModal = () => setShowApprovalModal(false);
  const navigate = useNavigate(); // Add this line near the top of your component

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

  const [selectedCompany, setSelectedCompany] = useState(null);

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

  const isStatusDisabled = purchaseOrderData?.status === "Approved";
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

    // Populate attachments
    if (poData.attachments && Array.isArray(poData.attachments)) {
      const formattedAttachments = poData.attachments.map((att) => ({
        id: att.id || Math.random(),
        fileType: att.file_type || "",
        fileName: att.file_name || "",
        uploadDate: att.uploaded_at || "",
        fileUrl: att.url || "",
        isExisting: true,
        blob_id: att.blob_id,
        byteSize: att.byte_size,
        doc_path: att.url, // Use url as doc_path for downloads
      }));

      console.log("Formatted attachments:", formattedAttachments);
      setAttachments(formattedAttachments);
    } else {
      setAttachments([]); // Reset attachments if none in API response
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
      .get(`${baseURL}pms/suppliers.json?token=${token}`)
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers data:", error);
      });
  }, []);

  // Handle company selection

  // Handle supplier selection

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

            netCost: rateData.total_material_cost?.toString(),
            pms_inventory_id: rateData.pms_inventory_id || null, // Store pms_inventory_id
            addition_bid_material_tax_details:
              rateData.addition_tax_details?.map((tax) => {
                const baseOptionId =
                  tax.resource_type === "TaxCategory"
                    ? tax.tax_category_id
                    : tax.resource_id;
                return {
                  id: tax.id,
                  resource_id: tax.resource_id,
                  tax_category_id: tax.tax_category_id,
                  taxChargeType:
                    taxOptions.find((option) => option.id === baseOptionId)
                      ?.value || "",
                  taxType: tax.resource_type,
                  taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                  percentageId: tax.percentage_id || null,
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
                };
              }) || [],
            deduction_bid_material_tax_details:
              rateData.deduction_tax_details?.map((tax) => {
                const baseOptionId =
                  tax.resource_type === "TaxCategory"
                    ? tax.tax_category_id
                    : tax.resource_id;
                return {
                  id: tax.id,
                  resource_id: tax.resource_id,
                  tax_category_id: tax.tax_category_id,
                  taxChargeType:
                    deductionTaxOptions.find(
                      (option) => option.id === baseOptionId
                    )?.value || "",
                  taxType: tax.resource_type,
                  taxChargePerUom: tax.percentage ? `${tax.percentage}%` : "",
                  percentageId: tax.percentage_id || null,
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
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
      const currentData = taxRateData[tableId];
      if (!currentData) return;

      const discountPercentage = parseFloat(currentData.discount) || 0;
      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newDiscountRate = calculateDiscountRate(value, discountPercentage);
      const newMaterialCost = calculateMaterialCost(value, totalPoQty);
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
      const currentData = taxRateData[tableId];
      if (!currentData) return;

      const ratePerNos = parseFloat(currentData.ratePerNos) || 0;
      const totalPoQty = parseFloat(currentData.totalPoQty) || 0;

      const newDiscountRate = calculateDiscountRate(ratePerNos, value);
      const newMaterialCost = calculateMaterialCost(ratePerNos, totalPoQty);
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
    setTermsFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleCostChange = (id, field, value) => {
    setOtherCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, [field]: value } : cost))
    );
  };
  // ...existing code...

  // Helper function to calculate net cost for charges and other costs
  const calculateNetCostForTaxes = (
    baseCost,
    additionTaxes,
    deductionTaxes
  ) => {
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

    // Calculate initial net cost based on saved taxes
    const initialNetCost = calculateNetCostForTaxes(
      baseCost,
      savedTaxes.additionTaxes,
      savedTaxes.deductionTaxes
    );

    setChargeTaxes({
      additionTaxes: savedTaxes.additionTaxes || [],
      deductionTaxes: savedTaxes.deductionTaxes || [],
      baseCost: baseCost,
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

        // Calculate net cost using helper function
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

        // Calculate net cost using helper function
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

  // ...existing code...

  // Function to get combined materials (prepopulated + submitted)
  const getCombinedMaterials = () => {
    const combined = [];

    console.log("rateAndTaxes:", rateAndTaxes);
    console.log("submittedMaterials:", submittedMaterials);

    // Add prepopulated rate and taxes data
    if (rateAndTaxes && rateAndTaxes.length > 0) {
      combined.push(...rateAndTaxes);
      console.log("Added prepopulated data:", rateAndTaxes.length, "items");
    }

    // Add submitted materials (if not already in rateAndTaxes)
    if (submittedMaterials && submittedMaterials.length > 0) {
      submittedMaterials.forEach((submitted) => {
        const exists = combined.some(
          (item) =>
            item.material_inventory_id === submitted.material_inventory_id ||
            item.material === submitted.material_name
        );
        if (!exists) {
          combined.push({
            id: submitted.id,
            material: submitted.material_name,
            uom: submitted.uom_name,
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
          console.log("Added submitted material:", submitted.material_name);
        }
      });
    }

    console.log("Combined materials:", combined);
    return combined;
  };
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });

  const [adminComment, setAdminComment] = useState("");
  const [poRemark, setPoRemark] = useState("");
  const [poComments, setPoComments] = useState("");

  useEffect(() => {
    if (purchaseOrderData?.selected_status) {
      setSelectedStatus({
        value: purchaseOrderData.selected_status.toLowerCase(),
        label: purchaseOrderData.selected_status,
      });
    }
  }, [purchaseOrderData?.selected_status]);

  // Helper to extract detailed API error messages for toasts
  const getApiErrorMessage = (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }

    if (data?.errors && typeof data.errors === "object") {
      try {
        const combined = Object.values(data.errors)
          .flat()
          .filter(Boolean)
          .join(", ");
        if (combined) return combined;
      } catch (_) {}
    }

    if (data && typeof data === "object") {
      try {
        const str = JSON.stringify(data);
        if (str && str.length <= 500) return str;
      } catch (_) {}
    }

    return status ? `Request failed with status ${status}` : (error?.message || "Error updating status. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status_log: {
          status: selectedStatus?.value.toLowerCase() || "Draft", // default to "Draft"
          remarks: poRemark || "",
          comments: poComments || "",
          admin_comment: adminComment || "",
        },
      };

      const response = await axios.put(
        `${baseURL}purchase_orders/${id}/update_status.json?token=${token}`,
        payload
      );

      console.log("Status update successful:", response.data);
      toast.success("Status updated successfully!", {
        autoClose: 1500,
        onClose: () => window.location.reload(),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(getApiErrorMessage(error));
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover containerStyle={{ zIndex: 20000 }} />
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
            <h5 className="mt-3">Detail Purchase Order</h5>
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
                              className="nav-link active"
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic1"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected="true"
                            >
                              PO Details
                            </button>
                            <button
                              className="nav-link"
                              id="nav-profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic2"
                              type="button"
                              role="tab"
                              aria-controls="nav-profile"
                              aria-selected="false"
                            >
                              Rate &amp; Taxes
                            </button>
                            <button
                              className="nav-link"
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic3"
                              type="button"
                              role="tab"
                              aria-controls="nav-contact"
                              aria-selected="false"
                            >
                              Term &amp; Conditions
                            </button>
                            <button
                              className="nav-link"
                              id="nav-amendments-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#Domestic4"
                              type="button"
                              role="tab"
                              aria-controls="nav-amendments"
                              aria-selected="false"
                            >
                              Amendment Details
                            </button>
                          </div>
                        </nav>
                        <div className="d-flex justify-content-end ms-4 mt-2">
                          {purchaseOrderData?.selected_status === "Draft" && (
                            <Link
                              to={`/po-edit/${id}?token=${token}`}
                              className="d-flex align-items-center"
                              style={{ borderColor: "#8b0203" }}
                            >
                              <button type="button" className="purple-btn1">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="#8b0203"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z"
                                    fill="#8b0203"
                                  />
                                  <path
                                    d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                                    fill="#8b0203"
                                  />
                                </svg>
                              </button>
                            </Link>
                          )}

                          {/* {purchaseOrderData?.selected_status !== "Draft" && 
                           purchaseOrderData?.selected_status !== "accepted_by_vendor" &&
                           purchaseOrderData?.selected_status !== "rejected_by_vendor" &&
                           purchaseOrderData?.selected_status !== "cancelled" &&
                           purchaseOrderData?.selected_status !== "terminated" &&
                           purchaseOrderData?.selected_status !== "rejected" && ( */}

                          {purchaseOrderData?.selected_status?.toLowerCase() !==
                            "draft" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "accepted_by_vendor" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "rejected_by_vendor" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "cancelled" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "terminated" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "rejected" &&
                            purchaseOrderData?.selected_status?.toLowerCase() !==
                              "submitted" &&
                            purchaseOrderData?.vendor_status?.toLowerCase() !==
                              "accepted" && (
                              <Link
                                to={`/po-edit-ammend/${purchaseOrderData?.parent_po_id}?token=${token}`}
                                className="d-flex align-items-center"
                                style={{ borderColor: "#8b0203" }}
                              >
                                <button
                                  type="button"
                                  className="purple-btn2 mb-3"
                                >
                                  <span>Amend</span>
                                </button>
                              </Link>
                            )}
                          {purchaseOrderData?.approval_logs &&
                            purchaseOrderData.approval_logs.length > 0 && (
                              <button
                                type="button"
                                className="purple-btn2 mb-3"
                                onClick={openApprovalModal}
                                style={{
                                  backgroundColor:
                                    purchaseOrderData?.selected_status ===
                                    "Approved"
                                      ? "green"
                                      : "",
                                  border: "none",
                                }}
                              >
                                <span>Approval Logs</span>
                              </button>
                            )}
                        </div>

                        <div className="tab-content" id="nav-tabContent">
                          {purchaseOrderData ? (
                            <div
                              className="tab-pane fade active show"
                              id="Domestic1"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab"
                              tabIndex={0}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                      <label>Company </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.company_name}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>PO Type </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.po_type}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>PO Date </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.po_date}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Created ON </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.created_at}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>PO No </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.po_number}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Total PO Value</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.total_value}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Total Discount</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.total_discount ??
                                          "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Supplier</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.supplier_name}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Vendor GSTIN</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.vendor_gstin || "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Branch</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.branch || "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Unloading scope</label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3 text-dark">
                                          :
                                        </span>
                                        {purchaseOrderData.unloading_scope ||
                                          "-"}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between  align-items-center">
                                  <h5
                                    className="mt-2 "
                                    data-bs-toggle="modal"
                                    data-bs-target="#sereneModal"
                                  >
                                    Material Details
                                  </h5>
                                </div>
                                <div className="tbl-container me-2 mt-3">
                                  <table
                                    className="w-100"
                                    style={{ width: "100%" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          style={{ width: "66px !important" }}
                                        >
                                          Sr. No
                                        </th>
                                        <th>Project</th>
                                        <th>Sub-Project</th>
                                        {/* <th>MOR No.</th> */}
                                        <th>Material</th>
                                        <th>UOM</th>
                                        <th>Mor Qty</th>
                                        <th>PO Order Qty</th>
                                        <th>GRN Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {purchaseOrderData.material_details &&
                                      purchaseOrderData.material_details
                                        .length > 0 ? (
                                        purchaseOrderData.material_details.map(
                                          (mat, idx) => (
                                            <tr key={mat.id || idx}>
                                              <td>{idx + 1}</td>
                                              <td>{mat.project}</td>
                                              <td>{mat.sub_project}</td>
                                              {/* <td>
                                              <a
                                                style={{
                                                  textDecoration:
                                                    "underline !important",
                                                }}
                                                target="_blank"
                                                href={`/material_order_requests/${mat.mor_no}?layout=true`}
                                              >
                                                {mat.mor_no}
                                              </a>
                                            </td> */}
                                              <td>{mat.material}</td>
                                              <td>{mat.uom}</td>
                                              <td>{mat.mor_qty}</td>
                                              <td>{mat.po_order_qty}</td>
                                              <td>{mat.grn_qty}</td>
                                            </tr>
                                          )
                                        )
                                      ) : (
                                        <tr>
                                          <td colSpan={9}>
                                            No material details
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>Loading purchase order details...</div>
                          )}
                          <div
                            className="tab-pane fade"
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
                              </div>

                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Charge Name</th>
                                      <th>Amount</th>
                                      <th>Realised Amount</th>
                                      <th>Taxes</th>
                                      {/* <th>Action</th> */}
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
                                            disabled={true} // <-- add this line to disable the select
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
                                            disabled
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
                                        {/* <td>
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
                                        </td> */}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Other Cost</h5>
                                {/* <button
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
                                </button> */}
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
                                      {/* <th>Action</th> */}
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
                                            disabled={true} // <-- add this line to disable the select
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
                                            disabled
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
                                            disabled={true} // <-- add this line to disable the select
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
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {/* )} */}
                            </div>
                          </div>
                          {purchaseOrderData?.terms_and_conditions ? (
                            <div
                              className="tab-pane fade"
                              id="Domestic3"
                              role="tabpanel"
                              aria-labelledby="nav-contact-tab"
                              tabIndex={0}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                      <label>Credit Period (Days) </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.credit_period ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                      <label>P.O Validity Period (Days) </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.po_validity_period ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>
                                        Advance Reminder Duration (Days){" "}
                                      </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.advance_reminder_duration ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Payment Terms </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.payment_terms ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Remark </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.payment_remarks ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                      <label>Total PO Value </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.total_value}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                      <label>
                                        Supplier Advance Allowed (%){" "}
                                      </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.supplier_advance ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Total Discount </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.total_discount ??
                                          "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>Supplier Advance Amount </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.supplier_advance_amount ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>
                                        Service Certificate Advance Allowed (%){" "}
                                      </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {purchaseOrderData.terms_and_conditions
                                          ?.survice_certificate_advance ?? "-"}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                    <div className="col-6 ">
                                      <label>
                                        Service Certificate Advance Amount{" "}
                                      </label>
                                    </div>
                                    <div className="col-6">
                                      <label className="text">
                                        <span className="me-3">:-</span>
                                        {/* No value shown here in your original */}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 ">
                                <h5>General Term &amp; Conditions</h5>
                              </div>
                              <div className="tbl-container me-2 mt-2">
                                <table
                                  className="w-100"
                                  style={{ width: "100%" }}
                                >
                                  <thead>
                                    <tr>
                                      <th>Condition Category</th>
                                      <th>Condition</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {purchaseOrderData.resource_term_conditions &&
                                    purchaseOrderData.resource_term_conditions
                                      .length > 0 ? (
                                      purchaseOrderData.resource_term_conditions.map(
                                        (cond, idx) => (
                                          <tr key={cond.id || idx}>
                                            <td>{cond.condition_category}</td>
                                            <td>{cond.condition}</td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan={2}>
                                          No general term conditions
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <div className="mt-3">
                                <h5>Material Specific Term &amp; Conditions</h5>
                              </div>
                              <div className="tbl-container me-2 mt-2">
                                <table
                                  className="w-100"
                                  style={{ width: "100%" }}
                                >
                                  <thead>
                                    <tr>
                                      <th>Material Sub Type</th>
                                      <th>Condition Category</th>
                                      <th>Condition</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {purchaseOrderData.resource_material_term_conditions &&
                                    purchaseOrderData
                                      .resource_material_term_conditions
                                      .length > 0 ? (
                                      purchaseOrderData.resource_material_term_conditions.map(
                                        (cond, idx) => (
                                          <tr key={cond.id || idx}>
                                            <td>{cond.material_sub_type}</td>
                                            <td>{cond.condition_category}</td>
                                            <td>{cond.condition}</td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan={3}>
                                          No material specific term conditions
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div>Loading purchase order details...</div>
                          )}

                          <div
                            className="tab-pane fade"
                            id="Domestic4"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            tabIndex={0}
                          >
                            <div className="tbl-container px-0">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        width: "66px",
                                        width: "66px !important",
                                      }}
                                    >
                                      Sr.No.
                                    </th>
                                    <th>Version Number</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseOrderData?.amendment_details &&
                                  purchaseOrderData.amendment_details.length >
                                    0 ? (
                                    purchaseOrderData.amendment_details.map(
                                      (amend, idx) => (
                                        <tr key={amend.id || idx}>
                                          <td>{idx + 1}</td>
                                          <td>
                                            <Link
                                              to={`/po-details/${amend.id}?token=${token}

          `}
                                              style={{
                                                color: "#8b0203",
                                                textDecoration: "none",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault(); // Prevent default navigation
                                                navigate(
                                                  `/po-details/${amend.id}?token=${token}`
                                                );
                                                window.location.reload(); // Force page reload after navigation
                                              }}
                                            >
                                              {amend.version_number}
                                            </Link>
                                          </td>
                                          <td>{amend.status}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={3}>
                                        No amendments available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* /.container-fluid */}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* 
Document */}

              <div className="d-flex justify-content-between mt-5 ">
                <h5>Document Attachment</h5>
                <div
                  className=""
                  data-bs-toggle="modal"
                  data-bs-target="#attachModal"
                  // onClick={openattachModal}
                ></div>
              </div>

              <div
                className="tbl-container mb-4"
                style={{ maxHeight: "500px" }}
              >
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="main2-th">File Type</th>
                      <th className="main2-th">File Name</th>
                      <th className="main2-th">Upload At</th>
                      <th className="main2-th">Action</th>
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
                            readOnly
                            disabled
                            value={att.fileName || att.file_name || ""}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control created_at"
                            readOnly
                            disabled
                            value={att.uploadDate || att.uploaded_at || ""}
                          />
                        </td>
                        <td className="document">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className="attachment-placeholder">
                              {att.isExisting && (
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
                                    <span>{att.fileName || att.file_name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row w-100">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Remark</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Enter ..."
                      value={poRemark}
                      onChange={(e) => setPoRemark(e.target.value)}
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
                      value={poComments}
                      onChange={(e) => setPoComments(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label
                      className="form-label mt-2"
                      style={{ fontSize: "0.95rem", color: "black" }}
                    >
                      Status
                    </label>

                    <SingleSelector
                      options={
                        purchaseOrderData?.status_list?.map((status) => ({
                          // value: status,
                          value: status.toLowerCase(), // internal lowercase value
                          label: status,
                        })) || []
                      }
                      // value={selectedStatus}
                      value={
                        selectedStatus
                          ? {
                              value: selectedStatus.value.toLowerCase(),
                              label: selectedStatus.label,
                            }
                          : null
                      }
                      onChange={(selected) => setSelectedStatus(selected)}
                      placeholder="Select Status"
                      isClearable={false}
                      isDisabled={purchaseOrderData?.disabled ?? false}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-2 justify-content-end">
                <div className="col-md-2 mt-2">
                  <button
                    type="button"
                    className="purple-btn2 w-100"
                    id="submit_tag_button"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="purple-btn1 w-100"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className=" d-flex justify-content-between align-items-center">
                <h5 className=" mt-3">Audit Logs</h5>
              </div>
              <div className="tbl-container px-0">
                <table className="w-100" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "66px !important" }}>Sr.No.</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>PO Remark</th>
                      <th>PO Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrderData?.status_logs &&
                    purchaseOrderData.status_logs.length > 0 ? (
                      purchaseOrderData.status_logs.map((log, index) => (
                        <tr key={log.id}>
                          <td>{index + 1}</td>
                          <td>{log.user || "-"}</td>
                          <td>{log.date || "-"}</td>
                          <td>{log.status || "-"}</td>
                          <td>{log.po_remark || "-"}</td>
                          <td>{log.po_comments || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No audit log data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                      // onClick={() => addTaxRow("addition")}
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
                        disabled
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
                        // disabled={!tax.taxType}
                        disabled
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
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={tax.amount}
                        disabled
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-danger"
                        // onClick={() => removeTaxRow("addition", tax.id)}
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
                      // onClick={() => addTaxRow("deduction")}
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
                        disabled
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
                        disabled
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
                        disabled
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
                        // onClick={() => removeTaxRow("deduction", tax.id)}
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
          {/* <button
            type="button"
            className="purple-btn2"
            onClick={handleSaveTaxes}
          >
            Save
          </button> */}
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

      <Modal
        size="lg"
        show={showApprovalModal}
        onHide={closeApprovalModal}
        centered
      >
        <Modal.Header closeButton>
          <h5>Approval Log</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2 px-2">
            <div className="col-12">
              <div className="tbl-container me-2 mt-3">
                {/* Check if approval_logs is empty or undefined */}
                {!purchaseOrderData?.approval_logs ||
                purchaseOrderData?.approval_logs.length === 0 ? (
                  // Display a message if no logs are available
                  <div className="text-center py-4">
                    <p className="text-muted">No approval logs available.</p>
                  </div>
                ) : (
                  // Render the table if logs are available
                  <table className="w-100" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "66px !important" }}>Sr.No.</th>
                        <th>Approval Level</th>
                        <th>Approved By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrderData?.approval_logs.map((log, id) => (
                        <tr key={id}>
                          <td className="text-start">{id + 1}</td>
                          <td className="text-start">{log.approval_level}</td>
                          <td className="text-start">
                            {log.approved_by || "-"}
                          </td>
                          <td className="text-start">{log.date}</td>
                          <td className="text-start">
                            <span
                              className="px-2 py-1 rounded text-white"
                              style={{
                                backgroundColor:
                                  log.status === "Pending" ? "red" : "green",
                              }}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="text-start">
                            <p>{log.remark || "-"}</p>
                          </td>
                          <td className="text-start">{log.users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
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
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.ratePerNos || ""}
                    onChange={(e) => handleRatePerNosChange(e.target.value)}
                    disabled
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
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.discount || ""}
                    onChange={(e) =>
                      handleDiscountPercentageChange(e.target.value)
                    }
                    disabled
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
                    disabled={true}
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
                          <button
                            className="btn btn-outline-danger btn-sm"
                            // onClick={() => addAdditionTaxCharge(tableId)}
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
                                disabled
                                value={
                                  item.taxChargeType ||
                                  taxOptions.find(
                                    (opt) => opt.id === item.tax_category_id
                                  )?.value ||
                                  taxOptions.find(
                                    (opt) => opt.id === item.resource_id
                                  )?.value ||
                                  ""
                                }
                              >
                                <option value="">Select Tax</option>
                                {taxOptions.map((opt) => (
                                  <option key={opt.id} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td>
                              <select
                                className="form-control"
                                disabled
                                value={
                                  item?.taxChargePerUom ||
                                  (() => {
                                    const found = (
                                      materialTaxPercentages[item.id] || []
                                    ).find(
                                      (p) => p.id === item.tax_category_id
                                    );
                                    return found ? `${found.percentage}%` : "";
                                  })() ||
                                  ""
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

                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                // onChange={(e) =>
                                //   handleTaxChargeChange(
                                //     tableId,
                                //     item.id,
                                //     "inclusive",
                                //     e.target.checked,
                                //     "addition"
                                //   )
                                // }
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.amount || ""}
                                // onChange={(e) =>
                                //   handleTaxChargeChange(
                                //     tableId,
                                //     item.id,
                                //     "amount",
                                //     e.target.value,
                                //     "addition"
                                //   )
                                // }
                                // disabled={
                                //   item.taxType === "TaxCategory" ||
                                //   (item.taxChargeType &&
                                //     ["SGST", "CGST", "IGST", "TDS"].includes(
                                //       item.taxChargeType
                                //     ) &&
                                //     item.taxChargePerUom &&
                                //     item.taxChargePerUom.includes("%")) ||
                                //   (item.tax_category_id &&
                                //     (
                                //       materialTaxPercentages[item.id] || []
                                //     ).find(
                                //       (option) =>
                                //         option.id === item.tax_category_id
                                //     ))
                                // }
                                // placeholder={
                                //   item.taxType === "TaxCategory" ||
                                //   (item.taxChargeType &&
                                //     ["SGST", "CGST", "IGST", "TDS"].includes(
                                //       item.taxChargeType
                                //     ) &&
                                //     item.taxChargePerUom &&
                                //     item.taxChargePerUom.includes("%")) ||
                                //   (item.tax_category_id &&
                                //     (
                                //       materialTaxPercentages[item.id] || []
                                //     ).find(
                                //       (option) =>
                                //         option.id === item.tax_category_id
                                //     ))
                                //     ? "Auto-calculated"
                                //     : "Enter amount"
                                // }
                                disabled
                              />
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                // onClick={() =>
                                //   removeTaxChargeItem(
                                //     tableId,
                                //     item.id,
                                //     "addition"
                                //   )
                                // }
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
                            // onClick={() => addDeductionTaxCharge(tableId)}
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
                                disabled
                                value={
                                  item.taxChargeType ||
                                  deductionTaxOptions.find(
                                    (opt) => opt.id == item.tax_category_id
                                  )?.value ||
                                  deductionTaxOptions.find(
                                    (opt) => opt.id == item.resource_id
                                  )?.value ||
                                  ""
                                }
                              >
                                <option value="">Select Tax & Charges</option>
                                {deductionTaxOptions
                                  .filter((opt) => opt.value)
                                  .map((opt) => (
                                    <option key={opt.id} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                disabled
                                value={
                                  item?.taxChargePerUom ||
                                  (() => {
                                    const found = (
                                      materialTaxPercentages[item.id] || []
                                    ).find(
                                      (p) => p.id === item.tax_category_id
                                    );
                                    return found ? `${found.percentage}%` : "";
                                  })() ||
                                  ""
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
                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                // onChange={(e) =>
                                //   handleTaxChargeChange(
                                //     tableId,
                                //     item.id,
                                //     "inclusive",
                                //     e.target.checked,
                                //     "deduction"
                                //   )
                                // }
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.amount || ""}
                                // onChange={(e) =>
                                //   handleTaxChargeChange(
                                //     tableId,
                                //     item.id,
                                //     "amount",
                                //     e.target.value,
                                //     "deduction"
                                //   )
                                // }
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
                                // onClick={() =>
                                //   removeTaxChargeItem(
                                //     tableId,
                                //     item.id,
                                //     "deduction"
                                //   )
                                // }
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PoDetails;
