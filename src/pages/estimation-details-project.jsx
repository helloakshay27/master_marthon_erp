import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import ExpandableTable from "../components/ExpandableTable";

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
import { auditLogColumns, auditLogData } from "../constant/data";


const EstimationDetailsProject = () => {
    const [settingShow, setSettingShow] = useState(false);
    const handleSettingClose = () => setSettingShow(false);


    const handleSettingModalShow = () => setSettingShow(true);
    const handleModalShow = () => setShow(true);
    return (
        <>


            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
                    </a>
                    <div className="card mt-3 pb-3">

                        <CollapsibleCard title="Project Details">
                            <div className="card-body mt-0 pt-0">
                                <div className="row align-items-center">
                                    {[
                                        { label: "RERA Area", placeholder: "Sq. Ft." },
                                        { label: "Construction Area", placeholder: "Sq. Ft." },
                                        { label: "Saleable Area Sq.ft.", placeholder: "" },
                                        { label: "Material Total", placeholder: "10,000,00" },
                                        { label: "Sub-Project Budget", placeholder: "INR" },
                                        { label: "M+L Budget Sq.ft", placeholder: "INR", className: "mt-2" },
                                        { label: "Budget Type", placeholder: "", className: "mt-2" },
                                        { label: "Labour Total", placeholder: "10,000,00" },
                                    ].map((field, index) => (
                                        <div className={`col-md-3 ${field.className || ""}`} key={index}>
                                            <div className="form-group">
                                                <label>{field.label}</label>
                                                <input className="form-control" type="number" placeholder={field.placeholder} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-4 my-2">
                                        <h6
                                            style={{
                                                textDecoration: "underline",
                                                color: "var(--red)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Previous
                                        </h6>
                                    </div>
                                    <div className="col-md-4"></div>
                                    <div className="col-md-4 my-2">
                                        <h6
                                            style={{
                                                textDecoration: "underline",
                                                color: "var(--red)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Current
                                        </h6>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Sub-Project M+L Budget</label>
                                            <input class="form-control" type="number" placeholder="" fdprocessedid="pi363i" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">

                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Sub-Project M+L Budget</label>
                                            <input class="form-control" type="number" placeholder="" fdprocessedid="pi363i" />
                                        </div>
                                    </div>


                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Sub-Project Budget Balance</label>
                                            <input class="form-control" type="number" placeholder="" fdprocessedid="pi363i" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">

                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Sub-Project Budget Balance</label>
                                            <input class="form-control" type="number" placeholder="" fdprocessedid="pi363i" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>
                        <div className="d-flex justify-content-between mx-3">
                            <div class="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                                <span className="reference-label me-4" style={{ fontWeight: "bold" }}>Legend</span>

                                <span className="reference-label main-category">Main Category</span>

                                <span className="reference-label category-lvl2">Category lvl 2</span>

                                <span className="reference-label sub-category-lvl3">Sub-category lvl 3</span>

                                <span className="reference-label sub-category-lvl4">Sub-category lvl 4</span>

                                <span className="reference-label sub-category-lvl5">Sub-category lvl 5</span>

                                <span className="reference-label labour">Labour</span>
                                <span className="reference-label Over-Budget">Over Budget</span>

                            </div>
                            <div>

                                <div>
                                    <button class="btn" >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#8B0203"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M23 4v6h-6" />
                                            <path d="M1 20v-6h6" />
                                            <path d="M3.51 9a9 9 0 0 1 14.34-3.36L23 10M1 14l5.15 4.85A9 9 0 0 0 20.49 15" />
                                        </svg>
                                    </button>
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

                                    <button className="purple-btn2" data-bs-toggle="modal" data-bs-target="#copyModal">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 400 500"
                                            className="me-2"
                                        >
                                            <path
                                                fill="#f7f7f7"
                                                d="M200 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                                            />
                                        </svg>
                                        Copy Budget</button>
                                </div>


                            </div>
                        </div>

                        <div className="mx-3">
                            <ExpandableTable />
                        </div>

                        <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Print</button>
                            <button className="purple-btn2">Download</button>
                            <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Modify</button>
                        </div>
                        <div className="row mt-4 px-2">
                            <div className="col-md-12">
                                <div className="form-group mx-3">
                                    <label>Remark</label>
                                    <textarea className="form-control" rows="3" placeholder=""></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 justify-content-center">
                            <div className="col-md-2">
                                <button className="purple-btn2 w-100">Submit</button>
                            </div>
                        </div>
                        <div className="mx-4">
                            <h5>Audit Log</h5>
                            <div className="">
                                <Table columns={auditLogColumns} data={auditLogData} />
                            </div>
                            {/* </div> */}
                        </div>

                    </div>
                </div>
            </div>
            <LayoutModal show={settingShow} onHide={handleSettingClose} />
        </>
    )
}

export default EstimationDetailsProject;