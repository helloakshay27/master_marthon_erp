import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { Table, ShortTable, SelectBox } from "../components";
import ShortDataTable from "../components/base/Table/ShortDataTable";
import "../styles/mor.css";
import { mumbaiLocations, product, unitMeasure } from "../constant/data";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ClockIcon from "../components/common/Icon/ClockIcon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormatDate from "../components/FormatDate"; // Import the default styles
import { baseURL } from "../confi/apiDomain";
import DynamicModalBox from "../components/base/Modal/DynamicModalBox";

export default function VendorDetails() {
  // Set the initial bid index to 0 (first bid in the array)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bids, setBids] = useState([]); // State to store the bids
  const [isBid, setIsBid] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track bid creation status
  const [linkedData, setLinkedData] = useState({});
  const [realisedGstVal, setRealisedGstVal] = useState(0);
  const [tableId, setTableId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [taxRateData, setTaxRateData] = useState([]);
  const [originalTaxRateData, setOriginalTaxRateData] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [terms, setTerms] = useState([]); // To store terms and
  const originalTaxRateDataRef = useRef([]);
  // conditions
  const [timeRemaining, setTimeRemaining] = useState("");

  const { eventId } = useParams();

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

  const [endTime, setEndTime] = useState(null); // Store event end time

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

  const [freightData, setFreightData] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [bidTemplate, setBidTemplate] = useState([]);

  useEffect(() => {
    const fetchFreightData = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/${eventId}/applied_event_templates?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const data = response.data.applied_bid_template_fields.map((field) => ({
          label: field.field_name,
          value: "",
          isRequired: field.is_required,
          isReadOnly: field.is_read_only,
          fieldOwner: field.field_owner,
        }));
        setFreightData(data);
      } catch (error) {
        console.error("Error fetching freight data:", error);
      }
    };

    fetchFreightData();
  }, []);

  useEffect(() => {
    const fetchAdditionalColumns = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/${eventId}/applied_event_templates?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const columns = response.data.applied_bid_material_template_fields.map(
          (field) => ({
            label: field.field_name,
            key: field.field_name.toLowerCase().replace(/\s+/g, "_"),
          })
        );

        const formattedData = response.data.applied_bid_template_fields.map(
          (item) => ({
            label: item.field_name,
            value: { firstBid: "", counterBid: "" },
            isRequired: item.is_required,
            isReadOnly: item.is_read_only,
            fieldOwner: item.field_owner,
          })
        );

        setAdditionalColumns(columns);
        setBidTemplate(formattedData);
        // console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching additional columns:", error);
      }
    };

    fetchAdditionalColumns();
  }, []);

  const [vendorId, setVendorId] = useState(() => {
    // Retrieve the vendorId from sessionStorage or default to an empty string
    return sessionStorage.getItem("vendorId") || "";
  });

  // console.log(" vednor idddddddddddddddddd", vendorId);

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
  };

  const calculateFreightTotal = (updatedFreightData = freightData) => {
    const getFreightValue = (label) => {
      const row = updatedFreightData.find((row) => row.label === label);
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

  const calculateRealisedGstTotal = () => {
    if (!Array.isArray(data)) {
      return 0;
    }
    const sum = data.reduce((sum, row) => {
      const realisedGst = parseFloat(row.realisedGst) || 0;
      return sum + realisedGst;
    }, 0);

    // Add realised GST from freight data
    const freightRealisedGst = freightData.reduce((sum, row) => {
      if (row.label === "GST on Freight") {
        const gstValue = parseFloat(
          row.value.firstBid || row.value.counterBid || 0
        );
        const freightCharge = parseFloat(
          freightData.find((f) => f.label === "Freight Charge")?.value
            .firstBid || 0
        );
        return sum + (freightCharge * gstValue) / 100;
      }
      return sum;
    }, 0);

    const totalRealisedGst = sum + freightRealisedGst;
    setRealisedGstVal(totalRealisedGst);
    return parseFloat(totalRealisedGst.toFixed(2)); // Ensure two decimal places
  };

  const calculateSumTotal = (updatedFreightData = freightData) => {
    const dataSum = parseFloat(calculateDataSumTotal()) || 0; // Total from data
    const freightTotal =
      parseFloat(calculateFreightTotal(updatedFreightData)) || 0; // Total from freight data
    const realisedGstTotal = parseFloat(calculateRealisedGstTotal()) || 0; // Total from realised GST

    // Ensure realisedGstTotal is included in the total calculation
    const totalBeforeFreight = Math.round(dataSum * 100) / 100;
    const totalWithFreightAndGst =
      Math.round((dataSum + freightTotal + realisedGstTotal) * 100) / 100;

    console.log("Total before Freight:", totalBeforeFreight);
    console.log("Total with Freight and GST:", totalWithFreightAndGst);

    return totalWithFreightAndGst;
  };

  const handleFreightDataChange = (updatedFreightData) => {
    setFreightData(updatedFreightData);
    const updatedGrossTotal = calculateSumTotal(updatedFreightData);
    setGrossTotal(updatedGrossTotal);
  };

  const handleSumTotalChange = (sumTotal) => {
    setGrossTotal(sumTotal);
  };

  //____________________________________________________________________

  // const calculateFreightTotal = () => {
  //   const getFreightValue = (label) => {

  //       const valueToParse = counterBid || firstBid;

  //       if (typeof valueToParse === "string") {
  //         return parseFloat(valueToParse.replace(/₹|,/g, "")) || 0;
  //       }
  //     }

  //     return 0; // Return 0 if no valid value is found
  //   };

  //   const freightCharge = getFreightValue("Freight Charge");
  //   const realisedFreight = getFreightValue("Realised Freight");

  //   // Use realisedFreight if available, otherwise use freightCharge
  //   return realisedFreight || freightCharge;
  // };

  // console.log("hjedhde", calculateFreightTotal());

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

  // const calculateSumTotal = () => {
  //   const dataSum = parseFloat(calculateDataSumTotal()) || 0; // Total from data
  //   const freightTotal = parseFloat(calculateFreightTotal()) || 0; // Total from freight data
  //   // console.log(dataSum, "dataSum");
  //   // console.log(freightTotal, "freightTotal");
  //   // Combine and return the sum
  //   return Math.round((dataSum + freightTotal) * 100) / 100;
  // };
  // const handleFreightDataChange = (updatedFreightData) => {
  //   setFreightData(updatedFreightData);

  //   // Recalculate gross total
  //   const updatedGrossTotal = calculateSumTotal();
  //   setGrossTotal(updatedGrossTotal);
  // };

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

  const [loading, setLoading] = useState(true);
  const [isBidCreated, setIsBidCreated] = useState(false); // Track bid creation status
  const [bidIds, setBidIds] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);

  // console.log("grossssssssss total", grossTotal);

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
        // alert(`Please fill the mandatory field: ${field.key}`);
        // return false; // Exit immediately after the first invalid field

        toast.error(`Please fill the mandatory field: ${field.key}`, {
          // position: toast.POSITION.TOP_CENTER, // Customize the position
          autoClose: 1000, // Duration for the toast to disappear (in ms)
        });
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
          toast.error("Please fill the All mandatory fields in the table", {
            autoClose: 1000, // Duration for the toast to disappear (in ms)
          });
          return false; // Exit immediately after the first invalid field
        }
      }
    }

    return true;
  };

  const [previousData, setPreviousData] = useState([]); // Holds the data from bid_materials
  const [updatedData, setUpdatedData] = useState([]); // Holds th

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
        `${baseURL}/rfq/events/${eventId}/event_materials?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&q[event_vendor_id_cont]=${vendorId}`
      );

      const initialData = initialResponse.data;
      const eventMaterials = initialData.event_materials || [];
      const revisedBid = initialData.revised_bid; // Extract

      // revisedBid from the response

      setRevisedBid(revisedBid);

      const uniqueAdditionalColumns = new Set();
      eventMaterials.forEach((item) => {
        const extraKeys = Object.keys(item.extra_data || {});
        extraKeys.forEach((key) => {
          uniqueAdditionalColumns.add(key);
        });
      });

      const additionalColumns = Array.from(uniqueAdditionalColumns).map(
        (key) => ({
          key,
          label: key.replace(/_/g, " ").toUpperCase(),
        })
      );

      setAdditionalColumns(additionalColumns);

      if (!revisedBid) {
        console.log("initial data ", initialData);
        console.log("revised data ", revisedBid);

        const processedData = eventMaterials.map((item) => {
          const bidMaterial = item.bid_materials?.[0]; // Assuming the first bid material

          // Map the row data
          const rowData = {
            pmsBrand: item.pms_brand_name,
            pmsColour: item.pms_colour_name,
            genericInfo: item.generic_info_name,
            eventMaterialId: item.id,
            descriptionOfItem: item.inventory_name,
            quantity: item.quantity,
            quantityAvail: bidMaterial?.quantity_available || "", // Placeholder for user input
            unit: item.uom,
            location: item.location,
            rate: item.rate || "", // Placeholder if rate is not available
            section: item.material_type,
            subSection: item.inventory_sub_type,
            amount: item.amount,
            totalAmt: bidMaterial?.total_amount || "", // Placeholder for calculated total amount
            attachment: null, // Placeholder for attachment
            varient: item.material_type, // Use extracted material_type
          };
          console.log("bidMaterial", bidMaterial);
          

          // Add `extra` data dynamically to the row
          additionalColumns.forEach((col) => {
            rowData[col.key] = bidMaterial?.extra?.[col.key] || ""; // Add extra column data
          });

          return rowData;
        });

        console.log("Processed Data: ", processedData);

        setData(processedData);
      } else {
        // Step 2: Fetch the bid data if `revised_bid` is true
        const bidResponse = await axios.get(
          `${baseURL}rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );

        console.log("bidResponce", bidResponse.data);

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

        // console.log("bids", bids);

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
          // console.log("Processed Freight Data: ", freightData);
          setFreightData(freightData);
          console.log("firstBid.bid_materials :-----------",firstBid.bid_materials);
          
          const previousData = firstBid.bid_materials.map((material) => ({
            bidId: material.bid_id,
            eventMaterialId: material.event_material_id,
            descriptionOfItem: material.material_name,
            varient: material.material_type,
            quantity: material.event_material.quantity,
            quantityAvail: material.quantity_available,
            price: material.price,
            discount: material.discount,
            section: material.event_material.material_type,
            subSection: material.event_material.inventory_sub_type,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,
            unit: material.event_material.uom,
            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
            pmsBrand: material.event_material.pms_brand_name,
            pmsColour: material.event_material.pms_colour_name,
            genericInfo: material.event_material.generic_info_name,
          }));

          // Map updated data (counter_bid_materials)
          // console.log("firstBid.bid_materials", firstBid);
          
          const updatedData = firstBid.bid_materials
            .map((material) => {
              const counterMaterial =
                material.counter_bid_materials?.[currentIndex];
              console.log("material", material);
              setTaxRateData({addAdditionTaxCharges:material.addition_tax_charges, deductionTax: material.deduction_tax});
              

              return counterMaterial
                ? {
                    bidId: counterMaterial.counter_bid_id,
                    eventMaterialId: counterMaterial.event_material_id,
                    descriptionOfItem: counterMaterial.material_name,
                    varient: material.material_type,
                    quantity: material.event_material.quantity,
                    quantityAvail: counterMaterial.quantity_available,
                    price: counterMaterial.price,
                    section: material.event_material.material_type,
                    subSection: material.event_material.inventory_sub_type,
                    discount: counterMaterial.discount,
                    realisedDiscount: counterMaterial.realised_discount,
                    gst: counterMaterial.gst,
                    realisedGst: counterMaterial.realised_gst,
                    total: counterMaterial.total_amount,
                    location: material.event_material.location,
                    vendorRemark: counterMaterial.vendor_remark,
                    landedAmount: counterMaterial.landed_amount,
                    pmsBrand: material.pms_brand_name,
                    pmsColour: material.pms_colour_name,
                    genericInfo: material.generic_info_name,
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
          // console.log("previous data", previousData);
          // console.log("updated data", updatedData);

          // // console.log("Mapped first bid data: ", mappedData);
          // setData(mappedData); // Assuming you want to set this data to state
        } else {
          // console.log("No bids available");
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
  // console.log("Type of freightChargeRaw:", typeof freightChargeRaw);

  // Remove ₹ and commas, then parse it to a float (if not a valid number, default to 0)
  const freightCharge21 = parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0;

  // Log the parsed value
  // console.log("Parsed freight charge:", freightCharge21);

  const preparePayload = () => {
    console.log("taxRateData", taxRateData);
  
    const bidMaterialsAttributes = data.map((row, index) => {
      const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0);
      const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100);
      const landedAmount = rowTotal - discountAmount;
      const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100);
      const finalTotal = landedAmount + gstAmount;
  
      const taxDetails = [
        ...taxRateData.flatMap((item) =>
          item.additionTaxCharges.map((charge) => ({
            resource_id: 1,
            inclusive: charge.inclusive,
            resource_type: "TaxCharge",
            amount: charge.amount,
            addition: true,
          }))
        ),
        ...taxRateData.flatMap((item) =>
          item.deductionTax.map((charge) => ({
            resource_id: 1,
            inclusive: charge.inclusive,
            resource_type: "TaxCharge",
            amount: charge.amount,
            addition: false,
          }))
        ),
      ];
  
      const extra = additionalColumns.reduce((acc, col) => {
        acc[col.key] = row.extra_data?.[col.key]?.value || "";
        return acc;
      }, {});
  
      return {
        event_material_id: row.eventMaterialId,
        quantity_available: row.quantityAvail || 0,
        price: Number(row.price || 0),
        discount: Number(row.discount || 0),
        bid_material_id: row.id,
        vendor_remark: row.vendorRemark || "",
        gst: row.gst || 0,
        realised_discount: discountAmount.toFixed(2),
        realised_gst: gstAmount.toFixed(2),
        landed_amount: landedAmount.toFixed(2),
        total_amount: finalTotal.toFixed(2),
        bid_material_tax_details: taxDetails,
  
        addition_tax_charges: (taxRateData[index]?.additionTaxCharges || []).map(
          (charge) => ({
            id: isNaN(Number(charge.id)) ? null : charge.id,
            taxChargeType: charge.taxChargeType,
            taxChargePerUom: charge.taxChargePerUom,
            inclusive: charge.inclusive,
            amount: charge.amount,
          })
        ),
  
        deduction_tax: (taxRateData[index]?.deductionTax || []).map((charge) => ({
          id: isNaN(Number(charge.id)) ? null : charge.id,
          taxChargeType: charge.taxChargeType,
          taxChargePerUom: charge.taxChargePerUom,
          inclusive: charge.inclusive,
          amount: charge.amount,
        })),
  
        ...additionalColumns.reduce((acc, col) => {
          acc[col.key] = row[col.key] || "";
          return acc;
        }, {}),
  
        extra,
      };
    });
  
    const getFreightDataValue = (label, key) => {
      const item = freightData.find((entry) => entry.label === label);
      if (item?.value?.[key]) {
        return String(item.value[key]);
      }
      return "";
    };
  
    const freightChargeRaw = getFreightDataValue("Freight Charge", "firstBid");
    const freightCharge21 =
      freightChargeRaw && freightChargeRaw.replace
        ? parseFloat(freightChargeRaw.replace(/₹|,/g, "")) || 0
        : 0;
  
    const gstOnFreightRaw = getFreightDataValue("GST on Freight", "firstBid");
    const gstOnFreightt =
      gstOnFreightRaw && gstOnFreightRaw.replace
        ? parseFloat(gstOnFreightRaw.replace(/₹|,/g, "")) || 0
        : 0;
  
    const realisedFreightChargeAmount = parseFloat(
      freightCharge21 + (freightCharge21 * gstOnFreightt) / 100
    );
  
    const warrantyClause =
      getFreightDataValue("Warranty Clause *", "firstBid") || "1-year warranty";
    const paymentTerms =
      getFreightDataValue("Payment Terms *", "firstBid") || "Net 30";
    const loadingUnloadingClause =
      getFreightDataValue("Loading / Unloading *", "firstBid") ||
      "Loading at supplier's location, unloading at buyer's location";
  
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
        remark: remark,
        extra: {},
        bid_materials_attributes: bidMaterialsAttributes,
      },
    };
  
    console.log("Prepared Payload:", payload);
    return payload;
  }; 

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);

    try {
      // Send POST request

      // Validate mandatory fields
      // if (!validateMandatoryFields() || !validateTableData()) {
      //   setLoading(false);
      //   return; // Stop further execution if validation fails
      // }

      const payload = preparePayload();

      console.log("payloadssss", payload);

      // console.log("vendor ID", vendorId);

      const response = await axios.post(
        `${baseURL}rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=${vendorId}`, // Replace with your API endpoint
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your auth token
          },
        }
      );

      console.log("API Response:", response.data);
      console.log("API Response:", response.data); // Log response to debug
      toast.success("Bid Created successfully!", {
        autoClose: 1000, // Close after 3 seconds
      });
      setIsBidCreated(true);
      setRevisedBid(true); // Update `revisedBid` to true
      // console.log("Updated revisedBid to true"); // Update state

      // console.log("Updated isBidCreated to true.");
      // console.log("vendor ID2", vendorId);

      // setData(response.data.bid_materials_attributes || []);

      setTimeout(() => {
        navigate(
          "/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
      }, 1000);
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to create bid. Please try again.", {
        // position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  // console.log("Bid Created:", isBidCreated); // Debugging state

  const preparePayload2 = () => {
    const bidMaterialsAttributes = data.map((row, index) => {
      // Calculate row-specific totals
      const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0); // Row total based on price and quantity
      const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100); // Discount for the row
      const landedAmount = rowTotal - discountAmount; // Discounted total, before GST
      const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100); // GST applied on landed amount
      const finalTotal = landedAmount + gstAmount; // Landed amount + GST
      const taxDetails = [
        ...taxRateData.additionTaxCharges.map((charge) => ({
          resource_id: 1,
          inclusive: charge.inclusive,
          resource_type: "TaxCharge",
          amount: charge.amount,
          addition: true,
        })),
        ...taxRateData.deductionTax.map((charge) => ({
          resource_id: 1,
          inclusive: charge.inclusive,
          resource_type: "TaxCharge",
          amount: charge.amount,
          addition: false,
        })),
      ];

      const extra = Object.keys(row.extra_data || {}).reduce((acc, key) => {
        acc[key] = row.extra_data[key]?.value || null;
        return acc;
      }, {});

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
        bid_material_tax_details: taxDetails,
        addition_tax_charges: taxRateData[index]?.additionTaxCharges || [],
        deduction_tax: taxRateData[index]?.deductionTax || [],
        ...additionalColumns.reduce((acc, col) => {
          acc[col.key] = row[col.key] || "";
          return acc;
        }, {}),
        extra, // Include extra fields in the payload
      };
    });

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
        remark: remark,
        extra: {}, // Additional payload fields
        revised_bid_materials_attributes: bidMaterialsAttributes,
      },
    };

    // console.log("Prepared Payload: revised,", payload);
    return payload;
  };

  const handleReviseBid = async () => {
    setLoading(true);
    setSubmitted(true);
  
    const userConfirmed = window.confirm(
      "Are you sure you want to revise this bid?"
    );
  
    if (!userConfirmed) {
      setLoading(false);
      setSubmitted(false);
      return;
    }
  
    try {
      const revisedBidMaterials = data.map((row) => {
        const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0);
        const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100);
        const landedAmount = rowTotal - discountAmount;
        const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100);
        const finalTotal = landedAmount + gstAmount;
  
        console.log("taxRateData :----", taxRateData);
  
        const taxDetails = [
          ...(Array.isArray(taxRateData?.additionTaxCharges)
            ? taxRateData.additionTaxCharges.map((charge) => ({
                resource_id: null,
                inclusive: charge.inclusive,
                resource_type: "TaxCharge",
                amount: charge.amount,
                addition: true,
                id: isNaN(Number(charge.id)) ? null : charge.id,
                taxChargeType: charge.taxChargeType,
                taxChargePerUom: charge.taxChargePerUom,
              }))
            : []),
  
          ...(Array.isArray(taxRateData?.deductionTax)
            ? taxRateData.deductionTax.map((charge) => ({
                resource_id: null,
                inclusive: charge.inclusive,
                resource_type: "TaxCharge",
                amount: charge.amount,
                addition: false,
                id: isNaN(Number(charge.id)) ? null : charge.id,
                taxChargeType: charge.taxChargeType,
                taxChargePerUom: charge.taxChargePerUom,
              }))
            : []),
        ];
  
        const extra = Object.keys(row.extra_data || {}).reduce((acc, key) => {
          acc[key] = row.extra_data[key]?.value || "";
          return acc;
        }, {});
  
        return {
          event_material_id: row.eventMaterialId,
          quantity_available: row.quantityAvail || 0,
          price: Number(row.price || 0),
          discount: Number(row.discount || 0),
          vendor_remark: row.vendorRemark || "",
          gst: row.gst || 0,
          realised_discount: discountAmount.toFixed(2),
          realised_gst: gstAmount.toFixed(2),
          landed_amount: landedAmount.toFixed(2),
          total_amount: finalTotal.toFixed(2),
          bid_material_tax_details: taxDetails,
          extra,
        };
      });
  
      const payload = {
        revised_bid: {
          event_vendor_id: vendorId,
          price: 500.0,
          discount: 10.0,
          freight_charge_amount: 0,
          gst_on_freight: 0,
          realised_freight_charge_amount: 0,
          gross_total: grossTotal,
          warranty_clause: "",
          payment_terms: "",
          loading_unloading_clause: "",
          remark: remark,
          extra: {},
          revised_bid_materials_attributes: revisedBidMaterials,
        },
      };
  
      console.log("Revised Bid Payload:", payload);
  
      const response = await axios.post(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIds}/revised_bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=${vendorId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
          },
        }
      );
  
      toast.success("Bid revised successfully!", {
        autoClose: 1000,
      });
  
      setTimeout(() => {
        navigate(
          "/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
      }, 1500);
    } catch (error) {
      console.error("Error revising bid:", error);
      toast.error("Failed to revise bid. Please try again.", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };
  
  
  

  useEffect(() => {
    if (!endTime) return;

    const updateCountdown = () => {
      const currentTime = new Date();
      const remainingTime = endTime - currentTime;

      if (remainingTime > 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        setTimeRemaining(`${days}d: ${hours}h: ${minutes}m: ${seconds}s`);
      } else {
        setTimeRemaining("Expired");
        setIsBid(true);
      }
    };

    updateCountdown(); // Initial call
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]); // Only run countdown effect when `endTime` is set

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
  const [documentAttachment, setDocumentAttachment] = useState(true);
  const [deliveryDate, setDelivaryDate] = useState(null);

  // console.log("Event ID:", eventId);

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

  const handleDocumentAttachment = () => {
    setDocumentAttachment(!documentAttachment);
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
  // // console.log("Formatted Date:", formattedDate);

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

  const calculateDelivarydDate = (date) => {
    if (!date) {
      // console.warn("Date is undefined or null.");
      return "Invalid date";
    }

    // Ensure that the date is being parsed correctly by the Date constructor.
    const dateObj = new Date(date);

    // Check if the date object is valid.
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "Invalid date";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format.

    // If the date string contains a time zone, it's being converted into local time correctly by the Date constructor.
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };
  const Delivarydate = calculateDelivarydDate(deliveryDate);
  // console.log("Formatted Delivery Date:", Delivarydate);

  // console.log(formattedEndDate);
  // console.log("end d", endDate);

  // // console.log("data1:", data1);

  // Function to handle button click and navigate
  const handleNavigate = () => {
    // // console.log("vendor list ");
    navigate(
      "/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    ); // Redirect to /vendor-list page
  };

  const handleDecline = async () => {
    const payload = { status: "rejected" };
    try {
      const response = await fetch(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIds}/counter_bids/${counterId}/update_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // console.log("Counter offer declined");

        // Retrieve the first bid data again (to restore it)
        const bidResponse = await axios.get(
          `${baseURL}/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );
        const bids = bidResponse.data.bids;

        if (bids.length > 0) {
          const firstBid = bids[currentIndex];
          // console.log("First bid data:", firstBid);

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
            section: material.material_type,
            subSection: material.inventory_sub_type,
            discount: material.discount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,
            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
          }));

          // console.log("Previous data:", previousData);
          setPreviousData(previousData);

          // Assuming updatedData comes from the response or API
          const responseData = await response.json();
          const updatedData = responseData.updatedData || [];
          // console.log("Updated data:", updatedData);

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

    // console.log("Payload being sent:", payload);

    try {
      // API call to update status
      const response = await fetch(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIds}/counter_bids/${counterId}/update_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // console.log("Response from API:", response);

      if (response.ok) {
        // console.log("Counter offer accepted");

        // Fetch bids
        const bidResponse = await axios.get(
          `${baseURL}/rfq/events/${eventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );

        const bids = bidResponse.data.bids;
        // console.log("Bids array:", bids);

        if (bids.length > 0) {
          const firstBid = bids[currentIndex];
          // console.log("First bid data:", firstBid);

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
            section: material.material_type,
            subSection: material.inventory_sub_type,
            discount: material.discount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            total: material.total_amount,
            location: material.event_material.location,
            vendorRemark: material.vendor_remark,
            landedAmount: material.landed_amount,
          }));

          // console.log("Previous data:", previousData);
          setPreviousData(previousData);

          // Assuming updatedData comes from the response or API
          const responseData = await response.json();
          const updatedData = responseData.updatedData || [];
          // console.log("Updated data:", updatedData);

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

  const [linkedEventData, setLinkedEventData] = useState([]);

  // useEffect(() => {
  //   const fetchTerms = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://marathon.lockated.com/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //       );
  //       const data = response.data;
  //       console.log("my data", data.state);

  //       // Handle bidding state
  //       if (data.state === "expired") {
  //         setIsBid(true);
  //       } else {
  //         setIsBid(false);
  //       }

  //       // Store event end time in state
  //       setEndTime(new Date(data.event_schedule.end_time));

  //       // Set Terms
  //       const extractedTerms = data.resource_term_conditions.map((item) => ({
  //         id: item.term_condition.id,
  //         condition: item.term_condition.condition,
  //       }));
  //       setTerms(extractedTerms || []);
  //     } catch (error) {
  //       console.error("Error fetching terms and conditions:", error);
  //     }
  //   };

  //   fetchTerms();
  // }, [eventId]); // Fetch API only when eventId changes

  // useEffect(() => {
  //   const fetchEventMaterials = async () => {
  //     // const eventId = 8
  //     // // console.log("Event ID:", eventId);
  //     try {
  //       // Fetch data directly without headers
  //       const response = await axios.get(
  //         `https://marathon.lockated.com/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
  //       );

  //       // Transform the API response into the required table data format

  //       setData1(response.data);
  //       // // console.log("response:", response.data);
  //       const isoDate = response.data.event_schedule.start_time;
  //       setDate(response.data.event_schedule.start_time);
  //       setEndDate(response.data.event_schedule.end_time_duration);
  //       setDelivaryDate(response.data.delivery_date);
  //       // console.log("date:", isoDate);

  //       if (response.data.linked_event_id) {
  //         fetchLinkedEventData(response.data.linked_event_id);
  //       } else {
  //         setLinkedEventData([]); // Ensure it's an array
  //       }
  //     } catch (err) {
  //       console.error(
  //         "Error fetching event materials:",
  //         err.response || err.message || err
  //       );
  //       setError("Failed to load data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEventMaterials();
  // }, [eventId]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        const data = response.data;
        console.log("Event Data Response:", data);

        setData1(data);

        setDate(data?.event_schedule?.start_time || "");
        setEndDate(data?.event_schedule?.end_time_duration || "");

        setDelivaryDate(data.delivery_date || "");
        setEndTime(new Date(data.event_schedule.end_time || ""));

        setIsBid(data.state === "expired");

        const extractedTerms = data.resource_term_conditions.map((item) => ({
          id: item.term_condition.id,
          condition: item.term_condition.condition,
        }));
        setTerms(extractedTerms || []);

        //  Handle Linked Event Data
        if (data.linked_event_id) {
          fetchLinkedEventData(data.linked_event_id);
        } else {
          setLinkedEventData([]); // Ensure it's an array
        }
      } catch (err) {
        console.error(
          "Error fetching event data:",
          err.response || err.message || err
        );
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const [freightData2, setFreightData2] = useState();

  const [rank, setRank] = useState(null);
  const [minPrice, setMinPrice] = useState(null);

  // const fetchLinkedEventData = async (linkedEventId) => {
  //   try {
  //     const response = await axios.get(
  //       `https://marathon.lockated.com/rfq/events/${linkedEventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
  //     );

  //     console.log("Linked Event Data Response:", response.data);
  //     setLinkedData(response.data);

  //     let bidData = [];
  //     let freightData2 = [];
  //     let totalGrossAmount = 0;

  //     if (response.data?.bids?.length > 0) {
  //       console.log("Bids found, fetching bid data...");

  //       const bidResponse = await axios.get(
  //         `https://marathon.lockated.com/rfq/events/${linkedEventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
  //       );

  //       console.log("Bid Data Response:", bidResponse.data);

  //       const bids = bidResponse.data.bids;

  //       if (bids.length > 0) {
  //         bidData = bids.flatMap((bid) =>
  //           bid.bid_materials.map((material) => ({
  //             bidId: bid.id,
  //             eventMaterialId: material.event_material_id,
  //             descriptionOfItem: material.material_name,
  //             quantity: material.event_material.quantity,
  //             quantityAvail: material.quantity_available,
  //             price: material.price,
  //             discount: material.discount,
  //             section: material.event_material.material_type,
  //             subSection: material.event_material.inventory_sub_type,
  //             realisedDiscount: material.realised_discount,
  //             gst: material.gst,
  //             realisedGst: material.realised_gst,
  //             total: material.total_amount,
  //             location: material.event_material.location,
  //             vendorRemark: material.vendor_remark,
  //             landedAmount: material.landed_amount,
  //           }))
  //         );

  //         console.log("Mapped Bid Data:", bidData);
  //         setBids(bids); // Store all bids

  //         // Extract Freight & Other Bid Data
  //         const latestBid = bids[0]; // Assuming latest bid is the first one
  //         setRank(latestBid.rank);
  //         setMinPrice(latestBid.min_price);

  //         freightData2 = [
  //           {
  //             label: "Freight Charge",
  //             value: `₹${latestBid.freight_charge_amount}`,
  //           },
  //           {
  //             label: "GST on Freight",
  //             value: `${latestBid.gst_on_freight}%`,
  //           },
  //           {
  //             label: "Realised Freight",
  //             value: `₹${latestBid.realised_freight_charge_amount}`,
  //           },
  //           {
  //             label: "Warranty Clause",
  //             value: latestBid.warranty_clause || "N/A",
  //           },
  //           {
  //             label: "Payment Terms",
  //             value: latestBid.payment_terms || "N/A",
  //           },
  //           {
  //             label: "Loading/Unloading Clause",
  //             value: latestBid.loading_unloading_clause || "N/A",
  //           },
  //         ];

  //         // Set Gross Total from API
  //         totalGrossAmount = latestBid.gross_total || 0;
  //       }
  //     }

  //     // If no bids exist, fallback to event materials
  //     if (bidData.length === 0 && response.data?.event_materials) {
  //       console.log("No bids found, displaying event materials...");

  //       bidData = response.data.event_materials.map((item) => ({
  //         eventMaterialId: item.id,
  //         descriptionOfItem: item.inventory_name,
  //         quantity: item.quantity,
  //         quantityAvail: "",
  //         unit: item.uom,
  //         location: item.location,
  //         rate: item.rate || "",
  //         section: item.material_type,
  //         subSection: item.inventory_sub_type,
  //         amount: item.amount,
  //         totalAmt: "",
  //         attachment: null,
  //         price: "",
  //         discount: "",
  //         gst: "",
  //         landedAmount: "",
  //         vendorRemark: "",
  //         total: "",
  //       }));
  //     }

  //     const uniqueBidData = bidData.filter(
  //       (item, index, self) =>
  //         index ===
  //         self.findIndex((t) => t.eventMaterialId === item.eventMaterialId)
  //     );

  //     console.log("Final Freight Data:", freightData2);
  //     console.log("Final Bid Data:", uniqueBidData);
  //     console.log("Gross Total:", totalGrossAmount);

  //     setLinkedEventData(uniqueBidData);
  //     setFreightData2(freightData2);
  //     setGrossTotal(totalGrossAmount); // Store the gross total
  //   } catch (err) {
  //     console.error("Error fetching linked event data:", err.message);
  //     setLinkedEventData([]);
  //     setFreightData2([]);
  //     setGrossTotal(0);
  //   }
  // };

  const [bids2, setBids2] = useState([]);
  const [grossTotal2, setGrossTotal2] = useState(0);

  const fetchLinkedEventData = async (linkedEventId) => {
    try {
      if (!linkedEventId) {
        console.error("Error: linkedEventId is missing!");
        return;
      }

      console.log("Fetching Linked Event Data for ID:", linkedEventId);

      const response = await axios.get(
        `${baseURL}/rfq/events/${linkedEventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
      );

      console.log("Linked Event Data Response:", response.data);
      setLinkedData(response.data);

      let bidData = [];
      let freightData2 = [];
      let totalGrossAmount = 0;

      // Always make the bids API call (even if bids are missing in first response)
      console.log("Fetching Bid Data...");

      const bidResponse = await axios.get(
        `${baseURL}/rfq/events/${linkedEventId}/bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${vendorId}`
      );

      console.log("Bid Data Response :", bidResponse.data);

      const bids2 = bidResponse.data.bids || [];

      if (bids2.length > 0) {
        console.log("Processing Bids...");

        bidData = bids2.flatMap((bid) =>
          (bid.bid_materials || []).map((material) => ({
            bidId: bid.id,
            eventId: bid.event_id,
            price: bid.price,
            discount: bid.discount,
            warrantyClause: bid.warranty_clause,
            paymentTerms: bid.payment_terms,
            loadingUnloadingClause: bid.loading_unloading_clause,
            freightCharge: bid.freight_charge_amount,
            gstOnFreight: bid.gst_on_freight,
            realisedFreightCharge: bid.realised_freight_charge_amount,
            grossTotal: bid.gross_total,
            bidRemark: bid.remark,
            revisionNumber: bid.revision_number,
            rank: bid.rank,
            bidTotalAmount: bid.bid_total_amount,

            // Material-specific data
            materialId: material.id,
            eventMaterialId: material.event_material_id,
            quantityAvail: material.quantity_available,
            materialName: material.material_name,
            pricePerUnit: material.price,
            materialDiscount: material.discount,
            totalAmount: material.total_amount,
            realisedDiscount: material.realised_discount,
            gst: material.gst,
            realisedGst: material.realised_gst,
            vendorRemark: material.vendor_remark,
            materialType: material.material_type,
            landedAmount: material.landed_amount,
            materialRank: material.rank,
          }))
        );

        console.log("Mapped Bid Data:", bidData);
        setBids2(bids2); // Store all bids

        // Extract Freight & Other Bid Data
        const latestBid = bids2[0]; // Assuming latest bid is the first one
        setRank(latestBid.rank);
        setMinPrice(latestBid.min_price);

        freightData2 = [
          {
            label: "Freight Charge",
            value: `₹${latestBid.freight_charge_amount}`,
          },
          { label: "GST on Freight", value: `${latestBid.gst_on_freight}%` },
          {
            label: "Realised Freight",
            value: `₹${latestBid.realised_freight_charge_amount}`,
          },
          {
            label: "Warranty Clause",
            value: latestBid.warranty_clause || "N/A",
          },
          { label: "Payment Terms", value: latestBid.payment_terms || "N/A" },
          {
            label: "Loading/Unloading Clause",
            value: latestBid.loading_unloading_clause || "N/A",
          },
        ];

        // Set Gross Total from API
        totalGrossAmount = latestBid.gross_total || 0;
      } else {
        console.log("No Bids Found, Displaying Event Materials...");

        // If no bids exist, fallback to event materials
        if (bids2.length === 0 && response.data?.event_materials) {
          bidData = response.data.event_materials.map((item) => ({
            eventMaterialId: item.id,
            descriptionOfItem: item.inventory_name,
            quantity: item.quantity,
            quantityAvail: "",
            unit: item.uom,
            location: item.location,
            rate: item.rate || "",
            section: item.material_type,
            subSection: item.inventory_sub_type,
            amount: item.amount,
            totalAmt: "",
            attachment: null,
            price: "",
            discount: "",
            gst: "",
            landedAmount: "",
            vendorRemark: "",
            total: "",
          }));
        }
      }

      // Ensure bid data has unique items
      const uniqueBidData = bidData.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.eventMaterialId === item.eventMaterialId)
      );

      console.log("Final Freight Data:", freightData2);
      console.log("Final Bid Data:", uniqueBidData);
      console.log("Gross Total:", totalGrossAmount);

      setLinkedEventData(uniqueBidData);
      setFreightData2(freightData2);
      setGrossTotal2(totalGrossAmount);
    } catch (err) {
      console.error("Error fetching linked event data:", err.message);
      setLinkedEventData([]);
      setFreightData2([]);
      setGrossTotal2(0);
    }
  };

  useEffect(() => {
    if (bids2.length > 0 && currentIndex >= 0 && currentIndex < bids2.length) {
      const selectedBid = bids2[currentIndex];

      if (selectedBid?.bid_materials) {
        const bidData = selectedBid.bid_materials.map((material) => ({
          bidId: selectedBid.id,
          eventMaterialId: material.event_material_id,
          descriptionOfItem: material.material_name,
          quantity: material.event_material.quantity,
          quantityAvail: material.quantity_available,
          price: material.price,
          discount: material.discount,
          section: material.event_material.material_type,
          subSection: material.event_material.inventory_sub_type,
          realisedDiscount: material.realised_discount,
          gst: material.gst,
          realisedGst: material.realised_gst,
          total: material.total_amount,
          location: material.event_material.location,
          vendorRemark: material.vendor_remark,
          landedAmount: material.landed_amount,
        }));

        setLinkedEventData(bidData);
      }

      setFreightData2([
        {
          label: "Freight Charge",
          value: `₹${selectedBid.freight_charge_amount}`,
        },
        { label: "GST on Freight", value: `${selectedBid.gst_on_freight}%` },
        {
          label: "Realised Freight",
          value: `₹${selectedBid.realised_freight_charge_amount}`,
        },
        {
          label: "Warranty Clause",
          value: selectedBid.warranty_clause || "N/A",
        },
        { label: "Payment Terms", value: selectedBid.payment_terms || "N/A" },
        {
          label: "Loading/Unloading Clause",
          value: selectedBid.loading_unloading_clause || "N/A",
        },
      ]);

      setGrossTotal2(selectedBid.gross_total || 0);
    }
  }, [currentIndex, bids2]);

  const defaultColumns = [
    { label: "Freight Charge", key: "freightCharge" },
    { label: "GST on Freight", key: "gstOnFreight" },
    { label: "Realised Freight", key: "realisedFreight" },
  ];

  const mergedColumns = [...defaultColumns, ...bidTemplate];

  useEffect(() => {
    console.log("Received Data in Table:", data);
  }, [data]);

  const handleOpenModal = (rowIndex) => {
    if (originalTaxRateDataRef.current.length === 0) {
      const updatedTaxRateData = data.map((selectedRow) => ({
        material: selectedRow.section || "",
        hsnCode: selectedRow.hsnCode || "",
        ratePerNos: selectedRow.price || "",
        totalPoQty: selectedRow.quantityAvail || "",
        discount: selectedRow.discount || "",
        materialCost: selectedRow.price || "",
        discountRate: selectedRow.realisedDiscount || "",
        afterDiscountValue: selectedRow.total || "",
        remark: selectedRow.vendorRemark || "",
        additionalInfo: selectedRow.additionalInfo || "",
        additionTaxCharges: [
          {
            id: 1,
            taxChargeType: "Handling Charges",
            taxChargePerUom: "",
            inclusive: false,
            amount: "",
          },
          {
            id: 2,
            taxChargeType: "Other charges",
            taxChargePerUom: "",
            inclusive: false,
            amount: "",
          },
          {
            id: 3,
            taxChargeType: "Freight",
            taxChargePerUom: "",
            inclusive: false,
            amount: "",
          },
        ],
        deductionTax: [],
        netCost: selectedRow.total || "",
      }));

      // Save this initialized version
      originalTaxRateDataRef.current = structuredClone(updatedTaxRateData);
      setTaxRateData(updatedTaxRateData);
    } else {
      // If already initialized, use previous values
      setTaxRateData(structuredClone(originalTaxRateDataRef.current));
    }

    setTableId(rowIndex);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to add a new addition tax charge row
  const addAdditionTaxCharge = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...taxRateData];
    updatedTaxRateData[rowIndex].additionTaxCharges.push(newItem);
    setTaxRateData(updatedTaxRateData);
  };

  // Function to add a new deduction tax row
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

  // Function to remove a tax charge item
  const removeTaxChargeItem = (rowIndex, id, type) => {
    const updatedTaxRateData = [...taxRateData];
    if (type === "addition") {
      updatedTaxRateData[rowIndex].additionTaxCharges = updatedTaxRateData[
        rowIndex
      ].additionTaxCharges.filter((item) => item.id !== id);
    } else {
      updatedTaxRateData[rowIndex].deductionTax = updatedTaxRateData[
        rowIndex
      ].deductionTax.filter((item) => item.id !== id);
    }
    setTaxRateData(updatedTaxRateData);
  };

  const calculateTaxAmount = (percentage, baseAmount, inclusive) => {
    if (inclusive) return 0; // If inclusive, tax amount should not be calculated

    const parsedPercentage = parseFloat(percentage.replace("%", "")) || 0;
    const parsedBaseAmount = parseFloat(baseAmount) || 0;
    return (parsedPercentage / 100) * parsedBaseAmount;
  };

  const calculateNetCost = (rowIndex, updatedData = taxRateData) => {
    const taxRateRow = updatedData[rowIndex];
    let additionTaxTotal = 0;
    let deductionTaxTotal = 0;
    let directChargesTotal = 0;
  
    taxRateRow.additionTaxCharges.forEach((item) => {
      if (item.inclusive) return;
  
      if (["Handling Charges", "Other charges", "Freight"].includes(item.taxChargeType)) {
        directChargesTotal += parseFloat(item.amount) || 0;
      } else {
        const taxAmount = calculateTaxAmount(item.taxChargePerUom, taxRateRow.afterDiscountValue);
        additionTaxTotal += taxAmount;
      }
    });
  
    taxRateRow.deductionTax.forEach((item) => {
      if (item.inclusive) return;
      const taxAmount = calculateTaxAmount(item.taxChargePerUom, taxRateRow.afterDiscountValue);
      deductionTaxTotal += taxAmount;
    });
  
    const netCost =
      parseFloat(taxRateRow.afterDiscountValue || "0") +
      additionTaxTotal +
      directChargesTotal -
      deductionTaxTotal;
  
    return netCost.toFixed(2);
  };
  

  const calculateGrossTotal = () => {
    const total = data.reduce(
      (acc, item) => Number(acc) + Number(item.total || "0"),
      0
    );
    console.log("Total:", total, data);

    return total.toFixed(2); // Return the total as a string with two decimal places
  };

  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
    const updatedTaxRateData = structuredClone(taxRateData);
    const originalDataClone = structuredClone(originalTaxRateDataRef.current);
  
    const targetRow = updatedTaxRateData[rowIndex];
    const originalRow = originalDataClone[rowIndex];
  
    if (!targetRow || !originalRow) return;
  
    const taxCharges =
      type === "addition"
        ? [...targetRow.additionTaxCharges]
        : [...targetRow.deductionTax];
  
    const chargeIndex = taxCharges.findIndex((item) => item.id === id);
    if (chargeIndex === -1) return;
  
    const charge = { ...taxCharges[chargeIndex] };
  
    // Set updated field value
    charge[field] = field === "amount" ? parseFloat(value) || "" : value;
    console.log("Updated charge:", charge);
  
    const isManualInputAllowed = ["Handling Charges", "Other charges", "Freight"].includes(
      charge.taxChargeType
    );
  
    // 🛠️ Only auto-calculate if not inclusive, not manual, and field is taxChargePerUom
    if (!charge.inclusive && !isManualInputAllowed && field === "taxChargePerUom") {
      const taxAmount = calculateTaxAmount(
        charge.taxChargePerUom,
        targetRow.afterDiscountValue
      );
      charge.amount = taxAmount;
    }
  
    // Replace updated charge back
    taxCharges[chargeIndex] = charge;
  
    if (type === "addition") {
      targetRow.additionTaxCharges = taxCharges;
    } else {
      targetRow.deductionTax = taxCharges;
    }
  
    updatedTaxRateData[rowIndex] = targetRow;
  
    // 🔁 Recalculate net cost for all rows
    const recalculated = updatedTaxRateData.map((row, idx) => ({
      ...row,
      netCost: calculateNetCost(idx, updatedTaxRateData),
    }));
  
    setTaxRateData(recalculated);
    originalTaxRateDataRef.current = structuredClone(recalculated);
  };
  
  
  const handleSaveTaxChanges = () => {
    const updatedData = [...data]; // Create a copy of the data array
    const updatedNetCost = calculateNetCost(tableId);
    updatedData[tableId].total = updatedNetCost; // Update the total for the specific row
    setData(updatedData); // Update the state with the modified data
    const updatedGrossTotal = calculateGrossTotal();
    // setTaxRateData((prevState) => ({
    //   ...prevState,
    //   netCost: updatedNetCost,
    // }));

    setGrossTotal(updatedGrossTotal);
    handleCloseModal();
  };

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          "https://marathon.lockated.com/rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
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

    fetchTaxes();
  }, []);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          "https://marathon.lockated.com/rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
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
              style={{ color: "#8b0203", fontSize: "16px" }}
            >
              Event Overview
            </a>
          </li>

          {data1?.linked_event_id && (
            <li className="nav-item" role="presentation">
              <a
                className="nav-link ps-4 pe-4"
                id="profile-tab2"
                data-bs-toggle="tab"
                href="#profile2"
                role="tab"
                aria-controls="profile2"
                aria-selected="false"
                style={{ color: "#8b0203", fontSize: "16px" }}
              >
                {
                  // @ts-ignore
                  linkedData?.event_title
                }{" "}
                {linkedData?.event_no}
              </a>
            </li>
          )}
          <li class="nav-item" role="presentation">
            <a
              className="nav-link ps-4 pe-4"
              id="profile-tab"
              data-bs-toggle="tab"
              href="#profile"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              style={{ color: "#8b0203", fontSize: "16px" }}
            >
              {data1?.event_title} {data1?.event_no}
            </a>
          </li>

          {isBidCreated && (
            <li className="nav-item" role="presentation">
              <a
                className="nav-link ps-4 pe-4"
                id="participant-tab"
                data-bs-toggle="tab"
                href="#participant"
                role="tab"
                aria-controls="participant"
                aria-selected="false"
                style={{ color: "#8b0203", fontSize: "16px" }}
              >
                Participant Remark
              </a>
            </li>
          )}
        </ul>

        <div class="tab-content " id="myTabContent">
          <div
            className="tab-pane fade"
            id="profile2"
            role="tabpanel"
            aria-labelledby="profile-tab2"
          >
            <div className="main-content">
              <div className="p-3" style={{ overflowX: "auto" }}>
                <div className="card mx-3 p-4 mt-3 pb-4 mb-2">
                  <div className="d-flex flex-row-reverse">
                    <div className="eventList-child1 d-flex align-items-center gap-1 py-3 mx-1">
                      <div className="d-flex align-items-center gap-1">
                        <ClockIcon />
                        <p className="mb-0 eventList-p1">Ends In</p>
                      </div>
                      <span>{timeRemaining}</span>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                    </div>
                  </div>
                  <div className="card p-2 m-1">
                    <div className="card-header4">
                      {linkedData ? (
                        <div className="d-flex justify-content-between">
                          <h4>
                            Submission Sheet
                            <span
                              style={{
                                backgroundColor: "#fff2e8",
                                color: "#8b0203",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                marginLeft: "25px",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                borderColor: "#ffbb96",
                              }}
                            >
                              {linkedData?.event_type_detail?.event_type}
                            </span>
                          </h4>
                          {linkedData?.event_type_detail?.event_type ===
                            "auction" && (
                            <span
                              style={{
                                backgroundColor: "#fff2e8",
                                color: "#8b0203",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                marginLeft: "25px",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                borderColor: "#ffbb96",
                              }}
                            >
                              {linkedData?.event_type_detail
                                ?.event_configuration === "rank_based"
                                ? `rank: ${linkedData?.bids?.[0]?.rank}`
                                : `price: ${linkedData?.bids?.[0]?.min_price}`}
                            </span>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {/* {counterData > 0 && (
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
                    )} */}

                    <div className="card-body">
                      {/* {console.log("Linked Event Data:", linkedEventData)} */}
                      {linkedEventData.length > 0 ? (
                        <div style={tableContainerStyle}>
                          <Table
                            columns={[
                              { label: "Material", key: "descriptionOfItem" },
                              { label: "Material Type", key: "section" },
                              { label: "Material Sub Type", key: "subSection" },
                              { label: "Quantity Requested", key: "quantity" },
                              { label: "Delivery Location", key: "location" },
                              { label: "Brand", key: "brand" },
                              { label: "Delivery Location", key: "location" },
                              { label: "Delivery Location", key: "location" },
                              // {
                              //   label: "Creator Attachment",
                              //   key: "attachment",
                              // },
                              {
                                label: "Quantity Available",
                                key: "quantityAvail",
                              },
                              { label: "Price", key: "price" },
                              { label: "Discount", key: "discount" },
                              { label: "GST", key: "gst" },
                              { label: "Landed Amount", key: "landedAmount" },
                              { label: "Vendor Remark", key: "vendorRemark" },
                              { label: "Total", key: "total" },
                            ]}
                            data={linkedEventData}
                            customRender={{
                              section: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              subSection: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              descriptionOfItem: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              quantity: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              location: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              attachment: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              quantityAvail: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              price: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              discount: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              gst: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              landedAmount: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              vendorRemark: (cell) => (
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                              total: (cell) => (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={cell || ""}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled
                                />
                              ),
                            }}
                          />
                        </div>
                      ) : (
                        <p>No data available</p>
                      )}

                      <div className="d-flex justify-content-end">
                        <ShortTable
                          data={freightData2}
                          editable={false}
                          // readOnly={isReadOnly} //// Flag to enable input fields
                          // onValueChange={handleFreightDataChange} // Callback for changes
                        />
                      </div>

                      <div className="d-flex justify-content-end mt-2 mx-2">
                        <h4>Sum Total: ₹{grossTotal2}</h4>
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
                                fill="rgb(139, 2, 3)"
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
                            {bids2.length > 0 &&
                              bids2.map((_, index) => {
                                // For the first button, show "Current Bid"
                                const buttonName =
                                  index === 0
                                    ? "Current Bid"
                                    : index === bids2.length - 1
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
                                          : "#8b0203",
                                      textAlign: "center",
                                      padding: "10px",
                                      textDecoration: "none",
                                      backgroundColor:
                                        index === currentIndex
                                          ? "#8b0203"
                                          : "white", // Active button color
                                      borderRadius: "4px",
                                      marginRight: "10px",
                                      border: `1px solid #8b0203`,
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
                              <path d="M6 4l12 8l-12 8" fill="rgb(139, 2, 3)" />
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
                </div>
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="participant"
            role="tabpanel"
            aria-labelledby="participant-tab"
          >
            {/* Participant Remark Content */}
            {isBidCreated && (
              <div className="priceTrends-list">
                {/* {remarks.length > 0 ? (
          remarks.map((remarkItem) => ( */}
                <div idclassName="priceTrends-item my-3 d-flex">
                  <div
                    className="item-label rounded-circle bg-light me-2 d-flex justify-content-center align-items-center"
                    style={{ width: "35px", height: "35px" }}
                  >
                    {/* {remarkItem.event_vendor?.full_name?.[0]?.toUpperCase() || "N/A"} */}
                  </div>
                  <div className="priceTrends-list-child go-shadow-k p-3 rounded-2">
                    <p className="eventList-p2 mb-0 fw-bold">
                      {/* {remarkItem.event_vendor?.full_name || "_"} from{" "}
                  {remarkItem.event_vendor?.organization_name || "Unknown"} */}
                    </p>
                    {/* <p className="eventList-p1 mb-0">{remarkItem.remark}</p> */}
                  </div>
                </div>

                <h4 className="h-100 w-100 d-flex justify-content-center align-items-center pt-5">
                  No Participant Remark Details found
                </h4>
              </div>
            )}
          </div>
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
                                        <th className="text-start">
                                          Delivary date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          [{data1.event_no}] {data1.event_title}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.status}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.event_schedule?.start_time ? (
                                            <FormatDate
                                              timestamp={
                                                data1.event_schedule?.start_time
                                              }
                                            />
                                          ) : (
                                            "N/A"
                                          )}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.event_schedule?.end_time ? (
                                            <FormatDate
                                              timestamp={
                                                data1.event_schedule?.end_time
                                              }
                                            />
                                          ) : (
                                            "N/A"
                                          )}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {Delivarydate}
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
                                  {/* {terms.map((term) => (
                                    <li key={term.id} className="mb-3 mt-3">
                                      {term.condition}
                                    </li>
                                  ))} */}
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
                                          // style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.created_by}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.created_by_email}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
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

                        <div
                          className="col-12 pb-4 pt-3 "
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
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
                                          Material Type
                                        </th>
                                        <th className="text-start">
                                          Material Sub Type
                                        </th>
                                        <th className="text-start">
                                          Material Name
                                        </th>
                                        <th className="text-start">Quantity</th>
                                        <th className="text-start">UOM</th>
                                        {/* <th className="text-start">
                                          Material Type
                                        </th> */}
                                        <th className="text-start">Location</th>
                                        <th className="text-start">Rate</th>
                                        <th className="text-start">Amount</th>
                                        <th className="text-start">Brand</th>
                                        <th className="text-start">Colour</th>
                                        <th className="text-start">
                                          Generic Info
                                        </th>
                                        {/* <th className="text-start">
                                          Material Type 
                                        </th>
                                        <th className="text-start">
                                          Material Sub Type
                                        </th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data1.event_materials.map(
                                        (data, index) => (
                                          <tr key={data.id}>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.material_type}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.inventory_sub_type}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.inventory_name}
                                            </td>
                                            {/* <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.material_type}
                                            </td> */}
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.quantity}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.uom}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.location}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.rate}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.amount}
                                            </td>
                                            <td>
                                              {data.brand?.brand_name || "N/A"}
                                            </td>
                                            <td>
                                              {data.colour?.colour || "N/A"}
                                            </td>
                                            <td>
                                              {data.generic_info
                                                ?.generic_info || "N/A"}
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

                        <div className="col-12 pb-4 pt-3">
                          <a
                            className="btn d-flex justify-content-between w-100"
                            data-bs-toggle="collapse"
                            href="#document-attachment"
                            role="button"
                            aria-expanded={documentAttachment}
                            aria-controls="document-attachment"
                            onClick={handleDocumentAttachment}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <div>
                              <span
                                id="document-attachment-icon"
                                className="icon-1"
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
                                {documentAttachment ? (
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
                                Document Attachment
                              </span>
                            </div>
                          </a>

                          {documentAttachment && (
                            <div
                              id="document-attachment"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="card card-body rounded-3 p-4">
                                {/* Document Details Table */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr No</th>
                                        <th className="text-start">
                                          File Name
                                        </th>
                                        <th className="text-start">
                                          Uploaded At
                                        </th>
                                        <th className="text-start">Download</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data1?.attachments?.map(
                                        (attachment, index) => (
                                          <tr key={attachment.id}>
                                            <td className="text-start">
                                              {index + 1}
                                            </td>
                                            <td className="text-start">
                                              {attachment.filename}
                                            </td>
                                            <td className="text-start">
                                              {formattedDate}
                                            </td>
                                            {/* <td className="text-start">
                                              {new Date(
                                                attachment.blob_created_at
                                              ).toLocaleString()}
                                            </td> */}
                                            <td className="text-start">
                                              <a
                                                href={`${baseURL}/rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                                download={attachment.filename}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 16 16"
                                                  style={{ fill: "black" }}
                                                >
                                                  <g fill="currentColor">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                                  </g>
                                                </svg>
                                              </a>
                                            </td>
                                          </tr>
                                        )
                                      ) || (
                                        <tr>
                                          <td
                                            colSpan="5"
                                            className="text-center"
                                          >
                                            No attachments available.
                                          </td>
                                        </tr>
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
                <div className="card mx-3 p-4 mt-3 pb-4 mb-2 ">
                  <div className="d-flex flex-row-reverse">
                    <div className="eventList-child1 d-flex align-items-center gap-1 py-3 mx-1 ">
                      {/* {event.endsIn ? ( */}

                      <div className="d-flex align-items-center gap-1 ">
                        <ClockIcon />
                        <p className="mb-0 eventList-p1">Ends In</p>
                      </div>
                      <span>{timeRemaining}</span>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-hourglass-split"></i>
                        {/* <p className="mb-0 eventList-p1">Bid Approves In</p> */}
                      </div>
                      {/* )} */}
                    </div>
                  </div>
                  <div className="card p-2 m-1">
                    <div className="card-header4">
                      <div className="d-flex justify-content-between">
                        <h4>
                          Submission Sheet.
                          <span
                            style={{
                              backgroundColor: "#fff2e8",
                              color: "#8b0203",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              marginLeft: "25px",
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              borderColor: "#ffbb96",
                            }}
                          >
                            {data1?.event_type_detail?.event_type}
                          </span>
                        </h4>
                        {isBid ||
                        loading ||
                        counterData > 0 ||
                        currentIndex !== 0 ||
                        submitted ? (
                          <></>
                        ) : (
                          data1?.event_type_detail?.event_type ===
                            "auction" && (
                            <span
                              style={{
                                backgroundColor: "#fff2e8",
                                color: "#8b0203",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                marginLeft: "25px",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                borderColor: "#ffbb96",
                              }}
                            >
                              {data1?.event_type_detail?.event_configuration ===
                              "rank_based"
                                ? `Rank: ${bids[0]?.rank ?? "N/A"}`
                                : `Price: ₹${bids[0]?.min_price ?? "N/A"}`}
                            </span>
                          )
                        )}
                      </div>
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
                    )

                    }

                    <div className="card-body">
                      <div style={tableContainerStyle}>
                        {/* {console.log("data", data) */}
                        
                        <Table
                          columns={[
                            { label: "Sr No", key: "srNo" },
                            {
                              label: "Material Name",
                              key: "descriptionOfItem",
                            },
                            { label: "Material Type", key: "section" },
                            { label: "Material Sub Type", key: "subSection" },
                            { label: "UOM", key: "unit" },
                            { label: "Brand", key: "pmsBrand" },
                            { label: "Colour", key: "pmsColour" },
                            { label: "Generic Info", key: "genericInfo" },
                            { label: "Delivery Location", key: "location" },
                            { label: "Quantity Requested", key: "quantity" },
                            { label: "Price *", key: "price" },
                            {
                              label: "Quantity Available *",
                              key: "quantityAvail",
                            },
                            { label: "Discount *", key: "discount" },
                            {
                              label: "Realised Discount",
                              key: "realisedDiscount",
                            },
                            { label: "Landed Amount", key: "landedAmount" },
                            { label: "Total", key: "total" },
                            {
                              label: "Participant Attachment",
                              key: "attachment",
                            },
                            { label: "Vendor Remark", key: "vendorRemark" },
                            { label: "Tax Rate", key: "taxRate" },
                            ...additionalColumns, // Dynamically add extra columns
                          ]}
                          data={data}
                          customRender={{
                            taxRate: (cell, rowIndex) => (
                              <button
                                className="purple-btn2"
                                onClick={() => handleOpenModal(rowIndex)}
                              >
                                <span className="align-text-top">Select</span>
                              </button>
                            ),
                            pmsBrand: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
                              />
                            ),
                            pmsColour: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
                              />
                            ),
                            genericInfo: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
                              />
                            ),
                            descriptionOfItem: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
                              />
                            ),

                            varient: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
                              />
                            ),

                            section: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled
                              />
                            ),

                            subSection: (cell, rowIndex) => (
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
                              <>
                                {/* <SelectBox
                                isDisableFirstOption={true}
                                options={unitMeasure}
                                defaultValue={cell}
                                onChange={(selected) =>
                                  handleUnitChange(selected, rowIndex)
                                }
                                style={otherColumnsStyle} // Other columns are scrollable
                                disabled={isBid}
                                /> */}
                                <p>{cell}</p>
                              </>
                            ),

                            location: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={isBid}
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
                                disabled={isBid}
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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                disabled={isBid}
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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                  disabled={isBid}
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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                      aria-hidden="true"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",
                                      marginEnd: "",
                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
                                />
                              );
                            },

                            total: (cell, rowIndex) => {
                              // console.log("previousData[rowIndex]?.total",previousData[rowIndex]?.total,cell);

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
                                      backgroundColor: "#b45253", // Yellow background
                                      padding: "4px 10px", // Add padding to resemble a badge
                                      borderRadius: "5px",

                                      // color:"#7c2d12",
                                      lineHeight: "1",
                                      color: "white",

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
                                  disabled={isBid}
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
                                disabled={isBid}
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
                                disabled={isBid}
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
                            ...additionalColumns.reduce((acc, col) => {
                              acc[col.key] = (cell, rowIndex) => {
                                const row = data[rowIndex];
                                const extraData = row.extra_data?.[col.key] || {};
                            
                                return (
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={extraData.value || ""}
                                    onChange={(e) => {
                                      const updatedData = [...data];
                            
                                      // Ensure extra_data exists
                                      if (!updatedData[rowIndex].extra_data) {
                                        updatedData[rowIndex].extra_data = {};
                                      }
                            
                                      // Ensure the specific key exists
                                      if (!updatedData[rowIndex].extra_data[col.key]) {
                                        updatedData[rowIndex].extra_data[col.key] = {};
                                      }
                            
                                      // Update the value
                                      updatedData[rowIndex].extra_data[col.key].value = e.target.value;
                            
                                      setData(updatedData);
                                    }}
                                    readOnly={extraData.readonly}
                                    disabled={extraData.readonly}
                                  />
                                );
                              };
                              return acc;
                            }, {})
                            
                          }}
                        />
                      </div>
                      <div className=" d-flex justify-content-end">
                        {/* {console.log(
                          "bidTemplate and frieght",
                          freightData,
                          bidTemplate
                        )} */}
                        <>
                          <ShortDataTable
                            data={bidTemplate}
                            editable={true}
                            onValueChange={handleFreightDataChange}
                          />
                        </>
                      </div>

                      <div className="d-flex justify-content-end mt-2 mx-2">
                        <h4>Sum Total: ₹{grossTotal}</h4>
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
                                fill="rgb(139, 2, 3)"
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
                                          : "#8b0203",
                                      textAlign: "center",
                                      padding: "10px",
                                      textDecoration: "none",
                                      backgroundColor:
                                        index === currentIndex
                                          ? "#8b0203"
                                          : "white", // Active button color
                                      borderRadius: "4px",
                                      marginRight: "10px",
                                      border: `1px solid #8b0203`,
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
                              <path d="M6 4l12 8l-12 8" fill="rgb(139, 2, 3)" />
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

                    <div className=" d-flex justify-content-end">
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
                          <p>Submitting your bid...</p>
                        </div>
                      )}

                      <button
                        onClick={revisedBid ? handleReviseBid : handleSubmit}
                        disabled={
                          isBid ||
                          loading ||
                          counterData > 0 ||
                          currentIndex !== 0 || // Disable if it's not the Current Bid
                          submitted
                        }
                        className={`button ${
                          isBid ||
                          loading ||
                          counterData > 0 ||
                          currentIndex !== 0 ||
                          submitted
                            ? "disabled-btn"
                            : "button-enabled"
                        }`}
                        style={{
                          backgroundColor:
                            isBid ||
                            loading ||
                            counterData > 0 ||
                            currentIndex !== 0 ||
                            submitted
                              ? "#ccc"
                              : "#8b0203",
                          color:
                            isBid ||
                            loading ||
                            counterData > 0 ||
                            currentIndex !== 0 ||
                            submitted
                              ? "#666"
                              : "#fff",
                          border:
                            isBid ||
                            loading ||
                            counterData > 0 ||
                            currentIndex !== 0 ||
                            submitted
                              ? "1px solid #aaa"
                              : "1px solid #8b0203",
                          cursor:
                            isBid ||
                            loading ||
                            counterData > 0 ||
                            currentIndex !== 0 ||
                            submitted
                              ? "not-allowed"
                              : "pointer",
                          padding: "10px 20px",
                          borderRadius: "5px",
                        }}
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
      <ToastContainer />
      <DynamicModalBox
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        title="View Tax & Rate"
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseModal,
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
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.material}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">HSN Code</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.hsnCode}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Rate per Nos<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={taxRateData[tableId]?.ratePerNos}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Total PO Qty</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.totalPoQty}
                  readOnly
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
                  value={taxRateData[tableId]?.discount}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Material Cost</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.materialCost}
                  readOnly
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
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.discountRate}
                  readOnly
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
                  className="form-control bg-light"
                  value={taxRateData[tableId]?.afterDiscountValue}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Remark</label>
                <textarea
                  className="form-control bg-light"
                  rows={3}
                  value={taxRateData[tableId]?.remark}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Additional Info.</label>
                <textarea
                  className="form-control bg-light"
                  rows={3}
                  value={taxRateData[tableId]?.additionalInfo}
                  readOnly
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
                          className="form-control bg-light"
                          value={taxRateData[tableId]?.afterDiscountValue}
                          readOnly
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
                          onClick={() => addAdditionTaxCharge(tableId)}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>

                    {/* Addition Tax & Charges Items */}
                    {taxRateData[tableId]?.additionTaxCharges.map(
                      (item, rowIndex) => (
                        <tr key={`${rowIndex}-${item.id}`}>
                          <td>
                            <SelectBox
                              // label="Tax & Charges"
                              options={taxOptions}
                              defaultValue={item.taxChargeType}
                              onChange={(value) =>
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargeType",
                                  value,
                                  "addition"
                                )
                              }
                              className="custom-select"
                              isDisableFirstOption={true} // Disable the first option (default)
                              disabled={[
                                "Handling Charges",
                                "Other charges",
                                "Freight",
                              ].includes(item.taxChargeType)}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={item.taxChargePerUom}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargePerUom",
                                  e.target.value,
                                  "addition"
                                )
                              }
                              disabled={[
                                "Handling Charges",
                                "Other charges",
                                "Freight",
                              ].includes(item.taxChargeType)}
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
                      )
                    )}

                    <tr>
                      <td>Deduction Tax</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => addDeductionTax(tableId)}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>

                    {taxRateData[tableId]?.deductionTax.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <SelectBox
                            options={deductionTaxOptions}
                            defaultValue={item.taxChargeType}
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
                        <td>
                          <select
                            className="form-select"
                            value={item.taxChargePerUom}
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
                                "deduction" // Pass either "addition" or "deduction"
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
                          className="form-control bg-light"
                          value={taxRateData[tableId]?.netCost}
                          readOnly
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
    </div>
  );
}
