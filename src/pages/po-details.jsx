import React from 'react'

const PoDetails = () => {
  return (
    <div>
        <div className="main-content">
  <div className="website-content" style={{ overflowY: "auto" }}>
   
    
    <div className="tab-content" id="myTabContent">
      <div className="website-content  container-fluid ">
        <div className="module-data-sectiondetails_page">
          <a href="/purchase_orders">Home &gt; Purchase &gt; Purchase Order </a>
          <h5 className="mt-3"> Purchase Order</h5>
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
                      className="nav-link "
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      MOR
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      MOR Approval
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
                      Acceptance
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
                      Auction / RFQ
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
                      Advance
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
                      Billing
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
                      Accounts
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div id="content1 " className="">
            <div className="card ms-2">
              <div className="card-body">
                <div className=" text-center">
                  <h4>PO (Domestic) </h4>
                </div>
                <section className="mor p-2 pt-2">
                  <div className="container-fluid">
                    <div className="col-md-12 mb-3 row">
                      <div className="col-md-9">
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
                      </div>
                      <div className="col-md-2 nav-item">
                        <a
                          className="nav-link"
                          href="javascript:void(0)"
                          data-bs-toggle="modal"
                          data-bs-target="#log"
                        >
                          <button
                            className="purple-btn2"
                            style={{
                              backgroundColor: "green",
                              border: "none !important"
                            }}
                          >
                            <span>Approval Logs</span>
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="Domestic1"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      tabIndex={0}
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                            <div className="col-6 ">
                              <label>Company </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                Sanvo Resorts Pvt Ltd
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>PO Type </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                Domestic
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>PO Date </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                23/07/2025
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Created ON </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                23/07/2025
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>PO No </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                PO/2025/10541
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Total PO Value</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                100.00
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Total Discount</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                0.0
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Supplier</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                lockated
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Vendor GSTIN</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                21324
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Branch</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Unloading scope</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
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
                        </div>
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100" style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th style={{ width: "66px !important" }}>
                                  Sr. No
                                </th>
                                <th>Project</th>
                                <th>Sub-Project</th>
                                <th>MOR No.</th>
                                <th>Material</th>
                                <th>UOM</th>
                                <th>Mor Qty</th>
                                <th>PO Order Qty</th>
                                <th>GRN Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Marathon Nexzone</td>
                                <td>Antilia</td>
                                <td>
                                  <a
                                    style={{
                                      textDecoration: "underline !important"
                                    }}
                                    target="_blank"
                                    href="/material_order_requests/741?layout=true"
                                  >
                                    MOR/2025/11477
                                  </a>
                                </td>
                                <td>
                                  Grill-Grill Window-Aluminum
                                  Grill-10*10-TATA-Silver
                                </td>
                                <td>NOS</td>
                                <td>100.0</td>
                                <td>100.0</td>
                                <td>100.0</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="Domestic2"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                      tabIndex={0}
                    >
                      <div className=" ">
                        <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table
                          className="w-100"
                          style={{ width: "max-content !important" }}
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "66px !important" }}>
                                Sr. No
                              </th>
                              <th>Material</th>
                              <th>UOM</th>
                              <th>PO Qty</th>
                              <th>Adjusted Qty</th>
                              <th>Tolerance Qty</th>
                              <th>Material Rate</th>
                              <th>Material Cost</th>
                              <th>Discount(%)</th>
                              <th>Discount Rate</th>
                              <th>After Discount Value</th>
                              <th>Tax Addition</th>
                              <th>Tax Deduction</th>
                              <th>Total Charges</th>
                              <th>Total Base Cost</th>
                              <th>All Incl. Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr id={1038}>
                              <td>1</td>
                              <td>
                                Grill-Grill Window-Aluminum
                                Grill-10*10-TATA-Silver
                              </td>
                              <td>NOS</td>
                              <td>100.0</td>
                              <td>NA</td>
                              <td>NA</td>
                              <td>
                                <span className="mor_rate">1.0</span>
                              </td>
                              <td>
                                <span className="mor_cost">100.0</span>
                              </td>
                              <td></td>
                              <td>0.0</td>
                              <td>0.0</td>
                              <td>
                                <span className="mor_tax">0</span>
                              </td>
                              <td>
                                <span className="">0</span>
                              </td>
                              <td>
                                <span className="mor_total">0.0</span>
                              </td>
                              <td>
                                <span className="mor_final_cost">100.0</span>
                              </td>
                              <td>
                                <span className="mor_total_cost">100.0</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className=" ">
                        <h5 className=" mt-3">Tax &amp; Charges Summary</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th rowSpan={2}>Tax / Charge Type</th>
                              <th colSpan={2}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Total Base Cost</td>
                              <td>
                                <span className="total_base_cost">100.0</span>
                              </td>
                            </tr>
                            <tr>
                              <td>Total Tax</td>
                              <td>
                                <span className="total_tax">0.00</span>
                              </td>
                            </tr>
                            <tr>
                              <td>Total Charge</td>
                              <td>
                                <span className="total_tax">0.0</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-bold">Total All Incl. Cost</td>
                              <td className="fw-bold total_inclusive_cost">
                                100.0
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Charges And Taxes</th>
                              <th>Amount</th>
                              <th>Payable Currency</th>
                              <th />
                              <th>Select Service Provider</th>
                              <th>Remarks</th>
                            </tr>
                            <tr>
                              <th colSpan={6} className="text-center">
                                Tax Addition(Exclusive)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>SGST</td>
                              <td>INR 0 </td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td />
                              <td>
                                <textarea
                                  name="tax_detail[19][remarks]"
                                  id="tax_detail_19_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>CGST</td>
                              <td>INR 0 </td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td />
                              <td>
                                <textarea
                                  name="tax_detail[16][remarks]"
                                  id="tax_detail_16_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>IGST</td>
                              <td>INR 0 </td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td />
                              <td>
                                <textarea
                                  name="tax_detail[18][remarks]"
                                  id="tax_detail_18_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th colSpan={6} className="text-center">
                                Charges (Exclusive)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Handling Charges</td>
                              <td>INR 0.0</td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td>
                                <select
                                  name="tax_detail[13][supplier_id]"
                                  id="tax_detail_13_supplier_id"
                                  className="form-control form-select mySelect select2-hidden-accessible"
                                  disabled=""
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  data-select2-id="select2-data-tax_detail_13_supplier_id"
                                >
                                 
                                </select>
                               
                              </td>
                              <td>
                                <textarea
                                  name="tax_detail[13][remarks]"
                                  id="tax_detail_13_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Other charges</td>
                              <td>INR 0.0</td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td>
                                <select
                                  name="tax_detail[17][supplier_id]"
                                  id="tax_detail_17_supplier_id"
                                  className="form-control form-select mySelect select2-hidden-accessible"
                                  disabled=""
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  data-select2-id="select2-data-tax_detail_17_supplier_id"
                                >
                                  
                                </select>
                               
                              </td>
                              <td>
                                <textarea
                                  name="tax_detail[17][remarks]"
                                  id="tax_detail_17_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Freight</td>
                              <td>INR 0.0</td>
                              <td />
                              <td>
                                <input type="checkbox" disabled="" />
                              </td>
                              <td>
                                <select
                                  name="tax_detail[21][supplier_id]"
                                  id="tax_detail_21_supplier_id"
                                  className="form-control form-select mySelect select2-hidden-accessible"
                                  disabled=""
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  data-select2-id="select2-data-tax_detail_21_supplier_id"
                                >
                                 
                                </select>
                               
                              </td>
                              <td>
                                <textarea
                                  name="tax_detail[21][remarks]"
                                  id="tax_detail_21_remarks"
                                  className="form-control"
                                  disabled="disabled"
                                  defaultValue={""}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className=" mt-3 d-flex justify-content-between ">
                        <h5 className=" ">Other Cost</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>
                                Transportation, Loading &amp; Unloading Details
                              </th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Total</th>
                              <th>0</th>
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
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                            <div className="col-6 ">
                              <label>Credit Period (Days) </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                            <div className="col-6 ">
                              <label>P.O Validity Period (Days) </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Advance Reminder Duration (Days) </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Payment Terms </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Remark </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                            <div className="col-6 ">
                              <label>Total PO Value </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                100.00
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                            <div className="col-6 ">
                              <label>Supplier Advance Allowed (%) </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Total Discount </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                                0.0
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Supplier Advance Amount </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>0
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>
                                Service Certificate Advance Allowed (%){" "}
                              </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                            <div className="col-6 ">
                              <label>Service Certificate Advance Amount </label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">:-</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <h5 className=" mt-3">Advance Payment Schedule</h5>
                      </div>
                      <div className="tbl-container me-2 mt-2">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Payment Date</th>
                              <th>Payment %</th>
                              <th>With Tax</th>
                              <th>Payment Amount</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <h5 className=" mt-3">Delivery Schedule</h5>
                      </div>
                      <div className="tbl-container me-2 mt-2">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>MOR No.</th>
                              <th>Material</th>
                              <th>MOR Delivery Schedule</th>
                              <th>PO Delivery Date</th>
                              <th>Sch. Delivery Qty</th>
                              <th>PO Delivery Qty</th>
                              <th>Delivery Address</th>
                              <th>Store Name</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>MOR/2025/11477</td>
                              <td>
                                Grill-Grill Window-Aluminum
                                Grill-10*10-TATA-Silver
                              </td>
                              <td>22/08/2025</td>
                              <td>22/08/2025</td>
                              <td>100.0</td>
                              <td>100.0</td>
                              <td>
                                National Highway 4B, JNPT Highway, Navi Mumbai,
                                Maharashtra India
                              </td>
                              <td>Antilia</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 ">
                        <h5 className=" ">General Term &amp; Conditions</h5>
                      </div>
                      <div className="tbl-container me-2 mt-2">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Condition Category</th>
                              <th>Condition</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                      <div className="mt-3 ">
                        <h5 className=" mt-3">
                          Material Specific Term &amp; Conditions
                        </h5>
                      </div>
                      <div className="tbl-container me-2 mt-2">
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Material Sub Type</th>
                              <th>Condition Category</th>
                              <th>Condition</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
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
                      <div className="card-body">
                        <div className="row"></div>
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
          </div>
          <div className="tbl-container w-100 px-0">
            <table className="w-100" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th className="main2-th" style={{ width: "66px !important" }}>
                    Sr. No.
                  </th>
                  {/*
                  <th class="main2-th">Document Name</th>
                  */}
                  <th className="main2-th">File Name</th>
                  <th className="main2-th">File Type</th>
                  <th className="main2-th">Uploaded At</th>
                  <th className="main2-th">Uploaded By</th>
                  <th className="main2-th">Attachment</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <form
            action="/purchase_orders/813/update_status"
            acceptCharset="UTF-8"
            method="post"
          >
            <input
              type="hidden"
              name="_method"
              defaultValue="put"
              autoComplete="off"
            />
            <input
              type="hidden"
              name="authenticity_token"
              defaultValue="VpBYf0nTtanQ0LQk4QbzdPM26Y259_BkT_eAWf7Hd1-SElm7VMmi610_TWgVy1oyUnYqeg4KZH9F8jclHXZCZw"
              autoComplete="off"
            />
            <div className="row px-2">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Remark</label>
                  <textarea
                    name="status_log[remarks]"
                    id="status_log_remarks"
                    className="form-control"
                    rows={3}
                    disabled="disabled"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="row px-2">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Comments</label>
                  <textarea
                    name="status_log[comments]"
                    id="comments-field"
                    className="form-control"
                    rows={3}
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4 justify-content-end align-items-center">
              <div className="col-md-3">
                <div className="form-group d-flex gap-3 align-items-center">
                  <label className="mb-0" style={{ fontSize: "1.1rem" }}>
                    Status
                  </label>
                  <select
                    name="status_log[status]"
                    id="status-dropdown"
                    className="form-control form-select mySelect select2-hidden-accessible"
                    disabled=""
                    tabIndex={-1}
                    aria-hidden="true"
                    data-select2-id="select2-data-status-dropdown"
                  >
                    <option value="" label=" " />
                    <option
                      selected="selected"
                      value="approved"
                      data-select2-id="select2-data-674-lxm1"
                    >
                      Approved
                    </option>
                  </select>
                  
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-end">
              {/*
      <div class="col-md-2">
      <a href="/purchase_orders/813/edit?clone=clone" class="w-100">
          <button class="purple-btn2 w-100" type="button">Clone</button>
      </a>
      </div>
       */}
              <div className="col-md-2">
                <a href="/purchase_orders/813/print_pdf" className="w-100">
                  <button className="purple-btn1 w-100" type="button">
                    Print
                  </button>
                </a>
              </div>
              <div className="col-md-2">
                <input
                  type="submit"
                  name="commit"
                  defaultValue="Submit"
                  className="purple-btn2 w-100"
                  id="submit_tag_button"
                  data-disable-with="Submit"
                />
              </div>
              <div className="col-md-2">
                <a
                  className="btn btn-sm purple-btn1 w-100"
                 
                >
                  Cancel
                </a>
              </div>
            </div>
          </form>{" "}
          <div className=" d-flex justify-content-between align-items-center">
            <h5 className=" mt-3">Audit Logs</h5>
          </div>
          <div className="tbl-container px-0">
            <table className="w-100" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "66px !important" }}>Sr.No.</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>PO Remark</th>
                  <th>PO Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Dinesh Automation</td>
                  <td>23-07-2025 14:45:55</td>
                  <td>Accepted By Vendor</td>
                  <td></td>
                  <td>
                    <p></p>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Abhishek Sharma</td>
                  <td>23-07-2025 14:45:34</td>
                  <td>1 Approved</td>
                  <td></td>
                  <td>
                    <p></p>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Abhishek Sharma</td>
                  <td>23-07-2025 14:45:30</td>
                  <td>Submitted</td>
                  <td></td>
                  <td>
                    <p></p>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Abhishek Sharma</td>
                  <td>23-07-2025 14:45:26</td>
                  <td>Draft</td>
                  <td></td>
                  <td>
                    <p></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    className="modal fade"
    id="log"
    tabIndex={-1}
    aria-labelledby="amendModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fs-5" id="exampleModalLabel">
            Approval Log
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row mt-2 px-2">
            <div className="col-12 ">
              <div className="tbl-container me-2 mt-3">
                <table className="w-100" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "66px !important" }}>Sr.No.</th>
                      <th>Approval Level </th>
                      <th>Approved By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                      <th>Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>1</td>
                      <td>Abhishek Sharma</td>
                      <td>23-07-2025, 2:45 PM</td>
                      <td>
                        {" "}
                        <span
                          className="px-2 py-1 rounded text-white"
                          style={{ backgroundColor: "green" }}
                        >
                          Approved{" "}
                        </span>
                      </td>
                      <td>
                        <p></p>
                      </td>
                      <td
                        className="align-items-start"
                        style={{
                          paddingLeft: 1,
                          fontSize: 10,
                          whiteSpace: "nowrap"
                        }}
                      >
                        <ul
                          style={{
                            paddingLeft: 1,
                            listStyle: "none",
                            textAlign: "left"
                          }}
                        >
                          <li style={{ fontSize: 10 }}>Abhishek Sharma</li>
                        </ul>
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
  </div>
  
  {/* Dynamic tab content will be inserted here */}
</div>

      
    </div>
  )
}

export default PoDetails
