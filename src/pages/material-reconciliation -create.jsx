import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Add this import at the top'
import { ShowIcon } from "../components";

const MaterialReconciliationCreate = () => {
  const navigate = useNavigate(); // Add this hook

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  // const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  // const [wingsOptions, setWingsOptions] = useState([]);
  const [morInventories, setMorInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInventories, setSelectedInventories] = useState([]);
  const [acceptedInventories, setAcceptedInventories] = useState([]); // New state for accepted inventories
  const [addMaterialModal, setAddMaterialModal] = useState(false); // State to control modal visibility
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  // const [siteOptions, setSiteOptions] = useState([]);
  const [wingsOptions, setWingsOptions] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);

  const [selectAll, setSelectAll] = useState(false);
  // Add these states at the top with other useState hooks
  const [batchList, setBatchList] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchIssueQty, setBatchIssueQty] = useState({});
  const [batchQtyError, setBatchQtyError] = useState("");
  const [batchMaxQty, setBatchMaxQty] = useState(0);

  // Add state for dynamic reasons
  const [reasonOptions, setReasonOptions] = useState([]);

  // Fetch reasons from API on mount
  useEffect(() => {
    axios
      .get(
        `https://marathon.lockated.com//material_reconciliation_reasons/fetch_reasons.json?token=${token}`
      )
      .then((response) => {
        const options = response.data.map((reason) => ({
          value: reason.id,
          label: reason.name,
        }));
        setReasonOptions(options);
      })
      .catch((error) => {
        setReasonOptions([]);
        console.error("Error fetching reasons:", error);
      });
  }, [token]);

  // Add this function to handle select-all checkbox
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      // Select all visible inventories
      const allVisibleIds = morInventories.map((inventory) => inventory);
      setSelectedInventories((prev) => {
        // Combine existing selections with new ones, avoiding duplicates
        const combined = [...prev, ...allVisibleIds];
        return combined.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
      });
    } else {
      // Deselect only visible inventories
      const visibleIds = morInventories.map((inventory) => inventory.id);
      setSelectedInventories((prev) =>
        prev.filter((item) => !visibleIds.includes(item.id))
      );
    }
  };

  const openBatchPopup = (inventoryId) => {
    setSelectedInventoryId(inventoryId);
    setShowBatchModal(true);

    // Find the selected inventory
    const inv = acceptedInventories.find((inv) => inv.id === inventoryId);
    if (inv) {
      const maxQty =
        (parseFloat(inv.deadstock_qty) || 0) +
        (parseFloat(inv.theft_or_missing_qty) || 0) +
        (parseFloat(inv.damage_qty) || 0);
      setBatchMaxQty(maxQty);
    } else {
      setBatchMaxQty(0);
    }
    setBatchIssueQty({}); // Reset on open
    setBatchQtyError("");
  };

  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });

  // Function to close the modal
  const closeAddMaterialModal = () => {
    setAddMaterialModal(false);
  };

  // Optional: Function to open the modal
  const openAddMaterialModal = () => {
    if (!selectedStore) {
      alert("Please select a store before adding material.");
      return;
    }
    setAddMaterialModal(true);
  };

  const handleReset = () => {
    setSelectAll(false);
    // Reset all filters and selections
    setSelectedInventory(null);
    setSelectedSubType(null);
    setSelectedInventoryMaterialTypes(null);
    setSelectedGenericSpec(null);
    setSelectedColor(null);
    setSelectedBrand(null);
    setSelectedUom(null);

    // Clear the MOR inventories
    setMorInventories([]);

    // Reset pagination
    setPagination({
      current_page: 1,
      next_page: null,
      prev_page: null,
      total_pages: 1,
      total_count: 0,
    });

    // Refetch initial data for the table
    fetchAllMorInventories(1, {}); // Fetch data for the first page with no filters

    console.log("Filters and selections have been reset.");
  };
  const [pagination, setPagination] = useState({
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 0,
  });
  const [pageSize, setPageSize] = useState(5); // Set default page size to 5
  const [formData, setFormData] = useState({
    pms_project_id: null,
    pms_site_id: null,
    pms_store_id: null,
    pms_company_setup_id: null,
    created_by_id: 2, // Assuming this is a fixed value
    reco_date: new Date().toISOString().split("T")[0],
    remarks: "",
    material_reconciliation_items_attributes: [],
  });

  // Fetch company data on component mount
  useEffect(() => {
    axios
      .get(
        `https://marathon.lockated.com/pms/company_setups.json?token=${token}`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedWing(null);
    setSelectedStore(null);

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );

      // Set projects for the selected company
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }))
      );

      // Create filters object with company ID
      const filters = {
        company_id: selectedOption.value,
      };

      // Fetch inventories with company filter
      fetchAllMorInventories(1, filters);
    } else {
      // If no company is selected, fetch all inventories
      fetchAllMorInventories(1, {});
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);
    setSelectedWing(null);
    setSelectedStore(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );

      // Create filters object with company and project IDs
      const filters = {
        company_id: selectedCompany.value,
        project_id: selectedOption.value,
      };

      // Fetch inventories with company and project filters
      fetchAllMorInventories(1, filters);
    } else {
      // If no project is selected, fetch with only company filter
      const filters = {
        company_id: selectedCompany.value,
      };
      fetchAllMorInventories(1, filters);
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null);
    setSelectedStore(null);
    setWingsOptions([]);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData.projects.find(
        (project) => project.id === selectedProject.value
      );
      const selectedSiteData = selectedProjectData?.pms_sites.find(
        (site) => site.id === selectedOption.value
      );

      setWingsOptions(
        selectedSiteData?.pms_wings.map((wing) => ({
          value: wing.id,
          label: wing.name,
        })) || []
      );

      // Create filters object with company, project, and site IDs
      const filters = {
        company_id: selectedCompany.value,
        project_id: selectedProject.value,
        site_id: selectedOption.value,
      };

      // Fetch inventories with company, project, and site filters
      fetchAllMorInventories(1, filters);
    } else {
      // If no site is selected, fetch with company and project filters
      const filters = {
        company_id: selectedCompany.value,
        project_id: selectedProject.value,
      };
      fetchAllMorInventories(1, filters);
    }
  };

  // Handle wing selection
  const handleWingChange = (selectedOption) => {
    setSelectedWing(selectedOption);
    setSelectedStore(null);

    if (selectedOption) {
      // Create filters object with company, project, site, and wing IDs
      const filters = {
        company_id: selectedCompany.value,
        project_id: selectedProject.value,
        site_id: selectedSite.value,
        wing_id: selectedOption.value,
      };

      // Fetch inventories with all filters
      fetchAllMorInventories(1, filters);
    } else {
      // If no wing is selected, fetch with company, project, and site filters
      const filters = {
        company_id: selectedCompany.value,
        project_id: selectedProject.value,
        site_id: selectedSite.value,
      };
      fetchAllMorInventories(1, filters);
    }
  };

  // Map companies to options for the dropdown
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));
  // Handle wing selection

  // material type options
  const [inventoryTypes, setInventoryTypes] = useState([]); // State to hold the fetched data
  const [selectedInventory, setSelectedInventory] = useState(null); // State to hold selected inventory type
  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubType, setSelectedSubType] = useState(null); // State to hold selected sub-type
  const [inventoryMaterialTypes, setInventoryMaterialTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedInventoryMaterialTypes, setSelectedInventoryMaterialTypes] =
    useState(null); // State to hold selected sub-type
  const [genericSpecifications, setGenericSpecifications] = useState([]); // State for generic specifications
  const [selectedGenericSpec, setSelectedGenericSpec] = useState(null); // State for selected generic specification
  const [colors, setColors] = useState([]); // State for colors
  const [selectedColor, setSelectedColor] = useState(null); // State for selected color
  const [brands, setBrands] = useState([]); // State for brands
  const [selectedBrand, setSelectedBrand] = useState(null); // State for selected brand
  const [uoms, setUoms] = useState([]); // State for UOMs
  const [selectedUom, setSelectedUom] = useState(null); // State for selected UOM

  // Define status options
  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
  ];

  // Fetching inventory types data from API on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      console.error("No token found in URL");
      return;
    }

    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        // Check if response.data is an array or has a data property
        const inventoryData = Array.isArray(response.data)
          ? response.data
          : response.data.inventory_types || [];

        // Map the fetched data to the format required by react-select
        const options = inventoryData.map((inventory) => ({
          value: inventory.id,
          label: inventory.name,
        }));
        setInventoryTypes(options); // Set the inventory types to state
      })
      .catch((error) => {
        console.error("Error fetching inventory types:", error);
        setInventoryTypes([]); // Set empty array in case of error
      });
  }, []);

  // Fetch inventory sub-types when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(","); // Get the selected inventory type IDs as a comma-separated list

      axios
        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=${token}`
        )
        .then((response) => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventorySubTypes(options); // Set the fetched sub-types to state
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
        });
    }
  }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes

  // Handler for inventory type selection change
  const handleInventoryChange = (selectedOption) => {
    setSelectedInventory(selectedOption);
    setSelectedSubType(null); // Clear the selected sub-type when inventory type changes
    setInventorySubTypes([]); // Reset the sub-types list
    setInventoryMaterialTypes([]);
    setSelectedInventoryMaterialTypes(null);
  };

  // Handler for inventory sub-type selection change
  const handleSubTypeChange = (selectedOption) => {
    setSelectedSubType(selectedOption); // Set the selected inventory sub-type
  };

  // Fetch UOMs on component mount
  useEffect(() => {
    axios
      .get(`${baseURL}unit_of_measures.json?token=${token}`)
      .then((response) => {
        const options = response.data.map((uom) => ({
          value: uom.id,
          label: uom.name,
        }));
        setUoms(options);
      })
      .catch((error) => {
        console.error("Error fetching UOMs:", error);
      });
  }, []);

  // Fetch inventory Material when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(","); // Get the selected inventory type IDs as a comma-separated list

      axios
        .get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[material_category_eq]=material&token=${token}`
        )
        .then((response) => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventoryMaterialTypes(options); // Set the fetched sub-types to state
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
        });
    }
  }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes

  // Handler for UOM selection
  const handleUomChange = (selectedOption) => {
    setSelectedUom(selectedOption);
  };

  // Fetch generic specifications, colors and brands when material is selected
  useEffect(() => {
    if (selectedInventoryMaterialTypes) {
      const materialIds = selectedInventoryMaterialTypes
        .map((item) => item.value)
        .join(",");

      // Fetch generic specifications
      axios
        .get(
          `${baseURL}pms/generic_infos.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((spec) => ({
            value: spec.id,
            label: spec.generic_info,
          }));
          setGenericSpecifications(options);
        })
        .catch((error) => {
          console.error("Error fetching generic specifications:", error);
        });

      // Fetch colors
      axios
        .get(
          `${baseURL}pms/colours.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((color) => ({
            value: color.id,
            label: color.colour,
          }));
          setColors(options);
        })
        .catch((error) => {
          console.error("Error fetching colors:", error);
        });

      // Fetch brands
      axios
        .get(
          `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((brand) => ({
            value: brand.id,
            label: brand.brand_name,
          }));
          setBrands(options);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    }
  }, [selectedInventoryMaterialTypes]);

  // Handler for inventory Material selection change
  const handleInventoryMaterialTypeChange = (selectedOption) => {
    setSelectedInventoryMaterialTypes(selectedOption); // Set the selected inventory sub-type
    setSelectedGenericSpec(null); // Reset selected generic specification
    setSelectedColor(null); // Reset selected color
    setSelectedBrand(null); // Reset selected brand
  };

  // Handler for generic specification selection
  const handleGenericSpecChange = (selectedOption) => {
    setSelectedGenericSpec(selectedOption);
  };

  // Handler for color selection
  const handleColorChange = (selectedOption) => {
    setSelectedColor(selectedOption);
  };

  // Handler for brand selection
  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
  };

  // Function to get page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(
      1,
      pagination.current_page - Math.floor(maxPagesToShow / 2)
    );
    let endPage = Math.min(
      pagination.total_pages,
      startPage + maxPagesToShow - 1
    );

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Helper to build filters
  const buildFilters = () => {
    const filters = {};
    if (selectedCompany?.value) filters.company_id = selectedCompany.value;
    if (selectedProject?.value) filters.project_id = selectedProject.value;
    if (selectedSite?.value) filters.site_id = selectedSite.value;
    if (selectedWing?.value) filters.wing_id = selectedWing.value;
    return filters;
  };

  // Fetch all MOR inventories on component mount
  useEffect(() => {
    if (selectedStore) {
      fetchAllMorInventories(1, buildFilters());
    }
  }, [selectedStore]);

  const fetchAllMorInventories = async (
    page = 1,
    filters = {},
    pageSizeOverride = pageSize
  ) => {
    setLoading(true);
    try {
      // Only proceed if a store is selected
      // if (!selectedStore) {
      //   alert("Please select a store before fetching inventories.");
      //   setLoading(false);
      //   return;
      // }
      let url = `${baseURL}pms/stores/fetch_store_inventories.json?page=${page}&per_page=${pageSizeOverride}&store_id=${selectedStore.value}`;

      // Add all filters
      if (filters.company_id) {
        url += `&q[material_order_request_company_id_in]=${filters.company_id}`;
      }
      if (filters.project_id) {
        url += `&q[material_order_request_project_id_in]=${filters.project_id}`;
      }
      if (filters.site_id) {
        url += `&q[material_order_request_pms_site_id_in]=${filters.site_id}`;
      }
      if (filters.wing_id) {
        url += `&q[material_order_request_wing_id_in]=${filters.wing_id}`;
      }
      if (filters.material_id) {
        url += `&q[pms_inventory_id_eq]=${filters.material_id}`;
      }
      if (filters.material_type_id) {
        url += `&q[material_sub_type_pms_inventory_type_id_eq]=${filters.material_type_id}`;
      }
      if (filters.material_sub_type_id) {
        url += `&q[pms_inventory_sub_type_id_eq]=${filters.material_sub_type_id}`;
      }
      if (filters.generic_specification_id) {
        url += `&q[pms_generic_info_id_eq]=${filters.generic_specification_id}`;
      }
      if (filters.colour_id) {
        url += `&q[pms_colour_id_eq]=${filters.colour_id}`;
      }
      if (filters.brand_id) {
        url += `&q[pms_brand_id_eq]=${filters.brand_id}`;
      }
      if (filters.uom_id) {
        url += `&q[unit_of_measure_id_eq]=${filters.uom_id}`;
      }

      console.log("Fetching URL:", url);
      const response = await axios.get(url);
      setMorInventories(response.data.inventories);
      setPagination({
        current_page: response.data.pagination.current_page,
        next_page: response.data.pagination.next_page,
        prev_page: response.data.pagination.prev_page,
        total_pages: response.data.pagination.total_pages,
        total_count: response.data.pagination.total_count,
      });
    } catch (error) {
      console.error("Error fetching MOR inventories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle page size change
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10); // Get the new page size
    setPageSize(newPageSize); // Update the page size state
    setPagination((prev) => ({
      ...prev,
      current_page: 1, // Reset to the first page
    }));
    fetchAllMorInventories(1, {}, newPageSize); // Fetch data for the first page with the new page size
  };

  // Handler for Go button click
  const handleGoClick = () => {
    // Create filters object with selected values
    const filters = {};

    // Add company, project, site, wing, and store filters
    if (selectedCompany?.value) {
      filters.company_id = selectedCompany.value;
    }
    if (selectedProject?.value) {
      filters.project_id = selectedProject.value;
    }
    if (selectedSite?.value) {
      filters.site_id = selectedSite.value;
    }
    if (selectedWing?.value) {
      filters.wing_id = selectedWing.value;
    }
    if (selectedStore?.value) {
      filters.store_id = selectedStore.value;
    }

    // Add material related filters
    if (selectedInventory?.map((item) => item.value).length > 0) {
      filters.material_type_id = selectedInventory
        .map((item) => item.value)
        .join(",");
    }
    if (selectedSubType?.map((item) => item.value).length > 0) {
      filters.material_sub_type_id = selectedSubType
        .map((item) => item.value)
        .join(",");
    }
    if (selectedInventoryMaterialTypes?.map((item) => item.value).length > 0) {
      filters.material_id = selectedInventoryMaterialTypes
        .map((item) => item.value)
        .join(",");
    }
    if (selectedBrand?.value) {
      filters.brand_id = selectedBrand.value;
    }
    if (selectedUom?.value) {
      filters.uom_id = selectedUom.value;
    }
    if (selectedGenericSpec?.value) {
      filters.generic_specification_id = selectedGenericSpec.value;
    }
    if (selectedColor?.value) {
      filters.colour_id = selectedColor.value;
    }

    console.log("Filters:", filters);
    fetchAllMorInventories(1, filters); // Reset to first page with filters
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setSelectAll(false);
    // Create filters object with selected values
    const filters = {};

    // Add company, project, site, wing, and store filters
    if (selectedCompany?.value) {
      filters.company_id = selectedCompany.value;
    }
    if (selectedProject?.value) {
      filters.project_id = selectedProject.value;
    }
    if (selectedSite?.value) {
      filters.site_id = selectedSite.value;
    }
    if (selectedWing?.value) {
      filters.wing_id = selectedWing.value;
    }
    if (selectedStore?.value) {
      filters.store_id = selectedStore.value;
    }

    // Add material related filters
    if (selectedInventory?.map((item) => item.value).length > 0) {
      filters.material_type_id = selectedInventory
        .map((item) => item.value)
        .join(",");
    }
    if (selectedSubType?.map((item) => item.value).length > 0) {
      filters.material_sub_type_id = selectedSubType
        .map((item) => item.value)
        .join(",");
    }
    if (selectedInventoryMaterialTypes?.map((item) => item.value).length > 0) {
      filters.material_id = selectedInventoryMaterialTypes
        .map((item) => item.value)
        .join(",");
    }
    if (selectedBrand?.value) {
      filters.brand_id = selectedBrand.value;
    }
    if (selectedUom?.value) {
      filters.uom_id = selectedUom.value;
    }
    if (selectedGenericSpec?.value) {
      filters.generic_specification_id = selectedGenericSpec.value;
    }
    if (selectedColor?.value) {
      filters.colour_id = selectedColor.value;
    }

    console.log("Filters for page change:", filters);
    fetchAllMorInventories(page, filters);
  };

  // Function to handle inventory selection
  const handleInventorySelect = (inventory) => {
    setSelectedInventories((prev) => {
      // Check if inventory is already selected
      const isSelected = prev.some((item) => item.id === inventory.id);
      if (isSelected) {
        // Remove if already selected
        return prev.filter((item) => item.id !== inventory.id);
      } else {
        // Add if not selected
        return [...prev, inventory];
      }
    });
  };

  // Function to handle "Accept Selected" button click
  const handleAcceptSelected = () => {
    // Update accepted inventories with the selected ones
    setAcceptedInventories(selectedInventories);
    // Close the modal
    closeAddMaterialModal();
  };

  // Modify calculateNetQuantity function to include adjustment quantity
  const calculateNetQuantity = (
    stockAsOn,
    deadstockQty,
    theftQty,
    damageQty,
    adjustmentQty
  ) => {
    const stock = parseFloat(stockAsOn) || 0;
    const deadstock = parseFloat(deadstockQty) || 0;
    const theft = parseFloat(theftQty) || 0;
    const damage = parseFloat(damageQty) || 0;
    const adjustment = parseFloat(adjustmentQty) || 0;
    return stock - deadstock - theft - damage + adjustment;
  };

  // Modify handleItemInputChange function
  const handleItemInputChange = (inventoryId, field, value) => {
    setAcceptedInventories((prev) =>
      prev.map((inventory) => {
        if (inventory.id === inventoryId) {
          const updatedInventory = {
            ...inventory,
            [field]: value,
          };
          // If field is 'reason', store as reason_id
          if (field === "reason") {
            updatedInventory.reason_id = value; // value is the id
          }
          // Calculate net quantity when deadstock, theft, or adjustment quantity changes
          if (
            field === "deadstock_qty" ||
            field === "theft_or_missing_qty" ||
            field === "damage_qty" ||
            field === "adjustment_qty"
          ) {
            const newDeadstockQty =
              field === "deadstock_qty" ? value : inventory.deadstock_qty;
            const newTheftQty =
              field === "theft_or_missing_qty"
                ? value
                : inventory.theft_or_missing_qty;
            const newDamageQty =
              field === "damage_qty" ? value : inventory.damage_qty;
            const newAdjustmentQty =
              field === "adjustment_qty" ? value : inventory.adjustment_qty;

            updatedInventory.net_quantity = calculateNetQuantity(
              inventory.stock_as_on,
              newDeadstockQty,
              newTheftQty,
              newDamageQty,
              newAdjustmentQty
            );
          }
          return updatedInventory;
        }
        return inventory;
      })
    );
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare the payload
      const payload = {
        material_reconciliation: {
          pms_company_setup_id: selectedCompany?.value || null,
          pms_project_id: selectedProject?.value || null,
          pms_site_id: selectedSite?.value || null,
          pms_store_id: selectedStore?.value || null,
          pms_wing_id: selectedWing?.value || null,
          created_by_id: 2,
          reco_date: new Date().toISOString().split("T")[0],
          remarks: formData.remarks,
          status: "draft",
          // status: selectedStatus?.value || " ", // Get status from dropdown selection
          material_reconciliation_items_attributes: acceptedInventories.map(
            (inventory) => ({
              material_inventory_id: inventory.id,
              stock_as_on: inventory.stock_as_on || 0,
              rate: inventory.rate_weighted_average
                ? parseFloat(inventory.rate_weighted_average)
                : null,
              deadstock_qty: inventory.deadstock_qty
                ? parseFloat(inventory.deadstock_qty)
                : null,
              theft_or_missing_qty: inventory.theft_or_missing_qty
                ? parseFloat(inventory.theft_or_missing_qty)
                : null,
              damage_qty: inventory.damage_qty
                ? parseFloat(inventory.damage_qty)
                : null,
              adjustment_qty: inventory.adjustment_qty
                ? parseFloat(inventory.adjustment_qty)
                : null,
              adjustment_rate: inventory.adjustment_rate
                ? parseFloat(inventory.adjustment_rate)
                : null,
              adjustment_value: inventory.adjustment_value
                ? parseFloat(inventory.adjustment_value)
                : null,
              net_quantity: inventory.net_quantity
                ? parseFloat(inventory.net_quantity)
                : null,
              remarks: inventory.remarks || "",
              reason_id: inventory.reason_id || null,
              ...(inventory.mr_batches_attributes
                ? { mr_batches_attributes: inventory.mr_batches_attributes }
                : {}),
            })
          ),
        },
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(
        `${baseURL}material_reconciliations.json?token=${token}`,
        payload
      );

      console.log("Submission successful:", response.data);

      // Show success alert
      alert("Record created successfully!");
      navigate(`/material-reconciliation-list?token=${token}`);
    } catch (error) {
      console.error("Error submitting material reconciliation:", error);
      alert("Error creating record. Please try again.");
    }
  };

  // Function to handle form data changes
  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch store data on component mount
  useEffect(() => {
    if (selectedSite && selectedSite.value) {
      const fetchStoresBySite = async () => {
        try {
          const response = await axios.get(
            `${baseURL}pms/stores/store_dropdown.json?q[site_id_eq]=${selectedSite.value}&token=${token}`
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
    } else {
      setStores([]); // Clear stores if no site is selected
    }
  }, [selectedSite]);

  // Handle store selection
  const handleStoreChange = (selectedOption) => {
    setSelectedStore(selectedOption);
    fetchAllMorInventories(1, buildFilters());
  };

  // Function to handle inventory removal
  const handleRemoveInventory = (inventoryId) => {
    setAcceptedInventories((prev) =>
      prev.filter((inventory) => inventory.id !== inventoryId)
    );
  };

  useEffect(() => {
    setSelectAll(false);
  }, [pagination.current_page]);

  useEffect(() => {
    if (showBatchModal && selectedInventoryId && selectedStore?.value) {
      const fetchBatchList = async () => {
        setBatchLoading(true);
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/material_reconciliations/grn_batches.json?q[material_inventory_id_eq]=${selectedInventoryId}&q[pms_store_id_eq]=${selectedStore.value}&token=${token}`
          );
          // setBatchList(response.data || []);
          setBatchList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          setBatchList([]);
          console.error("Error fetching batch list:", error);
        } finally {
          setBatchLoading(false);
        }
      };
      fetchBatchList();
    } else {
      setBatchList([]);
    }
  }, [showBatchModal, selectedInventoryId, selectedStore]);

  // const handleBatchIssueQtyChange = (batchId, value) => {
  //   // Parse value as number, default to 0 if empty
  //   const newValue = parseFloat(value) || 0;
  //   // Calculate new total
  //   const newBatchIssueQty = { ...batchIssueQty, [batchId]: newValue };
  //   const total = Object.values(newBatchIssueQty).reduce(
  //     (sum, v) => sum + (parseFloat(v) || 0),
  //     0
  //   );

  //   if (total > batchMaxQty) {
  //     alert(`Total Issue QTY cannot exceed ${batchMaxQty}`);
  //     // Optionally: do not update state, or set the value to the max allowed
  //     return;
  //   } else {
  //     setBatchQtyError("");
  //     setBatchIssueQty(newBatchIssueQty);
  //   }
  // };
  // ...existing code...

  const handleBatchIssueQtyChange = (batchId, value) => {
    const newValue = parseFloat(value) || 0;

    // Find the batch to get available qty
    const batch = batchList.find((b) => b.id === batchId);
    const availableQty = parseFloat(batch?.current_stock_qty) || 0;

    // 1. Cannot enter more than available qty for this batch
    if (newValue > availableQty) {
      alert(
        `Issue QTY cannot exceed available qty (${availableQty}) for this batch.`
      );
      return;
    }

    // 2. Calculate total issue qty if this value is set
    const newBatchIssueQty = { ...batchIssueQty, [batchId]: newValue };
    const total = Object.entries(newBatchIssueQty).reduce(
      (sum, [id, qty]) => sum + (parseFloat(qty) || 0),
      0
    );

    // 3. Cannot exceed max allowed (deadstock+theft+damage)
    if (total > batchMaxQty) {
      alert(`Total Issue QTY cannot exceed ${batchMaxQty}`);
      return;
    }

    setBatchQtyError("");
    setBatchIssueQty(newBatchIssueQty);
  };

  // ...existing code...

  const handleBatchModalSubmit = () => {
    // Prepare batch data
    const batchData = Object.entries(batchIssueQty)
      .filter(([batchId, qty]) => qty && Number(qty) > 0)
      .map(([batchId, qty]) => ({
        grn_batch_id: batchId,
        grn_batch_qty: Number(qty),
      }));

    // Update the relevant inventory in acceptedInventories
    setAcceptedInventories((prev) =>
      prev.map((inv) =>
        inv.id === selectedInventoryId
          ? { ...inv, mr_batches_attributes: batchData }
          : inv
      )
    );

    setShowBatchModal(false);
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <div className="card card-default mt-5 p-2b-4" id="mor-material-slip">
            {/* <div className="card-body "> */}
            <div class="card-header3">
              <h3 class="card-title">Material Reconciliation</h3>
            </div>
            <div className="card-body ">
              {/* <h5 className="mt-4">Material Reconciliation</h5> */}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Company </label>
                    <SingleSelector
                      options={companyOptions}
                      onChange={handleCompanyChange}
                      value={selectedCompany}
                      placeholder={`Select Company`} // Dynamic placeholder
                    />
                  </div>
                  {/* /.form-group */}
                  {/* /.form-group */}
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Project </label>
                    <SingleSelector
                      options={projects}
                      onChange={handleProjectChange}
                      value={selectedProject}
                      placeholder={`Select Project`} // Dynamic placeholder
                    />
                  </div>
                  {/* /.form-group */}
                  {/* /.form-group */}
                </div>
                {/* /.col */}
                <div className="col-md-3">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Sub-Project </label>
                    <SingleSelector
                      options={siteOptions}
                      onChange={handleSiteChange}
                      value={selectedSite}
                      placeholder={`Select Sub-project`} // Dynamic placeholder
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Wings </label>
                    <SingleSelector
                      // options={siteOptions}
                      options={wingsOptions}
                      value={selectedWing}
                      onChange={handleWingChange}
                      placeholder={`Select Wing`} // Dynamic placeholder
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Store</label>
                    <SingleSelector
                      options={stores}
                      onChange={handleStoreChange}
                      value={selectedStore}
                      placeholder="Select Store"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
              </div>
              <div className=" d-flex justify-content-between align-items-end px-2">
                <h5 className=" mt-3">Material</h5>
                <button
                  className="purple-btn2 "
                  data-bs-toggle="modal"
                  data-bs-target="#add-Material"
                  onClick={openAddMaterialModal} // Call the function to open the modal
                >
                  <span className="material-symbols-outlined align-text-top">
                    add{" "}
                  </span>
                  <span className="">Add Material </span>
                </button>
              </div>
              <div className="tbl-container mx-2 mt-3">
                <table className="w-100" style={{ minWidth: "1800px" }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: "2px" }}>Sr.No.</th>
                      <th style={{ minWidth: "150px" }}>Material</th>
                      <th>UOM</th>
                      <th style={{ minWidth: "80px" }}>Stock As on</th>
                      <th>Rate (Weighted Average)(INR)</th>
                      {/* <th>Deadstock Qty</th>
                      <th>Theft / Missing Qty</th>
                      <th>Wastage Qty</th>
                      <th>Adjustment Quantity</th> */}
                      <th style={{ minWidth: "120px" }}>Deadstock Qty</th>
                      <th style={{ minWidth: "120px" }}>Theft / Missing Qty</th>
                      <th style={{ minWidth: "120px" }}>Damage Qty</th>
                      <th style={{ minWidth: "80px" }}>Batch</th>
                      <th style={{ minWidth: "150px" }}>Adjustment Quantity</th>
                      <th>Adjustment Rate(INR)</th>
                      <th>Adjustment Value(INR)</th>
                      <th style={{ minWidth: "120px" }}>Net Quantity</th>
                      <th style={{ minWidth: "100px" }}>Remarks</th>
                      <th style={{ minWidth: "200px" }}>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedInventories.map((inventory, index) => (
                      <tr key={inventory.id}>
                        <td>{index + 1}</td>
                        <td>{inventory.material}</td>
                        <td>{inventory.uom}</td>
                        <td>{inventory.stock_as_on || 0}</td>
                        <td>{inventory.rate_weighted_average}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.deadstock_qty || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "deadstock_qty",
                                e.target.value
                              )
                            }
                            placeholder="Enter Deadstock Qty"
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.theft_or_missing_qty || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "theft_or_missing_qty",
                                e.target.value
                              )
                            }
                            placeholder="Enter Theft/Missing Qty"
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.damage_qty || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "damage_qty",
                                e.target.value
                              )
                            }
                            placeholder="Enter Wastage Qty"
                            min="0"
                          />
                        </td>
                        <td>
                          {/* <span
                            className="boq-id-link mt-1"
                            style={{
                              display: "inline-block",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              openBatchPopup(inventory.id); // This should set showBatchModal to true and load batchList
                            }}
                          >
                            Select Batch
                          </span> */}
                          <td>
                            <ShowIcon
                              onClick={() => openBatchPopup(inventory.id)}
                              style={{
                                // cursor: "pointer",
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          </td>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.adjustment_qty || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "adjustment_qty",
                                e.target.value
                              )
                            }
                            placeholder="Enter Adjustment Qty"
                            style={{ display: "inline-block", width: "70%" }}
                          />
                          {/* {Number(inventory.adjustment_qty) < 0 && (
                            <span
                              className="boq-id-link mt-1"
                              style={{
                                display: "inline-block",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                openBatchPopup(inventory.id); // This should set showBatchModal to true and load batchList
                              }}
                            >
                              Select Batch
                            </span>
                          )} */}
                        </td>

                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.adjustment_rate || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "adjustment_rate",
                                e.target.value
                              )
                            }
                            disabled
                            // placeholder="Enter Adjustment Rate"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.adjustment_value || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "adjustment_value",
                                e.target.value
                              )
                            }
                            disabled
                            // placeholder="Enter Adjustment Value"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={
                              inventory.net_quantity || inventory.stock_as_on
                            }
                            readOnly
                            placeholder="Net Qty"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={inventory.remarks || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "remarks",
                                e.target.value
                              )
                            }
                            placeholder="Enter Remarks"
                          />
                        </td>
                        <td>
                          <SingleSelector
                            options={reasonOptions}
                            value={
                              reasonOptions.find(
                                (option) => option.value === inventory.reason_id
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleItemInputChange(
                                inventory.id,
                                "reason",
                                selectedOption ? selectedOption.value : null
                              )
                            }
                            placeholder="Select Reason"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleRemoveInventory(inventory.id)}
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
            </div>{" "}
          </div>

          <div className="row mx-1 mt-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Remark</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter ..."
                  value={formData.remarks}
                  onChange={(e) =>
                    handleFormDataChange("remarks", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
            <p className="">Status</p>
            <div className="dropdown">
              <button
                className="btn purple-btn2 btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                PO Draft
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="row mt-4 justify-content-end align-items-center mx-2">
            <div className="col-md-3">
              <div className="form-group d-flex gap-3 align-items-center mx-3">
                <label
                  className="form-label mt-2"
                  style={{ fontSize: "0.95rem", color: "black" }}
                >
                  Status
                </label>
                {/* <SingleSelector
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(selectedOption) => {
                    setSelectedStatus(
                      selectedOption || { value: "", label: "Select Status" }
                    );
                  }}
                  placeholder="Select Status"
                  isClearable={false}
                  classNamePrefix="react-select"
                /> */}
                <select name="status" class="form-control" disabled>
                  <option value="draft" selected>
                    Draft
                  </option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-end">
            <div className="col-md-2 mt-2">
              <button className="purple-btn2 w-100" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
          {/* <div className=" ">
            <h5 className=" ">Audit Log</h5>
          </div>
          <div className="tbl-container px-0">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Pratham Shastri</td>
                  <td>15-02-2024</td>
                  <td>Verified</td>
                  <td>
                    <i
                      className="fa-regular fa-eye"
                      data-bs-toggle="modal"
                      data-bs-target="#remark-modal"
                      style={{ fontSize: 18 }}
                    />
                  </td>
                  <td>
                    <i
                      className="fa-regular fa-eye"
                      data-bs-toggle="modal"
                      data-bs-target="#comments-modal"
                      style={{ fontSize: 18 }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
      <Modal
        centered
        size="lg"
        show={addMaterialModal} // Replace with the state controlling the modal visibility
        onHide={closeAddMaterialModal} // Replace with the function to close the modal
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Material Reconciliation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Material Type</label>
                <MultiSelector
                  options={inventoryTypes}
                  onChange={handleInventoryChange}
                  value={selectedInventory}
                  placeholder="Select Material Type"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Material Sub-Type</label>
                <MultiSelector
                  options={inventorySubTypes}
                  onChange={handleSubTypeChange}
                  value={selectedSubType}
                  placeholder="Select Material Sub-Type"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Material</label>
                <MultiSelector
                  options={inventoryMaterialTypes}
                  onChange={handleInventoryMaterialTypeChange}
                  value={selectedInventoryMaterialTypes}
                  placeholder="Select Material"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mt-2">
                <label>Generic Specification</label>
                <SingleSelector
                  options={genericSpecifications}
                  onChange={handleGenericSpecChange}
                  value={selectedGenericSpec}
                  placeholder="Select Gen Specification"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mt-2">
                <label>Colour</label>
                <SingleSelector
                  options={colors}
                  onChange={handleColorChange}
                  value={selectedColor}
                  placeholder="Select Colour"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mt-2">
                <label>Brand</label>
                <SingleSelector
                  options={brands}
                  onChange={handleBrandChange}
                  value={selectedBrand}
                  placeholder="Select Brand"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mt-2">
                <label>UOM</label>
                <SingleSelector
                  options={uoms}
                  onChange={handleUomChange}
                  value={selectedUom}
                  placeholder="Select UOM"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn2 w-100" onClick={handleGoClick}>
                Go
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn2 w-100" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
          {/* <div className="tbl-container mx-3 mt-3"> */}
          {/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
          {/* <div className=" mt-2"> */}
          {/* <div className=""> */}
          {/* <p>
                  Displaying page {pagination.current_page} of{" "}
                  {pagination.total_pages}
                </p> */}

          {/* <div className="d-flex align-items-center gap-2">
                <label className="mb-0">Show</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "80px" }}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">15</option>
                  <option value="50">20</option>
                </select>
                <span>entries</span>
              </div> */}
          {/* </div> */}

          <div
            className="tbl-container 
             "
            style={{ maxHeight: "400px" }}
          >
            <table
              className="w-100 
               "
            >
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th>Material Type</th>
                  <th>Material Sub-Type</th>
                  <th>Material</th>
                  <th>Generic Specification</th>
                  <th>Colour</th>
                  <th>Brand</th>
                  <th>Stock As On</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : morInventories.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  morInventories.map((inventory) => (
                    <tr
                      key={inventory.id}
                      // style={{ minHeight: "12px", height: "12px" }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedInventories.some(
                            (item) => item.id === inventory.id
                          )}
                          onChange={() => handleInventorySelect(inventory)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td>{inventory.material_type || "-"}</td>
                      <td>{inventory.material_sub_type || "-"}</td>
                      <td>{inventory.material || "-"}</td>
                      <td>{inventory.generic_specification || "-"}</td>
                      <td>{inventory.colour || "-"}</td>
                      <td>{inventory.brand || "-"}</td>
                      <td>{inventory.stock_as_on || "-"}</td>
                      <td>{inventory.uom || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 mt-1 mb-2">
            <ul className="pagination justify-content-center d-flex">
              {/* First Button */}
              <li
                className={`page-item ${
                  pagination.current_page === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  First
                </button>
              </li>

              {/* Previous Button */}
              <li
                className={`page-item ${
                  pagination.current_page === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Prev
                </button>
              </li>

              {/* Dynamic Page Numbers */}
              {getPageNumbers().map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pagination.current_page === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

              {/* Next Button */}
              <li
                className={`page-item ${
                  pagination.current_page === pagination.total_pages
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  Next
                </button>
              </li>

              {/* Last Button */}
              <li
                className={`page-item ${
                  pagination.current_page === pagination.total_pages
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.total_pages)}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  Last
                </button>
              </li>
            </ul>

            {/* Showing entries count */}
            <div>
              <p>
                Showing{" "}
                {Math.min(
                  (pagination.current_page - 1) * pageSize + 1 || 1,
                  pagination.total_count
                )}{" "}
                to{" "}
                {Math.min(
                  pagination.current_page * pageSize,
                  pagination.total_count
                )}{" "}
                of {pagination.total_count} entries
              </p>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}

          <div className="row mt-3 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100 mt-2"
                onClick={handleAcceptSelected}
              >
                Accept Selected
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeAddMaterialModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* issue material pop up modal*/}
      <Modal
        show={showBatchModal}
        onHide={() => setShowBatchModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Batch Deatails</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container">
            <table className="w-100">
              <thead>
                <tr>
                  {/* <th className="text-start">Sr. No.</th> */}
                  <th className="text-start">Batch No</th>
                  <th className="text-start">MOR No.</th>
                  <th className="text-start">GRN No</th>
                  <th className="text-start">GRN Creation Date</th>
                  <th className="text-start"> Available Qty</th>
                  <th className="text-start">Issue QTY</th>
                </tr>
              </thead>

              <tbody>
                {batchLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : batchList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No batch data found
                    </td>
                  </tr>
                ) : (
                  batchList.map((batch, idx) => (
                    <tr key={batch.id || idx}>
                      <td className="text-start">{idx + 1}</td>
                      {/* <td className="text-start">
                        {batch.batch_no || batch.id || "-"}
                      </td> */}
                      <td className="text-start">{batch.mor_number || "-"}</td>
                      <td className="text-start">{batch.grn_number || "-"}</td>
                      <td className="text-start">
                        {batch.created_at
                          ? new Date(batch.created_at).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>
                      <td className="text-start">
                        {batch.current_stock_qty ?? "-"}
                      </td>
                      <td className="text-start">
                        {/* <input
                          type="number"
                          className="form-control"
                          placeholder="Enter..."
                          min={0}
                          value={batchIssueQty[batch.id] || ""}
                          onChange={(e) =>
                            handleBatchIssueQtyChange(batch.id, e.target.value)
                          }
                        /> */}

                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter..."
                          min={0}
                          max={parseFloat(batch.current_stock_qty) || 0}
                          value={batchIssueQty[batch.id] || ""}
                          onChange={(e) =>
                            handleBatchIssueQtyChange(batch.id, e.target.value)
                          }
                          disabled={(() => {
                            // Sequential enabling logic
                            // Find the first batch index that is not filled (0 or empty)
                            const filledUpTo = batchList.findIndex(
                              (b) =>
                                !batchIssueQty[b.id] ||
                                parseFloat(batchIssueQty[b.id]) === 0
                            );
                            // If idx > filledUpTo, disable this input
                            if (filledUpTo !== -1 && idx > filledUpTo)
                              return true;

                            // Also, if total issued qty is already fulfilled, disable all except those already filled
                            const totalIssued = Object.values(
                              batchIssueQty
                            ).reduce(
                              (sum, qty) => sum + (parseFloat(qty) || 0),
                              0
                            );
                            if (
                              totalIssued >= batchMaxQty &&
                              !(parseFloat(batchIssueQty[batch.id]) > 0)
                            )
                              return true;

                            return false;
                          })()}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2 mt-2">
              <button
                className="purple-btn2 w-100"
                onClick={handleBatchModalSubmit}
              >
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button
                className="purple-btn1 w-100"
                onClick={() => setShowBatchModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
          {batchQtyError && (
            <div style={{ color: "red", fontSize: 13, marginTop: 8 }}>
              {batchQtyError}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MaterialReconciliationCreate;
