import React, { useState } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import Accordion from "../../base/Accordion/Accordion";

export default function SectionAccordion({ title, bidsData }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="accordion rounded-0 border-0 mb-0" id="accordionExample">
      <div className="accordion-item rounded-0">
        <h2 className="accordion-header">
          <button
            className="accordion-button viewBy-collapT1"
            style={{ position: "relative", width: "100%", background: '#000', fontSize: '8px' }}
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
          <div className="accordion-body p-3">
            {bidsData.map((bid, index) => (
              <Accordion
                key={index}
                title={bid.material_name}
                tableColumn={[
                  { label: "Vendor Name", key: "vendor_name" },
                  { label: "Quantity Available", key: "quantity_available" },
                  { label: "Price", key: "price" },
                  { label: "Discount", key: "discount" },
                  { label: "Total Amount", key: "total_amount" },
                  { label: "GST", key: "gst" },
                  { label: "Realised GST", key: "realised_gst" },
                  { label: "Landed Amount", key: "landed_amount" }
                ]}
                tableData={bid.bids_values} isDefault={undefined}              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}