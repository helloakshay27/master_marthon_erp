import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "../components";

const GatePassEdit = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const { id } = useParams();
  const [formData, setFormData] = useState({
    project_id: null,
    sub_project_id: null,
    gate_pass_no: "",
    gate_pass_type: "",
    is_returnable: "returnable", // Default to returnable
    store_id: null,
    mto_po_number: "",
    to_store_id: null,
    vehicle_no: "",
    driver_name: "",
    expected_return_date: "",
    gate_pass_date_time: "",
    issued_by: "",
    contact_person: "",
    contact_no: "",
    gate_number_id: null,
    material_items: [],
    to_vendor: null,
    driver_contact_no: "",
  });

  const [projects, setProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [stores, setStores] = useState([]);
  const [toStores, setToStores] = useState([]);
  const [gateNumbers, setGateNumbers] = useState([]);
  const [gatePassTypes, setGatePassTypes] = useState([
    // { value: "transfer_to_site", label: "Transfer to Site" },
    // { value: "return_to_vendor", label: "Return to Vendor" },
    // { value: "repair_maintenance", label: "Repair/Maintenance" },
    // { value: "general", label: "General" },
    // { value: "testing_calibration", label: "Testing/Calibration" },
  ]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const navigate = useNavigate();

  const [vendorTypes] = useState([
    { value: "master", label: "Master Vendor" },
    { value: "non_master", label: "Non-Master Vendor" },
  ]);
  const [supplierOptions, setSupplierOptions] = useState([]); // For To Vendor dropdown

  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorContact, setNewVendorContact] = useState("");
  const [newVendorAddress, setNewVendorAddress] = useState("");
  const [newVendorRemark, setNewVendorRemark] = useState("");

  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const openviewDocumentModal = () => setviewDocumentModal(true);
  const closeviewDocumentModal = () => setviewDocumentModal(false);

  const [poOptions, setPoOptions] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null); // Store selected PO object

  const [showMaterialSelectModal, setShowMaterialSelectModal] = useState(false);
  const [poMaterials, setPoMaterials] = useState([]); // Materials fetched from PO
  const [selectedMaterialIndexes, setSelectedMaterialIndexes] = useState([]); // Indexes of selected materials in modal

  // For dynamic material/asset rows when rawValue is ""
  const [maintenanceRows, setMaintenanceRows] = useState([]);
  // Dropdown options
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [inventorySubTypes, setInventorySubTypes] = useState([]);
  const [inventoryNames, setInventoryNames] = useState([]);
  const [genericInfos, setGenericInfos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colours, setColours] = useState([]);
  const [units, setUnits] = useState([]);

  // For Add Other Material modal
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialRemark, setNewMaterialRemark] = useState("");
  const [materialRowIdx, setMaterialRowIdx] = useState(null); // which row to update

  const [fetchedResourceId, setFetchedResourceId] = useState(null);

  // Add state for OtherVendor id
  const [otherVendorId, setOtherVendorId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation (star mark fields)
    if (!formData.project_id) {
      alert("Please select Project.");
      return;
    }
    if (!formData.sub_project_id) {
      alert("Please select Sub-Project.");
      return;
    }
    if (!formData.gate_pass_type) {
      alert("Please select Gate Pass Type.");
      return;
    }
    // For PurchaseOrder type, PO/WO No is required
    const selectedGatePassType = gatePassTypes.find(
      (t) => t.value === formData.gate_pass_type
    );
    const rawValue = selectedGatePassType?.rawValue;
    if (rawValue === "PurchaseOrder" && !formData.mto_po_number) {
      alert("Please select PO/WO No.");
      return;
    }
    if (rawValue === "MaterialTransaferOrder" && !formData.mto_po_number) {
      alert("Please enter MTO/SO Number.");
      return;
    }

    // Validation for Expected Return Date based on Returnable status
    if (
      formData.is_returnable === "returnable" &&
      !formData.expected_return_date
    ) {
      alert("Please enter Expected Return Date for Returnable Gate Pass");
      return;
    }

    // Validation: Gate Pass Qty must not exceed Stock As On
    for (const item of formData.material_items || []) {
      if (
        item.gate_pass_qty !== undefined &&
        item.gate_pass_qty !== null &&
        item.gate_pass_qty !== "" &&
        item.stock_as_on !== undefined &&
        Number(item.gate_pass_qty) > Number(item.stock_as_on)
      ) {
        alert(
          `Gate Pass Qty for ${
            item.material_name || "material"
          } cannot exceed Stock As On (${item.stock_as_on})!`
        );
        return;
      }
    }

    // Map attachments from documents state
    const attachments = (documents || [])
      .map((doc) =>
        doc.attachments && doc.attachments[0]
          ? {
              filename: doc.attachments[0].filename || null,
              content: doc.attachments[0].content || null,
              content_type: doc.attachments[0].content_type || null,
              document_name: doc.document_type || null,
            }
          : null
      )
      .filter(Boolean);

    let to_resource_id = null;
    let to_resource_type = null;
    let other_vendor_attributes = undefined;

    if (formData.to_vendor) {
      if (
        typeof formData.to_vendor === "string" &&
        (formData.to_vendor.startsWith("non_master_") ||
          formData.to_vendor === "other")
      ) {
        // Find the vendor in supplierOptions
        const otherVendor = supplierOptions.find(
          (v) => v.value === formData.to_vendor
        );
        other_vendor_attributes = {
          name: otherVendor?.label || "",
          contact_no: otherVendor?.contact || "",
          remarks: otherVendor?.remark || "",
          address: otherVendor?.address || "",
        };
        to_resource_type = "OtherVendor";
        to_resource_id = null;
      } else {
        to_resource_id = formData.to_vendor;
        to_resource_type = "Pms::Supplier";
      }
    } else if (formData.to_store_id) {
      to_resource_id = formData.to_store_id;
      to_resource_type = "Pms::Store";
    }

    const payload = {
      gate_pass: {
        sub_project_id: formData.sub_project_id || null,
        from_store_id: formData.store_id || null,
        gate_pass_type_id:
          gatePassTypes.find((t) => t.value === formData.gate_pass_type)?.id ||
          1, // get id from selected gate pass type
        project_id: formData.project_id || null,
        status:
          (typeof selectedStatus === "object"
            ? selectedStatus.value
            : selectedStatus) || "draft",
        due_date: formData.due_date || formData.expected_return_date || null,
        driver_name: formData.driver_name || null,
        driver_contact_no: formData.driver_contact_no || null,
        expected_return_date: formData.expected_return_date || null,
        remarks: formData.remarks || null,
        returnable:
          formData.is_returnable === "returnable"
            ? true
            : formData.is_returnable === "non_returnable"
            ? false
            : null,
        contact_person: formData.contact_person || null,
        contact_person_no: formData.contact_no || null,
        gate_number_id: formData.gate_number_id || null,
        vehicle_no: formData.vehicle_no || null,
        all_level_approved: formData.all_level_approved || false,
        gate_pass_materials_attributes:
          formData.gate_pass_type === "repair_maintenance" ||
          formData.gate_pass_type === "general"
            ? maintenanceRows
                .filter((item) => !item._destroy)
                .map((row) => ({
                  id: row.id,
                  gate_pass_qty: Number(row.gate_pass_qty) || null,
                  remarks: row.reason || "",
                  pms_inventory_id:
                    row.material_name &&
                    typeof row.material_name === "string" &&
                    row.material_name.startsWith("other")
                      ? null
                      : row.material_name || null,
                  pms_inventory_sub_type_id: row.material_sub_type || null,
                  pms_inventory_type_id: row.material_type || null,
                  pms_generic_info_id: row.generic_info || null,
                  pms_colour_id: row.colour || null,
                  pms_brand_id: row.brand || null,
                  uom_id: row.unit || null,
                  other_material_name: row.other_material_name || null,
                  other_material_description:
                    row.other_material_description || null,
                  available_qty: null,
                }))
            : (formData.material_items || []).map((item) => {
                const attr = {
                  gate_pass_qty: Number(item.gate_pass_qty) || null,
                };
                if (item.id) attr.id = item.id;
                else if (item.mor_inventory_id)
                  attr.mor_inventory_id = item.mor_inventory_id;
                if (item._destroy) attr._destroy = true;
                return attr;
              }),
        attachments: attachments.length > 0 ? attachments : null,
        to_resource_id: to_resource_id,
        to_resource_type: to_resource_type,
        ...(other_vendor_attributes ? { other_vendor_attributes } : {}),
        resource_id: selectedPO?.id || null,
        resource_type:
          gatePassTypes.find((t) => t.value === formData.gate_pass_type)
            ?.rawValue || null,
      },
    };

    try {
      let response;
      if (id) {
        // Edit mode: PATCH
        response = await axios.patch(
          `${baseURL}gate_passes/${id}.json?token=${token}`,
          payload
        );
      } else {
        // Create mode: POST
        response = await axios.post(
          `${baseURL}gate_passes.json?token=${token}`,
          payload
        );
      }

      if (response.status === 200 || response.status === 201) {
        alert(`Gate Pass ${id ? "updated" : "created"} successfully!`);
        navigate(`/gate-pass-list?token=${token}`);
      }
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} gate pass:`, error);
      alert(
        `Failed to ${id ? "update" : "create"} gate pass. Please try again.`
      );
    }
  };

  const handleRemoveMaterial = (index) => {
    setFormData((prev) => {
      const items = [...prev.material_items];
      const item = items[index];
      if (item.id) {
        // Mark for destroy, don't remove from array
        items[index] = { ...item, _destroy: true };
      } else {
        // Remove new items immediately
        items.splice(index, 1);
      }
      return { ...prev, material_items: items };
    });
  };

  const [documentRows, setDocumentRows] = useState([
    {
      srNo: 1,
      upload: null,
      fileType: "",
      uploadDate: new Date().toISOString().split("T")[0],
    },
  ]);
  const documentRowsRef = useRef(documentRows);

  const handleAddDocumentRow = () => {
    const newRow = {
      srNo: documentRows.length + 1,
      upload: null,
      fileType: "",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      const updatedRows = documentRows.filter((_, i) => i !== index);

      // Reset row numbers properly
      updatedRows.forEach((row, i) => {
        row.srNo = i + 1;
      });

      documentRowsRef.current = updatedRows;
      setDocumentRows([...updatedRows]);
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return; // Ensure a file is selected

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      const fileType = file.name.split(".").pop().toUpperCase();

      documentRowsRef.current[index].upload = {
        filename: file.name,
        content: base64String,
        content_type: file.type,
      };
      documentRowsRef.current[index].fileType = fileType;
      documentRows.current[index].uploadDate = new Date()
        .toISOString()
        .split("T")[0];

      setDocumentRows([...documentRowsRef.current]);
    };

    reader.readAsDataURL(file);

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = ""; // Clear input value
    }
  };

  const getHeaderTitle = () => {
    switch (formData.gate_pass_type) {
      case "transfer_to_site":
        return "Transfer to Site";
      case "return_to_vendor":
        return "Return to Vendor";
      case "repair_maintenance":
        return "Repair/Maintenance";
      case "general":
        return "General";
      case "testing_calibration":
        return "Testing/Calibration";
      default:
        return "Create Gate Pass";
    }
  };

  // Document attachment state and handlers for advanced modal
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });
  const [documents, setDocuments] = useState([]); // If you want to keep a list

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDocument((prev) => ({
        ...prev,
        attachments: [
          {
            filename: file.name,
            content: reader.result.split(",")[1],
            content_type: file.type,
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle attach document
  const handleAttachDocument = () => {
    if (!newDocument.document_type || newDocument.attachments.length === 0)
      return;
    const now = new Date();
    const uploadDate = `${now.getDate().toString().padStart(2, "0")}-${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${now.getFullYear()}`;
    setDocuments((prev) => [
      ...prev,
      {
        ...newDocument,
        uploadDate,
      },
    ]);
    setNewDocument({ document_type: "", attachments: [] });
    closeattachModal();
  };

  // For viewing a specific document
  const [viewDocIndex, setViewDocIndex] = useState(null);
  const handleViewDocument = (index) => {
    setViewDocIndex(index);
    openviewDocumentModal();
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  const handleAddVendor = () => {
    if (
      !newVendorName.trim() ||
      !newVendorContact.trim() ||
      !newVendorAddress.trim() ||
      !newVendorRemark.trim()
    ) {
      alert("All fields are mandatory for Non-Master Vendor.");
      return;
    }
    const newVendor = {
      label: newVendorName,
      value: `non_master_${newVendorName.replace(/\s+/g, "_").toLowerCase()}`,
      contact: newVendorContact,
      address: newVendorAddress,
      remark: newVendorRemark,
    };

    const updatedOptions = [
      ...supplierOptions.filter((o) => o.value !== "other"),
      newVendor,
      { value: "other", label: "Other" },
    ];

    setSupplierOptions(updatedOptions);

    setFormData({ ...formData, to_vendor: newVendor.value });

    setShowAddVendorModal(false);
    setNewVendorName("");
    setNewVendorContact("");
    setNewVendorAddress("");
    setNewVendorRemark("");
  };

  useEffect(() => {
    // Fetch PO/WO numbers for dropdown
    const fetchPONumbers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}purchase_orders/purchase_order_po_numbers.json?token=${token}`
        );
        if (Array.isArray(response.data)) {
          setPoOptions(
            response.data.map((item) => ({
              value: item.po_number,
              label: item.po_number,
              id: item.id, // keep id for later use
            }))
          );
        }
      } catch (error) {
        setPoOptions([]);
      }
    };
    fetchPONumbers();

    // Fetch projects and sub-projects
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${baseURL}pms/company_setups.json?token=${token}`
        );
        if (response.data && Array.isArray(response.data.companies)) {
          // Flatten all projects from all companies
          const allProjects = response.data.companies.flatMap((company) =>
            (company.projects || []).map((project) => ({
              value: project.id,
              label: project.name,
              subProjects: (project.pms_sites || []).map((site) => ({
                value: site.id,
                label: site.name,
              })),
            }))
          );
          setProjects(allProjects);
        }
      } catch (error) {
        setProjects([]);
      }
    };
    fetchProjects();

    // Fetch gate pass types for dropdown
    const fetchGatePassTypes = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com//gate_pass_types.json?token=${token}`
        );
        if (Array.isArray(response.data)) {
          setGatePassTypes(
            response.data.map((item) => ({
              value:
                item.name === "Transfer to Site"
                  ? "transfer_to_site"
                  : item.name === "Return to Vendor"
                  ? "return_to_vendor"
                  : item.name === "Repair/ Maintenance"
                  ? "repair_maintenance"
                  : item.name === "General"
                  ? "general"
                  : item.name === "Testing /calibration"
                  ? "testing_calibration"
                  : item.name,
              label: item.name,
              id: item.id,
              rawValue: item.value,
            }))
          );
        } else {
          setGatePassTypes([]);
        }
      } catch (error) {
        setGatePassTypes([]);
      }
    };
    fetchGatePassTypes();
  }, []);

  // When project changes, update subProjects
  useEffect(() => {
    const selected = projects.find((p) => p.value === formData.project_id);
    setSubProjects(selected ? selected.subProjects : []);
    // Optionally reset sub_project_id if project changes
    // setFormData(prev => ({ ...prev, sub_project_id: null }));
    // If you want to reset sub_project_id, uncomment above
  }, [formData.project_id, projects]);

  useEffect(() => {
    // Reset dependent fields when gate pass type changes
    setFormData((prev) => ({
      ...prev,
      to_vendor: null,
      to_store_id: null,
      mto_po_number: "",
      material_items: [], // Also clear materials as they depend on PO
    }));
    setSelectedPO(null);
  }, [formData.gate_pass_type]);

  // Fetch material/asset details when PO is selected (for return_to_vendor)
  useEffect(() => {
    if (
      (formData.gate_pass_type === "return_to_vendor" ||
        formData.gate_pass_type === "testing_calibration") &&
      selectedPO &&
      selectedPO.id
    ) {
      const fetchMaterials = async () => {
        try {
          const response = await axios.get(
            `${baseURL}mor_inventories/fetch_all_inventories.json?page=1&po_id=${selectedPO.id}`
          );
          if (response.data && Array.isArray(response.data.inventories)) {
            setPoMaterials(response.data.inventories); // <-- for modal
          }
        } catch (error) {
          setPoMaterials([]);
        }
      };
      fetchMaterials();
    }
    // eslint-disable-next-line
  }, [selectedPO, formData.gate_pass_type]);

  useEffect(() => {
    if (formData.sub_project_id) {
      const fetchStoresBySite = async () => {
        try {
          const response = await axios.get(
            `${baseURL}pms/stores/store_dropdown.json?q[site_id_eq]=${formData.sub_project_id}`
          );
          if (Array.isArray(response.data)) {
            setStores(response.data);
          } else {
            setStores([]);
          }
        } catch (error) {
          setStores([]);
        }
      };
      fetchStoresBySite();
    }
  }, [formData.sub_project_id]);

  useEffect(() => {
    if (
      formData.gate_pass_type === "transfer_to_site" &&
      formData.sub_project_id
    ) {
      const fetchToStores = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/pms/stores/store_dropdown.json?q[site_id_eq]=${formData.sub_project_id}&isformatted=true`
          );
          if (Array.isArray(response.data)) {
            setToStores(response.data);
          } else {
            setToStores([]);
          }
        } catch (error) {
          setToStores([]);
        }
      };
      fetchToStores();
    }
  }, [formData.gate_pass_type, formData.sub_project_id]);

  useEffect(() => {
    // Fetch suppliers for To Vendor dropdown
    const selectedGatePassType = gatePassTypes.find(
      (t) => t.value === formData.gate_pass_type
    );
    const rawValue = selectedGatePassType?.rawValue;

    if (rawValue === "PurchaseOrder" || rawValue === "") {
      const fetchSuppliers = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/pms/suppliers.json?token=${token}`
          );
          if (Array.isArray(response.data)) {
            const vendors = response.data.map((item) => ({
              value: item.id,
              label: item.organization_name,
            }));
            setSupplierOptions([
              ...vendors,
              { value: "other", label: "Other" },
            ]);
          } else {
            setSupplierOptions([{ value: "other", label: "Other" }]);
          }
        } catch (error) {
          setSupplierOptions([{ value: "other", label: "Other" }]);
        }
      };
      fetchSuppliers();
    } else {
      setSupplierOptions([]);
    }
  }, [formData.gate_pass_type, gatePassTypes]);

  useEffect(() => {
    if (formData.project_id) {
      const fetchGateNumbers = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/gate_numbers/gate_numbers.json?q[project_id_eq]=${formData.project_id}&token=${token}`
          );
          if (Array.isArray(response.data)) {
            setGateNumbers(
              response.data.map((item) => ({
                value: item.id,
                label: item.gate_number,
              }))
            );
          } else {
            setGateNumbers([]);
          }
        } catch (error) {
          console.error("Error fetching gate numbers:", error);
          setGateNumbers([]);
        }
      };
      fetchGateNumbers();
    } else {
      setGateNumbers([]);
    }
  }, [formData.project_id]);

  // Fetch inventory types on mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        setInventoryTypes(
          response.data.map((i) => ({ value: i.id, label: i.name }))
        );
      });
  }, []);

  // Fetch sub-types and material names when type changes (per row)
  const fetchSubTypesAndNames = async (typeId, rowIdx) => {
    if (!typeId) return;
    // Sub-types
    const subTypeRes = await axios.get(
      `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${typeId}&token=${token}`
    );
    const subTypeOptions = subTypeRes.data.map((i) => ({
      value: i.id,
      label: i.name,
    }));
    // Material names
    const nameRes = await axios.get(
      `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${typeId}&q[material_category_eq]=material&token=${token}`
    );
    let materialNameOptions = nameRes.data.map((i) => ({
      value: i.id,
      label: i.name,
    }));
    // Always add 'Other' option
    materialNameOptions = [
      ...materialNameOptions,
      { value: "other", label: "Other" },
    ];
    setMaintenanceRows((rows) =>
      rows.map((row, idx) =>
        idx === rowIdx
          ? {
              ...row,
              subTypeOptions,
              materialNameOptions,
              material_sub_type: null,
              material_name: null,
              genericInfoOptions: [],
              brandOptions: [],
              colourOptions: [],
              unitOptions: [],
              generic_info: null,
              brand: null,
              colour: null,
              unit: null,
              available_qty: null,
            }
          : row
      )
    );
  };

  // Fetch generic info, brand, colour, unit when name changes (per row)
  const fetchMaterialDetails = async (materialId, rowIdx) => {
    if (!materialId) return;
    // Generic Info
    const genRes = await axios.get(
      `${baseURL}pms/generic_infos.json?q[material_id_eq]=${materialId}&token=${token}`
    );
    const genericInfoOptions = genRes.data.map((i) => ({
      value: i.id,
      label: i.generic_info,
    }));
    // Brand
    const brandRes = await axios.get(
      `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${materialId}&token=${token}`
    );
    const brandOptions = brandRes.data.map((i) => ({
      value: i.id,
      label: i.brand_name,
    }));
    // Colour
    const colourRes = await axios.get(
      `${baseURL}pms/colours.json?q[material_id_eq]=${materialId}&token=${token}`
    );
    const colourOptions = colourRes.data.map((i) => ({
      value: i.id,
      label: i.colour,
    }));
    // Unit
    const unitRes = await axios.get(
      `${baseURL}unit_of_measures.json?token=${token}`
    );
    const unitOptions = unitRes.data.map((i) => ({
      value: i.id,
      label: i.name,
    }));
    setMaintenanceRows((rows) =>
      rows.map((row, idx) =>
        idx === rowIdx
          ? {
              ...row,
              genericInfoOptions,
              brandOptions,
              colourOptions,
              unitOptions,
              generic_info: null,
              brand: null,
              colour: null,
              unit: null,
              available_qty: null,
            }
          : row
      )
    );
  };

  // Update handleMaintenanceRowChange to use new fetch logic
  const handleMaintenanceRowChange = (idx, field, value) => {
    setMaintenanceRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
    // If any dropdown changes, fetch available qty
    if (
      [
        "material_type",
        "material_sub_type",
        "material_name",
        "generic_info",
        "brand",
        "colour",
        "unit",
      ].includes(field)
    ) {
      setTimeout(() => {
        fetchAvailableQty(
          {
            ...maintenanceRows[idx],
            [field]: value,
          },
          idx
        );
      }, 0);
    }
    // If type changes, fetch sub-types and material names
    if (field === "material_type") fetchSubTypesAndNames(value, idx);
    // If material name changes, fetch details
    if (field === "material_name") fetchMaterialDetails(value, idx);
  };

  // Add row handler
  const handleAddMaintenanceRow = () => {
    setMaintenanceRows((rows) => [
      ...rows,
      {
        material_type: null,
        subTypeOptions: [],
        material_sub_type: null,
        materialNameOptions: [],
        material_name: null,
        genericInfoOptions: [],
        generic_info: null,
        brandOptions: [],
        brand: null,
        colourOptions: [],
        colour: null,
        unitOptions: [],
        unit: null,
        gate_pass_qty: "",
        reason: "",
        available_qty: null,
      },
    ]);
  };
  // Remove row handler
  const handleRemoveMaintenanceRow = (idx) => {
    setMaintenanceRows((rows) => {
      const newRows = [...rows];
      const item = newRows[idx];
      if (item.id) {
        // If it's an existing item, mark it for destruction
        newRows[idx]._destroy = true;
      } else {
        // If it's a new item, remove it from the array
        newRows.splice(idx, 1);
      }
      return newRows;
    });
  };

  // Add new material to the row's materialNameOptions and select it
  const handleAddMaterial = () => {
    if (!newMaterialName.trim()) {
      alert("Please enter a material/asset name.");
      return;
    }
    const newMaterial = {
      value: `other_${newMaterialName.replace(/\s+/g, "_").toLowerCase()}`,
      label: newMaterialName,
      remark: newMaterialRemark,
    };
    setMaintenanceRows((rows) =>
      rows.map((row, idx) =>
        idx === materialRowIdx
          ? {
              ...row,
              materialNameOptions: [
                ...(row.materialNameOptions || []).filter(
                  (opt) => opt.value !== "other"
                ),
                newMaterial,
                { value: "other", label: "Other" },
              ],
              material_name: newMaterial.value,
              other_material_name: newMaterialName,
              other_material_description: newMaterialRemark,
            }
          : row
      )
    );
    setShowAddMaterialModal(false);
    setNewMaterialName("");
    setNewMaterialRemark("");
    setMaterialRowIdx(null);
  };

  const prefillMaintenanceRowOptions = async (rows) => {
    const optionPromises = rows.map(async (row) => {
      const newOptions = {
        subTypeOptions: [],
        materialNameOptions: [],
        genericInfoOptions: [],
        brandOptions: [],
        colourOptions: [],
        unitOptions: [],
      };

      if (row.material_type) {
        const subTypeRes = await axios.get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${row.material_type}&token=${token}`
        );
        newOptions.subTypeOptions = subTypeRes.data.map((i) => ({
          value: i.id,
          label: i.name,
        }));

        const nameRes = await axios.get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${row.material_type}&q[material_category_eq]=material&token=${token}`
        );
        let materialNameOptions = nameRes.data.map((i) => ({
          value: i.id,
          label: i.name,
        }));

        if (
          row.material_name &&
          typeof row.material_name === "string" &&
          row.material_name.startsWith("other")
        ) {
          materialNameOptions.push({
            value: row.material_name,
            label: row.other_material_name,
          });
        }

        materialNameOptions.push({ value: "other", label: "Other" });
        newOptions.materialNameOptions = materialNameOptions;
      }

      if (row.material_name && !String(row.material_name).startsWith("other")) {
        const genRes = await axios.get(
          `${baseURL}pms/generic_infos.json?q[material_id_eq]=${row.material_name}&token=${token}`
        );
        newOptions.genericInfoOptions = genRes.data.map((i) => ({
          value: i.id,
          label: i.generic_info,
        }));

        const brandRes = await axios.get(
          `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${row.material_name}&token=${token}`
        );
        newOptions.brandOptions = brandRes.data.map((i) => ({
          value: i.id,
          label: i.brand_name,
        }));

        const colourRes = await axios.get(
          `${baseURL}pms/colours.json?q[material_id_eq]=${row.material_name}&token=${token}`
        );
        newOptions.colourOptions = colourRes.data.map((i) => ({
          value: i.id,
          label: i.colour,
        }));
      }
      const unitRes = await axios.get(
        `${baseURL}unit_of_measures.json?token=${token}`
      );
      newOptions.unitOptions = unitRes.data.map((i) => ({
        value: i.id,
        label: i.name,
      }));

      return { ...row, ...newOptions };
    });

    const populatedRows = await Promise.all(optionPromises);
    setMaintenanceRows(populatedRows);
  };

  useEffect(() => {
    const fetchAndSetGatePassData = async () => {
      if (id && gatePassTypes.length > 0 && poOptions.length > 0) {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/gate_passes/${id}.json?token=${token}`
          );
          const data = response.data;

          const gatePassType = gatePassTypes.find(
            (t) => t.label === data.gate_pass_type_name
          );

          setFormData((prev) => ({
            ...prev,
            project_id: data.project?.id,
            sub_project_id: data.sub_project?.id,
            gate_pass_no: data.gate_pass_no,
            gate_pass_type: gatePassType ? gatePassType.value : "",
            is_returnable: data.expected_return_date
              ? "returnable"
              : "non_returnable",
            store_id: data.from_store?.id,
            vehicle_no: data.vehicle_no,
            driver_name: data.driver_name,
            expected_return_date: data.expected_return_date || "",
            contact_person: data.contact_person,
            contact_no: data.contact_person_no,
            gate_number_id: data.gate_number_id,
            driver_contact_no: data.driver_contact_no,
            gate_pass_date_time: data.gate_pass_date,
          }));

          if (data.to_resource) {
            if (data.to_resource.type === "Pms::Supplier") {
              setFormData((prev) => ({
                ...prev,
                to_vendor: data.to_resource.id,
              }));
            } else if (data.to_resource.type === "Pms::Store") {
              setFormData((prev) => ({
                ...prev,
                to_store_id: data.to_resource.id,
              }));
            } else if (
              data.to_resource.type === "OtherVendor" &&
              data.to_resource.vendor_name
            ) {
              const vendorName = data.to_resource.vendor_name;
              const vendorValue = `non_master_${vendorName
                .replace(/\s+/g, "_")
                .toLowerCase()}`;

              // Add the new vendor to the supplier options
              setSupplierOptions((prev) => {
                const existingOptions = prev.filter((o) => o.value !== "other");
                if (!existingOptions.some((o) => o.value === vendorValue)) {
                  return [
                    ...existingOptions,
                    {
                      label: vendorName,
                      value: vendorValue,
                    },
                    { value: "other", label: "Other" },
                  ];
                }
                return prev;
              });

              // Set the vendor as selected in the form data
              setFormData((prev) => ({
                ...prev,
                to_vendor: vendorValue,
              }));

              // Store the OtherVendor id for later fetch if user wants to edit details
              setOtherVendorId(data.to_resource.id);
            } else if (data.to_resource.type === "OtherVendor") {
              // Fallback if vendor_name is not present
              setFormData((prev) => ({
                ...prev,
                to_vendor: "other",
              }));
              setOtherVendorId(data.to_resource.id);
            }
          }

          const status = statusOptions.find((s) => s.value === data.status);
          if (status) {
            setSelectedStatus(status);
          }

          if (data.resource_id) {
            setFetchedResourceId(data.resource_id);
            // (remove setSelectedPO and setFormData for mto_po_number here)
          }

          if (data.attachments && data.attachments.length > 0) {
            const fetchedDocuments = data.attachments.map((att) => {
              const urlParts = att.url.split("/");
              const encodedFilename = urlParts[urlParts.length - 1];
              const filename = decodeURIComponent(encodedFilename);
              return {
                document_type: att.document_name, // Using filename as doc type as it's not in response
                attachments: [
                  {
                    filename: filename,
                    content: null, // Not fetching file content for pre-fill
                    content_type: att.document_content_type,
                    url: att.doc_path,
                  },
                ],
                uploadDate: new Date(att.created_at)
                  .toISOString()
                  .split("T")[0],
              };
            });
            setDocuments(fetchedDocuments);
          }

          if (data.gate_pass_materials && data.gate_pass_materials.length > 0) {
            // Pre-fill material_items for PO-based types
            if (
              gatePassType?.rawValue === "PurchaseOrder" ||
              gatePassType?.rawValue === "MaterialTransaferOrder"
            ) {
              const allPoMaterials = poMaterials.length > 0 ? poMaterials : [];
              const gatePassMaterialIds = data.gate_pass_materials.map(
                (m) => m.mor_inventory_id
              );
              const selectedMaterials = allPoMaterials
                .filter((m) => gatePassMaterialIds.includes(m.id))
                .map((m) => {
                  const gpMaterial =
                    data.gate_pass_materials.find(
                      (gpm) => gpm.mor_inventory_id === m.id
                    ) || {};
                  return {
                    id: gpMaterial.id,
                    material_type: m.material_type,
                    material_sub_type: m.material_sub_type,
                    material_name: m.material,
                    material_details: m.generic_specification,
                    generic_specification: m.generic_specification,
                    brand: m.brand,
                    colour: m.colour,
                    unit: m.uom,
                    gate_pass_qty: gpMaterial.gate_pass_qty || "",
                    stock_as_on: m.stock_as_on,
                    mor_inventory_id: m.id,
                    available_qty: null,
                  };
                });
              setFormData((prev) => ({
                ...prev,
                material_items: selectedMaterials,
              }));
            }
            // Pre-fill maintenanceRows for other types
            else if (gatePassType?.rawValue === "" || !gatePassType?.rawValue) {
              const maintenanceMaterialRows = data.gate_pass_materials.map(
                (m) => {
                  const isOther =
                    m.material_id === null && m.other_material_name;
                  const materialNameValue = isOther
                    ? `other_${m.other_material_name
                        .replace(/\s+/g, "_")
                        .toLowerCase()}`
                    : m.material_id;
                  return {
                    id: m.id,
                    material_type: m.material_type_id,
                    material_sub_type: m.material_sub_type_id,
                    material_name: materialNameValue,
                    generic_info: m.generic_specification_id,
                    brand: m.brand_id,
                    colour: m.colour_id,
                    unit: m.uom_id,
                    gate_pass_qty: m.gate_pass_qty || "",
                    reason: m.remarks || "",
                    other_material_name: m.other_material_name,
                    other_material_description: m.other_material_description,
                    subTypeOptions: [],
                    materialNameOptions: [],
                    genericInfoOptions: [],
                    brandOptions: [],
                    colourOptions: [],
                    unitOptions: [],
                    available_qty: null,
                  };
                }
              );
              prefillMaintenanceRowOptions(maintenanceMaterialRows);
            }
          }
        } catch (error) {
          console.error("Error fetching gate pass data:", error);
        }
      }
    };
    fetchAndSetGatePassData();
  }, [id, gatePassTypes, poOptions, poMaterials]);

  // Ensure PO/WO No is preselected after both poOptions and resource_id are available
  useEffect(() => {
    if (fetchedResourceId && poOptions.length > 0) {
      const po = poOptions.find((p) => p.id === fetchedResourceId);
      if (po) {
        setSelectedPO(po);
        setFormData((prev) => ({ ...prev, mto_po_number: po.value }));
      }
    }
  }, [fetchedResourceId, poOptions]);

  // When Add Vendor modal is opened and to_vendor is 'other' and otherVendorId exists, fetch and prefill
  useEffect(() => {
    if (showAddVendorModal && formData.to_vendor === "other" && otherVendorId) {
      const fetchOtherVendor = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com//gate_passes/${otherVendorId}/fetch_other_vendor.json?token=${token}`
          );
          const data = response.data;
          setNewVendorName(data.name || "");
          setNewVendorContact(data.contact_no || "");
          setNewVendorAddress(data.address || "");
          setNewVendorRemark(data.remarks || "");
        } catch (error) {
          setNewVendorName("");
          setNewVendorContact("");
          setNewVendorAddress("");
          setNewVendorRemark("");
        }
      };
      fetchOtherVendor();
    }
    // Only run when modal opens
    // eslint-disable-next-line
  }, [showAddVendorModal]);

  const fetchAvailableQty = async (row, idx) => {
    const params = {
      "q[inventory_id_eq]": row.material_name,
      "q[generic_info_id_eq]": row.generic_info,
      "q[pms_brand_id_eq]": row.brand,
      "q[pms_colour_id_eq]": row.colour,
      "q[material_order_request_pms_site_id_eq]": formData.sub_project_id,
      "q[material_order_request_pms_site_pms_store_id_eq]": formData.store_id,
      "q[inventory_sub_type_id_eq]": row.material_sub_type,
    };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    const query = new URLSearchParams(params).toString();
    try {
      const res = await axios.get(
        `https://marathon.lockated.com//mor_inventories/fetch_store_available_qty.json?${query}`
      );
      const qty = res.data?.available_quantity ?? 0;
      setMaintenanceRows((rows) =>
        rows.map((r, i) => (i === idx ? { ...r, available_qty: qty } : r))
      );
    } catch {
      setMaintenanceRows((rows) =>
        rows.map((r, i) => (i === idx ? { ...r, available_qty: 0 } : r))
      );
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Gate Pass Edit
          </a>
          <h5 className="mt-3">Gate Pass Edit</h5>
          <div className="head-material text-center">
            <h4>{getHeaderTitle()}</h4>
          </div>
          <div className="card card-default mt-5 p-2b-4">
            <div className="card-header3">
              <h3 className="card-title">{getHeaderTitle()}</h3>
            </div>
            <div className="card-body">
              {/* Radio buttons for Returnable/Non-Returnable */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="me-3">Returnable Status:</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isReturnable"
                        id="returnable"
                        value="returnable"
                        checked={formData.is_returnable === "returnable"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_returnable: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="returnable">
                        Returnable
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isReturnable"
                        id="nonReturnable"
                        value="non_returnable"
                        checked={formData.is_returnable === "non_returnable"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_returnable: e.target.value,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="nonReturnable"
                      >
                        Non-Returnable
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Project
                      <span> *</span>
                    </label>
                    <SingleSelector
                      options={projects}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          project_id: selected?.value,
                          sub_project_id: null,
                          gate_number_id: null,
                        })
                      }
                      value={projects.find(
                        (p) => p.value === formData.project_id
                      )}
                      placeholder="Select Project"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Sub-Project
                      <span> *</span>
                    </label>
                    <SingleSelector
                      options={subProjects}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          sub_project_id: selected?.value,
                        })
                      }
                      value={subProjects.find(
                        (p) => p.value === formData.sub_project_id
                      )}
                      placeholder="Select Sub-Project"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Gate Pass Type
                      <span> *</span>
                    </label>
                    <SingleSelector
                      options={gatePassTypes}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          gate_pass_type: selected?.value,
                        })
                      }
                      value={gatePassTypes.find(
                        (t) => t.value === formData.gate_pass_type
                      )}
                      placeholder="Select Type"
                    />
                  </div>
                </div>

                {(() => {
                  const selectedGatePassType = gatePassTypes.find(
                    (t) => t.value === formData.gate_pass_type
                  );
                  const rawValue = selectedGatePassType?.rawValue;

                  switch (rawValue) {
                    case "PurchaseOrder":
                      return (
                        <>
                          <div className="col-md-3 ">
                            <div className="form-group">
                              <label>From Store</label>
                              <SingleSelector
                                options={stores}
                                onChange={(selected) =>
                                  setFormData({
                                    ...formData,
                                    store_id: selected?.value,
                                  })
                                }
                                value={stores.find(
                                  (s) => s.value === formData.store_id
                                )}
                                placeholder="Select From Store"
                              />
                            </div>
                          </div>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>To Vendor</label>

                              <SingleSelector
                                options={supplierOptions}
                                onChange={async (selected) => {
                                  if (selected?.value === "other") {
                                    setFormData({
                                      ...formData,
                                      to_vendor: "other",
                                    });
                                    setShowAddVendorModal(true);
                                    // Fetch and prefill if otherVendorId is available
                                    if (otherVendorId) {
                                      try {
                                        const response = await axios.get(
                                          `https://marathon.lockated.com//gate_passes/${otherVendorId}/fetch_other_vendor.json?token=${token}`
                                        );
                                        const data = response.data;
                                        setNewVendorName(data.name || "");
                                        setNewVendorContact(
                                          data.contact_no || ""
                                        );
                                        setNewVendorAddress(data.address || "");
                                        setNewVendorRemark(data.remarks || "");
                                      } catch (error) {
                                        setNewVendorName("");
                                        setNewVendorContact("");
                                        setNewVendorAddress("");
                                        setNewVendorRemark("");
                                      }
                                    } else {
                                      setNewVendorName("");
                                      setNewVendorContact("");
                                      setNewVendorAddress("");
                                      setNewVendorRemark("");
                                    }
                                  } else {
                                    setFormData({
                                      ...formData,
                                      to_vendor: selected?.value,
                                    });
                                  }
                                }}
                                value={supplierOptions.find(
                                  (v) => v.value === formData.to_vendor
                                )}
                                placeholder="Select Vendor"
                              />
                            </div>
                          </div>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>PO/WO No *</label>
                              <SingleSelector
                                options={poOptions}
                                onChange={(selected) => {
                                  setFormData({
                                    ...formData,
                                    mto_po_number: selected?.value,
                                  });
                                  setSelectedPO(selected); // Store selected PO object
                                }}
                                value={poOptions.find(
                                  (p) => p.id === selectedPO?.id
                                )}
                                placeholder="Select PO/WO No"
                              />
                            </div>
                          </div>
                        </>
                      );
                    case "MaterialTransaferOrder":
                      return (
                        <>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>From Store</label>
                              <SingleSelector
                                options={stores}
                                onChange={(selected) =>
                                  setFormData({
                                    ...formData,
                                    store_id: selected?.value,
                                  })
                                }
                                value={stores.find(
                                  (s) => s.value === formData.store_id
                                )}
                                placeholder="Select From Store"
                              />
                            </div>
                          </div>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>To Store</label>
                              <SingleSelector
                                options={toStores}
                                onChange={(selected) =>
                                  setFormData({
                                    ...formData,
                                    to_store_id: selected?.value,
                                  })
                                }
                                value={toStores.find(
                                  (s) => s.value === formData.to_store_id
                                )}
                                placeholder="Select To Store"
                              />
                            </div>
                          </div>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>MTO/SO Number *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.mto_po_number}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mto_po_number: e.target.value,
                                  })
                                }
                                placeholder="Enter MTO/SO Number"
                              />
                            </div>
                          </div>
                        </>
                      );
                    case "":
                      return (
                        <>
                          <div className="col-md-3 ">
                            <div className="form-group">
                              <label>From Store</label>
                              <SingleSelector
                                options={stores}
                                onChange={(selected) =>
                                  setFormData({
                                    ...formData,
                                    store_id: selected?.value,
                                  })
                                }
                                value={stores.find(
                                  (s) => s.value === formData.store_id
                                )}
                                placeholder="Select From Store"
                              />
                            </div>
                          </div>
                          <div className="col-md-3 mt-2">
                            <div className="form-group">
                              <label>To Vendor</label>
                              <SingleSelector
                                options={supplierOptions}
                                onChange={async (selected) => {
                                  if (selected?.value === "other") {
                                    setFormData({
                                      ...formData,
                                      to_vendor: "other",
                                    });
                                    setShowAddVendorModal(true);
                                    // Fetch and prefill if otherVendorId is available
                                    if (otherVendorId) {
                                      try {
                                        const response = await axios.get(
                                          `https://marathon.lockated.com//gate_passes/${otherVendorId}/fetch_other_vendor.json?token=${token}`
                                        );
                                        const data = response.data;
                                        setNewVendorName(data.name || "");
                                        setNewVendorContact(
                                          data.contact_no || ""
                                        );
                                        setNewVendorAddress(data.address || "");
                                        setNewVendorRemark(data.remarks || "");
                                      } catch (error) {
                                        setNewVendorName("");
                                        setNewVendorContact("");
                                        setNewVendorAddress("");
                                        setNewVendorRemark("");
                                      }
                                    } else {
                                      setNewVendorName("");
                                      setNewVendorContact("");
                                      setNewVendorAddress("");
                                      setNewVendorRemark("");
                                    }
                                  } else {
                                    setFormData({
                                      ...formData,
                                      to_vendor: selected?.value,
                                    });
                                  }
                                }}
                                value={supplierOptions.find(
                                  (v) => v.value === formData.to_vendor
                                )}
                                placeholder="Select Vendor"
                              />
                            </div>
                          </div>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}

                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Gate Pass No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.gate_pass_no}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Gate Pass Date & Time</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formData.gate_pass_date_time
                          ? `${new Date(
                              formData.gate_pass_date_time
                            ).toLocaleDateString("en-GB")} ${new Date(
                              formData.gate_pass_date_time
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                          : ""
                      }
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>
                      Expected Return Date{" "}
                      {formData.gate_pass_type === "return_to_vendor" && "*"}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expected_return_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_return_date: e.target.value,
                        })
                      }
                      required={formData.gate_pass_type === "return_to_vendor"}
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Gate No</label>
                    <SingleSelector
                      options={gateNumbers}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          gate_number_id: selected?.value,
                        })
                      }
                      value={gateNumbers.find(
                        (g) => g.value === formData.gate_number_id
                      )}
                      placeholder="Select Gate No"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Driver Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.driver_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driver_name: e.target.value,
                        })
                      }
                      placeholder="Enter Driver Name"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Driver Contact No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.driver_contact_no}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driver_contact_no: e.target.value,
                        })
                      }
                      placeholder="Enter Driver Contact No"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Vehicle No. </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vehicle_no}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_no: e.target.value })
                      }
                      placeholder="Enter Vehicle No"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact_person}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_person: e.target.value,
                        })
                      }
                      placeholder="Enter Contact Person"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Contact No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact_no}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_no: e.target.value })
                      }
                      placeholder="Enter Contact No"
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-end px-2 mt-3">
                <h5>Material / Asset Details</h5>
                {(() => {
                  const selectedGatePassType = gatePassTypes.find(
                    (t) => t.value === formData.gate_pass_type
                  );
                  const rawValue = selectedGatePassType?.rawValue;
                  if (rawValue === "") {
                    return (
                      <button
                        className="purple-btn2"
                        onClick={handleAddMaintenanceRow}
                      >
                        Add
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="purple-btn2"
                        onClick={() => setShowMaterialSelectModal(true)}
                        disabled={!selectedPO}
                      >
                        Add
                      </button>
                    );
                  }
                })()}
              </div>

              {(() => {
                const selectedGatePassType = gatePassTypes.find(
                  (t) => t.value === formData.gate_pass_type
                );
                const rawValue = selectedGatePassType?.rawValue;
                if (rawValue === "") {
                  return (
                    <div className="tbl-container mx-2 mt-3">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Material Type</th>
                            <th>Material Sub-Type</th>
                            <th>Material Name</th>
                            <th>Generic Info</th>
                            <th>Brand</th>
                            <th>Colour</th>
                            <th>Unit</th>
                            <th>Gate Pass Qty</th>
                            <th>Reason for Maintenance</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maintenanceRows
                            .filter((row) => !row._destroy)
                            .map((row, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={inventoryTypes}
                                    value={
                                      inventoryTypes.find(
                                        (opt) => opt.value === row.material_type
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "material_type",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.subTypeOptions || []}
                                    value={
                                      (row.subTypeOptions || []).find(
                                        (opt) =>
                                          opt.value === row.material_sub_type
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "material_sub_type",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.materialNameOptions || []}
                                    value={
                                      (row.materialNameOptions || []).find(
                                        (opt) => opt.value === row.material_name
                                      ) || null
                                    }
                                    onChange={(selected) => {
                                      if (selected?.value === "other") {
                                        setMaterialRowIdx(idx);
                                        setShowAddMaterialModal(true);
                                      } else {
                                        handleMaintenanceRowChange(
                                          idx,
                                          "material_name",
                                          selected ? selected.value : null
                                        );
                                      }
                                    }}
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.genericInfoOptions || []}
                                    value={
                                      (row.genericInfoOptions || []).find(
                                        (opt) => opt.value === row.generic_info
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "generic_info",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.brandOptions || []}
                                    value={
                                      (row.brandOptions || []).find(
                                        (opt) => opt.value === row.brand
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "brand",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.colourOptions || []}
                                    value={
                                      (row.colourOptions || []).find(
                                        (opt) => opt.value === row.colour
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "colour",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 225 }}>
                                  <SingleSelector
                                    options={row.unitOptions || []}
                                    value={
                                      (row.unitOptions || []).find(
                                        (opt) => opt.value === row.unit
                                      ) || null
                                    }
                                    onChange={(selected) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "unit",
                                        selected ? selected.value : null
                                      )
                                    }
                                    placeholder="Select"
                                  />
                                </td>
                                <td style={{ minWidth: 150 }}>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={row.gate_pass_qty}
                                    min={0}
                                    max={row.available_qty ?? undefined}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (
                                        row.available_qty !== null &&
                                        val !== "" &&
                                        Number(val) > Number(row.available_qty)
                                      ) {
                                        alert(
                                          `Gate Pass Qty cannot exceed Available Qty (${row.available_qty})!`
                                        );
                                        return;
                                      }
                                      handleMaintenanceRowChange(
                                        idx,
                                        "gate_pass_qty",
                                        val
                                      );
                                    }}
                                  />
                                  {row.available_qty !== null && (
                                    <div
                                      style={{ fontSize: 12, color: "#888" }}
                                    >
                                      Available Qty: {row.available_qty}
                                    </div>
                                  )}
                                </td>
                                <td style={{ minWidth: 180 }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={row.reason}
                                    onChange={(e) =>
                                      handleMaintenanceRowChange(
                                        idx,
                                        "reason",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      handleRemoveMaintenanceRow(idx)
                                    }
                                  >
                                    <svg
                                      width={18}
                                      height={18}
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.76 6L6 11.76M6 6L11.76 11.76"
                                        stroke="#8B0203"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                                        stroke="#8B0203"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } else {
                  return (
                    <div className="tbl-container mx-2 mt-3">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Material Type</th>
                            <th>Material Sub-Type</th>
                            <th>Material Name</th>
                            <th>Generic Info</th>
                            <th>Brand</th>
                            <th>Colour</th>
                            <th>Unit</th>
                            <th>Gate Pass Qty</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.material_items
                            .filter((item) => !item._destroy)
                            .map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.material_type}</td>
                                <td>{item.material_sub_type}</td>
                                <td>{item.material_name}</td>
                                <td>
                                  {item.generic_specification ||
                                    item.material_details}
                                </td>
                                <td>{item.brand}</td>
                                <td>{item.colour}</td>
                                <td>{item.unit}</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={item.gate_pass_qty}
                                    min={0}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        item.stock_as_on !== undefined &&
                                        value !== "" &&
                                        Number(value) > Number(item.stock_as_on)
                                      ) {
                                        alert(
                                          `Gate Pass Qty cannot exceed Stock As On (${item.stock_as_on})!`
                                        );
                                        return; // Do not update value
                                      }
                                      const updatedItems = [
                                        ...formData.material_items,
                                      ];
                                      updatedItems[index].gate_pass_qty = value;
                                      setFormData({
                                        ...formData,
                                        material_items: updatedItems,
                                      });
                                    }}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn"
                                    onClick={() => handleRemoveMaterial(index)}
                                  >
                                    <svg
                                      width={18}
                                      height={18}
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.76 6L6 11.76M6 6L11.76 11.76"
                                        stroke="#8B0203"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                                        stroke="#8B0203"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              })()}

              {/* Remove old document attachment section and add new one from Bill Payment Create */}
              {/* Document Attachment Section (copied and adapted) */}
              <div className="d-flex justify-content-between mt-3 me-2">
                <h5 className=" ">Document Attachment</h5>
                <div
                  className="card-tools d-flex"
                  data-bs-toggle="modal"
                  data-bs-target="#attachModal"
                  onClick={openattachModal}
                >
                  <button
                    className="purple-btn2 rounded-3"
                    data-bs-toggle="modal"
                    data-bs-target="#attachModal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span>Attach</span>
                  </button>
                </div>
              </div>
              {/* Document Table (dynamic) */}
              <div className="tbl-container mx-3 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="text-start">Sr. No.</th>
                      <th className="text-start">Document Name</th>
                      <th className="text-start">File Name</th>
                      {/* <th className="text-start">File Type</th> */}
                      <th className="text-start">Upload Date</th>
                      <th className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No documents attached
                        </td>
                      </tr>
                    ) : (
                      documents.map((doc, idx) => (
                        <tr key={idx}>
                          <td className="text-start">{idx + 1}</td>
                          <td className="text-start">{doc.document_type}</td>
                          <td className="text-start">
                            {doc.attachments[0]?.filename || "-"}
                          </td>
                          {/* <td className="text-start">
                            {doc.attachments[0]?.content_type || "-"}
                          </td> */}
                          <td className="text-start">
                            {doc.uploadDate || "-"}
                          </td>
                          <td
                            className="text-decoration-underline"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewDocument(idx)}
                          >
                            View
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Attach Modal (advanced, from Bill Entry Create) */}
              <Modal
                centered
                size="l"
                show={attachModal}
                onHide={closeattachModal}
                backdrop="true"
                keyboard={true}
                className="modal-centered-custom"
              >
                <Modal.Header closeButton>
                  <h5>Attach Document</h5>
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Name of the Document</label>
                        {newDocument.document_type &&
                        documents.find(
                          (doc) =>
                            doc.isDefault &&
                            doc.document_type === newDocument.document_type
                        ) ? (
                          // For default document types - show as disabled input
                          <input
                            type="text"
                            className="form-control"
                            value={newDocument.document_type}
                            disabled
                          />
                        ) : (
                          // For new document types - allow input
                          <input
                            type="text"
                            className="form-control"
                            value={newDocument.document_type}
                            onChange={(e) =>
                              setNewDocument((prev) => ({
                                ...prev,
                                document_type: e.target.value,
                              }))
                            }
                            placeholder="Enter document name"
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <div className="form-group">
                        <label>Upload File</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                    {/* Add this new section for file name editing */}
                    {newDocument.attachments.length > 0 && (
                      <div className="col-md-12 mt-2">
                        <div className="form-group">
                          <label>File Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newDocument.attachments[0].filename}
                            onChange={(e) => {
                              setNewDocument((prev) => ({
                                ...prev,
                                attachments: [
                                  {
                                    ...prev.attachments[0],
                                    filename: e.target.value,
                                  },
                                ],
                              }));
                            }}
                            placeholder="Enter file name"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row mt-2 justify-content-center">
                    <div className="col-md-4">
                      <button
                        className="purple-btn2 w-100"
                        onClick={handleAttachDocument}
                        disabled={
                          !newDocument.document_type ||
                          newDocument.attachments.length === 0
                        }
                      >
                        Attach
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="purple-btn1 w-100"
                        onClick={closeattachModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              {/* View Document Modal (dynamic) */}
              <Modal
                centered
                size="lg"
                show={viewDocumentModal}
                onHide={closeviewDocumentModal}
                backdrop="true"
                keyboard={true}
                className="modal-centered-custom"
              >
                <Modal.Header closeButton>
                  <h5>Document Attachment</h5>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <div className="d-flex justify-content-between mt-3 me-2">
                      <h5 className=" ">Latest Documents</h5>
                      <div
                        className="card-tools d-flex"
                        data-bs-toggle="modal"
                        data-bs-target="#attachModal"
                      >
                        <button
                          className="purple-btn2 rounded-3"
                          data-bs-toggle="modal"
                          data-bs-target="#attachModal"
                          onClick={openattachModal}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="currentColor"
                            className="bi bi-plus"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                          </svg>
                          <span>Attach</span>
                        </button>
                      </div>
                    </div>
                    <div className="tbl-container px-0">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Document Name</th>
                            <th>Attachment Name</th>
                            {/* <th>File Type</th> */}
                            <th>Upload Date</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {documents.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center">
                                No documents attached
                              </td>
                            </tr>
                          ) : (
                            documents.map((doc, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{doc.document_type}</td>
                                <td>{doc.attachments[0]?.filename || "-"}</td>
                                {/* <td>
                                  {doc.attachments[0]?.content_type || "-"}
                                </td> */}
                                <td>{doc.uploadDate || "-"}</td>
                                {/* <td>
                                  <i
                                    className="fa-regular fa-eye"
                                    style={{ fontSize: 18, cursor: "pointer" }}
                                    // You can add onClick to preview/download if needed
                                  />
                                </td> */}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className=" mt-3 me-2">
                      <h5 className=" ">Document Attachment History</h5>
                    </div>
                    <div className="tbl-container px-0">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Document Name</th>
                            <th>Attachment Name</th>
                            {/* <th>File Type</th> */}
                            <th>Upload Date</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {documents.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center">
                                No documents attached
                              </td>
                            </tr>
                          ) : (
                            documents.map((doc, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{doc.document_type}</td>
                                <td>{doc.attachments[0]?.filename || "-"}</td>
                                {/* <td>
                                  {doc.attachments[0]?.content_type || "-"}
                                </td> */}
                                <td>{doc.uploadDate || "-"}</td>
                                {/* <td>
                                  <i
                                    className="fa-regular fa-eye"
                                    style={{ fontSize: 18, cursor: "pointer" }}
                                    // You can add onClick to preview/download if needed
                                  />
                                </td> */}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row mt-2 justify-content-center">
                    <div className="col-md-3">
                      <button className="purple-btn1 w-100">Close</button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>

              {/* Status Dropdown above Submit/Cancel using SingleSelector */}
              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label
                      className="form-label mt-2"
                      style={{ fontSize: "0.95rem", color: "black" }}
                    >
                      Status
                    </label>
                    <SingleSelector
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      placeholder="Select Status"
                      isClearable={false}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4 justify-content-end">
                <div className="col-md-2">
                  <button
                    className="purple-btn2 w-100 mt-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        size="lg"
        show={showMaterialSelectModal}
        onHide={() => setShowMaterialSelectModal(false)}
        backdrop="true"
        keyboard={true}
      >
        <Modal.Header closeButton>
          <h5>Select Materials</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container mx-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th></th>
                  <th>Sr.No.</th>
                  <th>Material / Asset Type</th>
                  <th>Material / Asset Sub-Type</th>
                  <th>Material / Asset Name</th>
                  <th>Generic Info</th>
                  <th>Brand</th>
                  <th>Colour</th>
                  <th>Unit</th>
                  <th>Stock As On</th>
                </tr>
              </thead>
              <tbody>
                {poMaterials.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMaterialIndexes.includes(idx)}
                        onChange={() => {
                          setSelectedMaterialIndexes((prev) =>
                            prev.includes(idx)
                              ? prev.filter((i) => i !== idx)
                              : [...prev, idx]
                          );
                        }}
                      />
                    </td>
                    <td>{idx + 1}</td>
                    <td>{item.material_type}</td>
                    <td>{item.material_sub_type}</td>
                    <td>{item.material}</td>
                    <td>{item.generic_specification}</td>
                    <td>{item.brand}</td>
                    <td>{item.colour}</td>
                    <td>{item.uom}</td>
                    <td>{item.stock_as_on}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="purple-btn2"
              onClick={() => {
                // Add selected materials to main table
                const selectedMaterials = selectedMaterialIndexes.map(
                  (idx) => ({
                    material_type: poMaterials[idx].material_type,
                    material_sub_type: poMaterials[idx].material_sub_type,
                    material_name: poMaterials[idx].material,
                    material_details: poMaterials[idx].generic_specification,
                    generic_specification:
                      poMaterials[idx].generic_specification,
                    brand: poMaterials[idx].brand,
                    colour: poMaterials[idx].colour,
                    unit: poMaterials[idx].uom,
                    gate_pass_qty: "",
                    stock_as_on: poMaterials[idx].stock_as_on,
                    mor_inventory_id: poMaterials[idx].id || null,
                    available_qty: null,
                  })
                );
                setFormData((prev) => ({
                  ...prev,
                  material_items: [
                    ...prev.material_items,
                    ...selectedMaterials,
                  ],
                }));
                setShowMaterialSelectModal(false);
                setSelectedMaterialIndexes([]);
              }}
              disabled={selectedMaterialIndexes.length === 0}
            >
              Accept Selected
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddVendorModal}
        onHide={() => setShowAddVendorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Non-Master Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>
              Vendor Name <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vendor name"
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              Contact No <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact number"
              value={newVendorContact}
              onChange={(e) => setNewVendorContact(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              Address <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={newVendorAddress}
              onChange={(e) => setNewVendorAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              Remark <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter remark"
              value={newVendorRemark}
              onChange={(e) => setNewVendorRemark(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddVendorModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddVendor}>
            Add Vendor
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddMaterialModal}
        onHide={() => setShowAddMaterialModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Other Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Material / Asset Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter material/asset name"
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter remark"
              value={newMaterialRemark}
              onChange={(e) => setNewMaterialRemark(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddMaterialModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMaterial}>
            Add Material
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GatePassEdit;
