import React, { useEffect, useRef, useState } from 'react';



export default function GrnDetail() {

 

  return (
    <div>
     <div className="website-content overflow-auto details_page">
  <div className="module-data-section container-fluid details_page">
    <a href="">Home &gt; Store &gt; Store Operations &gt; GRN</a>
    <h5 className="mt-3">Create Goods Received Note</h5>
    <div className="row my-4 align-items-center">
      <div className="col-md-12 px-2">
        <div className="head-material text-center">
          <h4>GRN For Purchase Order</h4>
        </div>
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
                className="nav-link "
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
                className="nav-link active"
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
            <li className="nav-item" role="presentation"></li>
          </ul>
        </div>
        <div
          className="tab-pane fade show active"
          id="nav-home"
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
                    <span className="me-3">:-</span>Material
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Project </label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Sanvo Resorts Pvt. Ltd.-II
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Sub Project</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Nexzone - Phase II
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Wing</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Demo Wing
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>GRN ID </label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>82423
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>GRN NO</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>PO/SRPL/NXZPh2/18254
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>GRN Date</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>INR 65,47,926.82
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>To Store </label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>INR 0.00
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Supplier</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Delivery Chalan No.</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Gate Entry No.</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Delivery Challan Date</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Remark</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Vehicle No.</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Description</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>PO No.</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6 ">
                  <label>Gate No.</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>LANDMARK REALTY(L-06),
                    Mumbai (Bombay)
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Material Details (1/2)</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx={16} cy={16} r={16} fill="#8B0203" />
                    <path d="M16 24L9.0718 12L22.9282 12L16 24Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="card-body mt-1 pt-1">
              <div className="mt-2">
                <h5 className=" ">Materials</h5>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Material Description</th>
                      <th rowSpan={2}>Is QC Required</th>
                      <th rowSpan={2}>Is MTC Received</th>
                      <th rowSpan={2}>UOM</th>
                      <th colSpan={9}>Quantity</th>
                      <th />
                    </tr>
                    <tr>
                      <th>Ordered</th>
                      <th>Received Up to</th>
                      <th>Received</th>
                      <th>Breakage</th>
                      <th>Defective</th>
                      <th>Accepted</th>
                      <th>Cumulative</th>
                      <th>Tolerance Qty</th>
                      <th>Inspection Date</th>
                      <th>Warranty Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Tiles- Ceramic- Flooring Tiles- -300 x 300 Sperenza
                        White
                      </td>
                      <td>No</td>
                      <td>Yes</td>
                      <td>Nos</td>
                      <td>40</td>
                      <td>0</td>
                      <td>40</td>
                      <td>0</td>
                      <td>0</td>
                      <td>40</td>
                      <td>40</td>
                      <td>8</td>
                      <td>06-03-24</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card p-3">
                <div className="mt-2">
                  <h5 className=" ">MOR Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>MOR No.</th>
                        <th>MOR Ordered</th>
                        <th>Received Upto GRN</th>
                        <th>Received Upto Date</th>
                        <th>MOR Accepted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>IN/NZR01/ANT01/152</td>
                        <td>402.000</td>
                        <td>321.330</td>
                        <td>396.090</td>
                        <td>23.350</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2">
                  <h5 className=" ">Delivery Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="fw-bold">Delivery Date</th>
                        <th className="fw-bold">Delivery Qty</th>
                        <th className="fw-bold">Batch No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>05-03-2024</td>
                        <td>20</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <th>40</th>
                        <th />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card p-3">
                <div className="mt-2">
                  <h5 className=" ">MOR Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>MOR No.</th>
                        <th>MOR Ordered</th>
                        <th>Received Upto GRN</th>
                        <th>Received Upto Date</th>
                        <th>MOR Accepted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>IN/NZR01/ANT01/152</td>
                        <td>402.000</td>
                        <td>321.330</td>
                        <td>396.090</td>
                        <td>23.350</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2">
                  <h5 className=" ">Delivery Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="fw-bold">Delivery Date</th>
                        <th className="fw-bold">Delivery Qty</th>
                        <th className="fw-bold">Batch No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>05-03-2024</td>
                        <td>20</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <th>40</th>
                        <th />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="">
                <h5 className=" ">Material Batches</h5>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Material Batch No.</th>
                      <th>Qty</th>
                      <th>Mfg. Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TIL01122023</td>
                      <td>40</td>
                      <td>01-12-2023</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Defective Material Remark
                    </label>
                    <input
                      className="form-control"
                      placeholder="Material"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Material Details (2/2)</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx={16} cy={16} r={16} fill="#8B0203" />
                    <path d="M16 24L9.0718 12L22.9282 12L16 24Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="card-body pt-1 mt-1">
              <div className="mt-2">
                <h5 className=" ">Materials</h5>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Material Description</th>
                      <th rowSpan={2}>Is QC Required</th>
                      <th rowSpan={2}>Is MTC Received</th>
                      <th rowSpan={2}>UOM</th>
                      <th colSpan={9}>Quantity</th>
                      <th />
                    </tr>
                    <tr>
                      <th>Ordered</th>
                      <th>Received Up to</th>
                      <th>Received</th>
                      <th>Breakage</th>
                      <th>Defective</th>
                      <th>Accepted</th>
                      <th>Cumulative</th>
                      <th>Tolerance Qty</th>
                      <th>Inspection Date</th>
                      <th>Warranty Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Tiles- Ceramic- Flooring Tiles- -300 x 300 Sperenza
                        White
                      </td>
                      <td>No</td>
                      <td>Yes</td>
                      <td>Nos</td>
                      <td>40</td>
                      <td>0</td>
                      <td>40</td>
                      <td>0</td>
                      <td>0</td>
                      <td>40</td>
                      <td>40</td>
                      <td>8</td>
                      <td>06-03-24</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card p-3">
                <div className="mt-2">
                  <h5 className=" ">MOR Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>MOR No.</th>
                        <th>MOR Ordered</th>
                        <th>Received Upto GRN</th>
                        <th>Received Upto Date</th>
                        <th>MOR Accepted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>IN/NZR01/ANT01/152</td>
                        <td>402.000</td>
                        <td>321.330</td>
                        <td>396.090</td>
                        <td>23.350</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2">
                  <h5 className=" ">Delivery Details</h5>
                </div>
                <div className="tbl-container me-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="fw-bold">Delivery Date</th>
                        <th className="fw-bold">Delivery Qty</th>
                        <th className="fw-bold">Batch No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>05-03-2024</td>
                        <td>20</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <th>40</th>
                        <th />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="">
                <h5 className=" ">Material Batches</h5>
              </div>
              <div className="tbl-container me-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Material Batch No.</th>
                      <th>Qty</th>
                      <th>Mfg. Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TIL01122023</td>
                      <td>40</td>
                      <td>01-12-2023</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Defective Material Remark
                    </label>
                    <input
                      className="form-control"
                      placeholder="Material"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" d-flex justify-content-between align-items-center">
            <h5 className=" mt-3">Document Attachment</h5>
          </div>
          <div className="  mt-2">
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
          <div className="row mt-2">
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
          <div className="row">
            <div className="col-md-12">
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
</div>
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
          Search Purchase Orders
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div className="modal-body">
        <div className="col-md-4">
          <div className="form-group">
            <label className="po-fontBold">Company</label>
            <select
              className="form-control form-select"
              style={{ width: "100%" }}
              fdprocessedid="qwyjl"
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
        <div className="card-body">
          <div className="row">
            <div className="col-sm-3">
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
          <div className="row">
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Project</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Not Selected"
                />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Sub Project</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Not Selected"
                />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">PO Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Not Selected"
                />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Supplier</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">PO Start Date</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">PO End Date</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Indent</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Work Order</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Work Category</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
            <div className="col-md-6 mt-0">
              <div className="form-group">
                <label className="po-fontBold">Contractor</label>
                <input className="form-control" type="text" placeholder="" />
              </div>
            </div>
          </div>
          <div className="row mt-1" style={{ borderTop: "1px solid black" }}>
            <div className="col-md-4">
              <div className="form-group">
                <label className="po-fontBold">Material Type</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                  fdprocessedid="i7hpfh"
                >
                  <option selected="selected">[Show All]</option>
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
                <label className="po-fontBold">Material Sub Type</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                  fdprocessedid="i7hpfh"
                >
                  <option selected="selected">[Show All]</option>
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
                <label className="po-fontBold">Material</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                  fdprocessedid="i7hpfh"
                >
                  <option selected="selected">[Show All]</option>
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
          <div className="mt-1 justify-content-center d-flex">
            <button className="purple-btn2" fdprocessedid="e5fvu5">
              Search
            </button>
            <button className="purple-btn2" fdprocessedid="80m63s">
              show All
            </button>
            <button className="purple-btn1" fdprocessedid="80m63s">
              Reset
            </button>
            <button className="purple-btn1" fdprocessedid="80m63s">
              Close
            </button>
          </div>
          <div>
            <div>
              <h5>Search Result</h5>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p>Displaying page 1 of 9</p>
              </div>
              <div className="d-flex">
                <div className="form-group">
                  <label className="po-fontBold">Display</label>
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
            <div className="card mt-1">
              <nav aria-label="Page navigation example" style={{ height: 50 }}>
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
                      <th />
                      <th>PO Number</th>
                      <th>PO Date</th>
                      <th>Supplier Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="radio" />
                      </td>
                      <td>PO/CDoM/MB001/3203</td>
                      <td>Feb 08, 2021</td>
                      <td>AMBUJA CEMENTS LIMITED</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="radio" />
                      </td>
                      <td>PO/CDoM/MB001/3203</td>
                      <td>Feb 08, 2021</td>
                      <td>AMBUJA CEMENTS LIMITED</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="radio" />
                      </td>
                      <td>PO/CDoM/MB001/3203</td>
                      <td>Feb 08, 2021</td>
                      <td>AMBUJA CEMENTS LIMITED</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="radio" />
                      </td>
                      <td>PO/CDoM/MB001/3203</td>
                      <td>Feb 08, 2021</td>
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

    </div>
  );
}
