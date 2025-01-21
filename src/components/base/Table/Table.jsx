// import React, { useState, useEffect } from "react";

// export default function Table({
//   columns,
//   data,
//   onActionClick = null,
//   showCheckbox = false,
//   actionIcon = null,
//   ...rest
// }) {
//   const [selectAll, setSelectAll] = useState(false); 
//   const [selectedRows, setSelectedRows] = useState([]); 

//   const handleCheckboxChange = (rowIndex) => {
//     const updatedSelectedRows = [...selectedRows];
//     if (updatedSelectedRows.includes(rowIndex)) {
//       updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
//     } else {
//       updatedSelectedRows.push(rowIndex);
//     }
//     // @ts-ignore
//     setSelectedRows(updatedSelectedRows);
//   };

//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       setSelectedRows([]); 
//     } else {
//       setSelectedRows(data.map((_, index) => index)); 
//     }
//     setSelectAll(!selectAll);
//   };

//   useEffect(() => {
//     if (selectedRows.length === data.length) {
//       setSelectAll(true); 
//     } else {
//       setSelectAll(false); 
//     }
//   }, [selectedRows, data.length]);

//   return (
//     <div className="tbl-container px-0 mt-3" {...rest}>
//       <table className="w-100">
//         <thead>
//           <tr>
//             {showCheckbox && (
//               <th style={{ width: "50px", paddingLeft:'15px',paddingTop:'15px' }}>
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAllChange}
//                 />
//               </th>
//             )}
//             {columns.map((col, index) => (
//               <th key={index} className="main2-th">
//                 {col.label}
//               </th>
//             ))}
//             {actionIcon && <th>Action</th>}
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {showCheckbox && (
//                 <td>
//                   <input
//                     type="checkbox"
//                     // @ts-ignore
//                     checked={selectedRows.includes(rowIndex)} 
//                     onChange={() => handleCheckboxChange(rowIndex)} 
//                   />
//                 </td>
//               )}
//               {columns.map((col, cellIndex) => {
//                 const cell = row[col.key];
//                 let cellContent = cell;

//                 if (Array.isArray(cell)) {
//                   cellContent = (
//                     <table>
//                       <tbody>
//                         {cell.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   );
//                 } else if (
//                   col.key === "date" ||
//                   col.key === "liveOn" ||
//                   col.key === "createdOn"
//                 ) {
//                   cellContent = (
//                     <input
//                       className="form-control"
//                       type="date"
//                       defaultValue={cell}
//                     />
//                   );
//                 } else if (col.key === "checkbox") {
//                   cellContent = (
//                     <input type="checkbox" checked={cell} className="w-full" />
//                   );
//                 }

//                 return (
//                   <td key={cellIndex} style={{ whiteSpace: "nowrap" }}>
//                     {cellContent}
//                   </td>
//                 );
//               })}

//               {actionIcon && onActionClick && (
//                 <td>
//                   <button
//                     className="p-2 bg-white border"
//                     // @ts-ignore
//                     onClick={() => onActionClick(rowIndex)}
//                   >
//                     {actionIcon}
//                   </button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

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

  if (isHorizontal) {
    const transposedData = transposeData(data, columns);
    return (
      <div className="mb-0" {...rest} style={{ overflowX: "auto" }}>
        <table
          className="bid-tbl w-100"
          style={{
            boxShadow: "none",
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <colgroup>
            <col style={{ width: "200px" }} />
            {data.map((_, index) => (
              <col key={index} style={{ width: "250px" }} />
            ))}
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            {transposedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className="main2-th"
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    width: "200px",
                  }}
                >
                  {row.header}
                </td>
                {row.values.map((value, valueIndex) => (
                  <td
                    key={valueIndex}
                    style={{
                      width: "250px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {customRender[columns[rowIndex]?.key]
                      ? customRender[columns[rowIndex]?.key](
                          value,
                          valueIndex,
                          data[valueIndex]
                        )
                      : value}
                  </td>
                ))}
                <td style={{ width: "auto" }}></td>
              </tr>
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
                style={{ whiteSpace: "nowrap" }}
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
