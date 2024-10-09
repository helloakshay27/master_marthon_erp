import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const ErpStockRegisterCreation13C = () => {
  return (
    <>
     <Header/>
     <div className="main-content">
     <Sidebar/>
     <div className="website-content overflow-auto">
     <div className="module-data-section container-fluid">
  <a href="">Home &gt; Store &gt; Store Operation &gt; Stock Register </a>
  <h5 className="mt-3">Stock Register</h5>
  <section className="mor  m-0" style={{ border: "none" }}>
    <div className="">
      <div className="row my-4 align-items-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body ">
              <div>
                <h5>Material Details</h5>
              </div>
              <div className="row mt-4">
                <div className="col-md-2">
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
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Material Category</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Material Code
                      <span />
                    </label>
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
                    <label>Material Type</label>
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
                    <label>
                      Material Sub-Type
                      <span />
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>
                      Material
                      <span />
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>Material Description</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>Specification</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>UOM</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>Stock Type</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>Material Threshold</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2 mt-2">
                  <div className="form-group">
                    <label>Deadstock Qty</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
              </div>
              <section className="mor mt-4">
                <div className="">
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Available-Details
                                    "
                        type="button"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                      >
                        Available Material Details
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Rejected-Details
                                    "
                        type="button"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                      >
                        Rejected Material Details
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="Available-Details"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      tabIndex={0}
                    >
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>Sr. No.</th>
                              <th>Description of Material</th>
                              <th>Date</th>
                              <th>MOR</th>
                              <th>Supplier/Contractor/Store</th>
                              <th>GRN / Issue / Return / MTO No.</th>
                              <th>Status</th>
                              <th>UOM</th>
                              <th>Prev Stock</th>
                              <th>Received Qty</th>
                              <th>Issued Qty</th>
                              <th>Current Stock</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Material from Vendor</td>
                              <td />
                              <td>MOR/MAR/MAX/101/02/2024</td>
                              <td />
                              <td>GRN 1536</td>
                              <td>Received</td>
                              <td>Nos</td>
                              <td>0</td>
                              <td>+ 200</td>
                              <td />
                              <td>200</td>
                              <td />
                            </tr>
                            <tr>
                              <td />
                              <th>Balanced Qty</th>
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
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="Rejected-Details"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                      tabIndex={0}
                    >
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>Sr. No.</th>
                              <th>Description of Material</th>
                              <th>Date</th>
                              <th>MOR</th>
                              <th>GRN</th>
                              <th>UOM</th>
                              <th>Rejected Qty</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Defective Material from Vendor</td>
                              <td />
                              <td>MOR/MAR/MAX/101/02/2024</td>
                              <td />
                              <td>
                                <select
                                  className="form-control form-select"
                                  style={{ width: "100%" }}
                                  fdprocessedid="622i99"
                                >
                                  <option selected="selected">NOS</option>
                                  <option>Alaska</option>
                                  <option>California</option>
                                  <option>Delaware</option>
                                  <option>Tennessee</option>
                                  <option>Texas</option>
                                  <option>Washington</option>
                                </select>
                              </td>
                              <td>+50</td>
                              <td />
                            </tr>
                            <tr>
                              <td />
                              <th>Total Rejected Qty</th>
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
                  </div>
                  {/* /.container-fluid */}
                </div>
              </section>
              {/* /.col */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

     <Footer/>
     </div>
     </div>
   
    
    </>
  )
}

export default ErpStockRegisterCreation13C