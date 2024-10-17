import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

export default function CreateRfq() {
  const [orderDetails, setOrderDetails] = useState(true);
  const [materialOne, setMaterialOne] = useState(true);
  const [materialTwo, setMaterialTwo] = useState(true);
  const [eventTypeModal, setEventTypeModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [eventSchedule, setEventSchedule] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [eventType, setEventType] = useState("auction");
  const [awardType, setAwardType] = useState("single");
  const [dynamicExtension, setDynamicExtension] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("Rank Based");

  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);

  const handleVendorClose = () => setVendorModal(false);
  const handleVendorModalShow = () => setVendorModal(true);

  const handleDocumentClose = () => setDocumentModal(false);
  const handleDocumentModalShow = () => setDocumentModal(true);

  const handleAttachmentClose = () => setAttachmentModal(false);
  const handleAttachmentModalShow = () => {
    handleDocumentClose();
    setAttachmentModal(true);
  };

  const handleEventScheduleClose = () => {
    setEventSchedule(false);
  };
  const handleEventScheduleModalShow = () => {
    setEventSchedule(true);
  };

  const handleRadioChange = (strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleEventTypeModalShow = () => {
    setEventTypeModal(true);
  };
  const handleEventTypeModalClose = () => {
    setEventTypeModal(false);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleAwardTypeChange = (e) => {
    setAwardType(e.target.value);
  };

  const handleDynamicExtensionChange = (e) => {
    setDynamicExtension(e.target.checked);
  };

  const orderDropdown = () => {
    setOrderDetails(!orderDetails);
  };
  const materialOneDropdown = () => {
    setMaterialOne(!materialOne);
  };
  const materialTwoDropdown = () => {
    setMaterialTwo(!materialTwo);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">
              Home &gt; Purchase &gt; Procurement &gt; Create RFQ &amp; Auction
            </a>
            <h5 className="mt-4">Create RFQ &amp; Auction</h5>
            <div className="row my-4 align-items-center">
              <div className="head-material text-center">
                <h4>Create RFQ &amp; Auction</h4>
              </div>
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
                      MOR (1/4)
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
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
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="false"
                    >
                      Acceptance
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="false"
                    >
                      Auction / RFQ
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
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
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
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
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
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
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
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
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="false"
                    >
                      Billing
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content mor-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="container-fluid">
                    <div className="row">
                      <div className="card-body">
                        <div className="row align-items-end justify-items-end">
                          <div className="col-md-4 mt-0">
                            <div className="form-group">
                              <label className="po-fontBold">Event Type</label>
                            </div>
                            <input
                              className="form-control "
                              onClick={handleEventTypeModalShow}
                              placeholder="+ Select [RFQ / Auction]"
                            />
                          </div>
                          <div className="col-md-4 mt-0">
                            <div className="form-group">
                              <label className="po-fontBold">Event No.</label>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Neo Valley"
                              />
                            </div>
                          </div>
                          <div className="col-md-4 mt-0">
                            <div className="form-group">
                              <label className="po-fontBold">Created On</label>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Materia"
                              />
                            </div>
                          </div>
                          <div className="col-md-4 mt-2">
                            <div className="form-group">
                              <label className="po-fontBold">
                                Material Type
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
                              <label className="po-fontBold">
                                Event Schedule
                              </label>
                            </div>
                            <input
                              className="form-control "
                              onClick={handleEventScheduleModalShow}
                              placeholder="From [dd-mm-yy hh:mm] To [dd-mm-yy hh:mm] ([DD] Days
                                                          [HH] Hrs [MM] Mins)"
                            />
                          </div>
                          <div className="col-md-4 mt-2 ">
                            <button className="purple-btn1 m-0 color-#fff">
                                <span className="material-symbols-outlined align-text-top">
                                  add
                                </span>
                                Additional Vendor Fields
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className=" mb-0">Order Summery</h5>
                            <button
                              type="submit"
                              className="btn btn-md"
                              onClick={handleSettingModalShow}
                            >
                              <svg
                                width={22}
                                height={24}
                                viewBox="0 0 22 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M10.9985 7.45532C8.64565 7.45532 6.73828 9.36269 6.73828 11.7155C6.73828 14.0684 8.64565 15.9757 10.9985 15.9757C13.3514 15.9757 15.2587 14.0684 15.2587 11.7155C15.2587 9.36269 13.3514 7.45532 10.9985 7.45532ZM8.86838 11.7155C8.86838 10.5391 9.82208 9.58544 10.9985 9.58544C12.1749 9.58544 13.1286 10.5391 13.1286 11.7155C13.1286 12.892 12.1749 13.8457 10.9985 13.8457C9.82208 13.8457 8.86838 12.892 8.86838 11.7155Z"
                                  fill="#8B0203"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M14.3416 2.97635C13.8887 -0.992103 8.10872 -0.992127 7.65577 2.97635L7.56116 3.80528C7.46818 4.61997 6.60664 5.12268 5.84081 4.79072L5.07295 4.45788C1.43655 2.88166 -1.52087 7.83752 1.73283 10.2351L2.40609 10.7312C3.07122 11.2213 3.07122 12.2099 2.40609 12.7L1.73283 13.1961C-1.52085 15.5936 1.43653 20.5496 5.07295 18.9733L5.84081 18.6405C6.60664 18.3085 7.46818 18.8113 7.56116 19.6259L7.65577 20.4549C8.10872 24.4233 13.8887 24.4233 14.3416 20.4549L14.4362 19.6259C14.5292 18.8113 15.3908 18.3085 16.1565 18.6405L16.9244 18.9733C20.5609 20.5495 23.5183 15.5936 20.2645 13.1961L19.5913 12.7C18.9262 12.2099 18.9262 11.2213 19.5913 10.7312L20.2645 10.2351C23.5183 7.83753 20.5609 2.88164 16.9244 4.45788L16.1566 4.79072C15.3908 5.12268 14.5292 4.61997 14.4362 3.8053L14.3416 2.97635ZM9.77214 3.2179C9.93768 1.76752 12.0597 1.7675 12.2252 3.2179L12.3198 4.04684C12.5762 6.29253 14.9347 7.64199 17.0037 6.74512L17.7716 6.41228C19.1548 5.81273 20.1484 7.67469 19.001 8.52023L18.3278 9.01632C16.5072 10.3578 16.5072 13.0734 18.3278 14.4149L19.001 14.911C20.1484 15.7566 19.1548 17.6185 17.7716 17.019L17.0037 16.686C14.9347 15.7891 12.5762 17.1386 12.3198 19.3843L12.2252 20.2133C12.0597 21.6636 9.93768 21.6638 9.77214 20.2133L9.67753 19.3843C9.42121 17.1386 7.06273 15.7891 4.99366 16.686L4.22578 17.019C2.84258 17.6185 1.84896 15.7566 2.99644 14.911L3.66969 14.4149C5.49017 13.0734 5.49015 10.3578 3.66969 9.01632L2.99642 8.52021C1.84898 7.67471 2.84256 5.81271 4.2258 6.4123L4.99366 6.74512C7.06273 7.64199 9.42121 6.29253 9.67753 4.04684L9.77214 3.2179Z"
                                  fill="#8B0203"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="tbl-container px-0 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>
                                  <input type="checkbox" />
                                </th>
                                <th>Company</th>
                                <th>Project</th>
                                <th>Sub-Project</th>
                                <th>MOR No.</th>
                                <th>Material Sub-Type</th>
                                <th>Material</th>
                                <th>Material Description</th>
                                <th>Material Specifications</th>
                                <th>UOM</th>
                                <th>Order Qty</th>
                                <th>Min Qty</th>
                                <th>Tick Size</th>
                                <th>Price Cap</th>
                                <th>Price</th>
                                <th>Discount %</th>
                                <th>Discounted Rate</th>
                                <th>Qty Available</th>
                                <th>Participant Attachment</th>
                                <th>CGST</th>
                                <th>SGST</th>
                                <th>IGST</th>
                                <th>Total Amount</th>
                                <th>Vendor Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="checkbox" />
                                </td>
                                <td>MNRL</td>
                                <td>NeoValley</td>
                                <td>Neo Valley- Building</td>
                                <td>MOR/MAR/MAX/ 101/02/2024</td>
                                <td>Tiles</td>
                                <td>Plain white Tiles</td>
                                <td>Plain White Sperenza Tiles</td>
                                <td>300 x 300 mm</td>
                                <td>Nos</td>
                                <td>10000</td>
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
                                <td />
                                <td />
                              </tr>
                              <tr>
                                <td>
                                  <input type="checkbox" />
                                </td>
                                <td>MNRL</td>
                                <td>NeoValley</td>
                                <td>Neo Valley- Building</td>
                                <td>MOR/MAR/MAX/ 101/02/2024</td>
                                <td>Tiles</td>
                                <td>Plain white Tiles</td>
                                <td>Plain White Sperenza Tiles</td>
                                <td>300 x 300 mm</td>
                                <td>Nos</td>
                                <td>10000</td>
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
                                <td />
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* form-select EXAMPLE */}
                    </div>
                    <div className="row">
                      <div className="card pb-3 px-0 rounded-4">
                        <div className="card-header bg-white border-0 rounded-0 ">
                          <h3 className="card-title">Order Details</h3>
                          <div className="card-tools">
                            <button
                              type="button"
                              className="btn btn-tool mt-0"
                              data-card-widget="collapse"
                              fdprocessedid="7rbmxj"
                              onClick={orderDropdown}
                            >
                              <svg
                                width={32}
                                height={32}
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx={16} cy={16} r={16} fill="#8B0203" />
                                <path
                                  d="M16 24L9.0718 12L22.9282 12L16 24Z"
                                  fill="white"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {orderDetails && (
                          <div className="card-body">
                            <div
                              className="card card-default"
                              id="mor-material-details"
                            >
                              <div className="card-header bg-white border-0">
                                <h3 className="card-title">
                                  Material Details (1/2)
                                </h3>
                                <div className="card-tools">
                                  <button
                                    type="button"
                                    className="btn btn-tool mt-0"
                                    data-card-widget="collapse"
                                    fdprocessedid="7rbmxj"
                                    onClick={materialOneDropdown}
                                  >
                                    <svg
                                      width={32}
                                      height={32}
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx={16}
                                        cy={16}
                                        r={16}
                                        fill="#8B0203"
                                      />
                                      <path
                                        d="M16 24L9.0718 12L22.9282 12L16 24Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {/* /.card-header */}
                              <div
                                className="card-body1 p-3"
                                style={{ display: "none" }}
                              >
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        MOR No
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="MOR/MAR/101/02/2024"
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Material
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Plain grey tiles"
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Order Qty
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder={12000}
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {materialOne && (
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Company</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            MNRL
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
                                        <label>Project</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            Neo-valley
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
                                        <label>Sub-Project</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            NeoValley- Building
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
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>MOR Number</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="MOR/MAR/101/02/2024"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Material Sub Type</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Tiles"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Material</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Plain white tiles"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>UOM</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Nos"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Order Qty</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder={10000}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Minimum Tick Size</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Price Cap</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Nos"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Tick Size %age</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder={10000}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Vendor Enable Fields</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            5 Fields Selected
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
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label>Material Specification</label>
                                        <textarea
                                          className="form-control"
                                          rows={3}
                                          placeholder="Enter ..."
                                          defaultValue={""}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label>Material Description</label>
                                        <textarea
                                          className="form-control"
                                          rows={3}
                                          placeholder="Enter ..."
                                          defaultValue={""}
                                        />
                                      </div>
                                    </div>
                                    <div className=" d-flex justify-content-between align-items-center mt-2">
                                      <h5 className=" mt-3">
                                        Document Attachment
                                      </h5>
                                      <button
                                        className="purple-btn2 m-0"
                                        data-bs-toggle="modal"
                                        data-bs-target="#file_attachement"
                                        onClick={handleAttachmentModalShow}
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
                                        <span className="ms-2">
                                          Attachment File{" "}
                                        </span>
                                      </button>
                                    </div>
                                    <div className="  mt-2">
                                      <div className="tbl-container px-0  m-0">
                                        <table className="w-100">
                                          <thead className="w-100">
                                            <tr>
                                              <th className="main2-th">
                                                Sr. No.
                                              </th>
                                              <th className="main2-th">
                                                Document Name
                                              </th>
                                              <th className="main2-th">
                                                File Name
                                              </th>
                                              <th className="main2-th">
                                                File Type
                                              </th>
                                              <th className="main2-th">
                                                Upload Date
                                              </th>
                                              <th className="main2-th">
                                                Action
                                              </th>
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
                                                <button
                                                  className="p-2 bg-white border"
                                                  onClick={
                                                    handleDocumentModalShow
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-eye"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                  </svg>
                                                </button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                      <h5 className=" ">Delivery Schedule</h5>
                                      <div className="card-tools">
                                        <button className="purple-btn2">
                                          <span className="material-symbols-outlined align-text-top me-2">
                                            add{" "}
                                          </span>
                                          <span>Add</span>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tbl-container px-0 mt-3 mx-2">
                                      <table className="w-100">
                                        <thead>
                                          <tr>
                                            <th>PO Delivery Date</th>
                                            <th>Sch. Delivery Qty</th>
                                            <th>Supplier Delivery Date</th>
                                            <th>Supplier Delivery Qty</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td>40</td>
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                      <h5 className=" ">
                                        Special Terms &amp; Conditions
                                      </h5>
                                    </div>
                                    <div className="form-group">
                                      <textarea
                                        className="form-control"
                                        rows={5}
                                        placeholder=""
                                        defaultValue={""}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* form-select EXAMPLE */}
                            <div
                              className="card card-default mt-4"
                              id="mor-material-details"
                            >
                              <div className="card-header bg-white border-0">
                                <h3 className="card-title">
                                  Material Details (2/2)
                                </h3>
                                <div className="card-tools">
                                  <button
                                    type="button"
                                    className="btn btn-tool mt-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#"
                                    data-card-widget="collapse"
                                    fdprocessedid="7rbmxj"
                                    onClick={materialTwoDropdown}
                                  >
                                    <svg
                                      width={32}
                                      height={32}
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx={16}
                                        cy={16}
                                        r={16}
                                        fill="#8B0203"
                                      />
                                      <path
                                        d="M16 24L9.0718 12L22.9282 12L16 24Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div
                                className="card-body1 p-3"
                                style={{ display: "none" }}
                              >
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        MOR No
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="MOR/MAR/101/02/2024"
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Material
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Plain grey tiles"
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="po-fontBold">
                                        Order Qty
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder={12000}
                                        fdprocessedid="vn2c2n"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {materialTwo && (
                                <div className="card-body">
                                  {/* /.card-header */}
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Company</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            MNRL
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
                                        <label>Project</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            Neo-valley
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
                                        <label>Sub-Project</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            NeoValley- Building
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
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>MOR Number</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="MOR/MAR/101/02/2024"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Material Sub Type</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Tiles"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Material</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Plain white tiles"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>UOM</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Nos"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Order Qty</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder={10000}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Minimum Tick Size</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Price Cap</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Nos"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Tick Size %age</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder={10000}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label>Vendor Enable Fields</label>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                        >
                                          <option selected="selected">
                                            5 Fields Selected
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
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label>Material Specification</label>
                                        <textarea
                                          className="form-control"
                                          rows={3}
                                          placeholder="Enter ..."
                                          defaultValue={""}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label>Material Description</label>
                                        <textarea
                                          className="form-control"
                                          rows={3}
                                          placeholder="Enter ..."
                                          defaultValue={""}
                                        />
                                      </div>
                                    </div>
                                    <div className=" d-flex justify-content-between align-items-center mt-2">
                                      <h5 className=" mt-3">
                                        Document Attachment
                                      </h5>
                                      <button
                                        className="purple-btn2 m-0"
                                        data-bs-toggle="modal"
                                        data-bs-target="#file_attachement"
                                        onClick={handleAttachmentModalShow}
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
                                        <span className="ms-2">
                                          Attachment File{" "}
                                        </span>
                                      </button>
                                    </div>
                                    <div className="  mt-2">
                                      <div className="tbl-container px-0  m-0">
                                        <table className="w-100">
                                          <thead className="w-100">
                                            <tr>
                                              <th className="main2-th">
                                                Sr. No.
                                              </th>
                                              <th className="main2-th">
                                                Document Name
                                              </th>
                                              <th className="main2-th">
                                                File Name
                                              </th>
                                              <th className="main2-th">
                                                File Type
                                              </th>
                                              <th className="main2-th">
                                                Upload Date
                                              </th>
                                              <th className="main2-th">
                                                Action
                                              </th>
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
                                                <button
                                                  className="p-2 bg-white border"
                                                  onClick={
                                                    handleDocumentModalShow
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-eye"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                  </svg>
                                                </button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2 align-items-center">
                                      <h5 className=" ">Delivery Schedule</h5>
                                      <div className="card-tools">
                                        <button className="purple-btn2">
                                          <span className="material-symbols-outlined align-text-top me-2">
                                            add{" "}
                                          </span>
                                          <span>Add</span>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tbl-container px-0 mt-3 mx-2">
                                      <table className="w-100">
                                        <thead>
                                          <tr>
                                            <th>PO Delivery Date</th>
                                            <th>Sch. Delivery Qty</th>
                                            <th>Supplier Delivery Date</th>
                                            <th>Supplier Delivery Qty</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td>40</td>
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                          <tr>
                                            <td>10-04-2024</td>
                                            <td />
                                            <td />
                                            <td />
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                      <h5 className=" ">
                                        Special Terms &amp; Conditions
                                      </h5>
                                    </div>
                                    <div className="form-group">
                                      <textarea
                                        className="form-control"
                                        rows={5}
                                        placeholder=""
                                        defaultValue={""}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="row mt-2 justify-content-center">
                              <div className="d-flex justify-content-between align-items-end">
                                <h5 className=" ">Select Vendors</h5>
                                <div className="card-tools">
                                  <button
                                    className="purple-btn2"
                                    fdprocessedid="kgmxwj"
                                    data-bs-toggle="modal"
                                    data-bs-target="#venderModal"
                                    onClick={handleVendorModalShow}
                                  >
                                    <span className="material-symbols-outlined align-text-top me-2">
                                      add{" "}
                                    </span>
                                    <span>Add</span>
                                  </button>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="tbl-container px-0 mx-3  mt-3 ">
                                  <table className="w-100">
                                    <thead>
                                      <tr>
                                        <th>Vendor Name</th>
                                        <th>Mob No.</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Vendor 1</td>
                                        <td>99999999</td>
                                        <td />
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between mt-2">
                                <h5 className=" ">
                                  General Terms &amp; Conditions
                                </h5>
                              </div>
                              <div className="form-group">
                                <textarea
                                  className="form-control"
                                  rows={5}
                                  placeholder=""
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                            <div className="row mt-4 justify-content-end">
                              <div className="col-md-3">
                                <div className="form-group d-flex gap-3 align-items-center">
                                  <label style={{ fontSize: "1.1rem" }}>
                                    status
                                  </label>
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
                            </div>
                            <div className="row mt-2 justify-content-end">
                              <div className="col-md-2">
                                <button className="purple-btn2 w-100">
                                  Preview
                                </button>
                              </div>
                              <div className="col-md-2">
                                <button className="purple-btn2 w-100">
                                  Submit
                                </button>
                              </div>
                              <div className="col-md-2">
                                <button className="purple-btn1 w-100">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mt-2 px-4">
                      <h5>Audit Log</h5>
                      <div className="tbl-container px-0 mt-3">
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
                              <td>1</td>
                              <td>Pratham Shastri</td>
                              <td>15-02-2024</td>
                              <td>Verified</td>
                              <td>Verified &amp; Processed</td>
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
        <Footer />
      </div>

      <Modal
        centered
        size="xl"
        show={eventTypeModal}
        onHide={handleEventTypeModalClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fs-5" id="exampleModalLabel">
              Configuration for Event
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleEventTypeModalClose}
              aria-label="Close"
            ></button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="ant-drawer-body">
            <div className="styles_auctionConfigContainer__huK3U">
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label">
                  <label title="Event Type">Event Type</label>
                </div>
                <div className="ant-col ant-form-item-control-wrapper">
                  <div className="ant-form-item-control">
                    <span className="ant-form-item-children">
                      <div
                        className="pro-radio-tabs"
                        style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                      >
                        <div
                          className={`pro-radio-tabs__tab ${
                            eventType === "Auction"
                              ? "pro-radio-tabs__tab__selected"
                              : ""
                          }`}
                          role="radio"
                          aria-checked={eventType === "Auction"}
                        >
                          <div className="pro-radio-tabs__check-icon">
                            <label
                              className={`ant-radio-wrapper ${
                                eventType === "Auction"
                                  ? "ant-radio-wrapper-checked"
                                  : ""
                              }`}
                            >
                              <span
                                className={`ant-radio ${
                                  eventType === "Auction"
                                    ? "ant-radio-checked"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="ant-radio-input"
                                  value="Auction"
                                  checked={eventType === "Auction"}
                                  onChange={handleEventTypeChange}
                                />
                                <span className="ant-radio-inner"></span>
                              </span>
                            </label>
                          </div>
                          <p className="pro-text pro-body pro-text--normal">
                            Auction
                          </p>
                        </div>
                        <div
                          className={`pro-radio-tabs__tab ${
                            eventType === "RFQ"
                              ? "pro-radio-tabs__tab__selected"
                              : ""
                          }`}
                          role="radio"
                          aria-checked={eventType === "RFQ"}
                        >
                          <div className="pro-radio-tabs__check-icon">
                            <label
                              className={`ant-radio-wrapper ${
                                eventType === "RFQ"
                                  ? "ant-radio-wrapper-checked"
                                  : ""
                              }`}
                            >
                              <span
                                className={`ant-radio ${
                                  eventType === "RFQ" ? "ant-radio-checked" : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="ant-radio-input"
                                  value="RFQ"
                                  checked={eventType === "RFQ"}
                                  onChange={handleEventTypeChange}
                                />
                                <span className="ant-radio-inner"></span>
                              </span>
                            </label>
                          </div>
                          <p className="pro-text pro-body pro-text--normal">
                            RFQ
                          </p>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>

              {eventType === "Auction" && (
                <div
                  className="pro-radio-tabs pro-radio-tabs2 rfq-tab-hide"
                  style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}
                >
                  {/* Rank Based Radio Button */}
                  <div
                    className={`pro-radio-tabs__tab ${
                      selectedStrategy === "Rank Based"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedStrategy === "Rank Based"}
                    onClick={() => handleRadioChange("Rank Based")}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label className="ant-radio-wrapper">
                        <span
                          className={`ant-radio ${
                            selectedStrategy === "Rank Based"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            tabIndex={-1}
                            className="ant-radio-input"
                            checked={selectedStrategy === "Rank Based"}
                            onChange={() => handleRadioChange("Rank Based")}
                          />
                          <span className="ant-radio-inner" />
                        </span>
                      </label>
                    </div>
                    <div className="styles_strategy__xc2r+">
                      <div className="styles_strategyContent__c-1Di">
                        <p className="pro-text pro-body pro-text--medium">
                          Rank Based
                        </p>
                        <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                          Vendors will be ranked on bid price
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Based Radio Button */}
                  <div
                    className={`pro-radio-tabs__tab ${
                      selectedStrategy === "Price Based"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedStrategy === "Price Based"}
                    onClick={() => handleRadioChange("Price Based")}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label className="ant-radio-wrapper">
                        <span
                          className={`ant-radio ${
                            selectedStrategy === "Price Based"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            tabIndex={-1}
                            className="ant-radio-input"
                            checked={selectedStrategy === "Price Based"}
                            onChange={() => handleRadioChange("Price Based")}
                          />
                          <span className="ant-radio-inner" />
                        </span>
                      </label>
                    </div>
                    <div className="styles_strategy__xc2r+">
                      <div className="styles_strategyContent__c-1Di">
                        <p className="pro-text pro-body pro-text--medium">
                          Price Based
                        </p>
                        <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                          Minimum bid price visible to vendors
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Traffic Light Radio Button */}
                  <div
                    className={`pro-radio-tabs__tab ${
                      selectedStrategy === "Traffic Light"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedStrategy === "Traffic Light"}
                    onClick={() => handleRadioChange("Traffic Light")}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label className="ant-radio-wrapper">
                        <span
                          className={`ant-radio ${
                            selectedStrategy === "Traffic Light"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            tabIndex={-1}
                            className="ant-radio-input"
                            checked={selectedStrategy === "Traffic Light"}
                            onChange={() => handleRadioChange("Traffic Light")}
                          />
                          <span className="ant-radio-inner" />
                        </span>
                      </label>
                    </div>
                    <div className="styles_strategy__xc2r+">
                      <div className="styles_strategyContent__c-1Di">
                        <p className="pro-text pro-body pro-text--medium">
                          Traffic Light
                        </p>
                        <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                          Vendors will be divided based on a specified range
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Knockout Radio Button */}
                  <div
                    className={`pro-radio-tabs__tab ${
                      selectedStrategy === "Knockout"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedStrategy === "Knockout"}
                    onClick={() => handleRadioChange("Knockout")}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label className="ant-radio-wrapper">
                        <span
                          className={`ant-radio ${
                            selectedStrategy === "Knockout"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            tabIndex={-1}
                            className="ant-radio-input"
                            checked={selectedStrategy === "Knockout"}
                            onChange={() => handleRadioChange("Knockout")}
                          />
                          <span className="ant-radio-inner" />
                        </span>
                      </label>
                    </div>
                    <div className="styles_strategy__xc2r+">
                      <div className="styles_strategyContent__c-1Di">
                        <p className="pro-text pro-body pro-text--medium">
                          Knockout
                        </p>
                        <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                          Vendors will accept/reject your offer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dutch Auction Radio Button */}
                  <div
                    className={`pro-radio-tabs__tab ${
                      selectedStrategy === "Dutch Auction"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedStrategy === "Dutch Auction"}
                    onClick={() => handleRadioChange("Dutch Auction")}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label className="ant-radio-wrapper">
                        <span
                          className={`ant-radio ${
                            selectedStrategy === "Dutch Auction"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            tabIndex={-1}
                            className="ant-radio-input"
                            checked={selectedStrategy === "Dutch Auction"}
                            onChange={() => handleRadioChange("Dutch Auction")}
                          />
                          <span className="ant-radio-inner" />
                        </span>
                      </label>
                    </div>
                    <div className="styles_strategy__xc2r+">
                      <div className="styles_strategyContent__c-1Di">
                        <p className="pro-text pro-body pro-text--medium">
                          Dutch Auction
                        </p>
                        <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                          First come first serve allocation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Award Section */}
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label">
                  <label title="How will you award the event?">
                    How will you award the event?
                  </label>
                </div>
                <div className="ant-col ant-form-item-control-wrapper">
                  <div className="ant-form-item-control">
                    <span className="ant-form-item-children">
                      <div style={{ maxWidth: 700 }}>
                        <div
                          className="pro-radio-tabs"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <div
                            className={`pro-radio-tabs__tab ${
                              awardType === "SingleVendor"
                                ? "pro-radio-tabs__tab__selected"
                                : ""
                            }`}
                            role="radio"
                            aria-checked={awardType === "SingleVendor"}
                          >
                            <div className="pro-radio-tabs__check-icon">
                              <label
                                className={`ant-radio-wrapper ${
                                  awardType === "SingleVendor"
                                    ? "ant-radio-wrapper-checked"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`ant-radio ${
                                    awardType === "SingleVendor"
                                      ? "ant-radio-checked"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    className="ant-radio-input"
                                    value="SingleVendor"
                                    checked={awardType === "SingleVendor"}
                                    onChange={handleAwardTypeChange}
                                  />
                                  <span className="ant-radio-inner"></span>
                                </span>
                              </label>
                            </div>
                            <p className="pro-text pro-body pro-text--normal">
                              I'll award the entire lot to single vendor
                            </p>
                          </div>
                          <div
                            className={`pro-radio-tabs__tab ${
                              awardType === "MultipleVendors"
                                ? "pro-radio-tabs__tab__selected"
                                : ""
                            }`}
                            role="radio"
                            aria-checked={awardType === "MultipleVendors"}
                          >
                            <div className="pro-radio-tabs__check-icon">
                              <label
                                className={`ant-radio-wrapper ${
                                  awardType === "MultipleVendors"
                                    ? "ant-radio-wrapper-checked"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`ant-radio ${
                                    awardType === "MultipleVendors"
                                      ? "ant-radio-checked"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    className="ant-radio-input"
                                    value="MultipleVendors"
                                    checked={awardType === "MultipleVendors"}
                                    onChange={handleAwardTypeChange}
                                  />
                                  <span className="ant-radio-inner"></span>
                                </span>
                              </label>
                            </div>
                            <p className="pro-text pro-body pro-text--normal">
                              I may partially award the event to multiple
                              vendors
                            </p>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>

              <form className="ant-form-item my-4">
                <div>
                  <div className="d-flex align-items-center gap-3 my-3">
                    <input
                      type="checkbox"
                      className="ant-radio-input"
                      checked={dynamicExtension}
                      onChange={handleDynamicExtensionChange}
                    />
                    <label htmlFor="Datepicker">
                      Dynamic Event Extension (Extend closing time in last 1 min
                      in case of rank / price changes in top selected bids.)
                    </label>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "200px", height: "60px" }}
                    />
                    <div className="d-flex align-items-center gap-3">
                      <span>Price</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span>Rank</span>
                    </div>
                  </div>
                  <div className="dynamic-time d-flex w-100 align-items-center gap-5">
                    <div className="trigger-time">
                      <label>Trigger time extension on last</label>
                      <input
                        type="text"
                        placeholder="Min(s)"
                        style={{ marginLeft: "5px" }}
                      />
                    </div>
                    <div className="extend-time">
                      <label>Extend time by</label>
                      <input
                        type="text"
                        placeholder="Min(s)"
                        style={{ marginLeft: "5px" }}
                      />
                    </div>
                    <div className="time-extention">
                      <label>Time extension on change in:</label>
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
                </div>
              </form>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleEventTypeModalClose}
            >
              Close
            </button>
            <button type="button" className="purple-btn2">
              Save changes
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="sm"
        show={settingShow}
        onHide={handleSettingClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h4
              className="modal-title text-center w-100"
              style={{ fontWeight: 500 }}
            >
              Layout
            </h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleSettingClose}
            />
          </div>
        </Modal.Header>

        <Modal.Body>
          {[...Array(6)].map((_, i) => (
            <div
              className="row justify-content-between align-items-center mt-2"
              key={i}
            >
              <div className="col-md-6">
                <button type="submit" className="btn btn-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <label> Sr No.</label>
              </div>
              <div className="col-md-4">
                <div className="form-check form-switch mt-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="lg"
        show={vendorModal}
        onHide={handleVendorClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fs-5">Select Vendors</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleVendorClose}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="po-fontBold">Supplier Type</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Steel"
                  fdprocessedid="vn2c2n"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="po-fontBold">Vendor Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="All"
                  fdprocessedid="vn2c2n"
                />
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-end my-2 mt-3">
                <form>
                  <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                            fill="#8B0203"
                          />
                          <path
                            d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                            fill="#8B0203"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="tbl-container px-0 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Supplier Type</th>
                      <th>Vendor Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>Cement, Waterproofing </td>
                      <td>Sharda Chemical Pvt Ltd</td>
                      <td>Delivery Pending</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>Tiles, Granites, Cement, Sand</td>
                      <td>Ashirvad Ceramics</td>
                      <td>Not submitted Bid / Quotation</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>Tiles, Granites, Cement, Sand</td>
                      <td>Ashirvad Ceramics</td>
                      <td>Not submitted Bid / Quotation</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>Tiles, Granites, Cement, Sand</td>
                      <td>Ashirvad Ceramics</td>
                      <td>Not submitted Bid / Quotation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button className="purple-btn2" onClick={handleVendorClose}>
              {" "}
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="md"
        show={eventSchedule}
        onHide={handleEventScheduleClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fs-5" id="exampleModalLabel">
              Event Schedule
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleEventScheduleClose}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-4">
            <p>Start Time</p>
            <div className="row ">
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                    fdprocessedid="nc9nxa"
                  >
                    <option selected="selected">Start Now</option>
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4 ">
                <input type="date" className="form-control " name="" id="" />
              </div>
              <div className="col-md-4">
                <input type="time" className="form-control" name="" id="" />
              </div>
            </div>
            <p className="mt-2">End Time</p>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                    fdprocessedid="nc9nxa"
                  >
                    <option selected="selected">Duration</option>
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
                <input className="form-control" type="time" name="" id="" />
              </div>
            </div>
            <p className="my-2 " style={{ color: "var(--light-grey)" }}>
              Event will end at 05 Apr 2024 at 11:24 am
            </p>
            <p className="mt-2">Evaluation time</p>
            <div className="row mt-2">
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    className="form-control form-select"
                    style={{ width: "100%" }}
                    fdprocessedid="nc9nxa"
                  >
                    <option selected="selected">Duration</option>
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
                <input className="form-control" type="time" name="" id="" />
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button className="purple-btn2" onClick={handleEventScheduleClose}>
              {" "}
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="lg"
        show={documentModal}
        onHide={handleDocumentClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5
              className="modal-title text-center w-100"
              id="exampleModalLabel"
            >
              Document Attchement
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleDocumentClose}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2">
            <div className="col-12 px-4">
              <div className="d-flex justify-content-between">
                <h5>Latest Documents</h5>
                <button
                  className="purple-btn2 m-0"
                  data-bs-toggle="modal"
                  data-bs-target="#file_attachement"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleAttachmentModalShow}
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
                  <span className="ms-2">Attachment File </span>
                </button>
              </div>
              <div className="tbl-container px-0 mt-3">
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
                        <button className="p-2 bg-white border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
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
              <div className="tbl-container px-0 mt-3">
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
                        <button className="p-2 bg-white border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              className="purple-btn2"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleDocumentClose}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="md"
        show={attachmentModal}
        onHide={handleAttachmentClose}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5
              className="modal-title text-center w-100"
              id="exampleModalLabel"
            >
              Upload File
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleAttachmentClose}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name of the Document</label>
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
                <label>File Upload </label>
                <input
                  className="form-control"
                  type="file"
                  placeholder="Default input"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button className="purple-btn2" onClick={handleAttachmentClose}>
              Sumbit
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
