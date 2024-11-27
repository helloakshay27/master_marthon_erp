import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
// import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";


const EstimationComparision = () => {
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

    // State to manage collapsed rows
    const [collapsedRows, setCollapsedRows] = useState({});

    const toggleCollapse = (rowId) => {
        setCollapsedRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId],
        }));
    };
    return (
        <>
            <Header />
            <div className="main-content">
                <Sidebar />
                <div className="website-content overflow-auto">
                    <div className="module-data-section p-3">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget &gt; Comparison</a>

                        <div className="card p-3 mt-3">
                          
                            <div className="card mt-2">
                                <div className="card-header3">
                                    <h3 className="card-title">Project Details</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={viewQuickFilterDropdown}>
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#8B0203" />
                                                <path d="M16 24L9.0718 12L22.9282 12L16 24Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {viewQuickFilter&&(
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
                                )}
                                
                            </div>
                            <div className="d-flex justify-content-between">
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
                                        data-bs-toggle="modal"
                                        data-bs-target="#settings"
                                    >
                                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M10.9985 7.45532C8.64565 7.45532 6.73828 9.36269 6.73828 11.7155C6.73828 14.0684 8.64565 15.9757 10.9985 15.9757C13.3514 15.9757 15.2587 14.0684 15.2587 11.7155C15.2587 9.36269 13.3514 7.45532 10.9985 7.45532ZM8.86838 11.7155C8.86838 10.5391 9.82208 9.58544 10.9985 9.58544C12.1749 9.58544 13.1286 10.5391 13.1286 11.7155C13.1286 12.892 12.1749 13.8457 10.9985 13.8457C9.82208 13.8457 8.86838 12.892 8.86838 11.7155Z"
                                                fill="#8B0203"
                                            ></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M14.3416 2.97635C13.8887 -0.992103 8.10872 -0.992127 7.65577 2.97635L7.56116 3.80528C7.46818 4.61997 6.60664 5.12268 5.84081 4.79072L5.07295 4.45788C1.43655 2.88166 -1.52087 7.83752 1.73283 10.2351L2.40609 10.7312C3.07122 11.2213 3.07122 12.2099 2.40609 12.7L1.73283 13.1961C-1.52085 15.5936 1.43653 20.5496 5.07295 18.9733L5.84081 18.6405C6.60664 18.3085 7.46818 18.8113 7.56116 19.6259L7.65577 20.4549C8.10872 24.4233 13.8887 24.4233 14.3416 20.4549L14.4362 19.6259C14.5292 18.8113 15.3908 18.3085 16.1565 18.6405L16.9244 18.9733C20.5609 20.5495 23.5183 15.5936 20.2645 13.1961L19.5913 12.7C18.9262 12.2099 18.9262 11.2213 19.5913 10.7312L20.2645 10.2351C23.5183 7.83753 20.5609 2.88164 16.9244 4.45788L16.1566 4.79072C15.3908 5.12268 14.5292 4.61997 14.4362 3.8053L14.3416 2.97635ZM9.77214 3.2179C9.93768 1.76752 12.0597 1.7675 12.2252 3.2179L12.3198 4.04684C12.5762 6.29253 14.9347 7.64199 17.0037 6.74512L17.7716 6.41228C19.1548 5.81273 20.1484 7.67469 19.001 8.52023L18.3278 9.01632C16.5072 10.3578 16.5072 13.0734 18.3278 14.4149L19.001 14.911C20.1484 15.7566 19.1548 17.6185 17.7716 17.019L17.0037 16.686C14.9347 15.7891 12.5762 17.1386 12.3198 19.3843L12.2252 20.2133C12.0597 21.6636 9.93768 21.6638 9.77214 20.2133L9.67753 19.3843C9.42121 17.1386 7.06273 15.7891 4.99366 16.686L4.22578 17.019C2.84258 17.6185 1.84896 15.7566 2.99644 14.911L3.66969 14.4149C5.49017 13.0734 5.49015 10.3578 3.66969 9.01632L2.99642 8.52021C1.84898 7.67471 2.84256 5.81271 4.2258 6.4123L4.99366 6.74512C7.06273 7.64199 9.42121 6.29253 9.67753 4.04684L9.77214 3.2179Z"
                                                fill="#8B0203"
                                            ></path>
                                        </svg>
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


                      {/* copy file  modal*/}
                      <div class="modal fade" id="copyModal" tabindex="-1" aria-labelledby="copyModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title fs-5" id="exampleModalLabel">Copy Budget</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="row mb-2">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>From</label>
                                                <select class="form-control form-select" style={{width: "100%"}} fdprocessedid="8dxxus">
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
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>To</label>
                                                <select class="form-control form-select" style={{width: "100%"}} fdprocessedid="8dxxus">
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

                                    <div class="row mt-2 justify-content-center">
                                        <div class="col-md-4">
                                            <button class="purple-btn2 w-100" fdprocessedid="u33pye">Copy</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                  <Footer/>
                </div>
            </div>
        </>
    );
};

export default EstimationComparision;
