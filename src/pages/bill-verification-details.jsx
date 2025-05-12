import React from 'react'
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState,useEffect } from "react";
import SingleSelector from '../components/base/Select/SingleSelector';
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useParams } from "react-router-dom"
import axios from 'axios';

const BillVerificationDetails = () => {
   const { id } = useParams();
   const [billDetails, setBillDetails] = useState(null);
  const [attachModal, setattachModal] = useState(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
   const [remarkModal, setremarkModal] = useState(false);
    // const [attachModal, setattachModal] = useState(false);
  
    const openremarkModal = () => setremarkModal(true);
    const closeremarkModal = () => setremarkModal(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);

    const openviewDocumentModal = () => setviewDocumentModal(true);
    const closeviewDocumentModal = () => setviewDocumentModal(false);

    const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available

    useEffect(() => {
      // Fetch data from the API
      axios
        .get(`https://marathon.lockated.com/bill_entries/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then((response) => {
          setBillDetails(response.data);
          setStatus(response.data.status)
        })
        .catch((error) => {
          console.error("Error fetching bill details:", error);
        });
    }, [id]);

  const statusOptions = [
    {
      label: "Select Status",
      value: "",
    },
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Verified",
      value: "verified",
    },
    {
      label: "Submited",
      value: "submited",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
    {
      label: "Approved",
      value: "approved",
    },
  ];

  if (!billDetails) {
    return <div>Loading...</div>;
  }

  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    // handleStatusChange(selectedOption); // Handle status change
  };
  return (
 <>
  <div className="website-content overflow-auto">
  <div className="module-data-section ms-2 ">
    <a href="">
      Home &gt; Billing &gt; Bill Verification List &gt; Update Bill Information
      (Details)
    </a>
    <h5 className="mt-3">Update Bill Information (Details)</h5>
    <div className="row my-4 align-items-center container-fluid mb-5">
      <div className="col-md-12 ">
        <div className="card p-3">
          <div className="details_page">
            <div className="row px-3">
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Company</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.company_name || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Project</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.project_name || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Sub Project</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.site_name || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Vendor Name</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.pms_supplier || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>PO Number</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.po_number || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Bill Number</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.bill_no || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Acceptance Date</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Bill Date</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.bill_date || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Created On</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Mode of Submission</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Bill Amount</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.bill_amount || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Bill Due date</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.bill_date || ""}
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Vendor Remark</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">:</span>
                    </span>
                    {billDetails.vendor_remark || ""}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-5 ">
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
                <div className="tbl-container  mt-3">
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
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
                          onClick={openviewDocumentModal}
                          style={{color: '#8b0203' }}
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
      
           {/* <div className="row mt-4 justify-content-end align-items-center mx-2">
                        <div className="col-md-3">
                          <div className="form-group d-flex gap-3 align-items-center mx-3">
                            <label
                              style={{ fontSize: "0.95rem", color: "black", whiteSpace: "nowrap", }}
                            >
                              Assigned To User
                            </label>
                            <SingleSelector
                              options={statusOptions}
                              // onChange={handleStatusChange}
                              // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                              placeholder="Select User"
                              // isClearable={false}
                              // isDisabled={true} // Disable the selector
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                      </div> */}
        
                      <div className="row mt-4 justify-content-end align-items-center mx-2">
                        <div className="col-md-3">
                          <div className="form-group d-flex gap-3 align-items-center mx-3">
                            <label style={{ fontSize: "0.95rem", color: "black" }}>
                              Status
                            </label>
                            <SingleSelector
                              options={statusOptions}
                              onChange={handleStatusChange}
                              value={statusOptions.find((option) => option.value === status)} // Set "Draft" as the selected status
                              placeholder="Select Status"
                              // isClearable={false}
                              // isDisabled={true} // Disable the selector
                              classNamePrefix="react-select"
                            />
                          </div>
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
        <div className=" mb-5">
            <div className="mx-0">
                                                    <Table columns={auditLogColumns} data={auditLogData} />
                                                  </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* attach document */}


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
                      <form
                        action="/upload"
                        method="post"
                        encType="multipart/form-data"
                      >
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
{/* attach document */}

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
{/* view documents */}
       <Modal
              centered
              size="lg"
              show={viewDocumentModal}
              onHide={closeviewDocumentModal}
              backdrop="true"
              keyboard={true}
              className="modal-centered-custom"
            >
              <Modal.Header closeButton>
                <h5>Document Attachment</h5>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="d-flex justify-content-between mt-3 me-2">
                    <h5 className=" ">Latest Documents</h5>
                    <div
                      className="card-tools d-flex"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <button
                        className="purple-btn2 rounded-3"
                        data-bs-toggle="modal"
                        data-bs-target="#RevisionModal"
                        fdprocessedid="xn3e6n"
                        onClick={openattachModal}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          fill="currentColor"
                          className="bi bi-plus"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                        </svg>
                        <span>Attach</span>
                      </button>
                    </div>
                  </div>
                  <div className="tbl-container px-0">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Sr.No.</th>
                          <th>Document Name</th>
                          <th>Attachment Name</th>
                          <th>Upload Date</th>
                          <th>Uploaded By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>MTC</td>
                          <td>Material test Cert 1.pdf</td>
                          <td>01-03-2024</td>
                          <td>vendor user</td>
                          <td>
                            <i
                              className="fa-regular fa-eye"
                              data-bs-toggle="modal"
                              data-bs-target="#comments-modal"
                              style={{ fontSize: 18 }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className=" mt-3 me-2">
                    <h5 className=" ">Document Attachment History</h5>
                  </div>
                  <div className="tbl-container px-0">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Sr.No.</th>
                          <th>Document Name</th>
                          <th>Attachment Name</th>
                          <th>Upload Date</th>
                          <th>Uploaded By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>MTC</td>
                          <td>Material test Cert 1.pdf</td>
                          <td>01-03-2024</td>
                          <td>vendor user</td>
                          <td>
                            <i
                              className="fa-regular fa-eye"
                              data-bs-toggle="modal"
                              data-bs-target="#comments-modal"
                              style={{ fontSize: 18 }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-3">
                    <button className="purple-btn1 w-100" fdprocessedid="af5l5g" onClick={closeviewDocumentModal}>
                      Close
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

 </>
  )
}

export default BillVerificationDetails