import React, { useState } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import Table from "../Table/Table";
import Tooltip from "../../common/Tooltip/Tooltip";

export default function Accordion({
  title,
  amount = [],
  isDefault,
  tableColumn,
  tableData,
  onColumnClick,
  enableHoverEffect,
  handleTaxButtonClick,
  isAllocation = false,
  onSelectAll,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // State for selected amounts

  const toggleAccordion = () => setIsOpen(!isOpen);

  const handleAmountSelection = (amt) => {
    const isSelected = selectedAmounts.includes(amt);
    const updatedSelectedAmounts = isSelected
      ? selectedAmounts.filter((selectedAmt) => selectedAmt !== amt)
      : [...selectedAmounts, amt];

    setSelectedAmounts(updatedSelectedAmounts);

    if (onSelectAll) {
      onSelectAll(amt, !isSelected); // Notify parent about selection change
    }
  };

  // Sort the amounts to determine the least, second least, and third least values
  const sortedAmounts = [...amount].sort((a, b) => a - b);
  const leastAmount = sortedAmounts[0];
  const secondLeastAmount = sortedAmounts[1];
  const thirdLeastAmount = sortedAmounts[2];

  const handleColumnClick = (data, columnKey) => {
    if (onColumnClick) {
      const bid_id = data.bid_id || data.bidId;
      const material_id = data.material_id || data.materialId;
      const vendor_id = data.vendor_id || data.vendorId;

      // If there are multiple materials, iterate over them
      if (Array.isArray(data.materials) && data.materials.length > 0) {
        data.materials.forEach((material) => {
          const materialData = {
            bid_id: material.bid_id || material.bidId,
            material_id: material.material_id || material.materialId,
            vendor_id: material.vendor_id || material.vendorId,
            ...material,
          };
          onColumnClick(materialData, columnKey);
        });
      } else {
        // Handle single material
        onColumnClick({ bid_id, material_id, vendor_id, ...data }, columnKey);
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
    <div className="accordion rounded-0 border-0 mb-0" id="accordionExample">
      <div className="accordion-item rounded-0">
        <h2 className="accordion-header">
          <button
            className="accordion-button viewBy-collapT1 p-0 "
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
              <span style={{ width: "260px", display: "inline-block", paddingRight: "10px" }}>
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
                    whiteSpace: "nowrap",
                    backgroundColor: getBackgroundColor(amt),
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px", // Add spacing between checkbox and amount
                  }}
                >
                  {isAllocation && (
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleColumnClick(
                          tableData[index], // Pass the correct data for the row
                          "amount"
                        )
                      }
                      style={{cursor: "pointer"}}
                    />
                  )}
                  {amt}
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
              data={tableData}
              isHorizontal={true}
              onRowSelect={undefined}
              resetSelectedRows={undefined}
              onResetComplete={undefined}
              onColumnClick={handleColumnClick} // Pass the updated function
              enableHoverEffect={enableHoverEffect}
              onSelectAll={onSelectAll} // Pass to Table
              customRender={{
                taxRate: (value, rowIndex, rowData) => (
                  <button
                    className="purple-btn2"
                    onClick={() => handleTaxButtonClick(rowData, "taxRate")}
                  >
                    View Tax
                  </button>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
