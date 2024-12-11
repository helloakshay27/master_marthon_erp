import React from 'react'
import '../styles/mor.css'
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from './base/Card/CollapsibleCards';


const BOQSubItemTable  = () => {
    
    const [submaterialDetails, setsubmaterialDetails] = useState(false);
    const [sublabourDetails, setsublabourDetails] = useState(false);
    const [subassestsDetails, setsubassestsDetails] = useState(false);
    const [materialshowModal, setmaterialShowModal] = useState(false);
    const [assetShowModal, setAssetShowModal] = useState(false);
    const [labourShowModal, setLabourShowModal] = useState(false);
  
    const openModal = () => setmaterialShowModal(true);
    const closeModal = () => setmaterialShowModal(false);

    const openAssestModal = () => setAssetShowModal(true);
    const closeAssestModal = () => setAssetShowModal(false);
  
    const openLabourModal = () => setLabourShowModal(true);
    const closeLabourModal = () => setLabourShowModal(false);

   
      const  submaterialDropdown = () => {
        setsubmaterialDetails(!submaterialDetails);
      };
      const  sublabourDropdown = () => {
        setsublabourDetails(!sublabourDetails);
      };
      const  subassestsDropdown = () => {
        setsubassestsDetails(!subassestsDetails);
      };
  return (
     <>
     <div className="collapse show">
       <div className="" style={{width: "77vw", maxWidth: "100%" }}>
       <CollapsibleCard  title="Material">
              <div className="card   mx-3 mt-2">
               
             
                <div className="card-body mt-0 pt-0" >
                  <div className="tbl-container mx-3 mt-1">
                    <table className="w-100" id="table1">
                      <thead style={{ zIndex: "0" }}>
                        <tr>
                          <th rowSpan={2}>
                            <input type="checkbox" />
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
                        <tr>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>SAND</td>
                          <td>SAND</td>
                          <td>SAND River (Bag)</td>
                          <td>River Sand GOLD</td>
                          <td>Gold</td>
                          <td />
                          <td>Bags</td>
                          <td />
                          <td>1</td>
                          <td>2</td>
                          <td>4%</td>
                          <td>2.08</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row mt-3 mx-3">
                    <p>
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        // onclick="myCreateFunction('table1')"
                        onClick={openModal}
                      >
                        Add Material
                      </button>{" "}
                      |
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        // onclick="myDeleteFunction('table1')"
                        
                      >
                        Delete Material
                      </button>
                    </p>
                  </div>
                </div>
              
              </div>
              </CollapsibleCard>

              <CollapsibleCard  title="Labour">
              <div className="card mx-3 mt-2">
               
               
                <div className="card-body mt-0 pt-0">
                  <div className="tbl-container mx-3 mt-1">
                    <table className="w-100" id="table2">
                      <thead style={{ zIndex: "0" }}>
                        <tr>
                          <th rowSpan={2}>
                            <input type="checkbox" />
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
                        <tr>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row mt-3 mx-3">
                    <p>
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        // onclick="myCreateFunction('table2')"
                        onClick={openLabourModal}
                      >
                        Add Labour
                      </button>{" "}
                      |
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        onclick="myDeleteFunction('table2')"
                      >
                        Delete Labour
                      </button>
                    </p>
                  </div>
           
                </div>
              
              
              </div>
              </CollapsibleCard>

              
              <CollapsibleCard  title="Assests">
              <div className="card  mx-3 mt-2">
              
               
              <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
              <div className="tbl-container mx-3 mt-1">
                <table className="w-100" id="table3">
                  <thead style={{ zIndex: "0" }}>
                    <tr>
                      <th rowSpan={2}>
                        <input type="checkbox" />
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
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-3 mx-3">
                <p>
                  <button
                    style={{ color: "var(--red)" }}
                    className="fw-bold text-decoration-underline border-0 bg-white"
                    // onclick="myCreateFunction('table3')"
                    onClick={openAssestModal}
                  >
                    Add Assests
                  </button>{" "}
                  |
                  <button
                    style={{ color: "var(--red)" }}
                    className="fw-bold text-decoration-underline border-0 bg-white"
                    onclick="myDeleteFunction('table3')"
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

             {/* material modal */}
      <Modal
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
      </Modal>
      {/* material modal */}

      {/* Labour modal */}
      <Modal
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
          </div>

          {/* Table for Labour */}
          <div className="tbl-container mx-3 mt-1">
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
          </div>

          {/* Add Button */}
          <div className="row mt-2 justify-content-center">
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
      </Modal>
      {/* Labour modal */}

        {/* Assest modal */}
        <Modal
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
        <Modal.Body>
          {/* Pagination and Display options */}
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
          </div>

          {/* Table for Assets */}
          <div className="tbl-container mx-3 mt-1">
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
          </div>

          {/* Add Button */}
          <div className="row mt-2 justify-content-center">
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
      </Modal>
      {/* Assest modal */}
     </>
  )
}

export default BOQSubItemTable 