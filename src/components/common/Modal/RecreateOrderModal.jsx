import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const RecreateOrderModal = ({ show, handleClose }) => {
  const durations = [
    "15 Mins",
    "30 Mins",
    "60 Mins",
    "4 Hrs",
    "24 Hrs",
    "Custom",
  ];
  const evaluationDurations = ["15 Mins", "30 Mins", "60 Mins", "Custom"];

  const renderDurationOptions = (name, options) => {
    return options.map((duration, index) => (
      <div className="col-md-2" key={index}>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={name}
              value={duration}
              defaultChecked={index === 0}
            />
            <label className="form-check-label">{duration}</label>
          </div>
        </div>
      </div>
    ));
  };

  const renderTableRows = () => {
    return [...Array(5)].map((_, index) => (
      <tr key={index}>
        <th scope="row">
          Wooden Frd Door{" "}
          <span style={{ color: "var(--red)", cursor: "pointer" }}>
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
    ));
  };

  return (
    <>
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        size="xl"
        title="Recreate Order"
        footerButtons={[
          {
            label: "Save",
            onClick: handleClose,
            props: { className: "purple-btn2" },
          },
        ]}
      >
        <div className="row mt-3">
          <div className="col-md-2">
            <div className="form-group">
              <label className="form-group">Order Type</label>
              <p style={{ fontWeight: 600 }}>Buy</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label className="form-group">ORDER MODE</label>
              <p style={{ fontWeight: 600 }}>RFQ</p>
            </div>
          </div>
        </div>

        <h5 className="mt-5">Product Sheet</h5>
        <div className="tbl-container">
          <table>
            <thead className="thead-dark">
              <tr>
                <th>Product*</th>
                <th>Best Total Amount</th>
                <th>Product Variant*</th>
                <th>Quantity Requested*</th>
                <th>Delivery location*</th>
                <th>Creator Attachment</th>
                <th>ADDITIONAL INFO</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>

        <h5 className="mt-5">Auction Configurations</h5>

        <div className="row justify-content-between align-items-center mt-3">
          <p>Event End Time Duration</p>
          {renderDurationOptions("eventDuration", durations)}
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
          {renderDurationOptions("evaluationDuration", evaluationDurations)}
        </div>

        <div className="row mt-3 align-items-end pb-3">
          <div className="col-md-3">
            <label htmlFor="">Delivery Date</label>
            <input className="form-control" type="date" />
          </div>
          <div className="col-md-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Schedule this event?</label>
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
      </DynamicModalBox>
    </>
  );
};

export default RecreateOrderModal;
