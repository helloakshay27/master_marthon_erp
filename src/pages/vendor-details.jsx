import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Table, ShortTable, SelectBox } from "../components";
import ShortDataTable from "../components/base/Table/ShortDataTable";
import "../styles/mor.css";
import { mumbaiLocations, product, unitMeasure } from "../constant/data";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ClockIcon from "../components/common/Icon/ClockIcon";

export default function VendorDetails() {
  // const [freightData, setFreightData] = useState([

  //   { label: "Freight Charge", value: "" },
  //   { label: "GST on Freight", value: "" },

  //   { label: "Realised Freight", value: "" },
  //   { label: "Warranty Clause *", value: "" },
  //   { label: "Payment Terms *", value: "" },
  //   { label: "Loading / Unloading *", value: "" },
  // ]);

  // Set the initial bid index to 0 (first bid in the array)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bids, setBids] = useState([]); // State to store the bids

  // Array of bid values
  // const bids = [1555, 2, 3, 4787, 5, 66666, 7, 8, 9,10,11,12];

  // Function to move to the next bid

  const increment = () => {
    if (currentIndex + 1 < bids.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to move to the previous bid
  const decrement = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getOrdinalInText = (n) => {
    const ordinals = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
      "Thirteenth",
      "Fourteenth",
      "Fifteenth",
      "Sixteenth",
      "Seventeenth",
      "Eighteenth",
      "Nineteenth",
      "Twentieth",
      "Twenty-first",
      "Twenty-second",
      "Twenty-third",
      "Twenty-fourth",
      "Twenty-fifth",
      "Twenty-sixth",
      "Twenty-seventh",
      "Twenty-eighth",
      "Twenty-ninth",
      "Thirtieth",
    ];

    return ordinals[n - 1] || `${n}th`; // Fallback to numeric suffix if greater than array length
  };

  // Get the current, previous, and next bids
  // const previousBid = currentIndex > 0 ? currentIndex  : "No bid";
  const currentBid = ` Current bid ${currentIndex + 1}`;
  // const nextBid = currentIndex < bids.length - 1 ? currentIndex+2:"No bid";

  const [freightData, setFreightData] = useState([
    { label: "Freight Charge", value: { firstBid: "", counterBid: "" } },
    { label: "GST on Freight", value: { firstBid: "", counterBid: "" } },
    { label: "Realised Freight", value: { firstBid: "", counterBid: "" } },
    { label: "Warranty Clause *", value: { firstBid: "", counterBid: "" } },
    { label: "Payment Terms *", value: { firstBid: "", counterBid: "" } },
    { label: "Loading / Unloading *", value: { firstBid: "", counterBid: "" } },
  ]);

  const [vendorId, setVendorId] = useState(() => {
    // Retrieve the vendorId from sessionStorage or default to an empty string
    return sessionStorage.getItem("vendorId") || "";
  });

  console.log(" vednor idddddddddddddddddd", vendorId);

  const [remark, setRemark] = useState("");

  const [revisedBid, setRevisedBid] = useState(false);
  const [data, setData] = useState([]);
  const [counterData, setCounterData] = useState(0);
  const [counterId, setCounterId] = useState(0);

  const navigate = useNavigate();

  const handleDescriptionOfItemChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].descriptionOfItem = selected;
    setData(updatedData);
  };
  const handleUnitChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].unit = selected;
    setData(updatedData);
  };
  const handleLocationChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].location = selected;
    setData(updatedData);
  };

  const handleInputChange = (value, rowIndex, key) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = value;

    const price = parseFloat(updatedData[rowIndex].price) || 0;
    const quantityAvail = parseFloat(updatedData[rowIndex].quantityAvail) || 0;
    const discount = parseFloat(updatedData[rowIndex].discount) || 0;
    const gst = parseFloat(updatedData[rowIndex].gst) || 0;

    // Step 1: Calculate total amount (price * quantity)
    const total = price * quantityAvail;

    // Step 2: Calculate realised discount
    const realisedDiscount = (total * discount) / 100;

    // Step 3: Calculate landed amount (discounted total, before GST)
    const landedAmount = total - realisedDiscount;

    // Step 4: Calculate realised GST (based on landed amount)
    let realisedGst = 0;
    if (gst > 0) {
      realisedGst = (landedAmount * gst) / 100; // GST applied on landed amount
    }

    // Step 5: Calculate final total (landed amount + GST)
    const finalTotal = landedAmount + realisedGst;

    // Update fields in the data array
    updatedData[rowIndex].realisedDiscount = realisedDiscount.toFixed(2);
    updatedData[rowIndex].landedAmount = landedAmount.toFixed(2); // Before GST
    updatedData[rowIndex].realisedGst = realisedGst.toFixed(2);
    updatedData[rowIndex].total = finalTotal.toFixed(2); // After GST

    setData(updatedData);

    const updatedGrossTotal = calculateSumTotal();
    setGrossTotal(updatedGrossTotal);
    // setData(updatedData, () => {
    //   const updatedGrossTotal = calculateSumTotal();
    //   setGrossTotal(updatedGrossTotal);
    // });
  };

  const calculateFreightTotal = () => {
    const getFreightValue = (label) => {
      const row = freightData.find((row) => row.label === label);

      if (row && row.value) {
        const { firstBid, counterBid } = row.value;

        const valueToParse = counterBid || firstBid;

        if (typeof valueToParse === "string") {
          return parseFloat(valueToParse.replace(/₹|,/g, "")) || 0;
        }
      }

      return 0; // Return 0 if no valid value is found
    };

    const freightCharge = getFreightValue("Freight Charge");
    const realisedFreight = getFreightValue("Realised Freight");

    // Use realisedFreight if available, otherwise use freightCharge
    return realisedFreight || freightCharge;
  };

  console.log("hjedhde", calculateFreightTotal());

  const calculateDataSumTotal = () => {
    if (!Array.isArray(data)) {
      return 0;
    }
    const sum = data.reduce((sum, row) => {
      const total = parseFloat(row.total) || 0;
      return sum + total;
    }, 0);

    return parseFloat(sum.toFixed(2)); // Ensure two decimal places
  };

  const calculateSumTotal = () => {
    const dataSum = parseFloat(calculateDataSumTotal()) || 0; // Total from data
    const freightTotal = parseFloat(calculateFreightTotal()) || 0; // Total from freight data

    // Combine and return the sum
    return Math.round((dataSum + freightTotal) * 100) / 100;
  };

  const handleFreightDataChange = (updatedFreightData) => {
    setFreightData(updatedFreightData);

    // Recalculate gross total
    const updatedGrossTotal = calculateSumTotal();
    setGrossTotal(updatedGrossTotal);
  };

  const tableContainerStyle = {
    overflowX: "auto", // Enable horizontal scrolling
    maxWidth: "100%", // Ensure the table doesn't overflow its container
    marginTop: "10px",
  };

  const fixedColumnStyle = {
    position: "sticky", // Make the first column sticky
    left: 0, // Align it to the left of the table
    backgroundColor: "white", // Ensure the first column is visible over other columns
    zIndex: 10, // Make sure it stays on top of other columns
    minWidth: "200px", // Set a fixed width for the first column
    width: "200px", // Fixed width for the sticky column (adjust as needed)
  };

  const otherColumnsStyle = {
    minWidth: "120px", // Set a fixed minimum width for other columns
    width: "auto", // Allow the other columns to take up available space
  };

  const { eventId } = useParams();

  const [loading, setLoading] = useState(true);
  const [isBidCreated, setIsBidCreated] = useState(false); // Track bid creation status
  const [bidIds, setBidIds] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);

  console.log("grossssssssss total", grossTotal);

  const validateMandatoryFields = () => {
    const mandatoryFields = [
      { label: "Warranty Clause *", key: "Warranty Clause" },
      { label: "Payment Terms *", key: "Payment Terms" },
      { label: "Loading / Unloading *", key: "Loading / Unloading" },
    ];

    for (const field of mandatoryFields) {
      const fieldData = freightData.find(
        (item) => item.label === field.label
      )?.value;

      // Check if fieldData exists and extract the firstBid or counterBid
      const fieldValue = fieldData
        ? fieldData.counterBid || fieldData.firstBid || "" // Prioritize counterBid if present
        : "";

      if (!fieldValue.trim()) {
        alert(`Please fill the mandatory field: ${field.key}`);
        return false; // Exit immediately after the first invalid field
      }
    }

    return true;
  };

  const validateTableData = () => {
    for (const row of data) {
      const fieldsToValidate = [
        { key: "quantityAvail", value: row.quantityAvail },
        { key: "price", value: row.price },
        { key: "gst", value: row.gst },
        { key: "discount", value: row.discount },
      ];

      for (const field of fieldsToValidate) {
        if (
          field.value === undefined ||
          field.value === null ||
          field.value <= 0
        ) {
          alert("Please fill the All mandatory field ");
          return false; // Exit immediately after the first invalid field
        }
      }
    }

    return true;
  };

  const [previousData, setPreviousData] = useState([]); // Holds the data from bid_materials
  const [updatedData, setUpdatedData] = useState([]); // Holds th

  // Set the initial bid index to 0 (first bid in the array)
  // const [currentIndex, setCurrentIndex] = useState(0);

  // // Array of bid values
  // const bids = [1555, 2, 3, 4787, 5, 66666, 7, 8, 9, 10, 11, 12];

  // // Function to move to the next bid
  // const increment = () => {
  //   if (currentIndex + 1 < bids.length) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // // Function to move to the previous bid
  // const decrement = () => {
  //   if (currentIndex - 1 >= 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   }
  // };

  // // Get the current, previous, and next bids
  // const previousBid = currentIndex > 1 ? currentIndex - 1 : "No bid";
  // const currentBid = currentIndex;
  // const nextBid = currentIndex < bids.length - 1 ? currentIndex + 1 : "No bid";

  const fetchEventData = async () => {
    try {
      // Step 1: Fetch the initial API to get `revised_bid`
      const initialResponse = await axios.get(
        `https://vendors.lockated.com/rfq/events/${eventId}/event_materials?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&q[event_vendor_id_cont]=${vendorId}`
      );

      const initialData = initialResponse.data;

      const revisedBid = initialData.revised_bid; // Extract

      // revisedBid from the response

      setRevisedBid(revisedBid);

      console.log("initial data ", initialData);
      console.log("revised data ", revisedBid);

      if (!revisedBid) {
        // If revisedBid is false, format the event materials data
        const formattedData = initialData.event_materials.map((item) => {
          const materialType =
            item.bid_materials && item.bid_materials.length > 0
              ? item.bid_materials[0].material_type
              : null;

          console.log("material type", materialType);

          return {
            eventMaterialId: item.id,
            descriptionOfItem: item.inventory_name,
            quantity: item.quantity,
            quantityAvail: "", // Placeholder for user input
            unit: item.uom,
            location: item.location,
            rate: item.rate || "", // Placeholder if rate is not available
            amount: item.amount,
            totalAmt: "", // Placeholder for calculated total amount
            attachment: null, // Placeholder for attachment
            varient: item.material_type, // Use extracted material_type
          };
        });

        setData(formattedData);
      } else {
        // Step 2: Fetch the bid data if `revised_bid` is true
        const bidResponse = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );

        setCounterData(
          bidResponse.data?.bids[currentIndex]?.counter_bids.length
        );
        setCounterId(
          bidResponse.data?.bids[currentIndex]?.counter_bids[currentIndex]?.id
        );
        setBidIds(bidResponse.data.bids[currentIndex].id);

        const bids = bidResponse.data.bids;
        setBids(bids);

        setGrossTotal(bidResponse.data.bids[currentIndex].gross_total);

        console.log("bids", bids);

        // Process only the first element of the bids array
        if (bids.length > 0) {
          // const firstBid = bids[0];

          const processFreightData = (bid) => {
            const counterBid = bid.counter_bids?.[currentIndex]; // Check if counter bid exists

            // Process data with both first bid and counter bid
            return [
              {
                label: "Freight Charge",
                value: {
                  firstBid: bid.freight_charge_amount || "",
                  counterBid: counterBid?.freight_charge_amount || "",
                },
              },
              {
                label: "GST on Freight",
                value: {
                  firstBid: bid.gst_on_freight || "",
                  counterBid: counterBid?.gst_on_freight || "",
                },
              },
              {
                label: "Realised Freight",
                value: {
                  firstBid: bid.realised_freight_charge_amount || "",
                  counterBid: counterBid?.realised_freight_charge_amount || "",
                },
              },
              {
                label: "Warranty Clause *",
                value: {
                  firstBid: bid.warranty_clause || "",
                  counterBid: counterBid?.warranty_clause || "",
                },
              },
              {
                label: "Payment Terms *",
                value: {
                  firstBid: bid.payment_terms || "",
                  counterBid: counterBid?.payment_terms || "",
                },
              },
              {
                label: "Loading / Unloading *",
                value: {
                  firstBid: bid.loading_unloading_clause || "",
                  counterBid: counterBid?.loading_unloading_clause || "",
                },
              },
            ];
          };

          // Example usage
          const firstBid = bids[currentIndex];
          const freightData = processFreightData(firstBid);
          console.log("Processed Freight Data: ", freightData);
          setFreightData(freightData);

          const previousData = firstBid.bid_materials.map((material) => ({
            bidId: material.bid_id,
            eventMaterialId: material.event_material_id,
            descriptionOfItem: material.material_name,
            varient: material.material_type,
            quantity: material.event_material.quantity,
            quantityAvail: material.quantity_available,
            price: material.price,
            discount: material.discount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,

            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
          }));

          // Map updated data (counter_bid_materials)
          const updatedData = firstBid.bid_materials
            .map((material) => {
              const counterMaterial =
                material.counter_bid_materials?.[currentIndex];
              return counterMaterial
                ? {
                    bidId: counterMaterial.counter_bid_id,
                    eventMaterialId: counterMaterial.event_material_id,
                    descriptionOfItem: counterMaterial.material_name,
                    varient: material.material_type,
                    quantity: material.event_material.quantity,
                    quantityAvail: counterMaterial.quantity_available,
                    price: counterMaterial.price,
                    discount: counterMaterial.discount,
                    realisedDiscount: counterMaterial.realised_discount,
                    gst: counterMaterial.gst,
                    realisedGst: counterMaterial.realised_gst,
                    total: counterMaterial.total_amount,
                    location: material.event_material.location,
                    vendorRemark: counterMaterial.vendor_remark,
                    landedAmount: counterMaterial.landed_amount,
                  }
                : null; // Handle missing counter bids
            })
            .filter(Boolean); // Remove null entries if counter bids are missing

          setPreviousData(previousData);
          setUpdatedData(updatedData);
          setData(updatedData.length > 0 ? updatedData : previousData);

          const bidIds = previousData.map((material) => material.bidId);

          // Store the bidIds in a state
          setBidIds(bidIds); // Use your state setter for the bidIds
          console.log("previous data", previousData);
          console.log("updated data", updatedData);

          // console.log("Mapped first bid data: ", mappedData);
          // setData(mappedData); // Assuming you want to set this data to state
        } else {
          console.log("No bids available");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId, currentIndex]);

  // Get the freight charge value as a string (if available, otherwise default to "0")
  const freightChargeRaw = String(
    freightData.find((item) => item.label === "Freight Charge")?.value || "0"
  );

  // Ensure freightChargeRaw is a string before replacing ₹ and commas
  console.log("Type of freightChargeRaw:", typeof freightChargeRaw);

  // Remove ₹ and commas, then parse it to a float (if not a valid number, default to 0)
  const freightCharge21 = parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0;

  // Log the parsed value
  console.log("Parsed freight charge:", freightCharge21);

  // const preparePayload = () => {
  //   const totalAmount = parseFloat(calculateDataSumTotal());

  //   const bidMaterialsAttributes = data.map((row) => ({
  //     event_material_id: row.eventMaterialId,
  //     quantity_available: row.quantityAvail || 0,
  //     price: Number(row.price || 0),
  //     discount: Number(row.discount || 0),
  //     bid_material_id: row.id,
  //     vendor_remark: row.vendorRemark || "",
  //     gst: row.gst || 0,
  //     realised_discount: row.realisedDiscount || 0,
  //     realised_gst: row.realisedGst || 0,
  //     landed_amount: row.landedAmount || 0,
  //     total_amount: totalAmount,
  //   }));

  //   console.log("------bid material :", bidMaterialsAttributes);

  //   // Utility function to safely fetch and process values from freightData
  //   const getFreightDataValue = (label, key) => {
  //     const item = freightData.find((entry) => entry.label === label);
  //     if (item?.value?.[key]) {
  //       return String(item.value[key]); // Ensure the value is converted to a string
  //     }
  //     return ""; // Return empty string if value is not found
  //   };

  //   // Fetch and parse Freight Charge and GST on Freight
  //   const freightChargeRaw = getFreightDataValue("Freight Charge", "firstBid");
  //   const freightCharge21 =
  //     freightChargeRaw && freightChargeRaw.replace
  //       ? parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0
  //       : 0; // Safeguard for invalid data

  //   const gstOnFreightRaw = getFreightDataValue("GST on Freight", "firstBid");
  //   const gstOnFreightt =
  //     gstOnFreightRaw && gstOnFreightRaw.replace
  //       ? parseFloat(gstOnFreightRaw.replace(/₹|,/g, "")) || 0
  //       : 0;

  //   const realisedFreightChargeAmount = parseFloat(
  //     freightCharge21 + (freightCharge21 * gstOnFreightt) / 100
  //   );

  //   // Fetch other fields
  //   const warrantyClause =
  //     getFreightDataValue("Warranty Clause *", "firstBid") || "1-year warranty";
  //   const paymentTerms =
  //     getFreightDataValue("Payment Terms *", "firstBid") || "Net 30";
  //   const loadingUnloadingClause =
  //     getFreightDataValue("Loading / Unloading *", "firstBid") ||
  //     "Loading at supplier's location, unloading at buyer's location";

  //   // Construct the payload
  //   const payload = {
  //     bid: {
  //       event_vendor_id: vendorId,
  //       price: 2000.0,
  //       discount: 10.0,
  //       freight_charge_amount: freightCharge21,
  //       gst_on_freight: gstOnFreightt,
  //       realised_freight_charge_amount: realisedFreightChargeAmount,
  //       gross_total: grossTotal,
  //       warranty_clause: warrantyClause,
  //       payment_terms: paymentTerms,
  //       loading_unloading_clause: loadingUnloadingClause,
  //       bid_materials_attributes: bidMaterialsAttributes,
  //     },
  //   };

  //   console.log("Prepared Payload:", payload);
  //   return payload;
  // };

  const preparePayload = () => {
    // Calculate the total for each row individually
    const bidMaterialsAttributes = data.map((row) => {
      // const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0); // Calculate row-specific total
      // const gstAmount = rowTotal * (parseFloat(row.gst || 0) / 100); // GST for the row
      // const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100); // Discount for the row
      // const landedAmount = rowTotal + gstAmount - discountAmount; // Final landed amount for the row
      // const finalTotal = landedAmount + gstAmount;

      const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0); // Row total based on price and quantity
      const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100); // Discount for the row
      const landedAmount = rowTotal - discountAmount; // Discounted total, before GST
      const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100); // GST applied on landed amount
      const finalTotal = landedAmount + gstAmount; // Landed amount + GST
      return {
        event_material_id: row.eventMaterialId,
        quantity_available: row.quantityAvail || 0,
        price: Number(row.price || 0),
        discount: Number(row.discount || 0),
        bid_material_id: row.id,
        vendor_remark: row.vendorRemark || "",
        gst: row.gst || 0,
        realised_discount: discountAmount.toFixed(2), // Realised discount for the row
        realised_gst: gstAmount.toFixed(2), // Realised GST for the row
        landed_amount: landedAmount.toFixed(2), // Landed amount for the row
        total_amount: finalTotal.toFixed(2), // Row-specific total amount
      };
    });

    console.log("------bid material :", bidMaterialsAttributes);

    // Utility function to safely fetch and process values from freightData
    const getFreightDataValue = (label, key) => {
      const item = freightData.find((entry) => entry.label === label);
      if (item?.value?.[key]) {
        return String(item.value[key]); // Ensure the value is converted to a string
      }
      return ""; // Return empty string if value is not found
    };

    // Fetch and parse Freight Charge and GST on Freight
    const freightChargeRaw = getFreightDataValue("Freight Charge", "firstBid");
    const freightCharge21 =
      freightChargeRaw && freightChargeRaw.replace
        ? parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0
        : 0; // Safeguard for invalid data

    const gstOnFreightRaw = getFreightDataValue("GST on Freight", "firstBid");
    const gstOnFreightt =
      gstOnFreightRaw && gstOnFreightRaw.replace
        ? parseFloat(gstOnFreightRaw.replace(/₹|,/g, "")) || 0
        : 0;

    const realisedFreightChargeAmount = parseFloat(
      freightCharge21 + (freightCharge21 * gstOnFreightt) / 100
    );

    // Fetch other fields
    const warrantyClause =
      getFreightDataValue("Warranty Clause *", "firstBid") || "1-year warranty";
    const paymentTerms =
      getFreightDataValue("Payment Terms *", "firstBid") || "Net 30";
    const loadingUnloadingClause =
      getFreightDataValue("Loading / Unloading *", "firstBid") ||
      "Loading at supplier's location, unloading at buyer's location";

    // Construct the payload
    const payload = {
      bid: {
        event_vendor_id: vendorId,
        price: 2000.0,
        discount: 10.0,
        freight_charge_amount: freightCharge21,
        gst_on_freight: gstOnFreightt,
        realised_freight_charge_amount: realisedFreightChargeAmount,
        gross_total: grossTotal,
        warranty_clause: warrantyClause,
        payment_terms: paymentTerms,
        loading_unloading_clause: loadingUnloadingClause,
        bid_materials_attributes: bidMaterialsAttributes,
      },
    };

    console.log("Prepared Payload:", payload);
    return payload;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Send POST request

      // Validate mandatory fields
      if (!validateMandatoryFields() || !validateTableData()) {
        setLoading(false);
        return; // Stop further execution if validation fails
      }

      const payload = preparePayload();

      console.log("payloadssss", payload);

      console.log("vendor ID", vendorId);

      const response = await axios.post(
        `https://vendors.lockated.com/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=${vendorId}`, // Replace with your API endpoint
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your auth token
          },
        }
      );

      console.log("API Response:", response.data);
      alert("Bid submitted successfully!");
      await fetchEventData();
      console.log("vendor ID2", vendorId);

      // setData(response.data.bid_materials_attributes || []);
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // terms and condition

  // const preparePayload2 = () => {
  //   const totalAmount = parseFloat(calculateDataSumTotal());

  //   const bidMaterialsAttributes = data.map((row) => ({
  //     event_material_id: row.eventMaterialId,
  //     quantity_available: row.quantityAvail || 0,
  //     price: Number(row.price || 0),
  //     discount: Number(row.discount || 0),
  //     bid_material_id: row.id,
  //     vendor_remark: row.vendorRemark || "",
  //     gst: row.gst || 0,
  //     realised_discount: row.realisedDiscount || 0,
  //     realised_gst: row.realisedGst || 0,
  //     landed_amount: row.landedAmount || 0,
  //     total_amount: totalAmount,
  //   }));

  //   console.log("------bid material :", bidMaterialsAttributes);

  //   // Utility function to safely fetch and process values from freightData
  //   const getFreightDataValue = (label, key) => {
  //     const item = freightData.find((entry) => entry.label === label);
  //     if (item?.value?.[key]) {
  //       return String(item.value[key]); // Ensure the value is converted to a string
  //     }
  //     return ""; // Return empty string if value is not found
  //   };

  //   // Fetch and parse Freight Charge and GST on Freight
  //   const freightChargeRaw = getFreightDataValue("Freight Charge", "firstBid");
  //   const freightCharge21 =
  //     freightChargeRaw && freightChargeRaw.replace
  //       ? parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0
  //       : 0; // Safeguard for invalid data

  //   const gstOnFreightRaw = getFreightDataValue("GST on Freight", "firstBid");
  //   const gstOnFreightt =
  //     gstOnFreightRaw && gstOnFreightRaw.replace
  //       ? parseFloat(gstOnFreightRaw.replace(/₹|,/g, "")) || 0
  //       : 0;

  //   const realisedFreightChargeAmount = parseFloat(
  //     freightCharge21 + (freightCharge21 * gstOnFreightt) / 100
  //   );

  //   // Fetch other fields
  //   const warrantyClause =
  //     getFreightDataValue("Warranty Clause *", "firstBid") || "1-year warranty";
  //   const paymentTerms =
  //     getFreightDataValue("Payment Terms *", "firstBid") || "Net 30";
  //   const loadingUnloadingClause =
  //     getFreightDataValue("Loading / Unloading *", "firstBid") ||
  //     "Loading at supplier's location, unloading at buyer's location";

  //   const updatedGrossTotal = calculateSumTotal();
  //   setGrossTotal(updatedGrossTotal); // Ensure state is updated

  //   // Construct the payload

  //   const payload = {
  //     revised_bid: {
  //       event_vendor_id: vendorId,
  //       price: 500.0,
  //       discount: 10.0,
  //       freight_charge_amount: freightCharge21,
  //       gst_on_freight: gstOnFreightt,
  //       realised_freight_charge_amount: realisedFreightChargeAmount,
  //       gross_total: updatedGrossTotal, //,
  //       warranty_clause: warrantyClause,
  //       payment_terms: paymentTerms,
  //       loading_unloading_clause: loadingUnloadingClause,
  //       revised_bid_materials_attributes: bidMaterialsAttributes,
  //     },
  //   };

  //   console.log("Prepared Payload: revised,", payload);
  //   return payload;
  // };

  const preparePayload2 = () => {
    // const bidMaterialsAttributes = data.map((row) => {
    //   // Calculate row-specific totals
    //   const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0); // Row total based on price and quantity
    //   const gstAmount = rowTotal * (parseFloat(row.gst || 0) / 100); // GST for the row
    //   const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100); // Discount for the row
    //   const landedAmount = rowTotal + gstAmount - discountAmount; // Final landed amount for the row
    //   const finalTotal = landedAmount + gstAmount;

    //   return {
    //     event_material_id: row.eventMaterialId,
    //     quantity_available: row.quantityAvail || 0,
    //     price: Number(row.price || 0),
    //     discount: Number(row.discount || 0),
    //     bid_material_id: row.id,
    //     vendor_remark: row.vendorRemark || "",
    //     gst: row.gst || 0,
    //     realised_discount: discountAmount, // Realised discount for the row
    //     realised_gst: gstAmount, // Realised GST for the row
    //     landed_amount: landedAmount, // Landed amount for the row
    //     total_amount: finalTotal, // Row-specific total amount
    //   };
    // });

    const bidMaterialsAttributes = data.map((row) => {
      // Calculate row-specific totals
      const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0); // Row total based on price and quantity
      const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100); // Discount for the row
      const landedAmount = rowTotal - discountAmount; // Discounted total, before GST
      const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100); // GST applied on landed amount
      const finalTotal = landedAmount + gstAmount; // Landed amount + GST

      return {
        event_material_id: row.eventMaterialId,
        quantity_available: row.quantityAvail || 0,
        price: Number(row.price || 0),
        discount: Number(row.discount || 0),
        bid_material_id: row.id,
        vendor_remark: row.vendorRemark || "",
        gst: row.gst || 0,
        realised_discount: discountAmount.toFixed(2), // Realised discount for the row
        realised_gst: gstAmount.toFixed(2), // Realised GST for the row
        landed_amount: landedAmount.toFixed(2), // Landed amount for the row
        total_amount: finalTotal.toFixed(2), // Row-specific total amount
      };
    });

    console.log("------bid material :", bidMaterialsAttributes);

    // Utility function to safely fetch and process values from freightData
    const getFreightDataValue = (label, key) => {
      const item = freightData.find((entry) => entry.label === label);
      if (item?.value?.[key]) {
        return String(item.value[key]); // Ensure the value is converted to a string
      }
      return ""; // Return empty string if value is not found
    };

    // Fetch and parse Freight Charge and GST on Freight
    const freightChargeRaw = getFreightDataValue("Freight Charge", "firstBid");
    const freightCharge21 =
      freightChargeRaw && freightChargeRaw.replace
        ? parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0
        : 0; // Safeguard for invalid data

    const gstOnFreightRaw = getFreightDataValue("GST on Freight", "firstBid");
    const gstOnFreightt =
      gstOnFreightRaw && gstOnFreightRaw.replace
        ? parseFloat(gstOnFreightRaw.replace(/₹|,/g, "")) || 0
        : 0;

    const realisedFreightChargeAmount = parseFloat(
      freightCharge21 + (freightCharge21 * gstOnFreightt) / 100
    );

    // Fetch other fields
    const warrantyClause =
      getFreightDataValue("Warranty Clause *", "firstBid") || "1-year warranty";
    const paymentTerms =
      getFreightDataValue("Payment Terms *", "firstBid") || "Net 30";
    const loadingUnloadingClause =
      getFreightDataValue("Loading / Unloading *", "firstBid") ||
      "Loading at supplier's location, unloading at buyer's location";

    // Calculate and update the gross total
    const updatedGrossTotal = calculateSumTotal();
    setGrossTotal(updatedGrossTotal); // Ensure state is updated

    // Construct the payload
    const payload = {
      revised_bid: {
        event_vendor_id: vendorId,
        price: 500.0,
        discount: 10.0,
        freight_charge_amount: freightCharge21,
        gst_on_freight: gstOnFreightt,
        realised_freight_charge_amount: realisedFreightChargeAmount,
        gross_total: updatedGrossTotal, // Updated gross total
        warranty_clause: warrantyClause,
        payment_terms: paymentTerms,
        loading_unloading_clause: loadingUnloadingClause,
        revised_bid_materials_attributes: bidMaterialsAttributes,
      },
    };

    console.log("Prepared Payload: revised,", payload);
    return payload;
  };

  const handleReviseBid = async () => {
    // Logic for revising an existing bid
    console.log("Revising the existing bid...");

    // Example: API call to revise the bid

    const userConfirmed = window.confirm(
      "Are you sure you want to revise this bid?"
    );

    if (!userConfirmed) {
      console.log("Bid revision canceled by user.");
      return; // Exit if the user selects "No"
    }

    try {
      // Send POST request

      // Validate mandatory fields
      if (!validateMandatoryFields() || !validateTableData()) {
        setLoading(false);
        return; // Stop further execution if validation fails
      }

      const payload2 = preparePayload2();
      console.log("payloadssss2 revised", payload2);

      const response = await axios.post(
        `https://vendors.lockated.com/rfq/events/${eventId}/bids/${bidIds}/revised_bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=${vendorId}`, // Replace with your API endpoint
        payload2,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your auth token
          },
        }
      );

      console.log("API Response revised....:", response.data);

      alert("Bid revised successfully!");

      // setData(response.data.bid_materials_attributes);
    } catch (error) {
      console.error("Error revising bid:", error);
      alert("Failed to revise bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [terms, setTerms] = useState([]); // To store terms and conditions

  // Fetch data from the API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        console.log("API Response terms and condition:", response.data); //
        // setTerms(response.data.terms_and_conditions || []);

        const extractedTerms = response.data.resource_term_conditions.map(
          (item) => ({
            id: item.term_condition.id,
            condition: item.term_condition.condition,
          })
        );

        setTerms(extractedTerms || []); // Set the mapped terms
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      }
    };

    fetchTerms();
  }, []);

  //user overview

  const [publishedStages, setPublishedStages] = useState(true);
  const [termss, setTermss] = useState(true);
  const [Contact, setContact] = useState(true);
  const [lineItems, setLineItems] = useState(true);
  const [isHistoryActive, setIsHistoryActive] = useState(false);

  const [data1, setData1] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  console.log("Event ID:", eventId);
  useEffect(() => {
    const fetchEventMaterials = async () => {
      // const eventId = 8
      // console.log("Event ID:", eventId);
      try {
        // Fetch data directly without headers
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/vendor_show?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        // Transform the API response into the required table data format

        setData1(response.data);
        // console.log("response:", response.data);
        const isoDate = response.data.event_schedule.start_time;
        setDate(response.data.event_schedule.start_time);
        setEndDate(response.data.event_schedule.end_time_duration);
        // console.log("date:", isoDate);
      } catch (err) {
        console.error(
          "Error fetching event materials:",
          err.response || err.message || err
        );
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventMaterials();
  }, [eventId]);

  const handlepublishedStages = () => {
    setPublishedStages(!publishedStages);
  };

  const handleTerms = () => {
    setTermss(!termss);
  };

  const handleContact = () => {
    setContact(!Contact);
  };

  const handlelineItem = () => {
    setLineItems(!lineItems);
  };

  const formatDate = (date) => {
    const date1 = new Date(date);

    // Extract date parts
    const options = { month: "short" }; // Short month name like "Dec"
    const day = date1.getDate().toString().padStart(2, "0"); // Ensure 2 digits
    const month = (date1.getMonth() + 1).toString().padStart(2, "0"); // "Dec"
    const year = date1.getFullYear();

    // Extract time parts
    let hours = date1.getHours();
    const minutes = date1.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour

    // Combine into desired format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const isoDate = date;

  // Call the function and log the result
  const formattedDate = formatDate(isoDate);
  // console.log("Formatted Date:", formattedDate);

  //end date
  const calculateEndDate = (date) => {
    const date1 = new Date(date);

    // Extract date parts
    const options = { month: "short" }; // Short month name like "Dec"
    const day = date1.getDate().toString().padStart(2, "0"); // Ensure 2 digits
    const month = (date1.getMonth() + 1).toString().padStart(2, "0"); // "Dec"
    const year = date1.getFullYear();

    // Extract time parts
    let hours = date1.getHours();
    const minutes = date1.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour

    // Combine into desired format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const formattedEndDate = calculateEndDate(endDate);

  // console.log(formattedEndDate);
  // console.log("end d", endDate);

  // console.log("data1:", data1);

  // Function to handle button click and navigate
  const handleNavigate = () => {
    // console.log("vendor list ");
    navigate(
      "/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    ); // Redirect to /vendor-list page
  };

  const handleDecline = async () => {
    const payload = { status: "rejected" };
    try {
      const response = await fetch(
        `https://vendors.lockated.com/rfq/events/${eventId}/bids/${bidIds}/counter_bids/${counterId}/update_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Counter offer declined");

        // Retrieve the first bid data again (to restore it)
        const bidResponse = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );
        const bids = bidResponse.data.bids;

        if (bids.length > 0) {
          const firstBid = bids[currentIndex];
          console.log("First bid data:", firstBid);

          // Process Freight Data (Optional)
          const processFreightData = (bid) => [
            {
              label: "Freight Charge",
              value: { firstBid: bid.freight_charge_amount || "" },
            },
            {
              label: "GST on Freight",
              value: { firstBid: bid.gst_on_freight || "" },
            },
            {
              label: "Realised Freight",
              value: { firstBid: bid.realised_freight_charge_amount || "" },
            },
            {
              label: "Warranty Clause *",
              value: { firstBid: bid.warranty_clause || "" },
            },
            {
              label: "Payment Terms *",
              value: { firstBid: bid.payment_terms || "" },
            },
            {
              label: "Loading / Unloading *",
              value: { firstBid: bid.loading_unloading_clause || "" },
            },
          ];

          const freightData = processFreightData(firstBid);
          setFreightData(freightData);

          // Map bid_materials to previousData format
          const previousData = firstBid.bid_materials.map((material) => ({
            bidId: material.bid_id,
            eventMaterialId: material.event_material_id,
            descriptionOfItem: material.material_name,
            varient: material.material_type,
            quantity: material.event_material.quantity,
            quantityAvail: material.quantity_available,
            price: material.price,
            discount: material.discount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,
            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
          }));

          console.log("Previous data:", previousData);
          setPreviousData(previousData);

          // Assuming updatedData comes from the response or API
          const responseData = await response.json();
          const updatedData = responseData.updatedData || [];
          console.log("Updated data:", updatedData);

          // Set data based on the presence of updatedData
          setData(updatedData.length > 0 ? updatedData : previousData);
        } else {
          console.error("No bids found in API response.");
        }

        setCounterData(0);
      } else {
        console.error("Failed to decline counter offer");
      }
    } catch (error) {
      console.error("Error declining counter offer:", error);
    }
  };

  const handleAccept = async () => {
    const payload = { status: "accepted" };

    console.log("Payload being sent:", payload);

    try {
      // API call to update status
      const response = await fetch(
        `https://vendors.lockated.com/rfq/events/${eventId}/bids/${bidIds}/counter_bids/${counterId}/update_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("Response from API:", response);

      if (response.ok) {
        console.log("Counter offer accepted");

        // Fetch bids
        const bidResponse = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );

        const bids = bidResponse.data.bids;
        console.log("Bids array:", bids);

        if (bids.length > 0) {
          const firstBid = bids[currentIndex];
          console.log("First bid data:", firstBid);

          // Process Freight Data (Optional)
          const processFreightData = (bid) => [
            {
              label: "Freight Charge",
              value: { firstBid: bid.freight_charge_amount || "" },
            },
            {
              label: "GST on Freight",
              value: { firstBid: bid.gst_on_freight || "" },
            },
            {
              label: "Realised Freight",
              value: { firstBid: bid.realised_freight_charge_amount || "" },
            },
            {
              label: "Warranty Clause *",
              value: { firstBid: bid.warranty_clause || "" },
            },
            {
              label: "Payment Terms *",
              value: { firstBid: bid.payment_terms || "" },
            },
            {
              label: "Loading / Unloading *",
              value: { firstBid: bid.loading_unloading_clause || "" },
            },
          ];

          const freightData = processFreightData(firstBid);
          setFreightData(freightData);

          // Map bid_materials to previousData format
          const previousData = firstBid.bid_materials.map((material) => ({
            bidId: material.bid_id,
            eventMaterialId: material.event_material_id,
            descriptionOfItem: material.material_name,
            varient: material.material_type,
            quantity: material.event_material.quantity,
            quantityAvail: material.quantity_available,
            price: material.price,
            discount: material.discount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,
            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
          }));

          console.log("Previous data:", previousData);
          setPreviousData(previousData);

          // Assuming updatedData comes from the response or API
          const responseData = await response.json();
          const updatedData = responseData.updatedData || [];
          console.log("Updated data:", updatedData);

          // Set data based on the presence of updatedData
          setData(updatedData.length > 0 ? updatedData : previousData);
        } else {
          console.error("No bids found in API response.");
        }

        setCounterData(0); // Reset counter data
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to accept counter offer. Error response:",
          errorData
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="">
      <div className="styles_projectTabsHeader__148No" id="project-header">
        {/* Project Title Section */}
        <div className="styles_projectTitle__3f7Yw">
          <div className="styles_projectTitleContent__1Xu_Z">
            <button
              type="button"
              className="ant-btn styles_headerCtaLink__2kCN6 ant-btn-link"
              onClick={handleNavigate}
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
                  d="M12.707 4.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <span className="ms-2">
              [{data1?.event_no}] {data1?.event_title}
            </span>
          </div>
          <div className="styles_projectTitleExtra__3ePz7">
            <span> REALTY PRIVATE LTD</span>
          </div>
        </div>
      </div>

      {/* <!-- Tab navigation --> */}
      <div
        style={{
          overflowY: "auto",
          height: "calc(100vh - 100px)",
        }}
      >
        <ul class="nav nav-tabs" id="myTabs" role="tablist">
          <li class="nav-item ms-4" role="presentation">
            <a
              className="nav-link active ps-4 pe-4"
              id="home-tab"
              data-bs-toggle="tab"
              href="#home"
              role="tab"
              aria-controls="home"
              aria-selected="true"
              style={{ color: "#DE7008", fontSize: "16px" }}
            >
              Event Overview
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              className="nav-link ps-4 pe-4"
              id="profile-tab"
              data-bs-toggle="tab"
              href="#profile"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              style={{ color: "#DE7008", fontSize: "16px" }}
            >
              [{data1?.event_no}] {data1?.event_title}
            </a>
          </li>
        </ul>

        {/* <!-- Tab content --> */}
        <div class="tab-content " id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            {/* user overview  */}

            <div
              className="p-3 mb-2 "
              // style={{
              //   overflowY: "auto",
              //   height: "calc(100vh - 100px)",
              // }}
            >
              {loading ? (
                "Loading...."
              ) : error ? (
                "Something went wrong..."
              ) : data1 ? (
                <div className="w-100 container-fluid">
                  <div className="main-content w-100 ">
                    <div className="w-100  pt-2 mb-2  pe-2">
                      {/* Published Stages */}

                      <div className="card mb-5 p-3 mt-2 rounded-3 ">
                        <div
                          className="col-12"
                          style={{ paddingBottom: "20px" }}
                        >
                          <a
                            className="btn"
                            data-bs-toggle="collapse"
                            href="#participation-summary"
                            role="button"
                            aria-expanded={publishedStages}
                            aria-controls="participation-summary"
                            onClick={handlepublishedStages}
                          >
                            <span
                              id="participation-summary-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {publishedStages ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Published Stages
                            </span>
                          </a>
                          {publishedStages && (
                            <div
                              id="participation-summary"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-4  ">
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr. No.</th>
                                        <th className="text-start">
                                          Stage Title
                                        </th>
                                        <th className="text-start">Status</th>
                                        <th className="text-start">
                                          Bidding Starts At
                                        </th>
                                        <th className="text-start">
                                          Bidding Ends At
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          [{data1.event_no}] {data1.event_title}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {data1.status}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {formattedDate}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {formattedEndDate}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Terms & Conditions */}

                        <div
                          className="col-12 "
                          style={{
                            borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            paddingTop: "20px ", // Optional padding to add spacing between content and borders
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
                            className="btn"
                            data-bs-toggle="collapse"
                            href="#terms-conditions"
                            role="button"
                            aria-expanded={termss}
                            aria-controls="terms-conditions"
                            onClick={handleTerms}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <span
                              id="terms-conditions-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {termss ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Terms & Conditions
                            </span>
                          </a>
                          {termss && (
                            <div
                              id="terms-conditions"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-0">
                                <ul
                                  className=" mt-3 mb-3"
                                  // style={{ fontSize: "13px", marginLeft: "0px" }}
                                >
                                  {terms.map((term) => (
                                    <li key={term.id} className="mb-3 mt-3">
                                      {term.condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* contact */}

                        <div
                          className="col-12 "
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
                            className="btn"
                            data-bs-toggle="collapse"
                            href="#savings-summary"
                            role="button"
                            aria-expanded={Contact}
                            aria-controls="savings-summary"
                            onClick={handleContact}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <span
                              id="savings-summary-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {Contact ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Contact Info{" "}
                            </span>
                          </a>
                          {Contact && (
                            <div
                              id="savings-summary"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-4 ">
                                {/* Table Section */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr.No.</th>
                                        <th className="text-start">
                                          Buyer Name
                                        </th>
                                        <th className="text-start">Email</th>
                                        <th className="text-start">Phone</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {data1.created_by}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {data1.created_by_email}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{ color: "#777777" }}
                                        >
                                          {data1.crated_by_mobile}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* line */}

                        <div className="col-12 pb-4 pt-3">
                          <a
                            className="btn d-flex  justify-content-between w-100"
                            data-bs-toggle="collapse"
                            href="#savings-summary"
                            role="button"
                            aria-expanded={lineItems}
                            aria-controls="savings-summary"
                            onClick={handlelineItem}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <div>
                              <span
                                id="savings-summary-icon"
                                className="icon-1"
                                // style={{ marginRight: "8px" }} // Adds gap between icon and text
                                style={{
                                  marginRight: "8px",
                                  border: "1px solid #dee2e6",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "8px",
                                  paddingRight: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                {lineItems ? (
                                  <i className="bi bi-dash-lg"></i>
                                ) : (
                                  <i className="bi bi-plus-lg"></i>
                                )}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "normal",
                                }}
                              >
                                Line Items
                              </span>
                            </div>
                            {/* Right-aligned button */}
                            {/* <div className=""> */}
                            {/* <button
                                className="purple-btn2"
                                data-bs-toggle="modal"
                                data-bs-target="#venderModal"
                                style={{
                                  backgroundColor: "#F0F0F0",
                                  color: "black",
                                  fontSize:'16px'
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  // stroke-width="1"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span style={{ fontSize: '16px' }}>Download Attachment</span>
                              </button> */}

                            <div className="d-flex align-items-center align-bottom">
                              <button className="buyEvent-mainBtn download-reportBtn">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  // stroke-width="1"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Attachment
                              </button>
                              {/* </div> */}
                            </div>
                          </a>
                          {lineItems && (
                            <div
                              id="savings-summary"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="card card-body rounded-3 p-4 ">
                                {/* Table Section */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr.No.</th>
                                        <th className="text-start">
                                          Line Item Name
                                        </th>
                                        <th className="text-start">PR No</th>
                                        <th className="text-start">Item No</th>
                                        <th className="text-start">
                                          Specification Needed
                                        </th>
                                        <th className="text-start">
                                          Attachment
                                        </th>
                                        <th className="text-start">Quantity</th>
                                        <th className="text-start">
                                          PR Creator
                                        </th>
                                        <th className="text-start">
                                          PR Creator Phone
                                        </th>
                                        <th className="text-start">
                                          PR Creator Email
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data1.event_materials.map(
                                        (data, index) => (
                                          <tr key={data.id}>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              {data.inventory_name}
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              -
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            ></td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              NA - NA
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              -
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              {data.quantity}
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              -
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              -
                                            </td>
                                            <td
                                              className="text-start"
                                              style={{ color: "#777777" }}
                                            >
                                              -
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                "No data available"
              )}
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            {/* user list data */}
            <div className="main-content ">
              <div
                className="p-3  "
                style={{
                  overflowX: "auto",
                  //   height: "calc(100vh - 100px)",
                  //   // height: "100vh"
                }}
              >
                <div className="card mx-3 p-4 mt-3 pb-5 mb-5 ">
                  <div className="d-flex flex-row-reverse">
                    <div className="eventList-child1 d-flex align-items-center gap-2 py-3">
                      {/* {event.endsIn ? ( */}
                      <div className="d-flex align-items-center gap-2">
                        <ClockIcon />
                        <p className="mb-0 eventList-p1">Ends In</p>
                      </div>
                      {/* ) : ( */}
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-hourglass-split"></i>
                        <p className="mb-0 eventList-p1">Bid Approves In</p>
                      </div>
                      {/* )} */}
                      {/* <span>{event.timeRemaining}</span> */}
                    </div>
                  </div>
                  <div className="card p-2 m-2">
                    <div className="card-header4">
                      <h4 className="">
                        Submission Sheet
                        <span
                          style={{
                            backgroundColor: "#fff2e8",
                            color: "#fa541c",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            marginLeft: "25px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            borderColor: "#ffbb96",
                          }}
                        >
                          RFQ
                        </span>
                      </h4>
                    </div>

                    {counterData > 0 && (
                      <div className="d-flex justify-content-between align-items-center mx-3 bg-light p-3 rounded-3">
                        <div className="">
                          <p>Counter Offer</p>
                          <p>
                            A counter is pending on your bid. You cannot ake any
                            further changes to your bid untill your resolve the
                            counter offer
                          </p>
                        </div>
                        <div className="d-flex">
                          <button
                            className="purple-btn1"
                            onClick={handleDecline}
                          >
                            Decline
                          </button>
                          <button
                            className="purple-btn2"
                            onClick={handleAccept}
                          >
                            Accept Offer
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="card-body">
                      <div style={tableContainerStyle}>
                        <Table
                          columns={[
                            { label: "Material", key: "descriptionOfItem" },
                            { label: "Material Variant", key: "varient" },
                            { label: "Quantity Requested", key: "quantity" },
                            { label: "Delivery Location", key: "location" },
                            { label: "Creator Attachment", key: "attachment" },
                            {
                              label: "Quantity Available *",
                              key: "quantityAvail",
                            },
                            { label: "Price *", key: "price" },
                            { label: "Discount *", key: "discount" },
                            {
                              label: "Realised Discount",
                              key: "realisedDiscount",
                            },
                            { label: "GST *", key: "gst" },
                            { label: "Realised GST", key: "realisedGst" },
                            { label: "Landed Amount", key: "landedAmount" },
                            {
                              label: "Participant Attachment",
                              key: "attachment",
                            },
                            { label: "Vendor Remark", key: "vendorRemark" },
                            { label: "Total", key: "total" },
                          ]}
                          data={data}
                          customRender={{
                            descriptionOfItem: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled
                              />
                            ),

                            varient: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled
                              />
                            ),
                            unit: (cell, rowIndex) => (
                              <SelectBox
                                isDisableFirstOption={true}
                                label={""}
                                options={unitMeasure}
                                defaultValue={cell}
                                onChange={(selected) =>
                                  handleUnitChange(selected, rowIndex)
                                }
                                style={otherColumnsStyle} // Other columns are scrollable
                              />
                            ),

                            location: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled
                              />
                            ),
                            quantity: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="number"
                                min="0"
                                value={cell}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    rowIndex,
                                    "quantity"
                                  )
                                }
                                placeholder="Enter Quantity"
                                disabled
                                style={otherColumnsStyle}
                              />
                            ),

                            price: (cell, rowIndex) => {
                              const previousPrice =
                                previousData[rowIndex]?.price || cell; // Fallback to `cell` if `previousData` is undefined
                              const updatedPrice =
                                updatedData[rowIndex]?.price || previousPrice; // Use `updatedPrice` if available

                              const showArrow =
                                counterData && previousPrice !== updatedPrice; // Show arrow if `counterData` exists and prices differ

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    ₹{previousPrice}
                                  </span>
                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    ₹{updatedPrice}
                                  </span>

                                  {/* <span>→{updatedDiscount}</span> */}
                                </div>
                              ) : counterData ? (
                                // Show updated price if `counterData` exists but no change in value
                                <span>{updatedPrice}</span>
                              ) : (
                                // If no `counterData`, provide an editable input
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousPrice}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "price"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            rate: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="number"
                                value={cell}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    rowIndex,
                                    "rate"
                                  )
                                }
                                placeholder="Enter Discount"
                                style={otherColumnsStyle}
                              />
                            ),

                            discount: (cell, rowIndex) => {
                              const previousDiscount =
                                previousData[rowIndex]?.discount || cell;
                              const updatedDiscount =
                                updatedData[rowIndex]?.discount ||
                                previousDiscount;
                              const showArrow =
                                counterData &&
                                previousDiscount !== updatedDiscount;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    {previousDiscount}%
                                  </span>

                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    {updatedDiscount}%
                                  </span>

                                  {/* <span>→{updatedDiscount}</span> */}
                                </div>
                              ) : counterData ? (
                                <span>{updatedDiscount}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousDiscount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "discount"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            gst: (cell, rowIndex) => {
                              const previousGst =
                                previousData[rowIndex]?.gst || cell;
                              const updatedGst =
                                updatedData[rowIndex]?.gst || previousGst;
                              const showArrow =
                                counterData && previousGst !== updatedGst;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    {previousGst}%
                                  </span>
                                  {/* <span style={{ marginRight: "5px" }}>→</span>
                                  <span>{updatedGst}</span> */}

                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    {updatedGst}%
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedGst}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousGst}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "gst"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            quantityAvail: (cell, rowIndex) => {
                              const previousQuantity =
                                previousData[rowIndex]?.quantityAvail || cell;
                              const updatedQuantity =
                                updatedData[rowIndex]?.quantityAvail ||
                                previousQuantity;
                              const showArrow =
                                counterData &&
                                previousQuantity !== updatedQuantity;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    {previousQuantity}
                                  </span>
                                  {/* <span style={{ marginRight: "5px" }}>→</span>
                                  <span>{updatedGst}</span> */}

                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    {updatedQuantity}
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedQuantity}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousQuantity}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "quantityAvail"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            landedAmount: (cell, rowIndex) => {
                              const previousLandedAmount =
                                previousData[rowIndex]?.landedAmount || cell;
                              const updatedLandedAmount =
                                updatedData[rowIndex]?.landedAmount ||
                                previousLandedAmount;
                              const showArrow =
                                counterData &&
                                previousLandedAmount !== updatedLandedAmount;

                              return showArrow ? (
                                <div
                                  className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {previousLandedAmount}
                                  </span>
                                  <span style={{ marginRight: "5px" }}>→</span>
                                  <span>{updatedLandedAmount}</span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedLandedAmount}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousLandedAmount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "landedAmount"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            realisedDiscount: (cell, rowIndex) => {
                              const previousRealisedDiscount =
                                previousData[rowIndex]?.realisedDiscount ||
                                cell;
                              const updatedRealisedDiscount =
                                updatedData[rowIndex]?.realisedDiscount ||
                                previousRealisedDiscount;
                              const showArrow =
                                counterData &&
                                previousRealisedDiscount !==
                                  updatedRealisedDiscount;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    ₹{previousRealisedDiscount}
                                  </span>
                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    ₹{updatedRealisedDiscount}
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedRealisedDiscount}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousRealisedDiscount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "realisedDiscount"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            realisedGst: (cell, rowIndex) => {
                              const previousRealisedGst =
                                previousData[rowIndex]?.realisedGst || cell;
                              const updatedRealisedGst =
                                updatedData[rowIndex]?.realisedGst ||
                                previousRealisedGst;
                              const showArrow =
                                counterData &&
                                previousRealisedGst !== updatedRealisedGst;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    ₹{previousRealisedGst}
                                  </span>
                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    ₹{updatedRealisedGst}
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedRealisedGst}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousRealisedGst}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "realisedGst"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            total: (cell, rowIndex) => {
                              const previousTotal =
                                previousData[rowIndex]?.total || cell;
                              const updatedTotal =
                                updatedData[rowIndex]?.total || previousTotal;
                              const showArrow =
                                counterData && previousTotal !== updatedTotal;

                              return showArrow ? (
                                <div
                                  // className="form-control"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    maxWidth: "120%",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      marginRight: "5px",
                                      color: "gray",
                                    }}
                                  >
                                    ₹{previousTotal}
                                  </span>
                                  <span className="me-2">
                                    {" "}
                                    <svg
                                      className="me-2"
                                      viewBox="64 64 896 896"
                                      focusable="false"
                                      class=""
                                      data-icon="arrow-right"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#fcc17e", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",

                                      // color:"#7c2d12",
                                      lineHeight: "1",

                                      // Rounded edges for the badge
                                      // Make text bold
                                    }}
                                  >
                                    ₹{updatedTotal}
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{updatedTotal}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={previousTotal}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e.target.value,
                                      rowIndex,
                                      "total"
                                    )
                                  }
                                  style={otherColumnsStyle}
                                />
                              );
                            },

                            vendorRemark: (cell, rowIndex) => (
                              <textarea
                                className="form-control"
                                value={cell}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    rowIndex,
                                    "vendorRemark"
                                  )
                                }
                                placeholder="Enter Vendor Remark"
                                style={otherColumnsStyle}
                              />
                            ),

                            bestAmount: (cell, rowIndex) => {
                              const quantity =
                                parseFloat(data[rowIndex].quantityAvail) || 0;
                              const rate = parseFloat(data[rowIndex].rate) || 0;
                              const totalAmount = quantity * rate;

                              return (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={totalAmount.toFixed(2)}
                                  readOnly
                                  style={otherColumnsStyle}
                                />
                              );
                            },
                            attachment: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const updatedData = [...data];
                                    updatedData[rowIndex].attachment = file;
                                    setData(updatedData);
                                  }
                                }}
                                style={otherColumnsStyle}
                              />
                            ),
                            amount: (_, rowIndex) => {
                              const quantity =
                                parseFloat(data[rowIndex].quantityAvail) || 0;
                              const rate = parseFloat(data[rowIndex].rate) || 0;
                              const totalAmount = quantity * rate;

                              return (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={totalAmount.toFixed(2)}
                                  readOnlyn
                                  style={otherColumsStyle}
                                />
                              );
                            },
                          }}
                        />
                      </div>
                      <div className=" d-flex justify-content-end">
                        <ShortDataTable
                          data={freightData}
                          editable={true} // Flag to enable input fields
                          // onValueChange={(updatedData) =>
                          //   setFreightData(updatedData)
                          // } // Callback for changes

                          // onValueChange={(updatedData) => {
                          //   setFreightData(updatedData);
                          // }}
                          onValueChange={handleFreightDataChange}
                        />
                      </div>

                      {/* </div> */}
                      <div className="d-flex justify-content-end mt-2 mx-2">
                        {/* <span style={{ fontSize: "16px" }}>
                          Sum Total : ₹{calculateSumTotal()}
                        </span> */}
                        <h4>
                          {/* Sum Total : ₹{calculateSumTotal()} */}
                          {/* Sum Total : ₹
                           {revisedBid ? grossTotal : calculateSumTotal()}  */}
                          Sum Total: ₹{grossTotal}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <hr
                    style={{ borderTop: "2px solid #ccc", margin: "20px 0" }}
                  />

                  <div style={{ marginTop: "10px" }}>
                    {/* bid button */}

                    {revisedBid && (
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex align-items-center">
                          {/* Decrement button (Previous bid) */}
                          <button
                            className="me-2 mb-3"
                            onClick={decrement}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <path
                                d="M18 4l-12 8l12 8"
                                fill="rgb(222, 112, 8)"
                              />
                            </svg>
                          </button>

                          {/* Scrollable buttons container with dynamic width */}
                          <div
                            className="scrollmenu"
                            style={{
                              backgroundColor: "white",
                              overflowX: "auto",
                              whiteSpace: "nowrap",
                              paddingBottom: "10px", // Space for scrollbar
                              width:
                                bids.length <= 2
                                  ? `${bids.length * 120}px`
                                  : "350px", // Dynamic width for 1 or 2 bids
                              margin: "0 auto", // Center the container horizontally
                            }}
                          >
                            {bids.length > 0 &&
                              bids.map((_, index) => {
                                // For the first button, show "Current Bid"
                                const buttonName =
                                  index === 0
                                    ? "Current Bid"
                                    : index === bids.length - 1
                                    ? "Initial Bid" // The last button shows "Initial Bid"
                                    : `${getOrdinalInText(
                                        bids.length - index
                                      )} Bid`; // Use the ordinal word for other buttons

                                return (
                                  <a
                                    key={index}
                                    href={`#bid-${index + 1}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentIndex(index); // Update current index on click
                                    }}
                                    style={{
                                      display: "inline-block",
                                      color:
                                        index === currentIndex
                                          ? "white"
                                          : "#DE7008",
                                      textAlign: "center",
                                      padding: "10px",
                                      textDecoration: "none",
                                      backgroundColor:
                                        index === currentIndex
                                          ? "#DE7008"
                                          : "white", // Active button color
                                      borderRadius: "4px",
                                      marginRight: "10px",
                                      border: `1px solid #DE7008`,
                                      transition: "background-color 0.3s ease",
                                    }}
                                    className={
                                      index === currentIndex ? "active" : ""
                                    }
                                  >
                                    {buttonName}
                                  </a>
                                );
                              })}
                          </div>

                          {/* Increment button (Next bid) */}
                          <button
                            className="mb-3"
                            onClick={increment}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <path
                                d="M6 4l12 8l-12 8"
                                fill="rgb(222, 112, 8)"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Heading and Subtext */}

                    <hr
                      style={{ borderTop: "2px solid #ccc", margin: "20px 0" }}
                    />
                    {/* Remarks Section */}
                    <div
                      className="mb-3 d-flex align-items-center pt-2 "
                      style={{ gap: "200px" }}
                    >
                      <label
                        className=" head-material"
                        style={{
                          minWidth: "250px",
                          marginRight: "10px",
                          marginBottom: "0",
                          fontSize: "16px",
                        }}
                      >
                        Remarks
                      </label>
                      {/* Textarea */}
                      <textarea
                        className="form-control"
                        placeholder="Enter remarks"
                        rows="3"
                        style={{ maxWidth: "300px", flex: "1" }}
                        value={remark} // Bind to state
                        onChange={(e) => setRemark(e.target.value)} // Update state on input
                      >
                        test for haven infoline
                      </textarea>
                    </div>

                    <hr
                      style={{ borderTop: "2px solid #ccc", margin: "20px 0" }}
                    />
                    {/* Terms and Conditions */}

                    <div style={{ marginTop: "30px" }}>
                      <h5 className="fw-bold head-material">
                        Terms and Conditions
                      </h5>
                      <p className="head-material  text-muted ">
                        Please find below the terms and conditions associated
                        with the orders
                      </p>
                      <ul
                        className="head-material  "
                        style={{ fontSize: "13px", marginLeft: "0px" }}
                      >
                        {terms.map((term) => (
                          <li key={term.id} className="mb-3 mt-3">
                            {term.condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className=" d-flex justify-content-end">
                    {/* <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="purple-btn2 m-0"
                    >
                      Create Bid
                    </button> */}
                    <button
                      // onClick={handleSubmit}

                      onClick={revisedBid ? handleReviseBid : handleSubmit} // Conditional onClick
                      // disabled={loading}
                      disabled={loading || counterData > 0} // Disable if loading or counterData exists
                      style={{
                        backgroundColor:
                          loading || counterData > 0 ? "#ccc" : "#DE7008", // Gray for disabled, purple for enabled
                        color: loading || counterData > 0 ? "#666" : "#fff", // Muted text for disabled, white for enabled
                        border:
                          loading || counterData > 0
                            ? "1px solid #aaa"
                            : "1px solid #DE7008", // Adjust border color
                        cursor:
                          loading || counterData > 0
                            ? "not-allowed"
                            : "pointer", // Not-allowed cursor for disabled
                        padding: "10px 20px", // Add padding for consistent button appearance
                        borderRadius: "5px", // Add rounded corners
                      }}
                      className="m-0"
                    >
                      {revisedBid ? "Revise Bid" : "Create Bid"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
