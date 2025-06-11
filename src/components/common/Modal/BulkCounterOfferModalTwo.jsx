// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import Table from "../../base/Table/Table";
import ShortTable from "../../base/Table/ShortTable";
import { productTableColumns } from "../../../constant/data";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "bootstrap";
import { baseURL } from "../../../confi/apiDomain";
import SelectBox from "../../base/Select/SelectBox";
import axios from "axios";
import ChargesDataTable from "../../base/Table/ChargesDataTable";
import ShortDataTable from "../../base/Table/ShortDataTable";

export default function BulkCounterOfferModalTwo({
  show,
  handleClose,
  bidCounterData,
}) {
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const prevGrossRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtherChargesModal, setShowOtherChargesModal] = useState(false);
  const [shortTableData, setShortTableData] = useState([]);
  // const [chargesData, setChargesData] = useState({});
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null);
  const [data, setData] = useState(bidCounterData);
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [showSingleTaxModal, setShowSingleTaxModal] = useState(false);
  const [showAllTaxModal, setShowAllTaxModal] = useState(false);
  const originalTaxRateDataRef = useRef([]);
  const [tableId, setTableId] = useState(0);
  const [taxRateData, setTaxRateData] = useState([]);
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);
  const { eventId } = useParams();
  const [minBidPrice, setMinBidPrice] = useState(null); // Store min bid price
  const [userPriceEdited, setUserPriceEdited] = useState({}); // Track if user edited price per row
  const [activityLogAccordion, setActivityLogAccordion] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLogsLoading, setActivityLogsLoading] = useState(false);

  useEffect(() => {
    
const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    // if (!activityLogAccordion) return;
    setActivityLogsLoading(true);
    axios
      .get(
        `${baseURL}rfq/events/${eventId}/activity_logs?token=${token}`
      )
      .then((res) => {
        setActivityLogs(res.data.activity_logs || []);
      })
      .catch(() => setActivityLogs([]))
      .finally(() => setActivityLogsLoading(false));
  }, [activityLogAccordion, eventId]);


  // Fetch min bid price on mount or when eventId changes
  useEffect(() => {
    async function fetchMinBidPrice() {
      if (!eventId) return;
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const res = await fetch(
          `https://marathon.lockated.com/rfq/events/${eventId}/min_bid_price?token=${token}`
        );
        const data = await res.json();
        if (data && typeof data.price !== "undefined") {
          setMinBidPrice(data.price);
        }
      } catch (err) {
        setMinBidPrice(null);
      }
    }
    fetchMinBidPrice();
  }, [eventId]);

  // Set default price to minBidPrice if not set or not edited by user
  useEffect(() => {
    if (
      minBidPrice !== null &&
      formData?.event_materials &&
      Array.isArray(formData.event_materials)
    ) {
      let updatedMaterials = formData.event_materials.map((mat, idx) => {
        // Only set if price is not set or not edited by user
        if (
          (!mat.price || mat.price === "") &&
          !userPriceEdited[idx]
        ) {
          return { ...mat, price: minBidPrice };
        }
        return mat;
      });

      // Recalculate all dependent fields for each material if price is set by default
      updatedMaterials = updatedMaterials.map((mat, idx) => {
        // Only recalculate if price is set by default and not edited by user
        if (
          (!userPriceEdited[idx]) &&
          (mat.price === minBidPrice || mat.price === "" || typeof mat.price === "undefined")
        ) {
          const price = parseFloat(minBidPrice) || 0;
          const quantityAvail =
            mat.quantity_available !== undefined &&
            mat.quantity_available !== null &&
            mat.quantity_available !== ""
              ? parseFloat(mat.quantity_available) || 0
              : parseFloat(mat.quantity) || 0;
          const discount = parseFloat(mat.discount) || 0;
          const gst = parseFloat(mat.gst) || 0;

          const total = price * quantityAvail;
          const realisedPrice = price - (price * discount) / 100;
          const realisedDiscount = (total * discount) / 100;
          const landedAmount = total - realisedDiscount;
          let realisedGst = 0;
          if (gst > 0) {
            realisedGst = (landedAmount * gst) / 100;
          }
          const finalTotal = landedAmount + realisedGst;

          return {
            ...mat,
            price: minBidPrice,
            realised_discount: realisedDiscount.toFixed(2),
            realised_price: realisedPrice.toFixed(2),
            landed_amount: landedAmount.toFixed(2),
            realised_gst: realisedGst.toFixed(2),
            total_amount: finalTotal.toFixed(2),
          };
        }
        return mat;
      });

      // Update sumTotal as well
      const newSumTotal = updatedMaterials.reduce(
        (acc, item) => acc + parseFloat(item.total_amount || 0),
        0
      );
      setSumTotal(newSumTotal);

      setFormData((prev) => ({
        ...prev,
        event_materials: updatedMaterials,
      }));
    }
    // eslint-disable-next-line
  }, [minBidPrice]);

  useEffect(() => {
    const fetchTaxes = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=${token}`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
            id: tax.id,
            taxChargeType: tax.type,
          }));

          // Adding default option at the top
          setTaxOptions([
            { value: "", label: "Select Tax & Charges" },
            ...formattedOptions,
          ]);
        }
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };
    async function fetchTaxPercentages() {
      try {
        const res = await fetch(
          `${baseURL}//rfq/events/tax_percentage?token=${token}`
        );
        const data = await res.json();
        setTaxPercentageOptions(data);
      } catch (err) {
        setTaxPercentageOptions([]);
      }
    }

    fetchTaxes();

    fetchTaxPercentages();
  }, []);

  useEffect(() => {
    const fetchTaxes = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
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

    fetchTaxes();
  }, []);

  // console.log("gormmm data", formData);
  useEffect(() => {
    if (bidCounterData && Array.isArray(bidCounterData.event_materials)) {
      const eventMaterial = bidCounterData.event_materials[0]; // Access the first event material
      if (Array.isArray(eventMaterial.bid_materials)) {
        setFormData(bidCounterData);

        // Calculate initial sum total of all bid materials, ensuring valid total_amount values
        const initialSumTotal = eventMaterial.bid_materials.reduce(
          (acc, item) => {
            const totalAmount = parseFloat(item.total_amount);
            return acc + (isNaN(totalAmount) ? 0 : totalAmount); // If NaN, add 0 instead
          },
          0
        );

        setSumTotal();
      } else {
        console.error(
          "bid_materials is undefined or not an array",
          eventMaterial
        );
        setSumTotal(0);
      }
    } else {
      console.error(
        "bidCounterData.event_materials is undefined or not an array",
        bidCounterData
      );
      setSumTotal(0);
    }
  }, [bidCounterData]);

  // const eventId = bidCounterData?.event?.id;
  // const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  // const eventId = bidCounterData?.event?.id || "-";

  const handleOpenOtherChargesModal = () => {
    setShowOtherChargesModal(true);
  };
  const handleCloseOtherChargesModal = () => setShowOtherChargesModal(false);

  const eventId2 = Array.isArray(bidCounterData?.event_materials)
    ? bidCounterData.event_materials[0]?.id || "-"
    : "-";

  const bidId = Array.isArray(bidCounterData?.event_materials)
    ? bidCounterData.event_materials[0]?.bid_materials?.[0]?.bid_id || "-"
    : "-";

  // console.log("bidCounterData", bidCounterData);

  const handleSubmit = async () => {
    setLoading(true);

    const counterBidMaterialsAttributes = formData?.event_materials?.map(
      (item, index) => {
        const taxDetails = [
          ...(taxRateData[index]?.addition_bid_material_tax_details || []).map(
            (charge) => {
              const matchedTax = taxOptions?.find(
                (tax) =>
                  tax.value?.trim().toLowerCase() ===
                  charge.taxChargeType.trim().toLowerCase()
              );
              return {
                resource_id: matchedTax?.id || null,
                resource_type: matchedTax?.taxChargeType || "TaxCharge",
                amount: charge.amount,
                inclusive: charge.inclusive,
                addition: true,
                tax_percentage: charge.taxChargePerUom,
              };
            }
          ),

          ...(taxRateData[index]?.deduction_bid_material_tax_details || []).map(
            (charge) => {
              const matchedTax = deductionTaxOptions?.find(
                (tax) =>
                  tax.value?.trim().toLowerCase() ===
                  charge.taxChargeType.trim().toLowerCase()
              );

              return {
                resource_id: matchedTax?.id || null,
                resource_type: matchedTax?.type || "TaxCharge",
                amount: charge.amount,
                inclusive: charge.inclusive,
                addition: false,
                tax_percentage: charge.taxChargePerUom,
              };
            }
          ),
        ];
        console.log("taxDetails", taxRateData, taxDetails);

        return {
          event_material_id: item.id,
          bid_material_id: item.bid_materials?.[0]?.bid_id || null,
          quantity_available: parseFloat(item.quantity_available) || parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          discount: parseFloat(item.discount) || 0,
          total_amount: parseFloat(item.total_amount) || 0,
          realised_discount: parseFloat(item.realised_discount) || 0,
          // gst: parseFloat(item.gst) || 0,
          // realised_gst: parseFloat(item.realised_gst) || 0,
          vendor_remark: item.vendor_remark || "",
          bid_material_tax_details: taxDetails,
          addition_tax_charges: (
            taxRateData[index]?.addition_bid_material_tax_details || []
          )?.map((charge) => ({
            taxChargeType: charge.taxChargeType,
            taxChargePerUom: charge.taxChargePerUom,
            inclusive: charge.inclusive,
            amount: charge.amount,
          })),

          deduction_tax: (taxRateData[index]?.deductionTax || []).map(
            (charge) => ({
              // id: isNaN(Number(charge.id)) ? null : charge.id,
              taxChargeType: charge.taxChargeType,
              taxChargePerUom: charge.taxChargePerUom,
              inclusive: charge.inclusive,
              amount: charge.amount,
            })
          ),
        };
      }
    );

    const extractChargeTableData = Array.isArray(shortTableData)
      ? shortTableData?.slice(0, 3)?.map((charge) => ({
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

    // setsubmitted(true);

    const payload = {
      counter_bid: {
        event_vendor_id: formData?.event_vendor_id || null,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        freight_charge_amount: parseFloat(formData.freight_charge_amount) || 0,
        gst_on_freight: parseFloat(formData.gst_on_freight) || 0,
        realised_freight_charge_amount:
          parseFloat(formData.realised_freight_charge_amount) || 0,
        gross_total: sumTotal || 0,
        warranty_clause: formData.warranty_clause || "_",
        payment_terms: formData.payment_terms || "_",
        loading_unloading_clause: formData.loading_unloading_clause || "_",
        counter_bid_materials_attributes: counterBidMaterialsAttributes,
        charges: extractChargeTableData,
      },
    };

    console.log("payload", payload);

    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const response = await fetch(
        `${baseURL}rfq/events/${eventId}/bids/bulk_counter_offer?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      // if (response.ok) {
      //   toast.success("Counter Bid Created successfully!", {
      //     autoClose: 1000, // Close after 3 seconds
      //   });
      //   setTimeout(() => {
      //     handleClose();
      //   }, 1000); //
      // } else {
      //   const errorText = await response.text();
      //   toast.error(`Failed to submit counter bid: ${errorText}`);
      // }
    } catch (error) {
      console.error("Error while submitting counter bid", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialInputChange = (e, field, index) => {
    const value = e.target.value;
    const updatedMaterials = [...formData.event_materials];

    // If user edits price, mark as edited
    if (field === "price") {
      setUserPriceEdited((prev) => ({ ...prev, [index]: true }));
    }

    updatedMaterials[index][field] = value;

    const price = parseFloat(updatedMaterials[index].price) || 0;
    // Use quantity_available if set, otherwise fallback to quantity
    const quantityAvail =
      updatedMaterials[index].quantity_available !== undefined &&
      updatedMaterials[index].quantity_available !== null &&
      updatedMaterials[index].quantity_available !== ""
        ? parseFloat(updatedMaterials[index].quantity_available) || 0
        : parseFloat(updatedMaterials[index].quantity) || 0;
    const discount = parseFloat(updatedMaterials[index].discount) || 0;
    const gst = parseFloat(updatedMaterials[index].gst) || 0;

    const total = price * quantityAvail;
    const realisedPrice = price - (price * discount) / 100;
    const realisedDiscount = (total * discount) / 100;
    const landedAmount = total - realisedDiscount;
    let realisedGst = 0;
    if (gst > 0) {
      realisedGst = (landedAmount * gst) / 100;
    }
    const finalTotal = landedAmount + realisedGst;

    updatedMaterials[index].realised_discount = realisedDiscount.toFixed(2);
    updatedMaterials[index].realised_price = realisedPrice.toFixed(2);
    updatedMaterials[index].landed_amount = landedAmount.toFixed(2);
    updatedMaterials[index].realised_gst = realisedGst.toFixed(2);
    updatedMaterials[index].total_amount = finalTotal.toFixed(2);

    setSumTotal(
      updatedMaterials.reduce(
        (acc, item) => acc + parseFloat(item.total_amount || 0),
        0
      )
    );

    setFormData({
      ...formData,
      event_materials: updatedMaterials,
    });
  };

  // const handleInputChange = (e, field) => {
  //   const value = e.target.value;
  //   const updatedFormData = { ...formData, [field]: value };

  //   // Calculate Realised Freight Charge (ensure it's always a number)
  //   if (field === "freight_charge_amount" || field === "gst_on_freight") {
  //     const freightCharge =
  //       parseFloat(updatedFormData.freight_charge_amount) || 0;
  //     const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;

  //     updatedFormData.realised_freight_charge_amount = (
  //       freightCharge +
  //       (freightCharge * gstOnFreight) / 100
  //     ).toFixed(2); // Ensures the result is a string formatted to 2 decimal places
  //   }

  //   // Calculate Total Sum
  //   const sumTotal = formData.event_materials?.reduce(
  //     (acc, item) => acc + (parseFloat(item.total_amount) || 0),
  //     0
  //   );
  //   const totalSum =
  //     sumTotal +
  //     parseFloat(updatedFormData.realised_freight_charge_amount || 0);

  //   // Update State
  //   setFormData(updatedFormData);
  //   setSumTotal(totalSum);
  // };

  const productTableData =
    formData?.event_materials?.map((eventMaterial, eventIndex) => ({
      SrNo: <span>{eventIndex + 1}</span>,
      product: (
        // <span>{eventMaterial.inventory_name || "_"}</span>
        <input
          type="text"
          className="form-control"
          value={eventMaterial.inventory_name || "_"}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),
      quantityRequested: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.quantity || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      quantityAvailable: (
        <>
          <input
            type="number"
            min="0"
            className="form-control"
            value={
              eventMaterial.quantity_available !== undefined &&
              eventMaterial.quantity_available !== null &&
              eventMaterial.quantity_available !== ""
                ? eventMaterial.quantity_available
                : eventMaterial.quantity || ""
            }
            style={{ width: "auto" }}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              const quantityRequested = eventMaterial.quantity || 0;

              if (value > quantityRequested) {
                toast.error(
                  "Quantity available cannot exceed quantity requested."
                );
                return;
              }

              handleMaterialInputChange(e, "quantity_available", eventIndex);
            }}
          />
        </>
      ),
      // bestTotalAmount: eventMaterial.best_total_amount || "_",
      price: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={
            // Show minBidPrice if not edited and price is empty
            (!userPriceEdited[eventIndex] &&
              (!eventMaterial.price || eventMaterial.price === "") &&
              minBidPrice !== null)
              ? minBidPrice
              : eventMaterial.price || ""
          }
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "price", eventIndex)}
        />
      ),
      totalAmount: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.total_amount || ""}
          style={{ width: "auto" }}
          readOnly
        />
      ),
      discount: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.discount || ""}
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "discount", eventIndex)}
        />
      ),
      realisedDiscount: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.realised_discount || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      materialType: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={eventMaterial?.material_type || "_"}
          readOnly
          disabled
        />
      ),
      materialSubType: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={eventMaterial?.inventory_sub_type || "_"}
          readOnly
          disabled
        />
      ),
      gst: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.gst || ""}
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "gst", eventIndex)}
        />
      ),
      realisedGst: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.realised_gst || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      landedAmount: (
        <input
          type="number"
          min="0"
          className="form-control"
          value={eventMaterial.landed_amount || ""}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),
      vendorRemark: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial.vendor_remark || ""}
          style={{ width: "auto" }}
          onChange={(e) =>
            handleMaterialInputChange(e, "vendor_remark", eventIndex)
          }
        />
      ),
      deliveryLocation: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial?.location || ""}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),
      pmsBrand: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial?.pms_brand_name}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),
      pmsColour: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial?.pms_colour_name}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),
      genericInfo: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial?.generic_info_name}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      ),

      realisedPrice: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={eventMaterial?.realised_price || "_"}
          readOnly
          disabled
        />
      ),
      taxRate: (
        <button
          className="purple-btn2"
          onClick={() => handleOpenModal(eventIndex)}
        >
          Select
        </button>
      ),
    })) || [];

  const sideTableData = [
    {
      label: "Warranty Clause",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.warranty_clause || ""}
          onChange={(e) => handleInputChange(e, "warranty_clause")}
        />
      ),
    },
    {
      label: "Payment Terms",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.payment_terms || ""}
          onChange={(e) => handleInputChange(e, "payment_terms")}
        />
      ),
    },
    {
      label: "Loading / Unloading",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.loading_unloading_clause || ""}
          onChange={(e) => handleInputChange(e, "loading_unloading_clause")}
        />
      ),
    },
  ];

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    if (field === "freight_charge_amount" || field === "gst_on_freight") {
      const freightCharge =
        parseFloat(updatedFormData.freight_charge_amount) || 0;
      const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;

      // Calculate realised freight charge
      const realisedFreight =
        freightCharge + (freightCharge * gstOnFreight) / 100;

      // Format as string for storage
      updatedFormData.realised_freight_charge_amount = realisedFreight;
    }

    const sumTotal = formData.event_materials?.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );

    const totalSum =
      sumTotal +
      parseFloat(updatedFormData.realised_freight_charge_amount || 0);

    setFormData(updatedFormData);
    setSumTotal(totalSum);

    // console.log("Updated Form Data:", updatedFormData);
  };

  // console.log("Product Table Data:", productTableData);
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

    setShortTableData(formattedCharges);
  }, []);
  const onValueChange = (updated) => {
    setShortTableData(updated);
  };

  // const calculateGrossTotal = (updatedData) => {
  //   const getValue = (label) => {
  //     return parseFloat(updatedData[label] || "0") || 0; // Ensure valid number
  //   };

  //   const freight = getValue("freight_charge_amount");
  //   const gstFreight = getValue("gst_on_freight");
  //   const other = getValue("other_charge_amount");
  //   const gstOther = getValue("gst_on_other_charge");
  //   const handling = getValue("handling_charge_amount");
  //   const gstHandling = getValue("gst_on_handling_charge");

  //   const realisedFreight = freight + (freight * gstFreight) / 100;
  //   const realisedOther = other + (other * gstOther) / 100;
  //   const realisedHandling = handling + (handling * gstHandling) / 100;

  //   const updatedRealizedData = { ...updatedData };
  //   updatedRealizedData["realised_freight_charge_amount"] =
  //     realisedFreight.toFixed(2);
  //   updatedRealizedData["realised_other_charge_amount"] =
  //     realisedOther.toFixed(2);
  //   updatedRealizedData["realised_handling_charge_amount"] =
  //     realisedHandling.toFixed(2);

  //   onValueChange(updatedRealizedData);
  //   // console.log("formData:---", typeof formData);

  //   const gross = realisedFreight + realisedOther + realisedHandling;
  //   const materialSum = formData?.event_materials?.reduce(
  //     (acc, item) => acc + (parseFloat(item.total_amount) || 0),
  //     0
  //   );
  //   const finalSumTotal = gross + (sumTotal || 0); // Ensure sumTotal is valid

  //   if (sumTotal !== finalSumTotal) {
  //     setSumTotal(finalSumTotal);
  //   }

  //   if (prevGrossRef.current === null) {
  //     prevGrossRef.current = gross;
  //   }
  // };

  const calculateGrossTotal = () => {
    console.log("bidCounterData:---", bidCounterData, formData);

    const total = formData.event_materials.reduce((acc, material) => {
      const itemTotal = parseFloat(material.total_amount) || 0; // Ensure valid number
      return acc + itemTotal;
    }, 0);

    return total.toFixed(2); // Return the total as a string with two decimal places
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

    const materialSum =
      formData?.event_materials?.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      ) || 0; // Ensure materialSum is valid

    const finalSumTotal = materialSum + gross;

    if (sumTotal !== finalSumTotal) {
      setSumTotal(finalSumTotal);
    }
  };

  const handleOpenTaxModal = (index) => {
    setSelectedMaterialIndex(index);
    setShowSingleTaxModal(true);
  };

  const handleCloseTaxModal = () => {
    setShowSingleTaxModal(false);
  };

  const handleSaveTaxChanges = () => {
    const updatedData = [...formData.event_materials];

    // Update the selected material's total_amount based on the recalculated net cost
    const updatedNetCost = calculateNetCost(tableId);
    updatedData[tableId] = {
      ...updatedData[tableId],
      total_amount: parseFloat(updatedNetCost) || 0, // Ensure total_amount is a valid number
    };

    // Update the formData with the modified materials
    setFormData((prevFormData) => ({
      ...prevFormData,
      event_materials: updatedData,
    }));

    // Recalculate the sumTotal by summing up all total_amount values
    const updatedGrossTotal = updatedData.reduce((acc, item) => {
      const netCost = parseFloat(item.total_amount) || 0; // Ensure valid number
      return acc + netCost;
    }, 0);

    setSumTotal(updatedGrossTotal); // Update the sumTotal state

    handleCloseTaxModal(); // Close the modal

    console.log(
      "Updated Tax Rate Data:",
      updatedData,
      "Updated Gross Total:",
      updatedGrossTotal
    );
  };

  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
  const updatedData = structuredClone(taxRateData);
  const originalData = structuredClone(originalTaxRateDataRef.current);
  const targetRow = updatedData[rowIndex];
  const originalRow = originalData[rowIndex];
  if (!targetRow || !originalRow) return;

  const taxKey =
    type === "addition"
      ? "addition_bid_material_tax_details"
      : "deduction_bid_material_tax_details";

  const taxCharges = [...targetRow[taxKey]];
  const chargeIndex = taxCharges.findIndex((item) => item.id === id);
  if (chargeIndex === -1) return;

  const charge = { ...taxCharges[chargeIndex] };

  if (field === "amount") {
    charge.amount = value;
    if (!charge.inclusive && targetRow.afterDiscountValue) {
      const perUOM = (
        (parseFloat(value) / parseFloat(targetRow.afterDiscountValue)) *
        100
      ).toFixed(2);
      charge.taxChargePerUom = perUOM;
    }
  } else {
    charge[field] = value;
  }

  // Auto-add CGST if SGST is selected, or SGST if CGST is selected
  if (
    field === "taxChargeType" &&
    type === "addition" &&
    (value === "SGST" || value === "CGST")
  ) {
    const otherType = value === "SGST" ? "CGST" : "SGST";
    const otherExists = taxCharges.some((item) => item.taxChargeType === otherType);
    if (!otherExists) {
      const otherOption = taxOptions.find((opt) => opt.value === otherType);
      const samePercentage = charge.taxChargePerUom || "";
      const newRow = {
        id: Date.now().toString() + "_" + otherType.toLowerCase(),
        taxChargeType: otherType,
        taxChargePerUom: samePercentage,
        inclusive: false,
        amount: charge.amount,
        resource_id: otherOption ? otherOption.id : null,
        resource_type: otherOption?.type || "TaxCharge",
      };
      taxCharges.push(newRow);
    }
  }

  // Keep percentage in sync between SGST and CGST
  if (
    field === "taxChargePerUom" &&
    type === "addition" &&
    (charge.taxChargeType === "SGST" || charge.taxChargeType === "CGST")
  ) {
    const otherType = charge.taxChargeType === "SGST" ? "CGST" : "SGST";
    const otherEntry = taxCharges.find((item) => item.taxChargeType === otherType);
    if (otherEntry) {
      otherEntry.taxChargePerUom = value;
      if (!otherEntry.inclusive && targetRow.afterDiscountValue) {
        const amount = calculateTaxAmount(
          value,
          targetRow.afterDiscountValue,
          otherEntry.inclusive
        );
        otherEntry.amount = amount.toFixed(2);
      }
    }
  }

  if (!charge.inclusive && field === "taxChargePerUom") {
    const taxAmount = calculateTaxAmount(
      charge.taxChargePerUom,
      targetRow.afterDiscountValue,
      charge.inclusive
    );
    charge.amount = taxAmount.toFixed(2);
  }

  taxCharges[chargeIndex] = charge;
  targetRow[taxKey] = taxCharges;
  updatedData[rowIndex] = targetRow;

  const recalculated = updatedData.map((row, idx) => ({
    ...row,
    netCost: calculateNetCost(idx, updatedData),
  }));

  setTaxRateData(recalculated);
  originalTaxRateDataRef.current = structuredClone(recalculated);
};

  const handleOpenModal = (rowIndex) => {
    console.log("Opening modal for row:", rowIndex);

    // Fetch the latest data for the selected row from formData
    const selectedRow = formData?.event_materials?.[rowIndex];
    if (!selectedRow) {
      console.error("Selected row data not found.");
      return;
    }

    console.log("Current bidCounterData:", bidCounterData?.event_materials);
    console.log("Current taxRateData:", taxRateData);

    // Update taxRateData with the latest values from the selected row
    const updatedTaxRateData =
      taxRateData.length === 0
        ? formData?.event_materials?.map((row) => ({
            material: row.material_formatted_name || "",
            totalPoQty: row.quantity || "",
            discount: row.discount || "",
            materialCost: row.price || "",
            discountRate: row.realised_discount || "",
            afterDiscountValue: row.total_amount || "",
            remark: row.vendor_remark || "",
            addition_bid_material_tax_details:
              row?.addition_bid_material_tax_details || [],
            deduction_bid_material_tax_details:
              row?.deduction_bid_material_tax_details || [],
            netCost: row.total_amount || "",
          }))
        : structuredClone(taxRateData);

    // Update the specific row in taxRateData with the latest values
    updatedTaxRateData[rowIndex] = {
      ...updatedTaxRateData[rowIndex],
      totalPoQty: selectedRow.quantity || "",
      discount: selectedRow.discount || "",
      materialCost: selectedRow.price || "",
      discountRate: selectedRow.realised_discount || "",
      afterDiscountValue: selectedRow.total_amount || "",
      remark: selectedRow.vendor_remark || "",
    };

    originalTaxRateDataRef.current = structuredClone(updatedTaxRateData);
    setTaxRateData(updatedTaxRateData);

    setTableId(rowIndex);
    setShowSingleTaxModal(true);
  };

  const addAdditionTaxCharge = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...taxRateData];
    updatedTaxRateData[rowIndex].addition_bid_material_tax_details.push(
      newItem
    );
    setTaxRateData(updatedTaxRateData);
    // setParentTaxRateData(updatedTaxRateData);
  };

  const addDeductionTaxCharge = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...taxRateData];
    updatedTaxRateData[rowIndex].deduction_bid_material_tax_details.push(
      newItem
    );
    setTaxRateData(updatedTaxRateData);
    setParentTaxRateData(updatedTaxRateData);
  };

  const removeTaxChargeItem = (rowIndex, id, type) => {
    const updatedTaxRateData = [...taxRateData];
    if (type === "addition") {
      updatedTaxRateData[rowIndex].addition_bid_material_tax_details =
        updatedTaxRateData[rowIndex].addition_bid_material_tax_details.filter(
          (item) => item.id !== id
        );
    } else {
      updatedTaxRateData[rowIndex].deduction_bid_material_tax_details =
        updatedTaxRateData[rowIndex].deduction_bid_material_tax_details.filter(
          (item) => item.id !== id
        );
    }
    setTaxRateData(updatedTaxRateData);
    setParentTaxRateData(updatedTaxRateData);
  };

  const calculateTaxAmount = (percentage, baseAmount, inclusive = false) => {
    if (inclusive) return 0;

    const safePercentage =
      typeof percentage === "string" ? percentage.replace("%", "") : percentage;
    const parsedPercentage = parseFloat(safePercentage) || 0;
    const parsedBaseAmount = parseFloat(baseAmount) || 0;

    return (parsedPercentage / 100) * parsedBaseAmount;
  };

  const calculateNetCost = (rowIndex, updatedData = taxRateData) => {
    const taxRateRow = updatedData[rowIndex];
    let additionTaxTotal = 0;
    let deduction_bid_material_tax_detailsTotal = 0;
    let directChargesTotal = 0;

    taxRateRow.addition_bid_material_tax_details.forEach((item) => {
      if (item.inclusive) return;

      if (
        ["Handling Charges", "Other charges", "Freight"].includes(
          item.taxChargeType
        )
      ) {
        directChargesTotal += parseFloat(item.amount) || 0;
      } else {
        const taxAmount = calculateTaxAmount(
          item.taxChargePerUom,
          taxRateRow.afterDiscountValue
        );
        additionTaxTotal += taxAmount;
      }
    });

    taxRateRow.deduction_bid_material_tax_details.forEach((item) => {
      if (item.inclusive) return;
      const taxAmount = calculateTaxAmount(
        item.taxChargePerUom,
        taxRateRow.afterDiscountValue
      );
      deduction_bid_material_tax_detailsTotal += taxAmount;
    });

    const netCost =
      parseFloat(taxRateRow.afterDiscountValue || "0") +
      additionTaxTotal +
      directChargesTotal -
      deduction_bid_material_tax_detailsTotal;

    return netCost.toFixed(2);
  };

  return (
    <>
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        title="Counter Offer"
        size="xxl"
        // footerButtons={[
        //   {
        //     label: "Save",
        //     onClick: handleSubmit,
        //     props: { className: submitted ? "disabled-btn" : "purple-btn2" },
        //   },
        // ]}

        footerButtons={[
          {
            label: loading ? (
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
                <p>Submitting your bid...</p>
              </div>
            ) : (
              "Save"
            ),
            onClick: handleSubmit,
            props: { className: "purple-btn2", disabled: loading }, // Disable button when loading
          },
        ]}
      >
        <h5 className="mt-5">Product Sheet</h5>
        <Table columns={productTableColumns} data={productTableData} />

        <div className="d-flex justify-content-end">
          {/* <ShortTable data={sideTableData} /> */}
          <ShortDataTable
            data={sideTableData}
            disabled={true} // Use the new disabled prop
            onValueChange={() => {}}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button onClick={handleOpenOtherChargesModal} className="purple-btn2">
            Other Charges
          </button>
        </div>
        <ChargesDataTable
          data={shortTableData}
          showOtherChargesModal={showOtherChargesModal}
          handleCloseOtherChargesModal={handleCloseOtherChargesModal}
          setGrossTotal={setSumTotal}
          grossTotal={sumTotal}
          editable={true}
          onValueChange={(updated) => {
            setShortTableData(updated);
          }}
          calculateGrossTotal={calculateGrossTotal}
        />
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

        <Table
              columns={[
                { label: "Activity Name", key: "activity_name" },
                { label: "Activity Type", key: "activity_type" },
                { label: "Created By", key: "created_by_name" },
                { label: "Created Date", key: "created_at" },
              ]}
              data={activityLogs.map((log) => ({
                ...log,
                created_at: new Date(log.created_at).toLocaleString(),
              }))}
            />
      </DynamicModalBox>
      {/* <DynamicModalBox
        show={showOtherChargesModal}
        onHide={handleCloseOtherChargesModal}
        size="md"
        title="Other Charges"
        modalType={true}
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseOtherChargesModal,
            props: { className: "purple-btn1" },
          },
          {
            label: "Save",
            onClick: () => {
              // Add save logic here
              calculateGrossTotal(shortTableData);
              handleCloseOtherChargesModal();
            },
            props: { className: "purple-btn2" },
          },
        ]}
      >
        <div className="d-flex justify-content-end">
          <table className="tbl-container mt-4 p-4">
            <tbody>
              {Object.keys(shortTableData).map((field, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      background: "#8b0203",
                      color: "#fff",
                      width: "65%",
                    }}
                  >
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#000",
                      textAlign: "left",
                    }}
                  >
                    {field.startsWith("realised_") ? (
                      <input
                        type="text"
                        className="form-control"
                        value={shortTableData[field] || ""}
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "#f5f5f5",
                          color: "#000",
                        }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="number"
                          className="form-control"
                          value={shortTableData[field] || ""}
                          onChange={(e) =>
                            handleOtherChargesInputChange(
                              field,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          style={{
                            backgroundColor: "#fff",
                            color: "#000",
                            width: "80%",
                            marginRight: "5px",
                          }}
                        />
                        {field.startsWith("gst_") ? (
                          <span style={{ color: "#000" }}>%</span>
                        ) : (
                          <span style={{ color: "#000" }}>₹</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DynamicModalBox> */}
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                    bidCounterData?.bid_materials?.[selectedMaterialIndex]
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
                          min="0"
                          className="form-control bg-light"
                          value={
                            bidCounterData?.bid_materials?.[
                              selectedMaterialIndex
                            ]?.total_amount || ""
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
                    {bidCounterData?.bid_materials?.[
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
                          {/* <td>
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
                          </td> */}
                          <td>
                            <SelectBox
                              options={
                                (() => {
                                  // Find the selected tax type name by resource_id
                                  const selectedTaxType =
                                    taxOptions.find((opt) => opt.value === item.resource_id)?.label;
                                  const match = taxPercentageOptions.find(
                                    (tax) => tax.tax_name === selectedTaxType
                                  );
                                  return match && Array.isArray(match.percentage)
                                    ? match.percentage.map((percent) => ({
                                        label: `${percent}%`,
                                        value: `${percent}%`,
                                      }))
                                    : [];
                                })()
                              }
                              defaultValue={item?.percentage || ""}
                              onChange={(value) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "percentage",
                                  value,
                                  "addition"
                                )
                              }
                            />
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
                                    bidCounterData?.bid_materials?.[
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
                              disabled
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
                    {bidCounterData?.bid_materials?.[
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
                                    (option) => option.id == item.resource_id
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

      <DynamicModalBox
        show={showSingleTaxModal}
        onHide={handleCloseTaxModal}
        size="lg"
        title="View Tax & Rate"
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseTaxModal,
            props: {
              className: "purple-btn1",
            },
          },
          {
            label: "Save Changes",
            onClick: handleSaveTaxChanges,
            props: {
              className: "purple-btn2",
            },
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

          <div className="row mb-3">
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
                          min="0"
                          className="form-control "
                          value={taxRateData[tableId]?.afterDiscountValue}
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
                          onClick={() => {
                            
                              addAdditionTaxCharge(tableId);
                            
                          }}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>
                    {/* {console.log("item:----", taxRateData, "taxOpiton",tableId)} */}

                    {taxRateData[tableId]?.addition_bid_material_tax_details
                      ?.map((item, rowIndex) => (
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
                              onChange={(value) => {
                                const selectedOption = taxOptions.find(
                                  (option) => option.value === value
                                );
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargeType",
                                  selectedOption?.value,
                                  "addition"
                                );
                              }}
                              className="custom-select"
                              disabledOptions={(
                                taxRateData[
                                  tableId
                                ]?.addition_bid_material_tax_details?.reduce(
                                  (acc, item) => {
                                    const matchedOption = taxOptions.find(
                                      (option) => option.id === item.resource_id
                                    );

                                    const taxType = item.taxChargeType;

                                    // Disable CGST and IGST if CGST is selected
                                    if (taxType === "CGST") {
                                      acc.push("CGST", "IGST");
                                    }

                                    // Disable SGST and IGST if SGST is selected
                                    if (taxType === "SGST") {
                                      acc.push("SGST", "IGST");
                                    }

                                    // Disable CGST and SGST if IGST is selected
                                    if (taxType === "IGST") {
                                      acc.push("CGST", "SGST");
                                    }

                                    // Add taxType or matched option value as fallback
                                    if (taxType) {
                                      acc.push(taxType);
                                    } else if (matchedOption?.value) {
                                      acc.push(matchedOption.value);
                                    }

                                    return acc;
                                  },
                                  []
                                ) || []
                              ).filter(
                                (value, index, self) =>
                                  self.indexOf(value) === index
                              )}
                            />
                          </td>

                          {/* <td>
                            <select
                              className="form-select"
                              // value={item.taxChargePerUom}
                              defaultValue={item?.taxChargePerUom}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargePerUom",
                                  e.target.value,
                                  "addition"
                                )
                              }
                            >
                              <option value="">Select Tax</option>
                              <option value="5%">5%</option>
                              <option value="12%">12%</option>
                              <option value="18%">18%</option>
                              <option value="28%">28%</option>
                            </select>
                          </td> */}
                          <td>
                            <SelectBox
                              options={
                                (() => {
                                  // Find the selected tax type name by resource_id
                                  console.log("item:----", item, taxOptions);
                                  
                                  const selectedTaxType =
                                    taxOptions.find((opt) => opt.label === item.taxChargeType)?.label;
                                  const match = taxPercentageOptions.find(
                                    (tax) => tax.tax_name === selectedTaxType
                                  );
                                  return match && Array.isArray(match.percentage)
                                    ? match.percentage.map((percent) => ({
                                        label: `${percent}%`,
                                        value: `${percent}%`,
                                      }))
                                    : [];
                                })()
                              }
                              defaultValue={item?.percentage || item?.taxChargePerUom || ""}
                              onChange={(value) =>
                                // handleTaxChargeChange(
                                //   tableId,
                                //   item.id,
                                //   "percentage",
                                //   value
                                // )
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargePerUom",
                                  value,
                                  "addition"
                                )
                              }
                            />
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
                              value={item.amount}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "amount",
                                  e.target.value,
                                  "addition"
                                )
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

                    {taxRateData[
                      tableId
                    ]?.deduction_bid_material_tax_details.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <SelectBox
                            options={deductionTaxOptions}
                            defaultValue={
                              deductionTaxOptions.find(
                                (option) => option.id == item.resource_id
                              ).value
                            }
                            onChange={(value) =>
                              handleTaxChargeChange(
                                tableId,
                                item.id,
                                "taxChargeType",
                                value,
                                "deduction"
                              )
                            }
                          />
                        </td>
                        {/* <td>
                          <select
                            className="form-select"
                            // value={item.taxChargePerUom}
                            defaultValue={item?.tax_percentage}
                            onChange={(e) =>
                              handleTaxChargeChange(
                                tableId,
                                item.id,
                                "taxChargePerUom",
                                e.target.value,
                                "deduction"
                              )
                            }
                          >
                            <option value="">Select Tax</option>
                            <option value="1%">1%</option>
                            <option value="2%">2%</option>
                            <option value="10%">10%</option>
                          </select>
                        </td> */}

                        <td>
                          <SelectBox
                            options={
                              (() => {
                                const selectedTaxType =
                                  deductionTaxOptions.find((opt) => opt.value === item.taxChargeType)?.label;
                                const match = taxPercentageOptions.find(
                                  (tax) => tax.tax_name === selectedTaxType
                                );
                                return match && Array.isArray(match.percentage)
                                  ? match.percentage.map((percent) => ({
                                      label: `${percent}%`,
                                      value: `${percent}%`,
                                    }))
                                  : [];
                              })()
                            }
                            defaultValue={item?.percentage || ""}
                            onChange={(value) =>                            
                              handleTaxChargeChange(
                                tableId,
                                item.id,
                                "taxChargePerUom",
                                value,
                                "deduction"
                              )
                            }
                          />
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
                            value={item.amount}
                            onChange={(e) =>
                              handleTaxChargeChange(
                                tableId,
                                item.id,
                                "amount",
                                e.target.value,
                                "deduction"
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              removeTaxChargeItem(tableId, item.id, "deduction")
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
                          value={taxRateData[tableId]?.netCost}
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
      </DynamicModalBox>
      <ToastContainer />
    </>
  );
}
