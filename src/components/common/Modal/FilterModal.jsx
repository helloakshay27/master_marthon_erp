import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import MultiSelector from "../../base/Select/MultiSelector";
import { mumbaiLocations, options, product, productCategories } from "../../../constant/data";

const FilterModal = ({ show, handleClose }) => {
  const [productVal, setProductVal] = useState([]);
  const [productCatVal, setProductCatVal] = useState([]);
  const [locationVal, setLocationVal] = useState([]);
  const [userVal, setUserVal] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [isMyEvent, setIsMyEvent] = useState(false);

  const handleProductVal = (selected) => setProductVal(selected);
  const handleProductCatVal = (selected) => setProductCatVal(selected);
  const handleLocationVal = (selected) => setLocationVal(selected);
  const handleUserVal = (selected) => setUserVal(selected);

  // Reset Function
  const handleReset = () => {
    setProductVal([]);
    setProductCatVal([]);
    setLocationVal([]);
    setUserVal([]);
    setEventTitle("");
    setIsMyEvent(false);
  };

  return (
    <>
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
                <button
                  type="button"
                  className="btn"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#de7008"
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
                onClick={handleReset} // Attach the reset function
              >
                Reset
              </Link>
            </div>
          </div>
        </Modal.Header>
        <div className="modal-body" style={{ overflowY: "scroll" }}>
          <div className="form-group mb-4">
            <div className="form-group">
              <label htmlFor="mor-date-from">Enter Title </label>
              <input
                id="mor-date-from"
                className="form-control"
                type="text"
                placeholder="Enter Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <div className="form-group">
              <label htmlFor="mor-date-from">Product</label>
              <MultiSelector
                options={product}
                value={productVal}
                onChange={handleProductVal}
                placeholder={"Enter Product"}
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <div className="form-group">
              <label htmlFor="mor-date-from">Product Category</label>
              <MultiSelector
                options={productCategories}
                value={productCatVal}
                onChange={handleProductCatVal}
                placeholder={"Enter Product Category"}
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <div className="form-group">
              <label htmlFor="mor-date-from">Location</label>
              <MultiSelector
                options={mumbaiLocations}
                value={locationVal}
                onChange={handleLocationVal}
                placeholder={"Enter Location"}
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <div className="form-group">
              <label htmlFor="mor-date-from">Created By</label>
              <MultiSelector
                options={options}
                value={userVal}
                onChange={handleUserVal}
                placeholder={"Enter User Name"}
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <div className="form-group d-flex align-items-start">
              <label htmlFor="mor-date-from">My Event</label>
              <div className="form-check form-switch ms-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={isMyEvent}
                  onChange={(e) => setIsMyEvent(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button className="purple-btn2" onClick={handleClose}>
            Go
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FilterModal;
