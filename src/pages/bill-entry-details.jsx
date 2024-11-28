import React from "react";

const BillEntryDetails = () => {
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">
            Home &gt; Security &gt; Bill Entry List &gt; Bill Information (For
            Billing User)
          </a>
          <h5 className="mt-3">Bill Information (For Billing User)</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="details_page">
                  <div className="row px-3 ">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Name</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Comments</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>Demo
                        </label>
                      </div>
                    </div>
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
              <h5 className=" mt-3">Audit Log</h5>
              <div className="px-3">
                <div className="tbl-container px-0">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>Pratham Shastri</td>
                        <td>15-02-2024</td>
                        <td>Verified</td>
                        <td>
                          <i
                            className="fa-regular fa-eye"
                            data-bs-toggle="modal"
                            data-bs-target="#remark-modal"
                            style={{ fontSize: 18 }}
                          />
                        </td>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillEntryDetails;
