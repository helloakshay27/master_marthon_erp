import React, { useState, useEffect } from "react";
import SelectBox from "../../base/Select/SelectBox";
import Table from "../../base/Table/Table";
import { baseURL } from "../../../confi/apiDomain";
import ShortTable from "../../base/Table/ShortTable";
import axios from "axios";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { set } from "lodash";

export default function CreateRFQForm({
  data,
  setData,
  isService,
  existingData,
  deliveryData,
  templateData,
  updateSelectedTemplate, // Rename this prop
  updateBidTemplateFields, // Rename this prop
  updateAdditionalFields, // Rename this prop
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
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateOptions, setTemplateOptions] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [bidTemplateFields, setBidTemplateFields] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subTypeId, setSubTypeId] = useState(0);
  const [showShortTableEditModal, setShowShortTableEditModal] = useState(false);
  const [editField, setEditField] = useState({
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
    fieldType: "string",
  });
  const [editShortTableRow, setEditShortTableRow] = useState({
    label: "",
    value: "",
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
  });
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
    fieldType: "string",
  });
  const [brandOptions, setBrandOptions] = useState([]);
  const [materialId, setMaterialId] = useState(0); // New state for materialId

  const mapBidTemplateFields = (fields) => {
    console.log("fields", fields);

    return fields.map((field) => ({
      label: field.field_name,
      value: field.field_name, // Initialize with empty value or any default value
      field_name: field.field_name,
      is_required: field.is_required,
      is_read_only: field.is_read_only,
      field_owner: field.field_owner,
      extra_fields: field.extra_fields || null,
      created_at: field.created_at || new Date().toISOString(),
      updated_at: field.updated_at || new Date().toISOString(),
    }));
  };

  const handleTemplateChange = async (event) => {
    setSelectedTemplate(event);
    updateSelectedTemplate(event); // Update the parent component's state
    console.log("selectedTemplate", selectedTemplate, event);

    try {
      const response = await axios.get(
        `${baseURL}rfq/event_templates/${event}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      if (response.data) {
        const templateData = response.data;
        console.log("Template Data:", templateData);
        const updatedAdditionalFields =
          templateData.bid_material_template_fields || [];
        updateAdditionalFields(updatedAdditionalFields);
        updateBidTemplateFields(
          mapBidTemplateFields(templateData.bid_template_fields || [])
        );
        setBidTemplateFields(
          mapBidTemplateFields(templateData.bid_template_fields || [])
        );
        setAdditionalFields(updatedAdditionalFields);

        // Reset sections to ensure compatibility with the new template
        const updatedSections = sections.map((section) => ({
          ...section,
          sectionData: section.sectionData.map((row) => ({
            ...row,
            ...updatedAdditionalFields.reduce((acc, field) => {
              acc[field.field_name] = row[field.field_name] || ""; // Initialize missing fields
              return acc;
            }, {}),
          })),
        }));
        setSections(updatedSections);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching template details:", error);
    }
  };

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
      // const url = inventoryTypeId
      //   ? `${baseURL}rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_inventory_type_id=${inventoryTypeId}`
      const url = `${baseURL}rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      console.log("Fetching sub-sections with URL:", url);

      const response = await axios.get(url);
      console.log("API Response for sub-sections:", response.data);

      if (response.data && Array.isArray(response.data.inventory_sub_types)) {
        const options = response.data.inventory_sub_types.map((subSection) => ({
          label: subSection.name,
          value: subSection.value,
        }));
        setSubSectionOptions(options);
        console.log("Fetched subSectionOptions:", options);
      } else {
        console.error("Unexpected response structure:", response.data);
        setSubSectionOptions((prevOptions) => [...prevOptions]); // Retain previous options
      }
    } catch (error) {
      console.error("Error fetching sub-sections:", error);
      setSubSectionOptions((prevOptions) => [...prevOptions]); // Retain previous options
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        "https://marathon.lockated.com/rfq/event_templates/template_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
      );
      if (response.data && Array.isArray(response.data.event_templates)) {
        const templateOptions = response.data.event_templates.map(
          (template) => ({
            value: template.id,
            label: template.name || `Template ${template.id}`,
          })
        );
        setTemplateOptions(templateOptions);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
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
          setSubTypeId(inventorySubTypeId);

          if (inventoryTypeId) {
            console.log(
              "Fetching materials for inventoryTypeId:",
              inventoryTypeId
            );
            fetchMaterials(inventoryTypeId);
          }
          if (inventorySubTypeId) {
            console.log(
              "Fetching sub-sections for inventorySubTypeId:",
              inventorySubTypeId
            );
            fetchSubSections(inventorySubTypeId);
          }

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
              subMaterialType: material.inventory_sub_type,
              _destroy: false,
            })),
          };
        }
      );
      setSections(updatedSections);
      setData(updatedSections.flatMap((section) => section.sectionData));
    } else {
      fetchMaterials();
      fetchSubSections(); // Fetch sub-sections without inventory_type_id
    }
    fetchBrands();
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
    // fetchSubSections();
    fetchLocations();
    fetchUoms();
    fetchMaterials();
    fetchBrands(); // Fetch brands
    fetchTemplates(); // Fetch templates
  }, []);

  useEffect(() => {
    setData(sections.flatMap((section) => section.sectionData));
  }, [sections]);

  useEffect(() => {
    // Ensure all field_name keys from additionalFields are included in sectionData
    const updatedSections = sections.map((section) => ({
      ...section,
      sectionData: section.sectionData.map((row) => ({
        ...row,
        ...additionalFields.reduce((acc, field) => {
          if (!(field.field_name in row)) {
            acc[field.field_name] = ""; // Initialize missing field_name with an empty string
          }
          return acc;
        }, {}),
      })),
    }));
    setSections(updatedSections);
  }, [additionalFields]);

  useEffect(() => {
    if (templateData) {
      // Set the selected template based on templateData
      setSelectedTemplate(templateData.event_template_id);

      // Update additionalFields and bidTemplateFields from templateData
      const updatedAdditionalFields =
        templateData.applied_bid_material_template_fields || [];
      const updatedBidTemplateFields =
        templateData.applied_bid_template_fields || [];

      setAdditionalFields(updatedAdditionalFields);
      setBidTemplateFields(updatedBidTemplateFields);

      // Update parent component's state
      updateAdditionalFields(updatedAdditionalFields);
      updateBidTemplateFields(updatedBidTemplateFields);
    }
  }, [templateData]);

  const handleUnitChange = (selected, rowIndex, sectionIndex) => {
    console.log("handleUnitChange called with:", {
      selected,
      rowIndex,
      sectionIndex,
    });

    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].unit = selected;

    setSections(updatedSections);
    console.log("Updated sections after unit change:", updatedSections);
  };

  const handleLocationChange = (selected, rowIndex, sectionIndex) => {
    console.log("handleLocationChange called with:", {
      selected,
      rowIndex,
      sectionIndex,
    });

    const updatedSections = [...sections];
    const selectedLocation = locationOptions.find(
      (location) => location.value === selected
    );

    updatedSections[sectionIndex].sectionData[rowIndex].location =
      selectedLocation ? selectedLocation.label : selected;

    setSections(updatedSections);
    console.log("Updated sections after location change:", updatedSections);
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
    setSections(updatedSections); // Update the sections state

    // Update the parent data with all attributes, including dynamic fields
    const updatedData = updatedSections.flatMap((section) =>
      section.sectionData.map((row) => ({
        id: row.id || null,
        inventory_id: Number(row.inventory_id),
        quantity: Number(row.quantity),
        uom: row.unit,
        location: row.location,
        rate: Number(row.rate),
        amount: row.amount,
        section_name: row.section_id,
        inventory_type_id: row.inventory_type_id,
        inventory_sub_type_id: row.inventory_sub_type_id,
        brand: row.brand || null, // Include brand
        ...additionalFields.reduce((acc, field) => {
          acc[field.field_name] = row[field.field_name] || null; // Add dynamic fields
          return acc;
        }, {}),
        _destroy: row._destroy || false,
      }))
    );
    setData(updatedData); // Update the parent data
  };

  const fetchBrands = async () => {
    console.log("fetchBrands called with materialId:", materialId);

    if (!materialId) {
      console.warn("Material ID is not set. Skipping fetchBrands.");
      return;
    }

    try {
      const url = `${baseURL}rfq/events/pms_brands?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&material_id=${materialId}`;
      console.log("Fetching brands with URL:", url);

      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.brands)) {
        const options = response.data.brands.map((brand) => ({
          label: brand.name,
          value: brand.value,
        }));
        setBrandOptions(options);
        console.log("Fetched brand options:", options);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands(materialId); // Fetch brands whenever materialId changes
  }, [materialId]);

  const handleDescriptionOfItemChange = (selected, rowIndex, sectionIndex) => {
    console.log("handleDescriptionOfItemChange called with:", {
      selected,
      rowIndex,
      sectionIndex,
    });

    const updatedSections = [...sections];
    const selectedMaterial = materials.find(
      (material) => material.value === selected
    );

    if (!selectedMaterial) {
      console.error("Selected material not found in materials list:", selected);
      return;
    }

    updatedSections[sectionIndex].sectionData[rowIndex].descriptionOfItem =
      selected;

    if (selectedMaterial.uom) {
      updatedSections[sectionIndex].sectionData[rowIndex].unit =
        selectedMaterial.uom.uom_short_name;
    } else {
      updatedSections[sectionIndex].sectionData[rowIndex].unit = "";
    }

    updatedSections[sectionIndex].sectionData[rowIndex].type =
      selectedMaterial.type || "N/A";
    updatedSections[sectionIndex].sectionData[rowIndex].inventory_id =
      selectedMaterial.value || "";

    console.log(
      "Updated row after material selection:",
      updatedSections[sectionIndex].sectionData[rowIndex]
    );

    // Update materialId state
    setMaterialId(selectedMaterial.id);
    fetchBrands(selectedMaterial.id); // Fetch brands based on selected material ID

    setSections(updatedSections);
    console.log("Updated sections state:", updatedSections);
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
          brand: [], // Add brand field
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
    updatedSections.splice(sectionIndex, 1); // Remove the section at the specified index
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

  const handleEditAdditionalField = (field) => {
    setEditField({
      fieldName: field.field_name,
      isRequired: field.is_required || false,
      isReadOnly: field.is_read_only || false,
      fieldOwner: field.field_owner || "",
      fieldType: field.field_type || "string",
      originalFieldName: field.field_name,
    });
    setShowEditModal(true);
  };

  const handleEditModalSubmit = () => {
    const updatedFields = additionalFields.map((field) =>
      field.field_name === editField.originalFieldName
        ? {
            ...field,
            field_name: editField.fieldName,
            is_required: editField.isRequired,
            is_read_only: editField.isReadOnly,
            field_owner: editField.fieldOwner,
            field_type: editField.fieldType,
          }
        : field
    );

    setAdditionalFields(updatedFields);
    updateAdditionalFields(updatedFields); // Update the parent component's state
    console.log("Updated additional fields:", updatedFields, editField);

    setShowEditModal(false);
    setSections((prevSections) => {
      return prevSections.map((section) => ({
        ...section,
        sectionData: section.sectionData.map((row) => {
          const updatedRow = { ...row };
          if (row[editField.originalFieldName] !== undefined) {
            updatedRow[editField.fieldName] = row[editField.originalFieldName];
            delete updatedRow[editField.originalFieldName];
          }
          return updatedRow;
        }),
      }));
    });
  };

  const handleDeleteAdditionalField = (field) => {
    const updatedFields = additionalFields.filter(
      (f) => f.field_name !== field.field_name
    );
    setAdditionalFields(updatedFields);
    updateAdditionalFields(updatedFields);
  };

  const handleShortTableChange = (updatedData) => {
    setBidTemplateFields(Array.isArray(updatedData) ? updatedData : []);
  };
  const handleEditShortTableRow = (row) => {
    setEditShortTableRow({
      ...row,
      fieldName: row.label,
      isRequired: row.isRequired || false,
      isReadOnly: row.isReadOnly || false,
      fieldOwner: row.fieldOwner || "",
    });
    setShowShortTableEditModal(true);
  };

  const handleShortTableEditModalSubmit = () => {
    const updatedFields = bidTemplateFields.map((field) =>
      field.label === editShortTableRow.label
        ? {
            ...field,
            label: editShortTableRow.fieldName,
            isRequired: editShortTableRow.isRequired,
            isReadOnly: editShortTableRow.isReadOnly,
            fieldOwner: editShortTableRow.fieldOwner,
          }
        : field
    );

    setBidTemplateFields(updatedFields);
    updateBidTemplateFields(updatedFields);
    setShowShortTableEditModal(false);
  };

  const handleAddColumn = () => {
    setShowAddColumnModal(true);
  };

  const handleAddColumnSubmit = () => {
    const newFieldData = {
      field_name: newField.fieldName,
      is_required: newField.isRequired,
      is_read_only: newField.isReadOnly,
      field_owner: newField.fieldOwner,
      field_type: newField.fieldType,
    };
    const updatedAdditionalFields = [...additionalFields, newFieldData];
    setAdditionalFields(updatedAdditionalFields);
    updateAdditionalFields(updatedAdditionalFields);
    setShowAddColumnModal(false);
  };

  const deliveryColumns = [
    { label: "Material Name", key: "material_formatted_name" },
    { label: "MOR Number", key: "mor_number" },
    { label: "Expected Date", key: "expected_date" },
    { label: "Expected Quantity", key: "expected_quantity" },
  ];

  const renderTableColumns = () => {
    const defaultColumns = [
      { label: "Sr no.", key: "srNo" },
      { label: "Material Name", key: "descriptionOfItem" },
      { label: "Quantity", key: "quantity" },
      { label: "UOM", key: "unit" },
      { label: "Type", key: "type" },
      { label: "Brand", key: "brand" }, // Add brand column
      { label: "Location", key: "location" },
      { label: "Rate", key: "rate" },
      { label: "Amount", key: "amount" },
      { label: "Actions", key: "actions" },
    ];

    const additionalColumns = additionalFields.map((field) => ({
      label: field.field_name,
      key: field.field_name,
    }));

    return [...defaultColumns, ...additionalColumns];
  };

  const renderAdminFields = (field, rowIndex, sectionIndex) => {
    const fieldValue =
      sections[sectionIndex]?.sectionData[rowIndex]?.[field.field_name] || "";
    const inputList = [
      "srNo",
      "descriptionOfItem",
      "quantity",
      "unit",
      "type",
      "brand",
      "location",
      "rate",
      "amount",
      "actions",
    ];

    // Explicitly handle SelectBox for specific fields
    if (field.field_name === "descriptionOfItem") {
      return (
        <SelectBox
          options={materials}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, field.field_name, sectionIndex)
          }
        />
      );
    }

    if (field.field_name === "unit") {
      return (
        <SelectBox
          options={uomOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, field.field_name, sectionIndex)
          }
        />
      );
    }

    if (field.field_name === "location") {
      return (
        <SelectBox
          options={locationOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, field.field_name, sectionIndex)
          }
        />
      );
    }

    if (field.field_name === "brand") {
      return (
        <SelectBox
          options={brandOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, field.field_name, sectionIndex)
          }
        />
      );
    }

    // Default input for other fields
    return (
      <div className="input-group">
        {
          field.field_owner === "admin" && (

            <input
              className="form-control"
              type={field.field_type === "integer" ? "number" : "text"}
              value={fieldValue}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  rowIndex,
                  field.field_name,
                  sectionIndex
                )
              }
            />
          )
        }
        {/* {!inputList.includes(field.field_name) && ( */}
          <div
            // style={{
            //   display: inputList.includes(field.field_name) ? "block" : "none",
            // }}
          >
            {/* <button
              className="btn btn-outline-secondary"
              onClick={() => handleEditAdditionalField(field)}
            >
              <i className="material-icons">edit</i>
            </button> */}
            <button
              className="purple-btn2 ms-2 rounded-circle p-0"
              style={{
                border: "none",
                color: "white",
                width: "25px",
                height: "25px",
              }}
              onClick={() => handleEditAdditionalField(field)}
            >
              <i className="bi bi-pencil" style={{ border: 0 }}></i>
            </button>
            {/* <button
              className="btn btn-outline-danger"
              onClick={() => handleDeleteAdditionalField(field)}
            >
              <i className="material-icons">delete</i>
            </button> */}
            <button
              className="purple-btn2 ms-2 rounded-circle p-0"
              style={{
                border: "none",
                color: "white",
                width: "25px",
                height: "25px",
              }}
              onClick={() => handleDeleteAdditionalField(field)}
            >
              <i className="bi bi-trash" style={{ border: 0 }}></i>
            </button>
          </div>
        {/* )} */}
      </div>
    );
  };

  const renderGenericField = (fieldName, rowIndex, sectionIndex) => {
    const fieldValue =
      sections[sectionIndex]?.sectionData[rowIndex]?.[fieldName] || "";

    // Explicitly handle SelectBox for specific fields
    if (fieldName === "descriptionOfItem") {
      return (
        <SelectBox
          options={materials}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "unit") {
      return (
        <SelectBox
          options={uomOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "location") {
      return (
        <SelectBox
          options={locationOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "brand") {
      return (
        <SelectBox
          options={brandOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    // Default input for other fields
    return (
      <div className="input-group">
        <input
          className="form-control"
          type="text"
          value={fieldValue}
          onChange={(e) =>
            handleInputChange(e.target.value, rowIndex, fieldName, sectionIndex)
          }
        />
        {/* {!inputList.includes(fieldName) && ( */}
          {/* <>
            <button
              className="purple-btn2 ms-2 rounded-circle p-0"
              style={{
                border: "none",
                color: "white",
                width: "25px",
                height: "25px",
              }}
              onClick={() =>
                handleEditAdditionalField({ field_name: fieldName })
              }
            >
              <i className="bi bi-pencil" style={{ border: 0 }}></i>
            </button>
            <button
              className="purple-btn2 ms-2 rounded-circle p-0"
              style={{
                border: "none",
                color: "white",
                width: "25px",
                height: "25px",
              }}
              onClick={() =>
                handleDeleteAdditionalField({ field_name: fieldName })
              }
            >
              <i className="bi bi-trash" style={{ border: 0 }}></i>
            </button>
          </> */}
        {/* )} */}
      </div>
    );
  };

  return (
    <div className="row px-3">
      <div className="card p-0">
        <div className="card-header3">
          <h3 className="card-title">
            {`Select ${isService ? "Services" : "Materials"}`}{" "}
          </h3>
        </div>
        <div className="d-flex justify-content-between px-3 py-3">
          <div className="col-md-3">
            <SelectBox
              label={"Select Template"}
              options={templateOptions}
              onChange={handleTemplateChange}
              value={selectedTemplate} // Set value instead of defaultValue
            />
          </div>
          <button className="purple-btn2" onClick={handleAddColumn}>
            <span className="material-symbols-outlined align-text-top">
              add{" "}
            </span>
            <span>Add Columns</span>
          </button>
        </div>
        <div className="px-3 py-3">
          {sections.map((section, sectionIndex) => (
            <div key={section.sectionId} className="card p-4 mb-4">
              <div className="row mt-4">
                <div className="col-md-8 col-sm-12 d-flex gap-3">
                  <div className="flex-grow-1">
                    <SelectBox
                      label={"Select Material Type"}
                      options={sectionOptions}
                      value={
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
                    {console.log(
                      "subTypeidcnjiasncasncbn:_____---____----_----_---_---_---_",
                      subTypeId,
                      subSectionOptions
                    )}
                    <SelectBox
                      label={"Select Sub Material Type"}
                      options={subSectionOptions}
                      value={
                        subSectionOptions?.find(
                          (option) => option.value === subTypeId
                        )?.value || ""
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
                columns={renderTableColumns()}
                isMinWidth={true}
                data={section?.sectionData?.filter((row) => !row._destroy)}
                customRender={{
                  srno: (cell, rowIndex) => <p>{rowIndex + 1}</p>,
                  descriptionOfItem: (cell, rowIndex) => {
                    console.log("Materials options:", materials);
                    console.log(
                      "Selected value for descriptionOfItem:",
                      section?.sectionData[rowIndex]?.descriptionOfItem
                    );
                    return (
                      <SelectBox
                        options={materials} // Ensure materials is an array of objects with `label` and `value`
                        onChange={(value) =>
                          handleDescriptionOfItemChange(
                            value,
                            rowIndex,
                            sectionIndex
                          )
                        }
                        value={
                          section?.sectionData[rowIndex]?.descriptionOfItem ||
                          ""
                        }
                      />
                    );
                  },
                  unit: (cell, rowIndex) => {
                    console.log("UOM options:", uomOptions);
                    console.log(
                      "Selected value for unit:",
                      section?.sectionData[rowIndex]?.unit
                    );
                    return (
                      <SelectBox
                        options={uomOptions} // Ensure uomOptions is an array of objects with `label` and `value`
                        onChange={(value) =>
                          handleUnitChange(value, rowIndex, sectionIndex)
                        }
                        value={section?.sectionData[rowIndex]?.unit || ""}
                      />
                    );
                  },
                  location: (cell, rowIndex) => {
                    console.log("Location options:", locationOptions);
                    console.log(
                      "Selected value for location:",
                      section?.sectionData[rowIndex]?.location
                    );
                    return (
                      <SelectBox
                        options={locationOptions} // Ensure locationOptions is an array of objects with `label` and `value`
                        onChange={(value) =>
                          handleLocationChange(value, rowIndex, sectionIndex)
                        }
                        value={section?.sectionData[rowIndex]?.location || ""}
                      />
                    );
                  },
                  brand: (cell, rowIndex) => {
                    console.log("Brand options:", brandOptions);
                    console.log(
                      "Selected value for brand:",
                      section?.sectionData[rowIndex]?.brand
                    );
                    return (
                      <SelectBox
                        options={brandOptions} // Ensure brandOptions is an array of objects with `label` and `value`
                        onChange={(value) =>
                          handleInputChange(
                            value,
                            rowIndex,
                            "brand",
                            sectionIndex
                          )
                        }
                        value={section?.sectionData[rowIndex]?.brand || ""}
                      />
                    );
                  },
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
                  ...additionalFields.reduce((acc, field) => {
                    acc[field.field_name] = (cell, rowIndex) =>
                      renderAdminFields(field, rowIndex, sectionIndex);
                    return acc;
                  }, {}),
                  ...Object.keys(
                    sections[sectionIndex]?.sectionData[0] || {}
                  ).reduce((acc, fieldName) => {
                    if (
                      !additionalFields.some(
                        (field) => field.field_name === fieldName
                      )
                    ) {
                      acc[fieldName] = (cell, rowIndex) =>
                        renderGenericField(fieldName, rowIndex, sectionIndex);
                    }
                    return acc;
                  }, {}),
                }}
                onRowSelect={undefined}
                handleCheckboxChange={undefined}
                resetSelectedRows={undefined}
                onResetComplete={undefined}
              />

              <div className="d-flex justify-content-end">
                <ShortTable
                  data={
                    Array.isArray(bidTemplateFields) ? bidTemplateFields : []
                  }
                  editable={true}
                  onValueChange={handleShortTableChange}
                  onInputClick={handleEditShortTableRow}
                  onDeleteClick={(index) => {
                    const updatedFields = bidTemplateFields.filter(
                      (_, i) => i !== index
                    );
                    setBidTemplateFields(updatedFields);
                    updateBidTemplateFields(updatedFields);
                  }}
                />
              </div>
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
      <DynamicModalBox
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        title="Edit Field"
        footerButtons={[
          {
            label: "Cancel",
            onClick: () => setShowEditModal(false),
          },
          {
            label: "Save Changes",
            onClick: handleEditModalSubmit,
          },
        ]}
      >
        <div className="form-group mt-3">
          <label>Field Name</label>
          <input
            type="text"
            className="form-control"
            value={editField.fieldName}
            onChange={(e) => {
              setEditField({ ...editField, fieldName: e.target.value });
              console.log("inputVal", e.target.value);
            }}
            placeholder="Enter Field Name"
          />
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={editField.isRequired}
            onChange={(e) =>
              setEditField({ ...editField, isRequired: e.target.checked })
            }
          />
          <label className="form-check-label">Is Required</label>
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={editField.isReadOnly}
            onChange={(e) =>
              setEditField({ ...editField, isReadOnly: e.target.checked })
            }
          />
          <label className="form-check-label">Is Read Only</label>
        </div>
        <div className="form-group mt-3">
          <SelectBox
            label={"Field Owner"}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
            defaultValue={editField.fieldOwner}
            onChange={(value) =>
              setEditField({ ...editField, fieldOwner: value })
            }
          />
        </div>
        <div className="form-group mt-3">
          <SelectBox
            label={"Field Type"}
            options={[
              { value: "string", label: "String" },
              { value: "integer", label: "Integer" },
            ]}
            defaultValue={editField.fieldType}
            onChange={(value) =>
              setEditField({ ...editField, fieldType: value })
            }
          />
        </div>
      </DynamicModalBox>
      <DynamicModalBox
        show={showShortTableEditModal}
        onHide={() => setShowShortTableEditModal(false)}
        title="Edit Short Table Row"
        footerButtons={[
          {
            label: "Cancel",
            onClick: () => setShowShortTableEditModal(false),
          },
          {
            label: "Save Changes",
            onClick: handleShortTableEditModalSubmit,
          },
        ]}
      >
        <div className="form-group mt-3">
          <label>Field Name</label>
          <input
            type="text"
            className="form-control"
            value={editShortTableRow.fieldName}
            onChange={(e) =>
              setEditShortTableRow({
                ...editShortTableRow,
                fieldName: e.target.value,
              })
            }
            placeholder="Enter Field Name"
          />
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={editShortTableRow.isRequired}
            onChange={(e) =>
              setEditShortTableRow({
                ...editShortTableRow,
                isRequired: e.target.checked,
              })
            }
          />
          <label className="form-check-label">Is Required</label>
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={editShortTableRow.isReadOnly}
            onChange={(e) =>
              setEditShortTableRow({
                ...editShortTableRow,
                isReadOnly: e.target.checked,
              })
            }
          />
          <label className="form-check-label">Is Read Only</label>
        </div>
        <div className="form-group mt-3">
          <SelectBox
            label={"Field Owner"}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
            defaultValue={editShortTableRow.fieldOwner}
            onChange={(value) =>
              setEditShortTableRow({
                ...editShortTableRow,
                fieldOwner: value,
              })
            }
          />
        </div>
      </DynamicModalBox>
      <DynamicModalBox
        show={showAddColumnModal}
        onHide={() => setShowAddColumnModal(false)}
        title="Add New Column"
        footerButtons={[
          {
            label: "Cancel",
            onClick: () => setShowAddColumnModal(false),
          },
          {
            label: "Add Column",
            onClick: handleAddColumnSubmit,
          },
        ]}
      >
        <div className="form-group mt-3">
          <label>Field Name</label>
          <input
            type="text"
            className="form-control"
            value={newField.fieldName}
            onChange={(e) =>
              setNewField({ ...newField, fieldName: e.target.value })
            }
            placeholder="Enter Field Name"
          />
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={newField.isRequired}
            onChange={(e) =>
              setNewField({ ...newField, isRequired: e.target.checked })
            }
          />
          <label className="form-check-label">Is Required</label>
        </div>
        <div className="form-group mt-3 d-flex align-items-base">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={newField.isReadOnly}
            onChange={(e) =>
              setNewField({ ...newField, isReadOnly: e.target.checked })
            }
          />
          <label className="form-check-label">Is Read Only</label>
        </div>
        <div className="form-group mt-3">
          <SelectBox
            label={"Field Owner"}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
            defaultValue={newField.fieldOwner}
            onChange={(value) =>
              setNewField({ ...newField, fieldOwner: value })
            }
          />
        </div>
        <div className="form-group mt-3">
          <SelectBox
            label={"Field Type"}
            options={[
              { value: "string", label: "String" },
              { value: "integer", label: "Integer" },
            ]}
            defaultValue={newField.fieldType}
            onChange={(value) => setNewField({ ...newField, fieldType: value })}
          />
        </div>
      </DynamicModalBox>
    </div>
  );
}
