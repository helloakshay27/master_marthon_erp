import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import FilterModal from "../components/common/Modal/FilterModal";
import LayoutModal from "../components/common/Modal/LayoutModal";
import { DownloadIcon, DropdownCollapseIcon, FilterIcon, SearchIcon, SettingIcon, StarIcon } from "../components";

export default function ErpRfqAuctionEvents4f() {
  const [bulkIsCollapsed, setBulkIsCollapsed] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);

  const handleSettingModalShow = () => setSettingShow(true);
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
                      <DropdownCollapseIcon isCollapsed={isCollapsed} />
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
                            <option 
// @ts-ignore
                            selected="selected">Alabama</option>
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
                            <option 
// @ts-ignore
                            selected="selected">Alabama</option>
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
                            <option 
// @ts-ignore
                            selected="selected">Alabama</option>
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
                            <option 
// @ts-ignore
                            selected="selected">Material</option>
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
                      <DropdownCollapseIcon isCollapsed={bulkIsCollapsed} />
                    </button>
                  </div>
                </div>

                {bulkIsCollapsed === true && (
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
                          <SearchIcon />
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
                            <FilterIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button type="submit" className="btn btn-md">
                            <StarIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button
                            id="downloadButton"
                            type="submit"
                            className="btn btn-md"
                          >
                            <DownloadIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button
                            type="submit"
                            className="btn btn-md"
                            onClick={handleSettingModalShow}
                          >
                            <SettingIcon color={"#8B0203"} style={{width:'25px', height:'25px'}} />
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
                      <option value={10} 
// @ts-ignore
                      selected="selected">
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

      <FilterModal show={show} handleClose={handleClose} />

      <LayoutModal show={settingShow} onHide={handleSettingClose} />
    </>
  );
}
