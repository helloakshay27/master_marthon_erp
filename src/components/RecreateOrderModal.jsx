import React from "react";
import { Modal } from "react-bootstrap";

const RecreateOrderModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal
        centered
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="true"
        keyboard={true}
      >
        <Modal.Header>
          <h4
            className="modal-title text-center w-100"
            id="exampleModalLabel"
            style={{ fontWeight: 500 }}
          >
            Recreate Order
          </h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body>
        <div className="row mt-3">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-group" htmlFor="">
                      Order Type
                    </label>
                    <p style={{ fontWeight: 600 }}>Buy</p>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-group" htmlFor="">
                      ORDER MODE
                    </label>
                    <p style={{ fontWeight: 600 }}>RFQ</p>
                  </div>
                </div>
              </div>

              <h5 className="mt-5">Product Sheet</h5>
              <div className="tbl-container">
                <table className="">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Product*</th>
                      <th scope="col">Best Total Amount</th>
                      <th scope="col">Product Variant*</th>
                      <th scope="col">Quantity Requested*</th>
                      <th scope="col">Delivery location*</th>
                      <th scope="col">Creator Attachment</th>
                      <th scope="col">ADDITIONAL INFO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <th scope="row">
                          Wooden Frd Door{" "}
                          <span
                            style={{ color: "var(--red)", cursor: "pointer" }}
                          >
                            {" "}
                            Details
                          </span>
                        </th>
                        <td></td>
                        <td>WOODEN DOOR SHUTTER 2 HRS...</td>
                        <td>257 Nos</td>
                        <td>Sanvo Resorts Pvt. Ltd.</td>
                        <td></td>
                        <td>Main door Outer size of ...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h5 className="mt-5">Auction Configurations</h5>

              <div className="row justify-content-between align-items-center mt-3">
                <p>Event End Time Duration</p>
                {[
                  "15 Mins",
                  "30 Mins",
                  "60 Mins",
                  "4 Hrs",
                  "24 Hrs",
                  "Custom",
                ].map((duration, index) => (
                  <div className="col-md-2" key={index}>
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="eventDuration"
                          value={duration}
                          defaultChecked={index === 0}
                        />
                        <label className="form-check-label">{duration}</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <p>Enter event Duration</p>
                  <div className="d-flex" style={{ width: "100%" }}>
                    <input
                      style={{ width: "70%" }}
                      className="form-control"
                      placeholder="4.91"
                      type="text"
                    />
                    <select style={{ width: "30%" }} className="form-control">
                      <option value=""></option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row align-items-center mt-2">
                <p>Evaluation Duration</p>
                {["15 Mins", "30 Mins", "60 Mins", "Custom"].map(
                  (duration, index) => (
                    <div className="col-md-2" key={index}>
                      <div className="form-group">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="evaluationDuration"
                            value={duration}
                            defaultChecked={index === 0}
                          />
                          <label className="form-check-label">{duration}</label>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="row mt-3 align-items-end pb-3">
                <div className="col-md-3">
                  <label htmlFor="">Delivery Date</label>
                  <input className="form-control" type="date" />
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">
                      Schedule this event?
                    </label>
                  </div>
                  <input className="form-control" type="date" />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    placeholder="select time"
                    type="text"
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-center">
              <button className="purple-btn2" onClick={handleClose}>
                Save
              </button>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RecreateOrderModal;
