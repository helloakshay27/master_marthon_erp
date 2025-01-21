import React from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
const BillVerificationCreate = () => {
  const [remarkModal, setremarkModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);

  const openremarkModal = () => setremarkModal(true);
  const closeremarkModal = () => setremarkModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">
            Home &gt; Billing &gt; Bill Verification List &gt; Update Bill
            Information
          </a>
          <h5 className="mt-3">Update Bill Information</h5>
          <div className="mor-tabs mt-4">
            <ul
              className="nav nav-pills mb-3 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#create-mor"
                  type="button"
                  role="tab"
                  aria-controls="create-mor"
                  aria-selected="false"
                  fdprocessedid="7mdk1cl"
                >
                  Material
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#mor-approval-create"
                  type="button"
                  role="tab"
                  aria-controls="mor-approval-create"
                  aria-selected="true"
                  fdprocessedid="05u9l8"
                >
                  Service
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  fdprocessedid="zf7dlh"
                >
                  Misc.
                </button>
              </li>
              <li className="nav-item" role="presentation" />
            </ul>
          </div>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3 mx-2">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
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
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
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
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Sub Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
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
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>Vendor Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-1 mt-2">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Acceptance Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Created On</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Mode of Submission</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Due date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="form-group">
                      <label>Vendor Remark</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Supporting Documents</h5>
                  <div className="card-tools d-flex">
                    <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#AttachModal"
                      onClick={openremarkModal}
                    >
                      Revision Req.
                    </button>
                    <div>
                      <button
                        className="purple-btn2 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#RevisionModal"
                        onClick={openattachModal}
                      >
                        Attach Other
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">No. of Documents</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">1</td>
                        <td className="text-start">Tax Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">2</td>
                        <td className="text-start">
                          Site acknowledged challan / Challan cum Invoice
                        </td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">3</td>
                        <td className="text-start">Weighment slips</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">4</td>
                        <td className="text-start"> Lorry receipt</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">5</td>
                        <td className="text-start">E Way bill</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">6</td>
                        <td className="text-start">E Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">7</td>
                        <td className="text-start">Warranty</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td />
                        <td className="text-start">8</td>
                        <td className="text-start">MTC</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Remark</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Assigned To User</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Shamshik
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Status</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Received for Verification
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <h5 className=" mt-3">Audit Log</h5>
              <div className="px-3">
                 <div className="mx-0">
                                                         <Table columns={auditLogColumns} data={auditLogData} />
                                                       </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* attach modal */}
      <Modal
        centered
        size="l"
        show={attachModal}
        onHide={closeattachModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Attach Other Document</h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
    <div className="col-md-12">
      <div className="form-group">
        <label>Name of the Document</label>
        <input
          className="form-control"
          type=""
          placeholder=""
          fdprocessedid="qv9ju9"
        />
      </div>
    </div>
    <div className="col-md-12 mt-2">
      <div className="form-group">
        <form action="/upload" method="post" encType="multipart/form-data">
          {/* <label for="fileInput">Choose File:</label> */}
          <input type="file" id="fileInput" name="attachment" />
        </form>
      </div>
    </div>
  </div>
  <div className="row mt-2 justify-content-center">
    <div className="col-md-4">
      <button className="purple-btn2 w-100" fdprocessedid="u33pye">
        Attach
      </button>
    </div>
    <div className="col-md-4">
      <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
        Cancel
      </button>
    </div>
  </div>
        </Modal.Body>
      </Modal>
      {/* attach modal */}

      {/* remark modal */}
      <Modal
        centered
        size="l"
        show={remarkModal}
        onHide={closeremarkModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Remark</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <div className="form-group">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter ..."
                defaultValue={""}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* remark modal */}
    </>
  );
};

export default BillVerificationCreate;
