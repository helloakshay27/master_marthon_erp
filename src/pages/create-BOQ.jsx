import React from "react";
import BOQSubItemTable from "../components/BOQSubItemTable ";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import MaterialModal from "../components/MaterialModal";
import LabourModal from "../components/LabourModal";
import AssetModal from "../components/AssestModal";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import axios from "axios"


const CreateBOQ = () => {
  const [showMaterialLabour, setShowMaterialLabour] = useState(false);
  const [showBOQSubItem, setShowBOQSubItem] = useState(false);

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    if (id === "checkbox1") {
      setShowMaterialLabour(checked);
      setShowBOQSubItem(false)
      // Uncheck the other checkbox (checkbox2)
      document.getElementById("checkbox2").checked = false;
    } else if (id === "checkbox2") {
      setShowBOQSubItem(checked);
      setShowMaterialLabour(false)
      // Uncheck the other checkbox (checkbox1)
      document.getElementById("checkbox1").checked = false;
    }
  };
  // bootstrap collaps
  // const [expandedRows, setExpandedRows] = useState([]);
  const [table1Rows, setTable1Rows] = useState([{ id: 1, value: '' }]);
  const [table2Rows, setTable2Rows] = useState([{ id: 1, value: '' }]);
  const [count, setcount] = useState([]);
  const [counter, setcounter] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count])

  // bootstrap modal
  const toggleRow = (rowIndex) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };
  //
  // Function to add a new row to Table 1
  const addRowToTable1 = () => {
    const newRow = { id: count.length + 1, value: '' };
    setcount([...count, newRow]);
    setcounter(counter + 1)
  };

  // Function to add a new row to Table 2
  const addRowToTable2 = () => {
    const newRow = { id: table2Rows.length + 1, value: '' };
    setTable2Rows([...table2Rows, newRow]);
  };

  // Function to handle row value change for Table 1
  const handleChangeTable1 = (id, newValue) => {
    const updatedRows = table1Rows.map((row) =>
      row.id === id ? { ...row, value: newValue } : row
    );
    setTable1Rows(updatedRows);
  };

  // Function to handle row value change for Table 2
  const handleChangeTable2 = (id, newValue) => {
    const updatedRows = table2Rows.map((row) =>
      row.id === id ? { ...row, value: newValue } : row
    );
    setTable2Rows(updatedRows);
  };

  // Function to delete a row from Table 1
  const deleteRowFromTable1 = (id) => {
    // const newValue = count.pop()
    // console.log("aa", newValue)
    // setcount(newValue)
    // setTable1Rows(table1Rows.filter((row) => row.id !== id));
    setcount(count.filter((row) => row.id !== id))
    setcounter(counter - 1);
  };

  // Function to delete a row from Table 2
  const deleteRowFromTable2 = (id) => {
    setTable2Rows(table2Rows.filter((row) => row.id !== id));
  };


  //Material modal and table data handle add or delete

  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]); // To track selected rows
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddMaterials = (newMaterials) => {
    setMaterials((prev) => [
      ...prev,
      ...newMaterials.filter(
        (material) => !prev.some((m) => m.name === material.name)
      ),
    ]);
  };

  console.log("materials", materials)

  const handleDeleteRow = (materialToDelete) => {
    setMaterials((prev) =>
      prev.filter((material) => material.name !== materialToDelete.name)
    );
  };

  const handleDeleteAll = () => {
    setMaterials((prev) =>
      prev.filter((material) => !selectedMaterials.includes(material.name))
    );
    setSelectedMaterials([]); // Reset selected materials
  };

  const handleSelectRow = (materialName) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialName)
        ? prev.filter((name) => name !== materialName) // Unselect the material
        : [...prev, materialName] // Select the material
    );
  };


  //labour modal and table data handle add or delete
  const [showModalLabour, setShowModalLabour] = useState(false);
  const [labours, setLabours] = useState([]);
  const [selectedlabours, setSelectedLabours] = useState([])
  const handleOpenModalLabour = () => setShowModalLabour(true);
  const handleCloseModalLabour = () => setShowModalLabour(false);


  const handleAddLabours = (newlabours) => {
    setLabours((prev) => [
      ...prev,
      ...newlabours.filter(
        (labours) => !prev.some((m) => m.labourType === labours.labourType)
      ),
    ]);
  };

  const handleDeleteAllLabour = () => {
    setLabours((prev) =>
      prev.filter((labours) => !selectedlabours.includes(labours.labourType))
    );
    setSelectedLabours([]); // Reset selected materials
  };

  const handleSelectRowLabour = (labourType) => {
    setSelectedLabours((prev) =>
      prev.includes(labourType)
        ? prev.filter((type) => type !== labourType) // Unselect the material
        : [...prev, labourType] // Select the material
    );
  };



  //asset modal and table data handle add or delete
  const [showModalAsset, setShowModalAsset] = useState(false);
  const [Assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([])
  const handleOpenModalAsset = () => setShowModalAsset(true);
  const handleCloseModalAsset = () => setShowModalAsset(false);


  const handleAddAssets = (newAsset) => {
    setAssets((prev) => [
      ...prev,
      ...newAsset.filter(
        (asset) => !prev.some((a) => a.assetType === asset.assetType)
      ),
    ]);
  };

  const handleDeleteAllAssets = () => {
    setAssets((prev) =>
      prev.filter((asset) => !selectedAssets.includes(asset.assetType))
    );
    setSelectedAssets([]); // Reset selected materials
  };

  const handleSelectRowAssets = (assetType) => {
    setSelectedAssets((prev) =>
      prev.includes(assetType)
        ? prev.filter((type) => type !== assetType) // Unselect the material
        : [...prev, assetType] // Select the material
    );
  };



  const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
  ];


  //payoad creation here 
  const [formData, setFormData] = useState({
    project: '',
    subProject: '',
    wing: '',
    mainCategory: '',
    subCategoryLvl2: '',
    subCategoryLvl3: '',
    subCategoryLvl4: '',
    subCategoryLvl5: '',
    itemName: '',
    description: '',
    uom: '',
    boqQuantity: '',
    boqRate: '',
    boqAmount: '',
    note: '',
  });

  console.log("formdata", formData)

  // Handle change for SingleSelector
  const handleSelectorChange = (field, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOption ? selectedOption.value : ''
    }));
  };
  // Handle change for input fields
  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the payload
    const payload = {
      project: formData.project,
      sub_project: formData.subProject,
      wing: formData.wing,
      main_category: formData.mainCategory,
      sub_category_lvl_2: formData.subCategoryLvl2,
      sub_category_lvl_3: formData.subCategoryLvl3,
      sub_category_lvl_4: formData.subCategoryLvl4,
      sub_category_lvl_5: formData.subCategoryLvl5,
      item_name: formData.itemName,
      description: formData.description,
      uom: formData.uom,
      boq_quantity: formData.boqQuantity,
      boq_rate: formData.boqRate,
      boq_amount: formData.boqAmount,
      note: formData.note,
      add_material_labour_assets: formData.addMaterialLabourAssets,
      add_boq_sub_item: formData.addBoqSubItem,
      // materials: materials, // Add the materials array here
      // labours: labours,
      // assets: Assets,
      boqSubItem: {
        boqData: payloadData,
        materials: materials, // Add the materials array here
        labours: labours,
        assets: Assets,
      }
    };

    console.log('Payload:', payload);

    // Make the API call to submit the data
    // You can use axios or fetch to send the payload
    try {
      const response = await axios.post('/your/api/endpoint', payload);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  //boq sub item

  const [expandedRows, setExpandedRows] = useState([
    {
      id: 1,
      name: "MS Fabrication",
      description: "MS Fabrication_20010",
      notes: "MS Fabrication_20010",
      remarks: "",
      uom: "KG",
      qty: 621.0,
      rate: 130.0,
      amount: 80730.0,
    },
  ]);

  // Update value for a specific field in a specific row
  const handleInputChange2 = (index, field, value) => {
    // const updatedRows = [...expandedRows];
    // updatedRows[index][field] = value;
    // setExpandedRows(updatedRows);
    if (updatedRows[index] && typeof updatedRows[index] === "object") {
      updatedRows[index][field] = value;
      setExpandedRows(updatedRows);
    }
  };

  // Add a new row
  const addRow = () => {
    setExpandedRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1, // Ensure a unique id for each row
        name: "",
        description: "",
        notes: "",
        remarks: "",
        uom: "KG",
        qty: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  };


  const payloadData = expandedRows.map((row) => ({
    name: row.name,
    description: row.description,
    notes: row.notes,
    remarks: row.remarks,
    uom: row.uom,
    qty: row.qty,
    rate: row.rate,
    amount: row.amount,
  }));

  console.log("boq data", payloadData)
  return (
    <>

      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Setup &gt; Engineering Setup &gt; Create BOQ</a>
          <h5 className="mt-4">Create BOQ</h5>
          <div className="tab-content1 active" id="total-content">
            {/* Total Content Here */}
            <div className="card mt-5 pb-4">
              <CollapsibleCard title="Create Boq">


                <div className="card-body mt-0 pt-0">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Project</label>
                        {/* <select
                          className="form-control form-select"
                          style={{ width: "100%" }}
                        >
                          <option selected="selected">Select</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select> */}
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Project`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Sub-project`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('subProject', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Wing</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Wing`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Main Category</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Main Category`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('mainCategory', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label> Sub-category lvl 2</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Sub-category lvl 2`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('subCategoryLvl2', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Sub-category lvl 3</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('subCategoryLvl3', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label> Sub-category lvl 4</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label> Sub-category lvl 5</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('subCategoryLvl5', selectedOption)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Item Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('itemName', e.target.value)}

                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Enter ..."
                          defaultValue={""}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>UOM</label>
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select UOM`} // Dynamic placeholder
                          onChange={(selectedOption) => handleSelectorChange('UOM', selectedOption)}
                          isDisabled={showBOQSubItem}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>BOQ Quantity</label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('boqQuantity', e.target.value)}
                          disabled={showBOQSubItem}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>BOQ Rate</label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('boqRate', e.target.value)}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>BOQ Amount</label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('boqAmount', e.target.value)}
                        />
                      </div>
                    </div> */}
                    <div className="col-md-8">
                      <div className="form-group">
                        <label>Note</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Enter ..."
                          defaultValue={""}
                          onChange={(e) => handleInputChange('note', e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6 mt-2">
                      <div className="form-group">
                        <label>Note</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <input type="checkbox" name="" id="" />
                        </div>
                    </div> */}
                    <div className="row mt-2">
                      {/* Textarea for Note */}
                      {/* <div className="col-md-6">
                        <div className="form-group">
                          <label>Note</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Enter ..."
                            defaultValue={""}
                            onChange={(e) => handleInputChange('note', e.target.value)}
                          />
                        </div>
                      </div> */}

                      {/* Checkboxes */}
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check me-3">
                          <input type="checkbox" className="form-check-input" id="checkbox1" onChange={handleCheckboxChange} />
                          <label className="form-check-label" htmlFor="checkbox1">
                            Add Material/Labour/Assests
                          </label>
                        </div>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox2" onChange={handleCheckboxChange} />
                          <label className="form-check-label" htmlFor="checkbox2">
                            Add BOQ Sub-Item
                          </label>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </CollapsibleCard>

              {showMaterialLabour && (
                <>
                  <CollapsibleCard title="Material">
                    <div className="card mx-3 mt-2">
                      <div className="card-body mt-0 pt-0">
                        <div className="tbl-container mx-3 mt-1">
                          <table className="">
                            <thead>
                              <tr>
                                <th rowSpan={2}>
                                  <div className="d-flex justify-content-center">
                                    <input
                                      type="checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedMaterials(materials.map((m) => m.name)); // Select all
                                        } else {
                                          setSelectedMaterials([]); // Deselect all
                                        }
                                      }}
                                      checked={selectedMaterials.length === materials.length}
                                    />
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={14}
                                      height={14}
                                      fill="currentColor"
                                      className="bi bi-trash3-fill ms-2"
                                      viewBox="0 0 16 16"
                                      onClick={handleDeleteAll} // Delete selected rows on click
                                    >
                                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                    </svg>
                                  </div>
                                </th>
                                <th rowSpan={2}>Material</th>
                                {/* <th rowSpan={2}>Material Sub-Type</th>
                                <th rowSpan={2}>Material </th> */}
                                <th rowSpan={2}>Generic Specification</th>
                                <th rowSpan={2}>Colour</th>
                                <th rowSpan={2}>Brand</th>
                                <th rowSpan={2}>UOM</th>
                                <th colSpan={2}>Cost</th>
                                <th rowSpan={2}>Wastage</th>
                                <th rowSpan={2}>
                                  Total Estimated Quantity Wastage
                                </th>


                              </tr>

                              <tr>
                                <th rowSpan={1}>Co-efficient Factor</th>
                                <th rowSpan={1}>Estimated Qty</th>
                              </tr>

                              <tr>
                                <th />
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>E</th>
                                <th>F</th>
                                <th>G</th>
                                <th>H</th>
                                <th>I</th>
                                {/* <th>J</th>
                                <th>K</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {/* {materials.length > 0 ? (
                                materials.map((material, index) => ( */}
                                  <tr>
                                    <td>
                                      <input
                                        className="ms-5"
                                        type="checkbox"
                                        // checked={selectedMaterials.includes(material.name)} // Check if material is selected
                                        // onChange={() => handleSelectRow(material.name)} // Toggle selection
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        // value={material.type}
                                        placeholder=""
                                      />
                                    </td>

                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        // value='Generic Specification'
                                        placeholder="Generic Specification"
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        // value={material.type}
                                        placeholder="Colour"
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        // value={material.type}
                                        placeholder="Brand"
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        // value={material.uom}
                                        placeholder="Brand"
                                      />
                                    </td>
                                    <td style={{ width: '200px' }}>
                                      <input
                                        className="form-control"
                                        type="email"
                                        placeholder="Co-efficient Factor"
                                        fdprocessedid="qv9ju9"
                                      />
                                    </td>
                                    <td style={{ width: '200px' }}>
                                      <input
                                        className="form-control"
                                        type="email"
                                        placeholder="Estimated Qty"
                                        fdprocessedid="qv9ju9"
                                      />
                                    </td>
                                    <td> 
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Wastage"
                                      /></td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Total Estimated Quantity Wastage"
                                      />
                                    </td>
                                  </tr>
                                {/* ))
                              ) : ( */}
                                {/* <tr>
                                  <td colSpan="12" className="text-center">
                                    No materials added yet.
                                  </td>
                                </tr>
                              )} */}
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <button
                            style={{ color: "var(--red)" }}
                            className="fw-bold text-decoration-underline border-0 bg-white ms-3"
                            // onclick="myCreateFunction('table1')"
                            onClick={handleOpenModal}
                          >
                            Add Material
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  </CollapsibleCard>
                  <MaterialModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    handleAdd={handleAddMaterials}
                  />

                  {/* //assets */}
                  <CollapsibleCard title="Assests">
                    <div className="card mx-3 mt-2">

                      <div className="card-body mt-0 pt-0">
                        <div className="tbl-container mx-3 mt-1">
                          <table className="w-100">
                            <thead >
                              <tr>
                                <th rowSpan={2}>
                                  <div className="d-flex justify-content-center">
                                    <input className="" type="checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedAssets(Assets.map((a) => a.assetType)); // Select all
                                        } else {
                                          setSelectedAssets([]); // Deselect all
                                        }
                                      }}
                                      checked={selectedAssets.length === Assets.length}
                                    />

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={14}
                                      height={14}
                                      fill="currentColor"
                                      className="bi bi-trash3-fill ms-2"
                                      viewBox="0 0 16 16"
                                      onClick={handleDeleteAllAssets}
                                    >
                                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                    </svg>
                                  </div>
                                </th>
                                <th rowSpan={2}>Assest Type</th>
                                <th rowSpan={2}>Assest Sub-Type</th>
                                <th rowSpan={2}>Assest</th>
                                <th rowSpan={2}>UOM</th>
                                <th colSpan={2}>Cost</th>
                              </tr>
                              <tr>
                                <th>Co-efficient Factor</th>
                                <th rowSpan={2}>Estimated Qty</th>
                              </tr>
                            </thead>
                            <tbody>


                              {Assets.length > 0 ? (
                                Assets.map((assets, index) => (
                                  <tr key={index}>
                                    <td>
                                      <input
                                        className="ms-5"
                                        type="checkbox"
                                        checked={selectedAssets.includes(assets.assetType)} // Check if material is selected
                                        onChange={() => handleSelectRowAssets(assets.assetType)} // Toggle selection
                                      />
                                    </td>

                                    <td>
                                    <input
                                        className="form-control"
                                        value={assets.assetType}
                                        type="text"
                                        placeholder=""
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={assets.assetSubType}
                                        placeholder=""
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={assets.asset}
                                        placeholder=""
                                      />
                                    </td>
                                    <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={assets.uom}
                                        placeholder=""
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Co-efficient Factor"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Estimated Qty"
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="8" className="text-center">
                                    No asset added yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <button
                            style={{ color: "var(--red)" }}
                            className="fw-bold text-decoration-underline border-0 bg-white ms-3"
                            onClick={handleOpenModalAsset}
                          >
                            Add Asset
                          </button>{" "}
                        </div>
                      </div>

                    </div>
                  </CollapsibleCard>

                  <AssetModal
                    showAssets={showModalAsset}
                    handleCloseAssets={handleCloseModalAsset}
                    handleAdd={handleAddAssets}
                  />

                </>

              )}

              {showBOQSubItem && (
                <>
                  <CollapsibleCard title="BOQ Sub-Item">
                    <div className="card mx-3 mt-2">


                      <div className="card-body mt-0 pt-0">
                        <div className="mt-3">
                          <div className="tbl-container mx-3 mt-1">
                            <table className="table table-bordered">
                              <thead style={{ zIndex: "1" }}>
                                <tr>
                                  <th rowSpan={2}>
                                    <input type="checkbox" />
                                  </th>
                                  <th rowSpan={2}>Expand</th>
                                  <th rowSpan={2}>Sub Item Name</th>
                                  <th rowSpan={2}>Description</th>
                                  <th rowSpan={2}>Notes</th>
                                  <th rowSpan={2}>Remarks</th>
                                  <th rowSpan={2}>UOM</th>
                                  <th colSpan={3}>Cost</th>
                                  <th rowSpan={2}>Document</th>
                                </tr>
                                <tr>
                                  <th colSpan={3}>Quantity</th>
                                  {/* <th>Rate</th>
                                  <th>Amount</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {count.map((el, index) =>
                                (
                                  <>
                                    <tr>
                                      <td>
                                        <input type="checkbox" />
                                      </td>

                                      <td className="text-center">
                                        <button
                                          className="btn btn-link p-0"
                                          onClick={() => toggleRow(el.id)}
                                          aria-label="Toggle row visibility"
                                        >
                                          {expandedRows.includes(el.id) ?

                                            (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="black"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                {/* Square */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* Minus Icon */}
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                              </svg>
                                            ) : (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="black"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                {/* Square */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* Plus Icon */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                              </svg>
                                            )
                                          }
                                        </button>
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="MS Fabrication"
                                          value={expandedRows.name}
                                          onChange={(e) => handleInputChange(index, "name", e.target.value)}

                                        />

                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          defaultValue="MS Fabrication_20010"
                                          className="form-control"
                                          value={expandedRows.description}
                                          onChange={(e) => handleInputChange2(index, "description", e.target.value)}

                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          defaultValue="MS Fabrication_20010"
                                          className="form-control"
                                          value={expandedRows.notes}
                                          onChange={(e) => handleInputChange2(index, "notes", e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <input type="text" defaultValue=""
                                          value={expandedRows.remarks}
                                          className="form-control"
                                          onChange={(e) => handleInputChange2(index, "remarks", e.target.value)}
                                        />
                                      </td>
                                      <td style={{width:'200px'}}>
                                        <SingleSelector
                                          options={options}
                                          // value={values[label]} // Pass current value
                                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                          placeholder={`Select UOM`} // Dynamic placeholder
                                        // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                        />
                                      </td>
                                      <td colSpan={3}>
                                        <input type="number" defaultValue={621.0}
                                          value={expandedRows.qty}
                                          className="form-control"
                                          onChange={(e) => handleInputChange2(index, "qty", parseFloat(e.target.value))}
                                        />
                                      </td>
                                      {/* <td>
                                        <input type="number" defaultValue={130.0}
                                          value={expandedRows.rate}
                                           className="form-control"
                                          onChange={(e) => handleInputChange2(index, "rate", parseFloat(e.target.value))}
                                        />
                                      </td>
                                      <td>
                                        <input type="number" defaultValue={80730.0}
                                          value={expandedRows.amount}
                                           className="form-control"
                                          onChange={(e) => handleInputChange2(index, "amount", parseFloat(e.target.value))}
                                        />
                                      </td> */}
                                      <td>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={16}
                                          height={16}
                                          fill="currentColor"
                                          className="bi bi-file-earmark-text"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                          <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                        </svg>
                                      </td>
                                    </tr>
                                    {expandedRows.includes(el.id) && (
                                      <tr>
                                        <td colSpan={11}>
                                          {/* <BOQSubItemTable /> */}
                                          <BOQSubItemTable
                                            materials={materials}
                                            setMaterials={setMaterials}
                                            labours={labours}
                                            Assets={Assets}
                                            handleAddMaterials={handleAddMaterials}
                                            handleDeleteAll={handleDeleteAll}
                                            handleSelectRow={handleSelectRow}
                                            handleAddLabours={handleAddLabours}
                                            handleDeleteAllLabour={handleDeleteAllLabour}
                                            handleSelectRowLabour={handleSelectRowLabour}
                                            handleAddAssets={handleAddAssets}
                                            handleDeleteAllAssets={handleDeleteAllAssets}
                                            handleSelectRowAsset={handleSelectRowAssets}

                                          />

                                          <MaterialModal
                                            show={showModal}
                                            handleClose={handleCloseModal}
                                            handleAdd={handleAddMaterials}
                                          />

                                          <LabourModal
                                            showLabours={showModalLabour}
                                            handleCloseLabours={handleCloseModalLabour}
                                            handleAdd={handleAddLabours}
                                          />

                                          <AssetModal
                                            showAssets={showModalAsset}
                                            handleCloseAssets={handleCloseModalAsset}
                                            handleAdd={handleAddAssets}
                                          />
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                )
                                )}

                              </tbody>
                            </table>
                          </div>
                          <div className="row mt-3 mx-3">
                            <p>
                              <button
                                style={{ color: "var(--red)" }}
                                className="fw-bold text-decoration-underline border-0 bg-white"
                                onClick={addRowToTable1}
                              >
                                Add Row
                              </button>{" "}
                              |
                              <button
                                style={{ color: "var(--red)" }}
                                className="fw-bold text-decoration-underline border-0 bg-white"
                                onClick={() => deleteRowFromTable1(counter)}
                              >
                                Delete Row
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </CollapsibleCard>
                </>
              )}

            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-2">
                <button className="purple-btn2 w-100" fdprocessedid="u33pye" onClick={handleSubmit}>
                  Create
                </button>
              </div>
              <div className="col-md-2">
                <button className="purple-btn1 w-100" fdprocessedid="u33pye">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Modal start */}
      {/* material modal */}
      {/* <Modal
        centered
        size="lg"
        show={materialshowModal}
        onHide={closeModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Material</h5>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div className="">
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  fdprocessedid="cda5b"
                >
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div>
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead >
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Material Type</th>
                  <th>Material Sub-Type</th>
                  <th>Material</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>KGS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>AGGREGATE</td>
                  <td>KAPCHI</td>
                  <td>KAPCHI</td>
                  <td>cft</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>

      </Modal> */}
      {/* material modal */}

      {/* Assest modal */}
      {/* <Modal
        centered
        size="lg"
        show={assetShowModal}
        onHide={closeAssestModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Asset</h5>
        </Modal.Header>
        <Modal.Body> */}
      {/* Pagination and Display options */}
      {/* <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div> */}

      {/* Table for Assets */}
      {/* <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Asset Type</th>
                  <th>Asset Sub-Type</th>
                  <th>Asset</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>NOS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>21'' IMAC Desktop 4K</td>
                  <td>21'' IMAC Desktop 4K Retina Display</td>
                  <td>21" IMAC Desktop 4K Retina Display</td>
                  <td>NOS</td>
                </tr>
              </tbody>
            </table>
          </div> */}

      {/* Add Button */}
      {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeAssestModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
      {/* Assest modal */}

      {/* Labour modal */}
      {/* <Modal
        centered
        size="lg"
        show={labourShowModal}
        onHide={closeLabourModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Labour</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Pagination and Display options */}
      {/* <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div> */}

      {/* Table for Labour */}
      {/* <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Labour Category</th>
                  <th>Material Sub-Category</th>
                  <th>Labour Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
              </tbody>
            </table>
          </div> */}

      {/* Add Button */}
      {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeLabourModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
      {/* Labour modal */}

      {/* Modal end */}
    </>
  );
};

export default CreateBOQ;
