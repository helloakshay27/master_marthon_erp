import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";

const AddPo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  // State variables for Select PO functionality
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
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


  // State for API response data from ropo-mapping-create page
  const [apiResponseData, setApiResponseData] = useState([]);
  const [selectedPoRows, setSelectedPoRows] = useState([]);

  

  // useEffect to handle received data from ropo-mapping-create page
  useEffect(() => {
    if (location.state && location.state.apiResponseData) {
      setApiResponseData(location.state.apiResponseData);
      console.log(
        "Received API response data:",
        location.state.apiResponseData
      );
    }
  }, [location.state]);

  // Fetch purchase orders with filters




  // Handle company change
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects(
      selectedOption?.projects?.map((project) => ({
        value: project.id,
        label: project.name,
        sites: project.pms_sites,
      })) || []
    );
    setSites([]);
    setFilterParams((prev) => ({
    ...prev,
    companyId: selectedOption ? selectedOption.value : null,
    projectId: null,
    subProjectId: null,
  }));
  };

  // Handle project change
const handleProjectChange = (selectedOption) => {  // rename from 'value' to 'selectedOption' for clarity
  setSelectedProject(selectedOption);
  setSelectedSite(null);
  if (selectedOption?.sites) {
    setSites(
      selectedOption.sites.map((site) => ({
        value: site.id,
        label: site.name,
      }))
    );
  } else {
    setSites([]);
  }
  setFilterParams((prev) => ({
    ...prev,
    projectId: selectedOption ? selectedOption.value : null,
    subProjectId: null,
  }));
};

const handleSiteChange = (selectedOption) => {
  setSelectedSite(selectedOption);
  setFilterParams((prev) => ({
    ...prev,
    subProjectId: selectedOption ? selectedOption.value : null,
  }));
};

  // Handle site change


  // Handle material checkbox change - per row selection
  const handleMaterialCheckboxChange = (rowKey, checked) => {
    if (checked) {
      setSelectedPoRows((prev) => [...prev, rowKey]);
    } else {
      setSelectedPoRows((prev) => prev.filter((key) => key !== rowKey));
    }
  };



  // Handle select all materials - per row selection
  const handleSelectAllMaterials = (checked) => {
    if (checked) {
      const allRowKeys = apiResponseData.map(
        (item) => `${item.mor_inventory_id}-${item.po_mor_inventory_id}`
      );
      setSelectedPoRows(allRowKeys);
    } else {
      setSelectedPoRows([]);
    }
  };

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

  

  // Initial data fetch
  useEffect(() => {
    fetchCompanies();
   
  }, []);
  
   const [formData, setFormData] = useState({
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
      });


   const [inventoryTypes2, setInventoryTypes2] = useState([]);  // State to hold the fetched data
      const [selectedInventory2, setSelectedInventory2] = useState(null);  // State to hold selected inventory type
      const [inventorySubTypes2, setInventorySubTypes2] = useState([]); // State to hold the fetched inventory subtypes
      const [selectedSubType2, setSelectedSubType2] = useState(null); // State to hold selected sub-type
      const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]); // State to hold the fetched inventory subtypes
      const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] = useState(null); // State to hold selected sub-type
      // Fetching inventory types data from API on component mount
      useEffect(() => {
          axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`)
              .then(response => {
                  // Map the fetched data to the format required by react-select
                  const options = response.data.map(inventory => ({
                      value: inventory.id,
                      label: inventory.name
                  }));
  
                  setInventoryTypes2(options)
              })
              .catch(error => {
                  console.error('Error fetching inventory types:', error);
              });
      }, []);  // Empty dependency array to run only once on mount
  
  
      // Fetch inventory sub-types when an inventory type is selected
      useEffect(() => {
          if (selectedInventory2 || formData.materialType) {
              //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
  
              axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${selectedInventory2?.value || formData.materialType}&token=${token}`)
                  .then(response => {
                      // Map the sub-types to options for the select dropdown
                      const options = response.data.map(subType => ({
                          value: subType.id,
                          label: subType.name
                      }));
  
                      setInventorySubTypes2(options)
                  })
                  .catch(error => {
                      console.error('Error fetching inventory sub-types:', error);
                  });
          }
      }, [selectedInventory2,formData.materialType]); // Run this effect whenever the selectedInventory state changes
  
      // Fetch inventory Material when an inventory type is selected
      useEffect(() => {
          if (selectedInventory2 || formData.materialType) {
              //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
  
              axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${selectedInventory2?.value || formData.materialType}&q[material_category_eq]=material&token=${token}`)
                  .then(response => {
                      // Map the sub-types to options for the select dropdown
                      const options = response.data.map(subType => ({
                          value: subType.id,
                          label: subType.name
                      }));
  
                      setInventoryMaterialTypes2(options)
                  })
                  .catch(error => {
                      console.error('Error fetching inventory sub-types:', error);
                  });
          }
      }, [selectedInventory2,formData.materialType]); // Run this effect whenever the selectedInventory state changes
  
      // umo api

   const handleSelectorChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption?.value || "",
            [`${field}Label`]: selectedOption?.label || "",
        }));

        if (field === "materialType") {
            // Logic for materialType selection
            setSelectedInventory2(selectedOption); // Set the selected inventory type
            setSelectedSubType2(null); // Clear the selected sub-type when inventory type changes
            setInventorySubTypes2([]); // Reset the sub-types list
            setInventoryMaterialTypes2([]); // Reset the material types list
            setSelectedInventoryMaterialTypes2(null); // Clear selected material type
            setGenericSpecifications([])
            setSelectedGenericSpecifications(null)
            setColors([])
            setSelectedColors(null)
            setInventoryBrands([])
            setSelectedInventoryBrands(null)
            setUnitOfMeasures([])
          
        }

        if (field === "materialSubType") {
            // Logic for materialSubType selection
            setSelectedSubType2(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "material") {
            // Logic for materialSubType selection
            setSelectedInventoryMaterialTypes2(selectedOption); // Set the selected inventory sub-type

        }
        if (field === "uom") {
            // Logic for materialSubType selection
            setSelectedUnit(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "genericSpecification") {
            // Logic for materialSubType selection
            setSelectedGenericSpecifications(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "colour") {
            // Logic for materialSubType selection
            setSelectedColors(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "brand") {
            // Logic for materialSubType selection
            setSelectedInventoryBrands(selectedOption); // Set the selected inventory sub-type
        }
    };


  const [materialMatches, setMaterialMatches] = useState([]);
  const [filterParams, setFilterParams] = useState({
    companyId: null,
    projectId: null,
    subProjectId: null,
    materialType: "",
    materialSubType: "",
    material: "",
    fromDate: "",
 endDate: "",
    poNumber: "",
  });

  
  const [selectedSubProject, setSelectedSubProject] = useState(null);

  // Fetch material matches with filters (no pagination)
  const fetchMaterialMatches = async (filters = {}) => {
    try {
      setLoading(true);

      let url = `${baseURL}purchase_orders/ropo_material_matches.json?token=${token}`;

      if (filters.companyId) url += `&company=${filters.companyId}`;
      if (filters.projectId) url += `&project=${filters.projectId}`;
      if (filters.subProjectId) url += `&sub_project=${filters.subProjectId}`;
      if (filters.materialType) url += `&material_type=${filters.materialType}`;
      if (filters.materialSubType) url += `&material_sub_type=${filters.materialSubType}`;
      if (filters.material) url += `&material=${filters.material}`;
      if (filters.fromDate) url += `&from_date=${filters.fromDate}`;
      if (filters.toDate) url += `&to_date=${filters.toDate}`;
      if (filters.poNumber) url += `&po_number=${filters.poNumber}`;

      const response = await axios.get(url);

      setMaterialMatches(response.data.matches || []);
    } catch (error) {
      console.error("Error fetching material matches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search - just fetch with filters
  const handleSearch = () => {
    fetchMaterialMatches({
      companyId: selectedCompany?.value || filterParams.companyId,
      projectId: selectedProject?.value || filterParams.projectId,
      subProjectId: selectedSubProject?.value || filterParams.subProjectId,
   
      //  materialType: formData.materialType,
    materialSubType: formData.materialSubType,
    material: formData.material,
      fromDate: filterParams.fromDate,
      toDate: filterParams.toDate,
      poNumber: filterParams.poNumber,
    });
  };

  // Handle reset - clear filters and selections
  const handleReset = () => {
    setFilterParams({
      companyId: null,
      projectId: null,
      subProjectId: null,
      materialType: "",
      materialSubType: "",
      material: "",
      fromDate: "",
      toDate: "",
      poNumber: "",
    });
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSubProject(null);

    fetchMaterialMatches({});
  };

  // Fetch all data initially (no filters)
  useEffect(() => {
    fetchMaterialMatches({});
  }, []);


  

  return (
    <div>
      <main className="h-100 w-100">
        <div className="main-content">
          <div className="website-content container-fluid">
            <div className="module-data-section">
              <a href="">Home &gt; Store &gt; Store Operations &gt; Add PO</a>
              <h5 className="mt-3">Select Purchase Order</h5>

              <div className="card">
                <div className="card-body">
                  <div className="p-3">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Company</label>
                          <SingleSelector
                            options={companies}
                            value={selectedCompany}
                            onChange={handleCompanyChange}
                            placeholder="Select Company"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Project</label>
                          <SingleSelector
                            options={projects}
                            value={selectedProject}
                            onChange={handleProjectChange}
                            placeholder="Select Project"
                            isDisabled={!selectedCompany}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Sub-Project</label>
                          <SingleSelector
                            options={sites}
                            value={selectedSite}
                            onChange={handleSiteChange}
                            placeholder="Select Sub-Project"
                            isDisabled={!selectedProject}
                          />
                        </div>
                      </div>
                     < div className="col-md-4 mt-3">
                                                      <div className="form-group">
                                                          <label className="po-fontBold">Material Type <span></span></label>
                                                          <SingleSelector
                                                              options={inventoryTypes2}  // Provide the fetched options to the select component
                                                              value={inventoryTypes2.find((option) => option.value === formData.materialType)} // Bind value to state
                                                              placeholder={`Select Material Type`} // Dynamic placeholder
                                                              onChange={(selectedOption) => handleSelectorChange("materialType", selectedOption)}
                                                          />
                                                         
                                                      </div>
                                                  </div>
                                                  <div className="col-md-4 mt-3">
                                                      <div className="form-group">
                                                          <label className="po-fontBold">Material Sub Type <span></span></label>
                                                          <SingleSelector
                                                              options={inventorySubTypes2}
                                                              value={inventorySubTypes2.find((option) => option.value === formData.materialSubType)} // Bind value to state
                                                              placeholder={`Select Material Sub Type`} // Dynamic placeholder
                                                              onChange={(selectedOption) => handleSelectorChange("materialSubType", selectedOption)}
                                                          />
                                                         
                                                      </div>
                                                  </div>
                                                  <div className="col-md-4 mt-3">
                                                      <div className="form-group">
                                                          <label className="po-fontBold">Material <span></span></label>
                                                          <SingleSelector
                                                              options={inventoryMaterialTypes2}
                                                              value={inventoryMaterialTypes2.find((option) => option.value === formData.material)} // Bind value to state
                                                              placeholder={`Select Material`} // Dynamic placeholder
                                                              onChange={(selectedOption) => handleSelectorChange("material", selectedOption)}
                                                          />
                                                         
                                                      </div>
                                                  </div>
                      <div className="col-md-4 mt-2">
                        <div className="form-group">
                          <label>From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={filterParams.startDate}
                            onChange={(e) =>
                              setFilterParams((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mt-2">
                        <div className="form-group">
                          <label>To Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={filterParams.endDate}
                            onChange={(e) =>
                              setFilterParams((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                     
                      <div className="col-md-4 mt-2">
                        <div className="form-group">
                          <label>PO Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={filterParams.poNumber}
                            onChange={(e) =>
                              setFilterParams((prev) => ({
                                ...prev,
                                poNumber: e.target.value,
                              }))
                            }
                            placeholder="Enter PO Number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3 justify-content-center">
                      <div className="col-md-3">
                        <button
                          className="purple-btn2 w-100 mt-2"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button
                          className="purple-btn1 w-100"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* API Response Data Table */}
                    {apiResponseData.length > 0 && (
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <h6 className="mb-3">Material Order Request Data</h6>
                          <div className="tbl-container mx-3">
                            <table className="w-100 table ">
                              <thead>
                                <tr className="">
                                  <th className="text-start">
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedPoRows.length ===
                                        apiResponseData.length
                                      }
                                      onChange={(e) =>
                                        handleSelectAllMaterials(
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </th>
                                  <th className="text-start">Material</th>
                                  <th className="text-start">PO Number</th>
                                  <th className="text-start">PO Date</th>
                                  <th clasclassName="text-start">Supplier </th>
                                </tr>
                              </thead>
                              <tbody>
                                {apiResponseData.map((item, index) => {
                                  const rowKey = `${item.mor_inventory_id}-${item.po_mor_inventory_id}`;
                                  return (
                                    <tr key={rowKey}>
                                      <td className="text-start">
                                        <input
                                          type="checkbox"
                                          checked={selectedPoRows.includes(rowKey)}
                                          onChange={(e) =>
                                            handleMaterialCheckboxChange(
                                              rowKey,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </td>
                                    <td className="text-start">
                                      {item.material_name}
                                    </td>
                                    <td className="text-start">
                                      {item.po_number || "-"}
                                    </td>
                                    <td className="text-start">
                                      {item.po_date
                                        ? new Date(item.po_date)
                                            .toLocaleDateString("en-GB")
                                            .split("/")
                                            .join("-")
                                        : "-"}
                                    </td>
                                    <td className="text-start">
                                      {item.supplier_organization_name || "-"}
                                    </td>
                                  </tr>
                                );
                              })}
                              </tbody>
                            </table>
                          </div>
                          {/* {selectedMaterials.length > 0 && (
                            <div className="mt-2 text-muted">
                              <small>{selectedMaterials.length} material(s) selected</small>
                            </div>
                          )} */}
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-center mt-3">
                      <button 
                        className="purple-btn1" 
                        onClick={() => {
                          if (selectedPoRows.length === 0) {
                            alert('Please select at least one material before submitting');
                            return;
                          }
                          
                          // Filter selected data based on row keys
                          const selectedData = apiResponseData.filter(item => {
                            const rowKey = `${item.mor_inventory_id}-${item.po_mor_inventory_id}`;
                            return selectedPoRows.includes(rowKey);
                          });
                          
                          // Check if any of the selected materials are already present in existing PO data
                          const existingMorData = location.state?.existingMorData || [];
                          const existingPoData = location.state?.existingPoData || [];
                          
                          // Create a set of existing material-PO combinations
                          const existingMaterialPoKeys = new Set(
                            existingPoData.map(item => `${item.mor_inventory_id}-${item.po_mor_inventory_id}`)
                          );
                          
                          const newMaterials = selectedData.filter(item => {
                            const rowKey = `${item.mor_inventory_id}-${item.po_mor_inventory_id}`;
                            return !existingMaterialPoKeys.has(rowKey);
                          });
                          
                          if (newMaterials.length === 0) {
                            alert('Selected materials are already present in the table');
                            return;
                          }
                          
                          navigate(`/ropo-mapping-create?token=${token}`, {
                            state: {
                              selectedMaterials: selectedData,
                              fromAddPo: true,
                              existingMorData: location.state?.existingMorData || [], // Pass back existing MOR data
                              existingPoData: location.state?.existingPoData || [] // Pass back existing PO data
                            }
                          });
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPo;
