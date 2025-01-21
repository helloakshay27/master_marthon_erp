import React, { useState, useEffect } from "react";

// Utility to transpose data for horizontal alignment
const transposeData = (data, columns) => {
  const keys = columns.map((col) => col.key);
  return keys.map((key, colIndex) => ({
    header: columns[colIndex].label,
    values: data.map((row) => row[key]),
  }));
};

// export default function Table({
//   columns,
//   data,
//   onActionClick = null,
//   showCheckbox = false,
//   actionIcon = null,
//   isSelectCheckboxes = null,
//   customRender = {}, // New prop to dynamically handle custom rendering
//   isHorizontal = false,
//   ...rest
// }) {
//   const [selectAll, setSelectAll] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);

//   useEffect(() => {
//     if (isSelectCheckboxes) {
//       setSelectedRows(data.map((_, index) => index));
//     } else {
//       setSelectedRows([]);
//     }
//   }, [isSelectCheckboxes, data.length]);

//   useEffect(() => {
//     if (selectedRows.length === data.length) {
//       setSelectAll(true);
//     } else {
//       setSelectAll(false);
//     }
//   }, [selectedRows, data.length]);

//   const handleCheckboxChange = (rowIndex) => {
//     const updatedSelectedRows = [...selectedRows];
//     if (updatedSelectedRows.includes(rowIndex)) {
//       updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
//     } else {
//       updatedSelectedRows.push(rowIndex);
//     }
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

//   if (isHorizontal) {
//     const transposedData = transposeData(data, columns);
//     return (
//       <div className="bid-tbl px-0 mt-3" {...rest}>
//         <table className="w-100">
//           <thead className="">
//             <tr style={{backgroundColor: '#d3d3d3 !important'}}>
//               <th />
//               {data.map((_, index) => (
//                 <th key={index} className="main2-th"></th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {transposedData.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 <td className="main2-th" style={{fontWeight: "bold", textAlign:'left'}}>{row.header}</td>
//                 {row.values.map((value, valueIndex) => (
//                   <td
//                     key={valueIndex}
//                   >
//                     {customRender[columns[rowIndex]?.key]
//                       ? customRender[columns[rowIndex]?.key](
//                           value,
//                           valueIndex,
//                           data[valueIndex]
//                         )
//                       : value}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   return (
//     <div className="tbl-container px-0 mt-3" {...rest}>
//       <table className="w-100">
//         <thead>
//           <tr>
//             {showCheckbox && (
//               <th style={{ width: "50px", textAlign: "center" }}>
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
//                     checked={selectedRows.includes(rowIndex)}
//                     onChange={() => handleCheckboxChange(rowIndex)}
//                   />
//                 </td>
//               )}
//               {columns.map((col, cellIndex) => {
//                 const cell = row[col.key];
//                 const cellContent = customRender[col.key]
//                   ? customRender[col.key](cell, rowIndex, row)
//                   : cell;

//                 return <td key={cellIndex}>{cellContent}</td>;
//               })}
//               {actionIcon && onActionClick && (
//                 <td>
//                   <button
//                     className="p-2 bg-white border"
//                     style={{ color: "#de7008" }}
//                     onClick={onActionClick}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="currentColor"
//                       className="bi bi-eye"
//                       viewBox="0 0 16 16"
//                     >
//                       <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
//                       <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
//                     </svg>
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



export default function TableWithPagination({
  columns,
  data,
  onActionClick = null,
  showCheckbox = false,
  actionIcon = null,
  isSelectCheckboxes = null,
  customRender = {},
  isHorizontal = false,
  onRowSelect, 
  handleCheckboxChange, 
  rowsPerPage = 50,
  
  
  // Callback function to notify parent component of selected rows
  ...rest
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data
    .filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        // .includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Search handler


  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  // const handleCheckboxChange = (rowIndex) => {
  //   const updatedSelectedRows = [...selectedRows];
  //   if (updatedSelectedRows.includes(rowIndex)) {
  //     updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
  //   } else {
  //     updatedSelectedRows.push(rowIndex);
  //   }
  //   setSelectedRows(updatedSelectedRows);

  //   // Notify parent component of selected rows
  //   if (onRowSelect) {
  //     onRowSelect(updatedSelectedRows.map((index) => data[index]));  // Pass selected rows' data to parent
  //   }
  // };

  const handleRowSelection = (rowIndex) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowIndex)) {
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
    } else {
      updatedSelectedRows.push(rowIndex);
    }
    setSelectedRows(updatedSelectedRows);

    // Notify parent component of selected rows
    handleCheckboxChange(data[rowIndex], updatedSelectedRows.includes(rowIndex));  // Pass selected rows' data to parent
  };

  // const handleSelectAllChange = () => {
  //   if (selectAll) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(data.map((_, index) => index));
  //   }
  //   setSelectAll(!selectAll);

  //   // Notify parent component when all rows are selected or deselected
  //   if (onRowSelect) {
  //     onRowSelect(data.map((_, index) => data[index]));  // Pass all data if all are selected
  //   }
  // };


  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedSelectedRows = newSelectAll ? data.map((_, index) => index) : [];
    setSelectedRows(updatedSelectedRows);

    // Notify parent component when all rows are selected or deselected
    updatedSelectedRows.forEach((index) => {
      handleCheckboxChange(data[index], newSelectAll);  // Pass all selected rows' data to parent
    });
  };


  if (isHorizontal) {
    const transposedData = transposeData(data, columns);
    return (
      <div className="bid-tbl px-0 mt-3" {...rest}>
        <table className="w-100">
          <thead>
            <tr style={{backgroundColor: '#d3d3d3'}}>
              <th />
              {data.map((_, index) => (
                <th key={index} className="main2-th"></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="main2-th" style={{fontWeight: "bold", textAlign: 'left'}}>{row.header}</td>
                {row.values.map((value, valueIndex) => (
                  <td key={valueIndex}>
                    {customRender[columns[rowIndex]?.key]
                      ? customRender[columns[rowIndex]?.key](
                          value,
                          valueIndex,
                          data[valueIndex]
                        )
                      : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
    <div className="tbl-container px-0 mt-3" style={{maxHeight:"300px"}} {...rest}>
      <table className="w-100">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ width: "50px", textAlign: "center" }}>
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
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {showCheckbox && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={() => handleRowSelection(rowIndex)}
                  />
                </td>
              )}
              {columns.map((col, cellIndex) => {
                const cell = row[col.key];
                const cellContent = customRender[col.key]
                  ? customRender[col.key](cell, rowIndex, row)
                  : cell;

                return <td key={cellIndex}>{cellContent}</td>;
              })}
              {actionIcon && onActionClick && (
                <td>
                  <button
                    className="p-2 bg-white border"
                    style={{ color: "#de7008" }}
                    onClick={onActionClick}
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
    {/* Pagination Controls */}
<nav className="d-flex justify-content-between w-100 align-items-center px-3 mt-2">
  <ul
    className="pagination justify-content-center align-items-center"
    style={{ listStyleType: "none", padding: "0px" }}
  >
    {/* First Page */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        style={{
          padding: "8px 12px",
          color: "var(--red)",
        }}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        ««
      </button>
    </li>

    {/* Previous Page */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        style={{
          padding: "8px 12px",
          color: "var(--red)",
        }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
    </li>

    {/* Current Page */}
    <li className="page-item active">
      <button
        className="page-link"
        style={{
          padding: "8px 12px",
          color: "rgb(255, 255, 255)",
          backgroundColor: " var(--red)",
          border: "2px solid var(--red)",
          borderRadius: "3px",
        }}
      >
        {currentPage}
      </button>
    </li>

    {/* Next Page */}
    <li
      className={`page-item ${
        currentPage === totalPages ? "disabled" : ""
      }`}
    >
      <button
        className="page-link"
        style={{
          padding: "8px 12px",
          color: "rgb(94, 39, 80)",
        }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </li>

    {/* Last Page */}
    <li
      className={`page-item ${
        currentPage === totalPages ? "disabled" : ""
      }`}
    >
      <button
        className="page-link"
        style={{
          padding: "8px 12px",
          color: "rgb(94, 39, 80)",
        }}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        »»
      </button>
    </li>
  </ul>

  {/* Showing Entries Info */}
  <p
    className="text-center"
    style={{ marginTop: "10px", color: "rgb(85, 85, 85)" }}
  >
    Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
    {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
  </p>
</nav>

    </>
  );
}
