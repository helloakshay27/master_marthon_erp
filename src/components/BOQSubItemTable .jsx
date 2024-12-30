import React from 'react'
import '../styles/mor.css'
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from './base/Card/CollapsibleCards';
import MaterialModal from "../components/MaterialModal";
import LabourModal from "../components/LabourModal";
import AssetModal from "../components/AssestModal";


const BOQSubItemTable = ({ 
  materials,
  setMaterials,
  labours,
  Assets,
  handleAddMaterials,
  handleDeleteAll,
  handleSelectRow,
  handleAddLabours,
  handleDeleteAllLabour,
  handleSelectRowLabour,
  handleAddAssets,
  handleDeleteAllAssets,
  handleSelectRowAssets,}) => {
  const [materialshowModal, setmaterialShowModal] = useState(false);
  const [assetShowModal, setAssetShowModal] = useState(false);
  const [labourShowModal, setLabourShowModal] = useState(false);

  const openModal = () => setmaterialShowModal(true);
  const closeModal = () => setmaterialShowModal(false);

  const openAssestModal = () => setAssetShowModal(true);
  const closeAssestModal = () => setAssetShowModal(false);

  const openLabourModal = () => setLabourShowModal(true);
  const closeLabourModal = () => setLabourShowModal(false);


 
  //Material modal and table data handle add or delete

  const [showModal, setShowModal] = useState(false);
  // const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]); // To track selected rows
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // const handleAddMaterials = (newMaterials) => {
  //   setMaterials((prev) => [
  //     ...prev,
  //     ...newMaterials.filter(
  //       (material) => !prev.some((m) => m.name === material.name)
  //     ),
  //   ]);
  // };

  // console.log("materials", materials)

  const handleDeleteRow = (materialToDelete) => {
    setMaterials((prev) =>
      prev.filter((material) => material.name !== materialToDelete.name)
    );
  };

  const handleDeleteAllMaterial = () => {
    setMaterials((prev) =>
      prev.filter((material) => !selectedMaterials.includes(material.name))
    );
    setSelectedMaterials([]); // Reset selected materials
  };

  const handleSelectRowMaterial = (materialName) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialName)
        ? prev.filter((name) => name !== materialName) // Unselect the material
        : [...prev, materialName] // Select the material
    );
  };

  //labour modal and table data handle add or delete
  const [showModalLabour, setShowModalLabour] = useState(false);
  // const [labours, setLabours] = useState([]);
  const [selectedlabours, setSelectedLabours] = useState([])
  const handleOpenModalLabour = () => setShowModalLabour(true);
  const handleCloseModalLabour = () => setShowModalLabour(false);


  // const handleAddLabours = (newlabours) => {
  //   setLabours((prev) => [
  //     ...prev,
  //     ...newlabours.filter(
  //       (labours) => !prev.some((m) => m.labourType === labours.labourType)
  //     ),
  //   ]);
  // };

  // const handleDeleteAllLabour = () => {
  //   setLabours((prev) =>
  //     prev.filter((labours) => !selectedlabours.includes(labours.labourType))
  //   );
  //   setSelectedLabours([]); // Reset selected materials
  // };

  // const handleSelectRowLabour = (labourType) => {
  //   setSelectedLabours((prev) =>
  //     prev.includes(labourType)
  //       ? prev.filter((type) => type !== labourType) // Unselect the material
  //       : [...prev, labourType] // Select the material
  //   );
  // };

  //asset modal and table data handle add or delete
  const [showModalAsset, setShowModalAsset] = useState(false);
  // const [Assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([])
  const handleOpenModalAsset = () => setShowModalAsset(true);
  const handleCloseModalAsset = () => setShowModalAsset(false);


  // const handleAddAssets = (newAsset) => {
  //   setAssets((prev) => [
  //     ...prev,
  //     ...newAsset.filter(
  //       (asset) => !prev.some((a) => a.assetType === asset.assetType)
  //     ),
  //   ]);
  // };

  // const handleDeleteAllAssets = () => {
  //   setAssets((prev) =>
  //     prev.filter((asset) => !selectedAssets.includes(asset.assetType))
  //   );
  //   setSelectedAssets([]); // Reset selected materials
  // };

  // const handleSelectRowAssets = (assetType) => {
  //   setSelectedAssets((prev) =>
  //     prev.includes(assetType)
  //       ? prev.filter((type) => type !== assetType) // Unselect the material
  //       : [...prev, assetType] // Select the material
  //   );
  // };




  return (
    <>
      <div className="collapse show">
        <div className="" style={{ width: "77vw", maxWidth: "100%" }}>
          <CollapsibleCard title="Material">
            <div className="card   mx-3 mt-2">
              <div className="card-body mt-0 pt-0" >
                <div className="tbl-container mx-3 mt-1">
                  <table className="w-100" id="table1">
                    <thead style={{ zIndex: "0" }}>
                      <tr>
                        <th rowSpan={2}>
                          <input type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMaterials(materials.map((m) => m.name)); // Select all
                              } else {
                                setSelectedMaterials([]); // Deselect all
                              }
                            }}
                            checked={selectedMaterials.length === materials.length}
                          />
                        </th>
                        <th rowSpan={2}>Material Type</th>
                        <th rowSpan={2}>Material Sub-Type</th>
                        <th rowSpan={2}>Material</th>
                        <th rowSpan={2}>Generic Specification</th>
                        <th rowSpan={2}>Colour </th>
                        <th rowSpan={2}>Brand </th>
                        <th rowSpan={2}>UOM</th>
                        <th rowSpan={2}>Cost QTY</th>
                        <th colSpan={2}>Cost</th>
                        <th rowSpan={2}>Wastage</th>
                        <th rowSpan={2}>Total Estimated Qty Wastage</th>
                      </tr>
                      <tr>
                        <th>Co-Efficient Factor</th>
                        <th rowSpan={2}>Estimated Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.length > 0 ? (
                        materials.map((material, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                className="ms-5"
                                type="checkbox"
                                checked={selectedMaterials.includes(material.name)} // Check if material is selected
                                onChange={() => handleSelectRowMaterial(material.name)} // Toggle selection
                              />
                            </td>
                            <td>{material.type}</td>
                            <td>{material.subType}</td>
                            <td>{material.name}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{material.uom}</td>
                            <td></td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
                              />
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No materials added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row mt-3 mx-3">
                  <p>
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myCreateFunction('table1')"
                      onClick={handleOpenModal}
                    >
                      Add Material
                    </button>{" "}
                    |
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myDeleteFunction('table1')"
                      onClick={handleDeleteAllMaterial}
                    >
                      Delete Material
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>
          <MaterialModal
            show={showModal}
            handleClose={handleCloseModal}
            handleAdd={handleAddMaterials}
          />

          <CollapsibleCard title="Labour">
            <div className="card mx-3 mt-2">


              <div className="card-body mt-0 pt-0">
                <div className="tbl-container mx-3 mt-1">
                  <table className="w-100" id="table2">
                    <thead style={{ zIndex: "0" }}>
                      <tr>
                        <th rowSpan={2}>
                          <input type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLabours(labours.map((m) => m.labourType)); // Select all
                              } else {
                                setSelectedLabours([]); // Deselect all
                              }
                            }}
                            checked={selectedlabours.length === labours.length}
                          />
                        </th>
                        <th rowSpan={2}>Labour Type</th>
                        <th rowSpan={2}>Labour Sub-Type</th>
                        <th rowSpan={2}>Labour</th>
                        <th rowSpan={2}>UOM</th>
                        <th colSpan={2}>Cost</th>
                      </tr>
                      <tr>
                        <th>Co-Efficient Factor</th>
                        <th rowSpan={2}>Estimated Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labours.length > 0 ? (
                        labours.map((labours, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                className="ms-5"
                                type="checkbox"
                                checked={selectedlabours.includes(labours.labourType)} // Check if material is selected
                                onChange={() => handleSelectRowLabour(labours.labourType)} // Toggle selection
                              />
                            </td>

                            <td>{labours.labourCategory}</td>
                            <td>{labours.materialSubCategory}</td>
                            <td>{labours.labourType}</td>
                            <td></td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No labour added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row mt-3 mx-3">
                  <p>
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myCreateFunction('table2')"
                      onClick={handleOpenModalLabour}
                    >
                      Add Labour
                    </button>{" "}
                    |
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      onclick="myDeleteFunction('table2')"
                      onClick={handleDeleteAllLabour}
                    >
                      Delete Labour
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>

          <LabourModal
            showLabours={showModalLabour}
            handleCloseLabours={handleCloseModalLabour}
            handleAdd={handleAddLabours}
          />

          <CollapsibleCard title="Assests">
            <div className="card  mx-3 mt-2">
              <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
                <div className="tbl-container mx-3 mt-1">
                  <table className="w-100" id="table3">
                    <thead style={{ zIndex: "0" }}>
                      <tr>
                        <th rowSpan={2}>
                          <input type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAssets(Assets.map((a) => a.assetType)); // Select all
                              } else {
                                setSelectedAssets([]); // Deselect all
                              }
                            }}
                            checked={selectedAssets.length === Assets.length}
                          />
                        </th>
                        <th rowSpan={2}>Assest Type</th>
                        <th rowSpan={2}>Assest Sub-Type</th>
                        <th rowSpan={2}>Assest</th>
                        <th rowSpan={2}>UOM</th>
                        <th colSpan={2}>Cost</th>
                      </tr>
                      <tr>
                        <th>Co-Efficient Factor</th>
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

                            <td>{assets.assetType}</td>
                            <td>{assets.assetSubType}</td>
                            <td>{assets.asset}</td>
                            <td>{assets.uom}</td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="email"
                                placeholder=""
                                fdprocessedid="qv9ju9"
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
                <div className="row mt-3 mx-3">
                  <p>
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myCreateFunction('table3')"
                      // onClick={openAssestModal}
                      onClick={handleOpenModalAsset}
                    >
                      Add Assests
                    </button>{" "}
                    |
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      onclick="myDeleteFunction('table3')"
                      onClick={handleDeleteAllAssets}
                    >
                      Delete Assests
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </div>
      <AssetModal
        showAssets={showModalAsset}
        handleCloseAssets={handleCloseModalAsset}
        handleAdd={handleAddAssets}
      />


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
              <thead>
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
    </>
  )
}

export default BOQSubItemTable 