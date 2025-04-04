import React from "react";

export default function ShortTable({
  data = [],
  editable = false,
  onValueChange,
  onInputClick, // New prop for handling input click
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
        updatedData[realisedFreightIndex].value = `₹${
          (freightCharge + realisedFreight
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
        updatedData[realisedFreightIndex].value = `₹ ${(freightCharge + realisedFreight).toFixed(2)}`;
      }
    }

    onValueChange(updatedData);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    onValueChange(updatedData);
  };

  return (
    <table
      className="tbl-container mt-4 ShortTable"
      style={{ width: "40% !important" }}
      {...rest}
    >
      <tbody>
        {Array.isArray(data) &&
          data.map((row, index) => (
            <tr
              key={index}
              style={{ borderBottom: "1px solid #ddd", color: "#fff" }}
            >
              <td
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  background: "#8b0203",
                }}
              >
                {row.label || row.field_name}{" "}
                {/* Ensure field_name is displayed */}
              </td>
              <td style={{ padding: "12px", color: "#777" }}>
                {editable && ![
                  "Freight Charge",
                  "GST on Freight",
                  "Realised GST",
                  "Warranty Clause",
                  "Payment Terms",
                  "Loading/Unloading",
                ].includes(row.label) ? (
                  <>
                    <button
                      className="purple-btn2 ms-2 rounded-circle p-0"
                      style={{
                        border: "none",
                        color: "white",
                        width: "25px",
                        height: "25px",
                      }}
                      onClick={() => onInputClick(row)}
                    >
                      <i className="bi bi-pencil" style={{ border: 0 }}></i>
                    </button>
                    <button
                      className="purple-btn2 ms-2 rounded-circle p-0"
                      style={{
                        border: "none",
                        color: "white",
                        width: "25px",
                        height: "25px",
                      }}
                      onClick={() => handleDelete(index)}
                    >
                      <i className="bi bi-trash" style={{ border: 0 }}></i>
                    </button>
                  </>
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
