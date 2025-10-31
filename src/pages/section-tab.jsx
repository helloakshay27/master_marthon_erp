import React from "react";
import SectionAccordion from "../components/common/Accordion/SectionAccordion";
import Accordion from "../components/base/Accordion/Accordion";

export default function SectionTab() {
  const seg = {
    categories: [
      {
        category: "Technical Specifications",
        subcategories: [
          {
            id: 1,
            name: "Material Requirements",
            questions: [
              {
                descr: "Does the material meet IS standards?",
                answers: {
                  question_id: 1,
                  answers: ""
                }
              },
              {
                descr: "Is the material fire resistant?",
                answers: {
                  question_id: 2,
                  answers: ""
                }
              }
            ]
          },
          {
            id: 2,
            name: "Quality Assurance",
            questions: [
              {
                descr: "Do you have quality certification?",
                answers: {
                  question_id: 3,
                  answers: ""
                }
              }
            ]
          }
        ]
      },
      {
        category: "Delivery & Logistics",
        subcategories: [
          {
            id: 3,
            name: "Delivery Timeline",
            questions: [
              {
                descr: "Can you deliver within 30 days?",
                answers: {
                  question_id: 4,
                  answers: ""
                }
              },
              {
                descr: "Do you provide installation services?",
                answers: {
                  question_id: 5,
                  answers: ""
                }
              }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div style={{ overflow: "auto", height:'100vh' }}>
      {seg.categories.map((category, categoryIndex) => (
        <SectionAccordion
          key={categoryIndex}
          title={`Category - ${category.category}`}
          categoryData={category}
        />
      ))}
    </div>
  );  
}
