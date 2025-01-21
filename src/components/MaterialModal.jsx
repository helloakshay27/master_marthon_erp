// import React, { useState } from "react";
// import Modal from "react-bootstrap/Modal";
// import CollapsibleCard from "./base/Card/CollapsibleCards";

// const MaterialModal = ({ show, handleClose, handleAdd }) => {
//     const [selectedMaterials, setSelectedMaterials] = useState([]);

//     // Sample material data
//     const materials = [
//         { type: "ADMIXTURE", subType: "ADMIXTURE", name: "ADMIXTURE", uom: "KGS" },
//         { type: "AGGREGATE", subType: "KAPCHI", name: "KAPCHI", uom: "CFT" },
//     ];

//     const handleCheckboxChange = (material) => {
//         // setSelectedMaterials((prev) =>
//         //     prev.includes(material)
//         //         ? prev.filter((item) => item !== material) // Unselect if already selected
//         //         : [...prev, material] // Select if not already selected
//         // );

//         setSelectedMaterials((prev) =>
//             prev.some((item) => item.name === material.name)
//               ? prev.filter((item) => item.name !== material.name) // Unselect
//               : [...prev, material] // Select
//           );
//     };

//     const handleSelectAll = (isChecked) => {
//         setSelectedMaterials(isChecked ? [...materials] : []); // Select or deselect all
//     };

//     const handleAddMaterials = () => {
//         handleAdd(selectedMaterials);
//         setSelectedMaterials([]); // Clear selected items
//         handleClose(); // Close the modal
//     };

//     return (
//         <Modal centered size="lg" show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <h5>Add Material</h5>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="tbl-container mx-3 mt-1">
//                     <table className="w-100">
//                         <thead>
//                             <tr>
//                                 <th>
//                                     <input
//                                         type="checkbox"
//                                         onChange={(e) => handleSelectAll(e.target.checked)}
//                                         checked={selectedMaterials.length === materials.length}
//                                     />
//                                 </th>
//                                 <th>Material Type</th>
//                                 <th>Material Sub-Type</th>
//                                 <th>Material</th>
//                                 <th>UOM</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {materials.map((material, index) => (
//                                 <tr key={index}>
//                                     <td>
//                                         {/* <input
//                       type="checkbox"
//                       checked={selectedMaterials.includes(material)}
//                       onChange={() => handleCheckboxChange(material)}
//                     /> */}

//                                         <input
//                                             type="checkbox"
//                                             checked={selectedMaterials.some((item) => item.name === material.name)} // Check if material is selected
//                                             onChange={() => handleCheckboxChange(material)} // Toggle selection
//                                         />
//                                     </td>
//                                     <td>{material.type}</td>
//                                     <td>{material.subType}</td>
//                                     <td>{material.name}</td>
//                                     <td>{material.uom}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="row mt-2 justify-content-center">
//                     <div className="col-md-2">
//                         <button onClick={handleAddMaterials} className="purple-btn2 w-100">
//                             Add
//                         </button>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };



// const MaterialTable = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [materials, setMaterials] = useState([]);
//     const [selectedMaterials, setSelectedMaterials] = useState([]); // To track selected rows

//     const handleOpenModal = () => setShowModal(true);
//     const handleCloseModal = () => setShowModal(false);

//     const handleAddMaterials = (newMaterials) => {
//       setMaterials((prev) => [
//         ...prev,
//         ...newMaterials.filter(
//           (material) => !prev.some((m) => m.name === material.name)
//         ),
//       ]);
//     };

//     const handleDeleteRow = (materialToDelete) => {
//       setMaterials((prev) =>
//         prev.filter((material) => material.name !== materialToDelete.name)
//       );
//     };

//     const handleDeleteAll = () => {
//       setMaterials((prev) =>
//         prev.filter((material) => !selectedMaterials.includes(material.name))
//       );
//       setSelectedMaterials([]); // Reset selected materials
//     };

//     const handleSelectRow = (materialName) => {
//       setSelectedMaterials((prev) =>
//         prev.includes(materialName)
//           ? prev.filter((name) => name !== materialName) // Unselect the material
//           : [...prev, materialName] // Select the material
//       );
//     };

//     return (
//       <>
//         <CollapsibleCard title="Material">
//           <div className="card mx-3 mt-2">
//             <div className="card-body mt-0 pt-0">
//               <div className="tbl-container mx-3 mt-1">
//                 <table className="w-100">
//                   <thead>
//                     <tr>
//                       <th rowSpan={2}>
//                         <div className="d-flex justify-content-center">
//                           <input
//                             type="checkbox"
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedMaterials(materials.map((m) => m.name)); // Select all
//                               } else {
//                                 setSelectedMaterials([]); // Deselect all
//                               }
//                             }}
//                             checked={selectedMaterials.length === materials.length}
//                           />
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width={14}
//                             height={14}
//                             fill="currentColor"
//                             className="bi bi-trash3-fill ms-2"
//                             viewBox="0 0 16 16"
//                             onClick={handleDeleteAll} // Delete selected rows on click
//                           >
//                             <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
//                           </svg>
//                         </div>
//                       </th>
//                       <th>Material Type</th>
//                       <th>Material Sub-Type</th>
//                       <th>Material</th>
//                       <th>UOM</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {materials.length > 0 ? (
//                       materials.map((material, index) => (
//                         <tr key={index}>
//                           <td>
//                             <input
//                               className="ms-5"
//                               type="checkbox"
//                               checked={selectedMaterials.includes(material.name)} // Check if material is selected
//                               onChange={() => handleSelectRow(material.name)} // Toggle selection
//                             />
//                           </td>
//                           <td>{material.type}</td>
//                           <td>{material.subType}</td>
//                           <td>{material.name}</td>
//                           <td>{material.uom}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">
//                           No materials added yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div>
//                 <p
//                   className="pe-auto"
//                   style={{ cursor: "pointer" }}
//                   onClick={handleOpenModal}
//                 >
//                   Add Material
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CollapsibleCard>
//         <MaterialModal
//           show={showModal}
//           handleClose={handleCloseModal}
//           handleAdd={handleAddMaterials}
//         />
//       </>
//     );
//   };

// export default MaterialTable;


// MaterialModal.js
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomPagination from "./CustomPagination";
import SingleSelector from "./base/Select/SingleSelector";
import MultiSelector from "./base/Select/MultiSelector";

const MaterialModal = ({ show, handleClose, handleAdd }) => {
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

  const projects = [
    { value: '29', label: 'NEXZONE' },
    { value: '30', label: 'asdf' },
    { value: '31', label: 'Marathon Nexzone' },
  ];

  const materialTypes = [
    { value: '57', label: 'Test' },
    { value: '63', label: 'DOOR WORK' },
    { value: '64', label: 'CEMENT' },
    { value: '65', label: 'AGGREGATE' },
    { value: '66', label: 'SAND' },
    { value: '67', label: 'ADHESIVE' },
    { value: '68', label: 'FINES' },
    { value: '69', label: 'CONCRETE' },
    { value: '70', label: 'STEEL-TMT' },
    { value: '71', label: 'BINDING WIRE' },
    { value: '72', label: 'COVER BLOCK' },
    { value: '73', label: 'BLOCK' },
    { value: '74', label: 'READYMADE PLASTER' },
    { value: '75', label: 'TILES' },
  ];

  const materialSubTypes = [
    { value: '41', label: 'WOODEN DOOR FRAME & SHUTTER' },
    { value: '42', label: 'WOODEN DOOR FRAME' },
    { value: '43', label: 'WOODEN DOOR SHUTTER' },
    { value: '44', label: 'GI FRAME AND SHUTTER' },
    { value: '45', label: 'WPC DOOR FRAME' },
  ];

  const materials = [
    { value: '44', label: 'BED ROOM' },
    { value: '45', label: '1 HRS FRD MAIN DOOR' },
    { value: '46', label: '2 HRS FRD MAIN DOOR' },
    { value: '47', label: 'TOILET DOOR' },
    { value: '48', label: '2 HRS FRD STAIRCASE DOOR' },
  ];

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

  const handleReset = () => {
    setSelectedProject([]);
    setSelectedSubProject([]);
    setSelectedMorNo([]);
    setSelectedMaterialType([]);
    setSelectedMaterialSubType([]);
    setMorStartDate('');
    setMorEndDate('');
    setSelectedMaterial([]);
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
      prev.some((item) => item.name === material.name)
        ? prev.filter((item) => item.name !== material.name) // Unselect
        : [...prev, material] // Select
    );
  };

  const handleSelectAll = (isChecked) => {
    setSelectedMaterials(isChecked ? [...materials] : []); // Select or deselect all
  };

  const handleAddMaterials = () => {
    handleAdd(selectedMaterials);
    setSelectedMaterials([]); // Clear selected items
    handleClose(); // Close the modal
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

  return (
    <Modal centered size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h5>Add Material</h5>
      </Modal.Header>
      <Modal.Body>

        <form onSubmit={handleSubmit} acceptCharset="UTF-8">
          <div className="row">
            <h5 className="">Search Material</h5>
         
            <div className="col-md-4 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material Type</label>
                <MultiSelector
                  options={options}
                  // value={values[label]} // Pass current value
                  placeholder={`Select Material Type`} // Dynamic placeholder
                  // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                />
              </div>
            </div>
            <div className="col-md-4 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material Sub Type</label>
                <MultiSelector
                  options={options}
                  // value={values[label]} // Pass current value
                  placeholder={`Select Material Sub Type`} // Dynamic placeholder
                // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                />
              </div>
            </div>
            <div className="col-md-4 mt-3">
              <div className="form-group">
                <label className="po-fontBold">Material</label>
                <MultiSelector
                  options={options}
                  // value={values[label]} // Pass current value
                  placeholder={`Select Material`} // Dynamic placeholder
                // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                />
              </div>
            </div>
            <div className="row mt-2 justify-content-center mt-3">
              <div className="col-md-1">
                <button type="submit" className="purple-btn2 update_mor">
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
      
      <h5 className="mt-3">Material List</h5>
        <div className="tbl-container me-2 mt-3">
          <table className="w-100">
            <thead>
              <tr>
                {/* <th rowSpan={2}></th>
                <th rowSpan={2}>Project</th>
                <th rowSpan={2}>Sub Project</th> */}
                {/* <th rowSpan={2}>Mor No.</th> */}
                {/* <th rowSpan={2}>Mor Date</th> */}
                <th rowSpan={2}>
                  <input type="checkbox" className="all-materials" />
                </th>
                <th colSpan="4">Material Details</th>
              </tr>
              <tr>
                <th  rowSpan={2}>Material-Type</th>
                <th  rowSpan={2}>Material</th>
                <th  rowSpan={2}>UOM</th>
                {/* <th>MOR Qty</th>
                <th>Prev. Order Qty</th>
                <th>Current Order Quantity</th>
                <th>Generic Specification</th>
                <th>Brand</th>
                <th>Color</th>
                <th>Current Status</th> */}
              </tr>
            </thead>
            <tbody className="material_details">
              <tr>
                {/* <td><input type="checkbox" className="all-materials" /></td>
                <td>maxima</td>
                <td>monte</td> */}
                {/* <td>MOR/728/02/2024	</td> */}
                {/* <td>01/10/2024</td> */}
                <td>
                  <input type="checkbox" className="all-materials" />
                </td>
                <td>DOOR WORK-GI FRAME AND SHUTTER-1 </td>
                
                <td></td>
                <td>
                  {/* <SingleSelector
                    //  options={options}
                    placeholder={`Select UOM`}
                  /> */}

                </td>
                {/* <td>100.0	</td>
                <td>0.0</td> */}
                {/* <td>
                  <input
                    className="form-control"
                    type="text"

                  /> */}
                {/* </td> */}
                {/* <td>
                  <SingleSelector
                    options={options}
                    placeholder={`Select Generic Specification`}
                  /> */}

                {/* </td> */}
                {/* <td>
                  <SingleSelector
                    options={options}
                    placeholder={`Select Brand`}
                  />

                </td> */}
                {/* <td>
                  <SingleSelector
                    options={options}
                    placeholder={`Select Color`}
                  />

                </td> */}
                {/* <td>Purchase Accepted</td> */}

              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal-footer justify-content-center">
          <button type="button" className="purple-btn2 submit_mor">
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


