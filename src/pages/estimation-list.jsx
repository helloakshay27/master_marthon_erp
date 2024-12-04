import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
// import { useState } from "react";
// import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import {
    LayoutModal,
    FilterModal,
    BulkAction,
    DownloadIcon,
    FilterIcon,
    QuickFilter,
    SearchIcon,
    SettingIcon,
    StarIcon,
    Table,
} from "../components"
import { estimationListColumns, estimationListData } from "../constant/data";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";


const EstimationList = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [viewQuickFilter, setViewQuickFilter] = useState(false);

    const viewQuickFilterDropdown = () => {
        setViewQuickFilter(!viewQuickFilter);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(e.target.value);
    };


    const [settingShow, setSettingShow] = useState(false);
    const handleSettingClose = () => setSettingShow(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleSettingModalShow = () => setSettingShow(true);
    const handleModalShow = () => setShow(true);


    return (
        <>

            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Estimation List</a>
                    </a>
                    <div className="card mt-3 pb-3">
                        {/* <QuickFilter /> */}
                        <CollapsibleCard title="Quick Filter">
                            <div className="card-body pt-0 mt-0">
                                <div className="row my-2 align-items-end">
                                    {["Company", "Project", "Sub-Project", "Wings"].map((label, idx) => (
                                        <div className="col-md-2" key={idx}>
                                            <div className="form-group">
                                                <label>{label}</label>
                                                <select className="form-control form-select" style={{ width: "100%" }}>
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
                                    ))}
                                    <div className="col-md-2">
                                        <button className="purple-btn2 m-0">Go</button>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>

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
                                            <button type="button" className="btn btn-md btn-default"
                                                style={{
                                                    borderTopRightRadius: '5px', // Top-right corner
                                                    borderBottomRightRadius: '5px', // Bottom-right corner
                                                    borderTopLeftRadius: '0px', // Top-left corner
                                                    borderBottomLeftRadius: '0px', // Bottom-left corner
                                                }}
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
                                                    <SettingIcon
                                                        color={"#8B0203"}
                                                        style={{ width: "25px", height: "25px" }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <button className="purple-btn2 m-0 me-5">
                                            <a style={{ color: "white" }} href="./erp-material-order-request-create.html">
                                                <span className="material-symbols-outlined align-text-top me-2">add</span>
                                                Create
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
                            {/* <Table columns={rfqEventColumns} data={rfqEventData} /> */}
                            <Table columns={estimationListColumns} data={estimationListData} />
                        </div>
                        <div className="row mt-3  px-3">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">Rows Per Page</label>
                                    <select
                                        className="form-control form-select per_page"
                                        style={{ width: "100%" }}
                                    >
                                        <option value={10} selected>
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
};

export default EstimationList;
