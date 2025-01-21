import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate(); // initialize useNavigate hook

  const handleLiveEventsClick = () => {
    navigate("/event-list?tab=live"); // Navigate to the Events page and pass a query parameter for live events
  };

  const handleAllEventsClick = () => {
    navigate("/event-list?tab=all"); // Navigate to the Events page and pass a query parameter for live events
  };

  return (
    <>
      <style>
        {`
          .dashboard-container {
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .metrics {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .card {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
            width: 150px;
            text-align: center;
          }

          .card.blue {
            background-color: #e6f7ff;
            color: #d3991a;
            position: relative;
          }

          .status-dot {
            width: 8px;
            height: 8px;
            background-color: green;
            border-radius: 50%;
            position: absolute;
            top: 10px;
            left: 10px;
          }

          .title {
            font-size: 14px;
            color: #777;
            margin-bottom: 5px;
          }

          h2 {
            margin: 0;
          }

          .content {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .procurement,
          .spend-analysis {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            width: 48%;
            padding: 15px;
          }

          .tabs {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
          }

          .tabs span {
            cursor: pointer;
            font-size: 14px;
            color: #aaa;
          }

          .tabs .active {
            color: #d09c17;
            font-weight: bold;
          }

          .chart-placeholder {
            height: 150px;
            background-color: #fafafa;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px dashed #ddd;
            border-radius: 8px;
          }

          .chart-placeholder .dot {
            width: 10px;
            height: 10px;
            background-color: green;
            border-radius: 50%;
          }

          .no-data {
            text-align: center;
            color: #aaa;
          }

          .no-data img {
            margin-bottom: 10px;
          }
        `}
      </style>

      <Header />
      <div className="main-content">
        <Sidebar />

        <div className="dashboard-container">
          {/* Top Header Metrics */}
          <div className="metrics">
            <div className="card blue" onClick={handleLiveEventsClick}>
              <p>Live Events</p>
              <h2>4</h2>
              <div className="status-dot"></div>
            </div>
            <div className="card" onClick={handleAllEventsClick}>
              <p className="title">Total Events</p>
              <h2>13</h2>
            </div>
            <div className="card">
              <p className="title">Event Closed</p>
              <h2>0</h2>
            </div>
            <div className="card">
              <p className="title">Bids Received</p>
              <h2>31</h2>
            </div>
            <div className="card">
              <p className="title">Purchase Value</p>
              <h2>₹0.00 Cr</h2>
            </div>
            <div className="card">
              <p className="title">New Vendors</p>
              <h2>5</h2>
            </div>
            <div className="card">
              <p className="title">Engaged Vendors</p>
              <h2>18</h2>
            </div>
          </div>

          {/* Procurement and Spend Analysis */}
          <div className="content">
            <div className="procurement">
              <h3>Procurement</h3>
              <div className="tabs">
                <span className="active">VALUE</span>
                <span>QUANTITY</span>
                <span>COUNT</span>
              </div>
              <div className="chart-placeholder">
                <div className="dot"></div>
              </div>
            </div>

            <div className="spend-analysis">
              <h3>Spend Analysis</h3>
              <div className="no-data">
                <img src="https://via.placeholder.com/50" alt="No Data" />
                <p>No Data Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
