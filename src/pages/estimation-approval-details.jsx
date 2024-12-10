import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
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
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";



const EstimationApprovalDetails = () => {

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt;  Approval Details</a>
                    </a>
                    <div className="card mt-3 pb-3">
                        {/* <QuickFilter /> */}
                        <CollapsibleCard title="Project Details">
                        <div className="card-body mt-0 pt-0">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Project Name</label>
                                                    <input disabled className="form-control" type="text" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Sub-Project Budget</label>
                                                    <input disabled className="form-control" type="text" placeholder="INR" value="INR 40,00,000" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub-Project Name</label>
                                                    <input disabled className="form-control" type="text" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub Project Balance Budget</label>
                                                    <input disabled className="form-control" type="text" placeholder="" value="INR 15,00,000"  />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>M+L Budget</label>
                                                    <input disabled className="form-control" type="text" placeholder="" value="INR 35,00,000"  />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <div className="form-group">
                                                    <label>Sub Project Construction Area</label>
                                                    <input disabled className="form-control" type="text" placeholder="" value="52,668 Sq.ft"  />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </CollapsibleCard>

                        <div className="mx-3">
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
                        </div>
                        <div className="row mt-4 px-2">
                            <div className="col-md-12">
                                <div className="form-group mx-3">
                                    <label>Remark</label>
                                    <textarea className="form-control" rows="3" placeholder=""></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4 justify-content-end align-items-center mx-3">
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
                            <div className="mx-4">
                            <h5>Audit Log</h5>
                            <div className="">
                                <Table columns={auditLogColumns} data={auditLogData} />
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>

        </>
    );
};

export default EstimationApprovalDetails;
