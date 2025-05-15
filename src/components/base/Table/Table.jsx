import React, { useState, useEffect } from "react";
import DropdownCollapseIcon from "../../common/Icon/DropdownCollapseIcon";

// Utility to transpose data for horizontal alignment
const transposeData = (data, columns) => {
  const keys = columns.map((col) => col.key);
  return keys.map((key, colIndex) => ({
    header: columns[colIndex].label,
    values: data.map((row) => row[key]),
  }));
};

export default function Table({
  columns,
  data = [], // Ensure data is always an array
  isAccordion = false,
  onActionClick = null,
  serializedData = [],
  showCheckbox = false,
  actionIcon = null,
  isSelectCheckboxes = null,
  customRender = {}, // Added customRender prop
  isHorizontal = false,
  onRowSelect,
  handleCheckboxChange = (index, newSelectAll) => {}, // Provide a default function
  resetSelectedRows,
  onResetComplete,
  currentPage = 1,
  pageSize = 10,
  onColumnClick,
  enableOverflowScroll = false,
  enableHoverEffect = false, // Add new prop
  isMinWidth = false, // Add new prop
  accordionRender = null,
  ...rest
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadedSerializedData, setLoadedSerializedData] = useState([]);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  useEffect(() => {
    if (isSelectCheckboxes) {
      setSelectedRows(data.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  }, [isSelectCheckboxes, data.length]);

  useEffect(() => {
    if (selectedRows.length === data.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, data.length]);

  useEffect(() => {
    if (resetSelectedRows) {
      setSelectedRows([]);
      onResetComplete();
    }
  }, [resetSelectedRows, onResetComplete]);

  useEffect(() => {
    // Process serializedData only when it stabilizes
    const processSerializedData = () => {
      if (serializedData.length > 0) {
        const flattenedData = serializedData.flatMap((entry) =>
          Array.isArray(entry) ? entry : [entry]
        );
        setLoadedSerializedData(flattenedData);
      } else {
        setLoadedSerializedData([]); // Reset if serializedData is empty
      }
    };

    // Use a timeout to wait for serializedData to stabilize
    const timer = setTimeout(() => {
      processSerializedData();
    }, 200); // Wait for 200ms to ensure serializedData is stable

    return () => clearTimeout(timer); // Cleanup timeout on component unmount or serializedData change
  }, [serializedData]);

  if (!loadedSerializedData.length && serializedData.length > 0) {
    return <div>Loading data...</div>;
  }

  const handleRowSelection = (rowIndex) => {
    const vendor = data[rowIndex];
    const isSelected = selectedRows.some((row) => row.id === vendor.id);

    const updatedSelectedRows = isSelected
      ? selectedRows.filter((row) => row.id !== vendor.id)
      : [...selectedRows, vendor];

    setSelectedRows(updatedSelectedRows);
    handleCheckboxChange(vendor, !isSelected);
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedSelectedRows = newSelectAll
      ? [
          ...selectedRows,
          ...data.filter(
            (vendor) => !selectedRows.some((row) => row.id === vendor.id)
          ),
        ]
      : selectedRows.filter(
          (vendor) => !data.some((row) => row.id === vendor.id)
        );

    setSelectedRows(updatedSelectedRows);

    if (newSelectAll) {
      data.forEach((vendor) => {
        handleCheckboxChange(vendor, true);
      });
    } else {
      data.forEach((vendor) => {
        handleCheckboxChange(vendor, false);
      });
    }
  };

  const handleColumnClick = (data, columnKey) => {
    if (onColumnClick) {
      const bid_id = data.bid_id || data.bidId;
      const material_id = data.material_id || data.materialId;
      const vendor_id = data.vendor_id || data.vendorId;
      const vendor_name = data.vendor_name || data.vendor_name;
      const id = data.id || data.id;
      onColumnClick(
        { bid_id, material_id, vendor_id, vendor_name, id, ...data },
        columnKey
      );
    }
  };

  if (isHorizontal) {
    const transposedData = transposeData(data, columns);

    // Extract the total amounts for the last row (e.g., "Total Amount")
    const totalAmountsRow = transposedData.find(
      (row) => row.header === "Total Amount"
    );
    const totalAmounts = totalAmountsRow
      ? totalAmountsRow.values.map((value) => parseFloat(value) || 0)
      : [];

    // Sort the amounts to find the least, second least, and third least
    const sortedAmounts = [...totalAmounts].sort((a, b) => a - b);
    const leastAmount = sortedAmounts[0];
    const secondLeastAmount = sortedAmounts[1];
    const thirdLeastAmount = sortedAmounts[2];

    const getBackgroundColor = (amt) => {
      if (amt === leastAmount) return "rgba(139, 231, 139, 0.5)";
      if (amt === secondLeastAmount) return "rgba(255, 237, 85, 0.5)";
      if (amt === thirdLeastAmount) return "rgba(255, 63, 64, 0.5)";
      return "transparent";
    };

    return (
      <div className="mb-0" {...rest} style={{ overflowX: "auto" }}>
        <table
          className="bid-tbl w-100"
          style={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <colgroup>
            <col style={{ width: "300px" }} />
            {data.map((_, index) => (
              <col key={index} style={{ width: "180px" }} />
            ))}
            <col style={{ width: "auto" }} />
          </colgroup>
          <thead></thead>
          <tbody>
            {transposedData.map(
              (row, rowIndex) =>
                ![
                  "bid_id",
                  "material_id",
                  "vendor_id",
                  "vendor_name",
                  "pms_supplier_id",
                  "material_name",
                  "id",
                ].includes(columns[rowIndex]?.key) && (
                  <tr key={rowIndex}>
                    <td
                      className="main2-th"
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        width: "300px",
                      }}
                    >
                      {row.header}
                    </td>
                    {row.values.map((value, valueIndex) => {
                      // Handle serializedData as an array of arrays
                      const serializedEntries = Array.isArray(
                        loadedSerializedData[valueIndex]
                      )
                        ? loadedSerializedData[valueIndex]
                        : [loadedSerializedData[valueIndex] || {}];

                      const serializedCharges = serializedEntries.map(
                        (entry) => entry.charges || {}
                      );
                      const serializedBidMaterials = serializedEntries.flatMap(
                        (entry) => entry.bid_materials || [] // Handle all bid_materials, not just the first one
                      );
                      const originalValue = value === "_" ? "" : value; // Replace "_" with an empty string

                      // Map tableColumn keys to serializedBidMaterials keys
                      const keyMapping = {
                        bestTotalAmount: "total_amount",
                        quantityAvailable: "quantity_available",
                        realisedDiscount: "realised_discount",
                        landedAmount: "total_amount",
                        totalAmount: "total_amount",
                        realised_tax_amount: "realised_tax_amount",
                      };

                      // Fetch serialized value based on key mapping
                      const serializedValue = serializedEntries
                        .map((entry, index) =>
                          serializedCharges[index][columns[rowIndex]?.key] !==
                          undefined
                            ? serializedCharges[index][columns[rowIndex]?.key]
                            : keyMapping[columns[rowIndex]?.key]
                            ? serializedBidMaterials.find(
                                (material) =>
                                  material[
                                    keyMapping[columns[rowIndex]?.key]
                                  ] !== undefined
                              )?.[keyMapping[columns[rowIndex]?.key]]
                            : serializedBidMaterials.find(
                                (material) =>
                                  material[columns[rowIndex]?.key] !== undefined
                              )?.[columns[rowIndex]?.key] || ""
                        )
                        .filter((val) => val !== "")[0]; // Use the first non-empty value

                      const adjustedSerializedValue =
                        serializedValue || originalValue;

                      const shouldCompare = [
                        "freight_charge_amount",
                        "gst_on_freight",
                        "gst_on_handling_charge",
                        "gst_on_other_charge",
                        "handling_charge_amount",
                        "other_charge_amount",
                        "realised_freight_charge_amount",
                        "realised_handling_charge_amount",
                        "realised_other_charge_amount",
                        "bestTotalAmount",
                        "quantityAvailable",
                        "realisedDiscount",
                        "landedAmount",
                        "totalAmount",
                        "price",
                        "discount",
                        "realised_tax_amount",
                      ].includes(columns[rowIndex]?.key);

                      return (
                        <td
                          key={valueIndex}
                          style={{
                            width: "180px",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            backgroundColor: [
                              "totalAmount",
                              "grossTotal",
                            ].includes(columns[rowIndex]?.key)
                              ? getBackgroundColor(value)
                              : "transparent",
                            fontWeight: ["totalAmount", "grossTotal"].includes(
                              columns[rowIndex]?.key
                            )
                              ? "bold"
                              : "normal",
                            textTransform: "capitalize",
                          }}
                          onMouseOver={(e) =>
                            enableHoverEffect &&
                            (e.currentTarget.style.backgroundColor = "#f0f0f0")
                          }
                          onMouseOut={(e) =>
                            enableHoverEffect &&
                            (e.currentTarget.style.backgroundColor = [
                              "totalAmount",
                              "grossTotal",
                            ].includes(columns[rowIndex]?.key)
                              ? getBackgroundColor(value)
                              : "transparent")
                          }
                        >
                          {customRender[columns[rowIndex]?.key] ? (
                            customRender[columns[rowIndex]?.key](
                              value,
                              valueIndex,
                              data[valueIndex]
                            )
                          ) : shouldCompare && adjustedSerializedValue ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {serializedValue && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "red",
                                  }}
                                >
                                  {serializedValue}
                                </span>
                              )}
                              {serializedValue && (
                                <span style={{ margin: "0 5px" }}>→</span>
                              )}
                              <span>{originalValue}</span>
                            </div>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className="tbl-container px-0 mt-3"
      {...rest}
      style={{ maxHeight: "300px" }}
    >
      <table className="w-100">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ width: "50px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={data.every((vendor) =>
                    selectedRows.some((row) => row.id === vendor.id)
                  )}
                  onChange={handleSelectAllChange}
                />
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={index}
                className="main2-th"
                style={{
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  width: col.label === "srNo" ? "100px !important" : "70px",
                }}
              >
                {col.label}
              </th>
            ))}
            {actionIcon && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <>
              <tr key={rowIndex}>
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.some(
                        (selectedRow) => selectedRow.id === row.id
                      )}
                      onChange={() => handleRowSelection(rowIndex)}
                    />
                  </td>
                )}
                {columns.map((col, cellIndex) => {
                  const cell =
                    col.key === "srNo"
                      ? (currentPage - 1) * pageSize + rowIndex + 1
                      : row[col.key];
                  const cellContent = customRender[col.key]
                    ? customRender[col.key](cell, rowIndex, row)
                    : cell;

                  return (
                    <td
                      key={cellIndex}
                      style={{
                        textAlign: "left",
                        whiteSpace: enableOverflowScroll ? "nowrap" : "normal",
                        overflow: enableOverflowScroll ? "hidden" : "visible",
                        textOverflow: enableOverflowScroll
                          ? "ellipsis"
                          : "clip",
                        width: col.key === "srNo" ? "100px !important" : "70px", // Set width for srNo column
                        minWidth:
                          isMinWidth && col.key !== "srNo" ? "300px" : "70px", // Set minimum width if minWidth prop is true
                      }}
                    >
                      {col.key === "srNo" ? (
                        <div className="d-flex align-items-center gap-2">
                          <span>
                            {(currentPage - 1) * pageSize + rowIndex + 1}
                          </span>
                          {isAccordion && (
                          <button
                            className="purple-btn2 d-flex align-items-center"
                            style={{
                              borderRadius: "50%", // Fully rounded border
                              width: "32px", // Equal width
                              height: "32px", // Equal height
                              padding: "0", // Remove padding for a perfect circle
                            }}
                            onClick={() => toggleAccordion(rowIndex)}
                          >
                            <DropdownCollapseIcon
                              isCollapsed={openAccordionIndex !== rowIndex}
                            />
                          </button>
                            )}
                        </div>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
                {actionIcon && onActionClick && (
                  <td>
                    <button
                      className="p-2 bg-white border"
                      style={{
                        color: "#8b0203",
                        backgroundColor: "transparent", // Remove background
                        border: "none", // Remove border
                        padding: "0", // Optional: Adjust padding
                        cursor: "pointer", // Ensure pointer cursor for interactivity
                      }}
                      onClick={() => onActionClick(row)} // Pass the row data
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
              {openAccordionIndex === rowIndex && accordionRender && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div style={{ textAlign: "left" }}>
                      {accordionRender(row, rowIndex)}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
