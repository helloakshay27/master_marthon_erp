import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";

const PoAdvanceNotePayment = () => {
  const [activeTab, setActiveTab] = useState("pills-home");

  // Function to handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Function to handle the next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle the previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Advance </a>
          <h5 className="mt-3">Advance </h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 px-2">
              <div
                className="tab-content mor-content active"
                id="pills-tabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <section className="mor p-2 pt-2">
                    <div className="mor-tabs mt-4">
                      {/* <ul
                  className="nav nav-pills mb-3 justify-content-center"
                  id="pills-tab"
                  role="tablist"
                  style={{ boxShadow: "none" }}
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      MOR
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      MOR Approval
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      PO
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Advance
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Material Received
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Billing
                    </button>
                  </li>
                </ul> */}

                      <ul
                        className="nav nav-pills mb-3 justify-content-center"
                        id="pills-tab"
                        role="tablist"
                        style={{ boxShadow: "none" }}
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-home" ? "active" : ""
                            }`}
                            id="pills-home-tab"
                            onClick={() => handleTabChange("pills-home")}
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected={activeTab === "pills-home"}
                          >
                            MOR
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-profile" ? "active" : ""
                            }`}
                            id="pills-profile-tab"
                            onClick={() => handleTabChange("pills-profile")}
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected={activeTab === "pills-profile"}
                          >
                            MOR Approval
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-contact" ? "active" : ""
                            }`}
                            id="pills-contact-tab"
                            onClick={() => handleTabChange("pills-contact")}
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected={activeTab === "pills-contact"}
                          >
                            PO
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-advance" ? "active" : ""
                            }`}
                            id="pills-advance-tab"
                            onClick={() => handleTabChange("pills-advance")}
                            role="tab"
                            aria-controls="pills-advance"
                            aria-selected={activeTab === "pills-advance"}
                          >
                            Advance
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-material" ? "active" : ""
                            }`}
                            id="pills-material-tab"
                            onClick={() => handleTabChange("pills-material")}
                            role="tab"
                            aria-controls="pills-material"
                            aria-selected={activeTab === "pills-material"}
                          >
                            Material Received
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              activeTab === "pills-billing" ? "active" : ""
                            }`}
                            id="pills-billing-tab"
                            onClick={() => handleTabChange("pills-billing")}
                            role="tab"
                            aria-controls="pills-billing"
                            aria-selected={activeTab === "pills-billing"}
                          >
                            Billing
                          </button>
                        </li>
                      </ul>
                    </div>
                    {/* <div className="row justify-content-center my-4">
                <div className="col-md-10">
                  <div className="progress-steps">
                    <div className="top">
                      <div className="progress">
                        <span />
                      </div>
                      <div className="steps">
                        <div className="layer1">
                          <div className="step active" data-step={1}>
                            <span />
                          </div>
                          <p>layer1</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={2}>
                            <span />
                          </div>
                          <p>layer2</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={3}>
                            <span />
                          </div>
                          <p>layer3</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={4}>
                            <span />
                          </div>
                          <p>layer4</p>
                        </div>
                      </div>
                    </div>
                    <div className="buttons d-m">
                      <button className="btn btn-prev disabled" disabled="">
                        prev
                      </button>
                      <button className="btn btn-next">Next</button>
                    </div>
                  </div>
                </div>
              </div> */}
                    {/* <div className="row justify-content-center my-4">
                      <div className="col-md-10">
                        <div className="progress-steps">
                          <div className="top">
                            <div className="progress">
                              <span
                                style={{
                                  width: `${
                                    ((currentStep - 1) / (totalSteps - 1)) * 100
                                  }%`,
                                }}
                              ></span>
                            </div>
                            <div className="steps">
                              {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                  <div
                                    className={`step ${
                                      currentStep > index + 1 ? "active" : ""
                                    }`}
                                    data-step={index + 1}
                                  >
                                    <span></span>
                                  </div>
                                  <p>layer{index + 1}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="buttons d-m">
                            <button
                              className="btn btn"
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            <button
                              className="btn btn-next"
                              onClick={handleNext}
                              disabled={currentStep === totalSteps}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}
 <div className="row justify-content-center my-4">
            <div className="col-md-10">
                <div className="progress-steps">
                    <div className="top">
                        <div className="progress">
                            <span style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></span>
                        </div>
                        <div className="steps">
                            {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                    <div
                                        className={`step ${currentStep > index + 1 ? 'active' : ''}`}
                                        data-step={index + 1}
                                    >
                                        <span></span>
                                    </div>
                                    <p>Layer {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="buttons d-m">
                        {/* Prev Button */}
                        <button
                            className={`btn btn-prev ${currentStep === 1 ? 'disabled' : ''}`}
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                        >
                            Prev
                        </button>
                        {/* Next Button */}
                        <button
                            className={`btn btn-next ${currentStep === totalSteps ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={currentStep === totalSteps}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

                    <div className="row">
                      {/* form-select EXAMPLE */}
                      <div
                        className="card card-default"
                        id="mor-material-details"
                      >
                        <div className="card-body mt-0">
                          <div className=" d-flex justify-content-end">
                            <a href="#" className="text-decoration-underline">
                              Existing Allocated PO &amp; Advance
                            </a>
                          </div>
                          <div className="row">
                            <div className="col-md-4 ">
                              <div className="form-group">
                                <label>
                                  Company <span>*</span>
                                </label>
                                <select
                                  className="form-control form-select"
                                  style={{ width: "100%" }}
                                >
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
                            <div className="col-md-4  ">
                              <div className="form-group">
                                <label>
                                  Project <span>*</span>
                                </label>
                                <select
                                  className="form-control form-select"
                                  style={{ width: "100%" }}
                                >
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
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Advance Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Default input"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Certificate Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Default input"
                                />
                              </div>
                            </div>
                            <div className="col-md-3 mt-2">
                              <div className="form-group">
                                <label>PO Nunber</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div
                              className="col-md-1 pt-4"
                              data-bs-toggle="modal"
                              data-bs-target="#selectModal"
                            >
                              <p className="mt-2 text-decoration-underline">
                                Select
                              </p>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>PO Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text" />
                                  <span className="input-group-addon">
                                    <i
                                      className="fa-solid fa-calendar-days"
                                      style={{ color: "#8B0203" }}
                                    />{" "}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>PO Value</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Performa Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Performa Amount</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Invoice Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text" />
                                  <span className="input-group-addon">
                                    <i
                                      className="fa-solid fa-calendar-days"
                                      style={{ color: "#8B0203" }}
                                    />{" "}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3 mt-2">
                              <div className="form-group">
                                <label>Supplier Name</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div
                              className="col-md-1 pt-4"
                              data-bs-toggle="modal"
                              data-bs-target="#selectModal"
                            >
                              <p className="mt-2 text-decoration-underline">
                                View Details
                              </p>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>GSTIN Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>PAN Number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Advance %</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Advance Amount</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Net Payable</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4  mt-2">
                              <div className="form-group">
                                <label>Mode of Payment</label>
                                <select
                                  className="form-control form-select"
                                  style={{ width: "100%" }}
                                  fdprocessedid="vk6j2k"
                                >
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
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Favoring / Payee</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Expected Payment Date</label>
                                <div
                                  id="datepicker"
                                  className="input-group date"
                                  data-date-format="mm-dd-yyyy"
                                >
                                  <input className="form-control" type="text" />
                                  <span className="input-group-addon">
                                    <i
                                      className="fa-solid fa-calendar-days"
                                      style={{ color: "#8B0203" }}
                                    />{" "}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mt-2">
                              <div className="form-group">
                                <label>Remark</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  placeholder="Enter ..."
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-3 me-2">
                            <h5 className=" ">Tax Details</h5>
                          </div>
                          <div className="tbl-container mx-3 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th className="text-start">
                                    Tax / Charge Type
                                  </th>
                                  <th className="text-start">
                                    Tax / Charges per UOM (INR)
                                  </th>
                                  <th className="text-start">
                                    Inclusive / Exculsive
                                  </th>
                                  <th className="text-start">Amount</th>
                                  <th className="text-start">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th className="text-start">
                                    Total Base Cost
                                  </th>
                                  <td className="text-start" />
                                  <td className="text-start"> </td>
                                  <td className="text-start">3000</td>
                                  <td />
                                </tr>
                                <tr>
                                  <th className="text-start">
                                    Addition Tax &amp; Charges
                                  </th>
                                  <td className="text-start" />
                                  <td className="text-start"> </td>
                                  <td className="text-start" />
                                  <td className="row-1" data-group={1}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-plus-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                  </td>
                                </tr>
                                <tr className="row-2" data-group={1}>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="">
                                    <input type="checkbox" />
                                  </td>
                                  <td className="text-start">0.00</td>
                                  <td className="">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-dash-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                  </td>
                                </tr>
                                <tr className="row-2" data-group={1}>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="">
                                    <input type="checkbox" />
                                  </td>
                                  <td className="text-start">0.00</td>
                                  <td className="">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-dash-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                  </td>
                                </tr>
                                <tr className="row-2" data-group={1}>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="text-start">
                                    <select
                                      className="form-control form-select"
                                      style={{ width: "100%" }}
                                      fdprocessedid="4g1z87"
                                    >
                                      <option selected="selected">
                                        Alabama
                                      </option>
                                      <option>Alaska</option>
                                      <option>California</option>
                                      <option>Delaware</option>
                                      <option>Tennessee</option>
                                      <option>Texas</option>
                                      <option>Washington</option>
                                    </select>
                                  </td>
                                  <td className="">
                                    <input type="checkbox" />
                                  </td>
                                  <td className="text-start">0.00</td>
                                  <td className="">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-dash-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                  </td>
                                </tr>
                                <tr className="row-2" data-group={1}>
                                  <th className="text-start">
                                    Sub Total A (Addition)
                                  </th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start">540</td>
                                  <td className="">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-dash-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-start">Gross Amount</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start">3540</td>
                                  <td className="" />
                                </tr>
                                <tr>
                                  <th className="text-start">Deduction Tax</th>
                                  <td className="text-start" />
                                  <td className="" />
                                  <td className="text-start" />
                                  <td className=""> </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="d-flex justify-content-between mt-3 me-2">
                            <h5 className=" ">Advance Amount Bifurcation</h5>
                          </div>
                          <div className="tbl-container mx-3 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th className="text-start">Sub-Project</th>
                                  <th className="text-start">MOR Number</th>
                                  <th className="text-start">Advance Amount</th>
                                  <th className="text-start">Paid Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start">Cedar</td>
                                  <td className="text-start">MOR123</td>
                                  <td className="text-start">1170</td>
                                  <td className="text-start">1770</td>
                                </tr>
                                <tr>
                                  <td className="text-start">Bodhi</td>
                                  <td className="text-start">MOR123</td>
                                  <td className="text-start">1170</td>
                                  <td className="text-start">1770</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="d-flex justify-content-between mt-3 me-2">
                            <h5 className=" ">Payment Details</h5>
                            <div className="card-tools d-flex pe-1">
                              <div className="d-flex">
                                <div className="px-2 pt-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-check2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                  </svg>{" "}
                                </div>
                                <div>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="CIN Verification"
                                    disabled=""
                                    fdprocessedid="qv9ju9"
                                  />
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="px-2 pt-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-check2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                  </svg>{" "}
                                </div>
                                <div>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="CIN Details"
                                    disabled=""
                                    fdprocessedid="qv9ju9"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="tbl-container mx-3 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th className="text-start">
                                    Mode of Payment
                                  </th>
                                  <th className="text-start">
                                    Instrument Date
                                  </th>
                                  <th className="text-start">Instrument No.</th>
                                  <th className="text-start">UTR NO.</th>
                                  <th className="text-start">
                                    Bank / Cash Account
                                  </th>
                                  <th className="text-start">Amount</th>
                                  <th className="text-start">Created by</th>
                                  <th className="text-start">Created On</th>
                                  <th className="text-start">Status</th>
                                  <th className="text-start">
                                    Reconsilation Date
                                  </th>
                                  <th className="text-start">Cheque Print</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start">1</td>
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start" />
                                  <td className="text-start text-decoration-underline">
                                    Print
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="row mt-2 justify-content-center">
                            <div
                              className="col-md-3"
                              data-bs-toggle="modal"
                              data-bs-target="#makecasheModal"
                            >
                              <button
                                className="purple-btn2 w-100"
                                fdprocessedid="u33pye"
                              >
                                Make Cash Payment
                              </button>
                            </div>
                            <div
                              className="col-md-3"
                              data-bs-toggle="modal"
                              data-bs-target="#makebankModal"
                            >
                              <button
                                className="purple-btn2 w-100"
                                fdprocessedid="af5l5g"
                              >
                                Make Bank Payment
                              </button>
                            </div>
                            <div
                              className="col-md-3"
                              data-bs-toggle="modal"
                              data-bs-target="#makeadjustmentModal"
                            >
                              <button
                                className="purple-btn2 w-100"
                                fdprocessedid="af5l5g"
                              >
                                Make Adjustment Entry
                              </button>
                            </div>
                          </div>
                          <div className="row mt-4 justify-content-start align-items-center">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Attchment</label>
                                <input
                                  className="form-control"
                                  type="file"
                                  placeholder="Default input"
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead className="w-100">
                                    <tr>
                                      <th className="main2-th">
                                        Document Name
                                      </th>
                                      <th className="main2-th">Upload Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>MTO Copy.pdf</th>
                                      <td>03-03-2024</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4 justify-content-end align-items-center">
                  <div className="col-md-3">
                    <div className="form-group d-flex gap-3 align-items-center">
                      <label style={{ fontSize: "1.1rem" }}>status</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
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
                <div className="row mt-2 justify-content-end">
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
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
                            <td>Verified &amp; Processed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            ...
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            ...
          </div>
        </div>
      </div>
    </>
  );
};

export default PoAdvanceNotePayment;