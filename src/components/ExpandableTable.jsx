import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
// const ExpandableTable = () => {
//   // Sample data for the table
//   const [data, setData] = useState([
//     {
//       id: 1,
//       category: "Main Category",
//       subcategories: [
//         {
//           id: 1.1,
//           category: "Sub-Category Lvl 2",
//           subcategories: [
//             {
//               id: 1.11,
//               category: "Sub-Category Lvl 3",
//               details: "Additional nested details for RCC1",
//               values: [2000000, 1255000, 1255000],
//             },
//           ],
//           values: [4000000, 1000000, 900000],
//         },
//       ],
//       values: [4500000, 1300000, 1100000],
//     },
//   ]);

//   // State to manage expanded rows
//   const [expandedRows, setExpandedRows] = useState([]);

//   // Handle expand/collapse
//   const toggleExpand = (id) => {
//     setExpandedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="tbl-container mx-3 mt-2" style={{ maxHeight: "700px" }}>
//       <table
//         style={{ width: "max-content", maxHeight: "max-content", height: "auto" }}
//       >
//         <thead>
//           <tr>
//             <th>Expand</th>
//             <th>Sr.no</th>
//             <th>Category level</th>
//             <th>Details</th>
//             <th>Budget</th>
//             <th>Order Draft Value (WO/PO)</th>
//             <th>Order Approved Value (WO/PO)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <React.Fragment key={item.id}>
//               {/* Main Row */}
//               <tr>
//                 <td onClick={() => toggleExpand(item.id)}>
//                   {expandedRows.includes(item.id) ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="currentColor"
//                       viewBox="0 0 16 16"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="currentColor"
//                       viewBox="0 0 16 16"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M8 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 8 2z"
//                       />
//                       <path
//                         fillRule="evenodd"
//                         d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8z"
//                       />
//                     </svg>
//                   )}
//                 </td>
//                 <td>{item.id}</td>
//                 <td>{item.category}</td>
//                 <td></td>
//                 {item.values.map((value, index) => (
//                   <td key={index}>{value}</td>
//                 ))}
//               </tr>

//               {/* Subcategories */}
//               {expandedRows.includes(item.id) &&
//                 item.subcategories.map((sub) => (
//                   <React.Fragment key={sub.id}>
//                     <tr>
//                       <td onClick={() => toggleExpand(sub.id)}>
//                         {expandedRows.includes(sub.id) ? "-" : "+"}
//                       </td>
//                       <td>{sub.id}</td>
//                       <td>{sub.category}</td>
//                       <td></td>
//                       {sub.values.map((value, index) => (
//                         <td key={index}>{value}</td>
//                       ))}
//                     </tr>

//                     {/* Nested Subcategories */}
//                     {expandedRows.includes(sub.id) &&
//                       sub.subcategories.map((nested) => (
//                         <tr key={nested.id}>
//                           <td></td>
//                           <td>{nested.id}</td>
//                           <td>{nested.category}</td>
//                           <td>{nested.details}</td>
//                           {nested.values.map((value, index) => (
//                             <td key={index}>{value}</td>
//                           ))}
//                         </tr>
//                       ))}
//                   </React.Fragment>
//                 ))}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ExpandableTable;


// import React, { useState } from "react";

const ExpandableTable = () => {
    // State to track expanded rows
    const [expandedRows, setExpandedRows] = useState([]);

    // Function to toggle row expansion
    const toggleRow = (rowId) => {
        setExpandedRows((prev) =>
            prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
        );
    };

    return (
        <div className="tbl-container mx-3 mt-2" style={{ maxHeight: "700px" }}>
            <table
                className=""
                style={{ width: "max-content", maxHeight: "max-content", height: "auto" }}
            >
                <thead style={{ zIndex: "111 " }}>
                    <tr>
                        <th className="text-center" colSpan={7}>
                            BUDGET
                        </th>
                        <th className="text-center" colSpan={3}>
                            Amount Contracted
                        </th>
                        <th className="text-center" colSpan={2}>
                            Miscellaneous Expenses
                        </th>
                        <th className="text-center" colSpan={2}>
                            Budget Balance
                        </th>
                        <th className="text-center" colSpan={1}>
                            Debit
                        </th>
                        <th className="text-center" colSpan={7}>
                            Abstract & GRN
                        </th>
                        <th className="text-center" colSpan={3}>
                            BILL Certified
                        </th>
                        <th className="text-center" colSpan={3}>
                            Advance Details
                        </th>
                        <th className="text-center">Balance</th>
                    </tr>
                    <tr>
                        <th className="text-center" colSpan={6}>
                            References
                        </th>
                        <th className="text-center">A</th>
                        <th className="text-center">B</th>
                        <th className="text-center">C</th>
                        <th className="text-center">D</th>
                        <th className="text-center">E</th>
                        <th className="text-center">F</th>
                        <th className="text-center">G = A-B-E</th>
                        <th className="text-center">H</th>
                        <th className="text-center">I</th>
                        <th className="text-center">J</th>
                        <th className="text-center">K</th>
                        <th className="text-center">L</th>
                        <th className="text-center">M</th>
                        <th className="text-center">N = J-M</th>
                        <th className="text-center">O = J-K</th>
                        <th className="text-center">P = (J-N)/A</th>
                        <th className="text-center">Q</th>
                        <th className="text-center">R</th>
                        <th className="text-center">S = Q-R</th>
                        <th className="text-center">T</th>
                        <th className="text-center">U</th>
                        <th className="text-center">V = T - U</th>
                        <th className="text-center">W = A-Q-T-F</th>
                    </tr>
                    <tr>
                        <th className="text-start">Expand</th>
                        <th className="text-start">Sr.no</th>
                        <th className="text-start">Category level</th>
                        <th className="text-start">WBS Code</th>
                        <th className="text-start">Type</th>
                        <th className="text-start">Category</th>
                        <th className="text-start">Budget</th>
                        <th className="text-start">Order Draft Value (WO/PO)</th>
                        <th className="text-start">Order Submit Value (WO/PO)</th>
                        <th className="text-start">Order Approved Value (WO/PO)</th>
                        <th className="text-start">Miscellaneous Expenses Certified</th>
                        <th className="text-start">Miscellaneous Expenses Paid</th>
                        <th className="text-start">Balance Budget</th>
                        <th className="text-start">% Balance</th>
                        <th className="text-start">Debit Note WO/PO</th>
                        <th className="text-start">Abstract & GRN Total Value</th>
                        <th className="text-start">Abstract & GRN Certified</th>
                        <th className="text-start">Material Issued</th>
                        <th className="text-start">Material Consumed</th>
                        <th className="text-start">Stock at Site (Inventory)</th>
                        <th className="text-start">Abstract & GRN - Pending</th>
                        <th className="text-start">% Completion</th>
                        <th className="text-start">Total Bills Value (WO/PO)</th>
                        <th className="text-start">Total Bills Paid Value (WO/PO)</th>
                        <th className="text-start">Bill Balance Value</th>
                        <th className="text-start">Total Advance Paid (WO/PO)</th>
                        <th className="text-start">Total Advance Adjusted (WO/PO)</th>
                        <th className="text-start">Total Outstanding Advance (WO/PO)</th>
                        <th className="text-start">Balance yet to be Paid</th>
                    </tr>
                </thead>
                <tbody style={{ zIndex: "11" }}>
                    <tr className="main-category">
                        <td onClick={() => toggleRow("row1")}>
                            {expandedRows.includes("row1") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Square */}
                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                    {/* Minus Icon */}
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Square */}
                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                    {/* Plus Icon */}
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            )}
                        </td>
                        <td>1</td>
                        <td>Main Category</td>
                        <td>Civil Work</td>
                        <td></td>
                        <td>Civil Work</td>
                        <td>4,500,000</td>
                        <td>13,00,000</td>
                        <td>9,00,000</td>
                        <td>1,100,000</td>
                        <td>1,00,000</td>
                        <td>40,000</td>
                        <td>30%</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>40,000</td>
                        <td>4,000</td>
                        <td>40,000</td>
                        <td>40,00</td>
                        <td>40,00</td>
                        <td>40,00</td>
                        <td>4,390,000</td>
                    </tr>

                    {/* Sub-row (conditionally rendered) */}
                    {expandedRows.includes("row1") && (
                        <>
                        <tr className="collapseRow1  category-lvl2">
                            <td onClick={() => toggleRow("row1.1")}>
                                {expandedRows.includes("row1") ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Minus Icon */}
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Plus Icon */}
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                )}
                            </td>
                            <td>1.1</td>
                            <td>Sub-Category Lvl 2</td>
                            <td>RCC</td>
                            <td></td>
                            <td></td>
                            <td>40,00,000</td>
                            <td>10,00,000 (Total Draft Value)</td>
                            <td>9,00,000</td>
                            <td>1,100,000</td>
                            <td>1,00,000</td>
                            <td>1,00,000</td>
                            <td>72.50%</td>
                            <td>1,00,000</td>
                            <td>2,900,000</td>
                            <td>72.50%</td>
                            <td>4,00,000</td>
                            <td>8,00,000</td>
                            <td>6,00,000</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>2,00,000</td>
                            <td>20%</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>



                        <tr class="collapse collapseRow1  reference-label sub-category-lvl3">
                            <td onClick={() => toggleRow("row1.1.1")}>
                                {expandedRows.includes("row1") ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Minus Icon */}
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Plus Icon */}
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                )}
                            </td>
                            <td>1.1.1

                            </td>
                            <td>Sub-Category Lvl3

                            </td>
                            <td>RCC1</td>
                            <td></td>
                            <td></td>
                            <td>20,00,000
                            </td>
                            <td>1,255,000</td>
                            <td>1,255,000
                            </td>
                            <td></td>
                            <td>
                            </td>
                            <td>

                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>

                        </tr>
                        </>

                    )}


                </tbody>
            </table>
        </div>
    );
};

export default ExpandableTable;






//reusable for api
// import React, { useState } from "react";

// const ExpandableTable = ({ data, getRowId, expandableContent }) => {
//     const [expandedRows, setExpandedRows] = useState([]);

//     // Function to toggle row expansion
//     const toggleRow = (rowId) => {
//         setExpandedRows((prev) =>
//             prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
//         );
//     };

//     return (
//         <div className="tbl-container mx-3 mt-2" style={{ maxHeight: "700px" }}>
//             <table
//                 className=""
//                 style={{ width: "max-content", maxHeight: "max-content", height: "auto" }}
//             >
//                 <thead style={{ zIndex: "111" }}>
//                     <tr>
//                         <th className="text-center" colSpan={7}>
//                             BUDGET
//                         </th>
//                         <th className="text-center" colSpan={3}>
//                             Amount Contracted
//                         </th>
//                         <th className="text-center" colSpan={2}>
//                             Miscellaneous Expenses
//                         </th>
//                         <th className="text-center" colSpan={2}>
//                             Budget Balance
//                         </th>
//                         <th className="text-center" colSpan={1}>
//                             Debit
//                         </th>
//                         <th className="text-center" colSpan={7}>
//                             Abstract & GRN
//                         </th>
//                         <th className="text-center" colSpan={3}>
//                             BILL Certified
//                         </th>
//                         <th className="text-center" colSpan={3}>
//                             Advance Details
//                         </th>
//                         <th className="text-center">Balance</th>
//                     </tr>
//                     <tr>
//                         <th className="text-center" colSpan={6}>
//                             References
//                         </th>
//                         <th className="text-center">A</th>
//                         <th className="text-center">B</th>
//                         <th className="text-center">C</th>
//                         <th className="text-center">D</th>
//                         <th className="text-center">E</th>
//                         <th className="text-center">F</th>
//                         <th className="text-center">G = A-B-E</th>
//                         <th className="text-center">H</th>
//                         <th className="text-center">I</th>
//                         <th className="text-center">J</th>
//                         <th className="text-center">K</th>
//                         <th className="text-center">L</th>
//                         <th className="text-center">M</th>
//                         <th className="text-center">N = J-M</th>
//                         <th className="text-center">O = J-K</th>
//                         <th className="text-center">P = (J-N)/A</th>
//                         <th className="text-center">Q</th>
//                         <th className="text-center">R</th>
//                         <th className="text-center">S = Q-R</th>
//                         <th className="text-center">T</th>
//                         <th className="text-center">U</th>
//                         <th className="text-center">V = T - U</th>
//                         <th className="text-center">W = A-Q-T-F</th>
//                     </tr>
//                     <tr>
//                         <th className="text-start">Expand</th>
//                         <th className="text-start">Sr.no</th>
//                         <th className="text-start">Category level</th>
//                         <th className="text-start">WBS Code</th>
//                         <th className="text-start">Type</th>
//                         <th className="text-start">Category</th>
//                         <th className="text-start">Budget</th>
//                         <th className="text-start">Order Draft Value (WO/PO)</th>
//                         <th className="text-start">Order Submit Value (WO/PO)</th>
//                         <th className="text-start">Order Approved Value (WO/PO)</th>
//                         <th className="text-start">Miscellaneous Expenses Certified</th>
//                         <th className="text-start">Miscellaneous Expenses Paid</th>
//                         <th className="text-start">Balance Budget</th>
//                         <th className="text-start">% Balance</th>
//                         <th className="text-start">Debit Note WO/PO</th>
//                         <th className="text-start">Abstract & GRN Total Value</th>
//                         <th className="text-start">Abstract & GRN Certified</th>
//                         <th className="text-start">Material Issued</th>
//                         <th className="text-start">Material Consumed</th>
//                         <th className="text-start">Stock at Site (Inventory)</th>
//                         <th className="text-start">Abstract & GRN - Pending</th>
//                         <th className="text-start">% Completion</th>
//                         <th className="text-start">Total Bills Value (WO/PO)</th>
//                         <th className="text-start">Total Bills Paid Value (WO/PO)</th>
//                         <th className="text-start">Bill Balance Value</th>
//                         <th className="text-start">Total Advance Paid (WO/PO)</th>
//                         <th className="text-start">Total Advance Adjusted (WO/PO)</th>
//                         <th className="text-start">Total Outstanding Advance (WO/PO)</th>
//                         <th className="text-start">Balance yet to be Paid</th>
//                     </tr>
//                 </thead>
//                 <tbody style={{ zIndex: "11" }}>
//                     {data.map((row, index) => {
//                         const rowId = getRowId(row, index);
//                         return (
//                             <React.Fragment key={rowId}>
//                                 <tr className="main-category">
//                                     <td onClick={() => toggleRow(rowId)}>
//                                         {expandedRows.includes(rowId) ? (
//                                             <svg> {/* Minus Icon SVG */} </svg>
//                                         ) : (
//                                             <svg> {/* Plus Icon SVG */} </svg>
//                                         )}
//                                     </td>
//                                     <td>{row.srNo}</td>
//                                     <td>{row.categoryLevel}</td>
//                                     <td>{row.wbsCode}</td>
//                                     <td>{row.type}</td>
//                                     <td>{row.category}</td>
//                                     <td>{row.budget}</td>
//                                     {/* Add other fields as necessary */}
//                                 </tr>
//                                 {expandedRows.includes(rowId) && expandableContent && (
//                                     <tr className="collapseRow">
//                                         <td colSpan={28}>
//                                             {expandableContent(row)}
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ExpandableTable;


