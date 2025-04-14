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
  isMor
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
  const [showModal, setShowModal] = useState(false);
  const [taxRateData, setTaxRateData] = useState({
    material: "CEMENT-CEMENT-P.P.C GENERIC NAME-43 GRADE",
    hsnCode: "25232930",
    ratePerNos: 200.0,
    totalPoQty: 0,
    discount: 16.0,
    materialCost: 200.0,
    discountRate: 16.0,
    afterDiscountValue: 25200.0,
    remark: "",
    additionalInfo: "",
    additionTaxCharges: [],
    deductionTax: [],
  });
  const [brandOptions, setBrandOptions] = useState([]);
  const [materialId, setMaterialId] = useState(0); // New state for materialId
  const [pmsColours, setPmsColours] = useState([]); // State for PMS colors
  const [genericInfoOptions, setGenericInfoOptions] = useState([]); // State for generic info
  const [morOptions, setMorOptions] = useState([]); // State for MOR options
  const [selectedMor, setSelectedMor] = useState(""); // State for selected MOR
  const [morMaterialData, setMorMaterialData] = useState([]); // State for MOR material data
  const [isMorChecked, setIsMorChecked] = useState(false); // State for checkbox

  const fetchMorOptions = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/mor_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      if (response.data && Array.isArray(response.data.mors)) {
        const options = response.data.mors.map((mor) => ({
          label: mor.name,
          value: mor.value,
        }));
        setMorOptions(options);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching MOR options:", error);
    }
  };

  const fetchMorMaterialData = async (morId) => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/mor_inventory_payload?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&mor_id=${morId}`
      );
      if (response.data && Array.isArray(response.data.materials)) {
        setMorMaterialData(response.data.materials);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching MOR material data:", error);
    }
  };

  useEffect(() => {
    if (selectedMor) {
      fetchMorMaterialData(selectedMor);
    }
  }, [selectedMor]);

  useEffect(() => {
    if (isMor) {
      fetchMorOptions();
    }
  }, [isMor]);

  const mapBidTemplateFields = (fields) => {
    // console.log("fields", fields);

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
    // console.log("event :-----",event);
    
    setSelectedTemplate(event);
    updateSelectedTemplate(event); // Update the parent component's state

    try {
      const response = await axios.get(
        `${baseURL}rfq/event_templates/${event}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      if (response.data) {
        const templateData = response.data;
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

        // Ensure default rows are present in ShortTable
        const defaultShortTableRows = [
          { label: "Warranty Clause", value: "" },
          { label: "Payment Terms", value: "" },
          { label: "Loading/Unloading", value: "" },
        ];
        setBidTemplateFields((prevFields) => [
          ...defaultShortTableRows,
          ...prevFields.filter(
            (field) =>
              !defaultShortTableRows.some((defaultRow) => defaultRow.label === field.label)
          ),
        ]);

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

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.materials)) {
        const materialOptions = response.data.materials.map((material) => ({
          value: material.id,
          label: material.name,
          uom: material.uom,
        }));
        setMaterials(materialOptions);
        // console.log("materials :----", materials);
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

      // console.log("Fetching sub-sections with URL:", url);

      const response = await axios.get(url);
      // console.log("API Response for sub-sections:", response.data);

      if (response.data && Array.isArray(response.data.inventory_sub_types)) {
        const options = response.data.inventory_sub_types.map((subSection) => ({
          label: subSection.name,
          value: subSection.value,
        }));
        setSubSectionOptions(options);
        // console.log("Fetched subSectionOptions:", options);
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
        `${baseURL}rfq/event_templates/template_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

  const fetchPmsColours = async (materialId) => {
    try {
      let url = `${baseURL}rfq/events/pms_colours?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&material_id=${materialId}`;
      if (!materialId) {
        url = `${baseURL}rfq/events/pms_colours?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      }
      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.pms_colours)) {
        const options = response.data.pms_colours.map((colour) => ({
          label: colour.name,
          value: colour.value,
        }));
        setPmsColours(options);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching PMS colors:", error);
    }
  };

  const fetchGenericInfo = async (materialId) => {
    try {
      const url = materialId
        ? `${baseURL}rfq/events/generic_infos?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&material_id=${materialId}`
        : `${baseURL}rfq/events/generic_infos?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.generic_info)) {
        const options = response.data.generic_info.map((info) => ({
          label: info.name,
          value: info.value,
        }));
        setGenericInfoOptions(options);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching generic info:", error);
    }
  };

  useEffect(() => {
    if (existingData) {
      const updatedSections = Object.entries(existingData).map(
        ([materialType, subMaterials]) => {
          const materialsArray = Object.values(subMaterials).flat();

          const inventoryTypeId = materialsArray[0]?.inventory_type_id;
          const inventorySubTypeId = materialsArray[0]?.inventory_sub_type_id;
          setSubTypeId(inventorySubTypeId);

          if (inventoryTypeId) {
            fetchMaterials(inventoryTypeId);
          }
          if (inventorySubTypeId) {
            fetchSubSections(inventorySubTypeId);
          }

          return {
            materialType,
            sectionData: materialsArray.map((material) => ({
              id: material.id,
              descriptionOfItem: material.inventory_name || material.descriptionOfItem,
              inventory_id: material.inventory_id,
              quantity: material.quantity,
              unit: material.uom_short_name || material.unit, // Map unit correctly
              location: material.location, // Map location correctly
              rate: material.rate,
              amount: material.amount,
              type: material.material_type || "N/A", // Map type correctly
              sub_section_id: material.sub_section_id,
              section_id: material.inventory_type_id || material.section_id,
              inventory_type_id: material.inventory_type_id,
              inventory_sub_type_id: material.inventory_sub_type_id,
              subMaterialType: material.inventory_sub_type,
              pms_brand_id: material.pms_brand_id, // Map pms_brand_id correctly
              pms_colour_id: material.pms_colour_id,
              generic_info_id: material.generic_info_id,
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
    // console.log("Existing data:", existingData);

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
    fetchLocations();
    fetchUoms();
    fetchMaterials();
    fetchBrands(); // Fetch brands
    fetchTemplates(); // Fetch templates
    fetchPmsColours(); // Fetch PMS colors on component mount
    fetchGenericInfo(); // Fetch generic info on component mount
  }, []);

  useEffect(() => {
    setData(sections.flatMap((section) => section.sectionData));
  }, [sections]);
  console.log(existingData, "existingData");
  

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
    // console.log("handleUnitChange called with:", {
    //   selected,
    //   rowIndex,
    //   sectionIndex,
    // });

    const updatedSections = [...sections];
    updatedSections[sectionIndex].sectionData[rowIndex].unit = selected;

    setSections(updatedSections);
    // console.log("Updated sections after unit change:", updatedSections);
  };

  const handleLocationChange = (selected, rowIndex, sectionIndex) => {
    // console.log("handleLocationChange called with:", {
    //   selected,
    //   rowIndex,
    //   sectionIndex,
    // });

    const updatedSections = [...sections];
    const selectedLocation = locationOptions.find(
      (location) => location.value === selected
    );

    updatedSections[sectionIndex].sectionData[rowIndex].location =
      selectedLocation ? selectedLocation.label : selected;

    setSections(updatedSections);
    // console.log("Updated sections after location change:", updatedSections);
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
      pms_brand_id: null,
      pms_colour_id: null, // Default PMS color
      generic_info_id: null, // Default generic info
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

    if (key === "descriptionOfItem") {
      updatedSections[sectionIndex].sectionData[rowIndex]["inventory_id"] =
        value;
    }

    setSections(updatedSections);

    const updatedData = updatedSections.flatMap((section) =>
      section.sectionData.map((row) => ({
        id: row.id || null,
        inventory_id: Number(row.inventory_id),
        quantity: Number(row.quantity),
        uom: row.unit,
        location: row.location,
        rate: row.rate || null,
        amount: row.amount || null,
        section_name: row.section_id,
        inventory_type_id: row.inventory_type_id,
        inventory_sub_type_id: row.inventory_sub_type_id,
        pms_brand_id: row.pms_brand_id || null,
        pms_colour_id: row.pms_colour_id || null,
        generic_info_id: row.generic_info_id || null,
        ...additionalFields.reduce((acc, field) => {
          acc[field.field_name] = row[field.field_name] || null;
          return acc;
        }, {}),
        _destroy: row._destroy || false,
      }))
    );

    setData(updatedData);
  };

  const fetchBrands = async (materialId) => {
    try {
      let url = `${baseURL}rfq/events/pms_brands?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&material_id=${materialId}`;
      if (!materialId) {
        url = `${baseURL}rfq/events/pms_brands?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      }
      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.brands)) {
        const options = response.data.brands.map((brand) => ({
          label: brand.name,
          value: brand.value,
        }));
        setBrandOptions(options);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchBrands(materialId);
      fetchPmsColours(materialId);
      fetchGenericInfo(materialId); // Fetch generic info when material changes
    }
  }, [materialId]);

  const handleDescriptionOfItemChange = (selected, rowIndex, sectionIndex) => {
    console.log("called", selected, rowIndex, sectionIndex);

    const updatedSections = [...sections];
    const selectedMaterial = materials.find(
      (material) => material.value === selected
    );

    if (!selectedMaterial) {
      console.error("Selected material not found in materials list:", selected);
      return;
    }
    console.log(selectedMaterial, "selectedMaterial");

    updatedSections[sectionIndex].sectionData[rowIndex].descriptionOfItem =
      selectedMaterial.label;

    if (selectedMaterial.uom) {
      updatedSections[sectionIndex].sectionData[rowIndex].unit =
        selectedMaterial.uom.uom_short_name;
    } else {
      updatedSections[sectionIndex].sectionData[rowIndex].unit = "";
    }

    updatedSections[sectionIndex].sectionData[rowIndex].type =
      selectedMaterial.type || "N/A";
    updatedSections[sectionIndex].sectionData[rowIndex].inventory_id =
      selectedMaterial.label;
    console.log("updatedSections", updatedSections);

    // Update materialId state
    setMaterialId(selectedMaterial.value);

    // Fetch brands, PMS colors, and generic info based on the selected material ID
    fetchBrands(selectedMaterial.value);
    fetchPmsColours(selectedMaterial.value);
    fetchGenericInfo(selectedMaterial.value);

    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const selectedSection = updatedSections[sectionIndex];
      const selectedRow = selectedSection.sectionData[rowIndex];

      // Update descriptionOfItem and inventory_id
      selectedRow.descriptionOfItem = selected;
      selectedRow.inventory_id = selected || ""; // Set inventory_id based on selected value

      return updatedSections;
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          pms_brand_id: [], // Add brand field
          pms_colour_id: pmsColours[0]?.value || "", // Default PMS color
          location: [],
          rate: 0,
          amount: 0,
          inventory_id: [],
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

  const addAdditionTaxCharge = () => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    setTaxRateData({
      ...taxRateData,
      additionTaxCharges: [...taxRateData.additionTaxCharges, newItem],
    });
  };
  const addDeductionTax = () => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    setTaxRateData({
      ...taxRateData,
      deductionTax: [...taxRateData.deductionTax, newItem],
    });
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
    // console.log("Updated additional fields:", updatedFields, editField);

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
    console.log("New field data:", newFieldData, updatedAdditionalFields, newField, "newField");
    
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
      { label: "PMS Brand", key: "pms_brand_id" }, // Add brand column
      { label: "PMS Colour", key: "pms_colour_id" }, // Add PMS Colour column
      { label: "Generic Info", key: "generic_info_id" }, // Add Generic Info column
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

    const handleFieldChange = (value) => {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].sectionData[rowIndex][field.field_name] = value;

      // Update parent data with all attributes, including dynamic fields
      const updatedData = updatedSections.flatMap((section) =>
        section.sectionData.map((row) => ({
          id: row.id || null,
          inventory_id: Number(row.inventory_id),
          quantity: Number(row.quantity),
          uom: row.unit,
          location: row.location,
          rate: row.rate || null,
          amount: row.amount || null,
          section_name: row.section_id,
          inventory_type_id: row.inventory_type_id,
          inventory_sub_type_id: row.inventory_sub_type_id,
          pms_brand_id: row.pms_brand_id || null, // Always use pms_brand_id
          pms_colour_id: row.pms_colour_id || null, // Always use pms_colour_id
          generic_info_id: row.generic_info_id || null,
          ...additionalFields.reduce((acc, field) => {
            acc[field.field_name] = row[field.field_name] || null; // Add dynamic fields
            return acc;
          }, {}),
          _destroy: row._destroy || false,
        }))
      );

      setSections(updatedSections);
      setData(updatedData);
    };

    // Explicitly handle SelectBox for specific fields
    if (field.field_name === "descriptionOfItem") {
      return (
        <SelectBox
          options={materials}
          value={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
      );
    }

    if (field.field_name === "unit") {
      return (
        <SelectBox
          options={uomOptions}
          value={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
      );
    }

    if (field.field_name === "location") {
      return (
        <SelectBox
          options={locationOptions}
          value={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
        
      );
    }

    if (field.field_name === "pms_colour_id") {
      return (
        <SelectBox
          options={pmsColours}
          defaultValue={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
      );
    }

    if (field.field_name === "generic_info_id") {
      return (
        <SelectBox
          options={genericInfoOptions}
          defaultValue={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
      );
    }

    if (field.field_name === "pms_brand_id") {
      return (
        <SelectBox
          options={brandOptions}
          defaultValue={fieldValue}
          onChange={(value) => handleFieldChange(value)}
        />
      );
    }

    if (field.field_name === "amount") {
      return (
        <input
          className="form-control"
          type="number"
          value={fieldValue}
          onChange={(e) => handleFieldChange(e.target.value)}
          disabled
        />
      );
    }

    // console.log("fieldValue:----", field,fieldValue, field.field_name);
    // Default input for other fields
    return (
      <div className="input-group">
        {/* {console.log("field:----", field)} */}
        {field.field_owner === "Admin" && (
          <>
          <input
            className="form-control rounded-2"
            type={field.field_type === "integer" ? "number" : "text"}
            value={fieldValue}
            onChange={(e) => handleFieldChange(e.target.value)}
          /></>
        )}
        <div>
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
      </div>
    );
  };

  const renderGenericField = (fieldName, rowIndex, sectionIndex) => {
    const fieldValue =
      sections[sectionIndex]?.sectionData[rowIndex]?.[fieldName] || "";

    if (fieldName === "descriptionOfItem") {
      return (
        <SelectBox
          options={materials}
          defaultValue={
            materials.find((option) => option.label === fieldValue)?.value
          }
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
          defaultValue={
            uomOptions.find((option) => option.label === fieldValue)?.value
          }
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
          defaultValue={
            locationOptions.find((option) => option.label === fieldValue)?.value || fieldValue
          }
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />

      );
    }

    if (fieldName === "pms_brand_id") {
      return (
        <SelectBox
          options={brandOptions}
          defaultValue={
            brandOptions.find((option) => option.value === Number(fieldValue))?.value
          }
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "pms_colour_id") {
      return (
        <SelectBox
          options={pmsColours}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "generic_info_id") {
      return (
        <SelectBox
          options={genericInfoOptions}
          value={fieldValue}
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
        />
      );
    }

    if (fieldName === "rate") {
      return (
        <input
          className="form-control"
          type="number"
          value={fieldValue}
          onChange={(e) => {
            handleInputChange(e.target.value, rowIndex, fieldName, sectionIndex);

            // Calculate amount based on rate and quantity
            const rate = parseFloat(e.target.value) || 0;
            const quantity =
              parseFloat(
                sections[sectionIndex]?.sectionData[rowIndex]?.quantity || 0
              ) || 0;
            const amount = rate * quantity;

            // Update the amount field
            handleInputChange(amount.toFixed(2), rowIndex, "amount", sectionIndex);
          }}
        />
      );
    }

    if (fieldName === "amount") {
      return (
        <input
          className="form-control"
          type="number"
          value={fieldValue}
          disabled
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
      </div>
    );
  };

  const morMaterialColumns = [
    { label: "Material Name", key: "inventory.name" },
    { label: "Required Quantity", key: "required_quantity" },
    { label: "Approved Quantity", key: "approved_quantity" },
    { label: "UOM", key: "uom_name" },
    { label: "Priority", key: "priority" },
    { label: "Expected Delivery Date", key: "expected_date_of_delivery" },
    { label: "Note", key: "note" },
  ];

  const handleMorMaterialIntegration = (morMaterials) => {
    const integratedSections = morMaterials.map((material) => ({
      sectionData: [
        {
          id: material.id,
          descriptionOfItem: material.inventory?.name || "",
          quantity: material.required_quantity || 0,
          unit: material.inventory?.uom_name || "",
          type: material.inventory?.type || "",
          pms_brand_id: material.pms_brand_id || null,
          pms_colour_id: material.pms_colour_id || null,
          generic_info_id: material.generic_info_id || null,
          location: material.pms_site || "",
          rate: null, // Rate is null and disabled
          amount: null, // Amount is null and disabled
          inventory_id: material.inventory_id || null,
          sub_section_id: material.inventory_sub_type_id || null,
          section_id: material.inventory_type_id || null,
          inventory_type_id: material.inventory_type_id || null,
          inventory_sub_type_id: material.inventory_sub_type_id || null,
          _destroy: false,
        },
      ],
      sectionId: Date.now(),
    }));

    setSections(integratedSections); // Replace sections with MOR materials
  };

  useEffect(() => {
    if (selectedMor && morMaterialData.length > 0) {
      handleMorMaterialIntegration(morMaterialData);
    }
  }, [morMaterialData]);

  const handleMorCheckboxChange = (checked) => {
    setIsMorChecked(checked);
    if (!checked) {
      // Reset table to default state
      setSections([
        {
          sectionData: data,
          sectionId: Date.now(),
        },
      ]);
      setSelectedMor(""); // Clear selected MOR
      setMorMaterialData([]); // Clear MOR material data
    }
  };

  useEffect(() => {
    if (!isMorChecked) {
      setMorMaterialData([]); // Ensure MOR material data is cleared when unchecked
    }
  }, [isMorChecked]);

  return (
    <div className="row px-3">
      <div className="card p-0">
        <div className="card-header3">
          <h3 className="card-title">
            {`Select ${isService ? "Services" : "Materials"}`}{" "}
          </h3>
        </div>
        <div className="d-flex justify-content-between px-3 py-3">
          <div className="d-flex w-100 gap-3" >

          <div className="col-md-3">
            <SelectBox
              label={"Select Template"}
              options={templateOptions}
              onChange={handleTemplateChange}
              defaultValue={selectedTemplate} // Set value instead of defaultValue
            />
          </div>
          {isMorChecked && (
            <div className="col-md-3">
              <SelectBox
                label={"Select MOR"}
                options={morOptions}
                onChange={(value) => setSelectedMor(value)}
                defaultValue={selectedMor}
              />
            </div>
          )}

          {isMor && <div className="col-md-2 d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={isMorChecked}
              onChange={(e) => handleMorCheckboxChange(e.target.checked)}
            />
            <label className="form-check-label">Is MOR</label>
          </div>}
          </div>
          <button className="purple-btn2" onClick={handleAddColumn}>
            <span className="material-symbols-outlined align-text-top">
              add{" "}
            </span>
            <span>Add Columns</span>
          </button>
        </div>
        <div className="px-3 py-3">
          {isMorChecked && selectedMor ? (
            <div className="mt-4">
              <Table
                columns={renderTableColumns().filter((col) => col.key !== "actions")} // Exclude "actions" column
                data={sections.flatMap((section) => section.sectionData)}
                isMinWidth={true}
                customRender={{
                  srno: (cell, rowIndex) => <p>{rowIndex + 1}</p>,
                  descriptionOfItem: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      disabled
                    />
                  ),
                  quantity: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      disabled
                    />
                  ),
                  unit: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      disabled
                    />
                  ),
                  type: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      disabled
                    />
                  ),
                  location: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="text"
                      value={cell}
                      disabled
                    />
                  ),
                  rate: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      disabled
                    />
                  ),
                  amount: (cell, rowIndex) => (
                    <input
                      className="form-control"
                      type="number"
                      value={cell}
                      disabled
                    />
                  ),
                  pms_brand_id: (cell, rowIndex) => (
                    <SelectBox
                      options={brandOptions}
                      onChange={(value) =>
                        handleInputChange(value, rowIndex, "pms_brand_id", 0)
                      }
                      defaultValue={cell}
                    />
                  ),
                  pms_colour_id: (cell, rowIndex) => (
                    <SelectBox
                      options={pmsColours}
                      defaultValue={cell}
                      onChange={(value) =>
                        handleInputChange(value, rowIndex, "pms_colour_id", 0)
                      }
                    />
                  ),
                  generic_info_id: (cell, rowIndex) => (
                    <SelectBox
                      options={genericInfoOptions}
                      defaultValue={cell}
                      onChange={(value) =>
                        handleInputChange(value, rowIndex, "generic_info_id", 0)
                      }
                    />
                  ),
                  ...additionalFields.reduce((acc, field) => {
                    acc[field.field_name] = (cell, rowIndex) =>
                      renderAdminFields(field, rowIndex, 0); // Use renderAdminFields for template-selected fields
                    return acc;
                  }, {}),
                }}
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
          ) : (
            sections.map((section, sectionIndex) => (
              <div key={section.sectionId} className="card p-4 mb-4">
                <div className="row mt-4">
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
                    pms_brand_id: (cell, rowIndex) => {
                      return (
                        <SelectBox
                          options={brandOptions} // Ensure brandOptions is an array of objects with `label` and `value`
                          onChange={(value) =>
                            handleInputChange(
                              value,
                              rowIndex,
                              "pms_brand_id",
                              sectionIndex
                            )
                          }
                          value={
                            section?.sectionData[rowIndex]?.pms_brand_id || "" // Use pms_brand_id from existing data
                          }
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
                        value={cell}
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
                    pms_colour_id: (cell, rowIndex) => (
                      <SelectBox
                        options={pmsColours}
                        defaultValue={section?.sectionData[rowIndex].pms_colour_id}
                        onChange={(value) =>
                          handleInputChange(
                            value,
                            rowIndex,
                            "pms_colour_id",
                            sectionIndex
                          )
                        }
                        />
                    ),
                    generic_info_id: (cell, rowIndex) => (
                      <SelectBox
                        options={genericInfoOptions}
                        defaultValue={section?.sectionData[rowIndex]?.generic_info_id || ""}
                        onChange={(value) =>
                          handleInputChange(
                            value,
                            rowIndex,
                            "generic_info_id",
                            sectionIndex
                          )
                        }
                      />
                    ),
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
            ))
          )}
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
              // console.log("inputVal", e.target.value);
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
            label: "Add Column",
            onClick:handleAddColumnSubmit,
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
