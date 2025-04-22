import React from "react";
import { useState, useRef } from "react";
import DynamicModalBox from "../Modal/DynamicModalBox";
export default function ChargesDataTable({
  data,
  editable = false,
  onValueChange,
  setGrossTotal,
  grossTotal,
  showOtherChargesModal,
  handleCloseOtherChargesModal,
  isTaxRateDataChanged,
  ...rest
}) {
  const prevGrossRef = useRef(null);

  const handleInputChange = (index, e) => {
    const updated = [...data];

    if (
      typeof updated[index].value !== "object" ||
      updated[index].value === null
    ) {
      updated[index].value = {};
    }

    updated[index].value.firstBid = e.target.value;

    const getValue = (label) => {
      const row = updated.find((row) => row.label === label);
      return parseFloat(row?.value?.firstBid || "0") || 0;
    };

    const freight = getValue("freight_charge_amount");
    const gstFreight = getValue("gst_on_freight");

    const other = getValue("other_charge_amount");
    const gstOther = getValue("gst_on_other_charge");

    const handling = getValue("handling_charge_amount");
    const gstHandling = getValue("gst_on_handling_charge");

    const realisedFreight = freight + (freight * gstFreight) / 100;
    const realisedOther = other + (other * gstOther) / 100;
    const realisedHandling = handling + (handling * gstHandling) / 100;

    const updatedRealizedData = updated.map((row) => {
      if (row.label === "realised_freight_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedFreight } };
      }
      if (row.label === "realised_other_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedOther } };
      }
      if (row.label === "realised_handling_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedHandling } };
      }
      return row;
    });

    onValueChange(updatedRealizedData);
  };

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
  
    const realisedFreight = freight + (freight * gstFreight) / 100;
    const realisedOther = other + (other * gstOther) / 100;
    const realisedHandling = handling + (handling * gstHandling) / 100;
  
    const updatedRealizedData = updatedData.map((row) => {
      if (row.label === "realised_freight_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedFreight } };
      }
      if (row.label === "realised_other_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedOther } };
      }
      if (row.label === "realised_handling_charge_amount") {
        return { ...row, value: { ...row.value, firstBid: realisedHandling } };
      }
      return row;
    });
  
    onValueChange(updatedRealizedData);
  
    const gross = realisedFreight + realisedOther + realisedHandling;
  
    if (prevGrossRef.current === null) {
      prevGrossRef.current = grossTotal; 
    }
  
    const finalGross = prevGrossRef.current + gross;
    setGrossTotal(finalGross);
  };

  return (
    <DynamicModalBox
      show={showOtherChargesModal}
      onHide={handleCloseOtherChargesModal}
      size="md"
      modalType={true}
      title="Other Charges"
      footerButtons={[
        {
          label: "Close",
          onClick: handleCloseOtherChargesModal,
          props: { className: "purple-btn1" },
        },
        {
          label: "Save",
          onClick: () => {
            // Add save logic here
            calculateGrossTotal(data);
            handleCloseOtherChargesModal();
          },
          props: { className: "purple-btn2" },
        },
      ]}
    >
      <div>
        <table className="tbl-container mt-4 p-4" style={{ maxWidth: "100%" }}>
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
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      color: "#000",
                      textAlign: "left",
                    }}
                  >
                    {editable ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="number"
                          className="form-control"
                          value={firstBid || ""}
                          onChange={(e) => handleInputChange(index, e)}
                          style={{
                            backgroundColor: "#fff",
                            color: "#000",
                            width: "80%",
                            marginRight: "5px",
                          }}
                        />
                        {row.label.startsWith("gst_") ? (
                          <span style={{ color: "#000" }}>%</span>
                        ) : (
                          <span style={{ color: "#000" }}>₹</span>
                        )}
                      </div>
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
      </div>
    </DynamicModalBox>
  );
}
