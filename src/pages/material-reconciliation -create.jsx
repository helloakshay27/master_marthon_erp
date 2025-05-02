import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";

const MaterialReconciliationCreate = () => {
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
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });

  // Add reason options
  const reasonOptions = [
    { value: "reason1", label: "Reason 1" },
    { value: "reason2", label: "Reason 2" },
    { value: "reason3", label: "Reason 3" },
  ];

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
        "https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

    console.log("Selected Company ID:", selectedOption?.value);

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }))
      );
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

    console.log("Selected Project ID:", selectedOption?.value);

    if (selectedOption) {
      // Find the selected project from the list of projects of the selected company
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      // Set site options based on selected project
      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    console.log("Selected Sub-Project ID:", selectedOption?.value);
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
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
  }, []); // Empty dependency array to run only once on mount

  // Fetch inventory sub-types when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(","); // Get the selected inventory type IDs as a comma-separated list

      axios
        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
      .get(
        `${baseURL}unit_of_measures.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
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
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[material_category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
          `${baseURL}pms/generic_infos.json?q[material_id_eq]=${materialIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
          `${baseURL}pms/colours.json?q[material_id_eq]=${materialIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
          `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${materialIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

  // Fetch all MOR inventories on component mount
  useEffect(() => {
    fetchAllMorInventories();
  }, []);

  // Function to fetch MOR inventories with filters
  // const fetchAllMorInventories = async (page = 1, filters = {}) => {
  //   setLoading(true);
  //   try {
  //     // Start with base URL and page
  //     let url = `${baseURL}mor_inventories/fetch_all_inventories.json?page=${page}&per_page=${pageSize}`;

  //     // Add filters to URL if they exist
  //     if (filters.material_type_id) {
  //       url += `&q[material_type_id]=${filters.material_type_id}`;
  //     }
  //     if (filters.material_sub_type_id) {
  //       url += `&q[material_sub_type_id]=${filters.material_sub_type_id}`;
  //     }
  //     if (filters.material_id) {
  //       url += `&q[material_id]=${filters.material_id}`;
  //     }
  //     if (filters.brand_id) {
  //       url += `&q[brand_id]=${filters.brand_id}`;
  //     }
  //     if (filters.uom_id) {
  //       url += `&q[uom_id]=${filters.uom_id}`;
  //     }
  //     if (filters.generic_specification_id) {
  //       url += `&q[generic_specification_id]=${filters.generic_specification_id}`;
  //     }
  //     if (filters.colour_id) {
  //       url += `&q[colour_id]=${filters.colour_id}`;
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
  //   } catch (error) {
  //     console.error("Error fetching MOR inventories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchAllMorInventories = async (
    page = 1,
    filters = {},
    pageSizeOverride = pageSize
  ) => {
    setLoading(true);
    try {
      // Start with base URL and page
      let url = `${baseURL}mor_inventories/fetch_all_inventories.json?page=${page}&per_page=${pageSizeOverride}`;

      // Add filters to URL if they exist
      if (filters.material_type_id) {
        url += `&q[material_type_id]=${filters.material_type_id}`;
      }
      if (filters.material_sub_type_id) {
        url += `&q[material_sub_type_id]=${filters.material_sub_type_id}`;
      }
      if (filters.material_id) {
        url += `&q[material_id]=${filters.material_id}`;
      }
      if (filters.brand_id) {
        url += `&q[brand_id]=${filters.brand_id}`;
      }
      if (filters.uom_id) {
        url += `&q[uom_id]=${filters.uom_id}`;
      }
      if (filters.generic_specification_id) {
        url += `&q[generic_specification_id]=${filters.generic_specification_id}`;
      }
      if (filters.colour_id) {
        url += `&q[colour_id]=${filters.colour_id}`;
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
  // const handlePageSizeChange = (e) => {
  //   const newPageSize = parseInt(e.target.value);
  //   setPageSize(newPageSize);
  //   fetchAllMorInventories(1, {}); // Reset to first page with new page size
  // };
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

    // Add each selected value to filters if it exists
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
    // Create filters object with selected values
    const filters = {};

    // Add each selected value to filters if it exists
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
    adjustmentQty
  ) => {
    const stock = parseFloat(stockAsOn) || 0;
    const deadstock = parseFloat(deadstockQty) || 0;
    const theft = parseFloat(theftQty) || 0;
    const adjustment = parseFloat(adjustmentQty) || 0;
    return stock - deadstock - theft + adjustment;
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

          // Calculate net quantity when deadstock, theft, or adjustment quantity changes
          if (
            field === "deadstock_qty" ||
            field === "theft_or_missing_qty" ||
            field === "adjustment_qty"
          ) {
            const newDeadstockQty =
              field === "deadstock_qty" ? value : inventory.deadstock_qty;
            const newTheftQty =
              field === "theft_or_missing_qty"
                ? value
                : inventory.theft_or_missing_qty;
            const newAdjustmentQty =
              field === "adjustment_qty" ? value : inventory.adjustment_qty;

            updatedInventory.net_quantity = calculateNetQuantity(
              inventory.qty,
              newDeadstockQty,
              newTheftQty,
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
          created_by_id: 2,
          reco_date: new Date().toISOString().split("T")[0],
          remarks: formData.remarks,
          status: "draft", // Hardcoded status value
          material_reconciliation_items_attributes: acceptedInventories.map(
            (inventory) => ({
              mor_inventory_id: inventory.id,
              stock_as_on: inventory.qty || 0,
              rate: inventory.rate ? parseFloat(inventory.rate) : null,
              deadstock_qty: inventory.deadstock_qty
                ? parseFloat(inventory.deadstock_qty)
                : null,
              theft_or_missing_qty: inventory.theft_or_missing_qty
                ? parseFloat(inventory.theft_or_missing_qty)
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
              reason: inventory.reason || "",
            })
          ),
        },
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(
        `${baseURL}material_reconciliations.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      console.log("Submission successful:", response.data);

      // Show success alert
      alert("Record created successfully!");
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
    axios
      .get(
        "https://marathon.lockated.com/pms/stores/store_dropdown.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
      )
      .then((response) => {
        setStores(response.data);
      })
      .catch((error) => {
        console.error("Error fetching store data:", error);
      });
  }, []);

  // Handle store selection
  const handleStoreChange = (selectedOption) => {
    setSelectedStore(selectedOption);
  };

  // Function to handle inventory removal
  const handleRemoveInventory = (inventoryId) => {
    setAcceptedInventories((prev) =>
      prev.filter((inventory) => inventory.id !== inventoryId)
    );
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
                  {/* /.form-group */}
                </div>
                <div className="col-md-3">
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
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Material</th>
                      <th>UOM</th>
                      <th>Stock As on</th>
                      <th>Rate (Weighted Average)(INR)</th>
                      <th>Deadstock Qty</th>
                      <th>Theft / Missing Qty</th>
                      <th>Adjustment Quantity</th>
                      <th>Adjustment Rate(INR)</th>
                      <th>Adjustment Value(INR)</th>
                      <th>Net Quantity</th>
                      <th>Remarks</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedInventories.map((inventory, index) => (
                      <tr key={inventory.id}>
                        <td>{index + 1}</td>
                        <td>{inventory.material}</td>
                        <td>{inventory.uom}</td>
                        <td>{inventory.qty || 0}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.rate || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "rate",
                                e.target.value
                              )
                            }
                            placeholder="Enter Rate"
                          />
                        </td>
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
                            value={inventory.adjustment_qty || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "adjustment_qty",
                                e.target.value
                              )
                            }
                            placeholder="Enter Adjustment Qty"
                          />
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
                            placeholder="Enter Adjustment Rate"
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
                            placeholder="Enter Adjustment Value"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={inventory.net_quantity || ""}
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
                          <select
                            className="form-control"
                            value={inventory.reason || ""}
                            onChange={(e) =>
                              handleItemInputChange(
                                inventory.id,
                                "reason",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Reason</option>
                            {reasonOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
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
                <label style={{ fontSize: "0.95rem", color: "black" }}>
                  Status
                </label>
                <SingleSelector
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
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-end">
            <div className="col-md-2">
              <button className="purple-btn2 w-100" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
          <div className=" ">
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
          </div>
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
            <div className="col-md-6">
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
            <div className="col-md-6">
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
            <div className="col-md-6">
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
            <div className="col-md-6">
              <div className="form-group">
                <label>Generic Specification</label>
                <SingleSelector
                  options={genericSpecifications}
                  onChange={handleGenericSpecChange}
                  value={selectedGenericSpec}
                  placeholder="Select Generic Specification"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Colour</label>
                <SingleSelector
                  options={colors}
                  onChange={handleColorChange}
                  value={selectedColor}
                  placeholder="Select Colour"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Brand</label>
                <SingleSelector
                  options={brands}
                  onChange={handleBrandChange}
                  value={selectedBrand}
                  placeholder="Select Brand"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
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
          <div className="card card-default mt-5">
            <div className="card-body">
              {/* <p>
                  Displaying page {pagination.current_page} of{" "}
                  {pagination.total_pages}
                </p> */}

              <div className="d-flex align-items-center gap-2">
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
              </div>
            </div>

            <div className="tbl-container  mt-3">
              <table className="w-100 ">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Material Type</th>
                    <th>Material Sub-Type</th>
                    <th>Material</th>
                    <th>Generic Specification</th>
                    <th>Colour</th>
                    <th>Brand</th>
                    <th>Qty</th>
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
                        <td>{inventory.qty || "-"}</td>
                        <td>{inventory.uom || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
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
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
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
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.total_pages
                      }
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
                      disabled={
                        pagination.current_page === pagination.total_pages
                      }
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
            </div>
          </div>
          {/* </div> */}

          <div className="row mt-3 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
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
    </div>
  );
};

export default MaterialReconciliationCreate;
