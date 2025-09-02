import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";
import SelectBox from "../components/base/Select/SelectBox";
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom";

const RopoImportCreate = () => {
  // State variables for the modal
  const [showModal, setShowModal] = useState(false);
  const [exchangeRate, setExchangeRate] = useState();
  const [addMORModal, setAddMORModal] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiMaterialInventoryIds, setApiMaterialInventoryIds] = useState();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

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
  const [wingsOptions, setWingsOptions] = useState([]);

  // PO form state
  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);
  const [createdOn, setCreatedOn] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Material data from API response
  const [submittedMaterials, setSubmittedMaterials] = useState([]);
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
      .get(`${baseURL}pms/suppliers.json?token=${token}`)
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers data:", error);
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
          { id: 2, name: "Canada", currency: "cad" }
        ]);
      });
  }, []);

  // Fetch delivery schedules data
  const fetchDeliverySchedules = useCallback(() => {
    if (submittedMaterials && submittedMaterials.length > 0) {
      const morInventoryIds = submittedMaterials.map(material => material.id).join(',');
      const apiUrl = `${baseURL}purchase_orders/material_delivery_schedules.json?token=${token}&mor_inventory_ids=${morInventoryIds}&type=import`;
      
      console.log("Fetching delivery schedules from:", apiUrl);
      
      axios
        .get(apiUrl)
        .then((response) => {
          console.log("Delivery schedules response:", response.data);
          setDeliverySchedules(response.data.material_delivery_schedules || []);
          setMaterialTermConditions(response.data.material_term_conditions || []);
        })
        .catch((error) => {
          console.error("Error fetching delivery schedules:", error);
          setDeliverySchedules([]);
          setMaterialTermConditions([]);
        });
    }
  }, [submittedMaterials, token, baseURL]);

  // Fetch delivery schedules when submitted materials change
  useEffect(() => {
    fetchDeliverySchedules();
  }, [fetchDeliverySchedules]);

  // Function to consolidate charges by charge name
  // This consolidates similar charges (e.g., handling charges, freight charges) across multiple materials
  // into single rows with total amounts, instead of showing separate rows for each material
  const getConsolidatedCharges = useCallback(() => {
    if (!chargesFromApi || chargesFromApi.length === 0) return [];
    
    // Filter only TaxCharge type charges
    const taxCharges = chargesFromApi.filter(charge => charge.resource_type === "TaxCharge");
    
    // Group charges by charge_name
    const groupedCharges = taxCharges.reduce((acc, charge) => {
      const chargeName = charge.charge_name || "Unknown";
      
      if (!acc[chargeName]) {
        acc[chargeName] = {
          charge_name: chargeName,
          total_amount_usd: 0,
          total_amount_inr: 0,
          charge_ids: [],
          charges: []
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
    return Object.values(groupedCharges).sort((a, b) => a.charge_name.localeCompare(b.charge_name));
  }, [chargesFromApi]);

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
    if (selectedOption) {
      setSelectedCurrency({
        code: selectedOption.value,
        symbol: selectedOption.symbol
      });
    }
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
  const [selectedCurrency, setSelectedCurrency] = useState({ code: "USD", symbol: "$" });

  // State for conversion rate
  const [conversionRate, setConversionRate] = useState(82.5);

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
    label: `${currency.currency.toUpperCase()} (${currency.name})`,
    symbol: currency.currency === "usd" ? "$" : currency.currency === "cad" ? "C$" : currency.currency.toUpperCase(),
  }));

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
      alert(duplicateMsg);
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
      alert("Please select a company.");
      return;
    }

    // Filter out deleted rows for validation
    const activeRows = tableData.filter((row) => !row._destroy);

    if (activeRows.length === 0) {
      console.log("No materials in table");
      alert("Please add at least one material before updating.");
      return;
    }

    // Check for duplicate materials
    // const materialIds = activeRows.map((row) => row.material);
    // const hasDuplicate = materialIds.some(
    //   (id, idx) => id && materialIds.indexOf(id) !== idx
    // );
    // if (hasDuplicate) {
    //   alert(
    //     "Duplicate materials are not allowed. Please ensure each material is unique."
    //   );
    //   return;
    // }

    // Check if any row is missing a material
    const missingMaterial = activeRows.some((row) => !row.material);
    console.log("missingMaterial:", missingMaterial);
    if (missingMaterial) {
      console.log("Some rows missing material");
      alert("Please select a material for all rows before updating.");
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

        alert("Materials updated successfully!");
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
      alert("Error submitting materials. Please try again.");
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
      params.append("q[mor_type_eq]", "ropo");
      if (selectedCompany?.value)
        params.append("q[company_id_in][]", selectedCompany.value);
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
      setMaterialDetailsData(rows);
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
      alert(
        "Order quantity cannot be negative. Please enter a valid positive number."
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

  const handleAcceptSelectedMaterials = async () => {
    if (!selectedCompany?.value) {
      alert("Please select a company first.");
      return;
    }
    if (selectedMaterialItems.length === 0) {
      alert("Please select at least one material");
      return;
    }

    try {
      const selectedRows = selectedMaterialItems.map(
        (idx) => materialDetailsData[idx]
      );

      // Validation: Check for duplicate materials
      const duplicateCheck = selectedRows.some((selectedRow) => {
        return submittedMaterials.some((existingMaterial) => {
          // Check if material with same mor_inventory_id already exists
          return (
            existingMaterial.mor_inventory_id === selectedRow.inventory_id ||
            existingMaterial.id === selectedRow.inventory_id
          );
        });
      });

      if (duplicateCheck) {
        alert(
          "Cannot add duplicate materials. Some selected materials are already added."
        );
        return;
      }

      // Validation: Check for negative or zero order quantities
      const invalidQuantities = selectedRows.some((row) => {
        const orderQty = parseFloat(row.order_qty) || 0;
        return orderQty <= 0;
      });

      if (invalidQuantities) {
        alert("Order quantity must be greater than 0 for all materials.");
        return;
      }

      // Validation: Check if all required fields are filled
      const missingFields = selectedRows.some((row) => {
        return !(row.material_name || row.material) || !row.uom_name || !row.order_qty;
      });

      if (missingFields) {
        alert(
          "Please ensure all materials have material name, UOM, and order quantity filled."
        );
        return;
      }

      // Prepare materials array for API payload
      const materials = selectedRows.map((r) => ({
        mor_inventory_id: r.inventory_id,
        order_qty: r.order_qty || r.required_quantity || 0,
        uom_id: r.uom_id || null,
        generic_info_id: r.generic_info_id || null,
        brand_id: r.brand_id || null,
        colour_id: r.colour_id || null,
      }));

      // Prepare API payload
      const payload = {
        po_id: purchaseOrderId || null,
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
      if (response.data.po_id) {
        setPurchaseOrderId(response.data.po_id);
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
              // Fallback: if API didn't return materials, use mor inventory id
              id: r.inventory_id,
              mor_inventory_id: r.inventory_id, // Add this for duplicate checking
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

      setSubmittedMaterials((prev) => {
        const seen = new Set(prev.map((x) => `${x.id}`));
        const unique = rowsToAdd.filter((r) => !seen.has(`${r.id}`));
        return [...prev, ...unique];
      });

      alert(`Successfully added ${selectedRows.length} material(s)`);
      setAddMORModal(false);
      setSelectedMaterialItems([]);
      
      // Fetch delivery schedules after materials are added
      setTimeout(() => {
        fetchDeliverySchedules();
      }, 100);
    } catch (error) {
      console.error("Error adding materials:", error);
      alert("Error adding materials. Please try again.");
    }
  };

  // Tax modal functions
  const handleOpenTaxModal = async (rowIndex) => {
    console.log("Opening tax modal for row:", rowIndex);
    console.log("Current tax options:", taxOptions);

    // Validate conversion rate is set
    if (!conversionRate || conversionRate <= 0) {
      alert(
        "Please set the Conversion Rate (USD to INR) in the PO Details tab before opening tax modal."
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
            material: rateData.material,
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
                  taxChargeType:
                    taxOptions.find(
                      (option) => option.id === tax.tax_category_id
                    )?.value || tax.resource_type,
                  taxType: tax.resource_type,
                  taxChargePerUom: taxChargePerUom,
                  percentageId: tax.percentage_id || null,
                  inclusive: tax.inclusive,
                  amount: tax.amount?.toString() || "0",
                };
              }) || [],
            deduction_bid_material_tax_details:
              rateData.deduction_tax_details?.map((tax) => {
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
                  taxChargeType:
                    deductionTaxOptions.find(
                      (option) => option.id === tax.tax_category_id
                    )?.value || tax.resource_type,
                  taxType: tax.resource_type,
                  taxChargePerUom: taxChargePerUom,
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
                  const usdValue = parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) || 0;
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
                  const usdValue = parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) || 0;
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
            }
          } else if (field === "inclusive") {
            // Toggle inclusive and recalculate when percentage-based
            currentTax.inclusive = value;
            const inputValue = currentTax.taxChargePerUom || "";
            if (inputValue && inputValue.includes("%")) {
              const percentage = parseFloat(inputValue.replace("%", "")) || 0;
              const recalculated = calculateTaxAmount(
                percentage,
                baseAmount,
                Boolean(value)
              );
              currentTax.amount = recalculated.toString();
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

            // Calculate the amount to send in USD
            // For ALL addition taxes, send the Tax / Charges per UOM value converted to USD
            let amountToSend = 0;
            if (tax.taxChargePerUom && tax.taxChargePerUom.includes("%")) {
              // If it's a percentage, calculate the percentage amount in USD
              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;
              const baseAmount = currentData.afterDiscountValue || 0;
              amountToSend = (baseAmount * percentage) / 100;
            } else {
              // If it's a fixed amount, convert the INR value to USD using conversion rate
              const inrValue = parseFloat(tax.taxChargePerUom) || 0;
              amountToSend =
                parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) || 0;
            }

            const payload = {
              resource_type: tax.taxType || "TaxCharge",
              resource_id: resolvedResourceId,
              amount: amountToSend,
              inclusive: tax.inclusive || false,
              addition: true,
              remarks: `${tax.taxChargeType} - ${amountToSend} USD`,
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

            // Calculate the amount to send in USD
            // For deduction taxes, send the Tax / Charges per UOM value converted to USD
            let amountToSend = 0;
            if (tax.taxChargePerUom && tax.taxChargePerUom.includes("%")) {
              // If it's a percentage, calculate the percentage amount in USD
              const percentage =
                parseFloat(tax.taxChargePerUom.replace("%", "")) || 0;
              const baseAmount = currentData.afterDiscountValue || 0;
              amountToSend = (baseAmount * percentage) / 100;
            } else {
              // If it's a fixed amount, convert the INR value to USD using conversion rate
              const inrValue = parseFloat(tax.taxChargePerUom) || 0;
              amountToSend =
                parseFloat(safeConvertInrToUsd(inrValue, conversionRate)) || 0;
            }

            const payload = {
              resource_type: tax.taxType || "TaxCharge",
              resource_id: resolvedResourceId,
              amount: amountToSend,
              inclusive: tax.inclusive || false,
              addition: false,
              remarks: `${tax.taxChargeType} - ${amountToSend} USD`,
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
              
              console.log("ROPO Rate Details API Response after save:", ropoResponse.data);
              
              // Update the charges data with the new information from the API
              if (ropoResponse.data) {
                const rateData = ropoResponse.data;
                const updatedChargesData = [];
                
                // Process addition tax details
                if (rateData.addition_tax_details && Array.isArray(rateData.addition_tax_details)) {
                  rateData.addition_tax_details.forEach((tax) => {
                    updatedChargesData.push({
                      id: tax.id,
                      material_id: material.id,
                      material_name: material.material_name || material.material,
                      charge_name: getTaxNameById(tax.resource_id),
                      resource_id: tax.resource_id,
                      resource_type: tax.resource_type,
                      amount: tax.amount,
                      amount_inr: convertUsdToInr(tax.amount, conversionRate),
                      inclusive: tax.inclusive,
                      tax_category_id: tax.tax_category_id,
                      percentage: tax.percentage,
                    });
                  });
                }

                // Process deduction tax details
                if (rateData.deduction_tax_details && Array.isArray(rateData.deduction_tax_details)) {
                  rateData.deduction_tax_details.forEach((tax) => {
                    updatedChargesData.push({
                      id: tax.id,
                      material_id: material.id,
                      material_name: material.material_name || material.material,
                      charge_name: getTaxNameById(tax.resource_id),
                      resource_id: tax.resource_id,
                      resource_type: tax.resource_type,
                      amount: tax.amount,
                      amount_inr: convertUsdToInr(tax.amount, conversionRate),
                      inclusive: tax.inclusive,
                      tax_category_id: tax.tax_category_id,
                      percentage: tax.percentage,
                    });
                  });
                }

                // Update the charges data state with the new data
                setChargesFromApi(prevCharges => {
                  // Remove existing charges for this material and add the new ones
                  const filteredCharges = prevCharges.filter(charge => charge.material_id !== material.id);
                  return [...filteredCharges, ...updatedChargesData];
                });

                // Update total material cost if available
                if (rateData.total_material_cost) {
                  setTotalMaterialCost(prevTotal => {
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
                if (rateData.addition_tax_details && Array.isArray(rateData.addition_tax_details)) {
                  calculatedValues.taxAddition = rateData.addition_tax_details.reduce((sum, tax) => {
                    return sum + (parseFloat(tax.amount) || 0);
                  }, 0);
                }

                // Calculate Tax Deductions (sum of deduction tax details)
                if (rateData.deduction_tax_details && Array.isArray(rateData.deduction_tax_details)) {
                  calculatedValues.taxDeductions = rateData.deduction_tax_details.reduce((sum, tax) => {
                    return sum + (parseFloat(tax.amount) || 0);
                  }, 0);
                }

                // Calculate Other Addition (TaxCharge type additions)
                if (rateData.addition_tax_details && Array.isArray(rateData.addition_tax_details)) {
                  calculatedValues.otherAddition = rateData.addition_tax_details
                    .filter(tax => tax.resource_type === "TaxCharge")
                    .reduce((sum, tax) => {
                      return sum + (parseFloat(tax.amount) || 0);
                    }, 0);
                }

                // Calculate Other Deductions (TaxCharge type deductions)
                if (rateData.deduction_tax_details && Array.isArray(rateData.deduction_tax_details)) {
                  calculatedValues.otherDeductions = rateData.deduction_tax_details
                    .filter(tax => tax.resource_type === "TaxCharge")
                    .reduce((sum, tax) => {
                      return sum + (parseFloat(tax.amount) || 0);
                    }, 0);
                }

                // Calculate Total Changes (Tax Addition - Tax Deductions)
                calculatedValues.totalChanges = calculatedValues.taxAddition - calculatedValues.taxDeductions;

                // Store the calculated values for this material
                setMaterialCalculatedValues(prev => ({
                  ...prev,
                  [material.id]: calculatedValues
                }));
              }
            } catch (error) {
              console.error("Error fetching ROPO rate details after save:", error);
            }
          }

          alert("Tax changes saved successfully!");
        }
      } catch (error) {
        console.error("Error saving tax changes:", error);
        alert("Error saving tax changes. Please try again.");
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
          // Use the new delivery schedules API which also returns material_term_conditions
          const response = await axios.get(
            `${baseURL}purchase_orders/material_delivery_schedules.json?token=${token}&mor_inventory_ids=${materialIds}&type=import`
          );
          console.log("Material term conditions response:", response.data);
          // Extract material_term_conditions from the response
          setMaterialTermConditions(
            response.data.material_term_conditions || []
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

  // Calculate discount rate based on rate per nos and discount percentage (all in USD)
  const calculateDiscountRate = (ratePerNos, discountPercentage) => {
    const rate = parseFloat(ratePerNos) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    // Correct calculation: Discount Rate = Rate per Nos - (Rate per Nos * Discount % / 100)
    return Math.max(0, rate - (rate * discount) / 100);
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
      // Validation: Prevent negative values
      const numValue = parseFloat(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        alert(
          "Rate per Nos cannot be negative. Please enter a valid positive number."
        );
        return;
      }

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
      // Validation: Prevent negative values and values over 100%
      const numValue = parseFloat(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
        alert(
          "Discount percentage must be between 0 and 100. Please enter a valid percentage."
        );
        return;
      }

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
        alert(
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
        alert(
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
        alert(
          "Amount cannot be negative. Please enter a valid positive number."
        );
        return;
      }
    }

    setOtherCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, [field]: value } : cost))
    );
  };
  // ...existing code...

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
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = prev.deductionTaxes.reduce((sum, tax) => {
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
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = updatedDeductionTaxes.reduce((sum, tax) => {
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
                  material_name: material.material_name || material.material,
                  charge_name: getTaxNameById(tax.resource_id),
                  resource_id: tax.resource_id,
                  resource_type: tax.resource_type,
                  amount: tax.amount,
                  amount_inr: convertUsdToInr(tax.amount, conversionRate), // Convert USD to INR
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
                  material_name: material.material_name || material.material,
                  charge_name: getTaxNameById(tax.resource_id),
                  resource_id: tax.resource_id,
                  resource_type: tax.resource_type,
                  amount: tax.amount,
                  amount_inr: convertUsdToInr(tax.amount, conversionRate), // Convert USD to INR
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
          const materialCharges = chargesData.filter(charge => charge.material_id === material.id);
          
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
            .filter(charge => charge.resource_type === "TaxCategory")
            .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);

          // Calculate Tax Deductions (sum of TaxCategory deductions)
          calculatedValues.taxDeductions = materialCharges
            .filter(charge => charge.resource_type === "TaxCategory" && charge.amount < 0)
            .reduce((sum, charge) => sum + Math.abs(parseFloat(charge.amount) || 0), 0);

          // Calculate Other Addition (sum of TaxCharge additions)
          calculatedValues.otherAddition = materialCharges
            .filter(charge => charge.resource_type === "TaxCharge" && charge.amount > 0)
            .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);

          // Calculate Other Deductions (sum of TaxCharge deductions)
          calculatedValues.otherDeductions = materialCharges
            .filter(charge => charge.resource_type === "TaxCharge" && charge.amount < 0)
            .reduce((sum, charge) => sum + Math.abs(parseFloat(charge.amount) || 0), 0);

          // Calculate Total Changes
          calculatedValues.totalChanges = calculatedValues.taxAddition - calculatedValues.taxDeductions;

          // Calculate All Inclusive Cost (sum of all positive amounts)
          calculatedValues.allInclCost = materialCharges
            .reduce((sum, charge) => sum + Math.max(0, parseFloat(charge.amount) || 0), 0);

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

  // Calculate supplier advance amount
  const calculateSupplierAdvanceAmount = () => {
    const percentage = parseFloat(supplierAdvancePercentage) || 0;
    const amount = (totalMaterialCost * percentage) / 100;
    return amount;
  };

  // Calculate service certificate advance amount
  const calculateServiceCertificateAdvanceAmount = () => {
    const percentage = parseFloat(serviceCertificateAdvancePercentage) || 0;
    const grandTotal = chargesFromApi.reduce(
      (sum, charge) => sum + (parseFloat(charge.amount_inr) || 0),
      0
    );
    const amount = (grandTotal * percentage) / 100;
    return amount;
  };

  // Handle supplier advance percentage change
  const handleSupplierAdvancePercentageChange = (value) => {
    const numValue = parseFloat(value) || 0;
    if (value === "") {
      setSupplierAdvancePercentage("");
    } else if (numValue >= 0 && numValue <= 100) {
      setSupplierAdvancePercentage(value);
    } else {
      alert("Supplier advance percentage must be between 0 and 100.");
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
      alert(
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
        alert("Please select a company.");
        setIsCreatingOrder(false);
        return;
      }

      if (!selectedSupplier?.value) {
        alert("Please select a supplier.");
        setIsCreatingOrder(false);
        return;
      }

      if (!conversionRate || conversionRate <= 0) {
        alert(
          "Please set the Conversion Rate (USD to INR) in the PO Details tab."
        );
        setIsCreatingOrder(false);
        return;
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

      // Extract material inventory IDs - check if pms_inventory_id is available
      // const materialInventoryIds = submittedMaterials.map((material) => {
      //   // Try to get pms_inventory_id first, fallback to id
      //   const inventoryId =
      //     material.pms_inventory_id || material.inventory_id || material.id;
      //   console.log(
      //     `Material ${
      //       material.material_name || material.material || material.id
      //     }: inventory_id = ${inventoryId}`
      //   );
      //   return inventoryId;
      // });

      // console.log("Material inventory IDs:", materialInventoryIds);
      // console.log("Purchase Order ID (if available):", purchaseOrderId);
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

      // Prepare the payload based on the structure you provided
      const payload = {
        purchase_order: {
          status: "draft",
          // credit_period: parseInt(termsFormData.creditPeriod) || 0,
          // po_validity_period: parseInt(termsFormData.poValidityPeriod) || 0,
          // advance_reminder_duration:
          //   parseInt(termsFormData.advanceReminderDuration) || 0,
          // payment_terms: termsFormData.paymentTerms || "",
          // payment_remarks: termsFormData.paymentRemarks || "",
          // supplier_advance: 0,
          // survice_certificate_advance: 0,
          // total_value: 0,
          // total_discount: 0,
          // po_date: getLocalDateTime().split("T")[0], // Current date
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
          supplier_advance: null,
          survice_certificate_advance: null,
          total_value: null,
          total_discount: null,
          po_date: getLocalDateTime().split("T")[0], // Current date
          company_id: selectedCompany?.value,
          po_type: "import",
          supplier_id: selectedSupplier?.value,
          conversion_rate: conversionRate, // Add conversion rate to payload
          remark: termsFormData.remark || "",
          comments: termsFormData.comments || "",
          material_inventory_ids: apiMaterialInventoryIds,

          // Extract unique MOR IDs from submitted materials
          mor_ids: [
            ...new Set(
              submittedMaterials
                .map((material) => material.mor_id)
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
              remarks: charge.charge_name || "",
              supplier_id: selectedSupplier?.value || null,
            })),

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

          // Format charges with taxes from API
          charges_with_taxes_attributes: [
            // Include charges from API (chargesFromApi)
            ...chargesFromApi.map((charge) => ({
              id: charge.id,
              material_id: charge.material_id,
              charge_name: charge.charge_name,
              resource_id: charge.resource_id,
              resource_type: charge.resource_type,
              amount: parseFloat(charge.amount) || 0,
              amount_inr: parseFloat(charge.amount_inr) || 0,
              service_certificate: serviceCertificates[charge.id] || false,
              service_provider_id: selectedServiceProviders[charge.id]?.value || null,
              service_provider_name: selectedServiceProviders[charge.id]?.label || null,
              remarks: chargeRemarks[charge.id] || "",
              inclusive: charge.inclusive || false,
              tax_category_id: charge.tax_category_id,
              percentage: charge.percentage,
            })),
            // Include manually added charges
            ...charges.map((charge) => {
              return {
                charge_id: charge.charge_id || 0,
                amount: parseFloat(charge.amount) || 0,
                realised_amount: parseFloat(charge.realised_amount) || 0,
                taxes_and_charges_attributes: [
                  ...(charge.taxes?.additionTaxes || []).map((tax) => ({
                    resource_id: parseInt(tax.taxType) || 0,
                    resource_type: "TaxCategory",
                    percentage:
                      parseFloat(tax.taxPercentage?.replace("%", "")) || 0,
                    inclusive: tax.inclusive || false,
                    amount: parseFloat(tax.amount) || 0,
                    addition: true,
                  })),
                  ...(charge.taxes?.deductionTaxes || []).map((tax) => ({
                    resource_id: parseInt(tax.taxType) || 0,
                    resource_type: "TaxCategory",
                    percentage:
                      parseFloat(tax.taxPercentage?.replace("%", "")) || 0,
                    inclusive: tax.inclusive || false,
                    amount: parseFloat(tax.amount) || 0,
                    addition: false,
                  })),
                ],
              };
            }),
          ],

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

      console.log("Creating purchase order with payload:", payload);

      const response = await axios.post(
        `${baseURL}purchase_orders.json?token=${token}`,
        payload
      );

      console.log("Purchase order created successfully:", response.data);
      alert("Purchase order created successfully!");
      navigate(`/ropo-import-list
        ?token=${token}`);

      // Optionally redirect or clear form
      // window.location.href = '/po-list'; // Redirect to PO list
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Error creating purchase order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // ...existing code...

  // Currency helpers for modal
  // Exchange rate: 1 USD = 82.5 INR (default)

  // Conversion functions with safety checks
  const convertInrToUsd = useCallback(
    (inrValue, customRate = null) => {
      if (!inrValue || isNaN(inrValue)) return "";
      const rate = customRate || conversionRate || 82.5; // Use conversionRate instead of exchangeRate
      // Proper formula: USD = INR / ExchangeRate
      return (parseFloat(inrValue) / rate).toFixed(2);
    },
    [conversionRate]
  );

  const convertUsdToInr = useCallback(
    (usdValue, customRate = null) => {
      if (!usdValue || isNaN(usdValue)) return "";
      const rate = customRate || conversionRate || 82.5; // Use conversionRate instead of exchangeRate
      // Proper formula: INR = USD * ExchangeRate
      return (parseFloat(usdValue) * rate).toFixed(2);
    },
    [conversionRate]
  );

  // Safe conversion functions that can be used during initial render
  const safeConvertInrToUsd = (inrValue, customRate = null) => {
    if (!inrValue || isNaN(inrValue)) return "";
    const rate = customRate || conversionRate || 82.5;
    return (parseFloat(inrValue) / rate).toFixed(2);
  };

  const safeConvertUsdToInr = (usdValue, customRate = null) => {
    if (!usdValue || isNaN(usdValue)) return "";
    const rate = customRate || conversionRate || 82.5;
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
                                          alert(
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
                                      PO Currency
                                    </label>
                                    <SingleSelector
                                      options={currencyOptions}
                                      value={currencyOptions.find(option => option.value === selectedCurrency.code)}
                                      onChange={handleCurrencyChange}
                                      placeholder="Select Currency"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Conversion Rate (USD to INR)
                                    </label>
                                    <input
                                      className="form-control"
                                      type="number"
                                      value={conversionRate}
                                      onChange={(e) => {
                                        const value = parseFloat(
                                          e.target.value
                                        );
                                        if (value <= 0) {
                                          alert(
                                            "Conversion rate must be greater than 0."
                                          );
                                          return;
                                        }
                                        setConversionRate(value || 82.5);
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
                                      alert("Please select a company first.");
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
                                            {row.material_name || row.material || ""}
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
                                            <button
                                              className="btn mt-0 pt-0"
                                              onClick={() => {
                                                setSubmittedMaterials((prev) =>
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
                                                  d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                  fill="#B25657"
                                                />
                                              </svg>
                                            </button>
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
                                    alert(
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
                                    <th>Material Description</th>

                                    <th>UOM</th>
                                    <th>PO Qty</th>

                                    <th>Tax Addition</th>
                                    <th>Total Changes</th>
                                    <th>Other Addition</th>
                                    <th>Other Deductions</th>
                                    <th>All Incl. Cost</th>
                                    <th>Tax Deductions</th>
                                    <th>Select Tax</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {submittedMaterials.length > 0 ? (
                                    submittedMaterials.map(
                                      (material, index) => {
                                        const calculatedValues = materialCalculatedValues[material.id] || {};
                                        return (
                                          <tr key={material.id}>
                                            <td>{index + 1}</td>
                                            <td>{material.material_name || material.material}</td>
                                            <td>{material.uom_name}</td>
                                            <td>{material.order_qty || ""}</td>
                                            <td>USD {calculatedValues.taxAddition?.toFixed(2) || "0.00"} (INR {(() => {
                                              const inrValue = parseFloat(convertUsdToInr(calculatedValues.taxAddition || 0, conversionRate));
                                              return isNaN(inrValue) ? "0.00" : inrValue.toFixed(2);
                                            })()})</td>
                                            <td></td>
                                            <td>USD {calculatedValues.otherAddition?.toFixed(2) || "0.00"} (INR {(() => {
                                              const inrValue = parseFloat(convertUsdToInr(calculatedValues.otherAddition || 0, conversionRate));
                                              return isNaN(inrValue) ? "0.00" : inrValue.toFixed(2);
                                            })()})</td>
                                            <td>USD {calculatedValues.otherDeductions?.toFixed(2) || "0.00"} (INR {(() => {
                                              const inrValue = parseFloat(convertUsdToInr(calculatedValues.otherDeductions || 0, conversionRate));
                                              return isNaN(inrValue) ? "0.00" : inrValue.toFixed(2);
                                            })()})</td>
                                            <td>USD {calculatedValues.allInclCost?.toFixed(2) || "0.00"} (INR {(() => {
                                              const inrValue = parseFloat(convertUsdToInr(calculatedValues.allInclCost || 0, conversionRate));
                                              return isNaN(inrValue) ? "0.00" : inrValue.toFixed(2);
                                            })()})</td>
                                            <td>USD {calculatedValues.taxDeductions?.toFixed(2) || "0.00"} (INR {(() => {
                                              const inrValue = parseFloat(convertUsdToInr(calculatedValues.taxDeductions || 0, conversionRate));
                                              return isNaN(inrValue) ? "0.00" : inrValue.toFixed(2);
                                            })()})</td>
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
                                      {/* <td>1</td>
                                      <td>Plain White Sperenza Tiles</td>
                                      <td>300 x 300 mm</td>
                                      <td>nos</td>
                                    <td>USD 9.67</td>
                                    <td>INR 800</td>
                                    <td>108</td>
                                    <td>708</td>
                                    <td>108</td>
                                    <td>708</td>
                                    <td
                                      className="text-decoration-underline"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleOpenTaxModal(0)}
                                    >
                                      select
                                      </td> */}
                                      <td colSpan="11" className="text-center">
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
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Total Base Cost</td>
                                    <td>0</td>
                                  </tr>
                                  <tr>
                                    <td>Total Tax </td>
                                    <td>0</td>
                                  </tr>
                                  <tr>
                                    <td>Total Charge</td>
                                    <td>0</td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">
                                      Total All Incl. Cost
                                    </td>
                                    <td className="fw-bold">0</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Tax Addition and Charges Tables */}
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
                                  {loadingCharges ? (
                                    <tr>
                                      <td colSpan={7} className="text-center">
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
                                          <td>USD {charge.amount || "0.00"}</td>
                                          <td>USD</td>
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
                                      <td colSpan={7} className="text-center">
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
                                    <th colSpan={6}>Charges (Exclusive)</th>
                                  </tr>
                                  <tr>
                                    <th>Charge Name</th>
                                    <th>Amount (INR)</th>
                                    <th>Amount (USD)</th>
                                    <th>Service Certificate</th>
                                    <th>Service Provider</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {loadingCharges ? (
                                    <tr>
                                      <td colSpan={6} className="text-center">
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
                                    getConsolidatedCharges().map((consolidatedCharge, index) => (
                                      <tr key={`consolidated-${index}`}>
                                        <td>{consolidatedCharge.charge_name}</td>
                                        <td>
                                          INR {consolidatedCharge.total_amount_inr.toFixed(2)}
                                        </td>
                                        <td>
                                          USD {consolidatedCharge.total_amount_usd.toFixed(2)}
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              consolidatedCharge.charge_ids.every(id => 
                                                serviceCertificates[id]
                                              ) || false
                                            }
                                            onChange={(e) => {
                                              // Update all related charges
                                              consolidatedCharge.charge_ids.forEach(id => {
                                                handleServiceCertificateChange(id, e.target.checked);
                                              });
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <SingleSelector
                                            options={supplierOptions}
                                            value={
                                              selectedServiceProviders[
                                                consolidatedCharge.charge_ids[0]
                                              ] || null
                                            }
                                            onChange={(selectedOption) => {
                                              // Update all related charges with same service provider
                                              consolidatedCharge.charge_ids.forEach(id => {
                                                handleServiceProviderChange(id, selectedOption);
                                              });
                                            }}
                                            placeholder="Select Service Provider"
                                          />
                                        </td>
                                        <td>
                                          <textarea
                                            className="form-control"
                                            rows={2}
                                            placeholder="Enter remarks"
                                            value={
                                              chargeRemarks[consolidatedCharge.charge_ids[0]] || ""
                                            }
                                            onChange={(e) => {
                                              // Update all related charges with same remarks
                                              consolidatedCharge.charge_ids.forEach(id => {
                                                handleChargeRemarksChange(id, e.target.value);
                                              });
                                            }}
                                          />
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6} className="text-center">
                                        No Records Found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Summary Section */}
                            {!loadingCharges && chargesFromApi.length > 0 && (
                              <div className="row mt-3">
                                <div className="col-md-6">
                                  <div className="card">
                                    <div className="card-header">
                                      <h6 className="mb-0">Charges Summary</h6>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-6">
                                          <strong>Total Tax Addition:</strong>
                                        </div>
                                        <div className="col-6">
                                          INR{" "}
                                          {chargesFromApi
                                            .filter(
                                              (charge) =>
                                                charge.resource_type ===
                                                "TaxCategory"
                                            )
                                            .reduce(
                                              (sum, charge) =>
                                                sum +
                                                (parseFloat(
                                                  charge.amount_inr
                                                ) || 0),
                                              0
                                            )
                                            .toFixed(2)}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-6">
                                          <strong>Total Charges:</strong>
                                        </div>
                                        <div className="col-6">
                                          INR{" "}
                                          {chargesFromApi
                                            .filter(
                                              (charge) =>
                                                charge.resource_type ===
                                                "TaxCharge"
                                            )
                                            .reduce(
                                              (sum, charge) =>
                                                sum +
                                                (parseFloat(
                                                  charge.amount_inr
                                                ) || 0),
                                              0
                                            )
                                            .toFixed(2)}
                                        </div>
                                      </div>
                                      <hr />
                                      <div className="row">
                                        <div className="col-6">
                                          <strong>Grand Total:</strong>
                                        </div>
                                        <div className="col-6">
                                          INR{" "}
                                          {chargesFromApi
                                            .reduce(
                                              (sum, charge) =>
                                                sum +
                                                (parseFloat(
                                                  charge.amount_inr
                                                ) || 0),
                                              0
                                            )
                                            .toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Charges Section */}
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Charges</h5>
                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    className="btn purple-btn2"
                                    onClick={refreshChargesData}
                                    title="Refresh charges data from API"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-arrow-clockwise"
                                      viewBox="0 0 16 16"
                                    >
                                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                    </svg>
                                    Refresh
                                  </button>
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
                                      value={`USD ${totalMaterialCost.toFixed(
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
                                      value={`USD ${calculateSupplierAdvanceAmount().toFixed(
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
                                </div>
                                <div className="col-md-6 mt-2">
                                  <div className="form-group">
                                    <label className="po-fontBold">
                                      Service Certificate Advance Amount
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={`USD ${calculateServiceCertificateAdvanceAmount().toFixed(
                                        2
                                      )} (INR ${convertUsdToInr(
                                        calculateServiceCertificateAdvanceAmount(),
                                        conversionRate
                                      )})`}
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
                             <div className="mt-3 d-flex justify-content-between align-items-center">
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
                                {deliverySchedules && deliverySchedules.length > 0 ? (
                                  deliverySchedules.map((schedule, index) => (
                                    <tr key={schedule.id || index}>
                                      <td>{schedule.mor_number || "N/A"}</td>
                                      <td>{schedule.material_formatted_name || "N/A"}</td>
                                      <td>{schedule.expected_date ? new Date(schedule.expected_date).toLocaleDateString() : "N/A"}</td>
                                      <td>{schedule.po_delivery_date ? new Date(schedule.po_delivery_date).toLocaleDateString() : "N/A"}</td>
                                      <td>{schedule.expected_quantity || 0}</td>
                                      <td>{schedule.store_address || "N/A"}</td>
                                      <td>{schedule.store_name || "N/A"}</td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Add remarks"
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8" className="text-center">
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
                              {/* <button
                                className="purple-btn2 me-2"
                                onClick={refreshChargesData}
                                title="Refresh charges data from API"
                              >
                                <span className="material-symbols-outlined align-text-top me-1">
                                  refresh
                                </span>
                                Refresh Charges
                              </button> */}
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
                    options={projects} // filtered projects as {value,label}
                    value={selectedProject}
                    onChange={handleProjectChange}
                    placeholder="Select Project"
                    // isDisabled={!selectedCompany}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Sub-project</label>
                  <MultiSelector
                    options={siteOptions}
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
                  <input
                    className="form-control"
                    value={morFormData.morNumber}
                    onChange={(e) =>
                      setMorFormData((p) => ({
                        ...p,
                        morNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter MOR No"
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
                        alert(
                          "MOR Start Date cannot be in the past. Please select today's date or a future date."
                        );
                        return;
                      }

                      // If end date is set, ensure start date is before end date
                      if (
                        morFormData.morEndDate &&
                        e.target.value > morFormData.morEndDate
                      ) {
                        alert(
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
                        alert(
                          "MOR End Date cannot be in the past. Please select today's date or a future date."
                        );
                        return;
                      }

                      // If start date is set, ensure end date is after start date
                      if (
                        morFormData.morStartDate &&
                        e.target.value < morFormData.morStartDate
                      ) {
                        alert(
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

            <div className="tbl-container me-2 mt-3">
              {loadingMaterialDetails ? (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <table className="w-100">
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
                      <th colSpan="8">Material Details</th>
                    </tr>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Material</th>
                      <th>UOM</th>
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
                          <td>{item.material_name || item.material || ""}</td>
                          <td>{item.uom_name || ""}</td>
                          <td>{item.required_quantity || ""}</td>
                          <td>{item.prev_order_qty || ""}</td>
                          <td>{item.pending_quantity || ""}</td>
                          <td>
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
                    Rate per Nos <span> *</span>
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
                    Conversion Rate (USD to INR)
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
                                    (option) => option.id === item.tax_category_id
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
                                value={
                                  // For ALL addition taxes, show Total Base Cost + Tax Amount in INR
                                  (() => {
                                    const baseCostInr = safeConvertUsdToInr(
                                      taxRateData[tableId]?.afterDiscountValue || 0,
                                      conversionRate
                                    );
                                    // Convert the stored USD amount back to INR for display
                                    const taxAmountInr = safeConvertUsdToInr(
                                      item.amount || 0,
                                      conversionRate
                                    );
                                    return (parseFloat(baseCostInr) + parseFloat(taxAmountInr)).toFixed(2);
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
                                  (parseFloat(taxRateData[tableId]?.afterDiscountValue || 0) + parseFloat(item.amount || 0)).toFixed(2)
                                }
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
                                disabledOptions={taxRateData[
                                  tableId
                                ]?.deduction_bid_material_tax_details?.map(
                                  (item) => item.taxChargeType
                                )}
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
                                value={
                                  // For deduction taxes, show Total Base Cost - Tax Amount in INR
                                  (() => {
                                    const baseCostInr = safeConvertUsdToInr(
                                      taxRateData[tableId]?.afterDiscountValue || 0,
                                      conversionRate
                                    );
                                    // Convert the stored USD amount back to INR for display
                                    const taxAmountInr = safeConvertUsdToInr(
                                      item.amount || 0,
                                      conversionRate
                                    );
                                    return Math.max(0, parseFloat(baseCostInr) - parseFloat(taxAmountInr)).toFixed(2);
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
                                  Math.max(0, parseFloat(taxRateData[tableId]?.afterDiscountValue || 0) - parseFloat(item.amount || 0)).toFixed(2)
                                }
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
                taxRateData[tableId].ratePerNos.trim() === ""
              ) {
                alert("Rate per Nos is required.");
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

export default RopoImportCreate;
