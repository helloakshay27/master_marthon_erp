import React, { useState } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import Table from "../Table/Table";

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

  const handleColumnClick = (data) => {
    if (onColumnClick) {
      onColumnClick(data);
    }
  };

  return (
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
            }}
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen}
          >
            <span className="pe-3">
              <DropArrowIcon isOpen={isOpen} />
            </span>{" "}
            <span style={{ width: "250px" }}>{title}</span>
            <span style={{ display: "flex", flexWrap: "wrap" }}>
              {amount?.map((amt, index) => (
                <span
                  key={index}
                  style={{
                    paddingLeft: '20px',
                    width: "250px",
                    textAlign: "left",
                    whiteSpace: "nowrap"
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
