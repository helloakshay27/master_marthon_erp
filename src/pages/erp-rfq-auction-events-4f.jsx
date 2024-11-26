import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { LayoutModal, FilterModal, BulkAction, DownloadIcon, EventProjectTable, FilterIcon, QuickFilter, SearchIcon, SettingIcon, StarIcon } from "../components";

export default function ErpRfqAuctionEvents4f() {
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);

  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  return (
    <>
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
              <QuickFilter />
              <BulkAction />
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
              <EventProjectTable />
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

      <FilterModal show={show} handleClose={handleClose} />
      <LayoutModal show={settingShow} onHide={handleSettingClose} />
    </>
  );
}
