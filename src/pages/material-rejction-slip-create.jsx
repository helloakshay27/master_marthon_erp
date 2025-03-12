import React from "react";

const MaterialRejctionSlipCreate = () => {
  return (
    <main className="h-100 w-100">
      <div className="main-content">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <div
              className="card card-default mt-5 px-4 pb-4"
              id="mor-material-slip"
            >
              <h5 className="text-center my-4" style={{ fontSize: "1.5rem" }}>
                Material Rejection Slip
              </h5>
              <div className="card-body mt-0">
                <div className="row">
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
                      <label>Sub-Project</label>
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
                      </select>{" "}
                    </div>
                    {/* /.form-group */}
                  </div>
                  <div className="col-md-3">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Challan No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                </div>
                <div className="row mt-2 separteinto5">
                  {/* /.col */}
                  <div className="col-md-2">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Rejection Slip No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                  <div className="col-md-2">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Date </label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                  <div className="col-md-2">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Created On </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                  <div className="col-md-2">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>GRN No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                  <div className="col-md-2">
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>MOR No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Default input"
                      />
                    </div>
                    {/* /.form-group */}
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                  <button className=" purple-btn2 ">Search Supplier</button>
                  <button className=" purple-btn2 ">Search Material</button>
                </div>
                {/* /.col */}
              </div>
              <div
                className="card card-default  mx-4 px-3"
                id="mor-material-details"
              >
                <div className="card-body mt-0 mb-2">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Supplier Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </div>
                      {/* /.form-group */}
                      {/* /.form-group */}
                    </div>
                    <div className="row mt-2 justify-content-between align-items-end">
                      <h5 className="col-md-3"> Material Details</h5>
                    </div>
                    <div className="tbl-container  mt-2">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Material Type</th>
                            <th>
                              Material Description<htd></htd>
                            </th>
                            <th>UOM</th>
                            <th>GRN Date</th>
                            <th>Received Qty</th>
                            <th>Defective Qty</th>
                            <th>Accepted Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Tiles</td>
                            <td>600 x 600 Tiles</td>
                            <td>400</td>
                            <td>50</td>
                            <td>350</td>
                            <td> </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <div className="form-group">
                            <label>Reason of Rejection</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Abhishek Kumar"
                            />
                          </div>
                        </div>
                        {/* /.form-group */}
                        {/* /.form-group */}
                      </div>
                      {/* /.col */}
                      <div className="col-md-6">
                        {/* /.form-group */}
                        <div className="form-group">
                          <div className="form-group">
                            <label>Reason of Acceptance</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Abhishek Kumar"
                            />
                          </div>
                        </div>
                        {/* /.form-group */}
                      </div>
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* /.row */}
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
            </div>
          </div>
        </div>
        <footer className="footer">
          <p className="">
            Powered by <img src="./images/go-logo.JPG" />
          </p>
        </footer>
      </div>
    </main>
  );
};

export default MaterialRejctionSlipCreate;
