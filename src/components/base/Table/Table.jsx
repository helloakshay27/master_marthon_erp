import React, { useState, useEffect } from "react";

export default function Table({
  columns,
  data,
  onActionClick = null,
  showCheckbox = false,
  actionIcon = null,
  ...rest
}) {
  const [selectAll, setSelectAll] = useState(false); 
  const [selectedRows, setSelectedRows] = useState([]); 

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

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]); 
    } else {
      setSelectedRows(data.map((_, index) => index)); 
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedRows.length === data.length) {
      setSelectAll(true); 
    } else {
      setSelectAll(false); 
    }
  }, [selectedRows, data.length]);

  return (
    <div className="tbl-container px-0 mt-3" {...rest}>
      <table className="w-100">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ width: "50px", paddingLeft:'15px',paddingTop:'15px' }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
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
                    checked={selectedRows.includes(rowIndex)} 
                    onChange={() => handleCheckboxChange(rowIndex)} 
                  />
                </td>
              )}
              {columns.map((col, cellIndex) => {
                const cell = row[col.key];
                let cellContent = cell;

                if (Array.isArray(cell)) {
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
                  cellContent = (
                    <input
                      className="form-control"
                      type="date"
                      defaultValue={cell}
                    />
                  );
                } else if (col.key === "checkbox") {
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
