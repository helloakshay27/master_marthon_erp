import React from 'react'

const PoDetails = () => {
  return (
    <div>
        <div className="main-content">
  <div className="website-content" style={{ overflowY: "auto" }}>
    <footer className="footer"></footer>
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      {/* Dynamic tabs will be inserted here */}
    </ul>
    <div className="tab-content" id="myTabContent">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid details_page">
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
                                  <option
                                    value=""
                                    data-select2-id="select2-data-228-t6wb"
                                  >
                                    Select Service Provider
                                  </option>
                                  <option value={1}>lockated</option>
                                  <option value={2}>Marathon</option>
                                  <option value={6}>Marathon</option>
                                  <option value={7}>Marathon</option>
                                  <option value={15}>
                                    Test Vendor Organization
                                  </option>
                                  <option value={16}>
                                    Test Vendor Organization2
                                  </option>
                                  <option value={17}>
                                    Hindusatn Organization
                                  </option>
                                  <option value={19}>Swastik Org</option>
                                  <option value={20}>Swastik Test</option>
                                  <option value={21}>ulta tech</option>
                                  <option value={22}>Test1</option>
                                  <option value={23}>Test1</option>
                                  <option value={24}>
                                    Satyam organization
                                  </option>
                                  <option value={25}>
                                    Test Vendor Organization05
                                  </option>
                                  <option value={26}>
                                    Hindusatn Organization1
                                  </option>
                                  <option value={27}>Marathon</option>
                                  <option value={28}>
                                    Hindusatn Organization6
                                  </option>
                                  <option value={29}>
                                    Hindusatn Organization12
                                  </option>
                                  <option value={30}>
                                    Hindusatn Organization11
                                  </option>
                                  <option value={31}>
                                    Amazon Organization
                                  </option>
                                  <option value={33}>
                                    Swastik Suppliers Ltd.
                                  </option>
                                  <option value={34}>SHIVA ORGANIZATION</option>
                                  <option value={35}>SHIVA ORGANIZATION</option>
                                  <option value={36}>Panchshil Test</option>
                                  <option value={37}>sdfghjk</option>
                                  <option value={38}>
                                    Krushnai Water Suppliers
                                  </option>
                                  <option value={39}>
                                    Gautam Infrastructure &amp; Construction
                                    Equipment Private Limited
                                  </option>
                                  <option value={42}>Kudale Transport</option>
                                  <option value={43}>TRIFLEX SOLUTIONS</option>
                                  <option value={44}>MILLENIUM </option>
                                  <option value={45}>PANCHSHIL12</option>
                                  <option value={46}>Vendor Test</option>
                                  <option value={47}>Vendor Test2</option>
                                  <option value={48}>Vendor Test3</option>
                                  <option value={50}>Test Vendor </option>
                                  <option value={51}>
                                    Hindusatn Organization5
                                  </option>
                                  <option value={52}>Marathon</option>
                                  <option value={53}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={54}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={55}>Raj k</option>
                                  <option value={56}>T</option>
                                  <option value={57}>satya k</option>
                                  <option value={58}>SUM</option>
                                  <option value={59}>
                                    Sagar Organization1
                                  </option>
                                  <option value={60}>
                                    Sagar Organizationk
                                  </option>
                                  <option value={62}>Haven </option>
                                  <option value={63}>Haven 2</option>
                                  <option value={64}>Haven 3</option>
                                  <option value={65}>Panch Org</option>
                                  <option value={66}>Panch Realty</option>
                                  <option value={84}>
                                    JIO HAPTIK TECHNOLOGIES LIMITED
                                  </option>
                                  <option value={90}>test</option>
                                  <option value={91}>Test Org</option>
                                  <option value={92}>Test Org</option>
                                  <option value={93}>TEST Org</option>
                                  <option value={94}>TEST</option>
                                  <option value={95}>Demo</option>
                                  <option value={96}>Test Org</option>
                                  <option value={97}>Vendor Test</option>
                                  <option value={98}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={99}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={100}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={101}>Test Org</option>
                                  <option value={102}>Demo Test</option>
                                  <option value={103}>Test Org</option>
                                  <option value={104}>test</option>
                                  <option value={105}>Demo Org</option>
                                  <option value={106}>New Vendor</option>
                                  <option value={107}>Dhanu</option>
                                  <option value={108}>abcd</option>
                                  <option value={109}>asad</option>
                                  <option value={110}>test8</option>
                                  <option value={111}>Nexa Org</option>
                                  <option value={112}>test v</option>
                                  <option value={113}>aaabcd</option>
                                  <option value={114}>New Vendor</option>
                                  <option value={115}>New Vendor</option>
                                  <option value={116}>New Vendor</option>
                                  <option value={117}>Staturaty Details</option>
                                  <option value={118}>No Staturaty</option>
                                  <option value={119}>
                                    With Other Staturaty details
                                  </option>
                                  <option value={120}>
                                    With all saturaty and vrf
                                  </option>
                                  <option value={121}>TEST</option>
                                  <option value={122}>Dhananjay Group</option>
                                  <option value={128}>abvd</option>
                                  <option value={129}>s</option>
                                  <option value={130}>testmangalorg</option>
                                  <option value={131}>Test org</option>
                                  <option value={132} />
                                  <option value={133} />
                                  <option value={134} />
                                  <option value={135} />
                                  <option value={136} />
                                  <option value={137} />
                                  <option value={138} />
                                  <option value={139} />
                                  <option value={140} />
                                  <option value={141} />
                                  <option value={142} />
                                  <option value={143} />
                                  <option value={144} />
                                  <option value={145} />
                                  <option value={146} />
                                  <option value={147} />
                                  <option value={148} />
                                  <option value={149} />
                                  <option value={150} />
                                  <option value={151} />
                                  <option value={152} />
                                  <option value={153} />
                                  <option value={154} />
                                  <option value={155} />
                                  <option value={156} />
                                  <option value={157} />
                                  <option value={158} />
                                  <option value={159} />
                                  <option value={160} />
                                  <option value={161} />
                                  <option value={162} />
                                  <option value={163} />
                                  <option value={164} />
                                  <option value={165} />
                                  <option value={166} />
                                  <option value={167} />
                                  <option value={168} />
                                  <option value={169} />
                                  <option value={170} />
                                  <option value={171} />
                                  <option value={172}>MARTAHON NEXA 1</option>
                                  <option value={173} />
                                  <option value={174} />
                                  <option value={175}>Marathon NEXA -2</option>
                                  <option value={176} />
                                  <option value={177} />
                                  <option value={178} />
                                  <option value={179} />
                                  <option value={180} />
                                  <option value={181} />
                                  <option value={182} />
                                  <option value={183} />
                                  <option value={184} />
                                  <option value={185} />
                                  <option value={186} />
                                  <option value={187} />
                                  <option value={188} />
                                  <option value={189} />
                                  <option value={190} />
                                  <option value={191} />
                                  <option value={192} />
                                  <option value={193}>Lockated</option>
                                  <option value={194}>Lockated Test</option>
                                  <option value={195}>Some Org</option>
                                  <option value={196}>Test Marathon</option>
                                  <option value={197}>Demo Marathon</option>
                                  <option value={198}>lockated</option>
                                  <option value={199}>Lockated Test</option>
                                  <option value={200}>Lockated Test</option>
                                  <option value={201}>Marathon</option>
                                  <option value={202}>Lockated</option>
                                  <option value={203}>NOne</option>
                                  <option value={204}>NEW</option>
                                  <option value={205}>NOne</option>
                                  <option value={206}>NEW</option>
                                  <option value={207}>NOne</option>
                                  <option value={208}>NEW</option>
                                  <option value={209}>Test</option>
                                  <option value={210}>Test</option>
                                  <option value={211}>Test</option>
                                  <option value={212}>Marathon</option>
                                  <option value={213}>Test</option>
                                  <option value={214}>Test</option>
                                  <option value={215}>marathon</option>
                                  <option value={216}>Marathon</option>
                                  <option value={217}>NOne</option>
                                  <option value={218}>NOne</option>
                                  <option value={219}>NOne</option>
                                  <option value={220}>NOne</option>
                                  <option value={221}>NOne</option>
                                  <option value={222}>Lockated</option>
                                  <option value={223}>Testing</option>
                                  <option value={224}>Testing</option>
                                  <option value={225}>Testing</option>
                                  <option value={226}>marathon</option>
                                  <option value={227}>Testing</option>
                                  <option value={228}>Testing</option>
                                  <option value={229}>Testing</option>
                                  <option value={230}>Testing</option>
                                  <option value={231}>test</option>
                                  <option value={232}>
                                    D.M Infra.Pvt.Ltd.
                                  </option>
                                  <option value={233}>
                                    D.M Infra.Pvt.Ltd.1
                                  </option>
                                  <option value={234}>
                                    New Marathon Test 6/12
                                  </option>
                                  <option value={235}>Marathon 6/12/25</option>
                                  <option value={236}>
                                    Marathon 6/12/25 1
                                  </option>
                                  <option value={237}>
                                    Marathon 6/12/25 2
                                  </option>
                                  <option value={238}>DEMO WEST</option>
                                  <option value={239}>
                                    MTR Group.pvt.ltd.
                                  </option>
                                  <option value={240}>
                                    MTR Group.pvt.ltd.1
                                  </option>
                                  <option value={241}>
                                    MTR Group.pvt.ltd.2
                                  </option>
                                  <option value={242}>Ajay</option>
                                  <option value={243}>Ajay</option>
                                  <option value={244}>
                                    MTR Group.pvt.ltd.3
                                  </option>
                                  <option value={245}>MTR 1</option>
                                  <option value={246}>
                                    ASPECT INFRASTRUCTURE AND CONSTRUCTION
                                    PRIVATE LIMITED
                                  </option>
                                  <option value={247}>SGI Pvt Ltd 17/6</option>
                                  <option value={248}>
                                    SGI Pvt Ltd 17/6 1
                                  </option>
                                  <option value={249}>
                                    SGI Pvt Ltd 17/6 2
                                  </option>
                                  <option value={250}>N.C.C.Group</option>
                                  <option value={251}>N.C.C.Group</option>
                                  <option value={252}>K.L.M. Industries</option>
                                  <option value={253}>KSK Group</option>
                                  <option value={254}>
                                    L&amp;T Group pvt.
                                  </option>
                                  <option value={255}>
                                    L&amp;T Group pvt. 1
                                  </option>
                                  <option value={256}>
                                    L&amp;T Group pvt. 2
                                  </option>
                                  <option value={257}>
                                    KHURJAMA INFRA PRIVATE LIMITED
                                  </option>
                                  <option value={258}>Test ORG 1</option>
                                  <option value={259}>Test ORG 2</option>
                                  <option value={260}>Test ORG 1</option>
                                  <option value={261}>TEST NEW 1/7/25</option>
                                </select>
                                <span
                                  className="select2 select2-container select2-container--default select2-container--disabled"
                                  dir="ltr"
                                  data-select2-id="select2-data-227-jah0"
                                  style={{ width: "auto" }}
                                >
                                  <span className="selection">
                                    <span
                                      className="select2-selection select2-selection--single select2-selection--clearable"
                                      role="combobox"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      tabIndex={-1}
                                      aria-disabled="true"
                                      aria-labelledby="select2-tax_detail_13_supplier_id-container"
                                      aria-controls="select2-tax_detail_13_supplier_id-container"
                                    >
                                      <button
                                        type="button"
                                        className="select2-selection__clear"
                                        tabIndex={-1}
                                        title="Remove all items"
                                        aria-label="Remove all items"
                                        aria-describedby="select2-tax_detail_13_supplier_id-container"
                                        data-select2-id="select2-data-229-4lgm"
                                      >
                                        <span aria-hidden="true">×</span>
                                      </button>
                                      <span
                                        className="select2-selection__rendered"
                                        id="select2-tax_detail_13_supplier_id-container"
                                        role="textbox"
                                        aria-readonly="true"
                                        title="Select Service Provider"
                                      >
                                        Select Service Provider
                                      </span>
                                      <span
                                        className="select2-selection__arrow"
                                        role="presentation"
                                      >
                                        <b role="presentation" />
                                      </span>
                                    </span>
                                  </span>
                                  <span
                                    className="dropdown-wrapper"
                                    aria-hidden="true"
                                  />
                                </span>
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
                                  <option
                                    value=""
                                    data-select2-id="select2-data-449-78tt"
                                  >
                                    Select Service Provider
                                  </option>
                                  <option value={1}>lockated</option>
                                  <option value={2}>Marathon</option>
                                  <option value={6}>Marathon</option>
                                  <option value={7}>Marathon</option>
                                  <option value={15}>
                                    Test Vendor Organization
                                  </option>
                                  <option value={16}>
                                    Test Vendor Organization2
                                  </option>
                                  <option value={17}>
                                    Hindusatn Organization
                                  </option>
                                  <option value={19}>Swastik Org</option>
                                  <option value={20}>Swastik Test</option>
                                  <option value={21}>ulta tech</option>
                                  <option value={22}>Test1</option>
                                  <option value={23}>Test1</option>
                                  <option value={24}>
                                    Satyam organization
                                  </option>
                                  <option value={25}>
                                    Test Vendor Organization05
                                  </option>
                                  <option value={26}>
                                    Hindusatn Organization1
                                  </option>
                                  <option value={27}>Marathon</option>
                                  <option value={28}>
                                    Hindusatn Organization6
                                  </option>
                                  <option value={29}>
                                    Hindusatn Organization12
                                  </option>
                                  <option value={30}>
                                    Hindusatn Organization11
                                  </option>
                                  <option value={31}>
                                    Amazon Organization
                                  </option>
                                  <option value={33}>
                                    Swastik Suppliers Ltd.
                                  </option>
                                  <option value={34}>SHIVA ORGANIZATION</option>
                                  <option value={35}>SHIVA ORGANIZATION</option>
                                  <option value={36}>Panchshil Test</option>
                                  <option value={37}>sdfghjk</option>
                                  <option value={38}>
                                    Krushnai Water Suppliers
                                  </option>
                                  <option value={39}>
                                    Gautam Infrastructure &amp; Construction
                                    Equipment Private Limited
                                  </option>
                                  <option value={42}>Kudale Transport</option>
                                  <option value={43}>TRIFLEX SOLUTIONS</option>
                                  <option value={44}>MILLENIUM </option>
                                  <option value={45}>PANCHSHIL12</option>
                                  <option value={46}>Vendor Test</option>
                                  <option value={47}>Vendor Test2</option>
                                  <option value={48}>Vendor Test3</option>
                                  <option value={50}>Test Vendor </option>
                                  <option value={51}>
                                    Hindusatn Organization5
                                  </option>
                                  <option value={52}>Marathon</option>
                                  <option value={53}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={54}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={55}>Raj k</option>
                                  <option value={56}>T</option>
                                  <option value={57}>satya k</option>
                                  <option value={58}>SUM</option>
                                  <option value={59}>
                                    Sagar Organization1
                                  </option>
                                  <option value={60}>
                                    Sagar Organizationk
                                  </option>
                                  <option value={62}>Haven </option>
                                  <option value={63}>Haven 2</option>
                                  <option value={64}>Haven 3</option>
                                  <option value={65}>Panch Org</option>
                                  <option value={66}>Panch Realty</option>
                                  <option value={84}>
                                    JIO HAPTIK TECHNOLOGIES LIMITED
                                  </option>
                                  <option value={90}>test</option>
                                  <option value={91}>Test Org</option>
                                  <option value={92}>Test Org</option>
                                  <option value={93}>TEST Org</option>
                                  <option value={94}>TEST</option>
                                  <option value={95}>Demo</option>
                                  <option value={96}>Test Org</option>
                                  <option value={97}>Vendor Test</option>
                                  <option value={98}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={99}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={100}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={101}>Test Org</option>
                                  <option value={102}>Demo Test</option>
                                  <option value={103}>Test Org</option>
                                  <option value={104}>test</option>
                                  <option value={105}>Demo Org</option>
                                  <option value={106}>New Vendor</option>
                                  <option value={107}>Dhanu</option>
                                  <option value={108}>abcd</option>
                                  <option value={109}>asad</option>
                                  <option value={110}>test8</option>
                                  <option value={111}>Nexa Org</option>
                                  <option value={112}>test v</option>
                                  <option value={113}>aaabcd</option>
                                  <option value={114}>New Vendor</option>
                                  <option value={115}>New Vendor</option>
                                  <option value={116}>New Vendor</option>
                                  <option value={117}>Staturaty Details</option>
                                  <option value={118}>No Staturaty</option>
                                  <option value={119}>
                                    With Other Staturaty details
                                  </option>
                                  <option value={120}>
                                    With all saturaty and vrf
                                  </option>
                                  <option value={121}>TEST</option>
                                  <option value={122}>Dhananjay Group</option>
                                  <option value={128}>abvd</option>
                                  <option value={129}>s</option>
                                  <option value={130}>testmangalorg</option>
                                  <option value={131}>Test org</option>
                                  <option value={132} />
                                  <option value={133} />
                                  <option value={134} />
                                  <option value={135} />
                                  <option value={136} />
                                  <option value={137} />
                                  <option value={138} />
                                  <option value={139} />
                                  <option value={140} />
                                  <option value={141} />
                                  <option value={142} />
                                  <option value={143} />
                                  <option value={144} />
                                  <option value={145} />
                                  <option value={146} />
                                  <option value={147} />
                                  <option value={148} />
                                  <option value={149} />
                                  <option value={150} />
                                  <option value={151} />
                                  <option value={152} />
                                  <option value={153} />
                                  <option value={154} />
                                  <option value={155} />
                                  <option value={156} />
                                  <option value={157} />
                                  <option value={158} />
                                  <option value={159} />
                                  <option value={160} />
                                  <option value={161} />
                                  <option value={162} />
                                  <option value={163} />
                                  <option value={164} />
                                  <option value={165} />
                                  <option value={166} />
                                  <option value={167} />
                                  <option value={168} />
                                  <option value={169} />
                                  <option value={170} />
                                  <option value={171} />
                                  <option value={172}>MARTAHON NEXA 1</option>
                                  <option value={173} />
                                  <option value={174} />
                                  <option value={175}>Marathon NEXA -2</option>
                                  <option value={176} />
                                  <option value={177} />
                                  <option value={178} />
                                  <option value={179} />
                                  <option value={180} />
                                  <option value={181} />
                                  <option value={182} />
                                  <option value={183} />
                                  <option value={184} />
                                  <option value={185} />
                                  <option value={186} />
                                  <option value={187} />
                                  <option value={188} />
                                  <option value={189} />
                                  <option value={190} />
                                  <option value={191} />
                                  <option value={192} />
                                  <option value={193}>Lockated</option>
                                  <option value={194}>Lockated Test</option>
                                  <option value={195}>Some Org</option>
                                  <option value={196}>Test Marathon</option>
                                  <option value={197}>Demo Marathon</option>
                                  <option value={198}>lockated</option>
                                  <option value={199}>Lockated Test</option>
                                  <option value={200}>Lockated Test</option>
                                  <option value={201}>Marathon</option>
                                  <option value={202}>Lockated</option>
                                  <option value={203}>NOne</option>
                                  <option value={204}>NEW</option>
                                  <option value={205}>NOne</option>
                                  <option value={206}>NEW</option>
                                  <option value={207}>NOne</option>
                                  <option value={208}>NEW</option>
                                  <option value={209}>Test</option>
                                  <option value={210}>Test</option>
                                  <option value={211}>Test</option>
                                  <option value={212}>Marathon</option>
                                  <option value={213}>Test</option>
                                  <option value={214}>Test</option>
                                  <option value={215}>marathon</option>
                                  <option value={216}>Marathon</option>
                                  <option value={217}>NOne</option>
                                  <option value={218}>NOne</option>
                                  <option value={219}>NOne</option>
                                  <option value={220}>NOne</option>
                                  <option value={221}>NOne</option>
                                  <option value={222}>Lockated</option>
                                  <option value={223}>Testing</option>
                                  <option value={224}>Testing</option>
                                  <option value={225}>Testing</option>
                                  <option value={226}>marathon</option>
                                  <option value={227}>Testing</option>
                                  <option value={228}>Testing</option>
                                  <option value={229}>Testing</option>
                                  <option value={230}>Testing</option>
                                  <option value={231}>test</option>
                                  <option value={232}>
                                    D.M Infra.Pvt.Ltd.
                                  </option>
                                  <option value={233}>
                                    D.M Infra.Pvt.Ltd.1
                                  </option>
                                  <option value={234}>
                                    New Marathon Test 6/12
                                  </option>
                                  <option value={235}>Marathon 6/12/25</option>
                                  <option value={236}>
                                    Marathon 6/12/25 1
                                  </option>
                                  <option value={237}>
                                    Marathon 6/12/25 2
                                  </option>
                                  <option value={238}>DEMO WEST</option>
                                  <option value={239}>
                                    MTR Group.pvt.ltd.
                                  </option>
                                  <option value={240}>
                                    MTR Group.pvt.ltd.1
                                  </option>
                                  <option value={241}>
                                    MTR Group.pvt.ltd.2
                                  </option>
                                  <option value={242}>Ajay</option>
                                  <option value={243}>Ajay</option>
                                  <option value={244}>
                                    MTR Group.pvt.ltd.3
                                  </option>
                                  <option value={245}>MTR 1</option>
                                  <option value={246}>
                                    ASPECT INFRASTRUCTURE AND CONSTRUCTION
                                    PRIVATE LIMITED
                                  </option>
                                  <option value={247}>SGI Pvt Ltd 17/6</option>
                                  <option value={248}>
                                    SGI Pvt Ltd 17/6 1
                                  </option>
                                  <option value={249}>
                                    SGI Pvt Ltd 17/6 2
                                  </option>
                                  <option value={250}>N.C.C.Group</option>
                                  <option value={251}>N.C.C.Group</option>
                                  <option value={252}>K.L.M. Industries</option>
                                  <option value={253}>KSK Group</option>
                                  <option value={254}>
                                    L&amp;T Group pvt.
                                  </option>
                                  <option value={255}>
                                    L&amp;T Group pvt. 1
                                  </option>
                                  <option value={256}>
                                    L&amp;T Group pvt. 2
                                  </option>
                                  <option value={257}>
                                    KHURJAMA INFRA PRIVATE LIMITED
                                  </option>
                                  <option value={258}>Test ORG 1</option>
                                  <option value={259}>Test ORG 2</option>
                                  <option value={260}>Test ORG 1</option>
                                  <option value={261}>TEST NEW 1/7/25</option>
                                </select>
                                <span
                                  className="select2 select2-container select2-container--default select2-container--disabled"
                                  dir="ltr"
                                  data-select2-id="select2-data-448-7dqn"
                                  style={{ width: "auto" }}
                                >
                                  <span className="selection">
                                    <span
                                      className="select2-selection select2-selection--single select2-selection--clearable"
                                      role="combobox"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      tabIndex={-1}
                                      aria-disabled="true"
                                      aria-labelledby="select2-tax_detail_17_supplier_id-container"
                                      aria-controls="select2-tax_detail_17_supplier_id-container"
                                    >
                                      <button
                                        type="button"
                                        className="select2-selection__clear"
                                        tabIndex={-1}
                                        title="Remove all items"
                                        aria-label="Remove all items"
                                        aria-describedby="select2-tax_detail_17_supplier_id-container"
                                        data-select2-id="select2-data-450-83t4"
                                      >
                                        <span aria-hidden="true">×</span>
                                      </button>
                                      <span
                                        className="select2-selection__rendered"
                                        id="select2-tax_detail_17_supplier_id-container"
                                        role="textbox"
                                        aria-readonly="true"
                                        title="Select Service Provider"
                                      >
                                        Select Service Provider
                                      </span>
                                      <span
                                        className="select2-selection__arrow"
                                        role="presentation"
                                      >
                                        <b role="presentation" />
                                      </span>
                                    </span>
                                  </span>
                                  <span
                                    className="dropdown-wrapper"
                                    aria-hidden="true"
                                  />
                                </span>
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
                                  <option
                                    value=""
                                    data-select2-id="select2-data-670-2moy"
                                  >
                                    Select Service Provider
                                  </option>
                                  <option value={1}>lockated</option>
                                  <option value={2}>Marathon</option>
                                  <option value={6}>Marathon</option>
                                  <option value={7}>Marathon</option>
                                  <option value={15}>
                                    Test Vendor Organization
                                  </option>
                                  <option value={16}>
                                    Test Vendor Organization2
                                  </option>
                                  <option value={17}>
                                    Hindusatn Organization
                                  </option>
                                  <option value={19}>Swastik Org</option>
                                  <option value={20}>Swastik Test</option>
                                  <option value={21}>ulta tech</option>
                                  <option value={22}>Test1</option>
                                  <option value={23}>Test1</option>
                                  <option value={24}>
                                    Satyam organization
                                  </option>
                                  <option value={25}>
                                    Test Vendor Organization05
                                  </option>
                                  <option value={26}>
                                    Hindusatn Organization1
                                  </option>
                                  <option value={27}>Marathon</option>
                                  <option value={28}>
                                    Hindusatn Organization6
                                  </option>
                                  <option value={29}>
                                    Hindusatn Organization12
                                  </option>
                                  <option value={30}>
                                    Hindusatn Organization11
                                  </option>
                                  <option value={31}>
                                    Amazon Organization
                                  </option>
                                  <option value={33}>
                                    Swastik Suppliers Ltd.
                                  </option>
                                  <option value={34}>SHIVA ORGANIZATION</option>
                                  <option value={35}>SHIVA ORGANIZATION</option>
                                  <option value={36}>Panchshil Test</option>
                                  <option value={37}>sdfghjk</option>
                                  <option value={38}>
                                    Krushnai Water Suppliers
                                  </option>
                                  <option value={39}>
                                    Gautam Infrastructure &amp; Construction
                                    Equipment Private Limited
                                  </option>
                                  <option value={42}>Kudale Transport</option>
                                  <option value={43}>TRIFLEX SOLUTIONS</option>
                                  <option value={44}>MILLENIUM </option>
                                  <option value={45}>PANCHSHIL12</option>
                                  <option value={46}>Vendor Test</option>
                                  <option value={47}>Vendor Test2</option>
                                  <option value={48}>Vendor Test3</option>
                                  <option value={50}>Test Vendor </option>
                                  <option value={51}>
                                    Hindusatn Organization5
                                  </option>
                                  <option value={52}>Marathon</option>
                                  <option value={53}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={54}>
                                    Hindusatn Organization52
                                  </option>
                                  <option value={55}>Raj k</option>
                                  <option value={56}>T</option>
                                  <option value={57}>satya k</option>
                                  <option value={58}>SUM</option>
                                  <option value={59}>
                                    Sagar Organization1
                                  </option>
                                  <option value={60}>
                                    Sagar Organizationk
                                  </option>
                                  <option value={62}>Haven </option>
                                  <option value={63}>Haven 2</option>
                                  <option value={64}>Haven 3</option>
                                  <option value={65}>Panch Org</option>
                                  <option value={66}>Panch Realty</option>
                                  <option value={84}>
                                    JIO HAPTIK TECHNOLOGIES LIMITED
                                  </option>
                                  <option value={90}>test</option>
                                  <option value={91}>Test Org</option>
                                  <option value={92}>Test Org</option>
                                  <option value={93}>TEST Org</option>
                                  <option value={94}>TEST</option>
                                  <option value={95}>Demo</option>
                                  <option value={96}>Test Org</option>
                                  <option value={97}>Vendor Test</option>
                                  <option value={98}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={99}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={100}>
                                    THACKERS CATERERS BKK.
                                  </option>
                                  <option value={101}>Test Org</option>
                                  <option value={102}>Demo Test</option>
                                  <option value={103}>Test Org</option>
                                  <option value={104}>test</option>
                                  <option value={105}>Demo Org</option>
                                  <option value={106}>New Vendor</option>
                                  <option value={107}>Dhanu</option>
                                  <option value={108}>abcd</option>
                                  <option value={109}>asad</option>
                                  <option value={110}>test8</option>
                                  <option value={111}>Nexa Org</option>
                                  <option value={112}>test v</option>
                                  <option value={113}>aaabcd</option>
                                  <option value={114}>New Vendor</option>
                                  <option value={115}>New Vendor</option>
                                  <option value={116}>New Vendor</option>
                                  <option value={117}>Staturaty Details</option>
                                  <option value={118}>No Staturaty</option>
                                  <option value={119}>
                                    With Other Staturaty details
                                  </option>
                                  <option value={120}>
                                    With all saturaty and vrf
                                  </option>
                                  <option value={121}>TEST</option>
                                  <option value={122}>Dhananjay Group</option>
                                  <option value={128}>abvd</option>
                                  <option value={129}>s</option>
                                  <option value={130}>testmangalorg</option>
                                  <option value={131}>Test org</option>
                                  <option value={132} />
                                  <option value={133} />
                                  <option value={134} />
                                  <option value={135} />
                                  <option value={136} />
                                  <option value={137} />
                                  <option value={138} />
                                  <option value={139} />
                                  <option value={140} />
                                  <option value={141} />
                                  <option value={142} />
                                  <option value={143} />
                                  <option value={144} />
                                  <option value={145} />
                                  <option value={146} />
                                  <option value={147} />
                                  <option value={148} />
                                  <option value={149} />
                                  <option value={150} />
                                  <option value={151} />
                                  <option value={152} />
                                  <option value={153} />
                                  <option value={154} />
                                  <option value={155} />
                                  <option value={156} />
                                  <option value={157} />
                                  <option value={158} />
                                  <option value={159} />
                                  <option value={160} />
                                  <option value={161} />
                                  <option value={162} />
                                  <option value={163} />
                                  <option value={164} />
                                  <option value={165} />
                                  <option value={166} />
                                  <option value={167} />
                                  <option value={168} />
                                  <option value={169} />
                                  <option value={170} />
                                  <option value={171} />
                                  <option value={172}>MARTAHON NEXA 1</option>
                                  <option value={173} />
                                  <option value={174} />
                                  <option value={175}>Marathon NEXA -2</option>
                                  <option value={176} />
                                  <option value={177} />
                                  <option value={178} />
                                  <option value={179} />
                                  <option value={180} />
                                  <option value={181} />
                                  <option value={182} />
                                  <option value={183} />
                                  <option value={184} />
                                  <option value={185} />
                                  <option value={186} />
                                  <option value={187} />
                                  <option value={188} />
                                  <option value={189} />
                                  <option value={190} />
                                  <option value={191} />
                                  <option value={192} />
                                  <option value={193}>Lockated</option>
                                  <option value={194}>Lockated Test</option>
                                  <option value={195}>Some Org</option>
                                  <option value={196}>Test Marathon</option>
                                  <option value={197}>Demo Marathon</option>
                                  <option value={198}>lockated</option>
                                  <option value={199}>Lockated Test</option>
                                  <option value={200}>Lockated Test</option>
                                  <option value={201}>Marathon</option>
                                  <option value={202}>Lockated</option>
                                  <option value={203}>NOne</option>
                                  <option value={204}>NEW</option>
                                  <option value={205}>NOne</option>
                                  <option value={206}>NEW</option>
                                  <option value={207}>NOne</option>
                                  <option value={208}>NEW</option>
                                  <option value={209}>Test</option>
                                  <option value={210}>Test</option>
                                  <option value={211}>Test</option>
                                  <option value={212}>Marathon</option>
                                  <option value={213}>Test</option>
                                  <option value={214}>Test</option>
                                  <option value={215}>marathon</option>
                                  <option value={216}>Marathon</option>
                                  <option value={217}>NOne</option>
                                  <option value={218}>NOne</option>
                                  <option value={219}>NOne</option>
                                  <option value={220}>NOne</option>
                                  <option value={221}>NOne</option>
                                  <option value={222}>Lockated</option>
                                  <option value={223}>Testing</option>
                                  <option value={224}>Testing</option>
                                  <option value={225}>Testing</option>
                                  <option value={226}>marathon</option>
                                  <option value={227}>Testing</option>
                                  <option value={228}>Testing</option>
                                  <option value={229}>Testing</option>
                                  <option value={230}>Testing</option>
                                  <option value={231}>test</option>
                                  <option value={232}>
                                    D.M Infra.Pvt.Ltd.
                                  </option>
                                  <option value={233}>
                                    D.M Infra.Pvt.Ltd.1
                                  </option>
                                  <option value={234}>
                                    New Marathon Test 6/12
                                  </option>
                                  <option value={235}>Marathon 6/12/25</option>
                                  <option value={236}>
                                    Marathon 6/12/25 1
                                  </option>
                                  <option value={237}>
                                    Marathon 6/12/25 2
                                  </option>
                                  <option value={238}>DEMO WEST</option>
                                  <option value={239}>
                                    MTR Group.pvt.ltd.
                                  </option>
                                  <option value={240}>
                                    MTR Group.pvt.ltd.1
                                  </option>
                                  <option value={241}>
                                    MTR Group.pvt.ltd.2
                                  </option>
                                  <option value={242}>Ajay</option>
                                  <option value={243}>Ajay</option>
                                  <option value={244}>
                                    MTR Group.pvt.ltd.3
                                  </option>
                                  <option value={245}>MTR 1</option>
                                  <option value={246}>
                                    ASPECT INFRASTRUCTURE AND CONSTRUCTION
                                    PRIVATE LIMITED
                                  </option>
                                  <option value={247}>SGI Pvt Ltd 17/6</option>
                                  <option value={248}>
                                    SGI Pvt Ltd 17/6 1
                                  </option>
                                  <option value={249}>
                                    SGI Pvt Ltd 17/6 2
                                  </option>
                                  <option value={250}>N.C.C.Group</option>
                                  <option value={251}>N.C.C.Group</option>
                                  <option value={252}>K.L.M. Industries</option>
                                  <option value={253}>KSK Group</option>
                                  <option value={254}>
                                    L&amp;T Group pvt.
                                  </option>
                                  <option value={255}>
                                    L&amp;T Group pvt. 1
                                  </option>
                                  <option value={256}>
                                    L&amp;T Group pvt. 2
                                  </option>
                                  <option value={257}>
                                    KHURJAMA INFRA PRIVATE LIMITED
                                  </option>
                                  <option value={258}>Test ORG 1</option>
                                  <option value={259}>Test ORG 2</option>
                                  <option value={260}>Test ORG 1</option>
                                  <option value={261}>TEST NEW 1/7/25</option>
                                </select>
                                <span
                                  className="select2 select2-container select2-container--default select2-container--disabled"
                                  dir="ltr"
                                  data-select2-id="select2-data-669-4qkm"
                                  style={{ width: "auto" }}
                                >
                                  <span className="selection">
                                    <span
                                      className="select2-selection select2-selection--single select2-selection--clearable"
                                      role="combobox"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      tabIndex={-1}
                                      aria-disabled="true"
                                      aria-labelledby="select2-tax_detail_21_supplier_id-container"
                                      aria-controls="select2-tax_detail_21_supplier_id-container"
                                    >
                                      <button
                                        type="button"
                                        className="select2-selection__clear"
                                        tabIndex={-1}
                                        title="Remove all items"
                                        aria-label="Remove all items"
                                        aria-describedby="select2-tax_detail_21_supplier_id-container"
                                        data-select2-id="select2-data-671-yu6v"
                                      >
                                        <span aria-hidden="true">×</span>
                                      </button>
                                      <span
                                        className="select2-selection__rendered"
                                        id="select2-tax_detail_21_supplier_id-container"
                                        role="textbox"
                                        aria-readonly="true"
                                        title="Select Service Provider"
                                      >
                                        Select Service Provider
                                      </span>
                                      <span
                                        className="select2-selection__arrow"
                                        role="presentation"
                                      >
                                        <b role="presentation" />
                                      </span>
                                    </span>
                                  </span>
                                  <span
                                    className="dropdown-wrapper"
                                    aria-hidden="true"
                                  />
                                </span>
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
