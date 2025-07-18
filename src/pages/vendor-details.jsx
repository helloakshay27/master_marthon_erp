import React, { useState, useEffect, useRef } from "react";
import DynamicModalBox from "../components/base/Modal/DynamicModalBox";
import DropdownCollapseIcon from '../components/common/Icon/DropdownCollapseIcon'
import Header from "../components/Header";
import { Table, ShortTable, SelectBox } from "../components";
import ShortDataTable from "../components/base/Table/ShortDataTable";
import "../styles/mor.css";
import { mumbaiLocations, product, unitMeasure } from "../constant/data";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ClockIcon from "../components/common/Icon/ClockIcon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormatDate from "../components/FormatDate"; // Import the default styles
import { baseURL } from "../confi/apiDomain";
import ChargesDataTable from "../components/base/Table/ChargesDataTable";
import html2pdf from "html2pdf.js";
import {
  auditLogColumns,
  specificationColumns,
  deliveryColumns,
} from "../constant/data";

export default function VendorDetails() {
  // Set the initial bid index to 0 (first bid in the array)
  const location = useLocation();
  const effectRan = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bidIdForCounter, setBidIdForCounter] = useState(0);
  const [bids, setBids] = useState([]); // State to store the bids
  const [isBid, setIsBid] = useState(false);
  const [allBids, setAllBids] = useState([]);
  const [bidDataReady, setBidDataReady] = useState(false); // Optional loading check
  const [submitted, setSubmitted] = useState(false); // Track bid creation status
  const [linkedData, setLinkedData] = useState({});
  const [realisedGstVal, setRealisedGstVal] = useState(0);
  const [tableId, setTableId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [taxRateData, setTaxRateData] = useState([]);
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);
  const [originalTaxRateData, setOriginalTaxRateData] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [matchedTaxNamesArray, setMatchedTaxNamesArray] = useState([]);
  const [matchedParentTaxNamesArray, setMatchedParentTaxNamesArray] = useState([]);
  const [openDeliveryRows, setOpenDeliveryRows] = useState({});
const [openDynamicRows, setOpenDynamicRows] = useState({});
const [openAttachmentsRows, setOpenAttachmentsRows] = useState({});
const [sectionOptions, setSectionOptions] = useState([]); // To store section options
  // const [offerLoading, setOfferLoading] = useState(false);

  const [terms, setTerms] = useState([]); // To store terms and
  const [shortTableData, setShortTableData] = useState({});
  const originalTaxRateDataRef = useRef([]);
  const [extraData, setExtraData] = useState({});
  const [currentExtraData, setCurrentExtraData] = useState({});
  const [isTaxRateDataChanged, setIsTaxRateDataChanged] = useState(false);
  const [grossTotal, setGrossTotal] = useState(0);
  const [deliveryData, setDeliveryData] = useState([]);
  const [deliverySchedule, setDeliverySchedule] = useState(false);
  const [specificationData, setSpecificationData] = useState([]);
  const [specification, setSpecification] = useState(false);
  const [auditLogData, setAuditLogData] = useState([]);
  const [auditLog, setAuditLog] = useState(false);
  const [activityLogAccordion, setActivityLogAccordion] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [activityLogsLoading, setActivityLogsLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10; // Change as needed

  const handledeliverySchedule = () => {
    setDeliverySchedule(!deliverySchedule);
  };
  

  const handleSpecification = () => {
    setSpecification(!specification);
  };

  const handleAuditLog = () => {
    setAuditLog(!auditLog);
  };

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
  const [chargesData, setChargesData] = useState([]);

  useEffect(() => {
    const fetchFreightData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/applied_event_templates?token=${token}`
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
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/applied_event_templates?token=${token}`
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

        // setAdditionalColumns(columns);
        // setBidTemplate(formattedData);
        // console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching additional columns:", error);
      }
    };

    fetchAdditionalColumns();
  }, []);

  const [vendorId, setVendorId] = useState(() => {
    return sessionStorage.getItem("vendorId") || "";
  });

  const handleDownloadPDF = () => {

    setPublishedStages(true);
  setTermss(true);
  setContact(true);
  setLineItems(true);
  setDocumentAttachment(true);
  setOrderConfigOpen(true);
  setOrderDetails(true);
  setAuditLog(true);

    const element = document.querySelector(".print-wrapper");
    const options = {
      margin: 0,
      filename: "vendor-details.pdf",
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "px",
        format: [element.scrollWidth, element.scrollHeight],
        orientation: "portrait",
      },
    };

    html2pdf().set(options).from(element).save();
  };
  // console.log(" vednor idddddddddddddddddd", vendorId);

  const [remark, setRemark] = useState("");

  const [revisedBid, setRevisedBid] = useState(false);

  const [data, setData] = useState([]);
  const [counterData, setCounterData] = useState(0);
  const [counterId, setCounterId] = useState(0);

  const navigate = useNavigate();

   useEffect(() => {
      const fetchSections = async () => {
        const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
            try {
              const response = await axios.get(
                `${baseURL}rfq/events/material_types?token=${token}`
              );
      
              if (response.data && Array.isArray(response.data.inventory_types)) {
                setSectionOptions(
                  response.data.inventory_types.map((section) => ({
                    label: section.name,
                    value: section.value,
                  }))
                );
              } else {
                console.error("Unexpected response structure:", response.data);
              }
            } catch (error) {
              console.error("Error fetching sections:", error);
            }
          };
      fetchSections();
      
        }, []);

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
    const updated = [...data];
    updated[rowIndex][key] = value;

    const price = parseFloat(updated[rowIndex].price) || 0;
    const quantityRequested = parseFloat(updated[rowIndex].quantity) || 0;
    const quantityAvail =
      updated[rowIndex].quantityAvail !== undefined &&
      updated[rowIndex].quantityAvail !== ""
        ? parseFloat(updated[rowIndex].quantityAvail)
        : quantityRequested; // Use quantityRequested as fallback

    const discount = parseFloat(updated[rowIndex].discount) || 0;
    const gst = parseFloat(updated[rowIndex].gst) || 0;

    const total = price * quantityAvail;
    const realisedPrice = price - (price * discount) / 100;
    const realisedDiscount = (total * discount) / 100;
    const landedAmount = total - realisedDiscount;
    const realisedGst = (landedAmount * gst) / 100;
    const finalTotal = landedAmount + realisedGst;

    updated[rowIndex].realisedDiscount = realisedDiscount.toFixed(2);
    updated[rowIndex].realisedPrice = realisedPrice.toFixed(2);
    updated[rowIndex].landedAmount = landedAmount.toFixed(2);
    updated[rowIndex].realisedGst = realisedGst.toFixed(2);
    updated[rowIndex].total = finalTotal.toFixed(2);
    updated[rowIndex].total = finalTotal.toFixed(2);

    setData(updated);
    setGrossTotal(calculateSumTotal());
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

    // console.log("Total before Freight:", totalBeforeFreight);
    // console.log("Total with Freight and GST:", totalWithFreightAndGst);

    return totalWithFreightAndGst;
  };

  const handleFreightDataChange = (updatedFreightData) => {
    setFreightData(updatedFreightData);
    const updatedGrossTotal = calculateSumTotal(updatedFreightData);
    setGrossTotal(parseFloat(updatedGrossTotal));
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
    minWidth: "10px", // Set a fixed minimum width for other columns
    width: "120px", // Allow the other columns to take up available space
  };

  const [loading, setLoading] = useState(true);
  const [showOtherChargesModal, setShowOtherChargesModal] = useState(false);

  const handleOpenOtherChargesModal = () => {
    if (isTaxRateDataChanged) {
      setShowOtherChargesModal(true);
    } else {
      toast.error("Please fill the tax details to fill other charges");
    }
  };
  const handleCloseOtherChargesModal = () => setShowOtherChargesModal(false);
  const [isBidCreated, setIsBidCreated] = useState(false); // Track bid creation status
  const [bidIds, setBidIds] = useState([]);

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
  // Add new function for handling all tax changes
  const [parentTaxRateData, setParentTaxRateData] = useState([]);
  const fromAllUpdateRef = useRef(false); // Track if change came from bulk update

  // Utility: Calculate Tax Amount

  // Utility: Deduplicate TaxChargeType Entries
  const deduplicateTaxCharges = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.taxChargeType)) return false;
      seen.add(item.taxChargeType);
      return true;
    });
  };

  // 🔁 Bulk Update - All Rows
  const handleAllTaxChargeChange = (field, value, type, id) => {
  // Clone the current taxRateData to avoid mutating state directly
  const updatedData = structuredClone(parentTaxRateData);

  // Determine the target key based on the type (addition or deduction)
  const taxKey =
    type === "addition"
      ? "addition_bid_material_tax_details"
      : "deduction_bid_material_tax_details";

  // Find the tax entry in the first row by its ID
  const firstRow = updatedData[0];
  if (!firstRow || !firstRow[taxKey]) return;

  const taxEntryIndex = firstRow[taxKey].findIndex(
    (charge) => charge.id === id
  );
  if (taxEntryIndex === -1) return;

  // Update the specific field for the matching tax entry in the first row
  const taxEntry = firstRow[taxKey][taxEntryIndex];
  if (field === "taxChargeType") {
    taxEntry.taxChargeType = value;

    // Update resource_id and resource_type based on the selected tax option
    const optionsList =
      type === "addition" ? taxOptions : deductionTaxOptions;
    const selected = optionsList.find((opt) => opt.value === value);

    taxEntry.resource_id = selected ? selected.id : null;
    taxEntry.resource_type =
      selected?.type || (type === "addition" ? "TaxCharge" : "TaxCategory");

    // --- Auto-add CGST if SGST is selected, or SGST if CGST is selected ---
    if (type === "addition" && (value === "SGST" || value === "CGST")) {
      const otherType = value === "SGST" ? "CGST" : "SGST";
      const otherExists = firstRow[taxKey].some(
        (charge) => charge.taxChargeType === otherType
      );
      if (!otherExists) {
        const otherOption = taxOptions.find((opt) => opt.value === otherType);
        const samePercentage = taxEntry.taxChargePerUom || "";
        const newRow = {
          id: Date.now().toString() + "_" + otherType.toLowerCase(),
          taxChargeType: otherType,
          taxChargePerUom: samePercentage,
          inclusive: false,
          amount: taxEntry.amount,
          resource_id: otherOption ? otherOption.id : null,
          resource_type: otherOption?.type || "TaxCharge",
        };
        // Add to firstRow
        firstRow[taxKey].push(newRow);
        // Also add to all rows
        updatedData.forEach((row) => {
          if (!row[taxKey]) row[taxKey] = [];
          if (!row[taxKey].some((c) => c.taxChargeType === otherType)) {
            row[taxKey].push({ ...newRow });
          }
        });
      }
    }
  }

  if (field === "taxChargePerUom") {
    taxEntry.taxChargePerUom = value;

    // Recalculate the amount if applicable
    if (!taxEntry.inclusive && firstRow.afterDiscountValue) {
      const amount = calculateTaxAmount(
        value,
        firstRow.afterDiscountValue,
        taxEntry.inclusive
      );
      taxEntry.amount = amount.toFixed(2);
    }

    // --- If SGST or CGST, update the other with the same percentage ---
    if (
      type === "addition" &&
      (taxEntry.taxChargeType === "SGST" || taxEntry.taxChargeType === "CGST")
    ) {
      const otherType = taxEntry.taxChargeType === "SGST" ? "CGST" : "SGST";
      const otherEntry = firstRow[taxKey].find(
        (charge) => charge.taxChargeType === otherType
      );
      if (otherEntry) {
        otherEntry.taxChargePerUom = value;
        if (!otherEntry.inclusive && firstRow.afterDiscountValue) {
          const amount = calculateTaxAmount(
            value,
            firstRow.afterDiscountValue,
            otherEntry.inclusive
          );
          otherEntry.amount = amount.toFixed(2);
        }
      }
      // Update in all rows
      updatedData.forEach((row) => {
        if (!row[taxKey]) row[taxKey] = [];
        const otherRow = row[taxKey].find(
          (charge) => charge.taxChargeType === otherType
        );
        if (otherRow) {
          otherRow.taxChargePerUom = value;
          if (!otherRow.inclusive && row.afterDiscountValue) {
            const amount = calculateTaxAmount(
              value,
              row.afterDiscountValue,
              otherRow.inclusive
            );
            otherRow.amount = amount.toFixed(2);
          }
        }
      });
    }
  }

  if (field === "inclusive") {
    taxEntry.inclusive = value;
  }

  // Apply the updated tax entry to all rows
  updatedData.forEach((row) => {
    if (!row[taxKey]) row[taxKey] = [];

    // Find the tax entry in the current row by its ID
    const rowTaxEntryIndex = row[taxKey].findIndex(
      (charge) => charge.id === id
    );

    if (rowTaxEntryIndex !== -1) {
      // Update the existing tax entry
      row[taxKey][rowTaxEntryIndex] = { ...taxEntry };
    } else {
      // Add the tax entry if it doesn't exist
      row[taxKey].push({ ...taxEntry });
    }

    // Recalculate the net cost for the row
    row.netCost = calculateNetCost(updatedData.indexOf(row), updatedData);
  });

  // Update the state with the modified data
  setTaxRateData(updatedData);
  setParentTaxRateData(updatedData); // If you are maintaining a parent state
  originalTaxRateDataRef.current = structuredClone(updatedData);
};

  // ✏️ Single Row + Charge Update
  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
  if (fromAllUpdateRef.current) {
    fromAllUpdateRef.current = false;
    return;
  }

  const updatedData = structuredClone(taxRateData);
  const targetRow = updatedData[rowIndex];
  if (!targetRow) return;

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
  if (field === "taxChargeType" && type === "addition" && (value === "SGST" || value === "CGST")) {
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

  // Update matched tax names dynamically
  const matchedTax = taxOptions.find(
    (tax) => tax.value === charge.taxChargeType
  );
  if (matchedTax) {
    matchedTaxNamesArray.push(matchedTax?.value);
  }

  setTaxRateData(recalculated);
  originalTaxRateDataRef.current = structuredClone(recalculated);
};

  // Update the modal tax inputs to use new handler for "Apply All"
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      // Step 1: Fetch the initial API to get `revised_bid`
      const initialResponse = await axios.get(
        `${baseURL}/rfq/events/${eventId}/event_materials?token=${token}&page=1&q[event_vendor_id_cont]=${vendorId}`
      );

      const initialData = initialResponse.data;
      const eventMaterials = initialData.event_materials || [];
      const revisedBid = initialData.revised_bid;

      // Step 0: Store the revised bid in state
      setRevisedBid(revisedBid);

      // Step 1: Collect all unique keys from extra_data
      const uniqueAdditionalColumns = new Set();

      eventMaterials.forEach((item) => {
        const extraKeys = Object.keys(item.extra_data || {});
        extraKeys.forEach((key) => {
          uniqueAdditionalColumns.add(key);
        });
      });

      // Step 2: Convert keys to array of { key, label } objects
      const additionalColumns = Array.from(uniqueAdditionalColumns).map(
        (key) => ({
          key,
          label: key
            .replace(/_/g, " ") // Convert snake_case to space
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space in camelCase
            .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize each word
        })
      );

      // Step 3: Set the additional columns in state
      setAdditionalColumns(additionalColumns);

      if (!revisedBid) {
        setAdditionalColumns(additionalColumns);

        const processedData = eventMaterials.map((item) => {
          const flatExtraData = Object.entries(item.extra_data || {}).reduce(
            (acc, [key, valObj]) => {
              acc[key] = valObj?.value || "";
              return acc;
            },
            {}
          );
          const bidMaterial = item.bid_materials?.[0];
          
          // Map the row data
          const rowData = {
            pmsBrand: item.pms_brand_name || "-",
            pmsColour: item.pms_colour_name || "-",
            genericInfo: item.generic_info_name || "-",
            eventMaterialId: item.id || "-",
            descriptionOfItem: item.inventory_name || "-",
            quantity: item.quantity || "-",
            quantityAvail: bidMaterial?.quantity_available || "" || "-", // Placeholder for user input
            unit: item.uom_name || item.unit || item.uom_short_name || item.uom || "-",
            location: item.location || "-",
            rate: item.rate || "" || "-", // Placeholder if rate is not available
            section: item.material_type || "-",
            subSection: item.inventory_sub_type || "-",
            amount: item.amount || "-",
            totalAmt: bidMaterial?.total_amount || "" || "-", // Placeholder for calculated total amount
            attachment: null || "-", // Placeholder for attachment
            varient: item.material_type || "-", // Use extracted material_type
            extra_data: flatExtraData,
            revised_bid: initialResponse.data?.revised_bid, // Placeholder for bid ID
          };

          // Add extra data dynamically to the row
          additionalColumns.forEach((col) => {
            rowData[col.key] = bidMaterial?.extra_data?.[col.key] || ""; // Add extra column data
          });

          return rowData;
        });

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

        const formattedData = Object.entries(extra_data).map(
          ([fieldName, fieldData]) => ({
            label: fieldName || "",
            value: { firstBid: fieldData.value || "", counterBid: "" },
            isRequired: false, // or true, if you have that info elsewhere
            isReadOnly: fieldData.readonly,
            fieldOwner: null, // or fetch from another object if needed
          })
        );
        const formattedCharges = Object.entries(extra_charges).map(
          ([fieldName, fieldData]) => ({
            label: fieldName || "",
            value: fieldData || "",
            isRequired: false, // or true, if you have that info elsewhere
            isReadOnly: fieldData.readonly,
            fieldOwner: null, // or fetch from another object if needed
          })
        );

        setChargesData(formattedCharges);

        setBidTemplate(formattedData);

        setData(processedData);
        console.log("Processed Data:", processedData);
      } else {
        // Step 2: Fetch the bid data if `revised_bid` is true
        const bidResponse = await axios.get(
          `${baseURL}rfq/events/${eventId}/bids?token=${token}&q[event_vendor_pms_supplier_id_in]=${vendorId}`
        );
        setCounterData(
          bidResponse.data?.bids[currentIndex]?.counter_bids.length
        );
        setCounterId(
          bidResponse.data?.bids[currentIndex]?.counter_bids[0]?.id
        );
        console.log("bidResponse.data.bids", bidResponse.data.bids[currentIndex].id);
        if(bidResponse.data?.bids[currentIndex]?.counter_bids.length > 0){
          setBidIdForCounter(bidResponse.data.bids[currentIndex].id);
        }
        setBidIds(bidResponse.data.bids[currentIndex].id);

        // const bids = bidResponse.data.bids;
        const bids = bidResponse.data.bids || [];
        setBids(bids);
        setAllBids(bids);
        setBidDataReady(true); // Indicate data has been fetched

        setGrossTotal(bidResponse.data.bids[currentIndex].gross_total);

        // console.log("bids", bids);

        // Process only the first element of the bids array
        if (bids.length > 0) {
          setCounterData(bids[0]?.counter_bids?.length || 0);
          setCounterId(bids[0]?.counter_bids?.[0]?.id || "");
          setBidIds(bids.map((b) => b.id));
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
  }, [eventId]);

  useEffect(() => {
    if (!bidDataReady || allBids.length === 0) return;

    const bid = allBids[currentIndex];
    if (!bid) return;

    const counterBid = bid.counter_bids?.[0];

    setCounterData(bid.counter_bids?.length || 0);
    setCounterId(counterBid?.id || "");
    if(bid?.counter_bids.length > 0){
          // console.log("njnj", bid)
          setBidIdForCounter(bid?.id);
          // console.log("bidIdForCounter", bidIdForCounter);
        }
    setGrossTotal(bid.gross_total || "");

    // Process freightData
    const freightData = [
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
    setFreightData(freightData);

    const firstMaterial = bid.bid_materials[0];
    setExtraData({
      additionTaxCharges: firstMaterial?.extra?.addition_tax_charges || [],
      deductionTax: firstMaterial?.extra?.deduction_tax || [],
    });

    const formattedData = Object.entries(bid.extra_data || {}).map(
      ([fieldName, fieldData]) => ({
        label: fieldName,
        value: { firstBid: fieldData.value || "", counterBid: "" },
        isRequired: false,
        isReadOnly: fieldData.readonly,
        fieldOwner: null,
      })
    );
    setBidTemplate(formattedData);

    // Charges Data
    setChargesData(bid.charges_with_taxes || []);

    // PreviousData (first bid materials)
    const previousData = bid.bid_materials.map((material) => ({
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
      unit:
        material.event_material.uom_name ||
        material.event_material.uom ||
        material.event_material.unit,
      location: material.event_material.location,
      vendorRemark: material.vendor_remark,
      landedAmount: material.landed_amount,
      pmsBrand: material.event_material.pms_brand_name,
      pmsColour: material.event_material.pms_colour_name,
      genericInfo: material.event_material.generic_info_name,
      extra_data: material.extra_data || {},
      newField: formattedData || "",
      addition_bid_material_tax_details:
        material.addition_bid_material_tax_details,
      deduction_bid_material_tax_details:
        material.deduction_bid_material_tax_details,
    }));
    setPreviousData(previousData);

    // UpdatedData (counter bid materials)
    const updatedData = bid.bid_materials
      .map((material) => {
        const counterMaterial = material.counter_bid_materials?.[currentIndex];
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
              unit: material.unit,
              total: counterMaterial.total_amount,
              location: material.event_material.location,
              vendorRemark: counterMaterial.vendor_remark,
              landedAmount: counterMaterial.landed_amount,
              pmsBrand: material.pms_brand_name,
              pmsColour: material.pms_colour_name,
              genericInfo: material.generic_info_name,
              extra_data: material.event_material.extra_data || {},
              deduction_bid_material_tax_details:
                counterMaterial.deduction_bid_material_tax_details,
              addition_bid_material_tax_details:
                counterMaterial.addition_bid_material_tax_details,
            }
          : null;
      })
      .filter(Boolean);
    setUpdatedData(updatedData);

    // Set final data
    setData(updatedData.length > 0 ? updatedData : previousData);
  }, [currentIndex, allBids, bidDataReady]); // ✅ Reacts only to index change, uses local data

  // // Effect to update data when currentIndex changes
  // useEffect(() => {
    // if (bids.length > 0) {
  //     updateDataForCurrentIndex(bids, currentIndex);
  //   }
  // }, [currentIndex, bids]);

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
    // console.log("taxRateData", taxRateData);

    const bidMaterialsAttributes = data.map((row, index) => {
      const rowTotal =
        parseFloat(row.price || 0) * (row.quantityAvail || row.quantity || 0);
      const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100);
      const landedAmount = rowTotal - discountAmount;
      const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100);
      const finalTotal = landedAmount + gstAmount;
      const totalAmt = row.total || 0;
      console.log(taxRateData, "taxRateData");

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

      const extraFields = Object.keys(row.extra_data || {}).reduce(
        (acc, key) => {
          const field = row.extra_data[key];
          acc[key] =
            typeof field === "object" && field !== null
              ? field.value || ""
              : field || "";
          return acc;
        },
        {}
      );

      return {
        event_material_id: row.eventMaterialId,
        quantity_available: row.quantityAvail || row.quantity || 0,
        price: Number(row.price || 0),
        discount: Number(row.discount || 0),
        bid_material_id: row.id,
        vendor_remark: row.vendorRemark || "",
        realised_discount: discountAmount.toFixed(2),
        landed_amount: landedAmount.toFixed(2),
        total_amount: Number(totalAmt).toFixed(2),
        bid_material_tax_details: taxDetails,
        addition_tax_charges: (
          taxRateData[index]?.additionTaxCharges || []
        ).map((charge) => ({
          // id: isNaN(Number(charge.id)) ? null : charge.id,
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

        ...additionalColumns.reduce((acc, col) => {
          acc[col.key] = row[col.key] || "";
          return acc;
        }, {}),

        ...extraFields,
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

    console.log(chargesData, "chargesData");

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

    // const mappedBidMaterials = bid.bid_materials_attributes.map((material) => {
    //   const mappedTaxDetails = material.addition_tax_charges.map((charge) => {
    //     const matchedTax = dropdownData.find(
    //       (tax) => tax.name === charge.taxChargeType
    //     );

    //     return {
    //       resource_id: matchedTax?.id || charge.id,
    //       inclusive: charge.inclusive,
    //       resource_type: matchedTax?.type || "TaxCharge",
    //       amount: charge.amount,
    //       addition: true,
    //     };
    //   });

    //   return {
    //     ...material,
    //     bid_material_tax_details: mappedTaxDetails,
    //   };
    // });

    // console.log("mappedBidMaterials", mappedBidMaterials);

    const payload = {
      bid: {
        event_vendor_id: vendorId,
        freight_charge_amount: freightCharge21,
        gst_on_freight: gstOnFreightt,
        realised_freight_charge_amount: realisedFreightChargeAmount,
        gross_total: grossTotal,
        // loading_unloading_clause: loadingUnloadingClause,
        remark: remark,
        bid_materials_attributes: bidMaterialsAttributes,
        charges: extractChargeTableData,
        ...extractShortTableData,
      },
    };
    console.log("extractChargeTableData:---", extractChargeTableData);

    // console.log("Prepared Payload:", payload);
    return payload;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);
    const payload = preparePayload();
    console.log("payload:---", payload);
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      // Send POST request
      // Validate mandatory fields
      // if (!validateMandatoryFields() || !validateTableData()) {
      //   setLoading(false);
      //   return; // Stop further execution if validation fails
      // }
      const payload = preparePayload();
      // console.log("payload:---", payload);
      const response = await axios.post(
        `${baseURL}rfq/events/${eventId}/bids?token=${token}&event_vendor_id=${vendorId}`, // Replace with your API endpoint
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your auth token
          },
        }
      );
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
          `/vendor-list?token=${token}`
        );
      }, 1000);
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error(
      !vendorId || vendorId === "" || vendorId === "null" || vendorId === "undefined"
        ? "No vendor has been selected."
        : "Failed to create bid. Please try again.",
      {
        autoClose: 1000,
      }
    );
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  // console.log("Bid Created:", isBidCreated); // Debugging state

  const handleReviseBid = async () => {
    setLoading(true);
    setSubmitted(true);

    // Check for vendorId before proceeding
  if (!vendorId || vendorId === "" || vendorId === "null" || vendorId === "undefined") {
    toast.error("No vendor has been selected.", {
      autoClose: 1000,
    });
    setLoading(false);
    setSubmitted(false);
    return;
  }

    const userConfirmed = window.confirm(
      "Are you sure you want to revise this bid?"
    );

    if (!userConfirmed) {
      setLoading(false);
      setSubmitted(false);
      return;
    }
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

    try {
      const revisedBidMaterials = data.map((row, index) => {
        // console.log("data of map on bid attributes", row);

        const rowTotal = parseFloat(row.price || 0) * (row.quantityAvail || 0);
        const discountAmount = rowTotal * (parseFloat(row.discount || 0) / 100);
        const landedAmount = rowTotal - discountAmount;
        const gstAmount = landedAmount * (parseFloat(row.gst || 0) / 100);
        const finalTotal = landedAmount + gstAmount;

        const fullTaxRow = originalTaxRateDataRef.current[index];
        const taxDetails = [
          ...(fullTaxRow?.addition_bid_material_tax_details || []).map(
            (charge) => {
              const matchedTax = taxOptions.find(
                (tax) => tax.id === charge.resource_id
              );
              return {
                resource_id: matchedTax?.id || null,
                resource_type: matchedTax?.taxChargeType || "",
                amount: parseFloat(charge.amount || 0), // ensure clean amount
                inclusive: charge.inclusive,
                addition: true,
                tax_percentage: charge.taxChargePerUom,
              };
            }
          ),

          ...(fullTaxRow?.deduction_bid_material_tax_details || []).map(
            (charge) => {
              const matchedTax = deductionTaxOptions.find(
                (tax) =>
                  // tax.value?.trim().toLowerCase() ===
                  // charge.taxChargeType?.trim().toLowerCase()
                  tax.id === charge.resource_id
              );

              return {
                resource_id: matchedTax?.id || null,
                resource_type: matchedTax?.taxChargeType || "TaxCategory",
                amount: parseFloat(charge.amount || 0),
                inclusive: charge.inclusive,
                addition: false,
                tax_percentage: charge.taxChargePerUom,
              };
            }
          ),
        ];

        const extraFields = Object.keys(row.extra_data || {}).reduce(
          (acc, key) => {
            acc[key] = row.extra_data[key]?.value || "";
            return acc;
          },
          {}
        );

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
          bid_material_tax_details: taxDetails, // ✅ all charges, whether edited or not
          ...extraFields,
        };
      });

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
        if (!(key in extractShortTableData) || !extractShortTableData[key]) {
          extractShortTableData[key] =
            bidTemplate?.find((item) => item.label === key)?.value?.firstBid ||
            "_";
        }
      });

      const extractChargeTableData = Array.isArray(chargesData)
        ? chargesData.slice(0, 3).map((charge) => ({
            // Limit to first 3 elements
            charge_id: charge.charge_id,
            amount: charge.amount,
            realised_amount: charge.realised_amount,
            taxes_and_charges: charge.taxes_and_charges?.map((tax) => ({
              resource_id: tax.resource_id,
              resource_type: tax.resource_type,
              amount: tax.amount,
              inclusive: tax.inclusive || false,
              addition: tax.addition,
              percentage: tax.percentage,
            })),
          }))
        : [];

      const payload = {
        revised_bid: {
          event_vendor_id: vendorId,
          price: 500.0,
          discount: 10.0,
          freight_charge_amount: 0,
          gst_on_freight: 0,
          realised_freight_charge_amount: 0,
          gross_total: grossTotal,
          remark: remark,
          revised_bid_materials_attributes: revisedBidMaterials,
          charges: extractChargeTableData,
          ...extractShortTableData,
        },
      };

      console.log(
        "Prepared Payload for Revision:",
        payload,
        extractChargeTableData
      );

      const response = await axios.post(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIds}/revised_bids?token=${token}&event_vendor_id=${vendorId}`,
        payload
      );

      toast.success("Bid revised successfully!", {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate(
          `/vendor-list?token=${token}` // Redirect to vendor list after successful revision
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

  useEffect(() => {
    if (showModal && taxRateData[tableId]) {
      // console.log("Modal Data Updated:", taxRateData[tableId]);
    }
  }, [showModal, taxRateData, tableId]);

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
  const [orderConfig, setOrderConfig] = useState([]); // always array
const [orderConfigOpen, setOrderConfigOpen] = useState(false); // for collapse
  const [orderDetails, setOrderDetails] = useState(true);
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
  const handleOrderConfig = () => {
  setOrderConfigOpen((prev) => !prev);
};
  const handleOrderDetails = () => {
    setOrderDetails(!orderDetails);
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    navigate(
      `/vendor-list?token=${token}`
    ); // Redirect to /vendor-list page
  };

  const handleDecline = async () => {
    setLoading(true);
    const payload = { status: "rejected" };
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const response = await fetch(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIdForCounter}/counter_bids/${counterId}/update_status?token=${token}`,
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
          `${baseURL}/rfq/events/${eventId}/bids?token=${token}&q[event_vendor_pms_supplier_id_in]=${vendorId}`
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
    } finally{
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    const payload = { status: "accepted" };

    // console.log("Payload being sent:", payload);
    console.log("Event ID:", eventId, "Bid IDs:", bidIds, "Counter ID:", counterId);
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      // API call to update status
      const response = await fetch(
        `${baseURL}/rfq/events/${eventId}/bids/${bidIdForCounter}/counter_bids/${counterId}/update_status?token=${token}`,
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
          `${baseURL}/rfq/events/${eventId}/bids?token=${token}&q[event_vendor_pms_supplier_id_in]=${vendorId}`
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
    } finally {
      setLoading(false);
    }
  };

  const [linkedEventData, setLinkedEventData] = useState([]);

  // useEffect(() => {
  //   const fetchTerms = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${baseURL}/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
  //         `${baseURL}/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
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
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}/rfq/events/${eventId}?token=${token}&page=1`
        );

        const data = response.data;

        setData1(data);

        const startTime = new Date(data?.event_schedule?.start_time);
        const endTime = new Date(data?.event_schedule?.end_time);

        const calculateOrderDuration = (start, end) => {
          if (!start || !end) return "_";
          const durationMs = end - start;
          const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          return `${days} Days ${hours} Hours ${minutes} Minutes`;
        };

        let newOrderConfig = [
          {
            label: "Order Type",
            value: data?.event_type_detail?.event_type || "_",
          },
          {
            label: "Order Mode",
            value: data?.event_type_detail?.award_scheme || "_",
          },
          {
            label: "Started at",
            value: startTime.toLocaleString() || "_",
          },
          {
            label: "Ended at",
            value: endTime.toLocaleString() || "_",
          },
          {
            label: "Order Duration",
            value: calculateOrderDuration(startTime, endTime),
          },
          {
            label: "Evaluation Time",
            value: data?.event_schedule?.evaluation_time || "_",
          },
        ];
        setOrderConfig(newOrderConfig);
        setDeliveryData(data?.delivery_schedules || "_");
        setSpecificationData(data?.mor_inventory_specifications);
        const sanitizedStatusLogs = data?.status_logs?.map((log) => {
          return Object.fromEntries(
            Object.entries(log).map(([key, value]) => [
              key,
              value === null ? "-" : value,
            ])
          );
        });
        setAuditLogData(sanitizedStatusLogs);
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

  const [bids2, setBids2] = useState([]);
  const [grossTotal2, setGrossTotal2] = useState(0);

  const fetchLinkedEventData = async (linkedEventId) => {
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      if (!linkedEventId) {
        console.error("Error: linkedEventId is missing!");
        return;
      }

      const response = await axios.get(
        `${baseURL}/rfq/events/${linkedEventId}?token=${token}&page=1`
      );

      setLinkedData(response.data);

      let bidData = [];
      let freightData2 = [];
      let totalGrossAmount = 0;

      const bidResponse = await axios.get(
        `${baseURL}/rfq/events/${linkedEventId}/bids?token=${token}&q[event_vendor_pms_supplier_id_in]=${vendorId}`
      );

      const bids2 = bidResponse.data.bids || [];

      if (bids2.length > 0) {
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
            value: latestBid.warranty_clause || "-",
          },
          { label: "Payment Terms", value: latestBid.payment_terms || "-" },
          {
            label: "Loading/Unloading Clause",
            value: latestBid.loading_unloading_clause || "-",
          },
        ];

        // Set Gross Total from API
        totalGrossAmount = latestBid.gross_total || 0;
      } else {
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
          value: selectedBid.warranty_clause || "-",
        },
        { label: "Payment Terms", value: selectedBid.payment_terms || "-" },
        {
          label: "Loading/Unloading Clause",
          value: selectedBid.loading_unloading_clause || "-",
        },
      ]);

      setGrossTotal2(selectedBid.gross_total || 0);
    }
  }, [currentIndex, bids2]);

  const defaultColumns = [
    { label: "Freight Charge", key: "freightCharge" },
    { label: "GST on Freight", key: "gstOnFreight" },
    { label: "Realised Freight", key: "realisedFreight" },
    {
      label: "Realised Price",
      key: "realisedPrice",
      realisedPrice: (cell, rowIndex) => {
        const price = parseFloat(data[rowIndex]?.price) || 0;
        const discount = parseFloat(data[rowIndex]?.discount) || 0;

        // Calculate the realized discount amount
        const realisedDiscountAmount = price - (price * discount) / 100;

        return (
          <input
            className="form-control"
            type="number"
            min="0"
            value={realisedDiscountAmount.toFixed(2)} // Show the calculated value
            readOnly
            style={otherColumnsStyle}
            disabled
          />
        );
      },
    },
  ];

  const mergedColumns = [...defaultColumns, ...bidTemplate];

useEffect(() => {
  if (data.length > 0) {
    // Map through `data` to calculate updated tax rate data
    const updatedTaxRateData = data.map((selectedRow, index) => {
      const existingRow = taxRateData[index] || {};
      const quantityAvail =
        parseFloat(selectedRow.quantityAvail || 0) > 0
          ? parseFloat(selectedRow.quantityAvail)
          : parseFloat(selectedRow.quantity || 0);

      const price = parseFloat(selectedRow.price || 0);
      const discount = parseFloat(selectedRow.discount || 0);
      const total = price * quantityAvail;
      const discountAmount = (total * discount) / 100;
      const afterDiscountValue = total - discountAmount;

      // Calculate addition and deduction tax details
      const additionTaxDetails = (
        taxRateData[index]?.addition_bid_material_tax_details ||
        selectedRow.addition_bid_material_tax_details ||
        []
      ).map((tax) => {
        const taxPercentage = parseFloat(tax.taxChargePerUom || 0);
        const amount = tax.inclusive
          ? 0
          : ((taxPercentage / 100) * afterDiscountValue).toFixed(2);
        return { ...tax, amount };
      });

      const deductionTaxDetails = (
        taxRateData[index]?.deduction_bid_material_tax_details ||
        selectedRow.deduction_bid_material_tax_details ||
        []
      ).map((tax) => {
        const taxPercentage = parseFloat(tax.taxChargePerUom || 0);
        const amount = tax.inclusive
          ? 0
          : ((taxPercentage / 100) * afterDiscountValue).toFixed(2);
        return { ...tax, amount };
      });

      const additionTaxTotal = additionTaxDetails.reduce(
        (sum, tax) => sum + parseFloat(tax.amount || 0),
        0
      );
      const deductionTaxTotal = deductionTaxDetails.reduce(
        (sum, tax) => sum + parseFloat(tax.amount || 0),
        0
      );
      const netCost = afterDiscountValue + additionTaxTotal - deductionTaxTotal;

      return {
        ...existingRow,
        material: selectedRow.section || "",
        ratePerNos: selectedRow.price || "",
        totalPoQty: quantityAvail.toString(),
        discount: selectedRow.discount || "",
        materialCost: selectedRow.price || "",
        discountRate: discountAmount.toFixed(2),
        afterDiscountValue: afterDiscountValue.toFixed(2),
        remark: selectedRow.vendorRemark || "",
        addition_bid_material_tax_details: additionTaxDetails,
        deduction_bid_material_tax_details: deductionTaxDetails,
        netCost: netCost.toFixed(2),
      };
    });

    // Update `taxRateData` state
    setTaxRateData((prevTaxRateData) => {
      // Only update if there are changes
      if (JSON.stringify(prevTaxRateData) !== JSON.stringify(updatedTaxRateData)) {
        return updatedTaxRateData;
      }
      return prevTaxRateData;
    });

    // Store the original tax rate data for reference
    originalTaxRateDataRef.current = structuredClone(updatedTaxRateData);
  }
}, [data, taxRateData]);

  const handleOpenModal = (rowIndex) => {
    if (taxRateData.length === 0) {
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
        addition_bid_material_tax_details:
          selectedRow?.addition_bid_material_tax_details || [],
        deduction_bid_material_tax_details:
          selectedRow?.deduction_bid_material_tax_details || [],
        netCost: selectedRow.total || "",
      }));

      originalTaxRateDataRef.current = structuredClone(updatedTaxRateData);
      setTaxRateData(updatedTaxRateData);
    } else {
      // console.log("Updated Tax Rate Data:", originalTaxRateDataRef.current);
      setTaxRateData(structuredClone(originalTaxRateDataRef.current));
    }

    setTableId(rowIndex);
    setShowModal(true);
  };

  const handleSaveAllTaxChanges = () => {
    const updatedData = [...data];

    // Apply tax changes to all items
    data.forEach((_, index) => {
      const updatedNetCost = calculateNetCost(index, taxRateData);
      updatedData[index].total = updatedNetCost;
    });
    // console.log("Updated Data:", updatedData);

    setData(updatedData);
    const updatedGrossTotal = calculateGrossTotal();
    setGrossTotal(parseFloat(updatedGrossTotal));
    handleCloseModal1();
  };

  const handleAllTaxModal = () => {
    // Initialize tax data for all items if not already done
    if (parentTaxRateData?.length === 0) {
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
        addition_bid_material_tax_details:
          selectedRow?.addition_bid_material_tax_details || [],
        deduction_bid_material_tax_details:
          selectedRow?.deduction_bid_material_tax_details || [],
        netCost: selectedRow.total || "",
      }));

      originalTaxRateDataRef.current = structuredClone(updatedTaxRateData);
      setTaxRateData(updatedTaxRateData);
      setParentTaxRateData(updatedTaxRateData);
    } else {
      setTaxRateData(structuredClone(parentTaxRateData));
      setParentTaxRateData(structuredClone(parentTaxRateData));
    }

    setShowModal1(true);
    setIsTaxRateDataChanged(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModal1 = () => {
    setShowModal1(false);
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
    updatedTaxRateData[rowIndex]?.addition_bid_material_tax_details?.push(
      newItem
    );
    setTaxRateData(updatedTaxRateData);
    setParentTaxRateData(updatedTaxRateData);
    console.log("Updated Tax Rate Data:", updatedTaxRateData);
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

  // Function to remove a tax charge item
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

  // console.log("taxRateData :------", taxRateData);

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

  // useEffect(() => {
  //     const updatedNetCost = calculateNetCost(tableId);
  //   },[taxRateData])

  const calculateGrossTotal = () => {
    const total = data.reduce((acc, item) => {
      const itemTotal = parseFloat(item.total) || 0; // Ensure valid number
      return acc + itemTotal;
    }, 0);

    return total.toFixed(2); // Return the total as a string with two decimal places
  };
  const handleSaveTaxChanges = () => {
    const updatedData = [...data];

    // Update the net cost for the specific tableId (row index)
    const updatedNetCost = calculateNetCost(tableId);
    updatedData[tableId].total = updatedNetCost;

    // Update the data state with the modified row
    setData(updatedData);

    // Recalculate the gross total after the specific update
    const updatedGrossTotal = calculateGrossTotal();
    setGrossTotal(parseFloat(updatedGrossTotal));

    handleCloseModal();
    setIsTaxRateDataChanged(true);

    // console.log(
    //   "Tax Rate Data:",
    //   taxRateData,
    //   "Table ID:",
    //   tableId,
    //   updatedGrossTotal
    // );
  };

  const handleSaveALlTaxChanges = () => {
    const updatedGrossTotal = calculateGrossTotal();
    // setTaxRateData((prevState) => ({
    //   ...prevState,
    //   netCost: updatedNetCost,
    // }));

    setGrossTotal(parseFloat(updatedGrossTotal));
    handleCloseModal();
  };

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

    fetchTaxes();
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

    async function fetchTaxPercentages() {
    try {
      const res = await fetch(
        `${baseURL}/rfq/events/tax_percentage?token=${token}`
      );
      const data = await res.json();
      setTaxPercentageOptions(data);
    } catch (err) {
      setTaxPercentageOptions([]);
    }
  }
  fetchTaxPercentages();

    fetchTaxes();
  }, []);

  // useEffect(() => {
  //   console.log(
  //     "parent",
  //     parentTaxRateData[tableId]?.addition_bid_material_tax_details.resource_id,
  //     taxRateData[tableId]?.addition_bid_material_tax_details.resource_id
  //   );
  // }, [parentTaxRateData, taxRateData]);

  const additionBidMaterialTaxDetails =
    parentTaxRateData[tableId]?.addition_bid_material_tax_details || [];

  const matchedTaxNames = additionBidMaterialTaxDetails
    .map((item) => {
      const matchedTax = taxOptions.find((tax) => tax.id === item.resource_id);
      // console.log("matchedTax", matchedTax, taxOptions, item.resource_id);
      if (
        matchedTax &&
        !matchedParentTaxNamesArray.includes(matchedTax.value) &&
        matchedTax.value !== ""
      ) {
        matchedParentTaxNamesArray.push(matchedTax.value);
      }
      return matchedTax ? matchedTax.value : null;
    })
    .filter((name) => name !== null);

  // Get the addition bid material tax details
  const singleAdditionBidMaterialTaxDetails =
    taxRateData[tableId]?.addition_bid_material_tax_details || [];

  // Dynamically compute singleMatchedTaxNames without using state
  const singleMatchedTaxNames = singleAdditionBidMaterialTaxDetails
    .map((item) => {
      const matchedTax = taxOptions.find((tax) => tax.id === item.resource_id);
      // console.log("matchedTax", matchedTax, taxOptions, item.resource_id);

      // Push the matched tax name into the external array if it exists
      if (
        matchedTax &&
        !matchedTaxNamesArray.includes(matchedTax.value) &&
        matchedTax.value !== ""
      ) {
        matchedTaxNamesArray.push(matchedTax.value);
      }

      return matchedTax ? matchedTax.value : null;
    })
    .filter((name) => name !== null);

    

// Calculate total pages
const totalPages = Math.ceil(data.length / pageSize);

// Get current page data
const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

// Generate page numbers (show up to 5 pages for better UX)
const getPageNumbers = () => {
  const maxPagesToShow = 5;
  let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let end = Math.min(totalPages, start + maxPagesToShow - 1);
  if (end - start < maxPagesToShow - 1) {
    start = Math.max(1, end - maxPagesToShow + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
const pageNumbers = getPageNumbers();

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages || page === currentPage) return;
  setCurrentPage(page);
};

const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

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
                      <div className="d-flex justify-content-between align-items-center mx-3  p-3 rounded-3">
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
                        <div>
                          <Table
                            columns={[
                              { label: "Material", key: "descriptionOfItem" },
                              { label: "Material Type", key: "section" },
                              { label: "Material Sub Type", key: "subSection" },
                              { label: "Quantity Requested", key: "quantity" },
                              {
                                label: "Quantity Available",
                                key: "quantityAvail",
                              },
                              { label: "Delivery Location", key: "location" },
                              { label: "Brand", key: "brand" },
                              { label: "Delivery Location", key: "location" },
                              { label: "Delivery Location", key: "location" },
                              // {
                              //   label: "Creator Attachment",
                              //   key: "attachment",
                              // },
                              { label: "Price", key: "price" },
                              { label: "Discount %", key: "discount" },
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
                        <h4>Sum Total: ₹{Number(grossTotal2).toFixed(2)}</h4>
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
                    {/* {remarkItem.event_vendor?.full_name?.[0]?.toUpperCase() || "-"} */}
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
                <>
                <div className="w-100 container-fluid print-wrapper">
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
                                      {/* {console.log(data1.event_schedule)} */}
                                      <tr>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          [{data1.event_no}] {data1.event_title}
                                        </td>
                                        <td
                                          className="text-start"
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.status}
                                        </td>
                                        <td className="text-start">
                                          {data1.event_schedule?.start_time
                                            ? new Date(
                                                data1.event_schedule.start_time
                                              ).toLocaleString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })
                                            : "-"}
                                        </td>
                                        <td className="text-start">
                                          {data1.event_schedule?.end_time
                                            ? new Date(
                                                data1.event_schedule.end_time
                                              ).toLocaleString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })
                                            : "-"}
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
                                        {/* <th className="text-start">Sr.No.</th> */}
                                        <th className="text-start">
                                          Buyer Name
                                        </th>
                                        <th className="text-start">Email</th>
                                        <th className="text-start">Phone</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        {/* <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          1
                                        </td> */}
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
                                Material Sheet
                              </span>
                            </div>
                          </a>
                          {lineItems && (
                            <div
                              id="savings-summary"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="">
  {data1?.grouped_event_materials &&
  Object.entries(data1.grouped_event_materials).map(
    ([materialType, groups], typeIdx) => {
      // Flatten all materials for this materialType
      const materialsArr = Object.values(groups).flat();
      if (!materialsArr.length) return null;
      const rowKey = `${materialType}_${typeIdx}`;
      return (
        <div
          key={rowKey}
          className="mb-4 card card-body rounded-3 p-0"
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            marginBottom: "24px",
            background: "#fff",
          }}
        >
          {/* Header with Material Type and SelectBox */}
          <div
            className="card-header3"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "16px 0 8px 5px",
            }}
          >
            <h3
              className="card-title"
              style={{ fontWeight: 500, fontSize: "16px" }}
            >
              Material Type {typeIdx + 1} of {Object.keys(data1.grouped_event_materials).length}
            </h3>
            <SelectBox
              label={"Select Material Type"}
              options={sectionOptions}
              defaultValue={
                sectionOptions.find(
                  (option) => option.label === materialType
                )?.value
              }
              disabled={true}
              style={{
                minWidth: 180,
                padding: "0 20px",
                borderRadius: 4,
                marginTop: "48px",
              }}
            />
          </div>
          {/* Table for all materials of this type */}
          <div className="p-4 pt-0">
            <Table
              columns={[
                { key: "srNo", label: "Sr.No." },
                { key: "material_type", label: "Material Type" },
                { key: "inventory_sub_type", label: "Material Sub Type"},
                { key: "inventory_name", label: "Material Name" },
                { key: "quantity", label: "Quantity" },
                { key: "uom", label: "UOM" },
                { key: "location", label: "Location" },
                { key: "rate", label: "Rate" },
                { key: "amount", label: "Amount" },
                { key: "pms_brand_name", label: "Brand" },
                { key: "pms_colour_name", label: "Colour" },
                { key: "generic_info_name", label: "Generic Info" },
                ...(materialsArr[0]?.extra_data
                  ? Object.keys(materialsArr[0].extra_data).map((key) => ({
                      key,
                      label: key.replace(/_/g, " ").toUpperCase(),
                    }))
                  : []),
              ]}
              data={materialsArr.map((material, idx) => ({
                ...material,
                srNo: idx + 1,
              }))}
              isAccordion={true}
              enableHoverEffect={true}
              isMinWidth={true}
              accordionRender={(_, rowIndex) => {
                const material = materialsArr[rowIndex];
                const deliverySchedules = material.delivery_schedules || [];
                const morInventorySpecifications = material.mor_inventory_specifications || [];
                const attachmentsData = material.attachments || [];
                const rowKey = material.id || `${materialType}_${rowIndex}`;
                return (
                  <div
                    style={{
                      width: "85vw",
                      marginLeft: "20px",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: "white",
                      padding: "0",
                    }}
                  >
                    {/* Delivery Schedules Accordion */}
                    <div className="mb-3 card card-body p-0">
                      <div
                        style={{
                          cursor: "pointer",
                          padding: "12px 20px",
                          background: "#f8f9fa",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() =>
                          setOpenDeliveryRows((prev) => ({
                            ...prev,
                            [rowKey]: !prev[rowKey],
                          }))
                        }
                      >
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                          Delivery Schedules
                        </span>
                        <button
                          className="purple-btn2 d-flex align-items-center"
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            padding: "0",
                            background: "transparent",
                            border: "none",
                          }}
                          tabIndex={-1}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDeliveryRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          }}
                        >
                          <DropdownCollapseIcon isCollapsed={!openDeliveryRows[rowKey]} />
                        </button>
                      </div>
                      {openDeliveryRows[rowKey] && (
                        <div style={{ padding: "24px" }}>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th style={{ textAlign: "center" }}>Expected Date</th>
                                <th style={{ textAlign: "center" }}>Expected Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deliverySchedules.length === 0 ? (
                                <tr>
                                  <td colSpan={2} style={{ textAlign: "center" }}>
                                    No delivery schedules available.
                                  </td>
                                </tr>
                              ) : (
                                deliverySchedules.map((schedule, idx) => (
                                  <tr key={idx}>
                                    <td>{schedule.expected_date}</td>
                                    <td>{schedule.expected_quantity}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    {/* Dynamic Details Accordion */}
                    <div className="mb-3 card card-body p-0">
                      <div
                        style={{
                          cursor: "pointer",
                          padding: "12px 20px",
                          background: "#f8f9fa",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() =>
                          setOpenDynamicRows((prev) => ({
                            ...prev,
                            [rowKey]: !prev[rowKey],
                          }))
                        }
                      >
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                          Dynamic Details
                        </span>
                        <button
                          className="purple-btn2 d-flex align-items-center"
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            padding: "0",
                            background: "transparent",
                            border: "none",
                          }}
                          tabIndex={-1}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDynamicRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          }}
                        >
                          <DropdownCollapseIcon isCollapsed={!openDynamicRows[rowKey]} />
                        </button>
                      </div>
                      {openDynamicRows[rowKey] && (
                        <div style={{ padding: "24px" }}>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th style={{ textAlign: "center" }}>Field</th>
                                <th style={{ textAlign: "center" }}>Specification</th>
                              </tr>
                            </thead>
                            <tbody>
                              {morInventorySpecifications.length === 0 ? (
                                <tr>
                                  <td colSpan={2} style={{ textAlign: "center" }}>
                                    No dynamic details available.
                                  </td>
                                </tr>
                              ) : (
                                morInventorySpecifications.map((spec, idx) => (
                                  <tr key={idx}>
                                    <td>{spec.field}</td>
                                    <td>{spec.specification || "N/A"}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    {/* Attachments Accordion */}
                    <div className="mb-3 card card-body p-0">
                      <div
                        style={{
                          cursor: "pointer",
                          padding: "12px 20px",
                          background: "#f8f9fa",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() =>
                          setOpenAttachmentsRows((prev) => ({
                            ...prev,
                            [rowKey]: !prev[rowKey],
                          }))
                        }
                      >
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                          Attachments
                        </span>
                        <button
                          className="purple-btn2 d-flex align-items-center"
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            padding: "0",
                            background: "transparent",
                            border: "none",
                          }}
                          tabIndex={-1}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenAttachmentsRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          }}
                        >
                          <DropdownCollapseIcon isCollapsed={!openAttachmentsRows[rowKey]} />
                        </button>
                      </div>
                      {openAttachmentsRows[rowKey] && (
                        <div style={{ padding: "24px" }}>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th style={{ textAlign: "center" }}>Filename</th>
                                <th style={{ textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attachmentsData.length === 0 ? (
                                <tr>
                                  <td colSpan={2} style={{ textAlign: "center" }}>
                                    No attachments available.
                                  </td>
                                </tr>
                              ) : (
                                attachmentsData.map((attachment, idx) => (
                                  <tr key={idx}>
                                    <td>{attachment.filename}</td>
                                    <td
                                      style={{
                                        display: "flex",
                                        gap: "10px",
                                        justifyContent: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <a
                                        href={`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                        download={attachment.filename}
                                        className="purple-btn2"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          padding: "0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          style={{ fill: "black" }}
                                        >
                                          <g fill="white">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                          </g>
                                        </svg>
                                      </a>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
              customRender={{
    material_type: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    inventory_sub_type: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    inventory_name: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    quantity: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    uom: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    location: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    rate: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    amount: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    pms_brand_name: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    pms_colour_name: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    generic_info_name: (value) =>
      value === undefined || value === null || value === "" ? "-" : value,
    ...(materialsArr[0]?.extra_data
      ? Object.keys(materialsArr[0].extra_data).reduce((acc, key) => {
          acc[key] = (value) =>
            value?.value === undefined ||
            value?.value === null ||
            value?.value === ""
              ? "-"
              : value?.value;
          return acc;
        }, {})
      : {}),
  }}
            />
          </div>
        </div>
      );
    }
  )
}
</div>
                            </div>
                          )}
                        </div>

                        <div
                          className="col-12 pb-4 pt-3"
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
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
                                {data1.attachments?.length > 0 ? (
                                  <div className="tbl-container mt-3">
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
                                            <td className="text-start">
                                              <a
                                                href={`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
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
                                  </div>
                                ) : (
                                  <p className="text-center mt-4">
                                    No attachments available for this event.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className="col-12 pb-4 pt-3"
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
  className="btn d-flex justify-content-between w-100"
  data-bs-toggle="collapse"
  href="#order-config"
  role="button"
  aria-expanded={orderConfigOpen}
  aria-controls="order-config"
  onClick={handleOrderConfig}
  style={{ fontSize: "16px", fontWeight: "normal" }}
>
                            <div>
                              <span
                                id="order-config-icon"
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
                                {orderConfigOpen ? (
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
                                Event Configuration
                              </span>
                            </div>
                          </a>
                          {orderConfigOpen && (
  <div
    id="order-config"
    className="mt-2"
    style={{ paddingLeft: "24px" }}
  >
    <div className="card card-body rounded-3 p-4">
      <div className="row">
        {Array.isArray(orderConfig) && orderConfig.map((item, idx) => (
          <div className="total-activity col-3 my-3" key={idx}>
            <p>{item.label}</p>
            <p
              id={item.id}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                textTransform: item.value === 'rfq' ? "UpperCase" : "capitalize",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
                        </div>
                        <div
                          className="col-12 pb-4 pt-3"
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
                            className="btn d-flex justify-content-between w-100"
                            data-bs-toggle="collapse"
                            href="#order-details"
                            role="button"
                            aria-expanded={orderDetails}
                            aria-controls="order-details"
                            onClick={handleOrderDetails}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <div>
                              <span
                                id="order-details-icon"
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
                                {orderDetails ? (
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
                                Order Details
                              </span>
                            </div>
                          </a>
                          {orderDetails && (
                            <div
                              id="order-config"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="card card-body rounded-3 p-4">
                                {/* Document Details Table */}
                                <div className="row">
                                  {/* {orderConfig?.map((item, idx) => (
                                    <div className="total-activity col-3 my-3" key={idx}>
                                      <p>{item.label}</p>
                                      <p
                                        id={item.id}
                                        style={{
                                          display: "-webkit-box",
                                          WebkitBoxOrient: "vertical",
                                          WebkitLineClamp: 2,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {item.value}
                                      </p>
                                    </div>
                                    ))} */}
                                  <div className="total-activity col-3 my-3">
                                    <p> Event Title</p>
                                    <p
                                      style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {/* {console.log("dta1", data1)} */}
                                      {data1.event_no} {data1.event_title}
                                    </p>
                                  </div>
                                  <div className="total-activity col-3 my-3">
                                    <p>Event Description</p>
                                    <p
                                      style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {data1.event_description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className="col-12 pb-4 pt-3"
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
                            href="#auditLog"
                            role="button"
                            aria-expanded={auditLog}
                            aria-controls="auditLog"
                            onClick={handleAuditLog}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <span
                              id="audit-log-icon"
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
                              {auditLog ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            Audit Log
                          </a>
                          {auditLog && (
                            <div id="auditLog" className="mx-5">
                              <div className="card card-body p-4">
                                {auditLogData?.length > 0 ? (
                                  <Table
                                    columns={[
                                      { label: "Sr No", key: "srNo" }, // Add serial number column
                                      ...auditLogColumns,
                                    ]}
                                    data={auditLogData.map((item, index) => ({
                                      ...item,
                                      srNo: index + 1, // Add serial number to each row
                                      created_at: new Date(item.created_at).toLocaleString(),
                                    }))}
                                  />
                                ) : (
                                  <p className="text-center mt-4">
                                    No Audit Log available for this event.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-12 pb-4 pt-3"
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
            href="#activity-logs"
            role="button"
            aria-expanded={activityLogAccordion}
            aria-controls="activity-logs"
            onClick={() => setActivityLogAccordion((prev) => !prev)}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="activity-logs-icon" className="icon-1" style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}>
              {activityLogAccordion ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Activity Logs
          </a>
          {activityLogAccordion && (
            <div id="activity-logs" className="mx-5">
              <div className="card card-body p-4">
                {activityLogsLoading ? (
                  <div>Loading...</div>
                ) : activityLogs.length > 0 ? (
                  <Table
                    columns={[
                      { label: "Activity Name", key: "activity_name" },
                      { label: "Activity Type", key: "activity_type" },
                      { label: "Created By", key: "created_by_name" },
                      { label: "Created Date", key: "created_at" },
                    ]}
                    data={activityLogs.map((log, idx) => ({
                      ...log,
                      created_at: new Date(log.created_at).toLocaleString(),
                    }))}
                  />
                ) : (
                  <p className="text-center mt-4">
                    No Activity Logs available for this event.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-center">
    <button
      className="purple-btn2"
      onClick={handleDownloadPDF}
      style={{
        backgroundColor: "#8b0203",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Download PDF
    </button>
  </div>
                </>
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
                className="p-3"
                style={{
                  overflowX: "auto",
                  //   height: "calc(100vh - 100px)",
                  //   // height: "100vh"
                }}
              >
                  <div className="d-flex flex-row-reverse mb-3" >
                    <div className=" d-flex align-items-center gap-1 py-3 mx-1 " style={{
                                backgroundColor: "#fff2e8",
                                color: "#8b0203",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                marginLeft: "25px",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                borderColor: "#ffbb96",
                                textTransform: "uppercase",
                              }}>
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
                  {/* <div className="card p-2 m-1"> */}
                    <div className="" style={{ padding: "10px 0px !important" }}>
                      <div className="d-flex justify-content-between align-items-center ">
                        <div className="d-flex justify-content-between">
                          {/* <pre>{JSON.stringify(additionalColumns, null, 2)}</pre>
                        <pre>{JSON.stringify(bidTemplate, null, 2)}</pre> */}

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
                                textTransform: "uppercase",
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
                                {data1?.event_type_detail
                                  ?.event_configuration === "rank_based"
                                  ? `Rank: ${bids[0]?.rank ?? "-"}`
                                  : `Price: ₹${bids[0]?.min_price ?? "-"}`}
                              </span>
                            )
                          )}
                        </div>

                        <button
                          className="purple-btn2"
                          onClick={() => handleAllTaxModal()}
                        >
                          <span className="align-text-top">All Taxes</span>
                          {/* {console.log("data:---", data)
                          } */}
                        </button>
                      </div>
                    </div>

                    {counterData > 0 && (
                      <div
  className="d-flex justify-content-between align-items-center mx-3 p-3 rounded-3"
  style={{
    background: "linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%)",
    border: "2px solid #ffc107",
    boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
    color: "#856404",
  }}
>
  <div>
    <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
      <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: "#856404" }} />
      Counter Offer

    </p>
    <p style={{ marginBottom: 0 }}>
      A counter is pending on your bid. You cannot make any
      further changes to your bid until you resolve the
      counter offer.
    </p>
  </div>
  <div className="d-flex">
    <button
      className="purple-btn1 me-2"
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

                    {/* <div className="card-body"> */}
                      <div style={tableContainerStyle}>
                      {console.log("data:-",data)}
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
                            {
                              label: "Quantity Available *",
                              key: "quantityAvail",
                            },
                            { label: "Price *", key: "price" },
                            { label: "Realised Price *", key: "realisedPrice" },
                            { label: "Discount %*", key: "discount" },
                            {
                              label: "Realised Discount",
                              key: "realisedDiscount",
                            },
                            { label: "Landed Amount", key: "landedAmount" },
                            { label: "Total", key: "total" },
                            // {
                            //   label: "Participant Attachment",
                            //   key: "attachment",
                            // },
                            { label: "Vendor Remark", key: "vendorRemark" },
                            { label: "Tax Rate", key: "taxRate" },
                            ...additionalColumns, // Dynamically add extra columns
                          ]}
                          data={paginatedData.map((row, idx) => ({
      ...row,
      srNo: (currentPage - 1) * pageSize + idx + 1,
    }))}
                          customRender={{
                            realisedPrice: (cell, rowIndex) => {
                              return (
                                <input
                                  value={cell || "-"}
                                  disabled={true}
                                  className="form-control"
                                  readonly
                                />
                              );
                            },
                            taxRate: (cell, rowIndex) => (
                              <button
                                className="purple-btn2"
                                onClick={() => handleOpenModal(rowIndex)}
                              >
                                <span className="align-text-top">Select</span>
                                {/* {console.log("data:---", data)
                                } */}
                              </button>
                            ),
                            pmsBrand: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={true}
                              />
                            ),
                            pmsColour: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={true}
                              />
                            ),
                            genericInfo: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={true}
                              />
                            ),
                            descriptionOfItem: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={true}
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
                                <input
                                  className="form-control"
                                  type="text"
                                  value={cell}
                                  readOnly
                                  style={otherColumnsStyle}
                                  disabled={true}
                                />
                                {/* <p>{cell}</p> */}
                              </>
                            ),

                            location: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="text"
                                value={cell}
                                readOnly
                                style={otherColumnsStyle}
                                disabled={true}
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
                                disabled={true}
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
                                  min="0"
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
                                  min="0"
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
                            rate: (cell, rowIndex) => (
                              <input
                                className="form-control"
                                type="number"
                                min="0"
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
                              const row = data[rowIndex];
                              const quantityRequested =
                                parseFloat(row.quantity) || 0;
                              const quantityAvail = row.quantityAvail ?? ""; // editable input
                              const price = parseFloat(row.price) || 0;

                              const handleQuantityChange = (e) => {
                                const value = parseFloat(e.target.value) || 0;

                                if (value > quantityRequested) {
                                  toast.error(
                                    "The quantity available value cannot be greater than the quantity requested."
                                  );
                                  return;
                                }

                                handleInputChange(
                                  value,
                                  rowIndex,
                                  "quantityAvail"
                                );
                              };

                              const showArrow =
                                counterData &&
                                (previousData[rowIndex]?.quantityAvail ??
                                  "") !==
                                  (updatedData[rowIndex]?.quantityAvail ?? "");

                              return showArrow ? (
                                <div
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
                                    {previousData[rowIndex]?.quantityAvail ||
                                      quantityRequested}
                                  </span>
                                  <span className="me-2">
                                    <svg
                                      viewBox="64 64 896 896"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                    >
                                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z" />
                                    </svg>
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#b45253",
                                      padding: "4px 10px",
                                      borderRadius: "5px",
                                      color: "white",
                                      lineHeight: "1",
                                    }}
                                  >
                                    {updatedData[rowIndex]?.quantityAvail ||
                                      quantityAvail}
                                  </span>
                                </div>
                              ) : counterData ? (
                                <span>{quantityAvail}</span>
                              ) : (
                                <input
                                  className="form-control"
                                  type="number"
                                  value={
                                    quantityAvail !== "" &&
                                    quantityAvail !== undefined
                                      ? quantityAvail
                                      : quantityRequested
                                  }
                                  onChange={handleQuantityChange}
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
                            // ...additionalColumns.reduce((acc, col) => {
                            //   acc[col.key] = (cell, rowIndex) => {
                            //     const row = data[rowIndex]; // Correctly reference the row
                            //     const extraData =
                            //       row?.extra_data?.[col.key] || {
                            //         value: "",
                            //         readonly: false,
                            //       }; // Ensure extra_data is initialized
                            //     console.log("row", row, "extraData", extraData);
                            //     return (
                            //       <input
                            //         value={extraData.value || ""
                            //           } // Use the value conditionally
                            //         className="form-control"
                            //         onChange={(e) => {
                            //           // if (revisedBid) {
                            //             // Update the value in extra_data immutably
                            //             setData((prevData) => {
                            //               const updatedData = prevData.map(
                            //                 (item, index) => {
                            //                   if (index === rowIndex) {
                            //                     const updatedRow = { ...item };
                            //                     if (!updatedRow.extra_data) {
                            //                       updatedRow.extra_data = {};
                            //                     }
                            //                     updatedRow.extra_data[col.key] =
                            //                       {
                            //                         ...updatedRow.extra_data[
                            //                           col.key
                            //                         ],
                            //                         value: e.target.value,
                            //                       };
                            //                     return updatedRow;
                            //                   }
                            //                   return item;
                            //                 }
                            //               );
                            //               return updatedData;
                            //             });

                            //         }}
                            //         onFocus={(e) => e.target.select()} // Ensure the input remains focused
                            //         readOnly={!revisedBid} // Make input read-only if not revisedBid
                            //       />
                            //     );
                            //   };
                            //   return acc;
                            // }, {}),
                            // ...additionalColumns.reduce((acc, col) => {
                            //   acc[col.key] = (cell, rowIndex) => {
                            //     const row = data[rowIndex]; // Correctly reference the row
                            //     const extraData = row?.extra_data?.[col.key] || { value: "", readonly: false }; // Ensure extra_data is initialized
                            //     return (
                            //       <input
                            //         value={typeof extraData === "object" ? extraData.value || "" : extraData || ""}
                            //         className="form-control"
                            //         onChange={(e) => {
                            //           // Update the value in extra_data immutably
                            //           setData((prevData) => {
                            //             const updatedData = prevData.map((item, index) => {
                            //               if (index === rowIndex) {
                            //                 const updatedRow = { ...item };
                            //                 if (!updatedRow.extra_data) {
                            //                   updatedRow.extra_data = {};
                            //                 }
                            //                 updatedRow.extra_data[col.key] = {
                            //                   ...updatedRow.extra_data[col.key],
                            //                   value: e.target.value,
                            //                 };
                            //                 return updatedRow;
                            //               }
                            //               return item;
                            //             });
                            //             return updatedData;
                            //           });
                            //         }}
                            //         onFocus={(e) => e.target.select()}
                            //       />
                            //     );
                            //   };
                            //   return acc;
                            // }, {}),
                            ...additionalColumns.reduce((acc, col) => {
                              acc[col.key] = (cell, rowIndex) => {
                                const row = data[rowIndex];

                                // Determine the correct key to use from extra_data
                                const currentKey =
                                  row?.extra_data?.[col.label] !== undefined
                                    ? col.label
                                    : col.value &&
                                      row?.extra_data?.[col.value] !== undefined
                                    ? col.value
                                    : col.key;

                                const revisedBid = row?.revised_bid;
                                const extraData = row?.extra_data?.[currentKey];
                                // console.log("row", row, "extraData", extraData);

                                // Determine value and readonly safely
                                const inputValue =
                                  typeof extraData === "object"
                                    ? extraData.value ?? ""
                                    : extraData ?? "";
                                const isReadOnly =
                                  typeof extraData === "object"
                                    ? extraData.readonly ?? false
                                    : false;

                                return (
                                  <input
                                    value={inputValue}
                                    className="form-control"
                                    readOnly={isReadOnly}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setData((prevData) =>
                                        prevData.map((item, index) => {
                                          if (index === rowIndex) {
                                            const updatedRow = { ...item };
                                            if (!updatedRow.extra_data)
                                              updatedRow.extra_data = {};

                                            updatedRow.extra_data[currentKey] =
                                              {
                                                ...(typeof updatedRow
                                                  .extra_data[currentKey] ===
                                                "object"
                                                  ? updatedRow.extra_data[
                                                      currentKey
                                                    ]
                                                  : {}),
                                                value: newValue,
                                              };

                                            return updatedRow;
                                          }
                                          return item;
                                        })
                                      );
                                    }}
                                    onFocus={(e) => e.target.select()}
                                  />
                                );
                              };
                              return acc;
                            }, {}),
                          }}
                          isLowSpace={true}
                        />

                      </div>
                        <div className="d-flex justify-content-between align-items-center px-3 mt-2">
    <ul className="pagination justify-content-center d-flex mb-0">
      {/* First */}
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          First
        </button>
      </li>
      {/* Prev */}
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
      </li>
      {/* Page numbers */}
      {pageNumbers.map((pageNumber) => (
        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </button>
        </li>
      ))}
      {/* Next */}
      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </li>
      {/* Last */}
      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </li>
    </ul>
    {/* Showing entries count */}
    <div>
      <p className="mb-0" style={{ fontSize: "14px" }}>
        Showing{" "}
        {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
      </p>
    </div>
  </div>
                      <div className="d-flex justify-content-end align-items-start gap-3 w-100">
                        <div className="d-flex flex-column align-items-end w-100">
                          <ShortDataTable
                            data={bidTemplate}
                            editable={true}
                            onValueChange={(updated) =>
                              setShortTableData(updated)
                            }
                          />
                          <button
                            className="purple-btn2 mt-2"
                            onClick={handleOpenOtherChargesModal}
                          >
                            Other Charges
                          </button>
                          <ChargesDataTable
                            data={chargesData}
                            showOtherChargesModal={showOtherChargesModal}
                            handleCloseOtherChargesModal={
                              handleCloseOtherChargesModal
                            }
                            setGrossTotal={setGrossTotal}
                            grossTotal={grossTotal}
                            calculateGrossTotal={calculateGrossTotal}
                            editable={true}
                            onValueChange={(updated) => {
                              setChargesData(updated);
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-2 mx-2">
                        <h5>
                          <strong>Gross Total:</strong> ₹
                          {Number(grossTotal || 0).toFixed(2)}
                        </h5>
                      </div>

                  <div style={{ marginTop: "10px" }}>
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
                      <p className="head-material text-muted">
                        Please find below the terms and conditions associated
                        with the orders
                      </p>
                      <ol
                        className="head-material"
                        style={{ fontSize: "13px", marginLeft: "0px", paddingLeft:'10px !important' }}
                      >
                        {terms.map((term) => (
                          <li key={term.id} className="mb-3 mt-3">
                            {term.condition}
                          </li>
                        ))}
                      </ol>
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
                          <p>Loading...</p>
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
                        {revisedBid ? "Revise Bid" : "Submit"}
                      </button>
                    </div>
                        
                    {/* <Table
                    columns={[
                      { label: "Activity Name", key: "activity_name" },
                      { label: "Activity Type", key: "activity_type" },
                      { label: "Created By", key: "created_by_name" },
                      { label: "Created Date", key: "created_at" },
                    ]}
                    data={activityLogs.map((log, idx) => ({
                      ...log,
                      created_at: new Date(log.created_at).toLocaleString(),
                    }))}
                  />     */}

                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* {console.log("revisedBid", revisedBid)} */}

      <DynamicModalBox
        show={showModal1}
        onHide={handleCloseModal1}
        size="lg"
        title="View Tax & Rate"
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseModal1,
            props: {
              className: "purple-btn1",
            },
          },
          {
            label: "Apply All",
            onClick: handleSaveAllTaxChanges,
            props: {
              className: "purple-btn2",
            },
          },
        ]}
        centered={true}
      >
        <div className="container-fluid p-0">
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
                      {/* <th>Amount</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Addition Tax & Charges Row */}
                    <tr>
                      <td>Addition Tax & Charges</td>
                      <td></td>
                      {/* <td></td> */}
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
                    {/* {console.log("parent", matchedTaxNames)} */}
                    {parentTaxRateData[
                      tableId
                    ]?.addition_bid_material_tax_details.map(
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
                              onChange={(value) => {
                                const selectedOption = taxOptions.find(
                                  (option) => option.value === value
                                );
                                handleAllTaxChargeChange(
                                  "taxChargeType",
                                  selectedOption?.value,
                                  "addition",
                                  item.id
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

<td>
  <SelectBox
    options={
      (() => {
        // Find the selected tax type (by name or resource_id)
        const selectedTaxType =
          item.taxChargeType ||
          taxOptions.find((option) => option.id === item.resource_id)?.name ||
          taxOptions.find((option) => option.id === item.resource_id)?.value;

        // Find the matching percentage array from taxPercentageOptions
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );

        // If found, return as [{label, value}]
        if (match && Array.isArray(match.percentage)) {
          return match.percentage.map((percent) => ({
            label: `${percent}%`,
            value: `${percent}%`,
          }));
        }
        // If not found, return empty array (no static options)
        return []
      })()
    }
    defaultValue={item?.taxChargePerUom || ""}
    onChange={(e) =>
                                handleAllTaxChargeChange(
                                  "taxChargePerUom",
                                  e,
                                  "addition",
                                  item.id
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
                                handleAllTaxChargeChange(
                                  "inclusive",
                                  e.target.checked,
                                  "addition",
                                  item.id
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
                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            addDeductionTaxCharge(tableId);
                          }}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>

                    {parentTaxRateData[
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
                              handleAllTaxChargeChange(
                                "taxChargeType",
                                value,
                                "deduction",
                                item.id
                              )
                            }
                            disabledOptions={parentTaxRateData[
                              tableId
                            ]?.deduction_bid_material_tax_details?.map(
                              (item) =>
                                item.taxChargeType || item.resource_id || "SGST"
                            )}
                          />
                        </td>
                        {/* <td>
                          <select
                            className="form-select"
                            defaultValue={item?.taxChargePerUom}
                            onChange={(e) =>
                              handleAllTaxChargeChange(
                                "taxChargePerUom",
                                e.target.value,
                                "deduction",
                                item.id
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
        // Find the selected tax type (by name or resource_id)
        const selectedTaxType =
          item.taxChargeType ||
          deductionTaxOptions.find((option) => option.id === item.resource_id)?.name ||
          deductionTaxOptions.find((option) => option.id === item.resource_id)?.value;

        // Find the matching percentage array from taxPercentageOptions
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );

        // If found, return as [{label, value}]
        if (match && Array.isArray(match.percentage)) {
          return match.percentage.map((percent) => ({
            label: `${percent}%`,
            value: `${percent}%`,
          }));
        }
        // If not found, return empty array (no static options)
        return [
          {label: "5%", value: "5%"},
          {label: "12%", value: "12%"},
          {label: "18%", value: "18%"},
          {label: "28%", value: "28%"},
      ]
      })()
    }
    defaultValue={item?.taxChargePerUom || ""}
    onChange={(value) =>
      handleAllTaxChargeChange(
        "taxChargePerUom",
        value,
        "deduction",
        item.id
      )
    }
    // className="form-select"
  />
</td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={item.inclusive}
                            onChange={(e) =>
                              handleAllTaxChargeChange(
                                "inclusive",
                                e.target.checked,
                                "deduction", // Pass either "addition" or "deduction"
                                item.id
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DynamicModalBox>

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
                            // if (
                            //   taxRateData[tableId]
                            //     ?.addition_bid_material_tax_details.length >= 4
                            // ) {
                            //   toast.error(
                            //     "You can only add up to 1 fields for Additional Tax & Charges.",
                            //     {
                            //       autoClose: 2000,
                            //     }
                            //   );
                            // } else {
                            addAdditionTaxCharge(tableId);
                            // }
                          }}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>
                    {/* {console.log("matched:--",matchedTaxNamesArray)} */}
                    {taxRateData[
                      tableId
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
                              onChange={(value) => {
                                const selectedOption = taxOptions.find(
                                  (option) => option.value === value
                                );

                                // Handle the selected option
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

                          <td>
  <SelectBox
    options={
      (() => {
        // Find the selected tax type (by name or resource_id)
        const selectedTaxType =
          item.taxChargeType ||
          taxOptions.find((option) => option.id === item.resource_id)?.name ||
          taxOptions.find((option) => option.id === item.resource_id)?.value;

        // Find the matching percentage array from taxPercentageOptions
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );

        // If found, return as [{label, value}]
        if (match && Array.isArray(match.percentage)) {
          return match.percentage.map((percent) => ({
            label: `${percent}%`,
            value: `${percent}%`,
          }));
        }
        // If not found, return empty array (no static options)
        return [
          {label: "5%", value: "5%"},
          {label: "12%", value: "12%"},
          {label: "18%", value: "18%"},
          {label: "28%", value: "28%"},
      ]
      })()
    }
    defaultValue={item?.taxChargePerUom || ""}
    onChange={(e) =>
                                handleTaxChargeChange(
                                  tableId,
                                  item.id,
                                  "taxChargePerUom",
                                  e,
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
                          onClick={() => addDeductionTaxCharge(tableId)}
                        >
                          <span>+</span>
                        </button>
                      </td>
                    </tr>

                    {taxRateData[
                      tableId
                    ]?.deduction_bid_material_tax_details?.map((item) => (
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
                            disabledOptions={taxRateData[
                              tableId
                            ]?.deduction_bid_material_tax_details?.map(
                              (item) => item.taxChargeType
                            )}
                          />
                        </td>
                        <td>
  <SelectBox
    options={
      (() => {
        // Find the selected tax type (by name or resource_id)
        const selectedTaxType =
          item.taxChargeType ||
          deductionTaxOptions.find((option) => option.id === item.resource_id)?.name ||
          deductionTaxOptions.find((option) => option.id === item.resource_id)?.value;

        // Find the matching percentage array from taxPercentageOptions
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );

        // If found, return as [{label, value}]
        if (match && Array.isArray(match.percentage)) {
          return match.percentage.map((percent) => ({
            label: `${percent}%`,
            value: `${percent}%`,
          }));
        }
        // If not found, return empty array (no static options)
        return [
          {label: "5%", value: "5%"},
          {label: "12%", value: "12%"},
          {label: "18%", value: "18%"},
          {label: "28%", value: "28%"},
      ]
      })()
    }
    defaultValue={item?.taxChargePerUom || ""}
    onChange={(e) =>
                              handleTaxChargeChange(
                                tableId,
                                item.id,
                                "taxChargePerUom",
                                e,
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
    </div>
  );
}