import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomPagination from "./CustomPagination";

const LabourModal = ({ showLabours, handleCloseLabours, handleAdd }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1); // 1-based index
  const [pageSize, setPageSize] = useState(10);

  // Calculate displayed rows for the current page
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, filteredData.length);



  const materials = [
    {
    //   isSelected: false,
      labourCategory: "Departmental Work",
      materialSubCategory: "RCC",
      labourType: "Carpenter1",
    },
    {
    //   isSelected: false,
      labourCategory: "Departmental Work",
      materialSubCategory: "RCC",
      labourType: "Carpenter2",
    },
  ];

  const handleCheckboxChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.some((item) => item.labourType === material.labourType)
        ? prev.filter((item) => item.labourType !== material.labourType) // Unselect
        : [...prev, material] // Select
    );
  };

  const handleSelectAll = (isChecked) => {
    setSelectedMaterials(isChecked ? [...materials] : []); // Select or deselect all
  };

  const handleAddLabours = () => {
    handleAdd(selectedMaterials);
    setSelectedMaterials([]); // Clear selected items
    handleCloseLabours(); // Close the modal
  };

  return (
    <Modal centered size="lg" show={showLabours} onHide={handleCloseLabours}>
      <Modal.Header closeButton>
        <h5>Add Labour</h5>
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

                  <th>Labour Category</th>
                  <th>Material Sub-Category</th>
                  <th>Labour Type</th>

              </tr>
            </thead>
            <tbody>
              {materials.map((material, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMaterials.some((item) => item.labourType === material.labourType)} // Check if material is selected
                      onChange={() => handleCheckboxChange(material)} // Toggle selection
                    />
                  </td>
                  <td>{material.labourCategory}</td>
                  <td>{material.materialSubCategory}</td>
                  <td>{material.labourType}</td>
                  {/* <td>{material.uom}</td> */}
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
            <button onClick={handleAddLabours} className="purple-btn2 w-100">
              Add
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LabourModal;


