import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Table from "../components/base/Table/Table";
import SelectBox from "../components/base/Select/SelectBox";
import { toast, ToastContainer } from "react-toastify";
import { baseURL } from "../confi/apiDomain";
import axios from "axios";
import DynamicModalBox from "../components/base/Modal/DynamicModalBox";
import ShortDataTable from "../components/base/Table/ShortDataTable";
import ChargesDataTable from "../components/base/Table/ChargesDataTable";

export default function CounterOffer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [bidCounterData, setBidCounterData] = useState(
    location.state?.bidCounterData || null
  );
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [freightData, setFreightData] = useState([]);
  const [extraFields, setExtraFields] = useState({});
  const [showTaxModal, setShowTaxModal] = useState(false); // State for tax modal visibility
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null); // Track selected material index
  const [taxRateData, setTaxRateData] = useState([]); // State for tax rate data
  const [taxOptions, setTaxOptions] = useState([]); // State for tax options
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]); // State for deduction tax options
  const [shortTableData, setShortTableData] = useState({});
  const [showOtherChargesModal, setShowOtherChargesModal] = useState(false);
  const [chargesData, setChargesData] = useState([]); // State for charges data
  const [grossTotal, setGrossTotal] = useState(0); // State for gross total
  const prevGrossRef = useRef(null); // Ref for previous gross total
  const [tableData, setTableData] = useState([]); // State for ShortDataTable data

  console.log("bidCounterData:---", bidCounterData);

  const handleOpenOtherChargesModal = () => {
    setShowOtherChargesModal(true);
  };
  const handleCloseOtherChargesModal = () => setShowOtherChargesModal(false);
  useEffect(() => {
    if (bidCounterData && Object.keys(formData).length === 0) {
      // Only set state if formData is empty to prevent infinite updates
      setFormData(bidCounterData);
      const initialSumTotal = bidCounterData.bid_materials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      );
      setSumTotal(initialSumTotal);
    }
    if (bidCounterData?.charges_with_taxes) {
      setChargesData(bidCounterData?.charges_with_taxes);
    }

    if (bidCounterData?.extra_data) {
      const formattedExtraData = Object.entries(bidCounterData.extra_data).map(
        ([key, { value }]) => ({
          label: key,
          value: { firstBid: value || "", counterBid: "" },
        })
      );
      setTableData(formattedExtraData);
    }

    if (
      bidCounterData?.applied_event_template?.applied_bid_template_fields &&
      freightData.length === 0 // Only set state if freightData is empty to prevent infinite updates
    ) {
      const fields =
        bidCounterData.applied_event_template.applied_bid_template_fields.map(
          (field) => ({
            label: field.field_name,
            value: { firstBid: "", counterBid: "" },
          })
        );
      setFreightData(fields);
    }
  }, [bidCounterData]); // Removed formData from dependencies to prevent unnecessary updates

  useEffect(() => {
    if (formData?.bid_materials && Object.keys(extraFields).length === 0) {
      // Only set state if extraFields is empty to prevent infinite updates
      const initialData = formData.bid_materials.reduce((acc, item, index) => {
        acc[index] = Object.entries(item.extra_data || {}).reduce(
          (innerAcc, [key, { value }]) => {
            if (!Array.isArray(value)) {
              innerAcc[key] = value;
            }
            return innerAcc;
          },
          {}
        );
        return acc;
      }, {});
      setExtraFields(initialData || {});
    }
  }, [formData?.bid_materials]); // Removed extraFields from dependencies to prevent unnecessary updates

  useEffect(() => {
    if (formData.extra_data && Object.keys(shortTableData).length === 0) {
      // Only set state if shortTableData is empty to prevent infinite updates
      const initialShortTableData = Object.entries(formData.extra_data).reduce(
        (acc, [key, { value }]) => {
          acc[key] = value || ""; // Use the default value from formData.extra_data
          return acc;
        },
        {}
      );
      setShortTableData(initialShortTableData);
    }
  }, [formData.extra_data]); // Removed shortTableData from dependencies to prevent unnecessary updates

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
            id: tax.id,
            taxChargeType: tax.type,
          }));

          setTaxOptions([
            { value: "", label: "Select Tax & Charges" },
            ...formattedOptions,
          ]);
        }
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxes();
  }, []);

  useEffect(() => {
    const fetchDeductionTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
            id: tax.id,
            type: tax.type,
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

    fetchDeductionTaxes();
  }, []);

  useEffect(() => {
    const extra_charges = {
      freight_charge_amount: {
        value: "",
        readonly: false,
      },
      gst_on_freight: {
        value: "",
        readonly: false,
      },
      other_charge_amount: {
        value: "",
        readonly: false,
      },
      gst_on_other_charge: {
        value: "",
        readonly: false,
      },
      handling_charge_amount: {
        value: "",
        readonly: false,
      },
      gst_on_handling_charge: {
        value: "",
        readonly: false,
      },
      realised_freight_charge_amount: {
        value: "",
        readonly: false,
      },
      realised_other_charge_amount: {
        value: "",
        readonly: false,
      },
      realised_handling_charge_amount: {
        value: "",
        readonly: false,
      },
    };

    const formattedCharges = Object.entries(extra_charges).map(
      ([fieldName, fieldData]) => ({
        label: fieldName || "",
        value: fieldData || "",
        isRequired: false, // or true, if you have that info elsewhere
        isReadOnly: fieldData.readonly,
        fieldOwner: null, // or fetch from another object if needed
      })
    );

    setShortTableData(
      formattedCharges.reduce((acc, charge) => {
        acc[charge.label] = charge.value.value;
        return acc;
      }, {})
    );
  }, []);

  const eventId = bidCounterData?.event?.id;
  const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  const handleSubmit = async () => {
    const extractShortTableData = Array.isArray(shortTableData)
      ? shortTableData.reduce((acc, curr) => {
          const { firstBid, counterBid } = curr.value || {};
          acc[curr.label] = counterBid || firstBid || "_";
          return acc;
        }, {})
      : {};

    // Ensure required keys exist with "_" as default
    const requiredKeys = [
      "Warranty Clause",
      "Payment Terms",
      "Loading/Unloading",
    ];

    requiredKeys.forEach((key) => {
      if (!(key in extractShortTableData)) {
        extractShortTableData[key] = "_";
      }
    });

    const extractedExtraData = formData.bid_materials.reduce((acc, item) => {
      if (item.extra_data) {
        Object.entries(item.extra_data).forEach(([key, { value }]) => {
          acc[key] = value;
        });
      }
      return acc;
    }, {});

    setLoading(true);

    // Calculate the final sumTotal including grossTotal
    const materialSum = formData.bid_materials.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );
    const finalSumTotal = materialSum + grossTotal;
    const extractChargeTableData = Array.isArray(chargesData)
      ? chargesData?.slice(0, 3)?.map((charge) => ({
          // Limit to first 3 elements
          charge_id: charge.charge_id,
          amount: charge.amount,
          realised_amount: charge.realised_amount,
          taxes_and_charges: charge?.taxes_and_charges?.map((tax) => ({
            resource_id: tax.resource_id,
            resource_type: tax.resource_type || "TaxCategory",
            amount: tax.amount,
            inclusive: tax.inclusive || false,
            addition: tax.addition,
            percentage: tax.percentage,
          })),
        }))
      : [];

    // Include updated changes in the payload
    const payload = {
      counter_bid: {
        event_vendor_id: formData.event_vendor_id,
        price: formData.price,
        discount: formData.discount,
        // freight_charge_amount: formData.freight_charge_amount,
        // gst_on_freight: formData.gst_on_freight,
        // realised_freight_charge_amount:
        //   shortTableData.realised_freight_charge_amount,
        // realised_other_charge_amount:
        //   shortTableData.realised_other_charge_amount,
        // realised_handling_charge_amount:
        //   shortTableData.realised_handling_charge_amount,
        gross_total: finalSumTotal,
        counter_bid_materials_attributes: formData.bid_materials.map((item) => {
          const { extra_data, ...rest } = item;
          return {
            ...rest,
            event_material_id: item.event_material_id,
            bid_material_id: item.id,
            realised_discount: item.realised_discount,
            realised_price: item.realised_price,
            realised_gst: item.realised_gst,
            landed_amount: item.landed_amount,
            total_amount: item.total_amount,
            ...extractedExtraData, // Include extra data
          };
        }),
        ...extractShortTableData, // Include short table data
        charges: extractChargeTableData, // Include charges data
        remark: formData.remark || "",
      },
    };

    console.log("Payload:", payload); // Log the payload for debugging

    try {
      const response = await fetch(
        `${baseURL}rfq/events/${eventId}/bids/${bidId}/counter_bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        toast.success("Counter bid submitted successfully!"); // Display success message
      } else {
        throw new Error("Failed to submit counter bid");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("There was an error submitting the counter bid. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after the request completes
    }
  };

  useEffect(() => {
    if (bidCounterData && Object.keys(formData).length === 0) {
      const updatedMaterials = bidCounterData.bid_materials.map((item) => ({
        ...item,
        originalPrice: parseFloat(item.price) || 0, // Store the original price
      }));
      setFormData({ ...bidCounterData, bid_materials: updatedMaterials });

      const initialSumTotal = updatedMaterials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      );
      setSumTotal(initialSumTotal);
    }
  }, [bidCounterData]);

  const handleMaterialInputChange = (e, field, index) => {
    const value = parseFloat(e.target.value) || 0;
    const updatedMaterials = [...formData.bid_materials];

    if (field === "quantity_available") {
      const quantityRequested =
        parseFloat(updatedMaterials[index].quantity_requested) || 0;
      if (value > quantityRequested) {
        toast.error("Quantity available cannot exceed quantity requested.");
        return;
      }
    }

    if (field === "price") {
      const originalPrice = updatedMaterials[index].originalPrice; // Use stored original price
      console.log("originalPrice", originalPrice, "value", value);

      if (value > originalPrice) {
        toast.error("Price cannot be higher than the original value.");
        return;
      }

      updatedMaterials[index].price = value; // Update the price
    }

    if (field === "discount") {
      const originalDiscount =
        parseFloat(bidCounterData?.bid_materials[index]?.discount) || 0;

      if (value < originalDiscount) {
        toast.error("Discount cannot be lower than already existed value.");
        return;
      }
      updatedMaterials[index].allowDiscountIncrease = value >= originalDiscount;
    }

    updatedMaterials[index][field] = value;

    const price = parseFloat(updatedMaterials[index].price) || 0;
    const quantityAvail =
      parseFloat(updatedMaterials[index].quantity_available) || 0;
    const discount = parseFloat(updatedMaterials[index].discount) || 0;
    const gst = parseFloat(updatedMaterials[index].gst) || 0;

    const total = price * quantityAvail;

    const realisedDiscount = (total * discount) / 100;
    const realisedPrice = price - (price * discount) / 100; // Calculate realised price

    const landedAmount = total - realisedDiscount;
    let realisedGst = 0;
    if (gst > 0) {
      realisedGst = (landedAmount * gst) / 100;
    }

    const finalTotal = landedAmount + realisedGst;

    updatedMaterials[index].realised_discount = realisedDiscount.toFixed(2);
    updatedMaterials[index].realised_price = realisedPrice.toFixed(2); // Set realised price
    updatedMaterials[index].landed_amount = landedAmount.toFixed(2);
    updatedMaterials[index].realised_gst = realisedGst.toFixed(2);
    updatedMaterials[index].total_amount = finalTotal.toFixed(2);

    // Disable price if discount is modified, and vice versa
    if (field === "price") {
      updatedMaterials[index].disableDiscount = true;
      updatedMaterials[index].disablePrice = false;
    } else if (field === "discount") {
      updatedMaterials[index].disablePrice = true;
      updatedMaterials[index].disableDiscount = false;
    }

    const newSumTotal = updatedMaterials.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );

    if (newSumTotal !== sumTotal) {
      setSumTotal(newSumTotal); // Only update sumTotal if it has changed
    }

    setFormData({
      ...formData,
      bid_materials: updatedMaterials,
    });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    if (field === "freight_charge_amount" || field === "gst_on_freight") {
      const freightCharge =
        parseFloat(updatedFormData.freight_charge_amount) || 0;
      const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;
      updatedFormData.realised_freight_charge_amount =
        freightCharge + (freightCharge * gstOnFreight) / 100;
    }

    setFormData(updatedFormData);

    // Avoid redundant sumTotal calculation
    const gross = parseFloat(
      updatedFormData.realised_freight_charge_amount || 0
    );
    const materialSum = formData.bid_materials.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );
    const finalSumTotal = materialSum + gross;

    if (sumTotal !== finalSumTotal) {
      setSumTotal(finalSumTotal);
    }
  };

  const handleFreightDataChange = (updatedData) => {
    setFreightData(updatedData);
  };

  const handleExtraDataChange = (index, key, newValue) => {
    setShortTableData((prev) => ({
      ...prev,
      [key]: newValue, // Store updated values in shortTableData
    }));

    // Update extraFields for UI rendering, but do not modify formData.bid_materials
    setExtraFields((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: newValue,
      },
    }));
  };

  const handleOpenTaxModal = (index) => {
    setSelectedMaterialIndex(index);
    setShowTaxModal(true);
  };

  const handleCloseTaxModal = () => {
    setShowTaxModal(false);
  };

  const handleSaveTaxChanges = () => {
    setShowTaxModal(false);
  };

  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
    const updatedTaxRateData = [...taxRateData];
    const targetRow = updatedTaxRateData[rowIndex];

    if (!targetRow) return;

    const taxCharges =
      type === "addition"
        ? [...targetRow.additionTaxCharges]
        : [...targetRow.deductionTax];

    const chargeIndex = taxCharges.findIndex((item) => item.id === id);
    if (chargeIndex === -1) return;

    const charge = { ...taxCharges[chargeIndex] };
    charge[field] = value;
    taxCharges[chargeIndex] = charge;

    if (type === "addition") {
      targetRow.additionTaxCharges = taxCharges;
    } else {
      targetRow.deductionTax = taxCharges;
    }

    updatedTaxRateData[rowIndex] = targetRow;
    setTaxRateData(updatedTaxRateData);
  };

  const addAdditionTaxCharge = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...formData.bid_materials];
    if (!updatedTaxRateData[rowIndex].addition_bid_material_tax_details) {
      updatedTaxRateData[rowIndex].addition_bid_material_tax_details = [];
    }
    updatedTaxRateData[rowIndex].addition_bid_material_tax_details.push(
      newItem
    );

    setFormData({
      ...formData,
      bid_materials: updatedTaxRateData,
    });
  };

  const addDeductionTax = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...taxRateData];
    updatedTaxRateData[rowIndex].deductionTax.push(newItem);
    setTaxRateData(updatedTaxRateData);
  };

  const removeTaxChargeItem = (rowIndex, id, type) => {
    const updatedTaxRateData = [...taxRateData];
    if (type === "addition") {
      updatedTaxRateData[rowIndex].addition_bid_material_tax_details =
        updatedTaxRateData[rowIndex].addition_bid_material_tax_details.filter(
          (item) => item.id !== id
        );
    } else {
      updatedTaxRateData[rowIndex].deductionTax = updatedTaxRateData[
        rowIndex
      ].deductionTax.filter((item) => item.id !== id);
    }
    setTaxRateData(updatedTaxRateData);
  };

  const handleOtherChargesInputChange = (field, value) => {
    const updatedCharges = { ...shortTableData, [field]: value };

    const getValue = (label) => parseFloat(updatedCharges[label] || "0") || 0;

    const freight = getValue("freight_charge_amount");
    const gstFreight = getValue("gst_on_freight");

    const other = getValue("other_charge_amount");
    const gstOther = getValue("gst_on_other_charge");

    const handling = getValue("handling_charge_amount");
    const gstHandling = getValue("gst_on_handling_charge");

    const realisedFreight = freight + (freight * gstFreight) / 100;
    const realisedOther = other + (other * gstOther) / 100;
    const realisedHandling = handling + (handling * gstHandling) / 100;

    const gross = realisedFreight + realisedOther + realisedHandling;

    setShortTableData({
      ...updatedCharges,
      realised_freight_charge_amount: realisedFreight.toFixed(2),
      realised_other_charge_amount: realisedOther.toFixed(2),
      realised_handling_charge_amount: realisedHandling.toFixed(2),
    });

    const materialSum = formData.bid_materials.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );
    const finalSumTotal = materialSum + gross;

    if (sumTotal !== finalSumTotal) {
      setSumTotal(finalSumTotal);
    }
  };

  const onValueChange = (updated) => {
    setChargesData(updated);
  };

  const extra_data = {
    "Payment Terms": {
      value: "",
      readonly: false,
    },
    "Warranty Clause": {
      value: "",
      readonly: false,
    },
    "Loading/Unloading": {
      value: "",
      readonly: false,
    },
  };

  const formattedData = [
    ...Object.entries(extra_data).map(([fieldName, fieldData]) => ({
      label: fieldName,
      value: { firstBid: fieldData.value || "", counterBid: "" },
      isRequired: false,
      isReadOnly: fieldData.readonly,
    })),
    ...Object.entries(formData).map(([key, value]) => ({
      label: key,
      value: { firstBid: value || "", counterBid: "" },
      isRequired: false,
      isReadOnly: false,
    })),
  ];

  const handleValueChange = (updatedData) => {
    setTableData(updatedData);
  };

  console.log(formData, "formData.bid_materials");

  const calculateGrossTotal = () => {
    console.log("bidCounterData:---", bidCounterData, formData);

    const total = formData.bid_total_amount.reduce((acc, item) => {
      const itemTotal = parseFloat(item) || 0; // Ensure valid number
      return acc + itemTotal;
    }, 0);

    return total.toFixed(2); // Return the total as a string with two decimal places
  };

  const productTableColumns = [
    { label: "Material Name", key: "product" },
    { label: "Material Type", key: "materialType" },
    { label: "Material Sub Type", key: "materialSubType" },
    { label: "Delivery Location", key: "deliveryLocation" },
    { label: "Quantity Requested", key: "quantityRequested" },
    { label: "Brand", key: "pmsBrand" },
    { label: "Colour", key: "pmsColour" },
    { label: "Generic Info", key: "genericInfo" },
    { label: "Quantity Available", key: "quantityAvailable" },
    { label: "Price", key: "price" },
    { label: "Realised Price", key: "realisedPrice" },
    { label: "Discount", key: "discount" },
    { label: "Realised Discount", key: "realisedDiscount" },
    { label: "Landed Amount", key: "landedAmount" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Vendor Remark", key: "vendorRemark" },
    { label: "Tax Rate", key: "taxRate" },
    ...Object.entries(formData?.bid_materials?.[0]?.extra_data || {})
      .filter(([_, { value }]) => !Array.isArray(value)) // Exclude array-type values
      .map(([key]) => ({
        label: key.replace(/_/g, " ").toUpperCase(),
        key,
      })),
  ];

  const productTableData =
    formData?.bid_materials?.map((item, index) => {
      const handleInputChange = (e, field) => {
        const value = e.target.value;
        handleMaterialInputChange(e, field, index);
      };

      const productName = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.material_name || "_"}
          readOnly
          disabled
        />
      );
      const landedAmount = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item?.landed_amount || "_"}
          readOnly
          disabled
        />
      );

      const materialType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.material_type || "_"}
          readOnly
          disabled
        />
      );

      const materialSubType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.inventory_sub_type || "_"}
          readOnly
          disabled
        />
      );

      const deliveryLocation = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.location || "_"}
          readOnly
          disabled
        />
      );

      const quantityRequested = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_requested}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      );

      const quantityAvailable = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_available}
          style={{ width: "auto" }}
          disabled={true}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            const quantityRequested = parseFloat(item.quantity_requested) || 0;

            if (value > quantityRequested) {
              toast.error(
                "Quantity available cannot exceed quantity requested."
              );
              return;
            }

            handleMaterialInputChange(e, "quantity_available", index);
          }}
        />
      );

      const price = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.price}
          onChange={(e) => handleMaterialInputChange(e, "price", index)}
          disabled={item.disablePrice}
        />
      );

      const totalAmount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.total_amount}
          readOnly
          disabled={true}
        />
      );

      const discount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.discount}
          onChange={(e) => handleInputChange(e, "discount")}
          disabled={item.disableDiscount}
        />
      );

      const realisedDiscount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_discount}
          readOnly
          disabled
        />
      );

      const realisedPrice = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_price || "_"}
          readOnly
          disabled
        />
      );

      const gst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.gst}
          onChange={(e) => handleInputChange(e, "gst")}
        />
      );

      const realisedGst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_gst}
          readOnly
          disabled
        />
      );

      const vendorRemark = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.vendor_remark}
          onChange={(e) => handleInputChange(e, "vendor_remark")}
        />
      );

      const pmsBrand = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_brand_name || "_"}
          readOnly
          disabled
        />
      );

      const pmsColour = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_colour_name || "_"}
          readOnly
          disabled
        />
      );

      const genericInfo = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.generic_info_name || "_"}
          readOnly
          disabled
        />
      );

      const taxRate = (
        <button
          className="purple-btn2"
          onClick={() => handleOpenTaxModal(index)}
        >
          Select
        </button>
      );
      const extraColumnData = Object.entries(item.extra_data || {}).reduce(
        (acc, [key, { value, readonly }]) => {
          acc[key] = (
            <input
              type="text"
              className="form-control"
              style={{ width: "auto" }}
              value={extraFields[index]?.[key] ?? value ?? ""}
              onChange={(e) =>
                handleExtraDataChange(index, key, e.target.value)
              }
              readOnly={readonly}
              disabled={readonly}
            />
          );
          return acc;
        },
        {}
      );

      return {
        product: <span>{productName}</span>,
        materialType,
        materialSubType,
        deliveryLocation,
        quantityRequested,
        quantityAvailable,
        price,
        discount,
        realisedDiscount,
        realisedPrice, // Add realised price to table data
        gst,
        realisedGst,
        vendorRemark,
        totalAmount,
        pmsBrand,
        landedAmount,
        pmsColour,
        genericInfo,
        taxRate,
        ...extraColumnData,
      };
    }) || [];

  return (
    <div className="website-content overflow-auto">
      <div className="module-data-section">
        <div className="event-order-page">
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="ant-btn styles_headerCtaLink__2kCN6 ant-btn-link"
              onClick={() => navigate(-1)}
            >
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                className="pro-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.707 4.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 1 1 1.414 0Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <div>
              <h4 className="event-head px-2 pt-2 ms-2">Counter Offer</h4>
            </div>
          </div>

          <h5 className="mt-4">Material Sheet</h5>
          <Table columns={productTableColumns} data={productTableData} />
          <div className="d-flex justify-content-end">
            <ShortDataTable
              data={tableData}
              disabled={true} // Use the new disabled prop
              onValueChange={handleValueChange}
            />
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              onClick={handleOpenOtherChargesModal}
              className="purple-btn2"
            >
              Other Charges
            </button>
            <ChargesDataTable
              data={chargesData}
              showOtherChargesModal={showOtherChargesModal}
              handleCloseOtherChargesModal={handleCloseOtherChargesModal}
              setGrossTotal={setSumTotal}
              grossTotal={sumTotal}
              editable={true}
              onValueChange={(updated) => {
                setChargesData(updated);
              }}
              calculateGrossTotal={calculateGrossTotal}
            />
          </div>
          <div className="d-flex justify-content-end">
            <h4>Sum Total : ₹{sumTotal}</h4>
          </div>

          <div className="form-group">
            <label htmlFor="counterOfferRemarks">Counter Offer Remarks</label>
            <input
              className="form-control"
              placeholder="Enter your remarks here"
              type="text"
              id="counterOfferRemarks"
            />
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="purple-btn2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          <DynamicModalBox
            show={showTaxModal}
            onHide={handleCloseTaxModal}
            size="lg"
            title="View Tax & Rate"
            footerButtons={[
              {
                label: "Close",
                onClick: handleCloseTaxModal,
                props: { className: "purple-btn1" },
              },
              {
                label: "Save Changes",
                onClick: handleSaveTaxChanges,
                props: { className: "purple-btn2" },
              },
            ]}
            centered={true}
          >
            <div className="container-fluid p-0">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Material</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.material_name || ""
                      }
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
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.event_material?.inventory_id || ""
                      }
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
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.price || ""
                      }
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
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.quantity_available || ""
                      }
                      readOnly
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Discount(%)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.discount || ""
                      }
                      readOnly
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Material Cost</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formData?.bid_materials?.[selectedMaterialIndex]
                          ?.total_amount || ""
                      }
                      readOnly
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

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
                              className="form-control bg-light"
                              value={
                                formData?.bid_materials?.[selectedMaterialIndex]
                                  ?.total_amount || ""
                              }
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Addition Tax & Charges</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        {formData?.bid_materials?.[
                          selectedMaterialIndex
                        ]?.addition_bid_material_tax_details?.map(
                          (item, rowIndex) => (
                            <tr key={`${rowIndex}-${item.id}`}>
                              <td>
                                <SelectBox
                                  options={taxOptions}
                                  defaultValue={
                                    item.taxChargeType ||
                                    taxOptions.find(
                                      (option) => option.id === item.resource_id
                                    )?.value
                                  }
                                  onChange={(value) =>
                                    handleTaxChargeChange(
                                      selectedMaterialIndex,
                                      item.id,
                                      "taxChargeType",
                                      value,
                                      "addition"
                                    )
                                  }
                                  className="custom-select"
                                  isDisableFirstOption={true}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-select"
                                  // value={item.taxChargePerUom}
                                  defaultValue={item?.taxChargePerUom}
                                  onChange={(e) =>
                                    handleTaxChargeChange(
                                      selectedMaterialIndex,
                                      item.id,
                                      "taxChargePerUom",
                                      e.target.value,
                                      "addition"
                                    )
                                  }
                                  disabled={true}
                                >
                                  <option value="">Select Tax</option>
                                  <option value="5%">5%</option>
                                  <option value="12%">12%</option>
                                  <option value="18%">18%</option>
                                  <option value="28%">28%</option>
                                </select>
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.inclusive}
                                  onChange={(e) =>
                                    handleTaxChargeChange(
                                      selectedMaterialIndex,
                                      item.id,
                                      "inclusive",
                                      e.target.checked,
                                      "addition"
                                    )
                                  }
                                  readOnly
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item.amount}
                                  onChange={(e) => {
                                    const baseAmount =
                                      parseFloat(
                                        formData?.bid_materials?.[
                                          selectedMaterialIndex
                                        ]?.total_amount
                                      ) || 0;
                                    const percentage =
                                      parseFloat(e.target.value) || 0;
                                    const calculatedAmount = item.inclusive
                                      ? baseAmount *
                                        (percentage / (100 + percentage))
                                      : baseAmount * (percentage / 100);

                                    handleTaxChargeChange(
                                      selectedMaterialIndex,
                                      item.id,
                                      "amount",
                                      calculatedAmount.toFixed(2),
                                      "addition"
                                    );
                                  }}
                                  readOnly
                                  disabled={true}
                                />
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td>Deduction Tax</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        {formData?.bid_materials?.[
                          selectedMaterialIndex
                        ]?.deduction_bid_material_tax_details?.map(
                          (item, rowIndex) => (
                            <>
                              <tr key={item.id}>
                                <td>
                                  <SelectBox
                                    options={deductionTaxOptions}
                                    defaultValue={
                                      item.taxChargeType ||
                                      deductionTaxOptions.find(
                                        (option) =>
                                          option.id == item.resource_id
                                      ).value
                                    }
                                    onChange={(value) =>
                                      handleTaxChargeChange(
                                        selectedMaterialIndex,
                                        item.id,
                                        "taxChargeType",
                                        value,
                                        "deduction"
                                      )
                                    }
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    // value={item.taxChargePerUom}
                                    defaultValue={item?.tax_percentage}
                                    onChange={(e) =>
                                      handleTaxChargeChange(
                                        selectedMaterialIndex,
                                        item.id,
                                        "taxChargePerUom",
                                        e.target.value,
                                        "deduction"
                                      )
                                    }
                                    disabled={true}
                                  >
                                    <option value="">Select Tax</option>
                                    <option value="1%">1%/</option>
                                    <option value="2%">2%</option>
                                    <option value="10%">10%</option>
                                  </select>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={item.inclusive}
                                    onChange={(e) =>
                                      handleTaxChargeChange(
                                        selectedMaterialIndex,
                                        item.id,
                                        "inclusive",
                                        e.target.checked,
                                        "deduction"
                                      )
                                    }
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.amount}
                                    onChange={(e) =>
                                      handleTaxChargeChange(
                                        selectedMaterialIndex,
                                        item.id,
                                        "amount",
                                        e.target.value,
                                        "deduction"
                                      )
                                    }
                                    readonly
                                    disabled={true}
                                  />
                                </td>
                              </tr>
                            </>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </DynamicModalBox>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
