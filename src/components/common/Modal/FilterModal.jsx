import React from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const FilterModal = ({ show, handleClose }) => {
  return (
    <>
      <style type="text/css">
        {`
    .setting-modal .modal-dialog {
      position: fixed;
      right: 0;
      top: 0;
      margin: 0;
      height: 100%;
      width: 40%; /* Adjust the width to your liking */
    }

    .setting-modal .modal-content {
      height: 100%;
      border: 0;
      border-radius: 0;
    }

    .modal-header {
      border-bottom: none;
    }

    .modal-footer {
      border-top: none;
    }

    .modal-body {
      overflow-y: auto;
      padding: 20px; /* Adjust padding as needed */
    }
  `}
      </style>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-right"
        className="setting-modal"
        backdrop={true}
      >
        <Modal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button type="button" className="btn" aria-label="Close">
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <Link
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                to="#"
              >
                Reset
              </Link>
            </div>
          </div>
        </Modal.Header>
        <div className="modal-body" style={{ overflowY: "scroll" }}>
          <div className="row">
            <div className="row mt-2 px-2">
              <div className="col-md-12 card mx-3">
                <div className="card-header2">
                  <h3 className="card-title2">
                    <div className="form-group form-control">
                      Applied Filter
                    </div>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <label className="px-1" htmlFor="company">
                          Company
                        </label>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <label className="px-1" htmlFor="project">
                          Project
                        </label>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-center justify-content-around tbl-search">
                        <p className="px-1">Sub-project</p>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label
                  htmlFor="mor-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  MOR Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mor-date-from">From</label>
                      <input
                        id="mor-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mor-date-to">To</label>
                      <input
                        id="mor-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="approval-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Approval Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="approval-date-from">From</label>
                      <input
                        id="approval-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="approval-date-to">To</label>
                      <input
                        id="approval-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="due-date"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Due Date
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="due-date-from">From</label>
                      <input
                        id="due-date-from"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="due-date-to">To</label>
                      <input
                        id="due-date-to"
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <div className="form-group">
                <label
                  htmlFor="created-on"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  Created On
                </label>
                <input id="created-on" className="form-control" type="date" />
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material-type">Material Type</label>
                  <select
                    id="material-type"
                    className="form-control form-select"
                  >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material-sub-type">Material Sub Type</label>
                  <select
                    id="material-sub-type"
                    className="form-control form-select"
                  >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="material">Material</label>
                  <select id="material" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="activity">Activity</label>
                  <select id="activity" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="mor-no">MOR No.</label>
                  <select id="mor-no" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="overdue">Overdue</label>
                  <select id="overdue" className="form-control form-select">
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Delaware">Delaware</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleClose}
          >
            Go
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FilterModal;
