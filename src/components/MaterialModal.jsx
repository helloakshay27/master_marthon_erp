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

const MaterialModal = ({ show, handleClose, handleAdd }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1); // 1-based index
  const [pageSize, setPageSize] = useState(10);

  // Calculate displayed rows for the current page
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, filteredData.length);
  
//another way here
//    const startIndex = (page - 1) * pageSize;
//   const paginatedMaterials = materials.slice(startIndex, startIndex + pageSize);

  // Sample material data
  const materials = [
    { type: "ADMIXTURE", subType: "ADMIXTURE", name: "ADMIXTURE", uom: "KGS" },
    { type: "AGGREGATE1", subType: "KAPCHI1", name: "KAPCHI1", uom: "CFT" },
    { type: "AGGREGATE2", subType: "KAPCHI2", name: "KAPCHI2", uom: "CFT" },
    { type: "AGGREGATE3", subType: "KAPCHI3", name: "KAPCHI3", uom: "CFT" },
  ];

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

  return (
    <Modal centered size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h5>Add Material</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="tbl-container mx-3 mt-1">
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
        </div>
        
        <CustomPagination
          totalEntries={materials.length}
          page={page}
          pageSize={pageSize}
          onPageChange={(value) => setPage(value)}
        />
        <div className="row mt-2 justify-content-center">
          <div className="col-md-2">
            <button onClick={handleAddMaterials} className="purple-btn2 w-100">
              Add
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MaterialModal;


