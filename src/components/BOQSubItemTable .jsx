import React from 'react'
import '../styles/mor.css'
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BOQSubItemTable  = () => {
    
    const [submaterialDetails, setsubmaterialDetails] = useState(false);
    const [sublabourDetails, setsublabourDetails] = useState(false);
    const [subassestsDetails, setsubassestsDetails] = useState(false);

   
      const  submaterialDropdown = () => {
        setsubmaterialDetails(!submaterialDetails);
      };
      const  sublabourDropdown = () => {
        setsublabourDetails(!sublabourDetails);
      };
      const  subassestsDropdown = () => {
        setsubassestsDetails(!subassestsDetails);
      };
  return (
     <>
     <div className="collapse show">
       <div className="card card-body" style={{width:"70%"}}>
              <div className="card   mx-3 mt-2">
                <div className="card-header3">
                  <h3 className="card-title">Material</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      onClick={submaterialDropdown}
                    >
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={16} cy={16} r={16} fill="#8B0203" />
                        <path
                          d="M16 24L9.0718 12L22.9282 12L16 24Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {submaterialDetails && (
                <div className="card-body mt-0 pt-0" >
                  <div className="tbl-container mx-3 mt-1">
                    <table className="w-100" id="table1">
                      <thead>
                        <tr>
                          <th rowSpan={2}>
                            <input type="checkbox" />
                          </th>
                          <th rowSpan={2}>Material Type</th>
                          <th rowSpan={2}>Material Sub-Type</th>
                          <th rowSpan={2}>Material</th>
                          <th rowSpan={2}>Generic Specification</th>
                          <th rowSpan={2}>Colour </th>
                          <th rowSpan={2}>Brand </th>
                          <th rowSpan={2}>UOM</th>
                          <th rowSpan={2}>Cost QTY</th>
                          <th colSpan={2}>Cost</th>
                          <th rowSpan={2}>Wastage</th>
                          <th rowSpan={2}>Total Estimated Qty Wastage</th>
                        </tr>
                        <tr>
                          <th>Co-Efficient Factor</th>
                          <th rowSpan={2}>Estimated Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>SAND</td>
                          <td>SAND</td>
                          <td>SAND River (Bag)</td>
                          <td>River Sand GOLD</td>
                          <td>Gold</td>
                          <td />
                          <td>Bags</td>
                          <td />
                          <td>1</td>
                          <td>2</td>
                          <td>4%</td>
                          <td>2.08</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row mt-3 mx-3">
                    <p>
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        onclick="myCreateFunction('table1')"
                      >
                        Add Material
                      </button>{" "}
                      |
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        onclick="myDeleteFunction('table1')"
                      >
                        Delete Material
                      </button>
                    </p>
                  </div>
                </div>
                )}
              </div>
              <div className="card mx-3 mt-2">
                <div className="card-header3">
                  <h3 className="card-title">Labour</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      onClick={sublabourDropdown}
                    >
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={16} cy={16} r={16} fill="#8B0203" />
                        <path
                          d="M16 24L9.0718 12L22.9282 12L16 24Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {sublabourDetails && (
                <div className="card-body mt-0 pt-0">
                  <div className="tbl-container mx-3 mt-1">
                    <table className="w-100" id="table2">
                      <thead>
                        <tr>
                          <th rowSpan={2}>
                            <input type="checkbox" />
                          </th>
                          <th rowSpan={2}>Labour Type</th>
                          <th rowSpan={2}>Labour Sub-Type</th>
                          <th rowSpan={2}>Labour</th>
                          <th rowSpan={2}>UOM</th>
                          <th colSpan={2}>Cost</th>
                        </tr>
                        <tr>
                          <th>Co-Efficient Factor</th>
                          <th rowSpan={2}>Estimated Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row mt-3 mx-3">
                    <p>
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        onclick="myCreateFunction('table2')"
                      >
                        Add Labour
                      </button>{" "}
                      |
                      <button
                        style={{ color: "var(--red)" }}
                        className="fw-bold text-decoration-underline border-0 bg-white"
                        onclick="myDeleteFunction('table2')"
                      >
                        Delete Labour
                      </button>
                    </p>
                  </div>
                </div>
                )}
              </div>
              <div className="card  mx-3 mt-2">
                <div className="card-header3">
                  <h3 className="card-title">Assests</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      onClick={subassestsDropdown}
                    >
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={16} cy={16} r={16} fill="#8B0203" />
                        <path
                          d="M16 24L9.0718 12L22.9282 12L16 24Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {subassestsDetails && (
              <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
              <div className="tbl-container mx-3 mt-1">
                <table className="w-100" id="table3">
                  <thead>
                    <tr>
                      <th rowSpan={2}>
                        <input type="checkbox" />
                      </th>
                      <th rowSpan={2}>Assest Type</th>
                      <th rowSpan={2}>Assest Sub-Type</th>
                      <th rowSpan={2}>Assest</th>
                      <th rowSpan={2}>UOM</th>
                      <th colSpan={2}>Cost</th>
                    </tr>
                    <tr>
                      <th>Co-Efficient Factor</th>
                      <th rowSpan={2}>Estimated Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-3 mx-3">
                <p>
                  <button
                    style={{ color: "var(--red)" }}
                    className="fw-bold text-decoration-underline border-0 bg-white"
                    onclick="myCreateFunction('table3')"
                  >
                    Add Assests
                  </button>{" "}
                  |
                  <button
                    style={{ color: "var(--red)" }}
                    className="fw-bold text-decoration-underline border-0 bg-white"
                    onclick="myDeleteFunction('table3')"
                  >
                    Delete Assests
                  </button>
                </p>
              </div>
            </div>
            
                )}
              </div>
            </div>
            </div>
     </>
  )
}

export default BOQSubItemTable 