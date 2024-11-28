import React from 'react'

const BillEntryListSubPage = () => {
  return (
    <>
     <div className="website-content overflow-auto">
  <div className="module-data-section container-fluid">
    <a href="">
      Home &gt; Security &gt; Bill Entry List &gt; Bill Submission (For Billing
      User)
    </a>
    <h5 className="mt-3"> Bill Submission (For Billing User)</h5>
    <div className="row my-4 align-items-center">
      <div className="col-md-12 ">
        <div className="card p-3">
          <div className="row">
            <div className="col-md-2">
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
            <div className="col-md-1">
              <p className="mt-2 text-decoration-underline">View Details</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mt-2">
              <div className="form-group">
                <label>PO Number</label>
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
                <label>Bill Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-3 mt-2">
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
          </div>
          <div className="row">
            <div className="col-md-3 mt-2">
              <div className="form-group">
                <label>Bill Amount</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="form-group">
                <label>Vendor Remark</label>
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
            <div className="col-md-12 mt-2">
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
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter ..."
                  defaultValue={""}
                />
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
        <div className="row mt-2 justify-content-center">
          <div className="col-md-2">
            <button className="purple-btn2 w-100">Submit</button>
          </div>
          <div className="col-md-2">
            <button className="purple-btn1 w-100">Cancel</button>
          </div>
        </div>
        <h5 className=" mt-3">Audit Log</h5>
        <div className="px-3">
          <div className="tbl-container px-0">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>From Status</th>
                  <th>To Status</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Days</th>
                  <th>User</th>
                  <th>Remark</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Draft</td>
                  <td>Received</td>
                  <td>01-01-24</td>
                  <td>01-02-24</td>
                  <td />
                  <td>User 1</td>
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
  )
}

export default BillEntryListSubPage