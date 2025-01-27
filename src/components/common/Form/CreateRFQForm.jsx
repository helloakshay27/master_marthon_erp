// @ts-ignore
import { mumbaiLocations, product, unitMeasure } from "../../../constant/data";
// @ts-ignore
import MultiSelector from "../../base/Select/MultiSelector";
import SelectBox from "../../base/Select/SelectBox";
import Table from "../../base/Table/Table";
import React, { useState } from "react";
import { useEffect } from "react";
// @ts-ignore
import axios from "axios";
// @ts-ignore
import { type } from "jquery";

export default function CreateRFQForm({ data, setData, isService }) {
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([
    {
      sectionData: data,
      sectionId: Date.now(),
    },
  ]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [subSectionOptions, setSubSectionOptions] = useState([]);
  const [isMorSelected, setIsMorSelected] = useState(false);
  const [morInventories, setMorInventories] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com/rfq/events/material_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        const data = await response.json();
        if (data && Array.isArray(data.materials)) {
          setMaterials(data.materials);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com//pms/sections/section_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        const data = await response.json();
        if (data && Array.isArray(data.section_list)) {
          setSectionOptions(
            data.section_list.map((section) => ({
              label: section.name,
              value: section.value,
            }))
          );
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchSubSections = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com//pms/sections/sub_section_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        const data = await response.json();
        if (data && Array.isArray(data.section_list)) {
          setSubSectionOptions(
            data.section_list.map((subSection) => ({
              label: subSection.name,
              value: subSection.value,
            }))
          );
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching sub-sections:", error);
      }
    };

    const fetchMorInventories = async () => {
      try {
        console.log("Fetching MOR inventories...");
        const response = await fetch(
          `https://marathon.lockated.com/rfq/events/mor_inventories?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&mor_inventories="128,129"`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          }
        );
        const data = await response.json();
        console.log("Response received:", data.materials);
        if (data && Array.isArray(data.materials)) {
          setMorInventories(data.materials);

          const initialSectionData = data.materials.map((inventory) => ({
            descriptionOfItem: inventory.inventory.name,
            quantity: inventory.required_quantity,
            unit: inventory.inventory.uom_name,
            type: inventory.inventory.type,
            location: "",
            rate: inventory.material_rate || 0,
            amount: (inventory.material_rate || 0) * inventory.required_quantity,
            mor_number: inventory.mor_number,
            expected_date_of_delivery: inventory.expected_date_of_delivery,
            inventory_id: inventory.inventory_id,
            sub_section_id: "",
            section_id: "",
          }));

          setSections([
            {
              sectionData: initialSectionData,
              sectionId: Date.now(),
            },
          ]);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching MOR inventories:", error);
      }
    };

    fetchMaterials();
    fetchSections();
    fetchSubSections();
    fetchMorInventories();
  }, []);

  useEffect(() => {
    setData(sections.flatMap((section) => section.sectionData));
  }, [sections, setData]);

  // @ts-ignore
  const handleUnitChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].unit = selected;
    setSections(updatedSections);
  };

  // @ts-ignore
  const handleLocationChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].location = selected;
    setSections(updatedSections);
  };

  const handleRemoveRow = (rowIndex, sectionIndex) => {
    if (rowIndex > 0) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].sectionData = updatedSections[
        sectionIndex
      ].sectionData.filter((_, index) => index !== rowIndex);
      setSections(updatedSections);
    }
  };

  const handleAddRow = (sectionIndex) => {
    const newRow = {
      descriptionOfItem: [],
      quantity: "",
      unit: [],
      type: materials[0]?.type || "",
      location: [],
      rate: 0,
      amount: 0,
      inventory_id: "",
      sub_section_id:
        sections[sectionIndex].sectionData[0]?.sub_section_id || "",
      section_id: sections[sectionIndex].sectionData[0]?.section_id || "",
    };
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData = [
      ...updatedSections[sectionIndex].sectionData,
      newRow,
    ];
    setSections(updatedSections);
  };

  const handleInputChange = (value, rowIndex, key, sectionIndex) => {
    const updatedSections = [...sections];
    if (
      updatedSections[sectionIndex].sectionData[rowIndex]["inventory_id"] === ""
    ) {
      updatedSections[sectionIndex].sectionData[rowIndex]["inventory_id"] =
        materials[rowIndex]?.id || "";
    }
    updatedSections[sectionIndex].sectionData[rowIndex][key] = value;
    setSections(updatedSections);
  };

  const handleDescriptionOfItemChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    const selectedMaterial = materials.find(
      (material) => material.name === selected
    );

    updatedSections[sectionIndex].sectionData[rowIndex].descriptionOfItem =
      selected;

    if (selectedMaterial && selectedMaterial.uom) {
      updatedSections[sectionIndex].sectionData[rowIndex].unit =
        selectedMaterial.uom.uom_short_name;
    } else {
      updatedSections[sectionIndex].sectionData[rowIndex].unit = "";
    }
    updatedSections[sectionIndex].sectionData[rowIndex].type =
      selectedMaterial?.type || "N/A";
    updatedSections[sectionIndex].sectionData[rowIndex].inventory_id =
      selectedMaterial?.id || "";
    setSections(updatedSections);
  };

  const handleMorChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    const selectedMor = morInventories.find(
      (inventory) => inventory.mor_number === selected
    );

    updatedSections[sectionIndex].sectionData[rowIndex].mor_number = selected;

    if (selectedMor) {
      updatedSections[sectionIndex].sectionData[rowIndex].descriptionOfItem =
        selectedMor.inventory.name;
      updatedSections[sectionIndex].sectionData[rowIndex].unit =
        selectedMor.inventory.uom_name;
      updatedSections[sectionIndex].sectionData[rowIndex].type =
        selectedMor.inventory.type;
      updatedSections[sectionIndex].sectionData[rowIndex].quantity =
        selectedMor.required_quantity;
      updatedSections[sectionIndex].sectionData[rowIndex].expected_date_of_delivery =
        selectedMor.expected_date_of_delivery;
      updatedSections[sectionIndex].sectionData[rowIndex].rate =
        selectedMor.material_rate || 0;
      updatedSections[sectionIndex].sectionData[rowIndex].amount =
        (selectedMor.material_rate || 0) * selectedMor.required_quantity;
    }
    setSections(updatedSections);
  };

  useEffect(() => {
    if (isMorSelected && morInventories.length > 0) {
      const initialSectionData = morInventories.map((inventory) => ({
        descriptionOfItem: inventory.inventory.name,
        quantity: inventory.required_quantity,
        unit: inventory.inventory.uom_name,
        type: inventory.inventory.type,
        location: "",
        rate: inventory.material_rate || 0,
        amount: (inventory.material_rate || 0) * inventory.required_quantity,
        mor_number: inventory.mor_number,
        expected_date_of_delivery: inventory.expected_date_of_delivery,
        inventory_id: inventory.inventory_id,
        sub_section_id: "",
        section_id: "",
      }));

      setSections([
        {
          sectionData: initialSectionData,
          sectionId: Date.now(),
        },
      ]);
    }
  }, [isMorSelected, morInventories]);

  const handleAddSection = () => {
    const newSection = {
      sectionData: [
        {
          descriptionOfItem: [],
          quantity: "",
          unit: [],
          type: materials[0]?.type || "",
          location: [],
          rate: 0,
          amount: 0,
          inventory_id: "",
          sub_section_id: "",
          section_id: "",
        },
      ],
      sectionId: Date.now(),
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sectionIndex) => {
    if (sectionIndex > 0) {
      const updatedSections = sections.filter(
        (_, index) => index !== sectionIndex
      );
      setSections(updatedSections);
    }
  };

  const handleSectionChange = (selected, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.forEach((row) => {
      row.section_id = selected;
    });
    setSections(updatedSections);
  };

  const handleSubSectionChange = (selected, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.forEach((row) => {
      row.sub_section_id = selected;
    });
    setSections(updatedSections);
  };

  const materialOptions = materials.map((material) => ({
    value: material.name,
    label: material.name,
  }));

  const morInventoryOptions = morInventories.map((inventory) => ({
    value: inventory.mor_number,
    label: inventory.mor_number,
  }));

  return (
    <div className="row px-3">
      <div className="col-md-12 d-flex align-items-baseline mb-4 gap-2">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={(e) => setIsMorSelected(e.target.checked)}
        />
        <h5>Select From MOR</h5>
      </div>
      <div className="card p-0">
        <div className="card-header3">
          <h3 className="card-title">
            {isMorSelected ? "Select Material Order Request" : `Select ${isService ? "Services" : "Materials"}`}{" "}
          </h3>
        </div>
        <div className="px-3 py-3">
          {sections.map((section, sectionIndex) => (
            <div key={section.sectionId} className="card p-4 mb-4">
              <div className="row justify-content-between">
                <div className={isMorSelected? 'col-md-4 col-sm-6' : `col-md-8 col-sm-12 d-flex gap-3`}>
                  <div className="flex-grow-1">
                    <SelectBox
                      label={isMorSelected ? "Select MOR" : "Select Type"}
                      options={isMorSelected ? morInventoryOptions : sectionOptions}
                      defaultValue={isMorSelected ? "Select MOR" : "Select Type"}
                      onChange={(selected) =>
                        handleSectionChange(selected, sectionIndex)
                      }
                    />
                  </div>
                  {!isMorSelected && <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Sub Type"}
                      options={subSectionOptions}
                      defaultValue={"Select Sub Type"}
                      onChange={(selected) =>
                        handleSubSectionChange(selected, sectionIndex)
                      }
                    />
                  </div>}
                </div>
                <div className="col-md-4 col-sm-12 d-flex gap-3 py-3 justify-content-end">
                  <button
                    className="purple-btn2"
                    onClick={() => handleAddRow(sectionIndex)}
                  >
                    <span className="material-symbols-outlined align-text-top">
                      add{" "}
                    </span>
                    <span>Add Row</span>
                  </button>
                  {sectionIndex > 0 && (
                    <button
                      className="purple-btn2"
                      onClick={() => handleRemoveSection(sectionIndex)}
                    >
                      Remove Section
                    </button>
                  )}
                </div>
              </div>
              <Table
                columns={[
                  { label: "Sr no.", key: "srno" },
                  { label: "Description of Item", key: "descriptionOfItem" },
                  { label: "Quantity", key: "quantity" },
                  { label: "UOM", key: "unit" },
                  { label: "Type", key: "type" },
                  { label: "Location", key: "location" },
                  { label: "Rate", key: "rate" },
                  { label: "Amount", key: "amount" },
                  { label: "MOR Number", key: "mor_number" },
                  { label: "Expected Delivery Date", key: "expected_date_of_delivery" },
                  { label: "Actions", key: "actions" },
                ]}
                data={section.sectionData}
                customRender={{
                  srno: (cell, rowIndex) => <p>{rowIndex + 1}</p>,
                  descriptionOfItem: (cell, rowIndex) => (
                    <SelectBox
                      label={""}
                      options={materialOptions}
                      defaultValue={cell}
                      onChange={(selected) =>
                        handleDescriptionOfItemChange(
                          selected,
                          rowIndex,
                          sectionIndex
                        )
                      }
                    />
                  ),
                  unit: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      readOnly
                    />
                  ),
                  type: (cell, rowIndex) => <p>{cell}</p>,
                  location: (cell, rowIndex) => (
                    <input
                      type="text"
                      className="form-control"
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(
                          e.target.value,
                          rowIndex,
                          "location",
                          sectionIndex
                        )
                      }
                    />
                  ),
                  quantity: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(
                          e.target.value,
                          rowIndex,
                          "quantity",
                          sectionIndex
                        )
                      }
                      placeholder="Enter Quantity"
                    />
                  ),
                  rate: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(
                          e.target.value,
                          rowIndex,
                          "rate",
                          sectionIndex
                        )
                      }
                      placeholder="Enter Rate"
                    />
                  ),
                  amount: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      readOnly
                    />
                  ),
                  mor_number: (cell, rowIndex) => (
                    <SelectBox
                      label={""}
                      options={morInventoryOptions}
                      defaultValue={cell}
                      onChange={(selected) =>
                        handleMorChange(
                          selected,
                          rowIndex,
                          sectionIndex
                        )
                      }
                    />
                  ),
                  expected_date_of_delivery: (cell, rowIndex) => (
                    <p>{cell}</p>
                  ),
                  actions: (_, rowIndex) => (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(rowIndex, sectionIndex)}
                      disabled={rowIndex === 0}
                    >
                      Remove
                    </button>
                  ),
                }}
                onRowSelect={undefined}
                handleCheckboxChange={undefined}
                resetSelectedRows={undefined}
                onResetComplete={undefined}
              />
            </div>
          ))}
          <button className="purple-btn2" onClick={handleAddSection}>
            <span className="material-symbols-outlined align-text-top">
              add{" "}
            </span>
            <span>Add Section</span>
          </button>
        </div>
      </div>
    </div>
  );
}
