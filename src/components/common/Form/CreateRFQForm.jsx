import axios from "axios";
import { mumbaiLocations, product, unitMeasure } from "../../../constant/data";
import MultiSelector from "../../base/Select/MultiSelector";
import SelectBox from "../../base/Select/SelectBox";
import Table from "../../base/Table/Table";
import { useEffect, useState } from "react";
import React from "react";
import { baseURL } from "../../../confi/apiDomain";

export default function CreateRFQForm({
  data,
  setData,
  isService,
  existingData,
  deliveryData,
}) {
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([
    {
      sectionData: data,
      sectionId: Date.now(),
    },
  ]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [subSectionOptions, setSubSectionOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);

  const fetchMaterials = async (inventoryTypeId) => {
    try {
      const url = inventoryTypeId
        ? `${baseURL}rfq/events/material_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_inventory_type_id=${inventoryTypeId}`
        : `${baseURL}rfq/events/material_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      console.log(url, inventoryTypeId);

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.materials)) {
        const materialOptions = response.data.materials.map((material) => ({
          value: material.id,
          label: material.name,
          uom: material.uom,
        }));
        setMaterials(materialOptions);
        console.log("materials :----", materials);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchSubSections = async (inventoryTypeId) => {
    try {
      const url = inventoryTypeId
        ? `${baseURL}rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_inventory_type_id=${inventoryTypeId}`
        : `${baseURL}rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.inventory_sub_types)) {
        setSubSectionOptions(
          response.data.inventory_sub_types.map((subSection) => ({
            label: subSection.name,
            value: subSection.value,
          }))
        );
        console.log("subSectionOptions :----", subSectionOptions);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching sub-sections:", error);
    }
  };

  useEffect(() => {
    if (existingData) {
      const updatedSections = Object.entries(existingData).map(
        ([materialType, subMaterials]) => {
          const materialsArray = Object.values(subMaterials).flat();
          console.log("materialsArray:----", materialsArray);

          const inventoryTypeId = materialsArray[0]?.inventory_type_id;
          const inventorySubTypeId = materialsArray[0]?.inventory_sub_type_id;

          fetchMaterials(inventoryTypeId);
          fetchSubSections(inventorySubTypeId);
          return {
            materialType,
            sectionData: materialsArray.map((material) => ({
              id: material.id,
              descriptionOfItem:
                material.inventory_name || material.descriptionOfItem,
              inventory_id: material.inventory_id,
              quantity: material.quantity,
              unit: material.uom,
              location: material.location,
              rate: material.rate,
              amount: material.amount,
              sub_section_id: material.sub_section_id,
              section_id: material.inventory_type_id || material.section_id,
              inventory_type_id: material.inventory_type_id,
              inventory_sub_type_id: material.inventory_sub_type_id,
              subMaterialType: material.inventory_sub_type, // Correctly map subMaterialType
              _destroy: false,
            })),
          };
        }
      );
      // @ts-ignore
      setSections(updatedSections);
      setData(updatedSections.flatMap((section) => section.sectionData));
    } else {
      fetchMaterials();
      fetchSubSections(); // Fetch sub-sections without inventory_type_id
    }
  }, [existingData]);

  useEffect(() => {
    console.log("Existing data:", existingData);

    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/material_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data && Array.isArray(response.data.inventory_types)) {
          setSectionOptions(
            response.data.inventory_types.map((section) => ({
              label: section.name,
              value: section.value,
            }))
          );
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/location_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        if (response.data && Array.isArray(response.data.locations_list)) {
          setLocationOptions(
            response.data.locations_list.map((location) => ({
              label: location.name,
              value: location.value,
            }))
          );
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchUoms = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/uoms?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        if (response.data && Array.isArray(response.data.unit_of_measures)) {
          const uomOptions = response.data.unit_of_measures.map((uom) => ({
            label: uom.name,
            value: uom.value,
          }));
          setUomOptions(uomOptions);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching UOMs:", error);
      }
    };

    fetchSections();
    fetchSubSections();
    fetchLocations();
    fetchUoms();
    fetchMaterials();
  }, []);

  useEffect(() => {
    setData(sections.flatMap((section) => section.sectionData));
  }, [sections]);

  const handleUnitChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].unit = selected;
    setSections(updatedSections);
  };

  const handleLocationChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    const selectedLocation = locationOptions.find(
      (location) => location.value === selected
    );
    updatedSections[sectionIndex].sectionData[rowIndex].location =
      selectedLocation ? selectedLocation.label : selected;
    setSections(updatedSections);
  };

  const handleRemoveRow = (rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.splice(rowIndex, 1);
    setSections(updatedSections);
  };

  const handleAddRow = (sectionIndex) => {
    const newRow = {
      id: null, // Set id to null for new rows
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
      inventory_type_id:
        sections[sectionIndex].sectionData[0]?.inventory_type_id || "", // Add inventory_type_id
      inventory_sub_type_id:
        sections[sectionIndex].sectionData[0]?.inventory_sub_type_id || "", // Add inventory_sub_type_id
      _destroy: false,
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
    updatedSections[sectionIndex].sectionData[rowIndex][key] = value;
    setSections(updatedSections);
  };

  const handleDescriptionOfItemChange = (selected, rowIndex, sectionIndex) => {
    const updatedSections = [...sections];
    const selectedMaterial = materials.find(
      (material) => material.value === selected
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
      selectedMaterial?.value || "";
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    const newSection = {
      sectionData: [
        {
          id: null, // Set id to null for new sections
          descriptionOfItem: [],
          quantity: "",
          unit: [],
          type: materials[0]?.type || "",
          location: [],
          rate: 0,
          amount: 0,
          inventory_id: "",
          sub_section_id: subSectionOptions[0]?.value || "",
          section_id: sectionOptions[0]?.value || "",
          inventory_type_id: sectionOptions[0]?.value || "", // Add inventory_type_id
          inventory_sub_type_id: subSectionOptions[0]?.value || "", // Add inventory_sub_type_id
          _destroy: false,
        },
      ],
      sectionId: Date.now(),
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.forEach((row) => {
      row._destroy = true;
    });
    setSections(updatedSections);
  };

  const handleSectionChange = (selected, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.forEach((row) => {
      row.section_id = selected;
      row.inventory_type_id = selected; // Update inventory_type_id
    });
    setSections(updatedSections);
  };

  const handleSubSectionChange = (selected, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData.forEach((row) => {
      row.sub_section_id = selected;
      row.inventory_sub_type_id = selected; // Update inventory_sub_type_id
    });
    setSections(updatedSections);
  };

  const deliveryColumns = [
    { label: "Material Name", key: "material_formatted_name" },
    { label: "MOR Number", key: "mor_number" },
    { label: "Expected Date", key: "expected_date" },
    { label: "Expected Quantity", key: "expected_quantity" },
  ];

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
              <div className="row">
                <div className="col-md-8 col-sm-12 d-flex gap-3">
                  <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Material Type"}
                      options={sectionOptions}
                      defaultValue={
                        section?.sectionData?.some((row) => row?._destroy)
                          ? "Select Material Type"
                          : sectionOptions?.find(
                              (option) => option.label === section?.materialType
                            )?.value || "Select Material Type"
                      }
                      onChange={(selected) =>
                        handleSectionChange(selected, sectionIndex)
                      }
                    />
                  </div>
                  <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Sub Material Type"}
                      options={subSectionOptions}
                      defaultValue={
                        section?.sectionData?.some((row) => row?._destroy)
                          ? "Select Sub Material Type"
                          : subSectionOptions?.find(
                              (option) =>
                                option.label ===
                                section?.sectionData[0]?.subMaterialType
                            )?.value || "Select Sub Material Type"
                      }
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
                  { label: "Material Name", key: "descriptionOfItem" },
                  { label: "Quantity", key: "quantity" },
                  { label: "UOM", key: "unit" },
                  // { label: "Type", key: "type" },
                  { label: "Location", key: "location" },
                  { label: "Rate", key: "rate" },
                  { label: "Amount", key: "amount" },
                  { label: "Actions", key: "actions" },
                ]}
                data={section?.sectionData?.filter((row) => !row._destroy)}
                customRender={{
                  srno: (cell, rowIndex) => <p>{rowIndex + 1}</p>,
                  descriptionOfItem: (cell, rowIndex) => (
                   <>
                    <SelectBox
                      options={materials}
                      onChange={(value) =>
                        handleDescriptionOfItemChange(
                          value,
                          rowIndex,
                          sectionIndex
                        )
                      }
                      defaultValue={
                        section?.sectionData[rowIndex]?._destroy
                          ? ""
                          : materials?.find(
                              (option) =>
                                option?.value ===
                                section?.sectionData[rowIndex]?.inventory_id
                            )?.value || ""
                      }
                    />
                    {/* {console.log(cell,"this is cell",rowIndex)} */}
                   </>
                  ),
                  unit: (cell, rowIndex) => (
                    <SelectBox
                      options={uomOptions}
                      onChange={(value) =>
                        handleUnitChange(value, rowIndex, sectionIndex)
                      }
                      defaultValue={
                        section?.sectionData[rowIndex]?._destroy
                          ? ""
                          : uomOptions?.find(
                              (option) =>
                                option?.value ===
                                section?.sectionData[rowIndex]?.unit
                            )?.value || ""
                      }
                    />
                  ),
                  type: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(
                          e.target.value,
                          rowIndex,
                          "type",
                          sectionIndex
                        )
                      }
                    />
                  ),
                  location: (cell, rowIndex) => {
                    return (
                      <SelectBox
                        options={locationOptions}
                        onChange={(value) =>
                          handleLocationChange(value, rowIndex, sectionIndex)
                        }
                        defaultValue={
                          section.sectionData[rowIndex]._destroy
                            ? ""
                            : locationOptions.find(
                                (option) =>
                                  option.label ===
                                  section.sectionData[rowIndex]?.location
                              )?.value || ""
                        }
                      />
                    );
                  },
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
                      value={""}
                      onChange={(e) =>
                        handleInputChange(
                          e.target.value,
                          rowIndex,
                          "amount",
                          sectionIndex
                        )
                      }
                      placeholder="Enter Amount"
                      disabled
                    />
                  ),
                  actions: (_, rowIndex) => (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(rowIndex, sectionIndex)}
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
          {deliveryData?.length > 0 && (
            <Table columns={deliveryColumns} data={deliveryData} />
          )}
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
