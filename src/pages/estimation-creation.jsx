import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

import ExpandableTable from "../components/ExpandableTable";
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
import { estimationListColumns, estimationListData } from "../constant/data";
// import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";




const EstimationCreation = () => {
    const [viewQuickFilter, setViewQuickFilter] = useState(true);

    const viewQuickFilterDropdown = () => {
        setViewQuickFilter(!viewQuickFilter);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(e.target.value);
    };

    return (
        <>
          
          
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
                    </a>
                    <div className="card mt-3 pb-3">
                    <div className="card mt-1 mx-3 mt-4">
                                <div className="card-header3">
                                    <h3 className="card-title">Budget</h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {/* Company Dropdown */}
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>
                                                    Company <span>*</span>
                                                </label>
                                                <select className="form-control form-select" style={{ width: '100%' }}>
                                                    <option defaultValue="selected">Alabama</option>
                                                    <option>Alaska</option>
                                                    <option>California</option>
                                                    <option>Delaware</option>
                                                    <option>Tennessee</option>
                                                    <option>Texas</option>
                                                    <option>Washington</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Project Dropdown */}
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Project</label>
                                                <select className="form-control form-select" style={{ width: '100%' }}>
                                                    <option defaultValue="selected">Alabama</option>
                                                    <option>Alaska</option>
                                                    <option>California</option>
                                                    <option>Delaware</option>
                                                    <option>Tennessee</option>
                                                    <option>Texas</option>
                                                    <option>Washington</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Sub-Project Dropdown */}
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Sub-Project</label>
                                                <select className="form-control form-select" style={{ width: '100%' }}>
                                                    <option defaultValue="selected">Alabama</option>
                                                    <option>Alaska</option>
                                                    <option>California</option>
                                                    <option>Delaware</option>
                                                    <option>Tennessee</option>
                                                    <option>Texas</option>
                                                    <option>Washington</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Wings Dropdown */}
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Wings</label>
                                                <select className="form-control form-select" style={{ width: '100%' }}>
                                                    <option defaultValue="selected">Alabama</option>
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
                                </div>
                            </div>
                       
                        <CollapsibleCard title="Sub-Project Details">
                          <div className="card-body mt-0 pt-0">
                                            <div className="row align-items-center">
                                                {/* RERA Area */}
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>RERA Area</label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            placeholder="Sq. Ft."
                                                        />
                                                    </div>
                                                </div>
                                                {/* Construction Area */}
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Construction Area</label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            placeholder="Sq. Ft."
                                                        />
                                                    </div>
                                                </div>
                                                {/* Saleable Area */}
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Saleable Area Sq.ft.</label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>
                                                {/* Version */}
                                                <div className="col-md-4 mt-2">
                                                    <div className="form-group">
                                                        <label>Version</label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>
                                                {/* No. of Flats */}
                                                <div className="col-md-4 mt-2">
                                                    <div className="form-group">
                                                        <label>No. of Flat</label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            placeholder="Nos"
                                                        />
                                                    </div>
                                                </div>
                                                {/* No. of Floors */}
                                                <div className="col-md-4 mt-2">
                                                    <div className="form-group">
                                                        <label>No of Floors</label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            placeholder="Floors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                        </CollapsibleCard>
                        <div className="d-flex justify-content-between mx-3">
                                {/* Legend Section */}
                                <div className="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                                    <span className="reference-label me-4" style={{ fontWeight: "bold" }}>Legend</span>
                                    <span className="reference-label main-category">Main Category</span>
                                    <span className="reference-label category-lvl2">Category lvl 2</span>
                                    <span className="reference-label sub-category-lvl3">Sub-category lvl 3</span>
                                    <span className="reference-label sub-category-lvl4">Sub-category lvl 4</span>
                                    <span className="reference-label sub-category-lvl5">Sub-category lvl 5</span>
                                    <span className="reference-label labour">Labour</span>
                                </div>

                                {/* Add Button */}
                                <div>
                                    <button
                                        className="purple-btn2 rounded-3"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-plus"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                        </svg>
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>

                              <div className="mx-3">
                            <div className="tbl-container mx-3 mt-3" style={{ maxHeight: "max-content" }}>
                                <table className="" style={{ maxHeight: "max-content" }}>
                                    <thead>
                                        <tr>
                                            <th className="text-start">Expand</th>
                                            <th className="text-start">Sr No.</th>
                                            <th className="text-start">Level</th>
                                            <th className="text-start">WBS CODE</th>
                                            <th className="text-start">Category</th>
                                            <th className="text-start">Location</th>
                                            <th className="text-start">Type</th>
                                            <th className="text-start">Items</th>
                                            <th className="text-start">Factor</th>
                                            <th className="text-start">UOM</th>
                                            {/* <th className="text-start">Area</th> */}
                                            <th className="text-start">QTY Excl Wastage</th>
                                            <th className="text-start">Wastage</th>
                                            <th className="text-start">QTY incl Waste</th>
                                            <th className="text-start">Rate</th>
                                            <th className="text-start">Amount</th>
                                            <th className="text-start">Cost Per Unit</th>
                                            <th className="text-start" style={{ width: "12px" }}>
                                                Action
                                            </th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        <tr className="main-category">
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
                                                >
                                                    {/* <!-- Square --> */}
                                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                    {/* <!-- Plus Icon --> */}
                                                    <line x1="12" y1="8" x2="12" y2="16" />
                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                </svg>

                                            </td>
                                            <td>1</td>
                                            <td style={{ width: "100px" }}>Main Category</td>
                                            <td>FF</td>
                                            <td>Flat Finishing</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Total Here</td>
                                            {/* <td></td> */}
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>5,654,88</td>
                                            <td></td>
                                            <td>
                                                <button
                                                    className="btn p-0 pb-0"
                                                    onClick={() => addSubCondition()}
                                                >
                                                    <i
                                                        className="fa-solid fa-plus"
                                                        style={{
                                                            border: "unset",
                                                            fontSize: "12px",
                                                            color: "black",
                                                        }}
                                                    ></i>
                                                </button>
                                                <button
                                                    className="btn p-0 removeSubCondition"
                                                    onClick={(e) => removeSubCondition(e.currentTarget)}
                                                >

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="48"
                                                        viewBox="0 0 24 48"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        {/* <!-- Plus Icon (Top) --> */}
                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                        <line x1="8" y1="14" x2="16" y2="14" />

                                                        {/* <!-- Minus Icon (Bottom) --> */}
                                                        <line x1="8" y1="34" x2="16" y2="34" />
                                                    </svg>

                                                </button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            </div>
                        <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Save</button>
                             <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Export</button>
                        </div>

                        <div className="row mt-2 justify-content-center">
                                <div className="col-md-2">
                                    <button className="purple-btn2 w-100">Create</button>
                                </div>
                            </div>

                    </div>
                </div>
            </div>

        </>
    );
};

export default EstimationCreation;
