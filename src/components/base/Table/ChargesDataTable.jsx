import React from "react";
import { useEffect } from "react";
export default function ChargesDataTable({
  data,
  editable = false,
  onValueChange,
  setGrossTotal,
  ...rest
}) {
  const handleInputChange = (index, e) => {
    const updated = [...data];
  
    // Ensure value is an object
    if (typeof updated[index].value !== 'object' || updated[index].value === null) {
      updated[index].value = {};
    }
  
    updated[index].value.firstBid = e.target.value;
    onValueChange(updated);
  };
  

  // Recalculate gross total whenever data changes
  useEffect(() => {
    calculateGrossTotal(data);
  }, [data]);

  const calculateGrossTotal = (updatedData) => {
    const getValue = (label) => {
      const row = updatedData.find((row) => row.label === label);
      return parseFloat(row?.value?.firstBid || "0") || 0;
    };

    const freight = getValue("freight_charge_amount");
    const gstFreight = getValue("gst_on_freight");
    const other = getValue("other_charge_amount");
    const gstOther = getValue("gst_on_other_charge");
    const handling = getValue("handling_charge_amount");
    const gstHandling = getValue("gst_on_handling_charge");

    const gross =
      freight + (freight * gstFreight) / 100 +
      other + (other * gstOther) / 100 +
      handling + (handling * gstHandling) / 100;

    setGrossTotal(gross);
  };


  return (
 <table className="tbl-container mt-4 ShortTable" style={{ width: "40% " }}>
      <tbody>
        {data.map((row, index) => {
          const { firstBid, counterBid } = row?.value || {};
          const showBoth = firstBid !== counterBid;

          return (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  background: "#8b0203",
                  color: "#fff",
                  width: "65%",
                }}
              >
                {row.label
                  .replace(/_/g, " ") // change underscores to spaces
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </td>

              <td style={{ padding: "12px", color: "#000", textAlign: "left" }}>
                {editable ? (
                  <input
                    type="number"
                    className="form-control"
                    value={firstBid || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    style={{ backgroundColor: "#fff", color: "#000" }}
                  />
                ) : showBoth ? (
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
                  firstBid || counterBid || ""
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
