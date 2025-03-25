import React from "react";

const MaterialReconciliationDetail = () => {
  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4 details_page">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <h5 className="mt-4">Material Reconciliation</h5>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
              <div className="col-6">
                <label>Company </label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>Material
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
              <div className="col-6">
                <label>Project</label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>Sanvo Resorts Pvt. Ltd.-II
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
              <div className="col-6">
                <label>Sub-Project</label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>Nexzone - Phase II
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
              <div className="col-6">
                <label>Store</label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>82423
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
              <div className="col-6">
                <label>Material Reco. No.</label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>PO/SRPL/NXZPh2/18254
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
              <div className="col-6">
                <label>Date</label>
              </div>
              <div className="col-6">
                <label className="text">
                  <span className="me-3">:</span>INR 65,47,926.82
                </label>
              </div>
            </div>
          </div>
          <div className=" d-flex justify-content-between align-items-end px-2  mt-3">
            <h5 className=" ">Material</h5>
          </div>
          <div className="tbl-container mx-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Material</th>
                  <th>Description</th>
                  <th>Specification</th>
                  <th>UOM</th>
                  <th>
                    Stock As on <dd-mm-yy></dd-mm-yy>
                  </th>
                  <th>Rate (Weighted Average)(INR)</th>
                  <th>Deadstock Qty</th>
                  <th>Theft / Missing Qty</th>
                  <th>Adjustment Quantity</th>
                  <th>Adjustment Rate(INR)</th>
                  <th>Adjustment Value(INR)</th>
                  <th>Net Quantity</th>
                  <th>Remarks</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    ROPO546
                  </td>
                  <td>Neo Valley</td>
                  <td>09-03-2024</td>
                  <td>Draft</td>
                  <td>Neo Valley</td>
                  <td>09-03-2024</td>
                  <td>Draft</td>
                  <td>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </td>
                  <td>Neo Valley</td>
                  <td>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </td>
                  <td>
                    <div className="form-group">
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected="selected">Nos</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <button className="btn">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.76 6L6 11.76M6 6L11.76 11.76"
                          stroke="#8B0203"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                          stroke="#8B0203"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mx-1 mt-3">
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
          <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
            <p className="">Status</p>
            <div className="dropdown">
              <button
                className="btn purple-btn2 btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                PO Draft
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
              <button className="purple-btn2 w-100">Print</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Submit</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
          <div className=" ">
            <h5 className=" ">Audit Log</h5>
          </div>
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
        <footer className="footer">
          <p className="">
            Powered by <img src="./images/go-logo.JPG" />
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MaterialReconciliationDetail;
