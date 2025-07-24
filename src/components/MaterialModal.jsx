
// MaterialModal.js
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CustomPagination from "./CustomPagination";
import SingleSelector from "./base/Select/SingleSelector";
import MultiSelector from "./base/Select/MultiSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";

const MaterialModal = ({ show, handleClose, handleAdd }) => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
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
    // setSelectedMaterials((prev) =>
    //   prev.some((item) => item.id === material.id)
    //     ? prev // Do nothing if already selected
    //     : [...prev, material] // Add only if not already selected
    // );

    setSelectedMaterials((prev) =>
      prev.some((item) => item.id === material.id)
        ? prev.filter((item) => item.id !== material.id) // Uncheck: Remove from selection
        : [...prev, material] // Check: Add to selection
    );
  };


  const handleSelectAll = (isChecked) => {
    setSelectedMaterials(isChecked ? [...inventoryTableData] : []); // Select or deselect all
  };

  const handleAddMaterials = () => {
    if (selectedMaterials.length === 0) {
      setErrorMessage2("Please select at least one material."); // Show error message
      return;
    } else {
      setErrorMessage2(""); // Show error message
    }
    handleAdd(selectedMaterials);
    setSelectedMaterials([]); // Clear selected items
    handleClose(); // Close the modal
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
    axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`)
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

      axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=${token}`)
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

      axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[material_category_eq]=material&token=${token}`)
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
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');

  // Handle the "Go" button click to fetch data
  const handleGoButtonClick = () => {
    if (!selectedInventory) {
      // Set the error message state
      setErrorMessage("Please select Material Type");
      return;
    } else {
      setErrorMessage("")
    }

    setLoading(true); // Start loading before fetching
    // Get the selected inventory type IDs and material type IDs as a comma-separated list
    const inventoryTypeIds = selectedInventory.length > 0 ? selectedInventory.map(item => item.value).join(',') : '';
    const inventoryMaterialTypeIds = selectedInventoryMaterialTypes ? selectedInventoryMaterialTypes.map(item => item.value).join(',') : '';

    // const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list
    // const inventoryMaterialTypeIds = selectedInventoryMaterialTypes.map(item => item.value).join(',');
    const apiUrl = `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[id_in]=${inventoryMaterialTypeIds}&q[material_category_eq]=material&token=${token}`;

    axios.get(apiUrl)
      .then(response => {
        // setLoading(false); // Stop loading after the data is fetched
        setInventoryTableData(response.data); // Set the fetched data to state
      })
      .catch(error => {

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
    <Modal centered size="lg" show={show} onHide={handleClose} style={{ zIndex: '999999' }}>
      <Modal.Header closeButton>
        <h5>Add Material</h5>
      </Modal.Header>
      <Modal.Body>

        <form onSubmit={handleSubmit} acceptCharset="UTF-8">
          <div className="row">
            <h5 className="text-center">Search Material</h5>

            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material Type*</label>
                <MultiSelector
                  options={inventoryTypes}  // Provide the fetched options to the select component
                  onChange={handleInventoryChange}  // Update the selected inventory type
                  value={selectedInventory}  // Set the selected inventory type
                  placeholder={`Select Material Type`} // Dynamic placeholder

                />
                {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
              </div>
            </div>
            {/* <div className="col-md-4 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material Sub Type</label>
                <MultiSelector
                  options={inventorySubTypes}
                  onChange={handleSubTypeChange}
                  value={selectedSubType}
                  placeholder={`Select Material Sub Type`} // Dynamic placeholder
                />
              </div>
            </div> */}
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material</label>
                <MultiSelector
                  options={inventoryMaterialTypes}
                  onChange={handleInventoryMaterialTypeChange}
                  value={selectedInventoryMaterialTypes}
                  placeholder={`Select Material`} // Dynamic placeholder
                />
              </div>
            </div>

            <div className="row  justify-content-center  mt-4">
              <div className="col-md-2 mt-2 ">
                <button type="submit" className="purple-btn2 w-100 submit_mor" onClick={handleGoButtonClick}>
                  Go
                </button>
              </div>
              <div className="col-md-2">
                <button type="button" className="purple-btn1 w-100" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>

        <h5 className="mt-3 text-center">Material List</h5>
        <div className="tbl-container  mt-3">
          <table className="w-100">
            <thead>
              <tr>
                <th rowSpan={2}>
                  <input type="checkbox" className="all-materials"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedMaterials.length === inventoryTableData.length}
                  />
                </th>
                <th colSpan="4">Material Details</th>
              </tr>
              <tr>
                <th rowSpan={2}>Material-Type</th>
                <th rowSpan={2}>Material</th>
                {/* <th rowSpan={2}>UOM</th> */}
              </tr>
            </thead>
            <tbody className="material_details">
              {loading ? ( // If loading is true, show a loading spinner
                <tr>
                  <td colSpan="4" className="text-center">
                    Loading...
                  </td>
                </tr>
              )
                // {/* {loading ? (
                //   <div className="loader-container">
                //     <div className="lds-ring">
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //       <div></div>
                //     </div>
                //     <p>Loading...</p>
                //   </div>
                // ) */}

                :
                inventoryTableData.length > 0 ? (
                  inventoryTableData.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input type="checkbox" className="all-materials"
                          checked={selectedMaterials.some((material) => material.id === item.id)} // Check if material is selected
                          onChange={() => handleCheckboxChange(item)} // Toggle selection
                        />
                      </td>
                      <td>{item.inventory_type_name}</td>
                      <td>{item.name}</td>
                      {/* <td>{item.uom_name}</td> */}
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

export default MaterialModal;


