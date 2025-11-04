import React, { useState, useEffect } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import Table from "../../base/Table/Table"
import Tooltip from "../../common/Tooltip/Tooltip";

export default function AccordionOnSection({
  title,
  amount = [],
  serializedData = [],
  isDefault,
  tableColumn,
  tableData,
  onColumnClick,
  enableHoverEffect,
  handleTaxButtonClick,
  isAllocation = false,
  onSelectAll,
  eventVendors,
  checkedColumns,
  handleColumnCheckboxChange,
  setSegeregatedMaterialData,
  accordianIndex,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // State for selected amounts
  const [updatedTableData, setTableData] = useState([]); // State for tableData
  const toggleAccordion = () => setIsOpen(!isOpen);

  const handleAmountSelection = (amt) => {
    const isSelected = selectedAmounts.includes(amt);
    const updatedSelectedAmounts = isSelected
      ? selectedAmounts.filter((selectedAmt) => selectedAmt !== amt)
      : [...selectedAmounts, amt];

    setSelectedAmounts(updatedSelectedAmounts);

    if (onSelectAll) {
      onSelectAll(amt, !isSelected);
    }
  };

  const sortedAmounts = [...amount].sort((a, b) => a - b);
  const leastAmount = sortedAmounts[0];
  const secondLeastAmount = sortedAmounts[1];
  const thirdLeastAmount = sortedAmounts[2];

  useEffect(() => {
    if (tableData) {
      setTableData(tableData);
    }
  }, [tableData]);

  const handleColumnClick = (
    data,
    columnKey,
    e,
    updatedSegeregatedMaterialData
  ) => {    
    if (onColumnClick) {
      const bid_id = data.bid_id || data.bidId;
      const material_id = data.id || data.id;
      const vendor_id = data.vendor_id || data.vendorId;

      if (Array.isArray(data.materials) && data.materials.length > 0) {
        data.materials.forEach((material) => {
          const materialData = {
            bid_id: material.bid_id || material.bidId,
            material_id: material.id || material.id,
            vendor_id: material.vendor_id || material.vendorId,
            ...material,
          };
          onColumnClick(
            materialData,
            columnKey,
            e,
            updatedSegeregatedMaterialData
          );
        });
      } else {
        onColumnClick(
          { bid_id, material_id, vendor_id, ...data },
          columnKey,
          e,
          updatedSegeregatedMaterialData
        );
      }
    }
  };

  const getBackgroundColor = (amt) => {
    if (amt === leastAmount) return "rgba(139, 231, 139, 0.5)";
    if (amt === secondLeastAmount) return "rgba(255, 237, 85, 0.5)";
    if (amt === thirdLeastAmount) return "rgba(255, 63, 64, 0.5)";
    return "transparent";
  };

  return (
    <>
      <div className="accordion rounded-0 border-0 mb-0" id="accordionExample">
        <div className="accordion-item rounded-0">
          <h2 className="accordion-header">
            <button
              className="accordion-button viewBy-collapT1"
              style={{
                position: "relative",
                width: "100%",
                background: "#000",
                fontSize: "8px",
                height: "50px",
              }}
              type="button"
              onClick={toggleAccordion}
              aria-expanded={isOpen}
            >
              <span className="p-2">
                <DropArrowIcon isOpen={isOpen} />
              </span>
              <Tooltip content={title}>
                <span
                  style={{
                    display: "inline-block",
                    paddingRight: "10px",
                  }}
                >
                  {title}
                </span>
              </Tooltip>
              <span style={{ display: "flex", flexWrap: "wrap" }}>

                {amount?.map((amt, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "15px",
                      width: "180px",
                      textAlign: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                      backgroundColor: getBackgroundColor(amt),
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >                    
                    {isAllocation && (
                      <input
                        type="checkbox"
                        disabled={updatedTableData[index]?.po_exists || false}
                        checked={updatedTableData[index]?.isChecked || false}
                        // Disable if po_exist is true for this bid/material
                        disabled={updatedTableData[index]?.po_exist}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent the event from bubbling up to the button
                          const isChecked = e.target.checked;
                          const bidId =
                            updatedTableData[index]?.bid_id ||
                            updatedTableData[index]?.bidId;

                          // Update the local state first to reflect the UI change
                          setTableData((prevTableData) =>
                            prevTableData.map((data) =>
                              data.bid_id === bidId || data.bidId === bidId
                                ? { ...data, isChecked }
                                : data
                            )
                          );

                          setSegeregatedMaterialData((prevData) => {
                            const updatedData = prevData.map(
                              (material, idx) =>
                                idx === accordianIndex
                                  ? {
                                      ...material,
                                      bids_values: material.bids_values.map(
                                        (bid) =>
                                          bid.bid_id === bidId
                                            ? { ...bid, isChecked }
                                            : { ...bid }
                                      ),
                                    }
                                  : material
                            );

                            // Call handleColumnClick with the updated data immediately
                            handleColumnClick(
                              { ...updatedTableData[index], isChecked },
                              "amount",
                              e, // Pass the event object here
                              updatedData // Pass the updated data directly
                            );

                            return updatedData; // Update the state with the new data
                          });
                        }}
                        style={{ 
                          cursor: updatedTableData[index]?.po_exists ? "not-allowed" : "pointer" 
                        }}
                      />
                    )}
                    <span>
                      {amt}
                      {/* Show PO icon or text if po_exist is true */}
                    </span>
                  </span>
                ))}
              </span>
            </button>
          </h2>

          <div
            className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
            aria-labelledby="headingOne"
          >
            <div className="accordion-body p-0">
              <Table
                columns={tableColumn}
                data={updatedTableData}
                serializedData={serializedData}
                isHorizontal={true}
                onRowSelect={undefined}
                resetSelectedRows={undefined}
                onResetComplete={undefined}
                onColumnClick={handleColumnClick} // Pass the updated function
                enableHoverEffect={enableHoverEffect}
                onSelectAll={onSelectAll} // Pass to Table
                fullWidth={true}
                style={{
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  tableLayout: "fixed",
                  width: "100%"
                }}
                cellStyle={{
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  verticalAlign: "top",
                  padding: "8px",
                  border: "1px solid #ddd"
                }}
                customRender={{
                  col_0: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  col_1: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  col_2: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  col_3: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  col_4: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  col_5: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  property: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: cell === "Information" || cell === "Passing Score" || cell === "Question Type" || cell === "Weightage" || cell === "Remark" ? "bold" : "normal",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  value: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  // Vendor column renderers for unified checklist
                  vendor_0: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  vendor_1: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  vendor_2: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  vendor_3: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  vendor_4: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  // Property column renderers for transposed unified checklist
                  vendor: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      fontWeight: "bold",
                      padding: "4px",
                      backgroundColor: "#f8f9fa",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_0: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_1: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_2: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_3: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_4: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_5: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_6: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_7: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_8: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  prop_9: (cell, rowIndex, row) => (
                    <div style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                      padding: "4px",
                      width: "100%"
                    }}>
                      {cell}
                    </div>
                  ),
                  taxRate: (value, rowIndex, rowData) => (
                    <button
                      className="purple-btn2"
                      onClick={() => handleTaxButtonClick(rowData, "taxRate",rowIndex)}
                    >
                      View Tax
                    </button>
                  ),
                  eventVendors: () =>
                    eventVendors?.map((vendor) => {
                      return (
                        <td key={`selectall-${vendor.id}`}>
                          <input
                            type="checkbox"
                            checked={!checkedColumns[vendor.id]}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              handleColumnCheckboxChange(vendor.id, isChecked);

                              // Check/uncheck all matching bid_id checkboxes
                              updatedTableData.forEach((data, idx) => {
                                if (data.vendor_id === vendor.id) {
                                  const bidId = data.bid_id || data.bidId;
                                  updatedTableData.forEach((row) => {
                                    if (
                                      row.bid_id === bidId ||
                                      row.bidId === bidId
                                    ) {
                                      handleColumnClick(row, "amount", {
                                        target: { checked: isChecked },
                                      });
                                    }
                                  });
                                }
                              });
                            }}
                          />
                        </td>
                      );
                    }),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
