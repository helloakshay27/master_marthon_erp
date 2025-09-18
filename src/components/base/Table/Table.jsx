import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import DropdownCollapseIcon from "../../common/Icon/DropdownCollapseIcon";
import { se } from "date-fns/locale";

// Utility to transpose data for horizontal alignment
const transposeData = (data, columns) => {
  const keys = columns.map((col) => col.key);
  return keys.map((key, colIndex) => ({
    header: columns[colIndex].label,
    values: data.map((row) => row[key]),
  }));
};

// InfoTooltip component for cell hover
const InfoTooltip = ({ content, anchorEl }) => {
  if (!anchorEl) return null;
  const rect = anchorEl.getBoundingClientRect();
  const style = {
    position: "fixed",
    top: rect.top + rect.height / 2,
    left: rect.right + 10,
    transform: "translateY(-50%)",
    background: "linear-gradient(to bottom, white, #f0f0f0)",
    border: "1px solid #f3f3f3",
    borderBottom: "4px solid #8b0203",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    padding: "10px",
    fontSize: "11px",
    zIndex: 9999,
    minWidth: "100px",
    maxWidth: "200px",
    color: "#000",
    whiteSpace: "pre-wrap",
  };
  return ReactDOM.createPortal(
    <div style={style}>{content}</div>,
    document.body
  );
};

export default function Table({
  isLowSpace = false,
  columns,
  data = [], 
  isAccordion = false,
  onActionClick = null,
  serializedData = [],
  showCheckbox = false,
  actionIcon = null,
  isSelectCheckboxes = null,
  customRender = {}, 
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
  isWidth = false,
  scrollable = false, // Add scrollable prop
  accordionRender = null,
  isRowSelected = null, // Add new prop to determine if a row is selected externally
  fullWidth = false, // NEW PROP
  ...rest
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadedSerializedData, setLoadedSerializedData] = useState([]);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");

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
                  "po_exist",
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
                      // --- Begin: robust serialized comparison logic ---
                      const serializedEntry =
                        loadedSerializedData[valueIndex] || {};
                      const originalValue = value === "_" ? "" : value;

                      // Map tableColumn keys to serializedEntry keys if needed
                      const keyMapping = {
                        bestTotalAmount: "total_amount",
                        quantityAvailable: "quantity_available",
                        realisedDiscount: "realised_discount",
                        landedAmount: "total_amount",
                        totalAmount: "total_amount",
                        realised_tax_amount: "realised_tax_amount",
                        price: "price",
                        discount: "discount",
                      };

                      const columnKey = columns[rowIndex]?.key;
                      // Try direct key, mapped key, or fallback to undefined
                      let serializedValue =
                        serializedEntry[
                          keyMapping[columnKey]
                            ? keyMapping[columnKey]
                            : columnKey
                        ];

                      // If not found, try inside charges or bid_materials for special keys
                      if (
                        serializedValue === undefined &&
                        serializedEntry.charges &&
                        typeof serializedEntry.charges === "object"
                      ) {
                        serializedValue = serializedEntry.charges[columnKey];
                      }
                      if (
                        serializedValue === undefined &&
                        Array.isArray(serializedEntry.bid_materials)
                      ) {
                        // Try to find in first bid_materials object
                        const bm = serializedEntry.bid_materials[0];
                        if (bm) {
                          serializedValue =
                            bm[keyMapping[columnKey] || columnKey];
                        }
                      }

                      // If still undefined, fallback to empty string
                      if (serializedValue === undefined) serializedValue = "";

                      // List of keys to compare
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
                      ].includes(columnKey);

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
                            ].includes(columnKey)
                              ? getBackgroundColor(value)
                              : "transparent",
                            fontWeight: ["totalAmount", "grossTotal"].includes(
                              columnKey
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
                            ].includes(columnKey)
                              ? getBackgroundColor(value)
                              : "transparent")
                          }
                        >
                          {customRender[columnKey] ? (
                            customRender[columnKey](
                              value,
                              valueIndex,
                              data[valueIndex]
                            )
                          ) : shouldCompare && serializedValue !== "" ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "red",
                                }}
                              >
                                {Number(serializedValue).toFixed(2)}
                              </span>
                              <span style={{ margin: "0 5px" }}>→</span>
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

  // Reorder columns so srNo, descriptionOfItem, section are first and in order
  const reorderedColumns = [
    ...columns.filter((col) => col.key === "srNo"),
    ...columns.filter((col) => col.key === "descriptionOfItem"),
    ...columns.filter((col) => col.key === "section"),
    ...columns.filter((col) => col.key === "subSection"),
    ...columns.filter((col) => col.key !== "srNo" && col.key !== "descriptionOfItem" && col.key !== "section" && col.key !== "subSection"),
  ];

  return (
    <div className="px-0 mt-3 max-h-none" style={fullWidth? { width: "100%", overflowX: "auto" } : {}} {...rest}>
      <div 
        style={{
          ...(fullWidth ? { width: "100%", overflowX: "auto" } : {}),
          ...(isMinWidth ? { width: "100%", overflowX: "auto" } : {}),
          ...(scrollable ? { 
            maxHeight: "400px", 
            overflowY: "auto",
            overflowX: "auto"
          } : {})
        }}
      >
        <table
          className="tbl-container mx-0"
          style={
            fullWidth
              ? { minWidth: "100%", tableLayout: "auto" }
              : isMinWidth
              ? { minWidth: "1200px", tableLayout: "auto" }
              : {}
          }
        >
          <thead>
            <tr>
              {showCheckbox && (
                <th style={{ width: "50px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      isRowSelected 
                        ? data.every((vendor) => isRowSelected(vendor.id))
                        : data.every((vendor) =>
                            selectedRows.some((row) => row.id === vendor.id)
                          )
                    }
                    onChange={handleSelectAllChange}
                  />
                </th>
              )}
              {reorderedColumns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                    width:
                      col.key === "srNo"
                        ? "100px !important"
                        : "70px !important",
                    position:
                      isLowSpace && col.key === "srNo"
                        ? "sticky"
                        : isLowSpace && col.key === "descriptionOfItem"
                        ? "sticky"
                        : isLowSpace && col.key === "section"
                        ? "sticky"
                        : isLowSpace && col.key === "subSection"
                        ? "sticky"
                        : undefined,
                    left:
                      isLowSpace && col.key === "srNo"
                        ? 0
                        : isLowSpace && col.key === "descriptionOfItem"
                        ? 50
                        : isLowSpace && col.key === "section"
                        ? 180
                        : isLowSpace && col.key === "subSection"
                        ? 300
                        : undefined,
                    zIndex:
                      isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                        ? 2
                        : undefined,
                    background:
                      isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                        ? "#fff"
                        : undefined,
                    boxShadow:
                      isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                        ? "2px 0 2px -1px #eee"
                        : undefined,
                  }}
                >
                  {col.label}
                </th>
              ))}
              {actionIcon && <th>Action</th>}
            </tr>
          </thead>
          <tbody >
            {data.map((row, rowIndex) => (
              <>
                <tr key={rowIndex} style={{ margin: "0", padding: "0" }}>
                  {showCheckbox && (
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          isRowSelected 
                            ? isRowSelected(row.id) 
                            : selectedRows.some(
                                (selectedRow) => selectedRow.id === row.id
                              )
                        }
                        onChange={() => handleRowSelection(rowIndex)}
                      />
                    </td>
                  )}
                  {reorderedColumns.map((col, cellIndex) => {
                    const cell =
                      col.key === "srNo"
                        ? (currentPage - 1) * pageSize + rowIndex + 1
                        : row[col.key];
                    const cellContent = customRender[col.key]
                      ? customRender[col.key](cell, rowIndex, row)
                      : cell;
                    // Tooltip logic for low space: show for all except srNo
                    const showTooltip = isLowSpace && col.key !== "srNo";
                    // Tooltip content: try to stringify if not string
                    const tooltipValue =
                      typeof cellContent === "string"
                        ? cellContent
                        : typeof cell === "string"
                        ? cell
                        : cell !== undefined && cell !== null
                        ? String(cell)
                        : "";
                        // console.log("col",col);
                        
                    return (
                      <td
                        key={cellIndex}
                        style={{
                          textAlign: "left",
                          whiteSpace: enableOverflowScroll ? "nowrap" : "normal",
                          overflow: enableOverflowScroll ? "hidden" : "visible",
                          textOverflow: enableOverflowScroll ? "ellipsis" : "clip",
                          width:
                            col.key === "srNo"
                              ? "100px !important"
                              : isLowSpace
                              ? "10px !important"
                              : "70px !important",
                          padding: isLowSpace ? "0 5px" : "",
                          minWidth: isMinWidth && col.key !== "srNo" ? "180px" : "",
                          position:
                            isLowSpace && col.key === "srNo"
                              ? "sticky"
                              : isLowSpace && col.key === "descriptionOfItem"
                              ? "sticky"
                              : isLowSpace && col.key === "section"
                              ? "sticky"
                              : isLowSpace && col.key === "subSection"
                              ? "sticky"
                              : undefined,
                          left:
                            isLowSpace && col.key === "srNo"
                              ? 0
                              : isLowSpace && col.key === "descriptionOfItem"
                              ? 50
                              : isLowSpace && col.key === "section"
                              ? 180
                              : isLowSpace && col.key === "subSection"
                              ? 300
                              : undefined,
                          zIndex:
                            isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                              ? 1
                              : undefined,
                          background:
                            isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                              ? "#fff"
                              : undefined,
                          boxShadow:
                            isLowSpace && ["srNo", "descriptionOfItem", "section", "subSection"].includes(col.key)
                              ? "2px 0 2px -1px #eee"
                              : undefined,
                        }}
                        onMouseEnter={
                          showTooltip && isLowSpace
                            ? (e) => {
                                setTooltipAnchor(e.currentTarget);
                                setTooltipContent(tooltipValue);
                              }
                            : undefined
                        }
                        onMouseLeave={
                          showTooltip && isLowSpace
                            ? () => {
                                setTooltipAnchor(null);
                                setTooltipContent("");
                              }
                            : undefined
                        }
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
                  <tr style={{ border: "none" }}>
                    <td
                      colSpan={columns.length + 1}
                      style={{ padding: "0", margin: "0" }}
                    >
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
      {/* Tooltip for low space cell */}
      {isLowSpace && tooltipContent !== "" && tooltipContent !== "-" && (
        <InfoTooltip content={tooltipContent} anchorEl={tooltipAnchor} />
      )}
    </div>
  );
}
