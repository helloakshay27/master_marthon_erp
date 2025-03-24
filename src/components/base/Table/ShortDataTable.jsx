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
          // console.log("Row:", row); // Debugging row
          const { firstBid, counterBid } = row?.value || {};
          const showBothValues = firstBid !== counterBid;

          // console.log("First Bid:", firstBid); // Debugging firstBid

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
              <td style={{ padding: "12px", color: "#777", textAlign: "left" }}>
                {row.label === "Realised Freight" ? (
                  // Non-editable for Realised Freight
                  <span>
                    {counterBid ? (
                      <>
                        {showBothValues ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginRight: "5px",
                                color: "gray",
                              }}
                            >
                              ₹ {firstBid}
                            </span>
                            <span className="me-2">
                              <svg
                                className="me-2"
                                viewBox="64 64 896 896"
                                focusable="false"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                              </svg>
                            </span>
                            <span
                              style={{
                                backgroundColor: "#b45253", // Yellow background
                                padding: "4px 10px",
                                borderRadius: "5px",
                                color: "white",
                              }}
                            >
                              ₹ {counterBid}
                            </span>
                          </>
                        ) : (
                          <input
                            type="text"
                            value={`${counterBid}`}
                            className="form-control frt_vlu "
                            readOnly
                            style={{
                              // border: "none",
                              backgroundColor: "transparent",
                              color: "#000",
                              // fontWeight: "bold",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <input
                        type="text"
                        value={`${firstBid}`}
                        className="form-control frt_vlu"
                        readOnly
                        style={{
                          // border: "none",
                          backgroundColor: "transparent",
                          color: "#000",
                          // fontWeight: "bold",
                        }}
                      />
                    )}
                  </span>
                ) : counterBid ? (
                  // Non-editable when counterBid is present
                  <span>
                    {showBothValues ? (
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
                        <span className="me-2">
                          <svg
                            className="me-2"
                            viewBox="64 64 896 896"
                            focusable="false"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                          </svg>
                        </span>
                        <span
                          style={{
                            backgroundColor: "#b45253", // Yellow background
                            padding: "4px 10px",
                            borderRadius: "5px",
                            color: "white",
                          }}
                        >
                          {counterBid}
                        </span>
                      </>
                    ) : (
                      counterBid
                    )}
                  </span>
                ) : editable ? (
                  // Editable if only firstBid is present
                  <input
                    type="text"
                    className="form-control"
                    value={firstBid}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ backgroundColor: "#fff", color: "#000" }}
                  />
                ) : (
                  firstBid
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
