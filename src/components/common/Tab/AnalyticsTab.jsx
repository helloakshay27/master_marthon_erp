import React from "react";
import ScatterChart from "../Chart/ScatterChart";

export default function AnalyticsTab() {
  return (
    <div
      className="tab-pane fade analytics"
      id="analytics"
      role="tabpanel"
      aria-labelledby="analytics-tab"
      tabIndex={0}
    >
      <div className="details d-flex align-items-center my-4">
        <label htmlFor="details" className="me-2">
          Show the details according to
        </label>
        <select id="details" className="form-select me-3">
          <option value="productPrice">Product Price</option>
        </select>
        <span className="me-2">for</span>
        <select id="product" className="form-select">
          <option value="woodenDoorFrame">Wooden Door Frame (...</option>
        </select>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <div className="quote d-flex justify-content-between w-50">
          <div>
            <label className="d-block">Initial Quote</label>
            <p>₹10,800 / Nos</p>
          </div>
          <div>
            <label className="d-block">Final Best Price</label>
            <p>₹10,800 / Nos</p>
          </div>
          <div>
            <label className="d-block">Realized Savings</label>
            <p>₹0 - 0%</p>
          </div>
        </div>

        <div className="time ms-4 w-50">
          <div>
            <label className="d-block">Start Time</label>
            <p>06:10 PM Apr 01, 24</p>
          </div>
          <div>
            <label className="d-block">End Time</label>
            <p>03:35 PM Apr 06, 24</p>
          </div>
        </div>
      </div>

      <div id="container">
        <ScatterChart />
      </div>
    </div>
  );
}
