import React from "react";
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import MultiSelector from "../components/base/Select/MultiSelector";

const RopoMappingCreate = () => {
  const [companyOptions, setCompanyOptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  
  // Get passed material data from add-po page
  const passedMaterialData = location.state?.selectedMaterials || [];
  const fromAddPo = location.state?.fromAddPo || false;
  const existingMorDataFromPo = location.state?.existingMorData || [];
  const existingPoDataFromPo = location.state?.existingPoData || [];

  // Modal states
  const [selectPOModal, setselectPOModal] = useState(false);
  const [addMORModal, setAddMORModal] = useState(false);
  // PO Modal state
  const [addPOModal, setAddPOModal] = useState(false);
  const [poModalApiData, setPoModalApiData] = useState([]);
  const [poSelectedRowKeys, setPoSelectedRowKeys] = useState([]);

    const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

  const closeAddMORModal = () => {
    setAddMORModal(false);
  };

  // const handleAddPOClick = async () => {
  //   if (selectedMORs.length === 0 && selectedMaterials.length === 0) {
  //     alert("Please select at least one MOR or material before adding PO");
  //     return;
  //   }

  //   let allMaterialIds = [];

  //   selectedMORs.forEach((morId) => {
  //     const mor = morData.find((m) => m.mor_id === morId);
  //     if (mor) {
  //       const materialIds = mor.mor_inventories.map((inv) => inv.id);
  //       allMaterialIds = [...allMaterialIds, ...materialIds];
  //     }
  //   });

  //   allMaterialIds = [...allMaterialIds, ...selectedMaterials];
  //   allMaterialIds = [...new Set(allMaterialIds)];

  //   try {
  //     const response = await axios.post(
  //       `https://marathon.lockated.com/purchase_orders/ropo_material_matches.json?token=${token}`,
  //       {
  //         mor_inventory_ids: allMaterialIds,
  //         exclude_material_inventory_ids: [],
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     // Open PO modal with response
  //     setPoModalApiData(
  //       Array.isArray(response.data)
  //         ? response.data
  //         : response.data?.matches || []
  //     );
  //     setPoSelectedRowKeys([]);
  //     setAddPOModal(true);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error occurred while processing the request.");
  //   }
  // };

  const handleAddPOClick = async () => {
  if (selectedMORs.length === 0 && selectedMaterials.length === 0) {
    alert("Please select at least one MOR or material before adding PO");
    return;
  }

  let allMaterialIds = [];

  // Get all material IDs from selected MORs
  selectedMORs.forEach((morId) => {
    const mor = morData.find((m) => m.mor_id === morId);
    if (mor) {
      const materialIds = mor.mor_inventories.map((inv) => inv.id);
      allMaterialIds = [...allMaterialIds, ...materialIds];
    }
  });

  // Add directly selected materials
  allMaterialIds = [...allMaterialIds, ...selectedMaterials];

  // Remove duplicates
  allMaterialIds = [...new Set(allMaterialIds)];

  try {
    // Build query string for mor_inventory_ids[]
    const queryParams = allMaterialIds
      .map((id) => `mor_inventory_ids[]=${id}`)
      .join("&");

    const url = `https://marathon.lockated.com/purchase_orders/ropo_material_matches.json?token=${token}&${queryParams}`;

    const response = await axios.get(url);

    // Open PO modal with response
    setPoModalApiData(
      Array.isArray(response.data)
        ? response.data
        : response.data?.matches || []
    );
    setPoSelectedRowKeys([]);
    setAddPOModal(true);
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

  // MOR Modal related states
  const [morFormData, setMorFormData] = useState({
    materialType: "",
    materialSubType: "",
    material: "",
    genericSpecification: "",
    colour: "",
    brand: "",
    effectiveDate: "",
    rate: "",
    rateType: "",
    poRate: "",
    avgRate: "",
    uom: "",
    morNumber: "",
    morStartDate: "",
    morEndDate: "",
    projectIds: [],
    siteIds: [],
  });

  const [morOptions, setMorOptions] = useState([]);
  useEffect(() => {
    const fetchMorNumbers = async () => {
      try {
        const resp = await axios.get(
          `${baseURL}pms/company_setups/get_mors.json?token=${token}&q[mor_type_eq]=ropo`
        );

        const options = (resp.data?.material_order_requests || []).map(
          (mor) => ({
            value: mor.id,
            label: mor.mor_number,
          })
        );

        setMorOptions(options);
      } catch (err) {
        console.error("Error fetching MOR numbers:", err);
      }
    };

    fetchMorNumbers();
  }, []);

  const [inventoryTypes2, setInventoryTypes2] = useState([]);
  const [selectedInventory2, setSelectedInventory2] = useState(null);
  const [inventorySubTypes2, setInventorySubTypes2] = useState([]);
  const [selectedSubType2, setSelectedSubType2] = useState(null);
  const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]);
  const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] =
    useState(null);

  const [materialDetailsData, setMaterialDetailsData] = useState([]);
  const [loadingMaterialDetails, setLoadingMaterialDetails] = useState(false);
  const [selectedMaterialItems, setSelectedMaterialItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}pms/company_setups.json?token=${token}`)
      .then((response) => {
        const companies = response.data.companies || [];

        // Map companies to options
        const companyOpts = companies.map((company) => ({
          value: company.id,
          label: company.company_name,
          projects: company.projects, // keep projects for later filtering
        }));

        setCompanyOptions(companyOpts);

        // Flatten projects for the dropdown (if you want all projects regardless of company)
        const allProjects = companies.flatMap((company) =>
          company.projects.map((project) => ({
            value: project.id,
            label: project.name,
            companyId: company.id,
            pms_sites: project.pms_sites,
          }))
        );
        setProjects(allProjects);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleProjectChange = (selectedOptions) => {
    const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : (selectedOptions ? [selectedOptions] : []);
    setSelectedProject(optionsArray);
    setSelectedSite([]);
    // Persist in morFormData
    setMorFormData((prev) => ({
      ...prev,
      projectIds: optionsArray.map((o) => o.value),
      siteIds: [],
    }));
    // Do not auto fetch; Search button will trigger fetch

    if (optionsArray.length > 0) {
      const combinedSites = optionsArray.flatMap((opt) => opt.pms_sites || []);
      const uniqueSites = [];
      const seen = new Set();
      combinedSites.forEach((site) => {
        if (!seen.has(site.id)) {
          seen.add(site.id);
          uniqueSites.push({ value: site.id, label: site.name });
        }
      });
      setSiteOptions(uniqueSites);
    } else {
      setSiteOptions([]);
    }
  };

  const handleSiteChange = (selectedOptions) => {
    const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : (selectedOptions ? [selectedOptions] : []);
    setSelectedSite(optionsArray);
    setMorFormData((prev) => ({
      ...prev,
      siteIds: optionsArray.map((o) => o.value),
    }));
    // Do not auto fetch; Search button will trigger fetch
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
      setSelectedProject(null);
      setSelectedSite(null);
    // Filter projects list by selected company for modals
    if (selectedOption?.projects) {
      setProjects(
        selectedOption.projects.map((p) => ({
          value: p.id,
          label: p.name,
          pms_sites: p.pms_sites,
        }))
      );
    } else {
      setProjects([]);
    }
    setSiteOptions([]);
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

  // Refs to prevent infinite loops in useEffect
  const poDataProcessedRef = useRef(false);

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
  
  // MOR Modal related functions
  const handleMorSelectorChange = (field, selectedOption) => {
    setMorFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));

    if (field === "materialType") {
      setSelectedInventory2(selectedOption);
      setMorFormData((prev) => ({
        ...prev,
        materialSubType: "",
        material: "",
        genericSpecification: "",
        colour: "",
        brand: "",
        uom: "",
      }));
    }
  };
  

  const fetchMaterialDetails = async (useFilters = true, overrides = {}) => {
    setLoadingMaterialDetails(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("token", token);

      if (useFilters) {
        if (selectedCompany) {
          queryParams.append("q[company_id_in][]", selectedCompany.value);
        }
        // Use overrides if provided; otherwise morFormData
        const projIds = Array.isArray(overrides.projectIds) ? overrides.projectIds : morFormData.projectIds;
        const siteIds = Array.isArray(overrides.siteIds) ? overrides.siteIds : morFormData.siteIds;
        if (Array.isArray(projIds) && projIds.length > 0) {
          projIds.forEach((id) => queryParams.append("q[project_id_in][]", id));
        }
        if (Array.isArray(siteIds) && siteIds.length > 0) {
          siteIds.forEach((id) => queryParams.append("q[pms_site_id_in][]", id));
        }

        if (morFormData.materialType) {
          queryParams.append(
            "q[material_type_id_in][]",
            morFormData.materialType
          );
        }

        if (morFormData.materialSubType) {
          queryParams.append(
            "q[material_type_material_sub_type_id_in][]",
            morFormData.materialSubType
          );
        }

        if (morFormData.material) {
          queryParams.append(
            "q[mor_inventories_material_id_in][]",
            morFormData.material
          );
        }

        if (morFormData.morStartDate) {
          queryParams.append("q[mor_date_gteq][]", morFormData.morStartDate);
        }

        if (morFormData.morEndDate) {
          queryParams.append("q[mor_date_lteq][]", morFormData.morEndDate);
        }

        if (morFormData.morNumber) {
          queryParams.append("q[id_in][]", morFormData.morNumber);
        }
      }

      const apiUrl = `https://marathon.lockated.com//material_order_requests/material_details.json?${queryParams.toString()}&q[mor_type_eq]=ropo`;
      console.log("API URL with filters:", apiUrl);
      console.log("Selected Project IDs:", overrides.projectIds ?? morFormData.projectIds);
      console.log("Selected Site IDs:", overrides.siteIds ?? morFormData.siteIds);
      console.log("Query Params:", queryParams.toString());

      const response = await axios.get(apiUrl);

      let transformedData = [];

      if (
        response.data &&
        Array.isArray(response.data.material_order_requests)
      ) {
        response.data.material_order_requests.forEach((mor, morIndex) => {
          if (mor.mor_inventories && Array.isArray(mor.mor_inventories)) {
            const inventoryCount = mor.mor_inventories.length;

            mor.mor_inventories.forEach((inventory, invIndex) => {
              const materialRow = {
                mor_id: mor.id,
                project_name: mor.project_name,
                sub_project_name: mor.sub_project_name,
                mor_number: mor.mor_number,
                mor_date: mor.mor_date,
                status: mor.status,
                inventory_id: inventory.id,
                material_type: inventory.material_type || "",
                material_sub_type: inventory.material_sub_type || "",
                material_name: inventory.material_name,
                uom_name: inventory.uom_name,
                required_quantity: inventory.required_quantity,
                prev_order_qty: inventory.prev_order_qty,
                order_qty: inventory.order_qty,
                inventory_status: inventory.status,
                isFirstMaterial: invIndex === 0,
                rowspan: invIndex === 0 ? inventoryCount : 0,
              };

              transformedData.push(materialRow);
            });
          }
        });
      } else if (Array.isArray(response.data)) {
        response.data.forEach((mor, morIndex) => {
          if (mor.mor_inventories && Array.isArray(mor.mor_inventories)) {
            const inventoryCount = mor.mor_inventories.length;

            mor.mor_inventories.forEach((inventory, invIndex) => {
              const materialRow = {
                mor_id: mor.id,
                project_name: mor.project_name,
                sub_project_name: mor.sub_project_name,
                mor_number: mor.mor_number,
                mor_date: mor.mor_date,
                status: mor.status,
                inventory_id: inventory.id,
                material_type: inventory.material_type || "",
                material_sub_type: inventory.material_sub_type || "",
                material_name: inventory.material_name,
                uom_name: inventory.uom_name,
                required_quantity: inventory.required_quantity,
                prev_order_qty: inventory.prev_order_qty,
                order_qty: inventory.order_qty,
                inventory_status: inventory.status,
                isFirstMaterial: invIndex === 0,
                rowspan: invIndex === 0 ? inventoryCount : 0,
              };

              transformedData.push(materialRow);
            });
          }
        });
      }

      setMaterialDetailsData(transformedData);
    } catch (error) {
      console.error("Error fetching material details:", error);
      setMaterialDetailsData([]);
    } finally {
      setLoadingMaterialDetails(false);
    }
  };

  const handleMorMaterialCheckboxChange = (index) => {
    const newSelectedItems = [...selectedMaterialItems];
    if (newSelectedItems.includes(index)) {
      const filtered = newSelectedItems.filter((item) => item !== index);
      setSelectedMaterialItems(filtered);
    } else {
      newSelectedItems.push(index);
      setSelectedMaterialItems(newSelectedItems);
    }
  };

  const handleMorSelectAllMaterials = (e) => {
    if (e.target.checked) {
      setSelectedMaterialItems(materialDetailsData.map((_, index) => index));
    } else {
      setSelectedMaterialItems([]);
    }
  };

  // const handleMorSelectProject = (e, morId) => {
  //   const isChecked = e.target.checked;
  //   const indicesForThisMor = materialDetailsData
  //     .map((item, idx) => (item.mor_id === morId ? idx : null))
  //     .filter((idx) => idx !== null);

  //   if (isChecked) {
  //     // Add all materials for this MOR if not already selected
  //     const newSelected = [...selectedMaterialItems];
  //     indicesForThisMor.forEach((idx) => {
  //       if (!newSelected.includes(idx)) {
  //         newSelected.push(idx);
  //       }
  //     });
  //     setSelectedMaterialItems(newSelected);
  //   } else {
  //     // Remove all materials for this MOR
  //     const newSelected = selectedMaterialItems.filter(
  //       (idx) => !indicesForThisMor.includes(idx)
  //     );
  //     setSelectedMaterialItems(newSelected);
  //   }
  // };

  const handleMorSelectProject = (e, morId) => {
  const isChecked = e.target.checked;

  // Get all indices belonging to this MOR
  const indicesForThisMor = materialDetailsData
    .map((item, idx) => (item.mor_id === morId ? idx : null))
    .filter((idx) => idx !== null);

  if (isChecked) {
    // Select all indices for this MOR
    setSelectedMaterialItems((prev) => {
      const newSelected = [...prev];
      indicesForThisMor.forEach((idx) => {
        if (!newSelected.includes(idx)) {
          newSelected.push(idx);
        }
      });
      return newSelected;
    });
  } else {
    // Remove all indices for this MOR
    setSelectedMaterialItems((prev) =>
      prev.filter((idx) => !indicesForThisMor.includes(idx))
    );
  }
};

  const handleAcceptSelectedMaterials = () => {
    if (selectedMaterialItems.length === 0) {
      alert("Please select at least one material item");
      return;
    }

    // Get only the specifically selected materials
    const selectedMaterials = selectedMaterialItems.map((index) => {
      const item = materialDetailsData[index];
      return {
        mor_id: item.mor_id,
        project_name: item.project_name,
        sub_project_name: item.sub_project_name,
        mor_number: item.mor_number,
        mor_date: item.mor_date,
        status: item.status,
        mor_inventories: [{
          id: item.inventory_id,
          mor_id: item.mor_id,
          material_name: item.material_name,
          uom_name: item.uom_name,
          required_quantity: item.required_quantity,
          prev_order_qty: item.prev_order_qty,
          order_qty: item.order_qty,
          status: item.inventory_status,
          material_type: item.material_type,
          material_sub_type: item.material_sub_type,
        }],
      };
    });

    // Group materials by MOR ID and merge inventories for the same MOR
    const groupedMORs = selectedMaterials.reduce((acc, current) => {
      const existingMor = acc.find(mor => mor.mor_id === current.mor_id);
      if (existingMor) {
        // Add the new material to existing MOR
        existingMor.mor_inventories.push(...current.mor_inventories);
      } else {
        // Create new MOR entry
        acc.push(current);
      }
      return acc;
    }, []);

    // Merge with existing MOR data
    setMorData((prevData) => {
      const existingMorIds = new Set(prevData.map((mor) => mor.mor_id));
      const newMORs = [];
      const updatedMORs = [];

      groupedMORs.forEach((newMor) => {
        if (existingMorIds.has(newMor.mor_id)) {
          // MOR already exists, merge materials
          const existingMorIndex = prevData.findIndex(mor => mor.mor_id === newMor.mor_id);
          const existingMor = prevData[existingMorIndex];
          const existingMaterialIds = new Set(existingMor.mor_inventories.map(inv => inv.id));
          
          // Add only new materials that don't already exist
          const newMaterials = newMor.mor_inventories.filter(inv => !existingMaterialIds.has(inv.id));
          if (newMaterials.length > 0) {
            updatedMORs.push({
              ...existingMor,
              mor_inventories: [...existingMor.mor_inventories, ...newMaterials]
            });
          }
        } else {
          // New MOR
          newMORs.push(newMor);
        }
      });

      // Create final merged data
      let mergedData = [...prevData];
      
      // Update existing MORs
      updatedMORs.forEach(updatedMor => {
        const index = mergedData.findIndex(mor => mor.mor_id === updatedMor.mor_id);
        if (index !== -1) {
          mergedData[index] = updatedMor;
        }
      });

      // Add new MORs
      mergedData = [...mergedData, ...newMORs];

      // Initialize collapsed state for new MORs
      const newCollapsedState = {};
      newMORs.forEach((mor) => {
        newCollapsedState[`mor-${mor.mor_id}`] = false;
      });
      setCollapsedMORs((prev) => ({ ...prev, ...newCollapsedState }));

      const totalNewMaterials = newMORs.length + updatedMORs.length;
      if (totalNewMaterials > 0) {
        alert(`Added ${selectedMaterialItems.length} selected material(s) from Add MOR modal`);
      } else {
        alert("Selected materials are already present in the table");
      }

      return mergedData;
    });

    // Close modal and reset form
    setAddMORModal(false);
    setSelectedMaterialItems([]);
    setMaterialDetailsData([]);
  };

  const handleMorSearch = () => {
    // Always include main form filters when searching
    fetchMaterialDetails(true);
  };

  const handleMorReset = () => {
    setMorFormData({
      materialType: "",
      materialSubType: "",
      material: "",
      genericSpecification: "",
      colour: "",
      brand: "",
      effectiveDate: "",
      rate: "",
      rateType: "",
      poRate: "",
      avgRate: "",
      uom: "",
      morNumber: "",
      morStartDate: "",
      morEndDate: "",
      projectIds: [],
      siteIds: [],
    });
    setSelectedInventory2(null);
    setSelectedSubType2(null);
    setSelectedInventoryMaterialTypes2(null);
    const clearedProjects = [];
    const clearedSites = [];
    setSelectedProject(clearedProjects);
    setSelectedSite(clearedSites);
    setSiteOptions([]);
    setMaterialDetailsData([]);
    setSelectedMaterialItems([]);
    // After reset, fetch with company-only filter
    if (selectedCompany?.value) {
      // Force fetch with cleared project/site ids immediately
      fetchMaterialDetails(true, { projectIds: clearedProjects, siteIds: clearedSites });
    }
  };

  // Get showing entries text
  
    // Initial data fetch
    useEffect(() => {
      fetchCompanies();
    }, []);
  
  // MOR Modal related useEffects
    useEffect(() => {
    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          const options = response.data.map((inventory) => ({
            value: inventory.id,
            label: inventory.name,
          }));
          setInventoryTypes2(options);
        } else if (
          response.data &&
          Array.isArray(response.data.inventory_types)
        ) {
          const options = response.data.inventory_types.map((inventory) => ({
            value: inventory.id,
            label: inventory.name,
          }));
          setInventoryTypes2(options);
        } else {
          setInventoryTypes2([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching inventory types:", error);
        setInventoryTypes2([]);
      });
  }, []);

    useEffect(() => {
    if (selectedInventory2 || morFormData.materialType) {
      axios
        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${
            selectedInventory2?.value || morFormData.materialType
          }&token=${token}`
        )
        .then((response) => {
          if (Array.isArray(response.data)) {
            const options = response.data.map((subType) => ({
              value: subType.id,
              label: subType.name,
            }));
            setInventorySubTypes2(options);
          } else if (
            response.data &&
            Array.isArray(response.data.inventory_sub_types)
          ) {
            const options = response.data.inventory_sub_types.map(
              (subType) => ({
                value: subType.id,
                label: subType.name,
              })
            );
            setInventorySubTypes2(options);
          } else {
            setInventorySubTypes2([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
          setInventorySubTypes2([]);
        });
    }
  }, [selectedInventory2, morFormData.materialType]);

  useEffect(() => {
    if (selectedInventory2 || morFormData.materialType) {
    axios
      .get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${
            selectedInventory2?.value || morFormData.materialType
          }&q[material_category_eq]=material&token=${token}`
      )
      .then((response) => {
          if (Array.isArray(response.data)) {
            const options = response.data.map((subType) => ({
              value: subType.id,
              label: subType.name,
            }));
            setInventoryMaterialTypes2(options);
          } else if (
            response.data &&
            Array.isArray(response.data.inventories)
          ) {
            const options = response.data.inventories.map((subType) => ({
              value: subType.id,
              label: subType.name,
            }));
            setInventoryMaterialTypes2(options);
          } else {
            setInventoryMaterialTypes2([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching inventory materials:", error);
          setInventoryMaterialTypes2([]);
        });
    }
  }, [selectedInventory2, morFormData.materialType]);

  // Set PO data when passed from add-po page
  useEffect(() => {
    console.log("PO useEffect triggered:", {
      fromAddPo,
      passedMaterialDataLength: passedMaterialData.length,
      poDataProcessedRef: poDataProcessedRef.current,
    });
    if (
      fromAddPo &&
      passedMaterialData.length > 0 &&
      !poDataProcessedRef.current
    ) {
      poDataProcessedRef.current = true;

      // Restore existing PO data if it was passed back
      if (existingPoDataFromPo.length > 0) {
        setPoData(existingPoDataFromPo);
      }

      // Merge new PO data with existing data, avoiding duplicates based on mor_inventory_id + po_mor_inventory_id combination
      setPoData((prevData) => {
        console.log("Processing PO data:", {
          prevDataLength: prevData.length,
          passedMaterialDataLength: passedMaterialData.length,
        });

        const existingMaterialPoKeys = new Set(
          prevData.map(
            (item) =>
              `${item.mor_inventory_id}-${
                item.po_mor_inventory_id || item.purchase_order_id
              }`
          )
        );
        const newPOItems = passedMaterialData.filter(
          (item) =>
            !existingMaterialPoKeys.has(
              `${item.mor_inventory_id}-${
                item.po_mor_inventory_id || item.purchase_order_id
              }`
            )
        );

        console.log("Duplicate detection:", {
          existingKeys: Array.from(existingMaterialPoKeys),
          newItems: newPOItems.map(
            (item) =>
              `${item.mor_inventory_id}-${
                item.po_mor_inventory_id || item.purchase_order_id
              }`
          ),
        });

        const mergedData = [...prevData, ...newPOItems];

        // Show alert message only if new items were added
        if (newPOItems.length > 0) {
          alert(`Added ${newPOItems.length} new material(s) from Add PO page`);
    } else {
          alert("Selected materials are already present in the table");
        }

        return mergedData;
      });
    }
  }, [fromAddPo, passedMaterialData, existingPoDataFromPo]);

  // Handle existing MOR data restoration separately
  useEffect(() => {
    // Only restore existing data if we're coming from add-po page
    if (existingMorDataFromPo.length > 0 && fromAddPo) {
      console.log(
        "Restoring existing MOR data:",
        existingMorDataFromPo.length,
        "MORs"
      );
      console.log(
        "Existing MOR IDs:",
        existingMorDataFromPo.map((mor) => mor.mor_id)
      );

      // Set the existing MOR data directly to ensure it's preserved
      setMorData(existingMorDataFromPo);

      // Initialize collapsed state for MORs
      const initialCollapsedState = {};
      existingMorDataFromPo.forEach((mor) => {
        initialCollapsedState[`mor-${mor.mor_id}`] = false;
      });
      setCollapsedMORs(initialCollapsedState);
    }
  }, [existingMorDataFromPo, fromAddPo]);

  // Reset refs when navigation state changes
  useEffect(() => {
    console.log("Location state changed:", location.state);
    console.log("Current ref states:", {
      poDataProcessedRef: poDataProcessedRef.current,
    });

    // Only reset PO ref if we're getting new PO data from add-po
    if (location.state?.fromAddPo && location.state?.selectedMaterials) {
      console.log("Resetting PO ref for new PO data");
      poDataProcessedRef.current = false;
    }
  }, [location.state]);

  // Monitor morData state changes
  useEffect(() => {
    console.log(
      "morData state changed:",
      morData.length,
      "MORs:",
      morData.map((mor) => mor.mor_id)
    );
  }, [morData]);

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

  // Add near other state declarations at the top
const [remainingQuantities, setRemainingQuantities] = useState({});
  // Handle ordered quantity change
  // const handleOrderedQuantityChange = (poId, materialId, value) => {
  //   setOrderedQuantities((prev) => ({
  //     ...prev,
  //     [`${poId}-${materialId}`]: value,
  //   }));
  // };

  // Replace or add the handleOrderedQuantityChange function
const handleOrderedQuantityChange = (poId, materialId, value) => {
  const numValue = parseFloat(value) || 0;
  
  // Find the material in morData
  const material = morData.find(mor => 
    mor.mor_inventories.some(inv => inv.id === materialId)
  )?.mor_inventories.find(inv => inv.id === materialId);

  if (!material) {
    console.error('Material not found');
    return;
  }

  // Get initial pending quantity
  const initialPendingQty = material.pending_qty !== null && material.pending_qty !== undefined 
    ? parseFloat(material.pending_qty)
    : (parseFloat(material.required_quantity || 0) - parseFloat(material.prev_order_qty || 0));

  // Calculate total ordered quantity for this material across all POs except current one
  const totalOrderedQty = Object.entries(orderedQuantities)
    .filter(([key]) => {
      const [orderPoId, orderMaterialId] = key.split('-');
      return orderMaterialId === materialId.toString() && orderPoId !== poId.toString();
    })
    .reduce((sum, [_, qty]) => sum + (parseFloat(qty) || 0), 0);

  // Calculate available quantity
  const availableQty = initialPendingQty - totalOrderedQty;

  if (numValue > availableQty) {
    alert(`Order quantity cannot exceed pending quantity (${availableQty.toFixed(2)})`);
    return;
  }

  // Update ordered quantities
  setOrderedQuantities(prev => ({
    ...prev,
    [`${poId}-${materialId}`]: value
  }));

  // Update remaining quantities
  const newRemainingQty = initialPendingQty - (totalOrderedQty + numValue);
  setRemainingQuantities(prev => ({
    ...prev,
    [materialId]: newRemainingQty.toFixed(2)
  }));
};

// Add this useEffect after other useEffects
useEffect(() => {
  if (morData.length > 0) {
    const initial = {};
    morData.forEach(mor => {
      mor.mor_inventories.forEach(inv => {
        initial[inv.id] = inv.pending_qty !== null && inv.pending_qty !== undefined
          ? parseFloat(inv.pending_qty)
          : (parseFloat(inv.required_quantity || 0) - parseFloat(inv.prev_order_qty || 0));
      });
    });
    setRemainingQuantities(initial);
  }
}, [morData]);

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

          company_id: selectedCompany?.value,
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
      // clearAllData();

      // Reset form fields
      setRopoNumber("");
      setMappingDate(new Date().toISOString().split("T")[0]);
      setRemarks("");
      setStatus("draft");
       navigate(`/ropo-mapping-list?token=${token}`);
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

  // PO Modal helpers
  const handlePoModalCheckboxChange = (rowKey, checked) => {
    if (checked) {
      setPoSelectedRowKeys((prev) => [...prev, rowKey]);
    } else {
      setPoSelectedRowKeys((prev) => prev.filter((k) => k !== rowKey));
    }
  };

  const handlePoModalSelectAll = (checked) => {
    if (checked) {
      const keys = poModalApiData.map(
        (item) => `${item.mor_inventory_id}-${item.po_mor_inventory_id}`
      );
      setPoSelectedRowKeys(keys);
    } else {
      setPoSelectedRowKeys([]);
    }
  };
  // PO Filters
  const [poFilterParams, setPoFilterParams] = useState({
    companyId: null,
    projectId: null,
    subProjectId: null,
    startDate: "",
    endDate: "",
    poNumber: "",
    materialSubType: "",
    material: "",
  });

  // Common fetch function for PO modal
// Common fetch function for PO modal
const fetchPoMatches = async (filters = {}) => {
  try {
    setLoading(true);

    let url = `${baseURL}purchase_orders/ropo_material_matches.json?token=${token}`;

    // Pass MOR/Material IDs if selected
    if (selectedMORs.length || selectedMaterials.length) {
      let allMaterialIds = [];

      // Get all materials from selected MORs
      selectedMORs.forEach((morId) => {
        const mor = morData.find((m) => m.mor_id === morId);
        if (mor) {
          const materialIds = mor.mor_inventories.map((inv) => inv.id);
          allMaterialIds = [...allMaterialIds, ...materialIds];
        }
      });

      // Add selected material IDs
      allMaterialIds = [...allMaterialIds, ...selectedMaterials];
      allMaterialIds = [...new Set(allMaterialIds)];

      // Append as query params
      const idsQuery = allMaterialIds
        .map((id) => `mor_inventory_ids[]=${encodeURIComponent(id)}`)
        .join("&");

      url += `&${idsQuery}`;
    }

    // Dates
    if (filters.startDate) url += `&q[po_date_gteq][]=${filters.startDate}`;
    if (filters.endDate) url += `&q[po_date_lteq][]=${filters.endDate}`;

    // Company
    if (filters.companyId) url += `&q[company_id_in]=${filters.companyId}`;

    // Project
    if (filters.projectId) {
      url += `&q[po_mor_inventories_mor_inventory_material_order_request_project_id_in]=${filters.projectId}`;
    }

    // Sub Project
    if (filters.subProjectId) {
      url += `&q[po_mor_inventories_mor_inventory_material_order_request_pms_site_id_in]=${filters.subProjectId}`;
    }

    // PO Number
    if (filters.poNumber) url += `&q[supplier_id_in]=${filters.poNumber}`;

    // Material Type
    if (filters.materialType) {
      url += `&q[po_mor_inventories_material_inventory_pms_inventory_type_id_in]=${filters.materialType}`;
    }

    // Material Sub-Type
    if (filters.materialSubType) {
      url += `&q[po_mor_inventories_material_inventory_pms_inventory_sub_type_id_in]=${filters.materialSubType}`;
    }

    // Material
    if (filters.material) {
      url += `&q[po_mor_inventories_material_inventory_pms_inventory_id_in]=${filters.material}`;
    }

    const resp = await axios.get(url);
   setPoModalApiData(
  Array.isArray(resp.data)
    ? resp.data
    : resp.data?.matches || []
);
    setPoSelectedRowKeys([]);
  } catch (e) {
    console.error("Error fetching PO matches:", e);
  } finally {
    setLoading(false);
  }
};


  // Search handler
  const handlePoModalSearch =  async () => {
  await fetchPoMatches({
    
      companyId: poModalSelectedCompany?.value || poFilterParams.companyId,
      projectId: poModalSelectedProject?.value || poFilterParams.projectId,
      subProjectId: poModalSelectedSite?.value || poFilterParams.subProjectId,
      startDate: poFilterParams.startDate,
      endDate: poFilterParams.endDate,
      poNumber: poFilterParams.poNumber,
      materialType: poSelectedInventoryType?.value,
      materialSubType:
        poSelectedSubType?.value || poFilterParams.materialSubType,
      material: poSelectedMaterial?.value || poFilterParams.material,
    });
  };

  // Reset handler
// Reset handler
const handlePoModalReset = async () => {
  try {
    // Clear filters
    setPoFilterParams({
      companyId: null,
      projectId: null,
      subProjectId: null,
      startDate: "",
      endDate: "",
      poNumber: "",
      materialSubType: "",
      material: "",
    });

    setPoModalSelectedCompany(null);
    setPoModalSelectedProject(null);
    setPoModalSelectedSite(null);
    setPoSelectedRowKeys([]);
    setPoSelectedInventoryType(null);
    setPoSelectedSubType(null);
    setPoSelectedMaterial(null);
    setPoModalSites([]);
    setPoModalProjects([]);

    // Re-fetch companies to restore dropdowns
    await fetchPoModalCompanies();

    let url = `${baseURL}purchase_orders/ropo_material_matches.json?token=${token}`;

    if (selectedMORs.length || selectedMaterials.length) {
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

      const idsQuery = allMaterialIds
        .map((id) => `mor_inventory_ids[]=${encodeURIComponent(id)}`)
        .join("&");

      url += `&${idsQuery}`;
    }

    const resp = await axios.get(url);
setPoModalApiData(
  Array.isArray(resp.data)
    ? resp.data
    : resp.data?.matches || []
);
  } catch (e) {
    console.error("Error resetting PO matches:", e);
  }
};


  const handlePoModalSubmit = () => {
    if (poSelectedRowKeys.length === 0) {
      alert("Please select at least one material before submitting");
      return;
    }
    const selectedData = poModalApiData.filter((item) =>
      poSelectedRowKeys.includes(
        `${item.mor_inventory_id}-${item.po_mor_inventory_id}`
      )
    );
    // Avoid duplicates against existing poData
    const existingKeys = new Set(
      poData.map(
        (x) =>
          `${x.mor_inventory_id}-${
            x.po_mor_inventory_id || x.purchase_order_id
          }`
      )
    );
    const newItems = selectedData.filter(
      (it) =>
        !existingKeys.has(`${it.mor_inventory_id}-${it.po_mor_inventory_id}`)
    );
    const duplicateCount = selectedData.length - newItems.length;
    if (newItems.length === 0) {
      alert("Selected materials are already present in the table");
      return;
    }
    setPoData((prev) => [...prev, ...newItems]);
    alert(
      `Added ${newItems.length} new material(s)${
        duplicateCount > 0 ? `, ${duplicateCount} duplicate(s) skipped` : ""
      } from Add PO modal`
    );
    setAddPOModal(false);
  };

  // After addMORModal state
  useEffect(() => {
    if (addMORModal) {
      setSelectedMaterialItems([]);
      // On modal open, prefetch using company filter only (no auto-fetch on project/site change)
      if (selectedCompany?.value) {
        fetchMaterialDetails(true);
      }
    }
  }, [addMORModal, selectedCompany]);

  // Auto-refresh MOR data when main form project/site changes
  // Remove auto-refresh on project/sub-project change; fetching occurs on Search only

  // After addPOModal state
  useEffect(() => {
    if (addPOModal) {
      setPoSelectedRowKeys([]);
      fetchPoModalCompanies();
    }
  }, [addPOModal]);

  // PO modal-specific material filter state
  const [poInventoryTypes, setPoInventoryTypes] = useState([]);
  const [poSelectedInventoryType, setPoSelectedInventoryType] = useState(null);
  const [poInventorySubTypes, setPoInventorySubTypes] = useState([]);
  const [poSelectedSubType, setPoSelectedSubType] = useState(null);
  const [poInventoryMaterials, setPoInventoryMaterials] = useState([]);
  const [poSelectedMaterial, setPoSelectedMaterial] = useState(null);

  // PO modal-specific company/project/site state
  const [poModalCompanies, setPoModalCompanies] = useState([]);
  const [poModalProjects, setPoModalProjects] = useState([]);
  const [poModalSites, setPoModalSites] = useState([]);
  const [poModalSelectedCompany, setPoModalSelectedCompany] = useState(null);
  const [poModalSelectedProject, setPoModalSelectedProject] = useState(null);
  const [poModalSelectedSite, setPoModalSelectedSite] = useState(null);

  // PO Modal specific functions
  const fetchPoModalCompanies = async () => {
    try {
      const response = await axios.get(
        `${baseURL}pms/company_setups.json?token=${token}`
      );
      const formattedCompanies = response.data.companies.map((company) => ({
        value: company.id,
        label: company.company_name,
        projects: company.projects,
      }));
      setPoModalCompanies(formattedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handlePoModalCompanyChange = (selectedOption) => {
    setPoModalSelectedCompany(selectedOption);
    setPoModalSelectedProject(null);
    setPoModalSelectedSite(null);
    if (selectedOption?.projects) {
      setPoModalProjects(
        selectedOption.projects.map((p) => ({
          value: p.id,
          label: p.name,
          pms_sites: p.pms_sites,
        }))
      );
    } else {
      setPoModalProjects([]);
    }
    setPoModalSites([]);
  };

  const handlePoModalProjectChange = (selectedOption) => {
    setPoModalSelectedProject(selectedOption);
    setPoModalSelectedSite(null);
    if (selectedOption?.pms_sites) {
      setPoModalSites(
        selectedOption.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
      );
    } else {
      setPoModalSites([]);
    }
  };

  const handlePoModalSiteChange = (selectedOption) => {
    setPoModalSelectedSite(selectedOption);
  };

  // Fetch PO modal inventory types
  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.inventory_types || [];
        const options = list.map((x) => ({ value: x.id, label: x.name }));
        setPoInventoryTypes(options);
      })
      .catch(() => setPoInventoryTypes([]));
  }, []);

  // Fetch PO modal sub types when inventory type changes
  useEffect(() => {
    const typeId = poSelectedInventoryType?.value;
    if (!typeId) {
      setPoInventorySubTypes([]);
      setPoSelectedSubType(null);
      return;
    }
    axios
      .get(
        `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${typeId}&token=${token}`
      )
      .then((response) => {
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.inventory_sub_types || [];
        const options = list.map((x) => ({ value: x.id, label: x.name }));
        setPoInventorySubTypes(options);
      })
      .catch(() => setPoInventorySubTypes([]));
  }, [poSelectedInventoryType]);

  // Fetch PO modal materials when type changes
  useEffect(() => {
    const typeId = poSelectedInventoryType?.value;
    if (!typeId) {
      setPoInventoryMaterials([]);
      setPoSelectedMaterial(null);
      return;
    }
    axios
      .get(
        `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${typeId}&q[material_category_eq]=material&token=${token}`
      )
      .then((response) => {
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.inventories || [];
        const options = list.map((x) => ({ value: x.id, label: x.name }));
        setPoInventoryMaterials(options);
      })
      .catch(() => setPoInventoryMaterials([]));
  }, [poSelectedInventoryType]);

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
                                    {/* <label>Project</label> */}
                                    {/* <SingleSelector
                                      options={projects.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                      }))}
                                      onChange={handleProjectChange}
                                      value={selectedProject}
                                      placeholder="Select Project"
                                    /> */}
                                    {/* <SingleSelector
                                      options={projects}
                                      value={selectedProject}
                                      onChange={(selectedOption) =>
                                        setSelectedProject(selectedOption)
                                      }
                                      placeholder="Select Project"
                                    /> */}
                                    {/* <SingleSelector
                                      options={projects}
                                      value={selectedProject}
                                      onChange={handleProjectChange}
                                      placeholder="Select Project"
                                    /> */}
                                      <label>
                      Company <span></span>
                    </label>
                    <SingleSelector
                      options={companyOptions} // company options as {value,label}
                      value={selectedCompany} // the selected option object
                      onChange={handleCompanyChange}
                      placeholder="Select Company"
                    />
                                  </div>
                                </div>
                                {/* <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Sub-Project</label>
                                    <SingleSelector
                                      options={siteOptions}
                                      value={selectedSite}
                                      onChange={handleSiteChange}
                                      placeholder="Select Sub-project"
                                      // isDisabled={!selectedProject}
                                    />
                                  </div>
                                </div> */}
                                {/* <div className="col-md-4">
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
                                </div> */}

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
                                  <div className="col-md-4 mt-2">
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
                                              <td
                                                style={{
                                                  textAlign: "left",
                                                  border: "none",
                                                }}
                                              >
                                                <button
                                                  className="btn btn-link p-0 me-2"
                                          onClick={() =>
                                                    handleMORCollapseToggle(
                                                      mor.mor_id
                                                    )
                                                  }
                                                  // aria-label="Toggle MOR visibility"'
                                                >
                                                  {collapsedMORs[
                                                    `mor-${mor.mor_id}`
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
                                                {mor.mor_number}
                                      </td>
                                            </td>
                                            <td>
                                              {/* {mor.mor_inventories.reduce(
                                                (sum, inv) =>
                                                  sum +
                                                  (inv.required_quantity || 0),
                                                0
                                              )} */}
                                                {mor.mor_inventories.reduce((sum, inv) => {
            // Use pending_qty from API if available, otherwise calculate
            const pendingQty = inv.pending_qty !== null && inv.pending_qty !== undefined 
              ? parseFloat(inv.pending_qty)
              : (parseFloat(inv.required_quantity || 0) - parseFloat(inv.prev_order_qty || 0));
            return sum + pendingQty;
          }, 0).toFixed(2)}
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
  {(remainingQuantities[inventory.id] !== undefined 
    ? parseFloat(remainingQuantities[inventory.id])
    : (inventory.pending_qty !== null && inventory.pending_qty !== undefined
      ? parseFloat(inventory.pending_qty)
      : (parseFloat(inventory.required_quantity || 0) - parseFloat(inventory.prev_order_qty || 0))
    )).toFixed(2)}
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
    value={orderedQuantities[`${poItem.purchase_order_id}-${poItem.mor_inventory_id}`] || ""}
    onChange={(e) => handleOrderedQuantityChange(
      poItem.purchase_order_id,
      poItem.mor_inventory_id,
      e.target.value
    )}
    min="0"
    max={remainingQuantities[poItem.mor_inventory_id] || 
      (poItem.pending_qty !== null && poItem.pending_qty !== undefined
        ? parseFloat(poItem.pending_qty)
        : (parseFloat(poItem.required_quantity || 0) - parseFloat(poItem.prev_order_qty || 0)))}
    placeholder="Enter qty"
    style={{ width: "80px" }}
  />
</td>
                                                          <td>
                                                            {poItem.uom_name ||
                                                              "N/A"}
                                                          </td>
                                        <td />
                                                          <td>
          {poItem.rate_per_nos ? `₹${poItem.rate_per_nos}` : '-'}
        </td>
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
                                  onClick={() => setAddMORModal(true)}
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
 <div className="row mt-4 justify-content-end align-items-center ms-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                      Status
                    </label>
                    <SingleSelector
                      options={[{ value: "draft", label: "Draft" }]}
                      value={{ value: "draft", label: "Draft" }}
                      placeholder="Select Status"
                      isClearable={false}
                      isDisabled={true}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
                          <div className="row mt-2 justify-content-end">
                           
                            <div className="col-md-2 mt-2">
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

        {/* Add MOR Modal */}
        <Modal show={addMORModal} onHide={closeAddMORModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Add MOR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-3">
              <div className="row">
                
                <div className="col-md-4 mt-2">
                  <div className="form-group">
                    <label>
                      Project <span></span>
                    </label>
                    <MultiSelector
                      options={projects} // filtered projects as {value,label}
                      value={selectedProject}
                      onChange={handleProjectChange}
                      placeholder="Select Project"
                      // isDisabled={!selectedCompany}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sub-project</label>
                    <MultiSelector
                      options={siteOptions}
                      value={selectedSite}
                      onChange={handleSiteChange}
                      placeholder="Select Sub-project"
                      isDisabled={!selectedProject}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-0">
                  <div className="form-group">
                    <label>MOR No.</label>
                    <SingleSelector
                      options={morOptions}
                      value={morOptions.find(
                        (opt) => opt.value === morFormData.morNumber
                      )}
                      placeholder="Select MOR No."
                      onChange={(selectedOption) =>
                        setMorFormData((prev) => ({
                          ...prev,
                          morNumber: selectedOption?.value || "",
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="col-md-4 mt-2">
                  <div className="form-group">
                    <label>MOR Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={morFormData.morStartDate}
                      onChange={(e) =>
                        setMorFormData((prev) => ({
                          ...prev,
                          morStartDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="form-group">
                    <label>MOR End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={morFormData.morEndDate}
                      onChange={(e) =>
                        setMorFormData((prev) => ({
                          ...prev,
                          morEndDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Material Type <span></span>
                    </label>
                    <SingleSelector
                      options={inventoryTypes2}
                      value={inventoryTypes2.find(
                        (option) => option.value === morFormData.materialType
                      )}
                      placeholder="Select Material Type"
                      onChange={(selectedOption) =>
                        handleMorSelectorChange("materialType", selectedOption)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-3">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Material Sub Type <span></span>
                    </label>
                    <SingleSelector
                      options={inventorySubTypes2}
                      value={inventorySubTypes2.find(
                        (option) => option.value === morFormData.materialSubType
                      )}
                      placeholder="Select Material Sub Type"
                      onChange={(selectedOption) =>
                        handleMorSelectorChange(
                          "materialSubType",
                          selectedOption
                        )
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-3">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Material <span></span>
                    </label>
                    <SingleSelector
                      options={inventoryMaterialTypes2}
                      value={inventoryMaterialTypes2.find(
                        (option) => option.value === morFormData.material
                      )}
                      placeholder="Select Material"
                      onChange={(selectedOption) =>
                        handleMorSelectorChange("material", selectedOption)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-1 justify-content-center d-flex gap-2">
                <button className="purple-btn1" onClick={handleMorSearch}>
                  Search
                </button>
                <button className="purple-btn1" onClick={handleMorReset}>
                  Reset
                </button>
              </div>
              
              {/* Show current filters from main form */}
              {/* {(selectedProject || selectedSite) && (
                <div className="alert alert-info mt-2">
                  <strong>Active Filters from Main Form:</strong>
                  {selectedProject && (
                    <span className="ms-2">Project: {selectedProject.label}</span>
                  )}
                  {selectedSite && (
                    <span className="ms-2">Sub-Project: {selectedSite.label}</span>
                  )}
                </div>
              )} */}

              <div className="tbl-container me-2 mt-3">
                {loadingMaterialDetails ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th rowSpan="2">
                          <input
                            type="checkbox"
                            checked={
                              selectedMaterialItems.length ===
                                materialDetailsData.length &&
                              materialDetailsData.length > 0
                            }
                            onChange={handleMorSelectAllMaterials}
                          />
                        </th>
                        <th rowSpan="2">Project SubProject</th>
                        <th rowSpan="2">MOR Number</th>
                        <th rowSpan="2">MOR Date</th>
                        <th colSpan="8">Material Details</th>
                      </tr>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th>Material</th>
                        <th>UOM</th>
                        <th>Required Qty</th>
                        <th>Prev Order Qty</th>
                        <th>Order Qty</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {materialDetailsData.length > 0 ? (
                        materialDetailsData.map((item, index) => (
                          <tr
                            key={`${item.mor_id}-${item.inventory_id}-${index}`}
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedMaterialItems.includes(index)}
                                onChange={() =>
                                  handleMorMaterialCheckboxChange(index)
                                }
                              />
                            </td>
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.project_name && item.sub_project_name
                                  ? `${item.project_name} - ${item.sub_project_name}`
                                  : item.project_name ||
                                    item.sub_project_name ||
                                    ""}
                              </td>
                            ) : null}
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.mor_number || ""}
                              </td>
                            ) : null}
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.mor_date || ""}
                              </td>
                            ) : null} */}
                      {materialDetailsData.length > 0 ? (
                        materialDetailsData.map((item, index) => (
                          <tr
                            key={`${item.mor_id}-${item.inventory_id}-${index}`}
                          >
                            {/* Left-most checkbox: render only for first row of the project block */}
                            <td>
                              {/* {item.isFirstMaterial ? (
            <input
              type="checkbox"
              checked={selectedMaterialItems.length === materialDetailsData.length}
              onChange={handleMorSelectAllMaterials}
            />
          ) : null} */}
                              {item.isFirstMaterial ? (
                                <input
                                  type="checkbox"
                                  // checked={
                                  //   materialDetailsData
                                  //     .filter(m => m.mor_id === item.mor_id)
                                  //     .every((m, idx) => selectedMaterialItems.includes(materialDetailsData.indexOf(m)))
                                  // }
                                  // onChange={(e) => handleMorSelectProject(e, item.mor_id)}
                                  checked={materialDetailsData
                                    .filter((m) => m.mor_id === item.mor_id)
                                    .every((m) =>
                                      selectedMaterialItems.includes(
                                        materialDetailsData.indexOf(m)
                                      )
                                    )}
                                     onChange={(e) => handleMorSelectProject(e, item.mor_id)}
                                />
                              ) : null}
                            </td>

                            {/* Project/Subproject cell (merged rows) */}
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.project_name && item.sub_project_name
                                  ? `${item.project_name} - ${item.sub_project_name}`
                                  : item.project_name ||
                                    item.sub_project_name ||
                                    ""}
                              </td>
                            ) : null}

                            {/* MOR Number (merged rows) */}
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.mor_number || ""}
                              </td>
                            ) : null}

                            {/* MOR Date (merged rows) */}
                            {item.isFirstMaterial ? (
                              <td rowSpan={item.rowspan}>
                                {item.mor_date || ""}
                              </td>
                            ) : null}

                            {/* Per-material checkbox */}
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedMaterialItems.includes(index)}
                                onChange={() =>
                                  handleMorMaterialCheckboxChange(index)
                                }
                              />
                            </td>
                            <td>{item.material_name || ""}</td>
                            <td>{item.uom_name || ""}</td>
                            <td>{item.required_quantity || ""}</td>
                            <td>{item.prev_order_qty || ""}</td>
                            <td>{item.order_qty || ""}</td>
                            <td>{item.inventory_status || ""}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-3 text-center">
                <button
                  className="purple-btn2"
                  onClick={handleAcceptSelectedMaterials}
                  disabled={selectedMaterialItems.length === 0}
                >
                  Accept Selected ({selectedMaterialItems.length} materials)
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Add PO Modal */}
        <Modal show={addPOModal} onHide={() => setAddPOModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Purchase Orders</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12">
                <div className="alert alert-info">
                  <strong>Selected Items:</strong> {poSelectedRowKeys.length}
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Company</label>
                    <SingleSelector
                      options={poModalCompanies}
                      value={poModalSelectedCompany}
                      onChange={handlePoModalCompanyChange}
                      placeholder="Select Company"
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Project</label>
                    <SingleSelector
                      options={poModalProjects}
                      value={poModalSelectedProject}
                      onChange={handlePoModalProjectChange}
                      placeholder="Select Project"
                      isDisabled={!poModalSelectedCompany}
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Sub-Project</label>
                    <SingleSelector
                      options={poModalSites}
                      value={poModalSelectedSite}
                      onChange={handlePoModalSiteChange}
                      placeholder="Select Sub-Project"
                      isDisabled={!poModalSelectedProject}
                    />
                  </div>
                </div>
                {/* Material filters row */}
                <div className="row mb-3 mt-2">
                  <div className="col-md-4">
                    <label>Material Type</label>
                    <SingleSelector
                      options={poInventoryTypes}
                      value={poSelectedInventoryType}
                      onChange={(opt) => {
                        setPoSelectedInventoryType(opt);
                        setPoSelectedSubType(null);
                        setPoSelectedMaterial(null);
                      }}
                      placeholder="Select Material Type"
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Material Sub Type</label>
                    <SingleSelector
                      options={poInventorySubTypes}
                      value={poSelectedSubType}
                      onChange={(opt) => setPoSelectedSubType(opt)}
                      placeholder="Select Material Sub Type"
                      isDisabled={!poSelectedInventoryType}
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Material</label>
                    <SingleSelector
                      options={poInventoryMaterials}
                      value={poSelectedMaterial}
                      onChange={(opt) => setPoSelectedMaterial(opt)}
                      placeholder="Select Material"
                      isDisabled={!poSelectedInventoryType}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={poFilterParams.startDate}
                      onChange={(e) =>
                        setPoFilterParams((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label>To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={poFilterParams.endDate}
                      onChange={(e) =>
                        setPoFilterParams((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label>PO Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter PO Number"
                      value={poFilterParams.poNumber}
                      onChange={(e) =>
                        setPoFilterParams((prev) => ({
                          ...prev,
                          poNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center ">
                  <button className="purple-btn1" onClick={handlePoModalSearch}>
                    Search
                  </button>
                  <button className="purple-btn1" onClick={handlePoModalReset}>
                    Reset
                  </button>
                </div>

                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              poSelectedRowKeys.length ===
                                poModalApiData.length &&
                              poModalApiData.length > 0
                            }
                            onChange={(e) =>
                              handlePoModalSelectAll(e.target.checked)
                            }
                          />
                        </th>
                        <th>Material</th>
                        <th>PO Number</th>
                        <th>PO Date</th>
                        <th>Supplier</th>
                        <th>UOM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poModalApiData.length > 0 ? (
                        poModalApiData.map((item) => (
                          <tr
                            key={`${item.mor_inventory_id}-${item.po_mor_inventory_id}`}
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={poSelectedRowKeys.includes(
                                  `${item.mor_inventory_id}-${item.po_mor_inventory_id}`
                                )}
                                onChange={(e) =>
                                  handlePoModalCheckboxChange(
                                    `${item.mor_inventory_id}-${item.po_mor_inventory_id}`,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>{item.material_name || "N/A"}</td>
                            <td>{item.po_number || "N/A"}</td>
                            <td>
                              {item.po_date
                                ? new Date(item.po_date)
                                    .toLocaleDateString("en-GB")
                                    .split("/")
                                    .join("-")
                                : "N/A"}
                            </td>
                            <td>{item.supplier_organization_name || "N/A"}</td>
                            <td>{item.uom_name || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="purple-btn1"
              onClick={() => setAddPOModal(false)}
            >
              Close
            </button>
            <button className="purple-btn1" onClick={handlePoModalSubmit}>
              Accept Selected ({poSelectedRowKeys.length})
            </button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default RopoMappingCreate;
