import React, { useState, useEffect } from "react";
import SelectBox from "../../base/Select/SelectBox";
import Table from "../../base/Table/Table";
import { baseURL } from "../../../confi/apiDomain";
import ShortTable from "../../base/Table/ShortTable";
import axios from "axios";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { max, set } from "lodash";
import DropdownCollapseIcon from "../Icon/DropdownCollapseIcon";

export default function CreateRFQForm({
  data,
  setData,
  isService,
  existingData,
  deliveryData,
  templateData,
  eventId,
  updateSelectedTemplate, // Rename this prop
  updateBidTemplateFields, // Rename this prop
  updateAdditionalFields, // Rename this prop
  isMor,
  isMorSelected,
  morNumber
}) {
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([
    {
      sectionData: data,
      sectionId: Date.now(),
    },
  ]);
  const [openSectionIndexes, setOpenSectionIndexes] = useState({});
  const [openDeliveryRows, setOpenDeliveryRows] = useState({});
  const [openDynamicRows, setOpenDynamicRows] = useState({});
  const [openAttachmentsRows, setOpenAttachmentsRows] = useState({});
  const [deletedBlobIds, setDeletedBlobIds] = useState([]);
  const [attachmentsData, setAttachmentsData] = useState([]);
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

  const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

  const handleToggleSection = (sectionIndex) => {
    setOpenSectionIndexes((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const fetchMorOptions = async () => {
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/mor_dropdown?token=${token}`
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/mor_inventory_payload?token=${token}&mor_id=${morId}`
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
    
    try {
      const response = await axios.get(
        `${baseURL}rfq/event_templates/${event}?token=${token}`
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
              !defaultShortTableRows.some(
                (defaultRow) => defaultRow.label === field.label
              )
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const url = inventoryTypeId
        ? `${baseURL}rfq/events/material_list?token=${token}&pms_inventory_type_id=${inventoryTypeId}`
        : `${baseURL}rfq/events/material_list?token=${token}`;

      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.materials)) {
        const materialOptions = response.data.materials.map((material) => ({
          value: material.id,
          label: material.name,
          uom: material.uom,
        }));
        setMaterials(materialOptions);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchSubSections = async (inventoryTypeId) => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      // const url = inventoryTypeId
      //   ? `${baseURL}rfq/events/material_sub_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_inventory_type_id=${inventoryTypeId}`
      const url = `${baseURL}rfq/events/material_sub_types?token=${token}`;

      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.inventory_sub_types)) {
        const options = response.data.inventory_sub_types.map((subSection) => ({
          label: subSection.name,
          value: subSection.value,
        }));
        setSubSectionOptions(options);
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const response = await axios.get(
        `${baseURL}rfq/event_templates/template_dropdown?token=${token}`
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      let url = `${baseURL}rfq/events/pms_colours?token=${token}&material_id=${materialId}`;
      if (!materialId) {
        url = `${baseURL}rfq/events/pms_colours?token=${token}`;
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const url = materialId
        ? `${baseURL}rfq/events/generic_infos?token=${token}&material_id=${materialId}`
        : `${baseURL}rfq/events/generic_infos?token=${token}`;

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
              descriptionOfItem:
                material.inventory_name || material.descriptionOfItem,
              inventory_id: material.inventory_id,
              quantity: material.quantity,
              unit: material.uom_short_name || material.unit, // Map unit correctly
              location: material.location, // Map location correctly
              rate: material.rate,
              amount: material.amount,
              type: material.material_type || "-", // Map type correctly
              sub_section_id: material.sub_section_id,
              section_id: material.inventory_type_id || material.section_id,
              inventory_type_id: material.inventory_type_id,
              inventory_sub_type_id: material.inventory_sub_type_id,
              subMaterialType: material.inventory_sub_type,
              pms_brand_id: material.pms_brand_id, // Map pms_brand_id correctly
              pms_colour_id: material.pms_colour_id,
              generic_info_id: material.generic_info_id,
              _destroy: false,
              attachments: material.attachments || null, // Ensure attachments are included unless explicitly removed
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
    const fetchSections = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/material_types?token=${token}`
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
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/location_list?token=${token}`
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
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/uoms?token=${token}`
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
      pms_brand_id: null,
      pms_colour_id: null, // Default PMS color
      generic_info_id: null, // Default generic info
      attachments: null, // Default attachments
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
        attachments: row.attachments || null, // Ensure attachments are included unless explicitly removed
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      let url = `${baseURL}rfq/events/pms_brands?token=${token}&material_id=${materialId}`;
      if (!materialId) {
        url = `${baseURL}rfq/events/pms_brands?token=${token}`;
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
    const updatedSections = [...sections];
    const selectedMaterial = materials.find(
      (material) => material.value === selected
    );

    if (!selectedMaterial) {
      console.error("Selected material not found in materials list:", selected);
      return;
    }

    updatedSections[sectionIndex].sectionData[rowIndex].descriptionOfItem =
      selectedMaterial.label;

    if (selectedMaterial.uom) {
      updatedSections[sectionIndex].sectionData[rowIndex].unit =
        selectedMaterial.uom.uom_short_name;
    } else {
      updatedSections[sectionIndex].sectionData[rowIndex].unit = "";
    }

    updatedSections[sectionIndex].sectionData[rowIndex].type =
      selectedMaterial.type || "-";
    updatedSections[sectionIndex].sectionData[rowIndex].inventory_id =
      selectedMaterial.label;

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
    updateAdditionalFields(updatedFields);

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
      // { label: "Type", key: "type" },
      { label: "Brand", key: "pms_brand_id" }, // Add brand column
      { label: "Colour", key: "pms_colour_id" }, // Add PMS Colour column
      { label: "Generic Info", key: "generic_info_id" }, // Add Generic Info column
      // { label: "Location", key: "location" }, // REMOVE location column
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
      updatedSections[sectionIndex].sectionData[rowIndex][field.field_name] =
        value;

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
          attachments: row.attachments || null, // Ensure attachments are included unless explicitly removed
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

    return (
      <div className="input-group">
        {field.field_owner === "Admin" && (
          <>
            <input
              className="form-control rounded-2"
              type={field.field_type === "integer" ? "number" : "text"}
              min="0"
              value={fieldValue}
              onChange={(e) => handleFieldChange(e.target.value)}
            />
          </>
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
    const isDisabled = isMorSelected === true;
    const disabledClass = isDisabled ? "disabled-btn" : "";

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
          disabled={isDisabled}
          // className={disabledClass}
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
          disabled={isDisabled}
          // className={disabledClass}
        />
      );
    }

    if (fieldName === "pms_brand_id") {
      return (
        <SelectBox
          options={brandOptions}
          defaultValue={
            brandOptions.find((option) => option.value === Number(fieldValue))
              ?.value
          }
          onChange={(value) =>
            handleInputChange(value, rowIndex, fieldName, sectionIndex)
          }
          disabled={isDisabled}
          // className={disabledClass}
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
          disabled={isDisabled}
          // className={disabledClass}
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
          disabled={isDisabled}
          // className={disabledClass}
        />
      );
    }

    if (fieldName === "quantity") {
      return (
        <input
          className="form-control"
          type="text"
          inputMode="numeric"
          value={fieldValue}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) => {
            if (
              !/^\d$/.test(e.key) &&
              !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) =>
            handleInputChange(e.target.value, rowIndex, fieldName, sectionIndex)
          }
          disabled={isDisabled}
          // className={disabledClass}
        />
      );
    }

    if (fieldName === "rate") {
      return (
        <input
          className="form-control"
          type="text"
          inputMode="decimal"
          value={fieldValue}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) => {
            if (
              !/^\d$/.test(e.key) &&
              ![
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                ".",
                "Delete",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            let value = e.target.value;

            // Allow only numbers and a single decimal point
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              handleInputChange(value, rowIndex, fieldName, sectionIndex);

              const rate = parseFloat(value) || 0;
              const quantity =
                parseFloat(
                  sections[sectionIndex]?.sectionData[rowIndex]?.quantity || 0
                ) || 0;
              handleInputChange(
                (rate * quantity).toFixed(2),
                rowIndex,
                "amount",
                sectionIndex
              );
            }
          }}
          disabled={isDisabled}
          // className={disabledClass}
        />
      );
    }

    if (fieldName === "amount") {
      return (
        <input
          className="form-control"
          type="number"
          value={fieldValue}
          disabled={isDisabled}
          // className={disabledClass}
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
          disabled={isDisabled}
          // className={disabledClass}
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
          <div className="d-flex w-100 gap-3 mt-3">
            <div className="col-md-3">
              <SelectBox
                label={"Select Template"}
                options={templateOptions}
                onChange={handleTemplateChange}
                defaultValue={selectedTemplate}
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
            {isMor && (
              <div className="col-md-2 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={isMorChecked}
                  onChange={(e) => handleMorCheckboxChange(e.target.checked)}
                />
                <label className="form-check-label">Is MOR</label>
              </div>
            )}
          </div>
          {!isMorSelected && (
            <button className="purple-btn2" onClick={handleAddColumn}>
              <span className="material-symbols-outlined align-text-top">
                add{" "}
              </span>
              <span>Add Columns</span>
            </button>
          )}
        </div>
        <div className="px-3 py-3">
          {isMorChecked && selectedMor ? (
            <div className="mt-4">
              <Table
                style={{
                  boxShadow: "none !important",
                  border: "1px solid red !important",
                }}
                isWidth={true}
                columns={renderTableColumns().filter(
                  (col) => col.key !== "actions"
                )} // Exclude "actions" column
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
                      disabled
                    />
                  ),
                  pms_colour_id: (cell, rowIndex) => (
                    <SelectBox
                      options={pmsColours}
                      defaultValue={cell}
                      onChange={(value) =>
                        handleInputChange(value, rowIndex, "pms_colour_id", 0)
                      }
                      disabled
                    />
                  ),
                  generic_info_id: (cell, rowIndex) => (
                    <SelectBox
                      options={genericInfoOptions}
                      defaultValue={cell}
                      onChange={(value) =>
                        handleInputChange(value, rowIndex, "generic_info_id", 0)
                      }
                      disabled
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
              <div key={section.sectionId} className="card pb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="card-header3" style={{ width: "200px" }}>
                    <h3 className="card-title">{`Material Type (${
                      sectionIndex + 1
                    } of ${sections.length})`}</h3>
                  </div>
                  <button
                    className="purple-btn2 d-flex align-items-center"
                    style={{
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      padding: "0",
                      background: "transparent",
                      border: "none",
                    }}
                    tabIndex={-1}
                    type="button"
                    onClick={() => handleToggleSection(sectionIndex)}
                  >
                    <DropdownCollapseIcon
                      isCollapsed={!openSectionIndexes[sectionIndex]}
                    />
                  </button>
                </div>

                {openSectionIndexes[sectionIndex] && (
                  <div className="p-4 mb-4">
                    <div className="row mt-4">
                      <div className="col-md-8 col-sm-12 d-flex gap-3">
                        <div className="flex-grow-1">
                          <SelectBox
                            label={"Material Type"}
                            options={sectionOptions}
                            defaultValue={
                              section?.sectionData?.some((row) => row?._destroy)
                                ? "Select Material Type"
                                : sectionOptions?.find(
                                    (option) =>
                                      option.label === section?.materialType
                                  )?.value || "Select Material Type"
                            }
                            onChange={(selected) =>
                              handleSectionChange(selected, sectionIndex)
                            }
                          />
                        </div>
                        <div className="flex-grow-1">
                          <SelectBox
                            label={"Sub Material Type"}
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
                        {/* Location SelectBox always visible to the right */}
                        <div className="flex-grow-1">
                          <SelectBox
                            label={"Location"}
                            options={locationOptions}
                            defaultValue={
                              section?.sectionData?.[0]?.location || ""
                            }
                            onChange={(value) => {
                              // Update location for all rows in this section
                              const updatedSections = [...sections];
                              updatedSections[sectionIndex].sectionData =
                                updatedSections[sectionIndex].sectionData.map(
                                  (row) => ({
                                    ...row,
                                    location: value,
                                  })
                                );
                              setSections(updatedSections);
                            }}
                          />
                        </div>
                        {/* MOR Number input right to Location and Sub Material Type */}
                        <div className="flex-grow-1">
                          <label htmlFor="">
                            MOR Number
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={
                              (() => {
                                if (existingData && typeof existingData === "object") {
                                  for (const materialType of Object.keys(existingData)) {
                                    const subMaterials = existingData[materialType];
                                    for (const subType of Object.keys(subMaterials)) {
                                      const arr = subMaterials[subType];
                                      if (Array.isArray(arr) && arr.length > 0 && arr[0].mor_no) {
                                        return arr[0].mor_no;
                                      }
                                    }
                                  }
                                }
                                return "";
                              })()
                            }
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-12 d-flex gap-3 py-3 justify-content-end">
                        {!isMorSelected && (
                          <button
                            className="purple-btn2"
                            onClick={() => handleAddRow(sectionIndex)}
                          >
                            <span className="material-symbols-outlined align-text-top">
                              add{" "}
                            </span>
                            <span>Add Row</span>
                          </button>
                        )}

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
                      style={{
                        maxHeight: "none",
                      }}
                      isWidth={true}
                      columns={renderTableColumns()}
                      isMinWidth={true}
                      isAccordion={eventId}
                      data={section?.sectionData?.filter(
                        (row) => !row._destroy
                      )}
                      accordionRender={(row, rowIndex) => {
                        const matchedData = Object.values(existingData).flatMap(
                          (group) =>
                            Object.values(group)
                              .flat()
                              .filter(
                                (item) =>
                                  item.id === row.id &&
                                  item.inventory_id === row.inventory_id
                              )
                        );

                        const deliverySchedules = matchedData.flatMap(
                          (item) => item.delivery_schedules || []
                        );
                        const morInventorySpecifications = matchedData.flatMap(
                          (item) => item.mor_inventory_specifications || []
                        );
                        const attachmentsData = matchedData.flatMap((item) =>
                          (item.attachments || []).filter(
                            (attachment) =>
                              !deletedBlobIds.includes(attachment.blob_id)
                          )
                        );

                        const rowKey = `${row.id}_${row.inventory_id}`;

                        const handleToggle = (type) => {
                          if (type === "delivery") {
                            setOpenDeliveryRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          } else if (type === "dynamic") {
                            setOpenDynamicRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          } else if (type === "attachments") {
                            setOpenAttachmentsRows((prev) => ({
                              ...prev,
                              [rowKey]: !prev[rowKey],
                            }));
                          }
                        };

                        const handleDeleteAttachment = (blobId, index) => {
                          setDeletedBlobIds((prev) => [...prev, blobId]);
                          const updatedSections = sections.map((section) => ({
                            ...section,
                            sectionData: section.sectionData.map((row) => ({
                              ...row,
                              attachments:
                                [{ id: blobId }] || row.attachment || null,
                            })),
                          }));
                          setSections(updatedSections);
                          const updatedData = updatedSections.flatMap(
                            (section) =>
                              section.sectionData.map((row) => ({
                                ...row,
                                attachments: row.attachments || [],
                              }))
                          );
                          setData(updatedData);
                        };

                        const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

                        return (
                          <div
                            style={{
                              width: "90vw",
                              position: "sticky",
                              left: 0,
                              zIndex: 1,
                              backgroundColor: "white",
                              padding: "0",
                              marginLeft:'10px',
                              marginTop:'10px',
                            }}
                          >
                            {/* Delivery Schedules Accordion */}
                            <div className="mb-3">
                              <div
                                style={{
                                  cursor: "pointer",
                                  padding: "12px 20px",
                                  background: "#f8f9fa",
                                  borderBottom: "1px solid #eee",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                onClick={() => handleToggle("delivery")}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                  }}
                                >
                                  Delivery Schedules
                                </span>
                                <button
                                  className="purple-btn2 d-flex align-items-center"
                                  style={{
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    padding: "0",
                                    background: "transparent",
                                    border: "none",
                                  }}
                                  tabIndex={-1}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle("delivery");
                                  }}
                                >
                                  <DropdownCollapseIcon
                                    isCollapsed={!openDeliveryRows[rowKey]}
                                  />
                                </button>
                              </div>
                              {openDeliveryRows[rowKey] && (
                                <div>
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: "center" }}>
                                          Expected Date
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          Expected Quantity
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {deliverySchedules.length === 0 ? (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            style={{ textAlign: "center" }}
                                          >
                                            No delivery schedules available.
                                          </td>
                                        </tr>
                                      ) : (
                                        deliverySchedules.map(
                                          (schedule, index) => (
                                            <tr key={index}>
                                              <td>{schedule.expected_date}</td>
                                              <td>
                                                {schedule.expected_quantity}
                                              </td>
                                            </tr>
                                          )
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Dynamic Details Accordion */}
                            <div className="mb-3">
                              <div
                                style={{
                                  cursor: "pointer",
                                  padding: "12px 20px",
                                  background: "#f8f9fa",
                                  borderBottom: "1px solid #eee",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                onClick={() => handleToggle("dynamic")}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                  }}
                                >
                                  Dynamic Details
                                </span>
                                <button
                                  className="purple-btn2 d-flex align-items-center"
                                  style={{
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    padding: "0",
                                    background: "transparent",
                                    border: "none",
                                  }}
                                  tabIndex={-1}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle("dynamic");
                                  }}
                                >
                                  <DropdownCollapseIcon
                                    isCollapsed={!openDynamicRows[rowKey]}
                                  />
                                </button>
                              </div>
                              {openDynamicRows[rowKey] && (
                                <div>
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: "center" }}>
                                          Field
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          Specification
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {morInventorySpecifications.length ===
                                      0 ? (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            style={{ textAlign: "center" }}
                                          >
                                            No dynamic details available.
                                          </td>
                                        </tr>
                                      ) : (
                                        morInventorySpecifications.map(
                                          (spec, index) => (
                                            <tr key={index}>
                                              <td>{spec.field}</td>
                                              <td>
                                                {spec.specification || "N/A"}
                                              </td>
                                            </tr>
                                          )
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Attachments Accordion */}
                            <div className="mb-3">
                              <div
                                style={{
                                  cursor: "pointer",
                                  padding: "12px 20px",
                                  background: "#f8f9fa",
                                  borderBottom: "1px solid #eee",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                onClick={() => handleToggle("attachments")}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                  }}
                                >
                                  Attachments
                                </span>
                                <button
                                  className="purple-btn2 d-flex align-items-center"
                                  style={{
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    padding: "0",
                                    background: "transparent",
                                    border: "none",
                                  }}
                                  tabIndex={-1}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle("attachments");
                                  }}
                                >
                                  <DropdownCollapseIcon
                                    isCollapsed={!openAttachmentsRows[rowKey]}
                                  />
                                </button>
                              </div>
                              {openAttachmentsRows[rowKey] && (
                                <div>
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: "center" }}>
                                          Filename
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attachmentsData.length === 0 ? (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            style={{ textAlign: "center" }}
                                          >
                                            No attachments available.
                                          </td>
                                        </tr>
                                      ) : (
                                        attachmentsData.map(
                                          (attachment, index) => (
                                            <tr key={index}>
                                              <td>{attachment.filename}</td>
                                              <td
                                                style={{
                                                  display: "flex",
                                                  gap: "10px",
                                                  justifyContent: "center",
                                                  width: "100%",
                                                }}
                                              >
                                                <a
                                                  href={`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                  download={attachment.filename}
                                                  className="purple-btn2"
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    padding: "0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    style={{ fill: "black" }}
                                                  >
                                                    <g fill="white">
                                                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                                    </g>
                                                  </svg>
                                                </a>
                                                <button
                                                  className="purple-btn2"
                                                  onClick={() =>
                                                    handleDeleteAttachment(
                                                      attachment.blob_id,
                                                      index
                                                    )
                                                  }
                                                  style={{ marginLeft: "10px" }}
                                                >
                                                  Delete
                                                </button>
                                              </td>
                                            </tr>
                                          )
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }}
                      customRender={{
                        srno: (cell, rowIndex) => <p>{rowIndex + 1}</p>,

                        descriptionOfItem: (cell, rowIndex) => {
                          return (
                            <SelectBox
                              options={materials}
                              onChange={(value) =>
                                handleDescriptionOfItemChange(
                                  value,
                                  rowIndex,
                                  sectionIndex
                                )
                              }
                              value={
                                section?.sectionData[rowIndex]
                                  ?.descriptionOfItem || ""
                              }
                            />
                          );
                        },
                        unit: (cell, rowIndex) => {
                          return (
                            <SelectBox
                              options={uomOptions}
                              onChange={(value) =>
                                handleUnitChange(value, rowIndex, sectionIndex)
                              }
                              value={section?.sectionData[rowIndex]?.unit || ""}
                            />
                          );
                        },
                        pms_brand_id: (cell, rowIndex) => {
                          return (
                            <SelectBox
                              options={brandOptions}
                              onChange={(value) =>
                                handleInputChange(
                                  value,
                                  rowIndex,
                                  "pms_brand_id",
                                  sectionIndex
                                )
                              }
                              value={
                                section?.sectionData[rowIndex]?.pms_brand_id ||
                                "" // Use pms_brand_id from existing data
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
                            min="0"
                            value={cell}
                            inputMode="numeric"
                            placeholder="Enter Quantity"
                            onKeyDown={(e) => {
                              if (
                                e.key === "e" ||
                                e.key === "E" ||
                                e.key === "+" ||
                                e.key === "-" ||
                                e.key === "." ||
                                e.key === "," ||
                                e.key === " " // Add any other characters you want to restrict
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (/^\d*$/.test(value)) {
                                handleInputChange(
                                  e.target.value,
                                  rowIndex,
                                  "quantity",
                                  sectionIndex
                                );
                              }
                            }}
                          />
                        ),
                        rate: (cell, rowIndex) => (
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            value={cell}
                            onKeyDown={(e) => {
                              if (
                                e.key === "e" ||
                                e.key === "E" ||
                                e.key === "+" ||
                                e.key === "-" ||
                                e.key === "." ||
                                e.key === "," ||
                                e.key === " " // Add any other characters you want to restrict
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only positive numbers
                              if (/^\d*$/.test(value)) {
                                handleInputChange(
                                  value,
                                  rowIndex,
                                  "rate",
                                  sectionIndex
                                );
                              }
                            }}
                            placeholder="Enter Rate"
                          />
                        ),
                        amount: (cell, rowIndex) => (
                          <input
                            className="form-control"
                            type="number"
                            min="0"
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
                            onClick={() =>
                              handleRemoveRow(rowIndex, sectionIndex)
                            }
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
                              renderGenericField(
                                fieldName,
                                rowIndex,
                                sectionIndex
                              );
                          }
                          return acc;
                        }, {}),
                        pms_colour_id: (cell, rowIndex) => (
                          <SelectBox
                            options={pmsColours}
                            defaultValue={
                              section?.sectionData[rowIndex].pms_colour_id
                            }
                            onChange={(value) =>
                              handleInputChange(
                                value,
                                rowIndex,
                                "pms_colour_id",
                                sectionIndex
                              )
                            }
                            disabled={isMorSelected}
                          />
                        ),
                        generic_info_id: (cell, rowIndex) => (
                          <SelectBox
                            options={genericInfoOptions}
                            defaultValue={
                              section?.sectionData[rowIndex]?.generic_info_id ||
                              ""
                            }
                            onChange={(value) =>
                              handleInputChange(
                                value,
                                rowIndex,
                                "generic_info_id",
                                sectionIndex
                              )
                            }
                            disabled={isMorSelected}
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
                          Array.isArray(bidTemplateFields)
                            ? bidTemplateFields
                            : []
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
                )}
              </div>
            ))
          )}
          {/* {deliveryData?.length > 0 && (
            <Table columns={deliveryColumns} data={deliveryData} />
          )} */}
          {!isMorSelected && (
            <button className="purple-btn2" onClick={handleAddSection}>
              <span className="material-symbols-outlined align-text-top">
                add{" "}
              </span>
              <span>Add Section</span>
            </button>
          )}
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
