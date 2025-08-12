import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const RopoMappingCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  // Get passed MOR data from add-mor page
  const passedMORData = location.state?.selectedMORs || [];
  const fromAddMor = location.state?.fromAddMor || false;

  // Get passed material data from add-po page
  const passedMaterialData = location.state?.selectedMaterials || [];
  const fromAddPo = location.state?.fromAddPo || false;
  const existingMorDataFromPo = location.state?.existingMorData || [];
  const existingPoDataFromPo = location.state?.existingPoData || [];

  const [selectPOModal, setselectPOModal] = useState(false);
    const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

  const handleAddPOClick = async () => {
    if (selectedMORs.length === 0 && selectedMaterials.length === 0) {
      alert("Please select at least one MOR or material before adding PO");
      return;
    }

    let allMaterialIds = [];

    selectedMORs.forEach((morId) => {
      const mor = morData.find((m) => m.mor_id === morId);
      if (mor) {
        const materialIds = mor.mor_inventories.map((inv) => inv.id);
        allMaterialIds = [...allMaterialIds, ...materialIds];
      }
    });

    allMaterialIds = [...allMaterialIds, ...selectedMaterials];
    allMaterialIds = [...new Set(allMaterialIds)];

    try {
      const response = await axios.post(
        `https://marathon.lockated.com/purchase_orders/ropo_material_matches.json?token=${token}`,
        {
          mor_inventory_ids: allMaterialIds,
          exclude_material_inventory_ids: [],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      navigate(`/add-po?token=${token}`, {
        state: {
          mor_inventory_ids: allMaterialIds,
          apiResponseData: response.data,
          existingMorData: morData, // Pass existing MOR data
          existingPoData: poData, // Pass existing PO data
        },
      });
    } catch (error) {
      console.error(error);
      alert("Error occurred while processing the request.");
    }
  };

  // Function to handle the API call for adding PO
  
    // State variables for Select PO functionality
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sites, setSites] = useState([]);
        const [selectedWing, setSelectedWing] = useState(null);
        const [wingsOptions, setWingsOptions] = useState([]);

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [pagination, setPagination] = useState({
      current_page: 1,
      next_page: null,
      prev_page: null,
      total_pages: 1,
      total_count: 0,
      per_page: 5,
    });
  
  // state declarations

  const [siteOptions, setSiteOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}pms/company_setups.json?token=${token}`)
      .then((response) => {
        const companies = response.data.companies || [];

        // Flatten all projects from all companies
        const allProjects = companies.flatMap((company) =>
          company.projects.map((project) => ({
            ...project,
            company_name: company.company_name, // keep for reference if needed
          }))
        );

        setProjects(allProjects);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const projectData = projects.find((p) => p.id === selectedOption.value);
      setSiteOptions(projectData?.pms_sites || []);
    } else {
      setSiteOptions([]);
    }
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // State for MOR data from add-mor page
  const [morData, setMorData] = useState([]);
  const [collapsedMORs, setCollapsedMORs] = useState({});

  // State for tracking selected items for deletion
  const [selectedMORs, setSelectedMORs] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // State for PO data from add-po page
  const [poData, setPoData] = useState([]);
  const [orderedQuantities, setOrderedQuantities] = useState({});

  // State for ROPO mapping form
  const [ropoNumber, setRopoNumber] = useState("");
  const [mappingDate, setMappingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterParams, setFilterParams] = useState({
        startDate: "",
        endDate: "",
        poType: "",
        poNumber: "",
        selectedPOIds: [],
    supplierId: "",
  });

  const poTypes = [
    { value: "material", label: "Material" },
    { value: "asset", label: "Asset" },
    { value: "service", label: "Service" },
  ];

  // Fetch purchase orders with filters
  
    // Handle company change
  
    // Handle project change
  
    // Handle site change
  
    // Fetch companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${baseURL}pms/company_setups.json?token=${token}`
        );
        const formattedCompanies = response.data.companies.map((company) => ({
          value: company.id,
          label: company.company_name,
          projects: company.projects,
        }));
        setCompanies(formattedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
  
    // Get showing entries text
    const getShowingEntriesText = () => {
      if (!pagination.total_count) return "No entries found";
  
      const start = (pagination.current_page - 1) * pagination.per_page + 1;
      const end = Math.min(
        start + pagination.per_page - 1,
        pagination.total_count
      );
  
      return `Showing ${start} to ${end} of ${pagination.total_count} entries`;
    };
  
    // Initial data fetch
    useEffect(() => {
      fetchCompanies();
    }, []);
  
  // Set MOR data when passed from add-mor page
    useEffect(() => {
    if (fromAddMor && passedMORData.length > 0) {
      // Merge new MOR data with existing data, avoiding duplicates
      setMorData((prevData) => {
        const existingMorIds = new Set(prevData.map((mor) => mor.mor_id));
        const newMORs = passedMORData.filter(
          (mor) => !existingMorIds.has(mor.mor_id)
        );

        const mergedData = [...prevData, ...newMORs];

        // Initialize collapsed state for new MORs
        const newCollapsedState = {};
        newMORs.forEach((mor) => {
          newCollapsedState[`mor-${mor.mor_id}`] = false; // Start collapsed
        });
        setCollapsedMORs((prev) => ({ ...prev, ...newCollapsedState }));

        // Show alert message only if new MORs were added
        if (newMORs.length > 0) {
          alert(`Added ${newMORs.length} new MOR(s) from Add MOR page`);
        } else {
          alert("Selected MORs are already present in the table");
        }

        return mergedData;
      });
    }
  }, [fromAddMor, passedMORData]);

  // Set PO data when passed from add-po page
    useEffect(() => {
    if (fromAddPo && passedMaterialData.length > 0) {
      // Restore existing MOR data if it was passed back
      if (existingMorDataFromPo.length > 0) {
        setMorData(existingMorDataFromPo);

        // Initialize collapsed state for MORs
        const initialCollapsedState = {};
        existingMorDataFromPo.forEach((mor) => {
          initialCollapsedState[`mor-${mor.mor_id}`] = false;
        });
        setCollapsedMORs(initialCollapsedState);
      }

      // Restore existing PO data if it was passed back
      if (existingPoDataFromPo.length > 0) {
        setPoData(existingPoDataFromPo);
      }

      // Merge new PO data with existing data, avoiding duplicates
      setPoData((prevData) => {
        const existingMaterialIds = new Set(
          prevData.map((item) => item.mor_inventory_id)
        );
        const newPOItems = passedMaterialData.filter(
          (item) => !existingMaterialIds.has(item.mor_inventory_id)
        );

        const mergedData = [...prevData, ...newPOItems];

        // Show alert message only if new items were added
        if (newPOItems.length > 0) {
          alert(`Added ${newPOItems.length} new material(s) from Add PO page`);
        }

        return mergedData;
      });
    }
  }, [
    fromAddPo,
    passedMaterialData,
    existingMorDataFromPo,
    existingPoDataFromPo,
  ]);

  // Fetch projects when company changes

  // Quick Filter states

  const [collapsedRows, setCollapsedRows] = useState({});

  const handleCollapseToggle = (rowKey) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const handleMORCollapseToggle = (morId) => {
    setCollapsedMORs((prev) => ({
      ...prev,
      [`mor-${morId}`]: !prev[`mor-${morId}`],
    }));
  };

  const handlePOCollapseToggle = (materialId) => {
    setCollapsedMORs((prev) => ({
      ...prev,
      [`po-material-${materialId}`]: !prev[`po-material-${materialId}`],
    }));
  };

  // Handle MOR checkbox selection
  const handleMORCheckboxChange = (morId, checked) => {
    if (checked) {
      setSelectedMORs((prev) => [...prev, morId]);
      // Auto-select all materials of this MOR
      const mor = morData.find((m) => m.mor_id === morId);
      if (mor) {
        const materialIds = mor.mor_inventories.map((inv) => inv.id);
        setSelectedMaterials((prev) => [...new Set([...prev, ...materialIds])]);
      }
    } else {
      setSelectedMORs((prev) => prev.filter((id) => id !== morId));
      // Auto-deselect all materials of this MOR
      const mor = morData.find((m) => m.mor_id === morId);
      if (mor) {
        const materialIds = mor.mor_inventories.map((inv) => inv.id);
        setSelectedMaterials((prev) =>
          prev.filter((id) => !materialIds.includes(id))
        );
      }
    }
  };

  // Handle material checkbox selection
  const handleMaterialCheckboxChange = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials((prev) => [...prev, materialId]);

      // Check if all materials of this MOR are now selected
      const mor = morData.find((m) =>
        m.mor_inventories.some((inv) => inv.id === materialId)
      );
      if (mor) {
        const allMaterialIds = mor.mor_inventories.map((inv) => inv.id);
        const selectedMaterialIds = [...selectedMaterials, materialId];
        if (allMaterialIds.every((id) => selectedMaterialIds.includes(id))) {
          setSelectedMORs((prev) => [...new Set([...prev, mor.mor_id])]);
        }
      }
    } else {
      setSelectedMaterials((prev) => prev.filter((id) => id !== materialId));

      // Auto-deselect the MOR if any of its materials are deselected
      const mor = morData.find((m) =>
        m.mor_inventories.some((inv) => inv.id === materialId)
      );
      if (mor) {
        setSelectedMORs((prev) => prev.filter((id) => id !== mor.mor_id));
      }
    }
  };

  // Handle select all MORs
  const handleSelectAllMORs = (checked) => {
    if (checked) {
      setSelectedMORs(morData.map((mor) => mor.mor_id));
      // Auto-select all materials
      const allMaterialIds = morData.flatMap((mor) =>
        mor.mor_inventories.map((inv) => inv.id)
      );
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMORs([]);
      setSelectedMaterials([]);
    }
  };

  // Handle select all materials
  const handleSelectAllMaterials = (checked) => {
    if (checked) {
      const allMaterialIds = morData.flatMap((mor) =>
        mor.mor_inventories.map((inv) => inv.id)
      );
      setSelectedMaterials(allMaterialIds);
      // Auto-select all MORs since all materials are selected
      setSelectedMORs(morData.map((mor) => mor.mor_id));
    } else {
      setSelectedMaterials([]);
      setSelectedMORs([]);
    }
  };

  // Delete selected MORs and materials
  const handleDeleteSelected = () => {
    if (selectedMORs.length === 0 && selectedMaterials.length === 0) {
      alert("Please select at least one item to delete");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedMORs.length} MOR(s) and ${selectedMaterials.length} material(s)?`
    );

    if (confirmDelete) {
      let updatedMorData = [...morData];

      // Delete selected MORs
      if (selectedMORs.length > 0) {
        updatedMorData = updatedMorData.filter(
          (mor) => !selectedMORs.includes(mor.mor_id)
        );
      }

      // Delete selected materials from remaining MORs
      if (selectedMaterials.length > 0) {
        updatedMorData = updatedMorData
          .map((mor) => ({
            ...mor,
            mor_inventories: mor.mor_inventories.filter(
              (inv) => !selectedMaterials.includes(inv.id)
            ),
          }))
          .filter((mor) => mor.mor_inventories.length > 0); // Remove MORs with no materials
      }

      setMorData(updatedMorData);

      // Also remove selected PO materials
      if (selectedMaterials.length > 0) {
        const updatedPoData = poData.filter(
          (item) => !selectedMaterials.includes(item.mor_inventory_id)
        );
        setPoData(updatedPoData);

        // Also clear ordered quantities for deleted materials
        const updatedOrderedQuantities = {};
        Object.keys(orderedQuantities).forEach((key) => {
          const [poId, materialId] = key.split("-");
          if (!selectedMaterials.includes(parseInt(materialId))) {
            updatedOrderedQuantities[key] = orderedQuantities[key];
          }
        });
        setOrderedQuantities(updatedOrderedQuantities);
      }

      // Clear selections
      setSelectedMORs([]);
      setSelectedMaterials([]);

      // Update collapsed state for remaining MORs
      const newCollapsedState = {};
      updatedMorData.forEach((mor) => {
        newCollapsedState[`mor-${mor.mor_id}`] = false;
      });
      setCollapsedMORs(newCollapsedState);

      alert("Selected items have been deleted successfully");
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedMORs([]);
    setSelectedMaterials([]);
    setOrderedQuantities({});
  };

  // Clear all data
  const clearAllData = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all MOR and PO data?"
    );
    if (confirmClear) {
      setMorData([]);
      setPoData([]);
      setSelectedMORs([]);
      setSelectedMaterials([]);
      setOrderedQuantities({});
      setCollapsedMORs({});
      // Reset form fields
      setRopoNumber("");
      setMappingDate(new Date().toISOString().split("T")[0]);
      setRemarks("");
      setStatus("draft");
    }
  };

  // Get selection summary text
  const getSelectionSummary = () => {
    if (selectedMORs.length === 0 && selectedMaterials.length === 0) {
      return "No items selected";
    }
    let summary = "";
    if (selectedMORs.length > 0) {
      summary += `${selectedMORs.length} MOR(s)`;
    }
    if (selectedMaterials.length > 0) {
      if (summary) summary += " and ";
      summary += `${selectedMaterials.length} material(s)`;
    }
    return summary;
  };

  // Handle ordered quantity change
  const handleOrderedQuantityChange = (poId, materialId, value) => {
    setOrderedQuantities((prev) => ({
      ...prev,
      [`${poId}-${materialId}`]: value,
    }));
  };
  

  // Handle final ROPO mapping submit
  const handleRopoMappingSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Construct the ropo_mor_inventories_attributes array from PO materials only
      const ropoMorInventoriesAttributes = [];

      // Use poData which contains the materials from add-po page
      if (poData && poData.length > 0) {
        poData.forEach((item) => {
          const orderQty =
            orderedQuantities[
              `${item.purchase_order_id}-${item.mor_inventory_id}`
            ];
          if (orderQty && parseFloat(orderQty) > 0) {
            ropoMorInventoriesAttributes.push({
              mor_inventory_id: item.mor_inventory_id,
              po_mor_inventory_id:
                item.po_mor_inventory_id || item.mor_inventory_id,
              order_qty: parseFloat(orderQty),
            });
          }
        });
      }

      // If no PO data, try to use passedMaterialData as fallback
      if (
        ropoMorInventoriesAttributes.length === 0 &&
        passedMaterialData &&
        passedMaterialData.length > 0
      ) {
        passedMaterialData.forEach((item) => {
          const orderQty =
            orderedQuantities[
              `${item.purchase_order_id}-${item.mor_inventory_id}`
            ];
          if (orderQty && parseFloat(orderQty) > 0) {
            ropoMorInventoriesAttributes.push({
              mor_inventory_id: item.mor_inventory_id,
              po_mor_inventory_id:
                item.po_mor_inventory_id || item.mor_inventory_id,
              order_qty: parseFloat(orderQty),
            });
          }
        });
      }

      // If still no data, include all PO materials with default quantities
      if (
        ropoMorInventoriesAttributes.length === 0 &&
        poData &&
        poData.length > 0
      ) {
        poData.forEach((item) => {
          ropoMorInventoriesAttributes.push({
            mor_inventory_id: item.mor_inventory_id,
            po_mor_inventory_id:
              item.po_mor_inventory_id || item.mor_inventory_id,
            order_qty: 1, // Default quantity
          });
        });
      }

      const payload = {
        ropo_mapping: {
          project_id: selectedProject?.value, // Default or from selected project
          pms_site_id: selectedSite?.value, // Default or from selected site
          mapping_date: mappingDate,
          remarks: remarks || "Some notes",
          status: status,
          ropo_mor_inventories_attributes: ropoMorInventoriesAttributes,
        },
      };

      console.log("Selected MORs:", selectedMORs);
      console.log("Selected Materials:", selectedMaterials);
      console.log("Passed Material Data:", passedMaterialData);
      console.log("PO Data:", poData);
      console.log("Ordered Quantities:", orderedQuantities);
      console.log(
        "ROPO MOR Inventories Attributes:",
        ropoMorInventoriesAttributes
      );
      console.log("Submitting ROPO mapping:", payload);

      const response = await axios.post(
        `https://marathon.lockated.com/ropo_mappings.json?token=${token}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("ROPO mapping response:", response.data);

      alert("ROPO mapping submitted successfully!");

      // Clear all data after successful submission
      clearAllData();

      // Reset form fields
      setRopoNumber("");
      setMappingDate(new Date().toISOString().split("T")[0]);
      setRemarks("");
      setStatus("draft");
    } catch (error) {
      console.error("Error submitting ROPO mapping:", error);
      alert(
        `Error submitting ROPO mapping: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div>
      <style>
        {`
          .table-primary {
            background-color: #e3f2fd !important;
            border-left: 4px solid #2196f3 !important;
          }
          .table-warning {
            background-color: #fff3e0 !important;
            border-left: 4px solid #ff9800 !important;
          }
          .table-info {
            background-color: #e8f4fd !important;
            border-left: 4px solid #17a2b8 !important;
          }
          .table-light {
            background-color: #f8f9fa !important;
            border-left: 4px solid #6c757d !important;
          }
          .material-type {
            background-color: #fafafa;
          }
          .collapse-icon {
            transition: transform 0.2s ease;
          }
          .collapse-icon:hover {
            color: #2196f3;
          }
          .card-tools .btn {
            transition: all 0.2s ease;
          }
          .card-tools .btn:hover {
            transform: translateY(-1px);
          }
        `}
      </style>
      <>
        <main className="h-100 w-100">
          {/* top navigation above */}
          <div className="main-content">
            <div className="website-content container-fluid ">
              <div className="module-data-section ">
                <a href="">
                  Home &gt; Store &gt; Store Operations &gt; ROPO Mapping{" "}
                </a>
                <h5 className="mt-3">ROPO Mapping</h5>
                <div className="row my-4 align-items-center">
                  <div className="col-md-12 px-2">
                    <div
                      className="tab-content mor-content"
                      id="pills-tabContent"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="create-mor"
                        role="tabpanel"
                        aria-labelledby="create-mor"
                      >
                        <section className="mor p-2 ">
                          <div className="container-fluid card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Project</label>
                                    <SingleSelector
                                      options={projects.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                      }))}
                                      onChange={handleProjectChange}
                                      value={selectedProject}
                                      placeholder="Select Project"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Sub-project</label>
                                    <SingleSelector
                                      options={siteOptions.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                      }))}
                                      onChange={handleSiteChange}
                                      value={selectedSite}
                                      placeholder="Select Sub-project"
                                      isDisabled={!selectedProject}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>ROPO No.</label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="ROPO5229"
                                      value={ropoNumber}
                                      onChange={(e) =>
                                        setRopoNumber(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Date</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                        value={mappingDate}
                                        onChange={(e) =>
                                          setMappingDate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Remarks</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter remarks"
                                        value={remarks}
                                        onChange={(e) =>
                                          setRemarks(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between mt-2 align-items-end">
                                <h5 className=" ">MOR &amp; PO Mapping</h5>
                                <div className="card-tools d-flex align-items-center gap-2">
                                  {/* <small className="text-muted me-2">
                                    {getSelectionSummary()}
                                  </small>
                                  {(selectedMORs.length > 0 ||
                                    selectedMaterials.length > 0) && (
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={clearAllSelections}
                                    >
                                      Clear Selection
                                    </button>
                                  )} */}
                                  <button
                                    className="purple-btn2"
                                    onClick={handleDeleteSelected}
                                    disabled={
                                      selectedMORs.length === 0 &&
                                      selectedMaterials.length === 0
                                    }
                                  >
                                    Delete (
                                    {selectedMORs.length +
                                      selectedMaterials.length}
                                    )
                                  </button>
                                </div>
                              </div>
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={
                                            selectedMORs.length ===
                                              morData.length &&
                                            morData.length > 0
                                          }
                                          onChange={(e) =>
                                            handleSelectAllMORs(
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </th>
                                      <th style={{ width: "30%" }}>
                                        MOR/Material/PO
                                      </th>
                                      <th>Pending Qty</th>
                                      <th>Ordered Qty</th>
                                      <th>PO UOM</th>
                                      <th>Converted Ordered Qty</th>
                                      <th>Rate </th>
                                      <th>Material Cost</th>
                                      <th>Total Received Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {morData.length > 0 ? (
                                      morData.map((mor) => (
                                        <React.Fragment
                                          key={`mor-${mor.mor_id}`}
                                        >
                                    {/* MOR row */}
                                          <tr
                                            className={
                                              selectedMORs.includes(mor.mor_id)
                                                ? "table-primary"
                                                : ""
                                            }
                                          >
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={selectedMORs.includes(
                                                  mor.mor_id
                                                )}
                                                onChange={(e) =>
                                                  handleMORCheckboxChange(
                                                    mor.mor_id,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                      </td>
                                      <td>
                                            <td style={{ textAlign: "left",
                                              border:"none"
                                             }}>
  <button
    className="btn btn-link p-0 me-2"
    onClick={() => handleMORCollapseToggle(mor.mor_id)}
    // aria-label="Toggle MOR visibility"'
   
  >
    {collapsedMORs[`mor-${mor.mor_id}`] ? (
      // Minus version
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#e0e0e0"
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ) : (
      // Plus version
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#e0e0e0"
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )}
  </button>
  {mor.mor_number}
                                      </td>

                                            </td>
                                            <td>
                                              {mor.mor_inventories.reduce(
                                                (sum, inv) =>
                                                  sum +
                                                  (inv.required_quantity || 0),
                                                0
                                              )}
                                            </td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                          {/* Material rows */}
                                          {collapsedMORs[`mor-${mor.mor_id}`] &&
                                            mor.mor_inventories.map(
                                              (inventory) => (
                                                <React.Fragment
                                                  key={`inventory-${inventory.id}`}
                                                >
                                                  <tr
                                                    className={`material-type ${
                                                      selectedMaterials.includes(
                                                        inventory.id
                                                      )
                                                        ? "table-warning"
                                                        : ""
                                                    }`}
                                                  >
                                                    <td>
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedMaterials.includes(
                                                          inventory.id
                                                        )}
                                                        onChange={(e) =>
                                                          handleMaterialCheckboxChange(
                                                            inventory.id,
                                                            e.target.checked
                                                          )
                                                        }
                                                      />
                                        </td>
                                                    <td className="ps-4 ms-4">
                                                      {/* <i
                                                        className={`fa-solid collapse-icon ms-3 ${
                                                          collapsedMORs[
                                                            `po-material-${inventory.id}`
                                                          ]
                                                            ? "fa-arrow-turn-down"
                                                            : "fa-arrow-turn-up"
                                                        }`}
                                                        onClick={() =>
                                                          handlePOCollapseToggle(
                                                            inventory.id
                                                          )
                                                        }
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      /> */}
                                                      {/* <td style={{ textAlign: "center" }}> */}
                                                      <button
                                                        className="btn btn-link p-0 ms-3"
                                                        onClick={() =>
                                                          handlePOCollapseToggle(
                                                            inventory.id
                                                          )
                                                        }
                                                        aria-label="Toggle material visibility"
                                                      >
                                                        {collapsedMORs[
                                                          `po-material-${inventory.id}`
                                                        ] ? (
                                                          // Minus version
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="#e0e0e0"
                                                            stroke="black"
                                                            strokeWidth="1"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                          >
                                                            <rect
                                                              x="3"
                                                              y="3"
                                                              width="18"
                                                              height="20"
                                                              rx="1"
                                                              ry="1"
                                                            />
                                                            <line
                                                              x1="8"
                                                              y1="12"
                                                              x2="16"
                                                              y2="12"
                                                            />
                                                          </svg>
                                                        ) : (
                                                          // Plus version
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="#e0e0e0"
                                                            stroke="black"
                                                            strokeWidth="1"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                          >
                                                            <rect
                                                              x="3"
                                                              y="3"
                                                              width="18"
                                                              height="20"
                                                              rx="1"
                                                              ry="1"
                                                            />
                                                            <line
                                                              x1="12"
                                                              y1="8"
                                                              x2="12"
                                                              y2="16"
                                                            />
                                                            <line
                                                              x1="8"
                                                              y1="12"
                                                              x2="16"
                                                              y2="12"
                                                            />
                                                          </svg>
                                                        )}
                                                      </button>
                                                      {/* </td> */}

                                                      {inventory.material_name}
                                                      <br />
                                                      {/* <small className="text-muted">
                                                        Type:{" "}
                                                        {inventory.material_type ||
                                                          "N/A"}{" "}
                                                        | Sub-Type:{" "}
                                                        {inventory.material_sub_type ||
                                                          "N/A"}
                                                      </small> */}
                                                    </td>
                                                    <td>
                                                      {inventory.required_quantity ||
                                                        0}
                                                    </td>
                                                    <td>
                                                      {inventory.prev_order_qty ||
                                                        0}
                                                    </td>
                                                    <td>
                                                      {inventory.uom_name ||
                                                        "N/A"}
                                                    </td>
                                                    <td>
                                                      {inventory.order_qty || 0}
                                                    </td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                      </tr>

                                                  {/* PO Data row for this material */}
                                                  {collapsedMORs[
                                                    `po-material-${inventory.id}`
                                                  ] &&
                                                    poData
                                                      .filter(
                                                        (item) =>
                                                          item.mor_inventory_id ===
                                                          inventory.id
                                                      )
                                                      .map((poItem, index) => (
                                                        <tr
                                                          key={`po-${poItem.purchase_order_id}-${inventory.id}`}
                                                          className="table-info"
                                                        >
                                                          <td>
                                                            <input
                                                              type="checkbox"
                                                              checked={selectedMaterials.includes(
                                                                poItem.mor_inventory_id
                                                              )}
                                                              onChange={(e) =>
                                                                handleMaterialCheckboxChange(
                                                                  poItem.mor_inventory_id,
                                                                  e.target
                                                                    .checked
                                                                )
                                                              }
                                                            />
                                                          </td>
                                                          <td className="ps-5">
                                                            {poItem.po_number ||
                                                              "N/A"}{" "}
                                                            -{" "}
                                                            {poItem.supplier_organization_name ||
                                                              "N/A"}
                                                            <br />
                                                            <small className="text-muted">
                                                              PO Date:{" "}
                                                              {poItem.po_date
                                                                ? new Date(
                                                                    poItem.po_date
                                                                  )
                                                                    .toLocaleDateString(
                                                                      "en-GB"
                                                                    )
                                                                    .split("/")
                                                                    .join("-")
                                                                : "N/A"}
                                                            </small>
                                                          </td>
                                                          <td>
                                                            {poItem.required_quantity ||
                                                              0}
                                        </td>
                                                          <td>
                                                            <input
                                                              type="number"
                                                              className="form-control form-control-sm"
                                                              value={
                                                                orderedQuantities[
                                                                  `${poItem.purchase_order_id}-${poItem.mor_inventory_id}`
                                                                ] || ""
                                                              }
                                                              onChange={(e) =>
                                                                handleOrderedQuantityChange(
                                                                  poItem.purchase_order_id,
                                                                  poItem.mor_inventory_id,
                                                                  e.target.value
                                                                )
                                                              }
                                                              placeholder="Enter qty"
                                                              style={{
                                                                width: "80px",
                                                              }}
                                                            />
                                                          </td>
                                                          <td>
                                                            {poItem.uom_name ||
                                                              "N/A"}
                                                          </td>
                                        <td />
                                                          <td />
                                                          <td />
                                                          <td />
                                                        </tr>
                                                      ))}
                                                </React.Fragment>
                                              )
                                            )}
                                        </React.Fragment>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="9" className="text-center">
                                          No MOR data available. Please select
                                          materials from the Add MOR page.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <div>
                                <button
                                  className="purple-btn2"
                                  onClick={() =>
                                    navigate(`/add-mor?token=${token}`)
                                  }
                                >
                                  Add MOR
                                </button>
                                <button
                                  className="purple-btn2 ms-2"
                                  onClick={handleAddPOClick}
                                >
                                  Add PO
                                </button>
                                {(morData.length > 0 || poData.length > 0) && (
                                  <button
                                    className="purple-btn1 ms-2"
                                    onClick={clearAllData}
                                  >
                                    Clear All
                                  </button>
                                )}
                                {/* {poData.length > 0 && (
                                  <button
                                    className="purple-btn2 ms-2"
                                    onClick={() => {
                                      const poMaterials = poData.filter(
                                        (item) =>
                                          selectedMaterials.includes(
                                            item.mor_inventory_id
                                          )
                                      );

                                      if (poMaterials.length === 0) {
                                        alert(
                                          "Please select at least one PO material before submitting"
                                        );
                                        return;
                                      }

                                      // Validate that all selected materials have ordered quantities
                                      const missingQuantities =
                                        poMaterials.filter(
                                          (item) =>
                                            !orderedQuantities[
                                              `${item.purchase_order_id}-${item.mor_inventory_id}`
                                            ]
                                        );

                                      if (missingQuantities.length > 0) {
                                        alert(
                                          "Please enter ordered quantities for all selected materials"
                                        );
                                        return;
                                      }

                                      console.log(
                                        "Submitting PO data:",
                                        poMaterials
                                      );
                                      console.log(
                                        "Ordered quantities:",
                                        orderedQuantities
                                      );

                                      alert("PO data submitted successfully!");
                                    }}
                                  >
                                    Submit PO Data
                                  </button>
                                )} */}
                              </div>
                              {/* /.container-fluid */}
                            </div>
                          </div>
                        </section>
                        <section className="ms-4 me-4 mb-3">
                          <div className="d-flex justify-content-end align-items-center gap-3">
                            <p className="pe-2 pt-1">Status</p>
                            <div className="dropdown">
                              <button
                                className="purple-btn2 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <a
                                    className={`dropdown-item ${
                                      status === "draft" ? "active" : ""
                                    }`}
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setStatus("draft");
                                    }}
                                  >
                                    Draft
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className={`dropdown-item ${
                                      status === "submitted" ? "active" : ""
                                    }`}
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setStatus("submitted");
                                    }}
                                  >
                                    Submitted
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className={`dropdown-item ${
                                      status === "approved" ? "active" : ""
                                    }`}
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setStatus("approved");
                                    }}
                                  >
                                    Approved
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className={`dropdown-item ${
                                      status === "rejected" ? "active" : ""
                                    }`}
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setStatus("rejected");
                                    }}
                                  >
                                    Rejected
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="row mt-2 justify-content-end">
                            <div className="col-md-2">
                              <button className="purple-btn2 w-100">
                                Print
                              </button>
                            </div>
                            <div className="col-md-2">
                              <button
                                className="purple-btn2 w-100"
                                onClick={handleRopoMappingSubmit}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Submitting..." : "Submit"}
                              </button>
                            </div>
                            <div className="col-md-2">
                              <button className="purple-btn1 w-100">
                                Cancel
                              </button>
                            </div>
                          </div>
                        </section>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="mor-approval-create"
                        role="tabpanel"
                        aria-labelledby="mor-approval-create"
                      ></div>
                      <div
                        className="tab-pane fade"
                        id="pills-contact"
                        role="tabpanel"
                        aria-labelledby="pills-contact-tab"
                      >
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Navigation Top */}
        {/* sidebar start below */}
        {/* webpage container end */}
        {/* Modal */}
        {/* rate & taxes select modal start */}

        {/* rate & taxes select modal end */}
        {/* Modal end */}
       
        {/* Add PO Modal */}
        <Modal show={selectPOModal} onHide={closeSelectPOModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Purchase Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12">
                <div className="alert alert-info">
                  <strong>Selected Items:</strong> {getSelectionSummary()}
                </div>
                <p>
                  API call has been made successfully. You can now proceed with
                  creating the purchase order.
                </p>
                <div className="mt-3">
                  <h6>Selected Material IDs:</h6>
                  <div className="bg-light p-2 rounded">
                    {(() => {
                      let allMaterialIds = [];
                      selectedMORs.forEach((morId) => {
                        const mor = morData.find((m) => m.mor_id === morId);
                        if (mor) {
                          const materialIds = mor.mor_inventories.map(
                            (inv) => inv.id
                          );
                          allMaterialIds = [...allMaterialIds, ...materialIds];
                        }
                      });
                      allMaterialIds = [
                        ...allMaterialIds,
                        ...selectedMaterials,
                      ];
                      allMaterialIds = [...new Set(allMaterialIds)];
                      return allMaterialIds.join(", ");
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSelectPOModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                closeSelectPOModal();
                navigate(`/add-po?token=${token}`);
              }}
            >
              Continue to Add PO
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default RopoMappingCreate;
