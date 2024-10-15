import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../styles/mor.css";

export default function ErpRfqAuctionEvents4f() {
  const [bulkIsCollapsed, setBulkIsCollapsed] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);

  const handleSettingModalShow = () => setSettingShow(true)
  const handleModalShow = () => setShow(true);

  const bulkToggleCardBody = () => {
    setBulkIsCollapsed(!bulkIsCollapsed);
  };

  const toggleCardBody = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <style type="text/css">
        {`
          .setting-modal .modal-dialog {
  position: fixed;
  right: 0;
  top: 0;
  margin: 0;
  height: 100%;
  width: 40%;
}

.setting-modal .modal-sm {
  width: 300px;
  height: auto;
  margin: auto;
}

.setting-modal .modal-content {
  height: 100%;
  border: 0;
  border-radius: 0;
}

.modal-centered-custom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.modal-centered-custom .modal-content {
  margin: auto;
}

        `}
      </style>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <a href="">
              Home &gt; Purchase &gt; Procurement &gt; RFQ &amp; Auction Events
            </a>
            <h5 className="mt-3">RFQ &amp; Auction Events</h5>
            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row separteinto5 justify-content-between">
                  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                    <div className="content-box">
                      <h4 className="content-box-title">Pending MOR</h4>
                      <p className="content-box-sub">2</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Live Events</h4>
                      <p className="content-box-sub">1</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">RFQ</h4>
                      <p className="content-box-sub">1</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Auction</h4>
                      <p className="content-box-sub">0</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">History Events</h4>
                      <p className="content-box-sub">99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3 pb-3">
              <div className="card mx-3 mt-3">
                <div className="card-header3">
                  <h3 className="card-title">Quick Filter</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      onClick={toggleCardBody}
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
                          d={
                            isCollapsed
                              ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                              : "M16 8L22.9282 20L9.0718 20L16 8Z"
                          }
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="card-body pt-0 mt-0">
                    <div className="row my-2 align-items-end">
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Company</label>
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
                          <label>Project</label>
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
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Last Created</label>
                          <select
                            className="form-control form-select"
                            style={{ width: "100%" }}
                          >
                            <option selected="selected">Material</option>
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
                        <button className="purple-btn2 m-0">Go</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="card mx-3">
                <div className="card-header3">
                  <h3 className="card-title">Bulk Action</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      onClick={bulkToggleCardBody}
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
                          d={
                            bulkIsCollapsed
                              ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                              : "M16 8L22.9282 20L9.0718 20L16 8Z"
                          } // Arrow changes direction on collapse
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {!bulkIsCollapsed && (
                  <div className="card-body mt-0 pt-0">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>From Status</label>
                          <select
                            name="from_status"
                            id="from_status"
                            className="form-control form-select from"
                          >
                            <option value="">Select Status</option>
                            <option value="draft">Draft</option>
                            <option value="send_for_approval">
                              Sent For Approval
                            </option>
                          </select>
                        </div>
                        <div className="form-group mt-3">
                          <label>To Status</label>
                          <select
                            name="to_status"
                            id="to_status"
                            className="form-control form-select to"
                          >
                            <option value="">Select Status</option>
                            <option value="draft">Draft</option>
                            <option value="send_for_approval">
                              Sent For Approval
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Remark</label>
                          <textarea
                            className="form-control remark"
                            rows={4}
                            placeholder="Enter ..."
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="offset-md-1 col-md-2">
                        <button className="purple-btn2 m-0 status">
                          <a style={{ color: "white !important" }}> Submit </a>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex mt-3 align-items-end px-3">
                <div className="col-md-6">
                  <form>
                    <div className="input-group">
                      <input
                        type="search"
                        id="searchInput"
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-md btn-default"
                        >
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
                <div className="col-md-6">
                  <div className="row justify-content-end">
                    <div className="col-md-5">
                      <div className="row justify-content-end px-3">
                        <div className="col-md-3">
                          <button
                            className="btn btn-md"
                            onClick={handleModalShow}
                          >
                            <svg
                              width={28}
                              height={28}
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.66604 5.64722C6.39997 5.64722 6.15555 5.7938 6.03024 6.02851C5.90494 6.26322 5.91914 6.54788 6.06718 6.76895L13.7378 18.2238V29.0346C13.7378 29.2945 13.8778 29.5343 14.1041 29.6622C14.3305 29.79 14.6081 29.786 14.8307 29.6518L17.9136 27.7927C18.13 27.6622 18.2622 27.4281 18.2622 27.1755V18.225L25.9316 6.76888C26.0796 6.5478 26.0938 6.26316 25.9685 6.02847C25.8432 5.79378 25.5987 5.64722 25.3327 5.64722H6.66604ZM15.0574 17.6037L8.01605 7.08866H23.9829L16.9426 17.6051C16.8631 17.7237 16.8207 17.8633 16.8207 18.006V26.7685L15.1792 27.7584V18.0048C15.1792 17.862 15.1368 17.7224 15.0574 17.6037Z"
                                fill="#8B0203"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button type="submit" className="btn btn-md">
                            <svg
                              width={22}
                              height={22}
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.9702 17.0592L5.11875 21.4773L3.93017 20.5937L6.18541 13.4616L0.333984 9.07497L0.791127 7.6233L8.04446 7.65486L10.2692 0.522705H11.7321L13.9568 7.65486L21.2102 7.6233L21.6673 9.07497L15.7549 13.4616L18.0102 20.5937L16.8216 21.4773L10.9702 17.0592ZM11.4273 15.4182L15.7854 18.7318L14.1092 13.3984L14.3835 12.5148L18.7721 9.23277H13.3778L12.6464 8.66472L10.9702 3.36294L9.32446 8.69628L8.59303 9.26432H3.16827L7.55684 12.5464L7.83113 13.43L6.15494 18.7633L10.513 15.4182H11.4273Z"
                                fill="#8B0203"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button
                            id="downloadButton"
                            type="submit"
                            className="btn btn-md"
                          >
                            <svg
                              width={22}
                              height={23}
                              viewBox="0 0 22 23"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.8468 22.9744H1.1545C0.662189 22.9744 0.333984 22.6462 0.333984 22.1538V15.5897C0.333984 15.0974 0.662189 14.7692 1.1545 14.7692C1.6468 14.7692 1.97501 15.0974 1.97501 15.5897V21.3333H20.0263V15.5897C20.0263 15.0974 20.3545 14.7692 20.8468 14.7692C21.3391 14.7692 21.6673 15.0974 21.6673 15.5897V22.1538C21.6673 22.6462 21.3391 22.9744 20.8468 22.9744ZM11.0007 18.0513C10.9186 18.0513 10.7545 18.0513 10.6724 17.9692C10.5904 17.9692 10.5083 17.8872 10.4263 17.8051L3.86219 11.241C3.53398 10.9128 3.53398 10.4205 3.86219 10.0923C4.19039 9.7641 4.6827 9.7641 5.01091 10.0923L10.1801 15.2615V0.820513C10.1801 0.328205 10.5083 0 11.0007 0C11.493 0 11.8212 0.328205 11.8212 0.820513V15.2615L16.9904 10.0923C17.3186 9.7641 17.8109 9.7641 18.1391 10.0923C18.4673 10.4205 18.4673 10.9128 18.1391 11.241L11.575 17.8051C11.493 17.8872 11.4109 17.9692 11.3289 17.9692C11.2468 18.0513 11.0827 18.0513 11.0007 18.0513Z"
                                fill="#8B0203"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="col-md-3">
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
                    </div>
                    <div className="col-md-4">
                      <button className="purple-btn2 ">
                        <a href="./erp-material-order-request-create.html">
                          <span className="material-symbols-outlined align-text-top">
                            add
                          </span>
                          New Event
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tbl-container mx-3 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Sr.No.</th>
                      <th>Company</th>
                      <th>Project</th>
                      <th>Sub-Project</th>
                      <th>MOR No.</th>
                      <th>Approved Date</th>
                      <th>Priority</th>
                      <th>Sub-Type</th>
                      <th>Assigned to</th>
                      <th>Lead Time</th>
                      <th>Ageing</th>
                      <th>Material</th>
                      <th>UOM</th>
                      <th>Pending Qty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>1</td>
                      <td>Marathon</td>
                      <td>Neo Vally</td>
                      <td>Neo Valley Building</td>
                      <td>MOR947</td>
                      <td>
                        <input
                          className="form-control"
                          type="date"
                          name=""
                          id=""
                        />
                      </td>
                      <td>Very Urgent</td>
                      <td>Flooring Tiles</td>
                      <td>Sumeet</td>
                      <td />
                      <td />
                      <td>Plain IVORY Tiles 300 x 300 mm</td>
                      <td>Box</td>
                      <td>1000</td>
                      <td>MOR Assigned</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>1</td>
                      <td>Marathon</td>
                      <td>Neo Vally</td>
                      <td>Neo Valley Building</td>
                      <td>MOR947</td>
                      <td>
                        <input
                          className="form-control"
                          type="date"
                          name=""
                          id=""
                        />
                      </td>
                      <td>Very Urgent</td>
                      <td>Flooring Tiles</td>
                      <td>Sumeet</td>
                      <td />
                      <td />
                      <td>Plain IVORY Tiles 300 x 300 mm</td>
                      <td>Box</td>
                      <td>1000</td>
                      <td>MOR Assigned</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-3  px-3">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="">Rows Per Page</label>
                    <select
                      className="form-control form-select per_page"
                      style={{ width: "100%" }}
                    >
                      <option value={10} selected="selected">
                        10 Rows
                      </option>
                      <option value={20}>20 Rows</option>
                      <option value={50}>50 Rows</option>
                      <option value={100}>100 Rows</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Modal
         show={show}
         onHide={handleClose}
         dialogClassName="modal-right"
         className="setting-modal"
         backdrop={true}
      >
        <Modal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button type="button" className="btn" aria-label="Close">
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <Link
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                to="#"
              >
                Reset
              </Link>
            </div>
          </div>
        </Modal.Header>
        <div className="modal-body" style={{ overflowY: scroll }}>
          <div className="row">
            <div className="row mt-2 px-2">
              <div className="col-md-12 card mx-3">
                <div className="card-header2">
                  <h3 className="card-title2">
                    <div className="form-group form-control">
                      Applied Filter
                    </div>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <label className="px-1" htmlFor="company">
                          Company
                        </label>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <label className="px-1" htmlFor="project">
                          Project
                        </label>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <p className="px-1">Sub-project</p>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label
                  htmlFor="mor-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  MOR Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mor-date-from">From</label>
                      <input
                        id="mor-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mor-date-to">To</label>
                      <input
                        id="mor-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="approval-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Approval Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="approval-date-from">From</label>
                      <input
                        id="approval-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="approval-date-to">To</label>
                      <input
                        id="approval-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="due-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Due Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="due-date-from">From</label>
                      <input
                        id="due-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="due-date-to">To</label>
                      <input
                        id="due-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="created-on"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Created On
                </label>
                <input id="created-on" className="form-control" type="date" />
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material-type">Material Type</label>
                  <select
                    id="material-type"
                    className="form-control form-select"
                  >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material-sub-type">Material Sub Type</label>
                  <select
                    id="material-sub-type"
                    className="form-control form-select"
                  >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material">Material</label>
                  <select id="material" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="activity">Activity</label>
                  <select id="activity" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="mor-no">MOR No.</label>
                  <select id="mor-no" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="overdue">Overdue</label>
                  <select id="overdue" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="requisition-department">
                    Requisition Department
                  </label>
                  <select
                    id="requisition-department"
                    className="form-control form-select"
                  >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleClose}
          >
            Go
          </button>
        </div>
      </Modal>

      <Modal
        centered
        size="sm"
        show={settingShow}
        onHide={handleSettingClose}
        backdrop="true"
        keyboard={true}
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
    </>
  );
}
