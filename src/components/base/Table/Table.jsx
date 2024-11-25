import React, { useState, useEffect } from "react";

export default function Table({
  columns,
  data,
  onActionClick = null,
  showCheckbox = false,
  actionIcon = null,
}) {
  const [selectAll, setSelectAll] = useState(false); // State to manage the select all checkbox
  const [selectedRows, setSelectedRows] = useState([]); // State to manage selected rows

  // Handle checkbox change for individual rows
  const handleCheckboxChange = (rowIndex) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowIndex)) {
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
    } else {
      updatedSelectedRows.push(rowIndex);
    }
    // @ts-ignore
    setSelectedRows(updatedSelectedRows);
  };

  // Handle select/deselect all checkboxes
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(data.map((_, index) => index)); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Update the "select all" checkbox based on the selected rows
  useEffect(() => {
    if (selectedRows.length === data.length) {
      setSelectAll(true); // All rows are selected
    } else {
      setSelectAll(false); // Not all rows are selected
    }
  }, [selectedRows, data.length]);

  return (
    <div className="tbl-container px-0 mt-3 mx-3">
      <table className="w-100">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ width: "50px" }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange} // Toggle all checkboxes
                />
              </th>
            )}
            {columns.map((col, index) => (
              <th key={index} className="main2-th">
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
                    // @ts-ignore
                    checked={selectedRows.includes(rowIndex)} // Check if this row is selected
                    onChange={() => handleCheckboxChange(rowIndex)} // Handle row checkbox change
                  />
                </td>
              )}
              {columns.map((col, cellIndex) => {
                const cell = row[col.key];
                let cellContent = cell;

                // Check if the field contains an array (like companyProject)
                if (Array.isArray(cell)) {
                  // Render it as a table of items
                  cellContent = (
                    <table>
                      <tbody>
                        {cell.map((item, index) => (
                          <tr key={index}>
                            <td>{item}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                } else if (
                  col.key === "date" ||
                  col.key === "liveOn" ||
                  col.key === "createdOn"
                ) {
                  // For date fields, use an input field for editing
                  cellContent = (
                    <input
                      className="form-control"
                      type="date"
                      defaultValue={cell}
                    />
                  );
                } else if (col.key === "checkbox") {
                  // For checkbox fields, use a checkbox input
                  cellContent = (
                    <input type="checkbox" checked={cell} className="w-full" />
                  );
                }

                return (
                  <td key={cellIndex} style={{ whiteSpace: "nowrap" }}>
                    {cellContent}
                  </td>
                );
              })}

              {actionIcon && onActionClick && (
                <td>
                  <button
                    className="p-2 bg-white border"
                    // @ts-ignore
                    onClick={() => onActionClick(rowIndex)}
                  >
                    {actionIcon}
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
