import React from "react";
export default function ShortDataTable({
  data,
  editable = false,
  onValueChange,
  ...rest
}) {
  const handleInputChange = (index, newValue) => {
    console.log("Input value:", newValue);
  
    const updatedData = [...data];
  
    // Ensure value object exists
    if (!updatedData[index].value) {
      updatedData[index].value = {};
    }
  
    // Update firstBid and counterBid from input
    const [firstBid, counterBid] = newValue.split("→").map((v) => v.trim());
    updatedData[index].value.firstBid = firstBid || "";
    updatedData[index].value.counterBid = counterBid || "";
  
    // Find required rows
    const freightChargeRow = updatedData.find((row) => row.label === "Freight Charge");
    const gstOnFreightRow = updatedData.find((row) => row.label === "GST on Freight");
    const realisedGstRowIndex = updatedData.findIndex((row) => row.label === "Realised GST");
  
    if (freightChargeRow && gstOnFreightRow && realisedGstRowIndex !== -1) {
      const freightCharge = parseFloat(freightChargeRow.value?.firstBid || "0") || 0;
      const gstOnFreight = parseFloat(gstOnFreightRow.value?.firstBid || "0") || 0;
  
      const realisedGst = (freightCharge * gstOnFreight) / 100;
  
      console.log("Freight Charge:", freightCharge);
      console.log("GST on Freight:", gstOnFreight);
      console.log("Calculated Realised GST:", realisedGst);
  
      // Update Realised GST row
      if (!updatedData[realisedGstRowIndex].value) {
        updatedData[realisedGstRowIndex].value = {};
      }
  
      updatedData[realisedGstRowIndex].value.firstBid = realisedGst.toFixed(2);
      updatedData[realisedGstRowIndex].value.counterBid = "";
    }
  
    // Update state and trigger re-render
    onValueChange(updatedData);
    calculateSumTotal(updatedData); // Call calculateSumTotal after updating realised GST
  };

  const calculateSumTotal = (updatedData) => {
    const freightChargeRow = updatedData.find((row) => row.label === "Freight Charge");
    const realisedGstRow = updatedData.find((row) => row.label === "Realised GST");

    const freightCharge = parseFloat(freightChargeRow?.value?.firstBid || "0") || 0;
    const realisedGst = parseFloat(realisedGstRow?.value?.firstBid || "0") || 0;

    const sumTotal = freightCharge + realisedGst;
    console.log("Sum Total:", sumTotal);
    return sumTotal;
  };

  return (
    <table
      className="tbl-container mt-4 ShortTable"
      style={{ width: "40% !important" }}
      {...rest}
    >
      <tbody>
        {data.map((row, index) => {
          const { firstBid, counterBid } = row?.value || {};
          const showBothValues = firstBid !== counterBid;

          return (
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
                {row.label}
              </td>
              <td style={{ padding: "12px", color: "#000", textAlign: "left" }}>
                {editable ? (
                  <input
                    type="text"
                    className="form-control"
                    value={row.value || firstBid || ""}
                    onChange={(e) => {
                      const updatedData = [...data];
                      if (!updatedData[index].value) {
                        updatedData[index].value = {};
                      }
                      updatedData[index].value.firstBid = e.target.value;
                      onValueChange(updatedData);
                    }}
                    style={{ backgroundColor: "#fff", color: "#000" }}
                  />
                ) : showBothValues ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginRight: "5px",
                        color: "gray",
                      }}
                    >
                      {firstBid}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#b45253",
                        padding: "4px 10px",
                        borderRadius: "5px",
                        color: "white",
                      }}
                    >
                      {counterBid}
                    </span>
                  </>
                ) : (
                  firstBid || row.value
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
