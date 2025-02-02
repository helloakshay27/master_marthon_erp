import React, { useState, useEffect } from "react";

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
  onActionClick = null,
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
  ...rest
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

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
      onColumnClick({ bid_id, material_id, vendor_id, ...data }, columnKey);
    }
  };

  if (isHorizontal) {
    const transposedData = transposeData(data, columns);

    // Extract the total amounts for the last row
    const totalAmounts = transposedData[transposedData.length - 1].values;
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
          <tbody>
            {transposedData.map((row, rowIndex) => (
              !["bid_id", "material_id", "vendor_id"].includes(columns[rowIndex]?.key) && (
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
                  {row.values.map((value, valueIndex) => (
                    value !== "" && (
                      <td
                        key={valueIndex}
                        style={{
                          width: "180px",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          backgroundColor:
                            ["totalAmount", "grossTotal"].includes(columns[rowIndex]?.key)
                              ? getBackgroundColor(value)
                              : "transparent",
                          fontWeight:
                            ["totalAmount", "grossTotal"].includes(columns[rowIndex]?.key)
                              ? "bold"
                              : "normal",
                          textTransform: "capitalize",
                        }}
                        onClick={() =>
                          handleColumnClick(data[valueIndex], columns[rowIndex]?.key)
                        }
                      >
                        {customRender[columns[rowIndex]?.key]
                          ? customRender[columns[rowIndex]?.key](
                              value,
                              valueIndex,
                              data[valueIndex]
                            )
                          : value}
                      </td>
                    )
                  ))}
                  <td style={{ width: "auto" }}></td>
                </tr>
              )
            ))}
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
                style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
              >
                {col.label}
              </th>
            ))}
            {actionIcon && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
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

                return <td key={cellIndex}>{cellContent}</td>;
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
          ))}
        </tbody>
      </table>
    </div>
  );
}


