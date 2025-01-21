import React from "react";
import SectionAccordion from "../components/common/Accordion/SectionAccordion";
import Accordion from "../components/base/Accordion/Accordion";

export default function SectionTab() {
  const seg = {
    section_n_subSection: [
      {
        section_name: "Section One",
        section_id: 1,
        sub_section_name: "Sub Section One",
        sub_section_id: 1,
        bids_data: [
          {
            material_id: 2,
            material_name:
              "TILE 300MM X 200MM ATLANTA BEIGE (KAJARIA)(Test12) 10.0  requested at test 1 location",
            bids_values: [
              {
                id: 519,
                vendor_name: "Adhip Shetty",
                quantity_available: 345,
                price: "200.0",
                discount: "4.0",
                total_amount: "89700.0",
                gst: 17,
                realised_gst: 11730,
                landed_amount: 77970,
              },
              {
                id: 431,
                vendor_name: "Satyam Testing",
                quantity_available: 10,
                price: "99.0",
                discount: "19.0",
                total_amount: "10676.6",
                gst: 18,
                realised_gst: 144,
                landed_amount: 801,
              },
            ],
          },
          {
            material_id: 2,
            material_name:
              "TILE 300MM X 200MM ATLANTA BEIGE (KAJARIA)(Test12) 10.0  requested at test 1 location",
            bids_values: [
              {
                id: 519,
                vendor_name: "Adhip Shetty",
                quantity_available: 345,
                price: "200.0",
                discount: "4.0",
                total_amount: "89700.0",
                gst: 17,
                realised_gst: 11730,
                landed_amount: 77970,
              },
              {
                id: 431,
                vendor_name: "Satyam Testing",
                quantity_available: 10,
                price: "99.0",
                discount: "19.0",
                total_amount: "10676.6",
                gst: 18,
                realised_gst: 144,
                landed_amount: 801,
              },
            ],
          },
        ],
      },
      {
        section_name: "Section Two",
        section_id: 2,
        sub_section_name: "Sub Section Two",
        sub_section_id: 2,
        bids_data: [
          {
            material_id: 20,
            material_name: "MS() 20.0  requested at test 2 location",
            bids_values: [
              {
                id: 520,
                vendor_name: "Adhip Shetty",
                quantity_available: 50,
                price: "100.0",
                discount: "7.0",
                total_amount: "6450.0",
                gst: 18,
                realised_gst: 900,
                landed_amount: 5550,
              },
              {
                id: 432,
                vendor_name: "Satyam Testing",
                quantity_available: 20,
                price: "23.0",
                discount: "33.0",
                total_amount: "10676.6",
                gst: 28,
                realised_gst: 86,
                landed_amount: 308,
              },
            ],
          },
          {
            material_id: 20,
            material_name: "MS() 20.0  requested at test 2 location",
            bids_values: [
              {
                id: 520,
                vendor_name: "Adhip Shetty",
                quantity_available: 50,
                price: "100.0",
                discount: "7.0",
                total_amount: "6450.0",
                gst: 18,
                realised_gst: 900,
                landed_amount: 5550,
              },
              {
                id: 432,
                vendor_name: "Satyam Testing",
                quantity_available: 20,
                price: "23.0",
                discount: "33.0",
                total_amount: "10676.6",
                gst: 28,
                realised_gst: 86,
                landed_amount: 308,
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div style={{ overflow: "auto" }}>
      {seg.section_n_subSection.map((item) => (
        <SectionAccordion
          key={`${item.section_id}-${item.sub_section_id}`}
          title={`Section - ${item.section_name} & Sub Section - ${item.sub_section_name}`}
          bidsData={item.bids_data}
        />
      ))}
    </div>
  );
}
