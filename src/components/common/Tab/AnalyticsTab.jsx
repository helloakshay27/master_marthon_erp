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
      <div className="container">
        <div className="details">
          <label htmlFor="details">Show the details according to</label>
          <select id="details">
            <option value="productPrice">Product Price</option>
          </select>
          <span>for</span>
          <select id="product">
            <option value="woodenDoorFrame">Wooden Door Frame (...</option>
          </select>
        </div>
        <div className="d-flex ">
          <div className="quote">
            <div>
              <label>Initial Quote</label>
              <p>₹10,800 / Nos</p>
            </div>
            <div className="ms-3">
              <label>Final Best Price</label>
              <p>₹10,800 / Nos</p>
            </div>
            <div className="ms-3">
              <label>Realized Savings</label>
              <p>₹0 - 0%</p>
            </div>
          </div>
          <div className="time ms-5">
            <div>
              <label>Start Time</label>
              <p>06:10 PM Apr 01, 24</p>
            </div>
            <div className="ms-3">
              <label>End Time</label>
              <p>03:35 PM Apr 06, 24</p>
            </div>
          </div>
        </div>
        <div id="container">
          <ScatterChart />
        </div>
      </div>
    </div>
  );
}
