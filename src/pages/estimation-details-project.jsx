import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";


const EstimationDetailsProject = () => {
    const [viewWingDetails, setViewWingDetails] = useState(true);

    const viewWingDetailsDropdown = () => {
        setViewWingDetails(!viewWingDetails);
    };
    return (
        <>
            <Header />
            <div className="main-content">
                <Sidebar />
                <div class="website-content overflow-auto">
                    <div class="module-data-section p-4">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
                        {/* <h5 className="mt-4">Band Master</h5> */}
                        <div className="card p-3 mt-3">
                            {/* Total Content Here */}
                            <div className="card mt-2">


                                <div className="card-header3">
                                    <h3 className="card-title">Project Details</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={viewWingDetailsDropdown}
                                            >
                                                <circle cx="16" cy="16" r="16" fill="#8B0203" />
                                                <path d="M16 24L9.0718 12L22.9282 12L16 24Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {viewWingDetails && (
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

                                )}




                            </div>
                            <div className="d-flex justify-content-between">
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
                                        <button className="btn" >
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
                                        <button type="submit" class="btn btn-md " data-bs-toggle="modal" data-bs-target="#settings">
                                            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9985 7.45532C8.64565 7.45532 6.73828 9.36269 6.73828 11.7155C6.73828 14.0684 8.64565 15.9757 10.9985 15.9757C13.3514 15.9757 15.2587 14.0684 15.2587 11.7155C15.2587 9.36269 13.3514 7.45532 10.9985 7.45532ZM8.86838 11.7155C8.86838 10.5391 9.82208 9.58544 10.9985 9.58544C12.1749 9.58544 13.1286 10.5391 13.1286 11.7155C13.1286 12.892 12.1749 13.8457 10.9985 13.8457C9.82208 13.8457 8.86838 12.892 8.86838 11.7155Z" fill="#8B0203"></path>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3416 2.97635C13.8887 -0.992103 8.10872 -0.992127 7.65577 2.97635L7.56116 3.80528C7.46818 4.61997 6.60664 5.12268 5.84081 4.79072L5.07295 4.45788C1.43655 2.88166 -1.52087 7.83752 1.73283 10.2351L2.40609 10.7312C3.07122 11.2213 3.07122 12.2099 2.40609 12.7L1.73283 13.1961C-1.52085 15.5936 1.43653 20.5496 5.07295 18.9733L5.84081 18.6405C6.60664 18.3085 7.46818 18.8113 7.56116 19.6259L7.65577 20.4549C8.10872 24.4233 13.8887 24.4233 14.3416 20.4549L14.4362 19.6259C14.5292 18.8113 15.3908 18.3085 16.1565 18.6405L16.9244 18.9733C20.5609 20.5495 23.5183 15.5936 20.2645 13.1961L19.5913 12.7C18.9262 12.2099 18.9262 11.2213 19.5913 10.7312L20.2645 10.2351C23.5183 7.83753 20.5609 2.88164 16.9244 4.45788L16.1566 4.79072C15.3908 5.12268 14.5292 4.61997 14.4362 3.8053L14.3416 2.97635ZM9.77214 3.2179C9.93768 1.76752 12.0597 1.7675 12.2252 3.2179L12.3198 4.04684C12.5762 6.29253 14.9347 7.64199 17.0037 6.74512L17.7716 6.41228C19.1548 5.81273 20.1484 7.67469 19.001 8.52023L18.3278 9.01632C16.5072 10.3578 16.5072 13.0734 18.3278 14.4149L19.001 14.911C20.1484 15.7566 19.1548 17.6185 17.7716 17.019L17.0037 16.686C14.9347 15.7891 12.5762 17.1386 12.3198 19.3843L12.2252 20.2133C12.0597 21.6636 9.93768 21.6638 9.77214 20.2133L9.67753 19.3843C9.42121 17.1386 7.06273 15.7891 4.99366 16.686L4.22578 17.019C2.84258 17.6185 1.84896 15.7566 2.99644 14.911L3.66969 14.4149C5.49017 13.0734 5.49015 10.3578 3.66969 9.01632L2.99642 8.52021C1.84898 7.67471 2.84256 5.81271 4.2258 6.4123L4.99366 6.74512C7.06273 7.64199 9.42121 6.29253 9.67753 4.04684L9.77214 3.2179Z" fill="#8B0203"></path>
                                            </svg>
                                        </button>
                                        <button className="purple-btn2" data-bs-toggle="modal" data-bs-target="#copyModal">
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
                                             Copy Budget</button>
                                    </div>


                                </div>
                            </div>
                            {/* table */}
                            <div class="tbl-container mx-3 mt-2" style={{ maxHeight: "700px" }}>
                                <table className="" style={{ width: "max-content", maxHeight: "max-content", height: "auto" }}>
                                    <thead style={{ zIndex: "111 " }}>
                                        <tr>
                                            <th className="text-center" colSpan={7}>
                                                BUDGET
                                            </th>
                                            <th className="text-center" colSpan={3}>
                                                Amount Contracted
                                            </th>
                                            <th className="text-center" colSpan={2}>
                                                Miscellaneous Expenses
                                            </th>
                                            <th className="text-center" colSpan={2}>
                                                Budget Balance
                                            </th>
                                            <th className="text-center" colSpan={1}>
                                                Debit
                                            </th>
                                            <th className="text-center" colSpan={7}>
                                                Abstract & GRN
                                            </th>
                                            <th className="text-center" colSpan={3}>
                                                BILL Certified
                                            </th>
                                            <th className="text-center" colSpan={3}>
                                                Advance Details
                                            </th>
                                            <th className="text-center">
                                                Balance
                                            </th>
                                        </tr>

                                        <tr>
                                            <th className="text-center" colSpan={6}>
                                                References
                                            </th>
                                            <th className="text-center">A</th>
                                            <th className="text-center">B</th>
                                            <th className="text-center">C</th>
                                            <th className="text-center">D</th>
                                            <th className="text-center">E</th>
                                            <th className="text-center">F</th>
                                            <th className="text-center">G = A-B-E</th>
                                            <th className="text-center">H</th>
                                            <th className="text-center">I</th>
                                            <th className="text-center">J</th>
                                            <th className="text-center">K</th>
                                            <th className="text-center">L</th>
                                            <th className="text-center">M</th>
                                            <th className="text-center">N = J-M</th>
                                            <th className="text-center">O = J-K</th>
                                            <th className="text-center">P = (J-N)/A</th>
                                            <th className="text-center">Q</th>
                                            <th className="text-center">R</th>
                                            <th className="text-center">S = Q-R</th>
                                            <th className="text-center">T</th>
                                            <th className="text-center">U</th>
                                            <th className="text-center">V = T - U</th>
                                            <th className="text-center">W = A-Q-T-F</th>
                                        </tr>
                                        <tr>
                                            <th className="text-start">Expand</th>
                                            <th className="text-start">Sr.no</th>
                                            <th className="text-start">Category level</th>
                                            <th className="text-start">WBS Code</th>
                                            <th className="text-start">Type</th>
                                            <th className="text-start">Category</th>
                                            <th className="text-start">Budget</th>
                                            <th className="text-start">Order Draft Value (WO/PO)</th>
                                            <th className="text-start">Order Submit Value (WO/PO)</th>
                                            <th className="text-start">Order Approved Value (WO/PO)</th>
                                            <th className="text-start">Miscellaneous Expenses Certified</th>
                                            <th className="text-start">Miscellaneous Expenses Paid</th>
                                            <th className="text-start">Balance Budget</th>
                                            <th className="text-start">% Balance</th>
                                            <th className="text-start">Debit Note WO/PO</th>
                                            <th className="text-start">Abstract & GRN Total Value</th>
                                            <th className="text-start">Abstract & GRN Certified</th>
                                            <th className="text-start">Material Issued</th>
                                            <th className="text-start">Material Consumed</th>
                                            <th className="text-start">Stock at Site (Inventory)</th>
                                            <th className="text-start">Abstract & GRN - Pending</th>
                                            <th className="text-start">% Completion</th>
                                            <th className="text-start">Total Bills Value (WO/PO)</th>
                                            <th className="text-start">Total Bills Paid Value (WO/PO)</th>
                                            <th className="text-start">Bill Balance Value</th>
                                            <th className="text-start">Total Advance Paid (WO/PO)</th>
                                            <th className="text-start">Total Advance Adjusted (WO/PO)</th>
                                            <th className="text-start">Total Outstanding Advance (WO/PO)</th>
                                            <th className="text-start">Balance yet to be Paid</th>
                                        </tr>



                                    </thead>
                                    <tbody style={{ zIndex: '11' }}>
                                        <tr className="reference-label main-category">
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
                                            <td>Main Category</td>
                                            <td>Civil Work</td>
                                            <td></td>
                                            <td>Civil Work</td>
                                            <td>4,500,000</td>
                                            <td>13,00,000</td>
                                            <td>9,00,000</td>
                                            <td>1,100,000</td>
                                            <td>1,00,000</td>
                                            <td>40,000</td>
                                            <td>30%</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>40,000</td>
                                            <td>4,000</td>
                                            <td>40,000</td>
                                            <td>40,00</td>
                                            <td>40,00</td>
                                            <td>40,00</td>
                                            <td>4,390,000</td>
                                        </tr>

                                        <tr className="collapse collapseRow1 reference-label category-lvl2">
                                            <td>
                                                <i
                                                    className="fa-solid fa-plus me-2 collapse-icon"
                                                    id="collapseRow1-icon"
                                                    data-toggle="collapse"
                                                    data-target=".collapseRow1"
                                                ></i>
                                            </td>
                                            <td>1.1</td>
                                            <td>Sub-Category Lvl 2</td>
                                            <td>RCC</td>
                                            <td></td>
                                            <td></td>
                                            <td>40,00,000</td>
                                            <td>
                                                10,00,000 <br />
                                                (Total Draft Value)
                                            </td>
                                            <td>9,00,000</td>
                                            <td>1,100,000</td>
                                            <td>1,00,000</td>
                                            <td>1,00,000</td>
                                            <td>72.50%</td>
                                            <td>1,00,000</td>
                                            <td>2,900,000</td>
                                            <td>72.50%</td>
                                            <td>4,00,000</td>
                                            <td>8,00,000</td>
                                            <td>6,00,000</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>2,00,000</td>
                                            <td>20%</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>

                                        <tr className="collapse collapseRow1 reference-label sub-category-lvl3">
                                            <td>
                                                <i
                                                    className="fa-solid fa-plus me-2 collapse-icon"
                                                    id="collapseRow1-icon"
                                                    data-toggle="collapse"
                                                    data-target=".collapseRow1"
                                                ></i>
                                            </td>
                                            <td>1.1.1</td>
                                            <td>Sub-Category Lvl3</td>
                                            <td>RCC1</td>
                                            <td></td>
                                            <td></td>
                                            <td>20,00,000</td>
                                            <td>1,255,000</td>
                                            <td>1,255,000</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>



                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="purple-btn2">Bulk Upload</button>
                                <button className="purple-btn2">Download Template</button>
                                <button className="purple-btn2">Print</button>
                                <button className="purple-btn2">Download</button>
                                <button className="purple-btn2">Import</button>
                                <button className="purple-btn2">Modify</button>
                            </div>
                            <div className="row mt-4 px-2">
                                <div className="col-md-12">
                                    <div className="form-group">
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

                            <div className="row mt-2">
                                <div className="col-12 px-4">
                                    <h5>Audit Log</h5>
                                    <div className="tbl-container me-2 mt-3">
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
                                                    <td>1</td>
                                                    <td>Pratham Shastri</td>
                                                    <td>15-02-2024</td>
                                                    <td>Verified</td>
                                                    <td>Verified & Processed</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>



                    {/* copy file */}
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
                                                <select class="form-control form-select" style={{ width: "100%" }} fdprocessedid="8dxxus">
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
                                                <select class="form-control form-select" style={{ width: "100%" }} fdprocessedid="8dxxus">
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

                    {/* setting modal */}

                    <div
                        className="modal fade"
                        id="settings"
                        tabIndex="-1"
                        aria-labelledby="settingsModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-sm">
                            <div className="modal-content">
                                <div className="modal-header modal-header-k">
                                    <h4
                                        className="modal-title text-center w-100"
                                        id="settingsModalLabel"
                                        style={{ fontWeight: 500 }}
                                    >
                                        Layout
                                    </h4>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div
                                            className="row mt-2 justify-content-between align-items-center"
                                            key={item}
                                        >
                                            <div className="col-md-6">
                                                <button type="submit" class="btn btn-md">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 48 48"
                                                        fill="none"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                                                            fill="black"
                                                        />
                                                    </svg>
                                                </button>
                                                <label htmlFor=""> Sr No.</label>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-check form-switch mt-1">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id={`switch-${item}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default EstimationDetailsProject;