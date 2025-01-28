import React, { useState, useEffect } from "react";
import SelectBox from "../../base/Select/SelectBox";
import Table from "../../base/Table/Table";

export default function CreateMorRFQForm({ data, setData, isService }) {
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
  const [locations, setLocations] = useState([]);

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
          "https://marathon.lockated.com/rfq/events/material_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        const data = await response.json();
        if (data && Array.isArray(data.inventory_types)) {
          setSectionOptions(
            data.inventory_types.map((section) => ({
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
          "https://marathon.lockated.com/rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        const data = await response.json();
        if (data && Array.isArray(data.inventory_sub_types)) {
          setSubSectionOptions(
            data.inventory_sub_types.map((subSection) => ({
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
              "Content-Type": "application/json",
              Accept: "application/json",
            },
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
            amount:
              (inventory.material_rate || 0) * inventory.required_quantity,
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

    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com/rfq/events/location_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_supplier_ids=[6,7]"
        );
        const data = await response.json();
        if (data && Array.isArray(data.locations_list)) {
          setLocations(data.locations_list);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchMaterials();
    fetchSections();
    fetchSubSections();
    fetchMorInventories();
    fetchLocations();
  }, []);

  useEffect(() => {
    setData(sections.flatMap((section) => section.sectionData));
  }, [sections, setData]);

  const handleUnitChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].unit = selected;
    setSections(updatedSections);
  };

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
      updatedSections[sectionIndex].sectionData[
        rowIndex
      ].expected_date_of_delivery = selectedMor.expected_date_of_delivery;
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

  const locationOptions = locations.map((location) => ({
    value: location.value,
    label: location.name,
  }));

  return (
    <div className="row px-3">
      <div className="card p-0">
        <div className="card-header3">
          <h3 className="card-title">
            {`Select ${isService ? "Services" : "Materials"}`}{" "}
          </h3>
        </div>
        <div className="px-3 py-3">
          {sections.map((section, sectionIndex) => (
            <div key={section.sectionId} className="card p-4 mb-4">
              <div className="row justify-content-between">
                <div className={`col-md-8 col-sm-12 d-flex gap-3`}>
                  <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Material Type"}
                      options={sectionOptions}
                      defaultValue={"Select Material Type"}
                      onChange={(selected) =>
                        handleSectionChange(selected, sectionIndex)
                      }
                    />
                  </div>
                  <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Sub Material Type"}
                      options={subSectionOptions}
                      defaultValue={"Select Sub Material Type"}
                      onChange={(selected) =>
                        handleSubSectionChange(selected, sectionIndex)
                      }
                    />
                  </div>
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
                  {
                    label: "Expected Delivery Date",
                    key: "expected_date_of_delivery",
                  },
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
                    <SelectBox
                      label={""}
                      options={locationOptions}
                      defaultValue={cell}
                      onChange={(selected) =>
                        handleLocationChange(selected, rowIndex, sectionIndex)
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
                        handleMorChange(selected, rowIndex, sectionIndex)
                      }
                    />
                  ),
                  expected_date_of_delivery: (cell, rowIndex) => <p>{cell}</p>,
                  actions: (_, rowIndex) => (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(rowIndex, sectionIndex)}
                      disabled={section.sectionData.length == 1}
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
