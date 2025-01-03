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

                {/* <div className="input-group mx-3" style={{width:'400px'}}>
                    <input
                        type="text"
                        name="s[name_cont]"
                        id="s_name_cont"
                        className="form-control tbl-search table_search"
                        placeholder="Type your keywords here"
                    />
                    <div className="input-group-append">
                        <button type="submit" className="btn btn-md btn-default"
                            style={{
                                borderTopRightRadius: '5px', // Top-right corner
                                borderBottomRightRadius: '5px', // Bottom-right corner
                                borderTopLeftRadius: '0px', // Top-left corner
                                borderBottomLeftRadius: '0px', // Bottom-left corner
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                                    fill="#8B0203"
                                ></path>
                                <path
                                    d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                                    fill="#8B0203"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div> */}

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
