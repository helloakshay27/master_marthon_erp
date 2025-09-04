import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import DownloadIcon from "../components/common/Icon/DownloadIcon";
import { Modal, Button, Form } from "react-bootstrap";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";
import SelectBox from "../components/base/Select/SelectBox";

const RopoImportDetails = () => {
  // State variables for API data
  const [ropoData, setRopoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get URL parameters
  const { id } = useParams();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const poType = urlParams.get("po_type");

  // State for rate and taxes data
  const [rateAndTaxes, setRateAndTaxes] = useState([]);
  const [taxSummary, setTaxSummary] = useState({
    total_base_cost: 0,
    total_tax: 0,
    total_charge: 0,
    total_inclusive_cost: 0,
  });

  // State for charges and other costs
  const [charges, setCharges] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [chargeNames, setChargeNames] = useState([]);
  const [exclusiveCharges, setExclusiveCharges] = useState([]);

  // State for attachments
  const [attachments, setAttachments] = useState([]);

  // State for status management
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });
  const [poRemark, setPoRemark] = useState("");
  const [poComments, setPoComments] = useState("");

  // State for View Tax & Rate modal
  const [showTaxesModal, setShowTaxesModal] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [chargeTaxes, setChargeTaxes] = useState({
    additionTaxes: [],
    deductionTaxes: [],
    baseCost: 0,
    netCost: "0",
  });

  // State for tax options
  const [chargesAdditionTaxOptions, setChargesAdditionTaxOptions] = useState(
    []
  );
  const [chargesDeductionTaxOptions, setChargesDeductionTaxOptions] = useState(
    []
  );
  const [chargesTaxPercentages, setChargesTaxPercentages] = useState([]);

  // State for Tax Modal (material taxes)
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [taxRateData, setTaxRateData] = useState({});
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);
  const [materialTaxPercentages, setMaterialTaxPercentages] = useState({});

  // State for approval modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const navigate = useNavigate();

  // Helper to display USD with INR in parentheses
  const formatUsdInInr = useCallback((usd, inr) => {
    const hasUsd = usd !== undefined && usd !== null && usd !== "";
    const hasInr = inr !== undefined && inr !== null && inr !== "";
    if (!hasUsd && !hasInr) return "-";
    const usdVal = hasUsd ? `USD ${usd}` : "-";
    const inrVal = hasInr ? `INR ${inr}` : "-";
    return `${usdVal} (${inrVal})`;
  }, []);

  // Safe USD → INR converter for display in the modal
  const safeConvertUsdToInr = useCallback((usdValue, conversionRate) => {
    const usd = parseFloat(usdValue);
    const rate = parseFloat(conversionRate);
    if (!isFinite(usd) || !isFinite(rate)) return 0;
    return parseFloat((usd * rate).toFixed(2));
  }, []);

  // Convert INR → USD using current PO conversion rate
  const convertInrToUsd = useCallback(
    (inrValue) => {
      const inr = parseFloat(inrValue);
      const rate = parseFloat(ropoData?.conversion_rate);
      if (!isFinite(inr) || !isFinite(rate) || rate === 0) return "";
      return (inr / rate).toFixed(2);
    },
    [ropoData?.conversion_rate]
  );

  // Helper to determine if a tax type is percentage-based
  const isPercentageTax = useCallback((taxType) => {
    if (!taxType) return false;
    const upper = String(taxType).toUpperCase();
    const percentageKeywords = [
      "GST",
      "CGST",
      "SGST",
      "IGST",
      "TDS",
      "VAT",
      "CESS",
      "TAX",
    ];
    return percentageKeywords.some((k) => upper.includes(k)) || /%/.test(upper);
  }, []);

  // Fetch ROPO data on component mount
  useEffect(() => {
    const fetchRopoData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching ROPO data for ID:", id);
        console.log("Token:", token);
        console.log("PO Type:", poType);

        const response = await axios.get(
          `${baseURL}purchase_orders/${id}/ropo_detail.json?token=${token}&po_type=import`
        );

        console.log("ROPO data response:", response.data);
        setRopoData(response.data);

        // Populate form data from API response
        populateFormData(response.data);
      } catch (error) {
        console.error("Error fetching ROPO data:", error);
        setError("Failed to load ROPO data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchRopoData();
    }
  }, [id, token, poType]);

  // Function to populate form data from API response
  const populateFormData = (data) => {
    // Populate rate and taxes data
    if (data.rate_and_taxes) {
      setRateAndTaxes(
        data.rate_and_taxes.map((rate) => ({
          id: rate.id,
          material_inventory_id: rate.material_inventory_id,
          material: rate.material,
          uom: rate.uom,
          po_qty: rate.po_qty,
          adjusted_qty: rate.adjusted_qty,
          tolerance_qty: rate.tolerance_qty,
          material_rate: rate.material_rate,
          material_rate_in_inr: rate.material_rate_in_inr,
          material_cost: rate.material_cost,
          material_cost_in_inr: rate.material_cost_in_inr,
          discount_percentage: rate.discount_percentage,
          discount_rate: rate.discount_rate,
          discount_rate_in_inr: rate.discount_rate_in_inr,
          after_discount_value: rate.after_discount_value,
          after_discount_value_in_inr: rate.after_discount_value_in_inr,
          tax_addition: rate.tax_addition,
          tax_addition_in_inr: rate.tax_addition_in_inr,
          tax_deduction: rate.tax_deduction,
          tax_deduction_in_inr: rate.tax_deduction_in_inr,
          total_charges: rate.total_charges,
          total_charges_in_inr: rate.total_charges_in_inr,
          total_base_cost: rate.total_base_cost,
          total_base_cost_in_inr: rate.total_base_cost_in_inr,
          all_inclusive_cost: rate.all_inclusive_cost,
          all_inclusive_cost_in_inr: rate.all_inclusive_cost_in_inr,
        }))
      );
    }

    // Populate tax summary
    if (data.tax_summary) {
      setTaxSummary({
        total_base_cost: data.tax_summary.total_base_cost ?? 0,
        total_tax: data.tax_summary.total_tax ?? 0,
        total_charge: data.tax_summary.total_charge ?? 0,
        total_inclusive_cost: data.tax_summary.total_inclusive_cost ?? 0,
      });
    }

    // Populate charges data
    if (data.charges_with_taxes) {
      const formattedCharges = data.charges_with_taxes.map((charge) => ({
        id: charge.id || Date.now(),
        charge_name: charge.charge_name || "",
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
      }));
      setCharges(formattedCharges);
    }

    // Populate other costs data
    if (data.other_cost_details) {
      const formattedOtherCosts = data.other_cost_details.map((cost) => ({
        id: cost.id || Date.now(),
        cost_name: cost.cost_type || "",
        amount: cost.cost?.toString() || "",
        scope: cost.scope || "",
        realised_amount: cost.cost?.toString() || "",
        taxes: {
          additionTaxes:
            cost.taxes_and_charges
              ?.filter((tax) => tax.addition)
              .map((tax) => ({
                id: tax.id || Date.now(),
                taxType: tax.resource_id?.toString() || "",
                taxPercentage: tax.percentage?.toString() || "",
                inclusive: tax.inclusive || false,
                amount: tax.amount?.toString() || "0",
              })) || [],
          deductionTaxes:
            cost.taxes_and_charges
              ?.filter((tax) => !tax.addition)
              .map((tax) => ({
                id: tax.id || Date.now(),
                taxType: tax.resource_id?.toString() || "",
                taxPercentage: tax.percentage?.toString() || "",
                inclusive: tax.inclusive || false,
                amount: tax.amount?.toString() || "0",
              })) || [],
          netCost: cost.cost?.toString() || "0",
        },
      }));
      setOtherCosts(formattedOtherCosts);
    }

    // Populate Charges (Exclusive) table from mor_inventory_tax_details
    if (Array.isArray(data.mor_inventory_tax_details)) {
      const exclusive = data.mor_inventory_tax_details.filter((row) => {
        if (!row) return false;
        return row.resource_type === "TaxCharge" && Boolean(row.addition);
      });
      setExclusiveCharges(exclusive);
    } else {
      setExclusiveCharges([]);
    }

    // Populate attachments
    if (data.attachments && Array.isArray(data.attachments)) {
      const formattedAttachments = data.attachments.map((att) => ({
        id: att.id || Math.random(),
        fileType: att.file_type || "",
        fileName: att.file_name || "",
        uploadDate: att.uploaded_at || "",
        fileUrl: att.url || "",
        isExisting: true,
        blob_id: att.blob_id,
        byteSize: att.byte_size,
        doc_path: att.url,
      }));
      setAttachments(formattedAttachments);
    } else {
      setAttachments([]);
    }

    // Set status
    if (data.selected_status) {
      setSelectedStatus({
        value: data.selected_status.toLowerCase(),
        label: data.selected_status,
      });
    }
  };

  // Fetch charge names and tax options from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch charge names
        const chargeResponse = await axios.get(
          `${baseURL}tax_configurations/charge_names.json?token=${token}`
        );
        console.log("Charge names response:", chargeResponse.data);
        setChargeNames(chargeResponse.data || []);

        // Fetch addition taxes
        const additionResponse = await axios.get(
          `${baseURL}rfq/events/addition_taxes_dropdown?token=${token}`
        );
        console.log("Addition taxes response:", additionResponse.data);
        setChargesAdditionTaxOptions(additionResponse.data.taxes || []);

        // Fetch deduction taxes
        const deductionResponse = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
        );
        console.log("Deduction taxes response:", deductionResponse.data);
        setChargesDeductionTaxOptions(deductionResponse.data.taxes || []);

        // Fetch tax percentages
        const percentageResponse = await axios.get(
          `${baseURL}rfq/events/tax_percentage?token=${token}`
        );
        console.log("Tax percentages response:", percentageResponse.data);
        setChargesTaxPercentages(percentageResponse.data || []);

        // Fetch tax options for material taxes
        const taxResponse = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=${token}`
        );
        console.log("Tax options response:", taxResponse.data);
        const taxesData = taxResponse.data.taxes || taxResponse.data;
        const options = taxesData.map((tax) => ({
          id: tax.id,
          value: tax.name,
          label: tax.name,
          type: tax.type === "TaxCategory" ? "TaxDetail" : tax.type,
        }));
        console.log("Formatted tax options:", options);
        setTaxOptions(options);

        // Fetch deduction tax options for material taxes
        const deductionTaxResponse = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
        );
        if (deductionTaxResponse.data?.taxes) {
          const formattedOptions = deductionTaxResponse.data.taxes.map(
            (tax) => ({
              value: tax.name,
              label: tax.name,
              id: tax.id,
              type: tax.type === "TaxCategory" ? "TaxDetail" : tax.type,
            })
          );
          setDeductionTaxOptions([
            { value: "", label: "Select Tax & Charges" },
            ...formattedOptions,
          ]);
        }

        // Fetch tax percentages for material taxes
        const materialTaxPercentageResponse = await axios.get(
          `${baseURL}rfq/events/tax_percentage?token=${token}`
        );
        setTaxPercentageOptions(materialTaxPercentageResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setChargeNames([]);
        setChargesAdditionTaxOptions([]);
        setChargesDeductionTaxOptions([]);
        setChargesTaxPercentages([]);
        setTaxOptions([]);
        setDeductionTaxOptions([]);
        setTaxPercentageOptions([]);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Handle View Tax & Rate modal functions
  const handleOpenTaxesModal = (itemId, itemType = "charge") => {
    console.log("Opening taxes modal for:", itemId, itemType);
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
    if (item?.taxes?.additionTaxes || item?.taxes?.deductionTaxes) {
      // Convert API taxes to modal format
      const additionTaxes = (item.taxes?.additionTaxes || []).map((tax) => ({
        id: tax.id,
        taxType: tax.taxType?.toString() || "",
        taxPercentage: tax.taxPercentage || "",
        inclusive: tax.inclusive || false,
        amount: tax.amount?.toString() || "",
      }));

      const deductionTaxes = (item.taxes?.deductionTaxes || []).map((tax) => ({
        id: tax.id,
        taxType: tax.taxType?.toString() || "",
        taxPercentage: tax.taxPercentage || "",
        inclusive: tax.inclusive || false,
        amount: tax.amount?.toString() || "",
      }));

      savedTaxes = {
        additionTaxes: additionTaxes,
        deductionTaxes: deductionTaxes,
        netCost: item.taxes?.netCost || baseCost.toFixed(2),
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
  };

  // Tax modal functions for material taxes
  const handleOpenTaxModal = async (rowIndex) => {
    console.log("Opening tax modal for row:", rowIndex);

    if (rowIndex < 0 || rowIndex >= rateAndTaxes.length) {
      console.error("Invalid row index:", rowIndex);
      return;
    }

    setTableId(rowIndex);
    setShowTaxModal(true);

    const material = rateAndTaxes[rowIndex];
    console.log("Selected material for tax modal:", material);

    if (material && material.id) {
      try {
        const materialId = material.id;
        console.log("Fetching rate details for material ID:", materialId);
        const response = await axios.get(
          `${baseURL}po_mor_inventories/${materialId}/ropo_rate_details.json?token=${token}`
        );

        console.log("Rate details API response:", response.data);

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
            pms_inventory_id: rateData.pms_inventory_id || null,
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
                  percentage: tax.percentage || null,
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
                  percentage: tax.percentage || null,
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
                };
              }) || [],
          },
        }));

        // Fetch tax percentages for each tax item
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
      console.log("No material ID found, opening modal with empty data");
      if (!taxRateData[rowIndex]) {
        setTaxRateData((prev) => ({
          ...prev,
          [rowIndex]: {
            material: material?.material || "Sample Material",
            hsnCode: "",
            ratePerNos: "",
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

  // Fetch tax percentages for specific material and tax category
  const fetchTaxPercentagesByMaterial = async (
    pmsInventoryId,
    taxCategoryId
  ) => {
    try {
      if (!pmsInventoryId || !taxCategoryId) {
        console.warn("Missing required parameters for tax percentage fetch");
        return [];
      }

      const response = await axios.get(
        `${baseURL}tax_percentage_by_material.json?pms_inventory_id=${pmsInventoryId}&tax_category_id=${taxCategoryId}&token=${token}`
      );
      console.log("Tax percentages by material response:", response.data);
      return response.data.percentages || [];
    } catch (error) {
      console.error("Error fetching tax percentages by material:", error);
      return [];
    }
  };

  // Approval modal functions
  const openApprovalModal = () => setShowApprovalModal(true);
  const closeApprovalModal = () => setShowApprovalModal(false);

  // Helper function to get tax percentages
  const getChargesTaxPercentages = (taxCategoryId) => {
    if (!taxCategoryId) return [];

    const taxCategory = chargesTaxPercentages.find((category) => {
      if (!category || !category.id) return false;
      return category.id.toString() === taxCategoryId.toString();
    });
    return taxCategory ? taxCategory.percentages || [] : [];
  };

  // Tax modal functions
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
            return { ...tax, [field]: value };
          }
          return tax;
        });
        return {
          ...prev,
          additionTaxes: updatedAdditionTaxes,
        };
      });
    } else {
      setChargeTaxes((prev) => {
        const updatedDeductionTaxes = prev.deductionTaxes.map((tax) => {
          if (tax.id === taxId) {
            return { ...tax, [field]: value };
          }
          return tax;
        });
        return {
          ...prev,
          deductionTaxes: updatedDeductionTaxes,
        };
      });
    }
  };

  const handleSaveTaxes = () => {
    // For details page, we just close the modal since we can't edit
    handleCloseTaxesModal();
  };

  // Handle status submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status_log: {
          status: selectedStatus?.value.toLowerCase() || "Draft",
          remarks: poRemark || "",
          comments: poComments || "",
          admin_comment: "",
        },
      };

      const response = await axios.put(
        `${baseURL}purchase_orders/${id}/update_status.json?token=${token}`,
        payload
      );

      console.log("Status update successful:", response.data);
      alert("Status updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading ROPO data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* top navigation above */}
      {/* <div className="main-content"> */}
      {/* sidebar ends above */}
      {/* webpage conteaint start */}
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">Home &gt; Purchase &gt; MTO &gt; MTO Pending Approval</a>
          <h5 className="mt-3">Create Purchase Order</h5>
          <div className="row my-4 align-items-center">
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
            </div>
          </div>
          <div id="content2">
            <div className="card">
              <div className="card-body">
                <div className=" text-center">
                  <h4>PO for New Material (Import)</h4>
                </div>
                <section className="mor p-2 pt-2">
                  <div className="container-fluid">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#Import1"
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
                          data-bs-target="#Import2"
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
                          data-bs-target="#Import3"
                          type="button"
                          role="tab"
                          aria-controls="nav-contact"
                          aria-selected="false"
                        >
                          Term &amp; Conditions
                        </button>
                        {/* <button
                            className="nav-link"
                            id="nav-contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Import4"
                            type="button"
                            role="tab"
                            aria-controls="nav-contact"
                            aria-selected="false"
                          >
                            Amendment
                          </button> */}
                      </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="Import1"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="card-body">
                            <div className="row">
                              <div className="d-flex gap-2 justify-content-end mb-3">
                                {ropoData?.selected_status === "Draft" && (
                                  <Link
                                    to={`/ropo-import-edit/${id}?token=${token}`}
                                    className="d-flex align-items-center"
                                    style={{ borderColor: "#8b0203" }}
                                  >
                                    <button
                                      type="button"
                                      className="purple-btn1"
                                    >
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

                                {ropoData?.selected_status?.toLowerCase() !==
                                  "draft" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "accepted_by_vendor" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "rejected_by_vendor" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "cancelled" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "terminated" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "rejected" &&
                                  ropoData?.selected_status?.toLowerCase() !==
                                    "submitted" &&
                                  ropoData?.vendor_status?.toLowerCase() !==
                                    "accepted" && (
                                    <Link
                                      to={`/ropo-mapping-ammend/${ropoData?.parent_po_id}?token=${token}`}
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

                                {ropoData?.approval_logs &&
                                  ropoData.approval_logs.length > 0 && (
                                    <button
                                      type="button"
                                      className="purple-btn2 mb-3"
                                      onClick={openApprovalModal}
                                      style={{
                                        backgroundColor:
                                          ropoData?.selected_status ===
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
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                <div className="col-6 ">
                                  <label>Company </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.company_name || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>PO Type </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.po_type || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>PO Date </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.po_date || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Created ON </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.created_at || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>PO No </label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.po_number || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Total PO Value</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.total_value || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>PO Currency</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.po_currency || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Conversion Rate</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.conversion_rate ?? "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Payable To Supplier</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.payable_to_supplier ?? "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Payable To Service Provider</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.payable_to_service_provider ??
                                      "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Total Discount</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.total_discount || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Supplier</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.supplier_name || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Vendor GSTIN</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.vendor_gstin || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Branch</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.branch || "-"}
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                <div className="col-6 ">
                                  <label>Unloading Scope</label>
                                </div>
                                <div className="col-6">
                                  <label className="text">
                                    <span className="me-3 text-dark">:</span>
                                    {ropoData?.unloading_scope || "-"}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between  align-items-center">
                              <h5
                                className=" "
                                data-bs-toggle="modal"
                                data-bs-target="#sereneModal"
                              >
                                Material Details
                              </h5>
                            </div>
                            <div className="tbl-container me-2 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th>Sr. No</th>
                                    <th>Sub-Project</th>
                                    <th>MOR No.</th>
                                    <th>Material Description</th>
                                    {/* <th>Material Specifications</th>
                                      <th>UMO</th> */}
                                    <th>Pending Mor Qty</th>
                                    <th>PO Order Qty</th>
                                    <th>GRN Qty</th>
                                    <th>PO Balance Qty</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ropoData?.material_details &&
                                  ropoData.material_details.length > 0 ? (
                                    ropoData.material_details.map(
                                      (mat, idx) => (
                                        <tr key={mat.id || idx}>
                                          <td>{idx + 1}</td>
                                          <td className="text-decoration-underline">
                                            {mat.project || "-"}
                                          </td>
                                          <td>{mat.sub_project || "-"}</td>
                                          <td>{mat.material || "-"}</td>
                                          <td>{mat.uom || "-"}</td>
                                          <td>{mat.mor_qty || "-"}</td>
                                          <td>{mat.po_order_qty || "-"}</td>
                                          <td>{mat.grn_qty || "-"}</td>
                                          <td>{mat.po_balance_qty || "-"}</td>
                                          {/* <td>
                                        <i
                                          className="fa-solid fa-xmark"
                                          style={{ fontSize: 18 }}
                                        />
                                      </td> */}
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={9} className="text-center">
                                        No material details available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="Import2"
                        role="tabpanel"
                        aria-labelledby="nav-profile-tab"
                        tabIndex={0}
                      >
                        <div className=" ">
                          <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                        </div>
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>Sr. No</th>
                                <th style={{ minWidth: "220px" }}>Material</th>
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
                              {rateAndTaxes.length > 0 ? (
                                rateAndTaxes.map((item, index) => (
                                  <tr key={item.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{item.material || "-"}</td>
                                    <td>{item.uom || "-"}</td>
                                    <td>{item.po_qty || "-"}</td>
                                    <td>{item.adjusted_qty || "-"}</td>
                                    <td>{item.tolerance_qty || "-"}</td>
                                    <td>
                                      {formatUsdInInr(
                                        item.material_rate,
                                        item.material_rate_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.material_cost,
                                        item.material_cost_in_inr
                                      )}
                                    </td>
                                    <td>{item.discount_percentage || "-"}</td>
                                    <td>
                                      {formatUsdInInr(
                                        item.discount_rate,
                                        item.discount_rate_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.after_discount_value,
                                        item.after_discount_value_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.tax_addition,
                                        item.tax_addition_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.tax_deduction,
                                        item.tax_deduction_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.total_charges,
                                        item.total_charges_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.total_base_cost,
                                        item.total_base_cost_in_inr
                                      )}
                                    </td>
                                    <td>
                                      {formatUsdInInr(
                                        item.all_inclusive_cost,
                                        item.all_inclusive_cost_in_inr
                                      )}
                                    </td>
                                    <td
                                      className="text-decoration-underline"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleOpenTaxModal(index)}
                                    >
                                      select
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="17" className="text-center">
                                    No rate and taxes data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className=" ">
                          <h5 className=" mt-3">Tax &amp; Charges Summary</h5>
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
                                <th>USD</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Total Base Cost</td>
                                <td>{taxSummary.total_base_cost || "0"}</td>
                                <td>{taxSummary.total_base_cost || "0"}</td>
                              </tr>
                              <tr>
                                <td>Total Tax</td>
                                <td>{taxSummary.total_tax || "0"}</td>
                                <td>{taxSummary.total_tax || "0"}</td>
                              </tr>
                              <tr>
                                <td>Total Charge</td>
                                <td>{taxSummary.total_charge || "0"}</td>
                                <td>{taxSummary.total_charge || "0"}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  Total All Incl. Cost
                                </td>
                                <td className="fw-bold">
                                  {taxSummary.total_inclusive_cost || "0"}
                                </td>
                                <td className="fw-bold">
                                  {taxSummary.total_inclusive_cost || "0"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th rowSpan={2}>Charges And Taxes</th>
                                <th colSpan={2}>Amount</th>
                                <th rowSpan={2}>Payable Currency</th>
                                <th rowSpan={2}>Service Certificate</th>
                                <th rowSpan={2}>Select Service Provider</th>
                                <th rowSpan={2}>Remarks</th>
                              </tr>
                              <tr>
                                <th>INR</th>
                                <th>USD</th>
                              </tr>
                              <tr>
                                <th colSpan={7}>Tax Addition(Exclusive)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td colSpan={7}>No Records Found.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th colSpan={6}>Charges (Exclusive)</th>
                              </tr>

                              <tr>
                                <th>Charge Name</th>
                                <th>Amount (INR)</th>
                                <th>
                                  Amount ({ropoData?.po_currency || "USD"})
                                </th>
                                <th>Service Certificate</th>
                                <th>Service Provider</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exclusiveCharges &&
                              exclusiveCharges.length > 0 ? (
                                exclusiveCharges.map((row) => (
                                  <tr key={row.id}>
                                    <td>{row.resource_name || "-"}</td>
                                    <td>
                                      INR{" "}
                                      {parseFloat(
                                        row.amount_in_inr || 0
                                      ).toFixed(2)}
                                    </td>
                                    <td>
                                      {(
                                        ropoData?.po_currency || "USD"
                                      ).toUpperCase()}{" "}
                                      {parseFloat(row.amount || 0).toFixed(2)}
                                    </td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(row.inclusive)}
                                        disabled
                                      />
                                    </td>
                                    <td>{row.supplier_name || "-"}</td>
                                    <td>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        value={row.remarks || ""}
                                        readOnly
                                        disabled
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    No exclusive charges available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

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
                                </tr>
                              </thead>
                              <tbody>
                                {charges.length > 0 ? (
                                  charges.map((charge) => (
                                    <tr key={charge.id}>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={
                                            chargeNames.find(
                                              (cn) => cn.id === charge.charge_id
                                            )?.name ||
                                            charge.charge_name ||
                                            ""
                                          }
                                          disabled={true}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control forname-control decimal-input"
                                          value={charge.amount}
                                          disabled
                                          placeholder="Enter amount"
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
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center">
                                      No charges available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mt-3">Other Cost</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>
                                    Transportation, Loading &amp; Unloading
                                    Details
                                  </th>
                                  <th>Cost</th>
                                  <th>Scope</th>
                                  <th>Taxes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {otherCosts.length > 0 ? (
                                  otherCosts.map((cost) => (
                                    <tr key={cost.id}>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={cost.cost_name || ""}
                                          disabled={true}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control forname-control decimal-input"
                                          value={cost.amount}
                                          disabled
                                          placeholder="Enter amount"
                                        />
                                      </td>
                                      <td>
                                        <select
                                          className="form-control form-select mySelect"
                                          value={cost.scope}
                                          disabled={true}
                                        >
                                          <option value="">Select Scope</option>
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
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center">
                                      No other costs available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="Import3"
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
                                  {ropoData?.terms_and_conditions
                                    ?.credit_period || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.po_validity_period || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                              <div className="col-6 ">
                                <label>Advance Reminder Duration (Days) </label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">:-</span>
                                  {ropoData?.terms_and_conditions
                                    ?.advance_reminder_duration || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.payment_terms || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.payment_remarks || "-"}
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
                                  {ropoData?.total_value || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Supplier Advance Allowed (%) </label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">:-</span>
                                  {ropoData?.terms_and_conditions
                                    ?.supplier_advance || "-"}
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
                                  {ropoData?.total_discount || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.supplier_advance_amount || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.survice_certificate_advance || "-"}
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
                                  {ropoData?.terms_and_conditions
                                    ?.service_certificate_advance_amount || "-"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Advance Payment Schedule</h5>
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
                          </div>
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
                              {ropoData?.delivery_schedules &&
                              ropoData.delivery_schedules.length > 0 ? (
                                ropoData.delivery_schedules.map(
                                  (schedule, index) => (
                                    <tr key={schedule.id || index}>
                                      <td>{schedule.mor_number || "-"}</td>
                                      <td>{schedule.material || "-"}</td>
                                      <td>
                                        {schedule.mor_delivery_schedule || "-"}
                                      </td>
                                      <td>
                                        {schedule.po_delivery_date || "-"}
                                      </td>
                                      <td>
                                        {schedule.sch_delivery_qty || "-"}
                                      </td>
                                      <td>{schedule.po_delivery_qty || "-"}</td>
                                      <td>
                                        {schedule.delivery_address || "-"}
                                      </td>
                                      <td>{schedule.store_name || "-"}</td>
                                      <td>{schedule.remarks || "-"}</td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan={9} className="text-center">
                                    No delivery schedules available.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 ">
                          <h5 className=" ">General Term &amp; Conditions</h5>
                        </div>
                        <div className="tbl-container me-2 mt-2">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>Condition Category</th>
                                <th>Condition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ropoData?.resource_term_conditions &&
                              ropoData.resource_term_conditions.length > 0 ? (
                                ropoData.resource_term_conditions.map(
                                  (term, index) => (
                                    <tr key={term.id || index}>
                                      <td>{term.condition_category || "-"}</td>
                                      <td>{term.condition || "-"}</td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan={2} className="text-center">
                                    No general terms and conditions available
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
                              </tr>
                            </thead>
                            <tbody>
                              {ropoData?.resource_material_term_conditions &&
                              ropoData.resource_material_term_conditions
                                .length > 0 ? (
                                ropoData.resource_material_term_conditions.map(
                                  (term, index) => (
                                    <tr key={term.id || index}>
                                      <td>{term.material_sub_type || "-"}</td>
                                      <td>{term.condition_category || "-"}</td>
                                      <td>{term.condition || "-"}</td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan={3} className="text-center">
                                    No material specific terms and conditions
                                    available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="Import4"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                        tabIndex={0}
                      ></div>
                    </div>
                    {/* /.container-fluid */}
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5  ms-2">
            <h5>Document Attachment</h5>
            <div
              className=""
              data-bs-toggle="modal"
              data-bs-target="#attachModal"
            ></div>
          </div>

          <div
            className="tbl-container mb-4 ms-2"
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
                      <div style={{ display: "flex", alignItems: "center" }}>
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
                    ropoData?.status_list?.map((status) => ({
                      value: status.toLowerCase(),
                      label: status,
                    })) || []
                  }
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
                  isDisabled={ropoData?.disabled ?? false}
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
          <h5 className="px-3 mt-3">Audit Logs</h5>
          <div className="px-3">
            <div className="tbl-container px-0">
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remark</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {ropoData?.status_logs && ropoData.status_logs.length > 0 ? (
                    ropoData.status_logs.map((log, index) => (
                      <tr key={log.id || index}>
                        <th>{index + 1}</th>
                        <td>{log.user || "-"}</td>
                        <td>{log.date || "-"}</td>
                        <td>{log.status || "-"}</td>
                        <td>{log.po_remark || "-"}</td>
                        <td>{log.po_comments}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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
      {/* </div> */}

      {/* Navigation Top */}
      {/* sidebar start below */}
      <div
        className="modal fade"
        id="Attachment"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel32"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <h5>Upload File</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-md-5 mt-0">
                    <div className="form-group">
                      <label>
                        File Name <span>*</span>{" "}
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="INR 0.00"
                      />
                    </div>
                  </div>
                  <div className="col-md-5 mt-0">
                    <div className="form-group">
                      <label>
                        Attachment Name <span>*</span>{" "}
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="INR 0.00"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="file"
                        placeholder="INR 0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button className="purple-btn2">sumbit</button>
            </div>
          </div>
        </div>
      </div>
      {/* webpage container end */}
      {/* Modal 32*/}
      <div
        className="modal fade"
        id="exampleModal32"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel32"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <h5>Select RFQ</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">RFQ No.</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-4 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold"> RFQ From</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-4 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">RFQ To</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="purple-btn2">Go</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal end */}
      {/* Modal Attributes*/}
      <div
        className="modal fade"
        id="customModal"
        tabIndex={-1}
        aria-labelledby="customModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                Select MoR
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <h5 className="mt-3 ms-2">Search MoR</h5>
              <div className="card">
                <div className="card-body mt-0">
                  <div className="row">
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">
                          Project <span>*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="MRPL"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="po-fontBold">Sub Project</label>
                        <select
                          className="form-control form-select"
                          style={{ width: "100%" }}
                        >
                          <option selected="selected">[Select One]</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Mor No.</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=" "
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Work Order No.</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=" "
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Material Type</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Not Selected"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Mor Start Date</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Work Category</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Material Sub Type</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Not Selected"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Mor End Date</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Sub Work Category</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Material</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Not Selected"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label className="po-fontBold">Contractor</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h5 className="mt-3">MOR List</h5>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th colSpan={9}>Material Details</th>
                    </tr>
                    <tr>
                      <th rowSpan={2} />
                      <th rowSpan={2}>Project_SubProject</th>
                      <th rowSpan={2}>Mor _Date _ Contractor</th>
                      <th rowSpan={2}>
                        <input type="checkbox" />
                      </th>
                      <th>Material Type</th>
                      <th>Material Sub Type</th>
                      <th>Material</th>
                      <th>UOM</th>
                      <th>Pending Qty</th>
                      <th>Order Qty</th>
                      <th>Mored UOM</th>
                      <th>Balance Qty</th>
                      <th>Current Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={2}>
                        <input type="checkbox" />
                      </td>
                      <td rowSpan={2}>NEXTOWN PHASE II_RUBY</td>
                      <td rowSpan={2}>
                        IN/NXTPH2/X301/35_Mar 31, 2023_United Builders - Crs
                      </td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>Steel</td>
                      <td>STEEL-TMT</td>
                      <td>TEEL (TMT-500)-08MM</td>
                      <td>MT</td>
                      <td>10.611</td>
                      <td>36.020</td>
                      <td>MT</td>
                      <td>10.611</td>
                      <td>Approved</td>
                    </tr>
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>Steel</td>
                      <td>STEEL-TMT</td>
                      <td>STEEL (TMT-500)-12MM</td>
                      <td>MT</td>
                      <td>7.346</td>
                      <td>21.190</td>
                      <td>MT</td>
                      <td>7.346</td>
                      <td>Approved</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                <button className="purple-btn2">Accept Selected</button>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal end */}
      {/* rate & taxes Attributes modal start */}
      <div
        className="modal fade"
        id="cozyModal"
        tabIndex={-1}
        aria-labelledby="cozyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                Material Attributes
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between">
                <p>Material Attributes</p>
                <p className="text-decoration-underline">
                  Create Attribute Group
                </p>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Attribute Group</th>
                      <th>Attributes</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4}>No Records Found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex">
                <p className="text-decoration-underline">
                  Material Attributes <span>/</span>
                </p>
                <p className="text-decoration-underline">
                  Create Attribute Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* rate & taxes Attributes modal end */}
      {/* rate & taxes select modal start */}
      <div
        className="modal fade"
        id="zenithModal"
        tabIndex={-1}
        aria-labelledby="zenithModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                View Tax &amp; Rate
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div
              className="modal-body p-2"
              style={{ maxHeight: 500, overflowY: "auto" }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Material</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">HSN Code</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Rate per Nos</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Total Po Qty</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Discount</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Discount Value</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Discount Rate</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-0">
                    <div className="form-group">
                      <label className="po-fontBold">Material Cost</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="mb-3 w-50">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label po-fontBoldM"
                    >
                      Remark
                    </label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                  <div className="mb-3 w-50">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label po-fontBoldM"
                    >
                      Additional Info.
                    </label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="tbl-container  mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="modal-th" rowSpan={2}>
                        Tax / Charge Type
                      </th>
                      <th className="modal-th" colSpan={2}>
                        Tax / Charges per UOM (INR)
                      </th>
                      <th className="modal-th" rowSpan={2}>
                        Inclusive
                      </th>
                      <th className="modal-th" colSpan={2}>
                        Tax / Charges Amount
                      </th>
                      <th className="modal-th" rowSpan={2}>
                        Action
                      </th>
                    </tr>
                    <tr>
                      <th className="modal-th">INR</th>
                      <th className="modal-th">USD</th>
                      <th className="modal-th">INR</th>
                      <th className="modal-th">USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <th>Total Base Cost</th>
                      <td />
                      <td />
                      <td />
                      <td>2160</td>
                      <td>2160</td>
                      <td />
                    </tr>
                    <tr className="text-center">
                      <th>Addition Tax &amp; Charges</th>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr className="text-center">
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle drop-modal-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Custom Duty
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>10</td>
                      <td>012</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>400</td>
                      <td>4.83</td>
                      <td>cancel</td>
                    </tr>
                    <tr className="text-center">
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle drop-modal-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            C &amp; F Charges
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>10</td>
                      <td>012</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>400</td>
                      <td>4.83</td>
                      <td>cancel</td>
                    </tr>
                    <tr className="text-center">
                      <th>Sub Total A</th>
                      <td />
                      <td />
                      <td />
                      <th>2548.8</th>
                      <th>2548.8</th>
                    </tr>
                    <tr className="text-center">
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle drop-modal-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            TDS
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle drop-modal-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            select
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>0 00</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <th>0 00</th>
                      <td>0 00</td>
                      <td>Cancel</td>
                    </tr>
                    <tr className="text-center">
                      <th>Sub Total B</th>
                      <td />
                      <td />
                      <td />
                      <th>0 00</th>
                      <th>0 00</th>
                      <td />
                    </tr>
                    <tr className="text-center">
                      <th>Net Cost</th>
                      <td />
                      <td />
                      <td />
                      <th>2548.8</th>
                      <th>2548.8</th>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <div className="purple-btn2">save</div>
            </div>
          </div>
        </div>
      </div>
      {/* rate & taxes select modal end */}
      {/* Matarial Details (sereneModal) modal start */}
      <div
        className="modal fade"
        id="sereneModal"
        tabIndex={-1}
        aria-labelledby="sereneModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                Store Wise Material Stock
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Stock As On Date</th>
                      <th>UOM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Marathon ERA</th>
                      <th>1.500</th>
                      <th>KG</th>
                    </tr>
                    <tr>
                      <th>COS-CHM-OMG</th>
                      <th>2.500</th>
                      <th>KG</th>
                    </tr>
                    <tr>
                      <th>COS-CHM-OMG</th>
                      <th>2.500</th>
                      <th>KG</th>
                    </tr>
                    <tr>
                      <th>Krishna Mandir</th>
                      <th>0.250</th>
                      <th>KG</th>
                    </tr>
                    <tr>
                      <th>Nexworld Common Store</th>
                      <th>8.000</th>
                      <th>KG</th>
                    </tr>
                    <tr>
                      <th>IXOXI-Nexzone</th>
                      <th>175.000</th>
                      <th>KG</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                <button className="PO-blue-btn">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Matarial Details (sereneModal) modal end */}
      {/* Amend modal start */}
      <div
        className="modal fade"
        id="Amend"
        tabIndex={-1}
        aria-labelledby="zenithModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                Amend Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div
              className="modal-body p-2"
              style={{ maxHeight: 600, overflowY: "auto" }}
            >
              <div className="card-body">
                <div className="row ">
                  <h5>MOR - Material Details</h5>
                  <div
                    className="tbl-container px-0 "
                    style={{ maxHeight: 500 }}
                  >
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th />
                          <th>Material Name</th>
                          <th>Project</th>
                          <th>Sub Project </th>
                          <th>Work order No. </th>
                          <th>MOR No. </th>
                          <th>Base UOM </th>
                          <th>Pending MOR Quantity </th>
                          <th>PO Order Quantity </th>
                          <th>GRN Quantity </th>
                          <th>PO Balance Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td rowSpan={8}> Nexzone - Phase II </td>
                          <td rowSpan={8}> Bodhi </td>
                          <td rowSpan={8}>WO/NXZPh2/Bodhi/1 </td>
                          <td rowSpan={8}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                {" "}
                                IN/NXZPh2/Bodhi/91{" "}
                              </label>
                            </div>
                          </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                        <tr>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>Steel - STEEL-TMT - STEEL (TMT-500)-08MM </td>
                          <td>MT</td>
                          <td>166.296</td>
                          <td>35.832</td>
                          <td>35.832</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="d-flex">
                  <button
                    className="purple-btn2"
                    data-bs-toggle="modal"
                    data-bs-target="#add-mor"
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-plus me-2" /> Add MOR
                  </button>
                  <button className="purple-btn2">Delete Selected</button>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="purple-btn2">Update</button>
                  <button className="purple-btn1">Cancel</button>
                  <button className="purple-btn2">Email</button>
                </div>
                <h5 className=" mt-3">Audit Log</h5>
                <div className="px-3">
                  <div className="tbl-container px-0">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Sr.No.</th>
                          <th>User</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Remark</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Pratham Shastri</td>
                          <td>15-02-2024</td>
                          <td>Verified</td>
                          <td>
                            <i
                              className="fa-regular fa-eye"
                              data-bs-toggle="modal"
                              data-bs-target="#remark-modal"
                              style={{ fontSize: 18 }}
                            />
                          </td>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Amend  modal end */}
      <div
        className="modal fade"
        id="add-mor"
        tabIndex={-1}
        aria-labelledby="zenithModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                Add MOR
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div
              className="modal-body p-2"
              style={{ maxHeight: 600, overflowY: "auto" }}
            >
              <div className="card-body">
                <div className="card card-default" id="mor-material-details">
                  <div className="card-header">
                    <h3 className="card-title">Search MOR</h3>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Project <span>*</span>
                          </label>
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
                        {/* /.form-group */}
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Sub Project </label>
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
                        {/* /.form-group */}
                        {/* /.form-group */}
                      </div>
                      {/* /.col */}
                      <div className="col-md-3">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>MOR No. </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                          />
                        </div>
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-3">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>Work Order No. </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                          />
                        </div>
                        {/* /.form-group */}
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Material Type </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                          />
                        </div>
                        {/* /.form-group */}
                        {/* /.form-group */}
                      </div>
                      {/* /.col */}
                      <div className="col-md-2">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>MOR Start Date </label>
                          <div
                            id="datepicker"
                            className="input-group date"
                            data-date-format="mm-dd-yyyy"
                          >
                            <input className="form-control" type="text" />
                            <span className="input-group-addon">
                              <i
                                className="fa-solid fa-calendar-days"
                                style={{ color: "#8B0203" }}
                              />{" "}
                            </span>
                          </div>
                        </div>
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-2">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>Work Category </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Default input"
                          />
                        </div>
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-2">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>Material Sub Type </label>
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
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-2 ">
                        {/* /.form-group */}
                        <div className="form-group">
                          <label>MOR End Date </label>
                          <div
                            id="datepicker"
                            className="input-group date"
                            data-date-format="mm-dd-yyyy"
                          >
                            <input className="form-control" type="text" />
                            <span className="input-group-addon">
                              <i
                                className="fa-solid fa-calendar-days"
                                style={{ color: "#8B0203" }}
                              />{" "}
                            </span>
                          </div>{" "}
                        </div>
                        {/* /.form-group */}
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Sub Work Category</label>
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
                      <div className="col-md-2 mt-2">
                        <div className="form-group">
                          <label>Material</label>
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
                      <div className="col-md-2 mt-2">
                        <div className="form-group">
                          <label>Contractor</label>
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
                  {/* /.col */}
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <div className="purple-btn2">Search</div>
                <div className="purple-btn2">Show All</div>
                <div className="purple-btn1">Show All</div>
                <div className="purple-btn1">Show All</div>
              </div>
              <div className="tbl-container me-2 mt-2">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th rowSpan={2} />
                      <th rowSpan={2}>Project _SubProject</th>
                      <th rowSpan={2}>MOR _Date _ Contractor</th>
                      <th rowSpan={2}>
                        <input type="checkbox" name="" id="" />
                      </th>
                      <th colSpan={9}>Material Details</th>
                    </tr>
                    <tr>
                      <th>Material Type </th>
                      <th>Material Sub Type </th>
                      <th>Material</th>
                      <th>UOM</th>
                      <th>Pending Qty </th>
                      <th>Order Qty </th>
                      <th>MOR UOM </th>
                      <th>MOR UOM </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={2}>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>Nexzone - Phase II</td>
                      <td>IN/NXZPh2/Bodhi/6 _Mar 04, 2022 _Internal Works</td>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>MISCELLANEOUSITEMS </td>
                      <td>TIKAU WITH DANDA - 12 NO </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>000 </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>Approved </td>
                    </tr>
                    <tr>
                      <td>Nexzone - Phase II</td>
                      <td>IN/NXZPh2/Bodhi/6 _Mar 04, 2022 _Internal Works</td>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>MISCELLANEOUSITEMS </td>
                      <td>TIKAU WITH DANDA - 12 NO </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>000 </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>Approved </td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>Nexzone - Phase II</td>
                      <td>IN/NXZPh2/Bodhi/6 _Mar 04, 2022 _Internal Works</td>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>MISCELLANEOUSITEMS </td>
                      <td>TIKAU WITH DANDA - 12 NO </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>000 </td>
                      <td>NOS </td>
                      <td>5.000 </td>
                      <td>Approved </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Amend modal start */}
      {/* file_attchement add modal */}

      {/* file_attchement add modal end */}
      {/* document_attchment schedule modal */}

      {/* document_attchment schedule modal end */}

      {/* View Tax & Rate Modal for Charges */}
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
                    Rate per Nos <span> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxRateData[tableId]?.ratePerNos || ""}
                    readOnly
                    disabled={true}
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
                    Conversion Rate (USD to INR)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={ropoData?.conversion_rate || ""}
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
                    readOnly
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
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
            </div>

            <div className="row mb-3">
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
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Remark</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={taxRateData[tableId]?.remark || ""}
                    readOnly
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
                        <th colSpan={2}>Tax / Charges per UOM (INR)</th>
                        <th>Inclusive</th>
                        <th colSpan={2}>Tax / Charges Amount</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th>INR</th>
                        <th>USD</th>
                        <th></th>
                        <th>INR</th>
                        <th>USD</th>
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
                              ropoData?.conversion_rate
                            )}
                            readOnly
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control "
                            value={formatUsdInInr(
                              taxRateData[tableId]?.afterDiscountValue,
                              safeConvertUsdToInr(
                                taxRateData[tableId]?.afterDiscountValue,
                                ropoData?.conversion_rate
                              )
                            )}
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
                          <span>-</span>
                        </td>
                      </tr>
                      {taxRateData[tableId]?.addition_bid_material_tax_details
                        ?.filter((item) => !item._destroy)
                        .map((item, rowIndex) => (
                          <tr key={`${rowIndex}-${item.id}`}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  item.taxChargeType ||
                                  taxOptions.find(
                                    (option) =>
                                      option.id === item.tax_category_id
                                  )?.value ||
                                  ""
                                }
                                readOnly
                                disabled={true}
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={safeConvertUsdToInr(
                                  item.amount || 0,
                                  ropoData?.conversion_rate
                                )}
                                readOnly
                                disabled={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={parseFloat(item.amount || 0).toFixed(2)}
                                readOnly
                                disabled={true}
                              />
                            </td>

                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                disabled
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  // For ALL addition taxes, show Total Base Cost + Tax Amount in INR
                                  (() => {
                                    const baseCostInr = safeConvertUsdToInr(
                                      taxRateData[tableId]
                                        ?.afterDiscountValue || 0,
                                      ropoData?.conversion_rate
                                    );
                                    // Convert the stored USD amount back to INR for display
                                    const taxAmountInr = safeConvertUsdToInr(
                                      item.amount || 0,
                                      ropoData?.conversion_rate
                                    );
                                    return (
                                      parseFloat(baseCostInr) +
                                      parseFloat(taxAmountInr)
                                    ).toFixed(2);
                                  })()
                                }
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
                                placeholder="Base Cost + Tax Amount"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  // For ALL addition taxes, show Total Base Cost + Tax Amount in USD
                                  (
                                    parseFloat(
                                      taxRateData[tableId]
                                        ?.afterDiscountValue || 0
                                    ) + parseFloat(item.amount || 0)
                                  ).toFixed(2)
                                }
                                readOnly
                                disabled={true}
                                placeholder="Auto calculated"
                              />
                            </td>

                            <td className="text-center">
                              <span>-</span>
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
                          <span>-</span>
                        </td>
                      </tr>

                      {taxRateData[tableId]?.deduction_bid_material_tax_details
                        ?.filter((item) => !item._destroy)
                        .map((item) => (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.taxChargeType || ""}
                                readOnly
                                disabled={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={safeConvertUsdToInr(
                                  item.amount || 0,
                                  ropoData?.conversion_rate
                                ).toFixed(2)}
                                readOnly
                                disabled={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={parseFloat(item.amount || 0).toFixed(2)}
                                readOnly
                                disabled={true}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item.inclusive}
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  // For deduction taxes, show Total Base Cost - Tax Amount in INR
                                  (() => {
                                    const baseCostInr = safeConvertUsdToInr(
                                      taxRateData[tableId]
                                        ?.afterDiscountValue || 0,
                                      ropoData?.conversion_rate
                                    );
                                    // Convert the stored USD amount back to INR for display
                                    const taxAmountInr = safeConvertUsdToInr(
                                      item.amount || 0,
                                      ropoData?.conversion_rate
                                    );
                                    return Math.max(
                                      0,
                                      parseFloat(baseCostInr) -
                                        parseFloat(taxAmountInr)
                                    ).toFixed(2);
                                  })()
                                }
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
                                placeholder="Base Cost - Tax Amount"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  // For deduction taxes, show Total Base Cost - Tax Amount in USD
                                  Math.max(
                                    0,
                                    parseFloat(
                                      taxRateData[tableId]
                                        ?.afterDiscountValue || 0
                                    ) - parseFloat(item.amount || 0)
                                  ).toFixed(2)
                                }
                                readOnly
                                disabled={true}
                                placeholder="Auto calculated"
                              />
                            </td>
                            <td className="text-center">
                              <span>-</span>
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
                              ropoData?.conversion_rate
                            )}
                            readOnly
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={formatUsdInInr(
                              taxRateData[tableId]?.netCost,
                              safeConvertUsdToInr(
                                taxRateData[tableId]?.netCost,
                                ropoData?.conversion_rate
                              )
                            )}
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

      {/* Taxes Modal */}
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
                    <span>-</span>
                  </td>
                </tr>

                {/* Addition Tax Rows */}
                {chargeTaxes.additionTaxes.map((tax) => (
                  <tr key={tax.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          chargesAdditionTaxOptions.find(
                            (opt) => opt.id.toString() === tax.taxType
                          )?.name || ""
                        }
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={tax.taxPercentage ? `${tax.taxPercentage}%` : ""}
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={tax.inclusive}
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={tax.amount}
                        disabled={true}
                        readOnly
                        placeholder="Auto-calculated"
                      />
                    </td>

                    <td className="text-center">
                      <span>-</span>
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
                    <span>-</span>
                  </td>
                </tr>

                {/* Deduction Tax Rows */}
                {chargeTaxes.deductionTaxes.map((tax) => (
                  <tr key={tax.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          chargesDeductionTaxOptions.find(
                            (opt) => opt.id.toString() === tax.taxType
                          )?.name || ""
                        }
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={tax.taxPercentage ? `${tax.taxPercentage}%` : ""}
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={tax.inclusive}
                        disabled={true}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={tax.amount}
                        disabled={true}
                        readOnly
                        placeholder="Auto-calculated"
                      />
                    </td>

                    <td className="text-center">
                      <span>-</span>
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
            className="purple-btn1"
            onClick={handleCloseTaxesModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Approval Modal */}
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
                {!ropoData?.approval_logs ||
                ropoData?.approval_logs.length === 0 ? (
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
                      {ropoData?.approval_logs.map((log, id) => (
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
    </>
  );
};

export default RopoImportDetails;
