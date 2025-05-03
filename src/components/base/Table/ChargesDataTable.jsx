import React, { useEffect, useState, useRef } from "react";
import DynamicModalBox from "../Modal/DynamicModalBox";
import SelectBox from "../Select/SelectBox";

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
  const [chargesData, setChargesData] = useState([]);
  const [additionalTaxOptions, setAdditionalTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [chargesTaxRate, setChargesTaxRate] = useState({}); // State for tax rate data
  const [selectedTableId, setSelectedTableId] = useState(null); // State for selected table ID

  const handleOpenTaxModal = (tableId) => {
    setSelectedTableId(tableId);

    // Dynamically set the Total Base Cost based on the selected charge
    const selectedCharge = data[tableId]?.value?.firstBid || 0;
    setChargesTaxRate((prev) => {
      const updated = { ...prev };
      if (!updated[tableId]) {
        updated[tableId] = {
          afterDiscountValue: parseFloat(selectedCharge) || 0,
          addition_bid_material_tax_details: [],
          deduction_bid_material_tax_details: [],
        };
      } else {
        updated[tableId].afterDiscountValue = parseFloat(selectedCharge) || 0;
      }
      return updated;
    });

    setShowTaxModal(true);
  };

  const handleCloseTaxModal = () => setShowTaxModal(false);

  const calculateTaxAmount = (percentage, baseAmount, inclusive = false) => {
    if (inclusive) return 0;

    const safePercentage =
      typeof percentage === "string" ? percentage.replace("%", "") : percentage;
    const parsedPercentage = parseFloat(safePercentage) || 0;
    const parsedBaseAmount = parseFloat(baseAmount) || 0;

    return (parsedPercentage / 100) * parsedBaseAmount;
  };

  const calculateNetCost = (rowIndex, updatedData = chargesTaxRate) => {
    const taxRateRow = updatedData[rowIndex];
    let additionTaxTotal = 0;
    let deductionTaxTotal = 0;
    let directChargesTotal = 0;

    taxRateRow.addition_bid_material_tax_details.forEach((item) => {
      if (item.inclusive) return;

      if (
        ["Handling Charges", "Other charges", "Freight"].includes(
          item.taxChargeType
        )
      ) {
        directChargesTotal += parseFloat(item.amount) || 0;
      } else {
        const taxAmount = calculateTaxAmount(
          item.taxChargePerUom,
          taxRateRow.afterDiscountValue
        );
        additionTaxTotal += taxAmount;
      }
    });

    taxRateRow.deduction_bid_material_tax_details.forEach((item) => {
      if (item.inclusive) return;
      const taxAmount = calculateTaxAmount(
        item.taxChargePerUom,
        taxRateRow.afterDiscountValue
      );
      deductionTaxTotal += taxAmount;
    });

    const netCost =
      parseFloat(taxRateRow.afterDiscountValue || "0") +
      additionTaxTotal +
      directChargesTotal -
      deductionTaxTotal;

    return netCost.toFixed(2);
  };

  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
    const updatedData = { ...chargesTaxRate };
    const targetRow = updatedData[rowIndex];
    if (!targetRow) return;

    const taxKey =
      type === "addition"
        ? "addition_bid_material_tax_details"
        : "deduction_bid_material_tax_details";

    const taxCharges = [...targetRow[taxKey]];
    const chargeIndex = taxCharges.findIndex((item) => item.id === id);
    if (chargeIndex === -1) return;

    const charge = { ...taxCharges[chargeIndex] };

    if (field === "amount") {
      charge.amount = value;
      if (!charge.inclusive && targetRow.afterDiscountValue) {
        const perUOM = (
          (parseFloat(value) / parseFloat(targetRow.afterDiscountValue)) *
          100
        ).toFixed(2);
        charge.taxChargePerUom = perUOM;
      }
    } else {
      charge[field] = value;
    }

    if (!charge.inclusive && field === "taxChargePerUom") {
      const taxAmount = calculateTaxAmount(
        charge.taxChargePerUom,
        targetRow.afterDiscountValue,
        charge.inclusive
      );
      charge.amount = taxAmount.toFixed(2);
    }

    taxCharges[chargeIndex] = charge;
    targetRow[taxKey] = taxCharges;
    updatedData[rowIndex] = targetRow;

    const recalculatedNetCost = calculateNetCost(rowIndex, updatedData);
    updatedData[rowIndex].netCost = recalculatedNetCost;

    setChargesTaxRate(updatedData);
  };

  const handleSaveTaxChanges = () => {
    const updatedData = [...data];

    // Calculate new realised/net cost but do not override firstBid
    const updatedNetCost = calculateNetCost(selectedTableId, chargesTaxRate);

    // Save net cost in a separate field
    if (!updatedData[selectedTableId].value) {
      updatedData[selectedTableId].value = {};
    }

    updatedData[selectedTableId].value.realisedAmount = updatedNetCost;

    // Synchronize chargesTaxRate with latest realised value
    setChargesTaxRate((prev) => {
      const updated = { ...prev };
      updated[selectedTableId] = {
        ...updated[selectedTableId],
        afterDiscountValue: parseFloat(updatedNetCost) || 0,
      };
      return updated;
    });

    // Sync charges data (optional)
    setChargesData((prev) => {
      const updatedCharges = [...prev];
      updatedCharges[selectedTableId] = {
        ...updatedCharges[selectedTableId],
        value: { ...updatedData[selectedTableId]?.value },
      };
      return updatedCharges;
    });

    // Construct payload
    const accumulatedPayload = updatedData.map((row, index) => {
      const chargeId = chargesData[index]?.id || null;
      const additionTaxes =
        chargesTaxRate[index]?.addition_bid_material_tax_details?.map(
          (item) => ({
            resource_id: item.taxChargeType,
            resource_type: "TaxCategory",
            amount: item.amount,
            inclusive: item.inclusive,
            addition: true,
          })
        ) || [];

      const deductionTaxes =
        chargesTaxRate[index]?.deduction_bid_material_tax_details?.map(
          (item) => ({
            resource_id: item.taxChargeType,
            resource_type: "TaxCategory",
            amount: item.amount,
            inclusive: item.inclusive,
            addition: false,
          })
        ) || [];

      return {
        charge_id: chargeId,
        amount: row.value?.firstBid || "0", // User input
        realised_amount:
          row.value?.realisedAmount || row.value?.firstBid || "0", // Calculated amount
        taxes_with_charges: [...additionTaxes, ...deductionTaxes],
        value: row.value || {},
      };
    });

    console.log("payload:-----", accumulatedPayload);

    onValueChange(accumulatedPayload);

    handleCloseTaxModal();
    if (isTaxRateDataChanged) isTaxRateDataChanged(true);
  };

  useEffect(() => {
    // Fetch charges data from the API
    fetch(
      "https://marathon.lockated.com/rfq/events/charges_only?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    )
      .then((response) => response.json())
      .then((data) => {
        setChargesData(data.taxes || []);
      })
      .catch((error) => console.error("Error fetching charges data:", error));

    // Fetch additional tax options from the API
    fetch(
      "https://marathon.lockated.com/rfq/events/addition_taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = (data.taxes || []).map((tax) => ({
          value: tax.id,
          label: tax.name,
        }));
        setAdditionalTaxOptions(formattedOptions);
      })
      .catch((error) =>
        console.error("Error fetching additional tax options:", error)
      );

    // Fetch deduction tax options from the API
    fetch(
      "https://marathon.lockated.com/rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = (data.taxes || []).map((tax) => ({
          value: tax.id,
          label: tax.name,
        }));
        setDeductionTaxOptions(formattedOptions);
      })
      .catch((error) =>
        console.error("Error fetching deduction tax options:", error)
      );
  }, []);

  const handleInputChange = (index, e) => {
    const updated = [...data];

    if (!updated[index]?.value) {
      updated[index] = { ...updated[index], value: {} };
    }

    updated[index].value.firstBid = e.target.value;

    onValueChange(updated); // Let parent know
  };

  const handleTaxChange = (index, key, value) => {
    const updated = [...data];

    if (!updated[index]?.value) {
      updated[index] = { ...updated[index], value: {} };
    }

    updated[index].value[key] = value;

    onValueChange(updated); // Update the parent component with the modified data
  };

  const calculateRealisedAmount = (amount, additionTax, deductionTax) => {
    const addition = (amount * parseFloat(additionTax || "0")) / 100;
    const deduction = (amount * parseFloat(deductionTax || "0")) / 100;
    return amount + addition - deduction;
  };

  const calculateRealisedGst = (amount, additionTax, deductionTax) => {
    const addition = (amount * parseFloat(additionTax || "0")) / 100;
    const deduction = (amount * parseFloat(deductionTax || "0")) / 100;
    return addition - deduction;
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
      size="lg"
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
            // Calculate the gross total as the sum of realisedAmount values
            const updatedGrossTotal = chargesData.reduce((total, charge) => {
              const realisedAmount = parseFloat(charge?.value?.realisedAmount || 0);
              
              return grossTotal + realisedAmount;
            }, 0);

            setGrossTotal(updatedGrossTotal); // Update the gross total in the parent component
            handleCloseOtherChargesModal(); // Close the modal
          },
          props: { className: "purple-btn2" },
        },
      ]}
    >
      <div>
        <table className="tbl-container mt-4 p-4" style={{ maxWidth: "100%" }}>
          <thead>
            <tr>
              <th>Charges</th>
              <th>Amount</th>
              <th>Realised Amount</th>
              <th>Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {chargesData.map((charge, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    background: "#8b0203",
                    color: "#fff",
                    width: "300px",
                  }}
                >
                  {charge.name}
                </td>
                <td
                  style={{
                    padding: "5px",
                    color: "#000",
                    textAlign: "left",
                    width: "300px",
                  }}
                >
                  {editable ? (
                    <div>
                      <input
                        type="number"
                        className="form-control"
                        value={data[index]?.value?.firstBid || ""}
                        onChange={(e) => handleInputChange(index, e)}
                        style={{
                          backgroundColor: "#fff",
                          color: "#000",
                          width: "80%",
                        }}
                      />
                    </div>
                  ) : (
                    data[index]?.value?.firstBid || ""
                  )}
                </td>

                <td
                  style={{
                    padding: "5px",
                    color: "#000",
                    textAlign: "left",
                    width: "300px",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    value={
                      data[index]?.value
                        ? parseFloat(data[index].value.realisedAmount).toFixed(2)
                        : "0.00"
                    }
                    readOnly
                    disabled
                    style={{
                      backgroundColor: "#e9ecef",
                      color: "#000",
                      width: "80%",
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "5px",
                    color: "#000",
                    textAlign: "center",
                    width: "300px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenTaxModal(index)}
                    style={{
                      backgroundColor: "#8b0203",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tax Modal */}
      <DynamicModalBox
        show={showTaxModal}
        onHide={handleCloseTaxModal}
        size="lg"
        title="Tax Rate Details"
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseTaxModal,
            props: { className: "purple-btn1" },
          },
          {
            label: "Save",
            onClick: handleSaveTaxChanges,
            props: { className: "purple-btn2" },
          },
        ]}
      >
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="tax-table-header">
              <tr>
                <th>Tax / Charge Type</th>
                <th>Tax / Charges per UOM (INR)</th>
                <th>Inclusive</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Base Cost</td>
                <td></td>
                <td></td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      chargesTaxRate[selectedTableId]?.afterDiscountValue || ""
                    }
                    readOnly
                    disabled
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Addition Tax & Charges</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      const updated = { ...chargesTaxRate };
                      if (!updated[selectedTableId]) {
                        updated[selectedTableId] = {
                          addition_bid_material_tax_details: [],
                          deduction_bid_material_tax_details: [],
                        };
                      }
                      updated[
                        selectedTableId
                      ].addition_bid_material_tax_details.push({
                        id: Date.now(),
                        taxChargeType: "",
                        taxChargePerUom: "",
                        inclusive: false,
                        amount: "",
                      });
                      setChargesTaxRate(updated);
                    }}
                  >
                    <span>+</span>
                  </button>
                </td>
              </tr>
              {chargesTaxRate[
                selectedTableId
              ]?.addition_bid_material_tax_details?.map((item, rowIndex) => (
                <tr key={`${rowIndex}-${item.id}`}>
                  <td>
                    <SelectBox
                      options={additionalTaxOptions}
                      defaultValue={item.taxChargeType}
                      onChange={(value) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "taxChargeType",
                          value,
                          "addition"
                        )
                      }
                      className="custom-select"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      defaultValue={item?.taxChargePerUom}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "taxChargePerUom",
                          e.target.value,
                          "addition"
                        )
                      }
                    >
                      <option value="">Select Tax</option>
                      <option value="5%">5%</option>
                      <option value="12%">12%</option>
                      <option value="18%">18%</option>
                      <option value="28%">28%</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={item.inclusive}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "inclusive",
                          e.target.checked,
                          "addition"
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.amount}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "amount",
                          e.target.value,
                          "addition"
                        )
                      }
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        const updated = { ...chargesTaxRate };
                        updated[
                          selectedTableId
                        ].addition_bid_material_tax_details = updated[
                          selectedTableId
                        ].addition_bid_material_tax_details.filter(
                          (tax) => tax.id !== item.id
                        );
                        setChargesTaxRate(updated);
                      }}
                    >
                      <span>×</span>
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>Deduction Tax</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      const updated = { ...chargesTaxRate };
                      if (!updated[selectedTableId]) {
                        updated[selectedTableId] = {
                          addition_bid_material_tax_details: [],
                          deduction_bid_material_tax_details: [],
                        };
                      }
                      updated[
                        selectedTableId
                      ].deduction_bid_material_tax_details.push({
                        id: Date.now(),
                        taxChargeType: "",
                        taxChargePerUom: "",
                        inclusive: false,
                        amount: "",
                      });
                      setChargesTaxRate(updated);
                    }}
                  >
                    <span>+</span>
                  </button>
                </td>
              </tr>
              {chargesTaxRate[
                selectedTableId
              ]?.deduction_bid_material_tax_details?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <SelectBox
                      options={deductionTaxOptions}
                      defaultValue={item.taxChargeType}
                      onChange={(value) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "taxChargeType",
                          value,
                          "deduction"
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      defaultValue={item?.taxChargePerUom}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "taxChargePerUom",
                          e.target.value,
                          "deduction"
                        )
                      }
                    >
                      <option value="">Select Tax</option>
                      <option value="1%">1%</option>
                      <option value="2%">2%</option>
                      <option value="10%">10%</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={item.inclusive}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "inclusive",
                          e.target.checked,
                          "deduction"
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.amount}
                      onChange={(e) =>
                        handleTaxChargeChange(
                          selectedTableId,
                          item.id,
                          "amount",
                          e.target.value,
                          "deduction"
                        )
                      }
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        const updated = { ...chargesTaxRate };
                        updated[
                          selectedTableId
                        ].deduction_bid_material_tax_details = updated[
                          selectedTableId
                        ].deduction_bid_material_tax_details.filter(
                          (tax) => tax.id !== item.id
                        );
                        setChargesTaxRate(updated);
                      }}
                    >
                      <span>×</span>
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>Net Cost</td>
                <td></td>
                <td></td>
                <td className="text-center">
                  <input
                    type="text"
                    className="form-control"
                    value={chargesTaxRate[selectedTableId]?.netCost || ""}
                    readOnly
                    disabled
                  />
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </DynamicModalBox>
    </DynamicModalBox>
  );
}
