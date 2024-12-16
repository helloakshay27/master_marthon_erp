import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomPagination from "./CustomPagination";

const AssetModal = ({ showAssets, handleCloseAssets, handleAdd }) => {
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1); // 1-based index
    const [pageSize, setPageSize] = useState(10);

    // Calculate displayed rows for the current page
    const startEntry = (page - 1) * pageSize + 1;
    const endEntry = Math.min(page * pageSize, filteredData.length);


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

    const handleCheckboxChange = (material) => {
        setSelectedMaterials((prev) =>
            prev.some((item) => item.assetType === material.assetType)
                ? prev.filter((item) => item.assetType !== material.assetType) // Unselect
                : [...prev, material] // Select
        );
    };

    const handleSelectAll = (isChecked) => {
        setSelectedMaterials(isChecked ? [...materials] : []); // Select or deselect all
    };

    const handleAddAssets = () => {
        handleAdd(selectedMaterials);
        setSelectedMaterials([]); // Clear selected items
        handleCloseAssets(); // Close the modal
    };

    return (
        <Modal centered size="lg" show={showAssets} onHide={handleCloseAssets}>
            <Modal.Header closeButton>
                <h5>Add Asset</h5>
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

                                <th>Asset Type</th>
                                <th>Asset Sub-Type</th>
                                <th>Asset</th>
                                <th>UOM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedMaterials.some((item) => item.assetType === material.assetType)} // Check if material is selected
                                            onChange={() => handleCheckboxChange(material)} // Toggle selection
                                        />
                                    </td>
                                    <td>{material.assetType}</td>
                                    <td>{material.assetSubType}</td>
                                    <td>{material.asset}</td>
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
                        <button onClick={handleAddAssets} className="purple-btn2 w-100">
                            Add
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AssetModal;
