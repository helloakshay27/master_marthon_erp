import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

const BOQDetailsPageMaster = () => {
  const [boqDetails, setboqDetails] = useState(true);
  const [boqItemDetails, setboqItemDetails] = useState(true);
  const [materialTypeDetails, setmaterialTypeDetails] = useState(false);
  const [labourTypeDetails, setlabourTypeDetails] = useState(false);
  const [assestTypeDetails, setassestTypeDetails] = useState(false);
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showAssocoatedModal, setShowAssocoatedModal] = useState(false);

  const boqDetailsDropdown = () => {
    setboqDetails(!boqDetails);
  };
  const boqItemDropdown = () => {
    setboqItemDetails(!boqItemDetails);
  };
  const materialTypeDropdown = () => {
    setmaterialTypeDetails(!materialTypeDetails);
  };
  const labourTypeDropdown = () => {
    setlabourTypeDetails(!labourTypeDetails);
  };
  const assestTypeDropdown = () => {
    setassestTypeDetails(!assestTypeDetails);
  };
  //   modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openAssocoatedModal = () => setShowAssocoatedModal(true);
  const closeAssocoatedModal = () => setShowAssocoatedModal(false);
  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="website-content overflow-auto">
            <div className="module-data-section p-4">
              <a href="">
                Setup &gt; Engineering Setup &gt; BOQ &gt; BOQ Details
              </a>
              <div className="tab-content1 active" id="total-content">
                {/* Total Content Here */}
                <div className="card  mt-3 collapsed-card">
                  <div className="card-header3">
                    <h3 className="card-title">BOQ Details</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={boqDetailsDropdown}
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
                  {boqDetails && (
                    <div
                      className="card-body mt-0 pt-0"
                      style={{ display: "block" }}
                    >
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>BOQ ID</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder={56914}
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Project</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Nexzone Phase II"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Sub-Project</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Cedar"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Wing</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Wing A"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Main Category</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Flat finishing"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 2</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=" "
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 3</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=" "
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 4</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=" "
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Sub-Lvl 5</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=" "
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Item Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Tiling Acid Wash "
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mt-2">
                          <div className="form-group">
                            <label>BOQ Description</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Supply Fabrication & Installation of MS "
                              disabled
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>UOM</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="MTR"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Qty (Cost)</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder={0.0}
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Rate (Cost)</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder={0.0}
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>BOQ Amount (Cost)</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="INR 0.00"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mt-2">
                          <div className="form-group">
                            <label>Notes</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder=""
                              disabled
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mt-2">
                          <div className="form-group">
                            <label>Remark</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder=""
                              disabled
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-2">
                          <div className="form-group">
                            <label>Status</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Approved"
                              fdprocessedid="qv9ju9"
                              disabled
                            />
                            <p
                              onClick={openAssocoatedModal}
                              className="text-decoration-underline mt-1"
                              // data-bs-toggle="modal"
                              // data-bs-target="#assocoatedModal"
                            >
                              View Associated Work Orders
                            </p>
                          </div>
                        </div>
                        <div className="col-md-3 mt-4">
                          <div className="form-group">
                            <label className="me-4">Is Active</label>
                            <input
                              className=""
                              type="checkbox"
                              placeholder="Sumitted"
                              fdprocessedid="qv9ju9"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mt-4">
                          <div className="form-group">
                            <label className="me-5">BOQ Amount (Cost)</label>
                            <svg
                              onClick={openModal}
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              fill="currentColor"
                              className="bi bi-file-earmark-medical"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                          </div>
                        </div>
                        <div className="collapse" id="collapseExample">
                          <div className="row">
                            <div className="col-md-3 mt-5">
                              <div className="form-group">
                                {/* <label></label> */}
                                <select
                                  className="form-control form-select"
                                  style={{ width: "100%" }}
                                >
                                  <option selected="selected">Select</option>
                                  <option>Approved</option>
                                  <option>Rejected</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6 mt-1">
                              <div className="form-group">
                                <label>Remarks</label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder=""
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2 justify-content-center">
                            <div className="col-md-2">
                              <button
                                className="purple-btn2 w-100"
                                fdprocessedid="u33pye"
                              >
                                Create
                              </button>
                            </div>
                            <div className="col-md-2">
                              <button
                                className="purple-btn1 w-100"
                                fdprocessedid="af5l5g"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card mt-3 collapsed-card">
                  <div className="card-header3">
                    <h3 className="card-title">BOQ Item</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={boqItemDropdown}
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
                  {boqItemDetails && (
                    <div
                      className="card-body mt-0 pt-0"
                      style={{ display: "block" }}
                    >
                      <div className="card mx-3 mt-2 ">
                        <div className="card-header3">
                          <h3 className="card-title">Material Type</h3>
                          <div className="card-tools">
                            <button
                              type="button"
                              className="btn btn-tool"
                              data-card-widget="collapse"
                              onClick={materialTypeDropdown}
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
                        {materialTypeDetails && (
                          <div
                            className="card-body mt-0 pt-0"
                            style={{ display: "block" }}
                          >
                            <div className="tbl-container mx-3 mt-1">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Material Type</th>
                                    <th rowSpan={2}>Material Sub-Type</th>
                                    <th rowSpan={2}>Material</th>
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
                                    <td>SAND River (BAG)</td>
                                    <td>SAND River (BAG)</td>
                                    <td>GOLD</td>
                                    <td />
                                    <td>Bags</td>
                                    <td />
                                    <td>2</td>
                                    <td>2</td>
                                    <td>4%</td>
                                    <td>2.08</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="card mx-3 mt-2 collapsed-card">
                        <div className="card-header3">
                          <h3 className="card-title">Labour Type</h3>
                          <div className="card-tools">
                            <button
                              type="button"
                              className="btn btn-tool"
                              data-card-widget="collapse"
                              onClick={labourTypeDropdown}
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
                        {labourTypeDetails && (
                          <div
                            className="card-body mt-0 pt-0"
                            style={{ display: "block" }}
                          >
                            <div className="tbl-container mx-3 mt-1">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Labour Type</th>
                                    <th rowSpan={2}>Labour Sub-Type</th>
                                    <th rowSpan={2}>Labour</th>
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
                        )}
                      </div>
                      <div className="card mx-3 mt-2 collapsed-card">
                        <div className="card-header3">
                          <h3 className="card-title">Assest Type</h3>
                          <div className="card-tools">
                            <button
                              type="button"
                              className="btn btn-tool"
                              data-card-widget="collapse"
                              onClick={assestTypeDropdown}
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
                        {assestTypeDetails && (
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
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-2">
                    <button
                      className="purple-btn2 w-100"
                      fdprocessedid="u33pye"
                    >
                      Amend
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="purple-btn1 w-100"
                      fdprocessedid="u33pye"
                    >
                      Back
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 px-2">
                    <h5>Audit Log</h5>
                    <div className="tbl-container me-2 mt-3">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Pratham Shastri</td>
                            <td>15-02-2024</td>
                            <td>Verified</td>
                            <td>Verified &amp; Processed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer">
              <p className="">
                Powered by <img src="./images/go-logo.JPG" />
              </p>
            </footer>
          </div>
        </div>
        <Footer />
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
