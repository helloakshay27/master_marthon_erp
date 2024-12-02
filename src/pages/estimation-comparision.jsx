import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";

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


const EstimationComparision = () => {

    // State to manage collapsed rows
    const [collapsedRows, setCollapsedRows] = useState({});

    const toggleCollapse = (rowId) => {
        setCollapsedRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId],
        }));
    };

    const [settingShow, setSettingShow] = useState(false);
    const handleSettingClose = () => setSettingShow(false);


    const handleSettingModalShow = () => setSettingShow(true);
    const handleModalShow = () => setShow(true);
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Comparison</a>
                    </a>
                    <div className="card mt-3 pb-3">
                        {/* <QuickFilter /> */}
                        <CollapsibleCard title="Project Details">
                            <div className="card-body mt-0 pt-0">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Rera Area</label>
                                            <div className="d-flex gap-3">
                                                <input className="form-control" type="text" placeholder="Sq ft" />
                                                <input className="form-control" type="text" placeholder="Sq.mt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Labour+Material Budget</label>
                                            <div className="d-flex gap-3">
                                                <input className="form-control" type="text" placeholder="Sq ft" />
                                                <input className="form-control" type="text" placeholder="Sq.mt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Construction Area</label>
                                            <div className="d-flex gap-3">
                                                <input className="form-control" type="text" placeholder="Sq ft" />
                                                <input className="form-control" type="text" placeholder="Sq.mt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Project Budget</label>
                                            <input className="form-control" type="text" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Saleable Area</label>
                                            <div className="d-flex gap-3">
                                                <input className="form-control" type="text" placeholder="" />
                                                <input className="form-control" type="text" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Project Budget Balance</label>
                                            <input className="form-control" type="text" placeholder="INR" />
                                        </div>
                                    </div>

                                    <div className="col-md-12 mt-2">
                                        <div className="row align-items-end gap-3">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Select Version</label>
                                                    <select className="form-control form-select">
                                                        <option selected>Alabama</option>
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
                                                    <label>Compare With</label>
                                                    <select className="form-control form-select">
                                                        <option selected>Alabama</option>
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
                                                <button className="purple-btn2 mb-0">show</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>

                        <div className="d-flex justify-content-between mx-3">
                            <div className="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                                <span className="reference-label me-4" style={{ fontWeight: "bold" }}>Legend</span>
                                <span className="reference-label New">New</span>
                                <span className="reference-label Modify">Modify</span>
                                <span className="reference-label Remove">Remove</span>
                            </div>


                            <div>
                                <button className="btn">
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
                                <button
                                    className="purple-btn2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#copyModal"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 400 500"
                                        className="me-2"
                                    >
                                        {/* <!--! Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com --> */}
                                        <path
                                            fill="#f7f7f7"
                                            d="M200 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                                        />
                                    </svg>
                                    Copy Budget
                                </button>
                            </div>
                        </div>

                        <div className="mx-3">
                        <div className="tbl-container mx-3 mt-2">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th className="text-center" colSpan="6">Category</th>
                                        <th className="text-center" colSpan="3">Version1</th>
                                        <th className="text-center" colSpan="3">Version2</th>
                                    </tr>
                                    <tr>
                                        <th className="text-start">Expand</th>
                                        <th className="text-start">Sr.no</th>
                                        <th className="text-start">Category level</th>
                                        <th className="text-start">WBS</th>
                                        <th className="text-start">Type</th>
                                        <th className="text-start">Category</th>
                                        <th className="text-start">Rate</th>
                                        <th className="text-start">QTY</th>
                                        <th className="text-start">Amount Allocated</th>
                                        <th className="text-start">Rate</th>
                                        <th className="text-start">QTY</th>
                                        <th className="text-start">Amount Allocated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1</td>
                                        <td>Main Category</td>
                                        <td>Civil Work</td>
                                        <td></td>
                                        <td>Civil Work</td>
                                        <td></td>
                                        <td></td>
                                        <td>4,500,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1.1</td>
                                        <td>Sub-Category Lvl 2</td>
                                        <td>RCC</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1.1.1</td>
                                        <td>Sub-Category Lvl3</td>
                                        <td>RCC1</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1.1.1.1</td>
                                        <td>Sub-Category lvl4</td>
                                        <td>RCC 1A</td>
                                        <td>Activity</td>
                                        <td></td>
                                        <td>RCC</td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1.1.1.1.1</td>
                                        <td>Sub-Category Lvl5</td>
                                        <td>RCC Construction</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Tile</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>OPC Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>PPC Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Admixture</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Fly Ash</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Aggregate</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>L</td>
                                        <td>Civil Work RCC</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>L</td>
                                        <td>Core Cutting</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                opacity={0.5}
                                            >
                                                {/* <!-- Square --> */}
                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                {/* <!-- Plus Icon --> */}
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </td>
                                        <td>1.1.1.1.2</td>
                                        <td>Sub-Category Lvl5</td>
                                        <td>RCC Base</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Tile</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>OPC Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>PPC Cement</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Admixture</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Fly Ash</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>M</td>
                                        <td>Aggregate</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>L</td>
                                        <td>Civil Work RCC</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>L</td>
                                        <td>Core Cutting</td>
                                        <td></td>
                                        <td></td>
                                        <td>40,00,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                       
                    
                       
                        <div className="d-flex mt-2 justify-content-center">
                            <button className="purple-btn1">
                                Print
                            </button>
                            <button className="purple-btn2">
                                Download
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <LayoutModal show={settingShow} onHide={handleSettingClose} />
        </>
    );
};

export default EstimationComparision;
