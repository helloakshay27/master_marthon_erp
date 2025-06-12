import React, { useEffect, useState, useRef } from "react";
import DynamicModalBox from "../Modal/DynamicModalBox";
import SelectBox from "../Select/SelectBox";
import { useLocation } from "react-router-dom";
import baseUrl from "../../../config/apiDomain";

export default function ChargesDataTable({
  data,
  editable = false,
  onValueChange,
  setGrossTotal,
  grossTotal,
  showOtherChargesModal,
  handleCloseOtherChargesModal,
  isTaxRateDataChanged,
  calculateGrossTotal,
  ...rest
}) {
  // console.log("chargesData:-----", data);
  const prevGrossRef = useRef(null);
  const [chargesData, setChargesData] = useState([]);
  const [additionalTaxOptions, setAdditionalTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [chargesTaxRate, setChargesTaxRate] = useState({}); // State for tax rate data
  const [selectedTableId, setSelectedTableId] = useState(null); // State for selected table ID
  const [taxPercentageOptions, setTaxPercentageOptions] = useState([]);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    // Initialize chargesTaxRate with data from props
    const initialChargesTaxRate = data.reduce((acc, item, index) => {
      acc[index] = {
        afterDiscountValue: parseFloat(item.amount) || 0,
        taxes_and_charges: item.taxes_and_charges || [],
        netCost: item.realised_amount || 0,
      };
      return acc;
    }, {});
    setChargesTaxRate(initialChargesTaxRate);
  }, [data]);

  const handleOpenTaxModal = (tableId) => {
    setSelectedTableId(tableId);

    // Dynamically set the Total Base Cost based on the selected charge
    const selectedCharge = data[tableId]?.amount || 0;
    setChargesTaxRate((prev) => {
      const updated = { ...prev };
      if (!updated[tableId]) {
        updated[tableId] = {
          afterDiscountValue: parseFloat(selectedCharge) || 0,
          taxes_and_charges: [],
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

    taxRateRow.taxes_and_charges.forEach((item) => {
      if (item.inclusive) return;

      if (item.addition) {
        if (
          ["Handling Charges", "Other charges", "Freight"].includes(
            item.resource_id
          )
        ) {
          directChargesTotal += parseFloat(item.amount) || 0;
        } else {
          const taxAmount = calculateTaxAmount(
            item.percentage,
            taxRateRow.afterDiscountValue
          );
          additionTaxTotal += taxAmount;
        }
      } else {
        const taxAmount = calculateTaxAmount(
          item.percentage,
          taxRateRow.afterDiscountValue
        );
        deductionTaxTotal += taxAmount;
      }
    });

    const netCost =
      parseFloat(taxRateRow.afterDiscountValue || "0") +
      additionTaxTotal +
      directChargesTotal -
      deductionTaxTotal;

    return netCost.toFixed(2);
  };

  const handleTaxChargeChange = (rowIndex, id, field, value) => {
  const updatedData = { ...chargesTaxRate };
  const targetRow = updatedData[rowIndex];
  if (!targetRow) return;

  const taxCharges = [...targetRow.taxes_and_charges];
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
      charge.percentage = perUOM;
    }
  } else {
    charge[field] = value;
  }

  // Auto-add CGST if SGST is selected, or SGST if CGST is selected
  if (
    field === "resource_id" &&
    (value === 18 || value === 19) // 18: SGST, 19: CGST (adjust IDs as per your data)
  ) {
    const otherType = value === 18 ? 19 : 18;
    const otherExists = taxCharges.some((item) => item.resource_id === otherType && item.addition);
    if (!otherExists) {
      // Find the label for the other tax type
      const otherOption = additionalTaxOptions.find((opt) => opt.value === otherType);
      // Use the same percentage as the current charge, or empty
      const samePercentage = charge.percentage || "";
      const newRow = {
        id: Date.now().toString() + "_" + otherType,
        resource_id: otherType,
        percentage: samePercentage,
        inclusive: false,
        amount: charge.amount,
        addition: true,
      };
      taxCharges.push(newRow);
    }
  }

  // Keep percentage in sync between SGST and CGST
  if (
    field === "percentage" &&
    (charge.resource_id === 18 || charge.resource_id === 19)
  ) {
    const otherType = charge.resource_id === 18 ? 19 : 18;
    const otherEntry = taxCharges.find((item) => item.resource_id === otherType && item.addition);
    if (otherEntry) {
      otherEntry.percentage = value;
      if (!otherEntry.inclusive && targetRow.afterDiscountValue) {
        const amount = calculateTaxAmount(
          value,
          targetRow.afterDiscountValue,
          otherEntry.inclusive
        );
        otherEntry.amount = amount.toFixed(2);
      }
    }
  }

  if (!charge.inclusive && field === "percentage") {
    const taxAmount = calculateTaxAmount(
      charge.percentage,
      targetRow.afterDiscountValue,
      charge.inclusive
    );
    charge.amount = taxAmount.toFixed(2);
  }

  taxCharges[chargeIndex] = charge;
  targetRow.taxes_and_charges = taxCharges;
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

    updatedData[selectedTableId].realised_amount = updatedNetCost;

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
        realised_amount: updatedData[selectedTableId]?.realised_amount,
      };
      return updatedCharges;
    });

    // Construct payload
    const accumulatedPayload = updatedData.map((row, index) => {
      const chargeId = chargesData[index]?.id || null;

      return {
        charge_id: chargeId,
        amount: row.amount || "0", // User input
        realised_amount: row?.realised_amount || row?.amount || "0", // Calculated amount
        taxes_and_charges: chargesTaxRate[index]?.taxes_and_charges || [],
      };
    });

    onValueChange(accumulatedPayload);

    handleCloseTaxModal();
    if (isTaxRateDataChanged) isTaxRateDataChanged(true);
  };

  useEffect(() => {
    // Fetch charges data from the API
    fetch(
      `${baseUrl}/rfq/events/charges_only?token=${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        setChargesData(data.taxes || []);
      })
      .catch((error) => console.error("Error fetching charges data:", error));

    // Fetch additional tax options from the API
    fetch(
      `${baseUrl}/rfq/events/addition_taxes_dropdown?token=${token}`
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
      `${baseUrl}/rfq/events/deduction_tax_details?token=${token}`
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

      async function fetchTaxPercentages() {
    try {
      const res = await fetch(
        `${baseUrl}//rfq/events/tax_percentage?token=${token}`
      );
      const data = await res.json();
      setTaxPercentageOptions(data);
    } catch (err) {
      setTaxPercentageOptions([]);
    }
  }
  fetchTaxPercentages();
  }, []);

  const handleInputChange = (index, e) => {
    const updated = [...data];

    if (!updated[index]?.amount) {
      updated[index] = { ...updated[index], value: {} };
    }

    updated[index].amount = e.target.value;

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
              const realisedAmount = parseFloat(charge?.realised_amount || 0);
              return total + realisedAmount;
            }, 0);

            const calcGrossTotal = parseFloat(calculateGrossTotal()) || 0;
            console.log(
              "calcGrossTotal:-----",
              calcGrossTotal,
              updatedGrossTotal,
              calcGrossTotal + updatedGrossTotal
            );
            // Get the current gross total from the parent component
            setGrossTotal(calcGrossTotal + updatedGrossTotal); // Update the gross total in the parent component
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
                        min="0"
                        className="form-control"
                        value={data[index]?.amount || ""}
                        onChange={(e) => handleInputChange(index, e)}
                        style={{
                          backgroundColor: "#fff",
                          color: "#000",
                          width: "80%",
                        }}
                      />
                    </div>
                  ) : (
                    data[index]?.amount || ""
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
                    min="0"
                    className="form-control"
                    value={
                      data[index]?.amount
                        ? parseFloat(data[index].realised_amount).toFixed(2)
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
                    min="0"
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
                          taxes_and_charges: [],
                        };
                      }
                      updated[selectedTableId].taxes_and_charges.push({
                        id: Date.now(),
                        resource_id: "",
                        percentage: "",
                        inclusive: false,
                        amount: "",
                        addition: true,
                      });
                      setChargesTaxRate(updated);
                    }}
                  >
                    <span>+</span>
                  </button>
                </td>
              </tr>
              {chargesTaxRate[selectedTableId]?.taxes_and_charges
                ?.filter((item) => item.addition)
                ?.map((item, rowIndex) => (
                  <tr key={`${rowIndex}-${item.id}`}>
                    <td>
                      <SelectBox
                        options={additionalTaxOptions}
                        defaultValue={item.resource_id}
                        onChange={(value) =>
                          handleTaxChargeChange(
                            selectedTableId,
                            item.id,
                            "resource_id",
                            value
                          )
                        }
                        className="custom-select"
                        disabledOptions={(
                          chargesTaxRate[
                            selectedTableId
                          ]?.taxes_and_charges?.reduce((acc, item) => {
                            // Disable CGST and SGST if IGST is selected
                            if (item.resource_id === 20) {
                              acc.push(19, 18); // Disable CGST and SGST
                            }

                            // Disable IGST and CGST if CGST is selected
                            if (item.resource_id === 19) {
                              acc.push(19, 20); // Disable CGST and IGST
                            }

                            // Disable IGST and SGST if SGST is selected
                            if (item.resource_id === 18) {
                              acc.push(18, 20); // Disable SGST and IGST
                            }

                            return acc;
                          }, []) || []
                        ).filter(
                          (value, index, self) => self.indexOf(value) === index // Remove duplicates
                        )} //]] Remove duplicates
                      />
                    </td>
               <td>
  <SelectBox
    options={
      (() => {
        // Find the selected tax type name by resource_id
        const selectedTaxType =
          additionalTaxOptions.find((opt) => opt.value === item.resource_id)?.label;
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );
        return match && Array.isArray(match.percentage)
          ? match.percentage.map((percent) => ({
              label: `${percent}%`,
              value: `${percent}%`,
            }))
          : [];
      })()
    }
    defaultValue={item?.percentage || ""}
    onChange={(value) =>
      handleTaxChargeChange(
        selectedTableId,
        item.id,
        "percentage",
        value
      )
    }
  />
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
                            e.target.checked
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
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          const updated = { ...chargesTaxRate };
                          updated[selectedTableId].taxes_and_charges = updated[
                            selectedTableId
                          ].taxes_and_charges.filter(
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
                          taxes_and_charges: [],
                        };
                      }
                      updated[selectedTableId].taxes_and_charges.push({
                        id: Date.now(),
                        resource_id: "",
                        percentage: "",
                        inclusive: false,
                        amount: "",
                        addition: false,
                      });
                      setChargesTaxRate(updated);
                    }}
                  >
                    <span>+</span>
                  </button>
                </td>
              </tr>
              {chargesTaxRate[selectedTableId]?.taxes_and_charges
                ?.filter((item) => !item.addition)
                ?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <SelectBox
                        options={deductionTaxOptions}
                        defaultValue={item.resource_id}
                        onChange={(value) =>
                          handleTaxChargeChange(
                            selectedTableId,
                            item.id,
                            "resource_id",
                            value
                          )
                        }
                        className="custom-select"
                        disabledOptions={chargesTaxRate[
                          selectedTableId
                        ]?.taxes_and_charges
                          ?.filter((item) => !item.addition)
                          ?.map((item) => item.resource_id)} // Pass selected options to disable
                      />
                    </td>
                    {/* <td>
                      <select
                        className="form-select"
                        defaultValue={item?.percentage}
                        onChange={(e) =>
                          handleTaxChargeChange(
                            selectedTableId,
                            item.id,
                            "percentage",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Tax</option>
                        <option value="1%">1%</option>
                        <option value="2%">2%</option>
                        <option value="10%">10%</option>
                      </select>
                    </td> */}
                    <td>
  <SelectBox
    options={
      (() => {
        const selectedTaxType =
          deductionTaxOptions.find((opt) => opt.value === item.resource_id)?.label;
        const match = taxPercentageOptions.find(
          (tax) => tax.tax_name === selectedTaxType
        );
        return match && Array.isArray(match.percentage)
          ? match.percentage.map((percent) => ({
              label: `${percent}%`,
              value: `${percent}%`,
            }))
          : [];
      })()
    }
    defaultValue={item?.percentage || ""}
    onChange={(value) =>
      handleTaxChargeChange(
        selectedTableId,
        item.id,
        "percentage",
        value
      )
    }
  />
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
                            e.target.checked
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
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          const updated = { ...chargesTaxRate };
                          updated[selectedTableId].taxes_and_charges = updated[
                            selectedTableId
                          ].taxes_and_charges.filter(
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
