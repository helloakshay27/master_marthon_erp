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
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

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
      onColumnClick({ bid_id, material_id, vendor_id, ...data }, columnKey);
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
            </span>{" "}
            <Tooltip content={title}>
              <span style={{ width: "260px", display: "inline-block", paddingRight:'10px' }}>
                {title}
              </span>
            </Tooltip>
            <span style={{ display: "flex", flexWrap: "wrap" }}>
              {amount?.map((amt, index) => (
                <span
                  key={index}
                  style={{
                    padding: '15px',
                    width: "180px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    backgroundColor: getBackgroundColor(amt),
                    height:'50px'
                  }}
                >
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
              onColumnClick={handleColumnClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
