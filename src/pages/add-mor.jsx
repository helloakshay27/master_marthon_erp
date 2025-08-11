import React from "react";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddMor = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

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
          morNumber: "",
          morStartDate: "",
          morEndDate: "",
      });
  
   
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    const [wingsOptions, setWingsOptions] = useState([]);

    // Fetch company data on component mount
    useEffect(() => {
        axios.get(`${baseURL}pms/company_setups.json?token=${token}`)
            .then(response => {
                console.log('Company data response:', response.data); // Debug log
                
                // Check if response.data.companies exists
                if (response.data && Array.isArray(response.data.companies)) {
                    setCompanies(response.data.companies);
                } else if (Array.isArray(response.data)) {
                    // If response.data is directly an array
                    setCompanies(response.data);
                } else {
                    console.error('Unexpected company data structure:', response.data);
                    setCompanies([]);
                }
            })
            .catch(error => {
                console.error('Error fetching company data:', error);
                setCompanies([]);
            });
    }, []);

    // Handle company selection
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);  // Set selected company
        setSelectedProject(null); // Reset project selection
        setSelectedSite(null); // Reset site selection
        setSelectedWing(null); // Reset wing selection
        setProjects([]); // Reset projects
        setSiteOptions([]); // Reset site options
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected company from the list
            const selectedCompanyData = companies.find(company => company.id === selectedOption.value);
            setProjects(
                selectedCompanyData?.projects.map(prj => ({
                    value: prj.id,
                    label: prj.name
                }))
            );
        }
    };

    // Handle project selection
    const handleProjectChange = (selectedOption) => {
        setSelectedProject(selectedOption);
        setSelectedSite(null); // Reset site selection
        setSelectedWing(null); // Reset wing selection
        setSiteOptions([]); // Reset site options
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected project from the list of projects of the selected company
            const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
            const selectedProjectData = selectedCompanyData?.projects.find(project => project.id === selectedOption.value);

            // Set site options based on selected project
            setSiteOptions(
                selectedProjectData?.pms_sites.map(site => ({
                    value: site.id,
                    label: site.name
                })) || []
            );
        }
    };


    // Handle site selection
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
        setSelectedWing(null); // Reset wing selection
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected project and site data
            const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
            const selectedProjectData = selectedCompanyData.projects.find(project => project.id === selectedProject.value);
            const selectedSiteData = selectedProjectData?.pms_sites.find(site => site.id === selectedOption.value);

            // Set wings options based on selected site
            setWingsOptions(
                selectedSiteData?.pms_wings.map(wing => ({
                    value: wing.id,
                    label: wing.name
                })) || []
            );
        }
    };

    // Handle wing selection
    const handleWingChange = (selectedOption) => {
        setSelectedWing(selectedOption);
    };

    // Map companies to options for the dropdown
    const companyOptions = companies.map(company => ({
        value: company.id,
        label: company.company_name
    }));



    // material type options 

    const [inventoryTypes2, setInventoryTypes2] = useState([]);  // State to hold the fetched data
    const [selectedInventory2, setSelectedInventory2] = useState(null);  // State to hold selected inventory type
    const [inventorySubTypes2, setInventorySubTypes2] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedSubType2, setSelectedSubType2] = useState(null); // State to hold selected sub-type
    const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] = useState(null); // State to hold selected sub-type
    
    // Material details table states
    const [materialDetailsData, setMaterialDetailsData] = useState([]);
    const [loadingMaterialDetails, setLoadingMaterialDetails] = useState(false);
    const [selectedMaterialItems, setSelectedMaterialItems] = useState([]);
    // Fetching inventory types data from API on component mount
    useEffect(() => {
        axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`)
            .then(response => {
                console.log('Inventory types response:', response.data); // Debug log
                
                // Check if response.data is an array
                if (Array.isArray(response.data)) {
                    const options = response.data.map(inventory => ({
                        value: inventory.id,
                        label: inventory.name
                    }));
                    setInventoryTypes2(options);
                } else if (response.data && Array.isArray(response.data.inventory_types)) {
                    // If data is nested in an object
                    const options = response.data.inventory_types.map(inventory => ({
                        value: inventory.id,
                        label: inventory.name
                    }));
                    setInventoryTypes2(options);
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setInventoryTypes2([]);
                }
            })
            .catch(error => {
                console.error('Error fetching inventory types:', error);
                setInventoryTypes2([]);
            });
    }, []);  // Empty dependency array to run only once on mount


    // Fetch inventory sub-types when an inventory type is selected
    useEffect(() => {
        if (selectedInventory2 || formData.materialType) {
            //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

            axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${selectedInventory2?.value || formData.materialType}&token=${token}`)
                .then(response => {
                    console.log('Inventory sub-types response:', response.data); // Debug log
                    
                    // Check if response.data is an array
                    if (Array.isArray(response.data)) {
                        const options = response.data.map(subType => ({
                            value: subType.id,
                            label: subType.name
                        }));
                        setInventorySubTypes2(options);
                    } else if (response.data && Array.isArray(response.data.inventory_sub_types)) {
                        // If data is nested in an object
                        const options = response.data.inventory_sub_types.map(subType => ({
                            value: subType.id,
                            label: subType.name
                        }));
                        setInventorySubTypes2(options);
                    } else {
                        console.error('Unexpected response structure:', response.data);
                        setInventorySubTypes2([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching inventory sub-types:', error);
                    setInventorySubTypes2([]);
                });
        }
    }, [selectedInventory2,formData.materialType]); // Run this effect whenever the selectedInventory state changes

    // Fetch inventory Material when an inventory type is selected
    useEffect(() => {
        if (selectedInventory2 || formData.materialType) {
            //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

            axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${selectedInventory2?.value || formData.materialType}&q[material_category_eq]=material&token=${token}`)
                .then(response => {
                    console.log('Inventory materials response:', response.data); // Debug log
                    
                    // Check if response.data is an array
                    if (Array.isArray(response.data)) {
                        const options = response.data.map(subType => ({
                            value: subType.id,
                            label: subType.name
                        }));
                        setInventoryMaterialTypes2(options);
                    } else if (response.data && Array.isArray(response.data.inventories)) {
                        // If data is nested in an object
                        const options = response.data.inventories.map(subType => ({
                            value: subType.id,
                            label: subType.name
                        }));
                        setInventoryMaterialTypes2(options);
                    } else {
                        console.error('Unexpected response structure:', response.data);
                        setInventoryMaterialTypes2([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching inventory materials:', error);
                    setInventoryMaterialTypes2([]);
                });
        }
    }, [selectedInventory2,formData.materialType]);
      const handleSelectorChange = (field, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));

    // Update the selectedInventory2 state when material type is selected
    if (field === "materialType") {
      setSelectedInventory2(selectedOption);
      // Clear dependent fields when material type changes
      setFormData((prev) => ({
        ...prev,
        materialSubType: "",
        material: "",
        genericSpecification: "",
        colour: "",
        brand: "",
        uom: "",
      }));
    }
  }; // Run this effect whenever the selectedInventory state changes

    // Fetch material details from API with filters
    const fetchMaterialDetails = async (useFilters = true) => {
        setLoadingMaterialDetails(true);
        try {
            // Build query parameters based on form selections
            const queryParams = new URLSearchParams();
            queryParams.append('token', token);
            
            if (useFilters) {
                // Add project filter if selected
                if (selectedProject) {
                    queryParams.append('q[project_id_in][]', selectedProject.value);
                }
                
                // Add sub-project (site) filter if selected
                if (selectedSite) {
                    queryParams.append('q[pms_site_id_in][]', selectedSite.value);
                }
                
                // Add material type filter if selected
                if (formData.materialType) {
                    queryParams.append('q[material_type_id_in][]', formData.materialType);
                }
                
                // Add material sub-type filter if selected
                if (formData.materialSubType) {
                    queryParams.append('q[material_type_material_sub_type_id_in][]', formData.materialSubType);
                }
                
                // Add material filter if selected
                if (formData.material) {
                    queryParams.append('q[mor_inventories_material_id_in][]', formData.material);
                }
                
                // Add date range filters if provided
                if (formData.morStartDate) {
                    queryParams.append('q[mor_date_gteq][]', formData.morStartDate);
                }
                
                if (formData.morEndDate) {
                    queryParams.append('q[mor_date_lteq][]', formData.morEndDate);
                }
                
                // Add MOR number filter if provided
                if (formData.morNumber) {
                    queryParams.append('q[id_in][]', formData.morNumber);
                }
            }
            
            const apiUrl = `https://marathon.lockated.com//material_order_requests/material_details.json?${queryParams.toString()}`;
            console.log('API URL with filters:', apiUrl);
            
            const response = await axios.get(apiUrl);
            
            // Transform the data to create separate rows for each material
            let transformedData = [];
            
            if (response.data && Array.isArray(response.data.material_order_requests)) {
                console.log('Processing material_order_requests array with length:', response.data.material_order_requests.length);
                
                response.data.material_order_requests.forEach((mor, morIndex) => {
                    console.log(`Processing MOR ${morIndex + 1}:`, mor.mor_number, 'with', mor.mor_inventories?.length || 0, 'inventories');
                    
                    // Special debugging for the specific MOR you mentioned
                    if (mor.mor_number === 'MOR/2025/11176') {
                        console.log('Found target MOR:', mor);
                        console.log('mor_inventories:', mor.mor_inventories);
                    }
                    
                    if (mor.mor_inventories && Array.isArray(mor.mor_inventories)) {
                        mor.mor_inventories.forEach((inventory, invIndex) => {
                            console.log(`  Adding inventory ${invIndex + 1}:`, inventory.material_name);
                            
                            // Create a separate row for each material
                            // Show MOR info only for the first material of each MOR
                            const materialRow = {
                                mor_id: mor.id,
                                project_name: mor.project_name,
                                sub_project_name: mor.sub_project_name,
                                mor_number: invIndex === 0 ? mor.mor_number : '', // Only show for first material
                                mor_date: invIndex === 0 ? mor.mor_date : '', // Only show for first material
                                status: mor.status,
                                // Material details
                                inventory_id: inventory.id,
                                material_name: inventory.material_name,
                                uom_name: inventory.uom_name,
                                required_quantity: inventory.required_quantity,
                                prev_order_qty: inventory.prev_order_qty,
                                order_qty: inventory.order_qty,
                                inventory_status: inventory.status
                            };
                            
                            transformedData.push(materialRow);
                            
                            // Special debugging for the specific MOR
                            if (mor.mor_number === 'MOR/2025/11176') {
                                console.log(`  Added material row for MOR ${mor.mor_number}:`, materialRow);
                            }
                        });
                    } else {
                        console.log(`  No mor_inventories found for MOR:`, mor.mor_number);
                    }
                });
            } else if (Array.isArray(response.data)) {
                console.log('Processing direct array with length:', response.data.length);
                
                // Handle if response.data is directly an array
                response.data.forEach((mor, morIndex) => {
                    console.log(`Processing MOR ${morIndex + 1}:`, mor.mor_number, 'with', mor.mor_inventories?.length || 0, 'inventories');
                    
                    // Special debugging for the specific MOR you mentioned
                    if (mor.mor_number === 'MOR/2025/11176') {
                        console.log('Found target MOR:', mor);
                        console.log('mor_inventories:', mor.mor_inventories);
                    }
                    
                    if (mor.mor_inventories && Array.isArray(mor.mor_inventories)) {
                        mor.mor_inventories.forEach((inventory, invIndex) => {
                            console.log(`  Adding inventory ${invIndex + 1}:`, inventory.material_name);
                            
                            // Create a separate row for each material
                            // Show MOR info only for the first material of each MOR
                            const materialRow = {
                                mor_id: mor.id,
                                project_name: mor.project_name,
                                sub_project_name: mor.sub_project_name,
                                mor_number: invIndex === 0 ? mor.mor_number : '', // Only show for first material
                                mor_date: invIndex === 0 ? mor.mor_date : '', // Only show for first material
                                status: mor.status,
                                // Material details
                                inventory_id: inventory.id,
                                material_name: inventory.material_name,
                                uom_name: inventory.uom_name,
                                required_quantity: inventory.required_quantity,
                                prev_order_qty: inventory.prev_order_qty,
                                order_qty: inventory.order_qty,
                                inventory_status: inventory.status
                            };
                            
                            transformedData.push(materialRow);
                            
                            // Special debugging for the specific MOR
                            if (mor.mor_number === 'MOR/2025/11176') {
                                console.log(`  Added material row for MOR ${mor.mor_number}:`, materialRow);
                            }
                        });
                    } else {
                        console.log(`  No mor_inventories found for MOR:`, mor.mor_number);
                    }
                });
            } else {
                console.log('Unexpected response structure:', response.data);
            }
            
            console.log('Final transformed data length:', transformedData.length);
            console.log('Transformed data sample:', transformedData.slice(0, 3));
            
            // Check for specific MOR in final data
            const targetMORData = transformedData.filter(item => item.mor_number === 'MOR/2025/11176');
            console.log('Target MOR data in final array:', targetMORData);
            
            setMaterialDetailsData(transformedData);
        } catch (error) {
            console.error('Error fetching material details:', error);
            setMaterialDetailsData([]);
        } finally {
            setLoadingMaterialDetails(false);
        }
    };

    // Handle material table checkbox selection for individual materials
    const handleMaterialCheckboxChange = (index) => {
        const newSelectedItems = [...selectedMaterialItems];
        if (newSelectedItems.includes(index)) {
            const filtered = newSelectedItems.filter(item => item !== index);
            setSelectedMaterialItems(filtered);
        } else {
            newSelectedItems.push(index);
            setSelectedMaterialItems(newSelectedItems);
        }
    };

    // Handle select all materials
    const handleSelectAllMaterials = (e) => {
        if (e.target.checked) {
            setSelectedMaterialItems(materialDetailsData.map((_, index) => index));
        } else {
            setSelectedMaterialItems([]);
        }
    };

    // Handle accept selected materials
    const handleAcceptSelectedMaterials = () => {
        console.log('Selected material items:', selectedMaterialItems);
        // Add your logic here for accepting selected materials
    };

    // Handle search with filters
    const handleSearch = () => {
        fetchMaterialDetails(true); // Use filters
    };

    // Handle show all (fetch without filters)
    const handleShowAll = () => {
        fetchMaterialDetails(false); // Don't use filters
    };

    // Handle reset form
    const handleResetForm = () => {
        setFormData({
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
        });
        setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedSite(null);
        setSelectedWing(null);
        setSelectedInventory2(null);
        setSelectedSubType2(null);
        setSelectedInventoryMaterialTypes2(null);
        setMaterialDetailsData([]);
        setSelectedMaterialItems([]);
    };

    // Load material details on component mount
    useEffect(() => {
        fetchMaterialDetails(false); // Show all on mount
    }, []);

  return (
    <>
      <div className="main-content">
        <div className="website-content container-fluid">
          <div className="module-data-section">
            <h5 className="modal-title fs-5 mb-3">Search Indent</h5>

            <div className="card">
              <div className="card-body">
                <div className="p-3">
                  <div className="row">
                    <div className="col-md-4 mt-2">
                                                           <div className="form-group">
                                                               <label>Company <span>*</span></label>
                                                               <SingleSelector
                                                                   options={companyOptions}
                                                                   onChange={handleCompanyChange}
                                                                   value={selectedCompany}
                                                                   placeholder={`Select Project`} // Dynamic placeholder
                                                               />
                                                           </div>
                                                       </div>
                                                       <div className="col-md-4 mt-2">
                   
                                                           <div className="form-group">
                                                               <label>Project <span>*</span></label>
                                                               <SingleSelector
                                                                   options={projects}
                                                                   onChange={handleProjectChange}
                                                                   value={selectedProject}
                                                                   placeholder={`Select Project`} // Dynamic placeholder
                   
                                                               />
                                                           </div>
                                                       </div>
                                                       <div className="col-md-4 mt-2">
                                                           <div className="form-group">
                                                               <label>Sub-Project</label>
                                                               <SingleSelector
                                                                   options={siteOptions}
                                                                   onChange={handleSiteChange}
                                                                   value={selectedSite}
                                                                   placeholder={`Select Sub-Project`} // Dynamic placeholder
                                                               />
                                                           </div>
                                                       </div>
                                                       <div className="col-md-4 mt-2">
                                                           <div className="form-group">
                                                               <label>Wing</label>
                                                               <SingleSelector
                                                                   options={wingsOptions}
                                                                   value={selectedWing}
                                                                   onChange={handleWingChange}
                                                                   placeholder={`Select Wing`} // Dynamic placeholder
                                                               />
                                                           </div>
                                                       </div>

                    <div className="col-md-4 mt-0">
                      <div className="form-group">
                        <label>MOR No.</label>
                         <input 
                           className="form-control" 
                           type="text" 
                           value={formData.morNumber}
                           onChange={(e) => setFormData(prev => ({ ...prev, morNumber: e.target.value }))}
                         />
                      </div>
                    </div>

                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>MOR Start Date</label>
                         <input 
                           className="form-control" 
                           type="date" 
                           value={formData.morStartDate}
                           onChange={(e) => setFormData(prev => ({ ...prev, morStartDate: e.target.value }))}
                         />
                      </div>
                    </div>

                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>MOR End Date</label>
                         <input 
                           className="form-control" 
                           type="date" 
                           value={formData.morEndDate}
                           onChange={(e) => setFormData(prev => ({ ...prev, morEndDate: e.target.value }))}
                         />
                      </div>
                    </div>
                

                    <div className="col-md-4 mt-2">
                   
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
                                                      <label className="po-fontBold">Material Sub Type <span>*</span></label>
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
                                                      <label className="po-fontBold">Material <span>*</span></label>
                                                      <SingleSelector
                                                          options={inventoryMaterialTypes2}
                                                          value={inventoryMaterialTypes2.find((option) => option.value === formData.material)} // Bind value to state
                                                          placeholder={`Select Material`} // Dynamic placeholder
                                                          onChange={(selectedOption) => handleSelectorChange("material", selectedOption)}
                                                      />
                                                    
                                                  </div>
                                              </div>
                </div>
                  </div>

                <div className="mt-1 justify-content-center d-flex gap-2">
                  <button className="purple-btn1" onClick={handleSearch}>Search</button>
                  <button className="purple-btn1" onClick={handleShowAll}>Show All</button>
                  <button className="purple-btn1" onClick={handleResetForm}>Reset</button>
                  <button className="purple-btn1">Close</button>
                </div>

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
                           <th>
                            <input 
                              type="checkbox" 
                              checked={selectedMaterialItems.length === materialDetailsData.length && materialDetailsData.length > 0}
                              onChange={handleSelectAllMaterials}
                            />
                          </th>
                           <th>Project SubProject</th>
                           <th>MOR Number</th>
                           <th>MOR Date</th>
                           <th>Material Name</th>
                          <th>UOM</th>
                           <th>Required Qty</th>
                           <th>Prev Order Qty</th>
                           <th>Order Qty</th>
                        </tr>
                      </thead>
                                             <tbody>
                         {materialDetailsData.length > 0 ? (
                           materialDetailsData.map((item, index) => {
                             // Debug logging for specific MOR
                             if (item.mor_number === 'MOR/2025/11176') {
                               console.log(`Rendering row ${index} for MOR ${item.mor_number}:`, item);
                             }
                             
                             return (
                               <tr key={`${item.mor_id}-${item.inventory_id}-${index}`}>
                               <td>
                                 <input 
                                   type="checkbox" 
                                   checked={selectedMaterialItems.includes(index)}
                                   onChange={() => handleMaterialCheckboxChange(index)}
                                 />
                               </td>
                                   <td>{item.project_name && item.sub_project_name ? `${item.project_name} - ${item.sub_project_name}` : (item.project_name || item.sub_project_name || '-')}</td>
                                   <td>{item.mor_number || '-'}</td>
                                   <td>{item.mor_date || '-'}</td>
                                   <td>{item.material_name || '-'}</td>
                                   <td>{item.uom_name || '-'}</td>
                                   <td>{item.required_quantity || '-'}</td>
                                   <td>{item.prev_order_qty || '-'}</td>
                                   <td>{item.order_qty || '-'}</td>
                             </tr>
                             );
                           })
                         ) : (
                           <tr>
                             <td colSpan="9" className="text-center">No data available</td>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddMor;
