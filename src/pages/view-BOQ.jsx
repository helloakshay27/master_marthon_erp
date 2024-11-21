import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

const ViewBOQ = () => {
  const [viewboqDetails, setviewboqDetails] = useState(true);
  const [copyModal, setcopyModal] = useState(false);

  const viewboqDropdown = () => {
    setviewboqDetails(!viewboqDetails);
  };
  const openCopyModal = () => setcopyModal(true);
  const closeCopyModal = () => setcopyModal(false);
  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">Setup &gt; Engineering Setup &gt; BOQ</a>
            <h5 className="mt-4">View BOQ</h5>
            <div className="d-flex justify-content-end">
              <button className="purple-btn2">Create</button>
              <button className="purple-btn2">Export/Import</button>
              <button className="purple-btn2">Delete</button>
              <button
                className="purple-btn2"
                // data-bs-toggle="modal"
                // data-bs-target="#copyModal"
                onClick={openCopyModal}
              >
                Copy
              </button>
            </div>
            <div className="tab-content1 active" id="total-content">
              {/* Total Content Here */}
              <div className="card mt-2 pb-4">
                <div className="card mx-3 mt-2">
                  <div className="card-header3">
                    <h3 className="card-title">View BOQ</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={viewboqDropdown}
                      >
                        <svg
                          width={32}
                          height={32}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={16} cy={16} r={16} fill="#8B0203" />
                          <path
                            d="M16 24L9.0718 12L22.9282 12L16 24Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {viewboqDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Project</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Sub-project</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Wing</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Main Category</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Sub-Category lvl 2</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Sub-Category lvl 3</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Sub-Category lvl 4</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Sub-Category lvl 5</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>BOQ Name</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>BOQ ID</label>
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
                            <label>BOQ Description</label>
                            <textarea
                              className="form-control"
                              rows={1}
                              placeholder="Enter ..."
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Status</label>
                            <select
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
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>From Date</label>
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
                            <label>To Date</label>
                            <input
                              className="form-control"
                              type="date"
                              placeholder=""
                              fdprocessedid="qv9ju9"
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mt-2">
                          <div className="d-flex">
                            <div className="form-group d-flex mt-1">
                              <label className="form-check-label me-3">
                                View BOQ Version List
                              </label>
                              <div className="form-check pe-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">Select One</option>
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
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-start ms-3">
                  <button className="purple-btn2">Collapse All</button>
                </div>
                <div className="tbl-container mx-3 mt-1">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Expand</th>
                        <th className="text-start">Project/Sub-Project</th>
                        <th className="text-start">BOQ ID</th>
                        <th className="text-start">Unit</th>
                        <th className="text-start">Cost Qty</th>
                        <th className="text-start">Cost Rate</th>
                        <th className="text-start">Cost Value</th>
                        <th>
                          <div className="d-flex justify-content-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={14}
                              height={14}
                              fill="currentColor"
                              style={{ marginTop: 3 }}
                              className="bi bi-trash3-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                            </svg>
                            <input className="ms-1 me-1 mb-1" type="checkbox" />
                            <p>Status</p>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-plus-circle row-1"
                            data-group={1}
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                          </svg>
                        </td>
                        <td className="text-start">Sanvo</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start">
                          <div className="d-flex justify-content-center">
                            <input className="pe-2" type="checkbox" />
                            <img
                              data-bs-toggle="modal"
                              data-bs-target="#addnewModal"
                              className="pe-1"
                              src="../Data_Mapping/img/Edit.svg"
                              alt=""
                            />
                            <img
                              className="pe-1"
                              src="../Data_Mapping/img/Delete_red.svg"
                              alt=""
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="row-2" data-group={1}>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-dash-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                          </svg>
                        </td>
                        <td className="text-start">Admin expense</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr className="row-2" data-group={1}>
                        <td className="text-start" />
                        <td className="text-start">Purchase of Item</td>
                        <td className="text-start">187062</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start">Approved</td>
                      </tr>
                      <tr className="row-2" data-group={1}>
                        <td className="text-start" />
                        <td className="text-start"> </td>
                        <td className="text-start" />
                        <td className="text-start">NOS</td>
                        <td className="text-start">6.00000</td>
                        <td className="text-start">483.000000</td>
                        <td className="text-start">2,898.00</td>
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {/* copy modal */}
      <Modal
        size="m"
        show={copyModal}
        onHide={closeCopyModal}
        centered
        className="modal fade"
      >
        <Modal.Header closeButton>
          <h5>Copy</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>From</label>
                <select
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
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>To</label>
                <select
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
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={closeCopyModal}
                fdprocessedid="u33pye"
              >
                Copy
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* copy modal end */}
    </>
  );
};

export default ViewBOQ;
