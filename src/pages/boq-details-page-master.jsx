import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";
import { Link } from "react-router-dom";
import {
  LayoutModal,
  Table,
} from "../components"

const BOQDetailsPageMaster = () => {
 // State to manage rows
 const [rows, setRows] = useState([]);
  // Function to add a new row
  const handleAddAttachment = () => {
    setRows([
      ...rows,
      {
        id: Date.now(), // Unique ID based on current time
        documentName: '',
        fileType: '',
        fileName: '',
        uploadedAt: '',
        document: null,
      },
    ]);
  }
    // Function to delete a row
    const handleDeleteRow = (id) => {
      setRows(rows.filter((row) => row.id !== id));
    };
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showAssocoatedModal, setShowAssocoatedModal] = useState(false);



  //   modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openAssocoatedModal = () => setShowAssocoatedModal(true);
  const closeAssocoatedModal = () => setShowAssocoatedModal(false);
  return (
    <>

      <div className="website-content overflow-auto">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">
              Setup &gt; Engineering Setup &gt; BOQ &gt; BOQ Details
            </a>
            <div className="tab-content1 active" id="total-content">
              {/* Total Content Here */}


              <CollapsibleCard title="BOQ Details">

                <div className="row px-3 mt-2">
                  <div className="col-md-12 mb-3 row">
                    <div className="col-md-10">
                      <div className="d-flex justify-content-end m-2 mb-3">
                        {/* <button className="btn  d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#6c757d"
                            className="bi bi-pencil-square me-2"  // "me-2" adds margin to the right of the icon
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>

                        </button> */}

                        <Link to="/boq-edit" className="btn d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="#6c757d"
      className="bi bi-pencil-square me-2"
      viewBox="0 0 16 16"
    >
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
      <path
        fillRule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
      />
    </svg>
  </Link>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>BOQ ID</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Sub-Lvl 5</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Project</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3">Marathon Nexzone</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>BOQ Item Name</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Sub-Project</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>BOQ Description</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Wing</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>UOM</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Main Category</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label> BOQ Qty (Cost)</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Sub-Lvl 2</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Notes</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Sub-Lvl 3</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Remark</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label> Sub-Lvl 4</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>:</span>
                        <span className="me-3"> </span>
                      </label>
                    </div>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard title="BOQ Items">
                {/* <div className="card mx-3 mt-2"> */}


                <div
                  className="card-body mt-0 pt-0"
                  style={{ display: "block" }}
                >

                  <CollapsibleCard title="Materials">

                    <div
                      className="card-body mt-0 pt-0"
                      style={{ display: "block" }}
                    >
                      <div className="tbl-container mx-3 mt-1">
                        <table className="">
                          <thead>
                            <tr>
                              <th rowSpan={2}>Material Type</th>
                              <th rowSpan={2}>Material</th>
                              <th rowSpan={2}>Material Sub-Type</th>
                              <th rowSpan={2}>Generic Specification</th>
                              <th rowSpan={2}>Colour </th>
                              <th rowSpan={2}>Brand </th>
                              <th rowSpan={2}>UOM</th>
                              <th rowSpan={2}>Cost QTY</th>
                              <th colSpan={3}>Cost</th>
                              <th rowSpan={2}>Wastage</th>
                              <th rowSpan={2}>
                                Total Estimated Qty Wastage
                              </th>
                            </tr>
                            <tr>
                              <th>Co-Efficient Factor</th>
                              <th colSpan={2}>Estimated Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>SAND</td>
                                <td>SAND</td>
                              <td>SAND</td>
                              <td>SAND River (BAG)</td>
                              <td>GOLD</td>
                              <td />
                              <td>Bags</td>
                              <td />
                              <td>2</td>
                              <td colSpan={2}>2</td>
                              <td>4%</td>
                              <td>2.08</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>


                  </CollapsibleCard>

                  <CollapsibleCard title="Assests">

                    <div
                      className="card-body mt-0 pt-0"
                      style={{ display: "block" }}
                    >
                      <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th rowSpan={2}>Assest Type</th>
                              <th rowSpan={2}>Assest Sub-Type</th>
                              <th rowSpan={2}>Assest</th>
                              <th rowSpan={2}>UOM</th>
                              <th colSpan={2}>Cost</th>
                            </tr>
                            <tr>
                              <th>Co-Efficient Factor</th>
                              <th colSpan={2}>Estimated Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
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
                    </div>

                  </CollapsibleCard>

                </div>

                {/* </div> */}


                <div className="row mt-3 px-2 mx-3 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="">Document Attachment</h5>
                    <button className="purple-btn1" onClick={handleAddAttachment} style={{ color: '#8b0203' }} >Add Attachments</button>
                  </div>

                  <div className="">
                    {/* <Table columns={auditLogColumns} data={auditLogData} /> */}


                    <div className="tbl-container  mt-1">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Document Name</th>
                            <th rowSpan={2}>File Type </th>
                            <th rowSpan={2}>File Name </th>
                            <th rowSpan={2}>Uploaded At</th>
                            <th rowSpan={2}>Upload File *</th>
                            <th rowSpan={2}>Action</th>
                          </tr>

                        </thead>
                        <tbody>
                        {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="documentName"
                    value={row.documentName}
                    onChange={(e) => handleInputChange(e, row.id)}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="fileType"
                    value={row.fileType}
                    onChange={(e) => handleInputChange(e, row.id)}
                    disabled
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="fileName"
                    value={row.fileName}
                    onChange={(e) => handleInputChange(e, row.id)}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="uploadedAt"
                    value={row.uploadedAt}
                    onChange={(e) => handleInputChange(e, row.id)}
                    disabled
                  />
                </td>
                <td>
                  <input
                    className="attachmod"
                    required
                    type="file"
                    name="document"
                    onChange={(e) => handleFileChange(e, row.id)}
                  />
                </td>
                <td>
                  <a
                    className="text-danger cancel-icon remove_fields"
                    href="#"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <span
                      className="material-symbols-outlined"
                      // style={{ color: '#8b0203' }}
                    >
                      cancel
                    </span>
                  </a>
                </td>
              </tr>
            ))}
                        
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                <div className="row mt-4 px-2 mx-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea className="form-control" rows="3" placeholder=""></textarea>
                    </div>
                  </div>
                </div>

                <div className="row mt-4 justify-content-end align-items-center mx-2">
                  <div className="col-md-3">
                    <div className="form-group d-flex gap-3 align-items-center mx-3">
                      <label style={{ fontSize: '1.1rem' }}>Status</label>
                      <select className="form-control form-select" style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="purple-btn2">Submit</button>
                  <button className="purple-btn1">Cancel</button>
                </div>
              </CollapsibleCard>


              <div className="row mt-2 justify-content-center">
                {/* <div className="col-md-2">
                  <button
                    className="purple-btn2 w-100"
                    fdprocessedid="u33pye"
                  >
                    Amend
                  </button>
                </div> */}
                {/* <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    fdprocessedid="u33pye"
                  >
                    Back
                  </button>
                </div> */}
              </div>

              <div className="row mx-2 mt-2">
                <h5>Audit Log</h5>
                <div className="">
                  <Table columns={auditLogColumns} data={auditLogData} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Modal start */}
      <Modal size="lg" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <h5>BOQ Documents</h5>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Thumbnail Images */}
            <img src="#" className="img-thumbnail" alt="Document 1" />
            <img src="#" className="img-thumbnail" alt="Document 2" />
          </div>

          {/* Documents Table */}
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Documents</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src="#" className="img-fluid" alt="Document Preview" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showAssocoatedModal}
        onHide={closeAssocoatedModal}
        centered
      >
        <Modal.Header closeButton>
          <h5>BOQ Associated Work Orders</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="details_page">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Main Category</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>FLAT FINISHING
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Sub-Lvl 2</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Plastor -FF
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Sub-Lvl 3</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Plastor -FF1
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>BOQ Name</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Gypsum Work
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>BOQ ID</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>167379
                  </label>
                </div>
              </div>
            </div>
            <div className="tbl-container mx-3 mt-1">
              <table className="w-100 table table-bordered">
                <thead>
                  <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                    <th>Column 4</th>
                    <th>Column 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                    <td>Data 3</td>
                    <td>Data 4</td>
                    <td>Data 5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BOQDetailsPageMaster;
