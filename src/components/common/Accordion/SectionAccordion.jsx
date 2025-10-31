import React, { useState } from "react";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import AccordionOnSection from "./AccordionOnSection";

export default function SectionAccordion({ title, categoryData }) {
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
          <div className="accordion-body m-0 p-0">
            {categoryData.subcategories.map((subcategory, index) => {
              // Collect all property-value pairs for this subcategory
              const allPairs = subcategory.questions.flatMap(question => {
                const pairs = [];
                
                // Main question and answer
                pairs.push({
                  property: question.descr || "N/A",
                  value: question.answers?.ans_descr || "No answer provided"
                });
                
                // Information
                if (question.information) {
                  pairs.push({
                    property: "Information",
                    value: question.information
                  });
                }
                
                // Passing score
                if (question.passing_score !== undefined && question.passing_score !== null) {
                  pairs.push({
                    property: "Passing Score",
                    value: question.passing_score
                  });
                }
                
                // Question type
                if (question.qtype) {
                  pairs.push({
                    property: "Question Type",
                    value: question.qtype
                  });
                }
                
                // Weightage
                if (question.weightage !== undefined && question.weightage !== null) {
                  pairs.push({
                    property: "Weightage",
                    value: question.weightage
                  });
                }
                
                // Remark/Comments
                if (question.answers?.comments) {
                  pairs.push({
                    property: "Remark",
                    value: question.answers.comments
                  });
                }
                
                return pairs;
              });
              
              // Create table columns dynamically based on pairs
              const tableColumns = [
                { label: allPairs[0]?.property || "", key: "col_0" },
                { label: allPairs[1]?.property || "", key: "col_1" },
                { label: allPairs[2]?.property || "", key: "col_2" },
                { label: allPairs[3]?.property || "", key: "col_3" },
                { label: allPairs[4]?.property || "", key: "col_4" },
                { label: allPairs[5]?.property || "", key: "col_5" }
              ].filter(col => col.label !== "");
              
              // Create table data with one row containing all values
              const tableData = [
                allPairs.reduce((acc, pair, index) => {
                  acc[`col_${index}`] = pair.value;
                  return acc;
                }, {})
              ];

              return (
                <AccordionOnSection
                  key={subcategory.id}
                  title={`Subcategory - ${subcategory.name}`}
                  tableColumn={tableColumns}
                  tableData={tableData}
                  isDefault={undefined}
                  enableHoverEffect={false}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}