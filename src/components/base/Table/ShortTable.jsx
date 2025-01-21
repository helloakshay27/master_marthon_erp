// import React from "react";

// export default function ShortTable({ data, editable = false, onValueChange }) {
//   const handleInputChange = (index, newValue) => {
//     const updatedData = [...data];
//     updatedData[index].value = newValue;
//     onValueChange(updatedData);
//   };

//   return (
//     <table
//       className="tbl-container mt-4 ShortTable"
//       style={{ width: "40% !important" }}
//     >
//       <tbody>
//         {data.map((row, index) => (
//           <tr
//             key={index}
//             style={{ borderBottom: "1px solid #ddd", color: "#fff" }}
//           >
//             <td
//               style={{
//                 padding: "12px",
//                 fontWeight: "bold",
//                 background: "#de7008",
//               }}
//             >
//               {row.label}
//             </td>
//             <td style={{ padding: "12px", color: "#777" }}>
//               {editable ? (
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={row.value}
//                   onChange={(e) => handleInputChange(index, e.target.value)}
//                 />
//               ) : (
//                 row.value
//               )}

//               {/* {row.value} */}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

import React from "react";

// export default function ShortTable({ data, editable = false, onValueChange, ...rest }) {
//   const handleInputChange = (index, newValue) => {
//     const updatedData = [...data];
//     updatedData[index].value = newValue;

//     // Custom calculation for Freight and GST
//     if (updatedData[index].label === "Freight Charge") {
//       const freightCharge = parseFloat(newValue.replace(/₹|,/g, "")) || 0;
//       const gstOnFreight =
//         parseFloat(
//           updatedData
//             .find((row) => row.label === "GST on Freight")
//             .value.replace(/%/g, "")
//         ) || 0;
//       const realisedFreight = (freightCharge * gstOnFreight) / 100;

//       // Update Realized Freight
//       const realisedFreightIndex = updatedData.findIndex(
//         (row) => row.label === "Realised Freight"
//       );
//       if (realisedFreightIndex !== -1) {
//         updatedData[realisedFreightIndex].value = `₹${(
//           freightCharge + realisedFreight
//         ).toFixed(2)}`;
//       }
//     } else if (updatedData[index].label === "GST on Freight") {
//       const gstOnFreight = parseFloat(newValue.replace(/%/g, "")) || 0;
//       const freightCharge =
//         parseFloat(
//           updatedData
//             .find((row) => row.label === "Freight Charge")
//             .value.replace(/₹|,/g, "")
//         ) || 0;
//       const realisedFreight = (freightCharge * gstOnFreight) / 100;

//       // Update Realized Freight
//       const realisedFreightIndex = updatedData.findIndex(
//         (row) => row.label === "Realised Freight"
//       );
//       if (realisedFreightIndex !== -1) {
//         updatedData[realisedFreightIndex].value = `₹${(
//           freightCharge + realisedFreight
//         ).toFixed(2)}`;
//       }
//     }

//     onValueChange(updatedData);
//   };

//   return (
//     <table
//       className="tbl-container mt-4 ShortTable"
//       style={{ width: "40% !important" }}
//       {...rest}
//     >
//       <tbody>
//         {data.map((row, index) => (
//           <tr
//             key={index}
//             style={{ borderBottom: "1px solid #ddd", color: "#fff" }}
//           >
//             <td
//               style={{
//                 padding: "12px",
//                 fontWeight: "bold",
//                 background: "#de7008",
//               }}
//             >
//               {row.label}
//             </td>
//             <td style={{ padding: "12px", color: "#777" }}>
//               {/* If the row label is "Realised Freight", make it non-editable */}
//               {row.label === "Realised Freight" ? (
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={row.value}
//                   // onChange={(e) => handleInputChange(index, e.target.value)}

//                   disabled
//                 />
//               ) : editable ? (
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={row.value}
//                   onChange={(e) => handleInputChange(index, e.target.value)}
//                 />
//               ) : (
//                 row.value
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

export default function ShortTable({
  data,
  editable = false,
  onValueChange,
  ...rest
}) {
  const handleInputChange = (index, newValue) => {
    const updatedData = [...data];
    updatedData[index].value = newValue;

    // Custom calculation for Freight and GST
    if (updatedData[index].label === "Freight Charge") {
      const freightCharge = parseFloat(newValue.replace(/₹|,/g, "")) || 0;
      const gstOnFreight =
        parseFloat(
          updatedData
            .find((row) => row.label === "GST on Freight")
            .value.replace(/%/g, "")
        ) || 0;
      const realisedFreight = (freightCharge * gstOnFreight) / 100;

      // Update Realized Freight
      const realisedFreightIndex = updatedData.findIndex(
        (row) => row.label === "Realised Freight"
      );
      if (realisedFreightIndex !== -1) {
        updatedData[realisedFreightIndex].value = `₹${(
          freightCharge + realisedFreight
        ).toFixed(2)}`;
      }
    } else if (updatedData[index].label === "GST on Freight") {
      const gstOnFreight = parseFloat(newValue.replace(/%/g, "")) || 0;
      const freightCharge =
        parseFloat(
          updatedData
            .find((row) => row.label === "Freight Charge")
            .value.replace(/₹|,/g, "")
        ) || 0;
      const realisedFreight = (freightCharge * gstOnFreight) / 100;

      // Update Realized Freight
      const realisedFreightIndex = updatedData.findIndex(
        (row) => row.label === "Realised Freight"
      );
      if (realisedFreightIndex !== -1) {
        updatedData[realisedFreightIndex].value = `₹${(
          freightCharge + realisedFreight
        ).toFixed(2)}`;
      }
    }

    onValueChange(updatedData);
  };

  return (
    <table
      className="tbl-container mt-4 ShortTable"
      style={{ width: "40% !important" }}
      {...rest}
    >
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            style={{ borderBottom: "1px solid #ddd", color: "#fff" }}
          >
            <td
              style={{
                padding: "12px",
                fontWeight: "bold",
                background: "#de7008",
              }}
            >
              {row.label}
            </td>
            <td style={{ padding: "12px", color: "#777" }}>
              {/* If the row label is "Realised Freight", make it non-editable */}
              {row.label === "Realised Freight" ? (
                <input
                  type="text"
                  className="form-control"
                  value={row.value}
                  disabled
                />
              ) : editable ? (
                <input
                  type="text"
                  className="form-control"
                  value={row.value}
                  onChange={(e) => {
                    const inputValue =
                      row.label === "Freight Charge"
                        ? e.target.value.replace(/[^0-9.]/g, "") // Allow only numeric input for Freight Charge
                        : e.target.value;
                    handleInputChange(index, inputValue);
                  }}
                />
              ) : (
                row.value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
