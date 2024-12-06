import React from "react";
import BOQSubItemTable from "../components/BOQSubItemTable ";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const CreateBOQ = () => {
  // bootstrap collaps
  const [createboqDetails, setcreateboqDetails] = useState(true);
  const [materialDetails, setmaterialDetails] = useState(false);
  const [labourDetails, setlabourDetails] = useState(false);
  const [assestsDetails, setassestsDetails] = useState(false);
  const [boqsubitemDetails, setboqsubitemDetails] = useState(false);
  const [expandDetails, setexpandDetails] = useState(false);
  const [submaterialDetails, setsubmaterialDetails] = useState(false);
  const [sublabourDetails, setsublabourDetails] = useState(false);
  const [subassestsDetails, setsubassestsDetails] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [table1Rows, setTable1Rows] = useState([{ id: 1, value: '' }]);
  const [table2Rows, setTable2Rows] = useState([{ id: 1, value: '' }]);
  const [count, setcount] = useState([]);
  const [counter, setcounter] =useState(0);
  useEffect (()=>{
console.log(count);
  },[count])

  const createboqDropdown = () => {
    setcreateboqDetails(!createboqDetails);
  };
  const materialDropdown = () => {
    setmaterialDetails(!materialDetails);
  };
  const labourDropdown = () => {
    setlabourDetails(!labourDetails);
  };
  const assestsDropdown = () => {
    setassestsDetails(!assestsDetails);
  };
  const boqsubitemDropdown = () => {
    setboqsubitemDetails(!boqsubitemDetails);
  };
  const expandDropdown = () => {
    setexpandDetails(!expandDetails);
  };
  const submaterialDropdown = () => {
    setsubmaterialDetails(!submaterialDetails);
  };
  const sublabourDropdown = () => {
    setsublabourDetails(!sublabourDetails);
  };
  const subassestsDropdown = () => {
    setsubassestsDetails(!subassestsDetails);
  };
  // bootstrap collaps
  // bootstrap modal
  const [materialshowModal, setmaterialShowModal] = useState(false);
  const [assetShowModal, setAssetShowModal] = useState(false);
  const [labourShowModal, setLabourShowModal] = useState(false);

  const openModal = () => setmaterialShowModal(true);
  const closeModal = () => setmaterialShowModal(false);

  const openAssestModal = () => setAssetShowModal(true);
  const closeAssestModal = () => setAssetShowModal(false);

  const openLabourModal = () => setLabourShowModal(true);
  const closeLabourModal = () => setLabourShowModal(false);
  // bootstrap modal
  //
  const toggleRow = (rowIndex) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };
  //
   // Function to add a new row to Table 1
   const addRowToTable1 = () => {
    const newRow = { id: count.length + 1, value: '' };
    setcount([...count, newRow]);
    setcounter(counter + 1 )
  };

  // Function to add a new row to Table 2
  const addRowToTable2 = () => {
    const newRow = { id: table2Rows.length + 1, value: '' };
    setTable2Rows([...table2Rows, newRow]);
  };

  // Function to handle row value change for Table 1
  const handleChangeTable1 = (id, newValue) => {
    const updatedRows = table1Rows.map((row) =>
      row.id === id ? { ...row, value: newValue } : row
    );
    setTable1Rows(updatedRows);
  };

  // Function to handle row value change for Table 2
  const handleChangeTable2 = (id, newValue) => {
    const updatedRows = table2Rows.map((row) =>
      row.id === id ? { ...row, value: newValue } : row
    );
    setTable2Rows(updatedRows);
  };

  // Function to delete a row from Table 1
  const deleteRowFromTable1 = (id) => {
    // const newValue = count.pop()
    // console.log("aa", newValue)
    // setcount(newValue)
    // setTable1Rows(table1Rows.filter((row) => row.id !== id));
    setcount(count.filter((row) => row.id !== id))
    setcounter(counter-1);
    };

  // Function to delete a row from Table 2
  const deleteRowFromTable2 = (id) => {
    setTable2Rows(table2Rows.filter((row) => row.id !== id));
  };
  

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-4">
            <a href="">Setup &gt; Engineering Setup &gt; Create BOQ</a>
            <h5 className="mt-4">Create BOQ</h5>
            <div className="tab-content1 active" id="total-content">
              {/* Total Content Here */}
              <div className="card mt-5 pb-4">
                <div className="card mx-3 mt-3">
                  <div className="card-header3">
                    <h3 className="card-title">Create BOQ</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={createboqDropdown}
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
                  {createboqDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Project</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Sub-project</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Wing</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                      <div className="row">
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Level 1</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Level 2</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Level 3</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Level 4</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                            <label>Level 5</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
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
                      <div className="row">
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>Item Name</label>
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
                            <label>Description</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Enter ..."
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>UOM</label>
                            <select
                              className="form-control form-select"
                              style={{ width: "100%" }}
                            >
                              <option selected="selected">Select</option>
                              <option>Lobour</option>
                              <option>Material</option>
                              <option>Assest</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 mt-2">
                          <div className="form-group">
                            <label>BOQ Quantity</label>
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
                            <label>BOQ Rate</label>
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
                            <label>BOQ Amount</label>
                            <input
                              className="form-control"
                              type="number"
                              placeholder=""
                              fdprocessedid="qv9ju9"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mt-2">
                          <div className="form-group">
                            <label>Note</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Enter ..."
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card mx-3 mt-2">
                  <div className="card-header3">
                    <h3 className="card-title">Material</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={materialDropdown}
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
                  {materialDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th rowSpan={2}>
                                <div className="d-flex justify-content-center">
                                  <input className="" type="checkbox" />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={14}
                                    height={14}
                                    fill="currentColor"
                                    className="bi bi-trash3-fill ms-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </div>
                              </th>
                              <th rowSpan={2}>Material Type</th>
                              <th rowSpan={2}>Material Sub-Type</th>
                              <th rowSpan={2}>Material </th>
                              <th rowSpan={2}>Generic Specification</th>
                              <th rowSpan={2}>Colour</th>
                              <th rowSpan={2}>Brand</th>
                              <th rowSpan={2}>UOM</th>
                              <th colSpan={2}>Cost</th>
                              <th rowSpan={2}>Wastage</th>
                              <th rowSpan={2}>
                                Total Estimated Quantity Wastage
                              </th>
                            </tr>
                            <tr>
                              <th rowSpan={1}>Co-efficient Factor</th>
                              <th rowSpan={1}>Estimated Qty</th>
                            </tr>
                            <tr>
                              <th />
                              <th>A</th>
                              <th>B</th>
                              <th>C</th>
                              <th>D</th>
                              <th>E</th>
                              <th>F</th>
                              <th>G</th>
                              <th>H</th>
                              <th>I</th>
                              <th>J</th>
                              <th>K</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                              <td />
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <p
                          className="pe-auto"
                          style={{ cursor: "pointer" }}
                          onClick={openModal}
                        >
                          Add Material
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
                        onClick={labourDropdown}
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
                  {labourDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th rowSpan={2}>
                                <div className="d-flex justify-content-center">
                                  <input className="" type="checkbox" />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={14}
                                    height={14}
                                    fill="currentColor"
                                    className="bi bi-trash3-fill ms-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </div>
                              </th>
                              <th rowSpan={2}>Material Type</th>
                              <th rowSpan={2}>Material Sub-Type</th>
                              <th rowSpan={2}>Material </th>
                              <th rowSpan={2}>UOM</th>
                              <th colSpan={2}>Cost</th>
                            </tr>
                            <tr>
                              <th>Co-efficient Factor</th>
                              <th rowSpan={2}>Estimated Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <p
                          className="pe-auto"
                          style={{ cursor: "pointer" }}
                          onClick={openLabourModal}
                        >
                          Add Labour
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card mx-3 mt-2">
                  <div className="card-header3">
                    <h3 className="card-title">Assests</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={assestsDropdown}
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
                  {assestsDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                          <thead >
                            <tr>
                              <th rowSpan={2}>
                                <div className="d-flex justify-content-center">
                                  <input className="" type="checkbox" />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={14}
                                    height={14}
                                    fill="currentColor"
                                    className="bi bi-trash3-fill ms-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </div>
                              </th>
                              <th rowSpan={2}>Material Type</th>
                              <th rowSpan={2}>Material Sub-Type</th>
                              <th rowSpan={2}>Material </th>
                              <th rowSpan={2}>UOM</th>
                              <th colSpan={2}>Cost</th>
                            </tr>
                            <tr>
                              <th>Co-efficient Factor</th>
                              <th rowSpan={2}>Estimated Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder=""
                                  fdprocessedid="qv9ju9"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <p
                          className="pe-auto"
                          style={{ cursor: "pointer" }}
                          onClick={openAssestModal}
                        >
                          Add Asset
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card mx-3 mt-2">
                  <div className="card-header3">
                    <h3 className="card-title">BOQ Sub-Item</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        onClick={boqsubitemDropdown}
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
                  {boqsubitemDetails && (
                    <div className="card-body mt-0 pt-0">
                      <div className="mt-3">
                        <div className="tbl-container mx-3 mt-1">
                          <table className="table table-bordered">
                            <thead  style={{ zIndex: "1" }}>
                              <tr>
                                <th rowSpan={2}>
                                  <input type="checkbox" />
                                </th>
                                <th rowSpan={2}>Expand</th>
                                <th rowSpan={2}>Sub Item Name</th>
                                <th rowSpan={2}>Description</th>
                                <th rowSpan={2}>Notes</th>
                                <th rowSpan={2}>Remarks</th>
                                <th rowSpan={2}>UOM</th>
                                <th colSpan={3}>Cost</th>
                                <th rowSpan={2}>Document</th>
                              </tr>
                              <tr>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {count.map((el)=>
                               (
                                <>
                                 <tr>
                                <td>
                                  <input type="checkbox" />
                                </td>

                                <td className="text-center">
                                  <button
                                    className="btn btn-link p-0"
                                    onClick={() => toggleRow(el.id)}
                                    aria-label="Toggle row visibility"
                                  >
                                    {expandedRows.includes(el.id) ? (
                                      // Show minus SVG if row is expanded
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-dash-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                      </svg>
                                    ) : (
                                      // Show plus SVG if row is collapsed
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-plus-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                      </svg>
                                    )}
                                  </button>
                                </td>

                                <td>MS Fabrication</td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="MS Fabrication_20010"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="MS Fabrication_20010"
                                  />
                                </td>
                                <td>
                                  <input type="text" defaultValue="" />
                                </td>
                                <td>KG</td>
                                <td>
                                  <input type="number" defaultValue={621.0} />
                                </td>
                                <td>
                                  <input type="number" defaultValue={130.0} />
                                </td>
                                <td>
                                  <input type="number" defaultValue={80730.0} />
                                </td>
                                <td>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-file-earmark-text"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                  </svg>
                                </td>
                              </tr>
                              {expandedRows.includes(el.id) && (
                                <tr>
                                  <td colSpan={11}>
                                    <BOQSubItemTable />
                                  </td>
                                </tr>
                              )}
                                </>
                              )
                              )}
                             
                              {/* <tr>
                                <td>
                                  <input type="checkbox" />
                                </td>

                                <td className="text-center">
                                  <button
                                    className="btn btn-link p-0"
                                    onClick={() => toggleRow(1)}
                                    aria-label="Toggle row visibility"
                                  >
                                    {expandedRows.includes(1) ? (
                                      // Show minus SVG if row is expanded
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-dash-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                      </svg>
                                    ) : (
                                      // Show plus SVG if row is collapsed
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-plus-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                      </svg>
                                    )}
                                  </button>
                                </td>

                                <td>Steel Welding</td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="Steel Welding_20020"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="Steel Welding_20020"
                                  />
                                </td>
                                <td>
                                  <input type="text" defaultValue="Important" />
                                </td>
                                <td>KG</td>
                                <td>
                                  <input type="number" defaultValue={300.0} />
                                </td>
                                <td>
                                  <input type="number" defaultValue={150.0} />
                                </td>
                                <td>
                                  <input type="number" defaultValue={45000.0} />
                                </td>
                                <td>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-file-earmark-text"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                  </svg>
                                </td>
                              </tr>
                              {expandedRows.includes(1) && (
                                <tr>
                                  <td colSpan={11}>
                                    <BOQSubItemTable />
                                  </td>
                                </tr>
                              )} */}  
                            </tbody>
                          </table>
                        </div>
                        <div className="row mt-3 mx-3">
                          <p>
                            <button
                              style={{ color: "var(--red)" }}
                              className="fw-bold text-decoration-underline border-0 bg-white"
                              onClick={addRowToTable1}
                            >
                              Add Row
                            </button>{" "}
                            |
                            <button
                              style={{ color: "var(--red)" }}
                              className="fw-bold text-decoration-underline border-0 bg-white"
                              onClick={() => deleteRowFromTable1(counter)}
                            >
                              Delete Row
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                    Create
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100" fdprocessedid="u33pye">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>   
      </div>

      {/* Modal start */}
      {/* material modal */}
      <Modal
        centered
        size="lg"
        show={materialshowModal}
        onHide={closeModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Material</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div className="">
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  fdprocessedid="cda5b"
                >
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div>
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead >
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Material Type</th>
                  <th>Material Sub-Type</th>
                  <th>Material</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>KGS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>AGGREGATE</td>
                  <td>KAPCHI</td>
                  <td>KAPCHI</td>
                  <td>cft</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* material modal */}

      {/* Assest modal */}
      <Modal
        centered
        size="lg"
        show={assetShowModal}
        onHide={closeAssestModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Asset</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Pagination and Display options */}
          <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div>

          {/* Table for Assets */}
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Asset Type</th>
                  <th>Asset Sub-Type</th>
                  <th>Asset</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>NOS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>21'' IMAC Desktop 4K</td>
                  <td>21'' IMAC Desktop 4K Retina Display</td>
                  <td>21" IMAC Desktop 4K Retina Display</td>
                  <td>NOS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add Button */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeAssestModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Assest modal */}

      {/* Labour modal */}
      <Modal
        centered
        size="lg"
        show={labourShowModal}
        onHide={closeLabourModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Labour</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Pagination and Display options */}
          <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div>

          {/* Table for Labour */}
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Labour Category</th>
                  <th>Material Sub-Category</th>
                  <th>Labour Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add Button */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeLabourModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Labour modal */}

      {/* Modal end */}
    </>
  );
};

export default CreateBOQ;
