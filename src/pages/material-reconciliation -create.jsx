import React from "react";

const MaterialReconciliationCreate = () => {
  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <h5 className="mt-4">Material Reconciliation</h5>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label>Company </label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
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
              {/* /.form-group */}
              {/* /.form-group */}
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Project </label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
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
              {/* /.form-group */}
              {/* /.form-group */}
            </div>
            {/* /.col */}
            <div className="col-md-3">
              {/* /.form-group */}
              <div className="form-group">
                <label>Sub-Project </label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
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
              {/* /.form-group */}
            </div>
            <div className="col-md-3">
              {/* /.form-group */}
              <div className="form-group">
                <label>Store</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default input"
                />
              </div>
              {/* /.form-group */}
            </div>
            <div className="col-md-3 mt-2">
              {/* /.form-group */}
              <div className="form-group">
                <label>Material Reco. No.</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default input"
                />
              </div>
              {/* /.form-group */}
            </div>
            <div className="col-md-3 mt-2">
              {/* /.form-group */}
              <div className="form-group">
                <label>Date</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder="Default input"
                />
              </div>
              {/* /.form-group */}
            </div>
          </div>
          <div className=" d-flex justify-content-between align-items-end px-2">
            <h5 className=" mt-3">Material</h5>
            <button
              className="purple-btn2 "
              data-bs-toggle="modal"
              data-bs-target="#add-Material"
            >
              <span className="material-symbols-outlined align-text-top">
                add{" "}
              </span>
              <span className="">Add </span>
            </button>
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
      </div>
      <div
        className="modal fade"
        id="add-Material"
        tabIndex={-1}
        aria-labelledby="exampleModal2Label"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header modal-header-k">
              <h4
                className="modal-title text-center w-100"
                id="exampleModalLabel"
                style={{ fontWeight: 500 }}
              >
                Add Material Reconciliation
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Type</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Sub-Type</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Code</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
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
                    <label>Search by Material Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                </div>
                <div className="col-md-2 mt-3">
                  <button className="purple-btn2 m-0">Go</button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <p>Displaying page 1 of 9</p>
                </div>
                <div className="d-flex align-items-end gap-3">
                  <div className="form-group">
                    <label className="po-fontBold">Display</label>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                      fdprocessedid="z2s78m"
                    >
                      <option selected="selected">Default(5)</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                  <p> Items Per Page</p>
                </div>
              </div>
              <div className="card mt-2">
                <div className="card-body pt-1">
                  <nav
                    aria-label="Page navigation example"
                    style={{ height: 50 }}
                  >
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
                  <div className="tbl-container me-2 mt-3">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Material Type</th>
                          <th>Material Sub-Type</th>
                          <th>Material</th>
                          <th>Qty</th>
                          <th>Stock As on [dd/mm/yy]</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td />
                          <td>PO/CDoM/MB001/3203</td>
                          <td>Feb 08, 2021</td>
                          <td>AMBUJA CEMENTS LIMITED</td>
                          <td>AMBUJA CEMENTS LIMITED</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialReconciliationCreate;
