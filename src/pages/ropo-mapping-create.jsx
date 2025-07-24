import React, { useState } from 'react'

const RopoMappingCreate = () => {
  const [collapsedRows, setCollapsedRows] = useState({});

  const handleCollapseToggle = (rowKey) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  return (
    <div>
      <>
 
  <main className="h-100 w-100">
    
    {/* top navigation above */}
    <div className="main-content">
     
      <div className="website-content container-fluid ">
        <div className="module-data-section ">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; ROPO Mapping{" "}
          </a>
          <h5 className="mt-3">ROPO Mapping</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 px-2">
              <div className="tab-content mor-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="create-mor"
                  role="tabpanel"
                  aria-labelledby="create-mor"
                >
                  <section className="mor p-2 ">
                    <div className="container-fluid card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label className="po-fontBold">Project</label>
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">Neo Vally</option>
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
                              <label className="po-fontBold">Sub-Project</label>
                              <select
                                className="form-control form-select"
                                style={{ width: "100%" }}
                              >
                                <option selected="selected">
                                  Neo Valley- Building
                                </option>
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
                              <label>ROPO No.</label>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="ROPO5229"
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Date</label>
                                <input className="form-control" type="date" />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Created On</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="05-02-2024"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mt-2 align-items-end">
                          <h5 className=" ">MOR &amp; PO Mapping</h5>
                          <div className="card-tools">
                            <button className="purple-btn2">Delete</button>
                          </div>
                        </div>
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>
                                  <input type="checkbox" />
                                </th>
                                <th style={{ width: "30%" }}>
                                  MOR/Material/PO
                                </th>
                                <th>Pending Qty</th>
                                <th>Ordered Qty</th>
                                <th>PO UOM</th>
                                <th>Converted Ordered Qty</th>
                                <th>Rate / PO UOM</th>
                                <th>Material Cost</th>
                                <th>Total Received Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* MOR row */}
                              <tr>
                                <td>
                                  <input type="checkbox" />
                                </td>
                                <td>
                                  <i
                                    className={`fa-solid collapse-icon me-2 ${collapsedRows['row1'] ? 'fa-arrow-turn-down' : 'fa-arrow-turn-up'}`}
                                    onClick={() => handleCollapseToggle('row1')}
                                    style={{ cursor: 'pointer' }}
                                  />{" "}
                                  MOR
                                </td>
                                <td>24.16000MT</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                              </tr>
                              {/* Material row */}
                              {collapsedRows['row1'] && (
                                <tr className="material-type">
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td className="ps-4">Material</td>
                                  <td />
                                  <td>24.160 MT</td>
                                  <td>MT</td>
                                  <td>24.160</td>
                                  <td>2100.0000</td>
                                  <td>50736.000</td>
                                  <td>50.787</td>
                                </tr>
                              )}
                              {/* PO row */}
                              {collapsedRows['row1'] && (
                                <tr>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td className="ps-5">PO</td>
                                  <td />
                                  <td>24.160 MT</td>
                                  <td>MT</td>
                                  <td>24.160</td>
                                  <td>2100.0000</td>
                                  <td>50736.000</td>
                                  <td>50.787</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <button
                            className="purple-btn2"
                            data-bs-toggle="modal"
                            data-bs-target="#add-mors"
                          >
                            Add MOR
                          </button>
                          <button
                            className="purple-btn2 ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#add-pos"
                          >
                            Add PO
                          </button>
                        </div>
                        {/* /.container-fluid */}
                      </div>
                    </div>
                  </section>
                  <section className="ms-4 me-4 mb-3">
                    <div className="d-flex justify-content-end align-items-center gap-3">
                      <p className="pe-2 pt-1">Status</p>
                      <div className="dropdown">
                        <button
                          className="purple-btn2 dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Draft
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
                            <th>1</th>
                            <td>Pratham Shastri</td>
                            <td>15-02-2024</td>
                            <td>Verified</td>
                            <td>Verified &amp; Processed</td>
                          </tr>
                          <tr>
                            <th>2</th>
                            <td>Pratham Shastri</td>
                            <td>30-01-2024</td>
                            <td>Approved</td>
                            <td>Ok Approved</td>
                          </tr>
                          <tr>
                            <th>3</th>
                            <td>Dinesh Gupta</td>
                            <td>15-01-2024</td>
                            <td>Submit</td>
                            <td>Send for approval</td>
                          </tr>
                          <tr>
                            <th>4</th>
                            <td>Dinesh Gupta</td>
                            <td>01-01-2024</td>
                            <td>Draft</td>
                            <td>MOR created as material required at site.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
                <div
                  className="tab-pane fade"
                  id="mor-approval-create"
                  role="tabpanel"
                  aria-labelledby="mor-approval-create"
                ></div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </main>
  {/* Navigation Top */}
  {/* sidebar start below */}
  {/* webpage container end */}
  {/* Modal */}
  {/* rate & taxes select modal start */}
  <div
    className="modal fade"
    id="add-mors"
    tabIndex={-1}
    aria-labelledby="add-morsLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            Search Indent
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          {/* <h5 className="fw-bold mb-0 ms-3">Project Nexzone - Phase II</h5> */}
          <div className="card-body" style={{ height: 500, overflowY: "auto" }}>
            <div className=" p-3">
              <div className="row">
                <div className="col-md-6 mt-0">
                  <div className="form-group">
                    <label className="po-fontBold"> Project</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    > 
                 
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 mt-0">
                  <div className="form-group">
                    <label className="po-fontBold">Sub Project</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                     
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">Wings</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 mt-0">
                  <div className="form-group">
                    <label className="po-fontBold">MOR No.</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">MOR Start Date</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">MOR End Date</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <h6 className="fw-bold my-3">OR Search By:</h6>
                <div className="col-md-6 mt-0">
                  <div className="form-group">
                    <label className="po-fontBold">Material Type</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                     
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 mt-0">
                  <div className="form-group">
                    <label className="po-fontBold">Material Sub Type</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">Material</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      
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
            <div className="mt-1 justify-content-center d-flex">
              <button className="purple-btn1" >
                Search
              </button>
              <button className="purple-btn1" >
                show All
              </button>
              <button className="purple-btn1" >
                Reset
              </button>
              <button className="purple-btn1" >
                Close
              </button>
            </div>
            <div className="tbl-container me-2 mt-3">
              <table className="w-100">
                <thead>
                  <tr>
                    <th rowSpan={2} />
                    <th rowSpan={2}>Project SubProject</th>
                    <th rowSpan={2}>MOR Date </th>
                    <th rowSpan={2}>
                      <input type="checkbox" />
                    </th>
                    <th colSpan={6}>Material Details</th>
                  </tr>
                  <tr>
                    <th>Material Type</th>
                    <th>Material Sub Type</th>
                    <th>Material</th>
                    <th>UOM</th>
                    <th>Pending Qty</th>
                    <th>Ordered Qty</th>
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
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer justify-content-center">
              <div className="purple-btn2">Acepted selected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* rate & taxes select modal end */}
  {/* rate & taxes select modal start */}
  <div
    className="modal fade"
    id="add-pos"
    tabIndex={-1}
    aria-labelledby="add-posLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            Search Purchase Orders
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body" style={{ height: 400, overflowY: "auto" }}>
          <h5 className="fw-bold mb-0 ms-3">Company:</h5>
          <div className=" p-3 mt-3">
            <div className="row ">
              <div className="col-sm-2">
                <p className="fw-bold">Category of PO</p>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="radio1"
                    />
                    <label className="form-check-label">Material</label>
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="radio1"
                    />
                    <label className="form-check-label">Asset</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold"> Project</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Sub Project</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                   
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">Wings</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                   
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">PO Number</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder=" None selected"
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">Supplier</label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">PO Start Date</label>
                  <input className="form-control" type="date" placeholder="" />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">PO End Date</label>
                  <input className="form-control" type="date" placeholder="" />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">MOR</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <p className="fw-bold">OR Search By:</p>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material Type</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >  
                 
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material Sub Type</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                   
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                    
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
          <div className="mt-1 justify-content-center d-flex">
            <button className="purple-btn1">
              Search
            </button>
            <button className="purple-btn1 ms-2">
              show All
            </button>
            <button className="purple-btn1 ms-2">
              Reset
            </button>
            <button className="purple-btn1 ms-2">
              Close
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <h6 className="fw-bold">Search Results</h6>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="form-group">
                <label className="po-fontBold">Display</label>
              </div>
              <div className="form-group ms-3">
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
          <div className="tbl-container me-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th />
                  <th>PO Number</th>
                  <th>PO Date</th>
                  <th>Supplier Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* rate & taxes select modal end */}
  {/* Modal end */}
</>

    </div>
  )
}


export default RopoMappingCreate;
