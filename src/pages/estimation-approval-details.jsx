import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";


const EstimationApprovalDetails = () => {

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
            <Header />
            <div className="main-content">
                <Sidebar />
                <div className="website-content overflow-auto">
                    <div className="module-data-section p-3">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt;  Budget &gt; Comparison</a>

                        <div className="card p-3 mt-3">

                            <div className="card mt-3">
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
                                {viewQuickFilter && (
                                    <div className="card-body mt-0 pt-0">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Project Name</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Sub-Project Name</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub-Project Budget</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub Project Balance Budget</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>M+L Budget</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub Project Construction Area</label>
                                                    <input className="form-control" type="number" placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>



                            <div className="tbl-container mx-3 mt-3">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-center">
                                                <input type="checkbox" />
                                            </th>
                                            <th className="text-start">Expand</th>
                                            <th className="text-start">Sr.no</th>
                                            <th className="text-start">Category level</th>
                                            <th className="text-start">WBS Code</th>
                                            <th className="text-start">Type</th>
                                            <th className="text-start">Category</th>
                                            <th className="text-start">Budget</th>
                                            <th className="text-start">Budget Escalation</th>
                                            <th>Order Draft Value (WO/PO)</th>
                                            <th>Order Submit Value (WO/PO)</th>
                                            <th>Order Approved Value (WO/PO)</th>
                                            <th>Miscellaneous Expenses</th>
                                            <th>Balance Budget</th>
                                            <th className="text-start">%Balance</th>
                                            <th className="text-start">%Complete</th>
                                            <th className="text-start">Bill Balance Value</th>
                                            <th className="text-start">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
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
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>20%</td>
                                            <td>0.5%</td>
                                            <td>15,000</td>
                                            <td>Modified Some Category</td>
                                        </tr>

                                        <tr>
                                            <td></td>
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
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>20%</td>
                                            <td>0.5%</td>
                                            <td>15,000</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td></td>
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
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>4,500,000</td>
                                            <td>20%</td>
                                            <td>0.5%</td>
                                            <td>15,000</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Remark</label>
                                        <textarea className="form-control" rows="3" placeholder="" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4 justify-content-end align-items-center">
                                <div className="col-md-3">
                                    <div className="form-group d-flex gap-3 align-items-center">
                                        <label style={{ fontSize: '1.1rem' }}>Status</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
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


                            <div className="d-flex justify-content-center">
                                <button className="purple-btn2">Submit</button>
                                <button className="purple-btn1">Cancel</button>
                            </div>

                            <div>
                                <h5 className="mt-3">Audit Log</h5>

                                <div className="tbl-container px-0">
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
                                                <th>1</th>
                                                <td>Pratham Shastri</td>
                                                <td>15-02-2024</td>
                                                <td>Verified</td>
                                                <td>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 25 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        opacity={0.5}
                                                    >
                                                        {/* <!-- Square Background --> */}
                                                        <rect x="0" y="0" width="25" height="24" fill="none" stroke="currentColor" stroke-width="1" />

                                                        {/* <!-- Eye Icon --> */}
                                                        <path d="M1 12s3.5-8 11-8 11 8 11 8-3.5 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>



                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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

export default EstimationApprovalDetails;
