import React from 'react'

const PoCreate = () => {
  return (
   <>

  {/* <main className="h-100 w-100"> */}
    
    {/* top navigation above */}
    <div className="main-content">
     
      {/* sidebar ends above */}
      {/* webpage conteaint start */}
      <div className="website-content container-fluid">
        <div className="module-data-section ">
          <a href="">Home &gt; Purchase &gt; MTO &gt; MTO Pending Approval</a>
          <h5 className="mt-3">Create Purchase Order</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="mor-tabs mt-4">
                <ul
                  className="nav nav-pills mb-3 justify-content-center"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#create-mor"
                      type="button"
                      role="tab"
                      aria-controls="create-mor"
                      aria-selected="false"
                    >
                      MOR
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#mor-approval-create"
                      type="button"
                      role="tab"
                      aria-controls="mor-approval-create"
                      aria-selected="true"
                    >
                      MTO Creation
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      MTO Approval
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      PO
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Material Received
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Material Issued
                    </button>
                  </li>
                  <li className="nav-item" role="presentation" />
                </ul>
              </div>
              <div className="card  ms-3">
                <div className="card-header">
                  <h3 className="card-title">Po Type</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* <div className="col-md-2">
                      <div className="form-group"> */}
                        {/* <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="contentSelector"
                            defaultValue="content1"
                            defaultChecked=""
                          />
                          <label className="form-check-label">Domestic</label>
                        </div> */}
                      {/* </div>
                    </div> */}
                    {/* <div className="col-md-2">
                      <div className="form-group"> */}
                        {/* <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="contentSelector"
                            defaultValue="content2"
                          />
                          <label className="form-check-label">Import</label>
                        </div> */}
                      {/* </div> */}
                    {/* </div> */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <div className="form-check">
                          <input
                            className="form-check-input "
                            type="radio"
                            name="contentSelector"
                            defaultValue="content3"
                          />
                          <label className="form-check-label">ROPO</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div  className="">
              <div className="card ms-3">
                <div className="card-body">
                  <div className=" text-center">
                    <h4>PO for New Material (Domestic)</h4>
                  </div>
                  <div className="d-flex justify-content-end ">
                    <div className="me-1 ">
                      <button className="d-btn purple-btn2">Copy PO</button>
                    </div>
                    <div>
                      <button className="d-btn purple-btn2">Download</button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <div className="me-3 text-decoration-underline">
                      <a href="#">View MOR</a>
                    </div>
                    <div className="ms-1 text-decoration-underline">
                      <a href="#">View MTO</a>
                    </div>
                  </div>
                  <section className="mor p-2 pt-2">
                    <div className="container-fluid">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                        >
                          <button
                            className="nav-link active"
                            id="nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Domestic1"
                            type="button"
                            role="tab"
                            aria-controls="nav-home"
                            aria-selected="true"
                          >
                            PO Details
                          </button>
                          <button
                            className="nav-link"
                            id="nav-profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Domestic2"
                            type="button"
                            role="tab"
                            aria-controls="nav-profile"
                            aria-selected="false"
                          >
                            Rate &amp; Taxes
                          </button>
                          <button
                            className="nav-link"
                            id="nav-contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Domestic3"
                            type="button"
                            role="tab"
                            aria-controls="nav-contact"
                            aria-selected="false"
                          >
                            Term &amp; Conditions
                          </button>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="Domestic1"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Company</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="MRPL"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Project</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Neo Valley"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    PO Category
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Materia"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Type</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Date</label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Created On
                                  </label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    placeholder="05-02-2024"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO No</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="PO 056"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={1}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 600.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">Branch</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="82.77 INR"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Vendor GSTIN
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Site"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between  align-items-center">
                            <h5
                              className=" "
                              data-bs-toggle="modal"
                              data-bs-target="#sereneModal"
                            >
                              Material Details
                            </h5>
                            <div className="card-tools">
                              <div>
                                
                                <button
                                  className="d-btn purple-btn2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#customModal"
                                >
                                  Select MOR
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Sub-Project</th>
                                  <th>MOR No.</th>
                                  <th>Material Description</th>
                                  <th>Material Specifications</th>
                                  <th>UMO</th>
                                  <th>Pending Mor Qty</th>
                                  <th>PO Order Qty</th>
                                  <th>GRN Qty</th>
                                  <th>PO Balance Qty</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td className="text-decoration-underline">
                                    Neo Valley- Building
                                  </td>
                                  <td>MOR/MAR/MAX/ 101/02/2024</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>300 x 300 mm</td>
                                  <td>
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Supplier
                                      </label>
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
                                  <td>150</td>
                                  <td>40</td>
                                  <td>50</td>
                                  <td>60</td>
                                  <td>
                                    <i
                                      className="fa-solid fa-xmark"
                                      style={{ fontSize: 18 }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="Domestic2"
                          role="tabpanel"
                          aria-labelledby="nav-profile-tab"
                          tabIndex={0}
                        >
                          <div className=" mt-3">
                            <h5 className=" ">Quotation Details</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Quotation No.</th>
                                  <th>Supplier Ref. No</th>
                                  <th>Material</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>All Incl. Rate</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-decoration-underline">
                                    Quotation 9655295
                                  </td>
                                  <td>65985</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>Nos</td>
                                  <td>600</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Material Description</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>PO Qty</th>
                                  <th colSpan={2}>Material Rate</th>
                                  <th colSpan={2}>Material Cost</th>
                                  <th>Tax Addition</th>
                                  <th>Total Changes</th>
                                  <th>Other Addition</th>
                                  <th>Other Deductions</th>
                                  <th>All Incl. Cost</th>
                                  <th>Tax Deductions</th>
                                  <th>Select Tax</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>300 x 300 mm</td>
                                  <td>nos</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cozyModal"
                                  >
                                    Attributes
                                  </td>
                                  <td>40</td>
                                  <td>USD 0.24</td>
                                  <td>INR 20</td>
                                  <td>USD 9.67</td>
                                  <td>INR 800</td>
                                  <td>108</td>
                                  <td>708</td>
                                  <td>108</td>
                                  <td>708</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#zenithModal"
                                  >
                                    select
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className=" mt-3">Tax &amp; Charges Summary</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th rowSpan={2}>Tax / Charge Type</th>
                                  <th colSpan={2}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Total Base Cost</td>
                                  <td>800</td>
                                </tr>
                                <tr>
                                  <td>Custom Duty</td>
                                  <td>400</td>
                                </tr>
                                <tr>
                                  <td>C &amp; F Charges</td>
                                  <td>30.4</td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">
                                    Total All Incl. Cost
                                  </td>
                                  <td className="fw-bold">1230.4</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" mt-3 d-flex justify-content-between ">
                            <h5 className=" ">Other Cost</h5>
                            <div className="card-tools">
                              <button className="purple-btn2 m-0">
                                <span className="material-symbols-outlined align-text-top me-2">
                                  add{" "}
                                </span>
                                Add Item
                              </button>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>
                                    Transportation, Loading &amp; Unloading
                                    Details
                                  </th>
                                  <th>Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Loading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Unloading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Transportation</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  <th>0.00</th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="Domestic3"
                          role="tabpanel"
                          aria-labelledby="nav-contact-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Credit Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    P.O Validity Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Advance Reminder Duration (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-body pt-1">
                            <div className="row">
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Payment Terms
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Remark
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Charges And Taxes</th>
                                  <th>Amount</th>
                                  <th>Payable Currency</th>
                                  <th>Service Certificate</th>
                                  <th>Select Service Provider</th>
                                  <th>Remarks</th>
                                </tr>
                                <tr>
                                  <th colSpan={6}>Tax Addition(Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {/* <td colspan="6">No Records Found.
                                                            </td> */}
                                  <td>CGST</td>
                                  <td colSpan={2}>INR 0.00</td>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>SGST</td>
                                  <td colSpan={2}>INR 0.00</td>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th colSpan={6}>Charges (Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>OTHER CHARGES </td>
                                  <td colSpan={2}>INR 0.00</td>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Advance Payment Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Payment Date</th>
                                  <th>Payment %age</th>
                                  <th>Payment Amount</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div> */}
                          {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Delivery Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>MOR No.</th>
                                  <th>Material</th>
                                  <th>MOR Delivery Schedule</th>
                                  <th>PO Delivery Date</th>
                                  <th>Sch. Delivery Qty</th>
                                  <th>Delivery Address</th>
                                  <th>Store Name</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div> */}
                          <div className="mt-3 ">
                            <h5 className=" ">General Term &amp; Conditions</h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 ">
                            <h5 className=" mt-3">
                              Material Specific Term &amp; Conditions
                            </h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
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
                          id="Domestic4"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          Amendment Details
                        </div>
                      </div>
                      {/* /.container-fluid */}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div id="content2" className="contentpo">
              <div className="card">
                <div className="card-body">
                  <div className=" text-center">
                    <h4>PO for New Material (Import)</h4>
                  </div>
                  <div className="d-flex justify-content-end ">
                    <div className="me-1 ">
                      <button className="d-btn purple-btn2">Copy PO</button>
                    </div>
                    <div>
                      <button className="d-btn purple-btn2">Download</button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <div className="me-3 text-decoration-underline">
                      <a href="#">View MOR</a>
                    </div>
                    <div className="ms-1 text-decoration-underline">
                      <a href="#">View MTO</a>
                    </div>
                  </div>
                  <section className="mor p-2 pt-2">
                    <div className="container-fluid">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                        >
                          <button
                            className="nav-link active"
                            id="nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Import1"
                            type="button"
                            role="tab"
                            aria-controls="nav-home"
                            aria-selected="true"
                          >
                            PO Details
                          </button>
                          <button
                            className="nav-link"
                            id="nav-profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Import2"
                            type="button"
                            role="tab"
                            aria-controls="nav-profile"
                            aria-selected="false"
                          >
                            Rate &amp; Taxes
                          </button>
                          <button
                            className="nav-link"
                            id="nav-contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Import3"
                            type="button"
                            role="tab"
                            aria-controls="nav-contact"
                            aria-selected="false"
                          >
                            Term &amp; Conditions
                          </button>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="Import1"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Company</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="MRPL"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Project</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Neo Valley"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    PO Category
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Materia"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Type</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Date</label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Created On
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="05-02-2024"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO No</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="PO 056"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={1}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 600.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">Branch</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Site"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    PO Currency
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="$ USD"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Conversion Rate
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="82.77 INR"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between  align-items-center">
                            <h5
                              className=" "
                              data-bs-toggle="modal"
                              data-bs-target="#sereneModal"
                            >
                              Material Details
                            </h5>
                            <div className="card-tools">
                              <div>
                                <button className="d-btn purple-btn2">
                                  Delete
                                </button>
                                <button
                                  className="d-btn purple-btn2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal32"
                                >
                                  Select RFQ
                                </button>
                                <button
                                  className="d-btn purple-btn2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#customModal"
                                >
                                  Select MOR
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Sub-Project</th>
                                  <th>MOR No.</th>
                                  <th>Material Description</th>
                                  <th>Material Specifications</th>
                                  <th>UMO</th>
                                  <th>Pending Mor Qty</th>
                                  <th>PO Order Qty</th>
                                  <th>GRN Qty</th>
                                  <th>PO Balance Qty</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td className="text-decoration-underline">
                                    Neo Valley- Building
                                  </td>
                                  <td>MOR/MAR/MAX/ 101/02/2024</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>300 x 300 mm</td>
                                  <td>
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Supplier
                                      </label>
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
                                  <td>150</td>
                                  <td>40</td>
                                  <td>50</td>
                                  <td>60</td>
                                  <td>
                                    <i
                                      className="fa-solid fa-xmark"
                                      style={{ fontSize: 18 }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="Import2"
                          role="tabpanel"
                          aria-labelledby="nav-profile-tab"
                          tabIndex={0}
                        >
                          <div className=" mt-3">
                            <h5 className=" ">Quotation Details</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Quotation No.</th>
                                  <th>Supplier Ref. No</th>
                                  <th>Material</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>All Incl. Rate</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-decoration-underline">
                                    Quotation 9655295
                                  </td>
                                  <td>65985</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>Nos</td>
                                  <td>600</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Material Description</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>PO Qty</th>
                                  <th colSpan={2}>Material Rate</th>
                                  <th colSpan={2}>Material Cost</th>
                                  <th>Tax Addition</th>
                                  <th>Total Changes</th>
                                  <th>Other Addition</th>
                                  <th>Other Deductions</th>
                                  <th>All Incl. Cost</th>
                                  <th>Tax Deductions</th>
                                  <th>Select Tax</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>300 x 300 mm</td>
                                  <td>nos</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cozyModal"
                                  >
                                    Attributes
                                  </td>
                                  <td>40</td>
                                  <td>USD 0.24</td>
                                  <td>INR 20</td>
                                  <td>USD 9.67</td>
                                  <td>INR 800</td>
                                  <td>108</td>
                                  <td>708</td>
                                  <td>108</td>
                                  <td>708</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#zenithModal"
                                  >
                                    select
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className=" mt-3">Tax &amp; Charges Summary</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th rowSpan={2}>Tax / Charge Type</th>
                                  <th colSpan={2}>Amount</th>
                                </tr>
                                <tr>
                                  <th>INR</th>
                                  <th>USD</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Total Base Cost</td>
                                  <td>800</td>
                                  <td>800</td>
                                </tr>
                                <tr>
                                  <td>Custom Duty</td>
                                  <td>400</td>
                                  <td>400</td>
                                </tr>
                                <tr>
                                  <td>C &amp; F Charges</td>
                                  <td>30.4</td>
                                  <td>30.4</td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">
                                    Total All Incl. Cost
                                  </td>
                                  <td className="fw-bold">1230.4</td>
                                  <td className="fw-bold">1230.4</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" mt-3 d-flex justify-content-between ">
                            <h5 className=" ">Other Cost</h5>
                            <div className="card-tools">
                              <button className="purple-btn2 m-0">
                                <span className="material-symbols-outlined align-text-top me-2">
                                  add{" "}
                                </span>
                                Add Item
                              </button>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>
                                    Transportation, Loading &amp; Unloading
                                    Details
                                  </th>
                                  <th>Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Loading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Unloading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Transportation</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  <th>0.00</th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="Import3"
                          role="tabpanel"
                          aria-labelledby="nav-contact-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Credit Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    P.O Validity Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Advance Reminder Duration (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-body pt-1">
                            <div className="row">
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Payment Terms
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Remark
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th rowSpan={2}>Charges And Taxes</th>
                                  <th colSpan={2}>Amount</th>
                                  <th rowSpan={2}>Payable Currency</th>
                                  <th rowSpan={2}>Service Certificate</th>
                                  <th rowSpan={2}>Select Service Provider</th>
                                  <th rowSpan={2}>Remarks</th>
                                </tr>
                                <tr>
                                  <th>INR</th>
                                  <th>USD</th>
                                </tr>
                                <tr>
                                  <th colSpan={7}>Tax Addition(Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td colSpan={7}>No Records Found.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th colSpan={6}>Charges (Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Custom Duty </td>
                                  <td colSpan={1}>INR 0.00</td>
                                  <td colSpan={1}>USD 4.83</td>{" "}
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>C AND F CHARGES </td>
                                  <td colSpan={1}>INR 0.00</td>
                                  <td colSpan={1}>USD 4.83</td>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mt-2">
                                <div className="form-grou2">
                                  <label className="po-fontBold">
                                    Supplier Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Advance Payment Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Payment Date</th>
                                  <th>Payment %age</th>
                                  <th>Payment Amount</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Delivery Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>MOR No.</th>
                                  <th>Material</th>
                                  <th>MOR Delivery Schedule</th>
                                  <th>PO Delivery Date</th>
                                  <th>Sch. Delivery Qty</th>
                                  <th>Delivery Address</th>
                                  <th>Store Name</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
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
                          <div className="mt-3 ">
                            <h5 className=" ">General Term &amp; Conditions</h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 ">
                            <h5 className=" mt-3">
                              Material Specific Term &amp; Conditions
                            </h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
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
                          id="Import4"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          Amendment Details
                        </div>
                      </div>
                      {/* /.container-fluid */}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div id="content3" className="contentpo">
              <div className="card">
                <div className="card-body">
                  <div className=" text-center">
                    <h4>PO for New Material (ROPO)</h4>
                  </div>
                  <div className="d-flex justify-content-end ">
                    <div className="me-1 ">
                      <button className="d-btn purple-btn2">Copy PO</button>
                    </div>
                    <div>
                      <button className="d-btn purple-btn2">Download</button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <div className="me-3 text-decoration-underline">
                      <a href="#">View MOR</a>
                    </div>
                    <div className="ms-1 text-decoration-underline">
                      <a href="#">View MTO</a>
                    </div>
                  </div>
                  <section className="mor p-2 pt-2">
                    <div className="container-fluid">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                        >
                          <button
                            className="nav-link active"
                            id="nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#ROPO1"
                            type="button"
                            role="tab"
                            aria-controls="nav-home"
                            aria-selected="true"
                          >
                            PO Details
                          </button>
                          <button
                            className="nav-link"
                            id="nav-profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#ROPO2"
                            type="button"
                            role="tab"
                            aria-controls="nav-profile"
                            aria-selected="false"
                          >
                            Rate &amp; Taxes
                          </button>
                          <button
                            className="nav-link"
                            id="nav-contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#ROPO3"
                            type="button"
                            role="tab"
                            aria-controls="nav-contact"
                            aria-selected="false"
                          >
                            Term &amp; Conditions
                          </button>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="ROPO1"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Company</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="MRPL"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">Project</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Neo Valley"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    PO Category
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Materia"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Type</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Materia"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO Date</label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Created On
                                  </label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    placeholder="05-02-2024"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">PO No</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="PO 056"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={1}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 600.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Vendor GSTIN
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Site"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">Branch</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="82.77 INR"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between  align-items-center">
                            <h5
                              className=" "
                              data-bs-toggle="modal"
                              data-bs-target="#sereneModal"
                            >
                              Material Details
                            </h5>
                            <div className="card-tools">
                              <div>
                                <button className="d-btn purple-btn2">
                                  Delete
                                </button>
                                <button
                                  className="d-btn purple-btn2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal32"
                                >
                                  Select RFQ
                                </button>
                                <button
                                  className="d-btn purple-btn2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#customModal"
                                >
                                  Select MOR
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Sub-Project</th>
                                  <th>MOR No.</th>
                                  <th>Material Description</th>
                                  <th>Material Specifications</th>
                                  <th>UMO</th>
                                  <th>Pending Mor Qty</th>
                                  <th>PO Order Qty</th>
                                  <th>GRN Qty</th>
                                  <th>PO Balance Qty</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td className="text-decoration-underline">
                                    Neo Valley- Building
                                  </td>
                                  <td>MOR/MAR/MAX/ 101/02/2024</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>300 x 300 mm</td>
                                  <td>
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Supplier
                                      </label>
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
                                  <td>150</td>
                                  <td>40</td>
                                  <td>50</td>
                                  <td>60</td>
                                  <td>
                                    <i
                                      className="fa-solid fa-xmark"
                                      style={{ fontSize: 18 }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="ROPO2"
                          role="tabpanel"
                          aria-labelledby="nav-profile-tab"
                          tabIndex={0}
                        >
                          <div className=" mt-3">
                            <h5 className=" ">Quotation Details</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Quotation No.</th>
                                  <th>Supplier Ref. No</th>
                                  <th>Material</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>All Incl. Rate</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-decoration-underline">
                                    Quotation 9655295
                                  </td>
                                  <td>65985</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>Nos</td>
                                  <td>600</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Material Description</th>
                                  <th>Brand</th>
                                  <th>UOM</th>
                                  <th>PO Qty</th>
                                  <th colSpan={2}>Material Rate</th>
                                  <th colSpan={2}>Material Cost</th>
                                  <th>Tax Addition</th>
                                  <th>Total Changes</th>
                                  <th>Other Addition</th>
                                  <th>Other Deductions</th>
                                  <th>All Incl. Cost</th>
                                  <th>Tax Deductions</th>
                                  <th>Select Tax</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Plain White Sperenza Tiles</td>
                                  <td>Sperenza</td>
                                  <td>300 x 300 mm</td>
                                  <td>nos</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cozyModal"
                                  >
                                    Attributes
                                  </td>
                                  <td>40</td>
                                  <td>USD 0.24</td>
                                  <td>INR 20</td>
                                  <td>USD 9.67</td>
                                  <td>INR 800</td>
                                  <td>108</td>
                                  <td>708</td>
                                  <td
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#zenithModal"
                                  >
                                    select
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" ">
                            <h5 className=" mt-3">Tax &amp; Charges Summary</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th rowSpan={2}>Tax / Charge Type</th>
                                  <th colSpan={2}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Total Base Cost</td>
                                  <td>800</td>
                                </tr>
                                <tr>
                                  <td>Custom Duty</td>
                                  <td>400</td>
                                </tr>
                                <tr>
                                  <td>C &amp; F Charges</td>
                                  <td>30.4</td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">
                                    Total All Incl. Cost
                                  </td>
                                  <td className="fw-bold">1230.4</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" mt-3 d-flex justify-content-between ">
                            <h5 className=" ">Other Cost</h5>
                            <div className="card-tools">
                              <button className="purple-btn2 m-0">
                                <span className="material-symbols-outlined align-text-top me-2">
                                  add{" "}
                                </span>
                                Add Item
                              </button>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>
                                    Transportation, Loading &amp; Unloading
                                    Details
                                  </th>
                                  <th>Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Loading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Unloading</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <td>Transportation</td>
                                  <td>0.00</td>
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  <th>0.00</th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="ROPO3"
                          role="tabpanel"
                          aria-labelledby="nav-contact-tab"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Credit Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    P.O Validity Period (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Advance Reminder Duration (Days)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-body pt-1">
                            <div className="row">
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Payment Terms
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                              <div className="mb-3 w-50">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label po-fontBoldM"
                                >
                                  Remark
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Charges And Taxes</th>
                                  <th>Amount</th>
                                  <th>Payable Currency</th>
                                  <th>Service Certificate</th>
                                  <th>Select Service Provider</th>
                                  <th>Remarks</th>
                                </tr>
                                <tr>
                                  <th colSpan={6}>Tax Addition(Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td colSpan={6}>No Records Found.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th colSpan={6}>Charges (Exclusive)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>OTHER CHARGES </td>
                                  <td colSpan={2}>INR 0.00</td>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td colSpan={2}>
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows={2}
                                      defaultValue={""}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total PO Value
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Total Discount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Retention Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Retention (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="NR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mt-0">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Supplier Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Allowed (%)
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mt-2">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Service Certificate Advance Amount
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="INR 0.00"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Advance Payment Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Payment Date</th>
                                  <th>Payment %age</th>
                                  <th>Payment Amount</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h5 className=" mt-3">Delivery Schedule</h5>
                            <button className="purple-btn2"> Add</button>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>MOR No.</th>
                                  <th>Material</th>
                                  <th>MOR Delivery Schedule</th>
                                  <th>PO Delivery Date</th>
                                  <th>Sch. Delivery Qty</th>
                                  <th>Delivery Address</th>
                                  <th>Store Name</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>05-03-2024</td>
                                  <td>40</td>
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
                          <div className="mt-3 ">
                            <h5 className=" ">General Term &amp; Conditions</h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 ">
                            <h5 className=" mt-3">
                              Material Specific Term &amp; Conditions
                            </h5>
                          </div>
                          <div className="tbl-container me-2 mt-2">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Condition Category</th>
                                  <th>Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
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
                          id="nav-amendment-tab"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                          tabIndex={0}
                        >
                          Amendment Details
                        </div>
                      </div>
                      {/* /.container-fluid */}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className=" d-flex justify-content-between align-items-center">
              <h5 className=" mt-3">Document Attachment</h5>
              <button
                className="purple-btn2 m-0"
                data-bs-toggle="modal"
                data-bs-target="#file_attchement"
              >
                <svg
                  width={16}
                  height={17}
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1892 16.0745H0.794209C0.364012 16.0745 0 15.7435 0 15.3133V8.03309C0 7.61944 0.347466 7.27197 0.794209 7.27197C1.24095 7.27197 1.58842 7.60289 1.58842 8.03309V14.5688H14.4116V8.03309C14.4116 7.61944 14.759 7.27197 15.2058 7.27197C15.6525 7.27197 16 7.60289 16 8.03309V15.3133C15.9669 15.727 15.6194 16.0745 15.1892 16.0745Z"
                    fill="white"
                  />
                  <path
                    d="M11.6318 3.28438L8.57081 0.223371C8.27298 -0.0744571 7.7766 -0.0744571 7.46222 0.223371L4.36812 3.28438C4.2192 3.4333 4.13647 3.63185 4.13647 3.84695C4.13647 4.06205 4.2192 4.24405 4.36812 4.39297C4.51703 4.54188 4.71558 4.62461 4.91414 4.62461C5.12924 4.62461 5.32779 4.54188 5.4767 4.39297L7.1644 2.72182V10.5812C7.1644 11.0445 7.52841 11.4085 7.9917 11.4085C8.45498 11.4085 8.819 11.0445 8.819 10.5812V2.68873L10.5232 4.39297C10.8211 4.6908 11.3174 4.6908 11.6318 4.39297C11.7807 4.24405 11.8635 4.0455 11.8635 3.84695C11.8635 3.63185 11.7807 3.4333 11.6318 3.28438Z"
                    fill="white"
                  />
                </svg>
                <span className="ms-2">Attchment File </span>
              </button>
            </div>
            <div className=" px-3 mt-2">
              <div className="tbl-container px-0  m-0">
                <table className="w-100">
                  <thead className="w-100">
                    <tr>
                      <th className="main2-th">Sr. No.</th>
                      <th className="main2-th">Document Name</th>
                      <th className="main2-th">File Name</th>
                      <th className="main2-th">File Type</th>
                      <th className="main2-th">Upload Date</th>
                      <th className="main2-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>03-03-2024</td>
                      <th>MTO Copy.pdf</th>
                      <td>03-03-2024</td>
                      <th>MTO Copy.pdf</th>
                      <td>
                        <i
                          className="fa-regular fa-eye"
                          data-bs-toggle="modal"
                          data-bs-target="#document_attchment"
                          style={{ fontSize: 18 }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-body mt-3">
              <div className="row">
                <div className="mb-3  ">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label po-fontBoldM"
                  >
                    Remark
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows={2}
                    defaultValue={""}
                  />
                </div>
                <div className="mb-3  ">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label po-fontBoldM"
                  >
                    Comments
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows={1}
                    defaultValue={""}
                  />
                </div>
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
   
  {/* Navigation Top */}
  {/* sidebar start below */}
  <div
    className="modal fade"
    id="Attachment"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel32"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header align-items-center">
          <h5>Upload File</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-md-5 mt-0">
                <div className="form-group">
                  <label>
                    File Name <span>*</span>{" "}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="INR 0.00"
                  />
                </div>
              </div>
              <div className="col-md-5 mt-0">
                <div className="form-group">
                  <label>
                    Attachment Name <span>*</span>{" "}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="INR 0.00"
                  />
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="file"
                    placeholder="INR 0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button className="purple-btn2">sumbit</button>
        </div>
      </div>
    </div>
  </div>
  {/* webpage container end */}
  {/* Select RfQ Start*/}
  <div
    className="modal fade"
    id="exampleModal32"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel32"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header align-items-center">
          <h5>Select RFQ</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">RFQ No.</label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold"> RFQ From</label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">RFQ To</label>
                  <input className="form-control" type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="purple-btn2">Go</button>
        </div>
      </div>
    </div>
  </div>
  {/* Select RfQ end */}
  {/* Modal Attributes*/}
  <div
    className="modal fade"
    id="customModal"
    tabIndex={-1}
    aria-labelledby="customModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5">Select MoR</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div
          className="modal-body"
          style={{ maxHeight: 500, overflowY: "auto" }}
        >
          <h5 className="mt-2 ms-2">Search MoR</h5>
          <div className="card-body mt-0">
            <div className="row">
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">
                    Project <span>*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="MRPL"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="po-fontBold">Sub Project</label>
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                  >
                    <option selected="selected">[Select One]</option>
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
                  <label className="po-fontBold">Mor No.</label>
                  <input className="form-control" type="text" placeholder=" " />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Work Order No.</label>
                  <input className="form-control" type="text" placeholder=" " />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material Type</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Not Selected"
                  />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Mor Start Date</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Work Category</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material Sub Type</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Not Selected"
                  />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Mor End Date</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Sub Work Category</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Not Selected"
                  />
                </div>
              </div>
              <div className="col-md-4 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Contractor</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </div>
            </div>
          </div>
          <h5 className="mt-3">MOR List</h5>
          <div className="tbl-container me-2 mt-3" style={{ maxHeight: 500 }}>
            <table className="w-100">
              <thead>
                <tr>
                  <th rowSpan={2} />
                  <th rowSpan={2}>Project_SubProject</th>
                  <th rowSpan={2}>Mor _Date _ Contractor</th>
                  <th rowSpan={2}>
                    <input type="checkbox" />
                  </th>
                  <th colSpan={9}>Material Details</th>
                </tr>
                <tr>
                  <th>Material Type</th>
                  <th>Material Sub Type</th>
                  <th>Material</th>
                  <th>UOM</th>
                  <th>Pending Qty</th>
                  <th>Order Qty</th>
                  <th>Mored UOM</th>
                  <th>Balance Qty</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={2}>
                    <input type="checkbox" />
                  </td>
                  <td rowSpan={2}>NEXTOWN PHASE II_RUBY</td>
                  <td rowSpan={2}>
                    IN/NXTPH2/X301/35_Mar 31, 2023_United Builders - Crs
                  </td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Steel</td>
                  <td>STEEL-TMT</td>
                  <td>TEEL (TMT-500)-08MM</td>
                  <td>MT</td>
                  <td>10.611</td>
                  <td>36.020</td>
                  <td>MT</td>
                  <td>10.611</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Steel</td>
                  <td>STEEL-TMT</td>
                  <td>STEEL (TMT-500)-12MM</td>
                  <td>MT</td>
                  <td>7.346</td>
                  <td>21.190</td>
                  <td>MT</td>
                  <td>7.346</td>
                  <td>Approved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button className="purple-btn2">Accept Selected</button>
        </div>
      </div>
    </div>
  </div>
  {/* Modal end */}
  {/* rate & taxes Attributes modal start */}
  <div
    className="modal fade"
    id="cozyModal"
    tabIndex={-1}
    aria-labelledby="cozyModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            Material Attributes
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="d-flex justify-content-between">
            <p>Material Attributes</p>
            <p className="text-decoration-underline">Create Attribute Group</p>
          </div>
          <div className="tbl-container me-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Attribute Group</th>
                  <th>Attributes</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4}>No Records Found.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex">
            <p className="text-decoration-underline">
              Material Attributes <span>/</span>
            </p>
            <p className="text-decoration-underline">Create Attribute Group</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* rate & taxes Attributes modal end */}
  {/* rate & taxes select modal start */}
  <div
    className="modal fade"
    id="zenithModal"
    tabIndex={-1}
    aria-labelledby="zenithModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            View Tax &amp; Rate
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div
          className="modal-body p-2"
          style={{ maxHeight: 500, overflowY: "auto" }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">HSN Code</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Rate per Nos</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Total Po Qty</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Discount</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Discount Value</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Discount Rate</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="col-md-6 mt-0">
                <div className="form-group">
                  <label className="po-fontBold">Material Cost</label>
                  <input className="form-control" type="text" placeholder={0} />
                </div>
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label po-fontBoldM"
                >
                  Remark
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows={3}
                  defaultValue={""}
                />
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label po-fontBoldM"
                >
                  Additional Info.
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows={3}
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="tbl-container  mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th className="modal-th" rowSpan={2}>
                    Tax / Charge Type
                  </th>
                  <th className="modal-th" colSpan={2}>
                    Tax / Charges per UOM (INR)
                  </th>
                  <th className="modal-th" rowSpan={2}>
                    Inclusive
                  </th>
                  <th className="modal-th" colSpan={2}>
                    Tax / Charges Amount
                  </th>
                  <th className="modal-th" rowSpan={2}>
                    Action
                  </th>
                </tr>
                <tr>
                  <th className="modal-th">INR</th>
                  <th className="modal-th">USD</th>
                  <th className="modal-th">INR</th>
                  <th className="modal-th">USD</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <th>Total Base Cost</th>
                  <td />
                  <td />
                  <td />
                  <td>2160</td>
                  <td>2160</td>
                  <td />
                </tr>
                <tr className="text-center">
                  <th>Addition Tax &amp; Charges</th>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr className="text-center">
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn dropdown-toggle drop-modal-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Custom Duty
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
                  </td>
                  <td>10</td>
                  <td>012</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>400</td>
                  <td>4.83</td>
                  <td>cancel</td>
                </tr>
                <tr className="text-center">
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn dropdown-toggle drop-modal-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        C &amp; F Charges
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
                  </td>
                  <td>10</td>
                  <td>012</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>400</td>
                  <td>4.83</td>
                  <td>cancel</td>
                </tr>
                <tr className="text-center">
                  <th>Sub Total A</th>
                  <td />
                  <td />
                  <td />
                  <th>2548.8</th>
                  <th>2548.8</th>
                </tr>
                <tr className="text-center">
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn dropdown-toggle drop-modal-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        TDS
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
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn dropdown-toggle drop-modal-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        select
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
                  </td>
                  <td>0 00</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <th>0 00</th>
                  <td>0 00</td>
                  <td>Cancel</td>
                </tr>
                <tr className="text-center">
                  <th>Sub Total B</th>
                  <td />
                  <td />
                  <td />
                  <th>0 00</th>
                  <th>0 00</th>
                  <td />
                </tr>
                <tr className="text-center">
                  <th>Net Cost</th>
                  <td />
                  <td />
                  <td />
                  <th>2548.8</th>
                  <th>2548.8</th>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <div className="purple-btn2">save</div>
        </div>
      </div>
    </div>
  </div>
  {/* rate & taxes select modal end */}
  {/* Matarial Details (sereneModal) modal start */}
  <div
    className="modal fade"
    id="sereneModal"
    tabIndex={-1}
    aria-labelledby="sereneModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            Store Wise Material Stock
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="tbl-container me-2 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Stock As On Date</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Marathon ERA</th>
                  <th>1.500</th>
                  <th>KG</th>
                </tr>
                <tr>
                  <th>COS-CHM-OMG</th>
                  <th>2.500</th>
                  <th>KG</th>
                </tr>
                <tr>
                  <th>COS-CHM-OMG</th>
                  <th>2.500</th>
                  <th>KG</th>
                </tr>
                <tr>
                  <th>Krishna Mandir</th>
                  <th>0.250</th>
                  <th>KG</th>
                </tr>
                <tr>
                  <th>Nexworld Common Store</th>
                  <th>8.000</th>
                  <th>KG</th>
                </tr>
                <tr>
                  <th>IXOXI-Nexzone</th>
                  <th>175.000</th>
                  <th>KG</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <button className="PO-blue-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Matarial Details (sereneModal) modal end */}
  {/* Remark  modal start */}
  <div
    className="modal fade"
    id="remark-modal"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel32"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header align-items-center">
          <h5>Remark</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row p-3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto
            temporibus sit nulla pariatur alias adipisci nesciunt. Ex molestiae
            itaque nihil doloremque incidunt? Est illum fugiat voluptates alias
            optio quae vel.
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Remark  modal start end */}
  {/* Comments  modal start */}
  <div
    className="modal fade"
    id="comments-modal"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel32"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header align-items-center">
          <h5>comments</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row p-3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto
            temporibus sit nulla pariatur alias adipisci nesciunt. Ex molestiae
            itaque nihil doloremque incidunt? Est illum fugiat voluptates alias
            optio quae vel.
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Comments  modal start end */}
  {/* file_attchement add modal */}
  <div
    className="modal fade"
    id="file_attchement"
    tabIndex={-1}
    aria-labelledby="exampleModal2Label"
    style={{ display: "none" }}
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div className="modal-content">
        <div className="modal-header modal-header-k">
          <h5 className="modal-title text-center w-100" id="exampleModalLabel">
            Upload File
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body ">
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="form-group">
                <label>
                  Name of the Document<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default input"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="form-group">
                <label>
                  File Upload <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="file"
                  placeholder="Default input"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button className="purple-btn2">Sumbit</button>
        </div>
      </div>
    </div>
  </div>
  {/* file_attchement add modal end */}
  {/* document_attchment schedule modal */}
  <div
    className="modal fade"
    id="document_attchment"
    tabIndex={-1}
    aria-labelledby="exampleModal2Label"
    style={{ display: "none" }}
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div className="modal-content">
        <div className="modal-header modal-header-k">
          <h5 className="modal-title text-center w-100" id="exampleModalLabel">
            Document Attchement
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body ">
          <div className="row mt-2">
            <div className="col-12 px-4">
              <div className="d-flex justify-content-between">
                <h5>Latest Documents</h5>
                <button
                  className="purple-btn2 m-0"
                  data-bs-toggle="modal"
                  data-bs-target="#file_attchement"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <svg
                    width={16}
                    height={17}
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1892 16.0745H0.794209C0.364012 16.0745 0 15.7435 0 15.3133V8.03309C0 7.61944 0.347466 7.27197 0.794209 7.27197C1.24095 7.27197 1.58842 7.60289 1.58842 8.03309V14.5688H14.4116V8.03309C14.4116 7.61944 14.759 7.27197 15.2058 7.27197C15.6525 7.27197 16 7.60289 16 8.03309V15.3133C15.9669 15.727 15.6194 16.0745 15.1892 16.0745Z"
                      fill="white"
                    />
                    <path
                      d="M11.6318 3.28438L8.57081 0.223371C8.27298 -0.0744571 7.7766 -0.0744571 7.46222 0.223371L4.36812 3.28438C4.2192 3.4333 4.13647 3.63185 4.13647 3.84695C4.13647 4.06205 4.2192 4.24405 4.36812 4.39297C4.51703 4.54188 4.71558 4.62461 4.91414 4.62461C5.12924 4.62461 5.32779 4.54188 5.4767 4.39297L7.1644 2.72182V10.5812C7.1644 11.0445 7.52841 11.4085 7.9917 11.4085C8.45498 11.4085 8.819 11.0445 8.819 10.5812V2.68873L10.5232 4.39297C10.8211 4.6908 11.3174 4.6908 11.6318 4.39297C11.7807 4.24405 11.8635 4.0455 11.8635 3.84695C11.8635 3.63185 11.7807 3.4333 11.6318 3.28438Z"
                      fill="white"
                    />
                  </svg>
                  <span className="ms-2">Attchment File </span>
                </button>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Document Name</th>
                      <th>Attchement Name</th>
                      <th>Upload Date</th>
                      <th>Upload By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>MTC</td>
                      <td>Material test cert.pdf</td>
                      <td>01-11-202</td>
                      <td>vendor user</td>
                      <td>
                        <i className="fa-regular fa-eye" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* /.form-group */}
            </div>
            {/* /.col */}
            {/* /.col */}
          </div>
          <div className="row mt-2">
            <div className="col-12 px-4">
              <h5> Documents Attchment History</h5>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Document Name</th>
                      <th>Attchement Name</th>
                      <th>Upload Date</th>
                      <th>Upload By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>MTC</td>
                      <td>Material test cert.pdf</td>
                      <td>01-11-202</td>
                      <td>vendor user</td>
                      <td>
                        <i className="fa-regular fa-eye" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* /.form-group */}
            </div>
            {/* /.col */}
            {/* /.col */}
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button
            className="purple-btn2"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* document_attchment schedule modal end */}
</>

  )
}

export default PoCreate 
