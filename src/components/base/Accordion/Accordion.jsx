import React, { useState } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import Table from "../Table/Table";

export default function Accordion({
  title,
  isDefault,
  tableColumn,
  tableData,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);
  return (
    <div className="accordion rounded-0 border-0 mb-0" id="accordionExample">
      <div className="accordion-item rounded-0">
        <h2 className="accordion-header">
          <button
            className="accordion-button viewBy-collapT1"
            style={{ position: "relative", width: "100%", background:'#000', fontSize:'8px' }}
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen}
          >
            <span className="pe-3">
              <DropArrowIcon isOpen={isOpen} />
            </span>{" "}
            <span>{title}</span>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
