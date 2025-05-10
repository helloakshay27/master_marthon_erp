import React from 'react'
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import SingleSelector from '../components/base/Select/SingleSelector';
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";

const BillVerificationDetails = () => {
  const [attachModal, setattachModal] = useState(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);

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
                    Aakash Infra Ltd.
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
                    Demo Project
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
                    Demo sub-project
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
                    Aakash Infra Ltd.
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
                    99990
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
                    12345
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
                    12-5-24
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
                    10-5-24
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
                    Demo Create
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
                    Online
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
                    200,000
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
                    29-6-24
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
                    Demo remark
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5 me-2">
            <h5 className=" ">Supporting Documents</h5>
            {/* <div className="card-tools d-flex">
              <button
                className="purple-btn2 me-2"
                data-bs-toggle="modal"
                data-bs-target="#RevisionModal"
                onClick={openattachModal}
              >
                Revision Req.
              </button>
              <div>
                <p data-bs-toggle="modal" data-bs-target="#AttachModal">
                  Attach Other
                </p>
                <form
                  action="/upload"
                  method="post"
                  encType="multipart/form-data"
                >
                  {/* <label for="fileInput">Choose File:</label> */}
                  {/* <input
                    style={{ width: 192 }}
                    type="file"
                    id="fileInput"
                    name="attachment"
                  />
                </form>
              </div>
            </div> */} 
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
                  >
                    3
                  </td>
                  <td className="text-start text-decoration-underline">
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
      
           <div className="row mt-4 justify-content-end align-items-center mx-2">
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
                      </div>
        
                      <div className="row mt-4 justify-content-end align-items-center mx-2">
                        <div className="col-md-3">
                          <div className="form-group d-flex gap-3 align-items-center mx-3">
                            <label style={{ fontSize: "0.95rem", color: "black" }}>
                              Status
                            </label>
                            <SingleSelector
                              options={statusOptions}
                              // onChange={handleStatusChange}
                              // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
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
    <div className="">
  <div className="details_page">
    <div className="row px-3">
      <div className="col-lg-12 col-md-6 col-sm-12 row px-3 ">
        <div className="col-6 ">
          <label>Name of the Document</label>
        </div>
        <div className="col-6">
          <label className="text">
            <span className="me-3">
              <span className="text-dark">:</span>
            </span>
            Aakash Infra Ltd.
          </label>
        </div>
      </div>
    </div>
  </div>
  <div className="row">
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
</div>

        </Modal.Body>
      </Modal>
{/* attach document */}

 </>
  )
}

export default BillVerificationDetails