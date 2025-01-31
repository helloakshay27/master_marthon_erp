import React, { useState,useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CustomPagination from "./CustomPagination";
import axios from "axios";
import MultiSelector from "./base/Select/MultiSelector";

const AssetModal = ({ showAssets, handleCloseAssets, handleAdd }) => {
    // const [selectedMaterials, setSelectedMaterials] = useState([]);
    // const [filteredData, setFilteredData] = useState([]);
    // const [page, setPage] = useState(1); // 1-based index
    // const [pageSize, setPageSize] = useState(10);

    // // Calculate displayed rows for the current page
    // const startEntry = (page - 1) * pageSize + 1;
    // const endEntry = Math.min(page * pageSize, filteredData.length);

    const [errorMessage, setErrorMessage] = useState('');
      const [errorMessage2, setErrorMessage2] = useState('');


    const materials = [
        {
            isSelected: false, // Represents the checkbox state for this row
            assetType: "Aluminium Ladder1",
            assetSubType: "Aluminium Ladder",
            asset: "Aluminium Ladder",
            uom: "NOS",
        },
        {
            isSelected: false, // Represents the checkbox state for this row
            assetType: "21'' IMAC Desktop 4K2",
            assetSubType: "21'' IMAC Desktop 4K Retina Display",
            asset: '21" IMAC Desktop 4K Retina Display',
            uom: "NOS",
        },
    ];

    // const handleCheckboxChange = (material) => {
    //     setSelectedMaterials((prev) =>
    //         prev.some((item) => item.assetType === material.assetType)
    //             ? prev.filter((item) => item.assetType !== material.assetType) // Unselect
    //             : [...prev, material] // Select
    //     );
    // };

    // const handleSelectAll = (isChecked) => {
    //     setSelectedMaterials(isChecked ? [...materials] : []); // Select or deselect all
    // };

    const handleAddAssets = () => {
        handleAdd(selectedMaterials);
        setSelectedMaterials([]); // Clear selected items
        handleCloseAssets(); // Close the modal
    };


    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1); // 1-based index
    const [pageSize, setPageSize] = useState(10);
  
  
    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedSubProject, setSelectedSubProject] = useState([]);
    const [selectedMorNo, setSelectedMorNo] = useState([]);
    const [selectedMaterialType, setSelectedMaterialType] = useState([]);
    const [selectedMaterialSubType, setSelectedMaterialSubType] = useState([]);
    const [morStartDate, setMorStartDate] = useState('');
    const [morEndDate, setMorEndDate] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState([]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log({
        selectedProject,
        selectedSubProject,
        selectedMorNo,
        selectedMaterialType,
        selectedMaterialSubType,
        morStartDate,
        morEndDate,
        selectedMaterial,
      });
    };
  
  
    // Calculate displayed rows for the current page
    const startEntry = (page - 1) * pageSize + 1;
    const endEntry = Math.min(page * pageSize, filteredData.length);
  
    //another way here
    //    const startIndex = (page - 1) * pageSize;
    //   const paginatedMaterials = materials.slice(startIndex, startIndex + pageSize);
  
    // Sample material data
    // const materials = [
    //   { type: "ADMIXTURE", subType: "ADMIXTURE", name: "ADMIXTURE", uom: "KGS" },
    //   { type: "AGGREGATE1", subType: "KAPCHI1", name: "KAPCHI1", uom: "CFT" },
    //   { type: "AGGREGATE2", subType: "KAPCHI2", name: "KAPCHI2", uom: "CFT" },
    //   { type: "AGGREGATE3", subType: "KAPCHI3", name: "KAPCHI3", uom: "CFT" },
    // ];
  
    const handleCheckboxChange = (material) => {
      setSelectedMaterials((prev) =>
        prev.some((item) => item.id === material.id)
          ? prev.filter((item) => item.id !== material.id) // Unselect
          : [...prev, material] // Select
      );
    };
  
    const handleSelectAll = (isChecked) => {
      setSelectedMaterials(isChecked ? [...inventoryTableData] : []); // Select or deselect all
    };
  
    const handleAddMaterials = () => {
      if (selectedMaterials.length === 0) {
        setErrorMessage2("Please select at least one Asset ."); // Show error message
        return;
      }else{
        setErrorMessage2(""); // Show error message
      }
      handleAdd(selectedMaterials);
      setSelectedMaterials([]); // Clear selected items
      handleCloseAssets(); // Close the modal
    };
  
  
    // material type options 
    const [inventoryTypes, setInventoryTypes] = useState([]);  // State to hold the fetched data
    const [selectedInventory, setSelectedInventory] = useState(null);  // State to hold selected inventory type
    const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedSubType, setSelectedSubType] = useState(null); // State to hold selected sub-type
    const [inventoryMaterialTypes, setInventoryMaterialTypes] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedInventoryMaterialTypes, setSelectedInventoryMaterialTypes] = useState(null); // State to hold selected sub-type
  
     // Fetching inventory types data from API on component mount
     useEffect(() => {
      axios.get('https://marathon.lockated.com/pms/inventory_types.json?category_eq=asset&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
        .then(response => {
          // Map the fetched data to the format required by react-select
          const options = response.data.map(inventory => ({
            value: inventory.id,
            label: inventory.name
          }));
          setInventoryTypes(options);  // Set the inventory types to state
        })
        .catch(error => {
          console.error('Error fetching inventory types:', error);
        });
    }, []);  // Empty dependency array to run only once on mount
  
  
     // Fetch inventory sub-types when an inventory type is selected
     useEffect(() => {
      if (selectedInventory) {
        const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
  
        axios.get(`https://marathon.lockated.com/pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            // Map the sub-types to options for the select dropdown
            const options = response.data.map(subType => ({
              value: subType.id,
              label: subType.name
            }));
            setInventorySubTypes(options); // Set the fetched sub-types to state
          })
          .catch(error => {
            console.error('Error fetching inventory sub-types:', error);
          });
      }
    }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes
  
    // Handler for inventory type selection change
    const handleInventoryChange = (selectedOption) => {
      setSelectedInventory(selectedOption); // Set the selected inventory type
      setSelectedSubType(null); // Clear the selected sub-type when inventory type changes
      setInventorySubTypes([]); // Reset the sub-types list
      setInventoryMaterialTypes([])
      setSelectedInventoryMaterialTypes(null)
    };
  
    // Handler for inventory sub-type selection change
    const handleSubTypeChange = (selectedOption) => {
      setSelectedSubType(selectedOption); // Set the selected inventory sub-type
    };
  
  
  
      // Fetch inventory Material when an inventory type is selected
      useEffect(() => {
        if (selectedInventory) {
          const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
    
          axios.get(`https://marathon.lockated.com/pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&material_category_eq=asset&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
            .then(response => {
              // Map the sub-types to options for the select dropdown
              const options = response.data.map(subType => ({
                value: subType.id,
                label: subType.name
              }));
              setInventoryMaterialTypes(options); // Set the fetched sub-types to state
            })
            .catch(error => {
              console.error('Error fetching inventory sub-types:', error);
            });
        }
      }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes
    
      // Handler for inventory Material selection change
      const handleInventoryMaterialTypeChange = (selectedOption) => {
        setSelectedInventoryMaterialTypes(selectedOption); // Set the selected inventory sub-type
      };
  
  
      // material list table data 
      const [inventoryTableData, setInventoryTableData] = useState([]);
      const [loading, setLoading] = useState(false); // For loading indicator
  
        // Handle the "Go" button click to fetch data
    const handleGoButtonClick = () => {
      // if (selectedInventory.length === 0 || selectedInventoryMaterialTypes.length === 0) {
      //   alert("Please select both Inventory Type and Material");
      //   return;
      // }

      if (!selectedInventory) {
        // Set the error message state
        setErrorMessage("Please select Asset Type");
        return;
      }else{
        setErrorMessage("")
      }
      setLoading(true); // Start loading before fetching

      const inventoryTypeIds = selectedInventory.length > 0 ? selectedInventory.map(item => item.value).join(',') : '';
      const inventoryMaterialTypeIds = selectedInventoryMaterialTypes ? selectedInventoryMaterialTypes.map(item => item.value).join(',') : '';
     
      // const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
      // const inventoryMaterialTypeIds = selectedInventoryMaterialTypes.map(item => item.value).join(',');
      const apiUrl = `https://marathon.lockated.com/pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[id_in]=${inventoryMaterialTypeIds}&material_category_eq=asset&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
  
      axios.get(apiUrl)
        .then(response => {
          // setLoading(false); // Stop loading after the data is fetched
          setInventoryTableData(response.data); // Set the fetched data to state
        })
        .catch(error => {
          // setLoading(false);
          console.error('Error fetching data:', error);
  
        }).finally(() => {
          setLoading(false); // Set loading to false once the data is fetched
        });
        
    };
  
  // Handle reset functionality
  const handleReset = () => {
    setSelectedInventory(null)
    setSelectedSubType(null)
    setSelectedInventoryMaterialTypes(null)
    setInventoryTableData([])
  };

    return (
        // <Modal centered size="lg" show={showAssets} onHide={handleCloseAssets}>
        //     <Modal.Header closeButton>
        //         <h5>Add Asset</h5>
        //     </Modal.Header>
        //     <Modal.Body>

        //         {/* <div className="input-group mx-3" style={{width:'400px'}}>
        //             <input
        //                 type="text"
        //                 name="s[name_cont]"
        //                 id="s_name_cont"
        //                 className="form-control tbl-search table_search"
        //                 placeholder="Type your keywords here"
        //             />
        //             <div className="input-group-append">
        //                 <button type="submit" className="btn btn-md btn-default"
        //                     style={{
        //                         borderTopRightRadius: '5px', // Top-right corner
        //                         borderBottomRightRadius: '5px', // Bottom-right corner
        //                         borderTopLeftRadius: '0px', // Top-left corner
        //                         borderBottomLeftRadius: '0px', // Bottom-left corner
        //                     }}
        //                 >
        //                     <svg
        //                         width="16"
        //                         height="16"
        //                         viewBox="0 0 16 16"
        //                         fill="none"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <path
        //                             d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
        //                             fill="#8B0203"
        //                         ></path>
        //                         <path
        //                             d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
        //                             fill="#8B0203"
        //                         ></path>
        //                     </svg>
        //                 </button>
        //             </div>
        //         </div> */}

        //         <div className="tbl-container mx-3 mt-1">
        //             <table className="w-100">
        //                 <thead>
        //                     <tr>
        //                         <th>
        //                             <input
        //                                 type="checkbox"
        //                                 onChange={(e) => handleSelectAll(e.target.checked)}
        //                                 checked={selectedMaterials.length === materials.length}
        //                             />
        //                         </th>

        //                         <th>Asset Type</th>
        //                         <th>Asset Sub-Type</th>
        //                         <th>Asset</th>
        //                         <th>UOM</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {materials.map((material, index) => (
        //                         <tr key={index}>
        //                             <td>
        //                                 <input
        //                                     type="checkbox"
        //                                     checked={selectedMaterials.some((item) => item.assetType === material.assetType)} // Check if material is selected
        //                                     onChange={() => handleCheckboxChange(material)} // Toggle selection
        //                                 />
        //                             </td>
        //                             <td>{material.assetType}</td>
        //                             <td>{material.assetSubType}</td>
        //                             <td>{material.asset}</td>
        //                             <td>{material.uom}</td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </div>
        //         <CustomPagination
        //             totalEntries={materials.length}
        //             page={page}
        //             pageSize={pageSize}
        //             onPageChange={(value) => setPage(value)}
        //         />
        //         <div className="row mt-2 justify-content-center">
        //             <div className="col-md-2">
        //                 <button onClick={handleAddAssets} className="purple-btn2 w-100">
        //                     Add
        //                 </button>
        //             </div>
        //         </div>
        //     </Modal.Body>
        // </Modal>

        <Modal centered size="lg" show={showAssets} onHide={handleCloseAssets}>
        <Modal.Header closeButton>
          <h5>Add Asset</h5>
        </Modal.Header>
        <Modal.Body>
  
          <form onSubmit={handleSubmit} acceptCharset="UTF-8">
            <div className="row">
              <h5 className="text-center">Search Asset</h5>
           
              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Asset Type*</label>
                  <MultiSelector
                  options={inventoryTypes}  // Provide the fetched options to the select component
                  onChange={handleInventoryChange}  // Update the selected inventory type
                  value={selectedInventory}  // Set the selected inventory type
                    placeholder={`Select Asset Type`} // Dynamic placeholder
                   
                  />
                  {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Asset Sub Type</label>
                  <MultiSelector
                   options={inventorySubTypes}
                   onChange={handleSubTypeChange}
                   value={selectedSubType}
                   placeholder={`Select Asset Sub Type`} // Dynamic placeholder
                  />
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="form-group">
                  <label className="po-fontBold">Asset</label>
                  <MultiSelector
                  options={inventoryMaterialTypes}
                  onChange={handleInventoryMaterialTypeChange}
                  value={selectedInventoryMaterialTypes}
                    placeholder={`Select Asset`} // Dynamic placeholder
                  />
                </div>
              </div>
              <div className="row mt-2 justify-content-center mt-3">
                <div className="col-md-1">
                  <button type="submit" className="purple-btn2 update_mor" onClick={handleGoButtonClick}>
                    Go
                  </button>
                </div>
                <div className="col-md-1">
                  <button type="button" className="purple-btn1" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        
        <h5 className="mt-3 text-center">Asset List</h5>
          <div className="tbl-container me-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th rowSpan={2}>
                    <input type="checkbox" className="all-materials"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedMaterials.length === inventoryTableData.length} 
                    />
                  </th>
                  <th colSpan="4">Asset Details</th>
                </tr>
                <tr>
                  <th  rowSpan={2}>Asset-Type</th>
                  <th  rowSpan={2}>Asset</th>
                  <th  rowSpan={2}>UOM</th>
                </tr>
              </thead>
              <tbody className="material_details">
              {loading ? ( // If loading is true, show a loading spinner
                <tr>
                  <td colSpan="4" className="text-center">
                    Loading...
                  </td>
                </tr>
              ):
              inventoryTableData.length > 0 ? (
              inventoryTableData.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" className="all-materials"
                     checked={selectedMaterials.some((material) => material.id=== item.id )} // Check if material is selected
                     onChange={() => handleCheckboxChange(item)} // Toggle selection
                    />
                  </td>
                  <td>{item.inventory_type_name}</td>
                  <td>{item.name}</td>
                  <td>{item.uom_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No data available</td>
              </tr>
            )}
              </tbody>
            </table>
          </div>
          {errorMessage2 && <div style={{ color: 'red' }}>{errorMessage2}</div>}
          <div className="modal-footer justify-content-center">
            <button type="button" className="purple-btn2 submit_mor" onClick={handleAddMaterials}>
              Accept Selected
            </button>
          </div>
          {/* <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={selectedMaterials.length === materials.length}
                    />
                  </th>
                  <th>Material Type</th>
                  <th>Material Sub-Type</th>
                  <th>Material</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMaterials.some((item) => item.name === material.name)} // Check if material is selected
                        onChange={() => handleCheckboxChange(material)} // Toggle selection
                      />
                    </td>
                    <td>{material.type}</td>
                    <td>{material.subType}</td>
                    <td>{material.name}</td>
                    <td>{material.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
  
          {/* <CustomPagination
            totalEntries={materials.length}
            page={page}
            pageSize={pageSize}
            onPageChange={(value) => setPage(value)}
          /> */}
          {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button onClick={handleAddMaterials} className="purple-btn2 w-100">
                Add
              </button>
            </div>
          </div> */}
        </Modal.Body>
      </Modal>
    );
};

export default AssetModal;
