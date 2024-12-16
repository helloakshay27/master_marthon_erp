import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import BOQListTable from "../components/BOQListTabe";



const BOQList = () => {
  const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [copyModal, setcopyModal] = useState(false);

  const openCopyModal = () => setcopyModal(true);
  const closeCopyModal = () => setcopyModal(false);



  const [expandedRows, setExpandedRows] = useState([]);


  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const [openSubProject2, setOpenSubProject2] = useState(false)
  const handleSubProject2 = () => {
    setOpenSubProject2(!openSubProject2)
  }
  const [openSubProject2_1, setOpenSubProject2_1] = useState(false)
  const handleSubProject2_1 = () => {
    setOpenSubProject2_1(!openSubProject2_1)
  }

  const [openSubProject2_11, setOpenSubProject2_11] = useState(false)
  const handleSubProject2_11 = () => {
    setOpenSubProject2_11(!openSubProject2_11)
  }

  const [openSubProject2_12, setOpenSubProject2_12] = useState(false)
  const handleSubProject2_12 = () => {
    setOpenSubProject2_12(!openSubProject2_12)
  }

  const [openSubProject2_13, setOpenSubProject2_13] = useState(false)
  const handleSubProject2_13 = () => {
    setOpenSubProject2_13(!openSubProject2_13)
  }

  const [openSubProjectDetails, setOpenSubProjectDetails] = useState(false)
  const handleSubProjectDetails = () => {
    setOpenSubProjectDetails(!openSubProjectDetails)
  }


  const [openSubProject3, setOpenSubProject3] = useState(false)
  const handleSubProject3 = () => {
    setOpenSubProject3(!openSubProject3)
  }

  const [openSubProject, setOpenSubProject] = useState(false)
  const handleSubProject = () => {
    setOpenSubProject(!openSubProject)
  }

  const tableData = [
    {
      id: 1,
      project: "Sanvo",
      boqId: "",
      unit: "",
      costQty: "",
      costRate: "",
      costValue: "",
      status: "",
      subRows: [
        {
          id: 11,
          description: "Admin expense",
          boqId: "",
          unit: "",
          costQty: "",
          costRate: "",
          costValue: "",
          status: "",
        },
        {
          id: 12,
          description: "Purchase of Item",
          boqId: "187062",
          unit: "",
          costQty: "",
          costRate: "",
          costValue: "",
          status: "Approved",
        },
      ],
    },
  ];

  const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
  ];


  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Setup &gt; Engineering Setup &gt; BOQ</a>
          <h5 className="mt-4">View BOQ</h5>
          <div className="d-flex justify-content-end">
            <button className="purple-btn2">Create</button>
            <button className="purple-btn2">Export/Import</button>
            <button className="purple-btn2">Delete</button>
            <button
              className="purple-btn2"
              // data-bs-toggle="modal"
              // data-bs-target="#copyModal"
              // onClick={openCopyModal}
              onClick={handleShow}
            >
              Copy
            </button>
          </div>
          {/* <div className="tab-content1 active" id="total-content"> */}
          {/* Total Content Here */}


          <div className="card mt-2 pb-4">
            <CollapsibleCard title="View BOQ">


              <div className="card-body mt-0 pt-0">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project</label>
                      {/* <select
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
                            </select> */}
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Sub-project</label>

                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Wing</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Wing`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Main Category</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Main Category`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 2</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 2`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 3</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 3`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 4</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 4`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 5</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 5`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ Name</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select BOQ Name`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ ID</label>
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
                      <label>BOQ Description</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Status`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>From Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>To Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="d-flex">
                      <div className="form-group d-flex mt-1">
                        <label className="form-check-label me-3">
                          View BOQ Version List
                        </label>
                        <div className="form-check pe-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select BOQ Version`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </CollapsibleCard>
            <BOQListTable/>
          </div>

          <CopyBudgetModal show={show} handleClose={handleClose} />
        </div>
      </div>

      {/* copy modal */}
      {/* <Modal
        size="m"
        show={copyModal}
        onHide={closeCopyModal}
        centered
        className="modal fade"
      >
        <Modal.Header closeButton>
          <h5>Copy</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>From</label>
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
            <div className="col-md-6">
              <div className="form-group">
                <label>To</label>
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

          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={closeCopyModal}
                fdprocessedid="u33pye"
              >
                Copy
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* copy modal end */}
    </>
  );
};

export default BOQList;
