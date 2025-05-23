import React, { useEffect, useState } from "react";
import ScatterChart from "../Chart/ScatterChart";
import axios from "axios";
import { baseURL } from "../../../confi/apiDomain";

export default function AnalyticsTab({ eventId }) {
  const [selectedFilter, setSelectedFilter] = useState("gross_total"); // Default filter value
  const [analyticsData, setAnalyticsData] = useState(null); // State to hold fetched analytics data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const [companies, setCompanies] = useState([]); // To store company names and IDs
  const [selectedMaterialId, setSelectedMaterialId] = useState(null); // To store selected company ID

  // Handle filter dropdown change
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Fetch analytics data whenever the `id` or `selectedFilter` changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state before fetching

      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_analytics?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&filter_type=${selectedFilter}&event_material_id=${selectedMaterialId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalyticsData(data); // Set the fetched data for the chart
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // if (selectedFilter && selectedMaterialId) {
    fetchAnalytics(); // Fetch data only if filter is selected
    // }
  }, [selectedFilter, selectedMaterialId]); // Depend on both `id` and `selectedFilter`

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); // Set loading state to true before fetching
      setError(null); // Reset the error state before fetching

      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_materials_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&filter_type=${selectedFilter}&event_material_id=${selectedMaterialId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCompanies(data.event_materials); // Store the fetched company data in state
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchCompanies(); // Fetch the companies data on component mount
  }, [selectedFilter, selectedMaterialId]); // Empty dependency array ensures this runs once on mount

  // Handle the dropdown change event
  const handleDropdownChange = (event) => {
    setSelectedMaterialId(event.target.value); // Set selected company ID
  };

  // Utility functions for formatting
  const formatCurrency = (value) =>
    value !== undefined && value !== null
      ? `₹${Number(value).toLocaleString("en-IN")} / Nos`
      : "-";

  const formatSavings = (initial, cheapest) => {
    if (
      initial === undefined ||
      cheapest === undefined ||
      initial === null ||
      cheapest === null
    )
      return "-";
    const savings = initial - cheapest;
    const percent = initial > 0 ? ((savings / initial) * 100).toFixed(2) : "0";
    return `₹${savings.toLocaleString("en-IN")} - ${percent}%`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div
      className="tab-pane fade analytics"
      id="analytics"
      role="tabpanel"
      aria-labelledby="analytics-tab"
      tabIndex={0}
    >
      {/* Details Section */}
      <div className="details d-flex align-items-center my-4">
        <label
          htmlFor="details"
          className="me-2 fw-bold"
          style={{ textWrap: "nowrap" }}
        >
          Show the details according to:
        </label>
        <select
          id="details"
          className="form-select me-3"
          aria-label="Details filter"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="gross_total">Gross Total</option>
          <option value="product_price">Product Price</option>
          <option value="product_total">Product Total</option>
        </select>
        <span className="me-2">for</span>
        <select
          id="product"
          className="form-select"
          aria-label="Product filter"
          onChange={handleDropdownChange}
          value={selectedMaterialId || ""} // Set the selected value to the current selected company ID
        >
          {/* <option value="woodenDoorFrame">Wooden Door Frame (...</option> */}
          <option value="">Select Material</option>
          {companies.map(([companyName, companyId]) => (
            <option key={companyId} value={companyId}>
              {companyName} {/* Display company name */}
            </option>
          ))}
        </select>
      </div>

      {/* Quotes and Timing Section */}
      <div className="d-flex mb-4">
        <div className="quote d-flex gap-4">
          <div className="d-flex flex-column">
            <label className="d-block fw-semibold">Initial Quote</label>
            <p className="text-muted mb-0">
              {formatCurrency(analyticsData?.event_data?.initial_bid)}
            </p>
          </div>
          <div className="d-flex flex-column">
            <label className="d-block fw-semibold">Final Best Price</label>
            <p className="text-muted mb-0">
              {formatCurrency(analyticsData?.event_data?.cheapest_bid)}
            </p>
          </div>
          {/* <div className="d-flex flex-column">
      <label className="d-block fw-semibold">Realized Savings</label>
      <p className="text-muted mb-0">
        {formatSavings(
          analyticsData?.event_data?.initial_bid,
          analyticsData?.event_data?.cheapest_bid
        )}
      </p>
    </div> */}
        </div>

        <div className="time d-flex">
          <div>
            <label className="d-block fw-semibold">Start Time</label>
            <p className="text-muted mb-0">
              {formatDate(analyticsData?.event_data?.start_time)}
            </p>
          </div>
          <div>
            <label className="d-block fw-semibold">End Time</label>
            <p className="text-muted mb-0">
              {formatDate(analyticsData?.event_data?.end_time)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div id="container" className="mt-4 card p-4 pt-5 h-100 rounded-3">
        {/* Render the ScatterChart only if analyticsData is available */}
        {analyticsData && analyticsData.graph_data.length > 0 ? (
          <ScatterChart
            graphData={analyticsData.graph_data}
            selectedFilter={selectedFilter}
          />
        ) : (
          <p>No data available for the selected filter.</p>
        )}
      </div>
    </div>
  );
}
