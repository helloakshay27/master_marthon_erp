import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom"; // Add this
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import at the top
import { ShowIcon } from "../components";
const MaterialReconciliationEdit = () => {
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const { id } = useParams();

  // Add this state to track select-all status
  const [selectAll, setSelectAll] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Add this state to track batch issue QTYs and the max allowed for the selected inventory
  const [batchIssueQty, setBatchIssueQty] = useState({});
  const [batchMaxQty, setBatchMaxQty] = useState(0);

  // Add state for dynamic reasons
  const [reasonOptions, setReasonOptions] = useState([]);
  const [batchQtyError, setBatchQtyError] = useState("");

  // Fetch reasons from API on mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}//material_reconciliation_reasons/fetch_reasons.json?token=${token}`
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

  // const openBatchPopup = (inventory) => {
  //   console.log("openBatchPopup inventory:", inventory);
  //   setSelectedInventoryId(inventory.material_inventory_id);
  //   setTimeout(() => setShowBatchModal(true), 0);

  //   // Find the selected inventory in formData.material_reconciliation_items_attributes
  //   const inv = formData.material_reconciliation_items_attributes.find(
  //     (item) => item.id === inventory.material_inventory_id
  //   );
  //   if (inv) {
  //     const maxQty =
  //       (parseFloat(inv.deadstock_qty) || 0) +
  //       (parseFloat(inv.theft_or_missing_qty) || 0) +
  //       (parseFloat(inv.damage_qty) || 0);
  //     setBatchMaxQty(maxQty);

  //     // If editing, prefill batchIssueQty from existing mr_batches_attributes
  //     if (inv.mr_batches_attributes) {
  //       const prefill = {};
  //       inv.mr_batches_attributes.forEach((batch) => {
  //         prefill[batch.grn_batch_id] = batch.grn_batch_qty;
  //       });
  //       setBatchIssueQty(prefill);
  //     } else {
  //       setBatchIssueQty({});
  //     }
  //   } else {
  //     setBatchMaxQty(0);
  //     setBatchIssueQty({});
  //   }
  // };

  const openBatchPopup = (inventory) => {
    console.log("openBatchPopup inventory:", inventory);
    setSelectedInventoryId(inventory.material_inventory_id);

    setTimeout(() => setShowBatchModal(true), 0);

    // Find the selected inventory in formData.material_reconciliation_items_attributes
    const inv = formData.material_reconciliation_items_attributes.find(
      (item) => item.material_inventory_id === inventory.material_inventory_id
    );
    if (inv) {
      const maxQty =
        (parseFloat(inv.deadstock_qty) || 0) +
        (parseFloat(inv.theft_or_missing_qty) || 0) +
        (parseFloat(inv.damage_qty) || 0);
      setBatchMaxQty(maxQty);

      // If editing, prefill batchIssueQty from existing batches
      if (inv.batches && inv.batches.length > 0) {
        const prefill = {};
        inv.batches.forEach((batch) => {
          prefill[batch.grn_batch_id] = batch.grn_batch_qty;
        });
        setBatchIssueQty(prefill);
      } else {
        setBatchIssueQty({});
      }
    } else {
      setBatchMaxQty(0);
      setBatchIssueQty({});
    }
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
    setAddMaterialModal(true);
  };

  const handleReset = () => {
    // Reset all filters and selections
    setSelectAll(false);
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
      .get(`${baseURL}/pms/company_setups.json?token=${token}`)
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection
    setSelectedWing(null); // Reset wing selection
    setProjects([]); // Reset projects list
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );

      if (selectedCompanyData) {
        const projectOptions = selectedCompanyData.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }));
        setProjects(projectOptions);
      }
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection
    setSelectedWing(null); // Reset wing selection
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected project from the list of projects of the selected company
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      if (selectedProjectData) {
        // Set site options based on selected project
        const siteOptions = selectedProjectData.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        }));
        setSiteOptions(siteOptions);
      }
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null); // Reset wing selection
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected project and site data
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedProject.value
      );
      const selectedSiteData = selectedProjectData?.pms_sites.find(
        (site) => site.id === selectedOption.value
      );

      if (selectedSiteData) {
        // Set wings options based on selected site
        const wingsOptions = selectedSiteData.pms_wings.map((wing) => ({
          value: wing.id,
          label: wing.name,
        }));
        setWingsOptions(wingsOptions);
      }
    }
  };

  // Handle wing selection
  const handleWingChange = (selectedOption) => {
    setSelectedWing(selectedOption);
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
    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        // Map the fetched data to the format required by react-select
        const options = response.data.map((inventory) => ({
          value: inventory.id,
          label: inventory.name,
        }));
        setInventoryTypes(options); // Set the inventory types to state
      })
      .catch((error) => {
        console.error("Error fetching inventory types:", error);
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
    setSelectedInventory(selectedOption); // Set the selected inventory type
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
            label: brand.name,
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

  // // Fetch all MOR inventories on component mount
  // useEffect(() => {
  //   fetchAllMorInventories();
  // }, []);

  // const fetchAllMorInventories = async (
  //   page = 1,
  //   filters = {},
  //   pageSizeOverride = pageSize
  // ) => {
  //   setLoading(true);
  //   try {
  //     let url = `${baseURL}mor_inventories/fetch_all_inventories.json?page=${page}&per_page=${pageSizeOverride}`;

  //     // Add company/project hierarchy filters
  //     if (filters.company_id) {
  //       url += `&q[company_id_eq]=${filters.company_id}`;
  //     }
  //     if (filters.project_id) {
  //       url += `&q[project_id_eq]=${filters.project_id}`;
  //     }
  //     if (filters.site_id) {
  //       url += `&q[site_id_eq]=${filters.site_id}`;
  //     }
  //     if (filters.wing_id) {
  //       url += `&q[wing_id_eq]=${filters.wing_id}`;
  //     }
  //     if (filters.store_id) {
  //       url += `&q[store_id_eq]=${filters.store_id}`;
  //     }

  //     // Add material related filters
  //     if (filters.material_type_id) {
  //       url += `&q[material_order_request_pms_inventory_type_id_in]=${filters.material_type_id}`;
  //     }
  //     if (filters.material_sub_type_id) {
  //       url += `&q[inventory_sub_type_id_in]=${filters.material_sub_type_id}`;
  //     }
  //     if (filters.material_id) {
  //       url += `&q[inventory_id_in]=${filters.material_id}`;
  //     }
  //     if (filters.brand_id) {
  //       url += `&q[pms_brand_id_in]=${filters.brand_id}`;
  //     }
  //     if (filters.uom_id) {
  //       url += `&q[unit_of_measure_id_in]=${filters.uom_id}`;
  //     }
  //     if (filters.generic_specification_id) {
  //       url += `&q[generic_info_id_in]=${filters.generic_specification_id}`;
  //     }
  //     if (filters.colour_id) {
  //       url += `&q[pms_colour_id_in]=${filters.colour_id}`;
  //     }

  //     console.log("Fetching URL:", url);
  //     const response = await axios.get(url);
  //     setMorInventories(response.data.inventories);
  //     setPagination({
  //       current_page: response.data.pagination.current_page,
  //       next_page: response.data.pagination.next_page,
  //       prev_page: response.data.pagination.prev_page,
  //       total_pages: response.data.pagination.total_pages,
  //       total_count: response.data.pagination.total_count,
  //     });

  //     // Set selected inventories based on existing items
  //     const existingInventoryIds =
  //       formData.material_reconciliation_items_attributes.map(
  //         (item) => item.material_inventory_id
  //       );
  //     const selectedItems = response.data.inventories.filter((inventory) =>
  //       existingInventoryIds.includes(inventory.id)
  //     );
  //     setSelectedInventories(selectedItems);
  //   } catch (error) {
  //     console.error("Error fetching MOR inventories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Helper to build filters
  const buildFilters = () => {
    const filters = {};
    if (selectedCompany?.value) filters.company_id = selectedCompany.value;
    if (selectedProject?.value) filters.project_id = selectedProject.value;
    if (selectedSite?.value) filters.site_id = selectedSite.value;
    if (selectedWing?.value) filters.wing_id = selectedWing.value;
    return filters;
  };

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

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10); // Get the new page size
    setPageSize(newPageSize); // Update the page size state
    setPagination((prev) => ({
      ...prev,
      current_page: 1, // Reset to the first page
    }));
    fetchAllMorInventories(1, {}, newPageSize); // Fetch data for the first page with the new page size
  };

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

  const handleAcceptSelected = () => {
    // Map selected inventories to the required format
    const newInventories = selectedInventories.map((inventory) => ({
      id: inventory.id,
      material: inventory.material || inventory.material_name || inventory.name, // Try different possible field names
      stock_as_on: inventory.stock_as_on || 0,
      rate: inventory.rate_weighted_average || 0,
      deadstock_qty: 0,
      theft_or_missing_qty: 0,
      damage_qty: 0,
      adjustment_qty: 0,
      adjustment_rate: 0,
      adjustment_value: 0,
      net_quantity: inventory.qty || 0,
      remarks: "",
      reason: "",
      uom:
        inventory.uom ||
        inventory.unit_of_measure ||
        inventory.unit_of_measure_name, // Try different possible field names
    }));

    // Update accepted inventories
    setAcceptedInventories((prev) => [...prev, ...newInventories]);

    // Update form data with new items
    setFormData((prev) => ({
      ...prev,
      material_reconciliation_items_attributes: [
        ...prev.material_reconciliation_items_attributes,
        ...newInventories.map((inventory) => ({
          material_inventory_id: inventory.id,
          material: inventory.material, // Include material name
          uom: inventory.uom, // Include UOM
          stock_as_on: inventory.stock_as_on,
          rate: inventory.rate,
          deadstock_qty: inventory.deadstock_qty,
          theft_or_missing_qty: inventory.theft_or_missing_qty,
          damage_qty: inventory.damage_qty,
          adjustment_qty: inventory.adjustment_qty,
          adjustment_rate: inventory.adjustment_rate,
          adjustment_value: inventory.adjustment_value,
          net_quantity: inventory.net_quantity,
          remarks: inventory.remarks,
          reason: inventory.reason,
          ...(inventory.mr_batches_attributes
            ? { mr_batches_attributes: inventory.mr_batches_attributes }
            : {}),
        })),
      ],
    }));

    // Clear selected inventories
    setSelectedInventories([]);

    // Close the modal
    closeAddMaterialModal();
  };

  const calculateNetQuantity = (
    stockAsOn,
    deadstockQty,
    theftQty,
    wastageQty,
    adjustmentQty
  ) => {
    const stock = parseFloat(stockAsOn) || 0;
    const deadstock = parseFloat(deadstockQty) || 0;
    const theft = parseFloat(theftQty) || 0;
    const wastage = parseFloat(wastageQty) || 0;
    const adjustment = parseFloat(adjustmentQty) || 0;
    return stock - deadstock - theft - wastage + adjustment;
  };

  const handleInputChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.material_reconciliation_items_attributes];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      // If field is 'reason', store as reason_id
      if (field === "reason") {
        updatedItems[index].reason_id = value;
      }
      // Calculate net quantity when relevant fields change
      if (
        field === "deadstock_qty" ||
        field === "theft_or_missing_qty" ||
        field === "damage_qty" ||
        field === "adjustment_qty"
      ) {
        const stockAsOn = parseFloat(updatedItems[index].stock_as_on) || 0;
        const deadstockQty = parseFloat(updatedItems[index].deadstock_qty) || 0;
        const theftQty =
          parseFloat(updatedItems[index].theft_or_missing_qty) || 0;
        const wastageQty = parseFloat(updatedItems[index].damage_qty) || 0;
        const adjustmentQty =
          parseFloat(updatedItems[index].adjustment_qty) || 0;

        updatedItems[index].net_quantity = calculateNetQuantity(
          stockAsOn,
          deadstockQty,
          theftQty,
          wastageQty,
          adjustmentQty
        );
      }
      return {
        ...prev,
        material_reconciliation_items_attributes: updatedItems,
      };
    });
  };
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Fetch initial data
    axios
      .get(`${baseURL}material_reconciliations/${id}.json?token=${token}`)
      .then((response) => {
        const data = response.data;

        setDetails(data);
        // Set selected values for dropdowns
        setSelectedCompany({
          value: data.company.id,
          label: data.company.name,
        });

        // Fetch projects for the selected company
        axios
          .get(`${baseURL}/pms/company_setups.json?token=${token}`)
          .then((companyResponse) => {
            const selectedCompanyData = companyResponse.data.companies.find(
              (company) => company.id === data.company.id
            );

            if (selectedCompanyData) {
              const projectOptions = selectedCompanyData.projects.map(
                (prj) => ({
                  value: prj.id,
                  label: prj.name,
                })
              );
              setProjects(projectOptions);

              // Set selected project
              setSelectedProject({
                value: data.project.id,
                label: data.project.name,
              });

              // Find selected project data
              const selectedProjectData = selectedCompanyData.projects.find(
                (project) => project.id === data.project.id
              );

              if (selectedProjectData) {
                // Set site options based on selected project
                const siteOptions = selectedProjectData.pms_sites.map(
                  (site) => ({
                    value: site.id,
                    label: site.name,
                  })
                );
                setSiteOptions(siteOptions);

                // Set selected site
                setSelectedSite({
                  value: data.sub_project.id,
                  label: data.sub_project.name,
                });

                // Find selected site data
                const selectedSiteData = selectedProjectData.pms_sites.find(
                  (site) => site.id === data.sub_project.id
                );

                if (selectedSiteData) {
                  // Set wings options based on selected site
                  const wingsOptions = selectedSiteData.pms_wings.map(
                    (wing) => ({
                      value: wing.id,
                      label: wing.name,
                    })
                  );
                  setWingsOptions(wingsOptions);

                  // Set selected wing if it exists
                  if (data.wing) {
                    setSelectedWing({
                      value: data.wing.id,
                      label: data.wing.name,
                    });
                  }
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching company data:", error);
          });

        setSelectedStore({
          value: data.store.id,
          label: data.store.name,
        });
        setSelectedDate(data.reco_date);
        setSelectedStatus({
          value: data.status,
          label: data.status.charAt(0).toUpperCase() + data.status.slice(1),
        });

        // Set form data
        setFormData({
          pms_project_id: data.project.id,
          pms_site_id: data.sub_project.id,
          pms_store_id: data.store.id,
          pms_company_setup_id: data.company.id,
          created_by_id: data.created_by.id,
          reco_date: data.reco_date,
          remarks: data.remarks,
          material_reconciliation_items_attributes:
            data.material_reconciliation_items.map((item) => ({
              id: item.id,
              material_inventory_id: item.material_inventory_id,
              material: item.material,
              stock_as_on: item.stock_as_on,
              rate: item.rate,
              deadstock_qty: item.deadstock_qty,
              theft_or_missing_qty: item.theft_or_missing_qty,
              damage_qty: item.damage_qty,
              adjustment_qty: item.adjustment_qty,
              adjustment_rate: item.adjustment_rate,
              adjustment_value: item.adjustment_value,
              net_quantity: item.net_quantity,
              remarks: item.remarks,
              reason_id: item.reason ? item.reason.id : null,
              uom: item.uom,
              batches: item.batches || [], // Include batches data for prefill
            })),
        });

        // Set accepted inventories for the table
        setAcceptedInventories(
          data.material_reconciliation_items.map((item) => ({
            id: item.material_inventory_id,
            material: item.material,
            stock_as_on: item.stock_as_on,
            rate: item.rate,
            deadstock_qty: item.deadstock_qty,
            theft_or_missing_qty: item.theft_or_missing_qty,
            damage_qty: item.damage_qty,
            adjustment_qty: item.adjustment_qty,
            adjustment_rate: item.adjustment_rate,
            adjustment_value: item.adjustment_value,
            net_quantity: item.net_quantity,
            remarks: item.remarks,
            reason: item.reason,
          }))
        );

        // Fetch initial inventory data with filters
        const initialFilters = {
          company_id: data.company.id,
          project_id: data.project.id,
          site_id: data.sub_project.id,
          wing_id: data.wing?.id,
          store_id: data.store.id,
        };

        // Fetch inventory data with initial filters
        fetchAllMorInventories(1, initialFilters);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
      });
  }, [id, token]);

  const handleSubmit = async () => {
    // Validation: company, project, subproject, store mandatory
    if (!selectedCompany) {
      toast.error("Please select a company.");
      return;
    }
    if (!selectedProject) {
      toast.error("Please select a project.");
      return;
    }
    if (!selectedSite) {
      toast.error("Please select a sub-project.");
      return;
    }
    if (!selectedStore) {
      toast.error("Please select a store.");
      return;
    }
    // Validation: at least one material must be present
    if (
      !formData.material_reconciliation_items_attributes ||
      formData.material_reconciliation_items_attributes.filter(
        (item) => !item._destroy
      ).length === 0
    ) {
      toast.error(
        "Please select and accept at least one material before submitting."
      );
      return;
    }
    try {
      setLoading(true);
      // Prepare the payload
      const payload = {
        material_reconciliation: {
          pms_company_setup_id: selectedCompany?.value || null,
          pms_project_id: selectedProject?.value || null,
          pms_site_id: selectedSite?.value || null,
          pms_store_id: selectedStore?.value || null,
          pms_wing_id: selectedWing?.value || null,
          created_by_id: 2,
          reco_date: selectedDate || new Date().toISOString().split("T")[0],
          remarks: formData.remarks,
          status: selectedStatus?.value || "draft",
          material_reconciliation_items_attributes:
            formData.material_reconciliation_items_attributes.map((item) => ({
              id: item.id,
              material_inventory_id: item.material_inventory_id,
              stock_as_on: parseFloat(item.stock_as_on) || 0,
              rate: item.rate ? parseFloat(item.rate) : null,
              deadstock_qty: item.deadstock_qty
                ? parseFloat(item.deadstock_qty)
                : null,
              theft_or_missing_qty: item.theft_or_missing_qty
                ? parseFloat(item.theft_or_missing_qty)
                : null,
              damage_qty: item.damage_qty ? parseFloat(item.damage_qty) : null,
              adjustment_qty: item.adjustment_qty
                ? parseFloat(item.adjustment_qty)
                : null,
              adjustment_rate: item.adjustment_rate
                ? parseFloat(item.adjustment_rate)
                : null,
              adjustment_value: item.adjustment_value
                ? parseFloat(item.adjustment_value)
                : null,
              net_quantity: item.net_quantity
                ? parseFloat(item.net_quantity)
                : null,
              remarks: item.remarks || "",
              reason_id: item.reason_id || null,
              ...(item.mr_batches_attributes
                ? { mr_batches_attributes: item.mr_batches_attributes }
                : {}),
              _destroy: item._destroy || false,
            })),
        },
      };

      console.log("Submitting payload:", payload);

      const response = await axios.put(
        `${baseURL}material_reconciliations/${id}.json?token=${token}`,
        payload
      );

      console.log("Update successful:", response.data);

      // Show success toast
      toast.success("Material Reconciliation updated successfully!");
      setTimeout(() => {
        navigate(`/material-reconciliation-detail/${id}?token=${token}`);
      }, 1200);
    } catch (error) {
      console.error("Error updating material reconciliation:", error);
      toast.error("Error updating record. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${baseURL}/pms/stores/store_dropdown.json?token=${token}`
  //     )
  //     .then((response) => {
  //       setStores(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching store data:", error);
  //     });
  // }, []);

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
  const handleStoreChange = (selectedOption) => {
    setSelectedStore(selectedOption);
  };

  const handleRemoveInventory = (inventoryId) => {
    // Mark item for deletion in form data
    setFormData((prev) => ({
      ...prev,
      material_reconciliation_items_attributes:
        prev.material_reconciliation_items_attributes.map((item) =>
          item.material_inventory_id === inventoryId
            ? { ...item, _destroy: true } // Mark for deletion
            : item
        ),
    }));

    // Remove from accepted inventories for UI
    setAcceptedInventories((prev) =>
      prev.filter((inventory) => inventory.id !== inventoryId)
    );
  };

  useEffect(() => {
    setSelectAll(false);
  }, [pagination.current_page]);

  const handleBatchModalSubmit = () => {
    // Prepare batch data
    const batchData = Object.entries(batchIssueQty)
      .filter(([batchId, qty]) => qty && Number(qty) > 0)
      .map(([batchId, qty]) => ({
        grn_batch_id: Number(batchId),
        grn_batch_qty: Number(qty),
      }));

    // Update the relevant inventory in formData
    setFormData((prev) => ({
      ...prev,
      material_reconciliation_items_attributes:
        prev.material_reconciliation_items_attributes.map((item) =>
          item.material_inventory_id === selectedInventoryId
            ? { ...item, mr_batches_attributes: batchData }
            : item
        ),
    }));

    setShowBatchModal(false);
  };

  // ...existing code...

  const handleBatchIssueQtyChange = (batchId, value) => {
    const newValue = parseFloat(value) || 0;

    // Find the batch to get available qty
    const batch = batchList.find((b) => b.id === batchId);
    const availableQty = parseFloat(batch?.current_stock_qty) || 0;

    // 1. Cannot enter more than available qty for this batch
    if (newValue > availableQty) {
      toast.error(
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
      toast.error(`Total Issue QTY cannot exceed ${batchMaxQty}`);
      return;
    }

    setBatchQtyError("");
    setBatchIssueQty(newBatchIssueQty);
  };

  // ...existing code...

  useEffect(() => {
    console.log("Batch Modal:", {
      showBatchModal,
      selectedInventoryId,
      selectedStore,
    });
    if (showBatchModal && selectedInventoryId && selectedStore?.value) {
      const fetchBatchList = async () => {
        setBatchLoading(true);
        try {
          const response = await axios.get(
            `${baseURL}/material_reconciliations/grn_batches.json?q[material_inventory_id_eq]=${selectedInventoryId}&q[pms_store_id_eq]=${selectedStore.value}&token=${token}`
          );
          setBatchList(response.data || []);
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

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <div className="card card-default mt-5 p-2b-4" id="mor-material-slip">
            <div class="card-header3">
              <h3 class="card-title">Material Reconciliation</h3>
            </div>
            <div className="card-body ">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Company <span style={{ color: "red" }}>*</span>
                    </label>
                    <SingleSelector
                      options={companyOptions}
                      onChange={handleCompanyChange}
                      value={selectedCompany}
                      placeholder={`Select Company`}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Project <span style={{ color: "red" }}>*</span>
                    </label>
                    <SingleSelector
                      options={projects}
                      onChange={handleProjectChange}
                      value={selectedProject}
                      placeholder={`Select Project`}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Sub-Project <span style={{ color: "red" }}>*</span>
                    </label>
                    <SingleSelector
                      options={siteOptions}
                      onChange={handleSiteChange}
                      value={selectedSite}
                      placeholder={`Select Sub-project`}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Wings </label>
                    <SingleSelector
                      options={wingsOptions}
                      value={selectedWing}
                      onChange={handleWingChange}
                      placeholder={`Select Wing`}
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>
                      Store <span style={{ color: "red" }}>*</span>
                    </label>
                    <SingleSelector
                      options={stores}
                      onChange={handleStoreChange}
                      value={selectedStore}
                      placeholder="Select Store"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={selectedDate || ""}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className=" d-flex justify-content-between align-items-end px-2">
                <h5 className=" mt-3">
                  Material
                  <span style={{ color: "red", fontSize: "14px" }}> *</span>
                </h5>
                <button
                  className="purple-btn2 "
                  data-bs-toggle="modal"
                  data-bs-target="#add-Material"
                  onClick={openAddMaterialModal}
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
                      {/* <th>Rate (Weighted Average)(INR)</th> */}
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
                    {formData.material_reconciliation_items_attributes
                      .filter((item) => !item._destroy) // Only show non-deleted items
                      .map((item, index) => (
                        <tr key={item.material_inventory_id}>
                          <td>{index + 1}</td>
                          <td>{item.material}</td>
                          <td>{item.uom}</td>
                          <td>{item.stock_as_on}</td>
                          {/* <td>{item.rate}</td> */}
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              // value={item.deadstock_qty || ""}
                              value={
                                item.deadstock_qty === null ||
                                item.deadstock_qty === undefined
                                  ? ""
                                  : item.deadstock_qty
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "deadstock_qty",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              // value={item.theft_or_missing_qty || ""}
                              value={
                                item.theft_or_missing_qty === null ||
                                item.theft_or_missing_qty === undefined
                                  ? ""
                                  : item.theft_or_missing_qty
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "theft_or_missing_qty",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              //
                              value={
                                item.damage_qty === null ||
                                item.damage_qty === undefined
                                  ? ""
                                  : item.damage_qty
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "damage_qty",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </td>
                          <td>
                            <ShowIcon
                              // onClick={() => openBatchPopup(item)}
                              onClick={() =>
                                openBatchPopup({
                                  ...item,
                                  material_inventory_id:
                                    item.material_inventory_id,
                                })
                              }
                              style={{
                                // cursor: "pointer",
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              // value={item.adjustment_qty || ""}
                              value={
                                item.adjustment_qty === null ||
                                item.adjustment_qty === undefined
                                  ? ""
                                  : item.adjustment_qty
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "adjustment_qty",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={item.adjustment_rate || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "adjustment_rate",
                                  e.target.value
                                )
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={item.adjustment_value || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "adjustment_value",
                                  e.target.value
                                )
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={item.net_quantity || ""}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={item.remarks || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "remarks",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <SingleSelector
                              options={reasonOptions}
                              value={
                                reasonOptions.find(
                                  (option) => option.value === item.reason_id
                                ) || null
                              }
                              onChange={(selectedOption) =>
                                handleInputChange(
                                  index,
                                  "reason",
                                  selectedOption ? selectedOption.value : null
                                )
                              }
                              placeholder="Select Reason"
                            />
                          </td>
                          <td>
                            <button
                              className="btn"
                              onClick={() =>
                                handleRemoveInventory(
                                  item.material_inventory_id
                                )
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
            </div>
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
          <div className="row mt-2 w-100">
            <div className="col-12 px-4">
              <h5>Audit Log</h5>
              <div className="mx-0 tbl-container px-0">
                <table className="w-100 ">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.status_logs?.map((log, index) => (
                      <tr key={log.id}>
                        <td>{index + 1}</td>
                        <td>{log.created_by_name}</td>
                        <td>
                          {new Date(log.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          {log.status.charAt(0).toUpperCase() +
                            log.status.slice(1)}
                        </td>
                        <td>{log.admin_comment || "-"}</td>
                        {/* <td>{log.admin_comment || "-"}</td> */}
                      </tr>
                    ))}
                    {!details?.status_logs?.length && (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No audit log data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loader-container">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p>loading...</p>
        </div>
      )}
      <Modal
        centered
        size="lg"
        show={addMaterialModal}
        onHide={closeAddMaterialModal}
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
          {/* <div className="card card-default mt-5"> */}
          {/* <div className="card-body"> */}
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

          <div className="tbl-container  mt-3">
            <table className="w-100 ">
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
                  {/* <th>Qty</th> */}
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
                    <tr key={inventory.id}>
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
          </div>

          <div className="d-flex justify-content-between align-items-center px-3 mt-1 mb-2">
            <ul className="pagination justify-content-center d-flex">
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
          <Modal.Title>Batch Details</Modal.Title>
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
                    <td colSpan="6" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : batchList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
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
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter..."
                          min={0}
                          max={(() => {
                            // Calculate the remaining qty needed for total
                            const prevTotal = batchList
                              .slice(0, idx)
                              .reduce(
                                (sum, b) =>
                                  sum + (parseFloat(batchIssueQty[b.id]) || 0),
                                0
                              );
                            const remaining = batchMaxQty - prevTotal;
                            // The max you can enter in this batch is the lesser of available and remaining
                            return Math.min(
                              parseFloat(batch.current_stock_qty) || 0,
                              remaining
                            );
                          })()}
                          value={batchIssueQty[batch.id] || ""}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Only allow up to max
                            const max = (() => {
                              const prevTotal = batchList
                                .slice(0, idx)
                                .reduce(
                                  (sum, b) =>
                                    sum +
                                    (parseFloat(batchIssueQty[b.id]) || 0),
                                  0
                                );
                              const remaining = batchMaxQty - prevTotal;
                              return Math.min(
                                parseFloat(batch.current_stock_qty) || 0,
                                remaining
                              );
                            })();
                            if (Number(value) > max) {
                              toast.error(
                                `Issue QTY cannot exceed ${max} for this batch.`
                              );
                              return;
                            }
                            // Sequential logic: only allow editing this batch if all previous are fully filled
                            let canEdit = true;
                            for (let i = 0; i < idx; i++) {
                              const prevBatch = batchList[i];
                              const prevMax = (() => {
                                const prevPrevTotal = batchList
                                  .slice(0, i)
                                  .reduce(
                                    (sum, b) =>
                                      sum +
                                      (parseFloat(batchIssueQty[b.id]) || 0),
                                    0
                                  );
                                const prevRemaining =
                                  batchMaxQty - prevPrevTotal;
                                return Math.min(
                                  parseFloat(prevBatch.current_stock_qty) || 0,
                                  prevRemaining
                                );
                              })();
                              if (
                                (parseFloat(batchIssueQty[prevBatch.id]) || 0) <
                                prevMax
                              ) {
                                canEdit = false;
                                break;
                              }
                            }
                            if (!canEdit) {
                              toast.error(
                                "Please fully fill previous batch before entering this batch."
                              );
                              return;
                            }
                            handleBatchIssueQtyChange(batch.id, value);
                          }}
                          disabled={(() => {
                            // Sequential enabling logic
                            // Only enable if all previous batches are fully filled
                            if (idx === 0) return false;
                            let canEdit = true;
                            for (let i = 0; i < idx; i++) {
                              const prevBatch = batchList[i];
                              const prevMax = (() => {
                                const prevPrevTotal = batchList
                                  .slice(0, i)
                                  .reduce(
                                    (sum, b) =>
                                      sum +
                                      (parseFloat(batchIssueQty[b.id]) || 0),
                                    0
                                  );
                                const prevRemaining =
                                  batchMaxQty - prevPrevTotal;
                                return Math.min(
                                  parseFloat(prevBatch.current_stock_qty) || 0,
                                  prevRemaining
                                );
                              })();
                              if (
                                (parseFloat(batchIssueQty[prevBatch.id]) || 0) <
                                prevMax
                              ) {
                                canEdit = false;
                                break;
                              }
                            }
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
                            return !canEdit;
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
        </Modal.Body>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MaterialReconciliationEdit;
